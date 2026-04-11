"use client";

import { useState } from "react";
import { X, ShoppingBag, CreditCard, CheckCircle2, Loader2, Tag } from "lucide-react";

interface CheckoutModalProps {
  product: any;
  username: string;
  onClose: () => void;
}

export default function CheckoutModal({ product, username, onClose }: CheckoutModalProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [promoCode, setPromoCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [orderResult, setOrderResult] = useState<any>(null);

  const handleCheckout = async () => {
    if (!email) { setError("Email is required"); return; }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          customerEmail: email,
          customerName: name,
          promoCode: promoCode || undefined,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        if (data.url) {
          window.location.href = data.url;
        } else {
          setSuccess(true);
          setOrderResult(data.order);
        }
      } else {
        setError(data.error || "Checkout failed");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-6 duration-500">
        
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
              <ShoppingBag className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h3 className="font-black text-slate-900">Checkout</h3>
              <p className="text-xs text-slate-400">Secure purchase</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors">
            <X className="w-4 h-4 text-slate-500" />
          </button>
        </div>

        {success ? (
          /* Success State */
          <div className="p-10 text-center">
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 mb-2">Payment Successful! 🎉</h3>
            <p className="text-slate-500 mb-6">You'll receive a confirmation email at {email}</p>
            {orderResult?.digitalUrl && (
              <a href={orderResult.digitalUrl} target="_blank" className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-2xl font-bold hover:bg-indigo-700 transition-colors">
                Download Now
              </a>
            )}
            <button onClick={onClose} className="block w-full mt-4 text-sm text-slate-400 hover:text-slate-600">Close</button>
          </div>
        ) : (
          /* Checkout Form */
          <div className="p-6 space-y-5">
            {/* Product Summary */}
            <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
              <div className="w-16 h-16 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 overflow-hidden">
                {product.image ? (
                  <img src={product.image} className="w-full h-full object-cover rounded-xl" alt={product.name} />
                ) : (
                  <ShoppingBag className="w-6 h-6 text-indigo-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-slate-900 truncate">{product.name}</p>
                <p className="text-xs text-slate-400 uppercase font-bold tracking-wider">{product.productType}</p>
              </div>
              <span className="text-xl font-black text-slate-900">${product.price}</span>
            </div>

            {/* Form Fields */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Your Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address *</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                <Tag className="w-3 h-3" /> Promo Code
              </label>
              <input
                type="text"
                value={promoCode}
                onChange={e => setPromoCode(e.target.value.toUpperCase())}
                placeholder="SAVE20"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium text-slate-900 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-300 outline-none transition-all font-mono"
              />
            </div>

            {error && (
              <p className="text-sm text-rose-500 font-medium text-center bg-rose-50 p-3 rounded-xl">{error}</p>
            )}

            {/* Pay Button */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full flex items-center justify-center gap-3 bg-slate-900 text-white py-4 rounded-2xl font-black text-sm hover:bg-slate-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <CreditCard className="w-5 h-5" />
                  Pay ${product.price}
                </>
              )}
            </button>

            <p className="text-[10px] text-slate-400 text-center">
              Powered by getprofile.link • Secure payment processing
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
