import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Image } from "@shared/schema";
import { ImageCard } from "./image-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Clock, Download, Heart, Plus, LayoutGrid, Filter } from "lucide-react";

export function PersonalGallery() {
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const {
    data: personalImages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useQuery<Image[]>({
    queryKey: ["/api/images/personal"],
  });

  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
        <p className="text-gray-400">Loading your gallery...</p>
      </div>
    );
  }

  if (!personalImages || personalImages.length === 0) {
    return (
      <div className="animate-fade-in">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              My Gallery
              <Badge variant="outline" className="ml-3">0 images</Badge>
            </h2>
            <p className="text-gray-400">Your AI-generated artwork collection</p>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="bg-gray-800">
            <TabsTrigger value="all">All Images</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="favorites">Favorites</TabsTrigger>
            <TabsTrigger value="collections">Collections</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-6">
            <div className="py-16 text-center bg-gray-800/50 border border-gray-700 rounded-xl" id="empty-gallery">
              <div className="bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-medium mb-2">Your gallery is empty</h3>
              <p className="text-gray-400 max-w-md mx-auto mb-6">
                Create your first AI-generated image to start building your personal gallery
              </p>
              <Button 
                className="bg-indigo-600 hover:bg-indigo-700"
                onClick={() => {
                  const createTab = document.querySelector('button[title="Create"]');
                  if (createTab) (createTab as HTMLButtonElement).click();
                }}
              >
                Create Now
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="recent" className="mt-6">
            <div className="py-16 text-center bg-gray-800/50 border border-gray-700 rounded-xl">
              <p className="text-gray-400">No recent images found</p>
            </div>
          </TabsContent>
          
          <TabsContent value="favorites" className="mt-6">
            <div className="py-16 text-center bg-gray-800/50 border border-gray-700 rounded-xl">
              <p className="text-gray-400">No favorite images yet</p>
            </div>
          </TabsContent>
          
          <TabsContent value="collections" className="mt-6">
            <div className="py-16 text-center bg-gray-800/50 border border-gray-700 rounded-xl">
              <p className="text-gray-400">No collections created yet</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold flex items-center">
            My Gallery
            <Badge variant="outline" className="ml-3">{personalImages.length} images</Badge>
          </h2>
          <p className="text-gray-400">Your AI-generated artwork collection</p>
        </div>
        <div className="flex space-x-2">
          <Button size="icon" variant="ghost" className="rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300">
            <Clock className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300">
            <Heart className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300">
            <Filter className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all" className="mb-6">
        <TabsList className="bg-gray-800">
          <TabsTrigger value="all">All Images</TabsTrigger>
          <TabsTrigger value="recent">Recent</TabsTrigger>
          <TabsTrigger value="favorites">Favorites</TabsTrigger>
          <TabsTrigger value="collections">Collections</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {personalImages.map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
          
          {hasNextPage && (
            <div className="text-center mt-8">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
                className="bg-gray-800 hover:bg-gray-700 border-gray-700"
              >
                {isFetchingNextPage ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  "Load More"
                )}
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="recent" className="mt-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {personalImages.slice(0, Math.min(4, personalImages.length)).map((image) => (
              <ImageCard key={image.id} image={image} />
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="favorites" className="mt-6">
          <div className="py-16 text-center bg-gray-800/50 border border-gray-700 rounded-xl">
            <p className="text-gray-400">No favorite images yet</p>
          </div>
        </TabsContent>
        
        <TabsContent value="collections" className="mt-6">
          <div className="py-16 text-center bg-gray-800/50 border border-gray-700 rounded-xl">
            <p className="text-gray-400">No collections created yet</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
