import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { removeCartItem, serializeCart, updateCartItemQuantity } from "@/lib/cart";
import { CART_SESSION_COOKIE } from "@/lib/cart-session";

const quantitySchema = z.object({ quantity: z.number().int().min(1).max(99) });

async function getSessionId() {
  const value = (await cookies()).get(CART_SESSION_COOKIE)?.value;
  return z.string().uuid().safeParse(value).success ? value : null;
}

export async function PATCH(request: Request, context: RouteContext<"/api/cart/[itemId]">) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ error: "Panier introuvable." }, { status: 404 });
  const parsed = quantitySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Quantité invalide." }, { status: 400 });
  const { itemId } = await context.params;
  try {
    const cart = await updateCartItemQuantity(sessionId, itemId, parsed.data.quantity);
    return NextResponse.json(serializeCart(cart));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossible de modifier le panier.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}

export async function DELETE(_request: Request, context: RouteContext<"/api/cart/[itemId]">) {
  const sessionId = await getSessionId();
  if (!sessionId) return NextResponse.json({ error: "Panier introuvable." }, { status: 404 });
  const { itemId } = await context.params;
  try {
    const cart = await removeCartItem(sessionId, itemId);
    return NextResponse.json(serializeCart(cart));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossible de modifier le panier.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}
