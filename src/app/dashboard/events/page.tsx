"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, Plus, MapPin, Globe, Users, Clock, Trash2, Edit2, 
  ExternalLink, Check, AlertCircle, Loader2, Sparkles, Share2
} from "lucide-react";
import { toast } from "sonner";
import { useRoleDashboardConfig } from "@/hooks/useRoleDashboardConfig";

export default function EventsHubPage() {
  const { config } = useRoleDashboardConfig();
  const pageConfig = config.pages.events;
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    isVirtual: true,
    maxAttendees: ""
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      const res = await fetch("/api/events");
      const data = await res.json();
      if (data.events) setEvents(data.events);
    } catch (err) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newEvent,
          maxAttendees: parseInt(newEvent.maxAttendees) || null
        })
      });
      if (res.ok) {
        toast.success("Event is Live! 🎪");
        setIsAdding(false);
        fetchEvents();
      }
    } catch (err) {
      toast.error("Failed to launch event");
    }
  };

  const deleteEvent = async (id: string) => {
    if (!confirm("Are you sure you want to cancel this event?")) return;
    try {
      await fetch(`/api/events/${id}`, { method: "DELETE" });
      toast.success("Event cancelled successfully");
      fetchEvents();
    } catch (err) {
      toast.error("Failed to delete event");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── HEADER & ACTION ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600">
                <Calendar className="w-5 h-5" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">{pageConfig.title}</h1>
          </div>
          <p className="text-slate-500 font-medium max-w-md">{pageConfig.subtitle}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-black text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all">
          <Plus className="w-4 h-4" /> {pageConfig.addLabel}
        </button>
      </div>

      {/* ── EVENT CREATION FORM ── */}
      {isAdding && (
         <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300 overflow-hidden relative group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] pointer-events-none" />
            <div className="flex items-center justify-between mb-8 relative z-10">
               <h2 className="text-xl font-black text-white uppercase tracking-wider">{pageConfig.addLabel}</h2>
               <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white transition-colors">× Cancel</button>
            </div>
            <form onSubmit={handleCreateEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
               <div className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Event Title</label>
                    <input 
                      required
                      placeholder="e.g. Masterclass: Grow your Creator Business"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:border-rose-500 outline-none transition-all"
                      value={newEvent.title}
                      onChange={e => setNewEvent({...newEvent, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Description</label>
                    <textarea 
                      placeholder="What will happen at this event?"
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:border-rose-500 outline-none transition-all h-32 resize-none"
                      value={newEvent.description}
                      onChange={e => setNewEvent({...newEvent, description: e.target.value})}
                    />
                  </div>
               </div>
               <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Date & Time</label>
                        <input 
                          type="datetime-local"
                          required
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:border-rose-500 outline-none transition-all"
                          value={newEvent.date}
                          onChange={e => setNewEvent({...newEvent, date: e.target.value})}
                        />
                     </div>
                     <div>
                        <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Capacity (Optional)</label>
                        <input 
                          type="number"
                          placeholder="Unlimited"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:border-rose-500 outline-none transition-all"
                          value={newEvent.maxAttendees}
                          onChange={e => setNewEvent({...newEvent, maxAttendees: e.target.value})}
                        />
                     </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Location / Virtual Link</label>
                    <div className="flex gap-2 mb-2">
                       {["VIRTUAL", "PHYSICAL"].map((t) => (
                         <button
                           key={t}
                           type="button"
                           onClick={() => setNewEvent({...newEvent, isVirtual: t === "VIRTUAL"})}
                           className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                             (newEvent.isVirtual && t === "VIRTUAL") || (!newEvent.isVirtual && t === "PHYSICAL") ? "bg-rose-500 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
                           }`}
                         >
                           {t}
                         </button>
                       ))}
                    </div>
                    <input 
                      placeholder={newEvent.isVirtual ? "Zoom/Luma link" : "123 Event St, New York"}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:border-rose-500 outline-none transition-all"
                      value={newEvent.location}
                      onChange={e => setNewEvent({...newEvent, location: e.target.value})}
                    />
                  </div>
                  <button className="w-full bg-rose-600 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-rose-700 transition-all mt-4 shadow-xl shadow-rose-500/20">
                    {pageConfig.addLabel} 🎪
                  </button>
               </div>
            </form>
         </div>
      )}

      {/* ── EVENTS LIST ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
        {events.length === 0 ? (
          <div className="col-span-full py-20 text-center border-4 border-dashed border-slate-100 rounded-[50px] bg-slate-50/30">
            <Calendar className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest">{pageConfig.emptyText}</p>
          </div>
        ) : (
          events.map((event) => (
            <div key={event.id} className="bg-white border border-slate-200 rounded-[40px] p-8 hover:shadow-2xl hover:-translate-y-2 transition-all group flex flex-col justify-between relative overflow-hidden backdrop-blur-3xl">
               <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50 rounded-bl-[100px] transition-all group-hover:scale-125" />
               <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                     <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                        <Calendar className="w-6 h-6" />
                     </div>
                     <div className="flex gap-2">
                        <button onClick={() => deleteEvent(event.id)} className="w-10 h-10 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-rose-500 transition-colors shadow-sm flex items-center justify-center">
                           <Trash2 className="w-4 h-4" />
                        </button>
                     </div>
                  </div>

                  <div>
                     <span className="text-[10px] font-black uppercase tracking-widest text-rose-500 mb-2 block">
                        {new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })}
                     </span>
                     <h3 className="text-xl font-black text-slate-900 leading-tight group-hover:text-rose-600 transition-colors">{event.title}</h3>
                  </div>

                  <div className="space-y-3">
                     <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                        <Clock className="w-4 h-4 text-slate-300" />
                        {new Date(event.date).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })}
                     </div>
                     <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                        <MapPin className="w-4 h-4 text-slate-300" />
                        <span className="line-clamp-1">{event.location || (event.isVirtual ? "Virtual Event" : "Location TBD")}</span>
                     </div>
                     <div className="flex items-center gap-3 text-slate-500 text-sm font-medium">
                        <Users className="w-4 h-4 text-slate-300" />
                        {event.currentRSVP} / {event.maxAttendees || "Unlimited"} Joined
                     </div>
                  </div>
               </div>

               <div className="pt-8 mt-4 flex items-center gap-4 relative z-10">
                  <button className="flex-1 bg-black text-white py-3 rounded-2xl font-black text-[12px] uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2">
                     <Share2 className="w-3.5 h-3.5" /> Share Page
                  </button>
                  <button className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 hover:text-rose-600 transition-all">
                     <ExternalLink className="w-5 h-5" />
                  </button>
               </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
