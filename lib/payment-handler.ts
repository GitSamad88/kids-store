import { PaymentStatus, OrderStatus } from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { verifyPaymentWebhook } from "@/lib/payment";

const webhookEventSchema = z.object({
  orderNumber: z.string().min(1),
  status: z.enum(["SUCCESS", "FAILED", "RETRY"]),
  failureReason: z.string().max(500).optional(),
});

export async function handlePaymentWebhook(rawBody: string, signature: string) {
  const configuredSecret = process.env.PAYMENT_WEBHOOK_SECRET;
  if (process.env.NODE_ENV === "production" && !configuredSecret) {
    throw new Error("PAYMENT_WEBHOOK_SECRET doit être configuré en production");
  }
  const webhookSecret = configuredSecret ?? "development-secret";

  // 1. Verify cryptographic signature for security
  const isValid = verifyPaymentWebhook(rawBody, signature, webhookSecret);
  if (!isValid) {
    throw new Error("Signature de webhook invalide");
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    throw new Error("Payload de webhook invalide");
  }
  const parsedEvent = webhookEventSchema.safeParse(body);
  if (!parsedEvent.success) {
    throw new Error("Payload de webhook invalide");
  }

  const { orderNumber, status, failureReason } = parsedEvent.data;

  // 2. Find order
  const order = await prisma.order.findUnique({
    where: { orderNumber },
    include: { items: { include: { variant: true } } },
  });

  if (!order) {
    throw new Error(`Commande introuvable: ${orderNumber}`);
  }

  // Idempotency check: if already paid or cancelled, don't re-process
  if (order.paymentStatus === "PAID" && status === "SUCCESS") {
    return { success: true, message: "Paiement déjà validé (idempotent)" };
  }

  let newPaymentStatus: PaymentStatus = order.paymentStatus;
  let newOrderStatus: OrderStatus = order.status;

  if (status === "SUCCESS") {
    newPaymentStatus = "PAID";
    newOrderStatus = "CONFIRMED";
  } else if (status === "FAILED") {
    newPaymentStatus = "FAILED";
    newOrderStatus = "PENDING"; // Keep pending so customer can retry payment
  } else if (status === "RETRY") {
    newPaymentStatus = "PENDING";
    newOrderStatus = "PENDING";
  }

  // 3. Update order and restock if failed permanently (optional based on policy)
  const updatedOrder = await prisma.$transaction(async (tx) => {
    // If payment failed and was previously pending, we record failure
    const updated = await tx.order.update({
      where: { id: order.id },
      data: {
        paymentStatus: newPaymentStatus,
        status: newOrderStatus,
        notes: failureReason ? `Échec paiement: ${failureReason}` : order.notes,
      },
    });

    // If payment failed permanently and items were deducted, handle stock return if needed
    if (status === "FAILED" && order.paymentStatus === "PENDING") {
      // Optional: Log payment failure audit event
    }

    return updated;
  });

  return {
    success: true,
    orderNumber: updatedOrder.orderNumber,
    paymentStatus: updatedOrder.paymentStatus,
    orderStatus: updatedOrder.status,
  };
}
