"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Globe, Mail, Lock, User, AtSign, Eye, EyeOff, ArrowRight, MonitorSmartphone, Users, Briefcase } from "lucide-react";

type Role = "CREATOR" | "BUSINESS" | "AGENCY";

export default function SignupPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>("CREATOR");
  const [form, setForm] = useState({ name: "", email: "", username: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // Passing role along for future DB mapping
        body: JSON.stringify({ ...form, role }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Network authorization dropped.");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.ok) {
        // In a real app, role dictates dashboard target
        router.push(role === "AGENCY" ? "/dashboard/agency" : "/dashboard");
      } else {
        setError("Login sequence failed post-registration.");
        setLoading(false);
      }
    } catch {
      setError("Critical server integration error.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white font-sans selection:bg-[#D2FF00] selection:text-black">
      {/* Left visual panel - Dark Komi Style */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1A0B2E] via-[#110620] to-black relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Samantha_Ruth_Prabhu_at_a_promotional_event_%28cropped%29.jpg/800px-Samantha_Ruth_Prabhu_at_a_promotional_event_%28cropped%29.jpg')] bg-cover opacity-10 mix-blend-overlay grayscale"></div>
        <div className="absolute top-1/4 -right-10 w-96 h-96 bg-[#2B1556] rounded-full blur-[120px]" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-[#D2FF00]/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-10 shadow-[0_0_40px_rgba(255,255,255,0.2)]">
            <Globe className="w-10 h-10 text-black" />
          </div>
          <h2 className="font-komi text-6xl md:text-8xl tracking-tight uppercase leading-[0.9] text-white drop-shadow-xl">
            CLAIM <br/> YOUR <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-300 to-white">TERRITORY.</span>
          </h2>
          <p className="font-medium text-white/50 text-xl max-w-sm mt-8 uppercase tracking-widest">
            JOIN THE PLATFORM POWERING ELITE INTERNET ASSETS.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative overflow-y-auto">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-black z-0"></div>
        <div className="w-full max-w-md relative z-10 py-10">
          
          <Link href="/" className="flex items-center gap-3 mb-10 opacity-50 hover:opacity-100 transition-opacity">
            <Globe className="w-6 h-6 text-white" />
            <span className="text-xl font-bold tracking-widest uppercase">getprofile</span>
          </Link>

          <h1 className="font-komi text-4xl uppercase tracking-tighter mb-2">INITIALIZE NEW NODE</h1>
          <p className="text-white/50 font-bold tracking-widest uppercase text-xs mb-8">Deploy your identity construct.</p>

          {/* Role Selection */}
          <div className="mb-8">
             <label className="block text-sm font-bold text-[#D2FF00] uppercase tracking-widest mb-3">Assign Operating Entity</label>
             <div className="grid grid-cols-3 gap-3">
                 <button onClick={() => setRole("CREATOR")} type="button" className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === "CREATOR" ? "border-[#D2FF00] bg-[#D2FF00]/10 text-white" : "border-white/10 bg-white/5 text-white/40 hover:text-white"}`}>
                    <MonitorSmartphone className="w-5 h-5"/>
                    <span className="text-[10px] uppercase font-black tracking-widest">Creator</span>
                 </button>
                 <button onClick={() => setRole("BUSINESS")} type="button" className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === "BUSINESS" ? "border-[#D2FF00] bg-[#D2FF00]/10 text-white" : "border-white/10 bg-white/5 text-white/40 hover:text-white"}`}>
                    <Briefcase className="w-5 h-5"/>
                    <span className="text-[10px] uppercase font-black tracking-widest">Business</span>
                 </button>
                 <button onClick={() => setRole("AGENCY")} type="button" className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === "AGENCY" ? "border-[#D2FF00] bg-[#D2FF00]/10 text-white" : "border-white/10 bg-white/5 text-white/40 hover:text-white"}`}>
                    <Users className="w-5 h-5"/>
                    <span className="text-[10px] uppercase font-black tracking-widest">Agency</span>
                 </button>
             </div>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/50 text-red-400 font-bold text-sm">
              {error}
            </div>
          )}

          <button
            onClick={() => signIn("google", { callbackUrl: role === "AGENCY" ? "/dashboard/agency" : "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10 transition-colors mb-8"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
            </svg>
            AUTHORIZE G-SUITE 
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">or standard protocols</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5">Legal Identity</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Lex Corp / John Doe"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white placeholder-white/20 focus:outline-none focus:border-[#D2FF00] focus:ring-1 focus:ring-[#D2FF00] transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5">Global Handle</label>
              <div className="relative">
                <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase() })}
                  placeholder="lexcorp"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white placeholder-white/20 focus:outline-none focus:border-[#D2FF00] focus:ring-1 focus:ring-[#D2FF00] transition-all"
                  required
                />
              </div>
              <p className="text-[10px] font-black text-white/30 mt-2 tracking-widest uppercase">getprofile.link/{form.username || "handle"}</p>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5">Secure Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@empire.com"
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white placeholder-white/20 focus:outline-none focus:border-[#D2FF00] focus:ring-1 focus:ring-[#D2FF00] transition-all"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-white/50 uppercase tracking-widest mb-1.5">Access Key</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3 rounded-xl border border-white/10 bg-white/5 text-sm font-medium text-white placeholder-white/20 focus:outline-none focus:border-[#D2FF00] focus:ring-1 focus:ring-[#D2FF00] transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 py-4 bg-white text-black rounded-xl text-lg font-komi uppercase tracking-widest hover:bg-[#D2FF00] transition-colors disabled:opacity-50 mt-6"
            >
              {loading ? "INITIALIZING..." : "EXECUTE DEPLOYMENT"}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <p className="text-center text-xs text-white/50 font-black tracking-widest uppercase mt-8">
            ALREADY DEPLOYED?{" "}
            <Link href="/login" className="text-white hover:text-[#D2FF00] transition-colors underline">
              LOG IN
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
