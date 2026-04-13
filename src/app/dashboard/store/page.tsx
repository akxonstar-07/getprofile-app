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
      await fetch("/api/onboarding", {
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
    return <div className="py-32 flex flex-col items-center justify-center text-white/50 gap-6">
       <div className="w-16 h-16 border-[6px] border-white/10 border-t-[#D2FF00] rounded-full animate-spin" />
       <p className="text-xs font-black uppercase tracking-[0.3em] text-[#D2FF00]">LOADING ENGINE...</p>
    </div>;
  }

  return (
    <div className="space-y-12 animate-in fade-in duration-500 w-full max-w-6xl mx-auto pb-20 mt-8">
      
      {/* ── HEADER ── */}
      <div className="bg-black border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
         <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#D2FF00]/10 blur-[100px] rounded-full -mr-20 -mt-20 pointer-events-none" />
         <div className="relative z-10">
           <div className="flex items-center gap-3 mb-2">
              <ShoppingBag className="w-6 h-6 text-[#D2FF00]" />
              <h1 className="font-komi text-5xl text-white uppercase tracking-tighter leading-none mt-1">Monetization Hub</h1>
           </div>
           <p className="text-[#D2FF00] text-sm font-black uppercase tracking-widest opacity-80">
              {stats.activeItems} Active Assets · High Fidelity Commerce
           </p>
         </div>
         {activeTab !== "tips" && (
           <button 
             onClick={() => setIsAdding(!isAdding)}
             className="relative z-10 bg-[#D2FF00] text-black px-8 py-5 rounded-2xl font-komi text-2xl uppercase tracking-widest shadow-[0_0_20px_rgba(210,255,0,0.2)] hover:scale-105 transition-transform shrink-0 flex items-center gap-2">
             <Plus className="w-5 h-5" /> {isAdding ? "CANCEL" : activeTab === "products" ? "NEW PRODUCT" : activeTab === "courses" ? "NEW COURSE" : "NEW TIER"}
           </button>
         )}
      </div>

      {/* ── TABS ── */}
      <div className="flex gap-2 flex-wrap items-center bg-white/5 p-2 rounded-[2rem] border border-white/10 w-[max-content]">
        {[
          { id: "products", icon: ShoppingBag, label: "Products" },
          { id: "courses", icon: BookOpen, label: "Courses" },
          { id: "memberships", icon: Crown, label: "VIP Memberships" },
          { id: "tips", icon: Heart, label: "Fundraising" }
        ].map(t => (
          <button 
            key={t.id}
            onClick={() => { setActiveTab(t.id as any); setIsAdding(false); }}
            className={`flex items-center gap-2 px-6 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest transition-all ${
              activeTab === t.id ? "bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]" : "text-white/40 hover:text-white/80 hover:bg-white/5"
            }`}>
            <t.icon className={`w-4 h-4 ${activeTab === t.id && t.id === 'memberships' ? 'text-amber-500' : activeTab === t.id && t.id === 'tips' ? 'text-rose-500' : ''}`} /> {t.label}
          </button>
        ))}
      </div>

      {/* ── ADD PRODUCT / COURSE FORM ── */}
      {isAdding && (activeTab === "products" || activeTab === "courses") && (
        <div className="bg-[#050505] p-10 rounded-[3rem] border border-[#D2FF00]/50 shadow-[0_0_40px_rgba(210,255,0,0.1)] relative overflow-hidden animate-in fade-in slide-in-from-top-4">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-komi text-4xl text-white uppercase tracking-tighter">Initialize {activeTab === "courses" ? "Course" : "Product"}</h2>
          </div>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Appellation (Title)</label>
                  <input required className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white font-bold outline-none focus:border-[#D2FF00] placeholder:text-white/20" placeholder="Alpha Preset Pack" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Valuation ($)</label>
                  <input type="number" required className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-[#D2FF00] font-mono text-xl outline-none focus:border-[#D2FF00] placeholder:text-white/20" placeholder="49.99" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Thumbnail Vector (URL)</label>
                  <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white font-mono text-sm outline-none focus:border-[#D2FF00] placeholder:text-white/20" placeholder="https://..." value={newProduct.image} onChange={e => setNewProduct({...newProduct, image: e.target.value})} />
               </div>
            </div>
            
            <div className="space-y-6">
               {activeTab === "products" && (
                 <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Class Type</label>
                    <select className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white outline-none focus:border-[#D2FF00] font-bold" value={newProduct.productType} onChange={e => setNewProduct({...newProduct, productType: e.target.value as any})}>
                      <option value="DIGITAL">Digital Download</option>
                      <option value="PHYSICAL">Physical Delivery</option>
                      <option value="SERVICE">Remote Service</option>
                    </select>
                 </div>
               )}
               
               {activeTab === "courses" && (
                 <div className="col-span-1 md:col-span-2 bg-[#111] border border-indigo-500/30 p-6 rounded-[2rem] shadow-[0_0_20px_rgba(99,102,241,0.1)]">
                    <label className="text-sm font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2"><Video className="w-4 h-4 text-indigo-400"/> Curriculum Engine</label>
                    <div className="space-y-4">
                      {courseModules.map((mod, mIdx) => (
                        <div key={mIdx} className="bg-black border border-white/10 rounded-2xl p-4">
                          <div className="flex items-center gap-3 mb-4">
                            <span className="bg-indigo-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg border border-indigo-400">M_{mIdx + 1}</span>
                            <input 
                              className="flex-1 bg-transparent border-b border-white/20 px-2 py-1 text-white font-bold outline-none focus:border-indigo-500 transition-colors" 
                              value={mod.title} 
                              onChange={e => {
                                const newMods = [...courseModules];
                                newMods[mIdx].title = e.target.value;
                                setCourseModules(newMods);
                              }} 
                              placeholder="Module Syntax" 
                            />
                            <button type="button" onClick={() => setCourseModules(courseModules.filter((_, i) => i !== mIdx))} className="text-white/30 hover:text-rose-500 flex items-center justify-center p-2 rounded-xl hover:bg-white/5"><Trash2 className="w-5 h-5"/></button>
                          </div>
                          
                          <div className="space-y-3 pl-4 border-l border-white/10 ml-4 py-2">
                            {mod.chapters.map((ch, cIdx) => (
                              <div key={cIdx} className="flex items-center gap-3">
                                <Video className="w-3 h-3 text-white/20" />
                                <input 
                                  className="flex-[2] bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:border-indigo-500 placeholder:text-white/20" 
                                  placeholder="Chapter Index" 
                                  value={ch.title}
                                  onChange={e => {
                                    const newMods = [...courseModules];
                                    newMods[mIdx].chapters[cIdx].title = e.target.value;
                                    setCourseModules(newMods);
                                  }}
                                />
                                <input 
                                  className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-mono text-[#D2FF00] outline-none focus:border-indigo-500 placeholder:text-[#D2FF00]/20" 
                                  placeholder="00:05:00" 
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
                                }} className="text-white/20 hover:text-rose-500 p-2"><X className="w-4 h-4"/></button>
                              </div>
                            ))}
                            <button type="button" onClick={() => {
                              const newMods = [...courseModules];
                              newMods[mIdx].chapters.push({ title: "", duration: "" });
                              setCourseModules(newMods);
                            }} className="text-[10px] font-black uppercase tracking-widest text-indigo-400 mt-4 flex items-center gap-1 hover:text-indigo-300 bg-indigo-500/10 px-3 py-2 rounded-lg w-max border border-indigo-500/20">
                              <Plus className="w-3 h-3" /> Append Node
                            </button>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={() => setCourseModules([...courseModules, { title: `Module ${courseModules.length + 1}`, chapters: [{ title: "", duration: "" }] }])} 
                        className="w-full py-5 border border-dashed border-white/20 rounded-2xl text-[10px] uppercase font-black tracking-[0.2em] text-white/40 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Instantiate Module
                      </button>
                    </div>
                 </div>
               )}
               
               <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2 flex items-center gap-2"><Percent className="w-3 h-3"/> Promotion Vector (Optional)</label>
                  <input className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-[#D2FF00] font-mono text-sm outline-none focus:border-[#D2FF00] placeholder:text-[#D2FF00]/20" placeholder="SUMMER2026" value={newProduct.couponCode} onChange={e => setNewProduct({...newProduct, couponCode: e.target.value})} />
               </div>
               
               <button className="w-full bg-[#D2FF00] text-black py-5 rounded-2xl font-komi text-2xl uppercase tracking-widest mt-4 hover:bg-white hover:scale-[1.02] transition-all">
                  DEPLOY {activeTab === "courses" ? "COURSE" : "ASSET"}
               </button>
            </div>
          </form>
        </div>
      )}

      {/* ── ALERTS FOR MEMBERSHIPS ── */}
      {activeTab === "memberships" && (
        <div className="bg-[#111] border border-amber-500/30 p-12 rounded-[3rem] text-center max-w-2xl mx-auto shadow-[0_0_40px_rgba(245,158,11,0.1)] relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />
           <Crown className="w-16 h-16 text-amber-500 mx-auto mb-6 relative z-10" />
           <h3 className="font-komi text-4xl text-white uppercase tracking-tighter mb-4 relative z-10">Stripe Integration Required</h3>
           <p className="text-white/50 mb-8 font-medium relative z-10">To enable recurring VIP subscriptions and dynamic tier progression, you must initialize your Stripe Connect token in the Global Settings.</p>
           <button className="px-10 py-5 bg-amber-500 text-black font-komi text-2xl uppercase tracking-widest rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform hover:bg-amber-400 relative z-10">Allocate Stripe Node</button>
        </div>
      )}

      {/* ── TIPS & FUNDRAISING EDITOR ── */}
      {activeTab === "tips" && (
        <div className="bg-[#050505] border border-white/10 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden max-w-2xl">
           <div className="flex items-center gap-4 mb-10 relative z-10">
             <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
                <Heart className="w-8 h-8"/>
             </div>
             <div>
               <h3 className="font-komi text-4xl text-white tracking-tighter uppercase">Community Vaulting</h3>
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Inject a fundraising thermometer</p>
             </div>
           </div>
           
           <form onSubmit={handleUpdateTips} className="space-y-8 relative z-10">
             <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Objective Tag</label>
                <input required className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-white font-bold placeholder:text-white/20 outline-none focus:border-rose-500" placeholder="e.g. Cinema Camera Rig" value={tipGoal.title} onChange={e => setTipGoal({...tipGoal, title: e.target.value})} />
             </div>
             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Target Mass ($)</label>
                  <input type="number" required className="w-full bg-black border border-white/10 rounded-2xl px-6 py-5 text-rose-400 font-mono text-xl placeholder:text-white/20 outline-none focus:border-rose-500" placeholder="5000" value={tipGoal.tipGoalAmount} onChange={e => setTipGoal({...tipGoal, tipGoalAmount: e.target.value})} />
               </div>
               <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50 ml-2">Current Mass ($)</label>
                  <input type="number" disabled className="w-full bg-white/5 border border-white/5 rounded-2xl px-6 py-5 text-white/30 font-mono text-xl cursor-not-allowed" value={tipGoal.tipCurrentAmount} />
               </div>
             </div>
             <button className="w-full bg-rose-600 text-white hover:bg-rose-500 py-5 rounded-2xl font-komi text-2xl uppercase tracking-widest transition-all">LOCK VECTORS</button>
           </form>
        </div>
      )}

      {/* ── ITEM LIST (Products & Courses) ── */}
      {(activeTab === "products" || activeTab === "courses") && !isAdding && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 ? (
             <div className="col-span-full border border-dashed border-white/20 rounded-[3rem] p-32 flex flex-col items-center justify-center text-center bg-[#050505]">
                <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-[1.5rem] flex items-center justify-center mb-8">
                   <ShoppingBag className="w-8 h-8 text-white/30" />
                </div>
                <h3 className="font-komi text-4xl text-white uppercase tracking-tighter mb-4">NO COMMERCE LOGS DETECTED</h3>
                <p className="text-white/40 text-sm max-w-sm font-medium">Instantiate a new {activeTab === "courses" ? "Course" : "Product"} to generate revenue.</p>
             </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="bg-[#050505] border border-white/10 rounded-[2rem] overflow-hidden hover:border-white/30 hover:shadow-2xl transition-all group shrink-0">
                <div className="aspect-[4/3] bg-black p-4 relative border-b border-white/10">
                  {item.image ? (
                     <div className="w-full h-full rounded-xl overflow-hidden">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80" />
                     </div>
                  ) : (
                     <div className="w-full h-full rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-white/10" />
                     </div>
                  )}
                  {item.productType === "COURSE" && <div className="absolute top-6 right-6 bg-indigo-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg uppercase tracking-[0.2em] shadow-lg flex items-center gap-1.5 border border-indigo-400"><BookOpen className="w-3.5 h-3.5"/> COURSE</div>}
                </div>
                <div className="p-6">
                  <h3 className="font-komi text-3xl text-white leading-none mt-2 truncate">{item.name}</h3>
                  <div className="flex items-end justify-between mt-6">
                    <span className="font-black text-2xl text-[#D2FF00]">${item.price}</span>
                    <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/30 hover:bg-rose-500 hover:text-white transition-all border border-white/10"><Trash2 className="w-4 h-4"/></button>
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
