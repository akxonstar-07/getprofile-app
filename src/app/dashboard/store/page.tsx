"use client";

import { useState, useEffect } from "react";
import {
  Plus, ShoppingBag, DollarSign, Package, Trash2, Edit2, Loader2, X,
  BookOpen, Crown, Heart, Sparkles, Image as ImageIcon, Video, Percent
} from "lucide-react";
import { toast } from "sonner";

export default function StorePage() {
  const [activeTab, setActiveTab] = useState<"products" | "courses" | "memberships" | "tips">("products");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [stats, setStats] = useState({ totalSales: 0, totalRevenue: 0, activeItems: 0 });

  // Add Product State
  const [newProduct, setNewProduct] = useState({
    name: "", description: "", price: "", productType: "DIGITAL", 
    inventory: 1, image: "", digitalUrl: "", couponCode: "", courseModules: "[]"
  });

  const [courseModules, setCourseModules] = useState<{ title: string; chapters: { title: string; duration: string }[] }[]>([
    { title: "Module 1", chapters: [{ title: "Introduction", duration: "5:00" }] }
  ]);

  // Add Membership State
  const [newTier, setNewTier] = useState({
    title: "", description: "", pricePerMonth: "", image: "", 
    color: "#a855f7", benefits: ""
  });

  // Add Tip State
  const [tipGoal, setTipGoal] = useState({
    title: "", tipGoalAmount: "", tipCurrentAmount: "0", image: ""
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === "products" || activeTab === "courses") {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.products) {
          const filtered = data.products.filter((p:any) => activeTab === "courses" ? p.productType === "COURSE" : p.productType !== "COURSE");
          setItems(filtered);
          setStats({
            totalSales: filtered.reduce((acc: number, p: any) => acc + (p._count?.orders || 0), 0),
            totalRevenue: filtered.reduce((acc: number, p: any) => acc + ((p._count?.orders || 0) * p.price), 0),
            activeItems: filtered.filter((p: any) => p.enabled).length
          });
        }
      } else if (activeTab === "memberships") {
        // Assume API exists or falls back empty for now during frontend scaffolding
        setItems([]);
      } else if (activeTab === "tips") {
        const res = await fetch("/api/profile");
        const data = await res.json();
        if (data.user?.profile) {
          setTipGoal({
            title: data.user.profile.tipGoalTitle || "",
            tipGoalAmount: data.user.profile.tipGoalAmount?.toString() || "",
            tipCurrentAmount: data.user.profile.tipCurrentAmount?.toString() || "0",
            image: data.user.profile.tipGoalImage || ""
          });
        }
      }
    } catch (err) {
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price) || 0,
          inventory: parseInt(newProduct.inventory.toString()) || 0,
          productType: activeTab === "courses" ? "COURSE" : newProduct.productType,
          courseModules: activeTab === "courses" ? JSON.stringify(courseModules) : newProduct.courseModules
        })
      });
      if (res.ok) {
        toast.success(activeTab === "courses" ? "Course launched!" : "Product launched!");
        setIsAdding(false);
        fetchData();
        setNewProduct({ name: "", description: "", price: "", productType: "DIGITAL", inventory: 1, image: "", digitalUrl: "", couponCode: "", courseModules: "[]" });
      }
    } catch (err) { toast.error("Failed to add product"); }
  };

  const handleUpdateTips = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/onboarding", { // using existing generic profile update endpoint 
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ monetization: {
          tipGoalTitle: tipGoal.title,
          tipGoalAmount: parseFloat(tipGoal.tipGoalAmount) || 0,
          tipGoalImage: tipGoal.image
        }})
      });
      toast.success("Tip goal updated!");
    } catch (err) { toast.error("Failed to update goal"); }
  };

  if (loading) {
    return <div className="flex items-center justify-center min-h-[400px]"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 w-full max-w-5xl">
      
      {/* ── HEADER ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Monetization Hub</h1>
          <p className="text-slate-500">Manage your products, courses, and fan memberships.</p>
        </div>
        {activeTab !== "tips" && (
          <button 
            onClick={() => setIsAdding(true)}
            className="bg-black text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:shadow-lg transition-all">
            <Plus className="w-4 h-4" /> Add {activeTab === "products" ? "Product" : activeTab === "courses" ? "Course" : "Tier"}
          </button>
        )}
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl w-fit">
        {[
          { id: "products", icon: ShoppingBag, label: "Products" },
          { id: "courses", icon: BookOpen, label: "Courses" },
          { id: "memberships", icon: Crown, label: "VIP Memberships" },
          { id: "tips", icon: Heart, label: "Tip Goals" }
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => { setActiveTab(t.id as any); setIsAdding(false); }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
              activeTab === t.id ? "bg-white text-black shadow-sm" : "text-slate-500 hover:text-slate-800"
            }`}>
            <t.icon className={`w-4 h-4 ${activeTab === t.id && t.id === 'memberships' ? 'text-amber-500' : activeTab === t.id && t.id === 'tips' ? 'text-rose-500' : ''}`} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── ADD PRODUCT / COURSE FORM ── */}
      {isAdding && (activeTab === "products" || activeTab === "courses") && (
        <div className="bg-slate-900 p-8 rounded-[32px] shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-black text-white">Create New {activeTab === "courses" ? "Course" : "Product"}</h2>
            <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white">✕</button>
          </div>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
               <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Title</label>
                  <input required className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Price ($)</label>
                  <input type="number" required className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block">Cover Image URL</label>
                  <input className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none" value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
               </div>
            </div>
            <div className="space-y-4">
               {activeTab === "products" && (
                 <div>
                    <label className="text-xs font-bold text-slate-400 mb-1 block">Type</label>
                    <select className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none" value={newProduct.productType} onChange={e => setNewProduct({...newProduct, productType: e.target.value as any})}>
                      <option value="DIGITAL">Digital Download</option>
                      <option value="PHYSICAL">Physical Goods</option>
                      <option value="SERVICE">Service</option>
                    </select>
                 </div>
               )}
               {activeTab === "courses" && (
                 <div className="col-span-1 md:col-span-2 mt-4 border-t border-white/10 pt-4">
                    <label className="text-sm font-black text-white mb-4 flex items-center gap-2"><Video className="w-4 h-4 text-indigo-400"/> Course Curriculum Builder</label>
                    <div className="space-y-4">
                      {courseModules.map((mod, mIdx) => (
                        <div key={mIdx} className="bg-white/5 border border-white/10 rounded-2xl p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="bg-indigo-500 text-white text-[10px] font-black px-2 py-1 rounded-md">M{mIdx + 1}</span>
                            <input 
                              className="flex-1 bg-transparent border-b border-white/20 px-2 py-1 text-white font-bold outline-none focus:border-indigo-500 transition-colors" 
                              value={mod.title} 
                              onChange={e => {
                                const newMods = [...courseModules];
                                newMods[mIdx].title = e.target.value;
                                setCourseModules(newMods);
                              }} 
                              placeholder="Module Title" 
                            />
                            <button type="button" onClick={() => setCourseModules(courseModules.filter((_, i) => i !== mIdx))} className="text-rose-400 hover:text-rose-500"><Trash2 className="w-4 h-4"/></button>
                          </div>
                          <div className="space-y-2 pl-4 border-l-2 border-white/10">
                            {mod.chapters.map((ch, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-2">
                                <Video className="w-3 h-3 text-white/30" />
                                <input 
                                  className="flex-[2] bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500" 
                                  placeholder="Chapter Title" 
                                  value={ch.title}
                                  onChange={e => {
                                    const newMods = [...courseModules];
                                    newMods[mIdx].chapters[cIdx].title = e.target.value;
                                    setCourseModules(newMods);
                                  }}
                                />
                                <input 
                                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-indigo-500" 
                                  placeholder="Duration (e.g. 5:00)" 
                                  value={ch.duration}
                                  onChange={e => {
                                    const newMods = [...courseModules];
                                    newMods[mIdx].chapters[cIdx].duration = e.target.value;
                                    setCourseModules(newMods);
                                  }}
                                />
                                <button type="button" onClick={() => {
                                  const newMods = [...courseModules];
                                  newMods[mIdx].chapters = newMods[mIdx].chapters.filter((_, i) => i !== cIdx);
                                  setCourseModules(newMods);
                                }} className="text-white/30 hover:text-rose-400"><X className="w-3 h-3"/></button>
                              </div>
                            ))}
                            <button type="button" onClick={() => {
                              const newMods = [...courseModules];
                              newMods[mIdx].chapters.push({ title: "", duration: "" });
                              setCourseModules(newMods);
                            }} className="text-[10px] font-black uppercase text-indigo-400 mt-2 flex items-center gap-1 hover:text-indigo-300">
                              <Plus className="w-3 h-3" /> Add Chapter
                            </button>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => setCourseModules([...courseModules, { title: `Module ${courseModules.length + 1}`, chapters: [{ title: "", duration: "" }] }])} className="w-full py-3 border-2 border-dashed border-white/20 rounded-2xl text-xs font-bold text-white/60 hover:text-white hover:border-white/40 transition-colors flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Add New Module
                      </button>
                    </div>
                 </div>
               )}
               <div>
                  <label className="text-xs font-bold text-slate-400 mb-1 block flex items-center gap-2"><Percent className="w-3 h-3"/> Fan Promo Code (Optional)</label>
                  <input className="w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white outline-none placeholder:text-white/20" placeholder="e.g. EARLYBIRD" value={newProduct.couponCode} onChange={e => setNewProduct({...newProduct, couponCode: e.target.value})} />
               </div>
               <button className="w-full bg-indigo-500 text-white py-4 rounded-xl font-bold mt-4 hover:bg-indigo-600 transition-all">
                  Launch {activeTab === "courses" ? "Course" : "Product"}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* ── ALERTS FOR MEMBERSHIPS ── */}
      {activeTab === "memberships" && (
        <div className="bg-amber-500/10 border border-amber-500/20 p-8 rounded-3xl text-center">
           <Crown className="w-12 h-12 text-amber-500 mx-auto mb-4" />
           <h3 className="text-xl font-black text-amber-600 mb-2">Stripe Connect Required</h3>
           <p className="text-amber-600/80 mb-6 text-sm">To enable recurring VIP subscriptions, you must link your Stripe account in Settings.</p>
           <button className="px-6 py-2.5 bg-amber-500 text-white font-bold rounded-xl shadow-lg shadow-amber-500/20">Connect Stripe</button>
        </div>
      )}

      {/* ── TIPS & FUNDRAISING EDITOR ── */}
      {activeTab === "tips" && (
        <div className="bg-white border p-8 rounded-3xl shadow-sm">
           <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center text-rose-500"><Heart className="w-5 h-5"/></div>
             <div>
               <h3 className="text-lg font-black text-slate-900">Fundraising & Tip Goal</h3>
               <p className="text-sm text-slate-500">Show a progress thermometer on your profile</p>
             </div>
           </div>
           
           <form onSubmit={handleUpdateTips} className="space-y-5 max-w-xl">
             <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">What are you raising for?</label>
                <input required className="input-premium" placeholder="e.g. New Camera Gear" value={tipGoal.title} onChange={e => setTipGoal({...tipGoal, title: e.target.value})} />
             </div>
             <div className="grid grid-cols-2 gap-4">
               <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Goal Amount ($)</label>
                  <input type="number" required className="input-premium" placeholder="5000" value={tipGoal.tipGoalAmount} onChange={e => setTipGoal({...tipGoal, tipGoalAmount: e.target.value})} />
               </div>
               <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Current Amount ($)</label>
                  <input type="number" disabled className="input-premium bg-slate-50" value={tipGoal.tipCurrentAmount} />
               </div>
             </div>
             <button className="bg-black text-white px-6 py-3 rounded-xl font-bold w-full hover:bg-slate-800 transition-all">Save Active Goal</button>
           </form>
        </div>
      )}

      {/* ── ITEM LIST (Products & Courses) ── */}
      {(activeTab === "products" || activeTab === "courses") && !isAdding && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 ? (
            <div className="col-span-full py-16 text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="font-bold text-slate-500">No {activeTab} created yet.</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all group">
                <div className="aspect-video bg-slate-100 relative">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  {item.productType === "COURSE" && <div className="absolute top-2 right-2 bg-indigo-500 text-white text-[10px] font-black px-2 py-1 rounded-md flex items-center gap-1"><BookOpen className="w-3 h-3"/> COURSE</div>}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-slate-900 mb-1">{item.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="font-black text-lg">${item.price}</span>
                    <button className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-4 h-4"/></button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
