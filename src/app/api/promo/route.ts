import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch all promo codes for the logged-in creator
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const promoCodes = await (prisma as any).promoCode.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(promoCodes);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new promo code
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const body = await req.json();
    const { code, discountPercent, maxUses, expiresAt, aiTriggered } = body;

    if (!code || !discountPercent) {
      return NextResponse.json({ error: "Code and discount are required" }, { status: 400 });
    }

    // Check for duplicates
    const existing = await (prisma as any).promoCode.findFirst({
      where: { userId, code: code.toUpperCase() },
    });
    if (existing) {
      return NextResponse.json({ error: "Promo code already exists" }, { status: 400 });
    }

    const promo = await (prisma as any).promoCode.create({
      data: {
        userId,
        code: code.toUpperCase(),
        discountPercent: Math.min(Math.max(discountPercent, 1), 90), // Clamp 1-90%
        maxUses: maxUses || 100,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        aiTriggered: aiTriggered || false,
      },
    });

    return NextResponse.json(promo);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Remove a promo code
export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Promo code ID required" }, { status: 400 });
    }

    await (prisma as any).promoCode.deleteMany({
      where: { id, userId },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
