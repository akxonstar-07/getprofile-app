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
          profileViews: "1.2K", // Mock for now
          conversionRate: "2.4%", // Mock for now
          revenue: `$${prodData.products?.reduce((acc: number, p: any) => acc + ((p._count?.orders || 0) * p.price), 0).toLocaleString() || "0.00"}`
        });
      } catch (err) {
        console.error("Failed to load overview stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── WELCOME & QUICK ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-500/5">
                 <Zap className="w-5 h-5 fill-indigo-600" />
              </div>
              <h1 className="text-3xl font-black text-slate-900 tracking-tight">{config.overview.heroTitle}</h1>
           </div>
           <p className="text-slate-500 font-medium">{config.overview.heroSubtitle}</p>
        </div>
        <div className="flex items-center gap-3">
           <button className="bg-slate-100 text-slate-900 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share Hub
           </button>
           <Link href="/dashboard/links" className="bg-black text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Edit Profile
           </Link>
        </div>
      </div>

      {/* ── KEY BUSINESS METRICS (Top Row) ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         {config.overview.stats.map((stat, i) => {
           const iconMap: Record<string, any> = { revenue: DollarSign, visitors: Globe, conversion: TrendingUp, sales: ShoppingBag, bookings: Calendar, clients: Users, leads: Sparkles, events: Calendar, reviews: Star, subscribers: Users, orders: ShoppingBag, products: ShoppingBag, projects: BarChart3, applications: MessageSquare, interviews: Calendar, qrScans: Globe, clicks: Globe, accounts: Users, cases: MessageSquare };
           const colorMap: Record<string, string> = { emerald: "bg-emerald-500", blue: "bg-blue-500", indigo: "bg-indigo-500", purple: "bg-purple-500", pink: "bg-pink-500", rose: "bg-rose-500", amber: "bg-amber-500", teal: "bg-teal-500", orange: "bg-orange-500", red: "bg-red-500", cyan: "bg-cyan-500", sky: "bg-sky-500", violet: "bg-violet-500", slate: "bg-slate-500", yellow: "bg-yellow-500" };
           const StatIcon = iconMap[stat.key] || BarChart3;
           const bgColor = colorMap[stat.color] || "bg-indigo-500";
           const values = [stats.revenue, stats.profileViews, stats.conversionRate, stats.totalSales];
           return (
             <div key={i} className="bg-white border border-slate-200 p-6 rounded-[32px] shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                   <div className={`w-10 h-10 rounded-xl ${bgColor} flex items-center justify-center text-white shadow-lg`}>
                      <StatIcon className="w-5 h-5" />
                   </div>
                </div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{stat.label}</p>
                <h2 className="text-2xl font-black text-slate-900 leading-none">{values[i] ?? "—"}</h2>
             </div>
           );
         })}
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* AI Strategy Insights Panel (col-span-2) */}
         <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-900 rounded-[40px] p-8 shadow-2xl relative overflow-hidden group border border-white/5">
               <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-emerald-500/10 opacity-50" />
               <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 blur-[100px] pointer-events-none" />
               
               <div className="flex items-center justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-3">
                     <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
                     <h3 className="text-xs font-black uppercase tracking-widest text-indigo-400">AI Business Assistant</h3>
                  </div>
                  <Link href="/dashboard/assistant" className="text-white/40 hover:text-white text-[10px] uppercase font-black flex items-center gap-1 transition-all">
                     View Full Inbox <ArrowUpRight className="w-3 h-3" />
                  </Link>
               </div>

               <p className="text-white text-xl font-bold leading-relaxed mb-8 relative z-10">
                  "Your audience is showing high interest in your <span className="text-indigo-400">Fitness Guides</span>. Consider launching a 24-hour flash sale to capitalize on the 14 new leads identified today."
               </p>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                  {[
                    { label: "New Leads", value: "14", color: "text-indigo-400" },
                    { label: "Sentiment", value: "Pos", color: "text-emerald-400" },
                    { label: "Unread", value: stats.newMessages, color: "text-amber-400" },
                    { label: "Response", value: "2h", color: "text-slate-400" },
                  ].map((s, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 p-4 rounded-3xl">
                       <p className="text-[10px] font-black text-white/40 uppercase mb-1">{s.label}</p>
                       <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Recent Activity / Tasks */}
            <div className="bg-white border border-slate-200 rounded-[40px] p-8 shadow-sm">
               <div className="flex items-center justify-between mb-8">
                  <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">Ecosystem Health</h3>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
               </div>
               <div className="space-y-6">
                  {[
                    { title: "Optimize Mobile Template", desc: "Your mobile conversion is 15% lower than desktop.", icon: Bot, status: "Suggested" },
                    { title: "Upcoming: Yoga Masterclass", desc: "Starts in 2 days. 45/50 slots filled.", icon: Calendar, status: "Critical" },
                    { title: "New Product Sync", desc: "Digital assets successfully pushed to profile.", icon: ShoppingBag, status: "Done" },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-3xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-100">
                       <div className="flex items-center gap-5">
                          <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500">
                             <task.icon className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="font-bold text-slate-900">{task.title}</p>
                             <p className="text-xs text-slate-500 font-medium">{task.desc}</p>
                          </div>
                       </div>
                       <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-full ${
                          task.status === "Critical" ? "bg-rose-100 text-rose-600" : 
                          task.status === "Done" ? "bg-emerald-100 text-emerald-600" : 
                          "bg-indigo-100 text-indigo-600"
                       }`}>{task.status}</span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Side Content: Role-Specific Quick Actions */}
         <div className="space-y-6">
             <RoleQuickActions role={role} />

             <div className="bg-slate-900 rounded-[32px] p-6 text-white relative overflow-hidden group shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-[80px] transition-all group-hover:scale-110" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-2 text-white/60">Your Profile</h3>
                <p className="text-base font-bold leading-tight mb-5">Share your profile link and start getting traffic today.</p>
                <Link href="/dashboard/appearance" className="bg-white text-slate-900 px-5 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:shadow-xl transition-all inline-flex items-center gap-2">
                   Customize Profile <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
             </div>
          </div>

      </div>

    </div>
  );
}
