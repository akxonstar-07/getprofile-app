import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = "theakhileshreddy07@gmail.com";
  const password = "1173244";
  const hashedPassword = await bcrypt.hash(password, 10);

  console.log(`🚀 Registering 10/10 Master User: ${email}...`);

  try {
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        hashedPassword,
        role: "ADMIN",
        username: "akhilesh",
        name: "Akhilesh Reddy"
      },
      create: {
        email,
        hashedPassword,
        role: "ADMIN",
        username: "akhilesh",
        name: "Akhilesh Reddy"
      },
    });

    console.log(`✅ User Admin account secured: ${user.id}`);

    // Ensure Agency record exists for this user
    const existingAgency = await prisma.agency.findFirst({
      where: { ownerId: user.id }
    });

    if (!existingAgency) {
       const newAgency = await prisma.agency.create({
          data: {
              ownerId: user.id,
              name: "Akhilesh Reddy Agency",
          },
        });
        console.log(`✅ Agency Command Center initialized: ${newAgency.id}`);
    } else {
        console.log(`✅ Agency Command Center already synced: ${existingAgency.id}`);
    }
    
    console.log("🏆 Registration Complete. You can now login to all dashboards.");
  } catch (err) {
    console.error("❌ Registration Failed:", err);
    process.exit(1);
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  });
