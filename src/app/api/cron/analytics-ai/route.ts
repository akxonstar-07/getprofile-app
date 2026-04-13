import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Ensure this route is dynamic so it actually runs when pinged by a cron
export const dynamic = "force-dynamic";

// Configuration for local Ollama daemon
const OLLAMA_URL = "http://localhost:11434/api/generate";
const OLLAMA_MODEL = "llama3";

export async function POST(request: Request) {
  try {
    // 1. Basic security check (Optional but recommended for cron endpoints)
    const authHeader = request.headers.get("authorization");
    if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
       return NextResponse.json({ error: "Unauthorized cron execution." }, { status: 401 });
    }

    // 2. Data Aggregation: Fetch stats from the last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    
    // We only want active users who had some traffic
    const recentEvents = await prisma.analyticsEvent.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo }
      },
      select: {
         userId: true,
         type: true,
         metadata: true
      }
    });

    if (recentEvents.length === 0) {
       return NextResponse.json({ message: "No analytics events found in the past 7 days." });
    }

    // Grouping events by userId
    const userStats: Record<string, { views: number; links: Record<string, number> }> = {};
    
    recentEvents.forEach(event => {
       if (!userStats[event.userId]) {
          userStats[event.userId] = { views: 0, links: {} };
       }
       if (event.type === "profile_view") {
          userStats[event.userId].views++;
       } else if (event.type === "link_click") {
          try {
             // Link clicks usually store { linkId: "...", url: "..." } in metadata
             const meta = JSON.parse(event.metadata || "{}");
             const target = meta.url || "unknown_link";
             userStats[event.userId].links[target] = (userStats[event.userId].links[target] || 0) + 1;
          } catch (e) {
             // ignore parse errors
          }
       }
    });

    // 3 & 4: Process LLM insights and Inject directly to Database
    const results = [];

    // Note: In production with thousands of users, this should be sent to a queue (like SQS/Kafka)
    // For local LLM processing, we do sequential loops to avoid crashing localhost:11434 with concurrent requests
    for (const [userId, stats] of Object.entries(userStats)) {
       // Skip users with virtually zero data to avoid hallucinated advice
       if (stats.views < 5 && Object.keys(stats.links).length === 0) continue;

       // Construct the data prompt
       const linkBreakdown = Object.entries(stats.links).map(([url, count]) => `- ${url}: ${count} clicks`).join("\n");
       const prompt = `
       Here is the 7-day traffic data for a single creator:
       Total Profile Views: ${stats.views}
       Link Click Breakdown:
       ${linkBreakdown || "No specific link clicks recorded."}
       `;

       try {
          // Call local Llama 3 via Ollama API
          const response = await fetch(OLLAMA_URL, {
             method: "POST",
             headers: { "Content-Type": "application/json" },
             body: JSON.stringify({
                model: OLLAMA_MODEL,
                prompt: prompt,
                system: "You are an elite, aggressive data scientist and growth hacker. Analyze the provided 7-day traffic data for a creator. Respond with EXACTLY 2 concise, highly actionable sentences of strategic advice to maximize their monetization or audience retention. Do not use pleasantries. Do not say 'Based on the data'. Provide the raw, ruthless strategic directive.",
                stream: false
             })
          });

          if (!response.ok) {
             throw new Error(`Ollama responded with status: ${response.status}`);
          }

          const llmData = await response.json();
          const advice = llmData.response.trim();

          // Database Injection: Push to the user's Inbox
          // First, find or create the AI Assistant conversation for this user
          let conversation = await prisma.conversation.findFirst({
             where: { userId, visitorId: "AI_SYSTEM" }
          });

          if (!conversation) {
             conversation = await prisma.conversation.create({
                data: {
                   userId,
                   visitorId: "AI_SYSTEM",
                   visitorName: "Growth Assistant",
                   summary: "Automated Growth Insights"
                }
             });
          }

          // Create the message
          await prisma.message.create({
             data: {
                conversationId: conversation.id,
                sender: "AI_ASSISTANT",
                content: advice,
                category: "OTHER"
             }
          });

          // Update conversation timestamp
          await prisma.conversation.update({
             where: { id: conversation.id },
             data: { lastMessageAt: new Date() }
          });

          results.push({ userId, status: "success", generatedAdvice: advice });
       } catch (aiError: any) {
          console.error(`Failed to generate AI insight for user ${userId}:`, aiError.message);
          results.push({ userId, status: "failed", reason: aiError.message });
       }
    }

    return NextResponse.json({ 
       message: "Multi-Model Analytics Pipeline Completed",
       processedUsers: results.length,
       reports: results 
    });

  } catch (error: any) {
    console.error("Cron Analytics Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
