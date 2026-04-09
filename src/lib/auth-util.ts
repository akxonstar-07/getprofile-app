import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

/**
 * Returns the userId that the current session should act upon.
 * If user is a regular USER, returns their own ID.
 * If user is an AGENCY, checks for a managed_creator_id cookie and verifies ownership.
 * If user is an ADMIN, allows global acting (optional enhancement).
 */
export async function getEffectiveUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return null;

  const currentUserId = (session.user as any).id;
  const currentUserRole = (session.user as any).role;

  // 1. If Agency, check for impersonation cookie
  if (currentUserRole === "AGENCY") {
    const cookieStore = await cookies();
    const managedCreatorId = cookieStore.get("managed_creator_id")?.value;
    
    if (managedCreatorId) {
      // Security: Verify this creator actually belongs to this agency
      const agency = await prisma.agency.findFirst({
        where: { ownerId: currentUserId }
      });
      
      if (agency) {
        const creator = await prisma.user.findFirst({
          where: { 
            id: managedCreatorId,
            managedByAgencyId: agency.id 
          },
          select: { id: true }
        });
        
        if (creator) return creator.id;
      }
    }
  }

  // 2. Default to the logged in user
  return currentUserId;
}
