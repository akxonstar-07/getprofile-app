"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft, ExternalLink, X, ChevronLeft, ChevronRight,
  Globe, MapPin, Mail, Play, Award, Users, Film, Briefcase,
  ChevronDown, Star, Camera, Check
} from "lucide-react";

/* ── Social icons ── */
const SOCIAL_CFG: Record<string, { label: string; bg: string; icon: React.ReactNode }> = {
  instagram: { label: "Instagram", bg: "linear-gradient(45deg,#f09433,#dc2743,#bc1888)",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg> },
  tiktok: { label: "TikTok", bg: "#010101",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.07 8.07 0 004.77 1.55V6.8a4.85 4.85 0 01-1-.11z"/></svg> },
  youtube: { label: "YouTube", bg: "#FF0000",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.5 6.9a3 3 0 00-2.1-2.1C19.5 4.3 12 4.3 12 4.3s-7.5 0-9.4.5A3 3 0 00.5 6.9C0 8.8 0 12.7 0 12.7s0 3.9.5 5.8a3 3 0 002.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 002.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 16.1V9.3l6.3 3.4-6.3 3.4z"/></svg> },
  twitter: { label: "X", bg: "#000",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  spotify: { label: "Spotify", bg: "#1DB954",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2z"/></svg> },
  linkedin: { label: "LinkedIn", bg: "#0A66C2",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  github: { label: "GitHub", bg: "#333",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
  website: { label: "Website", bg: "#6366f1",
    icon: <Globe className="w-5 h-5" /> },
  facebook: { label: "Facebook", bg: "#1877F2",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
};

function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

/* ── Typing Effect Hook ── */
function useTypingEffect(titles: string[], speed = 80, pause = 2000) {
  const [text, setText] = useState("");
  const [titleIdx, setTitleIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = titles[titleIdx];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setText(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) {
          setTimeout(() => setDeleting(true), pause);
        } else {
          setCharIdx(c => c + 1);
        }
      } else {
        setText(current.slice(0, charIdx - 1));
        if (charIdx <= 1) {
          setDeleting(false);
          setCharIdx(0);
          setTitleIdx((titleIdx + 1) % titles.length);
        } else {
          setCharIdx(c => c - 1);
        }
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, titleIdx, titles, speed, pause]);

  return text;
}

/* ── Lightbox ── */
function LightboxModal({ items, index, onClose, onPrev, onNext }: {
  items: any[]; index: number; onClose: () => void; onPrev: () => void; onNext: () => void;
}) {
  const item = items[index];
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-4" onClick={onClose}>
      <div className="relative max-w-4xl w-full max-h-[90vh] flex flex-col" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-12 right-0 w-10 h-10 rounded-2xl bg-white/10 text-white flex items-center justify-center hover:bg-white/20 z-10">
          <X className="w-5 h-5" />
        </button>
        {index > 0 && (
          <button onClick={e => { e.stopPropagation(); onPrev(); }} className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-black/50 text-white flex items-center justify-center hover:bg-black/70 z-10 backdrop-blur-sm">
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {index < items.length - 1 && (
          <button onClick={e => { e.stopPropagation(); onNext(); }} className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-2xl bg-black/50 text-white flex items-center justify-center hover:bg-black/70 z-10 backdrop-blur-sm">
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
        {item.image && (
          <div className="rounded-2xl overflow-hidden max-h-[65vh] bg-black flex items-center justify-center">
            <img src={item.image} alt={item.title} className="max-w-full max-h-[65vh] object-contain" />
          </div>
        )}
        <div className="mt-4 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-white text-xl font-bold">{item.title}</h2>
            {item.brandName && <span className="text-xs text-indigo-400 font-bold uppercase tracking-wide">Collab with {item.brandName}</span>}
            {item.category && !item.brandName && <span className="text-xs text-white/60 font-semibold uppercase tracking-wide">{item.category}</span>}
            {item.description && <p className="text-white/70 text-sm mt-2">{item.description}</p>}
          </div>
          {item.link && (
            <a href={item.link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white text-slate-900 text-sm font-semibold hover:bg-slate-100 transition-colors whitespace-nowrap flex-shrink-0">
              View <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
        <p className="text-white/30 text-xs mt-3 text-center">{index + 1} / {items.length}</p>
      </div>
    </div>
  );
}

/* ── Animated Counter ── */
function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setVisible(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const duration = 2000;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [visible, target]);

  return <div ref={ref}>{visible ? (target >= 1000 ? fmt(count) : count) : "0"}{suffix}</div>;
}

/* ═══════════════════════════════════════════════════
   MAIN PORTFOLIO PAGE
   ═══════════════════════════════════════════════════ */
interface Props { user: any }

export default function PortfolioClient({ user }: Props) {
  const profile = user.profile;
  const accent = profile?.accentColor || "#6366f1";
  const font = profile?.font || "Inter";

  const allItems = user.portfolioItems || [];
  const projects = allItems.filter((i: any) => !i.itemType || i.itemType === "project");
  const collabs = allItems.filter((i: any) => i.itemType === "collaboration");
  const reels = allItems.filter((i: any) => i.itemType === "reel");
  const press = allItems.filter((i: any) => i.itemType === "press");
  const igPosts = allItems.filter((i: any) => i.itemType === "instagram");

  const socials = Object.keys(SOCIAL_CFG).filter(s => profile?.[s]);
  const brandLogos: string[] = profile?.brandLogos ? JSON.parse(profile.brandLogos) : [];
  const pressLogos: string[] = profile?.pressLogos ? JSON.parse(profile.pressLogos) : [];
  const skills: string[] = profile?.skills ? JSON.parse(profile.skills) : [];

  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(projects.map((i: any) => i.category).filter(Boolean))) as string[]];
  const filteredProjects = activeFilter === "All" ? projects : projects.filter((i: any) => i.category === activeFilter);

  const titles = (profile?.portfolioTitle || "Creator • Designer • Storyteller").split("•").map((t: string) => t.trim());
  const typedText = useTypingEffect(titles);

  return (
    <div className="min-h-screen bg-[#0a0a0f]" style={{ fontFamily: font }}>

      {lightboxIndex !== null && (
        <LightboxModal
          items={allItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onPrev={() => setLightboxIndex(i => Math.max(0, (i ?? 0) - 1))}
          onNext={() => setLightboxIndex(i => Math.min(allItems.length - 1, (i ?? 0) + 1))}
        />
      )}

      {/* ═══════════════════════════════════════
          SECTION 1: CINEMATIC HERO (100vh)
      ═══════════════════════════════════════ */}
      <section className="relative h-screen flex items-end overflow-hidden">
        {/* Background */}
        {profile?.bannerUrl ? (
          <img src={profile.bannerUrl} alt="" className="absolute inset-0 w-full h-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{
            background: `linear-gradient(160deg, #0a0a0f 0%, ${accent}22 30%, ${accent}44 60%, #0a0a0f 100%)`
          }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-[#0a0a0f]/60 to-transparent" />

        {/* Back button */}
        <Link href={`/${user.username}`}
          className="absolute top-6 left-6 flex items-center gap-2 px-4 py-2.5 backdrop-blur-md rounded-2xl text-white text-sm font-semibold bg-white/10 hover:bg-white/20 transition-colors z-20">
          <ArrowLeft className="w-4 h-4" /> Bio Page
        </Link>

        {/* Social icons floating right */}
        <div className="absolute top-1/2 -translate-y-1/2 right-6 flex flex-col gap-3 z-20 hidden lg:flex">
          {socials.slice(0, 5).map(s => (
            <a key={s} href={profile[s]} target="_blank" rel="noopener noreferrer"
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110"
              title={SOCIAL_CFG[s]?.label}>
              {SOCIAL_CFG[s]?.icon}
            </a>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-10 px-6 sm:px-12 pb-16 max-w-5xl w-full">
          {profile?.availableForWork !== false && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 mb-6 animate-stagger">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Available for Work</span>
            </div>
          )}

          {profile?.avatarUrl && (
            <div className="avatar-ring mb-6">
              <img src={profile.avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover border-4 border-[#0a0a0f]" />
            </div>
          )}

          <h1 className="text-5xl sm:text-7xl font-black text-white tracking-tight leading-none mb-3">
            {user.name || user.username}
          </h1>

          {/* Typed subtitle */}
          <div className="text-xl sm:text-2xl font-semibold text-white/50 mb-6 h-8">
            <span>{typedText}</span>
            <span className="inline-block w-0.5 h-6 bg-indigo-400 ml-1" style={{ animation: "blink-cursor 1s step-end infinite" }} />
          </div>

          {/* Location */}
          {profile?.location && (
            <p className="text-white/40 text-sm flex items-center gap-1.5 mb-6">
              <MapPin className="w-4 h-4" /> {profile.location}
            </p>
          )}

          {/* Mobile social row */}
          <div className="flex items-center gap-2.5 lg:hidden flex-wrap">
            {socials.map(s => (
              <a key={s} href={profile[s]} target="_blank" rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all hover:scale-110">
                {SOCIAL_CFG[s]?.icon}
              </a>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-arrow z-10">
          <ChevronDown className="w-6 h-6 text-white/40" />
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 2: ABOUT ME
      ═══════════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-[1fr_1.5fr] gap-12 items-start">
          {/* Left: Photo */}
          <div className="relative">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-full aspect-[3/4] object-cover rounded-3xl shadow-2xl" />
            ) : (
              <div className="w-full aspect-[3/4] rounded-3xl flex items-center justify-center text-6xl"
                style={{ background: `linear-gradient(135deg, ${accent}20, ${accent}05)` }}>📸</div>
            )}
          </div>

          {/* Right: Info */}
          <div>
            <h2 className="text-3xl font-black text-white mb-4">About Me</h2>
            <p className="text-white/60 leading-relaxed mb-8">
              {profile?.portfolioBio || profile?.bio || "Creator and storyteller passionate about building amazing content and brand experiences."}
            </p>

            {/* Skills */}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {skills.map((skill, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full text-xs font-bold border border-white/10 text-white/60 bg-white/5">
                    {skill}
                  </span>
                ))}
              </div>
            )}

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Followers", value: profile?.totalFollowers || 0, icon: <Users className="w-5 h-5" /> },
                { label: "Brand Deals", value: profile?.statsBrandDeals || collabs.length || 0, icon: <Briefcase className="w-5 h-5" /> },
                { label: "Content Created", value: profile?.statsContentCount || allItems.length || 0, icon: <Film className="w-5 h-5" /> },
              ].map((stat, i) => (
                <div key={i} className="glass-card p-5 text-center">
                  <div className="text-indigo-400 mb-2 flex justify-center">{stat.icon}</div>
                  <div className="text-2xl font-black text-white">
                    <AnimatedCounter target={stat.value} />
                  </div>
                  <div className="text-xs text-white/40 font-semibold mt-1">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Business email */}
            {profile?.businessEmail && (
              <a href={`mailto:${profile.businessEmail}`}
                className="mt-8 inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-semibold hover:bg-white/10 transition-all">
                <Mail className="w-4 h-4 text-indigo-400" /> {profile.businessEmail}
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 3: BRAND COLLABORATIONS
      ═══════════════════════════════════════ */}
      {(brandLogos.length > 0 || collabs.length > 0) && (
        <section className="py-20 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-black text-white mb-2">Brands I've Worked With</h2>
              <p className="text-white/40">Trusted by leading brands worldwide</p>
            </div>

            {/* Logo Ticker */}
            {brandLogos.length > 0 && (
              <div className="overflow-hidden mb-12 py-6">
                <div className="logo-ticker gap-12 items-center">
                  {[...brandLogos, ...brandLogos].map((logo, i) => (
                    <img key={i} src={logo} alt="Brand" className="h-10 object-contain opacity-50 hover:opacity-100 transition-opacity flex-shrink-0" />
                  ))}
                </div>
              </div>
            )}

            {/* Collab Cards */}
            {collabs.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {collabs.map((item: any, idx: number) => (
                  <div key={item.id} onClick={() => setLightboxIndex(allItems.indexOf(item))}
                    className="group glass-card overflow-hidden cursor-pointer hover:border-white/20 transition-all hover:scale-[1.02]">
                    {item.image && (
                      <div className="aspect-video overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      </div>
                    )}
                    <div className="p-5">
                      {item.brandName && (
                        <span className="inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-2"
                          style={{ background: `${accent}20`, color: accent }}>
                          {item.brandName}
                        </span>
                      )}
                      <h3 className="font-bold text-white text-sm">{item.title}</h3>
                      {item.description && <p className="text-xs text-white/40 mt-1 line-clamp-2">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          SECTION 4: SOCIAL MEDIA SHOWCASE
      ═══════════════════════════════════════ */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-black text-white mb-2">Content Showcase</h2>
          <p className="text-white/40 mb-10">My best work across platforms</p>

          {/* Instagram Grid (3×3) */}
          {igPosts.length > 0 && (
            <div className="mb-12">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Camera className="w-4 h-4" /> Instagram
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {igPosts.slice(0, 9).map((item: any, idx: number) => (
                  <div key={item.id} onClick={() => setLightboxIndex(allItems.indexOf(item))}
                    className="aspect-square rounded-xl overflow-hidden cursor-pointer group">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reels / TikTok Carousel */}
          {reels.length > 0 && (
            <div className="mb-12">
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Play className="w-4 h-4" /> Reels & Videos
              </h3>
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {reels.map((item: any) => (
                  <div key={item.id} onClick={() => setLightboxIndex(allItems.indexOf(item))}
                    className="flex-shrink-0 w-40 aspect-[9/16] rounded-2xl overflow-hidden relative cursor-pointer group">
                    {item.image && <img src={item.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 text-white fill-white" />
                      </div>
                    </div>
                    <p className="absolute bottom-3 left-3 right-3 text-xs font-bold text-white line-clamp-2">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Gallery */}
          {projects.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-white/40 uppercase tracking-widest mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" /> Projects
              </h3>

              {/* Category filter */}
              {categories.length > 1 && (
                <div className="flex items-center gap-2 mb-6 flex-wrap">
                  {categories.map(cat => (
                    <button key={cat} onClick={() => setActiveFilter(cat)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold transition-all"
                      style={activeFilter === cat
                        ? { background: accent, color: "#fff", boxShadow: `0 4px 16px ${accent}50` }
                        : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.5)" }
                      }>
                      {cat}
                    </button>
                  ))}
                </div>
              )}

              <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 space-y-5">
                {filteredProjects.map((item: any, idx: number) => (
                  <div key={item.id} onClick={() => setLightboxIndex(allItems.indexOf(item))}
                    className="break-inside-avoid group glass-card overflow-hidden cursor-pointer hover:border-white/20 transition-all hover:-translate-y-1">
                    {item.image ? (
                      <div className="overflow-hidden relative">
                        <img src={item.image} alt={item.title} className="w-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all flex items-center justify-center">
                          <div className="w-12 h-12 rounded-2xl bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100">
                            <ExternalLink className="w-5 h-5 text-slate-800" />
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-48 flex items-center justify-center text-5xl" style={{ background: `linear-gradient(135deg, ${accent}20, ${accent}08)` }}>🎨</div>
                    )}
                    <div className="p-4">
                      <h3 className="font-bold text-sm text-white">{item.title}</h3>
                      {item.category && (
                        <span className="inline-block text-[10px] font-bold uppercase tracking-wide mt-1 px-2 py-0.5 rounded-full"
                          style={{ background: `${accent}15`, color: accent }}>{item.category}</span>
                      )}
                      {item.description && <p className="text-xs text-white/40 mt-2 line-clamp-2">{item.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 5: PRESS & MEDIA
      ═══════════════════════════════════════ */}
      {(pressLogos.length > 0 || press.length > 0) && (
        <section className="py-20 border-t border-white/5">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <h2 className="text-3xl font-black text-white mb-2">As Seen In</h2>
            <p className="text-white/40 mb-10">Featured in leading publications</p>

            {pressLogos.length > 0 && (
              <div className="flex items-center justify-center gap-10 flex-wrap mb-12">
                {pressLogos.map((logo, i) => (
                  <img key={i} src={logo} alt="Press" className="h-8 object-contain opacity-40 hover:opacity-80 transition-opacity" />
                ))}
              </div>
            )}

            {press.length > 0 && (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {press.map((item: any) => (
                  <a key={item.id} href={item.link || "#"} target="_blank" rel="noopener noreferrer"
                    className="glass-card p-6 text-left hover:border-white/20 transition-all hover:scale-[1.02] block">
                    {item.brandName && <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2">{item.brandName}</p>}
                    <h3 className="font-bold text-white text-sm mb-2">{item.title}</h3>
                    {item.description && <p className="text-xs text-white/40 line-clamp-2">{item.description}</p>}
                    <span className="text-xs text-indigo-400 font-semibold mt-3 inline-flex items-center gap-1">
                      Read more <ExternalLink className="w-3 h-3" />
                    </span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════
          SECTION 6: STATS DASHBOARD
      ═══════════════════════════════════════ */}
      <section className="py-20 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 gradient-shift-bg opacity-10"
          style={{ background: `linear-gradient(135deg, ${accent}, #06b6d4, ${accent})`, backgroundSize: "200% 200%" }} />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-white mb-2">By the Numbers</h2>
            <p className="text-white/40">Impact at a glance</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { label: "Total Followers", value: profile?.totalFollowers || 0, icon: <Users className="w-6 h-6" /> },
              { label: "Content Created", value: profile?.statsContentCount || allItems.length, icon: <Film className="w-6 h-6" /> },
              { label: "Brand Collabs", value: profile?.statsBrandDeals || collabs.length, icon: <Briefcase className="w-6 h-6" /> },
              { label: "Projects Done", value: projects.length, icon: <Award className="w-6 h-6" /> },
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 text-center hover:bg-white/10 transition-all">
                <div className="text-indigo-400 mb-3 flex justify-center">{stat.icon}</div>
                <div className="text-3xl sm:text-4xl font-black text-white mb-1">
                  <AnimatedCounter target={stat.value} />
                </div>
                <div className="text-xs text-white/40 font-semibold uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          SECTION 7: CONTACT CTA
      ═══════════════════════════════════════ */}
      <section className="py-24 border-t border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 gradient-shift-bg opacity-15"
          style={{ background: `linear-gradient(135deg, ${accent}, #a855f7, #06b6d4)`, backgroundSize: "200% 200%" }} />
        <div className="max-w-3xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-black text-white mb-4">Let's Create Something Amazing</h2>
          <p className="text-white/50 text-lg mb-10">
            Open for collaborations, brand partnerships, and creative projects.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            {profile?.businessEmail && (
              <a href={`mailto:${profile.businessEmail}`}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-lg transition-all hover:scale-105 hover:shadow-2xl"
                style={{ background: `linear-gradient(135deg, ${accent}, #a855f7)`, boxShadow: `0 8px 32px ${accent}40` }}>
                <Mail className="w-5 h-5" /> Get in Touch
              </a>
            )}
            <Link href={`/${user.username}`}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white text-lg border border-white/20 bg-white/5 hover:bg-white/10 transition-all">
              <Globe className="w-5 h-5" /> View Bio Page
            </Link>
          </div>

          {/* Social icons */}
          <div className="flex items-center justify-center gap-3">
            {socials.map(s => (
              <a key={s} href={profile[s]} target="_blank" rel="noopener noreferrer"
                className="w-11 h-11 rounded-full flex items-center justify-center text-white transition-all hover:scale-110"
                style={{ background: SOCIAL_CFG[s]?.bg }}>
                {SOCIAL_CFG[s]?.icon}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════ */}
      <footer className="py-10 border-t border-white/5 text-center">
        <a href="/" className="inline-flex items-center gap-1.5 text-xs text-white/20 hover:text-white/40 transition-opacity">
          <Globe className="w-3 h-3" /> Built with getprofile.link
        </a>
        <p className="text-[10px] text-white/10 mt-2">© {new Date().getFullYear()} {user.name || user.username}</p>
      </footer>
    </div>
  );
}
