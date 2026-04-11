import RedesignedLandingPage from "@/app/page";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: 'For Agencies | getprofile.link',
  description: 'Compare analytics, streamline monetization, and grow your agency effortlessly with multi-profile management.',
};

export default function ForAgenciesPage() {
  return <RedesignedLandingPage initialSegment="Agencies" />;
}
