import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * GET /api/analytics/detailed
 * Returns detailed analytics: geo breakdown, device stats, referrer sources, daily trends.
 */
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "30"; // days
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(range));

    // Fetch all events in range
    const events = await prisma.analyticsEvent.findMany({
      where: {
        userId: user.id,
        createdAt: { gte: daysAgo },
      },
      orderBy: { createdAt: "asc" },
    });

    // Parse metadata from events
    const parsed = events.map(e => {
      let meta: any = {};
      try { meta = e.metadata ? JSON.parse(e.metadata) : {}; } catch {}
      return { ...e, meta };
    });

    // Daily trend data
    const dailyMap = new Map<string, { views: number; clicks: number; tips: number; bookings: number }>();
    parsed.forEach(e => {
      const day = e.createdAt.toISOString().split("T")[0];
      const existing = dailyMap.get(day) || { views: 0, clicks: 0, tips: 0, bookings: 0 };
      if (e.type === "PAGE_VIEW") existing.views++;
      else if (e.type === "LINK_CLICK") existing.clicks++;
      else if (e.type === "TIP_RECEIVED") existing.tips++;
      else if (e.type === "BOOKING_RECEIVED") existing.bookings++;
      dailyMap.set(day, existing);
    });

    const dailyTrend = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      ...data,
    }));

    // Device breakdown
    const deviceMap = new Map<string, number>();
    parsed.forEach(e => {
      const device = e.meta.device || "Unknown";
      deviceMap.set(device, (deviceMap.get(device) || 0) + 1);
    });

    // Referrer breakdown
    const referrerMap = new Map<string, number>();
    parsed.forEach(e => {
      const ref = e.meta.referrer || "Direct";
      referrerMap.set(ref, (referrerMap.get(ref) || 0) + 1);
    });

    // Country breakdown
    const countryMap = new Map<string, number>();
    parsed.forEach(e => {
      const country = e.meta.country || "Unknown";
      countryMap.set(country, (countryMap.get(country) || 0) + 1);
    });

    // Top links by clicks
    const linkClickMap = new Map<string, { title: string; clicks: number }>();
    parsed.filter(e => e.type === "LINK_CLICK").forEach(e => {
      const linkId = e.meta.linkId || "unknown";
      const existing = linkClickMap.get(linkId) || { title: e.meta.linkTitle || "Link", clicks: 0 };
      existing.clicks++;
      linkClickMap.set(linkId, existing);
    });

    // Summary stats
    const totalViews = parsed.filter(e => e.type === "PAGE_VIEW").length;
    const totalClicks = parsed.filter(e => e.type === "LINK_CLICK").length;
    const totalTips = parsed.filter(e => e.type === "TIP_RECEIVED").length;
    const totalBookings = parsed.filter(e => e.type === "BOOKING_RECEIVED").length;
    const tipRevenue = parsed
      .filter(e => e.type === "TIP_RECEIVED")
      .reduce((sum, e) => sum + (e.meta.amount || 0), 0);

    return NextResponse.json({
      summary: {
        totalViews,
        totalClicks,
        totalTips,
        totalBookings,
        tipRevenue,
        ctr: totalViews > 0 ? ((totalClicks / totalViews) * 100).toFixed(1) : "0.0",
      },
      dailyTrend,
      devices: Array.from(deviceMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      referrers: Array.from(referrerMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10),
      countries: Array.from(countryMap.entries()).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count).slice(0, 10),
      topLinks: Array.from(linkClickMap.entries()).map(([id, data]) => ({ id, ...data })).sort((a, b) => b.clicks - a.clicks).slice(0, 10),
    });

  } catch (error: any) {
    console.error("Detailed analytics error:", error);
    return NextResponse.json({ error: "Analytics failed" }, { status: 500 });
  }
}
