"use client";

import { useState, useEffect } from "react";
import { 
  Plus, ShoppingBag, DollarSign, Package, TrendingUp, 
  Trash2, Edit2, ExternalLink, Globe, Smartphone, Check, AlertCircle, Loader2
} from "lucide-react";
import { toast } from "sonner";
import { useRoleDashboardConfig } from "@/hooks/useRoleDashboardConfig";
import { getRoleStoreCard } from "@/components/dashboard/RoleStoreCards";

export default function StorePage() {
  const { config, role } = useRoleDashboardConfig();
  const pageConfig = config.pages.store;
  const RoleCard = getRoleStoreCard(role);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    activeProducts: 0
  });

  // Modal State
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    productType: "DIGITAL",
    inventory: 1,
    image: "",
    digitalUrl: "",
    isAffiliate: false
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.products) {
        setProducts(data.products);
        // Calc simple stats
        setStats({
          totalSales: data.products.reduce((acc: number, p: any) => acc + (p._count?.orders || 0), 0),
          totalRevenue: data.products.reduce((acc: number, p: any) => acc + ((p._count?.orders || 0) * p.price), 0),
          activeProducts: data.products.filter((p: any) => p.enabled).length
        });
      }
    } catch (err) {
      toast.error("Failed to load products");
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
          inventory: parseInt(newProduct.inventory.toString()) || 0
        })
      });
      if (res.ok) {
        toast.success("Product launched successfully! 🚀");
        setIsAdding(false);
        fetchProducts();
        setNewProduct({
          name: "", description: "", price: "", productType: "DIGITAL", 
          inventory: 1, image: "", digitalUrl: "", isAffiliate: false
        });
      }
    } catch (err) {
      toast.error("Failed to add product");
    }
  };

  const toggleProduct = async (id: string, enabled: boolean) => {
    try {
      await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !enabled })
      });
      fetchProducts();
    } catch (err) {
      toast.error("Failed to update product");
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      toast.success("Product removed");
      fetchProducts();
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* ── HEADER & STATS ── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-1">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600">
                <ShoppingBag className="w-5 h-5" />
             </div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tight">{pageConfig.title}</h1>
          </div>
          <p className="text-slate-500 font-medium max-w-md">{pageConfig.subtitle}</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-black text-white px-8 py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center gap-2 hover:shadow-2xl hover:shadow-black/20 hover:-translate-y-1 transition-all">
          <Plus className="w-4 h-4" /> {pageConfig.addLabel}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Total Sales", value: stats.totalSales, icon: ShoppingBag, color: "bg-blue-500" },
          { label: "Revenue", value: `$${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, color: "bg-emerald-500" },
          { label: "Active Items", value: stats.activeProducts, icon: Package, color: "bg-indigo-500" },
        ].map((stat, i) => (
          <div key={i} className="bg-white border border-slate-200 p-6 rounded-[32px] shadow-sm hover:shadow-xl transition-all group overflow-hidden relative">
            <div className={`absolute top-0 right-0 w-24 h-24 ${stat.color} opacity-[0.03] rounded-bl-full transition-transform duration-500 group-hover:scale-150`} />
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-2xl ${stat.color} flex items-center justify-center text-white shadow-lg`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-0.5">{stat.label}</p>
                <p className="text-2xl font-black text-slate-900 leading-none">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── ADD PRODUCT FORM ── */}
      {isAdding && (
        <div className="bg-slate-900 p-8 rounded-[40px] shadow-2xl animate-in zoom-in-95 duration-300 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
          <div className="flex items-center justify-between mb-8 relative z-10">
            <h2 className="text-xl font-black text-white uppercase tracking-wider">Launch New Product</h2>
            <button onClick={() => setIsAdding(false)} className="text-white/40 hover:text-white transition-colors">× Cancel</button>
          </div>
          <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10">
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Product Name</label>
                <input 
                  required
                  placeholder="e.g. 10/10 Fitness Guide"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:border-indigo-500 outline-none transition-all"
                  value={newProduct.name}
                  onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Description</label>
                <textarea 
                  placeholder="Tell your fans why they need this..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:border-indigo-500 outline-none transition-all h-32 resize-none"
                  value={newProduct.description}
                  onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Price ($)</label>
                  <input 
                    type="number"
                    required
                    placeholder="29.99"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:border-indigo-500 outline-none transition-all"
                    value={newProduct.price}
                    onChange={e => setNewProduct({...newProduct, price: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Inventory</label>
                  <input 
                    type="number"
                    placeholder="1"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:border-indigo-500 outline-none transition-all"
                    value={newProduct.inventory}
                    onChange={e => setNewProduct({...newProduct, inventory: parseInt(e.target.value) || 1})}
                  />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Product Type</label>
                <div className="flex gap-2">
                  {["DIGITAL", "PHYSICAL", "SERVICE"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setNewProduct({...newProduct, productType: t as any})}
                      className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        newProduct.productType === t ? "bg-indigo-500 text-white" : "bg-white/5 text-white/40 hover:bg-white/10"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Product Image URL</label>
                <input 
                  placeholder="https://cloudinary.com/..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:border-indigo-500 outline-none transition-all"
                  value={newProduct.image}
                  onChange={e => setNewProduct({...newProduct, image: e.target.value})}
                />
              </div>
              <div>
                <label className="text-[10px] font-black uppercase text-slate-400 mb-2 block">Download/Asset Link</label>
                <input 
                  placeholder="Drive/S3 link to your asset"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder:text-white/20 focus:border-indigo-500 outline-none transition-all"
                  value={newProduct.digitalUrl}
                  onChange={e => setNewProduct({...newProduct, digitalUrl: e.target.value})}
                />
              </div>
              <button className="w-full bg-indigo-500 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-600 transition-all mt-4 shadow-xl shadow-indigo-500/20">
                Launch Product 🚀
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── PRODUCT LIST ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
        {products.length === 0 ? (
          <div className="col-span-full py-20 text-center border-4 border-dashed border-slate-100 rounded-[50px] bg-slate-50/30">
            <ShoppingBag className="w-16 h-16 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-black uppercase tracking-widest">{pageConfig.emptyText}</p>
          </div>
        ) : (
          products.map((product) => (
            <RoleCard 
              key={product.id} 
              product={product} 
              onDelete={deleteProduct} 
              onToggle={toggleProduct} 
            />
          ))
        )}
      </div>
    </div>
  );
}
