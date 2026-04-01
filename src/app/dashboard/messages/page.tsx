"use client";

import { useState } from "react";
import { Search, Mail, Filter, Star, Clock, MoreVertical, Archive, Trash2, Reply, Send } from "lucide-react";

const messages = [
  { id: 1, sender: "Brand Collabs", subject: "Sponsorship Inquiry: Q4 Campaign", preview: "Hi there! We love your recent content and would like to discuss...", time: "2h ago", unread: true, starred: true },
  { id: 2, sender: "Sarah Jenkins", subject: "Question about your editing preset", preview: "I just purchased the preset pack but I'm having trouble installing it...", time: "5h ago", unread: true, starred: false },
  { id: 3, sender: "Local Events Team", subject: "Speaking Opportunity at CreatorCon", preview: "We are organizing the annual CreatorCon and would be honored if...", time: "1d ago", unread: false, starred: true },
  { id: 4, sender: "Mike D.", subject: "Collab proposal", preview: "Hey man, huge fan. I'm a videographer in your area and was hoping...", time: "2d ago", unread: false, starred: false },
  { id: 5, sender: "GetProfile Support", subject: "Your Pro Subscription is Active", preview: "Welcome to GetProfile Pro! Here's a quick guide to getting started...", time: "3d ago", unread: false, starred: false },
];

export default function MessagesPage() {
  const [activeMessage, setActiveMessage] = useState(messages[0]);
  const [replyText, setReplyText] = useState("");

  return (
    <div className="max-w-6xl h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-start justify-between mb-6 flex-shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-slate-500 text-sm mt-1">Manage fan requests, brand deals, and support inquiries.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost"><Filter className="w-4 h-4" /> Filter</button>
        </div>
      </div>

      <div className="flex-1 min-h-0 dash-card p-0 flex rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm">
        {/* Left sidebar: Message List */}
        <div className="w-1/3 border-r border-slate-100 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input 
                type="text" 
                placeholder="Search messages..." 
                className="w-full pl-9 pr-4 py-2 rounded-xl text-sm border border-slate-200 bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {messages.map((msg) => (
              <button 
                key={msg.id}
                onClick={() => setActiveMessage(msg)}
                className={`w-full text-left p-4 border-b border-slate-100/50 transition-all hover:bg-slate-50 ${activeMessage.id === msg.id ? 'bg-indigo-50/50 border-indigo-100' : 'bg-white'}`}
              >
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-sm font-semibold truncate pr-2 ${msg.unread ? 'text-slate-900' : 'text-slate-700'}`}>{msg.sender}</span>
                  <span className="text-xs text-slate-400 flex-shrink-0">{msg.time}</span>
                </div>
                <div className="flex justify-between items-center gap-2 mb-1">
                  <p className={`text-xs truncate font-medium ${msg.unread ? 'text-slate-800' : 'text-slate-600'}`}>{msg.subject}</p>
                  {msg.unread && <span className="w-2 h-2 rounded-full bg-indigo-500 flex-shrink-0" />}
                </div>
                <p className="text-xs text-slate-500 truncate">{msg.preview}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Right pane: Message View */}
        <div className="flex-1 flex flex-col bg-white">
          <div className="h-16 border-b border-slate-100 flex items-center justify-between px-6 flex-shrink-0">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-700 font-bold">
                {activeMessage.sender[0]}
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{activeMessage.sender}</h3>
                <p className="text-xs text-slate-500">contact@example.com</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-lg transition-colors">
                <Star className={`w-4 h-4 ${activeMessage.starred ? 'fill-amber-400 text-amber-400' : ''}`} />
              </button>
              <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"><Archive className="w-4 h-4" /></button>
              <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
              <div className="w-px h-6 bg-slate-200 mx-1" />
              <button className="p-2 text-slate-400 hover:text-slate-900 rounded-lg transition-colors"><MoreVertical className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <h2 className="text-xl font-bold text-slate-900 mb-6">{activeMessage.subject}</h2>
            <div className="prose prose-sm max-w-none text-slate-600 space-y-4">
              <p>{activeMessage.preview} I noticed your recent engagement metrics are phenomenal. We are currently scouting for influencers in your niche to spearhead our upcoming holiday campaign.</p>
              <p>We're offering a multi-tiered partnership package which includes:</p>
              <ul className="list-disc pl-5">
                <li>3 Dedicated Instagram Posts</li>
                <li>2 TikTok Integrations</li>
                <li>Link in Bio placement for 30 days</li>
              </ul>
              <p>Please let me know if you would be open to a quick 15-minute call to discuss rates and deliverables this week.</p>
              <p>Best regards,<br/>The Brand Team</p>
            </div>
          </div>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
            <div className="bg-white rounded-2xl border border-slate-200 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500/30 transition-all p-3 shadow-sm">
              <textarea 
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Type your reply..." 
                className="w-full text-sm resize-none focus:outline-none placeholder-slate-400 min-h-[80px]"
              />
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100">
                <div className="flex gap-2">
                  <button className="p-2 text-slate-400 hover:text-indigo-600 rounded-lg transition-colors"><Reply className="w-4 h-4" /></button>
                </div>
                <button className="btn-primary py-2 px-5 text-sm gap-2 rounded-xl">
                  <Send className="w-3.5 h-3.5" /> Send Reply
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
