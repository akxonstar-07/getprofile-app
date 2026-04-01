import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ products });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { name, description, price, image, checkoutUrl, isAffiliate, affiliateNote } = body;

  if (!name) {
    return NextResponse.json({ error: "Product name is required" }, { status: 400 });
  }

  const count = await prisma.product.count({
    where: { userId: (session.user as any).id },
  });

  const product = await prisma.product.create({
    data: {
      userId: (session.user as any).id,
      name,
      description: description || null,
      price: price || 0,
      image: image || null,
      checkoutUrl: checkoutUrl || null,
      isAffiliate: !!isAffiliate,
      affiliateNote: affiliateNote || null,
      order: count,
    },
  });

  return NextResponse.json({ product });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, name, description, price, image, checkoutUrl, enabled, order, isAffiliate, affiliateNote } = body;

  if (!id) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  const product = await prisma.product.updateMany({
    where: { id, userId: (session.user as any).id },
    data: {
      ...(name !== undefined && { name }),
      ...(description !== undefined && { description }),
      ...(price !== undefined && { price }),
      ...(image !== undefined && { image }),
      ...(checkoutUrl !== undefined && { checkoutUrl }),
      ...(enabled !== undefined && { enabled }),
      ...(order !== undefined && { order }),
      ...(isAffiliate !== undefined && { isAffiliate }),
      ...(affiliateNote !== undefined && { affiliateNote }),
    },
  });

  return NextResponse.json({ product });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Product ID required" }, { status: 400 });
  }

  await prisma.product.deleteMany({
    where: { id, userId: (session.user as any).id },
  });

  return NextResponse.json({ success: true });
}
