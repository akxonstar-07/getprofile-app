"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Globe, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white font-sans selection:bg-[#D2FF00] selection:text-black">
      {/* Left visual panel - Dark Komi Style */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#1A0B2E] via-[#110620] to-black relative overflow-hidden items-center justify-center p-12">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Allu_Arjun_at_Pushpa_trailer_launch.jpg/800px-Allu_Arjun_at_Pushpa_trailer_launch.jpg')] bg-cover opacity-10 mix-blend-overlay grayscale"></div>
        <div className="absolute top-20 left-20 w-96 h-96 bg-[#2B1556] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-[#D2FF00]/10 rounded-full blur-[100px]" />
        
        <div className="relative z-10 text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-[#D2FF00] rounded-full flex items-center justify-center mb-10 shadow-[0_0_40px_rgba(210,255,0,0.3)]">
            <Globe className="w-10 h-10 text-black" />
          </div>
          <h2 className="font-komi text-6xl md:text-8xl tracking-tight uppercase leading-[0.9] text-white drop-shadow-xl">
            WELCOME <br/> BACK TO <br/> <span className="text-[#D2FF00]">POWER.</span>
          </h2>
          <p className="font-medium text-white/50 text-xl max-w-sm mt-8 uppercase tracking-widest">
            LOG IN TO MANAGE YOUR EMPIRE.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] to-black z-0"></div>
        <div className="w-full max-w-md relative z-10">
          
          <Link href="/" className="flex items-center gap-3 mb-16 opacity-50 hover:opacity-100 transition-opacity">
            <Globe className="w-6 h-6 text-white" />
            <span className="text-xl font-bold tracking-widest uppercase">getprofile</span>
          </Link>

          <h1 className="font-komi text-5xl uppercase tracking-tighter mb-4">ACCESS COMMAND CENTER</h1>
          <p className="text-white/50 font-medium mb-10">Enter your secure credentials to continue</p>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-900/20 border border-red-500/50 text-red-400 font-bold text-sm">
              {error}
            </div>
          )}

          <button
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="w-full flex items-center justify-center gap-3 px-4 py-4 rounded-2xl border border-white/10 bg-white/5 text-sm font-bold text-white hover:bg-white/10 transition-colors mb-8"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            AUTHORIZE G-SUITE
          </button>

          <div className="flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">or standard auth</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-white/50 uppercase tracking-widest mb-2">Secure Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@empire.com"
                  className="w-full pl-12 pr-4 py-4 rounded-xl border border-white/10 bg-white/5 text-lg font-medium text-white placeholder-white/20 focus:outline-none focus:border-[#D2FF00] focus:ring-1 focus:ring-[#D2FF00] transition-all"
                  required
                />
              </div>
            </div>
            
            <div>
               <label className="block text-sm font-bold text-white/50 uppercase tracking-widest mb-2">Access Key</label>
               <div className="relative">
                 <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                 <input
                   type={showPassword ? "text" : "password"}
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   placeholder="••••••••"
                   className="w-full pl-12 pr-12 py-4 rounded-xl border border-white/10 bg-white/5 text-lg font-medium text-white placeholder-white/20 focus:outline-none focus:border-[#D2FF00] focus:ring-1 focus:ring-[#D2FF00] transition-all"
                   required
                 />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white"
                 >
                   {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                 </button>
               </div>
            </div>

            <button
               type="submit"
               disabled={loading}
               className="w-full flex items-center justify-center gap-3 py-5 bg-[#D2FF00] text-black rounded-xl text-xl font-komi uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 mt-4"
            >
               {loading ? "AUTHENTICATING..." : "INITIALIZE SESSION"}
               {!loading && <ArrowRight className="w-6 h-6" />}
            </button>
          </form>

          <p className="text-center text-sm text-white/50 font-medium mt-10">
            DON&apos;T HAVE CLEARANCE?{" "}
            <Link href="/signup" className="text-[#D2FF00] font-bold hover:underline">
              REQUEST ACCESS
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
