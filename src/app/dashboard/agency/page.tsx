"use client";

import { useEffect, useState } from "react";
import { 
  Users, Plus, Shield, ShieldAlert, ArrowUpRight, 
  BarChart2, Briefcase, Settings, Search, 
  CheckCircle2, Loader2, UserPlus, Bot, Zap, 
  Terminal, ShieldCheck, X, Activity, Layers, Globe
} from "lucide-react";
import Link from "next/link";

export default function AgencyCommandCenter() {
  const [activeTab, setActiveTab] = useState<"roster" | "workforce" | "terminal">("roster");
  const [creators, setCreators] = useState<any[]>([]);
  const [aiData, setAiData] = useState<any>({ agents: [], tasks: [] });
  const [loading, setLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  
  // Terminal State
  const [taskName, setTaskName] = useState("");
  const [taskInstructions, setTaskInstructions] = useState("");
  const [selectedAgent, setSelectedAgent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const fetchData = async () => {
      try {
        const [cRes, aiRes] = await Promise.all([
          fetch("/api/agency/creators"),
          fetch("/api/admin/ai-team")
        ]);
        const cData = await cRes.json();
        const aiDataJSON = await aiRes.json();
        setCreators(cData.creators || []);
        setAiData(aiDataJSON || { agents: [], tasks: [] });
        if (aiDataJSON?.agents?.length > 0) setSelectedAgent(aiDataJSON.agents[0].id);
      } catch (e) {
        console.error("Fetch error:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAssignTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/admin/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: taskName,
          assignee: selectedAgent,
          instructions: taskInstructions
        })
      });
      if (res.ok) {
        setTaskName("");
        setTaskInstructions("");
        setActiveTab("workforce");
        const aiRes = await fetch("/api/admin/ai-team");
        setAiData(await aiRes.json());
      }
    } catch (e) {} finally {
      setSubmitting(false);
    }
  };

  const handleStatusUpdate = async (taskId: string, status: string) => {
      await fetch("/api/admin/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, status })
      });
      const aiRes = await fetch("/api/admin/ai-team");
      setAiData(await aiRes.json());
  };

  if (!hasMounted) return null;

  if (loading) return (
     <div className="py-20 flex flex-col items-center justify-center text-zinc-400 gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-sm font-black uppercase tracking-widest text-[#5E5CE6]">Booting Command Center...</p>
     </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg">Agency Master</span>
              <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">v4.0.2 Platform</span>
           </div>
           <h1 className="text-5xl font-black text-slate-900 tracking-tighter leading-none uppercase italic">Command<span className="text-indigo-600">Center</span></h1>
           <p className="text-slate-500 text-sm mt-4 font-medium max-w-xl">Centralized intelligence nexus for talent management and autonomous workforce orchestration.</p>
        </div>
        <div className="flex items-center gap-4 bg-white p-2.5 rounded-2xl border border-slate-200">
           <div className="px-6 text-center border-r border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Managed Talent</p>
              <p className="text-2xl font-black text-slate-900">{creators?.length || 0}</p>
           </div>
           <div className="px-6 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Workforce Load</p>
              <p className="text-2xl font-black text-indigo-600">{(aiData?.agents?.length || 0)} Agents</p>
           </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex items-center gap-6 border-b border-slate-200">
          {[
            { id: "roster", label: "Talent Roster", icon: Users },
            { id: "workforce", label: "Workforce Monitor", icon: Bot },
            { id: "terminal", label: "Task Terminal", icon: Zap },
          ].map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-4 text-[11px] font-black uppercase tracking-widest transition-all relative ${
                    activeTab === tab.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                }`}
             >
                <tab.icon className="w-4 h-4" />
                {tab.label}
                {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600 rounded-t-full shadow-[0_0_12px_rgba(99,102,241,0.5)]" />
                )}
             </button>
          ))}
      </div>

      {/* ── CONTENT ── */}
      {activeTab === "roster" && (
         <div className="space-y-4">
            {!creators || creators.length === 0 ? (
               <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-24 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
                     <UserPlus className="w-8 h-8 text-slate-300" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 uppercase italic">Empty Roster</h3>
                  <p className="text-slate-400 text-sm mt-3 max-w-sm">Recruit your first creators to begin brand management and analytics scaling.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  {creators.map((creator) => (
                    <div key={creator.id} className="bg-white rounded-[2.5rem] border border-slate-200 p-8 hover:shadow-3xl hover:shadow-indigo-100/30 transition-all group relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50/50 rounded-full blur-3xl -mr-10 -mt-10 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex items-start justify-between relative z-10">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-slate-900 flex items-center justify-center text-white text-2xl font-black shadow-xl ring-4 ring-offset-2 ring-indigo-50 group-hover:scale-110 transition-transform">
                            {creator.profile?.avatarUrl ? (
                               <img src={creator.profile.avatarUrl} className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                               creator.name?.[0] || "?"
                            )}
                          </div>
                          <div>
                            <h3 className="text-xl font-black text-slate-900 leading-tight tracking-tight uppercase italic">{creator.name}</h3>
                            <p className="text-slate-400 text-sm font-bold tracking-tight">@{creator.username}</p>
                            <div className="flex items-center gap-2 mt-2">
                               <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                               <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Profile Optimized</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link href={`/${creator.username}`} target="_blank" className="p-3 rounded-xl bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all border border-transparent hover:border-indigo-100">
                            <ArrowUpRight className="w-5 h-5" />
                          </Link>
                          <button 
                            onClick={async () => {
                               const res = await fetch("/api/agency/manage", {
                                  method: "POST",
                                  headers: { "Content-Type": "application/json" },
                                  body: JSON.stringify({ creatorId: creator.id })
                               });
                               if (res.ok) window.location.href = "/dashboard";
                            }}
                            className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl hover:shadow-indigo-200 active:scale-95">
                            Manage Portfolio
                          </button>
                        </div>
                      </div>

                      <div className="mt-8 grid grid-cols-3 gap-8 border-t border-slate-50 pt-8">
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-xs">Reach Potential</p>
                            <p className="text-xl font-black text-slate-900 tracking-tight">{(creator.profile?.totalFollowers / 1000).toFixed(1)}K</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-xs">Content Count</p>
                            <p className="text-xl font-black text-slate-900 tracking-tight">{creator._count?.links || 0} Links</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 text-xs">AI Suggestions</p>
                            <p className="text-xl font-black text-emerald-500 tracking-tight">4 Optims</p>
                         </div>
                      </div>
                    </div>
                  ))}
               </div>
            )}
         </div>
      )}

      {activeTab === "workforce" && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center justify-between px-4">
                   <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400">Active Workforce ({(aiData?.agents?.length || 0)})</h3>
                   <button 
                     onClick={async () => {
                       await fetch("/api/admin/ai-team/discovery", { method: "POST" });
                       window.location.reload();
                     }}
                     className="text-[9px] font-black text-indigo-600 hover:text-indigo-400 p-1 flex items-center gap-1 uppercase tracking-tighter transition-colors">
                      <Bot className="w-3 h-3" /> Proactive Suggestion
                   </button>
                </div>
                <div className="grid gap-2">
                   {(aiData?.agents || []).map((agent: any) => (
                      <div key={agent.id} className="bg-white border border-slate-200 p-5 rounded-[1.5rem] flex items-center gap-4 hover:border-indigo-400 hover:shadow-xl transition-all cursor-default group">
                         <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center group-hover:bg-indigo-600 transition-colors shadow-lg">
                            <Bot className="w-6 h-6 text-white" />
                         </div>
                         <div>
                            <p className="text-[13px] font-black text-slate-900 leading-none truncate max-w-[120px]">{agent.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase mt-1.5 tracking-tight">{agent.title}</p>
                         </div>
                         <div className="ml-auto flex items-center gap-2 bg-slate-50 px-2.5 py-1 rounded-full">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-600 uppercase">Idle</span>
                         </div>
                      </div>
                   ))}
                </div>
            </div>

            {/* Task Log */}
            <div className="lg:col-span-2 space-y-6">
               <h3 className="text-[11px] font-black uppercase tracking-widest text-slate-400 px-4">Decision & Execution Log</h3>
               <div className="space-y-4">
                  {!aiData?.tasks || aiData.tasks.length === 0 ? (
                     <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-20 text-center">
                        <Activity className="w-10 h-10 text-slate-200 mx-auto mb-4" />
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">No Active Missions</p>
                     </div>
                  ) : (
                     aiData.tasks.map((task: any) => (
                        <div key={task.id} className="bg-white border border-slate-200 p-8 rounded-[2rem] relative overflow-hidden group hover:border-indigo-200 transition-all shadow-sm">
                           <div className="flex items-start justify-between relative z-10">
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-3">
                                    <span className={`text-[10px] font-black uppercase px-3 py-1 rounded ring-1 ring-inset ${
                                       task.status === "done" ? "bg-emerald-50 text-emerald-600 ring-emerald-500/20" :
                                       task.status === "awaiting_approval" ? "bg-amber-50 text-amber-600 ring-amber-500/20 animate-pulse" :
                                       "bg-indigo-50 text-indigo-600 ring-indigo-500/20"
                                    }`}>{task.status || "Executing"}</span>
                                    <span className="text-zinc-300 text-[10px] font-black">REF_ {task.id}</span>
                                 </div>
                                 <h4 className="text-xl font-black text-slate-900 leading-none tracking-tight uppercase italic">{task.name}</h4>
                                 <div className="flex items-center gap-6 mt-4">
                                    <div className="flex items-center gap-2">
                                       <div className="w-6 h-6 rounded bg-slate-900 text-white text-[10px] font-black flex items-center justify-center uppercase">{task.assignee?.[0]}</div>
                                       <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{task.assignee}</span>
                                    </div>
                                    <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                                       <Layers className="w-3 h-3" /> System Integration
                                    </div>
                                 </div>
                              </div>
                              
                              {task.status === "awaiting_approval" && (
                                 <div className="flex gap-2 shrink-0">
                                    <button 
                                      onClick={() => handleStatusUpdate(task.id, "approved")}
                                      className="p-3.5 rounded-2xl bg-indigo-600 text-white shadow-xl shadow-indigo-100 hover:scale-110 active:scale-90 transition-all group/btn">
                                       <ShieldCheck className="w-6 h-6" />
                                    </button>
                                    <button 
                                      onClick={() => handleStatusUpdate(task.id, "rejected")}
                                      className="p-3.5 rounded-2xl bg-slate-100 text-slate-400 hover:text-rose-500 hover:bg-rose-50 transition-all">
                                       <X className="w-6 h-6" />
                                    </button>
                                 </div>
                              )}
                           </div>
                           
                           {/* Decorative progress line */}
                           <div className="absolute bottom-0 left-0 h-1 bg-slate-50 w-full overflow-hidden">
                              <div className={`h-full bg-indigo-500 transition-all duration-1000 ${task.status === "done" ? "w-full" : "w-1/3 animate-pulse"}`} />
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>
      )}

      {activeTab === "terminal" && (
         <div className="bg-slate-900 rounded-[3rem] p-12 shadow-3xl relative overflow-hidden border border-white/5 shadow-[0_40px_100px_rgba(0,0,0,0.1)]">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full -mr-20 -mt-20" />
            
            <div className="relative z-10 max-w-3xl">
               <div className="flex items-center gap-6 mb-12">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-[0_0_40px_rgba(99,102,241,0.3)]">
                     <Terminal className="w-7 h-7" />
                  </div>
                  <div>
                     <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter leading-none">Objective Terminal</h3>
                     <p className="text-indigo-300/40 text-[11px] font-black uppercase tracking-[0.4em] mt-2">Deploying Autonomous Directives</p>
                  </div>
               </div>

               <form onSubmit={handleAssignTask} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-300/70 ml-2">Mission Identifier</label>
                        <input 
                           type="text" 
                           value={taskName}
                           onChange={(e) => setTaskName(e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/10 focus:border-indigo-500 focus:bg-white/10 outline-none transition-all font-bold text-lg"
                           placeholder="Audit Creator Aesthetics"
                           required
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-300/70 ml-2">Agent Assignment</label>
                        <div className="relative">
                           <select 
                              value={selectedAgent}
                              onChange={(e) => setSelectedAgent(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-indigo-500 focus:bg-white/10 outline-none transition-all font-bold text-lg appearance-none cursor-pointer"
                              required
                           >
                              {aiData?.agents?.map((agent: any) => (
                                 <option key={agent.id} value={agent.id} className="bg-slate-900 text-white py-4">{agent.name} — {agent.title}</option>
                              ))}
                           </select>
                           <Bot className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400/50 pointer-events-none" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[11px] font-black uppercase tracking-[0.2em] text-indigo-300/70 ml-2">Operational Instructions</label>
                     <textarea 
                        value={taskInstructions}
                        onChange={(e) => setTaskInstructions(e.target.value)}
                        className="w-full h-44 bg-white/5 border border-white/10 rounded-[2.5rem] px-8 py-7 text-white placeholder:text-white/10 focus:border-indigo-500 focus:bg-white/10 outline-none transition-all font-medium text-lg resize-none custom-scrollbar"
                        placeholder="Define the mission scope. Instruct the agent to analyze bento grids, optimize masonry layouts, or refine brand palette consistency..."
                        required
                     />
                  </div>

                  <div className="pt-4">
                     <button 
                        disabled={submitting}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 py-6 rounded-[3rem] text-white text-sm font-black uppercase tracking-[0.4em] transition-all shadow-[0_20px_50px_rgba(99,102,241,0.3)] active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 group">
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                        Initialize Neural Directive
                     </button>
                     <p className="text-center text-indigo-300/20 text-[9px] font-black uppercase tracking-widest mt-6">Secure Encrypted Execution Layer • AI Lifecycle v4.0</p>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}
