import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: '2023-10-16' as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const hdrs = await headers();
  const signature = hdrs.get("Stripe-Signature") as string;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error: any) {
    console.error("Webhook signature verification failed.", error.message);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    
    // Fulfill the purchase...
    const orderId = session.metadata?.orderId;
    const productId = session.metadata?.productId;

    if (orderId && productId) {
      await prisma.order.update({
        where: { id: orderId },
        data: { status: "PAID" }
      });

      const product = await prisma.product.findUnique({
         where: { id: productId }
      });

      if (product && product.productType === "PHYSICAL" && product.inventory && product.inventory > 0) {
        await prisma.product.update({
           where: { id: product.id },
           data: { inventory: { decrement: 1 } }
        });
      }
      
      // In a real production app, trigger Welcome/Delivery Email via Resend/SendGrid right here.
      console.log(`[Stripe Webhook] Order ${orderId} successfully marked PAID.`);
    }
  }

  return NextResponse.json({ received: true });
}
