import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await prisma.portfolioItem.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ items });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, image, description, link, category, itemType, brandName, videoUrl } = body;

  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const count = await prisma.portfolioItem.count({
    where: { userId: (session.user as any).id },
  });

  const item = await prisma.portfolioItem.create({
    data: {
      userId: (session.user as any).id,
      title,
      image: image || null,
      description: description || null,
      link: link || null,
      category: category || null,
      itemType: itemType || null,
      brandName: brandName || null,
      videoUrl: videoUrl || null,
      order: count,
    },
  });

  return NextResponse.json({ item });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { id, title, image, description, link, category, order, itemType, brandName, videoUrl } = body;

  if (!id) {
    return NextResponse.json({ error: "Item ID required" }, { status: 400 });
  }

  const item = await prisma.portfolioItem.updateMany({
    where: { id, userId: (session.user as any).id },
    data: {
      ...(title !== undefined && { title }),
      ...(image !== undefined && { image }),
      ...(description !== undefined && { description }),
      ...(link !== undefined && { link }),
      ...(category !== undefined && { category }),
      ...(order !== undefined && { order }),
      ...(itemType !== undefined && { itemType }),
      ...(brandName !== undefined && { brandName }),
      ...(videoUrl !== undefined && { videoUrl }),
    },
  });

  return NextResponse.json({ item });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Item ID required" }, { status: 400 });
  }

  await prisma.portfolioItem.deleteMany({
    where: { id, userId: (session.user as any).id },
  });

  return NextResponse.json({ success: true });
}
