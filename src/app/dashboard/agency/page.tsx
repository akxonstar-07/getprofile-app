"use client";

import { useState } from "react";
import { Users, Plus, Shield, ShieldAlert, ArrowUpRight, BarChart2, Briefcase, Settings, Search, CheckCircle2 } from "lucide-react";

export default function AgencyPage() {
  const [activeTab, setActiveTab] = useState<"roster" | "analytics" | "roles">("roster");

  const roster = [
    { id: 1, name: "Sarah Jenkins", handle: "@sarah.j", status: "Active", revenue: "$12,450", growth: "+14%" },
    { id: 2, name: "Tech Weekly", handle: "@techweekly", status: "Active", revenue: "$8,200", growth: "+5%" },
    { id: 3, name: "Mike Davis", handle: "@mikedavis", status: "Pending Invite", revenue: "-", growth: "-" },
    { id: 4, name: "Gamer Zone", handle: "@gamerzone", status: "Active", revenue: "$15,100", growth: "+22%" },
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <Briefcase className="w-6 h-6 text-indigo-600" />
            Agency Portal
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage multiple creator accounts, team permissions, and consolidated analytics.</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-ghost"><Settings className="w-4 h-4" /> Agency Settings</button>
          <button className="btn-primary"><Plus className="w-4 h-4" /> Invite Creator</button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        <div className="dash-card">
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Managed Profiles</p>
          <h3 className="text-3xl font-bold text-slate-900">{roster.length}</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +1 this month
          </p>
        </div>
        <div className="dash-card">
          <p className="text-sm font-semibold text-slate-500 mb-1">Consolidated Revenue (30d)</p>
          <h3 className="text-3xl font-bold text-slate-900">$35,750</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +12.5% vs last month
          </p>
        </div>
        <div className="dash-card relative overflow-hidden group">
          <div className="relative z-10">
            <p className="text-sm font-semibold text-white/80 mb-1">Agency Tier</p>
            <h3 className="text-3xl font-bold text-white flex items-center gap-2">
              <Shield className="w-6 h-6 text-amber-300" /> Pro Partner
            </h3>
            <p className="text-xs text-indigo-100 mt-2">Up to 25 managed accounts</p>
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {(["roster", "analytics", "roles"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize flex items-center gap-2 ${
              activeTab === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "roster" && <Users className="w-4 h-4" />}
            {tab === "analytics" && <BarChart2 className="w-4 h-4" />}
            {tab === "roles" && <ShieldAlert className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "roster" && (
        <div className="dash-card p-0 overflow-hidden animate-fade-in">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <h3 className="font-bold text-slate-900">Creator Roster</h3>
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search profiles..." className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-200 bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all outline-none" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  <th className="p-4 pl-6">Creator</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Monthly Rev</th>
                  <th className="p-4">Growth</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {roster.map((creator) => (
                  <tr key={creator.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4 pl-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-cyan-100 flex items-center justify-center font-bold text-indigo-700">
                          {creator.name[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900">{creator.name}</p>
                          <p className="text-xs text-slate-500">{creator.handle}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {creator.status === "Active" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="p-4 font-medium text-slate-700">{creator.revenue}</td>
                    <td className="p-4 font-medium text-emerald-600">{creator.growth}</td>
                    <td className="p-4 text-right pr-6">
                      <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors opacity-0 group-hover:opacity-100">
                        Manage Profile →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "analytics" && (
        <div className="dash-card py-20 text-center animate-fade-in border-dashed border-2 bg-slate-50/50">
          <BarChart2 className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Consolidated Analytics</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">Compare performance across all your managed profiles. Connect more active accounts to generate insights.</p>
          <button className="btn-primary mx-auto">Generate Report</button>
        </div>
      )}

      {activeTab === "roles" && (
        <div className="dash-card py-20 text-center animate-fade-in border-dashed border-2 bg-slate-50/50">
          <ShieldAlert className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-slate-900 mb-2">Team Permissions</h3>
          <p className="text-slate-500 text-sm max-w-md mx-auto mb-6">Invite assistants, designers, or talent managers to access specific profiles without giving them full account access.</p>
          <button className="btn-primary mx-auto">Invite Team Member</button>
        </div>
      )}
    </div>
  );
}
