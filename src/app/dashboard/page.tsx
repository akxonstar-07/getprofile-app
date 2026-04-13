"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, ShoppingBag, Calendar, MessageSquare, 
  ArrowUpRight, Users, Globe, ExternalLink, Sparkles, 
  TrendingUp, DollarSign, Zap, Bot, Star, Share2
} from "lucide-react";
import Link from "next/link";
import { useRoleDashboardConfig } from "@/hooks/useRoleDashboardConfig";
import { RoleQuickActions } from "@/components/dashboard/RoleQuickActions";

export default function CreatorOverviewPage() {
  const { config, role } = useRoleDashboardConfig();
  const [stats, setStats] = useState({
    totalSales: 0,
    activeEvents: 0,
    newMessages: 0,
    profileViews: "12.4K",
    conversionRate: "4.8%",
    revenue: "$0.00"
  });

  useEffect(() => {
    // Initial fetch for overview stats
    const fetchStats = async () => {
      try {
        const prodRes = await fetch("/api/products");
        const prodData = await prodRes.json();
        const eventRes = await fetch("/api/events");
        const eventData = await eventRes.json();
        const msgRes = await fetch("/api/assistant/conversations");
        const msgData = await msgRes.json();

        setStats({
          totalSales: prodData.products?.reduce((acc: number, p: any) => acc + (p._count?.orders || 0), 0) || 0,
          activeEvents: eventData.events?.length || 0,
          newMessages: msgData.conversations?.length || 0,
          profileViews: "12.4K", // Mock for now
          conversionRate: "4.8%", // Mock for now
          revenue: `$${prodData.products?.reduce((acc: number, p: any) => acc + ((p._count?.orders || 0) * p.price), 0).toLocaleString() || "0.00"}`
        });
      } catch (err) {
        console.error("Failed to load overview stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans selection:bg-[#D2FF00] selection:text-black">
      
      {/* ── WELCOME & QUICK ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#111] border border-white/5 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D2FF00]/5 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-900/10 blur-[80px] pointer-events-none" />

        <div className="relative z-10">
           <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#D2FF00]/10 flex items-center justify-center border border-[#D2FF00]/20 shadow-[0_0_20px_rgba(210,255,0,0.1)]">
                 <Zap className="w-6 h-6 text-[#D2FF00]" />
              </div>
              <h1 className="text-4xl md:text-5xl font-komi uppercase tracking-tighter text-white">{config.overview.heroTitle}</h1>
           </div>
           <p className="text-white/50 text-lg font-medium">{config.overview.heroSubtitle}</p>
        </div>
        
        <div className="flex items-center gap-4 relative z-10 mt-6 md:mt-0">
           <button className="bg-white/5 border border-white/10 text-white px-8 py-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2">
              <Share2 className="w-4 h-4" /> SHARE HUB
           </button>
           <Link href="/dashboard/links" className="bg-[#D2FF00] text-black px-8 py-4 rounded-xl font-komi text-xl tracking-widest uppercase hover:bg-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all flex items-center gap-2">
              <ExternalLink className="w-5 h-5" /> EDIT PROFILE
           </Link>
        </div>
      </div>

      {/* ── KEY BUSINESS METRICS (Top Row) ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {config.overview.stats.map((stat, i) => {
           const iconMap: Record<string, any> = { revenue: DollarSign, visitors: Globe, conversion: TrendingUp, sales: ShoppingBag, bookings: Calendar, clients: Users, leads: Sparkles, events: Calendar, reviews: Star, subscribers: Users, orders: ShoppingBag, products: ShoppingBag, projects: BarChart3, applications: MessageSquare, interviews: Calendar, qrScans: Globe, clicks: Globe, accounts: Users, cases: MessageSquare };
           const StatIcon = iconMap[stat.key] || BarChart3;
           const values = [stats.revenue, stats.profileViews, stats.conversionRate, stats.totalSales];
           
           return (
             <div key={i} className="bg-[#050505] border border-white/10 p-6 rounded-[2rem] hover:border-white/20 transition-all group relative overflow-hidden flex flex-col justify-between min-h-[160px]">
                {/* Glow on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#111] to-black opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex justify-between items-start relative z-10 mb-4">
                   <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white group-hover:text-[#D2FF00] group-hover:border-[#D2FF00]/30 transition-all">
                      <StatIcon className="w-6 h-6" />
                   </div>
                </div>
                
                <div className="relative z-10">
                  <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mb-2 group-hover:text-white/60 transition-colors">{stat.label}</p>
                  <h2 className="font-komi text-4xl text-white tracking-wider leading-none break-words">{values[i] ?? "—"}</h2>
                </div>
             </div>
           );
         })}
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* AI Strategy Insights Panel (col-span-2) */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-gradient-to-br from-[#1A0B2E] to-[#110620] rounded-[3rem] p-10 shadow-2xl relative overflow-hidden group border border-white/5">
               <div className="absolute top-0 right-0 w-96 h-96 bg-[#D2FF00]/5 blur-[120px] pointer-events-none" />
               
               <div className="flex items-center justify-between mb-10 relative z-10">
                  <div className="flex items-center gap-3 bg-black/40 px-4 py-2 rounded-xl border border-white/10">
                     <Sparkles className="w-5 h-5 text-[#D2FF00] animate-pulse" />
                     <h3 className="text-xs font-black uppercase tracking-[0.2em] text-[#D2FF00]">AI STRATEGY NODE</h3>
                  </div>
                  <Link href="/dashboard/assistant" className="text-white/50 hover:text-white text-[11px] uppercase font-black flex items-center gap-2 tracking-widest transition-all">
                     OPEN INBOX <ArrowUpRight className="w-4 h-4" />
                  </Link>
               </div>

               <p className="text-white text-2xl font-bold leading-relaxed mb-10 relative z-10 font-sans tracking-tight">
                  "Your audience engagement is spiking around your <span className="text-[#D2FF00] underline decoration-[#D2FF00]/30 underline-offset-4">Fitness Masterclass</span> digital asset. Recommend launching a 24-hour flash sale to capture the 14 new leads identified in system today."
               </p>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                  {[
                    { label: "New Leads", value: "14", color: "text-[#D2FF00]" },
                    { label: "Sentiment", value: "POS", color: "text-emerald-400" },
                    { label: "Unread", value: stats.newMessages, color: "text-rose-400" },
                    { label: "Response", value: "2H", color: "text-white" },
                  ].map((s, i) => (
                    <div key={i} className="bg-black/30 border border-white/10 p-5 rounded-2xl flex flex-col justify-center items-center">
                       <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] mb-2">{s.label}</p>
                       <p className={`font-komi text-3xl tracking-wider ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Recent Activity / Tasks */}
            <div className="bg-[#050505] border border-white/10 rounded-[3rem] p-10 shadow-2xl relative">
               <div className="flex items-center justify-between mb-10">
                  <h3 className="font-komi text-4xl text-white uppercase tracking-tighter">ECOSYSTEM HEALTH</h3>
                  <div className="w-3 h-3 rounded-full bg-[#D2FF00] animate-pulse shadow-[0_0_15px_rgba(210,255,0,0.5)]" />
               </div>
               <div className="space-y-4">
                  {[
                    { title: "Optimize Mobile Template", desc: "Your mobile conversion is 15% lower than desktop metrics.", icon: Bot, status: "SUGGESTED", color: "text-blue-400", bg: "bg-blue-400/10" },
                    { title: "Upcoming: Yoga Masterclass", desc: "Starts in 2 days. 45/50 available slots filled.", icon: Calendar, status: "CRITICAL", color: "text-rose-400", bg: "bg-rose-400/10" },
                    { title: "New Product Sync Completed", desc: "Digital assets successfully pushed to public profile.", icon: ShoppingBag, status: "DONE", color: "text-[#D2FF00]", bg: "bg-[#D2FF00]/10 border border-[#D2FF00]/20" },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center justify-between p-6 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 hover:bg-white/10 transition-all items-center">
                       <div className="flex items-center gap-6">
                          <div className={`w-14 h-14 rounded-2xl bg-black border border-white/10 flex items-center justify-center text-white`}>
                             <task.icon className="w-6 h-6" />
                          </div>
                          <div>
                             <p className="text-lg font-bold text-white tracking-wide mb-1">{task.title}</p>
                             <p className="text-[13px] text-white/50 font-medium">{task.desc}</p>
                          </div>
                       </div>
                       <span className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg ${task.bg} ${task.color}`}>
                          {task.status}
                       </span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Side Content: Role-Specific Quick Actions */}
         <div className="space-y-8 h-full flex flex-col justify-between">
             
             {/* Quick Actions Component - Needs dark mode props or global CSS inheritance */}
             <div className="bg-[#050505] p-8 rounded-[3rem] border border-white/10">
               <h3 className="font-komi text-3xl uppercase text-white mb-6 tracking-tight">RAPID DEPLOYMENT</h3>
               <div className="opacity-90 grayscale contrast-125 dark-invert-guard">
                 <RoleQuickActions role={role} />
               </div>
             </div>

             <div className="bg-gradient-to-br from-[#2B1556] to-[#110620] rounded-[3rem] border border-white/10 p-10 text-white relative overflow-hidden group shadow-2xl flex-1 flex flex-col justify-center">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#D2FF00]/10 rounded-full blur-[60px] transition-all group-hover:scale-125 group-hover:bg-[#D2FF00]/20" />
                
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-4 text-[#D2FF00]">YOUR NETWORK HUB</h3>
                <p className="text-2xl font-bold leading-tight mb-8 relative z-10 tracking-tight">
                  Deploy your upgraded profile link to the internet. Begin funneling traffic and scaling operations.
                </p>
                <Link href="/dashboard/appearance" className="bg-white text-black px-6 py-4 rounded-xl font-komi text-xl tracking-widest uppercase hover:bg-[#D2FF00] hover:shadow-[0_0_30px_rgba(210,255,0,0.3)] transition-all inline-flex items-center justify-center gap-3 relative z-10 w-full mt-auto">
                   CUSTOMIZE PROFILE <ArrowUpRight className="w-5 h-5" />
                </Link>
             </div>
          </div>

      </div>
    </div>
  );
}
