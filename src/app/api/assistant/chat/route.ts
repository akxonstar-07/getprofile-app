import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getRoleDashboardConfig } from "@/lib/role-dashboard-config";
import { askOllama } from "@/lib/ai-team/ollama-client";

export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    
    if (!username) {
      return NextResponse.json({ error: "Username required" }, { status: 400 });
    }

    const body = await req.json();
    const { message, history } = body;

    // Fetch creator's context from DB
    const creator = await prisma.user.findUnique({
      where: { username },
      include: {
        profile: true,
        products: { where: { enabled: true } },
        events: true,
      }
    });

    if (!creator) return NextResponse.json({ error: "Creator not found" }, { status: 404 });

    const roleConfig = getRoleDashboardConfig(creator.profileRole || "personal_brand");

    // Build the Knowledge Context
    const storeContext = creator.products.length > 0 
      ? `Available Products/Services:\n${creator.products.map(p => `- ${p.name} ($${p.price}) - ${p.description || ''}`).join('\n')}`
      : `No products available currently.`;

    const eventsContext = creator.events.length > 0
      ? `Upcoming Events:\n${creator.events.map(e => `- ${e.title} on ${new Date(e.date).toLocaleDateString()} at ${e.location || 'Virtual'}`).join('\n')}`
      : `No upcoming events.`;

    const systemPrompt = `You are the ${roleConfig.pages.assistant.title} for ${creator.name || creator.username}.
Your goal is: ${roleConfig.pages.assistant.subtitle}
Creator's Bio: ${creator.profile?.bio || 'Not provided'}

You are a highly capable AI assistant acting as a concierge for the creator's business. You are helpful, very concise, and enthusiastic. You must reply in maximum 2-3 sentences. Do NOT break character.

Here is the creator's current business context:
${storeContext}

${eventsContext}

Respond to the visitor's message based ONLY on the context provided. If they ask to book something not listed, tell them it's currently unavailable but you'll let ${creator.name || creator.username} know.
`;

    // Format chat history to provide context
    let prompt = `Chat History:\n`;
    if (history && history.length > 0) {
      history.slice(-4).forEach((h: any) => {
        prompt += `${h.sender === "VISITOR" ? "Visitor" : "Assistant"}: ${h.content}\n`;
      });
    }
    
    prompt += `Visitor: ${message}\nAssistant:`;

    // Call Ollama (Local AI Engine)
    let reply = "";
    try {
      reply = await askOllama(prompt, systemPrompt, "llama3.2"); 
    } catch (e) {
      console.warn("Ollama failed or is offline, falling back to simulated response:", e);
      reply = `Thanks for reaching out! My live AI connection is offline, but I've noted your message and will pass it onto ${creator.name || creator.username}.`;
    }

    // [Optional] Save snippet of this interaction to DB for the Creator's Dashboard analytics here 
    // ...

    return NextResponse.json({ reply });

  } catch (error) {
    console.error("AI Chat Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
