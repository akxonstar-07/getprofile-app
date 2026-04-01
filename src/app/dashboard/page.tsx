"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  Save, User, MapPin, Globe, ExternalLink, Camera, CheckCircle2,
  AlertCircle, Link2, Briefcase, Mail, Award,
} from "lucide-react";
import ImageUpload from "@/components/dashboard/ImageUpload";

const socialFields = [
  { key: "twitter", label: "Twitter / X", placeholder: "https://x.com/yourhandle", icon: "𝕏" },
  { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/yourhandle", icon: "📷" },
  { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/in/yourhandle", icon: "in" },
  { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/@yourchannel", icon: "▶" },
  { key: "github", label: "GitHub", placeholder: "https://github.com/yourhandle", icon: "⌨" },
  { key: "tiktok", label: "TikTok", placeholder: "https://tiktok.com/@yourhandle", icon: "♪" },
  { key: "website", label: "Website", placeholder: "https://yourwebsite.com", icon: "🌐" },
  { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/yourpage", icon: "f" },
  { key: "snapchat", label: "Snapchat", placeholder: "https://snapchat.com/add/yourhandle", icon: "👻" },
  { key: "spotify", label: "Spotify", placeholder: "https://open.spotify.com/...", icon: "🎵" },
];

export default function DashboardProfilePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"basic" | "social" | "mediakit">("basic");
  const [form, setForm] = useState({
    name: "", username: "", bio: "", location: "",
    avatarUrl: "", bannerUrl: "",
    twitter: "", instagram: "", linkedin: "",
    youtube: "", github: "", tiktok: "", website: "",
    facebook: "", snapchat: "", spotify: "",
    totalFollowers: 0,
    portfolioTitle: "", portfolioBio: "", skills: "",
    businessEmail: "", statsBrandDeals: 0, statsContentCount: 0,
    availableForWork: true,
  });

  useEffect(() => { fetchProfile(); }, []);

  async function fetchProfile() {
    try {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (data.user) {
        setForm({
          name: data.user.name || "",
          username: data.user.username || "",
          bio: data.user.profile?.bio || "",
          location: data.user.profile?.location || "",
          avatarUrl: data.user.profile?.avatarUrl || "",
          bannerUrl: data.user.profile?.bannerUrl || "",
          twitter: data.user.profile?.twitter || "",
          instagram: data.user.profile?.instagram || "",
          linkedin: data.user.profile?.linkedin || "",
          youtube: data.user.profile?.youtube || "",
          github: data.user.profile?.github || "",
          tiktok: data.user.profile?.tiktok || "",
          website: data.user.profile?.website || "",
          facebook: data.user.profile?.facebook || "",
          snapchat: data.user.profile?.snapchat || "",
          spotify: data.user.profile?.spotify || "",
          totalFollowers: data.user.profile?.totalFollowers || 0,
          portfolioTitle: data.user.profile?.portfolioTitle || "",
          portfolioBio: data.user.profile?.portfolioBio || "",
          skills: data.user.profile?.skills || "",
          businessEmail: data.user.profile?.businessEmail || "",
          statsBrandDeals: data.user.profile?.statsBrandDeals || 0,
          statsContentCount: data.user.profile?.statsContentCount || 0,
          availableForWork: data.user.profile?.availableForWork ?? true,
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setError("");
    setSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to save"); return; }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-3xl space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="dash-card animate-shimmer h-40 rounded-2xl" />
        ))}
      </div>
    );
  }

  const socialCount = socialFields.filter((s) => (form as any)[s.key]).length;

  return (
    <div className="max-w-3xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Your Profile</h1>
          <p className="text-slate-500 text-sm mt-1">
            Your public page lives at{" "}
            <span className="font-medium text-indigo-600">
              getprofile.link/{form.username || "username"}
            </span>
          </p>
        </div>
        {form.username && (
          <a
            href={`/${form.username}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-ghost hidden sm:inline-flex"
          >
            <ExternalLink className="w-4 h-4" />
            View live
          </a>
        )}
      </div>

      {/* Profile preview card */}
      <div className="dash-card mb-6 overflow-hidden">
        {/* Banner */}
        <div
          className="h-28 rounded-xl mb-4 relative flex items-center justify-center group cursor-pointer overflow-hidden"
          style={{
            background: form.bannerUrl
              ? `url(${form.bannerUrl}) center/cover no-repeat`
              : "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)",
          }}
        >
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all rounded-xl flex items-center justify-center">
            <Camera className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>

        {/* Avatar */}
        <div className="flex items-end gap-4 -mt-10 pl-4 mb-4">
          <div
            className="w-20 h-20 rounded-2xl border-4 border-white shadow-lg flex items-center justify-center text-3xl font-bold text-white flex-shrink-0 overflow-hidden"
            style={{
              background: form.avatarUrl
                ? `url(${form.avatarUrl}) center/cover`
                : "linear-gradient(135deg, #6366f1, #06b6d4)",
            }}
          >
            {!form.avatarUrl && (form.name?.[0]?.toUpperCase() || "?")}
          </div>
          <div className="pb-1">
            <p className="font-bold text-slate-900">{form.name || "Your Name"}</p>
            <p className="text-sm text-slate-500">@{form.username || "username"}</p>
          </div>
        </div>

        {form.bio && <p className="text-sm text-slate-600 px-1 mb-2 line-clamp-2">{form.bio}</p>}
        {form.location && (
          <p className="text-xs text-slate-400 flex items-center gap-1 px-1">
            <MapPin className="w-3 h-3" />
            {form.location}
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {(["basic", "social", "mediakit"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2 rounded-lg text-sm font-medium transition-all capitalize ${
              activeTab === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "basic" ? "Basic Info" : tab === "social" ? (
              <span className="flex items-center gap-1.5">
                Social Links
                {socialCount > 0 && (
                  <span className="w-5 h-5 gradient-bg text-white rounded-full text-xs flex items-center justify-center font-bold">
                    {socialCount}
                  </span>
                )}
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5" /> Media Kit
              </span>
            )}
          </button>
        ))}
      </div>

      {activeTab === "basic" && (
        <div className="space-y-5 animate-fade-in">
          {/* Name + Username */}
          <div className="dash-card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-500" />
              Identity
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Display Name</label>
                <input
                  className="input-premium"
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Alex Rivera"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Username</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">@</span>
                  <input
                    className="input-premium pl-7"
                    type="text"
                    value={form.username}
                    onChange={(e) =>
                      setForm({ ...form, username: e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase() })
                    }
                    placeholder="alexrivera"
                  />
                </div>
                <p className="text-xs text-slate-400 mt-1">getprofile.link/{form.username || "username"}</p>
              </div>
            </div>
          </div>

          {/* Bio + Location */}
          <div className="dash-card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" />
              About You
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Bio</label>
                <textarea
                  className="input-premium resize-none"
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  rows={3}
                  placeholder="Tell the world what you do and what you create…"
                  maxLength={200}
                />
                <p className="text-xs text-slate-400 mt-1 text-right">{form.bio.length}/200</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  <MapPin className="w-3.5 h-3.5 inline mr-1" />Location
                </label>
                <input
                  className="input-premium"
                  type="text"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="San Francisco, CA"
                />
              </div>
            </div>
          </div>

          {/* Images */}
          <div className="dash-card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Camera className="w-4 h-4 text-indigo-500" />
              Images
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <ImageUpload 
                  label="Avatar Image" 
                  value={form.avatarUrl} 
                  onChange={(url) => setForm({ ...form, avatarUrl: url })} 
                />
              </div>
              <div className="space-y-2">
                <ImageUpload 
                  label="Banner Background" 
                  value={form.bannerUrl} 
                  onChange={(url) => setForm({ ...form, bannerUrl: url })} 
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "social" && (
        <div className="dash-card animate-fade-in">
          <h3 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <Link2 className="w-4 h-4 text-indigo-500" />
            Social Profiles & Metrics
          </h3>
          <div className="mb-6 pb-6 border-b border-slate-100">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
              Total Followers Count
            </label>
            <input
              className="input-premium w-full sm:w-1/2 font-bold text-indigo-600"
              type="number"
              min="0"
              value={form.totalFollowers}
              onChange={(e) => setForm({ ...form, totalFollowers: parseInt(e.target.value) || 0 })}
              placeholder="e.g. 1500000"
            />
            <p className="text-xs text-slate-400 mt-1">This will display as a single unified metric on your profile.</p>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            {socialFields.map((s) => (
              <div key={s.key}>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">
                  <span className="mr-1">{s.icon}</span> {s.label}
                </label>
                <input
                  className="input-premium"
                  type="url"
                  value={(form as any)[s.key]}
                  onChange={(e) => setForm({ ...form, [s.key]: e.target.value })}
                  placeholder={s.placeholder}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "mediakit" && (
        <div className="space-y-5 animate-fade-in">
          <div className="dash-card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-500" />
              Portfolio & Media Kit
            </h3>
            <p className="text-xs text-slate-400 mb-5">These fields power your portfolio web page and media kit for brands.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Portfolio Title / Tagline</label>
                <input className="input-premium" value={form.portfolioTitle} onChange={(e) => setForm({ ...form, portfolioTitle: e.target.value })} placeholder="Creator • Model • Brand Ambassador" />
                <p className="text-xs text-slate-400 mt-1">Separate titles with • for the typing animation effect</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Portfolio Bio (Extended)</label>
                <textarea className="input-premium resize-none" rows={4} value={form.portfolioBio} onChange={(e) => setForm({ ...form, portfolioBio: e.target.value })} placeholder="A longer, more detailed bio for your portfolio page. Tell your story, what you do, and why brands should work with you." />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Skills / Expertise</label>
                <input className="input-premium" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} placeholder='["Photography", "Video Editing", "Brand Strategy"]' />
                <p className="text-xs text-slate-400 mt-1">JSON array of skill tags. They appear as pills on your portfolio.</p>
              </div>
            </div>
          </div>

          <div className="dash-card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-indigo-500" />
              Business Contact
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Business Email</label>
                <input className="input-premium" type="email" value={form.businessEmail} onChange={(e) => setForm({ ...form, businessEmail: e.target.value })} placeholder="business@example.com" />
                <p className="text-xs text-slate-400 mt-1">Displayed publicly on your portfolio page</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Available for Work</label>
                <div className="flex items-center gap-3 mt-2">
                  <button onClick={() => setForm({ ...form, availableForWork: !form.availableForWork })}
                    className={`relative w-12 h-7 rounded-full transition-colors ${form.availableForWork ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                    <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all shadow-sm ${form.availableForWork ? 'left-6' : 'left-1'}`} />
                  </button>
                  <span className={`text-sm font-semibold ${form.availableForWork ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {form.availableForWork ? 'Open to opportunities' : 'Not available'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="dash-card">
            <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <Award className="w-4 h-4 text-indigo-500" />
              Stats & Metrics
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Brand Deals Completed</label>
                <input className="input-premium" type="number" min="0" value={form.statsBrandDeals} onChange={(e) => setForm({ ...form, statsBrandDeals: parseInt(e.target.value) || 0 })} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Total Content Created</label>
                <input className="input-premium" type="number" min="0" value={form.statsContentCount} onChange={(e) => setForm({ ...form, statsContentCount: parseInt(e.target.value) || 0 })} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Save section */}
      <div className="mt-6 flex items-center gap-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="btn-primary px-8 py-3"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving…" : "Save changes"}
        </button>
        {success && (
          <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium animate-fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Saved successfully!
          </div>
        )}
        {error && (
          <div className="flex items-center gap-2 text-sm text-red-500 font-medium animate-fade-in">
            <AlertCircle className="w-4 h-4" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
