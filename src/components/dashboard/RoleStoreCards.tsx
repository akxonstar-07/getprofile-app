// ═══════════════════════════════════════════════════
// Role-Specific Store Page Components
// Each role category renders a different UI for their "store"
// Barber → Service Menu Cards | Fitness → Program Cards | Lawyer → Resource Downloads
// ═══════════════════════════════════════════════════
"use client";

import { ShoppingBag, Clock, DollarSign, Package, Star, Download, BookOpen, Coffee, Scissors, Dumbbell, Briefcase, Music, Home, GraduationCap, Heart } from "lucide-react";

// ── SERVICE MENU (Barber, Plumber, Nail Tech) ──
export function ServiceMenuCard({ product, onDelete, onToggle }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all group relative overflow-hidden flex items-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-600 flex-shrink-0">
        <Scissors className="w-7 h-7" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-black text-slate-900 text-lg truncate">{product.name}</h3>
          {!product.enabled && <span className="text-[9px] font-black px-2 py-1 bg-slate-100 text-slate-400 rounded-full uppercase">Draft</span>}
        </div>
        {product.description && <p className="text-slate-500 text-sm line-clamp-1">{product.description}</p>}
        <div className="flex items-center gap-4 mt-2">
          {product.duration && (
            <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
              <Clock className="w-3 h-3" /> {product.duration} min
            </span>
          )}
          <span className="text-teal-600 font-black text-lg">${product.price}</span>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <button onClick={() => onToggle(product.id, product.enabled)}
          className={`w-10 h-6 rounded-full transition-all relative ${product.enabled ? "bg-teal-500" : "bg-slate-200"}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${product.enabled ? "left-4" : "left-0.5"}`} />
        </button>
        <button onClick={() => onDelete(product.id)} className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 flex items-center justify-center transition-all text-sm">✕</button>
      </div>
    </div>
  );
}

// ── PROGRAM CARD (Fitness Coach, Online Tutor) ──
export function ProgramCard({ product, onDelete, onToggle }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all group relative overflow-hidden">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-14 h-14 rounded-2xl bg-orange-500/10 flex items-center justify-center text-orange-600 flex-shrink-0">
          <Dumbbell className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-500 mb-1 block">{product.productType || "DIGITAL"}</span>
          <h3 className="font-black text-slate-900 text-lg leading-tight">{product.name}</h3>
        </div>
        <button onClick={() => onDelete(product.id)} className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 flex items-center justify-center transition-all text-sm flex-shrink-0">✕</button>
      </div>
      {product.description && <p className="text-slate-500 text-sm line-clamp-2 mb-4">{product.description}</p>}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100">
        <span className="text-2xl font-black text-slate-900">${product.price}</span>
        <button onClick={() => onToggle(product.id, product.enabled)}
          className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${product.enabled ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-500"}`}>
          {product.enabled ? "Live" : "Draft"}
        </button>
      </div>
    </div>
  );
}

// ── RESOURCE CARD (Lawyer, Job Seeker, Marketing Manager) ──
export function ResourceCard({ product, onDelete, onToggle }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all group flex items-center gap-5">
      <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center flex-shrink-0">
        <Download className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-bold text-slate-900 truncate">{product.name}</h3>
        {product.description && <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{product.description}</p>}
        <span className="text-xs font-black text-slate-400 mt-1 block">{product.price > 0 ? `$${product.price}` : "Free Resource"}</span>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button onClick={() => onToggle(product.id, product.enabled)}
          className={`w-10 h-6 rounded-full transition-all relative ${product.enabled ? "bg-slate-900" : "bg-slate-200"}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${product.enabled ? "left-4" : "left-0.5"}`} />
        </button>
        <button onClick={() => onDelete(product.id)} className="w-8 h-8 rounded-lg bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 flex items-center justify-center text-sm transition-all">✕</button>
      </div>
    </div>
  );
}

// ── MERCH CARD (Artist, Content Creator) ──
export function MerchCard({ product, onDelete, onToggle }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group">
      <div className="h-40 bg-gradient-to-br from-purple-500/10 to-pink-500/10 flex items-center justify-center border-b border-slate-100 relative">
        {product.image ? (
          <img src={product.image} className="w-full h-full object-cover" alt={product.name} />
        ) : (
          <Music className="w-10 h-10 text-purple-300" />
        )}
        <div className="absolute top-3 right-3">
          <button onClick={() => onToggle(product.id, product.enabled)}
            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${product.enabled ? "bg-emerald-500 text-white" : "bg-white text-slate-500 border"}`}>
            {product.enabled ? "Live" : "Draft"}
          </button>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-black text-slate-900 mb-1">{product.name}</h3>
        {product.description && <p className="text-slate-500 text-xs line-clamp-2 mb-3">{product.description}</p>}
        <div className="flex items-center justify-between">
          <span className="text-xl font-black text-purple-600">${product.price}</span>
          <button onClick={() => onDelete(product.id)} className="text-slate-300 hover:text-rose-500 transition-colors text-sm">✕</button>
        </div>
      </div>
    </div>
  );
}

// ── LISTING CARD (Real Estate, Collector) ──
export function ListingCard({ product, onDelete, onToggle }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-2xl transition-all group">
      <div className="h-48 bg-gradient-to-br from-rose-500/10 to-orange-500/10 flex items-center justify-center border-b border-slate-100 relative overflow-hidden">
        {product.image ? (
          <img src={product.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={product.name} />
        ) : (
          <Home className="w-12 h-12 text-rose-300" />
        )}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <span className="text-white font-black text-xl">${product.price?.toLocaleString()}</span>
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-900 mb-2">{product.name}</h3>
        {product.description && <p className="text-slate-500 text-xs line-clamp-2 mb-4">{product.description}</p>}
        <div className="flex items-center justify-between">
          <button onClick={() => onToggle(product.id, product.enabled)}
            className={`px-4 py-2 rounded-xl text-xs font-black uppercase ${product.enabled ? "bg-rose-500 text-white" : "bg-slate-100 text-slate-500"}`}>
            {product.enabled ? "Active Listing" : "Unlisted"}
          </button>
          <button onClick={() => onDelete(product.id)} className="text-slate-300 hover:text-rose-500 transition-colors">✕</button>
        </div>
      </div>
    </div>
  );
}

// ── GENERIC PRODUCT CARD (default fallback) ──
export function GenericProductCard({ product, onDelete, onToggle }: any) {
  return (
    <div className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl transition-all group flex items-center gap-5">
      <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0">
        {product.image ? <img src={product.image} className="w-full h-full object-cover rounded-2xl" /> : <Package className="w-7 h-7 text-indigo-400" />}
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 mb-1 block">{product.productType}</span>
        <h3 className="font-black text-slate-900 truncate">{product.name}</h3>
        {product.description && <p className="text-slate-500 text-xs line-clamp-1 mt-0.5">{product.description}</p>}
        <span className="text-lg font-black text-slate-900 mt-1 block">${product.price}</span>
      </div>
      <div className="flex flex-col gap-2 flex-shrink-0">
        <button onClick={() => onToggle(product.id, product.enabled)}
          className={`w-10 h-6 rounded-full transition-all relative ${product.enabled ? "bg-indigo-500" : "bg-slate-200"}`}>
          <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${product.enabled ? "left-4" : "left-0.5"}`} />
        </button>
        <button onClick={() => onDelete(product.id)} className="w-10 h-10 rounded-2xl bg-slate-50 hover:bg-rose-50 hover:text-rose-500 text-slate-400 flex items-center justify-center transition-all text-sm">✕</button>
      </div>
    </div>
  );
}

// ── SELECTOR: Pick the right card component for a role ──
export function getRoleStoreCard(role: string) {
  const serviceRoles = ["barber", "store_manager"];
  const programRoles = ["fitness_coach", "online_tutor", "high_ticket_coach", "motivational_speaker", "stock_analyst"];
  const resourceRoles = ["lawyer", "job_seeker", "student", "marketing_manager", "social_media_manager", "freelancer", "video_editor"];
  const merchRoles = ["artist", "content_creator", "ngo_member"];
  const listingRoles = ["real_estate", "collector"];

  if (serviceRoles.includes(role)) return ServiceMenuCard;
  if (programRoles.includes(role)) return ProgramCard;
  if (resourceRoles.includes(role)) return ResourceCard;
  if (merchRoles.includes(role)) return MerchCard;
  if (listingRoles.includes(role)) return ListingCard;
  return GenericProductCard;
}
