import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, type, metadata, referrer } = body;

    if (!userId || !type) {
      return NextResponse.json({ error: "userId and type are required" }, { status: 400 });
    }

    await prisma.analyticsEvent.create({
      data: {
        userId,
        type,
        metadata: metadata ? JSON.stringify(metadata) : null,
        referrer: referrer || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const events = await prisma.analyticsEvent.findMany({
    where: {
      userId,
      createdAt: { gte: thirtyDaysAgo },
    },
    orderBy: { createdAt: "desc" },
  });

  const profileViews = events.filter((e) => e.type === "profile_view").length;
  const linkClicks = events.filter((e) => e.type === "link_click").length;

  const dailyStats: Record<string, { views: number; clicks: number }> = {};
  events.forEach((e) => {
    const day = e.createdAt.toISOString().split("T")[0];
    if (!dailyStats[day]) dailyStats[day] = { views: 0, clicks: 0 };
    if (e.type === "profile_view") dailyStats[day].views++;
    if (e.type === "link_click") dailyStats[day].clicks++;
  });

  return NextResponse.json({
    totalViews: profileViews,
    totalClicks: linkClicks,
    dailyStats,
    recentEvents: events.slice(0, 50),
  });
}
