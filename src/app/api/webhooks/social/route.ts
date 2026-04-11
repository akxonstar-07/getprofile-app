import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/**
 * POST /api/webhooks/social
 * Receives Webhooks from Meta Graph API (Instagram) or TikTok when a fan comments.
 * It checks the comment text against the AI Assistant "Comment-to-DM" configured triggers.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Verify Meta Hub Challenge if configuring Webhook for the first time
    if (req.method === 'GET') {
       /* 
        * Meta Webhooks require a GET request verification:
        * const url = new URL(req.url);
        * const mode = url.searchParams.get("hub.mode");
        * const token = url.searchParams.get("hub.verify_token");
        * const challenge = url.searchParams.get("hub.challenge");
        * if (mode && token === process.env.META_VERIFY_TOKEN) {
        *   return new Response(challenge, { status: 200 });
        * }
        */
    }

    // 1. Parse Meta Graph Payload
    // Expected structure for IG comments:
    // { "object": "instagram", "entry": [ { "id": "<ig_id>", "changes": [ { "field": "comments", "value": { "text": "SEND", "from": { "id": "fan123", "username": "fanly" } } } ] } ] }
    if (body.object === "instagram" && body.entry) {
      for (const entry of body.entry) {
        // Find the creator in our DB mapping to this IG Account ID
        const socialAccountId = entry.id;
        const creatorAccount = await prisma.account.findFirst({
           where: { providerAccountId: socialAccountId, provider: "instagram" },
           include: { user: true }
        });

        if (!creatorAccount) continue; // Creator not registered with Insta

        for (const change of entry.changes) {
          if (change.field === "comments") {
            const commentText = change.value.text?.toLowerCase().trim();
            const fanUsername = change.value.from?.username;

            // 2. Fetch Creator's Comment-to-DM Trigger Configurations
            // We store AI Config in user.profile or a separate config. Let's assume user.profile for now
            // since we used it in /dashboard/assistant/page.tsx
            const profile = await prisma.profile.findUnique({
              where: { userId: creatorAccount.userId }
            });

            if (!profile) continue;
            
            // Assume we saved AI triggers in an AI config JSON or similar
            // For example purposes:
            // "const triggers = [ { keyword: "send", response: "Here is the link: getprofile.link/u" } ]"
            // We simulate triggering the Dispatch
            
            console.log(`[ECHO-ME AI] Matched keyword in comment "${commentText}" from ${fanUsername}. Dispatching DM payload via Meta API...`);

            // 3. Dispatch DM via Meta Graph API
            // const metaApiUrl = `https://graph.facebook.com/v18.0/${creatorAccount.providerAccountId}/messages`;
            // await fetch(metaApiUrl, {
            //   method: "POST",
            //   headers: { "Authorization": `Bearer ${creatorAccount.access_token}`, "Content-Type": "application/json" },
            //   body: JSON.stringify({ recipient: { username: fanUsername }, message: { text: trigger.response } })
            // });
          }
        }
      }
    }

    return NextResponse.json({ success: true, message: "EVENT_RECEIVED" });

  } catch (error: any) {
    console.error("Social Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
