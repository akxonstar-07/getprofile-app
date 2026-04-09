"use client";

import { useState, useEffect } from "react";
import { Tag, Plus, Trash2, Clock, Zap, Copy, Check, ToggleLeft, ToggleRight } from "lucide-react";
import { useRoleDashboardConfig } from "@/hooks/useRoleDashboardConfig";

interface PromoCode {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number;
  currentUses: number;
  expiresAt: string | null;
  aiTriggered: boolean;
  enabled: boolean;
  createdAt: string;
}

export default function PromoPage() {
  const { config } = useRoleDashboardConfig();
  const promoConfig = config.pages.promo;
  const [promos, setPromos] = useState<PromoCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Create form
  const [newCode, setNewCode] = useState("");
  const [newDiscount, setNewDiscount] = useState(10);
  const [newMaxUses, setNewMaxUses] = useState(100);
  const [newExpiry, setNewExpiry] = useState("");
  const [newAiTriggered, setNewAiTriggered] = useState(false);

  useEffect(() => { fetchPromos(); }, []);

  const fetchPromos = async () => {
    try {
      const res = await fetch("/api/promo");
      if (res.ok) setPromos(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const createPromo = async () => {
    if (!newCode.trim()) return;
    try {
      const res = await fetch("/api/promo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: newCode,
          discountPercent: newDiscount,
          maxUses: newMaxUses,
          expiresAt: newExpiry || null,
          aiTriggered: newAiTriggered,
        }),
      });
      if (res.ok) {
        setShowCreate(false);
        setNewCode(""); setNewDiscount(10); setNewMaxUses(100); setNewExpiry(""); setNewAiTriggered(false);
        fetchPromos();
      }
    } catch (e) { console.error(e); }
  };

  const deletePromo = async (id: string) => {
    await fetch(`/api/promo?id=${id}`, { method: "DELETE" });
    fetchPromos();
  };

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
            <Tag className="w-6 h-6 text-amber-500" />
            {promoConfig.title}
          </h1>
          <p className="text-sm text-slate-500 mt-1">{promoConfig.subtitle}</p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold rounded-xl hover:shadow-lg hover:shadow-amber-500/25 transition-all"
        >
          <Plus className="w-4 h-4" /> New Code
        </button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Create Promo Code</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-slate-500 mb-1 font-medium">Code</label>
              <input
                type="text"
                value={newCode}
                onChange={e => setNewCode(e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, ""))}
                placeholder="WELCOME20"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1 font-medium">Discount %</label>
              <input
                type="number"
                value={newDiscount}
                onChange={e => setNewDiscount(Math.min(90, Math.max(1, Number(e.target.value))))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1 font-medium">Max Uses</label>
              <input
                type="number"
                value={newMaxUses}
                onChange={e => setNewMaxUses(Number(e.target.value))}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-slate-500 mb-1 font-medium">Expires (optional)</label>
              <input
                type="date"
                value={newExpiry}
                onChange={e => setNewExpiry(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/20 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setNewAiTriggered(!newAiTriggered)}
              className="flex items-center gap-2 text-sm text-slate-600"
            >
              {newAiTriggered ? <ToggleRight className="w-5 h-5 text-amber-500" /> : <ToggleLeft className="w-5 h-5 text-slate-400" />}
              AI Auto-Offer (offer to returning visitors)
            </button>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-slate-600 transition-colors">Cancel</button>
            <button onClick={createPromo} className="px-6 py-2.5 bg-amber-500 text-white text-sm font-bold rounded-xl hover:bg-amber-600 transition-all">Create Code</button>
          </div>
        </div>
      )}

      {/* Promo List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading promo codes...</div>
      ) : promos.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-4">
            <Tag className="w-8 h-8 text-amber-300" />
          </div>
          <p className="text-slate-500 text-sm font-medium">No promo codes yet</p>
          <p className="text-slate-400 text-xs mt-1">Create your first discount code to boost sales</p>
        </div>
      ) : (
        <div className="space-y-3">
          {promos.map(p => (
            <div key={p.id} className="flex items-center justify-between p-4 rounded-xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                  <span className="text-lg font-black text-amber-600">{p.discountPercent}%</span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 tracking-wider">{p.code}</span>
                    {p.aiTriggered && (
                      <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-purple-100 text-purple-600 text-[10px] font-bold">
                        <Zap className="w-3 h-3" /> AI
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                    <span>{p.currentUses}/{p.maxUses} used</span>
                    {p.expiresAt && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Expires {new Date(p.expiresAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => copyCode(p.code, p.id)}
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
                  title="Copy code"
                >
                  {copiedId === p.id ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => deletePromo(p.id)}
                  className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-500 transition-all"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
