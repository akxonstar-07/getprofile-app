import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch all bookings for the logged-in creator
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;

    const bookings = await (prisma as any).booking.findMany({
      where: { userId },
      orderBy: { date: "asc" },
    });

    return NextResponse.json(bookings);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST: Create a new booking (called from public profile)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { creatorId, guestName, guestEmail, date, time, duration, preQualAnswers, notes } = body;

    if (!creatorId || !guestName || !guestEmail || !date || !time) {
      return NextResponse.json({ error: "Missing required booking fields" }, { status: 400 });
    }

    const booking = await (prisma as any).booking.create({
      data: {
        userId: creatorId,
        guestName,
        guestEmail,
        date: new Date(date),
        time,
        duration: duration || 30,
        status: "PENDING",
        preQualAnswers: preQualAnswers ? JSON.stringify(preQualAnswers) : null,
        notes: notes || null,
      },
    });

    // Create AI notification for creator
    const conversation = await (prisma as any).conversation.create({
      data: {
        userId: creatorId,
        visitorEmail: guestEmail,
        visitorName: guestName,
        summary: `📅 New booking request! ${guestName} wants to meet on ${new Date(date).toLocaleDateString()} at ${time}`,
      },
    });
    await (prisma as any).message.create({
      data: {
        conversationId: conversation.id,
        sender: "AI_ASSISTANT",
        content: `📅 New booking from ${guestName} (${guestEmail}) for ${new Date(date).toLocaleDateString()} at ${time}.${preQualAnswers ? `\n\nPre-qualification: ${JSON.stringify(preQualAnswers)}` : ""}`,
        category: "LEAD",
        isRead: false,
      },
    });

    return NextResponse.json(booking);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH: Update booking status (confirm/cancel)
export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = (session.user as any).id;
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Booking ID and status required" }, { status: 400 });
    }

    const booking = await (prisma as any).booking.updateMany({
      where: { id, userId },
      data: { status },
    });

    return NextResponse.json({ success: true, booking });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
