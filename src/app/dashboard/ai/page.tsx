"use client";

import { useState, useRef, useEffect } from "react";
import { Bot, Send, Sparkles, User, Zap, Lightbulb, BarChart3, Palette } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
  time: string;
}

const SUGGESTIONS = [
  { icon: Lightbulb, text: "Improve my bio", prompt: "Help me write a better bio for my GetProfile page. Make it engaging, short, and professional." },
  { icon: BarChart3, text: "Grow my audience", prompt: "What are the best strategies to grow my audience using my link in bio page?" },
  { icon: Palette,   text: "Best template for me", prompt: "Based on creator profiles, which template style works best for influencers?" },
  { icon: Zap,       text: "Monetization tips", prompt: "How can I best monetize my GetProfile page using affiliate links and products?" },
];

const AI_RESPONSES: Record<string, string> = {
  bio: "✨ **Bio Tips for Creators:**\n\n1. **Hook first** — Start with what makes you unique\n2. **Keep it under 150 chars** — Scannable on mobile\n3. **Include a CTA** — e.g. \"DM me for collabs 👇\"\n4. **Use emoji sparingly** — 1-2 max\n\n**Example:** *\"Digital creator | Sharing tips on growth & design 🎨 | DM for collabs\"*",
  grow: "📈 **Top Growth Strategies:**\n\n1. **Add your GetProfile link to ALL socials** — Instagram bio, TikTok bio, YouTube about\n2. **Pin a post** showing your link page on each platform\n3. **Post behind-the-scenes** content linking to your portfolio\n4. **Use link.me-style stories** showing your profile QR code\n5. **Engage with comments** — every reply drives profile visits",
  template: "🎨 **Best Templates by Category:**\n\n• **Influencer/Creator** → Bold dark theme with vibrant accent\n• **Photographer/Model** → Full photo banner, minimal text\n• **Developer** → Clean minimal with GitHub prominent\n• **Coach/Consultant** → Trust-building layout, testimonials\n• **Brand/Business** → Professional with store section first\n\nGo to **Appearance** in your dashboard to switch now!",
  monetize: "💰 **Monetization Strategy:**\n\n1. **Own Products** — Sell presets, ebooks, templates via Gumroad\n2. **Affiliate Links** — Add Amazon/Flipkart links with honest notes\n3. **Tips** — Add a tip button ($5/$10/$20) — fans love supporting you\n4. **Course sales** — Link your Teachable/Udemy course directly\n5. **Brand deals** — Use your analytics page to pitch brands with real data\n\n**Pro tip:** Highlighted links get 3x more clicks!",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("bio") || lower.includes("about")) return AI_RESPONSES.bio;
  if (lower.includes("grow") || lower.includes("audience") || lower.includes("follower")) return AI_RESPONSES.grow;
  if (lower.includes("template") || lower.includes("design") || lower.includes("theme")) return AI_RESPONSES.template;
  if (lower.includes("monetize") || lower.includes("money") || lower.includes("earn") || lower.includes("affiliate")) return AI_RESPONSES.monetize;
  return `🤖 **Great question!**\n\nI'm your GetProfile AI assistant. I can help you with:\n\n• **Bio writing** — Craft the perfect creator bio\n• **Growth strategies** — Grow your audience faster\n• **Template selection** — Find your perfect design\n• **Monetization** — Earn from your profile\n\nTry asking me something specific like *"Help me write my bio"* or *"How do I monetize my links?"*`;
}

function formatMessage(text: string) {
  // Simple markdown-like formatting
  return text.split("\n").map((line, i) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      return <p key={i} className="font-bold mb-1">{line.slice(2, -2)}</p>;
    }
    if (line.startsWith("• ")) {
      return <p key={i} className="ml-3 mb-0.5">• {line.slice(2).replace(/\*\*(.*?)\*\*/g, "$1")}</p>;
    }
    if (line.match(/^\d+\.\s/)) {
      return <p key={i} className="ml-3 mb-0.5">{line.replace(/\*\*(.*?)\*\*/g, "$1")}</p>;
    }
    const parts = line.replace(/\*\*(.*?)\*\*/g, "|||BOLD:$1|||").split("|||");
    return (
      <p key={i} className="mb-1">
        {parts.map((part, j) =>
          part.startsWith("BOLD:") ? <strong key={j}>{part.slice(5)}</strong> : <span key={j}>{part}</span>
        )}
      </p>
    );
  });
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState<Message[]>([{
    role: "assistant",
    content: "👋 Hi! I'm your **GetProfile AI Assistant**.\n\nI'm here to help you:\n• Write the perfect bio\n• Choose the best template\n• Grow your audience\n• Monetize your profile\n\nWhat would you like help with today?",
    time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }]);
  const [input, setInput]     = useState("");
  const [loading, setLoading] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = (text || input).trim();
    if (!msg) return;
    setInput("");

    const userMsg: Message = { role: "user", content: msg, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);

    // Simulate AI response delay
    await new Promise(r => setTimeout(r, 800 + Math.random() * 600));
    const response = getAIResponse(msg);
    setMessages(prev => [...prev, {
      role: "assistant",
      content: response,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }]);
    setLoading(false);
  };

  return (
    <div className="max-w-6xl grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6" style={{ height: "calc(100vh - 120px)" }}>
      {/* Left Column: Chat */}
      <div className="flex flex-col h-full min-h-0">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl gradient-bg flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900">AI Assistant</h1>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-xs text-slate-500">GetProfile AI • Personal creator coach</p>
            </div>
          </div>
          <span className="ml-auto text-[10px] font-black bg-yellow-400/20 text-yellow-600 border border-yellow-400/30 px-2 py-1 rounded-full flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> PRO Feature
          </span>
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
        {SUGGESTIONS.map(s => (
          <button
            key={s.text}
            onClick={() => sendMessage(s.prompt)}
            className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50 transition-all hover:scale-105 text-left"
          >
            <s.icon className="w-3.5 h-3.5 flex-shrink-0" />
            <span>{s.text}</span>
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex-1 bg-white rounded-2xl border border-slate-100 flex flex-col overflow-hidden shadow-sm">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
              {/* Avatar */}
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                msg.role === "assistant" ? "gradient-bg" : "bg-slate-900"
              }`}>
                {msg.role === "assistant"
                  ? <Bot className="w-4 h-4 text-white" />
                  : <User className="w-4 h-4 text-white" />}
              </div>
              {/* Bubble */}
              <div className={`max-w-[80%] ${msg.role === "user" ? "items-end" : "items-start"} flex flex-col gap-1`}>
                <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : "bg-slate-50 text-slate-800 border border-slate-100 rounded-tl-sm"
                }`}>
                  {msg.role === "assistant" ? formatMessage(msg.content) : msg.content}
                </div>
                <span className="text-[10px] text-slate-400 px-1">{msg.time}</span>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center flex-shrink-0">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-slate-50 border border-slate-100 flex items-center gap-2">
                <div className="flex gap-1">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask me anything about growing your profile…"
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-300 focus:ring-2 focus:ring-indigo-100 transition-all"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="w-11 h-11 rounded-xl gradient-bg flex items-center justify-center text-white hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-indigo-500/30 hover:scale-105 active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
            <p className="text-[10px] text-slate-400 text-center mt-2">AI responses are suggestions. Always verify important decisions.</p>
          </div>
        </div>
      </div>

      {/* Right Column: Instant AI Tools */}
      <div className="hidden lg:flex flex-col gap-4 overflow-y-auto pr-2 custom-scrollbar">
        <h3 className="font-bold text-slate-900 mb-2 flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-500" /> Instant Tools
        </h3>
        
        <div className="dash-card">
          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mb-4">
            <Lightbulb className="w-5 h-5 text-amber-500" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Bio Generator</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">Let AI write a highly converting bio based on your niche.</p>
          <button onClick={() => sendMessage(SUGGESTIONS[0].prompt)} className="w-full py-2 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors">
            Generate Bio
          </button>
        </div>

        <div className="dash-card">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Link CTR Analysis</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">Analyze your current links and suggest optimal ordering.</p>
          <button onClick={() => sendMessage("Analyze my links for better CTR")} className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold hover:bg-indigo-100 transition-colors">
            Run Analysis
          </button>
        </div>
        
        <div className="dash-card border-dashed bg-slate-50/50">
          <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center mb-4">
            <User className="w-5 h-5 text-rose-500" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Roast My Profile</h4>
          <p className="text-xs text-slate-500 mt-1 mb-4">Get honest, brutal feedback on how to improve your page.</p>
          <button onClick={() => sendMessage("Roast my profile and tell me everything I'm doing wrong.")} className="w-full py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:border-slate-300 hover:bg-slate-50 transition-all">
            Roast Me 🔥
          </button>
        </div>
      </div>
    </div>
  );
}
