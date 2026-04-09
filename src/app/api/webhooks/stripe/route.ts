import { NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/prisma";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  // @ts-ignore
  apiVersion: "2024-04-10",
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "whsec_placeholder";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get("stripe-signature") as string;

    let event: Stripe.Event;

    try {
      if (process.env.NODE_ENV === "development" && webhookSecret === "whsec_placeholder") {
        event = JSON.parse(body) as Stripe.Event;
      } else {
        event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      }
    } catch (err: any) {
      console.error(`Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    // ═══ STAGE 1: Real Order Fulfillment ═══
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const { type, creatorId, productId } = session.metadata || {};
      const customerEmail = session.customer_details?.email || "unknown@email.com";
      const amountTotal = (session.amount_total || 0) / 100; // Convert cents to dollars

      console.log(`[Stripe] ✅ Payment: ${type} | $${amountTotal} | Creator: ${creatorId}`);

      // ── Product Purchase: Create Order + Decrement Inventory ──
      if (type === "product" && productId && creatorId) {
        // Create order record
        await (prisma as any).order.create({
          data: {
            userId: creatorId,
            productId: productId,
            customerEmail: customerEmail,
            amount: amountTotal,
            status: "PAID",
          },
        });

        // Decrement inventory for physical products
        const product = await (prisma as any).product.findUnique({
          where: { id: productId },
        });
        if (product && product.productType === "PHYSICAL" && product.inventory !== null) {
          await (prisma as any).product.update({
            where: { id: productId },
            data: { inventory: Math.max(0, product.inventory - 1) },
          });
        }

        // Create AI notification for creator's dashboard
        const conversation = await (prisma as any).conversation.create({
          data: {
            userId: creatorId,
            visitorEmail: customerEmail,
            visitorName: session.customer_details?.name || "Customer",
            summary: `💰 New sale! ${product?.name || "Product"} purchased for $${amountTotal}`,
          },
        });
        await (prisma as any).message.create({
          data: {
            conversationId: conversation.id,
            sender: "AI_ASSISTANT",
            content: `🎉 Great news! ${session.customer_details?.name || "Someone"} just purchased "${product?.name || "a product"}" for $${amountTotal}. Their email is ${customerEmail}.`,
            category: "SALE",
            isRead: false,
          },
        });

        console.log(`[Stripe] 📦 Order created for product: ${product?.name}`);
      }

      // ── Tip Payment ──
      else if (type === "tip" && creatorId) {
        const conversation = await (prisma as any).conversation.create({
          data: {
            userId: creatorId,
            visitorEmail: customerEmail,
            visitorName: session.customer_details?.name || "Fan",
            summary: `💝 New tip received! $${amountTotal}`,
          },
        });
        await (prisma as any).message.create({
          data: {
            conversationId: conversation.id,
            sender: "AI_ASSISTANT",
            content: `🙏 ${session.customer_details?.name || "A fan"} just sent you a $${amountTotal} tip! Their email: ${customerEmail}`,
            category: "FAN",
            isRead: false,
          },
        });
        console.log(`[Stripe] 💝 Tip of $${amountTotal} recorded`);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("STRIPE WEBHOOK ERROR:", error.message);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
