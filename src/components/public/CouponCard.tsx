"use client";

import { useState } from "react";
import { Scissors, Check } from "lucide-react";
import { toast } from "sonner";

interface CouponCardProps {
  couponCode: string;
  accentColor: string;
}

export default function CouponCard({ couponCode, accentColor }: CouponCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    toast.success("Coupon code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full mt-3 p-3 rounded-2xl border-2 border-dashed border-black/10 flex items-center justify-between bg-white overflow-hidden relative group cursor-pointer" onClick={handleCopy}>
      <div className="absolute inset-0 opacity-10" style={{ background: accentColor }} />
      <div className="flex items-center gap-3 relative z-10">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: accentColor }}>
          <Scissors className="w-5 h-5 -rotate-90" />
        </div>
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest opacity-60 text-black">Use Code at Checkout</p>
          <p className="text-lg font-black tracking-tight" style={{ color: accentColor }}>{couponCode}</p>
        </div>
      </div>
      <button className="relative z-10 w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 transition-colors flex items-center justify-center" style={{ color: copied ? accentColor : "black" }}>
        {copied ? <Check className="w-5 h-5" /> : <span className="text-[10px] font-black uppercase">Copy</span>}
      </button>
    </div>
  );
}
