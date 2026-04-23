"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Globe, Mail, Lock, User, AtSign, Eye, EyeOff, ArrowRight, MonitorSmartphone, Users, Briefcase, CheckCircle2 } from "lucide-react";

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
        setError(data.error || "Registration failed. Please try again.");
        setLoading(false);
        return;
      }

      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.ok) {
        router.push(role === "AGENCY" ? "/dashboard/agency" : "/dashboard");
      } else {
        setError("Login failed after registration.");
        setLoading(false);
      }
    } catch {
      setError("An unexpected error occurred. Please try again later.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white font-sans selection:bg-indigo-500 selection:text-white">
      {/* Left visual panel - Premium Modern Style */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden items-center justify-center p-12 bg-[#050505] border-r border-white/5">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-black to-cyan-500/10"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover opacity-[0.03] mix-blend-screen grayscale"></div>
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 -right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -left-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px]" />
        
        <div className="relative z-10 w-full max-w-lg">
          <Link href="/" className="inline-flex items-center gap-2 mb-16 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-all">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-black tracking-tight">getprofile<span className="text-indigo-400">.link</span></span>
          </Link>

          <h2 className="text-5xl font-black tracking-tighter leading-[1.1] mb-6">
            Build your digital <br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">empire today.</span>
          </h2>
          <p className="text-lg text-white/50 mb-12 max-w-md leading-relaxed">
            Join thousands of creators and businesses scaling their online presence with GetProfile.
          </p>

          <div className="space-y-6">
            {[
              "Unlimited customizable links",
              "Sell digital products & courses",
              "Accept bookings & consultations",
              "Advanced analytics & insights"
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-white/70">
                <div className="w-6 h-6 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <span className="font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex flex-col p-6 sm:p-12 relative overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden flex items-center justify-between mb-8">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-black tracking-tight">getprofile</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-[440px]">
            
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight mb-2">Create an account</h1>
              <p className="text-white/50 text-sm">Let's get started with your 14-day free trial.</p>
            </div>

            {/* Google Signup */}
            <button
              type="button"
              onClick={() => signIn("google", { callbackUrl: role === "AGENCY" ? "/dashboard/agency" : "/dashboard" })}
              className="w-full flex items-center justify-center gap-3 px-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-sm font-bold hover:bg-white/10 hover:border-white/20 transition-all mb-8 group"
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Sign up with Google
            </button>

            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs font-medium text-white/30 uppercase tracking-widest">or sign up with email</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            {/* Role Selection */}
            <div className="mb-6">
               <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-3">Account Type</label>
               <div className="grid grid-cols-3 gap-2">
                   <button onClick={() => setRole("CREATOR")} type="button" className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === "CREATOR" ? "border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]" : "border-white/5 bg-white/[0.02] text-white/40 hover:text-white hover:bg-white/5"}`}>
                      <MonitorSmartphone className={`w-5 h-5 ${role === "CREATOR" ? "text-indigo-400" : ""}`}/>
                      <span className="text-[10px] uppercase font-black tracking-widest">Creator</span>
                   </button>
                   <button onClick={() => setRole("BUSINESS")} type="button" className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === "BUSINESS" ? "border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]" : "border-white/5 bg-white/[0.02] text-white/40 hover:text-white hover:bg-white/5"}`}>
                      <Briefcase className={`w-5 h-5 ${role === "BUSINESS" ? "text-indigo-400" : ""}`}/>
                      <span className="text-[10px] uppercase font-black tracking-widest">Business</span>
                   </button>
                   <button onClick={() => setRole("AGENCY")} type="button" className={`py-3 px-2 rounded-xl border flex flex-col items-center gap-2 transition-all ${role === "AGENCY" ? "border-indigo-500 bg-indigo-500/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]" : "border-white/5 bg-white/[0.02] text-white/40 hover:text-white hover:bg-white/5"}`}>
                      <Users className={`w-5 h-5 ${role === "AGENCY" ? "text-indigo-400" : ""}`}/>
                      <span className="text-[10px] uppercase font-black tracking-widest">Agency</span>
                   </button>
               </div>
            </div>

            {error && (
              <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full"></div>
                </div>
                <p className="text-red-400 text-sm font-medium leading-relaxed">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Username</label>
                <div className="relative">
                  <AtSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value.replace(/[^a-zA-Z0-9_-]/g, "").toLowerCase() })}
                    placeholder="johndoe"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>
                {form.username && (
                  <p className="text-xs font-medium text-white/40 mt-2 ml-1">
                    Your link: <span className="text-indigo-400">getprofile.link/{form.username}</span>
                  </p>
                )}
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="john@example.com"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-white/50 uppercase tracking-wider mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-12 py-3.5 rounded-xl border border-white/10 bg-white/5 text-sm text-white placeholder-white/20 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-4 mt-6 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-600 hover:to-cyan-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-sm text-white/50 mt-8">
              Already have an account?{" "}
              <Link href="/login" className="text-white font-bold hover:text-indigo-400 transition-colors">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
