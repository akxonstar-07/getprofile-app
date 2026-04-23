// ═══════════════════════════════════════════════════
// getprofile.link — Role → Sidebar Map (Stage 6 + Phase 8)
// Maps each profileRole to visible dashboard sections
// ═══════════════════════════════════════════════════

export interface RoleSidebarConfig {
  showStore: boolean;      // Mini Store page
  showEvents: boolean;     // Event Hub page
  showBookings: boolean;   // Bookings & Calls (Pro)
  showPromo: boolean;      // Discount Engine (Pro)
  showPortfolio: boolean;  // Portfolio/Gallery page
  showAutoDM: boolean;     // DM Automation (MAX)
  showChannels: boolean;   // Channels — WhatsApp/Telegram (MAX)
  showCRM: boolean;        // Mini CRM Pipeline (MAX)
  showCredits: boolean;    // Creator Credits (PRO) — Phase 9
  roleLabel: string;       // Display label for sidebar
}

/**
 * Returns which dashboard sections are visible for a given profileRole.
 * This ensures a Job Seeker doesn't see "Mini Store" and a Barber doesn't see "Event Hub".
 */
export function getSidebarConfigForRole(profileRole: string): RoleSidebarConfig {
  const configs: Record<string, RoleSidebarConfig> = {
    // ═══ SELL roles ═══
    fitness_coach:     { showStore: true,  showEvents: true,  showBookings: true,  showPromo: true,  showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Fitness Coach" },
    side_hustler:      { showStore: true,  showEvents: false, showBookings: false, showPromo: true,  showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: true,  roleLabel: "Side-Hustler" },
    store_manager:     { showStore: true,  showEvents: false, showBookings: false, showPromo: true,  showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: false, roleLabel: "Store Manager" },
    artist:            { showStore: true,  showEvents: true,  showBookings: false, showPromo: false, showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: true,  roleLabel: "Artist / Musician" },
    collector:         { showStore: true,  showEvents: false, showBookings: false, showPromo: true,  showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: true,  roleLabel: "Collector / Reseller" },

    // ═══ GET HIRED roles ═══
    job_seeker:        { showStore: false, showEvents: false, showBookings: false, showPromo: false, showPortfolio: true,  showAutoDM: false, showChannels: false, showCRM: false, showCredits: false, roleLabel: "Job Seeker" },
    student:           { showStore: false, showEvents: false, showBookings: false, showPromo: false, showPortfolio: true,  showAutoDM: false, showChannels: false, showCRM: false, showCredits: false, roleLabel: "Student / Intern" },
    freelancer:        { showStore: true,  showEvents: false, showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Freelancer" },
    video_editor:      { showStore: true,  showEvents: false, showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Video Editor / Designer" },

    // ═══ BUILD BRAND roles ═══
    content_creator:   { showStore: true,  showEvents: true,  showBookings: false, showPromo: true,  showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: true,  roleLabel: "Content Creator" },
    high_ticket_coach: { showStore: true,  showEvents: true,  showBookings: true,  showPromo: true,  showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "High-Ticket Coach" },
    motivational_speaker: { showStore: true, showEvents: true, showBookings: true, showPromo: false, showPortfolio: false, showAutoDM: true, showChannels: true, showCRM: false, showCredits: true,  roleLabel: "Speaker" },
    stock_analyst:     { showStore: true,  showEvents: false, showBookings: false, showPromo: false, showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: true,  roleLabel: "Stock Analyst" },
    marketing_manager: { showStore: false, showEvents: false, showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: false, roleLabel: "Marketing Manager" },
    sales_manager:     { showStore: true,  showEvents: false, showBookings: true,  showPromo: true,  showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: false, roleLabel: "Sales Manager" },
    social_media_manager: { showStore: true, showEvents: false, showBookings: true, showPromo: false, showPortfolio: true, showAutoDM: true, showChannels: true, showCRM: true, showCredits: false, roleLabel: "Social Media Manager" },

    // ═══ SERVE COMMUNITY roles ═══
    barber:            { showStore: true,  showEvents: false, showBookings: true,  showPromo: true,  showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: false, roleLabel: "Local Service Pro" },
    real_estate:       { showStore: true,  showEvents: true,  showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: false, roleLabel: "Real Estate" },
    event_organizer:   { showStore: true,  showEvents: true,  showBookings: false, showPromo: true,  showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: false, roleLabel: "Event Organizer" },
    lawyer:            { showStore: true,  showEvents: false, showBookings: true,  showPromo: false, showPortfolio: false, showAutoDM: true,  showChannels: false, showCRM: true,  showCredits: false, roleLabel: "Lawyer" },
    online_tutor:      { showStore: true,  showEvents: true,  showBookings: true,  showPromo: true,  showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: true,  roleLabel: "Online Tutor" },
    ngo_member:        { showStore: true,  showEvents: true,  showBookings: false, showPromo: false, showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: false, roleLabel: "NGO / Charity" },
    networker:         { showStore: false, showEvents: false, showBookings: true,  showPromo: false, showPortfolio: false, showAutoDM: false, showChannels: false, showCRM: false, showCredits: false, roleLabel: "Networker" },
  };

  // Default: show everything (fallback for personal_brand or unknown roles)
  return configs[profileRole] || {
    showStore: true,
    showEvents: true,
    showBookings: true,
    showPromo: true,
    showPortfolio: true,
    showAutoDM: true,
    showChannels: true,
    showCRM: true,
    showCredits: true,
    roleLabel: "Creator",
  };
}

/**
 * Check if a specific Pro feature is included in a role's Pro plan.
 */
export function roleHasProFeature(profileRole: string, feature: string): boolean {
  const roleFeatures: Record<string, string[]> = {
    fitness_coach:     ["ai_assistant", "gated_content", "booking_scheduler", "discount_engine"],
    side_hustler:      ["ai_assistant", "discount_engine", "visitor_recognition"],
    store_manager:     ["ai_assistant", "discount_engine", "review_collector"],
    artist:            ["ai_assistant", "gated_content", "fan_collection"],
    collector:         ["ai_assistant", "discount_engine"],
    job_seeker:        ["ai_assistant", "analytics", "pdf_export"],
    student:           ["custom_themes", "analytics"],
    freelancer:        ["ai_assistant", "store_product", "custom_domain"],
    video_editor:      ["ai_assistant", "store_product", "custom_domain"],
    content_creator:   ["ai_assistant", "gated_content", "discount_engine", "analytics"],
    high_ticket_coach: ["ai_assistant", "gated_content", "booking_scheduler", "discount_engine", "lead_qualifier"],
    motivational_speaker: ["ai_assistant", "gated_content", "fan_collection"],
    stock_analyst:     ["ai_assistant", "gated_content", "fan_collection"],
    marketing_manager: ["ai_assistant", "lead_capture", "analytics"],
    sales_manager:     ["ai_assistant", "lead_capture", "discount_engine", "analytics"],
    social_media_manager: ["ai_assistant", "store_product", "lead_capture"],
    barber:            ["ai_assistant", "booking_scheduler", "review_collector", "whatsapp"],
    real_estate:       ["ai_assistant", "event_hub", "lead_capture", "analytics"],
    event_organizer:   ["ai_assistant", "guest_management"],
    lawyer:            ["ai_assistant", "booking_scheduler", "lead_qualifier"],
    online_tutor:      ["ai_assistant", "gated_content", "booking_scheduler"],
    ngo_member:        ["ai_assistant", "donation_tracker", "event_hub"],
    networker:         ["ai_assistant", "scan_analytics"],
  };

  const features = roleFeatures[profileRole] || ["ai_assistant"];
  return features.includes(feature);
}
