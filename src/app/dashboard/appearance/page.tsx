"use client";

import { useState, useEffect } from "react";
import { Save, CheckCircle2, MonitorSmartphone, Palette, Layout, Link2 } from "lucide-react";

// The Elite Templates exactly matching the Public Profile capabilities
const TEMPLATES = [
  {
    id: "komi-neon", name: "Neon Matrix", category: "Creator",
    bg: "#050505", accent: "#D2FF00", isDark: true,
    preview: { banner: "linear-gradient(135deg, #1A0B2E, #050505)", cardBg: "#050505", text: "#FFF", linkBg: "#111" },
  },
  {
    id: "linkme-b2b", name: "Enterprise Dark", category: "Agency",
    bg: "#000000", accent: "#ffffff", isDark: true,
    preview: { banner: "#000000", cardBg: "#111111", text: "#ffffff", linkBg: "#222" },
  },
  {
    id: "minimal-white", name: "Minimalist Light", category: "Brand",
    bg: "#f5f5f7", accent: "#000000", isDark: false,
    preview: { banner: "#ffffff", cardBg: "#ffffff", text: "#000000", linkBg: "#f0f0f0" },
  }
];

const FONTS = [
  { name: "Anton", sample: "ANTON // BOLD" },
  { name: "Inter", sample: "Inter // Clean" },
  { name: "Space Grotesk", sample: "SPACE // TECH" }
];

/* ── Neo-Brutalist Template Card ── */
function TemplateCard({ t, active }: { t: typeof TEMPLATES[0]; active: boolean }) {
  return (
    <div className={`overflow-hidden rounded-[2rem] border-[4px] p-2 transition-all duration-300 ${active ? 'border-[#D2FF00] scale-[1.02] shadow-[0_0_30px_rgba(210,255,0,0.15)] bg-white/5' : 'border-white/5 hover:border-white/20 bg-black'}`}>
      <div className="rounded-[1.5rem] overflow-hidden aspect-[4/5] relative" style={{ background: t.preview.cardBg }}>
        {/* Banner */}
        <div className="h-1/3 relative" style={{ background: t.preview.banner }} />
        {/* Avatar */}
        <div className="absolute top-[25%] left-1/2 -translate-x-1/2 w-12 h-12 rounded-2xl border-4" style={{ backgroundColor: '#444', borderColor: t.preview.cardBg }} />
        
        {/* Content */}
        <div className="px-4 pt-10 pb-4 space-y-3 flex flex-col items-center">
          <div className="w-20 h-2 rounded-full" style={{ background: t.preview.text, opacity: 0.8 }} />
          <div className="w-16 h-1.5 rounded-full" style={{ background: t.preview.text, opacity: 0.4 }} />
          
          <div className="w-full h-8 rounded-xl mt-4 border border-white/5" style={{ background: t.preview.linkBg }} />
          <div className="w-full h-8 rounded-xl border border-white/5" style={{ background: t.preview.linkBg }} />
        </div>
      </div>
      <div className="mt-4 px-2 pb-2 text-center">
         <h4 className="font-komi text-2xl text-white uppercase tracking-tighter">{t.name}</h4>
         <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D2FF00] mt-1">{t.category}</p>
      </div>
    </div>
  );
}

export default function AppearancePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState({
    activeTemplateId: "komi-neon", 
    font: "Anton",
    // Preserving legacy fields to avoid breaking old accounts
    theme: "komi-neon", bgColor: "#050505", accentColor: "#D2FF00", layoutStyle: "minimal",
  });

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(d => {
      if (d.user?.profile) {
        setForm(prev => ({
          ...prev,
          activeTemplateId: d.user.profile.activeTemplateId || "komi-neon",
          font: d.user.profile.font || "Anton",
        }));
      }
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    await fetch("/api/profile", {
      method: "PUT", 
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false); setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  }

  if (loading) return <div className="py-32 flex flex-col items-center justify-center text-white/50 gap-6">
     <div className="w-16 h-16 border-[6px] border-white/10 border-t-[#D2FF00] rounded-full animate-spin" />
     <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D2FF00]">LOADING ENGINE...</p>
  </div>;

  return (
    <div className="max-w-6xl mx-auto flex flex-col xl:flex-row items-start gap-12 relative z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Editor Panel */}
      <div className="flex-1 w-full space-y-12">
        
        <div className="bg-black border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D2FF00]/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-6">
                <Palette className="w-6 h-6 text-[#D2FF00]" />
                <h1 className="font-komi text-5xl text-white uppercase tracking-tighter leading-none">Aesthetic Engine</h1>
             </div>
             <p className="text-white/50 text-sm font-medium">Deploy high-conversion visual templates to your public Link-in-Bio profile.</p>
           </div>
        </div>

        {/* ── Temple Selector ── */}
        <div className="bg-[#050505] border border-white/10 p-10 rounded-[3rem] shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <Layout className="w-5 h-5 text-white/40" />
            <h2 className="font-komi text-3xl text-white uppercase tracking-tight">Core Architecture</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TEMPLATES.map(t => (
              <button key={t.id} onClick={() => setForm({ ...form, activeTemplateId: t.id, theme: t.id, bgColor: t.bg, accentColor: t.accent })} className="text-left w-full focus:outline-none">
                <TemplateCard t={t} active={form.activeTemplateId === t.id} />
              </button>
            ))}
          </div>
        </div>

        {/* ── Typography Override ── */}
        <div className="bg-[#050505] border border-white/10 p-10 rounded-[3rem] shadow-2xl">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="font-komi text-3xl text-white uppercase tracking-tight">Typography Override</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FONTS.map(f => (
              <button key={f.name} onClick={() => setForm({ ...form, font: f.name })}
                className={`p-6 rounded-[1.5rem] border transition-all text-left ${form.font === f.name ? "bg-[#D2FF00] border-[#D2FF00] text-black shadow-[0_0_20px_rgba(210,255,0,0.2)]" : "bg-black border-white/10 text-white/50 hover:border-white/30"}`}>
                <span className="font-black text-sm uppercase tracking-widest block mb-1">{f.name}</span>
                <span className={`${f.name === 'Anton' ? 'font-komi text-2xl uppercase' : 'font-sans opacity-60'}`}>{f.sample}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex items-center justify-between bg-black border border-white/10 p-6 rounded-[2rem] shadow-2xl sticky bottom-6 z-50">
           <div className="hidden md:flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#D2FF00] animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Ready to Deploy</span>
           </div>
           
           <div className="flex items-center gap-4 w-full md:w-auto">
             {success && (
               <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-[#D2FF00] animate-fade-in">
                 <CheckCircle2 className="w-4 h-4" /> Assets Deployed
               </div>
             )}
             <button onClick={handleSave} disabled={saving} className="w-full md:w-auto bg-white hover:bg-[#D2FF00] text-black px-10 py-5 rounded-2xl font-komi text-2xl uppercase tracking-widest transition-all focus:outline-none flex justify-center items-center gap-3">
               <Save className="w-5 h-5" />
               {saving ? "Deploying..." : "Publish Changes"}
             </button>
           </div>
        </div>

      </div>

      {/* Hardware Preview Phone */}
      <div className="hidden xl:flex w-[400px] flex-col sticky top-12 items-center">
         <div className="bg-white/5 px-6 py-2 rounded-full border border-white/10 mb-6 flex items-center gap-2">
            <MonitorSmartphone className="w-4 h-4 text-[#D2FF00]" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Live Engine Preview</span>
         </div>
         
         {/* Apple hardware mockup border */}
         <div className="w-[380px] h-[780px] bg-black rounded-[3.5rem] border-[12px] border-[#111] shadow-2xl overflow-hidden relative ring-1 ring-white/10">
            {/* Dynamic Island */}
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-black rounded-full z-50 flex items-center justify-between px-3">
               <div className="w-3 h-3 rounded-full bg-[#111] border border-white/10" />
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
            </div>

            {/* Simulated iframe content of the *new* public profile engine */}
            <div className="w-full h-full bg-[#050505] p-6 pt-20 flex flex-col items-center border-t border-white/5">
                <div className="w-24 h-24 rounded-2xl bg-[#111] border border-white/10 mb-4" />
                <h3 className="font-komi text-4xl text-white uppercase tracking-tighter">Your Name</h3>
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em] mb-10">@username</p>
                
                <div className="w-full grid grid-cols-2 gap-3">
                   <div className="col-span-2 aspect-[3/1] rounded-2xl bg-white/5 border border-white/10" />
                   <div className="col-span-1 aspect-square rounded-2xl bg-white/5 border border-white/10" />
                   <div className="col-span-1 aspect-square rounded-2xl bg-white/5 border border-white/10" />
                   <div className="col-span-2 h-16 rounded-2xl bg-white/5 border border-white/10" />
                </div>
            </div>
         </div>
      </div>

    </div>
  );
}
