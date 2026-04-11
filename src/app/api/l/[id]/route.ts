import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * GET /api/l/[id]
 * Tracks a click on a link, handles A/B testing logic, and redirects the user.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    const link = await prisma.link.findUnique({
      where: { id },
    });

    if (!link) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Default target URL
    let targetUrl = link.url;
    let updateData: any = { clicks: { increment: 1 } };

    // --- A/B Testing Logic ---
    if (link.abTestActive) {
      const { searchParams } = new URL(request.url);
      const isVariantB = searchParams.get("variant") === "B";
      
      if (isVariantB && link.variantBUrl) {
        targetUrl = link.variantBUrl;
        updateData = { clicks: { increment: 1 }, clicksB: { increment: 1 } };
      } else {
        targetUrl = link.url;
        updateData = { clicks: { increment: 1 }, clicksA: { increment: 1 } };
      }
    }

    // Fire & forget click increment (we don't await because we want to redirect fast)
    prisma.link.update({
      where: { id },
      data: updateData,
    }).catch((err) => console.error("Failed to track link click:", err));

    // Ensure the URL has a protocol
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    return NextResponse.redirect(targetUrl);
  } catch (error) {
    console.error("Link redirect error:", error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}
