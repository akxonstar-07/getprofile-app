"use client";

import { useState } from "react";
import { DollarSign, ArrowUpRight, ArrowDownRight, TrendingUp, CreditCard, Download, Filter, Search, Package, CheckCircle2, Clock } from "lucide-react";
import AnalyticsChart from "@/components/dashboard/AnalyticsChart";

export default function SalesPage() {
  const [activeTab, setActiveTab] = useState<"overview" | "orders" | "payouts">("overview");

  const recentOrders = [
    { id: "ORD-9482", customer: "Alex Mercer", item: "Preset Pack v2", date: "Today, 10:42 AM", amount: "$45.00", status: "Completed" },
    { id: "ORD-9481", customer: "Sarah Jenkins", item: "Creator Blueprint", date: "Yesterday, 3:15 PM", amount: "$120.00", status: "Completed" },
    { id: "ORD-9480", customer: "Mike Davis", item: "1-on-1 Consultation", date: "Yesterday, 9:20 AM", amount: "$300.00", status: "Pending" },
    { id: "ORD-9479", customer: "Jessica Wong", item: "Preset Pack v1", date: "Oct 12, 4:45 PM", amount: "$25.00", status: "Completed" },
    { id: "ORD-9478", customer: "Tom Hardy", item: "Creator Blueprint", date: "Oct 11, 1:10 PM", amount: "$120.00", status: "Refunded" },
  ];

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-emerald-600" />
            E-Commerce Sales
          </h1>
          <p className="text-slate-500 text-sm mt-1">Track revenue from digital products, merch drops, and services.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost flex items-center gap-2"><Download className="w-4 h-4" /> Export CSV</button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
        <div className="dash-card">
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Revenue (30d)</p>
          <h3 className="text-3xl font-bold text-slate-900">$8,450.00</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +14.2% vs last month
          </p>
        </div>
        <div className="dash-card">
          <p className="text-sm font-semibold text-slate-500 mb-1">Gross Volume</p>
          <h3 className="text-3xl font-bold text-slate-900">$10,240.00</h3>
          <p className="text-xs text-slate-400 font-medium mt-2">Before fees & refunds</p>
        </div>
        <div className="dash-card">
          <p className="text-sm font-semibold text-slate-500 mb-1">Total Orders</p>
          <h3 className="text-3xl font-bold text-slate-900">142</h3>
          <p className="text-xs text-emerald-600 font-semibold mt-2 flex items-center gap-1">
            <ArrowUpRight className="w-3 h-3" /> +8 orders vs last week
          </p>
        </div>
        <div className="dash-card">
          <p className="text-sm font-semibold text-slate-500 mb-1">Avg. Order Value</p>
          <h3 className="text-3xl font-bold text-slate-900">$59.50</h3>
          <p className="text-xs text-rose-500 font-semibold mt-2 flex items-center gap-1">
            <ArrowDownRight className="w-3 h-3" /> -2.1% (lower tier heavy)
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {(["overview", "orders", "payouts"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize flex items-center gap-2 ${
              activeTab === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab === "overview" && <TrendingUp className="w-4 h-4" />}
            {tab === "orders" && <Package className="w-4 h-4" />}
            {tab === "payouts" && <CreditCard className="w-4 h-4" />}
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div className="space-y-6 animate-fade-in">
          <div className="dash-card mb-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-500" /> Revenue Over Time
            </h3>
            <AnalyticsChart 
              data={[
                { date: "Oct 1", rev: 120 }, { date: "Oct 3", rev: 340 },
                { date: "Oct 5", rev: 250 }, { date: "Oct 7", rev: 490 },
                { date: "Oct 9", rev: 450 }, { date: "Oct 11", rev: 920 },
                { date: "Oct 15", rev: 1240 }
              ]}
              xKey="date"
              yKey1="rev"
              color1="#10b981"
              height={260}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="dash-card">
              <h3 className="font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Top Performing Products</h3>
              <div className="space-y-4">
                {[
                  { name: "Creator Blueprint Course", sales: 45, rev: "$5,400" },
                  { name: "Preset Pack v2", sales: 62, rev: "$2,790" },
                  { name: "1-on-1 Consultation", sales: 12, rev: "$3,600" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 font-bold flex items-center justify-center text-xs">{i+1}</div>
                      <p className="font-semibold text-slate-900 text-sm">{item.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-emerald-600">{item.rev}</p>
                      <p className="text-xs text-slate-500">{item.sales} sales</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="dash-card">
              <h3 className="font-bold text-slate-900 mb-6 border-b border-slate-100 pb-4">Recent Transactions</h3>
              <div className="space-y-4">
                {recentOrders.slice(0, 4).map((order) => (
                  <div key={order.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-slate-900 text-sm">{order.customer}</p>
                      <p className="text-xs text-slate-500">{order.date}</p>
                    </div>
                    <span className="font-bold text-slate-900">{order.amount}</span>
                  </div>
                ))}
                <button onClick={() => setActiveTab("orders")} className="w-full py-3 mt-4 text-sm font-semibold text-indigo-600 bg-indigo-50 rounded-xl hover:bg-indigo-100 transition-colors">
                  View All Orders
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="dash-card p-0 overflow-hidden animate-fade-in">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-white">
            <div className="relative w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Search orders, emails..." className="w-full pl-9 pr-4 py-2 text-sm border-none bg-slate-50 rounded-xl focus:ring-2 focus:ring-indigo-500/20" />
            </div>
            <button className="btn-ghost py-2"><Filter className="w-4 h-4" /> Filter</button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 text-xs font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <th className="p-4 pl-6">Order ID</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Product</th>
                <th className="p-4">Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 pl-6 font-mono text-xs text-indigo-600">{order.id}</td>
                  <td className="p-4 font-semibold text-sm text-slate-900">{order.customer}</td>
                  <td className="p-4 text-sm text-slate-600 truncate max-w-[200px]">{order.item}</td>
                  <td className="p-4 text-sm text-slate-500">{order.date}</td>
                  <td className="p-4">
                    {order.status === "Completed" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600"><CheckCircle2 className="w-3.5 h-3.5" /> Paid</span>}
                    {order.status === "Pending" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600"><Clock className="w-3.5 h-3.5" /> Processing</span>}
                    {order.status === "Refunded" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600">Refunded</span>}
                  </td>
                  <td className="p-4 text-right pr-6 font-bold text-slate-900">{order.amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50">
            Showing 1-5 of 142 orders
            <div className="flex gap-2">
              <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50" disabled>Previous</button>
              <button className="px-3 py-1 bg-white border border-slate-200 rounded-lg hover:bg-slate-50">Next</button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "payouts" && (
        <div className="max-w-2xl animate-fade-in">
          <div className="dash-card mb-6">
            <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-indigo-500" />
              Payout Settings
            </h3>
            <div className="p-4 border border-slate-200 rounded-xl flex items-center justify-between mb-4 bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-indigo-100 flex items-center justify-center font-bold text-indigo-600">S</div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Stripe Connect</h4>
                  <p className="text-xs text-emerald-600 mt-1 font-semibold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Connected</p>
                </div>
              </div>
              <button className="btn-ghost text-slate-500 text-sm">Manage</button>
            </div>
            
            <div className="bg-white border rounded-xl p-5 mb-5 shadow-sm">
              <p className="text-sm font-semibold text-slate-500 mb-1">Available for Payout</p>
              <h3 className="text-4xl font-bold text-slate-900 mb-4">$1,240.50</h3>
              <button className="btn-primary w-full py-3 mb-3">Withdraw to Bank (...4421)</button>
              <p className="text-xs text-center text-slate-400">Next automatic payout scheduled for Oct 15</p>
            </div>
          </div>

          <div className="dash-card">
            <h3 className="font-bold text-slate-900 mb-4 border-b border-slate-100 pb-4">Payout History</h3>
            <div className="space-y-4">
              {[
                { date: "Oct 1", amount: "$3,450.00", status: "Deposited" },
                { date: "Sep 15", amount: "$2,100.00", status: "Deposited" },
                { date: "Sep 1", amount: "$1,850.00", status: "Deposited" },
              ].map((payout, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-900 font-mono text-sm">Payout #{142 - i}</p>
                    <p className="text-xs text-slate-500">{payout.date}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-600">{payout.amount}</span>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase flex items-center gap-1 justify-end"><CheckCircle2 className="w-3 h-3" /> {payout.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
