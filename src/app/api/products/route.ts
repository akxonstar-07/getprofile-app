import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const products = await (prisma as any).product.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { orders: true }
        }
      }
    });
    return NextResponse.json({ products });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const product = await (prisma as any).product.create({
      data: {
        userId: (session.user as any).id,
        name: data.name,
        description: data.description,
        price: data.price,
        image: data.image,
        productType: data.productType,
        digitalUrl: data.digitalUrl,
        inventory: data.inventory,
        isAffiliate: data.isAffiliate || false,
        affiliateNote: data.affiliateNote,
        couponCode: data.couponCode || null,
        courseModules: data.courseModules || "[]",
        enabled: true
      }
    });
    return NextResponse.json({ product });
  } catch (error: any) {
    console.error("POST PRODUCT ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
