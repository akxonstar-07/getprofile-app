import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { publicApiLimiter } from "@/lib/rate-limit";
import { sendBookingNotification } from "@/lib/email";

/**
 * POST /api/booking/public
 * Accept booking requests from visitors on the creator's public profile.
 */
export async function POST(req: Request) {
  try {
    // Rate limit: 20 requests per minute per IP
    const ip = req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || "unknown";
    const { success } = await publicApiLimiter.check(20, `booking_${ip}`);
    if (!success) {
      return NextResponse.json({ error: "Too many requests. Please slow down." }, { status: 429 });
    }

    const body = await req.json();
    const { username, guestName, guestEmail, date, time, duration, notes, preQualAnswers } = body;

    if (!username || !guestName || !guestEmail || !date || !time) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const creator = await prisma.user.findUnique({ where: { username } });
    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    // Check for duplicate booking at same time
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: creator.id,
        date: new Date(date),
        time,
        status: { not: "CANCELLED" },
      }
    });

    if (existingBooking) {
      return NextResponse.json({ error: "This time slot is already booked" }, { status: 409 });
    }

    const booking = await prisma.booking.create({
      data: {
        userId: creator.id,
        guestName,
        guestEmail,
        date: new Date(date),
        time,
        duration: duration || 30,
        notes: notes || "",
        preQualAnswers: preQualAnswers ? JSON.stringify(preQualAnswers) : null,
        status: "PENDING",
      }
    });

    // Log analytics event
    await prisma.analyticsEvent.create({
      data: {
        userId: creator.id,
        type: "BOOKING_RECEIVED",
        metadata: JSON.stringify({
          bookingId: booking.id,
          guestName,
          date,
          time,
        }),
      }
    });

    // Notify creator
    await sendBookingNotification(creator.email, guestName, date, time);

    return NextResponse.json({
      success: true,
      booking: {
        id: booking.id,
        date: booking.date,
        time: booking.time,
        duration: booking.duration,
        status: booking.status,
      }
    });

  } catch (error: any) {
    console.error("Public booking error:", error);
    return NextResponse.json({ error: "Booking failed" }, { status: 500 });
  }
}

/**
 * GET /api/booking/public?username=xxx
 * Fetch available time slots for a creator's public profile.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    const creator = await prisma.user.findUnique({ where: { username } });
    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    // Get booked slots for the next 30 days
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const bookings = await prisma.booking.findMany({
      where: {
        userId: creator.id,
        date: { gte: now, lte: thirtyDaysFromNow },
        status: { not: "CANCELLED" },
      },
      select: { date: true, time: true, duration: true }
    });

    return NextResponse.json({
      bookedSlots: bookings.map(b => ({
        date: b.date.toISOString().split("T")[0],
        time: b.time,
        duration: b.duration,
      })),
    });

  } catch (error: any) {
    console.error("Fetch slots error:", error);
    return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
  }
}
