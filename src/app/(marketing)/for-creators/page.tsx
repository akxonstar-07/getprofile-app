import RedesignedLandingPage from "@/app/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'For Creators | getprofile.link',
  description: 'The only platform you need to monetize your audience. Store, links, courses, and AI — all in one place.',
};

export default function ForCreatorsPage() {
  return <RedesignedLandingPage initialSegment="Creators" />;
}
