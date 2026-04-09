import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const conversations = await (prisma as any).conversation.findMany({
      where: { userId: (session.user as any).id },
      include: {
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { lastMessageAt: "desc" }
    });
    
    // Simulate an AI summary for the dashboard
    const summary = "Audience sentiment is trending high on 'Fitness Guides'. There are 3 new brand leads from 'Fashion Brands' in your inbox. 🤖";

    return NextResponse.json({ conversations, summary });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch conversations" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Simulate AI Analysis Trigger
  return NextResponse.json({ success: true, message: "Analysis started" });
}
