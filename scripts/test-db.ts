import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

async function main() {
  const connectionString = process.env.DATABASE_URL || "";
  console.log("Connecting to:", connectionString.replace(/:[^:@]+@/, ":***@"));
  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const prisma = new PrismaClient({ adapter });

  try {
    const count = await prisma.user.count();
    console.log("✅ DB CONNECTED — User count:", count);
  } catch (e: any) {
    console.log("❌ DB ERROR:", e.message);
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}
main();
