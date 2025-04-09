import { Model } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Star, Zap } from "lucide-react";

interface ModelSelectorProps {
  models: Model[];
  value: number;
  onChange: (value: number) => void;
}

// Model tier badges with colors
const tierBadges: Record<string, {color: string, icon: React.ReactNode}> = {
  "Basic": { color: "bg-green-500", icon: <Star className="h-3 w-3 mr-1" /> },
  "Standard": { color: "bg-blue-500", icon: <Sparkles className="h-3 w-3 mr-1" /> },
  "Premium": { color: "bg-purple-500", icon: <Zap className="h-3 w-3 mr-1" /> }
};

export function ModelSelector({ models, value, onChange }: ModelSelectorProps) {
  if (!models || models.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div 
            key={i} 
            className="h-24 rounded-lg animate-pulse bg-slate-700 opacity-40"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {models.map((model) => {
        const tierInfo = tierBadges[model.tier] || { color: "bg-gray-500", icon: null };
        
        return (
          <button
            key={model.id}
            type="button"
            className={`relative flex flex-col justify-between rounded-lg bg-slate-800 border-2 p-3 transition-all ${
              value === model.id
                ? "border-indigo-500 shadow-lg shadow-indigo-500/20"
                : "border-slate-700 hover:border-indigo-400"
            }`}
            onClick={() => onChange(model.id)}
          >
            {/* Model tier badge */}
            <Badge className={`absolute -top-2 -right-2 ${tierInfo.color} px-2 py-1 flex items-center`}>
              {tierInfo.icon}
              {model.tier}
            </Badge>
            
            {/* Model name */}
            <div className="mb-2">
              <h4 className={`font-semibold text-white mb-0.5 ${value === model.id ? "text-indigo-400" : ""}`}>
                {model.displayName}
              </h4>
              <p className="text-xs text-slate-400">{model.description}</p>
            </div>
            
            {/* Credit cost */}
            <div className={`flex items-center justify-center mt-auto w-full rounded py-1 
              ${value === model.id 
                ? "bg-indigo-500/20 text-indigo-400" 
                : "bg-slate-700 text-slate-300"}`
            }>
              <Sparkles className="h-3 w-3 mr-1 opacity-70" />
              <span className="text-xs font-medium">
                {model.creditCost} credit{model.creditCost !== 1 ? 's' : ''}
              </span>
            </div>
          </button>
        );
      })}
    </div>
  );
}
