"use client";

import React, { useState } from "react";
import Link from "next/link";
import { 
  ArrowRight, 
  Globe, 
  CreditCard, 
  Palette, 
  Calendar, 
  CheckCircle2, 
  ChevronRight, 
  ShoppingBag,
  BarChart3,
  Users
} from "lucide-react";

// Custom Social Icons since they are missing in lucide-react 1.7.0
const InstagramIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204 013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>;
const YoutubeIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M23.5 6.9a3 3 0 0 0-2.1-2.1C19.5 4.3 12 4.3 12 4.3s-7.5 0-9.4.5A3 3 0 0 0 .5 6.9C0 8.8 0 12.7 0 12.7s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 16.1V9.3l6.3 3.4-6.3 3.4z"/></svg>;
const TwitterIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>;
const MusicIcon = () => <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02z"/></svg>;


export default function LandingPage() {
  const [username, setUsername] = useState("");

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ─── NAVIGATION ─── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-extrabold tracking-tight">getprofile.link</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
            <Link href="#features" className="hover:text-indigo-600 transition-colors">Features</Link>
            <Link href="#pricing" className="hover:text-indigo-600 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-indigo-600 transition-colors">Log in</Link>
            <Link href="/signup" className="bg-slate-900 text-white px-5 py-2.5 rounded-full hover:bg-slate-800 transition-all">
              Sign up
            </Link>
          </div>
        </div>
      </nav>

      <main className="pt-20">
        
        {/* ═══ SECTION 1: SPLIT HERO (Hoo.be Inspired) ═══ */}
        <section className="relative px-6 py-16 md:py-32 overflow-hidden">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: CTA */}
            <div className="max-w-xl">
              <h1 className="hoobe-title text-5xl md:text-7xl mb-8">
                more than just a link, it's your <span className="text-indigo-600 italic">home</span> on the web
              </h1>
              <p className="text-xl text-slate-500 mb-10 leading-relaxed font-medium">
                getprofile.link empowers creators to turn every link into an opportunity. Join 100,000+ top creators today.
              </p>
              
              <div className="hoobe-input-container mb-6 group focus-within:ring-2 focus-within:ring-indigo-500/20 transition-all">
                <span className="text-slate-400 font-medium">getprofile.link/</span>
                <input 
                  type="text" 
                  placeholder="yourname"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 font-semibold placeholder:text-slate-300"
                />
                <Link 
                  href={`/signup?username=${username}`}
                  className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-800 transition-all"
                >
                  claim my link
                </Link>
              </div>
              <p className="text-sm text-slate-400 pl-6">Free forever. No credit card required.</p>
            </div>

            {/* Right Column: Composite Visual */}
            <div className="relative">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-200">
                <img 
                  src="/assets/creator_hero_fitness.png" 
                  alt="Elite Creator"
                  className="w-full h-auto aspect-[4/5] object-cover"
                />
                {/* Floating Elements (Interactive Code Mockup) */}
                <div className="absolute top-10 right-10 glass-card-prestige p-4 animate-float">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-widest text-white/50 font-bold">Link Clicks</div>
                      <div className="text-xl font-black text-white">+36.4%</div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-10 left-10 glass-card-prestige p-5 max-w-[200px] animate-float" style={{ animationDelay: '1s' }}>
                  <img src="/assets/verified.png" alt="Verified" className="w-6 h-6 mb-2" />
                  <div className="text-white font-bold mb-1">Elite Creator</div>
                  <div className="text-white/60 text-[10px] leading-tight">Verified access to getprofile.link premium features.</div>
                </div>
              </div>
              
              {/* Background Glow */}
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-indigo-100 rounded-full blur-[100px] -z-10" />
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-cyan-100 rounded-full blur-[100px] -z-10" />
            </div>
          </div>
        </section>

        {/* ═══ SECTION 2: PASTEL FEATURE SLIDER (Hoo.be Inspired) ═══ */}
        <section id="features" className="py-24 px-6 bg-slate-50/50">
          <div className="max-w-7xl mx-auto">
            <div className="mb-20 text-center">
              <h2 className="text-4xl md:text-5xl font-black tracking-tight mb-4">powerful features built for creators:</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {/* Card 1: Payments */}
              <div className="feature-card feature-card-mint">
                <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm mb-4">
                  <CreditCard className="w-4 h-4" /> payments
                </div>
                <h3 className="text-3xl font-black mb-8">tips & paywalls</h3>
                <div className="mt-auto rounded-3xl overflow-hidden shadow-sm border border-emerald-100 bg-white p-2">
                  <img src="/assets/creator_male.png" alt="Payments" className="rounded-2xl w-full h-[280px] object-cover" />
                </div>
              </div>

              {/* Card 2: Design */}
              <div className="feature-card feature-card-lavender">
                <div className="flex items-center gap-2 text-indigo-600 font-bold text-sm mb-4">
                  <Palette className="w-4 h-4" /> design
                </div>
                <h3 className="text-3xl font-black mb-8">bespoke themes</h3>
                <div className="mt-auto rounded-3xl overflow-hidden shadow-sm border border-indigo-100 bg-white p-2">
                  <img src="/assets/creator_female.png" alt="Design" className="rounded-2xl w-full h-[280px] object-cover" />
                </div>
              </div>

              {/* Card 3: Events */}
              <div className="feature-card feature-card-peach">
                <div className="flex items-center gap-2 text-orange-600 font-bold text-sm mb-4">
                  <Calendar className="w-4 h-4" /> events
                </div>
                <h3 className="text-3xl font-black mb-8">event carousels</h3>
                <div className="mt-auto rounded-3xl overflow-hidden shadow-sm border border-orange-100 bg-white p-2">
                  <img src="/assets/mobile_branding.png" alt="Events" className="rounded-2xl w-full h-[280px] object-cover" />
                </div>
              </div>
            </div>
            
            <div className="flex justify-center mt-12 gap-4">
              <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-white transition-all"><ArrowRight className="w-5 h-5 rotate-180" /></button>
              <button className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-sm hover:shadow-md transition-all"><ArrowRight className="w-5 h-5" /></button>
            </div>
          </div>
        </section>

        {/* ═══ SECTION 3: INTEGRATION WALL (Link.me Inspired) ═══ */}
        <section className="py-32 px-6 bg-slate-950 overflow-hidden relative">
          <div className="max-w-5xl mx-auto text-center relative z-10">
            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
              add all your favorite apps to your getprofile.link profile
            </h2>
            <p className="text-slate-400 text-lg mb-20 max-w-2xl mx-auto">
              Easily integrate the platforms you already use like Instagram, TikTok, and YouTube. One seamless home for everything you do.
            </p>

            <div className="app-icon-wall">
              {Array.from({ length: 48 }).map((_, i) => (
                <div key={i} className="aspect-square bg-white/5 rounded-2xl flex items-center justify-center border border-white/5 group hover:bg-white/10 transition-all cursor-pointer">
                  {i % 4 === 0 && <InstagramIcon />}
                  {i % 4 === 1 && <YoutubeIcon />}
                  {i % 4 === 2 && <TwitterIcon />}
                  {i % 4 === 3 && <MusicIcon />}
                </div>
              ))}
            </div>
          </div>
          
          {/* Decorative Gradients */}
          <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-slate-950 to-transparent z-20" />
          <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-slate-950 to-transparent z-20" />
        </section>

        {/* ═══ SECTION 4: GRADIENT CTA BANNER (Hoo.be Inspired) ═══ */}
        <section className="py-20 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="hoobe-gradient-banner rounded-[3rem] p-12 md:p-24 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-12">
              <div className="max-w-md relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">get started now</h2>
                <p className="text-white/80 text-xl font-medium">Join our community of top creators and launch your own hub today.</p>
              </div>

              <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2rem] w-full max-w-md relative z-10">
                <div className="bg-white rounded-full p-1.5 pl-5 flex items-center mb-4 border border-white/20">
                  <span className="text-slate-400 font-bold text-sm">getprofile.link/</span>
                  <input type="text" placeholder="username" className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 font-bold" />
                </div>
                <button className="w-full bg-slate-900 text-white rounded-full py-4 font-black hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                  create my link <ArrowRight className="w-5 h-5" />
                </button>
              </div>

              {/* Background Shapes */}
              <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
            </div>
          </div>
        </section>

      </main>

      {/* ─── FOOTER ─── */}
      <footer className="py-20 px-6 border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-16 font-medium">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-6 h-6 rounded bg-indigo-600 flex items-center justify-center">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-black italic">getprofile.link</span>
              </div>
              <p className="text-slate-400 max-w-xs">The premium home for your personal brand. Trusted by elite creators worldwide.</p>
            </div>
            <div>
              <div className="text-slate-900 font-black mb-6 uppercase text-xs tracking-widest">Platform</div>
              <ul className="space-y-4 text-slate-500">
                <li><Link href="#" className="hover:text-indigo-600">Features</Link></li>
                <li><Link href="#" className="hover:text-indigo-600">Store</Link></li>
                <li><Link href="#" className="hover:text-indigo-600">Analytics</Link></li>
              </ul>
            </div>
            <div>
              <div className="text-slate-900 font-black mb-6 uppercase text-xs tracking-widest">Company</div>
              <ul className="space-y-4 text-slate-500">
                <li><Link href="#" className="hover:text-indigo-600">Terms</Link></li>
                <li><Link href="#" className="hover:text-indigo-600">Privacy</Link></li>
                <li><Link href="#" className="hover:text-indigo-600">Support</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-50 text-slate-400 text-xs flex justify-between items-center">
            <span>© {new Date().getFullYear()} getprofile.link Inc. All rights reserved.</span>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-slate-600 transition-colors"><InstagramIcon /></Link>
              <Link href="#" className="hover:text-slate-600 transition-colors"><TwitterIcon /></Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
