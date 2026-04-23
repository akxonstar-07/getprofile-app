import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRazorpayOrder, isRazorpayConfigured, calculatePayout } from "@/lib/razorpay";

/**
 * POST /api/payments/create-order
 * Create a Razorpay order for credit purchase or product checkout
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { type, creatorId, buyerName, buyerEmail, amount, metadata } = body;

    if (!type || !creatorId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate creator exists
    const creator = await prisma.user.findUnique({ where: { id: creatorId } });
    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    const receipt = `${type}_${creatorId.slice(0, 8)}_${Date.now()}`;

    // Create Razorpay order (or simulation)
    const order = await createRazorpayOrder({
      amount,
      receipt,
      notes: {
        type,
        creatorId,
        buyerName: buyerName || "Anonymous",
        buyerEmail: buyerEmail || "",
        ...(metadata || {}),
      },
    });

    if (!order) {
      return NextResponse.json({ error: "Failed to create payment order" }, { status: 500 });
    }

    const isSimulation = !isRazorpayConfigured();
    const payout = calculatePayout(amount);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      receipt,
      simulation: isSimulation,
      payout: {
        creatorGets: payout.creatorPayout,
        platformFee: payout.platformFee,
      },
    });
  } catch (error) {
    console.error("Payment order error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * GET /api/payments/create-order
 * Check payment system status
 */
export async function GET() {
  return NextResponse.json({
    razorpayConfigured: isRazorpayConfigured(),
    mode: isRazorpayConfigured() ? "live" : "simulation",
    currency: "INR",
    platformFee: "10%",
  });
}
