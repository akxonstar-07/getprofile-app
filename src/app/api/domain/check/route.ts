import { NextResponse } from "next/server";

/**
 * POST /api/domain/check
 * Check if a custom domain is available and provide DNS configuration instructions.
 */
export async function POST(req: Request) {
  try {
    const { domain } = await req.json();

    if (!domain) {
      return NextResponse.json({ error: "Domain required" }, { status: 400 });
    }

    // Normalize domain
    const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/$/, "").toLowerCase();

    // Basic validation
    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z]{2,})+$/;
    if (!domainRegex.test(cleanDomain)) {
      return NextResponse.json({ error: "Invalid domain format" }, { status: 400 });
    }

    // In production: Check DNS records and verify ownership
    // For now, return the DNS configuration needed
    return NextResponse.json({
      domain: cleanDomain,
      status: "pending_verification",
      dnsRecords: [
        {
          type: "CNAME",
          name: cleanDomain.startsWith("www.") ? "www" : "@",
          value: "cname.getprofile.link",
          ttl: 3600,
        },
        {
          type: "TXT",
          name: "_getprofile",
          value: `getprofile-verify=${Date.now().toString(36)}`,
          ttl: 3600,
        }
      ],
      instructions: [
        `Go to your domain registrar's DNS settings`,
        `Add a CNAME record pointing to cname.getprofile.link`,
        `Add the TXT record for verification`,
        `Wait 5-10 minutes for DNS propagation`,
        `Click "Verify Domain" to complete setup`,
      ],
    });

  } catch (error: any) {
    console.error("Domain check error:", error);
    return NextResponse.json({ error: "Domain check failed" }, { status: 500 });
  }
}
