import { TrendingUp, Target } from "lucide-react";

interface GoalTrackerProps {
  title: string | null;
  image: string | null;
  targetAmount: number | null;
  currentAmount: number | null;
  accentColor: string;
  textColor: string;
  cardColor: string;
}

export default function GoalTracker({ title, image, targetAmount, currentAmount, accentColor, textColor, cardColor }: GoalTrackerProps) {
  if (!targetAmount || targetAmount <= 0) return null;

  const current = currentAmount || 0;
  const progressPercent = Math.min(100, Math.round((current / targetAmount) * 100));

  return (
    <div className="rounded-[24px] p-5 shadow-sm border border-black/5" style={{ background: cardColor, color: textColor }}>
      <div className="flex items-center gap-4 mb-4">
        {image ? (
          <img src={image} className="w-14 h-14 rounded-xl object-cover" alt="Goal" />
        ) : (
          <div className="w-14 h-14 rounded-xl flex items-center justify-center bg-black/5">
            <Target className="w-7 h-7 opacity-50" />
          </div>
        )}
        <div className="flex-1">
          <h3 className="font-bold text-sm tracking-tight line-clamp-1">{title || "Creator Goal"}</h3>
          <p className="text-xs opacity-70 mt-0.5">Help me reach my goal!</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span>${current} raised</span>
          <span className="opacity-60">${targetAmount}</span>
        </div>
        
        {/* Progress Bar Container */}
        <div className="h-3 w-full bg-black/10 rounded-full overflow-hidden relative">
          <div 
            className="absolute top-0 left-0 bottom-0 transition-all duration-1000 ease-out" 
            style={{ width: `${progressPercent}%`, background: accentColor }}
          />
        </div>
        
        <div className="text-[10px] text-center font-black uppercase tracking-widest mt-2" style={{ color: accentColor }}>
          {progressPercent}% Funded
        </div>
      </div>
    </div>
  );
}
