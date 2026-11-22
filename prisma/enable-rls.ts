import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function enableRls() {
  console.log("Enabling Row Level Security (RLS) on public schema tables...");

  const tables = [
    "Category",
    "Product",
    "ProductVariant",
    "ProductImage",
    "Inventory",
    "Cart",
    "CartItem",
    "User",
    "Session",
    "AuditLog",
    "Order",
    "OrderItem",
  ];

  for (const table of tables) {
    try {
      await prisma.$executeRawUnsafe(`ALTER TABLE "${table}" ENABLE ROW LEVEL SECURITY;`);
      console.log(`✅ RLS enabled for table: ${table}`);
    } catch (e) {
      console.log(`⚠️ Note on ${table}:`, e instanceof Error ? e.message : e);
    }
  }

  // Verify RLS status
  const rlsStatus = await prisma.$queryRaw`
    SELECT relname, relrowsecurity
    FROM pg_class
    JOIN pg_namespace ON pg_namespace.oid = pg_class.relnamespace
    WHERE nspname = 'public' AND relkind = 'r';
  `;

  console.log("\n📊 RLS Status Report (relrowsecurity = true means RLS enabled):");
  console.table(rlsStatus);
}

enableRls()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });