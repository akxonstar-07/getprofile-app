"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Check, Share2, QrCode, X, ChevronDown, ChevronUp,
  ShoppingBag, Link2, MapPin, Globe, Play, ExternalLink, Mail
} from "lucide-react";

/* ─── Platform detector from URL ─── */
function detectPlatform(url: string): { name: string; color: string; bg: string; icon: React.ReactNode } {
  const u = url.toLowerCase();
  if (u.includes("youtube") || u.includes("youtu.be")) return {
    name: "YouTube", color: "#fff", bg: "#FF0000",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M23.5 6.9a3 3 0 0 0-2.1-2.1C19.5 4.3 12 4.3 12 4.3s-7.5 0-9.4.5A3 3 0 0 0 .5 6.9C0 8.8 0 12.7 0 12.7s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 16.1V9.3l6.3 3.4-6.3 3.4z"/></svg>,
  };
  if (u.includes("tiktok")) return {
    name: "TikTok", color: "#fff", bg: "#010101",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.07 8.07 0 0 0 4.77 1.55V6.8a4.85 4.85 0 0 1-1-.11z"/></svg>,
  };
  if (u.includes("instagram")) return {
    name: "Instagram", color: "#fff", bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg>,
  };
  if (u.includes("twitter") || u.includes("x.com")) return { name: "X", color: "#fff", bg: "#000000",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>,
  };
  if (u.includes("spotify")) return { name: "Spotify", color: "#fff", bg: "#1DB954",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02z"/></svg>,
  };
  if (u.includes("facebook") || u.includes("fb.com")) return { name: "Facebook", color: "#fff", bg: "#1877F2",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>,
  };
  if (u.includes("linkedin")) return { name: "LinkedIn", color: "#fff", bg: "#0A66C2",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>,
  };
  if (u.includes("github")) return { name: "GitHub", color: "#fff", bg: "#333",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg>,
  };
  return {
    name: "Link", color: "#fff", bg: "#6366f1",
    icon: <Link2 className="w-3.5 h-3.5" />,
  };
}

function extractYouTubeEmbedUrl(url: string) {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

function extractSpotifyEmbedUrl(url: string) {
  const match = url.match(/spotify\.com\/(track|album|playlist|episode|show)\/([a-zA-Z0-9]+)/);
  return match ? `https://open.spotify.com/embed/${match[1]}/${match[2]}?utm_source=generator&theme=0` : null;
}

/* ─── Social icons config ─── */
const SOCIAL_CFG: Record<string, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  instagram: { label: "Instagram", color: "#fff", bg: "linear-gradient(45deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/></svg> },
  tiktok: { label: "TikTok", color: "#fff", bg: "#010101",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.34 6.34 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.07 8.07 0 0 0 4.77 1.55V6.8a4.85 4.85 0 0 1-1-.11z"/></svg> },
  youtube: { label: "YouTube", color: "#fff", bg: "#FF0000",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M23.5 6.9a3 3 0 0 0-2.1-2.1C19.5 4.3 12 4.3 12 4.3s-7.5 0-9.4.5A3 3 0 0 0 .5 6.9C0 8.8 0 12.7 0 12.7s0 3.9.5 5.8a3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1c.5-1.9.5-5.8.5-5.8s0-3.9-.5-5.8zM9.5 16.1V9.3l6.3 3.4-6.3 3.4z"/></svg> },
  twitter: { label: "X", color: "#fff", bg: "#000",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> },
  facebook: { label: "Facebook", color: "#fff", bg: "#1877F2",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg> },
  snapchat: { label: "Snapchat", color: "#000", bg: "#FFFC00",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12.206.793c.99 0 4.347.276 5.93 3.821.529 1.193.403 3.219.299 4.847l-.001.013c-.14 2.168-.42 3.43-.42 3.43s.573.225 1.384.225c.74 0 1.24-.218 1.24-.218.24-.059.56-.107.87.046.36.179.51.505.51.798 0 .625-.787.906-1.384 1.029-.195.04-.39.072-.545.113-.12.03-.205.07-.275.154-.23.264-.337.705-.483 1.258-.11.416-.26.858-.483 1.258-.078.143-.186.33-.335.462-.117.104-.264.156-.42.156-.33 0-.595-.185-.897-.267-.296-.082-.594-.222-.897-.267-.41-.064-.85.165-1.258.443a5.97 5.97 0 0 1-2.897.785 5.97 5.97 0 0 1-2.897-.785c-.408-.278-.848-.507-1.258-.443-.303.045-.601.185-.897.267-.302.082-.567.267-.897.267-.156 0-.303-.052-.42-.156-.149-.132-.257-.319-.335-.462-.223-.4-.373-.842-.483-1.258-.146-.553-.253-.994-.483-1.258-.07-.084-.155-.124-.275-.154-.155-.04-.35-.073-.545-.113C3.897 14.11 3.11 13.83 3.11 13.205c0-.293.15-.619.51-.798.31-.153.63-.105.87-.046 0 0 .5.218 1.24.218.81 0 1.384-.225 1.384-.225s-.28-1.262-.42-3.43C6.59 7.288 6.467 5.262 6.996 4.069 8.579 1.069 11.93.793 12.206.793z"/></svg> },
  spotify: { label: "Spotify", color: "#fff", bg: "#1DB954",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02z"/></svg> },
  linkedin: { label: "LinkedIn", color: "#fff", bg: "#0A66C2",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg> },
  github: { label: "GitHub", color: "#fff", bg: "#333",
    icon: <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></svg> },
  website: { label: "Website", color: "#fff", bg: "#6366f1", icon: <Globe className="w-5 h-5" /> },
};

/* ─── QR Modal ─── */
function QRModal({ url, name, onClose }: { url: string; name: string; onClose: () => void }) {
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}&bgcolor=ffffff&color=0f172a&margin=10`;
  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-3xl p-6 w-full max-w-xs shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-slate-900">Your QR Code</h3>
          <button onClick={onClose} className="w-8 h-8 bg-slate-100 rounded-xl flex items-center justify-center"><X className="w-4 h-4 text-slate-600" /></button>
        </div>
        <img src={qr} alt="QR" className="w-full rounded-2xl border border-slate-100 mb-4" />
        <p className="text-xs text-slate-400 text-center truncate mb-4">{url}</p>
        <a href={qr} download={`${name}-qr.png`} className="flex items-center justify-center w-full py-3 rounded-2xl bg-slate-900 text-white text-sm font-bold hover:bg-slate-700">Download QR</a>
      </div>
    </div>
  );
}

/* ─── Util: format large numbers ─── */
function fmt(n: number) {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return n.toString();
}

interface Props { user: any }

export default function PublicProfileClient({ user }: Props) {
  const profile  = user.profile;
  const accent   = profile?.accentColor || "#6366f1";
  const isDark   = profile?.theme === "dark" || ["dark", "neon", "purple", "gold"].includes(profile?.theme || "");
  const font     = profile?.font || "Inter";

  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribeStatus, setSubscribeStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [subscriberCount] = useState(Math.floor(Math.random() * 500) + 100);

  useEffect(() => {
    fetch("/api/analytics", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, type: "profile_view", referrer: document.referrer }),
    }).catch(() => {});
  }, [user.id]);

  const trackClick = (linkId: string) =>
    fetch("/api/analytics", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, type: "link_click", metadata: { linkId } }),
    }).catch(() => {});

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) await navigator.share({ title: user.name || user.username, url });
    else { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000); }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subscribeEmail) return;
    setSubscribeStatus("loading");
    try {
      const res = await fetch("/api/subscribe", { method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: subscribeEmail, username: user.username }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setSubscribeStatus("success"); setSubscribeMessage("Subscribed!"); setSubscribeEmail("");
    } catch (err: any) { setSubscribeStatus("error"); setSubscribeMessage(err.message); }
  };

  const socials    = Object.keys(SOCIAL_CFG).filter(s => profile?.[s]);
  const links      = (user.links || []).filter((l: any) => l.enabled !== false);
  const products   = (user.products || []).filter((p: any) => p.enabled !== false);
  const portfolio  = user.portfolioItems || [];

  /* Categorize links for hoo.be-style blocks */
  const videoLinks = links.filter((l: any) => {
    const u = l.url?.toLowerCase() || "";
    return u.includes("youtube") || u.includes("youtu.be") || u.includes("tiktok") || u.includes("vimeo");
  });
  const spotifyLinks = links.filter((l: any) => l.url?.toLowerCase().includes("spotify"));
  const regularLinks = links.filter((l: any) => {
    const u = l.url?.toLowerCase() || "";
    return !u.includes("youtube") && !u.includes("youtu.be") && !u.includes("tiktok") && !u.includes("vimeo") && !u.includes("spotify");
  });

  /* Derived colours */
  const pageBg    = isDark ? "#0c0f1a" : (profile?.bgColor || "#fff");
  const textColor = isDark ? "#f1f5f9" : "#0f172a";
  const mutedColor= isDark ? "#64748b" : "#64748b";
  const cardBg    = isDark ? "rgba(15,23,42,0.92)" : "rgba(255,255,255,0.95)";
  const cardBdr   = isDark ? "rgba(51,65,85,0.5)" : "rgba(226,232,240,0.8)";

  return (
    <div className="min-h-screen" style={{ fontFamily: font, background: pageBg }}>

      {showQR && (
        <QRModal url={typeof window !== "undefined" ? window.location.href : ""} name={user.name || user.username || "Profile"} onClose={() => setShowQR(false)} />
      )}

      {/* ════════════════════════════════════════
          BLOCK 1: IMMERSIVE HERO (Link.me style)
      ════════════════════════════════════════ */}
      <div className="relative w-full" style={{ minHeight: "55vw", maxHeight: 440 }}>
        {profile?.bannerUrl ? (
          <img src={profile.bannerUrl} alt="Hero" className="absolute inset-0 w-full h-full object-cover object-top" />
        ) : (
          <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${accent} 0%, ${accent}bb 40%, ${accent}44 100%)` }} />
        )}
        {/* Dark gradient overlay bottom */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${pageBg} 0%, ${pageBg}cc 15%, transparent 55%)` }} />

        {/* Top action buttons */}
        <div className="absolute top-4 right-4 flex items-center gap-2 z-20">
          <button onClick={handleShare}
            className="w-10 h-10 rounded-full backdrop-blur-md bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-all">
            {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>
          <button onClick={() => setShowQR(true)}
            className="w-10 h-10 rounded-full backdrop-blur-md bg-black/20 text-white flex items-center justify-center hover:bg-black/40 transition-all">
            <QrCode className="w-4 h-4" />
          </button>
        </div>

        {/* Identity overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-5 pb-5">
          {/* Avatar with animated ring */}
          <div className="avatar-ring mb-3">
            {profile?.avatarUrl ? (
              <img src={profile.avatarUrl} alt="" className="w-20 h-20 rounded-full object-cover border-4" style={{ borderColor: pageBg }} />
            ) : (
              <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl border-4" style={{ borderColor: pageBg, background: `${accent}30` }}>
                {(user.name || user.username || "?")[0].toUpperCase()}
              </div>
            )}
          </div>

          {/* Name + verified */}
          <h1 className="text-2xl font-black leading-tight" style={{ color: textColor }}>
            {user.name || user.username}
            <svg className="w-5 h-5 inline-block ml-1.5 -mt-0.5" viewBox="0 0 24 24" fill="#3b82f6"><path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#fff" strokeWidth="2" fill="#3b82f6"/></svg>
          </h1>

          {/* Username */}
          <p className="text-sm font-semibold mt-0.5" style={{ color: mutedColor }}>@{user.username}</p>

          {/* Bio */}
          {profile?.bio && (
            <p className="text-sm mt-2 leading-relaxed" style={{ color: mutedColor }}>{profile.bio}</p>
          )}

          {/* Location */}
          {profile?.location && (
            <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: mutedColor }}>
              <MapPin className="w-3 h-3" /> {profile.location}
            </p>
          )}
        </div>
      </div>

      {/* Content area */}
      <div className="max-w-lg mx-auto px-4 pb-12">

        {/* ════════════════════════════════════════
            BLOCK 2: STATS BAR (Link.me style)
        ════════════════════════════════════════ */}
        {(profile?.totalFollowers || 0) > 0 && (
          <div className="mt-4 mb-6">
            <button
              onClick={() => setShowFollowers(f => !f)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl transition-all"
              style={{ background: `${accent}10`, border: `1px solid ${accent}20` }}
            >
              <span className="text-sm font-black" style={{ color: accent }}>{fmt(profile.totalFollowers)}</span>
              <span className="text-xs font-semibold" style={{ color: mutedColor }}>Total Followers</span>
              {showFollowers ? <ChevronUp className="w-3 h-3" style={{ color: mutedColor }} /> : <ChevronDown className="w-3 h-3" style={{ color: mutedColor }} />}
            </button>

            {showFollowers && (
              <div className="mt-2 p-3 rounded-2xl animate-scale-in" style={{ background: cardBg, border: `1px solid ${cardBdr}` }}>
                {socials.map(s => {
                  const cfg = SOCIAL_CFG[s];
                  return (
                    <a key={s} href={profile[s]} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-white/5 transition-all">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: cfg.bg }}>{cfg.icon}</div>
                      <span className="text-sm font-semibold" style={{ color: textColor }}>{cfg.label}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            BLOCK 3: SOCIAL ICONS ROW (Branded circles)
        ════════════════════════════════════════ */}
        {socials.length > 0 && (
          <div className="flex items-center justify-center gap-3 mb-8 overflow-x-auto pb-2">
            {socials.map(s => {
              const cfg = SOCIAL_CFG[s];
              return (
                <a key={s} href={profile[s]} target="_blank" rel="noopener noreferrer"
                  className="flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-110 hover:shadow-lg"
                  style={{ background: cfg.bg, color: cfg.color }}
                  title={cfg.label}>
                  {cfg.icon}
                </a>
              );
            })}
          </div>
        )}

        {/* ════════════════════════════════════════
            BLOCK 4: FEATURED VIDEO (hoo.be style)
        ════════════════════════════════════════ */}
        {videoLinks.length > 0 && (
          <div className="mb-8">
            <h3 className="content-section-header" style={{ color: mutedColor }}>Featured Videos</h3>

            {/* First video: large embed */}
            {(() => {
              const firstVid = videoLinks[0];
              const ytEmbed = extractYouTubeEmbedUrl(firstVid.url);
              return (
                <a href={firstVid.url} target="_blank" rel="noopener noreferrer"
                  onClick={() => trackClick(firstVid.id)}
                  className="block rounded-2xl overflow-hidden mb-4 relative group"
                  style={{ border: `1px solid ${cardBdr}` }}>
                  {firstVid.image ? (
                    <div className="relative aspect-video">
                      <img src={firstVid.image} alt={firstVid.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/90 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-6 h-6 text-slate-900 fill-slate-900 ml-0.5" />
                        </div>
                      </div>
                      {/* Platform badge */}
                      {(() => { const p = detectPlatform(firstVid.url);
                        return <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-full backdrop-blur-md bg-black/40 text-white text-[10px] font-bold">{p.icon} <span>{p.name}</span></div>;
                      })()}
                    </div>
                  ) : (
                    <div className="aspect-video flex items-center justify-center" style={{ background: `${accent}15` }}>
                      <Play className="w-10 h-10" style={{ color: accent }} />
                    </div>
                  )}
                  <div className="p-3.5" style={{ background: cardBg }}>
                    <p className="text-sm font-bold line-clamp-1" style={{ color: textColor }}>{firstVid.title}</p>
                  </div>
                </a>
              );
            })()}

            {/* Remaining videos: 2-column grid */}
            {videoLinks.length > 1 && (
              <div className="grid grid-cols-2 gap-3">
                {videoLinks.slice(1, 5).map((link: any) => {
                  const platform = detectPlatform(link.url);
                  return (
                    <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                      onClick={() => trackClick(link.id)}
                      className="album-tile group"
                      style={{ border: `1px solid ${cardBdr}` }}>
                      {link.image ? (
                        <div className="aspect-square relative">
                          <img src={link.image} alt={link.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          <div className="album-tile-overlay" />
                          <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full backdrop-blur-md bg-black/40 text-white text-[9px] font-bold">{platform.icon}</div>
                          <div className="album-tile-title text-xs">{link.title}</div>
                        </div>
                      ) : (
                        <div className="aspect-square flex flex-col items-center justify-center p-3" style={{ background: cardBg }}>
                          <div className="w-8 h-8 rounded-full flex items-center justify-center text-white mb-2" style={{ background: platform.bg }}>{platform.icon}</div>
                          <p className="text-xs font-bold text-center line-clamp-2" style={{ color: textColor }}>{link.title}</p>
                        </div>
                      )}
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            BLOCK 5: PRODUCT SPOTLIGHT (hoo.be merch style)
        ════════════════════════════════════════ */}
        {products.length > 0 && (
          <div className="mb-8">
            <h3 className="content-section-header" style={{ color: mutedColor }}>
              <ShoppingBag className="w-3.5 h-3.5 inline mr-1" /> Shop
            </h3>

            {products.length === 1 ? (
              /* Single product: full width */
              <a href={products[0].checkoutUrl || "#"} target="_blank" rel="noopener noreferrer"
                className="block rounded-2xl overflow-hidden" style={{ border: `1px solid ${cardBdr}`, background: cardBg }}>
                {products[0].image && <img src={products[0].image} alt={products[0].name} className="w-full aspect-video object-cover" />}
                <div className="p-4">
                  <p className="font-bold text-sm" style={{ color: textColor }}>{products[0].name}</p>
                  <p className="text-lg font-black mt-1" style={{ color: accent }}>${products[0].price?.toFixed(2)}</p>
                  <button className="mt-3 w-full py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90" style={{ background: accent }}>View</button>
                </div>
              </a>
            ) : (
              /* Multiple: 1 large + 2 small (hoo.be layout) */
              <div className="grid grid-cols-[1.5fr_1fr] gap-3">
                {/* Large product */}
                <a href={products[0].checkoutUrl || "#"} target="_blank" rel="noopener noreferrer"
                  className="rounded-2xl overflow-hidden row-span-2" style={{ border: `1px solid ${cardBdr}`, background: cardBg }}>
                  {products[0].image && <img src={products[0].image} alt={products[0].name} className="w-full aspect-[3/4] object-cover" />}
                  <div className="p-3">
                    <p className="font-bold text-xs" style={{ color: textColor }}>{products[0].name}</p>
                    <p className="text-sm font-black" style={{ color: accent }}>${products[0].price?.toFixed(2)}</p>
                  </div>
                </a>
                {/* Small products */}
                {products.slice(1, 3).map((p: any) => (
                  <a key={p.id} href={p.checkoutUrl || "#"} target="_blank" rel="noopener noreferrer"
                    className="rounded-2xl overflow-hidden" style={{ border: `1px solid ${cardBdr}`, background: cardBg }}>
                    {p.image && <img src={p.image} alt={p.name} className="w-full aspect-square object-cover" />}
                    <div className="p-2.5">
                      <p className="font-bold text-[11px] line-clamp-1" style={{ color: textColor }}>{p.name}</p>
                      <p className="text-xs font-black" style={{ color: accent }}>${p.price?.toFixed(2)}</p>
                      <button className="mt-1.5 w-full py-1.5 rounded-lg text-[10px] font-bold border transition-all hover:opacity-80" style={{ borderColor: cardBdr, color: textColor }}>view</button>
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ════════════════════════════════════════
            BLOCK 6: MUSIC EMBED (Spotify)
        ════════════════════════════════════════ */}
        {spotifyLinks.length > 0 && (
          <div className="mb-8">
            <h3 className="content-section-header" style={{ color: mutedColor }}>Music</h3>
            {spotifyLinks.map((link: any) => {
              const embed = extractSpotifyEmbedUrl(link.url);
              return embed ? (
                <div key={link.id} className="rounded-2xl overflow-hidden mb-3" style={{ border: `1px solid ${cardBdr}` }}>
                  <iframe src={embed} width="100%" height="152" allow="encrypted-media" className="rounded-xl" style={{ border: 0 }} />
                </div>
              ) : (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                  onClick={() => trackClick(link.id)}
                  className="flex items-center gap-3 p-4 rounded-2xl mb-3 transition-all hover:scale-[1.02]"
                  style={{ background: cardBg, border: `1px solid ${cardBdr}` }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white flex-shrink-0" style={{ background: "#1DB954" }}>
                    {SOCIAL_CFG.spotify.icon}
                  </div>
                  <span className="text-sm font-bold" style={{ color: textColor }}>{link.title}</span>
                </a>
              );
            })}
          </div>
        )}

        {/* ════════════════════════════════════════
            BLOCK 7: CONTENT LINKS (Regular links as pills)
        ════════════════════════════════════════ */}
        {regularLinks.length > 0 && (
          <div className="mb-8">
            <h3 className="content-section-header" style={{ color: mutedColor }}>Links</h3>
            <div className="space-y-2.5">
              {regularLinks.map((link: any) => {
                const platform = detectPlatform(link.url);
                return (
                  <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                    onClick={() => trackClick(link.id)}
                    className="flex items-center gap-3.5 p-3.5 rounded-2xl transition-all hover:scale-[1.02] hover:shadow-lg active:scale-[0.98]"
                    style={{ background: cardBg, border: `1px solid ${cardBdr}` }}>
                    {link.image ? (
                      <img src={link.image} alt="" className="w-12 h-12 rounded-xl object-cover flex-shrink-0" />
                    ) : (
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white flex-shrink-0" style={{ background: platform.bg }}>
                        {platform.icon}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate" style={{ color: textColor }}>{link.title}</p>
                      <p className="text-[11px] truncate" style={{ color: mutedColor }}>{platform.name}</p>
                    </div>
                    <ExternalLink className="w-4 h-4 flex-shrink-0" style={{ color: mutedColor }} />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            BLOCK 8: PORTFOLIO PREVIEW
        ════════════════════════════════════════ */}
        {portfolio.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-3 px-1">
              <h3 className="content-section-header !mb-0 !p-0" style={{ color: mutedColor }}>Portfolio</h3>
              <Link href={`/${user.username}/portfolio`}
                className="text-xs font-bold flex items-center gap-1" style={{ color: accent }}>
                View All <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {portfolio.slice(0, 6).map((item: any) => (
                <Link key={item.id} href={`/${user.username}/portfolio`}
                  className="aspect-square rounded-xl overflow-hidden group">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl" style={{ background: `${accent}15` }}>🎨</div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════
            BLOCK 9: NEWSLETTER CTA (Glassmorphism)
        ════════════════════════════════════════ */}
        <div className="mb-8 rounded-2xl p-5 relative overflow-hidden"
          style={{
            background: isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.05)",
            border: `1px solid ${isDark ? "rgba(99,102,241,0.2)" : "rgba(99,102,241,0.15)"}`,
          }}>
          {/* Subtle gradient border effect */}
          <div className="absolute inset-0 rounded-2xl opacity-10 gradient-shift-bg" style={{ background: `linear-gradient(135deg, ${accent}, #06b6d4, ${accent})`, backgroundSize: "200% 200%" }} />

          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Mail className="w-5 h-5" style={{ color: accent }} />
              <h3 className="text-sm font-bold" style={{ color: textColor }}>Stay Connected</h3>
            </div>
            <p className="text-xs mb-1" style={{ color: mutedColor }}>
              Join {subscriberCount}+ others and never miss an update
            </p>
            
            {subscribeStatus === "success" ? (
              <div className="flex items-center gap-2 py-3 text-emerald-500 text-sm font-bold">
                <Check className="w-4 h-4" /> {subscribeMessage}
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2 mt-3">
                <input type="email" placeholder="your@email.com" value={subscribeEmail}
                  onChange={e => setSubscribeEmail(e.target.value)}
                  className="flex-1 px-3.5 py-2.5 rounded-xl text-sm border focus:outline-none transition-all"
                  style={{ background: isDark ? "rgba(255,255,255,0.05)" : "#fff", borderColor: cardBdr, color: textColor }}
                />
                <button type="submit" disabled={subscribeStatus === "loading"}
                  className="px-5 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50"
                  style={{ background: accent }}>
                  {subscribeStatus === "loading" ? "..." : "Join"}
                </button>
              </form>
            )}
            {subscribeStatus === "error" && <p className="text-xs text-red-400 mt-2">{subscribeMessage}</p>}
          </div>
        </div>

        {/* ════════════════════════════════════════
            BLOCK 10: FOOTER
        ════════════════════════════════════════ */}
        <div className="text-center pt-6 pb-4">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs opacity-30 hover:opacity-60 transition-opacity"
            style={{ color: mutedColor }}>
            <Globe className="w-3 h-3" /> Powered by getprofile.link
          </a>
        </div>

      </div>
    </div>
  );
}
