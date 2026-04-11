import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";

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
  title: "getprofile.link — Build Your Creator Profile in Minutes",
  description:
    "The all-in-one platform for creators to showcase their portfolio, manage links, and sell digital products.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    title: "getprofile.link",
    statusBarStyle: "black-translucent",
  },
  keywords: ["creator", "portfolio", "link in bio", "profile", "personal website", "creator store"],
  openGraph: {
    title: "getprofile.link — Build Your Creator Profile in Minutes",
    description: "The all-in-one platform for creators to showcase their portfolio, manage links, and sell digital products.",
    type: "website",
  },
};

import { Toaster } from "sonner";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="antialiased font-sans">
        <AuthProvider>
          <ThemeProvider>
            {children}
            <Toaster position="top-center" richColors />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
