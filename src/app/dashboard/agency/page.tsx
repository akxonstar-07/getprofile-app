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
     <div className="py-32 flex flex-col items-center justify-center text-white/50 gap-6">
        <div className="w-16 h-16 border-[6px] border-white/10 border-t-[#D2FF00] rounded-full animate-spin" />
        <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D2FF00]">BOOTING COMMAND CENTER...</p>
     </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20 font-sans selection:bg-[#D2FF00] selection:text-black">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 bg-black rounded-[3rem] p-10 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#D2FF00]/5 blur-[120px] rounded-full -mr-20 -mt-20 pointer-events-none" />

        <div className="relative z-10">
           <div className="flex items-center gap-3 mb-4">
              <span className="bg-[#D2FF00] text-black text-[10px] font-black px-3 py-1.5 rounded uppercase tracking-[0.2em] shadow-[0_0_15px_rgba(210,255,0,0.4)]">AGENCY MASTER</span>
              <span className="text-white/30 text-xs font-bold uppercase tracking-[0.2em]">V4.0.2 PLATFORM</span>
           </div>
           <h1 className="font-komi text-6xl text-white tracking-tighter leading-none uppercase">COMMAND<span className="text-[#D2FF00]">CENTER</span></h1>
           <p className="text-white/50 text-base mt-2 font-medium max-w-xl">Centralized intelligence nexus for talent management and autonomous workforce orchestration.</p>
        </div>
        <div className="flex items-center gap-6 bg-white/5 p-4 rounded-3xl border border-white/10 relative z-10 backdrop-blur-md">
           <div className="px-6 text-center border-r border-white/10">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Managed Talent</p>
              <p className="font-komi text-4xl text-white">{creators?.length || 0}</p>
           </div>
           <div className="px-6 text-center">
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-1">Workforce Load</p>
              <p className="font-komi text-4xl text-[#D2FF00]">{(aiData?.agents?.length || 0)} <span className="text-xl">AGENTS</span></p>
           </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div className="flex items-center gap-6 border-b border-white/10">
          {[
            { id: "roster", label: "Talent Roster", icon: Users },
            { id: "workforce", label: "Workforce Monitor", icon: Bot },
            { id: "terminal", label: "Task Terminal", icon: Zap },
          ].map((tab) => (
             <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-3 px-4 py-5 text-[11px] font-black uppercase tracking-[0.2em] transition-all relative ${
                    activeTab === tab.id ? "text-[#D2FF00]" : "text-white/40 hover:text-white"
                }`}
             >
                <tab.icon className={`w-4 h-4 ${activeTab === tab.id ? "text-[#D2FF00]" : "opacity-50"}`} />
                {tab.label}
                {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#D2FF00] rounded-t-full shadow-[0_0_15px_#D2FF00]" />
                )}
             </button>
          ))}
      </div>

      {/* ── CONTENT ── */}
      {activeTab === "roster" && (
         <div className="space-y-6">
            {!creators || creators.length === 0 ? (
               <div className="bg-[#050505] border border-dashed border-white/20 rounded-[3rem] p-32 flex flex-col items-center justify-center text-center">
                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center mb-8">
                     <UserPlus className="w-8 h-8 text-white/30" />
                  </div>
                  <h3 className="font-komi text-4xl text-white uppercase tracking-tighter mb-4">EMPTY ROSTER</h3>
                  <p className="text-white/40 text-base max-w-md">Initialize recruitment protocols. Secure creators to manage and scale their brand equity.</p>
               </div>
            ) : (
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                  {creators.map((creator) => (
                    <div key={creator.id} className="bg-[#050505] rounded-[3rem] border border-white/10 p-10 hover:border-[#D2FF00]/40 transition-all group relative overflow-hidden flex flex-col justify-between shadow-2xl min-h-[300px]">
                      {/* Glow overlay */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-black via-transparent to-[#D2FF00]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      
                      <div className="flex items-start justify-between relative z-10 w-full">
                        <div className="flex items-center gap-6">
                          <div className="w-20 h-20 rounded-2xl bg-black border border-white/20 flex items-center justify-center text-white text-3xl font-komi shadow-2xl shadow-black group-hover:scale-105 transition-transform">
                            {creator.profile?.avatarUrl ? (
                               <img src={creator.profile.avatarUrl} className="w-full h-full object-cover rounded-2xl" />
                            ) : (
                               creator.name?.[0] || "?"
                            )}
                          </div>
                          <div>
                            <h3 className="font-komi text-4xl text-white leading-none tracking-tight uppercase mb-1">{creator.name}</h3>
                            <p className="text-[#D2FF00] text-sm font-black tracking-widest uppercase">@{creator.username}</p>
                            <div className="flex items-center gap-2 mt-3 bg-white/5 px-2.5 py-1 rounded inline-flex">
                               <span className="w-1.5 h-1.5 rounded-full bg-[#D2FF00] animate-pulse shadow-[0_0_8px_#D2FF00]" />
                               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/60">Node Active</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <Link href={`/${creator.username}`} target="_blank" className="w-12 h-12 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-white/50 hover:text-white hover:bg-white/10 transition-all">
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
                            className="bg-white text-black h-12 px-6 rounded-xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-[#D2FF00] transition-colors shadow-lg active:scale-95 flex items-center">
                            OVERRIDE
                          </button>
                        </div>
                      </div>

                      <div className="mt-10 grid grid-cols-3 gap-6 border-t border-white/5 pt-8 relative z-10">
                         <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Reach</p>
                            <p className="font-komi text-4xl text-white tracking-widest">{(creator.profile?.totalFollowers / 1000).toFixed(1)}K</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">Assets</p>
                            <p className="font-komi text-4xl text-white tracking-widest">{creator._count?.links || 0}</p>
                         </div>
                         <div>
                            <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">AI Audit</p>
                            <p className="font-komi text-4xl text-[#D2FF00] tracking-widest">4 OPT</p>
                         </div>
                      </div>
                    </div>
                  ))}
               </div>
            )}
         </div>
      )}

      {/* ADDITIONAL TABS RESTYLED DIRECTLY INTO DARK NEO-BRUTALISM... */}
      {activeTab === "workforce" && (
         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-6">
                <div className="flex items-center justify-between px-2">
                   <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-white/50">ACTIVE AGENTS ({(aiData?.agents?.length || 0)})</h3>
                   <button 
                     onClick={async () => {
                       await fetch("/api/admin/ai-team/discovery", { method: "POST" });
                       window.location.reload();
                     }}
                     className="text-[10px] font-black text-[#D2FF00] hover:text-white px-2 py-1 bg-white/5 rounded-md flex items-center gap-1.5 uppercase tracking-widest transition-colors border border-white/10">
                      <Bot className="w-3 h-3" /> PING AGENT
                   </button>
                </div>
                <div className="grid gap-3">
                   {(aiData?.agents || []).map((agent: any) => (
                      <div key={agent.id} className="bg-black border border-white/10 p-5 rounded-2xl flex items-center gap-4 hover:border-[#D2FF00]/50 hover:bg-white/5 transition-all cursor-default group shadow-xl">
                         <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#D2FF00] transition-colors shadow-black group-hover:text-black text-white">
                            <Bot className="w-6 h-6" />
                         </div>
                         <div>
                            <p className="text-[13px] font-black text-white leading-none truncate max-w-[120px] uppercase tracking-widest mb-1.5">{agent.name}</p>
                            <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{agent.title}</p>
                         </div>
                         <div className="ml-auto flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                            <div className="w-2 h-2 rounded-full bg-[#D2FF00] animate-pulse" />
                            <span className="text-[9px] font-black text-[#D2FF00] uppercase tracking-widest">IDLE</span>
                         </div>
                      </div>
                   ))}
                </div>
            </div>

            {/* Task Log border */}
            <div className="lg:col-span-2 space-y-6">
               <h3 className="text-[12px] font-black uppercase tracking-[0.2em] text-white/50 px-2">DECISION LOG</h3>
               <div className="space-y-4">
                  {!aiData?.tasks || aiData.tasks.length === 0 ? (
                     <div className="bg-[#050505] border border-dashed border-white/20 rounded-[3rem] p-24 text-center">
                        <Activity className="w-12 h-12 text-white/20 mx-auto mb-6" />
                        <p className="font-komi text-3xl uppercase tracking-widest text-white/40">NO MISSIONS CONFIGURED</p>
                     </div>
                  ) : (
                     aiData.tasks.map((task: any) => (
                        <div key={task.id} className="bg-black border border-white/10 p-8 rounded-[2rem] relative overflow-hidden group shadow-2xl">
                           <div className="flex items-start justify-between relative z-10 w-full">
                              <div className="flex-1">
                                 <div className="flex items-center gap-3 mb-4">
                                    <span className={`text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded bg-[#111] grid place-items-center border ${
                                       task.status === "done" ? "text-emerald-400 border-emerald-400/30" :
                                       task.status === "awaiting_approval" ? "text-amber-400 border-amber-400/30 animate-pulse" :
                                       "text-[#D2FF00] border-[#D2FF00]/30"
                                    }`}>{task.status || "EXECUTING"}</span>
                                    <span className="text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">REF_ {task.id.slice(0, 8)}</span>
                                 </div>
                                 <h4 className="font-komi text-4xl leading-none text-white tracking-widest uppercase mb-4">{task.name}</h4>
                                 <div className="flex items-center gap-6 mt-4">
                                    <div className="flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                                       <div className="w-6 h-6 rounded bg-black text-white text-[10px] font-black flex items-center justify-center uppercase border border-white/10">{task.assignee?.[0]}</div>
                                       <span className="text-xs font-bold text-white/60 uppercase tracking-[0.2em]">{task.assignee}</span>
                                    </div>
                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                                       <Layers className="w-3.5 h-3.5" /> SYSTEM HOOK
                                    </div>
                                 </div>
                              </div>
                              
                              {task.status === "awaiting_approval" && (
                                 <div className="flex gap-2 shrink-0">
                                    <button 
                                      onClick={() => handleStatusUpdate(task.id, "approved")}
                                      className="p-4 rounded-2xl bg-[#D2FF00] text-black shadow-xl hover:scale-110 active:scale-90 transition-all group/btn">
                                       <ShieldCheck className="w-6 h-6" />
                                    </button>
                                    <button 
                                      onClick={() => handleStatusUpdate(task.id, "rejected")}
                                      className="p-4 rounded-2xl bg-white/5 text-rose-500 hover:text-white hover:bg-rose-500 transition-all border border-white/10">
                                       <X className="w-6 h-6" />
                                    </button>
                                 </div>
                              )}
                           </div>
                           
                           {/* Decorative progress line */}
                           <div className="absolute bottom-0 left-0 h-1.5 bg-[#111] w-full overflow-hidden">
                              <div className={`h-full bg-[#D2FF00] transition-all duration-1000 ${task.status === "done" ? "w-full shadow-[0_0_20px_#D2FF00]" : "w-1/3 animate-pulse shadow-[0_0_10px_#D2FF00]"}`} />
                           </div>
                        </div>
                     ))
                  )}
               </div>
            </div>
         </div>
      )}

      {activeTab === "terminal" && (
         <div className="bg-[#050505] rounded-[3rem] p-12 relative overflow-hidden border border-white/10 shadow-2xl">
            {/* Extremely dark stealth mode background */}
            <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/5 via-black to-black opacity-40 pointer-events-none" />
            
            <div className="relative z-10 max-w-4xl mx-auto">
               <div className="flex flex-col items-center gap-4 mb-16 text-center">
                  <div className="w-20 h-20 rounded-3xl bg-black border border-[#D2FF00]/50 flex items-center justify-center text-[#D2FF00] shadow-[0_0_50px_rgba(210,255,0,0.2)]">
                     <Terminal className="w-10 h-10" />
                  </div>
                  <div>
                     <h3 className="font-komi text-5xl text-white uppercase tracking-tighter leading-none mt-4">NEURAL DIRECTIVE</h3>
                     <p className="text-white/40 text-[12px] font-black uppercase tracking-[0.4em] mt-4">Authorize AI Orchestration Override</p>
                  </div>
               </div>

               <form onSubmit={handleAssignTask} className="space-y-8 bg-black p-10 rounded-[2.5rem] border border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 ml-2">Mission Identifier</label>
                        <input 
                           type="text" 
                           value={taskName}
                           onChange={(e) => setTaskName(e.target.value)}
                           className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder:text-white/20 focus:border-[#D2FF00] focus:ring-1 focus:ring-[#D2FF00] outline-none transition-all font-bold text-lg font-mono"
                           placeholder="SYS_AUDIT_01"
                           required
                        />
                     </div>
                     <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 ml-2">Assigned Node</label>
                        <div className="relative">
                           <select 
                              value={selectedAgent}
                              onChange={(e) => setSelectedAgent(e.target.value)}
                              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-5 text-white focus:border-[#D2FF00] focus:ring-1 focus:ring-[#D2FF00] outline-none transition-all font-bold text-lg font-mono appearance-none cursor-pointer"
                              required
                           >
                              {aiData?.agents?.map((agent: any) => (
                                 <option key={agent.id} value={agent.id} className="bg-black text-white">{agent.name} :: {agent.title}</option>
                              ))}
                           </select>
                           <Bot className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 pointer-events-none" />
                        </div>
                     </div>
                  </div>

                  <div className="space-y-3">
                     <label className="text-[10px] font-black uppercase tracking-[0.3em] text-white/50 ml-2">Operational Parameters</label>
                     <textarea 
                        value={taskInstructions}
                        onChange={(e) => setTaskInstructions(e.target.value)}
                        className="w-full h-48 bg-white/5 border border-white/10 rounded-[2rem] px-8 py-7 text-white placeholder:text-white/20 focus:border-[#D2FF00] focus:ring-1 focus:ring-[#D2FF00] outline-none transition-all font-medium text-lg font-mono resize-none custom-scrollbar"
                        placeholder="> Define constraint matrix and logic rules herein..."
                        required
                     />
                  </div>

                  <div className="pt-8">
                     <button 
                        disabled={submitting}
                        className="w-full bg-white hover:bg-[#D2FF00] py-6 rounded-[2rem] text-black text-sm font-black uppercase tracking-[0.4em] transition-all disabled:opacity-50 flex items-center justify-center gap-4 group">
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 group-hover:scale-125 transition-transform" />}
                        EXECUTE PROTOCOL
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}
