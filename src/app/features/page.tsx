"use client";

import React from "react";
import Link from "next/link";
import {
  Link2, ShoppingBag, Bot, Calendar, BarChart3, Palette, QrCode, Globe, Mail,
  Gem, Users, MessageSquare, Zap, Phone, Tag, Shield, ArrowRight, Sparkles,
  Star, Crown, ChevronRight, Play, Heart, Lock, Layers, Eye
} from "lucide-react";

const FEATURES = [
  {
    category: "Core",
    color: "from-blue-500 to-indigo-600",
    items: [
      { icon: Link2, title: "Smart Bio Links", desc: "Unlimited links with thumbnails, scheduling, click tracking, and auto-redirect. Add icons, images, and embed blocks to make every link stand out.", badge: "Free" },
      { icon: Palette, title: "Premium Themes", desc: "12+ designer templates with full control over colors, fonts, avatars, button styles, and layout modes. Clone any theme in one click.", badge: "Pro" },
      { icon: BarChart3, title: "Advanced Analytics", desc: "Track clicks, views, revenue, geo data, referrer sources, and device breakdown. Export reports as CSV for your records.", badge: "Pro" },
      { icon: QrCode, title: "QR Code Generator", desc: "Generate branded QR codes in 6 color schemes. Download in PNG/SVG for print, packaging, or social media.", badge: "Free" },
      { icon: Globe, title: "Custom Domain", desc: "Use your own domain like creator.com with full SSL included. One-click DNS setup with automatic certificate renewal.", badge: "Pro" },
    ],
  },
  {
    category: "Commerce",
    color: "from-emerald-500 to-teal-600",
    items: [
      { icon: ShoppingBag, title: "Built-in Store", desc: "Sell ebooks, templates, courses, digital downloads, and physical merch. Zero commission on sales — keep 100% of your revenue.", badge: "Pro" },
      { icon: Calendar, title: "Booking System", desc: "Let fans book 1-on-1 sessions, consultations, coaching calls, and workshops. Integrated calendar with time zone support.", badge: "Pro" },
      { icon: Gem, title: "Creator Credits", desc: "Let fans buy credits to support you and unlock perks. Tiered packs, social proof signals, and 90% revenue share. A new way to monetize.", badge: "Pro" },
      { icon: Tag, title: "Discount Engine", desc: "Create unlimited promo codes with percentage or fixed discounts, max usage limits, and expiry dates. AI-triggered smart discounts.", badge: "Pro" },
      { icon: Mail, title: "Email Capture", desc: "Build your mailing list with embedded newsletter forms. Capture emails directly on your profile page and export to Mailchimp/ConvertKit.", badge: "Pro" },
    ],
  },
  {
    category: "AI & Automation",
    color: "from-violet-500 to-purple-600",
    items: [
      { icon: Bot, title: "AI Assistant", desc: "24/7 AI chatbot trained on your content answers visitor questions. Handles FAQs, product queries, and booking inquiries automatically.", badge: "Pro" },
      { icon: MessageSquare, title: "DM Automation", desc: "Auto-reply to Instagram/Facebook DMs and comments. Build flows with triggers, delays, and conditional logic — like ManyChat for your profile.", badge: "Max" },
      { icon: Phone, title: "WhatsApp & Telegram", desc: "Connect WhatsApp Cloud API and Telegram bots. Auto-send welcome messages, order confirmations, and follow-ups.", badge: "Max" },
      { icon: Users, title: "CRM Pipeline", desc: "Mini CRM with Kanban board. Track leads from discovery to conversion. Log activities, add tags, and set follow-up reminders.", badge: "Max" },
      { icon: Zap, title: "Social Integrations", desc: "Connect Instagram, Facebook, YouTube, and TikTok. Pull analytics, auto-post, and sync your audience across platforms.", badge: "Max" },
    ],
  },
  {
    category: "Business",
    color: "from-amber-500 to-orange-600",
    items: [
      { icon: Shield, title: "Agency Dashboard", desc: "Manage multiple creator profiles from one command center. Track performance, revenue, and engagement across your entire roster.", badge: "Max" },
      { icon: Layers, title: "Talent Roster", desc: "Showcase your agency's creators in a beautiful grid. Filter by category, manage contracts, and share portfolios with brands.", badge: "Max" },
      { icon: Eye, title: "Account Managed By", desc: "Creators can tag their managing agency. The agency name appears on the public profile below the username — building trust and credibility.", badge: "Max" },
      { icon: Lock, title: "Role-based Access", desc: "22 specialized dashboard configurations. Each role gets the exact tools they need — from fitness coaches to real estate agents.", badge: "Free" },
      { icon: Heart, title: "Priority Support", desc: "Dedicated support team with under 4-hour response time. Video call onboarding, migration assistance, and custom feature requests.", badge: "Pro" },
    ],
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-[#030014] text-white">
      {/* Navbar */}
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
            <Link href="/features" className="text-sm text-white font-bold">Features</Link>
            <Link href="/pricing" className="text-sm text-white/50 hover:text-white transition-colors font-medium">Pricing</Link>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors font-medium px-4 py-2">Log in</Link>
            <Link href="/signup" className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-white/90 transition-all hover:scale-105">Sign up free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6 text-center relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[128px]" />
          <div className="absolute top-60 right-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300">20+ features, 1 platform</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-4">
            Every tool you need.<br />
            <span className="text-white/20">Nothing you don&apos;t.</span>
          </h1>
          <p className="text-lg text-white/40 max-w-xl mx-auto mb-8">
            Replace 5+ tools with one platform. Bio links, store, bookings, AI assistant, CRM, and automation — all unified.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup" className="flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-white/90 transition-all hover:scale-105">
              Start building free <ArrowRight className="w-4 h-4" />
            </Link>
            <Link href="/pricing" className="flex items-center gap-2 border border-white/20 text-white px-8 py-4 rounded-full font-bold text-sm hover:bg-white/5 transition-all">
              View pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Categories */}
      {FEATURES.map((cat, ci) => (
        <section key={ci} className="py-16 px-6 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center gap-3 mb-10">
              {(() => { const CatIcon = cat.items[0].icon; return (
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                  <CatIcon className="w-5 h-5 text-white" />
                </div>
              ); })()}
              <h2 className="text-3xl font-black tracking-tighter">{cat.category}</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {cat.items.map((f, fi) => (
                <div key={fi} className="group bg-white/[0.03] border border-white/[0.06] rounded-3xl p-6 hover:bg-white/[0.06] hover:border-white/[0.12] transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${cat.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                      <f.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full ${
                      f.badge === "Free" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" :
                      f.badge === "Pro" ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" :
                      "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                    }`}>{f.badge}</span>
                  </div>
                  <h3 className="text-lg font-black text-white mb-2">{f.title}</h3>
                  <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* Comparison Banner */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-black tracking-tighter mb-4">
            Replace <span className="line-through text-white/20">5+ tools</span> with <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">one platform</span>
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-10">
            {[
              { name: "Linktree", price: "$24/mo" },
              { name: "Calendly", price: "$12/mo" },
              { name: "Gumroad", price: "10% fee" },
              { name: "ManyChat", price: "$15/mo" },
              { name: "Mailchimp", price: "$13/mo" },
            ].map((tool, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl p-4 text-center">
                <p className="text-sm font-bold text-white/50 line-through">{tool.name}</p>
                <p className="text-xs text-white/25 mt-1">{tool.price}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-6 py-3">
            <Crown className="w-4 h-4 text-emerald-400" />
            <span className="text-sm font-bold text-emerald-400">getprofile.link Pro — $7.50/mo (everything included)</span>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600/10 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
            Start building your<br /><span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">creator empire</span> today.
          </h2>
          <p className="text-lg text-white/40 mb-10">Free forever. No credit card required.</p>
          <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-black px-10 py-5 rounded-full font-black text-sm hover:bg-white/90 transition-all hover:scale-105">
            Sign up free <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-xs text-white/20">&copy; {new Date().getFullYear()} getprofile.link — All rights reserved.</p>
      </footer>
    </div>
  );
}
