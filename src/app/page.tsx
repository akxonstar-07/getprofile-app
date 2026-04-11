"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, Check, Star, Zap, BarChart3, ShoppingBag, Palette, Calendar,
  Globe, Users, Sparkles, Heart, Link2, QrCode, Bot, Mail, TrendingUp,
  Award, Eye, Crown, ChevronRight, Play, MessageCircle, DollarSign,
  Smartphone, Shield, BookOpen
} from "lucide-react";

/* ═══ ROTATING HEADLINES ═══ */
const HEADLINES = [
  { text: "Grow your audience", gradient: "from-amber-400 via-yellow-300 to-orange-400" },
  { text: "Promote your products", gradient: "from-cyan-400 via-teal-300 to-emerald-400" },
  { text: "Sell your services", gradient: "from-violet-400 via-purple-300 to-pink-400" },
  { text: "Build your empire", gradient: "from-rose-400 via-pink-300 to-red-400" },
  { text: "Share your content", gradient: "from-emerald-400 via-green-300 to-teal-400" },
  { text: "Monetize your brand", gradient: "from-blue-400 via-indigo-300 to-violet-400" },
];

/* ═══ FEATURE SHOWCASE DATA ═══ */
const SHOWCASE_FEATURES = [
  {
    label: "Commerce",
    title: "Sell Digital Products",
    desc: "Create and sell ebooks, courses, templates, and digital downloads directly through your getprofile.link page. No third-party tools needed.",
    image: "/assets/digital-product.png",
  },
  {
    label: "Monetization",
    title: "Collect Tips",
    desc: "Accept tips and donations from anyone who visits your profile. Your fans support you with one tap — powered by Stripe.",
    image: "/assets/creator-tips.png",
  },
  {
    label: "Education",
    title: "Course Builder",
    desc: "Package your expertise into premium courses. Set pricing, offer discounts, and track enrollments — all from your dashboard.",
    image: "/assets/course-builder.png",
  },
];

/* ═══ TESTIMONIALS ═══ */
const TESTIMONIALS = [
  { name: "Sarah Chen", role: "Fitness Creator · 280K followers", text: "Switched from Linktree and my conversion rate doubled overnight. The built-in store alone pays for itself every month.", avatar: "S", color: "from-rose-500 to-pink-600" },
  { name: "Marcus Johnson", role: "Music Producer · LA", text: "The AI assistant handles my fan questions while I focus on making beats. It's like having a 24/7 virtual manager.", avatar: "M", color: "from-violet-500 to-purple-600" },
  { name: "Priya Sharma", role: "Business Coach · 150K followers", text: "Replaced Linktree + Calendly + Gumroad with one platform. My booking revenue went up 3x in the first month.", avatar: "P", color: "from-amber-500 to-orange-600" },
  { name: "Alex Rivera", role: "Photographer · NYC", text: "The portfolio bento grid makes my work look incredible. Clients book shoots directly from my profile now.", avatar: "A", color: "from-emerald-500 to-teal-600" },
];

export default function LandingPage() {
  const [username, setUsername] = useState("");
  const [headlineIndex, setHeadlineIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  
  // Try It Yourself state
  const [demoTheme, setDemoTheme] = useState(0);
  const [demoName, setDemoName] = useState("James Williams");
  const [demoBio, setDemoBio] = useState("Creator sharing lifestyle, tech & travel ✈️");
  const [demoLinks, setDemoLinks] = useState([
    { title: "🎥 My YouTube Channel", active: true },
    { title: "📸 Follow on Instagram", active: true },
    { title: "🛒 Shop My Merch", active: true },
    { title: "📅 Book a Session", active: true },
  ]);
  
  const themes = [
    { name: "Minimal", bg: "#ffffff", text: "#0f172a", accent: "#6366f1", card: "#f1f5f9" },
    { name: "Dark", bg: "#0f172a", text: "#f1f5f9", accent: "#818cf8", card: "#1e293b" },
    { name: "Ocean", bg: "#0c4a6e", text: "#e0f2fe", accent: "#38bdf8", card: "#075985" },
  ];
  const theme = themes[demoTheme];

  useEffect(() => {
    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setHeadlineIndex((prev) => (prev + 1) % HEADLINES.length);
        setIsAnimating(false);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const headline = HEADLINES[headlineIndex];

  return (
    <div className="min-h-screen bg-[#030014] text-white overflow-x-hidden">

      {/* ═══════════════════════════════════════════
          NAVBAR
      ═══════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/5">
        <div className="absolute inset-0 bg-[#030014]/80 backdrop-blur-2xl" />
        <div className="relative max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-black tracking-tight">getprofile<span className="text-indigo-400">.link</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "Try It", "Pricing", "Testimonials"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-sm text-white/50 hover:text-white transition-colors font-medium">{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors font-medium px-4 py-2">Log in</Link>
            <Link href="/signup" className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-white/90 transition-all hover:scale-105">Sign up free</Link>
          </div>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO — ROTATING HEADLINE
      ═══════════════════════════════════════════ */}
      <section className="relative pt-32 pb-24 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[128px]" />
          <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[128px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05] mb-2">
            <span
              key={headlineIndex}
              className={`inline-block bg-gradient-to-r ${headline.gradient} bg-clip-text text-transparent`}
              style={{
                opacity: isAnimating ? 0 : 1,
                transform: isAnimating ? "translateY(16px)" : "translateY(0)",
                transition: "opacity 0.4s ease, transform 0.4s ease",
              }}
            >
              {headline.text}
            </span>
          </h1>
          <h2 className="text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black tracking-tighter leading-[1.05] text-white/20 mb-8">
            using one link.
          </h2>

          <p className="text-lg text-white/40 max-w-2xl mx-auto mb-2">
            Transform your scattered links into a <strong className="text-white/70">unified digital presence</strong>.
          </p>
          <p className="text-base text-white/25 mb-10">One link, infinite possibilities.</p>

          {/* Username Claim */}
          <div className="max-w-lg mx-auto mb-8">
            <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-2xl p-1.5 pl-5 backdrop-blur-sm hover:border-white/20 transition-all focus-within:border-indigo-500/50">
              <span className="text-white/35 font-bold text-sm flex-shrink-0">getprofile.link/</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="yourname"
                className="flex-1 bg-transparent border-none outline-none text-white font-bold text-sm placeholder:text-white/15 px-1"
              />
              <Link href={`/signup?username=${username}`} className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-cyan-500 text-white px-6 py-3 rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-lg shadow-indigo-500/25">
                Create Profile <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <p className="text-xs text-white/20 mt-3">Free forever · No credit card required</p>
          </div>

          {/* Social Proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-white/30">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {["S","M","P","A"].map((l,i) => (
                  <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] font-black text-white border-2 border-[#030014]">{l}</div>
                ))}
              </div>
              <span className="font-semibold">50K+ creators</span>
            </div>
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
              <span className="font-semibold ml-1">4.9/5</span>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURE SHOWCASE — LINK.ME STYLE
      ═══════════════════════════════════════════ */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-16">
            <p className="text-sm font-bold text-amber-400 uppercase tracking-widest mb-3">One platform</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
              Manage everything in one place
            </h2>
          </div>

          {/* Top Row — Analytics + Mobile Notifications */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {/* Analytics Card */}
            <div className="group relative bg-white/[0.03] border border-white/[0.06] rounded-3xl overflow-hidden hover:border-white/[0.12] transition-all duration-500">
              <div className="aspect-[4/3] overflow-hidden">
                <img src="/assets/analytics-mockup.png" alt="Analytics Dashboard" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-white mb-2">Track your growth in real-time</h3>
                <p className="text-sm text-white/40">View clicks, earnings, and engagement all in one place with powerful analytics.</p>
              </div>
            </div>

            {/* Mobile Notifications Card */}
            <div className="group relative bg-white/[0.03] border border-white/[0.06] rounded-3xl overflow-hidden hover:border-white/[0.12] transition-all duration-500">
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-900/30 to-orange-900/20 flex items-center justify-center p-8">
                <div className="w-[200px] rounded-[2rem] bg-black/80 border border-white/10 p-4 shadow-2xl group-hover:scale-105 transition-transform duration-700">
                  <p className="text-white/50 text-[10px] text-center mb-2">Today</p>
                  <div className="space-y-2">
                    {[
                      { text: "Brand deal accepted for $5,000!", time: "1:47" },
                      { text: "Hat sale of $19!", time: "1:47" },
                      { text: "New booking: $150 session", time: "1:45" },
                    ].map((n, i) => (
                      <div key={i} className="bg-white/10 rounded-xl p-2.5 flex items-start gap-2">
                        <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Globe className="w-3 h-3 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold text-white">getprofile.link</p>
                          <p className="text-[9px] text-white/50 truncate">{n.text}</p>
                        </div>
                        <span className="text-[8px] text-white/30 flex-shrink-0">{n.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-white mb-2">Run your business from anywhere</h3>
                <p className="text-sm text-white/40">Get real-time notifications for every sale, booking, and engagement event.</p>
              </div>
            </div>
          </div>

          {/* Bottom Row — Products + Tips + Courses */}
          <div className="grid md:grid-cols-2 gap-5 mb-5">
            {SHOWCASE_FEATURES.slice(0, 2).map((feature, i) => (
              <div key={i} className="group relative bg-white/[0.03] border border-white/[0.06] rounded-3xl overflow-hidden hover:border-white/[0.12] transition-all duration-500">
                <div className="aspect-[4/3] overflow-hidden">
                  <img src={feature.image} alt={feature.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-black text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-white/40">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Course Builder Card */}
          <div className="grid md:grid-cols-2 gap-5">
            <div className="group relative bg-white/[0.03] border border-white/[0.06] rounded-3xl overflow-hidden hover:border-white/[0.12] transition-all duration-500">
              <div className="aspect-[4/3] overflow-hidden">
                <img src="/assets/course-builder.png" alt="Course Builder" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-white mb-2">Course Builder</h3>
                <p className="text-sm text-white/40">Create courses and charge for premium access to your expertise.</p>
              </div>
            </div>

            {/* Paywall Content Card */}
            <div className="group relative bg-white/[0.03] border border-white/[0.06] rounded-3xl overflow-hidden hover:border-white/[0.12] transition-all duration-500">
              <div className="aspect-[4/3] bg-gradient-to-br from-emerald-900/20 to-cyan-900/10 flex items-center justify-center p-8">
                <div className="w-[180px] rounded-2xl bg-white/5 border border-white/10 p-4 text-center backdrop-blur-sm group-hover:scale-105 transition-transform duration-700">
                  <div className="text-3xl mb-2">🔒</div>
                  <p className="text-sm font-black text-white mb-1">Behind The Scenes</p>
                  <p className="text-[10px] text-white/50 mb-3">Exclusive content for supporters</p>
                  <div className="flex justify-center gap-1 mb-3">
                    {["❤️","🔥","😍","❤️","🔥"].map((e,i) => <span key={i} className="text-sm">{e}</span>)}
                  </div>
                  <div className="bg-white/10 rounded-xl py-2 text-[11px] font-bold text-white mb-2">Pay with Apple Pay</div>
                  <p className="text-sm font-black text-emerald-400">$4.99</p>
                </div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-black text-white mb-2">Paywall Content</h3>
                <p className="text-sm text-white/40">Share exclusive content and get paid through your profile.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOR EVERYONE SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-16">
            For everyone from<br />creators to enterprise
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "For People",
                tag: "Show the world who you are",
                desc: "Unite your socials, content, and products in one place. Capture leads, sell products, and build your brand while owning your data.",
                icon: Users,
                gradient: "from-indigo-500/20 to-purple-500/10",
              },
              {
                title: "For Business",
                tag: "Show the world what you can do",
                desc: "Transform your digital presence into a conversion hub. Capture leads, drive sales, and grow your brand with customizable profiles and advanced analytics.",
                icon: ShoppingBag,
                gradient: "from-emerald-500/20 to-teal-500/10",
              },
              {
                title: "For Agencies",
                tag: "Show the world why you",
                desc: "Manage and scale all your talent or clients from one powerful dashboard. Create profiles, track performance, and open new revenue streams.",
                icon: BarChart3,
                gradient: "from-amber-500/20 to-orange-500/10",
              },
            ].map((item, i) => (
              <div key={i} className="group">
                <div className={`bg-gradient-to-br ${item.gradient} border border-white/[0.06] rounded-3xl p-6 mb-5 hover:border-white/[0.12] transition-all duration-500 aspect-[4/3] flex items-center justify-center`}>
                  <div className="w-full max-w-[200px] rounded-2xl bg-white/5 border border-white/10 p-5 backdrop-blur-sm group-hover:scale-105 transition-transform duration-700">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span className="text-[9px] text-white/40 font-bold">{item.tag}</span>
                    </div>
                    <item.icon className="w-10 h-10 text-white/20 mb-3" />
                    <div className="space-y-1.5">
                      <div className="h-2 bg-white/10 rounded-full w-full" />
                      <div className="h-2 bg-white/10 rounded-full w-3/4" />
                      <div className="h-2 bg-white/10 rounded-full w-1/2" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-black text-white mb-2">{item.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES GRID
      ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
              <Zap className="w-3.5 h-3.5 text-indigo-400" />
              <span className="text-xs font-bold text-indigo-300">Packed with features</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
              Everything you need.
              <br /><span className="text-white/20">Nothing you don&apos;t.</span>
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Link2, title: "Smart Bio Links", desc: "Unlimited links with thumbnails, scheduling, and real-time click tracking.", color: "from-blue-500 to-indigo-600" },
              { icon: ShoppingBag, title: "Built-in Store", desc: "Sell digital products, courses, and merch with zero commission.", color: "from-emerald-500 to-teal-600" },
              { icon: Calendar, title: "Booking System", desc: "Let fans book sessions, consultations, and appointments directly.", color: "from-violet-500 to-purple-600" },
              { icon: Bot, title: "AI Assistant", desc: "24/7 AI chatbot answers visitor questions using your content.", color: "from-amber-500 to-orange-600" },
              { icon: BarChart3, title: "Pro Analytics", desc: "Track views, clicks, revenue, geo data, and referrer sources.", color: "from-rose-500 to-pink-600" },
              { icon: Palette, title: "Custom Themes", desc: "12+ designer templates with custom fonts, colors, and layouts.", color: "from-cyan-500 to-blue-600" },
              { icon: QrCode, title: "QR Code Generator", desc: "Branded QR codes in 6 colors. Download, print, share anywhere.", color: "from-indigo-500 to-violet-600" },
              { icon: Globe, title: "Custom Domain", desc: "Use your own domain like john.com with full SSL included.", color: "from-teal-500 to-emerald-600" },
              { icon: Mail, title: "Email Capture", desc: "Build your mailing list with embedded newsletter signup forms.", color: "from-pink-500 to-rose-600" },
            ].map((f, i) => (
              <div key={i} className="group bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
                <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRY IT YOURSELF
      ═══════════════════════════════════════════ */}
      <section id="try-it" className="py-24 px-6 bg-white text-slate-900 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">Try It Yourself</span>
            </h2>
            <p className="text-slate-500">Design your perfect landing page <strong className="text-slate-700">in real-time</strong>. Play with themes, add your links, and watch it come to life.</p>
            <p className="text-sm text-slate-300 mt-1">No signup required. Just pure creativity.</p>
          </div>

          <div className="grid lg:grid-cols-[1fr_320px] gap-10 items-start">
            {/* Editor */}
            <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
              <div className="flex border-b border-slate-100">
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm">
                  <Palette className="w-4 h-4" /> Design
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 text-slate-400 font-bold text-sm">
                  <Link2 className="w-4 h-4" /> Links
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Theme Picker */}
                <div>
                  <label className="text-sm font-bold text-indigo-500 mb-3 block">Header Style</label>
                  <p className="text-xs text-slate-400 mb-3">Choose your base style</p>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map((t, i) => (
                      <button key={i} onClick={() => setDemoTheme(i)} className={`relative rounded-2xl p-4 border-2 transition-all ${demoTheme === i ? "border-purple-400 bg-purple-50 shadow-lg" : "border-slate-100 hover:border-slate-200"}`}>
                        <div className="w-8 h-8 rounded-full mx-auto mb-2" style={{ background: t.accent }} />
                        <p className="text-xs font-bold text-slate-700">{t.name}</p>
                        {demoTheme === i && <div className="absolute top-2 right-2 w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center"><Check className="w-3 h-3 text-white" /></div>}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Name & Bio */}
                <div>
                  <label className="text-sm font-bold text-indigo-500 mb-2 block">Display Name</label>
                  <input type="text" value={demoName} onChange={(e) => setDemoName(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-indigo-400 transition-all" />
                </div>
                <div>
                  <label className="text-sm font-bold text-indigo-500 mb-2 block">Bio</label>
                  <textarea value={demoBio} onChange={(e) => setDemoBio(e.target.value)} rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-medium outline-none focus:border-indigo-400 transition-all resize-none" />
                </div>
                {/* Link Toggles */}
                <div>
                  <label className="text-sm font-bold text-indigo-500 mb-3 block">Your Links</label>
                  <div className="space-y-2">
                    {demoLinks.map((link, i) => (
                      <div key={i} className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 border border-slate-100">
                        <span className="text-sm font-medium text-slate-700">{link.title}</span>
                        <button onClick={() => { const u = [...demoLinks]; u[i] = { ...u[i], active: !u[i].active }; setDemoLinks(u); }}
                          className={`w-10 h-6 rounded-full transition-all flex items-center p-0.5 ${link.active ? "bg-indigo-500 justify-end" : "bg-slate-200 justify-start"}`}>
                          <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <Link href="/signup" className="block w-full text-center py-4 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all">
                  🚀 Save This & Sign Up
                </Link>
              </div>
            </div>

            {/* Live Preview Phone */}
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 mb-4"><Eye className="w-4 h-4 text-slate-400" /><span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Live Preview</span></div>
              <div className="w-[280px] rounded-[2.5rem] p-[10px] shadow-2xl" style={{ background: "linear-gradient(145deg, #1e293b, #0f172a)", border: "2px solid #334155" }}>
                <div className="flex justify-center mb-2"><div className="w-20 h-5 rounded-full bg-black" /></div>
                <div className="rounded-[2rem] overflow-hidden" style={{ background: theme.bg, height: 480 }}>
                  <div className="h-20 relative" style={{ background: `linear-gradient(135deg, ${theme.accent}dd, ${theme.accent}88)` }}>
                    <div className="absolute -bottom-8 left-1/2 -translate-x-1/2">
                      <div className="w-16 h-16 rounded-2xl border-4 flex items-center justify-center text-xl font-black text-white shadow-xl" style={{ borderColor: theme.bg, background: `linear-gradient(135deg, ${theme.accent}, ${theme.accent}99)` }}>
                        {demoName?.[0]?.toUpperCase() || "?"}
                      </div>
                    </div>
                  </div>
                  <div className="pt-12 px-5 pb-4 text-center">
                    <p className="font-black text-sm mb-0.5" style={{ color: theme.text }}>{demoName || "Your Name"}</p>
                    <p className="text-[10px] mb-3" style={{ color: theme.text, opacity: 0.4 }}>{demoBio}</p>
                    <div className="flex justify-center gap-2 mb-4">
                      {["📸","🎵","🐦","▶️"].map((e,i) => <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-xs" style={{ background: theme.card }}>{e}</div>)}
                    </div>
                    <div className="space-y-2">
                      {demoLinks.filter(l => l.active).map((link, i) => (
                        <div key={i} className="rounded-xl py-2.5 px-4 text-[11px] font-bold text-center" style={{
                          background: i === 2 ? `linear-gradient(135deg, ${theme.accent}, ${theme.accent}cc)` : theme.card,
                          color: i === 2 ? "#fff" : theme.text,
                          border: `1px solid ${theme.text}10`,
                        }}>{link.title}</div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-2"><div className="w-12 h-1 rounded-full bg-slate-600" /></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════════════ */}
      <section id="testimonials" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-1.5 mb-6">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">Loved by creators</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">Real creators. Real results.</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 hover:bg-white/[0.06] transition-all duration-500">
                <div className="flex gap-0.5 mb-4">{Array.from({length:5}).map((_,j) => <Star key={j} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
                <p className="text-sm text-white/50 leading-relaxed mb-6">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-sm font-black text-white`}>{t.avatar}</div>
                  <div><p className="text-sm font-bold text-white">{t.name}</p><p className="text-xs text-white/40">{t.role}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRICING
      ═══════════════════════════════════════════ */}
      <section id="pricing" className="py-24 px-6 bg-white text-slate-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-3">Choose Your Perfect Plan</h2>
            <p className="text-slate-400 mb-8">Simple, transparent pricing for creators and agencies.</p>
            <div className="inline-flex items-center gap-1 bg-slate-200 rounded-full p-1">
              <button onClick={() => setBillingCycle("monthly")} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${billingCycle === "monthly" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>Monthly</button>
              <button onClick={() => setBillingCycle("annual")} className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${billingCycle === "annual" ? "bg-gradient-to-r from-emerald-400 to-cyan-500 text-white" : "text-slate-500"}`}>Annual</button>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Free */}
            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
              <div className="flex items-center gap-3 mb-4"><Users className="w-5 h-5 text-slate-400" /><h3 className="text-xl font-black">Free</h3></div>
              <p className="text-sm text-slate-400 mb-6">Get started with the basics</p>
              <div className="flex items-baseline gap-1 mb-6"><span className="text-4xl font-black">$0</span><span className="text-sm text-slate-400">/forever</span></div>
              <Link href="/signup" className="block w-full text-center py-3.5 rounded-2xl bg-slate-100 text-slate-700 font-bold text-sm hover:bg-slate-200 transition-all mb-6">Get Started Free</Link>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">What&apos;s included:</p>
              <div className="space-y-3">
                {["5 bio links","Basic analytics","1 standard theme","getprofile.link/username","Community support"].map((f,j) => (
                  <div key={j} className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center"><Check className="w-3 h-3 text-slate-400" /></div><span className="text-sm text-slate-500">{f}</span></div>
                ))}
              </div>
            </div>
            {/* Pro */}
            <div className="relative bg-white rounded-3xl p-8 border-2 border-indigo-200 shadow-xl">
              <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1"><Star className="w-3 h-3 fill-white" /> POPULAR</div>
              <div className="flex items-center gap-3 mb-2"><Crown className="w-5 h-5 text-indigo-500" /><h3 className="text-xl font-black">Pro</h3></div>
              <p className="text-sm text-slate-400 mb-1">Advanced features for creators</p>
              <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-full px-3 py-1 mb-5"><Sparkles className="w-3 h-3 text-emerald-500" /><span className="text-[10px] font-black text-emerald-600">14-Day Free Trial</span></div>
              <div className="flex items-baseline gap-1 mb-2"><span className="text-4xl font-black">{billingCycle === "annual" ? "$7.50" : "$9"}</span><span className="text-sm text-slate-400">/mo</span></div>
              {billingCycle === "annual" && <p className="text-xs text-emerald-500 font-bold mb-5">Billed as $90/year. <span className="text-rose-500">That saves you $18!</span></p>}
              <Link href="/signup" className="block w-full text-center py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold text-sm shadow-lg hover:opacity-90 transition-all mb-6">Start Free Trial</Link>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">What&apos;s included:</p>
              <div className="space-y-3">
                {["Everything in Free","Unlimited links","Premium Customization","Theme Cloning","Advanced Analytics","Geo Filters","Built-in Store","Booking System","AI Assistant","Custom Domain","Email Capture","Priority Support"].map((f,j) => (
                  <div key={j} className="flex items-center gap-3"><div className="w-5 h-5 rounded-full bg-emerald-50 flex items-center justify-center"><Check className="w-3 h-3 text-emerald-500" /></div><span className="text-sm text-slate-600">{f}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Ready to own<br /><span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">your online presence?</span>
          </h2>
          <p className="text-lg text-white/40 mb-10">Join 50,000+ creators who upgraded from basic link-in-bio tools.</p>
          <div className="max-w-md mx-auto">
            <div className="flex items-center bg-white/[0.06] border border-white/10 rounded-2xl p-1.5 pl-5 backdrop-blur-sm">
              <span className="text-white/35 font-bold text-sm flex-shrink-0">getprofile.link/</span>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="yourname" className="flex-1 bg-transparent border-none outline-none text-white font-bold text-sm placeholder:text-white/15 px-1" />
              <Link href={`/signup?username=${username}`} className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold text-sm hover:bg-white/90 transition-all">Get started <ArrowRight className="w-4 h-4" /></Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="border-t border-white/5 py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center"><Globe className="w-4 h-4 text-white" /></div>
                <span className="text-lg font-black">getprofile<span className="text-indigo-400">.link</span></span>
              </div>
              <p className="text-sm text-white/30 leading-relaxed">The all-in-one creator platform. Bio links, store, bookings, and AI — unified.</p>
            </div>
            {[
              { title: "Product", items: ["Features","Pricing","Templates","Analytics","API"] },
              { title: "Company", items: ["About","Blog","Careers","Press","Contact"] },
              { title: "Legal", items: ["Privacy","Terms","Cookies","GDPR"] },
            ].map((col,i) => (
              <div key={i}>
                <h4 className="text-xs font-black uppercase tracking-widest text-white/30 mb-4">{col.title}</h4>
                <div className="space-y-3">{col.items.map(item => <a key={item} href="#" className="block text-sm text-white/40 hover:text-white transition-colors">{item}</a>)}</div>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/20">&copy; {new Date().getFullYear()} getprofile.link — All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-white/20 hover:text-white/60 transition-colors"><svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg></a>
              <a href="#" className="text-white/20 hover:text-white/60 transition-colors"><svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg></a>
              <a href="#" className="text-white/20 hover:text-white/60 transition-colors"><svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.5 6.9a3 3 0 00-2.1-2.1C19.5 4.3 12 4.3 12 4.3s-7.5 0-9.4.5A3 3 0 00.5 6.9C0 8.8 0 12.7 0 12.7s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 16.1V9.3l6.3 3.4-6.3 3.4z"/></svg></a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
