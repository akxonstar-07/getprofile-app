"use client";

import { useState } from "react";
import { Heart, X, DollarSign, CheckCircle2, Loader2 } from "lucide-react";

interface TipWidgetProps {
  username: string;
  creatorName: string;
}

const TIP_AMOUNTS = [3, 5, 10, 25, 50];

export default function TipWidget({ username, creatorName }: TipWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState(5);
  const [customAmount, setCustomAmount] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const finalAmount = customAmount ? parseFloat(customAmount) : amount;

  const handleTip = async () => {
    if (!finalAmount || finalAmount <= 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/tips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          amount: finalAmount,
          senderName: senderName || "Anonymous",
          message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(() => { setSuccess(false); setIsOpen(false); }, 3000);
      }
    } catch (err) {
      // Silent fail
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Tip Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex items-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white px-5 py-3 rounded-full font-bold shadow-2xl shadow-rose-500/30 hover:scale-105 active:scale-95 transition-all group"
      >
        <Heart className="w-5 h-5 group-hover:animate-pulse" />
        <span className="text-sm">Support</span>
      </button>

      {/* Tip Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
            
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-rose-500 to-pink-500 text-white flex items-center justify-between">
              <div>
                <h3 className="font-black text-lg">Support {creatorName}</h3>
                <p className="text-white/70 text-xs mt-0.5">Send a tip to show your appreciation</p>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <div className="p-10 text-center">
                <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h3 className="text-xl font-black text-slate-900">Thank you! 💖</h3>
                <p className="text-slate-500 text-sm mt-2">{creatorName} will appreciate your support!</p>
              </div>
            ) : (
              <div className="p-6 space-y-5">
                {/* Amount Picker */}
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Choose Amount</label>
                  <div className="grid grid-cols-5 gap-2">
                    {TIP_AMOUNTS.map(a => (
                      <button
                        key={a}
                        onClick={() => { setAmount(a); setCustomAmount(""); }}
                        className={`py-3 rounded-2xl text-sm font-black transition-all ${
                          amount === a && !customAmount
                            ? "bg-rose-500 text-white shadow-lg shadow-rose-500/30"
                            : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                        }`}
                      >
                        ${a}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Custom Amount */}
                <div className="relative">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    placeholder="Custom amount"
                    value={customAmount}
                    onChange={e => setCustomAmount(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all"
                  />
                </div>

                {/* Name & Message */}
                <input
                  type="text"
                  placeholder="Your name (optional)"
                  value={senderName}
                  onChange={e => setSenderName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all"
                />

                <textarea
                  placeholder="Leave a message (optional)"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-300 transition-all resize-none"
                />

                {/* Send Button */}
                <button
                  onClick={handleTip}
                  disabled={loading || !finalAmount || finalAmount <= 0}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-2xl font-black text-sm hover:opacity-90 transition-all disabled:opacity-50 shadow-lg shadow-rose-500/20"
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                      <Heart className="w-5 h-5" />
                      Send ${finalAmount} Tip
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
