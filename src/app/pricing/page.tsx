"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Check, X, Crown, Sparkles, Zap, Globe, Star, ArrowRight,
  Users, ShoppingBag, Bot, Calendar, BarChart3, Palette,
  Mail, Link2, QrCode, Shield, MessageSquare, Gem, Phone, Tag
} from "lucide-react";

const PLANS = [
  {
    name: "Free",
    tagline: "Perfect to get started",
    monthlyPrice: 0,
    annualPrice: 0,
    icon: Users,
    color: "from-slate-500 to-slate-600",
    cardBorder: "border-slate-200",
    ctaText: "Start Free",
    ctaStyle: "bg-slate-100 text-slate-700 hover:bg-slate-200",
    features: [
      { text: "5 Bio Links", included: true },
      { text: "Basic Analytics", included: true },
      { text: "1 Standard Theme", included: true },
      { text: "getprofile.link/username", included: true },
      { text: "Community Support", included: true },
      { text: "Custom Domain", included: false },
      { text: "Built-in Store", included: false },
      { text: "AI Assistant", included: false },
      { text: "Booking System", included: false },
      { text: "Creator Credits", included: false },
      { text: "DM Automation", included: false },
      { text: "CRM Pipeline", included: false },
    ],
  },
  {
    name: "Pro",
    tagline: "For serious creators",
    monthlyPrice: 9,
    annualPrice: 7.5,
    icon: Crown,
    color: "from-indigo-500 to-purple-600",
    cardBorder: "border-indigo-300",
    popular: true,
    ctaText: "Start 14-Day Free Trial",
    ctaStyle: "bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg shadow-indigo-500/25 hover:opacity-90",
    features: [
      { text: "Unlimited Links", included: true },
      { text: "Advanced Analytics + Geo", included: true },
      { text: "All Premium Themes", included: true },
      { text: "Custom Domain (SSL)", included: true },
      { text: "Built-in Store", included: true },
      { text: "AI Assistant (24/7)", included: true },
      { text: "Booking & Calls", included: true },
      { text: "Creator Credits", included: true },
      { text: "Discount Engine", included: true },
      { text: "Email Capture", included: true },
      { text: "Priority Support", included: true },
      { text: "DM Automation", included: false },
      { text: "CRM Pipeline", included: false },
    ],
  },
  {
    name: "Max",
    tagline: "Full automation suite",
    monthlyPrice: 29,
    annualPrice: 24,
    icon: Zap,
    color: "from-violet-500 to-fuchsia-600",
    cardBorder: "border-violet-300",
    ctaText: "Upgrade to Max",
    ctaStyle: "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25 hover:opacity-90",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "DM Automation", included: true },
      { text: "CRM Pipeline", included: true },
      { text: "WhatsApp & Telegram", included: true },
      { text: "Social Integrations", included: true },
      { text: "Flow Builder", included: true },
      { text: "Global Triggers", included: true },
      { text: "Agency Dashboard", included: true },
      { text: "Talent Roster", included: true },
      { text: "Account Managed By", included: true },
      { text: "Dedicated Support", included: true },
      { text: "API Access", included: true },
    ],
  },
];

const FAQ = [
  { q: "Can I switch plans anytime?", a: "Yes! Upgrade or downgrade at any time. If you upgrade mid-cycle, we'll prorate the difference. Downgrades take effect at the end of your billing period." },
  { q: "What happens after my trial ends?", a: "You'll be downgraded to the Free plan automatically. No charges unless you explicitly upgrade. Your data is safe." },
  { q: "Do you take a commission on sales?", a: "Zero commission on product sales. For Creator Credits, we take a 10% platform fee — industry-leading compared to competitors at 15-30%." },
  { q: "Is there a student discount?", a: "Yes! Students and educators get 50% off Pro. Contact us with your .edu email address." },
  { q: "Can I use my own domain?", a: "Pro and Max plans include custom domain support with free SSL. Point your domain to us and we handle the rest." },
  { q: "What payment methods do you accept?", a: "We support UPI, credit/debit cards, net banking, and wallets via Razorpay. International payments via Stripe coming soon." },
];

export default function PricingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-white/60 hover:text-white transition-colors font-medium px-4 py-2">Log in</Link>
            <Link href="/signup" className="text-sm font-bold bg-white text-black px-5 py-2.5 rounded-full hover:bg-white/90 transition-all hover:scale-105">Sign up free</Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-8 px-6 text-center relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[128px]" />
          <div className="absolute top-40 right-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[128px]" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-6">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-bold text-indigo-300">Simple, transparent pricing</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter mb-4">
            Choose your <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">perfect plan</span>
          </h1>
          <p className="text-lg text-white/40 mb-8">Start free, upgrade when you need more power. No hidden fees.</p>

          {/* Billing Toggle */}
          <div className="inline-flex items-center gap-1 bg-white/[0.06] border border-white/10 rounded-full p-1">
            <button onClick={() => setBilling("monthly")} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all ${billing === "monthly" ? "bg-white text-black shadow-sm" : "text-white/50 hover:text-white"}`}>Monthly</button>
            <button onClick={() => setBilling("annual")} className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${billing === "annual" ? "bg-gradient-to-r from-emerald-400 to-cyan-500 text-white shadow-sm" : "text-white/50 hover:text-white"}`}>
              Annual <span className="text-[10px] font-black bg-emerald-400/20 px-2 py-0.5 rounded-full">SAVE 20%</span>
            </button>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          {PLANS.map((plan, i) => {
            const price = billing === "annual" ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div key={i} className={`relative bg-white/[0.03] border ${plan.popular ? "border-indigo-500/50 shadow-2xl shadow-indigo-500/10" : "border-white/[0.08]"} rounded-3xl p-8 hover:border-white/[0.15] transition-all duration-500 flex flex-col`}>
                {plan.popular && (
                  <div className="absolute -top-3 right-6 bg-gradient-to-r from-amber-400 to-orange-400 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full flex items-center gap-1">
                    <Star className="w-3 h-3 fill-white" /> MOST POPULAR
                  </div>
                )}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-5`}>
                  <plan.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-black mb-1">{plan.name}</h3>
                <p className="text-sm text-white/40 mb-5">{plan.tagline}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-black">{price === 0 ? "Free" : `$${price}`}</span>
                  {price > 0 && <span className="text-sm text-white/40">/mo</span>}
                </div>
                {billing === "annual" && price > 0 && (
                  <p className="text-xs text-emerald-400 font-bold mb-5">Billed ${price * 12}/year — Save ${(plan.monthlyPrice - plan.annualPrice) * 12}!</p>
                )}
                {price === 0 && <p className="text-xs text-white/30 mb-5">No credit card required</p>}
                <Link href="/signup" className={`block w-full text-center py-3.5 rounded-2xl font-bold text-sm transition-all mb-8 ${plan.ctaStyle}`}>
                  {plan.ctaText}
                </Link>
                <div className="space-y-3 flex-1">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${f.included ? "bg-emerald-500/10" : "bg-white/5"}`}>
                        {f.included ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-white/15" />}
                      </div>
                      <span className={`text-sm ${f.included ? "text-white/70" : "text-white/20"}`}>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-black tracking-tighter text-center mb-12">Full Feature Comparison</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-4 px-4 text-white/40 font-bold">Feature</th>
                  <th className="py-4 px-4 text-white/60 font-black text-center">Free</th>
                  <th className="py-4 px-4 text-indigo-400 font-black text-center">Pro</th>
                  <th className="py-4 px-4 text-violet-400 font-black text-center">Max</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { feature: "Bio Links", free: "5", pro: "Unlimited", max: "Unlimited" },
                  { feature: "Analytics", free: "Basic", pro: "Advanced + Geo", max: "Advanced + Geo" },
                  { feature: "Themes", free: "1", pro: "All + Custom", max: "All + Custom" },
                  { feature: "Custom Domain", free: false, pro: true, max: true },
                  { feature: "Built-in Store", free: false, pro: true, max: true },
                  { feature: "AI Assistant", free: false, pro: true, max: true },
                  { feature: "Booking System", free: false, pro: true, max: true },
                  { feature: "Creator Credits", free: false, pro: true, max: true },
                  { feature: "Discount Engine", free: false, pro: true, max: true },
                  { feature: "Email Capture", free: false, pro: true, max: true },
                  { feature: "DM Automation", free: false, pro: false, max: true },
                  { feature: "CRM Pipeline", free: false, pro: false, max: true },
                  { feature: "WhatsApp & Telegram", free: false, pro: false, max: true },
                  { feature: "Agency Dashboard", free: false, pro: false, max: true },
                  { feature: "Account Managed By", free: false, pro: false, max: true },
                  { feature: "API Access", free: false, pro: false, max: true },
                ].map((row, i) => (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-4 text-white/60 font-medium">{row.feature}</td>
                    {[row.free, row.pro, row.max].map((val, j) => (
                      <td key={j} className="py-3 px-4 text-center">
                        {typeof val === "boolean" ? (
                          val ? <Check className="w-4 h-4 text-emerald-400 mx-auto" /> : <X className="w-4 h-4 text-white/15 mx-auto" />
                        ) : (
                          <span className="text-white/60 font-medium">{val}</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black tracking-tighter text-center mb-12">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {FAQ.map((faq, i) => (
              <div key={i} className="bg-white/[0.03] border border-white/[0.06] rounded-2xl overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-6 py-4 text-left">
                  <span className="font-bold text-white/80">{faq.q}</span>
                  <span className={`text-white/30 transition-transform duration-300 ${openFaq === i ? "rotate-45" : ""}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 text-sm text-white/40 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 text-center">
        <h2 className="text-4xl font-black tracking-tighter mb-4">Ready to grow?</h2>
        <p className="text-white/40 mb-8">Join 50,000+ creators already using getprofile.link</p>
        <Link href="/signup" className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-bold text-sm hover:bg-white/90 transition-all hover:scale-105">
          Get started free <ArrowRight className="w-4 h-4" />
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 px-6 text-center">
        <p className="text-xs text-white/20">&copy; {new Date().getFullYear()} getprofile.link — All rights reserved.</p>
      </footer>
    </div>
  );
}
