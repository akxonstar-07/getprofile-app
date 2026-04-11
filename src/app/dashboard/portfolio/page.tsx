"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ExternalLink, FolderOpen, Film, Briefcase, Camera, Newspaper, Palette } from "lucide-react";
import ImageUpload from "@/components/dashboard/ImageUpload";

interface PortfolioItem {
  id: string; title: string; image: string | null;
  description: string | null; link: string | null; category: string | null;
  itemType: string | null; brandName: string | null; videoUrl: string | null;
  isLocked: boolean; unlockPrice: number | null; requiredTier: string | null;
}

const ITEM_TYPES = [
  { id: "project", label: "Project", icon: Palette, color: "bg-indigo-50 text-indigo-600" },
  { id: "collaboration", label: "Collaboration", icon: Briefcase, color: "bg-amber-50 text-amber-600" },
  { id: "reel", label: "Reel / Video", icon: Film, color: "bg-rose-50 text-rose-600" },
  { id: "instagram", label: "Instagram Post", icon: Camera, color: "bg-pink-50 text-pink-600" },
  { id: "press", label: "Press / Media", icon: Newspaper, color: "bg-emerald-50 text-emerald-600" },
];

const emptyForm = { title: "", image: "", description: "", link: "", category: "", itemType: "project", brandName: "", videoUrl: "", isLocked: false, unlockPrice: "", requiredTier: "" };

const CATEGORY_COLORS: Record<string, string> = {
  design: "bg-pink-50 text-pink-600", photography: "bg-amber-50 text-amber-600",
  development: "bg-blue-50 text-blue-600", writing: "bg-emerald-50 text-emerald-600",
  video: "bg-rose-50 text-rose-600", art: "bg-purple-50 text-purple-600",
};

function getCategoryStyle(cat: string) {
  const key = cat?.toLowerCase();
  return CATEGORY_COLORS[key] || "bg-indigo-50 text-indigo-600";
}

function getItemTypeBadge(type: string | null) {
  const t = ITEM_TYPES.find(i => i.id === type);
  return t || ITEM_TYPES[0];
}

export default function PortfolioPage() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [adding, setAdding] = useState(false);

  useEffect(() => { fetchItems(); }, []);

  async function fetchItems() {
    const res = await fetch("/api/portfolio");
    const data = await res.json();
    setItems(data.items || []);
    setLoading(false);
  }

  async function addItem() {
    if (!form.title) return;
    setAdding(true);
    await fetch("/api/portfolio", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        unlockPrice: parseFloat(form.unlockPrice as string) || 0
      }),
    });
    setForm(emptyForm);
    setShowForm(false);
    setAdding(false);
    fetchItems();
  }

  async function deleteItem(id: string) {
    await fetch(`/api/portfolio?id=${id}`, { method: "DELETE" });
    fetchItems();
  }

  if (loading) {
    return (
      <div className="max-w-4xl grid grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="animate-shimmer rounded-2xl aspect-[4/3]" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Portfolio & Media Kit</h1>
          <p className="text-slate-500 text-sm mt-1">{items.length} items · Showcase projects, collabs, reels & press</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="btn-primary">
          <Plus className="w-4 h-4" /> Add item
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="dash-card mb-8 animate-slide-up border-2 border-indigo-100">
          <h3 className="font-semibold text-slate-900 mb-5">New Portfolio Item</h3>

          {/* Item Type Selector */}
          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Item Type</label>
            <div className="flex flex-wrap gap-2">
              {ITEM_TYPES.map(t => (
                <button key={t.id}
                  onClick={() => setForm({ ...form, itemType: t.id })}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                    form.itemType === t.id ? "bg-indigo-600 text-white shadow-md" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}>
                  <t.icon className="w-3.5 h-3.5" /> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Title</label>
              <input className="input-premium" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project name or headline" autoFocus />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Category</label>
              <input className="input-premium" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Design, Photography, Art…" />
            </div>
          </div>

          {/* Collaboration-specific field */}
          {(form.itemType === "collaboration" || form.itemType === "press") && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">
                {form.itemType === "collaboration" ? "Brand Name" : "Publication Name"}
              </label>
              <input className="input-premium" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} placeholder={form.itemType === "collaboration" ? "e.g. Nike, Samsung…" : "e.g. Forbes, Vogue…"} />
            </div>
          )}

          {/* Reel-specific field */}
          {form.itemType === "reel" && (
            <div className="mb-4">
              <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Video URL</label>
              <input className="input-premium" type="url" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="YouTube, TikTok, or Vimeo URL" />
            </div>
          )}

          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Description</label>
            <textarea className="input-premium resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Brief description…" />
          </div>
            <ImageUpload 
              label="Cover Image" 
              value={form.image} 
              onChange={(url) => setForm({ ...form, image: url })} 
              className="mb-5"
            />
            
            <div className="grid sm:grid-cols-1 gap-4 mb-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Project Link</label>
                <input className="input-premium" type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
              </div>
            </div>

            {/* Paywall Toggle */}
            <div className="p-4 bg-amber-50/50 border border-amber-100 rounded-xl mb-6">
               <label className="flex items-center gap-3 cursor-pointer mb-3">
                  <div onClick={() => setForm({ ...form, isLocked: !form.isLocked })}
                    className={`w-11 h-6 rounded-full transition-all flex items-center p-0.5 ${form.isLocked ? "bg-amber-500 justify-end" : "bg-slate-200 justify-start"}`}>
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                  </div>
                  <span className="text-sm text-amber-700 font-bold">
                    Lock behind Paywall / Membership
                  </span>
               </label>
               {form.isLocked && (
                 <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-amber-200/50">
                    <div>
                      <label className="block text-[10px] font-black text-amber-700/70 mb-1 uppercase tracking-wide">Unlock Price ($)</label>
                      <input className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-sm outline-none" type="number" placeholder="4.99" value={form.unlockPrice} onChange={e => setForm({...form, unlockPrice: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-amber-700/70 mb-1 uppercase tracking-wide">Required Tier (Optional)</label>
                      <select className="w-full bg-white border border-amber-200 rounded-xl px-3 py-2 text-sm outline-none" value={form.requiredTier} onChange={e => setForm({...form, requiredTier: e.target.value})}>
                         <option value="">None (One-time payment)</option>
                         <option value="basic">Basic Membership</option>
                         <option value="vip">VIP Membership</option>
                      </select>
                    </div>
                 </div>
               )}
            </div>
          <div className="flex items-center gap-3">
            <button onClick={addItem} disabled={adding || !form.title} className="btn-primary">
              {adding ? "Adding…" : "Add to Portfolio"}
            </button>
            <button onClick={() => { setShowForm(false); setForm(emptyForm); }} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <div className="dash-card py-20 text-center">
          <div className="w-16 h-16 rounded-2xl gradient-bg-subtle flex items-center justify-center mx-auto mb-4">
            <FolderOpen className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="font-semibold text-slate-800 mb-2">No portfolio items yet</h3>
          <p className="text-slate-500 text-sm mb-6">Add projects, brand collabs, reels, and press features</p>
          <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
            <Plus className="w-4 h-4" /> Add first item
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item) => {
            const typeBadge = getItemTypeBadge(item.itemType);
            return (
              <div key={item.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden group card-hover">
                {/* Image */}
                <div className="aspect-[4/3] overflow-hidden relative">
                  {item.image ? (
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                  ) : (
                    <div className="w-full h-full gradient-bg-subtle flex items-center justify-center">
                      <typeBadge.icon className="w-8 h-8 text-indigo-300" />
                    </div>
                  )}
                  {/* Type badge */}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`text-[10px] px-2 py-1 rounded-lg font-bold ${typeBadge.color}`}>
                      {typeBadge.label}
                    </span>
                    {item.isLocked && (
                      <span className="text-[10px] px-2 py-1 rounded-lg font-bold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                        🔒 Paywalled
                      </span>
                    )}
                  </div>
                  {/* Overlay actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-between p-4">
                    <div className="flex gap-2">
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer"
                          className="p-2 bg-white/90 rounded-xl text-slate-700 hover:text-indigo-600 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button onClick={() => deleteItem(item.id)}
                        className="p-2 bg-white/90 rounded-xl text-slate-700 hover:text-red-500 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-slate-900 text-sm leading-tight">{item.title}</h3>
                    {item.category && (
                      <span className={`text-xs px-2 py-0.5 rounded-full font-semibold flex-shrink-0 ${getCategoryStyle(item.category)}`}>
                        {item.category}
                      </span>
                    )}
                  </div>
                  {item.brandName && (
                    <p className="text-xs font-bold text-indigo-500 mt-1">with {item.brandName}</p>
                  )}
                  {item.description && (
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">{item.description}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
