"use client";
import { useState, useEffect } from "react";
import {
  MessageCircle, Zap, BarChart3, Plus, Loader2, Trash2, Pause, Play, Settings2,
  Camera, Globe2, Send, Mail, UserCheck, Link2, Hash, ArrowRight, Eye,
  MousePointerClick, ShoppingCart, ChevronDown, ChevronRight, Globe, Sparkles, 
  MessageSquare, GitBranch, Target, TrendingUp, X, Check, Copy
} from "lucide-react";
import { toast } from "sonner";

type Tab = "campaigns" | "flows" | "triggers" | "analytics";
type Campaign = any;
type Flow = any;
type Trigger = any;

const TRIGGER_TYPES = [
  { id: "comment", label: "Post/Reel Comment", icon: MessageCircle, desc: "When someone comments on your post or reel" },
  { id: "story_reply", label: "Story Reply", icon: MessageSquare, desc: "When someone replies to your story" },
  { id: "story_mention", label: "Story Mention", icon: Target, desc: "When someone mentions you in their story" },
  { id: "dm_keyword", label: "DM Keyword", icon: Hash, desc: "When someone DMs you a specific keyword" },
  { id: "live_comment", label: "Live Comment", icon: Zap, desc: "During Instagram Live sessions" },
];

const TEMPLATES = [
  { name: "Product Link", msg: "Hey! 👋 Thanks for your interest! Here's the link you requested: {link}", cta: "Get It Now" },
  { name: "Lead Magnet", msg: "Awesome! 🎉 Here's your free guide. Drop your email below to get instant access!", cta: "Download Free" },
  { name: "Giveaway", msg: "You're entered! 🎁 Make sure you're following us to qualify. Winner announced Friday!", cta: "View Details" },
  { name: "Booking", msg: "Thanks for reaching out! 📅 Book your session using the link below:", cta: "Book Now" },
];

export default function AutomationsPage() {
  const [tab, setTab] = useState<Tab>("campaigns");
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [flows, setFlows] = useState<Flow[]>([]);
  const [triggers, setTriggers] = useState<Trigger[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNew, setShowNew] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: "", triggerType: "comment", keywords: ["LINK"], dmMessage: "", dmButtonUrl: "", commentReply: "Check your DMs! 📩", followGated: false, collectEmail: false });
  const [newTrigger, setNewTrigger] = useState({ keyword: "", response: "", linkUrl: "" });
  const [saving, setSaving] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => { fetchData(); }, [tab]);

  async function fetchData() {
    setLoading(true);
    try {
      const t = tab === "analytics" ? "logs" : tab;
      const res = await fetch(`/api/automations?type=${t}`);
      const data = await res.json();
      if (tab === "campaigns") setCampaigns(data.campaigns || []);
      if (tab === "flows") setFlows(data.flows || []);
      if (tab === "triggers") setTriggers(data.triggers || []);
    } catch {} finally { setLoading(false); }
  }

  async function createCampaign() {
    if (!newCampaign.name || !newCampaign.dmMessage) { toast.error("Name and DM message required"); return; }
    setSaving(true);
    try {
      await fetch("/api/automations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "campaign", ...newCampaign, keywords: newCampaign.keywords }) });
      toast.success("Campaign created!");
      setShowNew(false);
      setNewCampaign({ name: "", triggerType: "comment", keywords: ["LINK"], dmMessage: "", dmButtonUrl: "", commentReply: "Check your DMs! 📩", followGated: false, collectEmail: false });
      fetchData();
    } catch { toast.error("Failed"); } finally { setSaving(false); }
  }

  async function createTrigger() {
    if (!newTrigger.keyword || !newTrigger.response) { toast.error("Keyword and response required"); return; }
    setSaving(true);
    try {
      await fetch("/api/automations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "trigger", ...newTrigger }) });
      toast.success("Trigger created!");
      setNewTrigger({ keyword: "", response: "", linkUrl: "" });
      fetchData();
    } catch { toast.error("Failed"); } finally { setSaving(false); }
  }

  async function toggleCampaign(id: string, isPaused: boolean) {
    await fetch("/api/automations", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "campaign", id, isPaused: !isPaused }) });
    fetchData();
  }

  async function deleteCampaign(id: string) {
    await fetch(`/api/automations?type=campaign&id=${id}`, { method: "DELETE" });
    toast.success("Deleted");
    fetchData();
  }

  async function deleteTrigger(id: string) {
    await fetch(`/api/automations?type=trigger&id=${id}`, { method: "DELETE" });
    toast.success("Deleted");
    fetchData();
  }

  // Mock analytics data
  const mockStats = { sent: 1247, opened: 983, clicked: 412, purchased: 67, emails: 189 };
  const convRate = ((mockStats.purchased / mockStats.sent) * 100).toFixed(1);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "campaigns", label: "Campaigns", icon: Zap },
    { id: "flows", label: "Flows", icon: GitBranch },
    { id: "triggers", label: "Global Triggers", icon: Hash },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-violet-100 rounded-2xl flex items-center justify-center"><MessageCircle className="w-5 h-5 text-violet-600" /></div>
            <h1 className="text-2xl font-black text-slate-900">DM Automation</h1>
            <span className="text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">MAX</span>
          </div>
          <p className="text-sm text-slate-500 ml-[52px]">Turn comments and keywords into instant DMs. Clone of ManyChat + ReplyRush.</p>
        </div>
        {tab === "campaigns" && (
          <button onClick={() => setShowNew(!showNew)} className="flex items-center gap-2 px-5 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-xl hover:bg-violet-700 transition-colors shadow-lg shadow-violet-600/20">
            <Plus className="w-4 h-4" /> New Campaign
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl">
        {tabs.map(t => (
          <button key={t.id} onClick={() => { setTab(t.id); setShowNew(false); }}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* New Campaign Form */}
      {showNew && tab === "campaigns" && (
        <div className="bg-white border border-violet-200 rounded-2xl p-6 space-y-5 shadow-sm animate-in slide-in-from-top-2">
          <h3 className="text-sm font-black text-slate-900">Create New Campaign</h3>
          <input value={newCampaign.name} onChange={e => setNewCampaign(p => ({ ...p, name: e.target.value }))} placeholder="Campaign name (e.g. 'Free Guide Delivery')" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-500" />

          {/* Trigger Type */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Trigger Type</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {TRIGGER_TYPES.map(t => (
                <button key={t.id} onClick={() => setNewCampaign(p => ({ ...p, triggerType: t.id }))}
                  className={`p-3 rounded-xl border text-left transition-all ${newCampaign.triggerType === t.id ? "border-violet-400 bg-violet-50 ring-1 ring-violet-400" : "border-slate-200 hover:border-slate-300"}`}>
                  <t.icon className={`w-4 h-4 mb-1 ${newCampaign.triggerType === t.id ? "text-violet-600" : "text-slate-400"}`} />
                  <div className="text-[11px] font-bold text-slate-800">{t.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Keywords */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Keywords (comma separated)</label>
            <input value={newCampaign.keywords.join(", ")} onChange={e => setNewCampaign(p => ({ ...p, keywords: e.target.value.split(",").map(k => k.trim()).filter(Boolean) }))} placeholder="LINK, INFO, PRICE" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-500" />
          </div>

          {/* Templates */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Quick Templates</label>
            <div className="flex gap-2 flex-wrap">
              {TEMPLATES.map(t => (
                <button key={t.name} onClick={() => setNewCampaign(p => ({ ...p, dmMessage: t.msg, dmButtonUrl: p.dmButtonUrl || "https://getprofile.link/yourpage" }))}
                  className="px-3 py-1.5 text-[10px] font-bold border border-slate-200 rounded-lg hover:bg-violet-50 hover:border-violet-300 transition-colors">
                  {t.name}
                </button>
              ))}
            </div>
          </div>

          {/* DM Message */}
          <div>
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">DM Message</label>
            <textarea value={newCampaign.dmMessage} onChange={e => setNewCampaign(p => ({ ...p, dmMessage: e.target.value }))} rows={3} placeholder="Hey! 👋 Thanks for commenting. Here's the link..." className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-none" />
          </div>

          {/* Button URL */}
          <input value={newCampaign.dmButtonUrl} onChange={e => setNewCampaign(p => ({ ...p, dmButtonUrl: e.target.value }))} placeholder="Link to deliver (e.g. https://getprofile.link/you)" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-500" />

          {/* Comment Reply */}
          <input value={newCampaign.commentReply} onChange={e => setNewCampaign(p => ({ ...p, commentReply: e.target.value }))} placeholder="Public comment reply (e.g. Check your DMs! 📩)" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-500" />

          {/* Toggles */}
          <div className="flex flex-wrap gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newCampaign.followGated} onChange={e => setNewCampaign(p => ({ ...p, followGated: e.target.checked }))} className="rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1"><UserCheck className="w-3.5 h-3.5 text-violet-500" /> Follow-Gated DM</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newCampaign.collectEmail} onChange={e => setNewCampaign(p => ({ ...p, collectEmail: e.target.checked }))} className="rounded border-slate-300 text-violet-600 focus:ring-violet-500" />
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-violet-500" /> Collect Email First</span>
            </label>
          </div>

          <button onClick={createCampaign} disabled={saving} className="w-full py-3 bg-violet-600 text-white text-sm font-bold rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
            {saving ? "Creating..." : "Launch Campaign"}
          </button>
        </div>
      )}

      {/* Loading */}
      {loading && <div className="flex justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-violet-500" /></div>}

      {/* === CAMPAIGNS TAB === */}
      {!loading && tab === "campaigns" && (
        <div className="space-y-3">
          {campaigns.length === 0 && !showNew ? (
            <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-2xl">
              <MessageCircle className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">No campaigns yet</h3>
              <p className="text-sm text-slate-500 mb-4">Create your first DM automation campaign to start converting comments into customers.</p>
              <button onClick={() => setShowNew(true)} className="px-6 py-2.5 bg-violet-600 text-white text-xs font-bold rounded-xl"><Plus className="w-3.5 h-3.5 inline mr-1" /> Create Campaign</button>
            </div>
          ) : campaigns.map(c => (
            <div key={c.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:border-slate-300 transition-all">
              <div className="p-5 flex items-center gap-4 cursor-pointer" onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.isPaused ? "bg-slate-100" : "bg-violet-100"}`}>
                  {c.platform === "facebook" ? <Globe2 className="w-5 h-5 text-blue-600" /> : <Camera className="w-5 h-5 text-violet-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-bold text-slate-900 truncate">{c.name}</h3>
                    <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded-full ${c.isPaused ? "bg-slate-100 text-slate-500" : "bg-emerald-100 text-emerald-700"}`}>
                      {c.isPaused ? "Paused" : "Active"}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {TRIGGER_TYPES.find(t => t.id === c.triggerType)?.label} • Keywords: {JSON.parse(c.keywords || "[]").join(", ") || "Any"}
                  </p>
                </div>
                <div className="flex items-center gap-6 text-center flex-shrink-0">
                  <div><div className="text-sm font-black text-slate-900">{c.totalSent}</div><div className="text-[9px] text-slate-400 uppercase">Sent</div></div>
                  <div><div className="text-sm font-black text-emerald-600">{c.totalClicked}</div><div className="text-[9px] text-slate-400 uppercase">Clicks</div></div>
                  <div><div className="text-sm font-black text-violet-600">{c.totalPurchased}</div><div className="text-[9px] text-slate-400 uppercase">Sales</div></div>
                </div>
                <div className="flex gap-1">
                  <button onClick={e => { e.stopPropagation(); toggleCampaign(c.id, c.isPaused); }} className="p-2 hover:bg-slate-100 rounded-lg">
                    {c.isPaused ? <Play className="w-4 h-4 text-emerald-500" /> : <Pause className="w-4 h-4 text-amber-500" />}
                  </button>
                  <button onClick={e => { e.stopPropagation(); deleteCampaign(c.id); }} className="p-2 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4 text-rose-400" /></button>
                </div>
                {expandedId === c.id ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
              </div>
              {expandedId === c.id && (
                <div className="border-t border-slate-100 bg-slate-50 p-5 space-y-3 animate-in slide-in-from-top-1">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-3 rounded-xl border border-slate-100"><div className="text-[9px] font-black uppercase text-slate-400 mb-1">DM Message</div><p className="text-xs text-slate-700">{c.dmMessage}</p></div>
                    <div className="bg-white p-3 rounded-xl border border-slate-100"><div className="text-[9px] font-black uppercase text-slate-400 mb-1">Comment Reply</div><p className="text-xs text-slate-700">{c.commentReply || "—"}</p></div>
                  </div>
                  <div className="flex gap-3 text-[10px] font-bold">
                    {c.followGated && <span className="bg-violet-50 text-violet-700 px-2 py-1 rounded-lg flex items-center gap-1"><UserCheck className="w-3 h-3" /> Follow-Gated</span>}
                    {c.collectEmail && <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg flex items-center gap-1"><Mail className="w-3 h-3" /> Email Collection</span>}
                    {c.dmButtonUrl && <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-lg flex items-center gap-1"><Link2 className="w-3 h-3" /> {c.dmButtonUrl}</span>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* === FLOWS TAB === */}
      {!loading && tab === "flows" && (
        <div className="text-center py-20 bg-white border border-dashed border-slate-300 rounded-2xl">
          <GitBranch className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-1">Visual Flow Builder</h3>
          <p className="text-sm text-slate-500 mb-2 max-w-md mx-auto">Build multi-step DM conversations with conditions, questions, delays, and email collection.</p>
          <span className="text-[10px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-3 py-1 rounded-full">Coming in Phase 8.1</span>
        </div>
      )}

      {/* === GLOBAL TRIGGERS TAB === */}
      {!loading && tab === "triggers" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-slate-900">Add Global Trigger</h3>
            <p className="text-xs text-slate-500">Create reusable keyword triggers that work across all your posts automatically.</p>
            <div className="grid grid-cols-3 gap-3">
              <input value={newTrigger.keyword} onChange={e => setNewTrigger(p => ({ ...p, keyword: e.target.value }))} placeholder="Keyword (e.g. LINK)" className="border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-500" />
              <input value={newTrigger.response} onChange={e => setNewTrigger(p => ({ ...p, response: e.target.value }))} placeholder="Auto-reply message" className="border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              <div className="flex gap-2">
                <input value={newTrigger.linkUrl} onChange={e => setNewTrigger(p => ({ ...p, linkUrl: e.target.value }))} placeholder="Link URL" className="flex-1 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
                <button onClick={createTrigger} disabled={saving} className="px-4 bg-violet-600 text-white rounded-xl text-xs font-bold hover:bg-violet-700 disabled:opacity-50 flex-shrink-0">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
          {triggers.length === 0 ? (
            <div className="text-center py-12 text-sm text-slate-400">No global triggers yet</div>
          ) : triggers.map(t => (
            <div key={t.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4">
              <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center"><Hash className="w-4 h-4 text-violet-600" /></div>
              <div className="flex-1 min-w-0">
                <span className="text-sm font-bold text-violet-600">#{t.keyword}</span>
                <p className="text-xs text-slate-500 truncate">{t.response}</p>
              </div>
              <span className="text-xs text-slate-400">{t.usageCount} uses</span>
              <button onClick={() => deleteTrigger(t.id)} className="p-2 hover:bg-rose-50 rounded-lg"><Trash2 className="w-4 h-4 text-rose-400" /></button>
            </div>
          ))}
        </div>
      )}

      {/* === ANALYTICS TAB === */}
      {!loading && tab === "analytics" && (
        <div className="space-y-4">
          <div className="grid grid-cols-5 gap-3">
            {[
              { label: "DMs Sent", value: mockStats.sent, icon: Send, color: "text-violet-600 bg-violet-100" },
              { label: "Opened", value: mockStats.opened, icon: Eye, color: "text-blue-600 bg-blue-100" },
              { label: "Link Clicks", value: mockStats.clicked, icon: MousePointerClick, color: "text-emerald-600 bg-emerald-100" },
              { label: "Purchases", value: mockStats.purchased, icon: ShoppingCart, color: "text-amber-600 bg-amber-100" },
              { label: "Emails Captured", value: mockStats.emails, icon: Mail, color: "text-rose-600 bg-rose-100" },
            ].map(s => (
              <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-4 text-center">
                <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mx-auto mb-2`}><s.icon className="w-5 h-5" /></div>
                <div className="text-xl font-black text-slate-900">{s.value.toLocaleString()}</div>
                <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-6">
            <h3 className="text-sm font-black text-slate-900 mb-4">Conversion Funnel</h3>
            <div className="flex items-center justify-between">
              {[
                { label: "Comments", value: 3200, pct: "100%" },
                { label: "DMs Sent", value: mockStats.sent, pct: "39%" },
                { label: "Opened", value: mockStats.opened, pct: "79%" },
                { label: "Clicked", value: mockStats.clicked, pct: "42%" },
                { label: "Purchased", value: mockStats.purchased, pct: `${convRate}%` },
              ].map((s, i) => (
                <div key={s.label} className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-lg font-black text-slate-900">{s.value.toLocaleString()}</div>
                    <div className="text-[9px] font-bold uppercase text-slate-400">{s.label}</div>
                    <div className="text-[10px] font-bold text-violet-600 mt-0.5">{s.pct}</div>
                  </div>
                  {i < 4 && <ArrowRight className="w-4 h-4 text-slate-300" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
