import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getCustomerOrders() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Non autorisé. Veuillez vous connecter.");
  }

  return await prisma.order.findMany({
    where: { userId: user.id },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getCustomerOrderById(orderId: string) {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error("Non autorisé. Veuillez vous connecter.");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!order || (order.userId !== user.id && user.role !== "ADMIN")) {
    throw new Error("Commande introuvable ou accès non autorisé");
  }

  return order;
}
