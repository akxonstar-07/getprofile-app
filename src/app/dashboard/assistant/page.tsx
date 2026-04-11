"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  Bot, MessageSquare, Star, ShoppingCart, UserCheck, 
  Sparkles, Search, Filter, ArrowRight, Trash2, Loader2, Play,
  Lock, Crown, Zap, Settings, Command, Power
} from "lucide-react";
import { toast } from "sonner";
import { getUserPlanInfo, type PlanInfo } from "@/lib/plan-guard";
import { useRoleDashboardConfig } from "@/hooks/useRoleDashboardConfig";

export default function AIAssistantPage() {
  const router = useRouter();
  const { config } = useRoleDashboardConfig();
  const aiConfig = config.pages.assistant;
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState("Analyzing your audience strategy... 🤖");
  const [activeTab, setActiveTab] = useState("ALL");
  const [viewState, setViewState] = useState<"INBOX" | "SETTINGS">("INBOX");
  
  // Settings State
  const [voice, setVoice] = useState("Friendly & Professional");
  const [autoRespond, setAutoRespond] = useState(false);
  const [dmTrigger, setDmTrigger] = useState("LINK");

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(d => {
      if (d.user) {
        const info = getUserPlanInfo({ plan: d.user.plan || "FREE", trialEndsAt: d.user.trialEndsAt });
        setPlanInfo(info);
        if (info.isPro) {
          fetchConversations();
        } else {
          setLoading(false);
        }
      }
    }).catch(() => setLoading(false));
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch("/api/assistant/conversations");
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        if (data.summary) setSummary(data.summary);
      }
    } catch (err) {
      // Silently fail — API may not exist yet
    } finally {
      setLoading(false);
    }
  };

  const runAnalysis = async () => {
    toast.promise(fetch("/api/assistant/analyze", { method: "POST" }), {
      loading: "AI is synthesizing your messages...",
      success: "Insights generated! 🎯",
      error: "Analysis failed"
    });
    fetchConversations();
  };

  const categories = [
    { id: "ALL", label: "All Hub", icon: MessageSquare, color: "text-slate-400" },
    { id: "BRAND", label: "Brand Collabs", icon: Star, color: "text-amber-500" },
    { id: "SALE", label: "Store Sales", icon: ShoppingCart, color: "text-emerald-500" },
    { id: "FAN", label: "Fan Messages", icon: Sparkles, color: "text-purple-500" },
    { id: "SUBSCRIPTION", label: "Subscribers", icon: UserCheck, color: "text-indigo-500" },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  // ═══ PRO GATE: Show upgrade prompt for Free users ═══
  if (planInfo && !planInfo.isPro) {
    return (
      <div className="flex items-center justify-center min-h-[500px] animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center max-w-md space-y-8">
          {/* Lock Icon */}
          <div className="relative mx-auto w-24 h-24">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/20 to-purple-500/20 rounded-[32px] blur-xl animate-pulse" />
            <div className="relative w-24 h-24 rounded-[32px] bg-white border-2 border-slate-200 flex items-center justify-center shadow-xl">
              <Bot className="w-10 h-10 text-indigo-500" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center shadow-lg border-2 border-white">
                <Lock className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-3">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{aiConfig.title}</h2>
            <p className="text-slate-500 font-medium leading-relaxed">
              Your AI-powered business assistant analyzes visitor conversations, identifies brand deals, and generates strategic insights — all automatically.
            </p>
          </div>

          {/* Feature List */}
          <div className="bg-slate-50 rounded-2xl p-6 text-left space-y-3 border border-slate-200">
            {[
              "Auto-analyze fan & visitor conversations",
              "Identify brand collaboration opportunities",
              "AI-powered strategic business insights",
              "Smart message categorization & filtering",
              "Visitor intent recognition",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3 text-sm">
                <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-3 h-3 text-indigo-600" />
                </div>
                <span className="text-slate-700 font-medium">{feature}</span>
              </div>
            ))}
          </div>

          {/* Upgrade CTA */}
          <button 
            onClick={() => router.push("/dashboard/settings")}
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest hover:shadow-xl hover:shadow-indigo-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Crown className="w-4 h-4" /> Upgrade to Pro
          </button>
          <p className="text-xs text-slate-400">Available on Pro plan • Starting at $5/mo</p>
        </div>
      </div>
    );
  }

  // ═══ PRO USER: Full AI Assistant Hub ═══
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── HEADER & AI SUMMARY ── */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-8">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 shadow-sm border border-indigo-500/5">
                <Bot className="w-5 h-5" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">{aiConfig.title}</h1>
             {planInfo?.isTrialActive && (
               <span className="text-[9px] font-black px-2 py-1 rounded-full bg-amber-100 text-amber-600 border border-amber-200">
                 {planInfo.trialDaysLeft}d trial left
               </span>
             )}
          </div>
          <p className="text-slate-500 font-medium max-w-md">{aiConfig.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
             onClick={() => setViewState("SETTINGS")}
             className="bg-white border border-slate-200 text-slate-700 px-4 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-slate-50 transition-all shadow-sm active:scale-95">
             <Settings className="w-4 h-4" /> Config
          </button>
          <button 
            onClick={runAnalysis}
            className="bg-indigo-500 text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-600 transition-all shadow-xl shadow-indigo-500/20 active:scale-95">
            <Play className="w-4 h-4" /> Run Fresh AI Analysis
          </button>
        </div>
      </div>

      {viewState === "SETTINGS" ? (
         <div className="animate-in fade-in slide-in-from-right-4 duration-500">
           <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-slate-900">AI Automations & Settings</h2>
              <button onClick={() => setViewState("INBOX")} className="text-sm font-bold text-slate-500 hover:text-slate-900">← Back to Inbox</button>
           </div>
           
           <div className="grid lg:grid-cols-2 gap-8">
              {/* Auto Responder Toggles */}
              <div className="bg-white border p-8 rounded-3xl shadow-sm space-y-6">
                 <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500"><Power className="w-5 h-5"/></div>
                    <div>
                      <h3 className="text-lg font-black text-slate-900">Auto-Responder</h3>
                      <p className="text-sm text-slate-500">Let AI reply to basic fan questions automatically.</p>
                    </div>
                 </div>
                 
                 <label className="flex items-center justify-between p-4 border rounded-2xl cursor-pointer hover:bg-slate-50 transition-colors">
                    <span className="font-bold text-slate-800">Enable Auto-Pilot</span>
                    <div onClick={() => setAutoRespond(!autoRespond)} className={`w-12 h-6 rounded-full transition-all flex items-center p-1 ${autoRespond ? "bg-indigo-500 justify-end" : "bg-slate-200 justify-start"}`}>
                       <div className="w-4 h-4 bg-white rounded-full shadow-sm" />
                    </div>
                 </label>
                 
                 <div>
                    <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">Brand Voice / Persona</label>
                    <textarea 
                       rows={4}
                       className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 outline-none focus:border-indigo-500 transition-all text-sm font-medium"
                       value={voice}
                       onChange={e => setVoice(e.target.value)}
                       placeholder="e.g. Act as a bubbly fitness coach. Always use emojis."
                    />
                 </div>
              </div>

              {/* Comment to DM Flow */}
              <div className="bg-gradient-to-br from-slate-900 to-indigo-950 p-8 rounded-3xl shadow-xl shadow-indigo-900/20 text-white space-y-6 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-3xl pointer-events-none" />
                 
                 <div className="flex items-center gap-3 mb-2 relative z-10">
                    <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-indigo-300"><Command className="w-5 h-5"/></div>
                    <div>
                      <h3 className="text-lg font-black text-white">Comment-to-DM Engine</h3>
                      <p className="text-sm text-indigo-200">Automatically DM links when fans comment a keyword.</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4 relative z-10">
                    <div>
                       <label className="block text-xs font-bold text-indigo-300 mb-2 uppercase tracking-wider">Trigger Keyword</label>
                       <input 
                          type="text"
                          className="w-full bg-white/10 border border-white/20 rounded-2xl p-4 outline-none focus:border-indigo-400 transition-all font-black text-lg placeholder:text-white/30"
                          value={dmTrigger}
                          onChange={e => setDmTrigger(e.target.value)}
                          placeholder="e.g. LINK or COURSE"
                       />
                       <p className="text-[10px] text-indigo-300 mt-2 font-medium">When someone comments this keyword on your IG/TikTok, the agent will DM them the attached link.</p>
                    </div>
                 </div>
                 
                 <button className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all relative z-10">
                    Save Workflows
                 </button>
              </div>
           </div>
         </div>
      ) : (
         <div className="animate-in fade-in slide-in-from-left-4 duration-500 space-y-10">
           {/* ── AI STRATEGIC SUMMARY BOX ── */}
      <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group">
         <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 opacity-50 group-hover:opacity-100 transition-opacity" />
         <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] pointer-events-none" />
         
         <div className="flex items-start gap-6 relative z-10">
            <div className="w-16 h-16 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/10 shrink-0">
               <Sparkles className="w-8 h-8 text-indigo-400 animate-pulse" />
            </div>
            <div className="space-y-3">
               <h3 className="text-xs font-black uppercase tracking-[0.2em] text-indigo-400">Strategic Insights</h3>
               <p className="text-white text-lg font-bold leading-relaxed">{summary}</p>
               <div className="flex gap-4 pt-2">
                  <div className="flex items-center gap-2 text-white/50 text-xs">
                     <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> High Interest in &quot;Presets&quot;
                  </div>
                  <div className="flex items-center gap-2 text-white/50 text-xs">
                     <div className="w-1.5 h-1.5 rounded-full bg-amber-500" /> 3 New Brand Leads
                  </div>
               </div>
            </div>
         </div>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-1">
         <div className="flex gap-8 overflow-x-auto no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`flex items-center gap-2 pb-4 px-1 text-sm font-black uppercase tracking-widest transition-all relative ${
                  activeTab === cat.id ? "text-indigo-600" : "text-slate-400 hover:text-slate-600"
                }`}>
                <cat.icon className={`w-4 h-4 ${cat.color}`} />
                {cat.label}
                {activeTab === cat.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500 rounded-full shadow-lg shadow-indigo-500/30" />
                )}
              </button>
            ))}
         </div>
      </div>

      {/* ── CONVERSATION LIST ── */}
      <div className="space-y-4 pb-20">
        {conversations.length === 0 ? (
          <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-[50px] bg-slate-50/30">
            <MessageSquare className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest">No interactions recorded yet.</p>
            <p className="text-slate-300 text-sm mt-2">Visitor conversations from your public profile will appear here.</p>
          </div>
        ) : (
          conversations
            .filter(c => activeTab === "ALL" || c.messages?.[0]?.category === activeTab)
            .map((conv) => (
            <div key={conv.id} className="bg-white border border-slate-200 rounded-[32px] p-6 hover:shadow-xl hover:-translate-y-1 transition-all group flex items-center justify-between gap-6 cursor-pointer">
               <div className="flex items-center gap-6 flex-1">
                  <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 transition-colors">
                     {conv.visitorName?.[0]?.toUpperCase() || <MessageSquare className="w-6 h-6" />}
                  </div>
                  <div className="flex-1 space-y-1">
                     <div className="flex items-center gap-3">
                        <h4 className="font-black text-slate-900">{conv.visitorName || "Anonymous Fan"}</h4>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                           conv.messages?.[0]?.category === "BRAND" ? "bg-amber-100 text-amber-600" :
                           conv.messages?.[0]?.category === "SALE" ? "bg-emerald-100 text-emerald-600" :
                           "bg-indigo-100 text-indigo-600"
                        }`}>
                           {conv.messages?.[0]?.category || "Neutral"}
                        </span>
                     </div>
                     <p className="text-sm text-slate-500 line-clamp-1 italic">&quot;{conv.messages?.[0]?.content}&quot;</p>
                  </div>
               </div>
               <div className="text-right flex flex-col items-end gap-2 shrink-0">
                  <span className="text-[10px] font-bold text-slate-400">{new Date(conv.lastMessageAt).toLocaleDateString()}</span>
                  <div className="flex gap-2">
                     <button className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 flex items-center justify-center transition-all">
                        <Trash2 className="w-4 h-4" />
                     </button>
                     <button className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:shadow-lg transition-all">
                        <ArrowRight className="w-4 h-4" />
                     </button>
                  </div>
               </div>
            </div>
          ))
        )}
      </div>
      </div>
      )}
    </div>
  );
}
