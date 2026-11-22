import bcrypt from "bcryptjs";
import crypto from "node:crypto";
import { cookies } from "next/headers";
import { LoginSchema, RegisterSchema } from "@/lib/validations";
import { prisma } from "@/lib/prisma";

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export async function logAudit(userId: string | null, action: string, target?: string, details?: Record<string, unknown>, ip?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        target: target || null,
        ip: ip || null,
        details: details ? JSON.stringify(details) : null,
      },
    });
  } catch (e) {
    console.error("Audit log error:", e);
  }
}

export async function registerUser(rawInput: unknown) {
  const parseResult = RegisterSchema.safeParse(rawInput);
  if (!parseResult.success) {
    throw new Error(parseResult.error.issues.map((issue) => issue.message).join(", "));
  }

  const { fullName, email: rawEmail, password, phone } = parseResult.data;
  const email = rawEmail.toLowerCase().trim();

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    throw new Error("Cet email est déjà utilisé par un autre compte");
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      fullName,
      email,
      passwordHash,
      phone: phone || null,
      role: "CUSTOMER",
    },
  });

  return createSession(user.id);
}

export async function loginUser(rawInput: unknown, ip?: string) {
  const parseResult = LoginSchema.safeParse(rawInput);
  if (!parseResult.success) {
    throw new Error("Email ou mot de passe incorrect");
  }

  const { email: rawEmail, password } = parseResult.data;
  const email = rawEmail.toLowerCase().trim();

  const genericError = "Email ou mot de passe incorrect";

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user || !user.isActive) {
    // Constant-time execution defense against user enumeration
    await bcrypt.compare(password, "$2a$12$R9h/cIPz0gi.URNNX3kh2OPST9/PgBkqquzi.Ss7KIUgO2t0jWMUW");
    await logAudit(null, "LOGIN_FAILED", email, { reason: "User not found or inactive" }, ip);
    throw new Error(genericError);
  }

  // Check account lockout
  if (user.lockedUntil && user.lockedUntil > new Date()) {
    throw new Error("Compte temporairement verrouillé suite à plusieurs échecs. Réessayez plus tard.");
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);
  if (!isValidPassword) {
    const failedCount = user.failedLoginCount + 1;
    const lock = failedCount >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null;

    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedLoginCount: failedCount,
        lockedUntil: lock,
      },
    });

    await logAudit(user.id, "LOGIN_FAILED", email, { attempt: failedCount }, ip);
    throw new Error(genericError);
  }

  // Reset failed attempts on success
  await prisma.user.update({
    where: { id: user.id },
    data: { failedLoginCount: 0, lockedUntil: null },
  });

  await logAudit(user.id, "LOGIN_SUCCESS", email, undefined, ip);
  return createSession(user.id);
}

async function createSession(userId: string) {
  const rawToken = crypto.randomBytes(32).toString("hex");
  const token = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days

  await prisma.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  });

  const cookieStore = await cookies();
  cookieStore.set({
    name: "session_token",
    value: rawToken,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  return user;
}

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("session_token")?.value;

  if (!rawToken) return null;

  const token = hashToken(rawToken);

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date() || !session.user.isActive) {
    return null;
  }

  return session.user;
}

export async function logoutUser() {
  const cookieStore = await cookies();
  const rawToken = cookieStore.get("session_token")?.value;

  if (rawToken) {
    const token = hashToken(rawToken);
    await prisma.session.delete({ where: { token } }).catch(() => {});
  }

  cookieStore.delete("session_token");
}

export async function ensureAdmin() {
  const user = await getCurrentUser();
  if (!user || !user.isActive || (user.role !== "ADMIN" && user.role !== "OWNER")) {
    throw new Error("Accès refusé. Privilèges administrateur requis.");
  }
  return user;
}

export async function ensureOwner() {
  const user = await getCurrentUser();
  if (!user || !user.isActive || user.role !== "OWNER") {
    throw new Error("Accès refusé. Privilèges propriétaire (OWNER) requis.");
  }
  return user;
}