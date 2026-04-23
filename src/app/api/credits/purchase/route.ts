import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { creatorEarnings } from "@/lib/credit-helpers";

// POST: Buy credits for a creator (public — no auth required)
export async function POST(req: Request) {
  const body = await req.json();
  const { creatorId, buyerName, buyerEmail, creditCount, amountPaid, packId } = body;

  if (!creatorId || !buyerName || !creditCount || !amountPaid) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Verify creator exists and has credits enabled
  const creator = await prisma.user.findUnique({
    where: { id: creatorId },
    include: { creditConfig: true },
  });
  if (!creator) return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  if (!creator.creditConfig?.isEnabled) return NextResponse.json({ error: "Credits not enabled" }, { status: 400 });

  // Simulation mode: skip real payment, auto-complete
  const paymentId = `sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

  // Create purchase record
  const purchase = await prisma.creditPurchase.create({
    data: {
      buyerName,
      buyerEmail: buyerEmail || null,
      creatorId,
      creditCount,
      amountPaid,
      currency: creator.creditConfig.currency,
      paymentId,
      paymentStatus: "completed",
    },
  });

  // Update creator's balance
  const earnings = creatorEarnings(amountPaid);

  // Check if this buyer is new (unique supporter)
  const existingPurchase = await prisma.creditPurchase.findFirst({
    where: {
      creatorId,
      buyerEmail: buyerEmail || undefined,
      buyerName,
      id: { not: purchase.id },
    },
  });
  const isNewSupporter = !existingPurchase;

  await prisma.creditBalance.upsert({
    where: { userId: creatorId },
    update: {
      totalCredits: { increment: creditCount },
      totalSupporters: isNewSupporter ? { increment: 1 } : undefined,
      totalRevenue: { increment: earnings },
      pendingPayout: { increment: earnings },
    },
    create: {
      userId: creatorId,
      totalCredits: creditCount,
      totalSupporters: 1,
      totalRevenue: earnings,
      pendingPayout: earnings,
    },
  });

  return NextResponse.json({
    success: true,
    purchase: { id: purchase.id, creditCount, amountPaid },
    message: `You just gave ${creditCount} credits to ${creator.name || "this creator"}!`,
  });
}

// GET: Get credit info for a creator's public profile (public)
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const creatorId = searchParams.get("creatorId");

  if (!username && !creatorId) return NextResponse.json({ error: "username or creatorId required" }, { status: 400 });

  const creator = await prisma.user.findFirst({
    where: username ? { username } : { id: creatorId! },
    include: { creditConfig: true, creditBalance: true },
  });

  if (!creator) return NextResponse.json({ error: "Creator not found" }, { status: 404 });
  if (!creator.creditConfig?.isEnabled) return NextResponse.json({ enabled: false });

  // Today's purchase count (for live activity)
  const todayStart = new Date(); todayStart.setHours(0, 0, 0, 0);
  const todayCount = await prisma.creditPurchase.count({
    where: { creatorId: creator.id, paymentStatus: "completed", createdAt: { gte: todayStart } },
  });

  return NextResponse.json({
    enabled: true,
    config: {
      creditPrice: creator.creditConfig.creditPrice,
      currency: creator.creditConfig.currency,
      pack1: { credits: creator.creditConfig.pack1Credits, price: creator.creditConfig.pack1Price },
      pack2: { credits: creator.creditConfig.pack2Credits, price: creator.creditConfig.pack2Price },
      pack3: { credits: creator.creditConfig.pack3Credits, price: creator.creditConfig.pack3Price },
      perkDiscount: creator.creditConfig.perkDiscount,
      perkContent: creator.creditConfig.perkContent,
      perkEarlyAccess: creator.creditConfig.perkEarlyAccess,
      perkCustom: creator.creditConfig.perkCustom,
      perkMinCredits: creator.creditConfig.perkMinCredits,
    },
    balance: {
      totalCredits: creator.creditBalance?.totalCredits || 0,
      totalSupporters: creator.creditBalance?.totalSupporters || 0,
    },
    todayPurchases: todayCount,
  });
}
