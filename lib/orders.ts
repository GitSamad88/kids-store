import { randomUUID } from "node:crypto";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CheckoutInput, CheckoutInputSchema } from "@/lib/validations";
import { computeCartTotals } from "@/lib/cart";

export async function createOrder(sessionId: string, rawInput: unknown) {
  const parseResult = CheckoutInputSchema.safeParse(rawInput);
  if (!parseResult.success) {
    throw new Error(parseResult.error.issues.map((issue) => issue.message).join(", "));
  }

  const input: CheckoutInput = parseResult.data;
  const user = await getCurrentUser();

  // UUID entropy avoids the small, fixed order-number space of the old four-digit suffix.
  const orderNumber = `KM-${new Date().getFullYear()}-${randomUUID().toUpperCase()}`;

  // Execute inside a transaction to ensure atomicity and stock decrement
  const order = await prisma.$transaction(async (tx) => {
    const cart = await tx.cart.findUnique({
      where: { sessionId },
      include: {
        items: {
          include: { variant: { include: { product: true } } },
        },
      },
    });

    if (!cart || cart.items.length === 0) {
      throw new Error("Votre panier est vide");
    }

    // Claim the exact cart snapshot before consuming stock. Concurrent checkout
    // requests can only claim these rows once; failures roll the deletion back.
    const claimedItems = await tx.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        OR: cart.items.map(({ id, quantity, updatedAt }) => ({ id, quantity, updatedAt })),
      },
    });
    if (claimedItems.count !== cart.items.length) {
      throw new Error("Votre panier a changé. Veuillez réessayer.");
    }

    const { shippingCost, total } = computeCartTotals(cart);

    // 1. Verify stock & deduct
    for (const item of cart.items) {
      const stockUpdate = await tx.productVariant.updateMany({
        where: {
          id: item.variantId,
          stock: { gte: item.quantity },
        },
        data: { stock: { decrement: item.quantity } },
      });

      if (stockUpdate.count !== 1) {
        throw new Error(`Stock insuffisant pour le produit: ${item.variant.nameFr}`);
      }

      const inventory = await tx.inventory.findUnique({
        where: { productId: item.variant.productId },
        select: { productId: true },
      });
      if (inventory) {
        const inventoryUpdate = await tx.inventory.updateMany({
          where: {
            productId: item.variant.productId,
            stock: { gte: item.quantity },
          },
          data: { stock: { decrement: item.quantity } },
        });
        if (inventoryUpdate.count !== 1) {
          throw new Error(`Stock insuffisant pour le produit: ${item.variant.nameFr}`);
        }
      }
    }

    // 2. Create Order
    const newOrder = await tx.order.create({
      data: {
        orderNumber,
        ...(user ? { userId: user.id } : {}),
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerEmail: input.customerEmail || null,
        shippingAddress: input.shippingAddress,
        city: input.city,
        totalAmount: total,
        shippingCost: shippingCost,
        paymentMethod: input.paymentMethod,
        paymentStatus: "PENDING",
        status: "PENDING",
        items: {
          create: cart.items.map((item) => ({
            productId: item.variant.productId,
            variantId: item.variantId,
            quantity: item.quantity,
            unitPrice: Number(item.variant.price ?? item.variant.product.price),
          })),
        },
      },
      include: { items: true },
    });

    return newOrder;
  });

  return order;
}
