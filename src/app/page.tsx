"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import {
  ArrowRight, Sparkles, Link2, Palette, ShoppingBag, BarChart3,
  Globe, Star, Play, CheckCircle2, ChevronRight, Zap
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────── */
const PLANS = [
  { 
    name: "Free", 
    price: "$0", 
    period: "forever", 
    desc: "Everything you need to build your digital presence.",
    features: ["1 Profile", "5 Smart Links", "3 Portfolio items", "Basic analytics", "GetProfile watermark"], 
    cta: "Claim Free Profile", 
    popular: false 
  },
  { 
    name: "Pro", 
    price: "$9", 
    period: "/month", 
    desc: "For elite creators ready to scale and monetize.",
    features: ["Unlimited Links & Portfolio", "Creator Store + Affiliates", "Custom Themes & Fonts", "Advanced Analytics", "Remove Watermark"], 
    cta: "Start 14-day trial", 
    popular: true 
  },
];

const FAQS = [
  { q: "What is GetProfile?", a: "An elite all-in-one creator platform. It acts as your link-in-bio, portfolio, and digital store combined into one beautiful profile." },
  { q: "How is this different from Linktree?", a: "Linktree only does links. GetProfile adds a high-fidelity portfolio gallery, a creator store to sell digital products, and deep analytics—designed specifically for modern creators." },
  { q: "Can I sell digital products?", a: "Yes. Add your own products with checkout links or add affiliate links from Amazon, brands, or any platform." },
  { q: "What is the difference between Free and Pro?", a: "Free gives you a stunning profile with up to 5 links. Pro unlocks unlimited links, the Creator Store, advanced analytics, and removes the watermark forever." },
];

/* ─── Profile Phone Mockup ──────────────────────────────────── */
function PhoneMockup() {
  return (
    <div className="relative w-[280px] h-[580px] rounded-[40px] border-[8px] border-slate-900 bg-black shadow-2xl shadow-indigo-500/20 overflow-hidden flex-shrink-0 z-10 transition-transform duration-700 hover:scale-105">
      {/* Top Notch */}
      <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-20">
        <div className="w-32 h-6 bg-slate-900 rounded-b-3xl"></div>
      </div>
      
      {/* Screen Content */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-4 flex flex-col pt-12">
        <div className="w-20 h-20 rounded-full mx-auto mb-4 p-1 rounded-full bg-gradient-to-tr from-cyan-400 to-indigo-500">
           <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80" alt="Creator" className="w-full h-full object-cover rounded-full border-2 border-black" />
        </div>
        <h3 className="text-white font-bold text-lg text-center">Sarah Jenkins</h3>
        <p className="text-indigo-200 text-xs text-center mb-6">Digital Creator & Designer</p>
        
        <div className="space-y-3 flex-1">
          <div className="w-full py-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white text-sm font-semibold flex items-center justify-between">
            <span>My Presets (Store)</span> <ChevronRight className="w-4 h-4 opacity-50" />
          </div>
          <div className="w-full py-3 px-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10 text-white text-sm font-semibold flex items-center justify-between">
            <span>Photography Portfolio</span> <ChevronRight className="w-4 h-4 opacity-50" />
          </div>
          <div className="w-full py-3 px-4 rounded-2xl bg-white/5 border border-white/5 text-slate-300 text-sm font-semibold flex items-center justify-between">
            <span>Watch my latest video</span> <Play className="w-4 h-4 opacity-50" />
          </div>
        </div>
        
        <div className="pb-2 text-center text-[10px] text-slate-500 flex items-center justify-center gap-1">
          <Globe className="w-3 h-3" /> getprofile.me/sarah
        </div>
      </div>
    </div>
  );
}

/* ─── VIP Marquee ───────────────────────────────────────────── */
const AVATARS = [
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&h=100&fit=crop",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
];

/* ─── Page ──────────────────────────────────────────────────── */
export default function HomePage() {
  const { data: session } = useSession();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Injects keyframes for smooth horizontal auto-scrolling
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes scroll {
        0% { transform: translateX(0); }
        100% { transform: translateX(-50%); }
      }
      .animate-scroll {
        animation: scroll 20s linear infinite;
      }
      .animate-float {
        animation: float 6s ease-in-out infinite;
      }
      .animate-float-delayed {
        animation: float 6s ease-in-out 3s infinite;
      }
      @keyframes float {
        0% { transform: translateY(0px); }
        50% { transform: translateY(-20px); }
        100% { transform: translateY(0px); }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-50 overflow-hidden font-sans selection:bg-indigo-500/30">

      {/* ── FLOATING PILL NAVBAR ── */}
      <div className="fixed top-6 inset-x-0 z-50 flex justify-center px-4">
        <nav className="w-full max-w-4xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-6 py-3 flex items-center justify-between shadow-2xl shadow-black/50">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">GetProfile</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {["features", "pricing", "faq"].map(s => (
              <a key={s} href={`#${s}`} className="text-sm text-slate-300 hover:text-white transition-colors capitalize font-medium">{s}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/dashboard" className="px-5 py-2 rounded-full bg-white text-slate-900 text-sm font-bold hover:bg-slate-200 transition-colors">
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="hidden sm:block text-sm font-medium text-slate-300 hover:text-white transition-colors">Log in</Link>
                <Link href="/signup" className="px-5 py-2 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:opacity-90 transition-opacity">
                  Claim your link
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>

      {/* ── LINK.ME ORBITAL HERO ── */}
      <section className="relative pt-44 pb-32 px-6 lg:min-h-screen flex items-center">
        {/* Massive Neon Glowing Orbs Background */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center z-10">
          {/* Left Sub-Hero Text */}
          <div className="text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-8 backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <span className="text-sm font-medium text-slate-300">The Ultimate Creator Hub</span>
            </div>
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-white leading-[1.05] mb-6 drop-shadow-2xl">
              One link.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
                Your entire world.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-400 max-w-lg mb-10 leading-relaxed font-medium">
              Combine your link-in-bio, portfolio, and digital storefront into one jaw-dropping, elite profile. 
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <Link href="/signup"
                className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-slate-900 text-lg font-black hover:bg-slate-200 hover:scale-105 transition-all flex items-center justify-center gap-2">
                Claim getprofile.me/ <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>

          {/* Right Floating Phone Mockup */}
          <div className="relative flex justify-center lg:justify-end items-center h-[600px]">
            {/* Orbital Glass Cards */}
            <div className="absolute top-10 right-10 animate-float bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl z-20 flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">34.2K Views</p>
                <p className="text-slate-400 text-xs">This month</p>
              </div>
            </div>

            <div className="absolute bottom-20 left-0 animate-float-delayed bg-white/10 backdrop-blur-xl border border-white/20 p-4 rounded-2xl shadow-2xl z-20 flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Preset Sold!</p>
                <p className="text-emerald-400 text-xs">+$29.00</p>
              </div>
            </div>

            <PhoneMockup />
          </div>
        </div>
      </section>

      {/* ── VIP MARQUEE (HOO.BE STYLE) ── */}
      <section className="py-10 border-y border-white/5 bg-white/[0.02] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-6 text-center">
          <p className="text-sm font-bold tracking-widest text-slate-500 uppercase">Loved by 10,000+ elite creators</p>
        </div>
        <div className="flex whitespace-nowrap overflow-hidden relative w-full">
          {/* Fading Edges */}
          <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-[#020617] to-transparent z-10" />
          <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-[#020617] to-transparent z-10" />
          
          <div className="flex gap-8 animate-scroll items-center w-[200%]">
            {[...AVATARS, ...AVATARS, ...AVATARS].map((src, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full pr-6 p-2 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default">
                <img src={src} className="w-10 h-10 rounded-full object-cover border border-white/20 grayscale hover:grayscale-0 transition-all" alt="Creator" />
                <div className="flex flex-col">
                  <span className="text-white text-sm font-bold">Creator {i+1}</span>
                  <div className="flex items-center gap-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><Star className="w-3 h-3 text-amber-400 fill-amber-400" /></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THE BENTO BOX FEATURE GRID ── */}
      <section id="features" className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Everything you need. <span className="text-slate-500">Zero bloat.</span></h2>
            <p className="text-lg text-slate-400">A powerful suite of tools designed exclusively so you can monetize and grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[280px]">
            {/* Large Card 1: Store */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-3xl rounded-full" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-2xl flex items-center justify-center mb-6 border border-emerald-500/30">
                    <ShoppingBag className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Digital Storefront</h3>
                  <p className="text-slate-400 max-w-sm">Sell ebooks, courses, presets, and accept payments seamlessly directly on your profile. No external websites needed.</p>
                </div>
                <div className="mt-6 flex gap-3">
                  <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Stripe Ready</div>
                  <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs font-bold flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-emerald-400"/> Instant Payouts</div>
                </div>
              </div>
            </div>

            {/* Small Card 1: Links */}
            <div className="bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
              <div className="w-12 h-12 bg-indigo-500/20 text-indigo-400 rounded-2xl flex items-center justify-center mb-6 border border-indigo-500/30">
                <Link2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Smart Links</h3>
              <p className="text-slate-400 text-sm">Add unlimited links with high-conversion animations and deep real-time click tracking.</p>
            </div>

            {/* Small Card 2: Customization */}
            <div className="bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
              <div className="w-12 h-12 bg-pink-500/20 text-pink-400 rounded-2xl flex items-center justify-center mb-6 border border-pink-500/30">
                <Palette className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Bespoke Themes</h3>
              <p className="text-slate-400 text-sm">Choose from 6+ stunning themes or craft your exact brand identity with custom colors and fonts.</p>
            </div>

            {/* Large Card 2: Analytics */}
            <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-black border border-white/10 rounded-3xl p-8 relative overflow-hidden group">
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-cyan-500/10 blur-3xl rounded-full" />
              <div className="relative z-10 h-full flex flex-col md:flex-row gap-8 items-center">
                <div className="flex-1">
                  <div className="w-12 h-12 bg-cyan-500/20 text-cyan-400 rounded-2xl flex items-center justify-center mb-6 border border-cyan-500/30">
                    <BarChart3 className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Audience Analytics</h3>
                  <p className="text-slate-400">Track profile views, locate geography, monitor CTR, and analyze exactly where your revenue originates in real-time.</p>
                </div>
                {/* Simulated Chart Mockup */}
                <div className="w-full max-w-[200px] h-32 bg-white/5 border border-white/10 rounded-xl relative flex items-end p-2 gap-1 backdrop-blur-sm">
                  {[40, 60, 45, 80, 55, 90, 100].map((h, i) => (
                    <div key={i} className="flex-1 bg-gradient-to-t from-cyan-500 to-indigo-500 rounded-t-sm" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2-TIER PRICING ── */}
      <section id="pricing" className="py-32 px-6 relative bg-black/40 border-y border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Simple, Transparent Pricing.</h2>
            <p className="text-lg text-slate-400">No hidden fees. Scale your audience without limits.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-center">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`relative rounded-[32px] p-8 sm:p-10 ${
                plan.popular 
                ? "bg-gradient-to-b from-indigo-900/40 to-slate-900/40 border-2 border-indigo-500/50 shadow-2xl shadow-indigo-500/20 transform md:-translate-y-4" 
                : "bg-slate-900/50 border border-white/10"
              }`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-indigo-500 to-cyan-400 text-white text-xs font-bold rounded-full shadow-lg">
                    MOST POPULAR
                  </div>
                )}
                
                <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                <p className="text-sm text-slate-400 mb-6 h-10">{plan.desc}</p>
                
                <div className="flex items-baseline gap-1 mb-8">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-slate-400 font-medium">{plan.period}</span>
                </div>

                <Link href="/signup" className={`w-full py-4 rounded-full font-bold text-sm flex items-center justify-center transition-all ${
                  plan.popular 
                  ? "bg-white text-slate-900 hover:bg-slate-200 hover:scale-105" 
                  : "bg-slate-800 text-white hover:bg-slate-700"
                }`}>
                  {plan.cta}
                </Link>

                <div className="mt-10 space-y-4">
                  {plan.features.map(f => (
                    <div key={f} className="flex items-start gap-3">
                      <div className={`mt-0.5 rounded-full p-1 ${plan.popular ? "bg-indigo-500/20 text-indigo-400" : "bg-white/10 text-slate-300"}`}>
                        <CheckCircle2 className="w-3 h-3" />
                      </div>
                      <span className="text-sm font-medium text-slate-300">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-32 px-6 max-w-3xl mx-auto">
        <h2 className="text-3xl font-black text-center text-white mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-slate-900/50 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-colors">
              <button 
                className="w-full px-6 py-5 text-left flex items-center justify-between font-bold text-slate-200"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <ChevronRight className={`w-5 h-5 text-slate-500 transition-transform ${openFaq === i ? "rotate-90" : ""}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/5 pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-white/10 bg-black pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-gradient-to-tr from-indigo-500 to-cyan-400 rounded-md flex items-center justify-center">
              <Globe className="w-3 h-3 text-white" />
            </div>
            <span className="font-bold text-white tracking-tight">GetProfile</span>
          </div>
          <p className="text-sm text-slate-500 font-medium">© {new Date().getFullYear()} GetProfile. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
