"use client";
import { useState, useEffect } from "react";
import { Gem, Users, DollarSign, TrendingUp, Settings2, Loader2, Check, Plus, Gift, Tag, Unlock, Sparkles, Eye, Clock, ArrowUpRight, Zap, Crown } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_PACKS, formatCompact, getPerks, PLATFORM_FEE_PERCENT } from "@/lib/credit-helpers";

type Tab = "overview" | "settings" | "payouts";

export default function CreditsPage() {
  const [tab, setTab] = useState<Tab>("overview");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [config, setConfig] = useState<any>(null);
  const [balance, setBalance] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [eligible, setEligible] = useState(true);

  // Settings form state
  const [form, setForm] = useState({
    isEnabled: true, creditPrice: 10,
    pack1Credits: 5, pack1Price: 49,
    pack2Credits: 25, pack2Price: 199,
    pack3Credits: 100, pack3Price: 699,
    perkDiscount: 10, perkContent: false, perkEarlyAccess: false, perkCustom: "", perkMinCredits: 1,
  });

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try {
      const res = await fetch("/api/credits");
      const data = await res.json();
      setConfig(data.config);
      setBalance(data.balance);
      setPurchases(data.purchases || []);
      setEligible(data.eligible);
      if (data.config) {
        setForm({
          isEnabled: data.config.isEnabled, creditPrice: data.config.creditPrice,
          pack1Credits: data.config.pack1Credits, pack1Price: data.config.pack1Price,
          pack2Credits: data.config.pack2Credits, pack2Price: data.config.pack2Price,
          pack3Credits: data.config.pack3Credits, pack3Price: data.config.pack3Price,
          perkDiscount: data.config.perkDiscount || 10, perkContent: data.config.perkContent,
          perkEarlyAccess: data.config.perkEarlyAccess, perkCustom: data.config.perkCustom || "",
          perkMinCredits: data.config.perkMinCredits || 1,
        });
      }
    } catch {} finally { setLoading(false); }
  }

  async function saveConfig() {
    setSaving(true);
    try {
      await fetch("/api/credits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      toast.success("Credit settings saved!");
      fetchData();
    } catch { toast.error("Failed to save"); } finally { setSaving(false); }
  }

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: "overview", label: "Overview", icon: TrendingUp },
    { id: "settings", label: "Settings", icon: Settings2 },
    { id: "payouts", label: "Payouts", icon: DollarSign },
  ];

  if (loading) return <div className="flex justify-center py-32"><Loader2 className="w-8 h-8 animate-spin text-violet-500" /></div>;

  if (!eligible) return (
    <div className="max-w-2xl mx-auto py-20 text-center">
      <Crown className="w-16 h-16 text-slate-300 mx-auto mb-4" />
      <h2 className="text-xl font-black text-slate-900 mb-2">Credits Not Available</h2>
      <p className="text-sm text-slate-500">Creator Credits is designed for individual creators and personal brands. Business profiles use different monetization tools.</p>
    </div>
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-pink-500 rounded-2xl flex items-center justify-center"><Gem className="w-5 h-5 text-white" /></div>
            <h1 className="text-2xl font-black text-slate-900">Creator Credits</h1>
            <span className="text-[9px] font-black uppercase tracking-widest bg-violet-100 text-violet-700 px-2 py-0.5 rounded-full">PRO</span>
          </div>
          <p className="text-sm text-slate-500 ml-[52px]">Let supporters buy credits to unlock perks. 90% goes to you.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase px-2 py-1 rounded-full ${form.isEnabled ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            {form.isEnabled ? "Live" : "Disabled"}
          </span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "Total Credits", value: formatCompact(balance?.totalCredits || 0), icon: Gem, color: "text-violet-600 bg-violet-100", sub: "received" },
          { label: "Supporters", value: formatCompact(balance?.totalSupporters || 0), icon: Users, color: "text-pink-600 bg-pink-100", sub: "unique" },
          { label: "Revenue", value: `₹${(balance?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-emerald-600 bg-emerald-100", sub: "after 10% fee" },
          { label: "Pending", value: `₹${(balance?.pendingPayout || 0).toLocaleString()}`, icon: ArrowUpRight, color: "text-amber-600 bg-amber-100", sub: "available" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className={`w-10 h-10 ${s.color} rounded-xl flex items-center justify-center mb-3`}><s.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-black text-slate-900">{s.value}</div>
            <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-0.5">{s.label}</div>
            <div className="text-[10px] text-slate-400 mt-0.5">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 p-1 rounded-2xl">
        {tabs.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${tab === t.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* === OVERVIEW TAB === */}
      {tab === "overview" && (
        <div className="space-y-4">
          {/* Preview Card */}
          <div className="bg-gradient-to-br from-violet-50 to-pink-50 border border-violet-200 rounded-2xl p-6">
            <h3 className="text-sm font-black text-violet-900 mb-1">How it looks on your profile</h3>
            <p className="text-xs text-violet-600 mb-4">Visitors see this below your name</p>
            <div className="bg-white rounded-xl p-5 border border-violet-100 shadow-sm max-w-sm">
              <div className="flex items-center gap-4 mb-3">
                <div className="flex items-center gap-1.5"><Gem className="w-4 h-4 text-violet-600" /><span className="text-sm font-black text-slate-900">{formatCompact(balance?.totalCredits || 0)} Credits</span></div>
                <div className="flex items-center gap-1.5"><Users className="w-4 h-4 text-pink-500" /><span className="text-sm font-black text-slate-900">{formatCompact(balance?.totalSupporters || 0)} Supporters</span></div>
              </div>
              <button className="w-full py-2.5 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-xs font-black rounded-xl shadow-lg shadow-violet-600/20">Buy Credits</button>
              <p className="text-[10px] text-slate-400 text-center mt-2">Get exclusive access, discounts & perks</p>
            </div>
          </div>

          {/* Recent Supporters */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <h3 className="text-sm font-black text-slate-900 mb-4">Recent Supporters</h3>
            {purchases.length === 0 ? (
              <div className="text-center py-8">
                <Gift className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm text-slate-400">No supporters yet. Share your profile to get started!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {purchases.map((p: any) => (
                  <div key={p.id} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                    <div className="w-8 h-8 bg-gradient-to-br from-violet-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-black">{p.buyerName[0]}</div>
                    <div className="flex-1 min-w-0">
                      <span className="text-sm font-bold text-slate-900">{p.buyerName}</span>
                      <p className="text-[10px] text-slate-400">{new Date(p.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-black text-violet-600 flex items-center gap-1"><Gem className="w-3 h-3" /> {p.creditCount}</div>
                      <div className="text-[10px] text-slate-400">₹{p.amountPaid}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* === SETTINGS TAB === */}
      {tab === "settings" && (
        <div className="space-y-5">
          {/* Enable Toggle */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-black text-slate-900">Enable Credits</h3>
              <p className="text-xs text-slate-500 mt-0.5">Show the credits section on your public profile</p>
            </div>
            <button onClick={() => setForm(f => ({ ...f, isEnabled: !f.isEnabled }))}
              className={`w-12 h-7 rounded-full transition-colors relative ${form.isEnabled ? "bg-violet-600" : "bg-slate-300"}`}>
              <div className={`w-5 h-5 bg-white rounded-full shadow-sm absolute top-1 transition-all ${form.isEnabled ? "left-6" : "left-1"}`} />
            </button>
          </div>

          {/* Pack Pricing */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-slate-900">Credit Packs</h3>
            <p className="text-xs text-slate-500">Configure the pricing tiers fans see when buying credits</p>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "1", label: "☕ Starter", credits: form.pack1Credits, price: form.pack1Price },
                { key: "2", label: "💎 Popular", credits: form.pack2Credits, price: form.pack2Price },
                { key: "3", label: "🔥 Superfan", credits: form.pack3Credits, price: form.pack3Price },
              ].map(pack => (
                <div key={pack.key} className={`border rounded-xl p-4 space-y-3 ${pack.key === "2" ? "border-violet-300 bg-violet-50 ring-1 ring-violet-300" : "border-slate-200"}`}>
                  <div className="text-sm font-bold">{pack.label}</div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Credits</label>
                    <input type="number" value={pack.credits} onChange={e => setForm(f => ({ ...f, [`pack${pack.key}Credits`]: parseInt(e.target.value) || 0 }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                  <div>
                    <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Price (₹)</label>
                    <input type="number" value={pack.price} onChange={e => setForm(f => ({ ...f, [`pack${pack.key}Price`]: parseFloat(e.target.value) || 0 }))}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-violet-500" />
                  </div>
                  <div className="text-[10px] text-slate-400">₹{(pack.price / (pack.credits || 1)).toFixed(2)} per credit</div>
                </div>
              ))}
            </div>
          </div>

          {/* Perks */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-slate-900">Supporter Perks</h3>
            <p className="text-xs text-slate-500">What supporters get when they buy credits</p>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
                <input type="checkbox" checked={!!form.perkDiscount} onChange={e => setForm(f => ({ ...f, perkDiscount: e.target.checked ? 10 : 0 }))} className="rounded text-violet-600" />
                <Tag className="w-4 h-4 text-violet-500" />
                <div className="flex-1">
                  <span className="text-xs font-bold text-slate-800">Product Discount</span>
                  {form.perkDiscount > 0 && (
                    <input type="number" value={form.perkDiscount} onChange={e => setForm(f => ({ ...f, perkDiscount: parseInt(e.target.value) || 0 }))}
                      className="ml-2 w-14 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-center" />
                  )}
                  {form.perkDiscount > 0 && <span className="text-[10px] text-slate-400 ml-1">% off</span>}
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
                <input type="checkbox" checked={form.perkContent} onChange={e => setForm(f => ({ ...f, perkContent: e.target.checked }))} className="rounded text-violet-600" />
                <Unlock className="w-4 h-4 text-violet-500" />
                <span className="text-xs font-bold text-slate-800">Access to Exclusive Content</span>
              </label>
              <label className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl cursor-pointer">
                <input type="checkbox" checked={form.perkEarlyAccess} onChange={e => setForm(f => ({ ...f, perkEarlyAccess: e.target.checked }))} className="rounded text-violet-600" />
                <Zap className="w-4 h-4 text-violet-500" />
                <span className="text-xs font-bold text-slate-800">Early Access to New Drops</span>
              </label>
              <div>
                <label className="text-[9px] font-black uppercase tracking-widest text-slate-400 block mb-1">Custom Perk (optional)</label>
                <input value={form.perkCustom} onChange={e => setForm(f => ({ ...f, perkCustom: e.target.value }))} placeholder="e.g., Monthly Q&A access"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500" />
              </div>
            </div>
          </div>

          {/* Save */}
          <button onClick={saveConfig} disabled={saving}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-pink-600 text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-violet-600/20">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            {saving ? "Saving..." : "Save Credit Settings"}
          </button>
        </div>
      )}

      {/* === PAYOUTS TAB === */}
      {tab === "payouts" && (
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 text-center">
            <DollarSign className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <div className="text-3xl font-black text-slate-900 mb-1">₹{(balance?.pendingPayout || 0).toLocaleString()}</div>
            <div className="text-xs text-slate-500 mb-4">Available for withdrawal</div>
            <div className="flex justify-center gap-3 mb-4">
              <div className="text-center px-4">
                <div className="text-sm font-black text-slate-700">₹{(balance?.totalRevenue || 0).toLocaleString()}</div>
                <div className="text-[9px] uppercase text-slate-400 font-bold">Total Earned</div>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center px-4">
                <div className="text-sm font-black text-slate-700">{PLATFORM_FEE_PERCENT}%</div>
                <div className="text-[9px] uppercase text-slate-400 font-bold">Platform Fee</div>
              </div>
              <div className="w-px bg-slate-200" />
              <div className="text-center px-4">
                <div className="text-sm font-black text-slate-700">₹{((balance?.totalRevenue || 0) * PLATFORM_FEE_PERCENT / 100).toFixed(0)}</div>
                <div className="text-[9px] uppercase text-slate-400 font-bold">Fee Deducted</div>
              </div>
            </div>
            <button className="px-8 py-3 bg-emerald-600 text-white text-sm font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20">
              Request Payout
            </button>
            <p className="text-[10px] text-slate-400 mt-3">Minimum payout: ₹500 • Processed within 3-5 business days</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="text-xs font-bold text-amber-900">Payment Processing</h4>
              <p className="text-[10px] text-amber-700 mt-0.5">Currently running in simulation mode. Real payouts via Razorpay will be enabled in the next update. All simulated earnings are tracked and will carry over.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
