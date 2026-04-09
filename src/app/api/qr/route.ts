import { NextResponse } from "next/server";

/**
 * GET /api/qr?url=https://getprofile.link/username
 * Generates a QR code URL using a free API service.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const url = searchParams.get("url");
    const size = searchParams.get("size") || "300";
    const color = searchParams.get("color") || "000000";

    if (!url) {
      return NextResponse.json({ error: "URL parameter required" }, { status: 400 });
    }

    // Using QR Server API (free, no auth needed)
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(url)}&color=${color}&bgcolor=ffffff&margin=20&format=svg`;

    return NextResponse.json({
      qrUrl,
      profileUrl: url,
      downloadUrl: qrUrl.replace("format=svg", "format=png"),
    });

  } catch (error: any) {
    console.error("QR generation error:", error);
    return NextResponse.json({ error: "QR generation failed" }, { status: 500 });
  }
}
