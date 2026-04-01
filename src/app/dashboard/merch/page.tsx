"use client";

import { useState } from "react";
import { Shirt, ShoppingBag, Palette, Truck, Plus, CheckCircle2, DollarSign, Clock, ExternalLink } from "lucide-react";

export default function MerchPage() {
  const [activeTab, setActiveTab] = useState<"campaigns" | "designer" | "settings">("campaigns");

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Shirt className="w-6 h-6 text-rose-500" />
            Merch Designer
          </h1>
          <p className="text-slate-500 text-sm mt-1">Design, launch, and sell custom apparel with zero inventory risk.</p>
        </div>
        <button onClick={() => setActiveTab("designer")} className="btn-primary">
          <Plus className="w-4 h-4" /> Start Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="dash-card">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4">
            <Palette className="w-5 h-5 text-orange-600" />
          </div>
          <h3 className="font-bold text-slate-900">Custom Designs</h3>
          <p className="text-sm text-slate-500 mt-2">Upload your artwork to hoodies, tees, caps, and 50+ other premium items.</p>
        </div>
        <div className="dash-card">
          <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-bold text-slate-900">Global Fulfillment</h3>
          <p className="text-sm text-slate-500 mt-2">Print-on-demand partners automatically handle printing and worldwide shipping.</p>
        </div>
        <div className="dash-card">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center mb-4">
            <DollarSign className="w-5 h-5 text-emerald-600" />
          </div>
          <h3 className="font-bold text-slate-900">Keep Your Profits</h3>
          <p className="text-sm text-slate-500 mt-2">Set your own markups. You keep 100% of the profit margin on every sale.</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {(["campaigns", "designer", "settings"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize flex items-center gap-2 ${
              activeTab === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "campaigns" && (
        <div className="dash-card text-center py-20 animate-fade-in border-dashed border-2 bg-slate-50/50">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8 text-rose-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No Active Campaigns</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">You haven't launched any merchandise yet. Start your first drop to unlock a new revenue stream.</p>
          <button onClick={() => setActiveTab("designer")} className="btn-primary mx-auto">Design First Product</button>
        </div>
      )}

      {activeTab === "designer" && (
        <div className="dash-card flex items-center flex-col md:flex-row gap-8 min-h-[400px] animate-fade-in">
          <div className="flex-1 w-full bg-slate-100 rounded-3xl aspect-square flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-4 border-2 border-dashed border-slate-300 rounded-2xl flex flex-col items-center justify-center">
              <Palette className="w-10 h-10 text-slate-400 mb-2" />
              <p className="text-sm font-semibold text-slate-600 font-mono">Drag & Drop Artwork Here</p>
              <p className="text-xs text-slate-400 mt-1">PNG or SVG, up to 10MB</p>
            </div>
            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
              <button className="btn-primary">Browse Files</button>
            </div>
          </div>
          
          <div className="w-full md:w-1/2 space-y-6">
            <div>
              <h3 className="font-bold text-slate-900 text-lg">Product Base</h3>
              <p className="text-sm text-slate-500 mb-3">Select the garment type to print on.</p>
              <div className="grid grid-cols-2 gap-3">
                <div className="border border-indigo-500 bg-indigo-50 rounded-xl p-3 cursor-pointer">
                  <p className="font-bold text-indigo-700 text-sm">Classic T-Shirt</p>
                  <p className="text-xs text-indigo-500 font-medium">From $12.50</p>
                </div>
                <div className="border border-slate-200 hover:border-slate-300 bg-white rounded-xl p-3 cursor-pointer transition-colors">
                  <p className="font-bold text-slate-700 text-sm">Premium Hoodie</p>
                  <p className="text-xs text-slate-500 font-medium">From $28.00</p>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Campaign Name</label>
              <input type="text" placeholder="e.g. Summer Tour Drop" className="input-premium" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Retail Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                  <input type="number" defaultValue="25.00" className="input-premium pl-8" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Your Profit</label>
                <div className="h-[46px] rounded-xl bg-emerald-50 border border-emerald-100 flex items-center px-4 font-bold text-emerald-600">
                  <DollarSign className="w-4 h-4 mr-1" /> 12.50 / item
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex gap-3">
              <button className="btn-primary flex-1 py-3 text-sm">Generate Mockups</button>
              <button className="btn-ghost" onClick={() => setActiveTab("campaigns")}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="dash-card max-w-2xl animate-fade-in">
          <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            Integration Settings
          </h3>
          <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-lg bg-green-50 flex items-center justify-center font-bold text-green-600">P</div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm">Printify API</h4>
                <p className="text-xs text-slate-500 mt-1">Connect your Printify account for automated fulfillment.</p>
              </div>
            </div>
            <button className="btn-primary px-4">Connect</button>
          </div>
          <p className="text-xs text-slate-400">By connecting a fulfillment partner, all orders placed through your GetProfile store will automatically be routed to their factories.</p>
        </div>
      )}
    </div>
  );
}
