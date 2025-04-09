import { useState } from "react";
import { Image } from "@shared/schema";
import {
  Download,
  Heart,
  MoreVertical,
  Image as ImageIcon,
  Zap,
  Wand2,
  Share2
} from "lucide-react";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { useQuery } from "@tanstack/react-query";
import { Model, Style } from "@shared/schema";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ImageCardProps {
  image: Image;
  showUser?: boolean;
}

export function ImageCard({ image, showUser = false }: ImageCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showEnhanceDialog, setShowEnhanceDialog] = useState(false);
  
  // Fetch the model if modelId is available
  const { data: models } = useQuery<Model[]>({
    queryKey: ["/api/models"],
    enabled: !!image.modelId,
    staleTime: Infinity,
  });
  
  // Fetch styles if styleId is available
  const { data: styles } = useQuery<Style[]>({
    queryKey: ["/api/styles"],
    enabled: !!image.styleId,
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
  
  // Handle image download
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = image.imageUrl;
    // Create a filename from the prompt (limit to first 3-4 words)
    const filename = image.prompt
      .split(' ')
      .slice(0, 3)
      .join('-')
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '');
    link.download = `dreamforge-${filename || 'image'}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Find model name
  const modelName = image.modelId && models
    ? models.find(m => m.id === image.modelId)?.displayName
    : "Standard";
    
  // Find style name
  const styleName = image.styleId && styles
    ? styles.find(s => s.id === image.styleId)?.name
    : "None";
  
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
    <>
      <div className="image-card rounded-lg overflow-hidden shadow-md transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl bg-gray-900 border border-gray-800">
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
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-800">
              <ImageIcon className="h-12 w-12 text-gray-600" />
            </div>
          )}
          
          <div 
            className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-end p-4 transition-opacity ${
              isHovered ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <div className="text-white text-sm line-clamp-2 mb-2">{shortPrompt}</div>
            <div className="flex justify-between items-center">
              {showUser && (
                <div className="flex items-center">
                  <Avatar className="h-6 w-6 mr-2 border border-white/20">
                    <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=${username}`} />
                    <AvatarFallback className={avatarColor}>{firstLetter}</AvatarFallback>
                  </Avatar>
                  <span className="text-white text-xs">@{username}</span>
                </div>
              )}
              <div className="flex space-x-2 ml-auto">
                <button 
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                  onClick={() => console.log('Like image', image.id)}
                >
                  <Heart className="h-4 w-4" />
                </button>
                <button 
                  className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                </button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm text-white hover:bg-white/30 transition-colors">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-gray-800 border-gray-700 text-gray-100">
                    <DropdownMenuItem className="hover:bg-gray-700"
                      onClick={() => setShowEnhanceDialog(true)}
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Enhance Image
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-700">
                      <Zap className="h-4 w-4 mr-2" />
                      Upscale (2x)
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="hover:bg-gray-700"
                      onClick={handleDownload}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem className="hover:bg-gray-700">
                      <Share2 className="h-4 w-4 mr-2" />
                      Share
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem className="hover:bg-gray-700">
                      Add to Collection
                    </DropdownMenuItem>
                    {showUser && (
                      <DropdownMenuItem className="hover:bg-gray-700">
                        View Creator Profile
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Image Enhancement Dialog */}
      <Dialog open={showEnhanceDialog} onOpenChange={setShowEnhanceDialog}>
        <DialogContent className="bg-gray-900 text-gray-100 border-gray-800 max-w-2xl">
          <DialogHeader>
            <DialogTitle>Enhance Image</DialogTitle>
            <DialogDescription className="text-gray-400">
              Use AI to improve your image with inpainting and upscaling
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4 mt-4">
            <div className="space-y-2">
              <div className="relative aspect-square">
                <img 
                  src={image.imageUrl} 
                  className="w-full h-full object-cover rounded-md" 
                  alt="Original image"
                />
                <Badge className="absolute top-2 left-2 bg-black/60">Original</Badge>
              </div>
              <div className="text-sm text-gray-400">Original prompt: {shortPrompt}</div>
            </div>
            
            <div className="space-y-2">
              <div className="relative aspect-square bg-gray-800 rounded-md flex items-center justify-center">
                <Wand2 className="h-12 w-12 text-gray-600 animate-pulse" />
                <Badge className="absolute top-2 left-2 bg-indigo-600">Enhanced</Badge>
              </div>
              <div className="text-sm text-gray-400">Drag on the image to inpaint specific areas</div>
            </div>
          </div>
          
          <div className="flex flex-col space-y-4 mt-4">
            <div className="flex justify-between">
              <div className="space-y-1">
                <h4 className="text-sm font-medium">Enhancement Options</h4>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Inpainting
                  </Button>
                  <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Upscale 2x
                  </Button>
                  <Button variant="outline" size="sm" className="bg-gray-800 border-gray-700">
                    <Zap className="h-4 w-4 mr-2" />
                    Upscale 4x
                  </Button>
                </div>
              </div>
              <div className="space-y-1 text-right">
                <h4 className="text-sm font-medium">Credits Required</h4>
                <p className="text-lg font-bold text-yellow-500">5 💎</p>
              </div>
            </div>
            
            <Button className="mt-4 bg-indigo-600 hover:bg-indigo-700">
              <Wand2 className="h-4 w-4 mr-2" />
              Enhance Image
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
