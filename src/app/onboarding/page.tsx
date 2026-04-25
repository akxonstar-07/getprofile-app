"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronLeft, Search, ArrowRight, LayoutTemplate, Palette, Type, MousePointerSquareDashed, MonitorSmartphone, Briefcase, Users, Sparkles, Camera, Globe2 } from "lucide-react";
import { getRolesByAccountType, type RoleDefinition } from "@/lib/roles";
import { TEMPLATES, TEMPLATE_CATEGORIES, HEADER_STYLES, COLOR_SCHEMES, FONT_OPTIONS, BUTTON_STYLES, getTemplatesByCategory, type TemplateConfig } from "@/lib/templates";

/* ═══════════════════════════════════════════════════
   BRANDED PLATFORM SVG ICONS
   ═══════════════════════════════════════════════════ */
const PLATFORMS = [
  { id: "instagram", label: "Instagram Username (@username)", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#E4405F"/><path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.4a2.9 2.9 0 110-5.8 2.9 2.9 0 010 5.8zm4.7-7.6a1.05 1.05 0 11-2.1 0 1.05 1.05 0 012.1 0z" fill="white"/></svg> },
  { id: "tiktok", label: "TikTok Username (@username)", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#010101"/><path d="M16.8 8.4a3.8 3.8 0 01-2.4-2.9V5h-2.2v9.3a2 2 0 01-2 1.7 2 2 0 01-2-2 2 2 0 012-2c.2 0 .4 0 .5.1V9.8h-.5A4.3 4.3 0 006 14.1a4.3 4.3 0 004.3 4.3 4.3 4.3 0 004.3-4.3v-4a5.5 5.5 0 003.2 1V8.8a3.8 3.8 0 01-.7-.1z" fill="#25F4EE"/></svg> },
  { id: "twitter", label: "X Username (@username)", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#000"/><path d="M15.7 6h1.8l-3.9 4.5L18 18h-3.4l-2.8-3.7L8.7 18H6.9l4.2-4.8L6.5 6h3.5l2.5 3.3L15.7 6zm-.6 10.8h1l-6.5-8.5h-1.1l6.6 8.5z" fill="white"/></svg> },
  { id: "threads", label: "Threads Username (@username)", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#000"/><path d="M12 4.5c-4.1 0-7.5 3.4-7.5 7.5s3.4 7.5 7.5 7.5 7.5-3.4 7.5-7.5S16.1 4.5 12 4.5zm0 13.5c-3.3 0-6-2.7-6-6s2.7-6 6-6 6 2.7 6 6-2.7 6-6 6z" fill="white"/></svg> },
  { id: "twitch", label: "Twitch Username (@username)", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#9146FF"/><path d="M16 11h-2v4h2v-4zm-4 0H10v4h2v-4zm5-7H7l-3 3v13h4v3h3l3-3h3l4-4V4z" fill="white"/></svg> },
  { id: "facebook", label: "Facebook Page URL", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#1877F2"/><path d="M15 12h-2v8h-3v-8H8.5v-2.5H10V7.8c0-2.4 1.4-3.8 3.7-3.8 1 0 1.9.1 2.2.1v2.5h-1.5c-1.2 0-1.4.6-1.4 1.4v1.5h2.9l-.4 2.5z" fill="white"/></svg> },
  { id: "email", label: "Email (you@example.com)", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#6B7280"/><path d="M4 7v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2H6c-1.1 0-2 .9-2 2zm14 0l-7 4-7-4h14z" fill="white"/></svg> },
  { id: "whatsapp", label: "WhatsApp Phone Number", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#25D366"/><path d="M12 4a8 8 0 00-6.8 12.2l-1.4 4.1 4.3-1.1A8 8 0 1012 4zm0 14.5a6.5 6.5 0 01-3.3-.9l-2.4.6.6-2.3A6.5 6.5 0 1112 18.5zm3.5-4.8c-.2-.1-1.1-.5-1.3-.6-.2-.1-.3-.1-.4.1-.1.2-.5.6-.6.7-.1.1-.2.1-.4 0-.2-.1-.8-.3-1.5-.9-.6-.5-.9-1.1-1-1.3-.1-.2 0-.3.1-.4l.3-.4c.1-.1.2-.3.3-.4.1-.1.2-.2.1-.4s-.4-1.1-.6-1.5c-.2-.4-.4-.3-.6-.3h-.5c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.7 1.2 2.9c.1.2 2 3 4.8 4.2.7.3 1.2.4 1.6.5.7.2 1.3.2 1.8.1.5-.1 1.6-.6 1.8-1.3.2-.6.2-1.2.1-1.3-.1-.2-.3-.3-.5-.4z" fill="white"/></svg> },
  { id: "website", label: "Website (www.my-website.com)", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#4B5563"/><path d="M12 4C7.6 4 4 7.6 4 12s3.6 8 8 8 8-3.6 8-8-3.6-8-8-8zm-1 14.9C7.8 18.4 5.5 15.5 5.5 12h5.5v6.9zm2 0V12h5.5c0 3.5-2.3 6.4-5.5 6.9z" fill="white"/></svg> },
  { id: "youtube", label: "youtube.com/...", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#FF0000"/><path d="M10 15.5v-7l6 3.5-6 3.5z" fill="white"/></svg> },
  { id: "linkedin", label: "LinkedIn Profile (linkedin.com/in/...)", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#0A66C2"/><path d="M8.5 17.5h-2v-7h2v7zm-1-8a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zm9 8h-2v-3.4c0-.8 0-1.9-1.1-1.9s-1.3.9-1.3 1.8v3.5h-2v-7h1.9v1h0a2.1 2.1 0 011.9-1c2 0 2.4 1.3 2.4 3.1v3.9z" fill="white"/></svg> },
  { id: "snapchat", label: "Snapchat URL (snapchat.com/add/...)", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#FFFC00"/><path d="M12 5.5c-2.3 0-4.3 1.6-4.8 3.8-.1.4-.4.8-.8.9-.4.2-1 .2-1.3-.1-.3-.3-.4-.8-.2-1.2.8-1.5 2-2.5 3.5-3.1 1.1-.4 2.3-.5 3.5-.2 1.6.4 2.8 1.4 3.5 2.8.2.4.2.9-.2 1.2-.3.3-.9.3-1.3.1-.4-.1-.7-.5-.8-.9C16.3 7 14.3 5.5 12 5.5z" fill="black"/></svg> },
  { id: "spotify", label: "Spotify URL", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#1DB954"/><path d="M16.5 14.5c-.2 0-.3-.1-.5-.2-1.8-1.1-4-1.3-6.6-.7-.2.1-.4.1-.5-.1-.1-.2-.1-.4.1-.5 2.9-.7 5.3-.4 7.3.8.2.1.3.3.2.5 0 .1-.1.2-.3.2h.3z" fill="white"/></svg> },
  { id: "discord", label: "Discord URL", icon: <svg viewBox="0 0 24 24" className="w-5 h-5"><rect width="24" height="24" rx="6" fill="#5865F2"/><path d="M16.4 7c-1.1-.5-2.3-.9-3.5-1l-.2.4c1.3.4 2.5 1 3.5 1.7-.5-.3-1.1-.5-1.7-.7-1-.3-2-.5-3.1-.5h-2.8c-1 .1-2 .2-3.1.5-.6.2-1.2.4-1.7.7 1-.8 2.2-1.4 3.5-1.7l-.2-.4c-1.2.1-2.4.5-3.5 1-1.8 3.3-2.3 6.6-1.9 9.8 1.5 1.1 2.9 1.8 4.3 2.2l1-1.6c-1.2-.4-2.3-1-3.3-1.8.2.1.4.3.7.4 1.3.8 2.8 1.2 4.4 1.4h2.2c1.6-.2 3.1-.7 4.4-1.4.2-.1.5-.3.7-.4-1 .8-2.1 1.4-3.3 1.8l1 1.6c1.5-.4 2.9-1.1 4.3-2.2.4-3.2-.1-6.5-1.9-9.8zm-6.2 7c-.7 0-1.2-.6-1.2-1.3s.5-1.3 1.2-1.3 1.2.6 1.2 1.3-.5 1.3-1.2 1.3zm3.6 0c-.7 0-1.2-.6-1.2-1.3s.5-1.3 1.2-1.3 1.2.6 1.2 1.3-.5 1.3-1.2 1.3z" fill="white"/></svg> },
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT — Onboarding Wizard
   ═══════════════════════════════════════════════════ */
export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  // Step 1: Account Type & Role
  type AccountType = "CREATOR" | "BUSINESS" | "AGENCY" | "COMMUNITY";
  const [accountType, setAccountType] = useState<AccountType | null>(null);
  const [selectedRole, setSelectedRole] = useState<RoleDefinition | null>(null);
  const [roleSearch, setRoleSearch] = useState("");

  // Step 2: Extended Details
  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [dob, setDob] = useState("");
  const [city, setCity] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [phone, setPhone] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  // Step 3: Platforms (Direct Input)
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

  const handleUrlChange = (id: string, value: string) => {
    setUrls(prev => ({ ...prev, [id]: value }));
  };

  const openStyleModal = (template: TemplateConfig) => {
    setActiveTemplate(template);
    setCustomConfig(template);
    setShowStyleModal(true);
  };

  const saveStyleConfig = () => {
    setShowStyleModal(false);
    goStep(5); // Proceed to finalizing step
  };

  const submitOnboarding = async () => {
    setLoading(true);
    setUsernameError("");
    
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          accountType,
          profileRole: selectedRole?.id || "personal_brand",
          displayName,
          username,
          dob,
          city,
          phone: phone ? `${countryCode}${phone}` : "",
          urls, // the dictionary of all platform URLs
          activeTemplateId: activeTemplate.id,
          themeConfig: JSON.stringify({
            headerStyle: customConfig.headerStyle,
            colorScheme: customConfig.colorScheme,
            font: customConfig.font,
            buttonStyle: customConfig.buttonStyle
          })
        }),
      });
      const data = await res.json();
      
      if (!res.ok) {
        if (data.error === "Username is already taken") {
          setUsernameError(data.error);
          goStep(2); // Send them back to fix it
        }
        setLoading(false);
        return;
      }
      
      router.push("/dashboard");
    } catch {
      setLoading(false);
    }
  };

  // Map platform IDs to their branded SVG icons for the preview
  const getPlatformIcon = (id: string) => {
    const p = PLATFORMS.find(pl => pl.id === id);
    return p ? p.icon : null;
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Preview Phone Component — link.me style
  const LivePreview = () => {
    const filledPlatforms = Object.entries(urls).filter(([, url]) => url && url.length > 0);
    return (
      <div className="hidden lg:flex w-full max-w-[340px] items-center justify-center p-8 bg-gray-50 rounded-3xl border border-gray-200">
        <div className="w-full h-[600px] bg-white rounded-[2rem] border-8 border-gray-900 overflow-hidden relative shadow-2xl">
           <div className="absolute top-0 w-full h-24 bg-gradient-to-b from-indigo-500/20 to-transparent"></div>
           <div className="p-6 pt-12 flex flex-col items-center text-center relative z-10">
              <div className="w-20 h-20 rounded-full bg-gray-200 border-4 border-white shadow-lg overflow-hidden mb-3">
                 {avatarPreview ? (
                   <img src={avatarPreview} className="w-full h-full object-cover" alt="" />
                 ) : (
                   <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                     <Camera className="w-6 h-6 text-gray-400" />
                   </div>
                 )}
              </div>
              <h2 className="font-bold text-lg">{displayName || "Your Name"}</h2>
              {username && <p className="text-xs text-gray-400 mt-0.5">@{username}</p>}

              {/* Social Icons Row — link.me style */}
              {filledPlatforms.length > 0 && (
                <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                  {filledPlatforms.map(([id]) => (
                    <div key={id} className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center shadow-sm hover:scale-110 transition-transform cursor-pointer">
                      {getPlatformIcon(id)}
                    </div>
                  ))}
                </div>
              )}

              {filledPlatforms.length > 0 && (
                <p className="text-[10px] text-gray-400 mt-3">{filledPlatforms.length} link{filledPlatforms.length > 1 ? 's' : ''} connected</p>
              )}
           </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans">
      
      {/* Sticky Header */}
      <div className="flex items-center justify-between p-6 w-full max-w-7xl mx-auto">
        <h2 className="text-2xl font-black tracking-tighter text-black">
          getprofile<span className="text-indigo-600">.link</span>
        </h2>
        <div className="flex gap-1">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${step >= i + 1 ? "bg-black w-8" : "bg-gray-200 w-4"}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 w-full max-w-7xl mx-auto">
        
        {/* Main Content Area */}
        <div className={`flex-1 w-full max-w-2xl transition-all duration-300 ${animating ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>

          {/* ═══ STEP 1: Account Type & Role ═══ */}
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {!accountType ? (
                <>
                  <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 tracking-tight">Account Type</h1>
                  <p className="text-gray-500 mb-8 text-lg">Select how you plan to use GetProfile.</p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    <button onClick={() => setAccountType("CREATOR")} className="p-6 rounded-2xl border-2 border-gray-100 bg-white hover:border-indigo-500 hover:shadow-lg transition-all text-left group">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <MonitorSmartphone className="w-6 h-6 text-indigo-500" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Creator</h3>
                      <p className="text-sm text-gray-500">Monetize your audience, share links, and build your personal brand.</p>
                    </button>
                    <button onClick={() => setAccountType("BUSINESS")} className="p-6 rounded-2xl border-2 border-gray-100 bg-white hover:border-emerald-500 hover:shadow-lg transition-all text-left group">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Briefcase className="w-6 h-6 text-emerald-500" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Business Owner</h3>
                      <p className="text-sm text-gray-500">Sell products, accept bookings, and manage local services.</p>
                    </button>
                    <button onClick={() => setAccountType("AGENCY")} className="p-6 rounded-2xl border-2 border-gray-100 bg-white hover:border-purple-500 hover:shadow-lg transition-all text-left group">
                      <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Users className="w-6 h-6 text-purple-500" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Agency</h3>
                      <p className="text-sm text-gray-500">Manage multiple talent profiles, influencers, or client portfolios.</p>
                    </button>
                    <button onClick={() => setAccountType("COMMUNITY")} className="p-6 rounded-2xl border-2 border-gray-100 bg-white hover:border-teal-500 hover:shadow-lg transition-all text-left group">
                      <div className="w-12 h-12 rounded-xl bg-teal-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Globe2 className="w-6 h-6 text-teal-500" />
                      </div>
                      <h3 className="font-bold text-lg mb-2">Community Admin</h3>
                      <p className="text-sm text-gray-500">Manage online or local communities, groups, and social pages.</p>
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <button onClick={() => { setAccountType(null); setSelectedRole(null); }} className="text-sm font-medium text-gray-500 hover:text-black mb-6 flex items-center gap-1 transition-colors">
                    <ChevronLeft className="w-4 h-4" /> Go Back
                  </button>
                  <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 tracking-tight">What do you do?</h1>
                  <p className="text-gray-500 mb-8 text-lg">Pick your role so we can give you the best starting blocks.</p>

                  <div className="relative mb-6">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder='Search roles...'
                      value={roleSearch}
                      onChange={e => setRoleSearch(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-2xl text-black placeholder-gray-400 text-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-8 max-h-[360px] overflow-y-auto px-1">
                    {getRolesByAccountType(accountType).filter(r => roleSearch ? r.label.toLowerCase().includes(roleSearch.toLowerCase()) : true).map(r => (
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
                </>
              )}
            </div>
          )}

          {/* ═══ STEP 2: Extended Details ═══ */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pr-0 lg:pr-12">
              <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 tracking-tight">Customize your Profile</h1>
              <p className="text-gray-500 mb-8 text-lg">Upload a photo and enter your details.</p>

              {/* Avatar Upload */}
              <div className="flex justify-center mb-8">
                <label className="relative cursor-pointer group">
                  <div className="w-28 h-28 rounded-full bg-gray-100 border-4 border-gray-200 overflow-hidden flex items-center justify-center group-hover:border-blue-400 transition-all shadow-lg">
                    {avatarPreview ? (
                      <img src={avatarPreview} className="w-full h-full object-cover" alt="Profile" />
                    ) : (
                      <div className="flex flex-col items-center">
                        <Camera className="w-8 h-8 text-gray-400 group-hover:text-blue-500 transition-colors" />
                        <span className="text-[10px] text-gray-400 mt-1 font-medium">Upload</span>
                      </div>
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center border-2 border-white shadow-md group-hover:scale-110 transition-transform">
                    <Camera className="w-4 h-4 text-white" />
                  </div>
                  <input type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
                </label>
              </div>

              <div className="space-y-6 mb-8">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Display Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Alex Rivera"
                    value={displayName}
                    onChange={e => setDisplayName(e.target.value)}
                    className="w-full p-4 bg-white border border-gray-200 rounded-xl text-black text-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
                    autoFocus
                  />
                  <p className="text-xs text-gray-500 mt-2">It will be used throughout your Link-in-Bio.</p>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Customize your Link in Bio URL</label>
                  <div className="flex border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all shadow-sm">
                    <span className="bg-gray-50 px-4 flex items-center text-gray-500 border-r border-gray-200 text-lg">
                      getprofile.link/
                    </span>
                    <input
                      type="text"
                      placeholder="username"
                      value={username}
                      onChange={e => {
                        setUsername(e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase());
                        setUsernameError("");
                      }}
                      className="flex-1 p-4 bg-white text-black text-lg focus:outline-none"
                    />
                  </div>
                  {usernameError && <p className="text-xs font-bold text-red-500 mt-2">{usernameError}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Date of Birth</label>
                    <input
                      type="date"
                      value={dob}
                      onChange={e => setDob(e.target.value)}
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl text-black text-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      placeholder="e.g. New York"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full p-4 bg-white border border-gray-200 rounded-xl text-black text-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Phone Number</label>
                  <div className="flex gap-2">
                    <select
                      value={countryCode}
                      onChange={e => setCountryCode(e.target.value)}
                      className="p-4 bg-white border border-gray-200 rounded-xl text-black text-sm focus:outline-none focus:ring-2 focus:ring-black transition-all shadow-sm min-w-[120px]"
                    >
                      <option value="+93">🇦🇫 +93</option>
                      <option value="+355">🇦🇱 +355</option>
                      <option value="+213">🇩🇿 +213</option>
                      <option value="+54">🇦🇷 +54</option>
                      <option value="+61">🇦🇺 +61</option>
                      <option value="+43">🇦🇹 +43</option>
                      <option value="+973">🇧🇭 +973</option>
                      <option value="+880">🇧🇩 +880</option>
                      <option value="+32">🇧🇪 +32</option>
                      <option value="+55">🇧🇷 +55</option>
                      <option value="+1">🇨🇦 +1</option>
                      <option value="+56">🇨🇱 +56</option>
                      <option value="+86">🇨🇳 +86</option>
                      <option value="+57">🇨🇴 +57</option>
                      <option value="+45">🇩🇰 +45</option>
                      <option value="+20">🇪🇬 +20</option>
                      <option value="+358">🇫🇮 +358</option>
                      <option value="+33">🇫🇷 +33</option>
                      <option value="+49">🇩🇪 +49</option>
                      <option value="+233">🇬🇭 +233</option>
                      <option value="+30">🇬🇷 +30</option>
                      <option value="+852">🇭🇰 +852</option>
                      <option value="+36">🇭🇺 +36</option>
                      <option value="+91" selected>🇮🇳 +91</option>
                      <option value="+62">🇮🇩 +62</option>
                      <option value="+98">🇮🇷 +98</option>
                      <option value="+964">🇮🇶 +964</option>
                      <option value="+353">🇮🇪 +353</option>
                      <option value="+972">🇮🇱 +972</option>
                      <option value="+39">🇮🇹 +39</option>
                      <option value="+81">🇯🇵 +81</option>
                      <option value="+962">🇯🇴 +962</option>
                      <option value="+254">🇰🇪 +254</option>
                      <option value="+965">🇰🇼 +965</option>
                      <option value="+60">🇲🇾 +60</option>
                      <option value="+52">🇲🇽 +52</option>
                      <option value="+212">🇲🇦 +212</option>
                      <option value="+95">🇲🇲 +95</option>
                      <option value="+977">🇳🇵 +977</option>
                      <option value="+31">🇳🇱 +31</option>
                      <option value="+64">🇳🇿 +64</option>
                      <option value="+234">🇳🇬 +234</option>
                      <option value="+47">🇳🇴 +47</option>
                      <option value="+968">🇴🇲 +968</option>
                      <option value="+92">🇵🇰 +92</option>
                      <option value="+51">🇵🇪 +51</option>
                      <option value="+63">🇵🇭 +63</option>
                      <option value="+48">🇵🇱 +48</option>
                      <option value="+351">🇵🇹 +351</option>
                      <option value="+974">🇶🇦 +974</option>
                      <option value="+40">🇷🇴 +40</option>
                      <option value="+7">🇷🇺 +7</option>
                      <option value="+966">🇸🇦 +966</option>
                      <option value="+65">🇸🇬 +65</option>
                      <option value="+27">🇿🇦 +27</option>
                      <option value="+82">🇰🇷 +82</option>
                      <option value="+34">🇪🇸 +34</option>
                      <option value="+94">🇱🇰 +94</option>
                      <option value="+46">🇸🇪 +46</option>
                      <option value="+41">🇨🇭 +41</option>
                      <option value="+886">🇹🇼 +886</option>
                      <option value="+66">🇹🇭 +66</option>
                      <option value="+90">🇹🇷 +90</option>
                      <option value="+971">🇦🇪 +971</option>
                      <option value="+44">🇬🇧 +44</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+58">🇻🇪 +58</option>
                      <option value="+84">🇻🇳 +84</option>
                    </select>
                    <input
                      type="tel"
                      placeholder="Phone Number"
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 p-4 bg-white border border-gray-200 rounded-xl text-black text-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all shadow-sm"
                    />
                  </div>
                </div>
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

          {/* ═══ STEP 3: Social Inputs ═══ */}
          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 pr-0 lg:pr-12">
               <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 tracking-tight">Add social icons to your page</h1>
               <p className="text-gray-500 mb-8 text-lg">You can always add more later.</p>

               <div className="space-y-3 mb-8 max-h-[50vh] overflow-y-auto pr-2 pb-4">
                {PLATFORMS.map(p => (
                  <div key={p.id} className="flex items-center gap-3 bg-white p-2 rounded-xl border border-gray-200 focus-within:ring-2 focus-within:ring-black focus-within:border-transparent transition-all shadow-sm">
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                      {p.icon}
                    </div>
                    <input
                      type="text"
                      placeholder={p.label}
                      value={urls[p.id] || ""}
                      onChange={(e) => handleUrlChange(p.id, e.target.value)}
                      className="flex-1 bg-transparent border-none focus:outline-none text-sm text-black placeholder-gray-400"
                    />
                    {urls[p.id] && urls[p.id].length > 0 && (
                      <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mr-1">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => goStep(2)} className="px-6 py-4 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-all">
                  <ChevronLeft className="w-5 h-5 inline" />
                </button>
                <button
                  onClick={() => goStep(4)}
                  className="flex-1 w-full py-4 rounded-xl font-bold text-white bg-black hover:bg-gray-800 transition-all text-lg"
                >
                  Next
                </button>
              </div>
              <button
                onClick={() => goStep(4)}
                className="w-full mt-3 py-3 rounded-xl font-medium text-gray-500 hover:text-black hover:bg-gray-100 transition-all text-sm"
              >
                Skip for now — I&apos;ll add these later
              </button>
            </div>
          )}
        </div>

        {/* Live Preview for Steps 2 and 3 */}
        {(step === 2 || step === 3) && <LivePreview />}

      </div>

      {/* ═══ STEP 4: Template Gallery ═══ */}
      {step === 4 && (
        <div className="w-full max-w-6xl mx-auto px-4 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            <div className="flex items-center justify-center mb-8 relative">
              <button onClick={() => goStep(3)} className="absolute left-0 top-1/2 -translate-y-1/2 text-sm font-medium text-gray-500 hover:text-black flex items-center gap-1 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Go Back
              </button>
              <div className="text-center">
                <h1 className="text-4xl sm:text-5xl font-black text-black mb-3 tracking-tight">Pick a template</h1>
                <p className="text-gray-500 text-lg">You can always customize it or change it completely later.</p>
              </div>
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
                  {c.label}
                </button>
              ))}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTemplates.map(t => (
                <div key={t.id} className="group relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                  <div className="aspect-[9/16] w-full relative" style={{ background: t.previewGradient }}>
                    {/* Simulated Template Preview */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <div className="w-16 h-16 rounded-full mb-3" style={{ backgroundColor: t.colorScheme.accent + '33' }} />
                      <div className="h-3 w-24 rounded-full mb-2" style={{ backgroundColor: t.colorScheme.text + '40' }} />
                      <div className="h-2 w-16 rounded-full mb-6" style={{ backgroundColor: t.colorScheme.text + '20' }} />
                      {[1, 2, 3].map(i => (
                        <div key={i} className="w-full h-10 mb-2" style={{ backgroundColor: t.colorScheme.card, borderRadius: t.buttonRadius, border: `1px solid ${t.colorScheme.accent}33` }} />
                      ))}
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-6">
                      <button
                        onClick={() => { setActiveTemplate(t); setCustomConfig(t); goStep(5); }}
                        className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        Select
                      </button>
                      <button
                        onClick={() => openStyleModal(t)}
                        className="w-full py-3 bg-transparent border border-white text-white font-bold rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2"
                      >
                        <Palette className="w-4 h-4" /> Style It Your Way
                      </button>
                    </div>
                  </div>
                  <div className="p-4 border-t border-gray-100">
                    <h3 className="font-bold text-lg">{t.name}</h3>
                    <p className="text-xs text-gray-500 mt-1">{t.description}</p>
                  </div>
                </div>
              ))}
            </div>
        </div>
      )}

      {/* ═══ STEP 5: Final Processing ═══ */}
      {step === 5 && (
        <div className="flex-1 flex flex-col items-center justify-center p-4">
          <div className="w-24 h-24 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-3xl shadow-2xl flex items-center justify-center animate-bounce mb-8">
            <Sparkles className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-black text-black mb-4 tracking-tight text-center">Generating Your Empire...</h1>
          <p className="text-gray-500 text-center text-lg max-w-md mb-12">
            We are setting up your custom templates, building your initial dashboard, and configuring your analytics engine.
          </p>
          <button
            onClick={submitOnboarding}
            disabled={loading}
            className="px-12 py-5 rounded-2xl font-bold text-white bg-black disabled:opacity-50 hover:scale-105 transition-all text-xl shadow-xl shadow-black/20 flex items-center gap-3 group"
          >
            {loading ? "Building..." : "Launch Dashboard"}
            {!loading && <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />}
          </button>
        </div>
      )}

      {/* "Style It Your Way" Modal */}
      {showStyleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-5xl h-[85vh] flex overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Left Sidebar: Controls */}
            <div className="w-full md:w-[400px] bg-gray-50 border-r border-gray-200 flex flex-col h-full">
              <div className="p-6 border-b border-gray-200 bg-white">
                <h2 className="text-2xl font-black tracking-tight">Style Editor</h2>
                <p className="text-sm text-gray-500 mt-1">Customize the `{activeTemplate.name}` template.</p>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-8">
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <LayoutTemplate className="w-4 h-4" /> Header Style
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {HEADER_STYLES.map(s => (
                      <button
                        key={s.id}
                        onClick={() => setCustomConfig({ ...customConfig, headerStyle: s.id as any })}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          customConfig.headerStyle === s.id ? "border-black bg-white" : "border-gray-200 bg-transparent hover:border-gray-300"
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Palette className="w-4 h-4" /> Color Scheme
                  </h3>
                  <div className="grid grid-cols-4 gap-3">
                    {COLOR_SCHEMES.map(c => (
                      <button
                        key={c.id}
                        onClick={() => setCustomConfig({ ...customConfig, colorScheme: { bg: c.bg, card: c.card, text: c.text, accent: c.accent, secondary: c.secondary } })}
                        className={`aspect-square rounded-full border-2 transition-all flex items-center justify-center ${
                          customConfig.colorScheme.bg === c.bg ? "border-black scale-110" : "border-transparent hover:scale-105"
                        }`}
                        style={{ backgroundColor: c.bg, color: c.accent }}
                      >
                        {customConfig.colorScheme.bg === c.bg && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <Type className="w-4 h-4" /> Typography
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {FONT_OPTIONS.map(f => (
                      <button
                        key={f.id}
                        onClick={() => setCustomConfig({ ...customConfig, font: f.id as any })}
                        className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                          customConfig.font === f.id ? "border-black bg-white" : "border-gray-200 bg-transparent hover:border-gray-300"
                        }`}
                        style={{ fontFamily: f.id }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <MousePointerSquareDashed className="w-4 h-4" /> Button Style
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {BUTTON_STYLES.map(b => (
                      <button
                        key={b.id}
                        onClick={() => setCustomConfig({ ...customConfig, buttonStyle: b.id as any })}
                        className={`p-3 border-2 text-sm font-medium transition-all ${
                          customConfig.buttonStyle === b.id ? "border-black bg-white" : "border-gray-200 bg-transparent hover:border-gray-300"
                        }`}
                        style={{
                          borderRadius: b.id === "pill" ? "9999px" : b.id === "rounded" ? "0.5rem" : "0",
                          boxShadow: b.id === "shadow" ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none",
                        }}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 bg-white flex gap-3">
                <button onClick={() => setShowStyleModal(false)} className="flex-1 py-3 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors">
                  Cancel
                </button>
                <button onClick={saveStyleConfig} className="flex-1 py-3 rounded-xl font-bold text-white bg-black hover:bg-gray-800 transition-colors">
                  Use Style
                </button>
              </div>
            </div>
            
            {/* Right Side: Live Preview Simulation */}
            <div className="hidden md:flex flex-1 items-center justify-center bg-gray-100 p-8 relative overflow-hidden">
               <div className="absolute inset-0 bg-grid-black/[0.02] bg-[size:20px_20px]"></div>
               <div className="w-[320px] h-[650px] bg-white rounded-[2.5rem] shadow-2xl border-[8px] border-gray-900 relative z-10 overflow-hidden"
                    style={{
                      backgroundColor: customConfig.colorScheme.bg || "#ffffff",
                      fontFamily: customConfig.font || "Inter, sans-serif",
                    }}
               >
                  {/* Dynamic Preview Header based on selection */}
                  {(customConfig.headerStyle === "full-bleed" || customConfig.headerStyle === "gradient-overlay") && (
                    <div className="pt-12 pb-6 px-6 flex flex-col items-center text-center border-b border-black/5">
                      <div className="w-24 h-24 rounded-full bg-gray-200 mb-4" />
                      <h3 className="text-xl font-bold" style={{ color: customConfig.colorScheme.text || "#000" }}>{displayName || "Your Name"}</h3>
                      <p className="text-sm opacity-60" style={{ color: customConfig.colorScheme.text || "#000" }}>{selectedRole?.label}</p>
                    </div>
                  )}
                  {(customConfig.headerStyle === "split" || customConfig.headerStyle === "offset") && (
                    <div className="relative mb-12">
                      <div className="h-32 w-full" style={{ backgroundColor: customConfig.colorScheme.accent || "#000" }} />
                      <div className="absolute -bottom-10 left-6 w-20 h-20 rounded-full bg-gray-200 border-4 border-white" />
                      <div className="mt-12 px-6">
                        <h3 className="text-xl font-bold" style={{ color: customConfig.colorScheme.text || "#000" }}>{displayName || "Your Name"}</h3>
                      </div>
                    </div>
                  )}
                  {customConfig.headerStyle === "minimal-avatar" && (
                    <div className="pt-12 pb-6 px-6 flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full bg-gray-200" />
                      <div>
                        <h3 className="text-xl font-bold" style={{ color: customConfig.colorScheme.text || "#000" }}>{displayName || "Your Name"}</h3>
                        <p className="text-sm opacity-60" style={{ color: customConfig.colorScheme.text || "#000" }}>{selectedRole?.label}</p>
                      </div>
                    </div>
                  )}

                  {/* Dynamic Preview Buttons */}
                  <div className="p-6 space-y-3">
                     {[1, 2, 3].map(i => (
                       <div key={i} 
                         className="w-full h-14 flex items-center justify-center font-medium"
                         style={{
                           backgroundColor: customConfig.colorScheme.card || "#f3f4f6",
                           color: customConfig.colorScheme.text || "#000",
                           borderRadius: customConfig.buttonRadius || "12px",
                           boxShadow: customConfig.buttonStyle === "ghost" ? "0 4px 6px -1px rgba(0,0,0,0.1)" : "none",
                           border: customConfig.buttonStyle === "outlined" ? `2px solid ${customConfig.colorScheme.text}` : "none",
                         }}
                       >
                         Sample Link {i}
                       </div>
                     ))}
                  </div>
               </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
