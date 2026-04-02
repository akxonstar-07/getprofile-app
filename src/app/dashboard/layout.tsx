"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  Search, User, MessageCircle, BarChart3, Building2,
  DollarSign, HandHeart, Shirt, DownloadCloud,
  GraduationCap, Bot, Users, Globe, LogOut, Menu, X, Plus, Sparkles, ExternalLink
} from "lucide-react";

const sidebarItems = [
  { href: "/dashboard/search",     icon: Search,       label: "Search",         group: "main" },
  { href: "/dashboard",            icon: User,         label: "Profile",        group: "main" },
  { href: "/dashboard/messages",   icon: MessageCircle,label: "Messages",       group: "main" },
  { href: "/dashboard/analytics",  icon: BarChart3,    label: "Analytics",      group: "main" },
  { href: "/dashboard/agency",     icon: Building2,    label: "Agency",         group: "main" },
  
  { href: "/dashboard/sales",      icon: DollarSign,   label: "Your Sales",     group: "money" },
  { href: "/dashboard/tips",       icon: HandHeart,    label: "Collect Tips",   group: "money" },
  { href: "/dashboard/merch",      icon: Shirt,        label: "Create & Sell Merch", group: "money" },
  { href: "/dashboard/store",      icon: DownloadCloud,label: "Sell Digital Products", group: "money" },
  { href: "/dashboard/courses",    icon: GraduationCap,label: "Course Builder", group: "money", badge: "New" },
  { href: "/dashboard/automations",icon: Bot,          label: "Automations",    group: "money", badge: "Soon", badgeColor: "bg-orange-500 text-white" },
  { href: "/dashboard/audience",   icon: Users,        label: "Leads",          group: "money", badge: "New", badgeColor: "bg-indigo-500 text-white" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router   = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);

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

  if (status === "loading" || !userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
      </div>
    );
  }

  const isProfileEditor = pathname === "/dashboard" || pathname === "/dashboard/links" || pathname === "/dashboard/appearance";

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden fixed inset-0">
      
      {/* ── COLUMN 1: LEFT NAVIGATION ── */}
      <aside className={`absolute lg:static inset-y-0 left-0 z-50 w-[240px] bg-white border-r border-slate-200 flex flex-col transform transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        
        {/* Brand Logo */}
        <div className="px-5 pt-5 pb-6 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-cyan-400 rounded-lg flex items-center justify-center shadow-sm">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent tracking-tight">getprofile.link</span>
          </Link>
          <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 overflow-y-auto px-3 py-2 custom-scrollbar">
          <div className="space-y-1 mb-6">
            {sidebarItems.filter(i => i.group === "main").map(item => {
              const isActive = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-bold transition-all ${
                    isActive ? "bg-slate-100/80 text-slate-900" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <p className="px-4 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">Make Money</p>
          <div className="space-y-0.5 mb-6">
            {sidebarItems.filter(i => i.group === "money").map(item => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-xl text-[13px] font-semibold transition-all ${
                    isActive ? "bg-slate-100/80 text-slate-900" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                  }`}>
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate flex-1">{item.label}</span>
                  {item.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${item.badgeColor || "bg-indigo-500 text-white"}`}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-slate-100 flex flex-col gap-2">
          <a href="/" className="inline-flex items-center gap-1.5 text-xs opacity-30 hover:opacity-60 transition-opacity"
            style={{ color: "inherit" }}>
            <Globe className="w-3 h-3" /> Powered by getprofile.link
          </a>
          <button className="flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-slate-500 hover:text-slate-900 transition-colors">
            <Search className="w-4 h-4" /> Help Center
          </button>
          <button onClick={() => signOut({ callbackUrl: "/" })} className="flex items-center gap-3 px-3 py-2 text-[12px] font-bold text-red-400 hover:text-red-500 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN EDITOR / CANVAS ── */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-white lg:bg-transparent">
        
        {/* Top bar (for URL preview and AI toggles) */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button className="lg:hidden text-slate-400" onClick={() => setSidebarOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            {isProfileEditor && (
              <div className="hidden sm:flex items-center gap-2 text-sm">
                <span className="text-slate-400 font-medium">Your Bio Link</span>
                <a href={`/${userProfile.username}`} target="_blank" rel="noopener noreferrer" className="bg-slate-100 px-3 py-1.5 rounded-lg font-mono text-xs text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-1.5">
                  getprofile.link/{userProfile.username} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/ai" className="hidden sm:flex items-center gap-2 bg-gradient-to-r from-orange-100 to-rose-100 text-rose-600 px-3 py-1.5 justify-center rounded-xl text-xs font-bold hover:opacity-80 transition-opacity">
              <Sparkles className="w-3.5 h-3.5" /> AI Assistant
            </Link>
            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
              {userProfile?.name?.[0]?.toUpperCase() || "U"}
            </div>
          </div>
        </header>

        {/* ── DUAL CONTENT AREA: CENTER CANVAS + RIGHT PANEL ── */}
        <div className="flex-1 overflow-hidden flex relative">
          
          {/* COLUMN 2: CENTER CANVAS (Full width unless Editor overrides) */}
          <div className={`flex-1 overflow-y-auto ${isProfileEditor ? 'custom-scroll-dark' : 'p-6 sm:p-8'}`} 
               style={isProfileEditor ? {
                 background: "linear-gradient(135deg, #10b981 0%, #064e3b 100%)", // The green background from link.me screenshot
                 position: "relative"
               } : {}}>
            
            {/* Soft dark blobs behind phone (for Profile Editor only) */}
            {isProfileEditor && (
              <>
                <div className="absolute top-1/4 -right-20 w-96 h-96 bg-black/[0.15] rounded-full blur-[100px]" />
                <div className="absolute bottom-0 -left-20 w-[30rem] h-[30rem] bg-indigo-900/[0.2] rounded-full blur-[120px]" />
              </>
            )}

            <div className={`relative z-10 h-full ${isProfileEditor ? "" : "max-w-6xl mx-auto"}`}>
              {children}
            </div>
          </div>

          {/* COLUMN 3: RIGHT CONTEXTUAL EDITOR (Only shows on Profile edit pages) */}
          {isProfileEditor && (
            <div className="hidden xl:block w-[340px] bg-white border-l border-slate-200 flex-shrink-0 flex flex-col z-20">
              <div className="p-4 border-b border-slate-100 flex items-center gap-2">
                <button className="flex-1 py-1.5 bg-slate-100 text-slate-800 text-xs font-bold rounded-lg transition-colors hover:bg-slate-200">Add Content</button>
                <button className="flex-1 py-1.5 text-slate-400 text-xs font-bold rounded-lg transition-colors hover:bg-slate-50 hover:text-slate-600">AI Compliance</button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-5 custom-scrollbar space-y-8">
                
                {/* Global Profile Dashboard Options */}
                <div>
                  <h3 className="text-sm font-black text-slate-900 mb-4">Profile Dashboard</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Quick Settings</p>
                  
                  <div className="space-y-4">
                    {[
                      { l: "Deeplink Banner", d: "Help visitors switch to Safari/Chrome", tag: "PRO" },
                      { l: "Add to Contacts", d: "Let visitors save you", tag: "PRO" },
                      { l: "Total Followers", d: "Show follower count", tag: "PRO" },
                      { l: "Shouts & Media",  d: "Hide from profile", tag: "PRO" }
                    ].map(st => (
                      <div key={st.l} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-5 h-5 flex-shrink-0 opacity-40"><Search className="w-full h-full" /></div>
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[13px] font-bold text-slate-800">{st.l}</span>
                              <span className="bg-emerald-500 text-white text-[8px] font-black px-1 rounded-sm">{st.tag}</span>
                            </div>
                            <span className="text-[11px] text-slate-400">{st.d}</span>
                          </div>
                        </div>
                        {/* Fake switch */}
                        <div className="w-8 h-4 rounded-full bg-slate-200"></div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* My Links quick-adds */}
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">My Links</p>
                  <div className="space-y-2">
                    <button className="w-full bg-white border border-slate-200 p-3 rounded-2xl flex items-center justify-between group hover:border-indigo-300 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center flex-shrink-0 text-slate-400">
                          <Globe className="w-4 h-4" />
                        </div>
                        <div className="text-left">
                          <div className="text-[13px] font-bold text-slate-800 group-hover:text-indigo-600">Manage Platforms</div>
                          <div className="text-[11px] text-slate-400 leading-tight block">Add or edit platform links</div>
                        </div>
                      </div>
                      <Plus className="w-4 h-4 text-slate-300 group-hover:text-indigo-500" />
                    </button>
                    {/* Add more right-panel tools here if needed */}
                  </div>
                </div>

              </div>
              
              {/* Bottom AI floating banner */}
              <div className="p-4 border-t border-slate-100 bg-slate-50">
                <Link href="/dashboard/ai" className="flex items-center gap-3 bg-white p-3 rounded-2xl border shadow-sm hover:shadow-md transition-shadow">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-400 to-rose-400 flex items-center justify-center text-white">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-[13px] font-bold text-slate-900">getprofile.link AI</div>
                    <div className="text-[10px] text-slate-500">Your assistant</div>
                  </div>
                </Link>
              </div>

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
