import { useState } from "react";
import { Image } from "@shared/schema";
import {
  Download,
  Heart,
  MoreVertical,
  Image as ImageIcon,
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { Model, Style } from "@shared/schema";

interface ImageCardProps {
  image: Image;
  showUser?: boolean;
}

export function ImageCard({ image, showUser = false }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Fetch the model if modelId is available
  const { data: models } = useQuery<Model[]>({
    queryKey: ["/api/models"],
    enabled: false,
    staleTime: Infinity,
  });
  
  // Fetch styles if styleId is available
  const { data: styles } = useQuery<Style[]>({
    queryKey: ["/api/styles"],
    enabled: false,
    staleTime: Infinity,
  });
  
  // Format the creation date
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    return new Date(date).toLocaleDateString();
  };
  
  // Find model name
  const modelName = image.modelId && models
    ? models.find(m => m.id === image.modelId)?.displayName
    : "";
    
  // Find style name
  const styleName = image.styleId && styles
    ? styles.find(s => s.id === image.styleId)?.name
    : "";
  
  // Generate a short prompt (first 15 words)
  const shortPrompt = image.prompt
    .split(" ")
    .slice(0, 15)
    .join(" ")
    + (image.prompt.split(" ").length > 15 ? "..." : "");
  
  return (
    <div className="image-card rounded-xl overflow-hidden shadow-md transition-transform hover:translate-y-[-5px] bg-white dark:bg-gray-800">
      <div 
        className="aspect-square overflow-hidden relative group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {image.imageUrl ? (
          <img 
            src={image.imageUrl} 
            className="w-full h-full object-cover" 
            alt={image.prompt}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            <ImageIcon className="h-12 w-12 text-gray-400" />
          </div>
        )}
        
        <div 
          className={`absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-3 transition-opacity ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="flex justify-between items-center">
            <div className="text-white text-xs line-clamp-1">{shortPrompt}</div>
            <div className="flex space-x-1">
              <button className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                <Heart className="h-3 w-3" />
              </button>
              <button className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                <Download className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="absolute top-2 right-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-7 h-7 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                <MoreVertical className="h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                Add to Collection
              </DropdownMenuItem>
              <DropdownMenuItem>
                Download
              </DropdownMenuItem>
              {showUser && (
                <DropdownMenuItem>
                  View Profile
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <div className="p-3">
        {showUser && (
          <div className="flex justify-between items-center mb-1">
            <div className="text-xs text-gray-500 dark:text-gray-400">By @username</div>
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Heart className="h-3 w-3 mr-1" />
              {image.likes || 0}
            </div>
          </div>
        )}
        
        <div className="text-xs text-gray-500 dark:text-gray-400 flex justify-between">
          <span>
            {formatDate(new Date(image.createdAt))}
            {styleName && ` · ${styleName}`}
          </span>
          <span>
            {modelName}
          </span>
        </div>
        
        {showUser && (
          <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
            "{shortPrompt}"
          </div>
        )}
      </div>
    </div>
  );
}
