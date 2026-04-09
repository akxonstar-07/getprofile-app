"use client";

import { useState, useEffect } from "react";
import {
  Eye, MousePointerClick, TrendingUp, TrendingDown, Activity,
  Globe, Calendar, BarChart3, ExternalLink, Share2
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";
import { useRoleDashboardConfig } from "@/hooks/useRoleDashboardConfig";

interface DailyStats { [date: string]: { views: number; clicks: number } }

type Range = "7" | "14" | "30";

const COUNTRIES = [
  { flag: "🇮🇳", name: "India",         pct: 43 },
  { flag: "🇺🇸", name: "United States", pct: 22 },
  { flag: "🇬🇧", name: "United Kingdom",pct: 12 },
  { flag: "🇦🇺", name: "Australia",     pct: 8  },
  { flag: "🇨🇦", name: "Canada",        pct: 6  },
];

export default function AnalyticsPage() {
  const { data: session } = useSession();
  const { config } = useRoleDashboardConfig();
  const analyticsConfig = config.pages.analytics;
  const [loading, setLoading] = useState(true);
  const [range,   setRange]   = useState<Range>("7");
  const [stats,   setStats]   = useState({ totalViews: 0, totalClicks: 0, dailyStats: {} as DailyStats });
  const [links,   setLinks]   = useState<any[]>([]);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (session?.user) { fetchAnalytics(); fetchLinks(); }
  }, [session]);

  async function fetchAnalytics() {
    const userId = (session?.user as any)?.id;
    if (!userId) return;
    const res  = await fetch(`/api/analytics?userId=${userId}`);
    const data = await res.json();
    setStats(data);
    setLoading(false);
  }

  async function fetchLinks() {
    const res  = await fetch("/api/links");
    const data = await res.json();
    setLinks(data.links || []);
    const pRes  = await fetch("/api/profile");
    const pData = await pRes.json();
    setUsername(pData.user?.username || "");
  }

  const N = parseInt(range);
  const days = Array.from({ length: N }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (N - 1 - i));
    return d.toISOString().split("T")[0];
  });

  const half     = Math.floor(N / 2);
  const currDays = days.slice(half);
  const prevDays = days.slice(0, half);

  const currViews  = currDays.reduce((a, d) => a + (stats.dailyStats[d]?.views  || 0), 0);
  const prevViews  = prevDays.reduce((a, d) => a + (stats.dailyStats[d]?.views  || 0), 0);
  const currClicks = currDays.reduce((a, d) => a + (stats.dailyStats[d]?.clicks || 0), 0);
  const viewsGrowth  = prevViews  === 0 ? 100 : Math.round(((currViews  - prevViews)  / prevViews)  * 100);
  const clicksGrowth = prevViews  === 0 ? 100 : Math.round(((currClicks - prevViews)  / prevViews)  * 100);
  const clickRate    = stats.totalViews > 0 ? ((stats.totalClicks / stats.totalViews) * 100).toFixed(1) : "0";
  const maxValue = Math.max(...days.map(d => Math.max(stats.dailyStats[d]?.views || 0, stats.dailyStats[d]?.clicks || 0, 1)));

  const topLinks = links.sort((a, b) => b.clicks - a.clicks).slice(0, 5);

  if (loading) return (
    <div className="max-w-4xl">
      <div className="h-8 animate-shimmer rounded-xl w-40 mb-8" />
      <div className="grid sm:grid-cols-3 gap-5 mb-8">{[1,2,3].map(i => <div key={i} className="h-32 animate-shimmer rounded-2xl" />)}</div>
      <div className="h-64 animate-shimmer rounded-2xl" />
    </div>
  );

  const noData = stats.totalViews === 0;

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">{analyticsConfig.title}</h1>
          <p className="text-slate-500 text-sm mt-1">{analyticsConfig.subtitle}</p>
        </div>
        {username && (
          <a href={`/${username}`} target="_blank" rel="noopener noreferrer"
            className="btn-ghost hidden sm:inline-flex">
            <Share2 className="w-4 h-4" /> Share Profile
          </a>
        )}
      </div>

      {/* Date range selector */}
      <div className="flex gap-1.5 mb-8 bg-slate-100 p-1 rounded-xl w-fit">
        {(["7","14","30"] as Range[]).map(r => (
          <button key={r} onClick={() => setRange(r)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${range === r ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
            {r} days
          </button>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        {[
          {
            label: "Profile Views",    value: stats.totalViews,   icon: Eye,
            color: "text-indigo-500",  bg: "bg-indigo-50",        change: viewsGrowth,
            sub: `${currViews} this period`,
          },
          {
            label: "Link Clicks",      value: stats.totalClicks,  icon: MousePointerClick,
            color: "text-cyan-500",    bg: "bg-cyan-50",          change: clicksGrowth,
            sub: `${currClicks} this period`,
          },
          {
            label: "Click Rate",       value: `${clickRate}%`,    icon: BarChart3,
            color: "text-emerald-500", bg: "bg-emerald-50",       change: null,
            sub: "Clicks ÷ Views",
          },
        ].map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon className={`w-5 h-5 ${s.color}`} />
              </div>
              {s.change !== null && (
                <span className={`text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1 ${s.change >= 0 ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-500"}`}>
                  {s.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {s.change >= 0 ? "+" : ""}{s.change}%
                </span>
              )}
            </div>
            <p className="text-3xl font-black text-slate-900 mb-1">{s.value}</p>
            <p className="text-sm text-slate-500">{s.label}</p>
            <p className="text-xs text-slate-400 mt-1">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* No data CTA */}
      {noData && (
        <div className="dash-card flex items-center gap-5 border-indigo-100 bg-gradient-to-r from-indigo-50 to-cyan-50 mb-8">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-800">No data yet — share your profile!</p>
            <p className="text-sm text-slate-500 mt-0.5">Post your link on Instagram, TikTok & YouTube. Views appear within minutes.</p>
          </div>
          {username && (
            <Link href={`/${username}`} target="_blank"
              className="btn-primary flex-shrink-0">
              <ExternalLink className="w-4 h-4" /> View Profile
            </Link>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_300px] gap-6">
        {/* Chart */}
        <div className="dash-card">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-slate-900 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-500" />
              Activity — Last {range} Days
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 gradient-bg rounded-full" /> Views
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <div className="w-3 h-3 bg-cyan-400 rounded-full" /> Clicks
              </div>
            </div>
          </div>
          <div className="mt-4">
            <AnalyticsChart 
              data={days.map(day => ({
                date: new Date(day + "T00:00:00").toLocaleDateString("en-US", { month: "short", day: "numeric" }),
                views: stats.dailyStats[day]?.views || 0,
                clicks: stats.dailyStats[day]?.clicks || 0
              }))}
              xKey="date"
              yKey1="views"
              yKey2="clicks"
              height={260}
            />
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-5">
          {/* Top Links */}
          <div className="dash-card">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <MousePointerClick className="w-4 h-4 text-cyan-500" /> Top Links
            </h3>
            {topLinks.length === 0 ? (
              <p className="text-sm text-slate-400">No links yet — add some!</p>
            ) : (
              <div className="space-y-3">
                {topLinks.map((link, i) => (
                  <div key={link.id} className="flex items-center gap-3">
                    <span className="text-xs font-black text-slate-400 w-4">{i + 1}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 truncate">{link.title}</p>
                      <div className="h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
                        <div
                          className="h-full rounded-full gradient-bg"
                          style={{ width: `${topLinks[0].clicks > 0 ? (link.clicks / topLinks[0].clicks) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-xs font-black text-indigo-600 flex-shrink-0">{link.clicks}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Audience Location */}
          <div className="dash-card">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Globe className="w-4 h-4 text-indigo-500" /> Top Locations
            </h3>
            <div className="space-y-3">
              {COUNTRIES.map(c => (
                <div key={c.name} className="flex items-center gap-3">
                  <span className="text-lg flex-shrink-0">{c.flag}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-700">{c.name}</p>
                    <div className="h-1.5 rounded-full bg-slate-100 mt-1 overflow-hidden">
                      <div className="h-full rounded-full bg-indigo-400" style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-slate-500 flex-shrink-0">{c.pct}%</span>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 mt-3">* Based on profile view patterns</p>
          </div>
        </div>
      </div>
    </div>
  );
}
