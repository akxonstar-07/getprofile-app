import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Fetch all social accounts for the current user
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const accounts = await prisma.socialAccount.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ accounts });
}

// POST: Connect / update a social account
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const body = await req.json();
  const { platform, platformUsername, platformUserId, accessToken, refreshToken, followerCount, scopes } = body;

  if (!platform) return NextResponse.json({ error: "Platform required" }, { status: 400 });

  const account = await prisma.socialAccount.upsert({
    where: { userId_platform: { userId: user.id, platform } },
    update: {
      platformUsername: platformUsername || undefined,
      platformUserId: platformUserId || undefined,
      accessToken: accessToken || undefined,
      refreshToken: refreshToken || undefined,
      followerCount: followerCount || undefined,
      scopes: scopes ? JSON.stringify(scopes) : undefined,
      isConnected: true,
    },
    create: {
      userId: user.id,
      platform,
      platformUsername,
      platformUserId,
      accessToken,
      refreshToken,
      followerCount: followerCount || 0,
      scopes: scopes ? JSON.stringify(scopes) : "[]",
      isConnected: true,
    },
  });

  return NextResponse.json({ account });
}

// DELETE: Disconnect a social account
export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const platform = searchParams.get("platform");
  if (!platform) return NextResponse.json({ error: "Platform required" }, { status: 400 });

  await prisma.socialAccount.deleteMany({
    where: { userId: user.id, platform },
  });

  return NextResponse.json({ success: true });
}
