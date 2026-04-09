// ═══════════════════════════════════════════════════
// getprofile.link — Block System (Stage 2)
// Modular content blocks for role-based profiles
// ═══════════════════════════════════════════════════

export interface BlockDefinition {
  type: string;
  label: string;
  icon: string; // Lucide icon name
  description: string;
  proOnly: boolean;
  defaultData: Record<string, any>;
}

export const BLOCKS: BlockDefinition[] = [
  // ── Core Blocks (Free) ──
  {
    type: "link",
    label: "Link",
    icon: "Link",
    description: "A clickable button linking to any URL",
    proOnly: false,
    defaultData: { title: "My Link", url: "", icon: "" },
  },
  {
    type: "social-grid",
    label: "Social Grid",
    icon: "Share2",
    description: "A grid of your social media icons",
    proOnly: false,
    defaultData: { platforms: [] },
  },
  {
    type: "image",
    label: "Image / Gallery",
    icon: "Image",
    description: "Photo gallery or portfolio showcase",
    proOnly: false,
    defaultData: { images: [], layout: "grid" },
  },
  {
    type: "video",
    label: "Video Embed",
    icon: "Play",
    description: "YouTube, TikTok, or direct video embed",
    proOnly: false,
    defaultData: { url: "", provider: "youtube" },
  },

  // ── Commerce Blocks ──
  {
    type: "store-product",
    label: "Store / Products",
    icon: "ShoppingBag",
    description: "Display and sell your products or services",
    proOnly: false,
    defaultData: { layout: "grid", maxFree: 3 },
  },
  {
    type: "pricing-table",
    label: "Pricing / Services",
    icon: "DollarSign",
    description: "Display your service packages and prices",
    proOnly: false,
    defaultData: { packages: [] },
  },

  // ── Trust & Social Proof ──
  {
    type: "testimonial",
    label: "Testimonials / Reviews",
    icon: "Star",
    description: "Display client reviews and ratings",
    proOnly: true,
    defaultData: { reviews: [], layout: "carousel" },
  },
  {
    type: "stats-counter",
    label: "Stats Counter",
    icon: "TrendingUp",
    description: "Animated counters for followers, projects, etc.",
    proOnly: false,
    defaultData: { stats: [{ label: "Projects", value: 0 }] },
  },

  // ── Location & Events ──
  {
    type: "map",
    label: "Location Map",
    icon: "MapPin",
    description: "Show your physical location with business hours",
    proOnly: false,
    defaultData: { address: "", lat: 0, lng: 0, hours: {} },
  },
  {
    type: "event",
    label: "Events / Calendar",
    icon: "Calendar",
    description: "Upcoming events with RSVP functionality",
    proOnly: false,
    defaultData: { events: [] },
  },

  // ── Lead Capture & Communication ──
  {
    type: "form",
    label: "Contact Form",
    icon: "MessageSquare",
    description: "Capture visitor inquiries and feedback",
    proOnly: false,
    defaultData: { fields: ["name", "email", "message"] },
  },
  {
    type: "booking",
    label: "Book a Call / Appointment",
    icon: "Phone",
    description: "Built-in scheduling with pre-qualification",
    proOnly: true,
    defaultData: { availableDays: [], timeSlots: [], duration: 30 },
  },

  // ── Special Blocks ──
  {
    type: "qr-code",
    label: "QR Code",
    icon: "QrCode",
    description: "Scannable QR code for offline sharing",
    proOnly: false,
    defaultData: { branded: false },
  },
  {
    type: "gated-content",
    label: "Subscriber-Only Content",
    icon: "Lock",
    description: "Lock content behind a subscription paywall",
    proOnly: true,
    defaultData: { tier: "basic", price: 5, content: {} },
  },
  {
    type: "quote-of-day",
    label: "Quote / Highlight",
    icon: "Quote",
    description: "A featured quote, verse, or daily message",
    proOnly: false,
    defaultData: { text: "", author: "" },
  },
  {
    type: "before-after",
    label: "Before / After Showcase",
    icon: "Columns",
    description: "Side-by-side comparison of your work",
    proOnly: false,
    defaultData: { before: "", after: "", label: "" },
  },
  {
    type: "disclaimer",
    label: "Disclaimer / Legal",
    icon: "AlertTriangle",
    description: "Legal disclaimers for regulated professions",
    proOnly: false,
    defaultData: { text: "" },
  },
];

// ═══ Helper Functions ═══
export function getBlockByType(type: string): BlockDefinition | undefined {
  return BLOCKS.find(b => b.type === type);
}

export function getFreeBlocks(): BlockDefinition[] {
  return BLOCKS.filter(b => !b.proOnly);
}

export function getProBlocks(): BlockDefinition[] {
  return BLOCKS.filter(b => b.proOnly);
}
