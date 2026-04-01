"use client";

import { useState } from "react";
import { BookOpen, Plus, PlayCircle, Settings, Users, Video, FileText, CheckCircle2, GripVertical, ChevronDown } from "lucide-react";

export default function CoursesPage() {
  const [activeTab, setActiveTab] = useState<"curriculum" | "settings" | "students">("curriculum");

  return (
    <div className="max-w-6xl">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-indigo-600" />
            Course Builder
          </h1>
          <p className="text-slate-500 text-sm mt-1">Create and sell premium masterclasses, tutorials, and private content.</p>
        </div>
        <div className="flex gap-2">
          <button className="btn-ghost">Preview</button>
          <button className="btn-primary"><Plus className="w-4 h-4" /> New Course</button>
        </div>
      </div>

      <div className="dash-card mb-8 bg-gradient-to-r from-indigo-50 to-cyan-50 border-indigo-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
            <Video className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest block mb-1">Active Course draft</span>
            <h2 className="text-xl font-bold text-slate-900">Creator Masterclass: Zero to 100k</h2>
            <p className="text-sm text-slate-600">3 Modules • 12 Lessons • Draft Status</p>
          </div>
        </div>
        <button className="px-6 py-2.5 bg-white border border-indigo-200 text-indigo-600 font-bold rounded-xl shadow-sm hover:shadow-md transition-all">
          Publish Course
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-slate-100 p-1 rounded-xl w-fit">
        {(["curriculum", "settings", "students"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all capitalize flex items-center gap-2 ${
              activeTab === tab
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {activeTab === "curriculum" && (
        <div className="space-y-6 animate-fade-in">
          {/* Module 1 */}
          <div className="dash-card p-0 overflow-hidden bg-white">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-slate-300 cursor-grab" />
                <h3 className="font-bold text-slate-900">Module 1: The Foundation</h3>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-indigo-600 font-semibold px-3 py-1 hover:bg-indigo-50 rounded-lg">Edit</button>
                <ChevronDown className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            
            <div className="divide-y divide-slate-50">
              <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group cursor-pointer pl-12">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-indigo-500" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">1.1 Finding Your Niche</h4>
                    <p className="text-xs text-slate-500">Video • 12:45</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs bg-emerald-50 text-emerald-600 font-bold px-2 py-1 rounded-md">Uploaded</span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group cursor-pointer pl-12">
                <div className="flex items-center gap-3">
                  <PlayCircle className="w-5 h-5 text-indigo-500" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">1.2 Setting Up Your Production Flow</h4>
                    <p className="text-xs text-slate-500">Video • 18:20</p>
                  </div>
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs bg-emerald-50 text-emerald-600 font-bold px-2 py-1 rounded-md">Uploaded</span>
                </div>
              </div>

              <div className="p-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors group cursor-pointer pl-12">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-amber-500" />
                  <div>
                    <h4 className="font-semibold text-slate-900 text-sm">Hardware Checklist (PDF)</h4>
                    <p className="text-xs text-slate-500">Document • 2 pages</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
              <button className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center justify-center gap-1 mx-auto">
                <Plus className="w-4 h-4" /> Add Lesson
              </button>
            </div>
          </div>

          {/* Module 2 */}
          <div className="dash-card p-0 overflow-hidden bg-white">
            <div className="bg-slate-50 p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <GripVertical className="w-5 h-5 text-slate-300 cursor-grab" />
                <h3 className="font-bold text-slate-900">Module 2: Algorithmic Growth</h3>
                <span className="bg-slate-200 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">Empty</span>
              </div>
              <div className="flex gap-2">
                <button className="text-sm text-indigo-600 font-semibold px-3 py-1 hover:bg-indigo-50 rounded-lg">Edit</button>
                <ChevronDown className="w-5 h-5 text-slate-400" />
              </div>
            </div>
            <div className="p-8 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3">
                <Plus className="w-6 h-6 text-indigo-500" />
              </div>
              <h4 className="font-bold text-slate-900">Add content to this module</h4>
              <p className="text-sm text-slate-500 mt-1 max-w-sm">Upload videos, text lessons, quizzes, or downloadable files.</p>
            </div>
          </div>

          <button className="dash-card w-full py-8 border-dashed border-2 bg-transparent text-slate-500 hover:text-indigo-600 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all font-bold flex items-center justify-center gap-2">
            <Plus className="w-5 h-5" /> Add New Module
          </button>
        </div>
      )}

      {activeTab === "settings" && (
        <div className="max-w-2xl space-y-6 animate-fade-in">
          <div className="dash-card">
            <h3 className="font-bold text-slate-900 mb-4">Course Pricing</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border border-indigo-200 bg-indigo-50 rounded-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600" />
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">One-Time Payment</h4>
                  <p className="text-xs text-slate-500">Charge a single upfront fee for lifetime access.</p>
                </div>
                <div className="w-5 h-5 rounded-full border-4 border-indigo-600 bg-white" />
              </div>

               <div className="flex items-center justify-between p-4 border border-slate-200 hover:border-slate-300 bg-white rounded-xl cursor-pointer">
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Free Access</h4>
                  <p className="text-xs text-slate-500">Offer this course as a lead magnet to build your email list.</p>
                </div>
                <div className="w-5 h-5 rounded-full border-2 border-slate-300 bg-white" />
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Price Amount</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 font-medium">$</span>
                <input type="number" defaultValue="299" className="input-premium pl-8 max-w-[200px]" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
