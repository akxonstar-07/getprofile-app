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
          profileViews: "12.4K",
          conversionRate: "4.8%",
          revenue: `$${prodData.products?.reduce((acc: number, p: any) => acc + ((p._count?.orders || 0) * p.price), 0).toLocaleString() || "0.00"}`
        });
      } catch (err) {
        console.error("Failed to load overview stats");
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 font-sans">
      
      {/* ── WELCOME & QUICK ACTIONS ── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
        <div>
           <h1 className="text-3xl font-bold text-gray-900 mb-2">{config.overview.heroTitle}</h1>
           <p className="text-gray-500 text-base">{config.overview.heroSubtitle}</p>
        </div>
        
        <div className="flex items-center gap-3 mt-4 md:mt-0">
           <button className="bg-gray-100 text-gray-700 px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-gray-200 transition-all flex items-center gap-2">
              <Share2 className="w-4 h-4" /> Share
           </button>
           <Link href="/dashboard/links" className="bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-all flex items-center gap-2">
              <ExternalLink className="w-4 h-4" /> Edit Profile
           </Link>
        </div>
      </div>

      {/* ── KEY BUSINESS METRICS ── */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
         {config.overview.stats.map((stat, i) => {
           const iconMap: Record<string, any> = { revenue: DollarSign, visitors: Globe, conversion: TrendingUp, sales: ShoppingBag, bookings: Calendar, clients: Users, leads: Sparkles, events: Calendar, reviews: Star, subscribers: Users, orders: ShoppingBag, products: ShoppingBag, projects: BarChart3, applications: MessageSquare, interviews: Calendar, qrScans: Globe, clicks: Globe, accounts: Users, cases: MessageSquare };
           const StatIcon = iconMap[stat.key] || BarChart3;
           const values = [stats.revenue, stats.profileViews, stats.conversionRate, stats.totalSales];
           
           return (
             <div key={i} className="bg-white border border-gray-200 p-5 rounded-xl hover:shadow-md transition-all group">
                <div className="flex justify-between items-start mb-4">
                   <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                      <StatIcon className="w-5 h-5" />
                   </div>
                </div>
                
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">{stat.label}</p>
                  <h2 className="text-2xl font-bold text-gray-900">{values[i] ?? "—"}</h2>
                </div>
             </div>
           );
         })}
      </div>

      {/* ── MAIN CONTENT GRID ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* AI Insights Panel */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
               <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2 bg-white/80 px-3 py-1.5 rounded-lg border border-blue-200">
                     <Sparkles className="w-4 h-4 text-blue-600" />
                     <h3 className="text-xs font-bold uppercase tracking-wider text-blue-700">AI Insights</h3>
                  </div>
                  <Link href="/dashboard/assistant" className="text-gray-500 hover:text-blue-600 text-xs font-medium flex items-center gap-1 transition-all">
                     Open Inbox <ArrowUpRight className="w-3 h-3" />
                  </Link>
               </div>

               <p className="text-gray-800 text-lg font-medium leading-relaxed mb-6">
                  &ldquo;Your audience engagement is spiking around your <span className="text-blue-600 font-semibold">Fitness Masterclass</span> content. Consider launching a flash sale to capture the 14 new leads identified today.&rdquo;
               </p>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: "New Leads", value: "14", color: "text-blue-600" },
                    { label: "Sentiment", value: "POS", color: "text-emerald-600" },
                    { label: "Unread", value: stats.newMessages, color: "text-red-500" },
                    { label: "Response", value: "2H", color: "text-gray-900" },
                  ].map((s, i) => (
                    <div key={i} className="bg-white border border-gray-200 p-4 rounded-xl flex flex-col justify-center items-center">
                       <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider mb-1">{s.label}</p>
                       <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                    </div>
                  ))}
               </div>
            </div>

            {/* Activity Feed */}
            <div className="bg-white border border-gray-200 rounded-2xl p-8">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900">Activity Feed</h3>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
               </div>
               <div className="space-y-3">
                  {[
                    { title: "Optimize Mobile Template", desc: "Mobile conversion is 15% lower than desktop.", icon: Bot, status: "Suggested", color: "text-blue-600", bg: "bg-blue-50" },
                    { title: "Upcoming: Yoga Masterclass", desc: "Starts in 2 days. 45/50 slots filled.", icon: Calendar, status: "Urgent", color: "text-red-500", bg: "bg-red-50" },
                    { title: "Product Sync Completed", desc: "Digital assets pushed to public profile.", icon: ShoppingBag, status: "Done", color: "text-emerald-600", bg: "bg-emerald-50" },
                  ].map((task, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 hover:bg-white transition-all">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600">
                             <task.icon className="w-5 h-5" />
                          </div>
                          <div>
                             <p className="text-sm font-semibold text-gray-900">{task.title}</p>
                             <p className="text-xs text-gray-500">{task.desc}</p>
                          </div>
                       </div>
                       <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md ${task.bg} ${task.color}`}>
                          {task.status}
                       </span>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* Side Quick Actions */}
         <div className="space-y-6">
             <div className="bg-white p-6 rounded-2xl border border-gray-200">
               <h3 className="text-base font-bold text-gray-900 mb-4">Quick Actions</h3>
               <RoleQuickActions role={role} />
             </div>

             <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl border border-blue-500/20 p-8 text-white">
                <h3 className="text-xs font-bold uppercase tracking-wider mb-3 text-blue-200">Your Profile Hub</h3>
                <p className="text-lg font-semibold leading-snug mb-6">
                  Share your profile link to start funneling traffic and growing your audience.
                </p>
                <Link href="/dashboard/appearance" className="bg-white text-blue-700 px-5 py-3 rounded-xl font-semibold text-sm hover:bg-blue-50 transition-all inline-flex items-center justify-center gap-2 w-full">
                   Customize Profile <ArrowUpRight className="w-4 h-4" />
                </Link>
             </div>
          </div>

      </div>
    </div>
  );
}
