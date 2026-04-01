import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Users, Mail, Download } from "lucide-react";
import { redirect } from "next/navigation";

export default async function AudiencePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const subscribers = await prisma.subscriber.findMany({
    where: { userId: (session.user as any).id },
    orderBy: { createdAt: "desc" },
  });

  const totalSubscribers = subscribers.length;
  const lastWeek = new Date();
  lastWeek.setDate(lastWeek.getDate() - 7);
  const newThisWeek = subscribers.filter((s: any) => s.createdAt >= lastWeek).length;

  return (
    <div className="max-w-5xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Audience</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your email subscribers and leads</p>
        </div>
        <button className="btn-primary">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-8">
        <div className="dash-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl gradient-bg-subtle flex items-center justify-center">
              <Users className="w-5 h-5 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">Total Subscribers</p>
              <p className="text-2xl font-black text-slate-900">{totalSubscribers}</p>
            </div>
          </div>
        </div>
        <div className="dash-card">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Mail className="w-5 h-5 text-emerald-500" />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-500">New This Week</p>
              <p className="text-2xl font-black text-slate-900">+{newThisWeek}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="dash-card overflow-hidden p-0">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-900">Subscriber List</h3>
        </div>
        {subscribers.length === 0 ? (
          <div className="p-10 text-center">
            <Mail className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h4 className="font-bold text-slate-700">No subscribers yet</h4>
            <p className="text-sm text-slate-500 mt-1">Share your profile to start collecting emails.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-widest">
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Subscribed At</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-100">
                {subscribers.map((sub: any) => (
                  <tr key={sub.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">{sub.email}</td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(sub.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
