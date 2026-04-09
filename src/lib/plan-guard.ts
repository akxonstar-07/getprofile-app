// ═══════════════════════════════════════════════════
// getprofile.link — Plan Guard (Stage 6)
// Middleware for checking user plan status
// ═══════════════════════════════════════════════════

export type PlanStatus = "FREE" | "TRIAL" | "TRIAL_EXPIRED" | "PRO";

export interface PlanInfo {
  status: PlanStatus;
  isPro: boolean;        // Has Pro features right now (TRIAL or PRO)
  isTrialActive: boolean;
  trialDaysLeft: number;
  plan: string;
}

/**
 * Determine the current plan status for a user.
 * Accounts for trial expiration.
 */
export function getUserPlanInfo(user: {
  plan: string;
  trialEndsAt: Date | string | null;
}): PlanInfo {
  const now = new Date();
  const plan = user.plan || "FREE";
  const trialEnd = user.trialEndsAt ? new Date(user.trialEndsAt) : null;

  // Already a paying Pro user
  if (plan === "PRO") {
    return {
      status: "PRO",
      isPro: true,
      isTrialActive: false,
      trialDaysLeft: 0,
      plan: "PRO",
    };
  }

  // Active trial
  if (plan === "TRIAL" && trialEnd && trialEnd > now) {
    const msLeft = trialEnd.getTime() - now.getTime();
    const daysLeft = Math.ceil(msLeft / (1000 * 60 * 60 * 24));
    return {
      status: "TRIAL",
      isPro: true, // Trial users get Pro features
      isTrialActive: true,
      trialDaysLeft: daysLeft,
      plan: "TRIAL",
    };
  }

  // Trial expired — downgrade to FREE
  if (plan === "TRIAL" && trialEnd && trialEnd <= now) {
    return {
      status: "TRIAL_EXPIRED",
      isPro: false,
      isTrialActive: false,
      trialDaysLeft: 0,
      plan: "FREE",
    };
  }

  // Default: Free user
  return {
    status: "FREE",
    isPro: false,
    isTrialActive: false,
    trialDaysLeft: 0,
    plan: "FREE",
  };
}

/**
 * Check if a specific feature is available for the user's current plan.
 */
export function canAccessFeature(
  planInfo: PlanInfo,
  feature: string,
  userProFeatures: string[]
): boolean {
  // Pro users can access everything
  if (planInfo.isPro) return true;

  // Free users can only access non-pro features
  const proOnlyFeatures = [
    "ai_assistant",
    "gated_content",
    "booking_scheduler",
    "discount_engine",
    "visitor_recognition",
    "lead_qualifier",
    "fan_collection",
    "review_collector",
    "custom_domain",
    "analytics",
    "pdf_export",
    "scan_analytics",
    "donation_tracker",
    "whatsapp",
    "lead_capture",
    "guest_management",
    "event_hub",
    "store_product",
    "custom_themes",
  ];

  return !proOnlyFeatures.includes(feature);
}
