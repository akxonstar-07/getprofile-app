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
  Tag, Phone, Zap, MessageSquare, Link2, Hash, Gem
} from "lucide-react";
import { getSidebarConfigForRole } from "@/lib/role-sidebar-map";
import NotificationCenter from "@/components/dashboard/NotificationCenter";
import { getRoleDashboardConfig } from "@/lib/role-dashboard-config";

const creatorItems = [
  { href: "/dashboard",            icon: BarChart3,    label: "Overview",         group: "main", roles: ["USER"] },
  { href: "/dashboard/links",      icon: Layers,       label: "Bio-Hub Editor",   group: "main", roles: ["USER"] },
  { href: "/dashboard/appearance", icon: Palette,      label: "Appearance",       group: "main", roles: ["USER"] },
  { href: "/dashboard/store",      icon: ShoppingCart, label: "Mini Store",       group: "commerce", roles: ["USER"] },
  { href: "/dashboard/events",     icon: Calendar,     label: "Event Hub",        group: "commerce", roles: ["USER"] },
  { href: "/dashboard/bookings",   icon: Phone,        label: "Bookings & Calls", group: "commerce", roles: ["USER"] },
  { href: "/dashboard/promo",      icon: Tag,          label: "Discount Engine",  group: "commerce", roles: ["USER"] },
  { href: "/dashboard/credits",    icon: Gem,          label: "Creator Credits",  group: "commerce", roles: ["USER"] },
  { href: "/dashboard/assistant",  icon: Bot,          label: "AI Assistant",     group: "main", roles: ["USER"] },
  { href: "/dashboard/analytics",  icon: Activity,     label: "Insights",         group: "main", roles: ["USER"] },
  { href: "/dashboard/settings",   icon: Settings,     label: "Settings",         group: "bottom", roles: ["USER"] },
];

const automationItems = [
  { href: "/dashboard/automations",   icon: Zap,            label: "DM Automation",   group: "automation", roles: ["USER"] },
  { href: "/dashboard/channels",      icon: MessageSquare,  label: "Channels",        group: "automation", roles: ["USER"] },
  { href: "/dashboard/crm",           icon: Users,          label: "CRM Pipeline",    group: "automation", roles: ["USER"] },
  { href: "/dashboard/integrations",  icon: Link2,          label: "Integrations",    group: "automation", roles: ["USER"] },
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
const sidebarItems: any[] = [...creatorItems, ...automationItems, ...agencyItems, ...adminItems];

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
  const dashConfig = useMemo(() => getRoleDashboardConfig(userProfile?.profileRole || "personal_brand"), [userProfile?.profileRole]);

  const visibleCommerceItems = useMemo(() => {
    return sidebarItems.filter(i => {
      if (i.group !== "commerce") return false;
      if (i.href === "/dashboard/store" && !roleConfig.showStore) return false;
      if (i.href === "/dashboard/events" && !roleConfig.showEvents) return false;
      if (i.href === "/dashboard/bookings" && !roleConfig.showBookings) return false;
      if (i.href === "/dashboard/promo" && !roleConfig.showPromo) return false;
      if (i.href === "/dashboard/credits" && !roleConfig.showCredits) return false;
      return true;
    });
  }, [roleConfig]);

  const visibleAutomationItems = useMemo(() => {
    return sidebarItems.filter(i => {
      if (i.group !== "automation") return false;
      if (i.href === "/dashboard/automations" && !roleConfig.showAutoDM) return false;
      if (i.href === "/dashboard/channels" && !roleConfig.showChannels) return false;
      if (i.href === "/dashboard/crm" && !roleConfig.showCRM) return false;
      return true;
    });
  }, [roleConfig]);

  if (status === "loading" || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  const isProfileEditor = pathname === "/dashboard" || pathname === "/dashboard/links" || pathname === "/dashboard/appearance";

  return (
    <div className="min-h-screen bg-white text-gray-900 flex overflow-hidden fixed inset-0 font-sans">
      
      {/* ── COLUMN 1: LEFT NAVIGATION (Clean White Sidebar) ── */}
      <aside className={`absolute lg:static inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* Brand Logo */}
        <div className="px-6 pt-6 pb-5 flex items-center justify-between border-b border-gray-100">
          <Link href="/" className="flex items-center gap-2.5 group">
            <Globe className="w-5 h-5 text-blue-600" />
            <span className="text-lg font-black tracking-tight text-gray-900">getprofile<span className="text-blue-600">.link</span></span>
          </Link>
          <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="space-y-1 mb-6">
            {sidebarItems
              .filter(i => i.group === "main" && i.roles.includes(userProfile.role))
              .map(item => {
                const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
                return (
                  <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}>
                    <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                    <span className="truncate">{item.href === "/dashboard/assistant" ? dashConfig.sidebar.assistant : item.href === "/dashboard/analytics" ? dashConfig.sidebar.analytics : item.label}</span>
                  </Link>
                );
              })}
          </div>

          {/* AGENCY SECTION */}
          {userProfile.role !== "USER" && sidebarItems.some(i => i.group === "agency" && i.roles.includes(userProfile.role)) && (
            <>
              <p className="px-3 text-[11px] font-bold uppercase text-blue-600 tracking-wider mb-2 mt-4">Agency Management</p>
              <div className="space-y-1 mb-6">
                {sidebarItems
                  .filter(i => i.group === "agency" && i.roles.includes(userProfile.role))
                  .map(item => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}>
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-white" : "text-gray-400"}`} />
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
              <p className="px-3 text-[11px] font-bold uppercase text-red-500 tracking-wider mb-2 mt-4">Master Admin</p>
              <div className="space-y-1 mb-6">
                {sidebarItems
                  .filter(i => i.group === "admin" && i.roles.includes(userProfile.role))
                  .map(item => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive ? "bg-red-50 text-red-700 font-semibold" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}>
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-red-500" : "text-gray-400"}`} />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    );
                  })}
              </div>
            </>
          )}

          {/* COMMERCE SECTION — All unlocked */}
          {userProfile.role === "USER" && visibleCommerceItems.length > 0 && (
            <>
              <p className="px-3 text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-2 mt-4">Commerce Hub</p>
              <div className="space-y-1 mb-6">
                {visibleCommerceItems.map(item => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}>
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                        <span className="flex-1 truncate">{item.href === "/dashboard/store" ? dashConfig.sidebar.store : item.href === "/dashboard/events" ? dashConfig.sidebar.events : item.href === "/dashboard/bookings" ? dashConfig.sidebar.bookings : item.href === "/dashboard/promo" ? dashConfig.sidebar.promo : item.label}</span>
                      </Link>
                    );
                  })}
              </div>
            </>
          )}

          {/* AUTOMATION & GROWTH SECTION — All unlocked */}
          {userProfile.role === "USER" && visibleAutomationItems.length > 0 && (
            <>
              <p className="px-3 text-[11px] font-bold uppercase text-gray-400 tracking-wider mb-2 mt-4">Automation & Growth</p>
              <div className="space-y-1 mb-6">
                {visibleAutomationItems.map(item => {
                    const isActive = pathname.startsWith(item.href);
                    return (
                      <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                          isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                        }`}>
                        <item.icon className={`w-4 h-4 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-400"}`} />
                        <span className="flex-1 truncate">{item.label}</span>
                      </Link>
                    );
                  })}
              </div>
            </>
          )}
        </nav>

        {/* Bottom Actions */}
        <div className="p-3 border-t border-gray-100 flex flex-col gap-1">
          <Link href="/dashboard/assistant" className="flex items-center gap-3 bg-blue-50 p-3 rounded-xl border border-blue-100 hover:border-blue-200 transition-colors group mb-1">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-900">{dashConfig.sidebar.assistant}</div>
              <div className="text-[10px] font-medium text-blue-600">Ask Anything</div>
            </div>
          </Link>
          <Link href="/dashboard/settings"
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
              pathname === "/dashboard/settings" ? "bg-blue-50 text-blue-700" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
            }`}
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            <span>Settings</span>
          </Link>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:text-red-600 hover:bg-red-50 transition-colors">
            <LogOut className="w-4 h-4" /> <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-gray-50">
        
        {/* Managed Header Banner */}
        {userProfile.role === "AGENCY" && userProfile.id !== (session?.user as any)?.id && (
           <div className="bg-blue-600 px-6 py-2.5 flex items-center justify-between animate-slide-down shrink-0 text-white">
              <div className="flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                 <p className="text-xs font-bold uppercase tracking-wider">
                    Managing: <span className="opacity-75">{userProfile.name || userProfile.username}</span>
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
                 className="text-xs font-bold uppercase tracking-wider text-white/80 hover:text-white transition-colors bg-white/20 px-3 py-1 rounded-full"
              >
                 Exit ×
              </button>
           </div>
        )}

        {/* Top Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-30 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-gray-400 hover:text-gray-900" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex flex-col">
              <a href={`/${userProfile.username}`} target="_blank" rel="noopener noreferrer" 
                 className="text-sm font-medium text-gray-500 hover:text-blue-600 transition-colors flex items-center gap-1.5">
                getprofile.link/<span className="text-gray-900 font-bold">{userProfile.username}</span> <ExternalLink className="w-3 h-3 opacity-40" />
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="hidden md:flex items-center gap-1.5 bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
              <Plus className="w-3.5 h-3.5" /> Share
            </button>
            <NotificationCenter />
            <div className="w-9 h-9 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-sm cursor-pointer hover:ring-2 hover:ring-blue-200 transition-all">
              {userProfile?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* Dynamic Split Layout */}
        <div className="flex-1 overflow-hidden flex relative w-full h-full">
          
          {/* Dashboard Mode */}
          {!isProfileEditor && (
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              <div className="max-w-6xl mx-auto h-full w-full">
                 {children}
              </div>
            </div>
          )}

          {/* Profile Editor Mode */}
          {isProfileEditor && (
             <>
               {/* COLUMN 2: CENTER LIVE PREVIEW */}
               <div className="flex-1 h-full hidden lg:flex flex-col relative border-r border-gray-200 bg-gray-50">
                  
                  {/* Floating Toggle */}
                  <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center bg-white border border-gray-200 p-1 rounded-full z-20 shadow-sm">
                     <button 
                       onClick={() => setPreviewMode("mobile")}
                       className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                         previewMode === "mobile" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-gray-900"
                       }`}>
                       Mobile
                     </button>
                     <button 
                       onClick={() => setPreviewMode("desktop")}
                       className={`px-6 py-2 rounded-full text-xs font-bold transition-all ${
                         previewMode === "desktop" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:text-gray-900"
                       }`}>
                       Web Page
                     </button>
                  </div>

                  {/* iFrame Renderer */}
                  <div className="flex-1 w-full h-full flex items-center justify-center p-10 overflow-hidden mt-4">
                     <div className={`relative transition-all duration-700 ease-out ${
                       previewMode === "mobile" 
                       ? "w-[360px] h-[740px] rounded-[55px] border-[14px] border-gray-900 shadow-2xl bg-black" 
                       : "w-[95%] h-[85%] rounded-2xl border border-gray-200 shadow-xl bg-white"
                     }`}>
                        
                        {/* Dynamic Island for mobile */}
                        {previewMode === "mobile" && (
                          <div className="absolute top-2 left-1/2 -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-[20px] z-20 flex items-center justify-between px-3">
                            <div className="w-3.5 h-3.5 rounded-full bg-gray-800"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_4px_#10b981]"></div>
                          </div>
                        )}

                        {/* Browser Bar for Web */}
                        {previewMode === "desktop" && (
                          <div className="absolute top-0 left-0 w-full h-12 bg-gray-100 border-b border-gray-200 z-20 rounded-t-2xl flex items-center px-4 gap-2">
                            <div className="flex gap-1.5">
                              <div className="w-3 h-3 rounded-full bg-red-400"></div>
                              <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                              <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            <div className="ml-4 px-3 py-1.5 bg-white text-xs font-mono text-gray-500 rounded-lg flex-1 max-w-sm flex items-center gap-1.5 border border-gray-200">
                               <Globe className="w-3 h-3" /> getprofile.link/{userProfile.username}
                            </div>
                          </div>
                        )}

                        <div className={`w-full h-full relative overflow-hidden bg-white ${previewMode === "mobile" ? "rounded-[41px]" : "rounded-2xl pt-12"}`}>
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
               <div className="w-full lg:w-[480px] xl:w-[500px] h-full bg-white border-l border-gray-200 flex-shrink-0 flex flex-col z-20 relative">
                  <div className="flex-1 overflow-y-auto w-full">
                     <div className="p-6 md:p-8 space-y-6 min-h-full">
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
