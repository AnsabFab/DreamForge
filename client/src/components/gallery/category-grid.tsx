import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Image } from "@shared/schema";
import { ImageCard } from "./image-card";
import { Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Category structure
interface Category {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
}

// These are all high-quality thumbnails for different categories
const categories: Category[] = [
  {
    id: "landscapes",
    name: "Landscapes",
    thumbnail: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=3403&auto=format&fit=crop",
    description: "Breathtaking natural vistas"
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk", 
    thumbnail: "https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=3387&auto=format&fit=crop",
    description: "Futuristic urban dystopias"
  },
  {
    id: "portraits",
    name: "Portraits",
    thumbnail: "https://images.unsplash.com/photo-1604004555489-723a93d6ce74?q=80&w=3387&auto=format&fit=crop",
    description: "Stunning character portraits"
  },
  {
    id: "fantasy",
    name: "Fantasy",
    thumbnail: "https://images.unsplash.com/photo-1599689018034-48e2ead82951?q=80&w=3270&auto=format&fit=crop",
    description: "Magical worlds and creatures"
  },
  {
    id: "anime",
    name: "Anime",
    thumbnail: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=3387&auto=format&fit=crop",
    description: "Japanese animation style"
  },
  {
    id: "abstract",
    name: "Abstract",
    thumbnail: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=3320&auto=format&fit=crop",
    description: "Colorful abstract designs"
  },
  {
    id: "animals",
    name: "Animals",
    thumbnail: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=3372&auto=format&fit=crop",
    description: "Wildlife and pet portraits"
  },
  {
    id: "scifi",
    name: "Sci-Fi",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=3344&auto=format&fit=crop",
    description: "Futuristic space scenes"
  }
];

export function CategoryGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  const {
    data: categoryImages,
    isLoading,
    isFetching
  } = useQuery<Image[]>({
    queryKey: ["/api/images/public", { filter: selectedCategory || "trending" }],
    enabled: !!selectedCategory,
  });
  
  // Handle category selection
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  // Go back to the category grid
  const handleBackClick = () => {
    setSelectedCategory(null);
  };
  
  // If a category is selected, show its images
  if (selectedCategory) {
    const category = categories.find(c => c.id === selectedCategory);
    
    return (
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button 
              onClick={handleBackClick}
              className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 flex items-center mb-2"
            >
              <X className="w-4 h-4 mr-1" /> Back to categories
            </button>
            <h2 className="text-2xl font-bold flex items-center">
              {category?.name}
              <Badge variant="outline" className="ml-3">{categoryImages?.length || 0} images</Badge>
            </h2>
            <p className="text-gray-500 dark:text-gray-400">{category?.description}</p>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Loading {category?.name.toLowerCase()}...</p>
          </div>
        ) : !categoryImages || categoryImages.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500 dark:text-gray-400">No images found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryImages.map((image) => (
              <ImageCard key={image.id} image={image} showUser={true} />
            ))}
          </div>
        )}
      </div>
    );
  }
  
  // Otherwise, show the category grid
  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">Community Showcase</h2>
        <p className="text-gray-500 dark:text-gray-400">Explore incredible AI-generated artwork by category</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="rounded-lg overflow-hidden shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => handleCategoryClick(category.id)}
          >
            <div className="aspect-square relative">
              <img 
                src={category.thumbnail} 
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-white text-lg font-medium">{category.name}</h3>
                <p className="text-white/80 text-sm">{category.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}