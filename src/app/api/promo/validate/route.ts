import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST: Validate a promo code at checkout
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { code, creatorId } = body;

    if (!code || !creatorId) {
      return NextResponse.json({ error: "Code and creator ID required" }, { status: 400 });
    }

    const promo = await (prisma as any).promoCode.findFirst({
      where: {
        userId: creatorId,
        code: code.toUpperCase(),
        enabled: true,
      },
    });

    if (!promo) {
      return NextResponse.json({ valid: false, error: "Invalid promo code" }, { status: 404 });
    }

    // Check expiry
    if (promo.expiresAt && new Date(promo.expiresAt) < new Date()) {
      return NextResponse.json({ valid: false, error: "Promo code expired" }, { status: 400 });
    }

    // Check usage limit
    if (promo.currentUses >= promo.maxUses) {
      return NextResponse.json({ valid: false, error: "Promo code usage limit reached" }, { status: 400 });
    }

    // Increment usage
    await (prisma as any).promoCode.update({
      where: { id: promo.id },
      data: { currentUses: promo.currentUses + 1 },
    });

    return NextResponse.json({
      valid: true,
      discountPercent: promo.discountPercent,
      code: promo.code,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
