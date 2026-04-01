import { Sparkles } from "lucide-react";

export default function ComingSoon({ title, description }: { title: string, description: string }) {
  return (
    <div className="w-full max-w-2xl mx-auto py-20 px-6 text-center">
      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-400 text-white flex items-center justify-center mx-auto mb-6 shadow-xl shadow-indigo-500/20">
        <Sparkles className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{title}</h1>
      <p className="text-lg text-slate-500 mb-10 max-w-lg mx-auto leading-relaxed">
        {description}
      </p>
      
      <div className="inline-flex flex-col sm:flex-row gap-4">
        <button className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
          Join Waitlist
        </button>
        <button className="px-8 py-4 bg-white text-slate-700 font-bold rounded-xl border border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-colors">
          Learn More
        </button>
      </div>
    </div>
  );
}
