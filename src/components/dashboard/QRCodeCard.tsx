"use client";

import { useState, useEffect } from "react";
import { QrCode, Download, Copy, CheckCircle2, Share2, Smartphone, Palette } from "lucide-react";
import { toast } from "sonner";

interface QRCodeCardProps {
  username: string;
}

const QR_COLORS = [
  { name: "Black", value: "000000" },
  { name: "Indigo", value: "6366f1" },
  { name: "Rose", value: "f43f5e" },
  { name: "Emerald", value: "10b981" },
  { name: "Purple", value: "a855f7" },
  { name: "Amber", value: "f59e0b" },
];

export default function QRCodeCard({ username }: QRCodeCardProps) {
  const [qrUrl, setQrUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [color, setColor] = useState("000000");
  const [loading, setLoading] = useState(true);
  const profileUrl = `https://getprofile.link/${username}`;

  useEffect(() => {
    fetchQR();
  }, [color]);

  const fetchQR = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/qr?url=${encodeURIComponent(profileUrl)}&size=400&color=${color}`);
      const data = await res.json();
      if (data.qrUrl) {
        setQrUrl(data.qrUrl);
        setDownloadUrl(data.downloadUrl);
      }
    } catch (err) {
      // Use fallback
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(profileUrl)}&color=${color}`);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile link copied!");
  };

  return (
    <div className="dash-card">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/10 flex items-center justify-center">
            <QrCode className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-black text-slate-900">Your QR Code</h3>
            <p className="text-xs text-slate-400">Share your profile instantly</p>
          </div>
        </div>
      </div>

      {/* QR Preview */}
      <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl p-8 flex items-center justify-center mb-5">
        {loading ? (
          <div className="w-[200px] h-[200px] bg-slate-100 animate-pulse rounded-2xl" />
        ) : (
          <img 
            src={qrUrl} 
            alt="QR Code" 
            className="w-[200px] h-[200px] rounded-2xl" 
          />
        )}
      </div>

      {/* Color Picker */}
      <div className="mb-5">
        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
          <Palette className="w-3 h-3 inline mr-1" /> QR Color
        </label>
        <div className="flex gap-2">
          {QR_COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => setColor(c.value)}
              className={`w-8 h-8 rounded-xl border-2 transition-all hover:scale-110 ${
                color === c.value ? "border-indigo-500 shadow-lg scale-110" : "border-slate-200"
              }`}
              style={{ backgroundColor: `#${c.value}` }}
              title={c.name}
            />
          ))}
        </div>
      </div>

      {/* Profile URL */}
      <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-2xl mb-4">
        <Smartphone className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <span className="text-sm font-medium text-slate-600 truncate flex-1">{profileUrl}</span>
        <button onClick={copyLink} className="flex-shrink-0 w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center hover:bg-indigo-50 hover:border-indigo-200 transition-all">
          <Copy className="w-3.5 h-3.5 text-slate-500" />
        </button>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <a
          href={downloadUrl || qrUrl}
          download={`qr-${username}.png`}
          target="_blank"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-900 text-white rounded-2xl text-sm font-bold hover:bg-slate-800 transition-all"
        >
          <Download className="w-4 h-4" /> Download
        </a>
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: `${username}'s Profile`, url: profileUrl });
            } else {
              copyLink();
            }
          }}
          className="flex items-center justify-center gap-2 px-4 py-3 bg-indigo-600 text-white rounded-2xl text-sm font-bold hover:bg-indigo-700 transition-all"
        >
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  );
}
