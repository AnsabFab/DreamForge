import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Image } from "@shared/schema";
import { ImageCard } from "./image-card";
import { Loader2, X, Download, Share, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// Category structure
interface Category {
  id: string;
  name: string;
  thumbnail: string;
  description: string;
  images: Image[];
}

// Sample image data for each category
const createSampleImage = (id: number, prompt: string, categoryId: string, imageUrl: string): Image => ({
  id,
  userId: 0,
  createdAt: new Date(),
  prompt,
  styleId: null,
  modelId: null,
  imageUrl,
  isPublic: true,
  likes: Math.floor(Math.random() * 50) + 5,
});

// These are high-quality thumbnails for different categories with sample images
const categories: Category[] = [
  {
    id: "landscapes",
    name: "Landscapes",
    thumbnail: "https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=3403&auto=format&fit=crop",
    description: "Breathtaking natural vistas",
    images: [
      createSampleImage(101, "Snowy mountain tops at sunset with pink clouds", "landscapes", "https://images.unsplash.com/photo-1454496522488-7a8e488e8606?w=800&auto=format&fit=crop"),
      createSampleImage(102, "Misty forest with rays of light streaming through", "landscapes", "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=800&auto=format&fit=crop"),
      createSampleImage(103, "Pristine lake reflecting mountains and trees", "landscapes", "https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&auto=format&fit=crop"),
      createSampleImage(104, "Desert dunes at golden hour", "landscapes", "https://images.unsplash.com/photo-1473580044384-7ba9967e16a0?w=800&auto=format&fit=crop"),
      createSampleImage(105, "Lush tropical waterfall cascading into a crystal pool", "landscapes", "https://images.unsplash.com/photo-1467890947394-8171244e5410?w=800&auto=format&fit=crop"),
      createSampleImage(106, "Rolling hills with wildflowers and a distant cottage", "landscapes", "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&auto=format&fit=crop"),
      createSampleImage(107, "Northern lights over a snowy landscape", "landscapes", "https://images.unsplash.com/photo-1483347756197-71ef80e95f73?w=800&auto=format&fit=crop"),
      createSampleImage(108, "Dramatic coastal cliffs with crashing waves", "landscapes", "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&auto=format&fit=crop"),
      createSampleImage(109, "Field of lavender at sunset", "landscapes", "https://images.unsplash.com/photo-1499002238440-d264edd596ec?w=800&auto=format&fit=crop"),
      createSampleImage(110, "Rocky mountain peaks in the morning mist", "landscapes", "https://images.unsplash.com/photo-1472396961693-142e6e269027?w=800&auto=format&fit=crop"),
      createSampleImage(111, "Autumn forest with golden leaves", "landscapes", "https://images.unsplash.com/photo-1523712999610-f77fbcfc3843?w=800&auto=format&fit=crop"),
      createSampleImage(112, "Sandy beach with turquoise water and palm trees", "landscapes", "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop")
    ]
  },
  {
    id: "cyberpunk",
    name: "Cyberpunk", 
    thumbnail: "https://images.unsplash.com/photo-1542272201-b1ca555f8505?q=80&w=3387&auto=format&fit=crop",
    description: "Futuristic urban dystopias",
    images: [
      createSampleImage(201, "Neon-lit urban streets with holographic ads", "cyberpunk", "https://images.unsplash.com/photo-1523821741446-edb2b68bb7a0?w=800&auto=format&fit=crop"),
      createSampleImage(202, "Cybernetic woman with glowing implants", "cyberpunk", "https://images.unsplash.com/photo-1558962631-a2dc48edb0f1?w=800&auto=format&fit=crop"),
      createSampleImage(203, "Futuristic mega-city with flying vehicles", "cyberpunk", "https://images.unsplash.com/photo-1524725407856-09f9216ef9b7?w=800&auto=format&fit=crop"),
      createSampleImage(204, "Retro-futuristic arcade with hacker setup", "cyberpunk", "https://images.unsplash.com/photo-1597429554061-25dfd04bb0ea?w=800&auto=format&fit=crop"),
      createSampleImage(205, "High-tech neural interface dashboard", "cyberpunk", "https://images.unsplash.com/photo-1573164713712-03790a178651?w=800&auto=format&fit=crop"),
      createSampleImage(206, "Rainy cyberpunk alleyway with neon reflections", "cyberpunk", "https://images.unsplash.com/photo-1596712939732-f38cfc0b83cf?w=800&auto=format&fit=crop"),
      createSampleImage(207, "Robot bartender in a underground club", "cyberpunk", "https://images.unsplash.com/photo-1600267165603-a5713cf60da2?w=800&auto=format&fit=crop"),
      createSampleImage(208, "Corporate dystopia with high-rise buildings", "cyberpunk", "https://images.unsplash.com/photo-1616286608358-4dd6678da3ea?w=800&auto=format&fit=crop"),
      createSampleImage(209, "Digital brain implant interface", "cyberpunk", "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=800&auto=format&fit=crop"),
      createSampleImage(210, "Virtual reality nightclub scene", "cyberpunk", "https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?w=800&auto=format&fit=crop")
    ]
  },
  {
    id: "portraits",
    name: "Portraits",
    thumbnail: "https://images.unsplash.com/photo-1604004555489-723a93d6ce74?q=80&w=3387&auto=format&fit=crop",
    description: "Stunning character portraits",
    images: [
      createSampleImage(301, "Mystical female warrior with glowing aura", "portraits", "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800&auto=format&fit=crop"),
      createSampleImage(302, "Elderly man with stories in his eyes", "portraits", "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=800&auto=format&fit=crop"),
      createSampleImage(303, "Futuristic cyber-enhanced character", "portraits", "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=800&auto=format&fit=crop"),
      createSampleImage(304, "Tribal warrior with traditional face paint", "portraits", "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&auto=format&fit=crop"),
      createSampleImage(305, "Astronaut portrait with reflecting cosmos", "portraits", "https://images.unsplash.com/photo-1536009349855-26058c5a04c6?w=800&auto=format&fit=crop"),
      createSampleImage(306, "Victorian era inspired portrait", "portraits", "https://images.unsplash.com/photo-1553514029-1318c9127859?w=800&auto=format&fit=crop"),
      createSampleImage(307, "Close-up of fantasy creature", "portraits", "https://images.unsplash.com/photo-1567186937675-a5131c8a89ea?w=800&auto=format&fit=crop"),
      createSampleImage(308, "Ethereal fairy queen with butterfly elements", "portraits", "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop"),
      createSampleImage(309, "Medieval knight in detailed armor", "portraits", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&auto=format&fit=crop"),
      createSampleImage(310, "Dramatic lighting theatrical portrait", "portraits", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&auto=format&fit=crop"),
      createSampleImage(311, "Future human with subtle alien features", "portraits", "https://images.unsplash.com/photo-1601412436009-d964bd02edbc?w=800&auto=format&fit=crop"),
      createSampleImage(312, "Samurai warrior with traditional armor", "portraits", "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=800&auto=format&fit=crop")
    ]
  },
  {
    id: "fantasy",
    name: "Fantasy",
    thumbnail: "https://images.unsplash.com/photo-1599689018034-48e2ead82951?q=80&w=3270&auto=format&fit=crop",
    description: "Magical worlds and creatures",
    images: [
      createSampleImage(401, "Ancient dragon perched on castle tower", "fantasy", "https://images.unsplash.com/photo-1535666669445-e8c15cd2e7a9?w=800&auto=format&fit=crop"),
      createSampleImage(402, "Enchanted forest with glowing mushrooms", "fantasy", "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&auto=format&fit=crop"),
      createSampleImage(403, "Crystal magic portal between worlds", "fantasy", "https://images.unsplash.com/photo-1518709414768-a88981a4515d?w=800&auto=format&fit=crop"),
      createSampleImage(404, "Majestic unicorn in flowering meadow", "fantasy", "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop"),
      createSampleImage(405, "Floating islands with waterfalls", "fantasy", "https://images.unsplash.com/photo-1516339901601-2e1b62dc0c45?w=800&auto=format&fit=crop"),
      createSampleImage(406, "Wizard tower reaching into the clouds", "fantasy", "https://images.unsplash.com/photo-1500027014421-46ccc3d3bce6?w=800&auto=format&fit=crop"),
      createSampleImage(407, "Phoenix rising from flames", "fantasy", "https://images.unsplash.com/photo-1517614139506-a538e95786dc?w=800&auto=format&fit=crop"),
      createSampleImage(408, "Underwater mermaid kingdom", "fantasy", "https://images.unsplash.com/photo-1549880181-56a44cf4a9a5?w=800&auto=format&fit=crop"),
      createSampleImage(409, "Mystical fairy garden with tiny houses", "fantasy", "https://images.unsplash.com/photo-1511104286249-cade2ff54588?w=800&auto=format&fit=crop"),
      createSampleImage(410, "Ancient tree with face and living branches", "fantasy", "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop")
    ]
  },
  {
    id: "anime",
    name: "Anime",
    thumbnail: "https://images.unsplash.com/photo-1578632292335-df3abbb0d586?q=80&w=3387&auto=format&fit=crop",
    description: "Japanese animation style",
    images: [
      createSampleImage(501, "Anime girl with cherry blossoms", "anime", "https://images.unsplash.com/photo-1559981421-3e0c0d156f77?w=800&auto=format&fit=crop"),
      createSampleImage(502, "Mecha battle scene with explosions", "anime", "https://images.unsplash.com/photo-1554310603-d39d43033735?w=800&auto=format&fit=crop"),
      createSampleImage(503, "Magical girl transformation sequence", "anime", "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop"),
      createSampleImage(504, "School rooftop anime scene", "anime", "https://images.unsplash.com/photo-1541562232579-512a21360020?w=800&auto=format&fit=crop"),
      createSampleImage(505, "Chibi characters in playful scene", "anime", "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=800&auto=format&fit=crop"),
      createSampleImage(506, "Samurai with flowing robes in action", "anime", "https://images.unsplash.com/photo-1578377375283-54e3b880f8df?w=800&auto=format&fit=crop"),
      createSampleImage(507, "Anime-style village with mountain backdrop", "anime", "https://images.unsplash.com/photo-1520262494112-9fe481d36ec3?w=800&auto=format&fit=crop"),
      createSampleImage(508, "Kawaii food characters in kitchen", "anime", "https://images.unsplash.com/photo-1525351326368-efbb5cb6814d?w=800&auto=format&fit=crop"),
      createSampleImage(509, "Epic anime battle with special effects", "anime", "https://images.unsplash.com/photo-1519638831568-d9897f54ed69?w=800&auto=format&fit=crop"),
      createSampleImage(510, "Summer festival scene with yukata", "anime", "https://images.unsplash.com/photo-1534684686641-05569203ecca?w=800&auto=format&fit=crop")
    ]
  },
  {
    id: "abstract",
    name: "Abstract",
    thumbnail: "https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=3320&auto=format&fit=crop",
    description: "Colorful abstract designs",
    images: [
      createSampleImage(601, "Vibrant liquid shapes with color flow", "abstract", "https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=800&auto=format&fit=crop"),
      createSampleImage(602, "Geometric cubes in 3D space", "abstract", "https://images.unsplash.com/photo-1550859492-d5da9d8e45f3?w=800&auto=format&fit=crop"),
      createSampleImage(603, "Fractal patterns in vivid colors", "abstract", "https://images.unsplash.com/photo-1507908708918-778587c9e563?w=800&auto=format&fit=crop"),
      createSampleImage(604, "Light trails forming abstract shapes", "abstract", "https://images.unsplash.com/photo-1539617446542-afcea3c65da5?w=800&auto=format&fit=crop"),
      createSampleImage(605, "Swirling smoke photography", "abstract", "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&auto=format&fit=crop"),
      createSampleImage(606, "Neural network visualization", "abstract", "https://images.unsplash.com/photo-1567359781514-3b964e2b04d6?w=800&auto=format&fit=crop"),
      createSampleImage(607, "Kaleidoscope pattern art", "abstract", "https://images.unsplash.com/photo-1572896381427-bbce796e2b75?w=800&auto=format&fit=crop"),
      createSampleImage(608, "Abstract architecture lines", "abstract", "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop"),
      createSampleImage(609, "Digital glitch art pattern", "abstract", "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&auto=format&fit=crop"),
      createSampleImage(610, "Macro photography of bubbles", "abstract", "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&auto=format&fit=crop")
    ]
  },
  {
    id: "animals",
    name: "Animals",
    thumbnail: "https://images.unsplash.com/photo-1474511320723-9a56873867b5?q=80&w=3372&auto=format&fit=crop",
    description: "Wildlife and pet portraits",
    images: [
      createSampleImage(701, "Majestic lion in savanna sunset", "animals", "https://images.unsplash.com/photo-1546182990-dffeafbe841d?w=800&auto=format&fit=crop"),
      createSampleImage(702, "Fox in snowy forest landscape", "animals", "https://images.unsplash.com/photo-1474511320723-9a56873867b5?w=800&auto=format&fit=crop"),
      createSampleImage(703, "Underwater scene with colorful fish", "animals", "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&auto=format&fit=crop"),
      createSampleImage(704, "Curious cat with intense eyes", "animals", "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop"),
      createSampleImage(705, "Bird of paradise with spread wings", "animals", "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800&auto=format&fit=crop"),
      createSampleImage(706, "Wolf howling at full moon", "animals", "https://images.unsplash.com/photo-1564466809058-bf4114d55352?w=800&auto=format&fit=crop"),
      createSampleImage(707, "Two dogs playing in autumn leaves", "animals", "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&auto=format&fit=crop"),
      createSampleImage(708, "Elephants at watering hole", "animals", "https://images.unsplash.com/photo-1556760544-b790f2f757e2?w=800&auto=format&fit=crop"),
      createSampleImage(709, "Butterfly on flower close-up", "animals", "https://images.unsplash.com/photo-1484099702254-915b6cc2de24?w=800&auto=format&fit=crop"),
      createSampleImage(710, "Family of polar bears on ice", "animals", "https://images.unsplash.com/photo-1589656966895-2f33e7653819?w=800&auto=format&fit=crop")
    ]
  },
  {
    id: "scifi",
    name: "Sci-Fi",
    thumbnail: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=3344&auto=format&fit=crop",
    description: "Futuristic space scenes",
    images: [
      createSampleImage(801, "Spaceship approaching alien planet", "scifi", "https://images.unsplash.com/photo-1536697246787-1f7ae568d89a?w=800&auto=format&fit=crop"),
      createSampleImage(802, "Futuristic city with flying cars", "scifi", "https://images.unsplash.com/photo-1504333638930-c8787321eee0?w=800&auto=format&fit=crop"),
      createSampleImage(803, "AI robot with human emotions", "scifi", "https://images.unsplash.com/photo-1535378620166-273708d44e4c?w=800&auto=format&fit=crop"),
      createSampleImage(804, "Abandoned space station interior", "scifi", "https://images.unsplash.com/photo-1518623489648-a173ef7824f3?w=800&auto=format&fit=crop"),
      createSampleImage(805, "Wormhole in deep space", "scifi", "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=800&auto=format&fit=crop"),
      createSampleImage(806, "Humanoid android closeup", "scifi", "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop"),
      createSampleImage(807, "Terraformed Mars landscape", "scifi", "https://images.unsplash.com/photo-1581821294068-408c32f5e0ed?w=800&auto=format&fit=crop"),
      createSampleImage(808, "Quantum computer visualization", "scifi", "https://images.unsplash.com/photo-1584949091598-c31daaaa4aa9?w=800&auto=format&fit=crop"),
      createSampleImage(809, "Astronaut on alien world", "scifi", "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&auto=format&fit=crop"),
      createSampleImage(810, "Space elevator concept", "scifi", "https://images.unsplash.com/photo-1420742713568-f9b1874b9b7b?w=800&auto=format&fit=crop")
    ]
  }
];

export function CategoryGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [categoryImages, setCategoryImages] = useState<Image[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // Effect to fetch sample images when category changes
  useEffect(() => {
    if (selectedCategory) {
      setIsLoading(true);
      
      // Simulate API call delay for realism
      setTimeout(() => {
        const category = categories.find(c => c.id === selectedCategory);
        setCategoryImages(category?.images || []);
        setIsLoading(false);
      }, 800);
    }
  }, [selectedCategory]);
  
  // Handle category selection
  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };
  
  // Go back to the category grid
  const handleBackClick = () => {
    setSelectedCategory(null);
  };
  
  // Download image function
  const handleDownload = (imageUrl: string, prompt: string) => {
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `dreamforge-${prompt.split(' ').slice(0, 3).join('-')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              className="text-sm text-gray-400 hover:text-gray-200 flex items-center mb-2"
            >
              <X className="w-4 h-4 mr-1" /> Back to categories
            </button>
            <h2 className="text-2xl font-bold flex items-center">
              {category?.name}
              <Badge variant="outline" className="ml-3 bg-gray-800 text-gray-200">{categoryImages?.length || 0} images</Badge>
            </h2>
            <p className="text-gray-400">{category?.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200">
              <Heart className="w-4 h-4 mr-2" /> Favorites
            </Button>
            <Button variant="outline" className="bg-gray-800 hover:bg-gray-700 border-gray-700 text-gray-200">
              <Share className="w-4 h-4 mr-2" /> Share
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="py-16 flex flex-col items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-500 mb-4" />
            <p className="text-gray-400">Loading {category?.name.toLowerCase()}...</p>
          </div>
        ) : !categoryImages || categoryImages.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-400">No images found in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categoryImages.map((image) => (
              <div key={image.id} className="group relative">
                <ImageCard image={image} showUser={true} />
                <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="icon"
                    variant="secondary"
                    className="rounded-full bg-black/60 hover:bg-black/80 w-8 h-8"
                    onClick={() => handleDownload(image.imageUrl, image.prompt)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              </div>
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
        <h2 className="text-2xl font-bold">Explore Categories</h2>
        <p className="text-gray-400">Discover incredible AI-generated artwork by category</p>
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