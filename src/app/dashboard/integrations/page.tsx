"use client";

import { useState, useEffect } from "react";
import { Globe, Camera, Globe2, AtSign, Music2, Check, X, Loader2, ExternalLink, Users, Unlink, Link2 } from "lucide-react";
import { toast } from "sonner";

interface SocialAccount {
  id: string;
  platform: string;
  platformUsername: string | null;
  followerCount: number | null;
  isConnected: boolean;
  createdAt: string;
}

const PLATFORMS = [
  { id: "instagram", label: "Instagram", icon: Camera, color: "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400", desc: "Required for DM Automation. Connect your Creator or Business account." },
  { id: "facebook", label: "Facebook Page", icon: Globe2, color: "bg-blue-600", desc: "Automate DMs on your Facebook Page alongside Instagram." },
  { id: "tiktok", label: "TikTok", icon: Music2, color: "bg-black", desc: "Sync your TikTok profile and showcase metrics." },
  { id: "twitter", label: "Twitter / X", icon: AtSign, color: "bg-slate-800", desc: "Connect your X account for cross-platform analytics." },
];

export default function IntegrationsPage() {
  const [accounts, setAccounts] = useState<SocialAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<string | null>(null);
  const [formUsername, setFormUsername] = useState("");
  const [formFollowers, setFormFollowers] = useState("");

  useEffect(() => { fetchAccounts(); }, []);

  async function fetchAccounts() {
    try {
      const res = await fetch("/api/integrations");
      const data = await res.json();
      setAccounts(data.accounts || []);
    } catch { } finally { setLoading(false); }
  }

  async function connectAccount(platform: string) {
    if (!formUsername) { toast.error("Username is required"); return; }
    setConnecting(platform);
    try {
      const res = await fetch("/api/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform,
          platformUsername: formUsername.replace("@", ""),
          followerCount: parseInt(formFollowers) || 0,
        }),
      });
      if (res.ok) {
        toast.success(`${platform} connected!`);
        setShowForm(null);
        setFormUsername("");
        setFormFollowers("");
        fetchAccounts();
      }
    } catch { toast.error("Connection failed"); }
    finally { setConnecting(null); }
  }

  async function disconnectAccount(platform: string) {
    try {
      await fetch(`/api/integrations?platform=${platform}`, { method: "DELETE" });
      toast.success(`${platform} disconnected`);
      fetchAccounts();
    } catch { toast.error("Failed to disconnect"); }
  }

  const getAccount = (platform: string) => accounts.find(a => a.platform === platform);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <Link2 className="w-5 h-5 text-indigo-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-900">Integrations</h1>
        </div>
        <p className="text-sm text-slate-500 ml-[52px]">Connect your social media accounts to enable DM automation and cross-platform analytics.</p>
      </div>

      {/* Info Banner */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-5 flex items-start gap-4">
        <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
          <Camera className="w-5 h-5 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-indigo-900">Instagram Connection Required for DM Automation</h3>
          <p className="text-xs text-indigo-700 mt-1">Your Instagram account must be a <strong>Creator</strong> or <strong>Business</strong> profile linked to a Facebook Page. Personal accounts cannot use DM automation.</p>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid gap-4">
        {PLATFORMS.map(platform => {
          const account = getAccount(platform.id);
          const isConnected = !!account?.isConnected;

          return (
            <div key={platform.id} className={`bg-white border rounded-2xl overflow-hidden transition-all ${isConnected ? "border-emerald-200 shadow-sm" : "border-slate-200 hover:border-slate-300"}`}>
              <div className="p-6 flex items-center gap-5">
                {/* Platform Icon */}
                <div className={`w-14 h-14 ${platform.color} rounded-2xl flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                  <platform.icon className="w-7 h-7" />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="text-base font-bold text-slate-900">{platform.label}</h3>
                    {isConnected && (
                      <span className="text-[10px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3" /> Connected
                      </span>
                    )}
                  </div>
                  {isConnected ? (
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-sm font-bold text-indigo-600">@{account?.platformUsername}</span>
                      {account?.followerCount ? (
                        <span className="text-xs text-slate-400 flex items-center gap-1">
                          <Users className="w-3 h-3" /> {account.followerCount.toLocaleString()} followers
                        </span>
                      ) : null}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 mt-1">{platform.desc}</p>
                  )}
                </div>

                {/* Action */}
                <div className="flex-shrink-0">
                  {isConnected ? (
                    <button onClick={() => disconnectAccount(platform.id)} className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200">
                      <Unlink className="w-3.5 h-3.5" /> Disconnect
                    </button>
                  ) : showForm === platform.id ? (
                    <button onClick={() => setShowForm(null)} className="px-4 py-2.5 text-xs font-bold text-slate-500 bg-slate-100 rounded-xl">
                      Cancel
                    </button>
                  ) : (
                    <button onClick={() => setShowForm(platform.id)} className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-slate-900 hover:bg-indigo-600 rounded-xl transition-colors shadow-sm">
                      <ExternalLink className="w-3.5 h-3.5" /> Connect
                    </button>
                  )}
                </div>
              </div>

              {/* Connection Form (expanded) */}
              {showForm === platform.id && !isConnected && (
                <div className="border-t border-slate-100 bg-slate-50 p-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md">
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Username</label>
                      <input
                        value={formUsername}
                        onChange={e => setFormUsername(e.target.value)}
                        placeholder="@yourusername"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1.5">Followers (approx.)</label>
                      <input
                        type="number"
                        value={formFollowers}
                        onChange={e => setFormFollowers(e.target.value)}
                        placeholder="10000"
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => connectAccount(platform.id)}
                    disabled={connecting === platform.id}
                    className="mt-4 flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition-colors disabled:opacity-50 shadow-sm"
                  >
                    {connecting === platform.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
                    {connecting === platform.id ? "Connecting..." : `Connect ${platform.label}`}
                  </button>
                  <p className="text-[10px] text-slate-400 mt-3">In production, this will redirect to {platform.label}'s OAuth flow. For now, enter your handle manually.</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
