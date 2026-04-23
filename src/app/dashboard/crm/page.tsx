"use client";
import { useState, useEffect } from "react";
import { Users, Plus, Loader2, Trash2, Phone, Mail, MessageSquare, ArrowRight, Flame, Thermometer, Snowflake, GripVertical, Search, Filter, Tag, DollarSign, Clock, X, ChevronRight, Edit3, Check } from "lucide-react";
import { toast } from "sonner";

interface Lead { id: string; name: string; email: string | null; phone: string | null; source: string; stage: string; temperature: string; value: number | null; tags: string; notes: string | null; lastContactAt: string | null; createdAt: string; _count?: { activities: number }; }
interface Activity { id: string; type: string; content: string; createdAt: string; }

const STAGES = [
  { id: "new", label: "New", color: "bg-blue-500", bg: "bg-blue-50 border-blue-200" },
  { id: "contacted", label: "Contacted", color: "bg-amber-500", bg: "bg-amber-50 border-amber-200" },
  { id: "qualified", label: "Qualified", color: "bg-violet-500", bg: "bg-violet-50 border-violet-200" },
  { id: "won", label: "Won", color: "bg-emerald-500", bg: "bg-emerald-50 border-emerald-200" },
  { id: "lost", label: "Lost", color: "bg-slate-400", bg: "bg-slate-50 border-slate-200" },
];

const SOURCES = ["manual", "dm_automation", "ai_assistant", "form", "whatsapp", "import"];
const TEMPS: { id: string; label: string; icon: any; color: string }[] = [
  { id: "hot", label: "Hot", icon: Flame, color: "text-rose-500 bg-rose-50" },
  { id: "warm", label: "Warm", icon: Thermometer, color: "text-amber-500 bg-amber-50" },
  { id: "cold", label: "Cold", icon: Snowflake, color: "text-blue-500 bg-blue-50" },
];

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStage, setFilterStage] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [newNote, setNewNote] = useState("");
  const [newLead, setNewLead] = useState({ name: "", email: "", phone: "", source: "manual", temperature: "warm", value: "", notes: "" });
  const [stats, setStats] = useState<any[]>([]);

  useEffect(() => { fetchLeads(); }, []);

  async function fetchLeads() {
    try {
      const res = await fetch("/api/crm");
      const data = await res.json();
      setLeads(data.leads || []);
      setStats(data.stats || []);
    } catch {} finally { setLoading(false); }
  }

  async function createLead() {
    if (!newLead.name) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      await fetch("/api/crm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newLead) });
      toast.success("Lead added!");
      setShowNew(false);
      setNewLead({ name: "", email: "", phone: "", source: "manual", temperature: "warm", value: "", notes: "" });
      fetchLeads();
    } catch { toast.error("Failed"); } finally { setSaving(false); }
  }

  async function moveStage(leadId: string, newStage: string) {
    await fetch("/api/crm", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: leadId, stage: newStage }) });
    fetchLeads();
    if (selectedLead?.id === leadId) fetchDetail(leadId);
  }

  async function deleteLead(id: string) {
    await fetch(`/api/crm?id=${id}`, { method: "DELETE" });
    toast.success("Lead removed");
    if (selectedLead?.id === id) setSelectedLead(null);
    fetchLeads();
  }

  async function fetchDetail(id: string) {
    setLoadingDetail(true);
    try {
      const res = await fetch(`/api/crm?id=${id}`);
      const data = await res.json();
      if (data.lead) { setSelectedLead(data.lead); setActivities(data.lead.activities || []); }
    } catch {} finally { setLoadingDetail(false); }
  }

  async function addNote() {
    if (!newNote || !selectedLead) return;
    await fetch("/api/crm", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add_activity", leadId: selectedLead.id, activityType: "note", content: newNote }) });
    setNewNote("");
    fetchDetail(selectedLead.id);
  }

  const filtered = leads.filter(l => {
    if (search && !l.name.toLowerCase().includes(search.toLowerCase()) && !l.email?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filterStage && l.stage !== filterStage) return false;
    return true;
  });

  const getStageLeads = (stage: string) => filtered.filter(l => l.stage === stage);
  const temp = TEMPS.find(t => t.id === (selectedLead?.temperature || "warm"));

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-indigo-500" /></div>;

  return (
    <div className="flex h-full gap-0 -m-6 sm:-m-10">
      {/* LEFT: Kanban Board */}
      <div className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center"><Users className="w-5 h-5 text-indigo-600" /></div>
              <h1 className="text-2xl font-black text-slate-900">CRM Pipeline</h1>
              <span className="text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">MAX</span>
            </div>
          </div>
          <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-600/20">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>

        {/* Search + Filter */}
        <div className="flex gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..." className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
            <button onClick={() => setFilterStage(null)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${!filterStage ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>All</button>
            {STAGES.map(s => (
              <button key={s.id} onClick={() => setFilterStage(filterStage === s.id ? null : s.id)} className={`px-3 py-1.5 rounded-lg text-[10px] font-bold ${filterStage === s.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>{s.label}</button>
            ))}
          </div>
        </div>

        {/* New Lead Form */}
        {showNew && (
          <div className="bg-white border border-indigo-200 rounded-2xl p-5 mb-5 space-y-4 animate-in slide-in-from-top-2">
            <h3 className="text-sm font-black text-slate-900">Add New Lead</h3>
            <div className="grid grid-cols-3 gap-3">
              <input value={newLead.name} onChange={e => setNewLead(p => ({ ...p, name: e.target.value }))} placeholder="Full Name *" className="border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input value={newLead.email} onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))} placeholder="Email" className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <input value={newLead.phone} onChange={e => setNewLead(p => ({ ...p, phone: e.target.value }))} placeholder="Phone" className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div className="flex gap-3">
              <select value={newLead.source} onChange={e => setNewLead(p => ({ ...p, source: e.target.value }))} className="border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500">
                {SOURCES.map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
              </select>
              <div className="flex gap-1 bg-slate-100 p-1 rounded-xl">
                {TEMPS.map(t => (
                  <button key={t.id} onClick={() => setNewLead(p => ({ ...p, temperature: t.id }))} className={`px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 ${newLead.temperature === t.id ? t.color + " shadow-sm" : "text-slate-500"}`}>
                    <t.icon className="w-3 h-3" /> {t.label}
                  </button>
                ))}
              </div>
              <input value={newLead.value} onChange={e => setNewLead(p => ({ ...p, value: e.target.value }))} placeholder="Deal Value $" type="number" className="w-32 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
            </div>
            <button onClick={createLead} disabled={saving} className="px-6 py-3 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 disabled:opacity-50 flex items-center gap-2">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Lead
            </button>
          </div>
        )}

        {/* Pipeline Stats */}
        <div className="grid grid-cols-5 gap-2 mb-5">
          {STAGES.map(s => {
            const count = getStageLeads(s.id).length;
            const stat = stats.find((st: any) => st.stage === s.id);
            return (
              <div key={s.id} className={`p-3 rounded-xl border ${s.bg} text-center`}>
                <div className="text-lg font-black text-slate-900">{count}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-500">{s.label}</div>
                {stat?._sum?.value ? <div className="text-[10px] font-bold text-emerald-600 mt-0.5">${stat._sum.value.toLocaleString()}</div> : null}
              </div>
            );
          })}
        </div>

        {/* Kanban Columns */}
        <div className="grid grid-cols-5 gap-3">
          {STAGES.map(stage => (
            <div key={stage.id} className="space-y-2">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${stage.color}`} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{stage.label}</span>
                <span className="text-[9px] font-bold text-slate-400 ml-auto">{getStageLeads(stage.id).length}</span>
              </div>
              {getStageLeads(stage.id).map(lead => {
                const t = TEMPS.find(x => x.id === lead.temperature);
                return (
                  <div key={lead.id} onClick={() => fetchDetail(lead.id)}
                    className={`bg-white border rounded-xl p-3 cursor-pointer hover:shadow-md transition-all group ${selectedLead?.id === lead.id ? "border-indigo-400 ring-1 ring-indigo-400" : "border-slate-200 hover:border-slate-300"}`}>
                    <div className="flex items-start justify-between mb-1">
                      <h4 className="text-xs font-bold text-slate-900 truncate flex-1">{lead.name}</h4>
                      {t && <t.icon className={`w-3 h-3 flex-shrink-0 ${t.color.split(" ")[0]}`} />}
                    </div>
                    {lead.email && <p className="text-[10px] text-slate-400 truncate">{lead.email}</p>}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-[9px] font-bold text-slate-400 capitalize">{lead.source.replace("_", " ")}</span>
                      {lead.value && <span className="text-[10px] font-bold text-emerald-600">${lead.value}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT: Lead Detail Drawer */}
      {selectedLead && (
        <div className="w-[360px] bg-white border-l border-slate-200 flex flex-col h-full flex-shrink-0 animate-in slide-in-from-right-4">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="text-sm font-black text-slate-900">{selectedLead.name}</h3>
            <button onClick={() => setSelectedLead(null)} className="p-1.5 hover:bg-slate-100 rounded-lg"><X className="w-4 h-4 text-slate-400" /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {/* Contact Info */}
            <div className="space-y-2">
              {selectedLead.email && <div className="flex items-center gap-2 text-xs"><Mail className="w-3.5 h-3.5 text-slate-400" /> <span className="text-slate-700">{selectedLead.email}</span></div>}
              {selectedLead.phone && <div className="flex items-center gap-2 text-xs"><Phone className="w-3.5 h-3.5 text-slate-400" /> <span className="text-slate-700">{selectedLead.phone}</span></div>}
              <div className="flex items-center gap-2 text-xs"><Tag className="w-3.5 h-3.5 text-slate-400" /> <span className="text-slate-700 capitalize">{selectedLead.source.replace("_", " ")}</span></div>
              {selectedLead.value && <div className="flex items-center gap-2 text-xs"><DollarSign className="w-3.5 h-3.5 text-emerald-500" /> <span className="font-bold text-emerald-600">${selectedLead.value}</span></div>}
            </div>

            {/* Stage Selector */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Move Stage</label>
              <div className="flex gap-1">
                {STAGES.filter(s => s.id !== "lost").map(s => (
                  <button key={s.id} onClick={() => moveStage(selectedLead.id, s.id)}
                    className={`flex-1 py-2 rounded-lg text-[10px] font-bold transition-all ${selectedLead.stage === s.id ? s.color + " text-white" : "bg-slate-100 text-slate-500 hover:bg-slate-200"}`}>
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2">
              {selectedLead.phone && <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-[10px] font-bold hover:bg-emerald-100"><Phone className="w-3 h-3" /> Call</button>}
              {selectedLead.email && <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-blue-50 text-blue-700 rounded-xl text-[10px] font-bold hover:bg-blue-100"><Mail className="w-3 h-3" /> Email</button>}
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-50 text-green-700 rounded-xl text-[10px] font-bold hover:bg-green-100"><MessageSquare className="w-3 h-3" /> WhatsApp</button>
              <button onClick={() => deleteLead(selectedLead.id)} className="p-2 hover:bg-rose-50 rounded-xl"><Trash2 className="w-3.5 h-3.5 text-rose-400" /></button>
            </div>

            {/* Activity Timeline */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Activity</label>
              <div className="flex gap-2 mb-3">
                <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add a note..." className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500" onKeyDown={e => e.key === "Enter" && addNote()} />
                <button onClick={addNote} className="px-3 bg-indigo-600 text-white rounded-xl text-xs font-bold"><Plus className="w-3.5 h-3.5" /></button>
              </div>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {activities.map(a => (
                  <div key={a.id} className="flex gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${a.type === "stage_change" ? "bg-violet-500" : a.type === "note" ? "bg-slate-400" : "bg-blue-400"}`} />
                    <div>
                      <p className="text-[11px] text-slate-700">{a.content}</p>
                      <p className="text-[9px] text-slate-400">{new Date(a.createdAt).toLocaleDateString()} • {a.type.replace("_", " ")}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
