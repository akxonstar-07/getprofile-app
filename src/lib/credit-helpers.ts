// ═══════════════════════════════════════════════════
// Creator Credits — Helpers & Eligibility
// ═══════════════════════════════════════════════════

/** Roles eligible to RECEIVE credits (creators/individuals only, NOT businesses) */
const ELIGIBLE_ROLES = new Set([
  "personal_brand",
  "content_creator",
  "artist",
  "motivational_speaker",
  "stock_analyst",
  "fitness_coach",
  "high_ticket_coach",
  "online_tutor",
  "freelancer",
  "video_editor",
  "side_hustler",
  "collector",
]);

/** Check if a role can receive creator credits */
export function isCreditsEligible(profileRole: string): boolean {
  return ELIGIBLE_ROLES.has(profileRole);
}

/** Format large numbers: 1245 → "1.2K", 89200 → "89.2K" */
export function formatCompact(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return n.toString();
}

/** Default credit packs (tiered pricing) */
export const DEFAULT_PACKS = [
  { id: "pack1", label: "☕ Starter", credits: 5, price: 49, perCredit: 9.8 },
  { id: "pack2", label: "💎 Popular", credits: 25, price: 199, perCredit: 7.96, popular: true },
  { id: "pack3", label: "🔥 Superfan", credits: 100, price: 699, perCredit: 6.99 },
];

/** Platform fee (10%) */
export const PLATFORM_FEE_PERCENT = 10;

/** Calculate creator's earnings after platform fee */
export function creatorEarnings(amount: number): number {
  return amount * (1 - PLATFORM_FEE_PERCENT / 100);
}

/** Get perk list from credit config */
export function getPerks(config: {
  perkDiscount?: number | null;
  perkContent?: boolean;
  perkEarlyAccess?: boolean;
  perkCustom?: string | null;
}): { icon: string; text: string }[] {
  const perks: { icon: string; text: string }[] = [];
  if (config.perkDiscount) perks.push({ icon: "🏷️", text: `${config.perkDiscount}% discount on all products` });
  if (config.perkContent) perks.push({ icon: "🔓", text: "Access to exclusive content" });
  if (config.perkEarlyAccess) perks.push({ icon: "⚡", text: "Early access to new drops" });
  if (config.perkCustom) perks.push({ icon: "✨", text: config.perkCustom });
  if (perks.length === 0) perks.push({ icon: "💜", text: "Support this creator" });
  return perks;
}
