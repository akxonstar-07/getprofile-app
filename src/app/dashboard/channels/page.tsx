"use client";
import { useState, useEffect } from "react";
import { MessageSquare, Phone, Send, Loader2, Check, X, Plus, Trash2, Bot, Wifi, WifiOff, Globe, Settings2 } from "lucide-react";
import { toast } from "sonner";

interface Channel { id: string; type: string; name: string | null; isActive: boolean; waPhoneNumber?: string; waVerified?: boolean; tgBotUsername?: string; tgBotToken?: string; welcomeMessage?: string; autoReplyTemplates?: string; broadcastEnabled?: boolean; }

export default function ChannelsPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [waForm, setWaForm] = useState({ name: "WhatsApp Business", waPhoneNumber: "", waBusinessId: "", waApiToken: "", welcomeMessage: "" });
  const [tgForm, setTgForm] = useState({ name: "Telegram Bot", tgBotToken: "", tgBotUsername: "", welcomeMessage: "" });
  const [showWaSetup, setShowWaSetup] = useState(false);
  const [showTgSetup, setShowTgSetup] = useState(false);
  const [templates, setTemplates] = useState<{ trigger: string; response: string }[]>([]);
  const [newTemplate, setNewTemplate] = useState({ trigger: "", response: "" });

  useEffect(() => { fetchChannels(); }, []);

  async function fetchChannels() {
    try {
      const res = await fetch("/api/channels");
      const data = await res.json();
      setChannels(data.channels || []);
      const wa = data.channels?.find((c: Channel) => c.type === "whatsapp");
      const tg = data.channels?.find((c: Channel) => c.type === "telegram");
      if (wa) { setWaForm({ name: wa.name || "", waPhoneNumber: wa.waPhoneNumber || "", waBusinessId: "", waApiToken: "", welcomeMessage: wa.welcomeMessage || "" }); setTemplates(JSON.parse(wa.autoReplyTemplates || "[]")); }
      if (tg) { setTgForm({ name: tg.name || "", tgBotToken: tg.tgBotToken || "", tgBotUsername: tg.tgBotUsername || "", welcomeMessage: tg.welcomeMessage || "" }); }
    } catch {} finally { setLoading(false); }
  }

  async function saveChannel(type: "whatsapp" | "telegram") {
    setSaving(type);
    try {
      const body = type === "whatsapp"
        ? { type, ...waForm, isActive: true, autoReplyTemplates: templates }
        : { type, ...tgForm, isActive: true };
      await fetch("/api/channels", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      toast.success(`${type === "whatsapp" ? "WhatsApp" : "Telegram"} saved!`);
      fetchChannels();
      if (type === "whatsapp") setShowWaSetup(false);
      if (type === "telegram") setShowTgSetup(false);
    } catch { toast.error("Failed to save"); }
    finally { setSaving(null); }
  }

  async function deleteChannel(type: string) {
    await fetch(`/api/channels?type=${type}`, { method: "DELETE" });
    toast.success("Channel removed");
    fetchChannels();
  }

  const waChannel = channels.find(c => c.type === "whatsapp");
  const tgChannel = channels.find(c => c.type === "telegram");

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-emerald-500" /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-emerald-100 rounded-2xl flex items-center justify-center"><MessageSquare className="w-5 h-5 text-emerald-600" /></div>
          <h1 className="text-2xl font-black text-slate-900">Channels</h1>
          <span className="text-[9px] font-black uppercase tracking-widest bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">MAX</span>
        </div>
        <p className="text-sm text-slate-500 ml-[52px]">Connect WhatsApp Business and Telegram to automate messaging across channels.</p>
      </div>

      {/* ═══ WHATSAPP CARD ═══ */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-6 flex items-center gap-5">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0"><Phone className="w-7 h-7" /></div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">WhatsApp Business</h3>
              {waChannel?.isActive && <span className="text-[9px] font-black uppercase bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Wifi className="w-3 h-3" /> Active</span>}
            </div>
            {waChannel ? (
              <p className="text-sm text-slate-500 mt-0.5">{waChannel.waPhoneNumber || "Configured"} • Auto-replies {waChannel.isActive ? "enabled" : "disabled"}</p>
            ) : (
              <p className="text-xs text-slate-500 mt-0.5">Send auto-replies, order notifications, and broadcasts to your customers via WhatsApp.</p>
            )}
          </div>
          <div className="flex gap-2">
            {waChannel && <button onClick={() => deleteChannel("whatsapp")} className="p-2.5 hover:bg-rose-50 rounded-xl"><Trash2 className="w-4 h-4 text-rose-400" /></button>}
            <button onClick={() => setShowWaSetup(!showWaSetup)} className="px-5 py-2.5 text-xs font-bold rounded-xl transition-colors bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm">
              <Settings2 className="w-3.5 h-3.5 inline mr-1" /> {waChannel ? "Configure" : "Setup"}
            </button>
          </div>
        </div>
        {showWaSetup && (
          <div className="border-t border-slate-100 bg-slate-50 p-6 space-y-4 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Phone Number</label>
                <input value={waForm.waPhoneNumber} onChange={e => setWaForm(p => ({ ...p, waPhoneNumber: e.target.value }))} placeholder="+91 9876543210" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Business Account ID</label>
                <input value={waForm.waBusinessId} onChange={e => setWaForm(p => ({ ...p, waBusinessId: e.target.value }))} placeholder="From Meta Business Suite" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            </div>
            <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Cloud API Token</label>
              <input value={waForm.waApiToken} onChange={e => setWaForm(p => ({ ...p, waApiToken: e.target.value }))} placeholder="Bearer token from WhatsApp Cloud API" type="password" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-emerald-500" /></div>
            <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Welcome Message</label>
              <textarea value={waForm.welcomeMessage} onChange={e => setWaForm(p => ({ ...p, welcomeMessage: e.target.value }))} rows={2} placeholder="Hi! 👋 Thanks for reaching out..." className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none" /></div>

            {/* Auto-Reply Templates */}
            <div>
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Auto-Reply Rules</label>
              {templates.map((t, i) => (
                <div key={i} className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">If &quot;{t.trigger}&quot;</span>
                  <span className="text-xs text-slate-400">→</span>
                  <span className="text-xs text-slate-700 flex-1 truncate">{t.response}</span>
                  <button onClick={() => setTemplates(templates.filter((_, j) => j !== i))} className="p-1 hover:bg-rose-50 rounded"><X className="w-3 h-3 text-rose-400" /></button>
                </div>
              ))}
              <div className="flex gap-2">
                <input value={newTemplate.trigger} onChange={e => setNewTemplate(p => ({ ...p, trigger: e.target.value }))} placeholder="Trigger word" className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <input value={newTemplate.response} onChange={e => setNewTemplate(p => ({ ...p, response: e.target.value }))} placeholder="Reply message" className="flex-[2] border border-slate-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500" />
                <button onClick={() => { if (newTemplate.trigger && newTemplate.response) { setTemplates([...templates, newTemplate]); setNewTemplate({ trigger: "", response: "" }); } }} className="px-3 bg-emerald-100 text-emerald-700 rounded-xl text-xs font-bold hover:bg-emerald-200"><Plus className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <button onClick={() => saveChannel("whatsapp")} disabled={saving === "whatsapp"} className="w-full py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving === "whatsapp" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save WhatsApp Configuration
            </button>
          </div>
        )}
      </div>

      {/* ═══ TELEGRAM CARD ═══ */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
        <div className="p-6 flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0"><Send className="w-7 h-7" /></div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">Telegram Bot</h3>
              {tgChannel?.isActive && <span className="text-[9px] font-black uppercase bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1"><Wifi className="w-3 h-3" /> Active</span>}
            </div>
            {tgChannel ? (
              <p className="text-sm text-slate-500 mt-0.5">@{tgChannel.tgBotUsername || "bot"} • Connected</p>
            ) : (
              <p className="text-xs text-slate-500 mt-0.5">Connect a Telegram bot for auto-replies and subscriber broadcasts.</p>
            )}
          </div>
          <div className="flex gap-2">
            {tgChannel && <button onClick={() => deleteChannel("telegram")} className="p-2.5 hover:bg-rose-50 rounded-xl"><Trash2 className="w-4 h-4 text-rose-400" /></button>}
            <button onClick={() => setShowTgSetup(!showTgSetup)} className="px-5 py-2.5 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm">
              <Bot className="w-3.5 h-3.5 inline mr-1" /> {tgChannel ? "Configure" : "Setup"}
            </button>
          </div>
        </div>
        {showTgSetup && (
          <div className="border-t border-slate-100 bg-slate-50 p-6 space-y-4 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-4">
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Bot Token</label>
                <input value={tgForm.tgBotToken} onChange={e => setTgForm(p => ({ ...p, tgBotToken: e.target.value }))} placeholder="From @BotFather" type="password" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
              <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Bot Username</label>
                <input value={tgForm.tgBotUsername} onChange={e => setTgForm(p => ({ ...p, tgBotUsername: e.target.value }))} placeholder="@YourBotName" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500" /></div>
            </div>
            <div><label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block">Welcome Message</label>
              <textarea value={tgForm.welcomeMessage} onChange={e => setTgForm(p => ({ ...p, welcomeMessage: e.target.value }))} rows={2} placeholder="Welcome! 🤖 How can I help?" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" /></div>
            <button onClick={() => saveChannel("telegram")} disabled={saving === "telegram"} className="w-full py-3 bg-blue-600 text-white text-sm font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2">
              {saving === "telegram" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />} Save Telegram Configuration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
