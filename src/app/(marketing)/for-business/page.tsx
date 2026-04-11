import RedesignedLandingPage from "@/app/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'For Business | getprofile.link',
  description: 'Leverage enterprise-grade tools to reach new audiences, capture leads, and scale campaigns with precise analytics.',
};

export default function ForBusinessPage() {
  return <RedesignedLandingPage initialSegment="Business" />;
}
