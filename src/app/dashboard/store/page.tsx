"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, ShoppingBag, ToggleLeft, ToggleRight, ExternalLink, Tag, Link2, Star } from "lucide-react";
import ImageUpload from "@/components/dashboard/ImageUpload";

interface Product {
  id: string; name: string; description: string | null;
  price: number; image: string | null; checkoutUrl: string | null;
  enabled: boolean; isAffiliate: boolean; affiliateNote: string | null;
}

type Tab = "all" | "products" | "affiliate";
type FormType = "product" | "affiliate";

const emptyProductForm = { name: "", description: "", price: "", image: "", checkoutUrl: "", isAffiliate: false, affiliateNote: "" };

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState<FormType>("product");
  const [form, setForm] = useState(emptyProductForm);
  const [adding, setAdding] = useState(false);
  const [tab, setTab] = useState<Tab>("all");

  useEffect(() => { fetchProducts(); }, []);

  async function fetchProducts() {
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  }

  async function addItem() {
    if (!form.name) return;
    setAdding(true);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        price: form.isAffiliate ? 0 : (parseFloat(form.price) || 0),
        isAffiliate: formType === "affiliate",
      }),
    });
    setForm(emptyProductForm);
    setShowForm(false);
    setAdding(false);
    fetchProducts();
  }

  async function toggleProduct(id: string, enabled: boolean) {
    await fetch("/api/products", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, enabled: !enabled }),
    });
    fetchProducts();
  }

  async function deleteProduct(id: string) {
    await fetch(`/api/products?id=${id}`, { method: "DELETE" });
    fetchProducts();
  }

  const ownProducts    = products.filter((p) => !p.isAffiliate);
  const affiliateItems = products.filter((p) => p.isAffiliate);
  const displayed      = tab === "products" ? ownProducts : tab === "affiliate" ? affiliateItems : products;

  const totalValue = ownProducts.filter(p => p.enabled).reduce((a, p) => a + p.price, 0);

  if (loading) return (
    <div className="max-w-4xl grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {[1,2,3].map(i => <div key={i} className="animate-shimmer rounded-2xl aspect-[3/4]" />)}
    </div>
  );

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Creator Store</h1>
          <p className="text-slate-500 text-sm mt-1">
            {ownProducts.length} products · {affiliateItems.length} affiliate links
          </p>
        </div>
        <button onClick={() => { setShowForm(true); }} className="btn-primary">
          <Plus className="w-4 h-4" /> Add item
        </button>
      </div>

      {/* Stats */}
      {products.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="stat-card">
            <p className="text-xs text-slate-500 font-medium mb-1">Own Products</p>
            <p className="text-2xl font-bold text-slate-900">{ownProducts.length}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-slate-500 font-medium mb-1">Affiliate Links</p>
            <p className="text-2xl font-bold text-amber-600">{affiliateItems.length}</p>
          </div>
          <div className="stat-card">
            <p className="text-xs text-slate-500 font-medium mb-1">Catalog Value</p>
            <p className="text-2xl font-bold text-indigo-600">${totalValue.toFixed(0)}</p>
          </div>
        </div>
      )}

      {/* Add form */}
      {showForm && (
        <div className="dash-card mb-6 animate-slide-up border-2 border-indigo-100">
          {/* Form type toggle */}
          <div className="flex gap-2 mb-5">
            {(["product", "affiliate"] as FormType[]).map((t) => (
              <button
                key={t}
                onClick={() => { setFormType(t); setForm(emptyProductForm); }}
                className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
                  formType === t ? "gradient-bg text-white shadow-md" : "border border-slate-200 text-slate-600 hover:border-indigo-200"
                }`}
              >
                {t === "product" ? <><ShoppingBag className="w-4 h-4" /> Own Product</> : <><Tag className="w-4 h-4" /> Affiliate Link</>}
              </button>
            ))}
          </div>

          {formType === "product" ? (
            <>
              <h3 className="font-semibold text-slate-900 mb-4">New Product</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Product Name</label>
                  <input className="input-premium" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Social Media Presets Pack" autoFocus />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-sm">$</span>
                    <input className="input-premium pl-7" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} placeholder="29.99" />
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Description</label>
                <textarea className="input-premium resize-none" rows={2} value={form.description} onChange={e => setForm({...form, description: e.target.value})} placeholder="What do buyers get?" />
              </div>
                <ImageUpload 
                  label="Product Image / Cover" 
                  value={form.image} 
                  onChange={(url) => setForm({ ...form, image: url })} 
                  className="mb-5"
                />
              <div className="grid sm:grid-cols-1 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Checkout Link</label>
                  <input className="input-premium" type="url" value={form.checkoutUrl} onChange={e => setForm({...form, checkoutUrl: e.target.value})} placeholder="https://gumroad.com/…" />
                </div>
              </div>
              <p className="text-xs text-slate-400 mb-4">💡 Works with Gumroad, Lemon Squeezy, Stripe, Payhip, or any checkout link.</p>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-slate-900 mb-4">New Affiliate Link</h3>
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 mb-4">
                <p className="text-xs text-amber-700">Affiliate links are shown with an "AD" badge on your public profile for transparency.</p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Brand / Product Name</label>
                  <input className="input-premium" value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Notion, Canva, Amazon..." autoFocus />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Affiliate Link</label>
                  <input className="input-premium" type="url" value={form.checkoutUrl} onChange={e => setForm({...form, checkoutUrl: e.target.value})} placeholder="https://amzn.to/..." />
                </div>
              </div>
                <ImageUpload 
                  label="Brand Logo / Icon (optional)" 
                  value={form.image} 
                  onChange={(url) => setForm({ ...form, image: url })} 
                  className="mb-5"
                />
              <div className="grid sm:grid-cols-1 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5 uppercase tracking-wide">Short Note (optional)</label>
                  <input className="input-premium" value={form.affiliateNote} onChange={e => setForm({...form, affiliateNote: e.target.value})} placeholder="My favourite tool for design" />
                </div>
              </div>
            </>
          )}

          <div className="flex items-center gap-3">
            <button onClick={addItem} disabled={adding || !form.name} className="btn-primary">
              {adding ? "Adding…" : formType === "product" ? "Add Product" : "Add Affiliate Link"}
            </button>
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      {products.length > 0 && (
        <div className="flex gap-1 mb-5 bg-slate-100 p-1 rounded-xl w-fit">
          {([["all","All"], ["products","Products"], ["affiliate","Affiliate"]] as [Tab, string][]).map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${tab === t ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}>
              {label}
            </button>
          ))}
        </div>
      )}

      {/* Items */}
      {displayed.length === 0 ? (
        <div className="dash-card py-16 text-center">
          <div className="w-14 h-14 rounded-2xl gradient-bg-subtle flex items-center justify-center mx-auto mb-4">
            {tab === "affiliate" ? <Tag className="w-7 h-7 text-amber-400" /> : <ShoppingBag className="w-7 h-7 text-indigo-400" />}
          </div>
          <h3 className="font-semibold text-slate-800 mb-1">
            {tab === "affiliate" ? "No affiliate links yet" : "No products yet"}
          </h3>
          <p className="text-slate-400 text-sm mb-5">
            {tab === "affiliate"
              ? "Add affiliate links from Amazon, Notion, Canva, etc."
              : "Sell ebooks, presets, courses, templates, or anything digital"}
          </p>
          <button onClick={() => { setFormType(tab === "affiliate" ? "affiliate" : "product"); setShowForm(true); }} className="btn-primary mx-auto">
            <Plus className="w-4 h-4" />
            {tab === "affiliate" ? "Add affiliate link" : "Add first product"}
          </button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayed.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-2xl border overflow-hidden card-hover group flex flex-col ${
                item.isAffiliate ? "border-amber-100" : "border-slate-100"
              } ${!item.enabled ? "opacity-55" : ""}`}
            >
              {/* Image */}
              <div className="aspect-video relative overflow-hidden">
                {item.image
                  ? <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  : <div className="w-full h-full flex items-center justify-center"
                      style={{ background: item.isAffiliate ? "linear-gradient(135deg,#fef3c7,#fde68a)" : "linear-gradient(135deg,#d1fae5,#ecfeff)" }}>
                      {item.isAffiliate ? <Tag className="w-9 h-9 text-amber-400" /> : <ShoppingBag className="w-9 h-9 text-emerald-400" />}
                    </div>}

                {/* Type badge */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${item.isAffiliate ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {item.isAffiliate ? "AFFILIATE" : "PRODUCT"}
                  </span>
                </div>

                {/* Actions overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent opacity-0 group-hover:opacity-100 transition-all flex items-end justify-between p-3">
                  <button onClick={() => toggleProduct(item.id, item.enabled)} className="p-2 bg-white/90 rounded-xl">
                    {item.enabled ? <ToggleRight className="w-4 h-4 text-indigo-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                  </button>
                  <div className="flex gap-2">
                    {item.checkoutUrl && (
                      <a href={item.checkoutUrl} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/90 rounded-xl text-slate-700 hover:text-indigo-600">
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button onClick={() => deleteProduct(item.id)} className="p-2 bg-white/90 rounded-xl text-slate-700 hover:text-red-500">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Info */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1.5">
                  <h3 className="font-semibold text-slate-900 text-sm leading-tight">{item.name}</h3>
                  {!item.isAffiliate && (
                    <span className="text-sm font-bold text-emerald-600 flex-shrink-0">${item.price.toFixed(2)}</span>
                  )}
                </div>
                {item.description && <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{item.description}</p>}
                {item.affiliateNote && <p className="text-xs text-amber-600 mt-1 italic">"{item.affiliateNote}"</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
