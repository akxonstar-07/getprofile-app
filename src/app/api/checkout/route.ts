import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Ensure STRIPE_SECRET_KEY exists in production
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_placeholder", {
  // @ts-ignore
  apiVersion: "2024-04-10",
});

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // Note: Checkout can be public (for buyers). We only check session if this is a creator-initiated action (like subscribing to Pro).
    // For this route, we assume it's for buying products/tips from a creator.
    
    const body = await req.json();
    const { productId, type = "product", amount, creatorId, returnUrl } = body;

    if (!creatorId) {
      return NextResponse.json({ error: "Creator ID required" }, { status: 400 });
    }

    let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
    let metadata: any = { type, creatorId };

    if (type === "product" && productId) {
      const product = await prisma.product.findUnique({ where: { id: productId } });
      if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
      
      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              description: product.description || undefined,
            },
            unit_amount: Math.round(product.price * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ];
      metadata.productId = product.id;
    } else if (type === "tip" && amount) {
      lineItems = [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Tip for Creator",
              description: "Thank you for your support!",
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ];
    } else {
      return NextResponse.json({ error: "Invalid checkout request" }, { status: 400 });
    }

    // Determine domain (localhost or production)
    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL || "http://localhost:3000";

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}&type=${type}`,
      cancel_url: returnUrl || `${origin}/`,
      metadata,
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("STRIPE CHECKOUT ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
