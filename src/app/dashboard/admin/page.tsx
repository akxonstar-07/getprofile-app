"use client";

import { useEffect, useState } from "react";
import { 
  Users, Bot, LineChart, ShieldCheck, Activity, 
  Zap, AlertTriangle, Layers, Globe, Clock, Sparkles, Loader2
} from "lucide-react";

export default function AdminDashboardPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/ai-team")
      .then(r => r.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const stats = {
    totalUsers: 1240,
    activeAgencies: 42,
    aiTasksCompleted: data?.tasks?.length || 0,
    systemUptime: "99.98%",
    revenue30d: "$45,210"
  };

  if (loading) return (
     <div className="py-20 flex flex-col items-center justify-center text-slate-400 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-black uppercase tracking-widest text-[#5E5CE6]">Booting Admin Engine...</p>
     </div>
  );

  const aiTeam = data?.agents || [];

  return (
    <div className="max-w-6xl animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ShieldCheck className="w-7 h-7 text-[#5E5CE6]" />
            Master Admin Center
          </h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">Global platform health, multi-tenant monitoring, and AI workforce supervision.</p>
        </div>
        <div className="flex gap-2">
          <div className="bg-[#5E5CE6]/10 text-[#5E5CE6] px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2">
             <div className="w-2 h-2 rounded-full bg-[#5E5CE6] animate-pulse" />
             System Stable
          </div>
        </div>
      </div>

      {/* Global Stat Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="dash-card">
          <div className="flex items-center justify-between mb-3">
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Total Scale</p>
             <Users className="w-4 h-4 text-slate-300" />
          </div>
          <h3 className="text-3xl font-black text-slate-900">{stats.totalUsers}</h3>
          <p className="text-[11px] text-zinc-500 mt-1 font-bold">Verified Creators & Agencies</p>
        </div>
        
        <div className="dash-card">
          <div className="flex items-center justify-between mb-3">
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Revenue</p>
             <LineChart className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-3xl font-black text-slate-900">{stats.revenue30d}</h3>
          <p className="text-[11px] text-emerald-600 font-bold mt-1">+12.4% MoM Growth</p>
        </div>

        <div className="dash-card">
          <div className="flex items-center justify-between mb-3">
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">AI Ops</p>
             <Zap className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-3xl font-black text-slate-900">{stats.aiTasksCompleted}</h3>
          <p className="text-[11px] text-zinc-500 mt-1 font-bold">Autonomous tasks solved</p>
        </div>

        <div className="dash-card">
          <div className="flex items-center justify-between mb-3">
             <p className="text-xs font-black text-slate-400 uppercase tracking-widest">Uptime</p>
             <Activity className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-3xl font-black text-slate-900">{stats.systemUptime}</h3>
          <p className="text-[11px] text-indigo-600 font-bold mt-1">SLA Guarantee Active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* AI Workforce Real-time Table */}
         <div className="lg:col-span-2 space-y-6">
            <div className="dash-card p-0 overflow-hidden">
               <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/30">
                  <div>
                    <h3 className="font-black text-slate-900 flex items-center gap-2">
                       <Bot className="w-5 h-5 text-indigo-500" />
                       Autonomous AI Team
                    </h3>
                    <p className="text-xs font-bold text-slate-400 mt-0.5 uppercase tracking-wide">Workforce State: Operational</p>
                  </div>
                  <button className="bg-black text-white px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider shadow-lg hover:scale-105 transition-all">
                     Scale Infrastructure
                  </button>
               </div>
               <div className="overflow-x-auto">
                  <table className="w-full text-left">
                     <thead>
                        <tr className="text-[10px] font-black uppercase text-slate-400 tracking-widest bg-slate-50/50 border-b border-slate-100">
                           <th className="px-6 py-4">Agent Role</th>
                           <th className="px-6 py-4">Current Task</th>
                           <th className="px-6 py-4">Status</th>
                           <th className="px-6 py-4">Efficiency</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-100">
                        {aiTeam.map((agent: any) => (
                          <tr key={agent.name} className="hover:bg-slate-50/50 transition-colors">
                             <td className="px-6 py-5">
                                <div className="flex items-center gap-3">
                                   <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-indigo-600">
                                      <Layers className="w-4 h-4" />
                                   </div>
                                   <span className="font-black text-slate-900 text-sm tracking-tight">{agent.name}</span>
                                </div>
                             </td>
                             <td className="px-6 py-5 text-sm font-bold text-slate-500">{agent.task}</td>
                             <td className="px-6 py-5">
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                                  agent.status === "Active" ? "bg-emerald-50 text-emerald-600 border-emerald-100" :
                                  agent.status === "Scanning" ? "bg-amber-50 text-amber-600 border-amber-100 animate-pulse" :
                                  agent.status === "Offline" ? "bg-red-50 text-red-600 border-red-100" :
                                  "bg-slate-100 text-slate-500 border-slate-200"
                                }`}>
                                   {agent.status}
                                </span>
                             </td>
                             <td className="px-6 py-5 font-black text-slate-900">{agent.efficiency}</td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>

            <div className="dash-card">
               <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-indigo-500" />
                  Global Live Feed
               </h3>
               <div className="space-y-4">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex gap-4 items-start pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                       <div className="w-2 h-2 rounded-full bg-indigo-500 mt-2 shrink-0 shadow-[0_0_8px_#6366f1]" />
                       <div>
                          <p className="text-sm font-bold text-slate-900">Agency "TalentPro" added a new user @lifestyle_lucy</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">2 minutes ago · Region: US-West</p>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Sidebar: System Controls */}
         <div className="space-y-6">
            <div className="dash-card bg-slate-900 text-white overflow-hidden relative">
               <div className="relative z-10">
                  <h3 className="text-lg font-black mb-1 flex items-center gap-2">
                     <Globe className="w-5 h-5 text-indigo-400" />
                     Network Status
                  </h3>
                  <p className="text-xs font-bold text-slate-400 mb-6 uppercase tracking-widest">Global CDN: Optimal</p>
                  
                  <div className="space-y-4">
                     <div className="flex justify-between items-end">
                        <span className="text-[11px] font-black uppercase text-slate-500">Database Load</span>
                        <span className="text-xs font-black">22%</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-[22%] bg-indigo-500 rounded-full" />
                     </div>

                     <div className="flex justify-between items-end">
                        <span className="text-[11px] font-black uppercase text-slate-500">AI Compute Capacity</span>
                        <span className="text-xs font-black text-amber-400">84%</span>
                     </div>
                     <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full w-[84%] bg-amber-500 rounded-full" />
                     </div>
                  </div>
               </div>
            </div>

            <div className="dash-card">
               <h3 className="font-black text-slate-900 mb-4 flex items-center gap-2">
                  <Bot className="w-5 h-5 text-indigo-500" />
                  AI Team Autonomy
               </h3>
               <p className="text-[13px] font-bold text-slate-500 mb-6 leading-relaxed">The AI Workforce can proactively scan market trends to suggest platform-wide 10/10 feature upgrades.</p>
               <button 
                  onClick={async () => {
                    const res = await fetch("/api/admin/ai-team/discovery", { method: "POST" });
                    if (res.ok) window.location.reload();
                  }}
                  className="w-full bg-[#5E5CE6] text-white py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-lg shadow-[#5E5CE6]/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
                  <Bot className="w-4 h-4" /> Analyze Future Trends
               </button>
            </div>
         </div>
      </div>
    </div>
  );
}
