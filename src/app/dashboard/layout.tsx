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
  { href: "/dashboard/store",      icon: ShoppingCart, label: "Mini Store",       group: "commerce", roles: ["USER"], badge: "Elite", badgeColor: "bg-indigo-500 text-white" },
  { href: "/dashboard/events",     icon: Calendar,     label: "Event Hub",        group: "commerce", roles: ["USER"] },
  { href: "/dashboard/bookings",   icon: Phone,        label: "Bookings & Calls", group: "commerce", roles: ["USER"], badge: "Pro" },
  { href: "/dashboard/promo",      icon: Tag,          label: "Discount Engine",  group: "commerce", roles: ["USER"], badge: "Pro" },
  { href: "/dashboard/assistant",  icon: Bot,          label: "AI Assistant",     group: "main", roles: ["USER"], badge: "New" },
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

// Combine items for the actual sidebar mapping logic below
const sidebarItems: any[] = [...creatorItems, ...agencyItems, ...adminItems];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">("mobile");
  const { theme, setTheme, resolvedTheme } = useTheme();

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

  // ── Role-based sidebar filtering (must be before any early returns for hooks rule) ──
  const roleConfig = useMemo(() => getSidebarConfigForRole(userProfile?.profileRole || "personal_brand"), [userProfile?.profileRole]);
  const planInfo = useMemo(() => getUserPlanInfo({ plan: userProfile?.plan || "FREE", trialEndsAt: userProfile?.trialEndsAt }), [userProfile?.plan, userProfile?.trialEndsAt]);
  const dashConfig = useMemo(() => getRoleDashboardConfig(userProfile?.profileRole || "personal_brand"), [userProfile?.profileRole]);

  // Filter commerce items based on role
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
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isProfileEditor = pathname === "/dashboard" || pathname === "/dashboard/links" || pathname === "/dashboard/appearance";

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden fixed inset-0 font-sans">
      
      {/* ── COLUMN 1: LEFT NAVIGATION ── */}
      <aside className={`absolute lg:static inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        {/* Brand Logo */}
        <div className="px-5 pt-5 pb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm group-hover:bg-[#5E5CE6] transition-colors">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black text-slate-900 tracking-tight group-hover:text-[#5E5CE6] transition-colors">getprofile.link</span>
          </Link>
          <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
          <div className="space-y-1 mb-6">
            {sidebarItems
              .filter(i => i.group === "main" && i.roles.includes(userProfile.role))
              .map(item => {
                const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                      isActive ? "bg-slate-900 text-white shadow-md shadow-slate-900/20" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                    }`}>
                    <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                    <span className="truncate">{item.href === "/dashboard/assistant" ? dashConfig.sidebar.assistant : item.href === "/dashboard/analytics" ? dashConfig.sidebar.analytics : item.label}</span>
                    {item.badge && (
                      <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ml-auto ${isActive ? "bg-white/20 text-white" : "bg-emerald-100 text-emerald-600"}`}>
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
              <p className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Agency Management</p>
              <div className="space-y-1 mb-6">
                {sidebarItems
                  .filter(i => i.group === "agency" && i.roles.includes(userProfile.role))
                  .map(item => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                          isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        }`}>
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
              </div>
            </>
          )}

          {/* ADMIN SECTION */}
          {userProfile.role === "ADMIN" && (
            <>
              <p className="px-4 text-[10px] font-black uppercase text-[#5E5CE6] tracking-widest mb-3">Master Admin</p>
              <div className="space-y-1 mb-6">
                {sidebarItems
                  .filter(i => i.group === "admin" && i.roles.includes(userProfile.role))
                  .map(item => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                          isActive ? "bg-[#5E5CE6] text-white shadow-md shadow-[#5E5CE6]/20" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        }`}>
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-slate-400"}`} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
              </div>
            </>
          )}

          {/* CREATOR COMMERCE SECTION — Role-filtered */}
          {userProfile.role === "USER" && visibleCommerceItems.length > 0 && (
            <>
              <p className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">Commerce Hub</p>
              <div className="space-y-1 mb-6">
                {visibleCommerceItems.map(item => {
                    const isActive = pathname.startsWith(item.href);
                    const isProFeature = item.badge === "Pro";
                    const isLocked = isProFeature && !planInfo.isPro;
                    return (
                      <Link key={item.href} href={isLocked ? "/dashboard/settings" : item.href} onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                          isLocked ? "text-slate-300 hover:text-slate-400 cursor-not-allowed" :
                          isActive ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/20" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
                        }`}>
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isLocked ? "text-slate-300" : isActive ? "text-white" : "text-slate-400"}`} />
                        <span className="flex-1 truncate">{item.href === "/dashboard/store" ? dashConfig.sidebar.store : item.href === "/dashboard/events" ? dashConfig.sidebar.events : item.href === "/dashboard/bookings" ? dashConfig.sidebar.bookings : item.href === "/dashboard/promo" ? dashConfig.sidebar.promo : item.label}</span>
                        {isLocked ? (
                          <Lock className="w-3 h-3 text-slate-300 ml-auto" />
                        ) : item.badge && (
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ml-auto ${item.badgeColor || "bg-indigo-500 text-white"}`}>
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

        {/* Bottom Actions — Pro-gated AI Assistant */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-2 bg-slate-50">
          <Link href={planInfo.isPro ? "/dashboard/assistant" : "/dashboard/settings"} className="flex items-center gap-3 bg-white p-3 rounded-2xl border shadow-sm hover:shadow-md transition-shadow group mb-2 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-[#5E5CE6]/10 to-[#34C759]/10 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#5E5CE6] to-[#0A84FF] flex items-center justify-center text-white relative z-10 shadow-lg shadow-[#5E5CE6]/30">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="relative z-10 flex-1">
              <div className="text-[13px] font-bold text-slate-900">{dashConfig.sidebar.assistant}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                {planInfo.isPro ? "Ask Anything" : "Pro Feature"}
              </div>
            </div>
            {!planInfo.isPro && <Lock className="w-3.5 h-3.5 text-slate-300 relative z-10" />}
            {planInfo.isPro && planInfo.isTrialActive && (
              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 text-amber-600 relative z-10">
                {planInfo.trialDaysLeft}d trial
              </span>
            )}
          </Link>
          <Link href="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
              pathname === "/dashboard/settings" ? "bg-slate-900 text-white shadow-md" : "text-slate-500 hover:text-slate-900 hover:bg-slate-100"
            }`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span>Settings</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-slate-400 hover:text-rose-500 transition-colors">
            <LogOut className="w-4 h-4" /> Logout securely
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-white">
        
        {/* Managed Header Banner */}
        {userProfile.role === "AGENCY" && userProfile.id !== (session?.user as any)?.id && (
           <div className="bg-slate-900 border-b border-white/10 px-6 py-2.5 flex items-center justify-between animate-slide-down shrink-0">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_#6366f1]" />
                 <p className="text-[11px] font-black uppercase tracking-widest text-white">
                    Currently Managing: <span className="text-indigo-400">{userProfile.name || userProfile.username}</span>
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
                 className="text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-white transition-colors"
              >
                 Exit Context ×
              </button>
           </div>
        )}

        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-30 flex-shrink-0 shadow-sm relative">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest bg-slate-100 px-2 rounded-md">Live Domain</span>
              <a href={`/${userProfile.username}`} target="_blank" rel="noopener noreferrer" 
                 className="text-sm font-bold text-slate-700 hover:text-[#5E5CE6] transition-colors flex items-center gap-2 break-normal">
                getprofile.link/<span className="text-black font-black">{userProfile.username}</span> <ExternalLink className="w-3.5 h-3.5 opacity-50" />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 bg-black text-white px-4 py-1.5 rounded-full text-xs font-bold hover:shadow-lg hover:-translate-y-0.5 transition-all">
              <Plus className="w-3.5 h-3.5" /> Share
            </button>
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              aria-label="Toggle dark mode"
            >
              {resolvedTheme === "dark"
                ? <Sun className="w-4 h-4 text-amber-400" />
                : <Moon className="w-4 h-4" />}
            </button>
            <NotificationCenter />
            <div className="w-9 h-9 bg-slate-200 rounded-full flex items-center justify-center text-slate-600 font-bold shadow-inner cursor-pointer hover:ring-2 ring-[#5E5CE6] ring-offset-2 transition-all">
              {userProfile?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Dynamic Split Layout */}
        <div className="flex-1 overflow-hidden flex relative w-full h-full bg-[#F8FAFC]">
          
          {/* If we are NOT in the profile editor (e.g. Analytics, Agency), the CHILDREN takes the center full width! */}
          {!isProfileEditor && (
            <div className="flex-1 overflow-y-auto p-6 sm:p-10 custom-scrollbar">
              <div className="max-w-6xl mx-auto h-full w-full">
                 {children}
              </div>
            </div>
          )}

          {/* If we ARE in the profile editor, activate the 10/10 3-Column architecture! */}
          {isProfileEditor && (
             <>
               {/* COLUMN 2: CENTER LIVE PREVIEW (Interactive Mockup) */}
               <div className="flex-1 h-full hidden lg:flex flex-col relative border-r border-slate-200 isolation-auto">
                  
                  {/* Floating Toggle: Mobile vs Web */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center bg-white border border-slate-200 p-1.5 rounded-full shadow-xl z-20 hover:scale-105 transition-transform duration-300">
                     <button 
                       onClick={() => setPreviewMode("mobile")}
                       className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                         previewMode === "mobile" ? "bg-black text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
                       }`}>
                       Mobile
                     </button>
                     <button 
                       onClick={() => setPreviewMode("desktop")}
                       className={`px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                         previewMode === "desktop" ? "bg-black text-white shadow-lg" : "text-slate-400 hover:text-slate-900"
                       }`}>
                       Web Page
                     </button>
                  </div>

                  {/* The actual live iFrame renderer */}
                  <div className="flex-1 w-full h-full flex items-center justify-center p-12 overflow-hidden mt-10">
                     <div className={`relative transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                       previewMode === "mobile" 
                       ? "w-[360px] h-[740px] rounded-[55px] border-[12px] border-slate-900 shadow-2xl bg-white scale-100" 
                       : "w-[95%] h-[85%] rounded-[30px] border border-slate-300 shadow-2xl bg-white transform translate-y-4"
                     }`}>
                        
                        {/* Dynamic Island for mobile view to look ultra-premium */}
                        {previewMode === "mobile" && (
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-slate-900 rounded-[20px] z-20 flex items-center justify-between px-3 shadow-inner">
                            <div className="w-3.5 h-3.5 rounded-full bg-black shadow-[inset_0_0_2px_rgba(255,255,255,0.1)] border border-white/5"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]"></div>
                          </div>
                        )}

                        {/* Top Browser Bar for Web view */}
                        {previewMode === "desktop" && (
                          <div className="absolute top-0 left-0 w-full h-12 bg-slate-100 border-b border-slate-200 z-20 rounded-t-[30px] flex items-center px-6 gap-2">
                            <div className="flex gap-1.5">
                              <div className="w-3.5 h-3.5 rounded-full bg-rose-400"></div>
                              <div className="w-3.5 h-3.5 rounded-full bg-amber-400"></div>
                              <div className="w-3.5 h-3.5 rounded-full bg-emerald-400"></div>
                            </div>
                            <div className="ml-6 px-4 py-1.5 bg-white text-[10px] font-mono text-slate-400 rounded-lg shadow-sm border border-slate-200 flex-1 max-w-sm flex items-center gap-2">
                               <Globe className="w-3 h-3" /> getprofile.link/{userProfile.username}
                            </div>
                          </div>
                        )}

                        <div className={`w-full h-full relative overflow-hidden bg-white ${previewMode === "mobile" ? "rounded-[42px]" : "rounded-[29px] pt-12"}`}>
                           {/* Intentionally using an iframe to the public profile to ensure true live rendering! */}
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

               {/* COLUMN 3: RIGHT CONTEXTUAL EDITOR (Where {children} renders!) */}
               <div className="w-full lg:w-[480px] xl:w-[500px] h-full bg-white flex-shrink-0 flex flex-col z-20 shadow-[-20px_0_40px_rgba(0,0,0,0.03)] relative">
                  <div className="flex-1 overflow-y-auto w-full custom-scrollbar">
                     <div className="p-6 md:p-8 space-y-8 min-h-full">
                       {/* This is the magic. The active form directly mounts here. */}
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
