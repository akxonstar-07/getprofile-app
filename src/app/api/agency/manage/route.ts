import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || (session.user as any).role !== "AGENCY") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { creatorId } = await request.json();

    // 1. Verify the Agency owns this creator
    const agency = await prisma.agency.findFirst({
      where: { ownerId: (session.user as any).id },
    });

    if (!agency) {
      return NextResponse.json({ error: "No agency found" }, { status: 404 });
    }

    const creator = await prisma.user.findFirst({
      where: { 
        id: creatorId,
        managedByAgencyId: agency.id 
      }
    });

    if (!creator && creatorId !== null) {
      return NextResponse.json({ error: "Invalid creator selection" }, { status: 403 });
    }

    // 2. Set the cookie or clear it
    const cookieStore = await cookies();
    if (creatorId) {
      cookieStore.set("managed_creator_id", creatorId, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24, // 1 day
      });
    } else {
      cookieStore.delete("managed_creator_id");
    }

    return NextResponse.json({ success: true, managing: creator?.name || "Self" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
