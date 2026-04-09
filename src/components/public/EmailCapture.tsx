"use client";

import { useState } from "react";
import { Mail, CheckCircle2, Loader2, Sparkles } from "lucide-react";

interface EmailCaptureProps {
  username: string;
  creatorName: string;
}

export default function EmailCapture({ username, creatorName }: EmailCaptureProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) return;
    setLoading(true);

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email }),
      });

      const data = await res.json();
      if (res.ok) {
        setSuccess(true);
      }
    } catch (err) {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <p className="text-sm font-bold text-emerald-600">You're subscribed! 🎉</p>
      </div>
    );
  }

  return (
    <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <Sparkles className="w-4 h-4 text-indigo-400" />
        <p className="text-xs font-black uppercase tracking-widest text-zinc-400">Stay Updated</p>
      </div>
      <p className="text-sm text-zinc-300 mb-4">
        Get exclusive content and updates from {creatorName}
      </p>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSubscribe()}
            placeholder="your@email.com"
            className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/10 rounded-2xl text-sm font-medium text-white placeholder:text-zinc-500 outline-none focus:border-indigo-500/50 transition-all"
          />
        </div>
        <button
          onClick={handleSubscribe}
          disabled={loading || !email}
          className="px-5 py-3 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all disabled:opacity-50 flex-shrink-0"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Subscribe"}
        </button>
      </div>
    </div>
  );
}
