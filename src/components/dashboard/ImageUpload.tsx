"use client";

import { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, label, className = "" }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      if (res.ok && data.url) {
        onChange(data.url);
      } else {
        // More descriptive error handling
        const msg = data.error?.includes("cloud_name") 
          ? "Cloudinary credentials missing in .env" 
          : (data.error || "Upload failed");
        alert(msg);
      }
    } catch (error) {
      console.error(error);
      alert("Network error. Please try again.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {label && <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide">{label}</label>}
      
      {value ? (
        <div className="relative group rounded-xl overflow-hidden border-2 border-slate-200">
          <img src={value} alt="Uploaded" className="w-full h-full object-cover max-h-48" />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 bg-white text-slate-900 text-sm font-semibold rounded-lg shadow-sm hover:scale-105 transition-transform"
              type="button"
            >
              Replace Image
            </button>
            <button
              onClick={() => onChange("")}
              className="px-4 py-2 bg-red-500 text-white text-sm font-semibold rounded-lg shadow-sm hover:scale-105 transition-transform"
              type="button"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="w-full h-32 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors group"
        >
          {isUploading ? (
            <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center text-slate-400 group-hover:text-indigo-500 transition-colors shadow-sm">
                <Upload className="w-5 h-5" />
              </div>
              <p className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors">
                Click to upload image
              </p>
            </>
          )}
        </button>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
}
