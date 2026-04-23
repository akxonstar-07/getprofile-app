import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch all channels for the current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const channels = await prisma.channel.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ channels });
}

// POST: Create or update a channel (WhatsApp / Telegram)
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { type } = body;

  if (!type || !["whatsapp", "telegram"].includes(type)) {
    return NextResponse.json({ error: "Invalid channel type" }, { status: 400 });
  }

  const channel = await prisma.channel.upsert({
    where: { userId_type: { userId: user.id, type } },
    update: {
      name: body.name,
      isActive: body.isActive ?? true,
      waPhoneNumber: body.waPhoneNumber,
      waBusinessId: body.waBusinessId,
      waApiToken: body.waApiToken,
      waVerified: body.waVerified,
      tgBotToken: body.tgBotToken,
      tgBotUsername: body.tgBotUsername,
      tgChatId: body.tgChatId,
      autoReplyTemplates: body.autoReplyTemplates ? JSON.stringify(body.autoReplyTemplates) : undefined,
      welcomeMessage: body.welcomeMessage,
      broadcastEnabled: body.broadcastEnabled,
    },
    create: {
      userId: user.id,
      type,
      name: body.name || (type === "whatsapp" ? "WhatsApp Business" : "Telegram Bot"),
      isActive: body.isActive ?? false,
      waPhoneNumber: body.waPhoneNumber,
      waBusinessId: body.waBusinessId,
      waApiToken: body.waApiToken,
      tgBotToken: body.tgBotToken,
      tgBotUsername: body.tgBotUsername,
      tgChatId: body.tgChatId,
      autoReplyTemplates: body.autoReplyTemplates ? JSON.stringify(body.autoReplyTemplates) : "[]",
      welcomeMessage: body.welcomeMessage || "",
    },
  });

  return NextResponse.json({ channel });
}

// DELETE: Remove a channel
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  if (!type) return NextResponse.json({ error: "Channel type required" }, { status: 400 });

  await prisma.channel.deleteMany({
    where: { userId: user.id, type },
  });

  return NextResponse.json({ success: true });
}
