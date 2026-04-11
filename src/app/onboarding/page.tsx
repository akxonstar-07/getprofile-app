"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, Sparkles, Search, ArrowRight, LayoutTemplate, Palette, Type, MousePointerSquareDashed } from "lucide-react";
import { ROLES, ROLE_CATEGORIES, type RoleDefinition } from "@/lib/roles";
import { TEMPLATES, TEMPLATE_CATEGORIES, HEADER_STYLES, COLOR_SCHEMES, FONT_OPTIONS, BUTTON_STYLES, getTemplatesByCategory, getTemplateById, type TemplateConfig } from "@/lib/templates";

/* ═══════════════════════════════════════════════════
   BRANDED PLATFORM SVG ICONS
   ═══════════════════════════════════════════════════ */
const PLATFORMS = [
  { id: "instagram", label: "Instagram", color: "#E4405F", icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#E4405F"/><path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.4a2.9 2.9 0 110-5.8 2.9 2.9 0 010 5.8zm4.7-7.6a1.05 1.05 0 11-2.1 0 1.05 1.05 0 012.1 0z" fill="white"/></svg> },
  { id: "tiktok", label: "TikTok", color: "#000", icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#010101"/><path d="M16.8 8.4a3.8 3.8 0 01-2.4-2.9V5h-2.2v9.3a2 2 0 01-2 1.7 2 2 0 01-2-2 2 2 0 012-2c.2 0 .4 0 .5.1V9.8h-.5A4.3 4.3 0 006 14.1a4.3 4.3 0 004.3 4.3 4.3 4.3 0 004.3-4.3v-4a5.5 5.5 0 003.2 1V8.8a3.8 3.8 0 01-.7-.1z" fill="#25F4EE"/></svg> },
  { id: "youtube", label: "YouTube", color: "#FF0000", icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#FF0000"/><path d="M10 15.5v-7l6 3.5-6 3.5z" fill="white"/></svg> },
  { id: "twitter", label: "X", color: "#000", icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#000"/><path d="M15.7 6h1.8l-3.9 4.5L18 18h-3.4l-2.8-3.7L8.7 18H6.9l4.2-4.8L6.5 6h3.5l2.5 3.3L15.7 6zm-.6 10.8h1l-6.5-8.5h-1.1l6.6 8.5z" fill="white"/></svg> },
  { id: "linkedin", label: "LinkedIn", color: "#0A66C2", icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#0A66C2"/><path d="M8.5 17.5h-2v-7h2v7zm-1-8a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zm9 8h-2v-3.4c0-.8 0-1.9-1.1-1.9s-1.3.9-1.3 1.8v3.5h-2v-7h1.9v1h0a2.1 2.1 0 011.9-1c2 0 2.4 1.3 2.4 3.1v3.9z" fill="white"/></svg> },
  { id: "spotify", label: "Spotify", color: "#1DB954", icon: <svg viewBox="0 0 24 24" className="w-8 h-8"><rect width="24" height="24" rx="6" fill="#1DB954"/><path d="M16.5 14.5c-.2 0-.3-.1-.5-.2-1.8-1.1-4-1.3-6.6-.7-.2.1-.4.1-.5-.1-.1-.2-.1-.4.1-.5 2.9-.7 5.3-.4 7.3.8.2.1.3.3.2.5 0 .1-.1.2-.3.2h.3z" fill="white"/></svg> },
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT — Onboarding Wizard
   ═══════════════════════════════════════════════════ */
export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Step 1: Role
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);
  const [roleSearch, setRoleSearch] = useState("");

  // Step 2: Name
  const [displayName, setDisplayName] = useState("");

  // Step 3: Platforms
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});

  // Step 4: Template Gallery
  const [templateCategory, setTemplateCategory] = useState("all");
  const filteredTemplates = getTemplatesByCategory(templateCategory);
  
  // Modal State for "Style It Your Way"
  const [showStyleModal, setShowStyleModal] = useState(false);
  const [activeTemplate, setActiveTemplate] = useState<TemplateConfig>(TEMPLATES[0]);
  const [customConfig, setCustomConfig] = useState(TEMPLATES[0]);

  const TOTAL_STEPS = 5;

  const goStep = (n: number) => {
    setAnimating(true);
    setTimeout(() => { setStep(n); setAnimating(false); }, 200);
  };

  const togglePlatform = (id: string) =>
    setPlatforms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const openStyleModal = (template: TemplateConfig) => {
    setActiveTemplate(template);
    setCustomConfig(template);
    setShowStyleModal(true);
  };

  const saveStyleConfig = () => {
    setShowStyleModal(false);
    goStep(5);
  };

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
          activeTemplateId: activeTemplate.id,
          themeConfig: JSON.stringify({
            headerStyle: customConfig.headerStyle,
            colorScheme: customConfig.colorScheme,
            font: customConfig.font,
            buttonStyle: customConfig.buttonStyle
          })
        }),
      });
      if (res.ok) router.push("/dashboard");
    } catch { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      
      {/* Hoo.be Style Sticky Header */}
      <div className="flex items-center justify-between p-6 w-full max-w-5xl mx-auto">
        <h2 className="text-2xl font-black tracking-tighter text-black">
          getprofile<span className="text-indigo-600">.link</span>
        </h2>
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i + 1 ? "bg-black w-8" : "bg-gray-200 w-4"}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-4 w-full">
        <div className={`w-full max-w-2xl transition-all duration-300 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>

          {/* ═══ STEP 1: Role ═══ */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 tracking-tight">What do you do?</h1>
              <p className="text-gray-500 mb-8 text-lg">Pick your role so we can give you the best starting blocks.</p>

              <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder='Search roles (e.g. "barber", "lawyer", "coach")'
                  value={roleSearch}
                  onChange={e => setRoleSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-black placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 mb-8 max-h-[360px] overflow-y-auto px-1">
                {ROLES.filter(r => roleSearch ? r.label.toLowerCase().includes(roleSearch.toLowerCase()) : true).slice(0, 12).map(r => (
                  <button
                    key={r.id}
                    onClick={() => setSelectedRole(r)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all hover:-translate-y-1 ${
                      selectedRole?.id === r.id
                        ? "border-black bg-gray-50 shadow-md"
                        : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                    }`}
                  >
                    <span className="text-3xl block mb-2">{r.emoji}</span>
                    <p className="text-sm font-bold text-black">{r.label}</p>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{r.description}</p>
                  </button>
                ))}
              </div>

              <button
                onClick={() => goStep(2)}
                disabled={!selectedRole}
                className="w-full py-4 rounded-xl font-bold text-white bg-black disabled:opacity-30 disabled:cursor-not-allowed hover:bg-gray-800 transition-all text-lg"
              >
                Continue
              </button>
            </div>
          )}

          {/* ═══ STEP 2: Name ═══ */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 tracking-tight">What's your name?</h1>
              <p className="text-gray-500 mb-8 text-lg">This is how visitors will see you on your profile.</p>

              <div className="mb-8">
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full p-5 bg-white border border-gray-200 rounded-2xl text-black text-2xl font-bold placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button onClick={() => goStep(1)} className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
                  <ChevronLeft className="w-5 h-5 inline" />
                </button>
                <button
                  onClick={() => goStep(3)}
                  disabled={!displayName.trim()}
                  className="flex-1 w-full py-4 rounded-xl font-bold text-white bg-black disabled:opacity-30 hover:bg-gray-800 transition-all text-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 3: Platforms ═══ */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
               <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 tracking-tight">Connect your socials</h1>
               <p className="text-gray-500 mb-8 text-lg">Select the platforms where your audience hangs out.</p>

               <div className="grid grid-cols-3 gap-4 mb-8">
                {PLATFORMS.map(p => {
                  const active = platforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all ${
                        active ? "border-black bg-gray-50 scale-105 shadow-md" : "border-gray-100 bg-white hover:border-gray-200 hover:-translate-y-1"
                      }`}
                    >
                      {p.icon}
                      <span className="text-xs font-bold text-black mt-3">{p.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button onClick={() => goStep(2)} className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
                  <ChevronLeft className="w-5 h-5 inline" />
                </button>
                <button
                  onClick={() => goStep(4)}
                  className="flex-1 w-full py-4 rounded-xl font-bold text-white bg-black hover:bg-gray-800 transition-all text-lg"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ═══ STEP 4: Template Gallery (Wider Container) ═══ */}
        {step === 4 && (
          <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-4 duration-500">
             <div className="text-center mb-8">
               <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 tracking-tight">Pick a template</h1>
               <p className="text-gray-500 text-lg">You can always customize it or change it completely later.</p>
             </div>

             {/* Template Category Filter Strip */}
             <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
                {TEMPLATE_CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setTemplateCategory(c.id)}
                    className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                      templateCategory === c.id 
                        ? "bg-black text-white shadow-md scale-105" 
                        : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:border-gray-300"
                    }`}
                  >
                    {c.emoji && <span className="mr-2">{c.emoji}</span>}
                    {c.label}
                  </button>
                ))}
             </div>

             {/* Template Grid Masonry/Gallery */}
             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mb-12">
               {filteredTemplates.map(template => (
                 <div key={template.id} className="group relative">
                   <button 
                     onClick={() => openStyleModal(template)}
                     className="w-full text-left"
                   >
                     {/* Preview Card */}
                     <div className="aspect-[9/16] rounded-3xl overflow-hidden mb-3 border border-gray-200/50 shadow-sm transition-all duration-300 group-hover:shadow-2xl group-hover:scale-[1.03] relative"
                          style={{ background: template.colorScheme.bg }}>
                        
                        {/* Simulated UI based on Header Style */}
                        {template.headerStyle === 'full-bleed' && (
                          <div className="absolute top-0 inset-x-0 h-1/2" style={{ background: template.previewGradient }} />
                        )}
                        {template.headerStyle === 'gradient-overlay' && (
                          <div className="absolute inset-0 opacity-80" style={{ background: template.previewGradient }} />
                        )}
                        
                        {/* Avatar */}
                        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-16 h-16 bg-white/20 backdrop-blur-md flex items-center justify-center p-1"
                             style={{ borderRadius: template.avatarShape === 'circle' ? '50%' : template.avatarShape === 'rounded-square' ? '16px' : '8px' }}>
                             <div className="w-full h-full rounded-full bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop')` }} />
                        </div>

                        {/* Title text */}
                        <div className="absolute top-[120px] left-0 right-0 text-center">
                           <div className="h-3 w-32 mx-auto rounded-full mb-2" style={{ background: template.colorScheme.text }} />
                           <div className="h-2 w-20 mx-auto rounded-full opacity-60" style={{ background: template.colorScheme.text }} />
                        </div>

                        {/* Buttons/Links mockup */}
                        <div className="absolute top-[180px] left-4 right-4 space-y-3">
                           {[1,2,3].map(i => (
                             <div key={i} className="h-12 w-full flex items-center justify-center shadow-sm"
                                  style={{
                                    background: template.buttonStyle === 'outlined' ? 'transparent' : template.colorScheme.accent,
                                    border: template.buttonStyle === 'outlined' ? `2px solid ${template.colorScheme.accent}` : 'none',
                                    borderRadius: template.buttonRadius
                                  }}>
                                  <div className="h-2 w-24 rounded-full" style={{ background: template.buttonStyle === 'outlined' ? template.colorScheme.accent : '#fff' }} />
                             </div>
                           ))}
                        </div>

                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
                     </div>

                     <h3 className="font-bold text-gray-900 text-sm ml-1">{template.name}</h3>
                     <p className="text-xs text-gray-500 ml-1">{template.description}</p>
                   </button>
                 </div>
               ))}
             </div>
          </div>
        )}

        {/* ═══ STEP 5: Final Launch ═══ */}
        {step === 5 && (
          <div className="w-full max-w-xl animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
             <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-10 h-10 text-indigo-600" />
             </div>
             <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 tracking-tight">You're all set!</h1>
             <p className="text-gray-500 text-lg mb-10">We're setting up your {activeTemplate.name} layout.</p>

             <button
                onClick={submitOnboarding}
                disabled={loading}
                className="w-full py-5 rounded-2xl font-black text-white bg-black hover:bg-gray-800 hover:shadow-xl transition-all disabled:opacity-50 text-xl"
              >
                {loading ? "Building your portal..." : "Take me to my dashboard"} <ArrowRight className="inline ml-2" />
              </button>
          </div>
        )}
      </div>

      {/* ═══ "STYLE IT YOUR WAY" MODAL ═══ */}
      {showStyleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 sm:p-8 animate-in fade-in">
          <div className="bg-white w-full max-w-5xl h-[85vh] rounded-[32px] shadow-2xl flex overflow-hidden">
            
            {/* Left side: Controls */}
            <div className="w-1/2 p-8 overflow-y-auto border-r border-gray-100 custom-scrollbar">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-black text-black">Style It Your Way</h2>
                  <p className="text-sm text-gray-500">Customize your {activeTemplate.name} page</p>
                </div>
                <button onClick={() => setShowStyleModal(false)} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200">
                  ✕
                </button>
              </div>

              {/* Header Style Row */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2"><LayoutTemplate className="w-4 h-4"/> Header style</h3>
                <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                  {HEADER_STYLES.map(h => (
                    <button 
                      key={h.id}
                      onClick={() => setCustomConfig({...customConfig, headerStyle: h.id as any})}
                      className={`flex-shrink-0 w-28 aspect-[2/3] border-2 rounded-xl p-1 transition-all flex flex-col snap-start ${customConfig.headerStyle === h.id ? "border-indigo-600 shadow-md" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div className="flex-1 bg-gray-100 rounded-lg overflow-hidden relative">
                         {h.id === 'full-bleed' && <div className="absolute inset-0 bg-gray-800"/>}
                         {h.id === 'split' && <div className="absolute top-0 inset-x-0 h-1/2 bg-gray-800"/>}
                      </div>
                      <span className="text-[10px] font-bold mt-2 text-center text-gray-700">{h.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colors */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2"><Palette className="w-4 h-4"/> Choose a color scheme</h3>
                <div className="flex flex-wrap gap-3">
                  {COLOR_SCHEMES.map(c => (
                    <button
                      key={c.id}
                      onClick={() => setCustomConfig({...customConfig, colorScheme: c as any})}
                      className={`w-14 h-20 rounded-xl border-2 flex flex-col p-1.5 gap-1 transition-all ${customConfig.colorScheme.bg === c.bg ? "border-indigo-600 scale-110 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <div className="w-full h-8 rounded shrink-0" style={{ background: c.bg, border: '1px solid rgba(0,0,0,0.1)' }} />
                      <div className="w-full h-2 rounded-full" style={{ background: c.text }} />
                      <div className="w-full h-2 rounded-full" style={{ background: c.accent }} />
                      <div className="w-1/2 h-2 rounded-full" style={{ background: c.secondary }} />
                    </button>
                  ))}
                </div>
              </div>

               {/* Fonts */}
               <div className="mb-8">
                <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2"><Type className="w-4 h-4"/> Font family</h3>
                <div className="grid grid-cols-5 gap-3">
                  {FONT_OPTIONS.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setCustomConfig({...customConfig, font: f.id})}
                      className={`aspect-square rounded-xl border-2 flex items-center justify-center transition-all flex-col ${customConfig.font === f.id ? "border-indigo-600 scale-105 shadow-sm" : "border-gray-200 hover:border-gray-300"}`}
                    >
                      <span className="text-2xl font-medium" style={{ fontFamily: f.id }}>Aa</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Button Shape */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-black mb-4 flex items-center gap-2"><MousePointerSquareDashed className="w-4 h-4"/> Button style</h3>
                <div className="grid grid-cols-2 gap-3">
                  {BUTTON_STYLES.map(b => (
                    <button
                      key={b.id}
                      onClick={() => setCustomConfig({...customConfig, buttonStyle: b.id as any, buttonRadius: b.radius})}
                      className={`h-12 border-2 transition-all flex items-center justify-center font-bold text-sm ${customConfig.buttonStyle === b.id ? "border-indigo-600 text-indigo-600 bg-indigo-50" : "border-gray-200 text-gray-500 hover:bg-gray-50"}`}
                      style={{ borderRadius: b.radius, borderStyle: b.id === 'ghost' ? 'dashed' : 'solid' }}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button onClick={() => setShowStyleModal(false)} className="flex-1 py-4 font-bold text-gray-600 rounded-xl hover:bg-gray-100">
                  Cancel
                </button>
                <button onClick={saveStyleConfig} className="flex-[2] py-4 font-bold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-md">
                  Use this template
                </button>
              </div>
            </div>

            {/* Right side: Live Preview Canvas */}
            <div className="w-1/2 bg-[#f4f4f5] p-8 flex items-center justify-center relative">
               <div className="absolute top-4 right-4 bg-white px-3 py-1.5 rounded-full shadow-sm text-xs font-bold text-gray-400 flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/> Live Preview
               </div>

               {/* Mobile Phone Mockup */}
               <div className="w-[360px] h-[720px] rounded-[40px] border-[8px] border-black overflow-hidden shadow-2xl relative transition-all duration-500"
                    style={{ background: customConfig.colorScheme.bg, fontFamily: customConfig.font }}>
                  
                  {/* Dynamic Header */}
                  {customConfig.headerStyle === 'full-bleed' && (
                    <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&fit=crop')` }}>
                      <div className="w-full h-full bg-gradient-to-t from-black/60 to-transparent" />
                    </div>
                  )}
                  {customConfig.headerStyle === 'split' && (
                    <div className="h-48 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&fit=crop')` }} />
                  )}

                  {/* Profile Info */}
                  <div className={`px-6 relative z-10 ${customConfig.headerStyle === 'full-bleed' ? '-mt-20' : 'pt-10'} ${customConfig.headerStyle === 'offset' ? 'text-left' : 'text-center'}`}>
                    <img 
                      src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=500&fit=crop" 
                      className="w-24 h-24 object-cover border-4 border-white shadow-lg mx-auto mb-4"
                      style={{ 
                        borderRadius: customConfig.avatarShape === 'circle' ? '50%' : customConfig.avatarShape === 'rounded-square' ? '16px' : '8px',
                        marginLeft: customConfig.headerStyle === 'offset' ? '0' : 'auto'
                      }}
                    />
                    <h1 className="text-2xl font-bold mb-1" style={{ color: customConfig.headerStyle === 'full-bleed' ? '#fff' : customConfig.colorScheme.text }}>
                      {displayName || "Lukas Everett"}
                    </h1>
                    <p className="text-sm mb-6" style={{ color: customConfig.headerStyle === 'full-bleed' ? 'rgba(255,255,255,0.8)' : customConfig.colorScheme.secondary }}>
                      Trailblazer | Storyteller | Explorer
                    </p>

                    {/* Links */}
                    <div className="space-y-3">
                      {["Latest Blog Posts", "My Travel Gear", "Book a Session"].map((text) => (
                        <button key={text} className="w-full py-4 px-6 relative overflow-hidden transition-transform hover:scale-105 shadow-sm"
                                style={{
                                  background: customConfig.buttonStyle === 'outlined' || customConfig.buttonStyle === 'ghost' ? 'transparent' : customConfig.colorScheme.card,
                                  border: customConfig.buttonStyle === 'outlined' ? `1px solid ${customConfig.colorScheme.text}` : customConfig.buttonStyle === 'ghost' ? '1px dashed rgba(0,0,0,0.2)' : 'none',
                                  borderRadius: customConfig.buttonRadius,
                                  color: customConfig.colorScheme.text
                                }}>
                          <span className="relative z-10 font-bold">{text}</span>
                        </button>
                      ))}
                    </div>
                  </div>
               </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
