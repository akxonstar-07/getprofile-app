"use client";

import { useState } from "react";
import { Globe, CheckCircle2, Loader2, AlertCircle, Copy, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function CustomDomainCard() {
  const [domain, setDomain] = useState("");
  const [checking, setChecking] = useState(false);
  const [dnsConfig, setDnsConfig] = useState<any>(null);
  const [verified, setVerified] = useState(false);

  const handleCheck = async () => {
    if (!domain) return;
    setChecking(true);

    try {
      const res = await fetch("/api/domain/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });

      const data = await res.json();
      if (res.ok) {
        setDnsConfig(data);
      } else {
        toast.error(data.error || "Invalid domain");
      }
    } catch (err) {
      toast.error("Failed to check domain");
    } finally {
      setChecking(false);
    }
  };

  const handleVerify = () => {
    // In production: Actually verify DNS records
    toast.success("Domain verification initiated. This may take up to 24 hours.");
    setVerified(true);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  return (
    <div className="dash-card">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
          <Globe className="w-5 h-5 text-cyan-600" />
        </div>
        <div>
          <h3 className="font-black text-slate-900">Custom Domain</h3>
          <p className="text-xs text-slate-400">Use your own domain instead of getprofile.link/username</p>
        </div>
      </div>

      {!dnsConfig ? (
        /* Domain Input */
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Domain</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={domain}
                onChange={e => setDomain(e.target.value)}
                placeholder="yourdomain.com"
                className="flex-1 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-300 transition-all"
              />
              <button
                onClick={handleCheck}
                disabled={checking || !domain}
                className="px-5 py-3 bg-cyan-600 text-white rounded-2xl text-sm font-bold hover:bg-cyan-700 transition-all disabled:opacity-50 flex-shrink-0 flex items-center gap-2"
              >
                {checking ? <Loader2 className="w-4 h-4 animate-spin" /> : <Globe className="w-4 h-4" />}
                Check
              </button>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-bold mb-1">Pro Feature</p>
              <p className="text-xs text-amber-600">Custom domains require an active Pro plan subscription.</p>
            </div>
          </div>
        </div>
      ) : (
        /* DNS Configuration */
        <div className="space-y-5">
          <div className="bg-cyan-50 border border-cyan-200 rounded-2xl p-4 flex items-center gap-3">
            <Globe className="w-5 h-5 text-cyan-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-bold text-cyan-900">{dnsConfig.domain}</p>
              <p className="text-xs text-cyan-600">
                {verified ? "✅ Verification initiated" : "⏳ Pending verification"}
              </p>
            </div>
          </div>

          {/* DNS Records */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Required DNS Records</p>
            <div className="space-y-2">
              {dnsConfig.dnsRecords.map((record: any, i: number) => (
                <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">{record.type}</span>
                    <button onClick={() => copyToClipboard(record.value)} className="p-1 text-slate-400 hover:text-indigo-600 transition-colors">
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 font-bold">Name:</span>
                      <p className="font-mono font-medium text-slate-900">{record.name}</p>
                    </div>
                    <div>
                      <span className="text-slate-400 font-bold">Value:</span>
                      <p className="font-mono font-medium text-slate-900 break-all">{record.value}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Setup Steps</p>
            <ol className="space-y-2">
              {dnsConfig.instructions.map((step: string, i: number) => (
                <li key={i} className="flex items-start gap-3 text-sm text-slate-600">
                  <span className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-xs font-black flex-shrink-0">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={handleVerify}
              disabled={verified}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-2xl text-sm font-bold hover:bg-emerald-700 transition-all disabled:opacity-50"
            >
              {verified ? <CheckCircle2 className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
              {verified ? "Verification Initiated" : "Verify Domain"}
            </button>
            <button
              onClick={() => { setDnsConfig(null); setVerified(false); setDomain(""); }}
              className="px-5 py-3 bg-slate-100 text-slate-700 rounded-2xl text-sm font-bold hover:bg-slate-200 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
