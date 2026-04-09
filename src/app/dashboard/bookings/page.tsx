"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Mail, User, CheckCircle, XCircle, AlertCircle, Phone } from "lucide-react";
import { useRoleDashboardConfig } from "@/hooks/useRoleDashboardConfig";

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  date: string;
  time: string;
  duration: number;
  status: string;
  preQualAnswers: string | null;
  notes: string | null;
  createdAt: string;
}

export default function BookingsPage() {
  const { config } = useRoleDashboardConfig();
  const pageConfig = config.pages.bookings;
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("ALL");

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const res = await fetch("/api/booking");
      if (res.ok) setBookings(await res.json());
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await fetch("/api/booking", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
    fetchBookings();
  };

  const filtered = filter === "ALL" ? bookings : bookings.filter(b => b.status === filter);

  const statusColors: Record<string, string> = {
    PENDING: "text-amber-600 bg-amber-50 border-amber-200",
    CONFIRMED: "text-green-600 bg-green-50 border-green-200",
    CANCELLED: "text-red-500 bg-red-50 border-red-200",
  };

  const statusIcons: Record<string, any> = {
    PENDING: AlertCircle,
    CONFIRMED: CheckCircle,
    CANCELLED: XCircle,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 flex items-center gap-2">
          <Calendar className="w-6 h-6 text-indigo-500" />
          {pageConfig.title}
        </h1>
        <p className="text-sm text-slate-500 mt-1">{pageConfig.subtitle}</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["ALL", "PENDING", "CONFIRMED", "CANCELLED"].map(s => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-4 py-2 rounded-full text-xs font-bold transition-all border ${
              filter === s
                ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                : "bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            {s === "ALL" ? `All (${bookings.length})` : `${s.charAt(0) + s.slice(1).toLowerCase()} (${bookings.filter(b => b.status === s).length})`}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-12 text-slate-400">Loading bookings...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-indigo-300" />
          </div>
          <p className="text-slate-500 text-sm font-medium">{pageConfig.emptyText}</p>
          <p className="text-slate-400 text-xs mt-1">Bookings from your profile will appear here</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(b => {
            const StatusIcon = statusIcons[b.status] || AlertCircle;
            let preQual: Record<string, any> | null = null;
            try {
              preQual = b.preQualAnswers ? JSON.parse(b.preQualAnswers) : null;
            } catch { preQual = null; }

            return (
              <div key={b.id} className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-100 to-blue-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-indigo-500" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{b.guestName}</p>
                      <div className="flex items-center gap-3 mt-1 text-xs text-slate-400">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {b.guestEmail}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {new Date(b.date).toLocaleDateString()}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {b.time} ({b.duration}min)</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${statusColors[b.status] || "text-slate-500 bg-slate-50 border-slate-200"}`}>
                    <StatusIcon className="w-3 h-3" /> {b.status}
                  </span>
                </div>

                {/* Pre-qualification */}
                {preQual && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                    <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1">Pre-Qualification</p>
                    {Object.entries(preQual).map(([key, val]) => (
                      <p key={key} className="text-xs text-slate-500">
                        <span className="text-slate-700 font-semibold">{key}:</span> {String(val)}
                      </p>
                    ))}
                  </div>
                )}

                {b.notes && (
                  <p className="mt-2 text-xs text-slate-400 italic">&ldquo;{b.notes}&rdquo;</p>
                )}

                {/* Actions */}
                {b.status === "PENDING" && (
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => updateStatus(b.id, "CONFIRMED")}
                      className="flex items-center gap-1.5 px-4 py-2 bg-green-50 text-green-600 border border-green-200 text-xs font-bold rounded-lg hover:bg-green-100 transition-all"
                    >
                      <CheckCircle className="w-3.5 h-3.5" /> Confirm
                    </button>
                    <button
                      onClick={() => updateStatus(b.id, "CANCELLED")}
                      className="flex items-center gap-1.5 px-4 py-2 bg-red-50 text-red-500 border border-red-200 text-xs font-bold rounded-lg hover:bg-red-100 transition-all"
                    >
                      <XCircle className="w-3.5 h-3.5" /> Decline
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
