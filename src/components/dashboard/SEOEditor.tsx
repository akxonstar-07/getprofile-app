"use client";

import { useState, useEffect } from "react";
import { Search, Globe, Image, Save, CheckCircle2, Loader2, Eye } from "lucide-react";
import { toast } from "sonner";

export default function SEOEditor({ username }: { username: string }) {
  const [seo, setSeo] = useState({
    metaTitle: "",
    metaDescription: "",
    ogImage: "",
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(d => {
      if (d.user?.profile) {
        const config = d.user.profile.webConfig ? JSON.parse(d.user.profile.webConfig) : {};
        setSeo({
          metaTitle: config.metaTitle || `${d.user.name || username} | getprofile.link`,
          metaDescription: config.metaDescription || `Check out ${d.user.name || username}'s profile, links, and store.`,
          ogImage: config.ogImage || "",
        });
      }
    }).catch(() => {});
  }, [username]);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save SEO config inside webConfig JSON field
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          webConfig: JSON.stringify({
            metaTitle: seo.metaTitle,
            metaDescription: seo.metaDescription,
            ogImage: seo.ogImage,
          }),
        }),
      });

      // Note: webConfig field might need to be added to Profile PUT handler
      if (res.ok) {
        setSaved(true);
        toast.success("SEO settings saved!");
        setTimeout(() => setSaved(false), 3000);
      }
    } catch (err) {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const profileUrl = `https://getprofile.link/${username}`;

  return (
    <div className="dash-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center">
          <Search className="w-5 h-5 text-emerald-600" />
        </div>
        <div>
          <h3 className="font-black text-slate-900">SEO Settings</h3>
          <p className="text-xs text-slate-400">How your profile appears in search results</p>
        </div>
      </div>

      {/* Google Preview */}
      <div className="bg-slate-50 rounded-2xl p-5 mb-6 border border-slate-100">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1">
          <Eye className="w-3 h-3" /> Google Preview
        </p>
        <div className="space-y-1">
          <p className="text-xs text-emerald-700 font-medium">{profileUrl}</p>
          <p className="text-lg text-blue-700 font-medium leading-tight hover:underline cursor-pointer">
            {seo.metaTitle || `${username} | getprofile.link`}
          </p>
          <p className="text-sm text-slate-500 line-clamp-2">
            {seo.metaDescription || `Check out ${username}'s links, products, and profile.`}
          </p>
        </div>
      </div>

      <div className="space-y-5">
        {/* Meta Title */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Globe className="w-3 h-3 inline mr-1" /> Page Title
          </label>
          <input
            type="text"
            value={seo.metaTitle}
            onChange={e => setSeo({ ...seo, metaTitle: e.target.value })}
            placeholder="Your Name | Creator Profile"
            maxLength={60}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
          />
          <p className="text-[10px] text-slate-400 mt-1 text-right">{seo.metaTitle.length}/60 characters</p>
        </div>

        {/* Meta Description */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            Meta Description
          </label>
          <textarea
            value={seo.metaDescription}
            onChange={e => setSeo({ ...seo, metaDescription: e.target.value })}
            placeholder="A brief description of your profile for search engines..."
            maxLength={160}
            rows={3}
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all resize-none"
          />
          <p className="text-[10px] text-slate-400 mt-1 text-right">{seo.metaDescription.length}/160 characters</p>
        </div>

        {/* OG Image URL */}
        <div>
          <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
            <Image className="w-3 h-3 inline mr-1" /> Social Share Image (URL)
          </label>
          <input
            type="url"
            value={seo.ogImage}
            onChange={e => setSeo({ ...seo, ogImage: e.target.value })}
            placeholder="https://your-image-url.com/og-image.png"
            className="w-full px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 transition-all"
          />
        </div>

        {/* Save */}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
          {saving ? "Saving..." : saved ? "Saved!" : "Save SEO Settings"}
        </button>
      </div>
    </div>
  );
}
