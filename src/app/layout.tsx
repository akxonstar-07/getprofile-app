import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "GetProfile — Build Your Creator Profile in Minutes",
  description:
    "Create a portfolio, link hub, and creator store in one beautiful profile. The modern link-in-bio platform for creators.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "GetProfile",
    statusBarStyle: "black-translucent",
  },
  keywords: ["creator", "portfolio", "link in bio", "profile", "personal website", "creator store"],
  openGraph: {
    title: "GetProfile — Build Your Creator Profile in Minutes",
    description: "Create a portfolio, link hub, and creator store in one profile.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
