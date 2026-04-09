import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/checkout/process
 * Creates an order for a product. In production, integrate Stripe PaymentIntent here.
 * For now, creates the order record and returns a success response.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, customerEmail, customerName, promoCode } = body;

    if (!productId || !customerEmail) {
      return NextResponse.json({ error: "Product ID and email required" }, { status: 400 });
    }

    // Fetch the product
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { user: true }
    });

    if (!product || !product.enabled) {
      return NextResponse.json({ error: "Product not found or unavailable" }, { status: 404 });
    }

    let finalPrice = product.price;

    // Apply promo code if provided
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
          // Increment promo usage
          await prisma.promoCode.update({
            where: { id: promo.id },
            data: { currentUses: { increment: 1 } }
          });
        }
      }
    }

    // In production: Create Stripe PaymentIntent here
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
    // const paymentIntent = await stripe.paymentIntents.create({
    //   amount: Math.round(finalPrice * 100),
    //   currency: 'usd',
    //   metadata: { productId, customerEmail }
    // });

    // Create order record
    const order = await prisma.order.create({
      data: {
        userId: product.userId,
        productId: product.id,
        customerEmail,
        amount: finalPrice,
        status: "PAID", // In production: set to PENDING until Stripe webhook confirms
      }
    });

    // Decrement inventory for physical products
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
      // In production: include clientSecret for Stripe Elements
      // clientSecret: paymentIntent.client_secret,
    });

  } catch (error: any) {
    console.error("Checkout error:", error);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
