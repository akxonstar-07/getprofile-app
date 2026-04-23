import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyRazorpayPayment, calculatePayout, isRazorpayConfigured } from "@/lib/razorpay";

/**
 * POST /api/payments/verify
 * Verify Razorpay payment and complete the transaction
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, type, creatorId, buyerName, buyerEmail, amount, metadata } = body;

    // Verify payment signature
    const isVerified = await verifyRazorpayPayment({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    if (!isVerified) {
      return NextResponse.json({ error: "Payment verification failed" }, { status: 400 });
    }

    const payout = calculatePayout(amount);

    // Process based on payment type
    switch (type) {
      case "credit_purchase": {
        const creditCount = metadata?.creditCount || 0;

        // Record the purchase
        await prisma.creditPurchase.create({
          data: {
            creatorId,
            buyerName: buyerName || "Anonymous",
            buyerEmail: buyerEmail || "",
            creditCount,
            amountPaid: amount,
            paymentId: razorpay_payment_id || `sim_${Date.now()}`,
            paymentStatus: "completed",
          },
        });

        // Update creator's credit balance
        await prisma.creditBalance.upsert({
          where: { userId: creatorId },
          update: {
            totalCredits: { increment: creditCount },
            totalSupporters: { increment: 1 },
            totalRevenue: { increment: payout.creatorPayout },
          },
          create: {
            userId: creatorId,
            totalCredits: creditCount,
            totalSupporters: 1,
            totalRevenue: payout.creatorPayout,
          },
        });

        break;
      }

      case "product_purchase": {
        // Record in orders (existing checkout flow)
        const productId = metadata?.productId;
        if (productId && creatorId) {
          await prisma.order.create({
            data: {
              userId: creatorId,
              productId,
              customerEmail: buyerEmail || "",
              amount,
              status: "PAID",
            },
          });
        }
        break;
      }

      case "subscription": {
        // Upgrade user plan
        const planType = metadata?.planType; // "PRO" or "MAX"
        if (planType && creatorId) {
          await prisma.user.update({
            where: { id: creatorId },
            data: { plan: planType },
          });
        }
        break;
      }

      case "tip": {
        // Record tip (existing tip flow)
        break;
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      paymentId: razorpay_payment_id,
      payout: {
        creatorGets: payout.creatorPayout,
        platformFee: payout.platformFee,
      },
    });
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
