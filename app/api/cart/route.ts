import { randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";
import { addToCart, getOrCreateCart, serializeCart } from "@/lib/cart";
import { CART_SESSION_COOKIE } from "@/lib/cart-session";
import { prisma } from "@/lib/prisma";
import { CartItemInputSchema } from "@/lib/validations";

const sessionSchema = z.string().uuid();

async function getSessionId() {
  const jar = await cookies();
  const value = jar.get(CART_SESSION_COOKIE)?.value;
  const parsed = sessionSchema.safeParse(value);
  return { jar, sessionId: parsed.success ? parsed.data : randomUUID(), isNew: !parsed.success };
}

function applySessionCookie(response: NextResponse, sessionId: string, isNew: boolean) {
  if (isNew) {
    response.cookies.set(CART_SESSION_COOKIE, sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
  }
  return response;
}

export async function GET() {
  const { sessionId, isNew } = await getSessionId();
  const cart = await getOrCreateCart(sessionId);
  return applySessionCookie(NextResponse.json(serializeCart(cart)), sessionId, isNew);
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = CartItemInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Données de panier invalides." }, { status: 400 });
  }

  const { sessionId, isNew } = await getSessionId();
  const variant = await prisma.productVariant.findUnique({
    where: { sku: parsed.data.variantSku },
    include: { product: { select: { isActive: true } } },
  });
  if (!variant || !variant.product.isActive) {
    return NextResponse.json({ error: "Ce produit n'est plus disponible." }, { status: 404 });
  }

  try {
    const cart = await addToCart(sessionId, variant.id, parsed.data.quantity);
    return applySessionCookie(NextResponse.json(serializeCart(cart)), sessionId, isNew);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Impossible de mettre à jour le panier.";
    return NextResponse.json({ error: message }, { status: 409 });
  }
}


