import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch all leads for the current user
export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const leadId = searchParams.get("id");

  // Single lead with activities
  if (leadId) {
    const lead = await prisma.lead.findFirst({
      where: { id: leadId, userId: user.id },
      include: { activities: { orderBy: { createdAt: "desc" }, take: 50 } },
    });
    return NextResponse.json({ lead });
  }

  // All leads
  const leads = await prisma.lead.findMany({
    where: { userId: user.id },
    include: { _count: { select: { activities: true } } },
    orderBy: { updatedAt: "desc" },
  });

  // Pipeline stats
  const stats = await prisma.lead.groupBy({
    by: ["stage"],
    where: { userId: user.id },
    _count: true,
    _sum: { value: true },
  });

  return NextResponse.json({ leads, stats });
}

// POST: Create a lead or add an activity
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();

  // Add activity to existing lead
  if (body.action === "add_activity" && body.leadId) {
    const activity = await prisma.leadActivity.create({
      data: {
        leadId: body.leadId,
        type: body.activityType || "note",
        content: body.content || "",
        metadata: body.metadata ? JSON.stringify(body.metadata) : "{}",
      },
    });
    // Update last contact timestamp
    await prisma.lead.update({
      where: { id: body.leadId },
      data: { lastContactAt: new Date() },
    });
    return NextResponse.json({ activity });
  }

  // Create new lead
  const lead = await prisma.lead.create({
    data: {
      userId: user.id,
      name: body.name || "Unknown",
      email: body.email,
      phone: body.phone,
      source: body.source || "manual",
      stage: body.stage || "new",
      temperature: body.temperature || "warm",
      value: body.value ? parseFloat(body.value) : null,
      tags: body.tags ? JSON.stringify(body.tags) : "[]",
      notes: body.notes,
    },
  });

  // Auto-create first activity
  await prisma.leadActivity.create({
    data: {
      leadId: lead.id,
      type: "note",
      content: `Lead created from ${body.source || "manual"} source`,
    },
  });

  return NextResponse.json({ lead });
}

// PUT: Update a lead (stage change, tag change, etc.)
export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { id } = body;
  if (!id) return NextResponse.json({ error: "Lead ID required" }, { status: 400 });

  // Fetch old lead for change tracking
  const oldLead = await prisma.lead.findFirst({ where: { id, userId: user.id } });
  if (!oldLead) return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const lead = await prisma.lead.update({
    where: { id },
    data: {
      name: body.name ?? oldLead.name,
      email: body.email ?? oldLead.email,
      phone: body.phone ?? oldLead.phone,
      stage: body.stage ?? oldLead.stage,
      temperature: body.temperature ?? oldLead.temperature,
      value: body.value !== undefined ? parseFloat(body.value) : oldLead.value,
      tags: body.tags ? JSON.stringify(body.tags) : oldLead.tags,
      notes: body.notes ?? oldLead.notes,
    },
  });

  // Track stage change
  if (body.stage && body.stage !== oldLead.stage) {
    await prisma.leadActivity.create({
      data: {
        leadId: id,
        type: "stage_change",
        content: `Stage changed from "${oldLead.stage}" to "${body.stage}"`,
        metadata: JSON.stringify({ from: oldLead.stage, to: body.stage }),
      },
    });
  }

  return NextResponse.json({ lead });
}

// DELETE: Delete a lead
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Lead ID required" }, { status: 400 });

  await prisma.lead.delete({ where: { id, userId: user.id } });

  return NextResponse.json({ success: true });
}
