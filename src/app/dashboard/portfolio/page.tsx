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
  { id: "project", label: "Project", icon: Palette, color: "bg-indigo-500/10 text-indigo-400 border border-indigo-400/50" },
  { id: "collaboration", label: "Collaboration", icon: Briefcase, color: "bg-amber-500/10 text-amber-400 border border-amber-400/50" },
  { id: "reel", label: "Reel / Video", icon: Film, color: "bg-rose-500/10 text-rose-400 border border-rose-400/50" },
  { id: "instagram", label: "Instagram Post", icon: Camera, color: "bg-pink-500/10 text-pink-400 border border-pink-400/50" },
  { id: "press", label: "Press / Media", icon: Newspaper, color: "bg-emerald-500/10 text-emerald-400 border border-emerald-400/50" },
];

const emptyForm = { title: "", image: "", description: "", link: "", category: "", itemType: "project", brandName: "", videoUrl: "", isLocked: false, unlockPrice: "", requiredTier: "" };

const CATEGORY_COLORS: Record<string, string> = {
  design: "bg-pink-500/10 text-pink-400 border border-pink-400/50", 
  photography: "bg-amber-500/10 text-amber-400 border border-amber-400/50",
  development: "bg-[#D2FF00]/10 text-[#D2FF00] border border-[#D2FF00]/50", 
  writing: "bg-emerald-500/10 text-emerald-400 border border-emerald-400/50",
  video: "bg-rose-500/10 text-rose-400 border border-rose-400/50", 
  art: "bg-purple-500/10 text-purple-400 border border-purple-400/50",
};

function getCategoryStyle(cat: string) {
  const key = cat?.toLowerCase();
  return CATEGORY_COLORS[key] || "bg-indigo-500/10 text-indigo-400 border border-indigo-400/50";
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
     return <div className="py-32 flex flex-col items-center justify-center text-white/50 gap-6">
        <div className="w-16 h-16 border-[6px] border-white/10 border-t-[#D2FF00] rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D2FF00]">LOADING ENGINE...</p>
     </div>;
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 w-full max-w-6xl mx-auto pb-20 mt-8">
      
      {/* ── HEADER ── */}
      <div className="bg-black border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D2FF00]/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
         <div className="relative z-10">
           <div className="flex items-center gap-3 mb-2">
              <FolderOpen className="w-6 h-6 text-[#D2FF00]" />
              <h1 className="font-komi text-5xl text-white uppercase tracking-tighter leading-none mt-1">Media Portfolio</h1>
           </div>
           <p className="text-[#D2FF00] text-sm font-black uppercase tracking-widest opacity-80">
              {items.length} Assets · Showcase collaborations, press, and projects
           </p>
         </div>
         <button onClick={() => setShowForm(!showForm)} className="relative z-10 bg-[#D2FF00] text-black px-8 py-5 rounded-2xl font-komi text-2xl uppercase tracking-widest shadow-[0_0_20px_rgba(210,255,0,0.2)] hover:scale-105 transition-transform shrink-0 flex items-center gap-2">
            <Plus className="w-5 h-5" /> {showForm ? "CANCEL" : "UPLOAD ASSET"}
         </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="bg-[#050505] p-10 rounded-[3rem] border border-[#D2FF00]/50 shadow-[0_0_40px_rgba(210,255,0,0.1)] relative overflow-hidden animate-in fade-in slide-in-from-top-4">
          <h3 className="font-komi text-4xl text-white uppercase tracking-tighter mb-8">Deploy Portfolio Asset</h3>

          {/* Item Type Selector */}
          <div className="mb-8 p-6 bg-black border border-white/10 rounded-3xl">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 block mb-4">Core Media Type</label>
            <div className="flex flex-wrap gap-3">
              {ITEM_TYPES.map(t => (
                <button key={t.id}
                  onClick={() => setForm({ ...form, itemType: t.id })}
                  className={`flex items-center gap-2 px-5 py-3 rounded-[1.5rem] text-[11px] font-black tracking-widest uppercase transition-all ${
                    form.itemType === t.id ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.3)]" : "bg-white/5 text-white/50 border border-white/10 hover:border-white/30"
                  }`}>
                  <t.icon className="w-4 h-4" /> {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-8 mb-6">
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Header Syntax</label>
              <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white font-bold placeholder:text-white/20 outline-none focus:border-[#D2FF00]" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Project name or headline" autoFocus />
            </div>
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Subcategory (e.g. Design)</label>
              <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white font-bold placeholder:text-white/20 outline-none focus:border-[#D2FF00]" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Photography, UI, Music…" />
            </div>
          </div>

          {(form.itemType === "collaboration" || form.itemType === "press") && (
            <div className="mb-6 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">
                {form.itemType === "collaboration" ? "Brand Partner Name" : "Publication Body"}
              </label>
              <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-[#D2FF00] font-bold placeholder:text-white/20 outline-none focus:border-[#D2FF00]" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} placeholder={form.itemType === "collaboration" ? "e.g. Balenciaga, Prada…" : "e.g. Forbes, Hypebeast…"} />
            </div>
          )}

          {form.itemType === "reel" && (
            <div className="mb-6 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Video URI (TikTok, YouTube)</label>
              <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-[#D2FF00] font-mono text-sm placeholder:text-white/20 outline-none focus:border-[#D2FF00]" type="url" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} placeholder="https://..." />
            </div>
          )}

          <div className="mb-6 space-y-3">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Longform Description</label>
            <textarea className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white font-medium placeholder:text-white/20 outline-none focus:border-[#D2FF00] resize-none" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} placeholder="Expand on the context here…" />
          </div>
          
            {/* The Image Upload uses standard Next-Cloudinary currently. Wrap it in a black wrapper in the future if needed, but styling inherited context suffices */}
            <div className="mb-8">
               <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2 block mb-3">Cover Assets</label>
               <ImageUpload 
                 label="Upload Image Payload" 
                 value={form.image} 
                 onChange={(url) => setForm({ ...form, image: url })} 
                 className="bg-black border border-white/10 rounded-2xl"
               />
            </div>
            
            <div className="mb-8 space-y-3">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">External Output Link</label>
              <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white font-mono text-xs placeholder:text-white/20 outline-none focus:border-[#D2FF00]" type="url" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." />
            </div>

            {/* Neo-Brutalist Paywall Toggle */}
            <div className="p-8 bg-black border border-amber-500/30 rounded-3xl mb-8 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[60px] rounded-full pointer-events-none" />
               <label className="flex flex-col md:flex-row md:items-center gap-6 cursor-pointer mb-6 relative z-10 w-full">
                  <div className="flex-1">
                     <h4 className="font-komi text-3xl text-amber-500 tracking-tighter uppercase leading-none mb-2">Engage Paywall</h4>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Lock asset behind membership OR one-time payment</p>
                  </div>
                  <div onClick={() => setForm({ ...form, isLocked: !form.isLocked })}
                    className={`w-16 h-10 rounded-full transition-all flex items-center p-1 shrink-0 ${form.isLocked ? "bg-amber-500 justify-end shadow-[0_0_20px_rgba(245,158,11,0.5)]" : "bg-white/10 justify-start"}`}>
                    <div className="w-8 h-8 bg-black rounded-full" />
                  </div>
               </label>
               
               {form.isLocked && (
                 <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-amber-500/30 relative z-10">
                    <div>
                      <label className="block text-[10px] font-black text-amber-700/70 mb-2 uppercase tracking-widest">Gateway Fee ($)</label>
                      <input className="w-full bg-[#111] border border-amber-500/20 rounded-2xl px-5 py-4 text-amber-400 font-mono outline-none focus:border-amber-500" type="number" placeholder="4.99" value={form.unlockPrice} onChange={e => setForm({...form, unlockPrice: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-amber-700/70 mb-2 uppercase tracking-widest">Subscription Requisite (Optional)</label>
                      <select className="w-full bg-[#111] border border-amber-500/20 rounded-2xl px-5 py-4 text-amber-400 font-bold outline-none focus:border-amber-500" value={form.requiredTier} onChange={e => setForm({...form, requiredTier: e.target.value})}>
                         <option value="">None (One-time payment only)</option>
                         <option value="basic">Requires Basic Membership</option>
                         <option value="vip">Requires VIP Membership</option>
                      </select>
                    </div>
                 </div>
               )}
            </div>

            <button onClick={addItem} disabled={adding || !form.title} className={`w-full py-5 rounded-2xl font-komi text-2xl uppercase tracking-widest transition-all ${adding || !form.title ? 'bg-white/10 text-white/30' : 'bg-[#D2FF00] text-black hover:bg-white hover:scale-[1.02]'}`}>
              {adding ? "Initializing..." : "APPEND TO PORTFOLIO"}
            </button>
        </div>
      )}

      {/* Grid */}
      {items.length === 0 ? (
        <div className="bg-[#050505] border border-dashed border-white/20 rounded-[3rem] p-32 flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center mb-8">
            <FolderOpen className="w-8 h-8 text-white/30" />
          </div>
          <h3 className="font-komi text-4xl text-white uppercase tracking-tighter mb-4">MEDIA VAULT EMPTY</h3>
          <p className="text-white/40 text-sm max-w-sm font-medium">Inject high visual fidelity assets to construct your prestige gallery.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => {
            const typeBadge = getItemTypeBadge(item.itemType);
            return (
              <div key={item.id} className="bg-[#050505] rounded-[2rem] border border-white/10 overflow-hidden group hover:border-[#D2FF00]/50 hover:shadow-[0_0_20px_rgba(210,255,0,0.15)] transition-all">
                {/* Image Payload */}
                <div className="aspect-[4/3] bg-black relative border-b border-white/10 p-2">
                  <div className="w-full h-full rounded-[1.5rem] overflow-hidden relative">
                     {item.image ? (
                       <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" loading="lazy" />
                     ) : (
                       <div className="w-full h-full bg-white/5 flex items-center justify-center">
                         <typeBadge.icon className="w-10 h-10 text-white/10" />
                       </div>
                     )}
                  </div>
                  
                  {/* Badges Overlay */}
                  <div className="absolute top-5 left-5 flex gap-2">
                    <span className={`text-[9px] px-2.5 py-1.5 rounded uppercase font-black tracking-widest ${typeBadge.color}`}>
                      {typeBadge.label}
                    </span>
                    {item.isLocked && (
                      <span className="text-[9px] px-2.5 py-1.5 rounded uppercase font-black tracking-widest bg-amber-500/20 text-amber-500 border border-amber-500/50 backdrop-blur-md flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> PAYWALLED
                      </span>
                    )}
                  </div>

                  {/* Operational Hover Actions */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-between p-6">
                    <div className="flex gap-2 w-full justify-end">
                      {item.link && (
                        <a href={item.link} target="_blank" rel="noopener noreferrer"
                          className="w-10 h-10 bg-white/20 backdrop-blur border border-white/30 rounded-xl flex items-center justify-center text-white hover:bg-white hover:text-black hover:scale-110 transition-all">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                      <button onClick={() => deleteItem(item.id)}
                        className="w-10 h-10 bg-white/20 backdrop-blur border border-white/30 rounded-xl flex items-center justify-center text-white hover:bg-rose-500 hover:text-white hover:border-rose-400 hover:scale-110 transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Document Metadata */}
                <div className="p-6">
                  <div className="flex flex-col gap-2 mb-2">
                    {item.category && (
                      <span className={`text-[8px] px-2 py-1 rounded border uppercase font-black tracking-[0.2em] w-max ${getCategoryStyle(item.category)}`}>
                        {item.category}
                      </span>
                    )}
                    <h3 className="font-komi text-3xl text-white leading-none tracking-tight">{item.title}</h3>
                  </div>
                  
                  {item.brandName && (
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[#D2FF00] mt-3">Collab // {item.brandName}</p>
                  )}
                  {item.description && (
                    <p className="text-[12px] font-medium text-white/50 mt-4 line-clamp-2 leading-relaxed">{item.description}</p>
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
