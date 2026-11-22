import { prisma } from "./prisma";

export async function getOrCreateCart(sessionId: string) {
  return prisma.cart.upsert({
    where: { sessionId },
    create: { sessionId },
    update: {},
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: { images: true },
              },
            },
          },
        },
      },
    },
  });
}

export async function addToCart(sessionId: string, variantId: string, quantity: number) {
  const cart = await getOrCreateCart(sessionId);

  const variant = await prisma.productVariant.findUnique({
    where: { id: variantId },
  });

  if (!variant || variant.stock < quantity) {
    throw new Error("Stock insuffisant pour ce produit");
  }

  const existingItem = cart.items.find((item) => item.variantId === variantId);

  if (existingItem) {
    const newQuantity = existingItem.quantity + quantity;
    if (variant.stock < newQuantity) {
      throw new Error("Stock insuffisant pour la quantité demandée");
    }

    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: cart.id,
        variantId,
        quantity,
      },
    });
  }

  return getOrCreateCart(sessionId);
}

export async function updateCartItemQuantity(sessionId: string, itemId: string, quantity: number) {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { variant: true, cart: true },
  });

  if (!item || item.cart.sessionId !== sessionId) {
    throw new Error("Article introuvable dans le panier");
  }

  if (quantity <= 0) {
    await prisma.cartItem.delete({ where: { id: itemId } });
  } else {
    if (item.variant.stock < quantity) {
      throw new Error("Stock insuffisant");
    }
    await prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  return getOrCreateCart(sessionId);
}

export async function removeCartItem(sessionId: string, itemId: string) {
  const item = await prisma.cartItem.findUnique({
    where: { id: itemId },
    include: { cart: true },
  });

  if (!item || item.cart.sessionId !== sessionId) {
    throw new Error("Article introuvable dans le panier");
  }

  await prisma.cartItem.delete({ where: { id: itemId } });
  return getOrCreateCart(sessionId);
}

type PriceValue = number | { toNumber(): number };

export function computeCartTotals(cart: {
  items: Array<{ quantity: number; variant: { price: PriceValue | null; product: { price: PriceValue } } }>;
}) {
  let subtotal = 0;

  for (const item of cart.items) {
    const price = Number(item.variant.price ?? item.variant.product.price);
    subtotal += price * item.quantity;
  }

  // Free shipping threshold in Morocco e.g. 500 MAD, otherwise 30 MAD delivery fee
  const shippingCost = subtotal >= 500 || subtotal === 0 ? 0 : 30;
  const total = subtotal + shippingCost;

  return {
    subtotal,
    shippingCost,
    total,
  };
}

export function serializeCart(cart: Awaited<ReturnType<typeof getOrCreateCart>>) {
  const items = cart.items.map((item) => {
    const unitPrice = Number(item.variant.price ?? item.variant.product.price);
    return {
      id: item.id,
      title: item.variant.product.titleFr,
      variantName: item.variant.nameFr,
      variantId: item.variantId,
      quantity: item.quantity,
      unitPrice,
      lineTotal: unitPrice * item.quantity,
      image: item.variant.product.images[0]?.url ?? null,
    };
  });
  const totals = computeCartTotals(cart);
  return { items, ...totals };
}
