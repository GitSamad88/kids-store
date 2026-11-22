import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createOrder } from "@/lib/orders";
import { CART_SESSION_COOKIE } from "@/lib/cart-session";

export async function POST(request: Request) {
  const sessionId = (await cookies()).get(CART_SESSION_COOKIE)?.value;
  if (!sessionId) return NextResponse.json({ error: "Votre panier est vide." }, { status: 400 });

  const input = await request.json().catch(() => null);
  try {
    const order = await createOrder(sessionId, input);
    return NextResponse.json({ orderNumber: order.orderNumber }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossible de créer la commande.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
