import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch all campaigns, flows, and global triggers
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "campaigns";

  if (type === "campaigns") {
    const campaigns = await prisma.autoDMCampaign.findMany({
      where: { userId: user.id },
      include: { _count: { select: { logs: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ campaigns });
  }

  if (type === "flows") {
    const flows = await prisma.dMFlow.findMany({
      where: { userId: user.id },
      include: { steps: { orderBy: { order: "asc" } }, _count: { select: { campaigns: true } } },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ flows });
  }

  if (type === "triggers") {
    const triggers = await prisma.globalTrigger.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ triggers });
  }

  if (type === "logs") {
    const campaignId = searchParams.get("campaignId");
    const logs = await prisma.autoDMLog.findMany({
      where: { userId: user.id, ...(campaignId ? { campaignId } : {}) },
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    // Aggregate stats
    const stats = await prisma.autoDMLog.groupBy({
      by: ["status"],
      where: { userId: user.id, ...(campaignId ? { campaignId } : {}) },
      _count: true,
    });
    return NextResponse.json({ logs, stats });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

// POST: Create a campaign, flow, or global trigger
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { type } = body;

  if (type === "campaign") {
    const campaign = await prisma.autoDMCampaign.create({
      data: {
        userId: user.id,
        name: body.name || "New Campaign",
        platform: body.platform || "instagram",
        triggerType: body.triggerType || "comment",
        triggerSource: body.triggerSource,
        keywords: body.keywords ? JSON.stringify(body.keywords) : "[]",
        matchMode: body.matchMode || "any",
        dmMessage: body.dmMessage || "",
        dmButtonText: body.dmButtonText,
        dmButtonUrl: body.dmButtonUrl,
        dmImage: body.dmImage,
        commentReply: body.commentReply,
        commentReplyEnabled: body.commentReplyEnabled ?? true,
        followGated: body.followGated ?? false,
        collectEmail: body.collectEmail ?? false,
        emailPrompt: body.emailPrompt,
        flowId: body.flowId,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ campaign });
  }

  if (type === "flow") {
    const flow = await prisma.dMFlow.create({
      data: {
        userId: user.id,
        name: body.name || "New Flow",
        description: body.description,
        steps: body.steps ? {
          create: body.steps.map((s: any, idx: number) => ({
            order: idx,
            type: s.type || "message",
            content: s.content,
            options: s.options ? JSON.stringify(s.options) : "[]",
            delayMs: s.delayMs,
            linkUrl: s.linkUrl,
            nextStepId: s.nextStepId,
          })),
        } : undefined,
      },
      include: { steps: true },
    });
    return NextResponse.json({ flow });
  }

  if (type === "trigger") {
    const trigger = await prisma.globalTrigger.create({
      data: {
        userId: user.id,
        keyword: body.keyword,
        response: body.response || "",
        linkUrl: body.linkUrl,
        isActive: body.isActive ?? true,
      },
    });
    return NextResponse.json({ trigger });
  }

  return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}

// PUT: Update a campaign, flow, or trigger
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { type, id } = body;

  if (type === "campaign" && id) {
    const campaign = await prisma.autoDMCampaign.update({
      where: { id, userId: user.id },
      data: {
        name: body.name,
        triggerType: body.triggerType,
        triggerSource: body.triggerSource,
        keywords: body.keywords ? JSON.stringify(body.keywords) : undefined,
        matchMode: body.matchMode,
        dmMessage: body.dmMessage,
        dmButtonText: body.dmButtonText,
        dmButtonUrl: body.dmButtonUrl,
        commentReply: body.commentReply,
        commentReplyEnabled: body.commentReplyEnabled,
        followGated: body.followGated,
        collectEmail: body.collectEmail,
        emailPrompt: body.emailPrompt,
        isActive: body.isActive,
        isPaused: body.isPaused,
      },
    });
    return NextResponse.json({ campaign });
  }

  if (type === "trigger" && id) {
    const trigger = await prisma.globalTrigger.update({
      where: { id },
      data: {
        keyword: body.keyword,
        response: body.response,
        linkUrl: body.linkUrl,
        isActive: body.isActive,
      },
    });
    return NextResponse.json({ trigger });
  }

  return NextResponse.json({ error: "Invalid type or missing id" }, { status: 400 });
}

// DELETE: Delete a campaign, flow, or trigger
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const id = searchParams.get("id");

  if (!type || !id) return NextResponse.json({ error: "type and id required" }, { status: 400 });

  if (type === "campaign") await prisma.autoDMCampaign.delete({ where: { id, userId: user.id } });
  if (type === "flow") await prisma.dMFlow.delete({ where: { id, userId: user.id } });
  if (type === "trigger") await prisma.globalTrigger.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
