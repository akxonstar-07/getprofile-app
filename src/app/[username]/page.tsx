import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PublicProfileClient from "./PublicProfileClient";

interface Props {
  params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    include: { profile: true },
  });

  if (!user) return { title: "Profile Not Found" };

  const appUrl = process.env.NEXTAUTH_URL || "https://getprofile.link";
  const ogImageUrl = `${appUrl}/api/og?username=${username}&name=${encodeURIComponent(user.name || username)}&avatar=${encodeURIComponent(user.image || "")}`;

  return {
    title: `${user.name || user.username} | getprofile.link`,
    description: user.profile?.bio || `Check out ${user.name || user.username}'s profile on getprofile.link`,
    openGraph: {
      images: [ogImageUrl],
    },
    twitter: {
      card: "summary_large_image",
      title: `${user.name || user.username} | getprofile.link`,
      description: user.profile?.bio || `Check out ${user.name || user.username}'s profile on getprofile.link`,
      images: [ogImageUrl],
    }
  };
}

export default async function PublicProfilePage({ params }: Props) {
  const { username } = await params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      name: true,
      username: true,
      image: true,
      plan: true,
      trialEndsAt: true,
      profileRole: true,
      profile: true,
      links: {
        where: { enabled: true },
        orderBy: { order: "asc" },
      },
      portfolioItems: {
        orderBy: { order: "asc" },
      },
      products: {
        where: { enabled: true },
        orderBy: { order: "asc" },
      },
      events: {
        where: { enabled: true },
        orderBy: { date: "asc" },
      },
    },
  });

  if (!user) {
    notFound();
  }

  // Filter and process links based on scheduling and A/B testing
  const now = new Date();
  const activeLinks = user.links.filter((link) => {
    if (link.scheduledStart && new Date(link.scheduledStart) > now) return false;
    if (link.scheduledEnd && new Date(link.scheduledEnd) < now) return false;
    return true;
  }).map((link) => {
    let displayTitle = link.title;
    let clickUrl = `/api/l/${link.id}`;

    if (link.abTestActive) {
      // 50/50 chance
      const isVariantB = Math.random() >= 0.5;
      if (isVariantB && link.variantBTitle) {
        displayTitle = link.variantBTitle;
        clickUrl += `?variant=B`;
      } else {
        clickUrl += `?variant=A`;
      }
    }

    return {
      ...link,
      displayTitle,
      clickUrl,
    };
  });

  const displayUser = {
    ...user,
    links: activeLinks
  };

  return <PublicProfileClient user={displayUser} />;
}
