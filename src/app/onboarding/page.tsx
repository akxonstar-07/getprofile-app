"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Check, ChevronRight, ChevronLeft, Zap, Sparkles } from "lucide-react";

/* ═══════════════════════════════════════════════════
   BRANDED PLATFORM SVG ICONS (Full-Color)
   ═══════════════════════════════════════════════════ */
const PLATFORMS = [
  {
    id: "instagram", label: "Instagram",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <defs>
          <radialGradient id="ig1" cx="30%" cy="107%" r="150%">
            <stop offset="0%" stopColor="#fdf497"/>
            <stop offset="5%" stopColor="#fdf497"/>
            <stop offset="45%" stopColor="#fd5949"/>
            <stop offset="60%" stopColor="#d6249f"/>
            <stop offset="90%" stopColor="#285AEB"/>
          </radialGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#ig1)"/>
        <path d="M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9zm0 7.4a2.9 2.9 0 110-5.8 2.9 2.9 0 010 5.8zm4.7-7.6a1.05 1.05 0 11-2.1 0 1.05 1.05 0 012.1 0zM18.5 8.1c-.05-1-.27-1.88-.98-2.59S15.9 4.55 14.9 4.5c-1.05-.06-4.18-.06-5.23 0-1 .05-1.87.27-2.58.99S5.55 7.1 5.5 8.1c-.06 1.05-.06 4.18 0 5.23.05 1 .27 1.87.99 2.58s1.58.93 2.58.98c1.05.06 4.18.06 5.23 0 1-.05 1.87-.27 2.59-.98s.93-1.58.98-2.58c.06-1.05.06-4.18 0-5.23zm-1.87 6.35a1.89 1.89 0 01-1.07 1.07c-.74.29-2.5.23-3.32.23s-2.58.06-3.32-.23a1.89 1.89 0 01-1.07-1.07c-.29-.74-.23-2.5-.23-3.32s-.06-2.58.23-3.32a1.89 1.89 0 011.07-1.07c.74-.29 2.5-.23 3.32-.23s2.58-.06 3.32.23c.44.17.78.52.96.96.29.74.23 2.5.23 3.32s.06 2.58-.12 3.43z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "tiktok", label: "TikTok",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#010101"/>
        <path d="M16.8 8.4a3.8 3.8 0 01-2.4-2.9V5h-2.2v9.3a2 2 0 01-2 1.7 2 2 0 01-2-2 2 2 0 012-2c.2 0 .4 0 .5.1V9.8h-.5A4.3 4.3 0 006 14.1a4.3 4.3 0 004.3 4.3 4.3 4.3 0 004.3-4.3v-4a5.5 5.5 0 003.2 1V8.8a3.8 3.8 0 01-.7-.1z" fill="#25F4EE"/>
        <path d="M16.8 8.4a3.8 3.8 0 01-2.4-2.9V5h-2.2v9.3a2 2 0 01-2 1.7 2 2 0 01-2-2 2 2 0 012-2c.2 0 .4 0 .5.1V9.8h-.5A4.3 4.3 0 006 14.1a4.3 4.3 0 004.3 4.3 4.3 4.3 0 004.3-4.3v-4a5.5 5.5 0 003.2 1V8.8a3.8 3.8 0 01-.7-.1z" fill="#FE2C55" opacity="0.7"/>
      </svg>
    ),
  },
  {
    id: "youtube", label: "YouTube",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#FF0000"/>
        <path d="M10 15.5v-7l6 3.5-6 3.5z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "twitter", label: "X",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#000"/>
        <path d="M15.7 6h1.8l-3.9 4.5L18 18h-3.4l-2.8-3.7L8.7 18H6.9l4.2-4.8L6.5 6h3.5l2.5 3.3L15.7 6zm-.6 10.8h1l-6.5-8.5h-1.1l6.6 8.5z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "spotify", label: "Spotify",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#1DB954"/>
        <path d="M16.5 14.5c-.2 0-.3-.1-.5-.2-1.8-1.1-4-1.3-6.6-.7-.2.1-.4.1-.5-.1-.1-.2-.1-.4.1-.5 2.9-.7 5.3-.4 7.3.8.2.1.3.3.2.5 0 .1-.1.2-.3.2h.3zm.5-1.8c-.2 0-.3-.1-.5-.2-2.1-1.3-5.3-1.7-7.8-.9-.3.1-.5 0-.6-.2-.1-.3 0-.5.2-.6 2.8-.8 6.3-.4 8.7 1.1.2.1.3.4.2.6-.1.2-.2.2-.4.2h.2zm.1-1.9c-2.5-1.5-6.6-1.6-9-.9-.3.1-.6-.1-.7-.4-.1-.3.1-.6.4-.7 2.7-.8 7.2-.7 10 1 .3.2.4.5.2.8-.1.2-.5.3-.7.2h-.2z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "facebook", label: "Facebook",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#1877F2"/>
        <path d="M16.5 12.5h-2.2V18h-2.8v-5.5H9.8V10h1.7V8.4c0-1.7 1-2.6 2.5-2.6.7 0 1.5.1 1.5.1v1.7h-.8c-.8 0-1.1.5-1.1 1V10h1.9l-.5 2.5z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "snapchat", label: "Snapchat",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#FFFC00"/>
        <path d="M12 6c1.7 0 3.3.8 4 2.5.3.7.2 2 .1 3.1v.2s.4.2.9.2c.4 0 .6-.1.6-.1.3-.1.5 0 .7.1.2.1.3.3.3.5 0 .4-.5.6-.9.7-.1 0-.3.1-.4.1l-.2.1c-.2.2-.2.5-.3.8-.1.3-.2.5-.3.8s-.3.4-.5.5c-.3.2-.6.3-.9.1h-.1c-.2-.1-.4-.1-.6-.2-.3-.1-.6.1-.8.3a3.8 3.8 0 01-1.9.5 3.8 3.8 0 01-1.9-.5c-.3-.2-.6-.3-.8-.3-.2 0-.4.1-.6.2h-.1c-.3.1-.6 0-.9-.2-.2-.1-.3-.2-.4-.3-.1-.3-.2-.6-.3-.8-.1-.3-.2-.6-.3-.8l-.2-.1c-.1 0-.3-.1-.4-.1-.4-.1-.9-.3-.9-.7 0-.2.1-.4.3-.5.2-.1.4-.1.7-.1 0 0 .3.1.6.1.5 0 .9-.2.9-.2v-.2c-.1-1-.2-2.3.1-3.1C8.8 6.8 10.3 6 12 6z" fill="#000"/>
      </svg>
    ),
  },
  {
    id: "linkedin", label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#0A66C2"/>
        <path d="M8.5 17.5h-2v-7h2v7zm-1-8a1.2 1.2 0 110-2.4 1.2 1.2 0 010 2.4zm9 8h-2v-3.4c0-.8 0-1.9-1.1-1.9s-1.3.9-1.3 1.8v3.5h-2v-7h1.9v1h0a2.1 2.1 0 011.9-1c2 0 2.4 1.3 2.4 3.1v3.9z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "pinterest", label: "Pinterest",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#E60023"/>
        <path d="M12 5.5A6.5 6.5 0 005.5 12c0 2.6 1.6 4.9 3.8 5.8 0-.4 0-.9.1-1.4l.8-3.2s-.2-.4-.2-1c0-.9.5-1.6 1.2-1.6.6 0 .8.4.8.9 0 .6-.4 1.4-.5 2.2 0 .7.5 1.3 1.2 1.3 1.5 0 2.5-1.9 2.5-4.1 0-1.7-1.2-3-3.3-3-2.4 0-3.9 1.8-3.9 3.8 0 .7.2 1.2.5 1.5.2.1.2.2.1.4l-.1.6c-.1.2-.2.3-.4.2-1.1-.4-1.6-1.7-1.6-3.1 0-2.3 1.9-5 5.7-5 3 0 5 2.2 5 4.5 0 3.1-1.7 5.4-4.3 5.4-.8 0-1.6-.5-1.9-1l-.5 2c-.2.7-.6 1.4-1 2A6.5 6.5 0 0018.5 12 6.5 6.5 0 0012 5.5z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "threads", label: "Threads",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#000"/>
        <path d="M15.2 11.4c-.1 0-.1 0 0 0-.1-1.5-1-2.4-2.4-2.4-1 0-1.7.5-2.1 1.3l1.1.6c.3-.5.7-.7 1.1-.7.5 0 .9.2.9.7 0 .3-.1.6-.4.8-.4.3-.9.4-1.4.5-.9.2-2.4.8-2.4 2.5 0 1.3 1 2.2 2.3 2.2.9 0 1.6-.4 2.1-1.1h0c0 .3.1.6.2.9h1.4c-.2-.4-.3-1-.3-1.5v-2.6c0-.5 0-1-.1-1.2zm-1.4 2.8c0 1-1 1.5-1.7 1.5-.6 0-1-.4-1-.9 0-.7.7-1 1.3-1.1.3-.1.6-.1.9-.2.1 0 .2-.1.3-.1.1.3.2.5.2.8z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "whatsapp", label: "WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#25D366"/>
        <path d="M12 5.5A6.5 6.5 0 005.5 12c0 1.2.3 2.3.9 3.2l-.6 2.2 2.3-.6c.9.5 2 .8 3 .8A6.5 6.5 0 0012 5.5zm3.7 9.3c-.2.5-.9.9-1.5 1-.4 0-1 .2-3-1.3-2.4-1.8-3-3.7-3.1-3.8-.1-.2-.8-1.1-.8-2.1 0-1 .5-1.5.7-1.7.2-.2.4-.3.6-.3h.5c.2 0 .3 0 .5.4s.6 1.5.6 1.6.1.2 0 .3c0 .1-.1.2-.2.4l-.3.3c-.1.1-.2.3-.1.5s.5.9 1.2 1.5c.8.7 1.5.9 1.7 1 .2.1.4.1.5-.1.1-.1.5-.6.7-.8.2-.2.3-.2.5-.1l1.5.7c.2.1.4.2.4.3.1.1.1.6-.1 1.1z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "telegram", label: "Telegram",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#26A5E4"/>
        <path d="M17.5 7.2l-2.3 10.8c-.2.7-.6.9-1.2.5l-3.3-2.5-1.6 1.5c-.2.2-.3.3-.6.3l.2-3.3 5.9-5.3c.3-.2-.1-.3-.4-.1l-7.2 4.5-3.1-1c-.7-.2-.7-.7.1-1l12.2-4.7c.6-.2 1 .1.9 1l-.6.8z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "twitch", label: "Twitch",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#9146FF"/>
        <path d="M7 5l-1.5 3.5V17h3.5v2h2l2-2h2.5L19 13.5V5H7zm10.5 7.5l-2 2h-3l-1.5 1.5v-1.5H8V6.5h9.5v6z" fill="white"/>
        <rect x="14" y="8.5" width="1.5" height="3.5" fill="white"/>
        <rect x="11" y="8.5" width="1.5" height="3.5" fill="white"/>
      </svg>
    ),
  },
  {
    id: "applemusic", label: "Apple Music",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <defs>
          <linearGradient id="am1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FC5C7D"/>
            <stop offset="100%" stopColor="#E5233B"/>
          </linearGradient>
        </defs>
        <rect width="24" height="24" rx="6" fill="url(#am1)"/>
        <path d="M16 7.5v6.4c0 1.3-.9 2.3-2 2.3s-1.7-.7-1.7-1.6.8-1.6 1.9-1.7h.3V9.5l-4.5 1v5.9c0 1.3-.9 2.3-2 2.3s-1.7-.7-1.7-1.6.8-1.6 1.9-1.7H9V8.5l7-2v1z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "soundcloud", label: "SoundCloud",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#FF5500"/>
        <path d="M6 14.5l.3-1.5-.3-1.5c0-.1-.1-.1-.1 0l-.3 1.5.3 1.5c0 .1.1.1.1 0zm1.2.5l.3-2-.3-2.3c0-.1-.1-.1-.2 0l-.3 2.3.3 2c0 .1.1.1.2 0zm1.2.2l.3-2.2-.3-3c0-.1-.1-.2-.2-.1l-.3 3.1.3 2.2c0 .1.1.1.2 0zm1.2 0l.3-2.2-.3-3.5c0-.1-.2-.1-.2 0l-.3 3.5.3 2.2c0 .1.2.1.2 0zm1.2-.1l.2-2.1-.2-3.2c0-.1-.2-.2-.2 0l-.2 3.2.2 2.1c0 .1.2.2.2 0zm1.2.1l.2-2.2-.2-2.8c0-.2-.2-.2-.3 0l-.2 2.8.2 2.2c.1.1.2.1.3 0zm2.3-.2l.1-2-.3-2c0-.1-.2-.1-.2 0l-.1 2 .1 2c0 .1.2.1.2 0h.2zm1.3.3c1.1 0 2-.8 2-1.8 0-.9-.7-1.7-1.6-1.8-.3-1.7-1.8-3-3.6-3-.5 0-1 .1-1.4.3-.2.1-.2.2-.2.3v6c0 .1.1.2.2.2h4.6z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "patreon", label: "Patreon",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#FF424D"/>
        <circle cx="14" cy="10" r="3.5" fill="white"/>
        <rect x="6.5" y="6.5" width="2" height="11" rx="1" fill="white"/>
      </svg>
    ),
  },
  {
    id: "github", label: "GitHub",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#333"/>
        <path d="M12 5.5A6.5 6.5 0 005.5 12c0 2.9 1.9 5.3 4.4 6.2.3.1.4-.1.4-.3v-1.1c-1.8.4-2.2-.8-2.2-.8-.3-.8-.7-1-.7-1-.6-.4 0-.4 0-.4.6 0 1 .7 1 .7.6 1 1.5.7 1.9.5 0-.4.2-.7.4-.9-1.4-.2-2.9-.7-2.9-3.2 0-.7.3-1.3.7-1.7-.1-.2-.3-.8.1-1.7 0 0 .5-.2 1.8.7.5-.2 1.1-.2 1.6-.2.5 0 1.1.1 1.6.2 1.2-.8 1.8-.7 1.8-.7.4.9.2 1.5.1 1.7.4.4.7 1 .7 1.7 0 2.5-1.5 3-2.9 3.2.2.2.4.6.4 1.2v1.8c0 .2.1.4.4.3A6.5 6.5 0 0012 5.5z" fill="white"/>
      </svg>
    ),
  },
  {
    id: "website", label: "Website",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8">
        <rect width="24" height="24" rx="6" fill="#6366f1"/>
        <circle cx="12" cy="12" r="5" stroke="white" strokeWidth="1.5" fill="none"/>
        <path d="M12 7c-1.5 2-2 3.5-2 5s.5 3 2 5M12 7c1.5 2 2 3.5 2 5s-.5 3-2 5M7 12h10" stroke="white" strokeWidth="1.5" fill="none"/>
      </svg>
    ),
  },
];

/* ═══════════════════════════════════════════════════
   CATEGORY OPTIONS
   ═══════════════════════════════════════════════════ */
const CATEGORIES = [
  { id: "music", emoji: "🎵", label: "Musician / Band", desc: "Promote music, shows & merch", gradient: "from-purple-600 to-pink-500" },
  { id: "creator", emoji: "🎬", label: "Video Creator", desc: "YouTube, TikTok, Reels content", gradient: "from-red-500 to-orange-400" },
  { id: "business", emoji: "💼", label: "Business / Agency", desc: "Services, consulting & leads", gradient: "from-blue-600 to-cyan-400" },
  { id: "lifestyle", emoji: "✨", label: "Lifestyle / Influencer", desc: "Fashion, fitness, travel & more", gradient: "from-pink-500 to-amber-400" },
  { id: "model", emoji: "📸", label: "Model / Talent", desc: "Portfolio, castings & bookings", gradient: "from-violet-600 to-fuchsia-400" },
  { id: "artist", emoji: "🎨", label: "Artist / Designer", desc: "Showcase artwork & commissions", gradient: "from-emerald-500 to-teal-400" },
];

/* ═══════════════════════════════════════════════════
   MONETIZATION OPTIONS  
   ═══════════════════════════════════════════════════ */
const MONETIZATION = [
  { id: "affiliate", icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.856-2.07a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757"/></svg>, label: "Affiliate", desc: "Promote products & earn commissions" },
  { id: "content", icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15a2.25 2.25 0 012.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z"/></svg>, label: "Content", desc: "Sell premium digital content" },
  { id: "ecommerce", icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"/></svg>, label: "E-commerce", desc: "Sell physical products online" },
  { id: "experiences", icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5"/></svg>, label: "Experiences", desc: "Sell access to in-person events" },
  { id: "streams", icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z"/></svg>, label: "Streams", desc: "Royalties from music streaming" },
  { id: "tips", icon: <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>, label: "Tips", desc: "Tips from fans & livestreaming" },
];

/* ═══════════════════════════════════════════════════
   PORTFOLIO TEMPLATES 
   ═══════════════════════════════════════════════════ */
const PORTFOLIO_TEMPLATES = [
  { id: "agency", name: "Dark Agency", colors: ["#0f172a", "#1e293b", "#6366f1"] },
  { id: "creative", name: "Creator Vibrant", colors: ["#f97316", "#ec4899", "#fbbf24"] },
  { id: "minimal", name: "Clean Minimal", colors: ["#ffffff", "#f8fafc", "#0f172a"] },
];

const MOBILE_TEMPLATES = [
  { id: "dark-neo", name: "Dark Neo", colors: ["#0c0f1a", "#6366f1", "#06b6d4"] },
  { id: "light-glass", name: "Light Glass", colors: ["#ffffff", "#f8fafc", "#6366f1"] },
  { id: "gradient", name: "Sunset Glow", colors: ["#f97316", "#ec4899", "#6366f1"] },
];

/* ═══════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════ */
export default function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [animating, setAnimating] = useState(false);

  const [category, setCategory] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [platforms, setPlatforms] = useState<string[]>([]);
  const [urls, setUrls] = useState<Record<string, string>>({});
  const [monetization, setMonetization] = useState<string[]>([]);
  const [portfolioTheme, setPortfolioTheme] = useState("agency");
  const [mobileTheme, setMobileTheme] = useState("dark-neo");

  const goStep = (n: number) => {
    setAnimating(true);
    setTimeout(() => { setStep(n); setAnimating(false); }, 200);
  };

  const togglePlatform = (id: string) =>
    setPlatforms(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const toggleMonetization = (id: string) =>
    setMonetization(m => m.includes(id) ? m.filter(x => x !== id) : [...m, id]);

  const submitOnboarding = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, displayName, platforms, urls, monetization, portfolioTheme, mobileTheme }),
      });
      if (res.ok) router.push("/dashboard");
    } catch { setLoading(false); }
  };

  const TOTAL_STEPS = 5;
  const progress = (step / TOTAL_STEPS) * 100;

  return (
    <div className="onboarding-bg min-h-screen flex flex-col items-center justify-center p-4">
      {/* Floating orbs */}
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Container */}
      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-black bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            getprofile.link
          </h2>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8 px-4">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => (
            <div key={i} className="flex-1 h-1.5 rounded-full overflow-hidden bg-white/10">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: step > i + 1 ? "100%" : step === i + 1 ? "50%" : "0%",
                  background: "linear-gradient(90deg, #6366f1, #06b6d4)",
                }}
              />
            </div>
          ))}
          <span className="text-xs font-bold text-white/40 ml-2">{step}/{TOTAL_STEPS}</span>
        </div>

        {/* Card */}
        <div className={`glass-card p-8 sm:p-10 transition-all duration-200 ${animating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>

          {/* ═══ STEP 1: Category + Name ═══ */}
          {step === 1 && (
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Welcome to getprofile.link!</h1>
              <p className="text-white/50 mb-8">What best describes you?</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-8">
                {CATEGORIES.map(c => (
                  <button
                    key={c.id}
                    onClick={() => setCategory(c.id)}
                    className={`relative p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.03] active:scale-[0.97] ${
                      category === c.id
                        ? "border-indigo-500 bg-indigo-500/15"
                        : "border-white/10 bg-white/5 hover:border-white/20"
                    }`}
                  >
                    {category === c.id && (
                      <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                    <span className="text-2xl block mb-2">{c.emoji}</span>
                    <p className="text-sm font-bold text-white">{c.label}</p>
                    <p className="text-[11px] text-white/40 mt-0.5">{c.desc}</p>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-white/60 mb-2">Your display name</label>
                <input
                  type="text"
                  placeholder="e.g. Alex Rivera"
                  value={displayName}
                  onChange={e => setDisplayName(e.target.value)}
                  className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
                />
              </div>

              <button
                onClick={() => goStep(2)}
                disabled={!category || !displayName}
                className="w-full py-4 rounded-xl font-bold text-white transition-all disabled:opacity-30 disabled:cursor-not-allowed bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/25"
              >
                Continue <ChevronRight className="inline w-4 h-4 ml-1" />
              </button>
            </div>
          )}

          {/* ═══ STEP 2: Platforms (Branded SVG Icons) ═══ */}
          {step === 2 && (
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Which platforms are you on?</h1>
              <p className="text-white/50 mb-8">Select the platforms you're active on. You can update at any time.</p>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
                {PLATFORMS.map(p => {
                  const active = platforms.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => togglePlatform(p.id)}
                      className={`platform-grid-item ${active ? "selected" : ""}`}
                    >
                      {active && (
                        <div className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-indigo-500 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                        </div>
                      )}
                      <div className="relative">{p.icon}</div>
                      <span className="text-xs font-semibold text-white/70">{p.label}</span>
                    </button>
                  );
                })}
              </div>

              <div className="flex gap-3">
                <button onClick={() => goStep(1)} className="px-6 py-4 rounded-xl font-bold text-white/50 border border-white/10 hover:border-white/20 transition-all">
                  <ChevronLeft className="inline w-4 h-4 mr-1" /> Back
                </button>
                <button
                  onClick={() => goStep(3)}
                  disabled={platforms.length === 0}
                  className="flex-1 py-4 rounded-xl font-bold text-white transition-all disabled:opacity-30 bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/25"
                >
                  Continue <ChevronRight className="inline w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 3: Add Links ═══ */}
          {step === 3 && (
            <div>
              <h1 className="text-3xl font-black text-white mb-2">Add your links</h1>
              <p className="text-white/50 mb-8">Add your social links so people can find all your content in one place.</p>

              <div className="space-y-3 mb-8">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest">Your selections</h3>
                {platforms.map(pId => {
                  const p = PLATFORMS.find(a => a.id === pId);
                  if (!p) return null;
                  return (
                    <div key={pId} className="flex items-center gap-3">
                      <div className="flex-shrink-0">{p.icon}</div>
                      <input
                        type="text"
                        placeholder={`@username or url...`}
                        value={urls[pId] || ""}
                        onChange={e => setUrls({ ...urls, [pId]: e.target.value })}
                        className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                      />
                    </div>
                  );
                })}

                <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest pt-4">Additional links (optional)</h3>
                {[0, 1, 2].map(i => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m9.856-2.07a4.5 4.5 0 00-1.242-7.244l4.5-4.5a4.5 4.5 0 016.364 6.364l-1.757 1.757"/>
                      </svg>
                    </div>
                    <input
                      type="text"
                      placeholder="url"
                      className="flex-1 p-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/30 text-sm focus:outline-none focus:border-indigo-500 transition-all"
                    />
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => goStep(2)} className="px-6 py-4 rounded-xl font-bold text-white/50 border border-white/10 hover:border-white/20 transition-all">
                  <ChevronLeft className="inline w-4 h-4 mr-1" /> Back
                </button>
                <button onClick={() => goStep(4)} className="flex-1 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                  Continue <ChevronRight className="inline w-4 h-4 ml-1" />
                </button>
              </div>
              <button onClick={() => goStep(4)} className="w-full py-3 mt-2 text-white/40 font-semibold hover:text-white/60 transition-colors text-sm">
                Skip for now
              </button>
            </div>
          )}

          {/* ═══ STEP 4: Monetization ═══ */}
          {step === 4 && (
            <div>
              <h1 className="text-3xl font-black text-white mb-2">How do you want to make money?</h1>
              <p className="text-white/50 mb-8">Your answer will help us personalize your experience. Select up to 4 that apply.</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                {MONETIZATION.map(m => {
                  const active = monetization.includes(m.id);
                  return (
                    <button
                      key={m.id}
                      onClick={() => toggleMonetization(m.id)}
                      className={`p-4 rounded-2xl border-2 text-left transition-all hover:scale-[1.02] ${
                        active ? "border-indigo-500 bg-indigo-500/10" : "border-white/10 bg-white/5 hover:border-white/20"
                      }`}
                    >
                      <div className={`mb-3 ${active ? "text-indigo-400" : "text-white/50"}`}>{m.icon}</div>
                      <p className="text-sm font-bold text-white">{m.label}</p>
                      <p className="text-[11px] text-white/40 mt-0.5 leading-tight">{m.desc}</p>
                    </button>
                  );
                })}
              </div>

              <div className="text-center mb-6">
                <button onClick={() => setMonetization([])} className="text-sm font-semibold text-white/40 hover:text-white/60 transition-colors">
                  I'm just doing this for fun
                </button>
              </div>

              <div className="flex gap-3">
                <button onClick={() => goStep(3)} className="px-6 py-4 rounded-xl font-bold text-white/50 border border-white/10 hover:border-white/20 transition-all">
                  <ChevronLeft className="inline w-4 h-4 mr-1" /> Back
                </button>
                <button onClick={() => goStep(5)} className="flex-1 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-indigo-600 to-cyan-500 hover:shadow-lg hover:shadow-indigo-500/25 transition-all">
                  Unleash the AI <Zap className="inline w-4 h-4 ml-1" />
                </button>
              </div>
            </div>
          )}

          {/* ═══ STEP 5: AI Template Selection ═══ */}
          {step === 5 && (
            <div>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mx-auto mb-4 animate-pulse-glow">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <h1 className="text-3xl font-black text-white mb-2">Your AI-Curated Experience</h1>
                <p className="text-white/50">Based on your selections, we've designed two core experiences.</p>
              </div>

              <div className="space-y-8 mb-8">
                {/* Portfolio Template */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                    1. Web Portfolio Template
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {PORTFOLIO_TEMPLATES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setPortfolioTheme(t.id)}
                        className={`rounded-2xl border-2 overflow-hidden transition-all hover:scale-[1.03] ${
                          portfolioTheme === t.id ? "border-indigo-500 ring-1 ring-indigo-500/30" : "border-white/10"
                        }`}
                      >
                        {/* Mini preview */}
                        <div className="aspect-[4/3] relative" style={{ background: t.colors[0] }}>
                          <div className="absolute bottom-0 inset-x-0 h-1/2" style={{ background: `linear-gradient(135deg, ${t.colors[2]}, ${t.colors[1]})`, opacity: 0.6 }} />
                          <div className="absolute bottom-2 left-2 right-2">
                            <div className="w-4 h-4 rounded-full mb-1" style={{ background: t.colors[2] }} />
                            <div className="h-1 w-12 rounded" style={{ background: t.colors[2], opacity: 0.6 }} />
                            <div className="h-1 w-8 rounded mt-0.5" style={{ background: t.colors[2], opacity: 0.3 }} />
                          </div>
                        </div>
                        <div className="p-2 bg-white/5">
                          <p className="text-[11px] font-bold text-white text-center">{t.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mobile Template */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-3">
                    2. Mobile Bio Link Template
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {MOBILE_TEMPLATES.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setMobileTheme(t.id)}
                        className={`rounded-2xl border-2 overflow-hidden transition-all hover:scale-[1.03] ${
                          mobileTheme === t.id ? "border-cyan-500 ring-1 ring-cyan-500/30" : "border-white/10"
                        }`}
                      >
                        {/* Mini phone preview */}
                        <div className="aspect-[9/16] relative rounded-xl mx-1 mt-1" style={{ background: t.colors[0] }}>
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 w-5 h-5 rounded-full" style={{ background: t.colors[1], opacity: 0.5 }} />
                          <div className="absolute top-9 left-1/2 -translate-x-1/2">
                            <div className="h-1 w-10 rounded" style={{ background: t.colors[1], opacity: 0.4 }} />
                          </div>
                          {[0, 1, 2].map(i => (
                            <div key={i} className="absolute left-2 right-2 h-3 rounded-lg" style={{ 
                              background: `linear-gradient(90deg, ${t.colors[1]}, ${t.colors[2]})`, 
                              opacity: 0.5 - i * 0.1,
                              top: `${55 + i * 18}%`
                            }} />
                          ))}
                        </div>
                        <div className="p-2 bg-white/5">
                          <p className="text-[11px] font-bold text-white text-center">{t.name}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => goStep(4)} className="px-6 py-4 rounded-xl font-bold text-white/50 border border-white/10 hover:border-white/20 transition-all">
                  <ChevronLeft className="inline w-4 h-4 mr-1" /> Back
                </button>
                <button
                  onClick={submitOnboarding}
                  disabled={loading}
                  className="flex-1 py-4 rounded-xl font-black text-white bg-gradient-to-r from-indigo-600 via-purple-500 to-cyan-500 hover:shadow-xl hover:shadow-indigo-500/30 transition-all disabled:opacity-50 gradient-shift-bg"
                  style={{ backgroundSize: "200% 200%" }}
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" strokeDasharray="40 60" /></svg>
                      Generating Profile...
                    </span>
                  ) : (
                    <>Build My Profiles <Sparkles className="inline w-4 h-4 ml-1" /></>
                  )}
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
