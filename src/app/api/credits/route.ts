import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isCreditsEligible, PLATFORM_FEE_PERCENT, creatorEarnings } from "@/lib/credit-helpers";

// GET: Fetch creator's credit config, balance, recent purchases
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Get or create config
  let config = await prisma.creditConfig.findUnique({ where: { userId: user.id } });
  if (!config) {
    config = await prisma.creditConfig.create({ data: { userId: user.id } });
  }

  // Get or create balance
  let balance = await prisma.creditBalance.findUnique({ where: { userId: user.id } });
  if (!balance) {
    balance = await prisma.creditBalance.create({ data: { userId: user.id } });
  }

  // Recent purchases
  const purchases = await prisma.creditPurchase.findMany({
    where: { creatorId: user.id, paymentStatus: "completed" },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  // Daily stats (last 30 days)
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const dailyStats = await prisma.creditPurchase.groupBy({
    by: ["createdAt"],
    where: { creatorId: user.id, paymentStatus: "completed", createdAt: { gte: thirtyDaysAgo } },
    _sum: { amountPaid: true, creditCount: true },
    _count: true,
  });

  return NextResponse.json({
    config,
    balance,
    purchases,
    dailyStats,
    eligible: isCreditsEligible(user.profileRole || "personal_brand"),
    platformFee: PLATFORM_FEE_PERCENT,
  });
}

// POST: Update credit config
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();

  const config = await prisma.creditConfig.upsert({
    where: { userId: user.id },
    update: {
      isEnabled: body.isEnabled ?? undefined,
      creditPrice: body.creditPrice ?? undefined,
      pack1Credits: body.pack1Credits ?? undefined,
      pack1Price: body.pack1Price ?? undefined,
      pack2Credits: body.pack2Credits ?? undefined,
      pack2Price: body.pack2Price ?? undefined,
      pack3Credits: body.pack3Credits ?? undefined,
      pack3Price: body.pack3Price ?? undefined,
      perkDiscount: body.perkDiscount ?? undefined,
      perkContent: body.perkContent ?? undefined,
      perkEarlyAccess: body.perkEarlyAccess ?? undefined,
      perkCustom: body.perkCustom ?? undefined,
      perkMinCredits: body.perkMinCredits ?? undefined,
    },
    create: {
      userId: user.id,
      isEnabled: body.isEnabled ?? true,
      creditPrice: body.creditPrice ?? 10,
      perkDiscount: body.perkDiscount ?? 10,
      perkContent: body.perkContent ?? false,
      perkEarlyAccess: body.perkEarlyAccess ?? false,
      perkCustom: body.perkCustom,
    },
  });

  return NextResponse.json({ config });
}
