import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { runAutonomousDiscovery } from "@/lib/ai-team/autonomy/discovery";

export async function POST() {
  const session = await getServerSession(authOptions);
  
  if (!session?.user || !["ADMIN", "AGENCY"].includes((session.user as any).role)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const result = await runAutonomousDiscovery();
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
