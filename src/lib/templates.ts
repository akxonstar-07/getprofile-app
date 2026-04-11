/* ═══════════════════════════════════════════════════════════════
   GETPROFILE 2026 — TEMPLATE ENGINE
   15+ Premium Mobile Landing Page Templates
   Inspired by: link.me, hopp.bio, komi.io, pop.store, onlylinks.com
   ═══════════════════════════════════════════════════════════════ */

export interface TemplateConfig {
  id: string;
  name: string;
  category: string;
  description: string;
  // Visual DNA
  headerStyle: "full-bleed" | "split" | "minimal-avatar" | "offset" | "gradient-overlay";
  colorScheme: {
    bg: string;
    card: string;
    text: string;
    accent: string;
    secondary: string;
  };
  font: string;
  buttonStyle: "pill" | "rounded" | "square" | "outlined" | "ghost";
  buttonRadius: string;
  // Layout
  avatarShape: "circle" | "rounded-square" | "hexagon";
  cardStyle: "flat" | "shadow" | "glass" | "bordered" | "gradient";
  spacing: "compact" | "normal" | "spacious";
  // Preview colors for gallery thumbnail
  previewColors: string[];
  previewGradient: string;
}

// ─── Template Category Filters ───
export const TEMPLATE_CATEGORIES = [
  { id: "all", label: "All", emoji: "" },
  { id: "store", label: "Store", emoji: "🛍️" },
  { id: "content_creators", label: "Content Creators", emoji: "🎬" },
  { id: "sport_fitness", label: "Sport & Fitness", emoji: "🏋️" },
  { id: "creative", label: "Creative", emoji: "🎨" },
  { id: "food_drink", label: "Food & Drink", emoji: "🍕" },
  { id: "real_estate", label: "Real Estate", emoji: "🏠" },
  { id: "beauty", label: "Beauty", emoji: "💄" },
  { id: "events", label: "Events", emoji: "🎉" },
  { id: "business", label: "Business", emoji: "💼" },
  { id: "fashion", label: "Fashion", emoji: "👗" },
  { id: "wellness", label: "Wellness & Health", emoji: "🧘" },
  { id: "entertainment", label: "Entertainment", emoji: "🎭" },
  { id: "education", label: "Education", emoji: "📚" },
  { id: "music", label: "Music", emoji: "🎵" },
  { id: "tech", label: "Tech & Gaming", emoji: "🎮" },
];

// ─── The 15 Premium Templates ───
export const TEMPLATES: TemplateConfig[] = [
  // 1 — MINIMAL WHITE (like Komi.io / Tomas Alexander)
  {
    id: "minimal-white",
    name: "Minimal White",
    category: "content_creators",
    description: "Clean, elegant & timeless",
    headerStyle: "minimal-avatar",
    colorScheme: { bg: "#ffffff", card: "#f8f9fa", text: "#1a1a2e", accent: "#000000", secondary: "#6b7280" },
    font: "Inter",
    buttonStyle: "outlined",
    buttonRadius: "12px",
    avatarShape: "circle",
    cardStyle: "bordered",
    spacing: "spacious",
    previewColors: ["#ffffff", "#f8f9fa", "#000000"],
    previewGradient: "linear-gradient(135deg, #ffffff, #f0f0f0)",
  },

  // 2 — LAVENDER DREAM (like Naomi Flynn pastel)
  {
    id: "lavender-dream",
    name: "Lavender Dream",
    category: "content_creators",
    description: "Soft pastels & dreamy vibes",
    headerStyle: "full-bleed",
    colorScheme: { bg: "#faf5ff", card: "#f3e8ff", text: "#4c1d95", accent: "#a855f7", secondary: "#c084fc" },
    font: "Outfit",
    buttonStyle: "pill",
    buttonRadius: "999px",
    avatarShape: "circle",
    cardStyle: "glass",
    spacing: "normal",
    previewColors: ["#faf5ff", "#e9d5ff", "#a855f7"],
    previewGradient: "linear-gradient(135deg, #f3e8ff, #e9d5ff)",
  },

  // 3 — FOREST GREEN (like Miles Waller / hopp.bio outdoor)
  {
    id: "forest-explorer",
    name: "Forest Explorer",
    category: "content_creators",
    description: "Nature-inspired & earthy",
    headerStyle: "full-bleed",
    colorScheme: { bg: "#f0fdf4", card: "#dcfce7", text: "#14532d", accent: "#16a34a", secondary: "#4ade80" },
    font: "DM Sans",
    buttonStyle: "rounded",
    buttonRadius: "10px",
    avatarShape: "circle",
    cardStyle: "shadow",
    spacing: "normal",
    previewColors: ["#f0fdf4", "#dcfce7", "#16a34a"],
    previewGradient: "linear-gradient(135deg, #14532d, #16a34a)",
  },

  // 4 — CORAL BOLD (like Shirley Thomas red/coral)
  {
    id: "coral-bold",
    name: "Coral Bold",
    category: "beauty",
    description: "Fiery, bold & unapologetic",
    headerStyle: "gradient-overlay",
    colorScheme: { bg: "#ff6b6b", card: "#ff8787", text: "#ffffff", accent: "#ffffff", secondary: "#ffc9c9" },
    font: "Space Grotesk",
    buttonStyle: "pill",
    buttonRadius: "999px",
    avatarShape: "rounded-square",
    cardStyle: "glass",
    spacing: "compact",
    previewColors: ["#ff6b6b", "#ff8787", "#ffffff"],
    previewGradient: "linear-gradient(135deg, #ff6b6b, #e64980)",
  },

  // 5 — DARK NEO (OnlyLinks / cyberpunk)
  {
    id: "dark-neo",
    name: "Dark Neo",
    category: "entertainment",
    description: "Cyberpunk & futuristic",
    headerStyle: "gradient-overlay",
    colorScheme: { bg: "#0c0f1a", card: "#1a1d2e", text: "#e2e8f0", accent: "#6366f1", secondary: "#06b6d4" },
    font: "JetBrains Mono",
    buttonStyle: "rounded",
    buttonRadius: "10px",
    avatarShape: "hexagon",
    cardStyle: "gradient",
    spacing: "normal",
    previewColors: ["#0c0f1a", "#6366f1", "#06b6d4"],
    previewGradient: "linear-gradient(135deg, #0c0f1a, #1e1b4b)",
  },

  // 6 — SUNSHINE YELLOW (like Jake Rivers retro)
  {
    id: "sunshine-retro",
    name: "Sunshine Retro",
    category: "creative",
    description: "Vintage pop & illustration",
    headerStyle: "offset",
    colorScheme: { bg: "#fefce8", card: "#fef9c3", text: "#1c1917", accent: "#ca8a04", secondary: "#facc15" },
    font: "Clash Display",
    buttonStyle: "square",
    buttonRadius: "4px",
    avatarShape: "rounded-square",
    cardStyle: "bordered",
    spacing: "normal",
    previewColors: ["#fefce8", "#fef9c3", "#ca8a04"],
    previewGradient: "linear-gradient(135deg, #fefce8, #fef08a)",
  },

  // 7 — NAYA BLOOM (Zen / wellness green)
  {
    id: "zen-wellness",
    name: "Zen Wellness",
    category: "wellness",
    description: "Calm, balanced & healing",
    headerStyle: "split",
    colorScheme: { bg: "#f0fdf4", card: "#ecfccb", text: "#1a2e05", accent: "#65a30d", secondary: "#84cc16" },
    font: "Lora",
    buttonStyle: "pill",
    buttonRadius: "999px",
    avatarShape: "circle",
    cardStyle: "flat",
    spacing: "spacious",
    previewColors: ["#f0fdf4", "#ecfccb", "#65a30d"],
    previewGradient: "linear-gradient(135deg, #d9f99d, #a3e635)",
  },

  // 8 — MIDNIGHT LUXURY (pop.store / OnlyLinks dark premium)
  {
    id: "midnight-luxury",
    name: "Midnight Luxury",
    category: "business",
    description: "Premium dark & exclusive",
    headerStyle: "full-bleed",
    colorScheme: { bg: "#0a0a0f", card: "#18181b", text: "#fafafa", accent: "#a78bfa", secondary: "#6366f1" },
    font: "Playfair Display",
    buttonStyle: "ghost",
    buttonRadius: "8px",
    avatarShape: "circle",
    cardStyle: "gradient",
    spacing: "spacious",
    previewColors: ["#0a0a0f", "#a78bfa", "#6366f1"],
    previewGradient: "linear-gradient(135deg, #0a0a0f, #1e1b4b)",
  },

  // 9 — BENTO GRID (hoo.be style)
  {
    id: "bento-grid",
    name: "Bento Grid",
    category: "tech",
    description: "Modular & modern grid",
    headerStyle: "minimal-avatar",
    colorScheme: { bg: "#fafafa", card: "#f4f4f5", text: "#18181b", accent: "#a855f7", secondary: "#ec4899" },
    font: "Inter",
    buttonStyle: "rounded",
    buttonRadius: "12px",
    avatarShape: "rounded-square",
    cardStyle: "shadow",
    spacing: "compact",
    previewColors: ["#fafafa", "#f4f4f5", "#a855f7"],
    previewGradient: "linear-gradient(135deg, #fafafa, #e4e4e7)",
  },

  // 10 — OCEAN BLUE (Kelvin Beachum / sports)
  {
    id: "ocean-athlete",
    name: "Ocean Athlete",
    category: "sport_fitness",
    description: "Dynamic sports energy",
    headerStyle: "full-bleed",
    colorScheme: { bg: "#eff6ff", card: "#dbeafe", text: "#1e3a5f", accent: "#2563eb", secondary: "#60a5fa" },
    font: "Roboto Condensed",
    buttonStyle: "square",
    buttonRadius: "6px",
    avatarShape: "circle",
    cardStyle: "bordered",
    spacing: "normal",
    previewColors: ["#eff6ff", "#dbeafe", "#2563eb"],
    previewGradient: "linear-gradient(135deg, #1e40af, #3b82f6)",
  },

  // 11 — WARM LATTE (Alison Blair / neutral fashion)
  {
    id: "warm-latte",
    name: "Warm Latte",
    category: "fashion",
    description: "Neutral tones & sophistication",
    headerStyle: "split",
    colorScheme: { bg: "#fdf6ee", card: "#fef3e2", text: "#44403c", accent: "#a16207", secondary: "#d97706" },
    font: "Cormorant Garamond",
    buttonStyle: "outlined",
    buttonRadius: "8px",
    avatarShape: "circle",
    cardStyle: "flat",
    spacing: "spacious",
    previewColors: ["#fdf6ee", "#fef3e2", "#a16207"],
    previewGradient: "linear-gradient(135deg, #fef3c7, #fde68a)",
  },

  // 12 — NEON NIGHT (Luna Ray / dancer)
  {
    id: "neon-night",
    name: "Neon Night",
    category: "entertainment",
    description: "Electric & party vibes",
    headerStyle: "gradient-overlay",
    colorScheme: { bg: "#0f172a", card: "#1e293b", text: "#f0f9ff", accent: "#22d3ee", secondary: "#a855f7" },
    font: "Syne",
    buttonStyle: "pill",
    buttonRadius: "999px",
    avatarShape: "hexagon",
    cardStyle: "glass",
    spacing: "compact",
    previewColors: ["#0f172a", "#22d3ee", "#a855f7"],
    previewGradient: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
  },

  // 13 — ROSE GOLD (Anya Calderon / skincare beauty)
  {
    id: "rose-gold",
    name: "Rose Gold",
    category: "beauty",
    description: "Elegant & feminine luxury",
    headerStyle: "full-bleed",
    colorScheme: { bg: "#fdf2f8", card: "#fce7f3", text: "#831843", accent: "#ec4899", secondary: "#f472b6" },
    font: "Poppins",
    buttonStyle: "pill",
    buttonRadius: "999px",
    avatarShape: "circle",
    cardStyle: "shadow",
    spacing: "normal",
    previewColors: ["#fdf2f8", "#fce7f3", "#ec4899"],
    previewGradient: "linear-gradient(135deg, #fdf2f8, #fce7f3)",
  },

  // 14 — PIZZA NIGHT (Rio Blaze / food)
  {
    id: "charcoal-foodie",
    name: "Charcoal Foodie",
    category: "food_drink",
    description: "Dark & appetizing",
    headerStyle: "full-bleed",
    colorScheme: { bg: "#1c1917", card: "#292524", text: "#fafaf9", accent: "#ef4444", secondary: "#f97316" },
    font: "Nunito",
    buttonStyle: "pill",
    buttonRadius: "999px",
    avatarShape: "circle",
    cardStyle: "bordered",
    spacing: "normal",
    previewColors: ["#1c1917", "#ef4444", "#f97316"],
    previewGradient: "linear-gradient(135deg, #1c1917, #44403c)",
  },

  // 15 — MICHAEL JAKE (ultra-minimal monochrome)
  {
    id: "mono-clean",
    name: "Mono Clean",
    category: "business",
    description: "Pure black & white authority",
    headerStyle: "minimal-avatar",
    colorScheme: { bg: "#ffffff", card: "#fafafa", text: "#09090b", accent: "#09090b", secondary: "#71717a" },
    font: "Inter",
    buttonStyle: "outlined",
    buttonRadius: "8px",
    avatarShape: "circle",
    cardStyle: "bordered",
    spacing: "spacious",
    previewColors: ["#ffffff", "#fafafa", "#09090b"],
    previewGradient: "linear-gradient(135deg, #ffffff, #e4e4e7)",
  },

  // 16 — REAL ESTATE PRO
  {
    id: "estate-pro",
    name: "Estate Pro",
    category: "real_estate",
    description: "Trust, authority & listings",
    headerStyle: "full-bleed",
    colorScheme: { bg: "#f8fafc", card: "#f1f5f9", text: "#0f172a", accent: "#059669", secondary: "#10b981" },
    font: "Raleway",
    buttonStyle: "rounded",
    buttonRadius: "8px",
    avatarShape: "rounded-square",
    cardStyle: "shadow",
    spacing: "normal",
    previewColors: ["#f8fafc", "#f1f5f9", "#059669"],
    previewGradient: "linear-gradient(135deg, #f8fafc, #e2e8f0)",
  },

  // 17 — CHRISTINE MORGAN (floral/warm creative)
  {
    id: "peachy-creative",
    name: "Peachy Creative",
    category: "creative",
    description: "Warm peach & artistic",
    headerStyle: "offset",
    colorScheme: { bg: "#fff7ed", card: "#ffedd5", text: "#7c2d12", accent: "#ea580c", secondary: "#fb923c" },
    font: "Caveat",
    buttonStyle: "pill",
    buttonRadius: "999px",
    avatarShape: "circle",
    cardStyle: "flat",
    spacing: "normal",
    previewColors: ["#fff7ed", "#ffedd5", "#ea580c"],
    previewGradient: "linear-gradient(135deg, #fed7aa, #fdba74)",
  },

  // 18 — MILLIE DANIELLE (bold illustrator)
  {
    id: "illustrator-pop",
    name: "Illustrator Pop",
    category: "creative",
    description: "Bold art & color explosion",
    headerStyle: "offset",
    colorScheme: { bg: "#fefce8", card: "#ecfccb", text: "#1a2e05", accent: "#ea580c", secondary: "#16a34a" },
    font: "Fredoka",
    buttonStyle: "rounded",
    buttonRadius: "14px",
    avatarShape: "rounded-square",
    cardStyle: "bordered",
    spacing: "compact",
    previewColors: ["#fefce8", "#ea580c", "#16a34a"],
    previewGradient: "linear-gradient(135deg, #ea580c, #facc15)",
  },
];

// ─── Header Style Options for "Style It Your Way" Modal ───
export const HEADER_STYLES = [
  { id: "full-bleed", label: "Full Bleed", description: "Full-width background image" },
  { id: "split", label: "Split Screen", description: "Image left, info right" },
  { id: "minimal-avatar", label: "Minimal Avatar", description: "Small circular photo" },
  { id: "offset", label: "Offset", description: "Image offset to one side" },
  { id: "gradient-overlay", label: "Gradient Overlay", description: "Image with color wash" },
];

// ─── Color Scheme Presets ───
export const COLOR_SCHEMES = [
  { id: "arctic", label: "Arctic", bg: "#ffffff", card: "#f8f9fa", text: "#1a1a2e", accent: "#000000", secondary: "#6b7280" },
  { id: "midnight", label: "Midnight", bg: "#0a0a0f", card: "#18181b", text: "#fafafa", accent: "#a78bfa", secondary: "#6366f1" },
  { id: "forest", label: "Forest", bg: "#f0fdf4", card: "#dcfce7", text: "#14532d", accent: "#16a34a", secondary: "#4ade80" },
  { id: "lavender", label: "Lavender", bg: "#faf5ff", card: "#f3e8ff", text: "#4c1d95", accent: "#a855f7", secondary: "#c084fc" },
  { id: "coral", label: "Coral", bg: "#fff1f2", card: "#ffe4e6", text: "#881337", accent: "#f43f5e", secondary: "#fb7185" },
  { id: "ocean", label: "Ocean", bg: "#eff6ff", card: "#dbeafe", text: "#1e3a5f", accent: "#2563eb", secondary: "#60a5fa" },
  { id: "sunset", label: "Sunset", bg: "#fff7ed", card: "#ffedd5", text: "#7c2d12", accent: "#ea580c", secondary: "#f97316" },
  { id: "rose", label: "Rosé", bg: "#fdf2f8", card: "#fce7f3", text: "#831843", accent: "#ec4899", secondary: "#f472b6" },
  { id: "charcoal", label: "Charcoal", bg: "#1c1917", card: "#292524", text: "#fafaf9", accent: "#ef4444", secondary: "#f97316" },
  { id: "cyber", label: "Cyber", bg: "#0f172a", card: "#1e293b", text: "#f0f9ff", accent: "#22d3ee", secondary: "#a855f7" },
];

// ─── Font Options ───
export const FONT_OPTIONS = [
  { id: "Inter", label: "Inter", preview: "Aa", style: "Modern Sans" },
  { id: "Playfair Display", label: "Playfair", preview: "Aa", style: "Classic Serif" },
  { id: "Space Grotesk", label: "Space", preview: "Aa", style: "Geometric" },
  { id: "DM Sans", label: "DM Sans", preview: "Aa", style: "Friendly" },
  { id: "Clash Display", label: "Clash", preview: "Aa", style: "Bold Display" },
  { id: "Outfit", label: "Outfit", preview: "Aa", style: "Rounded" },
  { id: "Syne", label: "Syne", preview: "Aa", style: "Artistic" },
  { id: "Lora", label: "Lora", preview: "Aa", style: "Elegant Serif" },
  { id: "Poppins", label: "Poppins", preview: "Aa", style: "Universal" },
  { id: "JetBrains Mono", label: "JetBrains", preview: "Aa", style: "Monospace" },
];

// ─── Button Style Options ───
export const BUTTON_STYLES = [
  { id: "pill", label: "Pill", radius: "999px" },
  { id: "rounded", label: "Rounded", radius: "12px" },
  { id: "square", label: "Square", radius: "4px" },
  { id: "outlined", label: "Outlined", radius: "8px" },
  { id: "ghost", label: "Ghost", radius: "8px" },
];

// ─── Utility: Get a template by ID ───
export function getTemplateById(id: string): TemplateConfig {
  return TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
}

// ─── Utility: Filter templates by category ───
export function getTemplatesByCategory(category: string): TemplateConfig[] {
  if (category === "all") return TEMPLATES;
  return TEMPLATES.filter(t => t.category === category);
}
