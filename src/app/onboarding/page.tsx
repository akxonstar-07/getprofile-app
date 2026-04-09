"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, Sparkles, Search, ArrowRight } from "lucide-react";
import { ROLES, ROLE_CATEGORIES, type RoleDefinition } from "@/lib/roles";

/* ═══════════════════════════════════════════════════
   BRANDED PLATFORM SVG ICONS
   ═══════════════════════════════════════════════════ */
const PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#E4405F",
    icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#E4405F"/><path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.4a2.9 2.9 0 110-5.8 2.9 2.9 0 010 5.8zm4.7-7.6a1.05 1.05 0 11-2.1 0 1.05 1.05 0 012.1 0z" fill="white"/></svg> },
  { id: "tiktok", label: "TikTok", color: "#000",
    icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#010101"/><path d="M16.8 8.4a3.8 3.8 0 01-2.4-2.9V5h-2.2v9.3a2 2 0 01-2 1.7 2 2 0 01-2-2 2 2 0 012-2c.2 0 .4 0 .5.1V9.8h-.5A4.3 4.3 0 006 14.1a4.3 4.3 0 004.3 4.3 4.3 4.3 0 004.3-4.3v-4a5.5 5.5 0 003.2 1V8.8a3.8 3.8 0 01-.7-.1z" fill="#25F4EE"/></svg> },
  { id: "youtube", label: "YouTube", color: "#FF0000",
    icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#FF0000"/><path d="M10 15.5v-7l6 3.5-6 3.5z" fill="white"/></svg> },
  { id: "twitter", label: "X", color: "#000",
    icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#000"/><path d="M15.7 6h1.8l-3.9 4.5L18 18h-3.4l-2.8-3.7L8.7 18H6.9l4.2-4.8L6.5 6h3.5l2.5 3.3L15.7 6zm-.6 10.8h1l-6.5-8.5h-1.1l6.6 8.5z" fill="white"/></svg> },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2",
    icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#0A66C2"/><path d="M8.5 17.5h-2v-7h2v7zm-1-8a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zm9 8h-2v-3.4c0-.8 0-1.9-1.1-1.9s-1.3.9-1.3 1.8v3.5h-2v-7h1.9v1h0a2.1 2.1 0 011.9-1c2 0 2.4 1.3 2.4 3.1v3.9z" fill="white"/></svg> },
  { id: "spotify", label: "Spotify", color: "#1DB954",
    icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#1DB954"/><path d="M16.5 14.5c-.2 0-.3-.1-.5-.2-1.8-1.1-4-1.3-6.6-.7-.2.1-.4.1-.5-.1-.1-.2-.1-.4.1-.5 2.9-.7 5.3-.4 7.3.8.2.1.3.3.2.5 0 .1-.1.2-.3.2h.3z" fill="white"/></svg> },
  { id: "whatsapp", label: "WhatsApp", color: "#25D366",
    icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#25D366"/><path d="M12 5.5A6.5 6.5 0 005.5 12c0 1.2.3 2.3.9 3.2l-.6 2.2 2.3-.6c.9.5 2 .8 3 .8A6.5 6.5 0 0012 5.5z" fill="white"/></svg> },
  { id: "facebook", label: "Facebook", color: "#1877F2",
    icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#1877F2"/><path d="M16.5 12.5h-2.2V18h-2.8v-5.5H9.8V10h1.7V8.4c0-1.7 1-2.6 2.5-2.6.7 0 1.5.1 1.5.1v1.7h-.8c-.8 0-1.1.5-1.1 1V10h1.9l-.5 2.5z" fill="white"/></svg> },
  { id: "github", label: "GitHub", color: "#333",
    icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#333"/><path d="M12 5.5A6.5 6.5 0 005.5 12c0 2.9 1.9 5.3 4.4 6.2.3.1.4-.1.4-.3v-1.1c-1.8.4-2.2-.8-2.2-.8-.3-.8-.7-1-.7-1-.6-.4 0-.4 0-.4.6 0 1 .7 1 .7.6 1 1.5.7 1.9.5 0-.4.2-.7.4-.9-1.4-.2-2.9-.7-2.9-3.2 0-.7.3-1.3.7-1.7-.1-.2-.3-.8.1-1.7 0 0 .5-.2 1.8.7.5-.2 1.1-.2 1.6-.2.5 0 1.1.1 1.6.2 1.2-.8 1.8-.7 1.8-.7.4.9.2 1.5.1 1.7.4.4.7 1 .7 1.7 0 2.5-1.5 3-2.9 3.2.2.2.4.6.4 1.2v1.8c0 .2.1.4.4.3A6.5 6.5 0 0012 5.5z" fill="white"/></svg> },
  { id: "website", label: "Website", color: "#6366f1",
    icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#6366f1"/><circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" fill="none"/></svg> },
  { id: "telegram", label: "Telegram", color: "#26A5E4",
    icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#26A5E4"/><path d="M17.5 7.2l-2.3 10.8c-.2.7-.6.9-1.2.5l-3.3-2.5-1.6 1.5c-.2.2-.3.3-.6.3l.2-3.3 5.9-5.3c.3-.2-.1-.3-.4-.1l-7.2 4.5-3.1-1c-.7-.2-.7-.7.1-1l12.2-4.7c.6-.2 1 .1.9 1l-.6.8z" fill="white"/></svg> },
  { id: "snapchat", label: "Snapchat", color: "#FFFC00",
    icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#FFFC00"/><path d="M12 6c1.7 0 3.3.8 4 2.5.3.7.2 2 .1 3.1v.2s.4.2.9.2c.4 0 .6-.1.6-.1.3-.1.5 0 .7.1.2.1.3.3.3.5 0 .4-.5.6-.9.7-.1 0-.3.1-.4.1z" fill="#000"/></svg> },
];

/* ═══════════════════════════════════════════════════
   PORTFOLIO / MOBILE TEMPLATES (link.me / hoo.be inspired)
   ═══════════════════════════════════════════════════ */
const PORTFOLIO_TEMPLATES = [
  { id: "agency", name: "Dark Prestige", colors: ["#0f172a", "#1e293b", "#6366f1"], desc: "Bold & professional" },
  { id: "creative", name: "Creator Energy", colors: ["#f97316", "#ec4899", "#fbbf24"], desc: "Vibrant & dynamic" },
  { id: "minimal", name: "Clean Minimal", colors: ["#ffffff", "#f8fafc", "#0f172a"], desc: "Simple & elegant" },
  { id: "luxury", name: "Liquid Glass", colors: ["#0a0a0f", "#6366f1", "#06b6d4"], desc: "Premium & exclusive" },
];

const MOBILE_TEMPLATES = [
  { id: "dark-neo", name: "Dark Neo", colors: ["#0c0f1a", "#6366f1", "#06b6d4"], desc: "Moody & sleek" },
  { id: "light-glass", name: "Light Glass", colors: ["#ffffff", "#f8fafc", "#6366f1"], desc: "Clean & bright" },
  { id: "gradient", name: "Sunset Glow", colors: ["#f97316", "#ec4899", "#6366f1"], desc: "Warm & inviting" },
  { id: "bento", name: "Bento Grid", colors: ["#fafafa", "#18181b", "#a855f7"], desc: "hoo.be style" },
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT — 5-Step Wizard
   ═══════════════════════════════════════════════════ */
export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Step 1: Role Selection
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);
  const [roleSearch, setRoleSearch] = useState("");

  // Step 2: Display Name
  const [displayName, setDisplayName] = useState("");

  // Step 3: Platforms
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});

  // Step 4–5: Templates
  const [portfolioTheme, setPortfolioTheme] = useState("agency");
  const [mobileTheme, setMobileTheme] = useState("dark-neo");

  const TOTAL_STEPS = 5;

  const goStep = (n: number) => {
    setAnimating(true);
    setTimeout(() => { setStep(n); setAnimating(false); }, 200);
  };

  const togglePlatform = (id: string) =>
    setPlatforms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  // Filter roles by search and category
  const filteredRoles = ROLES.filter(r => {
    const matchesSearch = roleSearch === "" ||
      r.label.toLowerCase().includes(roleSearch.toLowerCase()) ||
      r.description.toLowerCase().includes(roleSearch.toLowerCase());
    const matchesCategory = !selectedCategory || r.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const submitOnboarding = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category: selectedRole?.category || "build_brand",
          profileRole: selectedRole?.id || "personal_brand",
          displayName,
          platforms,
          urls,
          portfolioTheme,
          mobileTheme,
        }),
      });
      if (res.ok) router.push("/dashboard");
    } catch { setLoading(false); }
  };

  return (
    <div className="onboarding-bg min-h-screen flex flex-col items-center justify-center p-4">
      {/* Floating orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo — hoo.be inspired minimal */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            getprofile.link
          </h2>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-6 px-4">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: step > i + 1 ? "100%" : step === i + 1 ? "50%" : "0%",
                  background: "linear-gradient(90deg, #6366f1, #06b6d4)",
                }}
              />
            </div>
          ))}
          <span className="text-xs font-bold text-white/40 ml-2">{step}/{TOTAL_STEPS}</span>
        </div>

        {/* Card */}
        <div className={`glass-card p-8 sm:p-10 transition-all duration-200 ${animating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>

          {/* ═══ STEP 1: Pick Your Role (Smart Categories) ═══ */}
          {step === 1 && (
            <div>
              {/* hoo.be-inspired massive headline */}
              <h1 className="text-3xl sm:text-4xl font-black text-white mb-2 leading-tight tracking-tight">
                what do you<br />want to do?
              </h1>
              <p className="text-white/40 mb-6 text-sm">Pick your goal and we'll build the perfect page for you.</p>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2 mb-5">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    !selectedCategory
                      ? "bg-white text-black"
                      : "bg-white/5 text-white/50 hover:bg-white/10"
                  }`}
                >
                  All Roles
                </button>
                {ROLE_CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === c.id
                        ? "bg-white text-black"
                        : "bg-white/5 text-white/50 hover:bg-white/10"
                    }`}
                  >
                    {c.emoji} {c.label}
                  </button>
                ))}
              </div>

              {/* Search */}
              <div className="relative mb-5">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  placeholder='Search roles (e.g. "barber", "lawyer", "coach")'
                  value={roleSearch}
                  onChange={e => setRoleSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/25 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                />
              </div>

              {/* Role Grid */}
              <div className="grid grid-cols-2 gap-2 mb-6 max-h-[320px] overflow-y-auto pr-1" style={{ scrollbarWidth: "thin" }}>
                {filteredRoles.map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r)}
                    className={`relative p-3 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                      selectedRole?.id === r.id
                        ? "border-indigo-500 bg-indigo-500/15"
                        : "border-white/8 bg-white/3 hover:border-white/15 hover:bg-white/5"
                    }`}
                  >
                    {selectedRole?.id === r.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                    <span className="text-xl block mb-1">{r.emoji}</span>
                    <p className="text-xs font-bold text-white leading-tight">{r.label}</p>
                    <p className="text-[10px] text-white/35 mt-0.5 leading-tight">{r.description}</p>
                  </button>
                ))}
                {filteredRoles.length === 0 && (
                  <div className="col-span-2 text-center py-8 text-white/30 text-sm">
                    No roles found. Try a different search term.
                  </div>
                )}
              </div>

              {/* "I'm Not Sure" fallback */}
              <button
                onClick={() => {
                  setSelectedRole({
                    id: "personal_brand", label: "Personal Brand", emoji: "✨",
                    category: "build_brand", categoryLabel: "Build My Brand",
                    description: "A universal page that works for everyone",
                    defaultBlocks: ["social-grid", "link", "image", "form"],
                    proFeatures: ["ai_assistant", "analytics"], price: 9,
                    gradient: "from-indigo-500 to-cyan-500",
                  });
                }}
                className="w-full text-center text-sm text-white/30 hover:text-white/50 transition-colors mb-4"
              >
                I'm not sure — give me a universal template
              </button>

              <button
                onClick={() => goStep(2)}
                disabled={!selectedRole}
                className="w-full py-4 rounded-xl font-bold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/25"
              >
                Continue <ChevronRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          )}

          {/* ═══ STEP 2: Display Name ═══ */}
          {step === 2 && (
            <div>
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">what's your name?</h1>
              <p className="text-white/40 mb-8 text-sm">This is how visitors will see you on your profile.</p>

              <div className="mb-6">
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white text-lg placeholder-white/25 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                  autoFocus
                />
              </div>

              {/* Role confirmation badge */}
              {selectedRole && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10 mb-8">
                  <span className="text-2xl">{selectedRole.emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{selectedRole.label}</p>
                    <p className="text-xs text-white/40">{selectedRole.description}</p>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => goStep(1)} className="px-6 py-4 rounded-xl font-bold text-white/50 border border-white/10 hover:border-white/20 transition-all">
                  <ChevronLeft className="inline w-4 h-4 mr-1" /> Back
                </button>
                <button
                  onClick={() => goStep(3)}
                  disabled={!displayName.trim()}
                  className="flex-1 py-4 rounded-xl font-bold text-white transition-all disabled:opacity-30 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/25"
                >
                  Continue <ChevronRight className="inline w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 3: Connect Platforms ═══ */}
          {step === 3 && (
            <div>
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">connect your world</h1>
              <p className="text-white/40 mb-6 text-sm">Select the platforms you're active on.</p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-6">
                {PLATFORMS.map(p => {
                  const active = platforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`platform-grid-item ${active ? "selected" : ""}`}
                    >
                      {active && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                      <div className="relative">{p.icon}</div>
                      <span className="text-xs font-semibold text-white/70">{p.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Quick URL inputs for selected platforms */}
              {platforms.length > 0 && (
                <div className="space-y-2 mb-6">
                  <h3 className="text-xs font-bold text-white/30 uppercase tracking-widest">Add your handles</h3>
                  {platforms.slice(0, 4).map(pId => {
                    const p = PLATFORMS.find(a => a.id === pId);
                    if (!p) return null;
                    return (
                      <div key={pId} className="flex items-center gap-2">
                        <div className="flex-shrink-0">{p.icon}</div>
                        <input
                          type="text"
                          placeholder={`@username or url...`}
                          value={urls[pId] || ""}
                          onChange={e => setUrls({ ...urls, [pId]: e.target.value })}
                          className="flex-1 p-2.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/25 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                        />
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => goStep(2)} className="px-6 py-4 rounded-xl font-bold text-white/50 border border-white/10 hover:border-white/20 transition-all">
                  <ChevronLeft className="inline w-4 h-4 mr-1" /> Back
                </button>
                <button onClick={() => goStep(4)} className="flex-1 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                  Continue <ChevronRight className="inline w-4 h-4 ml-1" />
                </button>
              </div>
              <button onClick={() => goStep(4)} className="w-full py-3 mt-2 text-white/30 font-semibold hover:text-white/50 transition-colors text-sm">
                Skip for now
              </button>
            </div>
          )}

          {/* ═══ STEP 4: Choose Your Look ═══ */}
          {step === 4 && (
            <div>
              <h1 className="text-3xl font-black text-white mb-2 tracking-tight">choose your look</h1>
              <p className="text-white/40 mb-6 text-sm">Pick a style for your web landing page and mobile bio page.</p>

              {/* Web Template */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">
                  Web Landing Page
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {PORTFOLIO_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setPortfolioTheme(t.id)}
                      className={`rounded-2xl border-2 overflow-hidden transition-all hover:scale-[1.03] ${
                        portfolioTheme === t.id ? "border-indigo-500 ring-1 ring-indigo-500/30" : "border-white/10"
                      }`}
                    >
                      <div className="aspect-[4/3] relative" style={{ background: t.colors[0] }}>
                        <div className="absolute bottom-0 inset-x-0 h-1/2" style={{ background: `linear-gradient(135deg, ${t.colors[2]}, ${t.colors[1]})`, opacity: 0.6 }} />
                        <div className="absolute bottom-2 left-2 right-2">
                          <div className="w-4 h-4 rounded-full mb-1" style={{ background: t.colors[2] }} />
                          <div className="h-1 w-12 rounded" style={{ background: t.colors[2], opacity: 0.6 }} />
                        </div>
                      </div>
                      <div className="p-2 bg-white/5">
                        <p className="text-[11px] font-bold text-white text-center">{t.name}</p>
                        <p className="text-[9px] text-white/30 text-center">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Template */}
              <div className="mb-6">
                <h3 className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">
                  Mobile Bio Link
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {MOBILE_TEMPLATES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setMobileTheme(t.id)}
                      className={`rounded-2xl border-2 overflow-hidden transition-all hover:scale-[1.03] ${
                        mobileTheme === t.id ? "border-cyan-500 ring-1 ring-cyan-500/30" : "border-white/10"
                      }`}
                    >
                      <div className="aspect-[9/16] relative rounded-xl mx-1 mt-1" style={{ background: t.colors[0] }}>
                        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full" style={{ background: t.colors[1], opacity: 0.5 }} />
                        {[0, 1, 2].map(i => (
                          <div key={i} className="absolute left-2 right-2 h-3 rounded-lg" style={{
                            background: `linear-gradient(90deg, ${t.colors[1]}, ${t.colors[2]})`,
                            opacity: 0.5 - i * 0.1,
                            top: `${55 + i * 18}%`
                          }} />
                        ))}
                      </div>
                      <div className="p-2 bg-white/5">
                        <p className="text-[11px] font-bold text-white text-center">{t.name}</p>
                        <p className="text-[9px] text-white/30 text-center">{t.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => goStep(3)} className="px-6 py-4 rounded-xl font-bold text-white/50 border border-white/10 hover:border-white/20 transition-all">
                  <ChevronLeft className="inline w-4 h-4 mr-1" /> Back
                </button>
                <button onClick={() => goStep(5)} className="flex-1 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                  Almost done <ChevronRight className="inline w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 5: Launch ═══ */}
          {step === 5 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2 tracking-tight">you're all set!</h1>
                <p className="text-white/40 text-sm">Here's a summary of your new getprofile.link page.</p>
              </div>

              {/* Summary Cards */}
              <div className="space-y-3 mb-8">
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-2xl">{selectedRole?.emoji || "✨"}</span>
                  <div>
                    <p className="text-xs text-white/40">Your Role</p>
                    <p className="text-sm font-bold text-white">{selectedRole?.label || "Personal Brand"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-2xl">👤</span>
                  <div>
                    <p className="text-xs text-white/40">Display Name</p>
                    <p className="text-sm font-bold text-white">{displayName}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-2xl">🎨</span>
                  <div>
                    <p className="text-xs text-white/40">Templates</p>
                    <p className="text-sm font-bold text-white">
                      {PORTFOLIO_TEMPLATES.find(t => t.id === portfolioTheme)?.name} + {MOBILE_TEMPLATES.find(t => t.id === mobileTheme)?.name}
                    </p>
                  </div>
                </div>
                {platforms.length > 0 && (
                  <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                    <span className="text-2xl">🔗</span>
                    <div>
                      <p className="text-xs text-white/40">Connected Platforms</p>
                      <p className="text-sm font-bold text-white">{platforms.length} platforms</p>
                    </div>
                  </div>
                )}

                {/* Pro Trial Badge */}
                <div className="p-4 rounded-xl bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 border border-indigo-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="w-4 h-4 text-indigo-400" />
                    <p className="text-sm font-bold text-indigo-300">14-Day Pro Trial Active</p>
                  </div>
                  <p className="text-xs text-white/40">All Pro features including AI Assistant are unlocked for 14 days.</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => goStep(4)} className="px-6 py-4 rounded-xl font-bold text-white/50 border border-white/10 hover:border-white/20 transition-all">
                  <ChevronLeft className="inline w-4 h-4 mr-1" /> Back
                </button>
                <button
                  onClick={submitOnboarding}
                  disabled={loading}
                  className="flex-1 py-4 rounded-xl font-black text-white bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500 hover:shadow-xl hover:shadow-indigo-500/30 transition-all disabled:opacity-50 gradient-shift-bg"
                  style={{ backgroundSize: "200% 200%" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="40 60" /></svg>
                      Building your page...
                    </span>
                  ) : (
                    <>Launch My Page <ArrowRight className="inline w-4 h-4 ml-1" /></>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
