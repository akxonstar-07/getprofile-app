"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useMemo } from "react";
import {
  Search, User, MessageCircle, BarChart3, Building2,
  DollarSign, ShoppingBag, DownloadCloud,
  GraduationCap, Bot, Users, Globe, LogOut, Menu, X, Plus, Sparkles, ExternalLink,
  Layers, Palette, ShoppingCart, Calendar, Activity, Settings, Shield, ShieldCheck,
  Tag, Phone, Lock, Crown, Sun, Moon
} from "lucide-react";
import { getSidebarConfigForRole } from "@/lib/role-sidebar-map";
import { getUserPlanInfo } from "@/lib/plan-guard";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import { getRoleDashboardConfig } from "@/lib/role-dashboard-config";
import { useTheme } from "@/components/providers/ThemeProvider";

const creatorItems = [
  { href: "/dashboard",            icon: BarChart3,    label: "Overview",         group: "main", roles: ["USER"] },
  { href: "/dashboard/links",      icon: Layers,       label: "Bio-Hub Editor",   group: "main", roles: ["USER"] },
  { href: "/dashboard/appearance", icon: Palette,      label: "Appearance",       group: "main", roles: ["USER"] },
  { href: "/dashboard/store",      icon: ShoppingCart, label: "Mini Store",       group: "commerce", roles: ["USER"], badge: "Elite", badgeColor: "bg-[#D2FF00] text-black" },
  { href: "/dashboard/events",     icon: Calendar,     label: "Event Hub",        group: "commerce", roles: ["USER"] },
  { href: "/dashboard/bookings",   icon: Phone,        label: "Bookings & Calls", group: "commerce", roles: ["USER"], badge: "Pro", badgeColor: "bg-white text-black" },
  { href: "/dashboard/promo",      icon: Tag,          label: "Discount Engine",  group: "commerce", roles: ["USER"], badge: "Pro", badgeColor: "bg-white text-black" },
  { href: "/dashboard/assistant",  icon: Bot,          label: "AI Assistant",     group: "main", roles: ["USER"], badge: "New", badgeColor: "bg-purple-500 text-white" },
  { href: "/dashboard/analytics",  icon: Activity,     label: "Insights",         group: "main", roles: ["USER"] },
  { href: "/dashboard/settings",   icon: Settings,     label: "Settings",         group: "bottom", roles: ["USER"] },
];

const agencyItems = [
  { href: "/dashboard/agency",     icon: Building2,    label: "Agency Command", group: "agency", roles: ["AGENCY", "ADMIN"] },
  { href: "/dashboard/agency/creators", icon: Users,   label: "Talent Roster",  group: "agency", roles: ["AGENCY"] },
];

const adminItems = [
  { href: "/dashboard/admin",      icon: ShieldCheck,  label: "Admin Center",   group: "admin", roles: ["ADMIN"] },
  { href: "/dashboard/admin/workforce", icon: Bot,     label: "AI Workforce",   group: "admin", roles: ["ADMIN"] },
];

const sidebarItems: any[] = [...creatorItems, ...agencyItems, ...adminItems];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  
  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (session?.user) {
      fetch("/api/profile").then(r => r.json()).then(d => {
        if (d.user) {
          if (!d.user.onboardingCompleted) {
            router.push("/onboarding");
          } else {
            setUserProfile(d.user);
          }
        }
      }).catch(() => {});
    }
  }, [session, router]);

  const roleConfig = useMemo(() => getSidebarConfigForRole(userProfile?.profileRole || "personal_brand"), [userProfile?.profileRole]);
  const planInfo = useMemo(() => getUserPlanInfo({ plan: userProfile?.plan || "FREE", trialEndsAt: userProfile?.trialEndsAt }), [userProfile?.plan, userProfile?.trialEndsAt]);
  const dashConfig = useMemo(() => getRoleDashboardConfig(userProfile?.profileRole || "personal_brand"), [userProfile?.profileRole]);

  const visibleCommerceItems = useMemo(() => {
    return sidebarItems.filter(i => {
      if (i.group !== "commerce") return false;
      if (i.href === "/dashboard/store" && !roleConfig.showStore) return false;
      if (i.href === "/dashboard/events" && !roleConfig.showEvents) return false;
      if (i.href === "/dashboard/bookings" && !roleConfig.showBookings) return false;
      if (i.href === "/dashboard/promo" && !roleConfig.showPromo) return false;
      return true;
    });
  }, [roleConfig]);

  if (status === "loading" || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#050505]">
        <div className="w-16 h-16 border-[6px] border-white/10 border-t-[#D2FF00] rounded-full animate-spin" />
      </div>
    );
  }

  const isProfileEditor = pathname === "/dashboard" || pathname === "/dashboard/links" || pathname === "/dashboard/appearance";

  return (
    <div className="min-h-screen bg-[#000000] text-white flex overflow-hidden fixed inset-0 font-sans selection:bg-[#D2FF00] selection:text-black">
      
      {/* ── COLUMN 1: LEFT NAVIGATION (Dark Mode Neo-Brutalist) ── */}
      <aside className={`absolute lg:static inset-y-0 left-0 z-50 w-[260px] bg-[#050505] border-r border-white/10 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* Brand Logo */}
        <div className="px-6 pt-8 pb-8 flex items-center justify-between border-b border-white/5">
          <Link href="/" className="flex items-center gap-3 group opacity-80 hover:opacity-100 transition-opacity">
            <Globe className="w-6 h-6 text-white" />
            <span className="text-xl font-komi uppercase tracking-widest text-white mt-1">getprofile</span>
          </Link>
          <button className="lg:hidden text-white/50" onClick={() => setSidebarOpen(false)}><X className="w-6 h-6" /></button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 custom-scrollbar scrollbar-dark">
          <div className="space-y-1.5 mb-8">
            {sidebarItems
              .filter(i => i.group === "main" && i.roles.includes(userProfile.role))
              .map(item => {
                const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-[14px] font-bold transition-all ${
                      isActive ? "bg-white/10 text-white border border-white/20" : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                    }`}>
                    <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-[#D2FF00]" : "text-white/40"}`} />
                    <span className="truncate tracking-wide">{item.href === "/dashboard/assistant" ? dashConfig.sidebar.assistant : item.href === "/dashboard/analytics" ? dashConfig.sidebar.analytics : item.label}</span>
                    {item.badge && (
                      <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ml-auto ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
          </div>

          {/* AGENCY SECTION */}
          {userProfile.role !== "USER" && sidebarItems.some(i => i.group === "agency" && i.roles.includes(userProfile.role)) && (
            <>
              <p className="px-4 text-[11px] font-black uppercase text-[#D2FF00] tracking-widest mb-3">Agency Management</p>
              <div className="space-y-1.5 mb-8">
                {sidebarItems
                  .filter(i => i.group === "agency" && i.roles.includes(userProfile.role))
                  .map(item => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-[14px] font-bold transition-all ${
                          isActive ? "bg-[#D2FF00] text-black border border-[#D2FF00]" : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                        }`}>
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-black" : "text-white/40"}`} />
                        <span className="truncate tracking-wide">{item.label}</span>
                      </Link>
                    );
                  })}
              </div>
            </>
          )}

          {/* ADMIN SECTION */}
          {userProfile.role === "ADMIN" && (
            <>
              <p className="px-4 text-[11px] font-black uppercase text-rose-500 tracking-widest mb-3">Master Admin</p>
              <div className="space-y-1.5 mb-8">
                {sidebarItems
                  .filter(i => i.group === "admin" && i.roles.includes(userProfile.role))
                  .map(item => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-[14px] font-bold transition-all ${
                          isActive ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20" : "text-white/50 hover:text-white hover:bg-white/5"
                        }`}>
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-white/40"}`} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
              </div>
            </>
          )}

          {/* CREATOR COMMERCE SECTION */}
          {userProfile.role === "USER" && visibleCommerceItems.length > 0 && (
            <>
              <p className="px-4 text-[11px] font-black uppercase text-[#D2FF00] tracking-widest mb-3">Commerce Hub</p>
              <div className="space-y-1.5 mb-6">
                {visibleCommerceItems.map(item => {
                    const isActive = pathname.startsWith(item.href);
                    const isProFeature = item.badge === "Pro";
                    const isLocked = isProFeature && !planInfo.isPro;
                    return (
                      <Link key={item.href} href={isLocked ? "/dashboard/settings" : item.href} onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-[14px] font-bold transition-all ${
                          isLocked ? "text-white/20 hover:text-white/30 cursor-not-allowed" :
                          isActive ? "bg-white/10 text-white border border-white/20" : "text-white/50 hover:text-white hover:bg-white/5 border border-transparent"
                        }`}>
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isLocked ? "text-white/20" : isActive ? "text-[#D2FF00]" : "text-white/40"}`} />
                        <span className="flex-1 truncate tracking-wide">{item.href === "/dashboard/store" ? dashConfig.sidebar.store : item.href === "/dashboard/events" ? dashConfig.sidebar.events : item.href === "/dashboard/bookings" ? dashConfig.sidebar.bookings : item.href === "/dashboard/promo" ? dashConfig.sidebar.promo : item.label}</span>
                        {isLocked ? (
                          <Lock className="w-3.5 h-3.5 text-white/20 ml-auto" />
                        ) : item.badge && (
                          <span className={`text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded-full ml-auto ${item.badgeColor || "bg-[#D2FF00] text-black"}`}>
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    );
                  })}
              </div>
            </>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-white/5 flex flex-col gap-2 bg-[#050505]">
          <Link href={planInfo.isPro ? "/dashboard/assistant" : "/dashboard/settings"} className="flex items-center gap-3 bg-gradient-to-br from-[#1A0B2E] to-[#110620] p-4 rounded-2xl border border-[#D2FF00]/30 shadow-[0_0_15px_rgba(210,255,0,0.05)] hover:border-[#D2FF00] transition-colors group mb-2 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-[#D2FF00] flex items-center justify-center text-black relative z-10">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="relative z-10 flex-1">
              <div className="text-[14px] font-bold text-white tracking-wide">{dashConfig.sidebar.assistant}</div>
              <div className="text-[10px] font-black text-[#D2FF00] uppercase tracking-widest">
                {planInfo.isPro ? "Ask Anything" : "Pro Feature"}
              </div>
            </div>
            {!planInfo.isPro && <Lock className="w-4 h-4 text-[#D2FF00]/50 relative z-10" />}
            {planInfo.isPro && planInfo.isTrialActive && (
              <span className="text-[10px] font-black tracking-widest px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/50 uppercase">
                {planInfo.trialDaysLeft}D TRIAL
              </span>
            )}
          </Link>
          <Link href="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-3 rounded-2xl text-[14px] font-bold transition-all ${
              pathname === "/dashboard/settings" ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
            }`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span className="tracking-wide">Settings</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 px-3 py-3 rounded-2xl text-[14px] font-bold text-rose-500/70 hover:text-rose-500 hover:bg-rose-500/10 transition-colors">
            <LogOut className="w-4 h-4" /> <span className="tracking-wide">End Session</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#0a0a0a]">
        
        {/* Managed Header Banner */}
        {userProfile.role === "AGENCY" && userProfile.id !== (session?.user as any)?.id && (
           <div className="bg-[#D2FF00] border-b border-black/10 px-6 py-2.5 flex items-center justify-between animate-slide-down shrink-0 text-black">
              <div className="flex items-center gap-3">
                 <div className="w-2.5 h-2.5 rounded-full bg-black animate-pulse" />
                 <p className="text-[11px] font-black uppercase tracking-widest">
                    OVERRIDE ACTIVE | MANAGING: <span className="text-black/60">{userProfile.name || userProfile.username}</span>
                 </p>
              </div>
              <button 
                 onClick={async () => {
                   await fetch("/api/agency/manage", {
                     method: "POST",
                     headers: { "Content-Type": "application/json" },
                     body: JSON.stringify({ creatorId: null })
                   });
                   window.location.reload();
                 }}
                 className="text-[10px] font-black uppercase tracking-widest text-black/60 hover:text-black transition-colors bg-white/20 px-3 py-1 rounded-full"
              >
                 TERMINATE SESSION ×
              </button>
           </div>
        )}

        {/* Top Header */}
        <header className="h-20 bg-[#050505] border-b border-white/5 flex items-center justify-between px-8 z-30 flex-shrink-0 relative">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden sm:flex flex-col">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest mb-1">Production URL</span>
              <a href={`/${userProfile.username}`} target="_blank" rel="noopener noreferrer" 
                 className="text-sm font-bold text-white/70 hover:text-[#D2FF00] transition-colors flex items-center gap-2">
                getprofile.link/<span className="text-white font-black">{userProfile.username}</span> <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-5">
            <button className="hidden md:flex items-center gap-2 bg-white text-black px-6 py-2.5 rounded-full text-xs font-black tracking-widest uppercase hover:bg-[#D2FF00] transition-colors">
              <Plus className="w-4 h-4" /> SHARE
            </button>
            <NotificationCenter />
            <div className="w-10 h-10 bg-gradient-to-br from-[#1A0B2E] to-[#2B1556] border border-[#D2FF00]/50 rounded-full flex items-center justify-center text-[#D2FF00] font-black font-komi text-xl shadow-[0_0_10px_rgba(210,255,0,0.2)] cursor-pointer hover:scale-105 transition-transform">
              {userProfile?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Dynamic Split Layout */}
        <div className="flex-1 overflow-hidden flex relative w-full h-full bg-[#0a0a0a]">
          
          {/* Dashboard Mode */}
          {!isProfileEditor && (
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar scrollbar-dark">
              <div className="max-w-6xl mx-auto h-full w-full">
                 {children}
              </div>
            </div>
          )}

          {/* Profile Editor Mode */}
          {isProfileEditor && (
             <>
               {/* COLUMN 2: CENTER LIVE PREVIEW */}
               <div className="flex-1 h-full hidden lg:flex flex-col relative border-r border-white/5 bg-[#050505]">
                  
                  {/* Floating Toggle */}
                  <div className="absolute top-8 left-1/2 -translate-x-1/2 flex items-center bg-[#111] border border-white/10 p-1.5 rounded-full z-20 shadow-2xl">
                     <button 
                       onClick={() => setPreviewMode("mobile")}
                       className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                         previewMode === "mobile" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                       }`}>
                       MOBILE
                     </button>
                     <button 
                       onClick={() => setPreviewMode("desktop")}
                       className={`px-8 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all ${
                         previewMode === "desktop" ? "bg-white text-black shadow-lg" : "text-white/40 hover:text-white"
                       }`}>
                       WEB PAGE
                     </button>
                  </div>

                  {/* iFrame Renderer */}
                  <div className="flex-1 w-full h-full flex items-center justify-center p-12 overflow-hidden mt-6">
                     <div className={`relative transition-all duration-700 ease-out ${
                       previewMode === "mobile" 
                       ? "w-[360px] h-[740px] rounded-[55px] border-[14px] border-[#1a1a1a] shadow-[0_0_60px_rgba(0,0,0,0.8)] bg-black scale-100" 
                       : "w-[95%] h-[85%] rounded-[30px] border border-white/10 shadow-2xl bg-black transform translate-y-4"
                     }`}>
                        
                        {/* Dynamic Island for mobile */}
                        {previewMode === "mobile" && (
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-[20px] z-20 flex items-center justify-between px-3">
                            <div className="w-3.5 h-3.5 rounded-full bg-[#111] border border-white/10"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]"></div>
                          </div>
                        )}

                        {/* Browser Bar for Web */}
                        {previewMode === "desktop" && (
                          <div className="absolute top-0 left-0 w-full h-14 bg-[#111] border-b border-white/10 z-20 rounded-t-[30px] flex items-center px-6 gap-3">
                            <div className="flex gap-2">
                              <div className="w-3.5 h-3.5 rounded-full bg-rose-500"></div>
                              <div className="w-3.5 h-3.5 rounded-full bg-amber-500"></div>
                              <div className="w-3.5 h-3.5 rounded-full bg-emerald-500"></div>
                            </div>
                            <div className="ml-6 px-4 py-2 bg-black text-[11px] font-mono font-bold text-white/50 rounded-xl flex-1 max-w-sm flex items-center gap-2">
                               <Globe className="w-3.5 h-3.5" /> getprofile.link/{userProfile.username}
                            </div>
                          </div>
                        )}

                        <div className={`w-full h-full relative overflow-hidden bg-black ${previewMode === "mobile" ? "rounded-[41px]" : "rounded-[29px] pt-14"}`}>
                           <iframe 
                             id="preview-iframe"
                             src={`/${userProfile.username}?preview=true&view=${previewMode === "desktop" ? "web" : "mobile"}`} 
                             className="w-full h-full border-0 absolute inset-0" 
                             sandbox="allow-scripts allow-same-origin allow-popups"
                             style={{ touchAction: "pan-y" }}
                           />
                        </div>
                     </div>
                  </div>
               </div>

               {/* COLUMN 3: RIGHT CONTEXTUAL EDITOR */}
               <div className="w-full lg:w-[480px] xl:w-[500px] h-full bg-[#050505] border-l border-white/5 flex-shrink-0 flex flex-col z-20 relative">
                  <div className="flex-1 overflow-y-auto w-full custom-scrollbar scrollbar-dark">
                     <div className="p-6 md:p-10 space-y-8 min-h-full">
                       {children}
                     </div>
                  </div>
               </div>
             </>
          )}

        </div>
      </main>
    </div>
  );
}
