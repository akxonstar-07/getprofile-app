"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import {
  ArrowRight, Sparkles, Link2, Palette, ShoppingBag, BarChart3,
  Globe, Star, CheckCircle2, ChevronDown, ExternalLink, Zap, Tag,
  Image as ImageIcon, Play,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────── */
const FEATURES = [
  { icon: Link2, title: "Link in Bio", desc: "Unlimited links with click tracking. Perfect replacement for Linktree.", color: "from-indigo-500 to-indigo-400", bg: "bg-indigo-50" },
  { icon: ImageIcon, title: "Portfolio Gallery", desc: "Showcase your best work with a beautiful grid. Filter by category.", color: "from-cyan-500 to-cyan-400", bg: "bg-cyan-50" },
  { icon: ShoppingBag, title: "Creator Store", desc: "Sell ebooks, presets, courses, or any digital product. One link away.", color: "from-emerald-500 to-emerald-400", bg: "bg-emerald-50" },
  { icon: Tag, title: "Affiliate Links", desc: "Monetize with affiliate links shown transparently on your profile.", color: "from-amber-500 to-amber-400", bg: "bg-amber-50" },
  { icon: Palette, title: "Custom Themes", desc: "6+ beautiful themes, custom colors, 6 font choices. Fully yours.", color: "from-pink-500 to-pink-400", bg: "bg-pink-50" },
  { icon: BarChart3, title: "Analytics", desc: "Profile views, link clicks, traffic sources. Know what works.", color: "from-purple-500 to-purple-400", bg: "bg-purple-50" },
];

const TEMPLATES = [
  { name: "Minimal Creator", gradient: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", emoji: "✨", links: ["My Portfolio", "YouTube", "Newsletter"], accent: "#6366f1" },
  { name: "Influencer",      gradient: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)", emoji: "🌟", links: ["Instagram", "Brand Deals", "Shop"],      accent: "#ffffff" },
  { name: "Photographer",    gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)", emoji: "📸", links: ["Portfolio", "Book a Shoot", "Prints"],   accent: "#ffffff" },
  { name: "Developer",       gradient: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)", emoji: "⌨️",  links: ["GitHub", "Blog", "Hire Me"],           accent: "#ffffff" },
  { name: "Coach",           gradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)", emoji: "🎯", links: ["1-on-1 Call", "Course", "Free Guide"],   accent: "#ffffff" },
];

const PLANS = [
  { name: "Free", price: "$0", period: "forever", features: ["1 Profile", "5 Links", "3 Portfolio items", "Basic analytics", "GetProfile watermark"], cta: "Get started free", popular: false },
  { name: "Pro", price: "$9", period: "/month", features: ["Unlimited links", "Unlimited portfolio", "Creator Store + Affiliates", "Custom themes & fonts", "Advanced analytics", "Remove watermark", "Priority support"], cta: "Start 14-day trial", popular: true },
  { name: "Business", price: "$29", period: "/month", features: ["Everything in Pro", "Custom domain", "Team access (3 seats)", "API access", "Media kit builder", "White-label branding"], cta: "Contact sales", popular: false },
];

const FAQS = [
  { q: "What is GetProfile?", a: "GetProfile is an all-in-one creator platform — a link-in-bio page, portfolio website, and digital store combined into one beautiful, shareable profile at getprofile.link/username." },
  { q: "How is this different from Linktree?", a: "Linktree only does links. GetProfile adds a full portfolio gallery, a creator store to sell digital products, affiliate link management, and deeper customization — all in one place." },
  { q: "Can I sell digital products?", a: "Yes! Add your own products with checkout links (Gumroad, Lemon Squeezy, Stripe, etc.) or add affiliate links from Amazon, brands, or any platform. Both appear beautifully on your profile." },
  { q: "Is there a free plan?", a: "Absolutely. The free plan includes a profile with up to 5 links and 3 portfolio items. Upgrade to Pro for unlimited everything." },
  { q: "Can I use a custom domain?", a: "Custom domains are available on the Business plan. Free and Pro users get a clean getprofile.link/username URL." },
];

/* ─── Profile Phone Mockup ──────────────────────────────────── */
function PhoneMockup({ template }: { template: typeof TEMPLATES[0] }) {
  return (
    <div className="relative w-[200px] flex-shrink-0">
      <div className="phone-frame w-full" style={{ background: template.gradient }}>
        {/* Status bar */}
        <div className="flex items-center justify-between px-4 py-2 opacity-60">
          <span className="text-[9px] text-white font-medium">9:41</span>
          <div className="flex items-center gap-1">
            <div className="w-3 h-1.5 rounded-sm border border-white/60 relative"><div className="absolute inset-0.5 right-auto w-1.5 bg-white/60 rounded-sm" /></div>
          </div>
        </div>
        <div className="px-4 pb-5 text-center">
          {/* Avatar */}
          <div className="w-14 h-14 rounded-2xl mx-auto mb-2 flex items-center justify-center text-2xl"
            style={{ background: "rgba(255,255,255,0.2)", border: "2px solid rgba(255,255,255,0.3)" }}>
            {template.emoji}
          </div>
          <h3 className="text-white font-bold text-xs">Alex Rivera</h3>
          <p className="text-white/60 text-[9px] mb-3">Digital Creator</p>
          {/* Links */}
          <div className="space-y-2">
            {template.links.map((link) => (
              <div key={link} className="py-2 px-3 rounded-xl text-[9px] font-semibold text-center"
                style={{ background: "rgba(255,255,255,0.15)", color: template.accent }}>
                {link}
              </div>
            ))}
          </div>
          <p className="text-white/30 text-[8px] mt-3">getprofile.link/alex</p>
        </div>
      </div>
    </div>
  );
}

/* ─── Page ──────────────────────────────────────────────────── */
export default function HomePage() {
  const { data: session } = useSession();
  const [activeTemplate, setActiveTemplate] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-white overflow-hidden">

      {/* ── NAVBAR ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 gradient-bg rounded-xl flex items-center justify-center shadow-md shadow-indigo-200 group-hover:shadow-indigo-300 transition-shadow">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-slate-900">Get<span className="gradient-text">Profile</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {["features","templates","pricing","faq"].map(s => (
              <a key={s} href={`#${s}`} className="text-sm text-slate-500 hover:text-slate-900 transition-colors capitalize">{s}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {session ? (
              <Link href="/dashboard" className="btn-primary">Dashboard <ArrowRight className="w-4 h-4" /></Link>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">Log in</Link>
                <Link href="/signup" className="btn-primary">Sign up free <ArrowRight className="w-4 h-4" /></Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 gradient-bg-subtle" />
        <div className="absolute top-20 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 -translate-y-1/4 translate-x-1/4"
          style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }} />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-15 translate-y-1/4 -translate-x-1/4"
          style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }} />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left — text */}
            <div className="text-left animate-slide-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-slate-100 mb-8">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <span className="text-sm text-slate-600">Portfolio · Link in Bio · Creator Store</span>
              </div>
              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-tight mb-6">
                One link.<br />
                Your entire<br />
                <span className="gradient-text">creator world.</span>
              </h1>
              <p className="text-lg text-slate-500 max-w-lg mb-8 leading-relaxed">
                Build a stunning profile page that works as your portfolio, link-in-bio, and digital store — all in one place. Trusted by thousands of creators.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <Link href="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 gradient-bg text-white rounded-2xl text-base font-bold hover:opacity-90 transition-all shadow-xl shadow-indigo-200 hover:-translate-y-0.5">
                  Create your profile <ArrowRight className="w-5 h-5" />
                </Link>
                <a href="#templates" className="inline-flex items-center gap-2 px-6 py-4 border-2 border-slate-200 text-slate-700 rounded-2xl text-base font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-all">
                  <Play className="w-4 h-4" /> See examples
                </a>
              </div>
              <p className="text-sm text-slate-400 mt-4">Free forever · No credit card required · Live in 2 minutes</p>

              {/* Social proof */}
              <div className="flex items-center gap-3 mt-8">
                <div className="flex -space-x-2">
                  {["🧑","👩","👨","🧑","👩"].map((emoji, i) => (
                    <div key={i} className="w-8 h-8 rounded-full gradient-bg border-2 border-white flex items-center justify-center text-xs">{emoji}</div>
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                  </div>
                  <p className="text-xs text-slate-500">Loved by 10,000+ creators</p>
                </div>
              </div>
            </div>

            {/* Right — phone mockups */}
            <div className="hidden lg:flex items-end justify-center gap-4 relative">
              <div className="translate-y-8 opacity-70 scale-90">
                <PhoneMockup template={TEMPLATES[1]} />
              </div>
              <div className="shadow-2xl shadow-indigo-200/60 rounded-[2.5rem]">
                <PhoneMockup template={TEMPLATES[0]} />
              </div>
              <div className="translate-y-8 opacity-70 scale-90">
                <PhoneMockup template={TEMPLATES[2]} />
              </div>
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-5 py-2.5 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center gap-2 whitespace-nowrap">
                <Zap className="w-4 h-4 text-amber-500" />
                <span className="text-sm font-semibold text-slate-800">Live in under 2 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-3">Everything in one place</p>
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              More than a link-in-bio
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">GetProfile combines Linktree, a portfolio site, and a digital storefront into one shareable profile.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => (
              <div key={f.title} className="p-6 rounded-2xl border border-slate-100 bg-white card-hover group cursor-default">
                <div className={`w-12 h-12 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                  <div className={`w-6 h-6 bg-gradient-to-br ${f.color} rounded-lg flex items-center justify-center`}>
                    <f.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 px-6" style={{ background: "linear-gradient(135deg, #eef2ff 0%, #ecfeff 100%)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Up and running in minutes</h2>
            <p className="text-slate-500">No tech skills needed. Build your profile step by step.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: "01", title: "Sign up free", desc: "Create your account and claim your getprofile.link/username URL instantly.", emoji: "🚀" },
              { step: "02", title: "Build your profile", desc: "Add links, upload portfolio items, set up your store, and pick a theme.", emoji: "🎨" },
              { step: "03", title: "Share everywhere", desc: "Put your link in your Instagram bio, Twitter, email signature, anywhere.", emoji: "🌍" },
            ].map((s) => (
              <div key={s.step} className="bg-white rounded-3xl p-8 text-center shadow-sm border border-white card-hover">
                <div className="text-4xl mb-4">{s.emoji}</div>
                <div className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-2">Step {s.step}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-3">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TEMPLATES ── */}
      <section id="templates" className="py-24 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">
              Pick a style. <span className="gradient-text">Make it yours.</span>
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">5 beautiful templates to start with. Fully customizable colors, fonts, and layouts.</p>
          </div>

          {/* Template selector */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
            {TEMPLATES.map((t, i) => (
              <button key={t.name} onClick={() => setActiveTemplate(i)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeTemplate === i ? "gradient-bg text-white shadow-md" : "border border-slate-200 text-slate-600 hover:border-indigo-300"}`}>
                {t.emoji} {t.name}
              </button>
            ))}
          </div>

          {/* Preview */}
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="w-[260px] shadow-2xl shadow-slate-300/60 rounded-[2.5rem] overflow-hidden">
                <PhoneMockup template={TEMPLATES[activeTemplate]} />
              </div>
              <div className="absolute -right-32 top-1/2 -translate-y-1/2 space-y-3 hidden lg:block">
                {["Custom colors", "6 font choices", "5 layouts", "Dark mode"].map((tag) => (
                  <div key={tag} className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-100 shadow-sm text-sm font-medium text-slate-700 whitespace-nowrap">
                    <CheckCircle2 className="w-4 h-4 text-indigo-500" />{tag}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/signup" className="btn-primary px-8 py-3 text-base">
              Use this template <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── STORE FEATURE SPOTLIGHT ── */}
      <section className="py-24 px-6" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)" }}>
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-semibold"
              style={{ background: "rgba(99,102,241,0.2)", color: "#818cf8" }}>
              <ShoppingBag className="w-4 h-4" /> Creator Store
            </div>
            <h2 className="text-4xl font-bold text-white mb-6">
              Turn your profile into<br />
              <span className="gradient-text">a revenue stream</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8 leading-relaxed">
              Sell your own digital products or earn with affiliate links — all directly from your GetProfile page.
            </p>
            <div className="space-y-4">
              {[
                { icon: ShoppingBag, title: "Own products", desc: "Ebooks, presets, courses, Notion templates, anything digital", color: "text-emerald-400" },
                { icon: Tag, title: "Affiliate links", desc: "Amazon, brands, SaaS tools — shown transparently with AD badge", color: "text-amber-400" },
                { icon: ExternalLink, title: "Any platform", desc: "Connect Gumroad, Lemon Squeezy, Stripe, Payhip, and more", color: "text-indigo-400" },
              ].map((item) => (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm">{item.title}</h4>
                    <p className="text-slate-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {/* Store card mockup */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-white font-bold text-sm mb-5 opacity-60 uppercase tracking-widest">Store Preview</h3>
            {[
              { name: "Lightroom Preset Pack", price: "$19", isAffiliate: false, emoji: "🎨" },
              { name: "Productivity Notion Kit", price: "$29", isAffiliate: false, emoji: "📋" },
              { name: "Notion (Affiliate)", price: "AD", isAffiliate: true, emoji: "🔗" },
            ].map((item) => (
              <div key={item.name} className="flex items-center gap-4 p-4 rounded-2xl" style={{ background: "rgba(255,255,255,0.07)" }}>
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ background: "rgba(255,255,255,0.1)" }}>
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-semibold text-sm">{item.name}</h4>
                  {item.isAffiliate && <span className="text-[10px] bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded-full font-bold">AFFILIATE</span>}
                </div>
                <span className={`font-bold text-sm ${item.isAffiliate ? "text-amber-400" : "text-emerald-400"}`}>{item.price}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-24 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Simple pricing. No surprises.</h2>
            <p className="text-slate-500 max-w-xl mx-auto">Start free. Upgrade when you're ready to unlock your full potential as a creator.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6 items-start">
            {PLANS.map((plan) => (
              <div key={plan.name}
                className={`relative rounded-3xl p-8 ${plan.popular ? "gradient-bg text-white shadow-2xl shadow-indigo-200 scale-[1.03]" : "bg-white border-2 border-slate-100"}`}>
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-white text-indigo-600 text-xs font-bold rounded-full shadow-lg border border-indigo-100">
                    ✨ MOST POPULAR
                  </div>
                )}
                <h3 className={`font-bold text-lg mb-1 ${plan.popular ? "text-white" : "text-slate-900"}`}>{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-extrabold">{plan.price}</span>
                  <span className={`text-sm ${plan.popular ? "text-white/70" : "text-slate-400"}`}>{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm">
                      <CheckCircle2 className={`w-4 h-4 flex-shrink-0 ${plan.popular ? "text-white/80" : "text-indigo-500"}`} />
                      <span className={plan.popular ? "text-white/90" : "text-slate-600"}>{f}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/signup"
                  className={`block w-full py-3.5 rounded-2xl text-center text-sm font-bold transition-all ${
                    plan.popular ? "bg-white text-indigo-600 hover:bg-slate-50" : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="py-24 px-6" style={{ background: "linear-gradient(135deg,#eef2ff 0%, #ecfeff 100%)" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">Frequently asked questions</h2>
          </div>
          <div className="space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left gap-4">
                  <span className="font-semibold text-slate-900">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-500 text-sm leading-relaxed animate-fade-in">{faq.a}</div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-6 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <div className="gradient-bg rounded-3xl p-12">
            <div className="text-5xl mb-4">🚀</div>
            <h2 className="text-4xl font-bold text-white mb-4">Your creator profile awaits</h2>
            <p className="text-white/75 mb-8 max-w-lg mx-auto">Join 10,000+ creators who use GetProfile to build their online presence and monetize their audience.</p>
            <Link href="/signup"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white text-indigo-600 rounded-2xl text-lg font-bold hover:bg-slate-50 transition-all shadow-xl">
              Create your free profile <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-white/50 text-sm mt-4">Free forever · No credit card · Live in 2 minutes</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="border-t border-slate-100 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 gradient-bg rounded-lg flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900">GetProfile</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-slate-400">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Contact</a>
          </div>
          <p className="text-sm text-slate-400">© {new Date().getFullYear()} GetProfile. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
