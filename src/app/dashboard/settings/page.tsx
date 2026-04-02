"use client";

import { useSession, signOut } from "next-auth/react";
import { Settings, Shield, Trash2, LogOut, Crown, Bell, Globe } from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="max-w-2xl">
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
              <span className="badge-primary">Free Plan</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-3 border-b border-slate-50">
              <span className="text-sm text-slate-500">Display name</span>
              <span className="text-sm font-medium text-slate-900">{session?.user?.name || "—"}</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <span className="text-sm text-slate-500">Email</span>
              <span className="text-sm font-medium text-slate-900">{session?.user?.email || "—"}</span>
            </div>
          </div>
        </div>

        {/* Plan */}
        <div className="dash-card border-2 border-indigo-100" style={{ background: "linear-gradient(135deg, #eef2ff, #ecfeff)" }}>
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                <Crown className="w-4 h-4 text-amber-500" />
                Upgrade to Pro
              </h2>
              <p className="text-sm text-slate-600 mb-4">Unlock unlimited links, custom domains, and no watermark.</p>
              <ul className="space-y-1.5 text-sm text-slate-600 mb-5">
                {["Unlimited links", "Creator Store (unlimited products)", "Custom domain", "Remove getprofile.link watermark", "Priority support"].map((f) => (
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
      </div>
    </div>
  );
}
