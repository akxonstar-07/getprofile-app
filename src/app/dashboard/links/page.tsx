"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Plus, Trash2, GripVertical, ExternalLink,
  ToggleLeft, ToggleRight, Star, MousePointerClick, Smartphone, ArrowUpRight,
  Link2, Radio
} from "lucide-react";
import { LinkScheduler, ABTestPanel } from "@/components/dashboard/LinkTools";

/* ── DnD Kit ── */
import {
  DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove, SortableContext, sortableKeyboardCoordinates,
  useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface LinkItem {
  id: string; title: string; url: string;
  icon: string | null; image: string | null; highlight: boolean;
  enabled: boolean; order: number; clicks: number;
}

const emptyForm = { title: "", url: "", icon: "", image: "", highlight: false };

/* ═══════════════════════════════════════════════════
   neo-brutalist SORTABLE LINK ROW
═══════════════════════════════════════════════════ */
function SortableLinkRow({
  link, onUpdate, onDelete
}: {
  link: LinkItem;
  onUpdate: (id: string, data: Partial<LinkItem>) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes, listeners, setNodeRef, transform, transition, isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.7 : 1,
    zIndex: isDragging ? 50 : "auto" as any,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-[#050505] rounded-[2rem] border flex items-center gap-4 p-5 transition-all
        ${link.highlight ? "border-[#D2FF00]/50 shadow-[0_0_20px_rgba(210,255,0,0.1)]" : "border-white/10 hover:border-white/20"} 
        ${!link.enabled ? "opacity-50" : ""} 
        ${isDragging ? "shadow-2xl ring-2 ring-[#D2FF00]" : ""}`}
    >
      {/* Drag handle */}
      <button {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing flex-shrink-0 touch-none w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center">
        <GripVertical className="w-5 h-5 text-white/30 hover:text-white transition-colors" />
      </button>

      {/* Icon / Image preview */}
      {link.image ? (
        <img src={link.image} alt="" className="w-16 h-16 object-cover rounded-2xl flex-shrink-0 border border-white/5 bg-black" />
      ) : link.icon ? (
        <span className="text-3xl flex-shrink-0 w-16 h-16 rounded-2xl border border-white/5 bg-black flex items-center justify-center">{link.icon}</span>
      ) : (
        <div className="w-16 h-16 bg-black rounded-2xl border border-white/5 flex items-center justify-center flex-shrink-0">
          <Link2 className="w-6 h-6 text-white/20" />
        </div>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3">
          <h3 className="font-komi text-3xl text-white truncate leading-none mt-1">{link.title}</h3>
          {link.highlight && <Star className="w-4 h-4 text-[#D2FF00] fill-[#D2FF00] flex-shrink-0 mt-1" />}
          {!link.enabled && <span className="text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 text-white/50 px-3 py-1 rounded-md border border-white/5 mt-1">Snoozed</span>}
        </div>
        <p className="text-[11px] font-black uppercase tracking-[0.2em] text-[#D2FF00]/80 truncate mt-2">{link.url}</p>
      </div>

      {/* Operations Panel */}
      <div className="flex items-center gap-3">
         {/* Clicks */}
         <div className="flex items-center gap-2 px-4 py-2.5 bg-black border border-white/10 rounded-xl flex-shrink-0 hidden md:flex">
           <MousePointerClick className="w-4 h-4 text-white/30" />
           <span className="font-komi text-2xl text-white mt-1 leading-none">{link.clicks}</span>
         </div>

         {/* Toggle */}
         <button onClick={() => onUpdate(link.id, { enabled: !link.enabled })} className="flex-shrink-0 transition-opacity hover:opacity-80">
           {link.enabled
             ? <ToggleRight className="w-10 h-10 text-[#D2FF00]" />
             : <ToggleLeft className="w-10 h-10 text-white/20" />}
         </button>

         <div className="w-px h-8 bg-white/10 mx-2 hidden md:block" />

         {/* Link Actions */}
         <div className="flex items-center gap-1">
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="p-2 text-white/30 hover:text-[#D2FF00] hover:bg-white/5 rounded-xl transition-colors shrink-0">
              <ExternalLink className="w-5 h-5" />
            </a>
            <div className="hidden lg:flex"><LinkScheduler link={link} onSave={(id, data) => onUpdate(id, data)} /></div>
            <div className="hidden lg:flex"><ABTestPanel link={link} onSave={(id, data) => onUpdate(id, data)} /></div>
            <button onClick={() => onDelete(link.id)} className="p-2 text-white/30 hover:text-rose-500 hover:bg-white/5 rounded-xl transition-colors shrink-0">
              <Trash2 className="w-5 h-5" />
            </button>
         </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   NEO-BRUTALIST LIVE BENTO ENGINE PREVIEW
═══════════════════════════════════════════════════ */
function PhonePreview({
  links, name, profile
}: {
  links: LinkItem[]; name: string; profile: any;
}) {
  return (
    <div className="sticky top-24 hidden xl:block">
      <div className="bg-white/5 px-6 py-2 rounded-full border border-white/10 mb-6 flex items-center justify-center gap-2 max-w-[max-content] mx-auto">
         <Smartphone className="w-4 h-4 text-[#D2FF00]" />
         <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Live Bento Engine</span>
      </div>

      {/* Hardware Frame Apple Style */}
      <div className="relative mx-auto w-[360px] h-[740px] bg-black rounded-[3.5rem] border-[12px] border-[#111] shadow-[0_0_80px_rgba(0,0,0,0.5)] overflow-hidden ring-1 ring-white/10">
        
        {/* Dynamic Island simulate */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-[#111] rounded-full z-50 flex items-center justify-between px-3">
           <div className="w-3 h-3 rounded-full bg-black border border-white/10" />
           <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50" />
        </div>

        {/* Inner Content Area */}
        <div className="w-full h-full bg-[#050505] overflow-y-auto hide-scrollbar relative">
           
           {/* Banner */}
           {profile?.isLive ? (
              <div className="w-full h-44 bg-rose-950 flex flex-col items-center justify-center border-b border-rose-900/50">
                 <Radio className="w-8 h-8 text-rose-500 animate-pulse mb-2" />
                 <span className="text-[10px] font-black uppercase tracking-[0.3em] text-rose-400">Stream Online</span>
              </div>
           ) : (
              <div className="w-full h-44 bg-gradient-to-t from-black to-[#1A0B2E] border-b border-white/5" />
           )}

           {/* Setup Profile Section */}
           <div className="px-5 -mt-12 relative z-10 text-center mb-6">
              <div className="w-24 h-24 rounded-2xl border-4 border-black bg-[#111] mx-auto mb-4 flex items-center justify-center font-komi text-4xl text-white">
                 {name?.[0]?.toUpperCase() || "?"}
              </div>
              <h1 className="font-komi text-4xl text-white uppercase tracking-tighter leading-none mb-1">{name || "Your Name"}</h1>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-[#D2FF00]">@username</p>
           </div>

           {/* Bento Links Render */}
           <div className="px-4 pb-12 pt-2">
              <div className="grid grid-cols-2 gap-3">
                 {links.filter(l => l.enabled).map((link, i) => {
                    const isGridHero = i === 0 && !link.image && !link.url.includes("youtu");
                    
                    if (link.image) {
                       // Image links are wide blocks
                       return (
                          <div key={link.id} className="col-span-2 aspect-[3/1] bg-[#111] rounded-[1.5rem] relative overflow-hidden border border-white/10 p-3 flex items-end">
                             <img src={link.image} className="absolute inset-0 w-full h-full object-cover opacity-60" />
                             <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
                             <span className="relative z-10 font-bold text-[11px] text-white tracking-widest uppercase">{link.title}</span>
                          </div>
                       )
                    }

                    return (
                       <div key={link.id} className={`${isGridHero ? 'col-span-2 aspect-[3/1]' : 'col-span-1 aspect-square'} bg-[#111] border border-white/5 rounded-[1.5rem] p-4 flex flex-col justify-between`}>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-black ${link.highlight ? 'bg-[#D2FF00]' : 'bg-white/20'}`}>
                             {link.icon ? <span className="text-sm">{link.icon}</span> : <Link2 className="w-3.5 h-3.5" />}
                          </div>
                          <span className={`font-black text-[10px] uppercase tracking-wider line-clamp-2 ${link.highlight ? 'text-[#D2FF00]' : 'text-white'}`}>{link.title}</span>
                       </div>
                    )
                 })}
                 {links.filter(l => l.enabled).length === 0 && (
                    <div className="col-span-2 py-10 text-center text-white/20 text-[10px] uppercase font-black tracking-[0.2em] border border-dashed border-white/10 rounded-[2rem]">
                       Zero Assets Deployed
                    </div>
                 )}
              </div>
           </div>

        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   MAIN LINKS PAGE
═══════════════════════════════════════════════════ */
export default function LinksPage() {
  const [links,    setLinks]    = useState<LinkItem[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form,     setForm]     = useState(emptyForm);
  const [adding,   setAdding]   = useState(false);
  const [profile,  setProfile]  = useState<any>(null);
  
  // Live Stream State
  const [isLive, setIsLive] = useState(false);
  const [liveUrl, setLiveUrl] = useState("");
  const [savingLive, setSavingLive] = useState(false);

  /* DnD sensors */
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  useEffect(() => {
    fetchLinks();
    fetchProfile();
  }, []);

  async function fetchLinks() {
    const res  = await fetch("/api/links");
    const data = await res.json();
    setLinks(data.links || []);
    setLoading(false);
  }

  async function fetchProfile() {
    const res  = await fetch("/api/profile");
    const data = await res.json();
    if (data.user?.profile) {
       setProfile(data.user.profile);
       setIsLive(data.user.profile.isLive || false);
       setLiveUrl(data.user.profile.liveUrl || "");
    }
  }

  async function updateLiveStatus(newIsLive: boolean) {
    setSavingLive(true);
    try {
      await fetch("/api/profile", {
         method: "PUT",
         headers: { "Content-Type": "application/json" },
         body: JSON.stringify({ isLive: newIsLive, liveUrl }),
      });
      setIsLive(newIsLive);
      setProfile({ ...profile, isLive: newIsLive, liveUrl });
    } catch (e) {}
    setSavingLive(false);
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

  /* ── Drag & Drop handler ── */
  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = links.findIndex(l => l.id === active.id);
    const newIndex = links.findIndex(l => l.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    // Optimistic UI update
    const reordered = arrayMove(links, oldIndex, newIndex);
    setLinks(reordered);

    // Persist to backend
    try {
      await fetch("/api/links/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderedIds: reordered.map(l => l.id) }),
      });
    } catch {
      // Revert on failure
      fetchLinks();
    }
  }, [links]);

  const totalClicks = links.reduce((acc, l) => acc + l.clicks, 0);

  if (loading) return (
     <div className="py-32 flex flex-col items-center justify-center text-white/50 gap-6">
       <div className="w-16 h-16 border-[6px] border-white/10 border-t-[#D2FF00] rounded-full animate-spin" />
       <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D2FF00]">LOADING ENGINE...</p>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-start gap-12 relative z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Neo-Brutalist Editor Core */}
      <div className="flex-1 w-full max-w-2xl space-y-8">
        
        {/* Banner Block */}
        <div className="bg-black border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D2FF00]/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
           <div className="relative z-10">
             <div className="flex items-center gap-3 mb-2">
                <Link2 className="w-6 h-6 text-[#D2FF00]" />
                <h1 className="font-komi text-5xl text-white uppercase tracking-tighter leading-none mt-1">Asset Manager</h1>
             </div>
             <p className="text-[#D2FF00] text-sm font-black uppercase tracking-widest opacity-80">{links.length} Blocks Managed · {totalClicks} Total Events</p>
           </div>
           <button onClick={() => setShowForm(!showForm)} className="relative z-10 bg-[#D2FF00] text-black px-8 py-5 rounded-2xl font-komi text-2xl uppercase tracking-widest shadow-[0_0_20px_rgba(210,255,0,0.2)] hover:scale-105 transition-transform shrink-0">
              {showForm ? "CANCEL ALLOCATION" : "ALLOCATE NEW"}
           </button>
        </div>

        {/* Live Stream Panel (Aggressive Restyle) */}
        <div className="bg-[#050505] border border-rose-500/20 rounded-[3rem] p-8 relative overflow-hidden group shadow-2xl shadow-rose-500/5">
           <div className="absolute top-0 right-0 w-48 h-48 bg-rose-500/10 blur-[60px] rounded-full" />
           
           <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 relative z-10 gap-6">
              <div className="flex items-center gap-4">
                 <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${isLive ? "bg-rose-500 border-rose-400 text-white shadow-[0_0_30px_#f43f5e]" : "bg-black border-white/10 text-white/30"}`}>
                    <Radio className={`w-6 h-6 ${isLive ? "animate-pulse" : ""}`} />
                 </div>
                 <div>
                    <h2 className="font-komi text-3xl text-white">LIVE BROADCASTING</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Overrides Link-in-Bio Header</p>
                 </div>
              </div>
              <button 
                 disabled={savingLive}
                 onClick={() => updateLiveStatus(!isLive)}
                 className={`shrink-0 px-8 py-4 rounded-xl text-[11px] font-black uppercase tracking-[0.3em] transition-all ${
                   isLive ? "bg-white text-rose-600 hover:bg-rose-50" : "bg-black text-white hover:bg-[#D2FF00] hover:text-black border border-white/10"
                 }`}
              >
                 {isLive ? "TERMINATE FEED" : "INITIATE FEED"}
              </button>
           </div>
           
           <div className="relative z-10 bg-black p-4 rounded-2xl border border-white/5">
              <input 
                 disabled={isLive}
                 value={liveUrl}
                 onChange={e => setLiveUrl(e.target.value)}
                 className="w-full bg-transparent font-mono text-sm text-white outline-none focus:ring-0 placeholder:text-white/20 transition-all disabled:opacity-60"
                 placeholder="Insert Twitch/YouTube Stream HTTP..."
              />
           </div>
        </div>

        {/* Add Link Form */}
        {showForm && (
          <div className="bg-[#050505] p-10 rounded-[3rem] border border-[#D2FF00]/50 shadow-[0_0_40px_rgba(210,255,0,0.1)] mb-8 animate-in fade-in slide-in-from-top-4">
            <h3 className="font-komi text-4xl text-white uppercase tracking-tighter mb-8">Deploy Digital Asset</h3>
            
            <div className="grid md:grid-cols-2 gap-8 mb-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Display Title</label>
                <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white font-bold placeholder:text-white/20 outline-none focus:border-[#D2FF00]" type="text" value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
                  placeholder="Masterclass 2026" autoFocus />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Target Protocol (URL)</label>
                <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-[#D2FF00] font-mono text-sm placeholder:text-white/20 outline-none focus:border-[#D2FF00]" type="url" value={form.url}
                  onChange={e => setForm({ ...form, url: e.target.value })}
                  placeholder="https://..." />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Iconography (Optional)</label>
                <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white text-xl placeholder:text-white/20 outline-none focus:border-[#D2FF00]" type="text" value={form.icon}
                  onChange={e => setForm({ ...form, icon: e.target.value })}
                  placeholder="🔥 🎥" maxLength={4} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Image Payload (Wide Bento)</label>
                <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white font-mono text-[10px] placeholder:text-white/20 outline-none focus:border-[#D2FF00]" type="url" value={form.image}
                  onChange={e => setForm({ ...form, image: e.target.value })}
                  placeholder="https://... overrides icon for wide block" />
              </div>
            </div>

            <div className="mb-8 flex items-center bg-black border border-white/10 p-5 rounded-2xl">
              <label className="flex items-center gap-4 cursor-pointer w-full">
                <div onClick={() => setForm({ ...form, highlight: !form.highlight })}
                  className={`w-14 h-8 rounded-full transition-all flex items-center p-1 ${form.highlight ? "bg-[#D2FF00] justify-end shadow-[0_0_15px_rgba(210,255,0,0.5)]" : "bg-white/10 justify-start"}`}>
                  <div className="w-6 h-6 bg-black rounded-full" />
                </div>
                <div className="flex flex-col">
                   <span className="text-sm text-white font-bold tracking-widest uppercase">Enable Priority Highlight</span>
                   <span className="text-[9px] text-[#D2FF00] font-black uppercase mt-0.5">Visually isolates link on profile</span>
                </div>
              </label>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={addLink} disabled={adding || !form.title || !form.url} className={`w-full py-5 rounded-2xl font-komi text-2xl uppercase tracking-widest transition-all ${adding || !form.title || !form.url ? 'bg-white/10 text-white/30' : 'bg-[#D2FF00] text-black hover:bg-white'}`}>
                {adding ? "Deploying..." : "Execute Deployment"}
              </button>
            </div>
          </div>
        )}

        {/* Links list with DnD */}
        {links.length === 0 ? (
          <div className="bg-[#050505] border border-dashed border-white/20 rounded-[3rem] p-32 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center mb-8">
               <ExternalLink className="w-8 h-8 text-white/30" />
            </div>
            <h3 className="font-komi text-4xl text-white uppercase tracking-tighter mb-4">NO ASSETS DETECTED</h3>
            <p className="text-white/40 text-sm max-w-sm font-medium">Link allocation empty. Build your architecture to begin tunneling traffic.</p>
          </div>
        ) : (
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={links.map(l => l.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-4">
                {links.map((link) => (
                  <SortableLinkRow
                    key={link.id}
                    link={link}
                    onUpdate={updateLink}
                    onDelete={deleteLink}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}

      </div>

      {/* Embedded Phone Preview Component matches exactly */}
      <PhonePreview links={links} name={profile?.name || ""} profile={profile} />

    </div>
  );
}
