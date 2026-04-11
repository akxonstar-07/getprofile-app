"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, PlayCircle } from "lucide-react";

interface CourseModule {
  title: string;
  chapters: { title: string; duration: string }[];
}

interface CourseAccordionProps {
  product: any;
  accentColor: string;
}

export default function CourseAccordion({ product, accentColor }: CourseAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  
  if (product.productType !== "COURSE") return null;

  let modules: CourseModule[] = [];
  try {
    modules = product.courseModules ? JSON.parse(product.courseModules) : [];
  } catch (e) {}

  if (modules.length === 0) return null;

  return (
    <div className="w-full mt-4 space-y-2">
      <h4 className="text-[10px] uppercase font-black tracking-widest opacity-60 mb-3 px-2">Course Material ({modules.length} Modules)</h4>
      {modules.map((mod, i) => {
        const isOpen = openIndex === i;
        return (
          <div key={i} className="border border-black/10 rounded-2xl overflow-hidden bg-black/5">
            <button 
              onClick={(e) => { e.preventDefault(); setOpenIndex(isOpen ? null : i); }}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-black/5 transition-colors"
            >
              <span className="font-bold text-sm">Module {i + 1}: {mod.title}</span>
              {isOpen ? <ChevronUp className="w-4 h-4 opacity-50" /> : <ChevronDown className="w-4 h-4 opacity-50" />}
            </button>
            {isOpen && (
              <div className="px-4 pb-3 pt-1 space-y-1">
                {mod.chapters?.map((ch, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-t border-black/5">
                    <div className="flex items-center gap-2">
                       <PlayCircle className="w-4 h-4 opacity-40" />
                       <span className="text-xs font-semibold">{ch.title}</span>
                    </div>
                    <span className="text-[10px] font-bold opacity-50">{ch.duration}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
