// ═══════════════════════════════════════════════════
// getprofile.link — Role → Sidebar Map (18 Creator Roles + Business/Agency/Community)
// Maps each profileRole to visible dashboard sections
// ═══════════════════════════════════════════════════

export interface RoleSidebarConfig {
  showStore: boolean;      // Mini Store page
  showEvents: boolean;     // Event Hub page
  showBookings: boolean;   // Bookings & Calls
  showPromo: boolean;      // Discount Engine
  showPortfolio: boolean;  // Portfolio/Gallery page
  showAutoDM: boolean;     // DM Automation
  showChannels: boolean;   // Channels — WhatsApp/Telegram
  showCRM: boolean;        // Mini CRM Pipeline
  showCredits: boolean;    // Creator Credits
  roleLabel: string;       // Display label for sidebar
}

/**
 * Returns which dashboard sections are visible for a given profileRole.
 */
export function getSidebarConfigForRole(profileRole: string): RoleSidebarConfig {
  const configs: Record<string, RoleSidebarConfig> = {
    // ═══ CREATOR ROLES (18) ═══
    content_creator:   { showStore: true,  showEvents: true,  showBookings: false, showPromo: true,  showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Content Creator" },
    artist:            { showStore: true,  showEvents: true,  showBookings: false, showPromo: true,  showPortfolio: true,  showAutoDM: false, showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Artist" },
    designer:          { showStore: true,  showEvents: false, showBookings: true,  showPromo: true,  showPortfolio: true,  showAutoDM: false, showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Designer" },
    video_editor:      { showStore: true,  showEvents: false, showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: false, showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Video Editor" },
    vfx_artist:        { showStore: true,  showEvents: false, showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: false, showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "VFX Artist" },
    public_speaker:    { showStore: true,  showEvents: true,  showBookings: true,  showPromo: false, showPortfolio: false, showAutoDM: false, showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Public Speaker" },
    educator:          { showStore: true,  showEvents: true,  showBookings: true,  showPromo: true,  showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Educator / Tutor" },
    coach_mentor:      { showStore: true,  showEvents: true,  showBookings: true,  showPromo: true,  showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Coach / Mentor" },
    entertainer:       { showStore: true,  showEvents: true,  showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: false, showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Entertainer" },
    writer_publisher:  { showStore: true,  showEvents: true,  showBookings: false, showPromo: true,  showPortfolio: true,  showAutoDM: false, showChannels: false, showCRM: true,  showCredits: true,  roleLabel: "Writer / Publisher" },
    networker:         { showStore: false, showEvents: true,  showBookings: false, showPromo: false, showPortfolio: false, showAutoDM: false, showChannels: false, showCRM: true,  showCredits: true,  roleLabel: "Networker" },
    gamer:             { showStore: true,  showEvents: true,  showBookings: false, showPromo: true,  showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Gamer" },
    realtor:           { showStore: false, showEvents: true,  showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: false, showChannels: true,  showCRM: true,  showCredits: false, roleLabel: "Realtor" },
    fitness_trainer:   { showStore: true,  showEvents: true,  showBookings: true,  showPromo: true,  showPortfolio: false, showAutoDM: false, showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Fitness Trainer" },
    sound_editor:      { showStore: true,  showEvents: false, showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: false, showChannels: true,  showCRM: false, showCredits: true,  roleLabel: "Sound Editor" },
    yoga_trainer:      { showStore: true,  showEvents: true,  showBookings: true,  showPromo: true,  showPortfolio: false, showAutoDM: false, showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Yoga Trainer" },
    podcast_host:      { showStore: true,  showEvents: true,  showBookings: true,  showPromo: false, showPortfolio: false, showAutoDM: false, showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Podcast Host" },
    student:           { showStore: false, showEvents: false, showBookings: false, showPromo: false, showPortfolio: true,  showAutoDM: false, showChannels: false, showCRM: false, showCredits: false, roleLabel: "Student" },

    // ═══ BUSINESS ROLES ═══
    retail_store:         { showStore: true,  showEvents: false, showBookings: false, showPromo: true,  showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: false, roleLabel: "Retail Store" },
    side_hustler:         { showStore: true,  showEvents: false, showBookings: false, showPromo: true,  showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: false, roleLabel: "Side-Hustler" },
    local_business:       { showStore: true,  showEvents: false, showBookings: true,  showPromo: true,  showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: false, roleLabel: "Local Business" },
    professional_service: { showStore: true,  showEvents: false, showBookings: true,  showPromo: false, showPortfolio: false, showAutoDM: true,  showChannels: false, showCRM: true,  showCredits: false, roleLabel: "Professional" },
    real_estate:          { showStore: true,  showEvents: true,  showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: false, roleLabel: "Real Estate" },
    it_firm:              { showStore: false, showEvents: false, showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: false, roleLabel: "IT Firm" },
    import_export:        { showStore: true,  showEvents: false, showBookings: false, showPromo: false, showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: false, roleLabel: "Import/Export" },
    ngo_member:           { showStore: true,  showEvents: true,  showBookings: false, showPromo: false, showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: false, roleLabel: "NGO / Charity" },

    // ═══ AGENCY ROLES ═══
    digital_marketing_agency: { showStore: false, showEvents: false, showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: false, roleLabel: "Digital Agency" },
    talent_agency:            { showStore: false, showEvents: false, showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: false, roleLabel: "Talent Agency" },
    influencer_agency:        { showStore: false, showEvents: false, showBookings: true,  showPromo: false, showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: false, roleLabel: "Influencer Agency" },
    travel_agency:            { showStore: true,  showEvents: true,  showBookings: true,  showPromo: true,  showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: false, roleLabel: "Travel Agency" },
    event_organizer:          { showStore: true,  showEvents: true,  showBookings: false, showPromo: true,  showPortfolio: true,  showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: false, roleLabel: "Event Organizer" },

    // ═══ COMMUNITY ROLES ═══
    discord_admin:            { showStore: false, showEvents: true,  showBookings: false, showPromo: false, showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Discord Admin" },
    facebook_group_admin:     { showStore: false, showEvents: true,  showBookings: false, showPromo: false, showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "FB Group Admin" },
    subreddit_mod:            { showStore: false, showEvents: false, showBookings: false, showPromo: false, showPortfolio: false, showAutoDM: false, showChannels: false, showCRM: true,  showCredits: true,  roleLabel: "Reddit Mod" },
    online_community_manager: { showStore: false, showEvents: true,  showBookings: false, showPromo: false, showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Community Manager" },
    local_community_leader:   { showStore: false, showEvents: true,  showBookings: false, showPromo: false, showPortfolio: false, showAutoDM: false, showChannels: true,  showCRM: true,  showCredits: true,  roleLabel: "Community Leader" },
    social_media_page_admin:  { showStore: false, showEvents: false, showBookings: false, showPromo: false, showPortfolio: false, showAutoDM: true,  showChannels: true,  showCRM: false, showCredits: true,  roleLabel: "Page Admin" },
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
    // Creator roles
    content_creator:   ["ai_assistant", "gated_content", "discount_engine", "analytics", "dm_automation"],
    artist:            ["ai_assistant", "gated_content", "fan_collection"],
    designer:          ["ai_assistant", "store_product", "custom_domain", "discount_engine"],
    video_editor:      ["ai_assistant", "store_product", "custom_domain"],
    vfx_artist:        ["ai_assistant", "store_product", "custom_domain"],
    public_speaker:    ["ai_assistant", "booking_scheduler", "event_hub", "analytics"],
    educator:          ["ai_assistant", "gated_content", "booking_scheduler", "dm_automation"],
    coach_mentor:      ["ai_assistant", "gated_content", "booking_scheduler", "discount_engine", "dm_automation"],
    entertainer:       ["ai_assistant", "gated_content", "fan_collection", "event_hub"],
    writer_publisher:  ["ai_assistant", "gated_content", "discount_engine", "analytics"],
    networker:         ["ai_assistant", "scan_analytics"],
    gamer:             ["ai_assistant", "gated_content", "dm_automation", "discount_engine"],
    realtor:           ["ai_assistant", "event_hub", "lead_capture", "analytics"],
    fitness_trainer:   ["ai_assistant", "gated_content", "booking_scheduler", "discount_engine"],
    sound_editor:      ["ai_assistant", "store_product", "custom_domain"],
    yoga_trainer:      ["ai_assistant", "gated_content", "booking_scheduler", "discount_engine"],
    podcast_host:      ["ai_assistant", "gated_content", "analytics"],
    student:           ["custom_themes", "analytics"],
    // Business roles
    retail_store:         ["ai_assistant", "discount_engine", "review_collector"],
    side_hustler:         ["ai_assistant", "discount_engine", "visitor_recognition"],
    local_business:       ["ai_assistant", "booking_scheduler", "review_collector", "whatsapp"],
    professional_service: ["ai_assistant", "booking_scheduler", "lead_qualifier"],
    real_estate:          ["ai_assistant", "event_hub", "lead_capture", "analytics"],
    it_firm:              ["ai_assistant", "lead_qualifier", "analytics"],
    import_export:        ["ai_assistant", "lead_capture", "custom_domain"],
    ngo_member:           ["ai_assistant", "donation_tracker", "event_hub"],
    // Agency roles
    digital_marketing_agency: ["ai_assistant", "lead_capture", "analytics"],
    talent_agency:            ["ai_assistant", "booking_scheduler", "custom_domain"],
    influencer_agency:        ["ai_assistant", "store_product", "lead_capture"],
    travel_agency:            ["ai_assistant", "booking_scheduler", "lead_capture"],
    event_organizer:          ["ai_assistant", "guest_management"],
    // Community roles
    discord_admin:            ["ai_assistant", "dm_automation", "community_analytics"],
    facebook_group_admin:     ["ai_assistant", "dm_automation", "community_analytics"],
    subreddit_mod:            ["ai_assistant", "community_analytics"],
    online_community_manager: ["ai_assistant", "dm_automation", "crm", "community_analytics"],
    local_community_leader:   ["ai_assistant", "event_management"],
    social_media_page_admin:  ["ai_assistant", "dm_automation", "analytics"],
  };

  const features = roleFeatures[profileRole] || ["ai_assistant"];
  return features.includes(feature);
}
