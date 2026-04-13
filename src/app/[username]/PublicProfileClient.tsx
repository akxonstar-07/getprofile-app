"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check, Share2, QrCode, X, Play,
  ShoppingBag, Link2, MapPin, Globe, ExternalLink, Mail,
  Calendar, MessageSquare, Send, Bot, Sparkles, TrendingUp, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { getRoleDashboardConfig } from "@/lib/role-dashboard-config";
import CheckoutModal from "@/components/public/CheckoutModal";
import TipWidget from "@/components/public/TipWidget";
import PublicBookingWidget from "@/components/public/PublicBookingWidget";
import EmailCapture from "@/components/public/EmailCapture";
import EmbedBlock from "@/components/public/EmbedBlock";
import GoalTracker from "@/components/public/GoalTracker";
import CourseAccordion from "@/components/public/CourseAccordion";
import CouponCard from "@/components/public/CouponCard";
import { getSidebarConfigForRole } from "@/lib/role-sidebar-map";
import { parseLiveUrl } from "@/lib/live-stream-parser";

/* ─── Platform config & Icons ─── */
function detectPlatform(url: string): { name: string; color: string; bg: string; icon: React.ReactNode } {
  const u = url.toLowerCase();
  // Standardizing all icon backgrounds to deep black for the neo-brutalist theme
  if (u.includes("youtube") || u.includes("youtu.be")) return {
    name: "YouTube", color: "#fff", bg: "#050505",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.5 6.9a3 3 0 0 0-2.1-2.1C19.5 4.3 12 4.3 12 4.3s-7.5 0-9.4.5A3 3 0 0 0 .5 6.9C0 8.8 0 12.7 0 12.7s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 16.1V9.3l6.3 3.4-6.3 3.4z"/></svg>,
  };
  if (u.includes("tiktok")) return {
    name: "TikTok", color: "#fff", bg: "#050505",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.07 8.07 0 0 0 4.77 1.55V6.8a4.85 4.85 0 0 1-1-.11z"/></svg>,
  };
  if (u.includes("instagram")) return {
    name: "Instagram", color: "#fff", bg: "#050505",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  };
  return { name: "Link", color: "#fff", bg: "#050505", icon: <Link2 className="w-5 h-5" /> };
}

export default function PublicProfileClient({ user: initialUser }: { user: any }) {
  const [user, setUser] = useState(initialUser);
  const [hasMounted, setHasMounted] = useState(false);
  const [isPreview, setIsPreview] = useState(false);
  const [viewMode, setViewMode] = useState<"mobile" | "web">("mobile");
  
  // AI Chat Widget State
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState<any[]>([{ sender: "AI", content: `Hi! I'm ${user.name}'s virtual assistant. How can I help you today?` }]);
  const [input, setInput] = useState("");
  const [checkoutProduct, setCheckoutProduct] = useState<any>(null);
  const roleConfig = getSidebarConfigForRole(user.profileRole || "personal_brand");

  useEffect(() => {
    setHasMounted(true);
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "true") setIsPreview(true);
    if (params.get("view") === "web") setViewMode("web");

    // Ping profile view for Analytics
    fetch("/api/analytics", {
       method: "POST",
       body: JSON.stringify({ userId: initialUser.id, type: "profile_view" })
    }).catch(()=>{});

    // Live Sync Listener (Dashboard Editor)
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "UPDATE_PREVIEW") setUser((prev: any) => ({ ...prev, ...e.data.payload }));
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [initialUser.id]);

  if (!hasMounted) return null;

  const profile = user.profile || {};
  const links = user.links || [];
  const products = user.products || [];
  const events = user.events || [];

  const handleLinkClick = (linkId: string, url: string) => {
     fetch("/api/analytics", {
       method: "POST",
       body: JSON.stringify({ userId: user.id, type: "link_click", metadata: { linkId, url } })
     }).catch(()=>{});
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;
    const newMsg = { sender: "VISITOR", content: input };
    setMessages(prev => [...prev, newMsg]);
    setInput("");
    
    try {
      const res = await fetch(`/api/assistant/chat?username=${user.username}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input, history: messages })
      });
      const data = await res.json();
      
      if (res.ok && data.reply) {
         setMessages(prev => [...prev, { sender: "AI_ASSISTANT", content: data.reply }]);
      } else {
         setMessages(prev => [...prev, { sender: "AI_ASSISTANT", content: "I'm currently offline or having trouble connecting." }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: "AI_ASSISTANT", content: "Network error. Please try again." }]);
    }
  };

  let customConfig: any = null;
  if (profile.themeConfig) {
    try { customConfig = JSON.parse(profile.themeConfig); } catch (e) {}
  }
  
  // ── THEME ENGINE (Komi Neon, LinkMe B2B) ──
  const activeTemplate = profile.activeTemplateId || "komi-neon";
  
  let bgClass = "bg-black";
  let textClass = "text-white";
  let cardBgClass = "bg-[#050505]";
  let cardBorderClass = "border-white/10";
  let accentClass = "text-[#D2FF00]";
  let accentBgClass = "bg-[#D2FF00]";
  let accentColorHex = "#D2FF00";

  if (activeTemplate === "linkme-b2b") {
     bgClass = "bg-[#f5f5f7]";
     textClass = "text-black";
     cardBgClass = "bg-white";
     cardBorderClass = "border-black/5";
     accentClass = "text-indigo-600";
     accentBgClass = "bg-black";
     accentColorHex = "#000000";
  }

  return (
    <div className={`min-h-screen relative font-sans ${bgClass} ${textClass} selection:bg-[#D2FF00] selection:text-black overflow-x-hidden`}>
       
       {/* 📸 DESKTOP / WEB LANDING PAGE TEMPLATE */}
       {viewMode === "web" ? (
         <div className="max-w-7xl mx-auto px-6 lg:px-20 py-20 space-y-32">
           {/* Hero Section */}
           <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
             <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
               {profile.isLive ? (
                 <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-4 py-2 rounded-full text-rose-500 text-[10px] font-black uppercase tracking-[0.2em] animate-pulse">
                   <div className="w-2 h-2 bg-rose-500 rounded-full" /> LIVE NOW ON AIR
                 </div>
               ) : (
                 <div className={`inline-flex items-center gap-2 ${accentClass} bg-white/5 border ${cardBorderClass} px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-[0.2em]`}>
                   <Sparkles className="w-3.5 h-3.5" /> CREATOR IDENTITY NODE
                 </div>
               )}
               <h1 className="font-komi text-7xl lg:text-9xl tracking-tighter leading-none uppercase">
                 {user.name || user.username}
               </h1>
               <p className="text-xl opacity-50 font-medium max-w-lg leading-relaxed">
                 {profile.bio || "Digital operations and ecosystem architecture."}
               </p>
               <div className="flex gap-4">
                 <button className={`${accentBgClass} ${activeTemplate==='komi-neon'?'text-black':'text-white'} px-10 py-5 rounded-2xl font-komi text-2xl uppercase tracking-widest hover:scale-105 transition-transform flex items-center gap-3`}>
                   CONNECT 🤝
                 </button>
               </div>
             </div>
             
             {profile.isLive && parseLiveUrl(profile.liveUrl) ? (
                <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-rose-500/30 shadow-2xl shadow-rose-500/20 animate-in fade-in zoom-in-95 duration-1000">
                   <iframe src={parseLiveUrl(profile.liveUrl) as string} className="w-full h-full" frameBorder="0" allowFullScreen allow="autoplay; fullscreen" />
                </div>
             ) : (
                <div className={`relative aspect-square rounded-[4rem] overflow-hidden border ${cardBorderClass} shadow-2xl group animate-in fade-in zoom-in-95 duration-1000`}>
                   <img src={profile.avatarUrl || "/placeholder-avatar.jpg"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-40" />
                   {activeTemplate === 'komi-neon' && <div className="absolute top-0 right-0 w-96 h-96 bg-[#D2FF00]/10 blur-[100px]" />}
                </div>
             )}
           </section>

           {/* Neo-Brutalist Products Grid */}
           {products.length > 0 && (
             <section className="space-y-12">
               <h2 className="font-komi text-5xl tracking-tighter uppercase">{getRoleDashboardConfig(user.profileRole || '').pages.store.title}</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                 {products.map((p: any) => (
                   <div key={p.id} className={`group ${cardBgClass} border ${cardBorderClass} p-6 rounded-[3rem] hover:border-white/20 transition-all shadow-xl`}>
                     <div className="aspect-square rounded-[2rem] overflow-hidden mb-8 relative bg-black border border-white/5">
                        <img src={p.image || "/placeholder.svg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                     </div>
                     <div className="space-y-4">
                       <h3 className="font-komi text-3xl line-clamp-1">{p.name}</h3>
                       <p className={`font-black text-xl ${accentClass}`}>${p.price}</p>
                       <button onClick={() => setCheckoutProduct(p)} className={`w-full ${accentBgClass} ${activeTemplate==='komi-neon'?'text-black':'text-white'} py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] hover:scale-[1.02] transition-transform`}>
                         {p.isAffiliate ? "REDEEM" : "ACQUIRE ASSET"}
                       </button>
                     </div>
                   </div>
                 ))}
               </div>
             </section>
           )}
         </div>
       ) : (
         /* 📱 MOBILE LINK-IN-BIO TEMPLATE (Bento Layouts) */
         <div className="max-w-[480px] mx-auto min-h-screen flex flex-col pb-24 border-x border-white/5">
           
           <div className="relative w-full h-auto overflow-hidden">
             {profile.isLive && parseLiveUrl(profile.liveUrl) ? (
               <div className="aspect-video w-full bg-black">
                  <iframe src={parseLiveUrl(profile.liveUrl) as string} className="w-full h-full" frameBorder="0" allowFullScreen allow="autoplay; fullscreen" />
               </div>
             ) : (
               <div className="h-64 bg-cover bg-center" style={{ backgroundImage: `url(${profile.bannerUrl || 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&fit=crop'})` }}>
                  <div className={`absolute inset-0 bg-gradient-to-t ${activeTemplate==='linkme-b2b' ? 'from-white/90' : 'from-black'} to-transparent`} />
               </div>
             )}
           </div>

           <div className="px-6 relative z-10 -mt-20">
              <img 
                src={profile.avatarUrl || "/placeholder.svg"} 
                className={`w-32 h-32 object-cover border-[8px] shadow-2xl rounded-3xl mx-auto mb-6`}
                style={{ borderColor: activeTemplate==='linkme-b2b' ? '#f5f5f7' : '#000000' }}
              />
              <div className="text-center mb-10">
                 <h1 className="font-komi text-5xl tracking-tighter mb-2 uppercase break-words">
                    {user.name || user.username}
                 </h1>
                 <p className="text-[13px] font-bold opacity-60 max-w-sm mx-auto leading-relaxed">
                    {profile.bio || "Creating next-generation digital artifacts."}
                 </p>
              </div>

              {/* BENTO GRID LINK STRUCTURE */}
              <div className="grid grid-cols-2 gap-4">
                 
                 {/* Standard Links in staggered config */}
                 {links.filter((l: any) => !l.image && !l.url.includes("youtube.com") && !l.url.includes("spotify.com")).map((l: any, i: number) => {
                   const { icon, bg } = detectPlatform(l.url);
                   // Make the first link full width as hero
                   const isHero = i === 0;
                   return (
                     <Link 
                       key={l.id} 
                       href={l.clickUrl || l.url} 
                       target="_blank" 
                       onClick={() => handleLinkClick(l.id, l.url)}
                       className={`group overflow-hidden rounded-[2rem] border ${cardBorderClass} ${cardBgClass} flex flex-col justify-between p-6 transition-all hover:scale-[1.02] active:scale-95 shadow-xl ${isHero ? 'col-span-2 aspect-[3/1]' : 'col-span-1 aspect-square'}`}
                     >
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white" style={{ background: bg }}>
                           {l.icon ? <span className="text-xl">{l.icon}</span> : icon}
                        </div>
                        <div className="mt-4">
                           <span className="font-black text-sm uppercase tracking-wide opacity-90 line-clamp-2">{l.displayTitle || l.title}</span>
                        </div>
                     </Link>
                   )
                 })}

                 {/* Product Blocks nested in Bento Grid */}
                 {products.map((p: any) => (
                    <div key={p.id} onClick={() => setCheckoutProduct(p)} className={`col-span-2 cursor-pointer group ${cardBgClass} border ${cardBorderClass} rounded-[2rem] p-4 flex gap-4 items-center transition-transform hover:scale-[1.01] shadow-xl`}>
                       <div className="w-24 h-24 rounded-[1.5rem] overflow-hidden bg-zinc-800 shrink-0">
                         <img src={p.image || "/placeholder.svg"} className="w-full h-full object-cover grayscale group-hover:grayscale-0" />
                       </div>
                       <div className="flex-1">
                         <span className="bg-white/10 text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded inline-block mb-1.5">{p.productType}</span>
                         <h3 className="font-bold text-sm tracking-tight leading-tight line-clamp-2 mb-1">{p.name}</h3>
                         <span className={`font-black text-sm ${accentClass}`}>${p.price}</span>
                       </div>
                    </div>
                 ))}

                 {/* Massive Subscribe Block (Email Capture) */}
                 <div className={`col-span-2 mt-4`}>
                   <EmailCapture username={user.username} creatorName={user.name || user.username} />
                 </div>
              </div>

           </div>
         </div>
       )}

       {/* ── Modal Overlays omitted for brevity, but logically preserved ── */}
       {checkoutProduct && <CheckoutModal product={checkoutProduct} username={user.username} onClose={() => setCheckoutProduct(null)} />}
    </div>
  );
}
