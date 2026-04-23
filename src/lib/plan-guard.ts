// ═══════════════════════════════════════════════════
// getprofile.link — Plan Guard (Stage 6 + Phase 8)
// Middleware for checking user plan status
// ═══════════════════════════════════════════════════

export type PlanStatus = "FREE" | "TRIAL" | "TRIAL_EXPIRED" | "PRO" | "MAX";

export interface PlanInfo {
  status: PlanStatus;
  isPro: boolean;        // Has Pro features right now (TRIAL, PRO, or MAX)
  isMax: boolean;        // Has MAX features (DM Automation, Channels, CRM)
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

  // MAX plan — gets everything
  if (plan === "MAX") {
    return {
      status: "MAX",
      isPro: true,
      isMax: true,
      isTrialActive: false,
      trialDaysLeft: 0,
      plan: "MAX",
    };
  }

  // Already a paying Pro user
  if (plan === "PRO") {
    return {
      status: "PRO",
      isPro: true,
      isMax: false,
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
      isMax: false,
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
      isMax: false,
      isTrialActive: false,
      trialDaysLeft: 0,
      plan: "FREE",
    };
  }

  // Default: Free user
  return {
    status: "FREE",
    isPro: false,
    isMax: false,
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
  // MAX-only features
  const maxOnlyFeatures = [
    "dm_automation",
    "channels",
    "crm",
    "social_integrations",
    "flow_builder",
    "global_triggers",
  ];

  if (maxOnlyFeatures.includes(feature)) {
    return planInfo.isMax;
  }

  // Pro users can access everything else
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
    "creator_credits",
  ];

  return !proOnlyFeatures.includes(feature);
}
