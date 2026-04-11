import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, customerEmail, customerName, promoCode, returnUrl } = body;

    if (!productId || !customerEmail) {
      return NextResponse.json({ error: "Product ID and email required" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { user: true }
    });

    if (!product || !product.enabled) {
      return NextResponse.json({ error: "Product not found or unavailable" }, { status: 404 });
    }

    let finalPrice = product.price;

    if (promoCode) {
      const promo = await prisma.promoCode.findFirst({
        where: {
          userId: product.userId,
          code: promoCode.toUpperCase(),
          enabled: true,
        }
      });

      if (promo && promo.currentUses < promo.maxUses) {
        const expired = promo.expiresAt && new Date(promo.expiresAt) < new Date();
        if (!expired) {
          finalPrice = product.price * (1 - promo.discountPercent / 100);
          await prisma.promoCode.update({
            where: { id: promo.id },
            data: { currentUses: { increment: 1 } }
          });
        }
      }
    }
    
    // Create pending order record
    const order = await prisma.order.create({
      data: {
        userId: product.userId,
        productId: product.id,
        customerEmail,
        amount: finalPrice,
        status: "PENDING",
      }
    });

    // If Stripe isn't configured, mimic success directly for dev
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn("STRIPE_SECRET_KEY not set. Using dev fallback for order:", order.id);
      
      await prisma.order.update({
        where: { id: order.id },
        data: { status: "PAID" }
      });
      
      if (product.productType === "PHYSICAL" && product.inventory && product.inventory > 0) {
        await prisma.product.update({
          where: { id: product.id },
          data: { inventory: { decrement: 1 } }
        });
      }

      return NextResponse.json({
        success: true,
        order: {
          id: order.id,
          amount: finalPrice,
          originalPrice: product.price,
          productName: product.name,
          digitalUrl: product.productType === "DIGITAL" ? product.digitalUrl : null,
        },
      });
    }

    // Initialize Stripe
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
       apiVersion: '2023-10-16' as any,
    });

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
       payment_method_types: ['card'],
       customer_email: customerEmail,
       line_items: [
         {
           price_data: {
             currency: 'usd',
             product_data: {
               name: product.name,
               description: product.description || undefined,
               images: product.image ? [product.image] : undefined,
             },
             unit_amount: Math.round(finalPrice * 100),
           },
           quantity: 1,
         },
       ],
       mode: 'payment',
       success_url: `${returnUrl || process.env.NEXTAUTH_URL || "http://localhost:3000"}/${product.user.username}?success=true&orderId=${order.id}`,
       cancel_url: `${returnUrl || process.env.NEXTAUTH_URL || "http://localhost:3000"}/${product.user.username}?canceled=true`,
       metadata: {
         orderId: order.id,
         productId: product.id,
         customerEmail,
       }
    });

    return NextResponse.json({
      success: true,
      url: session.url // Client will redirect to this checkout URL
    });

  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
