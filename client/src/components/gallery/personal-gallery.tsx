import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Image } from "@shared/schema";
import { ImageCard } from "./image-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, LayoutGrid } from "lucide-react";

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
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading your gallery...</p>
      </div>
    );
  }

  if (!personalImages || personalImages.length === 0) {
    return (
      <div className="py-16 text-center" id="empty-gallery">
        <div className="inline-flex rounded-full bg-gray-100 dark:bg-gray-800 p-6 mb-4">
          <LayoutGrid className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">Your gallery is empty</h3>
        <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-4">
          Generate your first image to start building your personal collection
        </p>
        <Button>Create Now</Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-xl font-bold">My Gallery</h2>
        <div className="flex space-x-2">
          <Select
            value={selectedFilter}
            onValueChange={setSelectedFilter}
          >
            <SelectTrigger className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg">
              <SelectValue placeholder="All Images" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Images</SelectItem>
              <SelectItem value="favorites">Favorites</SelectItem>
              <SelectItem value="landscapes">Landscapes</SelectItem>
              <SelectItem value="portraits">Portraits</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            size="icon" 
            variant="outline"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
    </div>
  );
}
