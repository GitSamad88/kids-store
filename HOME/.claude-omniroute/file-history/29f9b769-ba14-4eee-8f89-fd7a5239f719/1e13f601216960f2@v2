import { NextResponse } from "next/server";
import { loginUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const user = await loginUser(body);

    if (user.role !== "ADMIN") {
      return NextResponse.json({ error: "Accès refusé. Privilèges administrateur requis." }, { status: 403 });
    }

    return NextResponse.json({ success: true, user: { email: user.email, fullName: user.fullName } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur de connexion";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}