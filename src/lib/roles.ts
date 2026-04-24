// ═══════════════════════════════════════════════════
// getprofile.link — Role Definitions (22 Roles)
// Stage 2: The Template Engine
// ═══════════════════════════════════════════════════

export interface RoleDefinition {
  id: string;
  label: string;
  emoji: string;
  category: "sell" | "get_hired" | "build_brand" | "serve_community";
  categoryLabel: string;
  description: string;
  defaultBlocks: string[];
  proFeatures: string[];
  price: number; // Monthly Pro price in USD
  gradient: string;
  accountType: "CREATOR" | "BUSINESS" | "AGENCY" | "ALL";
}

export const ROLE_CATEGORIES = [
  { id: "sell", label: "I want to Sell", emoji: "🛒", description: "Sell products, services, and digital goods" },
  { id: "get_hired", label: "I want to Get Hired", emoji: "💼", description: "Showcase your work and land opportunities" },
  { id: "build_brand", label: "I want to Build My Brand", emoji: "⭐", description: "Grow your audience and monetize your expertise" },
  { id: "serve_community", label: "I want to Serve My Community", emoji: "🤝", description: "Connect with clients and serve your local area" },
] as const;

export const ROLES: RoleDefinition[] = [
  // ═══ CREATOR ROLES ═══
  {
    id: "fitness_coach",
    label: "Fitness Coach",
    emoji: "🏋️",
    category: "sell",
    categoryLabel: "I want to Sell",
    description: "Show workouts, sell meal plans, book training sessions",
    defaultBlocks: ["social-grid", "video", "store-product", "testimonial", "booking", "link"],
    proFeatures: ["ai_assistant", "gated_content", "booking_scheduler", "discount_engine"],
    price: 9,
    gradient: "from-orange-500 to-red-500",
    accountType: "CREATOR"
  },
  {
    id: "artist",
    label: "Artist / Musician",
    emoji: "🎤",
    category: "sell",
    categoryLabel: "I want to Sell",
    description: "Press kit with music, tour dates, and merch",
    defaultBlocks: ["social-grid", "video", "event", "store-product", "image", "link"],
    proFeatures: ["ai_assistant", "gated_content", "fan_collection"],
    price: 9,
    gradient: "from-purple-500 to-fuchsia-500",
    accountType: "CREATOR"
  },
  {
    id: "collector",
    label: "Collector / Reseller",
    emoji: "👟",
    category: "sell",
    categoryLabel: "I want to Sell",
    description: "Show off and sell your collection",
    defaultBlocks: ["image", "store-product", "social-grid", "link"],
    proFeatures: ["ai_assistant", "discount_engine"],
    price: 9,
    gradient: "from-amber-500 to-orange-500",
    accountType: "CREATOR"
  },
  {
    id: "job_seeker",
    label: "Job Seeker",
    emoji: "💼",
    category: "get_hired",
    categoryLabel: "I want to Get Hired",
    description: "Replace your PDF resume with a living portfolio",
    defaultBlocks: ["social-grid", "image", "stats-counter", "link", "form"],
    proFeatures: ["ai_assistant", "analytics", "pdf_export"],
    price: 5,
    gradient: "from-blue-500 to-indigo-500",
    accountType: "CREATOR"
  },
  {
    id: "student",
    label: "Student / Intern",
    emoji: "🎓",
    category: "get_hired",
    categoryLabel: "I want to Get Hired",
    description: "Show personality and potential to employers",
    defaultBlocks: ["social-grid", "image", "link", "qr-code"],
    proFeatures: ["custom_themes", "analytics"],
    price: 3,
    gradient: "from-cyan-500 to-blue-500",
    accountType: "CREATOR"
  },
  {
    id: "freelancer",
    label: "Freelancer (Writer, Photographer)",
    emoji: "✏️",
    category: "get_hired",
    categoryLabel: "I want to Get Hired",
    description: "Send a portfolio link instantly, show rates, get hired",
    defaultBlocks: ["image", "pricing-table", "testimonial", "social-grid", "form", "link"],
    proFeatures: ["ai_assistant", "store_product", "custom_domain"],
    price: 9,
    gradient: "from-violet-500 to-purple-500",
    accountType: "CREATOR"
  },
  {
    id: "video_editor",
    label: "Video Editor / Designer",
    emoji: "🎬",
    category: "get_hired",
    categoryLabel: "I want to Get Hired",
    description: "Show your reel, display pricing, get hired fast",
    defaultBlocks: ["video", "before-after", "pricing-table", "testimonial", "form", "link"],
    proFeatures: ["ai_assistant", "store_product", "custom_domain"],
    price: 9,
    gradient: "from-red-500 to-pink-500",
    accountType: "CREATOR"
  },
  {
    id: "content_creator",
    label: "Content Creator / Influencer",
    emoji: "📱",
    category: "build_brand",
    categoryLabel: "I want to Build My Brand",
    description: "Monetize your following with links, store, and fan engagement",
    defaultBlocks: ["social-grid", "link", "store-product", "video", "event"],
    proFeatures: ["ai_assistant", "gated_content", "discount_engine", "analytics"],
    price: 9,
    gradient: "from-pink-500 to-amber-400",
    accountType: "CREATOR"
  },
  {
    id: "motivational_speaker",
    label: "Motivational / Spiritual Speaker",
    emoji: "🙏",
    category: "build_brand",
    categoryLabel: "I want to Build My Brand",
    description: "Build a following, share teachings, sell books/courses",
    defaultBlocks: ["video", "quote-of-day", "event", "store-product", "social-grid", "link"],
    proFeatures: ["ai_assistant", "gated_content", "fan_collection"],
    price: 9,
    gradient: "from-indigo-400 to-purple-500",
    accountType: "CREATOR"
  },
  {
    id: "online_tutor",
    label: "Online Tutor",
    emoji: "📚",
    category: "serve_community",
    categoryLabel: "I want to Serve My Community",
    description: "Show subjects, qualifications, book and pay for lessons",
    defaultBlocks: ["pricing-table", "testimonial", "booking", "store-product", "social-grid", "link"],
    proFeatures: ["ai_assistant", "gated_content", "booking_scheduler"],
    price: 7,
    gradient: "from-amber-500 to-orange-500",
    accountType: "CREATOR"
  },
  {
    id: "networker",
    label: "Offline Networker / Conference Attendee",
    emoji: "🤝",
    category: "serve_community",
    categoryLabel: "I want to Serve My Community",
    description: "Replace paper business cards with a digital hub",
    defaultBlocks: ["social-grid", "form", "qr-code", "link"],
    proFeatures: ["ai_assistant", "scan_analytics"],
    price: 5,
    gradient: "from-indigo-500 to-blue-500",
    accountType: "CREATOR"
  },

  // ═══ BUSINESS ROLES ═══
  {
    id: "retail_store",
    label: "Retail Store / Shop",
    emoji: "🏪",
    category: "sell",
    categoryLabel: "I want to Sell",
    description: "Digital storefront with catalog, offers, and reviews",
    defaultBlocks: ["store-product", "map", "pricing-table", "testimonial", "qr-code", "link"],
    proFeatures: ["ai_assistant", "discount_engine", "review_collector"],
    price: 9,
    gradient: "from-emerald-500 to-teal-500",
    accountType: "BUSINESS"
  },
  {
    id: "side_hustler",
    label: "Side-Hustler / Home Seller",
    emoji: "🍰",
    category: "sell",
    categoryLabel: "I want to Sell",
    description: "List products, take orders, look professional",
    defaultBlocks: ["social-grid", "store-product", "testimonial", "link", "qr-code"],
    proFeatures: ["ai_assistant", "discount_engine", "visitor_recognition"],
    price: 9,
    gradient: "from-pink-500 to-rose-500",
    accountType: "BUSINESS"
  },
  {
    id: "local_business",
    label: "Local Business (Cafe, Gym, Salon)",
    emoji: "💇",
    category: "serve_community",
    categoryLabel: "I want to Serve My Community",
    description: "Show prices, take bookings, share location",
    defaultBlocks: ["pricing-table", "image", "map", "booking", "testimonial", "qr-code", "link"],
    proFeatures: ["ai_assistant", "booking_scheduler", "review_collector", "whatsapp"],
    price: 7,
    gradient: "from-teal-500 to-cyan-500",
    accountType: "BUSINESS"
  },
  {
    id: "professional_service",
    label: "Professional Services (Lawyer, Accountant)",
    emoji: "⚖️",
    category: "serve_community",
    categoryLabel: "I want to Serve My Community",
    description: "Build credibility, show expertise, capture inquiries",
    defaultBlocks: ["social-grid", "testimonial", "booking", "disclaimer", "form", "link"],
    proFeatures: ["ai_assistant", "booking_scheduler", "lead_qualifier"],
    price: 12,
    gradient: "from-slate-500 to-gray-600",
    accountType: "BUSINESS"
  },
  {
    id: "real_estate",
    label: "Real Estate / Properties",
    emoji: "🏡",
    category: "serve_community",
    categoryLabel: "I want to Serve My Community",
    description: "Show listings, capture leads, host open houses",
    defaultBlocks: ["image", "map", "event", "form", "social-grid", "link"],
    proFeatures: ["ai_assistant", "event_hub", "lead_capture", "analytics"],
    price: 12,
    gradient: "from-rose-500 to-orange-500",
    accountType: "BUSINESS"
  },
  {
    id: "it_firm",
    label: "IT Firm / Software Agency",
    emoji: "💻",
    category: "get_hired",
    categoryLabel: "I want to Get Hired",
    description: "Showcase case studies, technical stack, book consultations",
    defaultBlocks: ["image", "testimonial", "stats-counter", "booking", "link"],
    proFeatures: ["ai_assistant", "lead_qualifier", "analytics"],
    price: 15,
    gradient: "from-blue-600 to-indigo-600",
    accountType: "BUSINESS"
  },
  {
    id: "import_export",
    label: "Import / Export Business",
    emoji: "🚢",
    category: "sell",
    categoryLabel: "I want to Sell",
    description: "Global trade, product catalogs, contact forms",
    defaultBlocks: ["image", "store-product", "map", "form", "link"],
    proFeatures: ["ai_assistant", "lead_capture", "custom_domain"],
    price: 15,
    gradient: "from-sky-500 to-blue-700",
    accountType: "BUSINESS"
  },
  {
    id: "ngo_member",
    label: "NGO / Charity",
    emoji: "❤️",
    category: "serve_community",
    categoryLabel: "I want to Serve My Community",
    description: "Tell your cause, collect donations, recruit volunteers",
    defaultBlocks: ["image", "video", "event", "form", "social-grid", "link"],
    proFeatures: ["ai_assistant", "donation_tracker", "event_hub"],
    price: 7,
    gradient: "from-red-500 to-rose-500",
    accountType: "BUSINESS"
  },

  // ═══ AGENCY ROLES ═══
  {
    id: "digital_marketing_agency",
    label: "Digital Marketing Agency",
    emoji: "📈",
    category: "build_brand",
    categoryLabel: "I want to Build My Brand",
    description: "Professional brand, case studies, thought leadership",
    defaultBlocks: ["image", "stats-counter", "testimonial", "social-grid", "form", "link"],
    proFeatures: ["ai_assistant", "lead_capture", "analytics"],
    price: 19,
    gradient: "from-sky-500 to-blue-500",
    accountType: "AGENCY"
  },
  {
    id: "talent_agency",
    label: "Talent / Casting Agency",
    emoji: "🌟",
    category: "get_hired",
    categoryLabel: "I want to Get Hired",
    description: "Manage talent rosters, show headshots, book talent",
    defaultBlocks: ["image", "video", "social-grid", "booking", "form", "link"],
    proFeatures: ["ai_assistant", "booking_scheduler", "custom_domain"],
    price: 29,
    gradient: "from-purple-500 to-pink-500",
    accountType: "AGENCY"
  },
  {
    id: "influencer_agency",
    label: "Influencer Management Agency",
    emoji: "📱",
    category: "build_brand",
    categoryLabel: "I want to Build My Brand",
    description: "Showcase managed accounts, display growth, get clients",
    defaultBlocks: ["image", "stats-counter", "pricing-table", "testimonial", "form", "link"],
    proFeatures: ["ai_assistant", "store_product", "lead_capture"],
    price: 29,
    gradient: "from-pink-500 to-violet-500",
    accountType: "AGENCY"
  },
  {
    id: "travel_agency",
    label: "Travel Agency",
    emoji: "✈️",
    category: "serve_community",
    categoryLabel: "I want to Serve My Community",
    description: "Showcase destinations, book trips, display reviews",
    defaultBlocks: ["image", "video", "map", "booking", "testimonial", "link"],
    proFeatures: ["ai_assistant", "booking_scheduler", "lead_capture"],
    price: 19,
    gradient: "from-cyan-400 to-blue-500",
    accountType: "AGENCY"
  },
  {
    id: "event_organizer",
    label: "Event Management Agency",
    emoji: "🎉",
    category: "serve_community",
    categoryLabel: "I want to Serve My Community",
    description: "One link for RSVPs, location, schedule, and photos",
    defaultBlocks: ["event", "map", "image", "social-grid", "link"],
    proFeatures: ["ai_assistant", "guest_management"],
    price: 19,
    gradient: "from-yellow-500 to-pink-500",
    accountType: "AGENCY"
  }
];

// ═══ Helper Functions ═══
export function getRoleById(id: string): RoleDefinition | undefined {
  return ROLES.find(r => r.id === id);
}

export function getRolesByCategory(category: string): RoleDefinition[] {
  return ROLES.filter(r => r.category === category);
}

export function getRolesByAccountType(type: "CREATOR" | "BUSINESS" | "AGENCY" | "ALL"): RoleDefinition[] {
  if (type === "ALL") return ROLES;
  return ROLES.filter(r => r.accountType === type || r.accountType === "ALL");
}

export function getDefaultRole(): RoleDefinition {
  return {
    id: "personal_brand",
    label: "Personal Brand",
    emoji: "✨",
    category: "build_brand",
    categoryLabel: "I want to Build My Brand",
    description: "A universal template that works for everyone",
    defaultBlocks: ["social-grid", "link", "image", "form"],
    proFeatures: ["ai_assistant", "analytics"],
    price: 9,
    gradient: "from-indigo-500 to-cyan-500",
    accountType: "CREATOR"
  };
}
