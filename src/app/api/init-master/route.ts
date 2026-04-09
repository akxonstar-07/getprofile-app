import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
  const email = "theakhileshreddy07@gmail.com";
  const password = "1173244";
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // 1. Upsert User using the standard prisma lib from the app
    const user = await prisma.user.upsert({
      where: { email },
      update: {
        hashedPassword,
        role: "ADMIN" as any,
        username: "akhilesh",
        name: "Akhilesh Reddy"
      },
      create: {
        email,
        hashedPassword,
        role: "ADMIN" as any,
        username: "akhilesh",
        name: "Akhilesh Reddy"
      },
    });

    // 2. Initialize Agency
    // Use raw execute to avoid client-type mismatch if any
    const agencyCount = await (prisma as any).agency.count({
        where: { ownerId: user.id }
    });

    if (agencyCount === 0) {
        await (prisma as any).agency.create({
            data: {
                ownerId: user.id,
                name: "Akhilesh Reddy Agency",
            }
        });
    }

    return NextResponse.json({ 
      success: true, 
      message: "🏆 Registration Complete. You can now login to all dashboards.",
      userId: user.id
    });
  } catch (err: any) {
    console.error("Master registration error:", err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
