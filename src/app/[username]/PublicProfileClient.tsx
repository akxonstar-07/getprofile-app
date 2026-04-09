"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import {
  Check, Share2, QrCode, X, Play,
  ShoppingBag, Link2, MapPin, Globe, ExternalLink, Mail,
  Calendar, MessageSquare, Send, Bot, Sparkles, TrendingUp, ChevronRight
} from "lucide-react";
import { toast } from "sonner";
import { getRoleDashboardConfig } from "@/lib/role-dashboard-config";

/* ─── Platform config & Icons ─── */
function detectPlatform(url: string): { name: string; color: string; bg: string; icon: React.ReactNode } {
  const u = url.toLowerCase();
  if (u.includes("youtube") || u.includes("youtu.be")) return {
    name: "YouTube", color: "#fff", bg: "#FF0000",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M23.5 6.9a3 3 0 0 0-2.1-2.1C19.5 4.3 12 4.3 12 4.3s-7.5 0-9.4.5A3 3 0 0 0 .5 6.9C0 8.8 0 12.7 0 12.7s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 16.1V9.3l6.3 3.4-6.3 3.4z"/></svg>,
  };
  if (u.includes("tiktok")) return {
    name: "TikTok", color: "#fff", bg: "#010101",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.07 8.07 0 0 0 4.77 1.55V6.8a4.85 4.85 0 0 1-1-.11z"/></svg>,
  };
  if (u.includes("instagram")) return {
    name: "Instagram", color: "#fff", bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  };
  return { name: "Link", color: "#fff", bg: "#6366f1", icon: <Link2 className="w-4 h-4" /> };
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

  useEffect(() => {
    setHasMounted(true);
    const params = new URLSearchParams(window.location.search);
    if (params.get("preview") === "true") setIsPreview(true);
    if (params.get("view") === "web") setViewMode("web");

    // Live Sync Listener
    const handleMessage = (e: MessageEvent) => {
      if (e.data?.type === "UPDATE_PREVIEW") setUser((prev: any) => ({ ...prev, ...e.data.payload }));
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  if (!hasMounted) return null;

  const profile = user.profile || {};
  const links = user.links || [];
  const products = user.products || [];
  const events = user.events || [];

  // Check if creator has Pro plan (only Pro creators get AI chat on their profile)
  const creatorIsPro = (() => {
    const plan = user.plan || "FREE";
    if (plan === "PRO") return true;
    if (plan === "TRIAL" && user.trialEndsAt) {
      return new Date(user.trialEndsAt) > new Date();
    }
    return false;
  })();

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

  return (
    <div className={`min-h-screen relative font-sans transition-colors duration-500`} style={{ backgroundColor: profile.bgColor || "#000", color: profile.textColor || "#fff" }}>
      
      {/* 📸 DESKTOP / WEB LANDING PAGE TEMPLATE */}
      {viewMode === "web" ? (
        <div className="max-w-7xl mx-auto px-6 lg:px-20 py-20 space-y-32">
          {/* Hero Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-left-8 duration-1000">
              <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 px-4 py-2 rounded-full text-indigo-400 text-xs font-black uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" /> 10/10 Elite Profile
              </div>
              <h1 className="text-6xl lg:text-8xl font-black tracking-tighter leading-[0.9]">
                {user.name || user.username}
              </h1>
              <p className="text-xl text-zinc-400 font-medium max-w-lg leading-relaxed">
                {profile.bio || "Crafting digital experiences and building the future of the creator economy."}
              </p>
              <div className="flex gap-4">
                <button className="bg-white text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-transform">
                  Collaborate 🤝
                </button>
                <button className="border border-white/20 text-white px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/5 transition-all">
                  View Works 📂
                </button>
              </div>
            </div>
            <div className="relative aspect-square rounded-[60px] overflow-hidden border border-white/10 shadow-2xl group animate-in fade-in zoom-in-95 duration-1000 delay-200">
               <img src={profile.avatarUrl || "/placeholder-avatar.jpg"} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000" />
               <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
            </div>
          </section>

          {/* Commerce Section: Mini Shopify */}
          {products.length > 0 && (
            <section className="space-y-12">
              <div className="flex items-end justify-between border-b border-white/10 pb-8">
                <div className="space-y-2">
                  <h2 className="text-4xl font-black tracking-tight">{getRoleDashboardConfig(user.profileRole || '').pages.store.title}</h2>
                  <p className="text-zinc-500 font-bold uppercase text-xs tracking-[0.3em]">{getRoleDashboardConfig(user.profileRole || '').pages.store.subtitle}</p>
                </div>
                <button className="text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-4 transition-all">
                  Browse All <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {products.map((p: any) => (
                  <div key={p.id} className="group bg-zinc-900 border border-white/5 p-6 rounded-[40px] hover:border-indigo-500/50 transition-all duration-500">
                    <div className="aspect-[4/5] rounded-[30px] overflow-hidden mb-6 bg-zinc-800 relative">
                       <img src={p.image || "/placeholder.jpg"} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                       <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white">
                         {p.productType}
                       </div>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-xl font-bold line-clamp-1">{p.name}</h3>
                        <span className="text-indigo-400 font-black">${p.price}</span>
                      </div>
                      <button className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-500 hover:text-white transition-all">
                        Buy Now
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Events Section */}
          {events.length > 0 && (
            <section className="grid grid-cols-1 lg:grid-cols-3 gap-10">
               <div className="lg:col-span-1 space-y-6">
                  <h2 className="text-4xl font-black">Live Events</h2>
                  <p className="text-zinc-500">Join my upcoming workshops, retreats, and interactive masterclasses.</p>
               </div>
               <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                  {events.map((e: any) => (
                    <div key={e.id} className="bg-white/5 border border-white/10 p-8 rounded-[40px] flex flex-col justify-between hover:bg-white/[0.07] transition-all">
                       <div className="space-y-4">
                          <div className="w-12 h-12 rounded-2xl bg-indigo-500 flex items-center justify-center">
                             <Calendar className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold">{e.title}</h3>
                          <div className="flex items-center gap-3 text-zinc-400 text-sm font-bold">
                             <MapPin className="w-4 h-4" /> {e.location || (e.isVirtual ? "Virtual Event" : "TBD")}
                          </div>
                       </div>
                       <button className="mt-8 border border-white/20 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-white text-black transition-all">
                          RSVP Details
                       </button>
                    </div>
                  ))}
               </div>
            </section>
          )}
        </div>
      ) : (
        /* 📱 MOBILE LINK-IN-BIO TEMPLATE (Bento/Kinetic) */
        <div className="max-w-[480px] mx-auto min-h-screen bg-black flex flex-col pb-20">
          <div className="relative aspect-[4/5] max-h-[500px]">
            <img src={profile.avatarUrl || "/placeholder.jpg"} className="absolute inset-0 w-full h-full object-cover grayscale" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-10 left-0 right-0 text-center px-6">
               <h1 className="text-4xl font-black tracking-tighter text-white mb-2">{user.name || user.username}</h1>
               <p className="text-zinc-400 text-sm font-medium">@{user.username}</p>
            </div>
          </div>

          <div className="px-4 py-8 space-y-6">
             {/* Bento Grid Links */}
             <div className="grid grid-cols-2 gap-3">
                {links.map((l: any) => (
                  <Link key={l.id} href={l.url} target="_blank" className="bg-zinc-900 border border-white/5 p-4 rounded-3xl flex flex-col items-center justify-center text-center gap-3 aspect-square group hover:border-indigo-500/50 transition-all">
                     <div className="w-12 h-12 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                        {detectPlatform(l.url).icon}
                     </div>
                     <span className="text-[11px] font-black uppercase tracking-widest leading-tight">{l.title}</span>
                  </Link>
                ))}
             </div>

             {/* Dynamic Store Feed */}
             {products.length > 0 && (
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-500 px-2 mt-10">{getRoleDashboardConfig(user.profileRole || '').pages.store.title}</h4>
                  <div className="flex gap-4 overflow-x-auto pb-4 px-2 no-scrollbar">
                     {products.map((p: any) => (
                        <div key={p.id} className="min-w-[180px] bg-white rounded-[32px] p-2 flex flex-col gap-3">
                           <div className="aspect-square rounded-[24px] overflow-hidden bg-zinc-100">
                             <img src={p.image || "/placeholder.jpg"} className="w-full h-full object-cover" alt={p.name} />
                           </div>
                           <div className="px-2 pb-2">
                             <p className="text-black font-bold text-xs line-clamp-1">{p.name}</p>
                             <p className="text-zinc-400 font-bold text-[10px] mt-0.5">${p.price}</p>
                           </div>
                        </div>
                     ))}
                  </div>
                </div>
             )}
          </div>
        </div>
      )}

      {/* ── 🤖 AI ASSISTANT CHAT WIDGET (Pro Only) ── */}
      {creatorIsPro && (
        <div className="fixed bottom-6 right-6 z-50 text-right">
          {chatOpen && (
            <div className="bg-white w-[360px] h-[500px] mb-4 rounded-[40px] shadow-2xl flex flex-col overflow-hidden text-left border border-zinc-100 animate-in slide-in-from-bottom-10 fade-in duration-500">
              <div className="bg-indigo-600 p-6 flex justify-between items-center text-white">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                      <Bot className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-black uppercase tracking-widest">Personal Assistant</h4>
                      <span className="text-[10px] opacity-60">AI is online & helping</span>
                    </div>
                 </div>
                 <button onClick={() => setChatOpen(false)} className="text-white hover:rotate-90 transition-transform"><X /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-zinc-50">
                 {messages.map((m, i) => (
                   <div key={i} className={`flex ${m.sender === "VISITOR" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[80%] p-4 rounded-[24px] text-sm font-medium ${m.sender === "VISITOR" ? "bg-indigo-600 text-white rounded-br-none" : "bg-white text-black shadow-sm border border-zinc-100 rounded-bl-none"}`}>
                         {m.content}
                      </div>
                   </div>
                 ))}
              </div>
              <div className="p-4 bg-white border-t border-zinc-100 flex gap-2 items-center">
                <input 
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-zinc-100 border-none rounded-2xl px-4 py-3 text-sm font-medium text-black outline-none focus:ring-2 ring-indigo-500/20 transition-all"
                />
                <button 
                  onClick={handleSendMessage}
                  className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center hover:scale-105 transition-all shadow-lg">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className={`w-16 h-16 rounded-[24px] flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all group relative ${chatOpen ? "bg-white text-black" : "bg-black text-white"}`}>
            {chatOpen ? <X /> : <MessageSquare className="group-hover:rotate-12 transition-transform" />}
            {!chatOpen && <div className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-500 rounded-full border-2 border-black animate-pulse" />}
          </button>
        </div>
      )}

    </div>
  );
}
