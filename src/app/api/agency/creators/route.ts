import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  
  const allowedRoles = ["ADMIN", "AGENCY"];
  if (!session?.user || !allowedRoles.includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const isAdmin = (session.user as any).role === "ADMIN";
    
    // 1. Find the agency context
    const agency = await prisma.agency.findFirst({
      where: isAdmin ? {} : { ownerId: (session.user as any).id }, // Admin can see first found or we can extend for global view
    });

    if (!agency) {
      return NextResponse.json({ creators: [], msg: "No agency found" });
    }

    // 2. Fetch creators
    const creators = await prisma.user.findMany({
      where: { managedByAgencyId: agency.id },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        profile: {
          select: {
            avatarUrl: true,
            totalFollowers: true,
          }
        },
        _count: {
          select: { links: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    return NextResponse.json({ creators });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
