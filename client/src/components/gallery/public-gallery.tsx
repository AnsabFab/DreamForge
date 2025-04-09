import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Image } from "@shared/schema";
import { ImageCard } from "./image-card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type FilterOption = "trending" | "newest" | "mostLiked" | "fantasy" | "portraits" | "anime";

export function PublicGallery() {
  const [activeFilter, setActiveFilter] = useState<FilterOption>("trending");
  const [page, setPage] = useState(1);
  
  const {
    data: publicImages,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useQuery<Image[]>({
    queryKey: ["/api/images/public", { filter: activeFilter, page }],
  });

  const handleFilterChange = (filter: FilterOption) => {
    setActiveFilter(filter);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="py-16 flex flex-col items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-500 dark:text-gray-400">Loading the gallery...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Explore Community Creations</h2>
        
        {/* Filters */}
        <div className="flex overflow-x-auto pb-2 space-x-2 mb-4">
          <FilterButton 
            label="Trending" 
            active={activeFilter === "trending"} 
            onClick={() => handleFilterChange("trending")} 
          />
          <FilterButton 
            label="Newest" 
            active={activeFilter === "newest"} 
            onClick={() => handleFilterChange("newest")} 
          />
          <FilterButton 
            label="Most Liked" 
            active={activeFilter === "mostLiked"} 
            onClick={() => handleFilterChange("mostLiked")} 
          />
          <FilterButton 
            label="Fantasy" 
            active={activeFilter === "fantasy"} 
            onClick={() => handleFilterChange("fantasy")} 
          />
          <FilterButton 
            label="Portraits" 
            active={activeFilter === "portraits"} 
            onClick={() => handleFilterChange("portraits")} 
          />
          <FilterButton 
            label="Anime" 
            active={activeFilter === "anime"} 
            onClick={() => handleFilterChange("anime")} 
          />
          <FilterButton 
            label="More" 
            active={false} 
            onClick={() => {}} 
          />
        </div>
      </div>
      
      {(!publicImages || publicImages.length === 0) ? (
        <div className="py-12 text-center">
          <p className="text-gray-500 dark:text-gray-400">No images found for this filter.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {publicImages.map((image) => (
              <ImageCard key={image.id} image={image} showUser={true} />
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
        </>
      )}
    </div>
  );
}

interface FilterButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
}

function FilterButton({ label, active, onClick }: FilterButtonProps) {
  return (
    <button
      className={`whitespace-nowrap py-2 px-4 rounded-full text-sm transition-colors ${
        active
          ? "bg-indigo-500 text-white"
          : "bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
