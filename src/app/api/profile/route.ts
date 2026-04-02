import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
    include: { profile: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const body = await request.json();
  const {
    name, username, bio, avatarUrl, bannerUrl, location,
    twitter, instagram, linkedin, youtube, github, tiktok, website,
    facebook, snapchat, spotify, totalFollowers,
    theme, font, bgColor, accentColor, layoutStyle,
    portfolioTitle, portfolioBio, skills, brandLogos, pressLogos,
    businessEmail, availableForWork, statsBrandDeals, statsContentCount
  } = body;

  try {
    if (username) {
      const existing = await prisma.user.findFirst({
        where: { username: username.toLowerCase(), NOT: { id: userId } },
      });
      if (existing) {
        return NextResponse.json({ error: "Username already taken" }, { status: 400 });
      }
    }

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(name !== undefined && { name }),
        ...(username !== undefined && { username: username.toLowerCase() }),
      },
    });

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        ...(bio !== undefined && { bio }),
        ...(avatarUrl !== undefined && { avatarUrl }),
        ...(bannerUrl !== undefined && { bannerUrl }),
        ...(location !== undefined && { location }),
        ...(twitter !== undefined && { twitter }),
        ...(instagram !== undefined && { instagram }),
        ...(linkedin !== undefined && { linkedin }),
        ...(youtube !== undefined && { youtube }),
        ...(github !== undefined && { github }),
        ...(tiktok !== undefined && { tiktok }),
        ...(website !== undefined && { website }),
        ...(facebook !== undefined && { facebook }),
        ...(snapchat !== undefined && { snapchat }),
        ...(spotify !== undefined && { spotify }),
        ...(totalFollowers !== undefined && { totalFollowers: Number(totalFollowers) }),
        ...(theme !== undefined && { theme }),
        ...(font !== undefined && { font }),
        ...(bgColor !== undefined && { bgColor }),
        ...(accentColor !== undefined && { accentColor }),
        ...(layoutStyle !== undefined && { layoutStyle }),
        ...(portfolioTitle !== undefined && { portfolioTitle }),
        ...(portfolioBio !== undefined && { portfolioBio }),
        ...(skills !== undefined && { skills: typeof skills === 'string' ? skills : JSON.stringify(skills) }),
        ...(brandLogos !== undefined && { brandLogos: typeof brandLogos === 'string' ? brandLogos : JSON.stringify(brandLogos) }),
        ...(pressLogos !== undefined && { pressLogos: typeof pressLogos === 'string' ? pressLogos : JSON.stringify(pressLogos) }),
        ...(businessEmail !== undefined && { businessEmail }),
        ...(availableForWork !== undefined && { availableForWork }),
        ...(statsBrandDeals !== undefined && { statsBrandDeals: Number(statsBrandDeals) }),
        ...(statsContentCount !== undefined && { statsContentCount: Number(statsContentCount) }),
      },
      create: {
        userId,
        bio,
        avatarUrl,
        bannerUrl,
        location,
        twitter,
        instagram,
        linkedin,
        youtube,
        github,
        tiktok,
        website,
        facebook,
        snapchat,
        spotify,
        totalFollowers: totalFollowers !== undefined ? Number(totalFollowers) : 0,
      },
    });

    return NextResponse.json({ user, profile });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
