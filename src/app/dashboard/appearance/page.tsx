"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2, Smartphone } from "lucide-react";

const TEMPLATES = [
  {
    id: "default", name: "Indigo",       category: "Minimal",
    bg: "#ffffff", accent: "#6366f1", isDark: false,
    preview: { banner: "linear-gradient(135deg,#6366f1,#6366f1aa)", cardBg: "#fff", text: "#0f172a", linkBg: "linear-gradient(135deg,#6366f1,#818cf8)" },
  },
  {
    id: "dark",    name: "Night",        category: "Dark",
    bg: "#0c0f1a", accent: "#818cf8", isDark: true,
    preview: { banner: "linear-gradient(135deg,#818cf8,#6366f1)", cardBg: "#0f172a", text: "#f1f5f9", linkBg: "linear-gradient(135deg,#818cf8,#6d28d9)" },
  },
  {
    id: "warm",    name: "Sunset",       category: "Gradient",
    bg: "#fff7ed", accent: "#f97316", isDark: false,
    preview: { banner: "linear-gradient(135deg,#f97316,#fbbf24)", cardBg: "#fff7ed", text: "#7c2d12", linkBg: "linear-gradient(135deg,#f97316,#fbbf24)" },
  },
  {
    id: "ocean",   name: "Ocean",        category: "Gradient",
    bg: "#f0fdff", accent: "#0891b2", isDark: false,
    preview: { banner: "linear-gradient(135deg,#0891b2,#06b6d4)", cardBg: "#ecfeff", text: "#164e63", linkBg: "linear-gradient(135deg,#0891b2,#22d3ee)" },
  },
  {
    id: "forest",  name: "Forest",       category: "Minimal",
    bg: "#f0fdf4", accent: "#16a34a", isDark: false,
    preview: { banner: "linear-gradient(135deg,#16a34a,#22c55e)", cardBg: "#f0fdf4", text: "#14532d", linkBg: "linear-gradient(135deg,#16a34a,#4ade80)" },
  },
  {
    id: "rose",    name: "Rose",         category: "Gradient",
    bg: "#fff1f2", accent: "#f43f5e", isDark: false,
    preview: { banner: "linear-gradient(135deg,#f43f5e,#fb7185)", cardBg: "#fff1f2", text: "#881337", linkBg: "linear-gradient(135deg,#f43f5e,#fb923c)" },
  },
  {
    id: "purple",  name: "Galaxy",       category: "Dark",
    bg: "#0d0b1a", accent: "#a855f7", isDark: true,
    preview: { banner: "linear-gradient(135deg,#a855f7,#7c3aed)", cardBg: "#170f2e", text: "#e9d5ff", linkBg: "linear-gradient(135deg,#a855f7,#6d28d9)" },
  },
  {
    id: "neon",    name: "Neon",         category: "Dark",
    bg: "#050814", accent: "#22d3ee", isDark: true,
    preview: { banner: "linear-gradient(135deg,#22d3ee,#06b6d4)", cardBg: "#060d1f", text: "#a5f3fc", linkBg: "linear-gradient(135deg,#22d3ee,#818cf8)" },
  },
  {
    id: "slate",   name: "Minimal",      category: "Minimal",
    bg: "#f8fafc", accent: "#334155", isDark: false,
    preview: { banner: "linear-gradient(135deg,#334155,#475569)", cardBg: "#f8fafc", text: "#0f172a", linkBg: "linear-gradient(135deg,#334155,#64748b)" },
  },
  {
    id: "gold",    name: "Gold",         category: "Premium",
    bg: "#0d0a00", accent: "#f59e0b", isDark: true,
    preview: { banner: "linear-gradient(135deg,#f59e0b,#d97706)", cardBg: "#1a1200", text: "#fef3c7", linkBg: "linear-gradient(135deg,#f59e0b,#b45309)" },
  },
  {
    id: "spring",  name: "Spring",       category: "Gradient",
    bg: "#fdf4ff", accent: "#d946ef", isDark: false,
    preview: { banner: "linear-gradient(135deg,#d946ef,#a855f7)", cardBg: "#fdf4ff", text: "#701a75", linkBg: "linear-gradient(135deg,#d946ef,#f43f5e)" },
  },
  {
    id: "mono",    name: "Black & White", category: "Minimal",
    bg: "#ffffff", accent: "#000000", isDark: false,
    preview: { banner: "linear-gradient(135deg,#000,#374151)", cardBg: "#fff", text: "#000", linkBg: "linear-gradient(135deg,#000,#374151)" },
  },
];

const FONTS = [
  { name: "Inter",           sample: "Inter — Modern" },
  { name: "Outfit",          sample: "Outfit — Clean" },
  { name: "Poppins",         sample: "Poppins — Friendly" },
  { name: "Space Grotesk",   sample: "Space Grotesk — Bold" },
  { name: "Playfair Display",sample: "Playfair — Elegant" },
  { name: "DM Sans",         sample: "DM Sans — Minimal" },
];

const LAYOUTS = [
  { id: "minimal",      name: "Minimal",      desc: "Clean & distraction-free",  emoji: "⬜" },
  { id: "influencer",   name: "Influencer",   desc: "Bold full-banner look",     emoji: "🌟" },
  { id: "photographer", name: "Photographer", desc: "Photo-first visual grid",   emoji: "📸" },
  { id: "coach",        name: "Coach",        desc: "Trust-building layout",     emoji: "🎯" },
  { id: "brand",        name: "Brand",        desc: "Professional presence",     emoji: "🚀" },
];

/* ── Tiny phone template preview ── */
function TemplatePhone({ t, userName = "Your Name" }: { t: typeof TEMPLATES[0]; userName?: string }) {
  const LINKS = ["My Portfolio", "Latest Video", "Contact Me"];
  return (
    <div className="overflow-hidden rounded-[20px]" style={{ background: t.preview.cardBg, border: `2px solid ${t.accent}30` }}>
      {/* Banner */}
      <div className="h-14 relative" style={{ background: t.preview.banner }}>
        <div className="absolute -bottom-6 left-3">
          <div className="w-12 h-12 rounded-xl border-2 flex items-center justify-center text-sm font-black text-white"
            style={{ borderColor: t.preview.cardBg, background: t.preview.banner, boxShadow: `0 0 0 2px ${t.accent}55` }}>
            {userName[0]?.toUpperCase() || "?"}
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="px-3 pt-8 pb-3 space-y-1.5">
        <p className="text-[9px] font-black" style={{ color: t.preview.text }}>{userName}</p>
        <p className="text-[7px] opacity-50" style={{ color: t.preview.text }}>@username</p>
        {LINKS.map((l, i) => (
          <div key={i} className="flex items-center justify-center gap-1 px-2 py-1.5 rounded-lg text-[7px] font-bold text-white"
            style={{ background: t.preview.linkBg, boxShadow: `0 2px 6px ${t.accent}40` }}>
            {l}
          </div>
        ))}
      </div>
    </div>
  );
}

const CATEGORIES = ["All", "Minimal", "Dark", "Gradient", "Premium"];

export default function AppearancePage() {
  const [loading,         setLoading]         = useState(true);
  const [saving,          setSaving]          = useState(false);
  const [success,         setSuccess]         = useState(false);
  const [activeCat,       setActiveCat]       = useState("All");
  const [form, setForm] = useState({
    theme: "default", font: "Inter",
    bgColor: "#ffffff", accentColor: "#6366f1", layoutStyle: "minimal",
  });

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(d => {
      if (d.user?.profile) {
        setForm({
          theme:       d.user.profile.theme       || "default",
          font:        d.user.profile.font        || "Inter",
          bgColor:     d.user.profile.bgColor     || "#ffffff",
          accentColor: d.user.profile.accentColor || "#6366f1",
          layoutStyle: d.user.profile.layoutStyle || "minimal",
        });
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false); setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  function applyTemplate(t: typeof TEMPLATES[0]) {
    setForm({ ...form, theme: t.id, bgColor: t.bg, accentColor: t.accent });
  }

  const filteredTemplates = activeCat === "All" ? TEMPLATES : TEMPLATES.filter(t => t.category === activeCat);
  const activeTemplate    = TEMPLATES.find(t => t.id === form.theme) || TEMPLATES[0];

  if (loading) return <div className="max-w-5xl space-y-6">{[1, 2, 3].map(i => <div key={i} className="h-40 animate-shimmer rounded-2xl" />)}</div>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-12 relative z-10 w-full">
      
      {/* Center/Left: Live big preview */}
      <div className="lg:w-[320px] flex-shrink-0 flex items-start justify-center sticky top-12 lg:top-24 mt-8 lg:mt-0">
        <div className="scale-[1.1] origin-top">
          <TemplatePhone t={activeTemplate} />
        </div>
      </div>

      {/* Right: Settings */}
      <div className="flex-1 w-full max-w-xl space-y-6">
        <div className="mb-8 pt-8">
          <h1 className="text-2xl font-black text-slate-900 drop-shadow-sm">Appearance</h1>
          <p className="text-slate-500 text-sm mt-1">Choose a template and customize how your public profile looks</p>
        </div>
          <div className="dash-card">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-slate-900">Templates</h2>
              <span className="text-xs text-slate-500">{TEMPLATES.length} designs</span>
            </div>

            {/* Category filter */}
            <div className="flex gap-2 mb-5 flex-wrap">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setActiveCat(cat)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${activeCat === cat ? "gradient-bg text-white shadow-md" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                  {cat}
                </button>
              ))}
            </div>

            {/* Template grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredTemplates.map(t => (
                <button
                  key={t.id}
                  onClick={() => applyTemplate(t)}
                  className={`text-left transition-all hover:scale-[1.03] active:scale-[0.98] ${form.theme === t.id ? "ring-2 ring-indigo-500 ring-offset-2 rounded-[22px]" : ""}`}
                >
                  <TemplatePhone t={t} />
                  <div className="mt-2 px-1 flex items-center justify-between">
                    <p className="text-xs font-bold text-slate-800">{t.name}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full"
                      style={{ background: t.id === form.theme ? "#6366f1" : "#f1f5f9", color: t.id === form.theme ? "#fff" : "#94a3b8" }}>
                      {t.id === form.theme ? "Active" : t.category}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── Custom Colors ── */}
          <div className="dash-card">
            <h2 className="font-bold text-slate-900 mb-5">Custom Colors</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              {[
                { key: "bgColor", label: "Background Color" },
                { key: "accentColor", label: "Accent Color" },
              ].map(({ key, label }) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wide">{label}</label>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input type="color" value={(form as any)[key]}
                        onChange={e => setForm({ ...form, [key]: e.target.value })}
                        className="sr-only" id={`color-${key}`} />
                      <label htmlFor={`color-${key}`}
                        className="w-11 h-11 rounded-xl border-2 border-white shadow-md cursor-pointer block hover:scale-110 transition-transform"
                        style={{ background: (form as any)[key] }} />
                    </div>
                    <input type="text" value={(form as any)[key]}
                      onChange={e => setForm({ ...form, [key]: e.target.value })}
                      className="input-premium font-mono text-sm" placeholder="#6366f1" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Font ── */}
          <div className="dash-card">
            <h2 className="font-bold text-slate-900 mb-5">Typography</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {FONTS.map(f => (
                <button key={f.name} onClick={() => setForm({ ...form, font: f.name })}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all text-left ${form.font === f.name ? "gradient-bg text-white shadow-md shadow-indigo-200" : "border border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 bg-white"}`}>
                  <span style={{ fontFamily: f.name }}>{f.sample}</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── Layout ── */}
          <div className="dash-card">
            <h2 className="font-bold text-slate-900 mb-5">Layout Style</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {LAYOUTS.map(l => (
                <button key={l.id} onClick={() => setForm({ ...form, layoutStyle: l.id })}
                  className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all text-left ${form.layoutStyle === l.id ? "border-2 border-indigo-500 bg-indigo-50" : "border border-slate-200 bg-white hover:border-indigo-200"}`}>
                  <span className="text-2xl">{l.emoji}</span>
                  <div>
                    <p className={`text-sm font-bold ${form.layoutStyle === l.id ? "text-indigo-700" : "text-slate-800"}`}>{l.name}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{l.desc}</p>
                  </div>
                  {form.layoutStyle === l.id && <CheckCircle2 className="w-4 h-4 text-indigo-500 ml-auto flex-shrink-0" />}
                </button>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-4">
            <button onClick={handleSave} disabled={saving} className="btn-primary px-8 py-3">
              <Save className="w-4 h-4" />
              {saving ? "Saving…" : "Save Appearance"}
            </button>
            {success && (
              <div className="flex items-center gap-2 text-sm text-emerald-600 font-semibold animate-fade-in">
                <CheckCircle2 className="w-4 h-4" /> Changes saved!
              </div>
            )}
          </div>
      </div>
    </div>
  );
}
