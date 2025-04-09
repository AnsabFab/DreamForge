import { Style } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { LayoutGrid } from "lucide-react";

interface StyleSelectorProps {
  styles: Style[];
  value?: number;
  onChange: (value: number | undefined) => void;
}

// Style gradient backgrounds
const styleBackgrounds: Record<string, string> = {
  "Realistic": "from-green-500 to-blue-500",
  "Anime": "from-pink-500 to-purple-500",
  "Fantasy": "from-blue-500 to-indigo-500",
  "Cyberpunk": "from-fuchsia-500 to-purple-500",
  "Portrait": "from-amber-500 to-red-500",
  "Watercolor": "from-cyan-500 to-blue-500",
  "3D Render": "from-indigo-500 to-purple-500"
};

export function StyleSelector({ styles, value, onChange }: StyleSelectorProps) {
  const handleSelect = (styleId: number) => {
    // Toggle the selection
    onChange(value === styleId ? undefined : styleId);
  };

  if (!styles || styles.length === 0) {
    return (
      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div 
            key={i} 
            className="h-16 rounded-lg animate-pulse bg-slate-700 opacity-40"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {styles.slice(0, 6).map((style) => {
        const gradientBg = styleBackgrounds[style.name] || "from-indigo-500 to-purple-500";
        
        return (
          <button
            key={style.id}
            type="button"
            className={`relative group h-16 rounded-lg overflow-hidden transition-all duration-300 ${
              value === style.id
                ? "ring-2 ring-offset-2 ring-offset-slate-800 ring-indigo-500"
                : "hover:scale-105"
            }`}
            onClick={() => handleSelect(style.id)}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-gradient-to-br ${gradientBg} opacity-60 group-hover:opacity-80 transition-opacity`}></div>
            
            {/* Style name */}
            <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-white">
              <div className="mb-1 bg-black/30 w-8 h-8 rounded-full flex items-center justify-center">
                <LayoutGrid className="h-3 w-3" />
              </div>
              <span className="text-xs font-medium text-center truncate w-full">
                {style.name}
              </span>
            </div>
            
            {/* Selected indicator */}
            {value === style.id && (
              <Badge className="absolute top-1 right-1 bg-indigo-500 px-1.5 text-[10px] font-medium">
                Selected
              </Badge>
            )}
          </button>
        );
      })}
      <button
        type="button"
        className="h-16 rounded-lg border border-slate-600 hover:border-indigo-400 text-slate-300 hover:text-indigo-300 hover:bg-slate-700 transition-colors flex items-center justify-center"
      >
        <LayoutGrid className="h-4 w-4 mr-1" />
        <span className="text-xs">More...</span>
      </button>
    </div>
  );
}