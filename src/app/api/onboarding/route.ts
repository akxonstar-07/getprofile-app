import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const SOCIAL_FIELDS = [
  "instagram", "tiktok", "youtube", "twitter", "spotify",
  "facebook", "snapchat", "linkedin", "github", "website",
  "telegram", "whatsapp", "threads", "twitch", "apple_music",
  "tidal", "deezer", "discord", "pinterest", "reddit",
  "substack", "clubhouse", "zillow"
];

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await req.json();
    const { accountType, profileRole, displayName, dob, city, phone, username, platforms, urls, activeTemplateId, themeConfig } = body;

    // Optional Username Validation
    if (username) {
      const existingUser = await prisma.user.findUnique({
        where: { username: username.toLowerCase() }
      });
      if (existingUser && existingUser.id !== userId) {
        return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
      }
    }

    // Build social fields to save on profile
    const socialData: Record<string, string> = {};
    if (urls && typeof urls === "object") {
      for (const [platform, url] of Object.entries(urls)) {
        if (url && typeof url === "string" && url.trim().length > 0) {
          const fieldName = platform.toLowerCase();
          if (SOCIAL_FIELDS.includes(fieldName)) {
            // Auto-format URLs: if they typed @handle, prepend the platform URL
            let finalUrl = url.trim();
            if (!finalUrl.startsWith("http") && !finalUrl.startsWith("//")) {
              const handle = finalUrl.replace("@", "");
              const urlMap: Record<string, string> = {
                instagram: `https://instagram.com/${handle}`,
                tiktok: `https://tiktok.com/@${handle}`,
                youtube: `https://youtube.com/@${handle}`,
                twitter: `https://x.com/${handle}`,
                spotify: `https://open.spotify.com/artist/${handle}`,
                facebook: `https://facebook.com/${handle}`,
                snapchat: `https://snapchat.com/add/${handle}`,
                linkedin: `https://linkedin.com/in/${handle}`,
                github: `https://github.com/${handle}`,
                twitch: `https://twitch.tv/${handle}`,
                pinterest: `https://pinterest.com/${handle}`,
                reddit: `https://reddit.com/user/${handle}`,
                telegram: `https://t.me/${handle}`,
              };
              finalUrl = urlMap[fieldName] || `https://${finalUrl}`;
            }
            socialData[fieldName] = finalUrl;
          }
        }
      }
    }

    const profile = await prisma.profile.upsert({
      where: { userId },
      update: {
        activeTemplateId,
        themeConfig,
        dob,
        location: city,
        phone,
        ...socialData,
      },
      create: {
        userId,
        activeTemplateId,
        themeConfig,
        dob,
        location: city,
        phone,
        ...socialData,
      }
    });

    // Activate 14-day Pro trial on onboarding completion
    const trialEndsAt = new Date();
    trialEndsAt.setDate(trialEndsAt.getDate() + 14);

    // Map accountType to Prisma Role if provided
    let dbRole = "USER";
    if (accountType === "AGENCY") dbRole = "AGENCY";

    const updateData: any = {
      name: displayName,
      onboardingCompleted: true,
      profileRole: profileRole || "personal_brand",
      plan: "TRIAL",
      trialEndsAt,
      role: dbRole
    };

    if (username) {
      updateData.username = username.toLowerCase();
    }

    await (prisma as any).user.update({
      where: { id: userId },
      data: updateData
    });

    // Also create links for each social URL
    for (const [platform, url] of Object.entries(urls || {})) {
      if (url && typeof url === "string" && url.trim().length > 0) {
        const title = platform.charAt(0).toUpperCase() + platform.slice(1);
        const finalUrl = socialData[platform.toLowerCase()] || url.trim();
        await prisma.link.create({
          data: {
            userId,
            title,
            url: finalUrl,
            enabled: true,
            order: 0,
          }
        });
      }
    }

    return NextResponse.json({ success: true, profile });
  } catch (error: any) {
    console.error("ONBOARDING ERROR", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
