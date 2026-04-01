"use client";

import { useState } from "react";
import { Zap, Plus, ArrowRight, Mail, Users, Filter, CheckCircle2, Copy } from "lucide-react";

export default function AutomationsPage() {
  const [activeTab, setActiveTab] = useState<"workflows" | "templates">("workflows");

  const workflows = [
    { id: 1, name: "Welcome Email Series", trigger: "New Subscriber", actions: 3, status: "Active", calls: "1,245" },
    { id: 2, name: "Thank You Message (Tip)", trigger: "Tip Received", actions: 1, status: "Active", calls: "84" },
    { id: 3, name: "Cart Abandonment", trigger: "Checkout Abandoned", actions: 2, status: "Paused", calls: "312" },
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Zap className="w-6 h-6 text-amber-500" />
            Automations Builder
          </h1>
          <p className="text-slate-500 text-sm mt-1">Set up marketing rules, auto-responders, and background workflows.</p>
        </div>
        <button className="btn-primary"><Plus className="w-4 h-4" /> Create Workflow</button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="dash-card">
          <p className="text-sm font-semibold text-slate-500 mb-1">Active Workflows</p>
          <h3 className="text-3xl font-bold text-slate-900">2</h3>
          <p className="text-xs text-slate-400 font-medium mt-2">1 paused</p>
        </div>
        <div className="dash-card">
          <p className="text-sm font-semibold text-slate-500 mb-1">Tasks Executed (30d)</p>
          <h3 className="text-3xl font-bold text-slate-900">1,641</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2">Saving you ~14 hours</p>
        </div>
        <div className="dash-card bg-amber-50 border-amber-200 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-amber-900 mb-1">Automation Limits</h3>
            <p className="text-xs font-semibold text-amber-700">1,641 / 10,000 tasks</p>
          </div>
          <div className="relative w-16 h-16 transform -rotate-90">
             <svg className="w-16 h-16" viewBox="0 0 36 36">
              <path className="text-amber-200 stroke-current" strokeWidth="4" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
              <path className="text-amber-500 stroke-current" strokeWidth="4" strokeDasharray="16, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            </svg>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {(["workflows", "templates"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize ${
              activeTab === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "workflows" && (
        <div className="dash-card p-0 overflow-hidden animate-fade-in">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="p-4 pl-6">Workflow Name</th>
                <th className="p-4">Trigger</th>
                <th className="p-4">Architecture</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Runs (30d)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {workflows.map((flow) => (
                <tr key={flow.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer">
                  <td className="p-4 pl-6">
                    <p className="font-bold text-slate-900 text-sm">{flow.name}</p>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg w-fit">
                      <Zap className="w-3.5 h-3.5 text-amber-500" /> {flow.trigger}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1 opacity-70">
                      <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center"><Filter className="w-3 h-3 text-indigo-600" /></div>
                      <ArrowRight className="w-3 h-3 text-slate-300" />
                      <div className="w-6 h-6 rounded bg-indigo-100 flex items-center justify-center"><Mail className="w-3 h-3 text-indigo-600" /></div>
                      {flow.actions > 2 && (
                        <>
                          <ArrowRight className="w-3 h-3 text-slate-300" />
                          <div className="w-6 h-6 rounded bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">+{flow.actions - 2}</div>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="p-4">
                    <button className={`relative w-10 h-6 rounded-full transition-colors ${flow.status === 'Active' ? 'bg-emerald-500' : 'bg-slate-300'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all shadow-sm ${flow.status === 'Active' ? 'left-5' : 'left-1'}`} />
                    </button>
                  </td>
                  <td className="p-4 text-right pr-6 font-mono text-sm text-slate-600">{flow.calls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {[
            { name: "Welcome Sequence", desc: "Send a 3-part email series to new subscribers.", icon: Mail },
            { name: "Post-Purchase Upsell", desc: "Email buyers a discount code for another product.", icon: Copy },
            { name: "Sponsor Auto-Reply", desc: "Filter DMs containing 'collab' and reply with Media Kit.", icon: Users },
          ].map((temp, i) => (
            <div key={i} className="dash-card hover:border-indigo-300 transition-colors cursor-pointer group">
              <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <temp.icon className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-bold text-slate-900">{temp.name}</h3>
              <p className="text-sm text-slate-500 mt-2 mb-4">{temp.desc}</p>
              <button className="text-sm font-semibold text-indigo-600 flex items-center gap-1 group-hover:gap-2 transition-all">
                Use Template <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
