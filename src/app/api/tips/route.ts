import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/tips
 * Process a tip/donation for a creator.
 * In production, integrate Stripe PaymentIntent here.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, amount, senderName, message } = body;

    if (!username || !amount || amount <= 0) {
      return NextResponse.json({ error: "Username and valid amount required" }, { status: 400 });
    }

    const creator = await prisma.user.findUnique({
      where: { username },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    // In production: Create Stripe PaymentIntent
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(amount * 100),
    //   currency: 'usd',
    //   metadata: { creatorId: creator.id, senderName, message }
    // });

    // Log the tip as an analytics event
    await prisma.analyticsEvent.create({
      data: {
        userId: creator.id,
        type: "TIP_RECEIVED",
        metadata: JSON.stringify({
          amount,
          senderName: senderName || "Anonymous",
          message: message || "",
          timestamp: new Date().toISOString(),
        }),
      }
    });

    return NextResponse.json({
      success: true,
      tip: {
        amount,
        senderName: senderName || "Anonymous",
        creatorUsername: username,
      }
    });

  } catch (error: any) {
    console.error("Tip error:", error);
    return NextResponse.json({ error: "Tip failed" }, { status: 500 });
  }
}
