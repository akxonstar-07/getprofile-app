import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/links/reorder
 * Body: { orderedIds: string[] }
 * Updates each link's `order` field to match the array index.
 */
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { orderedIds } = await request.json();

  if (!Array.isArray(orderedIds) || orderedIds.length === 0) {
    return NextResponse.json({ error: "orderedIds array required" }, { status: 400 });
  }

  const userId = (session.user as any).id;

  // Verify all links belong to the user
  const linkCount = await prisma.link.count({
    where: { id: { in: orderedIds }, userId },
  });

  if (linkCount !== orderedIds.length) {
    return NextResponse.json({ error: "Some links not found or unauthorized" }, { status: 403 });
  }

  // Batch update order for each link
  await prisma.$transaction(
    orderedIds.map((id, index) =>
      prisma.link.update({
        where: { id },
        data: { order: index },
      })
    )
  );

  return NextResponse.json({ success: true });
}
