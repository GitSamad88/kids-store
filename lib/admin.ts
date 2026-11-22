import { OrderStatus } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

async function ensureAdmin() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Accès refusé. Privilèges administrateur requis.");
  }
  return user;
}

// 1. Product & Category Administration
export const AdminProductSchema = z.object({
  titleFr: z.string().min(2),
  titleAr: z.string().min(2),
  descriptionFr: z.string().min(5),
  descriptionAr: z.string().min(5),
  price: z.coerce.number().min(0.01),
  oldPrice: z.coerce.number().min(0).optional(),
  categoryId: z.string().uuid(),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  stock: z.coerce.number().int().min(0),
});

export async function adminCreateProduct(rawInput: unknown) {
  await ensureAdmin();
  const parsed = AdminProductSchema.parse(rawInput);

  const slug = parsed.titleFr
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const product = await prisma.$transaction(async (tx) => {
    const created = await tx.product.create({
      data: {
        slug: `${slug}-${Date.now().toString().slice(-4)}`,
        titleFr: parsed.titleFr,
        titleAr: parsed.titleAr,
        descriptionFr: parsed.descriptionFr,
        descriptionAr: parsed.descriptionAr,
        price: parsed.price,
        oldPrice: parsed.oldPrice || null,
        categoryId: parsed.categoryId,
        isActive: parsed.isActive,
        isFeatured: parsed.isFeatured,
        inventory: {
          create: { stock: parsed.stock },
        },
        variants: {
          create: [
            {
              nameFr: "Standard",
              nameAr: "قياسي",
              sku: `SKU-${Date.now()}`,
              price: parsed.price,
              stock: parsed.stock,
            },
          ],
        },
      },
      include: { inventory: true, variants: true, category: true },
    });

    return created;
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/categories/[slug]`, "page");
  return product;
}

export async function adminUpdateProduct(productId: string, rawInput: unknown) {
  await ensureAdmin();
  const parsed = AdminProductSchema.parse(rawInput);

  const product = await prisma.$transaction(async (tx) => {
    const updated = await tx.product.update({
      where: { id: productId },
      data: {
        titleFr: parsed.titleFr,
        titleAr: parsed.titleAr,
        descriptionFr: parsed.descriptionFr,
        descriptionAr: parsed.descriptionAr,
        price: parsed.price,
        oldPrice: parsed.oldPrice || null,
        categoryId: parsed.categoryId,
        isActive: parsed.isActive,
        isFeatured: parsed.isFeatured,
      },
      include: { inventory: true, variants: true, category: true },
    });

    // Update inventory if exists
    await tx.inventory.updateMany({
      where: { productId },
      data: { stock: parsed.stock },
    }).catch(async () => {
      await tx.inventory.create({
        data: { productId, stock: parsed.stock },
      });
    });

    // Update primary variant stock & price
    await tx.productVariant.updateMany({
      where: { productId },
      data: { price: parsed.price, stock: parsed.stock },
    });

    return updated;
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/products/${product.slug}`);
  revalidatePath(`/categories/[slug]`, "page");
  return product;
}

export async function adminDeleteProduct(productId: string) {
  await ensureAdmin();

  // Check if product has order items
  const orderItemsCount = await prisma.orderItem.count({ where: { productId } });
  if (orderItemsCount > 0) {
    // Soft delete / archive instead of hard delete to preserve order history integrity
    const archived = await prisma.product.update({
      where: { id: productId },
      data: { isActive: false },
    });
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/products/${archived.slug}`);
    return { success: true, action: "archived", message: "Le produit est lié à des commandes existantes. Il a été archivé (désactivé) avec succès." };
  }

  const deleted = await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/categories/[slug]`, "page");
  return { success: true, action: "deleted", message: "Produit supprimé définitivement." };
}

export async function adminUpdateInventory(productId: string, newStock: number) {
  await ensureAdmin();

  const res = await prisma.$transaction(async (tx) => {
    await tx.inventory.update({
      where: { productId },
      data: { stock: newStock },
    }).catch(async () => {
      await tx.inventory.create({
        data: { productId, stock: newStock },
      });
    });

    await tx.productVariant.updateMany({
      where: { productId },
      data: { stock: newStock },
    });

    return { success: true, newStock };
  });

  revalidatePath("/");
  revalidatePath("/shop");
  return res;
}

// 3. Category Management
export const AdminCategorySchema = z.object({
  nameFr: z.string().min(2),
  nameAr: z.string().min(2),
  description: z.string().optional(),
});

export async function adminCreateCategory(rawInput: unknown) {
  await ensureAdmin();
  const parsed = AdminCategorySchema.parse(rawInput);

  const slug = parsed.nameFr
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const category = await prisma.category.create({
    data: {
      slug: `${slug}-${Date.now().toString().slice(-4)}`,
      nameFr: parsed.nameFr,
      nameAr: parsed.nameAr,
      description: parsed.description || null,
    },
  });

  revalidatePath("/");
  revalidatePath("/categories");
  return category;
}

// 4. Order Management & Audit-safe Operations
export async function adminGetOrders() {
  await ensureAdmin();

  return await prisma.order.findMany({
    include: {
      items: {
        include: { product: true, variant: true },
      },
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function adminUpdateOrderStatus(orderId: string, newStatus: OrderStatus) {
  const admin = await ensureAdmin();

  const order = await prisma.order.findUnique({ where: { id: orderId } });
  if (!order) {
    throw new Error("Commande introuvable");
  }

  const auditNote = `[Audit] Statut changé de ${order.status} à ${newStatus} par Admin (${admin.email}) le ${new Date().toISOString()}`;
  const existingNotes = order.notes ? `${order.notes}\n${auditNote}` : auditNote;

  const updated = await prisma.order.update({
    where: { id: orderId },
    data: {
      status: newStatus,
      notes: existingNotes,
    },
  });

  revalidatePath("/admin/orders");
  return updated;
}