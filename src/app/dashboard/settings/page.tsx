"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { Settings, Shield, Trash2, LogOut, Crown, Bell, Globe, Sparkles, Zap, Check } from "lucide-react";
import Link from "next/link";
import { getUserPlanInfo, type PlanInfo } from "@/lib/plan-guard";
import QRCodeCard from "@/components/dashboard/QRCodeCard";
import SEOEditor from "@/components/dashboard/SEOEditor";
import CustomDomainCard from "@/components/dashboard/CustomDomainCard";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [planInfo, setPlanInfo] = useState<PlanInfo | null>(null);
  const [profileRole, setProfileRole] = useState<string>("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    fetch("/api/profile").then(r => r.json()).then(d => {
      if (d.user) {
        const info = getUserPlanInfo({ plan: d.user.plan || "FREE", trialEndsAt: d.user.trialEndsAt });
        setPlanInfo(info);
        setProfileRole(d.user.profileRole || "personal_brand");
        setUsername(d.user.username || "");
      }
    }).catch(() => {});
  }, []);

  // Dynamic plan badge
  const getPlanBadge = () => {
    if (!planInfo) return { label: "Loading...", color: "bg-slate-100 text-slate-500" };
    if (planInfo.status === "PRO") return { label: "Pro Plan", color: "bg-indigo-100 text-indigo-700" };
    if (planInfo.status === "TRIAL") return { label: `Trial (${planInfo.trialDaysLeft}d left)`, color: "bg-amber-100 text-amber-700" };
    if (planInfo.status === "TRIAL_EXPIRED") return { label: "Trial Expired", color: "bg-red-100 text-red-600" };
    return { label: "Free Plan", color: "bg-slate-100 text-slate-600" };
  };

  const badge = getPlanBadge();

  return (
    <div className="max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your account preferences and security</p>
      </div>

      <div className="space-y-5">
        {/* Account info */}
        <div className="dash-card">
          <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <Settings className="w-4 h-4 text-indigo-500" />
            Account
          </h2>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 mb-5">
            <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white text-xl font-bold flex-shrink-0">
              {session?.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div>
              <p className="font-semibold text-slate-900">{session?.user?.name || "—"}</p>
              <p className="text-sm text-slate-500">{session?.user?.email || "—"}</p>
            </div>
            <div className="ml-auto">
              <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${badge.color}`}>{badge.label}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-3 border-b border-slate-50">
              <span className="text-sm text-slate-500">Display name</span>
              <span className="text-sm font-medium text-slate-900">{session?.user?.name || "—"}</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-slate-50">
              <span className="text-sm text-slate-500">Email</span>
              <span className="text-sm font-medium text-slate-900">{session?.user?.email || "—"}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-500">Role</span>
              <span className="text-sm font-medium text-slate-900 capitalize">{profileRole.replace(/_/g, " ")}</span>
            </div>
          </div>
        </div>

        {/* Plan — Show upgrade if not Pro, or current plan details */}
        {planInfo?.isPro ? (
          <div className="dash-card border-2 border-emerald-100" style={{ background: "linear-gradient(135deg, #ecfdf5, #f0fdf4)" }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                <Crown className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h2 className="font-semibold text-slate-900">
                  {planInfo.isTrialActive ? "Pro Trial Active" : "Pro Plan Active"}
                </h2>
                <p className="text-sm text-emerald-600 font-medium">
                  {planInfo.isTrialActive 
                    ? `${planInfo.trialDaysLeft} days remaining in your trial`
                    : "All premium features unlocked"
                  }
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {["AI Assistant", "Booking Scheduler", "Discount Engine", "Custom Domain", 
                "Unlimited Links", "Priority Support"].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm text-slate-600">
                  <Check className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
                  {f}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="dash-card border-2 border-indigo-100" style={{ background: "linear-gradient(135deg, #eef2ff, #ecfeff)" }}>
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-500" />
                  Upgrade to Pro
                </h2>
                <p className="text-sm text-slate-600 mb-4">Unlock all features and grow your creator business.</p>
                <ul className="space-y-1.5 text-sm text-slate-600 mb-5">
                  {[
                    "AI-powered business assistant",
                    "Unlimited links & products", 
                    "Booking scheduler & lead capture",
                    "Discount engine with AI auto-offers",
                    "Custom domain",
                    "Remove getprofile.link watermark", 
                    "Priority support"
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="w-4 h-4 rounded-full bg-indigo-100 flex items-center justify-center text-xs text-indigo-600 flex-shrink-0">✓</span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="btn-primary px-8 py-3">
                  <Crown className="w-4 h-4" />
                  Upgrade for $9/mo
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Security */}
        <div className="dash-card">
          <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <Shield className="w-4 h-4 text-indigo-500" />
            Security
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Password</p>
              <p className="text-xs text-slate-400 mt-0.5">Last changed: never</p>
            </div>
            <button className="btn-ghost text-sm">Change password</button>
          </div>
        </div>

        {/* Public Profile */}
        <div className="dash-card">
          <h2 className="font-semibold text-slate-900 mb-5 flex items-center gap-2">
            <Globe className="w-4 h-4 text-indigo-500" />
            Public Profile
          </h2>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-900">Profile URL</p>
              <p className="text-xs text-slate-400 mt-0.5">getprofile.link/{(session?.user as any)?.username || "username"}</p>
            </div>
            <Link href="/dashboard" className="btn-ghost text-sm">Edit profile</Link>
          </div>
        </div>

        {/* Danger */}
        <div className="dash-card border border-red-100">
          <h2 className="font-semibold text-red-600 mb-4 flex items-center gap-2">
            <Trash2 className="w-4 h-4" />
            Danger Zone
          </h2>
          <p className="text-sm text-slate-500 mb-5">
            Permanently delete your account and all associated data. This cannot be undone.
          </p>
          <div className="flex items-center gap-3">
            <button className="px-5 py-2.5 border-2 border-red-200 text-red-600 rounded-xl text-sm font-semibold hover:bg-red-50 transition-colors">
              Delete account
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-2 px-5 py-2.5 text-slate-500 rounded-xl text-sm font-medium hover:text-slate-700 hover:bg-slate-100 transition-all"
            >
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        </div>
        {/* QR Code */}
        {username && <QRCodeCard username={username} />}

        {/* Custom Domain */}
        <CustomDomainCard />

        {/* SEO Editor */}
        {username && <SEOEditor username={username} />}
      </div>
    </div>
  );
}
