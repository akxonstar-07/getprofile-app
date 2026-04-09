"use client";

import { useState, useEffect } from "react";
import {
  Plus, Trash2, GripVertical, ExternalLink,
  ToggleLeft, ToggleRight, Star, MousePointerClick, Smartphone, ArrowUpRight,
  Link2
} from "lucide-react";

interface LinkItem {
  id: string; title: string; url: string;
  icon: string | null; image: string | null; highlight: boolean;
  enabled: boolean; order: number; clicks: number;
}

const emptyForm = { title: "", url: "", icon: "", image: "", highlight: false };

/* ── Live Phone Preview ── */
function PhonePreview({
  links, name, accent, isDark
}: {
  links: LinkItem[]; name: string; accent: string; isDark: boolean;
}) {
  const text    = isDark ? "#f1f5f9" : "#0f172a";
  const textSub = isDark ? "#64748b"  : "#64748b";
  const btnBg   = isDark ? "rgba(30,41,59,0.9)" : "rgba(255,255,255,0.95)";
  const btnBdr  = isDark ? "rgba(71,85,105,0.5)" : "rgba(203,213,225,0.9)";

  return (
    <div className="sticky top-24">
      <div className="flex items-center gap-2 mb-4">
        <Smartphone className="w-4 h-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Live Preview</span>
      </div>

      {/* Phone frame */}
      <div className="relative mx-auto" style={{ width: 220 }}>
        {/* Outer shell */}
        <div className="rounded-[36px] p-[10px] shadow-2xl"
          style={{ background: isDark ? "#1e293b" : "#1e293b", border: "2px solid #334155" }}>
          {/* Notch */}
          <div className="flex justify-center mb-2">
            <div className="w-16 h-4 rounded-full" style={{ background: isDark ? "#0f172a" : "#0f172a" }} />
          </div>
          {/* Screen */}
          <div
            className="rounded-[24px] overflow-hidden"
            style={{
              height: 400,
              background: isDark ? "#0c0f1a" : "#ffffff",
              backgroundImage: `radial-gradient(circle at 80% 10%, ${accent}30 0%, transparent 50%)`,
            }}
          >
            {/* Banner strip */}
            <div className="h-20 relative" style={{ background: `linear-gradient(135deg, ${accent}dd, ${accent}66)` }}>
              <div className="absolute -bottom-8 left-4">
                <div className="w-14 h-14 rounded-2xl border-2 flex items-center justify-center text-base font-black text-white shadow-lg"
                  style={{ borderColor: isDark ? "#0c0f1a" : "#fff", background: `linear-gradient(135deg, ${accent}, ${accent}99)`, boxShadow: `0 0 0 2px ${accent}55` }}>
                  {name?.[0]?.toUpperCase() || "?"}
                </div>
              </div>
            </div>

            {/* Identity */}
            <div className="pt-10 px-4 pb-3">
              <p className="text-[11px] font-black" style={{ color: text }}>{name || "Your Name"}</p>
              <p className="text-[9px]" style={{ color: textSub }}>@username</p>
            </div>

            {/* Links preview */}
            <div className="px-3 pb-4 space-y-1.5 overflow-y-auto hide-scrollbar" style={{ maxHeight: 250 }}>
              {/* Grid links first */}
              {links.filter(l => l.enabled && l.image).length > 0 && (
                <div className="grid grid-cols-2 gap-1.5 mb-2">
                  {links.filter(l => l.enabled && l.image).slice(0,4).map(link => (
                    <div key={link.id} className="relative rounded-xl overflow-hidden" style={{ aspectRatio: "4/3" }}>
                      <img src={link.image!} alt="" className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      <div className="absolute bottom-1.5 left-1.5 right-1.5 text-[8px] font-bold text-white leading-tight drop-shadow-md line-clamp-2">
                        {link.title}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {/* Pill links */}
              {links.filter(l => l.enabled && !l.image).slice(0, 6).map(link => (
                <div
                  key={link.id}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl text-[9px] font-bold"
                  style={{
                    background: link.highlight ? `linear-gradient(135deg, ${accent}, ${accent}cc)` : btnBg,
                    color: link.highlight ? "#fff" : text,
                    border: `1px solid ${link.highlight ? "transparent" : btnBdr}`,
                    boxShadow: link.highlight ? `0 3px 10px ${accent}40` : "none",
                  }}
                >
                  {link.icon && <span className="text-xs">{link.icon}</span>}
                  {link.highlight && !link.icon && <Star className="w-2 h-2 fill-current opacity-80" />}
                  <span className="flex-1 text-center truncate">{link.title}</span>
                  <ArrowUpRight className="w-2.5 h-2.5 opacity-40" />
                </div>
              ))}
              {links.filter(l => l.enabled).length === 0 && (
                <div className="text-center py-6" style={{ color: textSub }}>
                  <p className="text-[9px]">Your links appear here</p>
                </div>
              )}
            </div>
          </div>
          {/* Home indicator */}
          <div className="flex justify-center mt-2">
            <div className="w-10 h-1 rounded-full" style={{ background: "#475569" }} />
          </div>
        </div>
      </div>

      <p className="text-[10px] text-slate-400 text-center mt-4">Updates in real time</p>
    </div>
  );
}

export default function LinksPage() {
  const [links,    setLinks]    = useState<LinkItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(emptyForm);
  const [adding,   setAdding]   = useState(false);
  const [profile,  setProfile]  = useState<any>(null);

  useEffect(() => {
    fetchLinks();
    fetchProfile();
  }, []);

  // Hoo.be real-time iframe sync
  useEffect(() => {
    const iframe = document.getElementById("preview-iframe") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage({
        type: "UPDATE_PREVIEW",
        payload: { 
          links,
          name: profile?.name,
          username: profile?.username,
          profile: profile
        }
      }, "*");
    }
  }, [links, profile]);

  async function fetchLinks() {
    const res  = await fetch("/api/links");
    const data = await res.json();
    setLinks(data.links || []);
    setLoading(false);
  }

  async function fetchProfile() {
    const res  = await fetch("/api/profile");
    const data = await res.json();
    setProfile(data.user?.profile);
  }

  async function addLink() {
    if (!form.title || !form.url) return;
    setAdding(true);
    await fetch("/api/links", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm(emptyForm); setShowForm(false); setAdding(false);
    fetchLinks();
  }

  async function updateLink(id: string, data: Partial<LinkItem>) {
    await fetch("/api/links", {
      method: "PUT", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...data }),
    });
    fetchLinks();
  }

  async function deleteLink(id: string) {
    await fetch(`/api/links?id=${id}`, { method: "DELETE" });
    fetchLinks();
  }

  const totalClicks = links.reduce((acc, l) => acc + l.clicks, 0);
  const accent = profile?.accentColor || "#6366f1";
  const isDark = profile?.theme === "dark";

  if (loading) return (
    <div className="max-w-5xl grid lg:grid-cols-[1fr_240px] gap-8">
      <div className="space-y-4">{[1, 2, 3].map(i => <div key={i} className="h-20 animate-shimmer rounded-2xl" />)}</div>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start justify-center gap-12 relative z-10 w-full">
      {/* Center/Left: Live Phone Preview */}
      <div className="lg:w-[320px] flex-shrink-0 flex items-start justify-center sticky top-12 lg:top-24 mt-8 lg:mt-0">
        <PhonePreview links={links} name={profile?.name || ""} accent={accent} isDark={isDark} />
      </div>

      {/* Right: Editor */}
      <div className="flex-1 w-full max-w-xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl pt-8 font-black text-white drop-shadow-sm">Manage Links</h1>
            <p className="text-white/80 text-sm mt-1">{links.length} links · {totalClicks} total clicks</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="bg-white text-slate-900 mt-8 px-4 py-2 rounded-xl text-sm font-bold shadow-sm hover:shadow-md transition-shadow">
            <Plus className="w-4 h-4 inline mr-1" /> Add link
          </button>
        </div>
          {/* Add form */}
          {showForm && (
            <div className="dash-card mb-6 animate-slide-up border-2 border-indigo-100">
              <h3 className="font-bold text-slate-900 mb-4">New Link</h3>
              
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Title</label>
                  <input className="input-premium" type="text" value={form.title}
                    onChange={e => setForm({ ...form, title: e.target.value })}
                    placeholder="My Portfolio" autoFocus />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">URL</label>
                  <input className="input-premium" type="url" value={form.url}
                    onChange={e => setForm({ ...form, url: e.target.value })}
                    placeholder="https://..." />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Emoji Icon (optional)</label>
                  <input className="input-premium" type="text" value={form.icon}
                    onChange={e => setForm({ ...form, icon: e.target.value })}
                    placeholder="🎨 📸 🔗" maxLength={4} />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-1.5 uppercase tracking-wide">Image URL (For Grid Card)</label>
                  <input className="input-premium" type="url" value={form.image}
                    onChange={e => setForm({ ...form, image: e.target.value })}
                    placeholder="https://... (makes this link a square grid card)" />
                </div>
              </div>

              <div className="mb-5 flex items-center">
                <label className="flex items-center gap-3 cursor-pointer">
                  <div onClick={() => setForm({ ...form, highlight: !form.highlight })}
                    className={`w-11 h-6 rounded-full transition-all flex items-center p-0.5 ${form.highlight ? "gradient-bg justify-end" : "bg-slate-200 justify-start"}`}>
                    <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
                  </div>
                  <span className="text-sm text-slate-700 font-medium">
                    <Star className="w-3.5 h-3.5 inline text-amber-500 mr-1" />Highlight appearance
                  </span>
                </label>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={addLink} disabled={adding || !form.title || !form.url} className="btn-primary">
                  {adding ? "Adding…" : "Add Link"}
                </button>
                <button onClick={() => { setShowForm(false); setForm(emptyForm); }} className="btn-ghost">Cancel</button>
              </div>
            </div>
          )}

          {/* Links list */}
          {links.length === 0 ? (
            <div className="dash-card py-20 text-center">
              <div className="w-16 h-16 rounded-2xl gradient-bg-subtle flex items-center justify-center mx-auto mb-4">
                <ExternalLink className="w-8 h-8 text-indigo-400" />
              </div>
              <h3 className="font-bold text-slate-800 mb-2">No links yet</h3>
              <p className="text-slate-500 text-sm mb-6">Add your first link to start building your profile</p>
              <button onClick={() => setShowForm(true)} className="btn-primary mx-auto">
                <Plus className="w-4 h-4" /> Add your first link
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {links.map((link) => (
                <div
                  key={link.id}
                  className={`bg-white rounded-2xl border flex items-center gap-3 p-4 transition-all hover:shadow-sm ${link.highlight ? "border-indigo-200 shadow-sm shadow-indigo-50" : "border-slate-100"} ${!link.enabled ? "opacity-50" : ""}`}
                >
                  <GripVertical className="w-4 h-4 text-slate-300 cursor-grab flex-shrink-0" />

                  {/* Icon / Image preview */}
                  {link.image ? (
                    <img src={link.image} alt="" className="w-10 h-10 object-cover rounded-lg flex-shrink-0" />
                  ) : link.icon ? (
                    <span className="text-2xl flex-shrink-0 w-10 text-center">{link.icon}</span>
                  ) : (
                    <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Link2 className="w-4 h-4 text-slate-400" />
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-slate-900 text-sm truncate">{link.title}</h3>
                      {link.highlight && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />}
                      {!link.enabled && <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">Hidden</span>}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{link.url}</p>
                  </div>

                  {/* Clicks */}
                  <div className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-50 rounded-xl flex-shrink-0">
                    <MousePointerClick className="w-3 h-3 text-slate-400" />
                    <span className="text-xs font-bold text-slate-600">{link.clicks}</span>
                  </div>

                  {/* Toggle */}
                  <button onClick={() => updateLink(link.id, { enabled: !link.enabled })} className="flex-shrink-0 transition-opacity hover:opacity-80">
                    {link.enabled
                      ? <ToggleRight className="w-7 h-7 text-indigo-500" />
                      : <ToggleLeft className="w-7 h-7 text-slate-300" />}
                  </button>

                  {/* External */}
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-1.5 text-slate-300 hover:text-indigo-500 transition-colors flex-shrink-0">
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {/* Delete */}
                  <button onClick={() => deleteLink(link.id)} className="p-1.5 text-slate-300 hover:text-red-500 transition-colors flex-shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
  );
}
