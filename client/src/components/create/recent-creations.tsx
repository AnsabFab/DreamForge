import { useQuery } from "@tanstack/react-query";
import { Image } from "@shared/schema";
import { ImageCard } from "@/components/gallery/image-card";

export function RecentCreations() {
  const { data: recentImages, isLoading } = useQuery<Image[]>({
    queryKey: ["/api/images/recent"],
  });

  if (isLoading) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Your Recent Creations</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
          <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
        </div>
      </div>
    );
  }

  if (!recentImages || recentImages.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-4">Your Recent Creations</h3>
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-xl">
          <p className="text-gray-500 dark:text-gray-400">
            No recent creations yet. Generate your first image!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-semibold mb-4">Your Recent Creations</h3>
      <div className="grid grid-cols-2 gap-4">
        {recentImages.map((image) => (
          <ImageCard 
            key={image.id} 
            image={image} 
            showUser={false}
          />
        ))}
      </div>
    </div>
  );
}
