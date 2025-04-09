import { useState } from "react";
import { Image } from "@shared/schema";
import {
  Download,
  Heart,
  MoreVertical,
  Image as ImageIcon,
  UserCircle,
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { Model, Style } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
    
  // Get username and first letter for avatar
  const username = (image as any).username || 'creator';
  const firstLetter = username.charAt(0).toUpperCase();
  
  // Generate a color based on the username
  const getAvatarColor = (username: string) => {
    const colors = [
      "bg-red-500", "bg-blue-500", "bg-green-500", 
      "bg-yellow-500", "bg-purple-500", "bg-pink-500", 
      "bg-indigo-500", "bg-teal-500"
    ];
    
    // Get a deterministic index based on the username
    const charSum = username.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    return colors[charSum % colors.length];
  };
  
  const avatarColor = getAvatarColor(username);
  
  return (
    <div className="image-card rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-black dark:bg-gray-900">
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
          className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 transition-opacity ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="text-white text-sm line-clamp-2 mb-2">{shortPrompt}</div>
          <div className="flex justify-between items-center">
            {showUser && (
              <div className="flex items-center">
                <Avatar className="h-6 w-6 mr-2">
                  <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`} />
                  <AvatarFallback className={avatarColor}>{firstLetter}</AvatarFallback>
                </Avatar>
                <span className="text-white text-xs">@{username}</span>
              </div>
            )}
            <div className="flex space-x-2 ml-auto">
              <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                <Heart className="h-4 w-4" />
              </button>
              <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                <Download className="h-4 w-4" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                    <MoreVertical className="h-4 w-4" />
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
        </div>
      </div>
    </div>
  );
}
