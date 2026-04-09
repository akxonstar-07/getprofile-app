// ═══════════════════════════════════════════════════
// getprofile.link — AI Context Builder (Stage 3)
// Builds a system prompt from the creator's actual data
// ═══════════════════════════════════════════════════

import { getRoleById } from "@/lib/roles";

export interface CreatorContext {
  name: string;
  bio: string;
  role: string;
  products: Array<{ name: string; price: number; description: string }>;
  services: Array<{ name: string; price: string }>;
  events: Array<{ title: string; date: string; location: string }>;
  testimonials: Array<{ name: string; quote: string }>;
  links: Array<{ title: string; url: string }>;
  faqs: Array<{ question: string; answer: string }>;
  tone: "professional" | "friendly" | "formal";
  availability: string;
}

/**
 * Build a system prompt for the AI assistant based on the creator's data.
 * This is the GUARDRAIL — the AI can ONLY use information provided here.
 */
export function buildSystemPrompt(ctx: CreatorContext): string {
  const role = getRoleById(ctx.role);
  const roleName = role?.label || "Professional";

  // Role-specific instructions
  const roleInstructions = getRoleInstructions(ctx.role);

  return `You are the AI assistant for ${ctx.name}, a ${roleName}. 
You are embedded on their getprofile.link page and visitors are chatting with you.

## YOUR PERSONALITY
- Tone: ${ctx.tone}
- You represent ${ctx.name} professionally at all times.
- You are helpful, concise, and focused on converting visitors into leads or customers.

## CRITICAL GUARDRAILS
- You can ONLY discuss information provided below. NEVER make up facts.
- If you don't know the answer, say: "Great question! Let me connect you directly with ${ctx.name}."
- NEVER discuss competitors, politics, or unrelated topics.
- NEVER provide legal, medical, or financial advice — direct them to the appropriate professional.
- Keep responses under 100 words unless the question requires detail.

## ABOUT ${ctx.name.toUpperCase()}
Bio: ${ctx.bio || "Not provided"}
Availability: ${ctx.availability || "Contact for availability"}

${roleInstructions}

## PRODUCTS & SERVICES
${ctx.products.length > 0
    ? ctx.products.map(p => `- ${p.name}: $${p.price} — ${p.description}`).join("\n")
    : "No products listed yet."}

${ctx.services.length > 0
    ? ctx.services.map(s => `- ${s.name}: ${s.price}`).join("\n")
    : ""}

## UPCOMING EVENTS
${ctx.events.length > 0
    ? ctx.events.map(e => `- ${e.title} on ${e.date} at ${e.location}`).join("\n")
    : "No upcoming events."}

## WHAT OTHERS SAY
${ctx.testimonials.length > 0
    ? ctx.testimonials.map(t => `- "${t.quote}" — ${t.name}`).join("\n")
    : "No testimonials yet."}

## LINKS
${ctx.links.length > 0
    ? ctx.links.map(l => `- ${l.title}: ${l.url}`).join("\n")
    : ""}

## FREQUENTLY ASKED QUESTIONS
${ctx.faqs.length > 0
    ? ctx.faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join("\n\n")
    : "No FAQs configured. Answer only from the info above."}

## ACTIONS YOU CAN SUGGEST
- If visitor wants to buy: Direct them to the product in the store section.
- If visitor wants to book: Offer to help them schedule via the booking form.
- If visitor wants to know pricing: Share the prices listed above.
- If visitor is a returning lead: Acknowledge their interest and offer personalized help.
`;
}

/**
 * Get role-specific instructions for the AI.
 */
function getRoleInstructions(roleId: string): string {
  const instructions: Record<string, string> = {
    fitness_coach: "Focus on promoting workout plans and meal plans. Encourage booking a trial session.",
    barber: "Answer questions about services, pricing, working hours, and location. Help book appointments.",
    side_hustler: "Showcase products and help with orders. Be enthusiastic about the products.",
    job_seeker: "Answer recruiter questions about skills, experience, and availability. Be professional.",
    student: "Highlight projects, skills, and enthusiasm. Keep it energetic and authentic.",
    real_estate: "Answer property questions, share listing details, and encourage scheduling a viewing.",
    artist: "Share information about music, upcoming shows, and merchandise. Be creative in tone.",
    event_organizer: "Help with RSVPs, event details, location info, and schedule questions.",
    store_manager: "Answer questions about products, availability, pricing, and store hours.",
    high_ticket_coach: "Qualify leads by asking about their challenges and budget before booking a call.",
    networker: "Share contact information and encourage saving the vCard. Be concise and professional.",
    motivational_speaker: "Share teachings and wisdom. Promote upcoming events and premium content subscriptions.",
    stock_analyst: "Share market insights from posted content. Add disclaimer that this is not financial advice.",
    ngo_member: "Share the mission story and impact numbers. Make it easy for visitors to donate or volunteer.",
    video_editor: "Showcase the portfolio, discuss turnaround times and pricing packages.",
    marketing_manager: "Highlight campaign results and case studies. Position as an expert.",
    sales_manager: "Share product catalog, address objections, and capture lead information.",
    social_media_manager: "Show managed account results and growth metrics. Promote available packages.",
    lawyer: "NEVER give legal advice. Pre-qualify by asking about their legal issue type. Always add disclaimer.",
    online_tutor: "Answer questions about subjects, qualifications, availability, and pricing.",
    freelancer: "Share portfolio highlights, turnaround time, and rates. Encourage hiring.",
    content_creator: "Engage fans, promote new content and merch. Collect emails for newsletter.",
  };

  return instructions[roleId]
    ? `## ROLE-SPECIFIC INSTRUCTIONS\n${instructions[roleId]}`
    : "";
}

/**
 * Build a context from a creator's database records.
 */
export async function buildContextFromDB(prisma: any, userId: string): Promise<CreatorContext> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      products: { where: { enabled: true }, take: 20 },
      events: { take: 10, orderBy: { date: "asc" } },
      links: { where: { enabled: true }, take: 20 },
    },
  });

  if (!user) {
    return {
      name: "Unknown",
      bio: "",
      role: "personal_brand",
      products: [],
      services: [],
      events: [],
      testimonials: [],
      links: [],
      faqs: [],
      tone: "friendly",
      availability: "",
    };
  }

  return {
    name: user.name || "Creator",
    bio: user.profile?.bio || "",
    role: user.profileRole || "personal_brand",
    products: (user.products || []).map((p: any) => ({
      name: p.name,
      price: p.price,
      description: p.description || "",
    })),
    services: [],
    events: (user.events || []).map((e: any) => ({
      title: e.title,
      date: e.date ? new Date(e.date).toLocaleDateString() : "TBD",
      location: e.location || "Online",
    })),
    testimonials: [],
    links: (user.links || []).map((l: any) => ({
      title: l.title,
      url: l.url,
    })),
    faqs: [],
    tone: "friendly" as const,
    availability: "",
  };
}
