import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const links = await prisma.link.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { order: "asc" },
  });

  return NextResponse.json({ links });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { title, url, icon, image, highlight } = body;

  if (!title || !url) {
    return NextResponse.json({ error: "Title and URL are required" }, { status: 400 });
  }

  const count = await prisma.link.count({
    where: { userId: (session.user as any).id },
  });

  const link = await prisma.link.create({
    data: {
      userId: (session.user as any).id,
      title,
      url,
      icon: icon || null,
      image: image || null,
      highlight: highlight || false,
      order: count,
    },
  });

  return NextResponse.json({ link });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { 
    id, title, url, icon, image, highlight, enabled, order,
    abTestActive, variantBUrl, variantBTitle,
    scheduledStart, scheduledEnd
  } = body;

  if (!id) {
    return NextResponse.json({ error: "Link ID required" }, { status: 400 });
  }

  // Convert dates if provided
  const parseDate = (d: any) => d ? new Date(d) : null;

  const link = await prisma.link.updateMany({
    where: { id, userId: (session.user as any).id },
    data: {
      ...(title !== undefined && { title }),
      ...(url !== undefined && { url }),
      ...(icon !== undefined && { icon }),
      ...(image !== undefined && { image }),
      ...(highlight !== undefined && { highlight }),
      ...(enabled !== undefined && { enabled }),
      ...(order !== undefined && { order }),
      ...(abTestActive !== undefined && { abTestActive }),
      ...(variantBUrl !== undefined && { variantBUrl }),
      ...(variantBTitle !== undefined && { variantBTitle }),
      ...(scheduledStart !== undefined && { scheduledStart: parseDate(scheduledStart) }),
      ...(scheduledEnd !== undefined && { scheduledEnd: parseDate(scheduledEnd) }),
    },
  });

  return NextResponse.json({ link });
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Link ID required" }, { status: 400 });
  }

  await prisma.link.deleteMany({
    where: { id, userId: (session.user as any).id },
  });

  return NextResponse.json({ success: true });
}
