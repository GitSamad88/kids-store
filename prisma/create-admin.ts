import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import readline from "readline";

const prisma = new PrismaClient();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query: string): Promise<string> =>
  new Promise((resolve) => rl.question(query, resolve));

async function main() {
  console.log("=== Kids Maroc : Bootstrap Initial OWNER Admin ===");

  const ownersCount = await prisma.user.count({ where: { role: "OWNER" } });
  if (ownersCount > 0) {
    console.log("⚠️ Un compte OWNER existe déjà dans la base de données.");
    const confirm = await question("Voulez-vous créer un autre administrateur OWNER ? (o/N): ");
    if (confirm.toLowerCase() !== "o") {
      console.log("Opération annulée.");
      process.exit(0);
    }
  }

  const emailInput = await question("Email administrateur (ex: owner@kidsmaroc.ma): ");
  const email = emailInput.toLowerCase().trim();

  if (!email || !email.includes("@")) {
    console.error("❌ Email invalide.");
    process.exit(1);
  }

  const password = await question("Mot de passe sécurisé (min 12 caractères): ");
  if (!password || password.length < 12) {
    console.error("❌ Le mot de passe doit contenir au moins 12 caractères.");
    process.exit(1);
  }

  const fullName = await question("Nom complet [Administrateur Principal]: ") || "Administrateur Principal";

  const existing = await prisma.user.findUnique({ where: { email } });
  const passwordHash = await bcrypt.hash(password, 12);

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: { role: "OWNER", isActive: true, passwordHash, mustChangePassword: false },
    });
    console.log(`✅ Compte ${email} mis à jour avec le rôle OWNER.`);
  } else {
    await prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: "OWNER",
        isActive: true,
        mustChangePassword: false,
      },
    });
    console.log(`✅ Nouvel utilisateur OWNER (${email}) créé avec succès.`);
  }

  // Fallback cleanup of old env seeding if present
  console.log("✅ Bootstrap terminé en toute sécurité.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    rl.close();
    await prisma.$disconnect();
  });