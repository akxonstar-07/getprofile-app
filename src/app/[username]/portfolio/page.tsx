import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import PortfolioClient from "./PortfolioClient";

interface Props { params: Promise<{ username: string }> }

export async function generateMetadata({ params }: Props) {
  const { username } = await params;
  const user = await prisma.user.findUnique({ where: { username }, include: { profile: true } });
  if (!user) return { title: "Portfolio Not Found" };
  return {
    title: `${user.name || user.username} — Portfolio`,
    description: user.profile?.bio || `${user.name || user.username}'s creative portfolio`,
    openGraph: { images: user.profile?.bannerUrl ? [user.profile.bannerUrl] : [] },
  };
}

export default async function PortfolioPage({ params }: Props) {
  const { username } = await params;
  const user = await prisma.user.findUnique({
    where: { username },
    include: {
      profile: true,
      portfolioItems: { orderBy: { order: "asc" } },
    },
  });
  if (!user) notFound();
  return <PortfolioClient user={user} />;
}
