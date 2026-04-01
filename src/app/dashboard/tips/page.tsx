"use client";

import { useState } from "react";
import { Heart, Settings, MessageSquare, DollarSign, Edit3, ArrowUpRight, Trophy, Zap, Copy } from "lucide-react";

export default function TipsPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "settings" | "messages">("overview");

  const topSupporters = [
    { name: "Anonymous", amount: "$500", message: "Keep up the amazing work! Your videos helped me start my own agency." },
    { name: "Sarah Jenkins", amount: "$150", message: "Thanks for the incredible preset pack." },
    { name: "DevMaster99", amount: "$100", message: "Coffee fund!" },
    { name: "Anonymous", amount: "$50", message: "Loved today's stream." },
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Heart className="w-6 h-6 text-rose-500" />
            Support & Tip Jar
          </h1>
          <p className="text-slate-500 text-sm mt-1">Let your most loyal fans support your creative journey.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost flex items-center gap-2">
            <Copy className="w-4 h-4" /> Copy Tip Link
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="dash-card">
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Tips Received</p>
          <h3 className="text-3xl font-bold text-slate-900">$2,450.00</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +$450 this month
          </p>
        </div>
        <div className="dash-card">
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Supporters</p>
          <h3 className="text-3xl font-bold text-slate-900">84</h3>
          <p className="text-xs text-slate-400 font-medium mt-2">12 new this month</p>
        </div>
        <div className="dash-card relative overflow-hidden group border-amber-200 bg-amber-50">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Trophy className="w-16 h-16 text-amber-500" />
          </div>
          <div className="relative z-10">
            <p className="text-sm font-semibold text-amber-700 mb-1">Top Supporter</p>
            <h3 className="text-xl font-bold text-amber-900">Anonymous</h3>
            <p className="text-sm font-bold text-amber-600 mt-1">$500.00 total</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {(["overview", "settings", "messages"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize flex items-center gap-2 ${
              activeTab === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "overview" && <Heart className="w-4 h-4" />}
            {tab === "settings" && <Settings className="w-4 h-4" />}
            {tab === "messages" && <MessageSquare className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="dash-card">
            <h3 className="font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Recent Support</h3>
            <div className="space-y-4">
              {topSupporters.map((support, i) => (
                <div key={i} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center font-bold text-rose-600 flex-shrink-0">
                    <Heart className="w-5 h-5 fill-rose-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-bold text-slate-900 text-sm">{support.name}</p>
                      <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {support.amount}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 italic">"{support.message}"</p>
                  </div>
                </div>
              ))}
              <button onClick={() => setActiveTab("messages")} className="w-full py-3 mt-4 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                View All Messages
              </button>
            </div>
          </div>

          <div className="dash-card h-fit">
            <h3 className="font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Tip Jar Preview</h3>
            <div className="border border-slate-200 rounded-2xl p-6 shadow-sm relative mx-auto max-w-sm">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white px-2">
                <span className="text-xs font-bold text-rose-500 border border-rose-200 bg-rose-50 rounded-full px-3 py-1">
                  Live Preview
                </span>
              </div>
              <h4 className="text-center font-bold text-lg text-slate-900 mb-2">Buy me a coffee ☕</h4>
              <p className="text-center text-sm text-slate-500 mb-6">If you enjoy my content, consider supporting me to help me create more!</p>
              
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="border-2 border-slate-200 rounded-xl py-3 text-center cursor-pointer hover:border-indigo-500 transition-colors">
                  <span className="font-bold text-slate-900">$5</span>
                </div>
                <div className="border-2 border-indigo-500 bg-indigo-50 rounded-xl py-3 text-center cursor-pointer transition-colors relative">
                  <span className="font-bold text-indigo-700">$10</span>
                </div>
                <div className="border-2 border-slate-200 rounded-xl py-3 text-center cursor-pointer hover:border-indigo-500 transition-colors">
                  <span className="font-bold text-slate-900">$25</span>
                </div>
              </div>
              
              <div className="mb-4">
                <input type="text" placeholder="Name or Twitter handle (optional)" className="input-premium mb-3 bg-slate-50" />
                <textarea placeholder="Say something nice (optional)" className="input-premium resize-none bg-slate-50 h-20" />
              </div>
              
              <button className="btn-primary w-full py-3 shadow-md shadow-indigo-500/20">
                Support $10
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <div className="dash-card">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-indigo-500" />
              Tip Jar Appearance
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Tip Jar Title</label>
                <input type="text" defaultValue="Support My Work" className="input-premium" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Thank You Message</label>
                <textarea rows={3} defaultValue="Thank you so much for your support! It means the world to me and helps me keep creating free content for you all." className="input-premium resize-none" />
                <p className="text-xs text-slate-400 mt-1">This message is shown immediately after a successful tip.</p>
              </div>
            </div>
          </div>

          <div className="dash-card">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-indigo-500" />
              Pricing Tiers
            </h3>
            
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Tier 1</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input type="number" defaultValue="5" className="input-premium pl-8" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Tier 2 (Default)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input type="number" defaultValue="10" className="input-premium pl-8 border-indigo-500 ring-1 ring-indigo-500/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Tier 3</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input type="number" defaultValue="25" className="input-premium pl-8" />
                </div>
              </div>
            </div>
            
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm text-slate-900">Allow Custom Amounts</h4>
                <p className="text-xs text-slate-500">Supporters can enter any amount above $1</p>
              </div>
              <button className="relative w-12 h-7 bg-emerald-500 rounded-full transition-colors">
                <div className="absolute top-1 left-6 w-5 h-5 bg-white rounded-full transition-all shadow-sm" />
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn-primary px-8">Save Changes</button>
          </div>
        </div>
      )}
    </div>
  );
}
