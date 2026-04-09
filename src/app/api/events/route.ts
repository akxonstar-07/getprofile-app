import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const events = await (prisma as any).event.findMany({
      where: { userId: (session.user as any).id },
      orderBy: { date: "asc" }
    });
    return NextResponse.json({ events });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const data = await req.json();
    const event = await (prisma as any).event.create({
      data: {
        userId: (session.user as any).id,
        title: data.title,
        description: data.description,
        date: new Date(data.date),
        location: data.location,
        isVirtual: data.isVirtual,
        maxAttendees: data.maxAttendees,
        enabled: true
      }
    });
    return NextResponse.json({ event });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
