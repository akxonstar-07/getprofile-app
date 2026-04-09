"use client";

import { useState } from "react";
import { Calendar, Clock, FlaskConical, BarChart3, ArrowRight, X, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

/* ── Link Scheduler Component ── */
export function LinkScheduler({ link, onSave }: { link: any; onSave: (id: string, data: any) => void }) {
  const [startDate, setStartDate] = useState(link.scheduledStart || "");
  const [endDate, setEndDate] = useState(link.scheduledEnd || "");
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    onSave(link.id, { scheduledStart: startDate || null, scheduledEnd: endDate || null });
    toast.success("Schedule saved!");
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-all" title="Schedule link">
        <Clock className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                <h3 className="font-black text-slate-900">Schedule Link</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-sm text-slate-500 mb-5">Set when <strong className="text-slate-900">{link.title}</strong> should be visible.</p>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Start Date & Time</label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">End Date & Time (optional)</label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={() => { setStartDate(""); setEndDate(""); }} className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all">
                Clear
              </button>
              <button onClick={handleSave} className="flex-1 px-4 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Save
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

/* ── A/B Test Panel Component ── */
export function ABTestPanel({ link, onSave }: { link: any; onSave: (id: string, data: any) => void }) {
  const [isOpen, setIsOpen] = useState(false);
  const [variantBUrl, setVariantBUrl] = useState(link.variantBUrl || "");
  const [variantBTitle, setVariantBTitle] = useState(link.variantBTitle || "");

  const totalClicks = (link.clicksA || 0) + (link.clicksB || 0);
  const aPercent = totalClicks > 0 ? Math.round(((link.clicksA || 0) / totalClicks) * 100) : 50;
  const bPercent = totalClicks > 0 ? Math.round(((link.clicksB || 0) / totalClicks) * 100) : 50;

  const handleSave = () => {
    onSave(link.id, {
      abTestActive: !!(variantBUrl && variantBTitle),
      variantBUrl,
      variantBTitle,
    });
    toast.success("A/B test updated!");
    setIsOpen(false);
  };

  return (
    <>
      <button onClick={() => setIsOpen(true)} className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all ${
        link.abTestActive ? "bg-purple-50 border-purple-200 text-purple-600" : "bg-slate-50 border-slate-200 text-slate-400 hover:bg-purple-50 hover:border-purple-200"
      }`} title="A/B Test">
        <FlaskConical className="w-3.5 h-3.5" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5 text-purple-600" />
                <h3 className="font-black text-slate-900">A/B Test</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results Bar */}
            {link.abTestActive && totalClicks > 0 && (
              <div className="mb-5 bg-slate-50 rounded-2xl p-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Performance</p>
                <div className="flex gap-1 h-4 rounded-full overflow-hidden mb-2">
                  <div className="bg-indigo-500 rounded-l-full transition-all" style={{ width: `${aPercent}%` }} />
                  <div className="bg-purple-500 rounded-r-full transition-all" style={{ width: `${bPercent}%` }} />
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-indigo-600">A: {link.clicksA || 0} clicks ({aPercent}%)</span>
                  <span className="text-purple-600">B: {link.clicksB || 0} clicks ({bPercent}%)</span>
                </div>
              </div>
            )}

            {/* Variant A (Original) */}
            <div className="mb-4 p-4 bg-indigo-50 border border-indigo-100 rounded-2xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-indigo-600 mb-1">Variant A (Original)</p>
              <p className="text-sm font-bold text-slate-900">{link.title}</p>
              <p className="text-xs text-slate-400 truncate">{link.url}</p>
            </div>

            {/* Variant B */}
            <div className="space-y-3">
              <p className="text-[10px] font-black uppercase tracking-widest text-purple-600">Variant B</p>
              <input
                type="text"
                value={variantBTitle}
                onChange={e => setVariantBTitle(e.target.value)}
                placeholder="Alternative link title"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
              <input
                type="url"
                value={variantBUrl}
                onChange={e => setVariantBUrl(e.target.value)}
                placeholder="https://alternative-url.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-purple-500/20 transition-all"
              />
            </div>

            <div className="flex gap-2 mt-6">
              <button onClick={() => { setVariantBUrl(""); setVariantBTitle(""); onSave(link.id, { abTestActive: false, variantBUrl: "", variantBTitle: "" }); setIsOpen(false); toast.success("A/B test disabled"); }}
                className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all">
                Disable Test
              </button>
              <button onClick={handleSave}
                className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-2xl text-sm font-bold hover:bg-purple-700 transition-all flex items-center justify-center gap-2">
                <CheckCircle2 className="w-4 h-4" /> Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
