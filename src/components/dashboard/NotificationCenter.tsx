"use client";

import { useState, useEffect, useRef } from "react";
import { Bell, X, ShoppingBag, Calendar, Heart, MessageSquare, Star, ChevronRight } from "lucide-react";

interface Notification {
  id: string;
  type: "sale" | "booking" | "tip" | "message" | "review";
  title: string;
  description: string;
  time: string;
  read: boolean;
}

const ICONS = {
  sale: { icon: ShoppingBag, color: "text-emerald-600", bg: "bg-emerald-500/10" },
  booking: { icon: Calendar, color: "text-indigo-600", bg: "bg-indigo-500/10" },
  tip: { icon: Heart, color: "text-rose-600", bg: "bg-rose-500/10" },
  message: { icon: MessageSquare, color: "text-blue-600", bg: "bg-blue-500/10" },
  review: { icon: Star, color: "text-amber-600", bg: "bg-amber-500/10" },
};

export default function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch recent analytics events as notifications
    fetch("/api/analytics?range=7")
      .then(r => r.json())
      .then(data => {
        // Map events to notification format
        const notifs: Notification[] = [];

        if (data.summary) {
          if (data.summary.totalViews > 0) {
            notifs.push({
              id: "views",
              type: "review",
              title: "Profile Views",
              description: `${data.summary.totalViews} people viewed your profile this week`,
              time: "This week",
              read: false,
            });
          }
        }

        // Add placeholder welcome notification
        notifs.push({
          id: "welcome",
          type: "message",
          title: "Welcome to getprofile.link!",
          description: "Your Pro trial is active. Start adding links and products to grow your audience.",
          time: "Just now",
          read: false,
        });

        setNotifications(notifs);
      })
      .catch(() => {
        setNotifications([{
          id: "welcome",
          type: "message",
          title: "Welcome to getprofile.link!",
          description: "Start customizing your profile to attract your audience.",
          time: "Just now",
          read: false,
        }]);
      });
  }, []);

  // Close on click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all text-white"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 top-14 w-[380px] bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-300 z-50">
          {/* Header */}
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-black text-slate-900 text-lg">Notifications</h3>
            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-xs text-indigo-600 font-bold hover:underline">
                  Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notifications List */}
          <div className="max-h-[400px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-10 text-center">
                <Bell className="w-8 h-8 text-slate-200 mx-auto mb-3" />
                <p className="text-sm text-slate-400">No notifications yet</p>
              </div>
            ) : (
              notifications.map(notif => {
                const config = ICONS[notif.type];
                const Icon = config.icon;
                return (
                  <div
                    key={notif.id}
                    className={`p-4 flex items-start gap-3 border-b border-slate-50 hover:bg-slate-50/50 transition-colors cursor-pointer ${
                      !notif.read ? "bg-indigo-50/30" : ""
                    }`}
                    onClick={() => setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))}
                  >
                    <div className={`w-10 h-10 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900 truncate">{notif.title}</p>
                        {!notif.read && <div className="w-2 h-2 bg-indigo-500 rounded-full flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{notif.description}</p>
                      <p className="text-[10px] text-slate-400 mt-1">{notif.time}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0 mt-1" />
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
