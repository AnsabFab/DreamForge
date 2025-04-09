import { Image, Style, Model } from "@shared/schema";

// Sample image URLs for different categories (Midjourney-like AI generated images)
const fantasyImages = [
  "https://cdn.midjourney.com/c4224702-e40d-411c-9ef7-81d8e8faf651/0_0.png",
  "https://cdn.midjourney.com/b89d14e6-f8d2-4f8f-9d10-0e565c8d22d8/0_1.png",
  "https://cdn.midjourney.com/e06341bd-3c63-4f9a-b42e-07e6c45c3355/0_3.png",
  "https://cdn.midjourney.com/c0e05a1c-fd68-44fd-8431-10c1305ba393/0_3.png",
  "https://cdn.midjourney.com/acd58c95-0e1a-4c1b-9f22-bb909c304fe0/0_1.png",
  "https://cdn.midjourney.com/28c1f547-b2c0-4ea8-b9ab-0525ae64341a/0_0.png",
  "https://cdn.midjourney.com/05ac1d31-ce6e-4de7-8869-d5731c00e271/0_2.png",
  "https://cdn.midjourney.com/29db71f6-b651-465a-a45e-839ea26de96d/0_2.png",
  "https://cdn.midjourney.com/2e89a3aa-ee14-4a55-9853-1bb99fd05fb2/0_0.png",
  "https://cdn.midjourney.com/a30ec8a5-ef77-498b-990f-0e9da40c985d/0_0.png",
  "https://cdn.midjourney.com/56b8319d-731d-48d3-86e7-244717f08b5f/0_1.png",
  "https://cdn.midjourney.com/6118ab2a-39a6-4ead-bba7-d03ac063eac9/0_2.png"
];

const portraitImages = [
  "https://cdn.midjourney.com/b2ab1719-9aaf-439c-af21-99d085c141bf/0_0.png",
  "https://cdn.midjourney.com/a8f71f5b-ae8d-48cc-bb72-08f3887b7a83/0_0.png",
  "https://cdn.midjourney.com/e68b10ad-fa54-46fc-a4c2-6af76988e997/0_0.png",
  "https://cdn.midjourney.com/8dd95918-3d4f-4f67-8b4d-210648f2af4f/0_0.png",
  "https://cdn.midjourney.com/11c8d459-81a8-4765-aea5-81d880a5a71a/0_1.png",
  "https://cdn.midjourney.com/ce4cdc68-1428-4660-b4ea-3e6cecef449d/0_2.png",
  "https://cdn.midjourney.com/b8f57c3d-e1d2-4403-891c-414ca8fba8df/0_0.png",
  "https://cdn.midjourney.com/b38a5b15-a189-4685-bf3e-fdfa232d96ee/0_1.png",
  "https://cdn.midjourney.com/d82af334-4dcc-492b-8f94-35d31f1aa198/0_2.png",
  "https://cdn.midjourney.com/9a21d5aa-7e84-4293-bf73-16e7ed5bd9f9/0_3.png",
  "https://cdn.midjourney.com/ec31cb8e-1391-4232-890a-e8ab77e8ba33/0_1.png",
  "https://cdn.midjourney.com/9cc4c1f1-281c-424b-b5a1-cec99f3396e9/0_2.png"
];

const animeImages = [
  "https://cdn.midjourney.com/8e07f49b-eb3a-4ca7-b35d-66b2b3822203/0_3.png",
  "https://cdn.midjourney.com/d29988a5-c4a7-4e7b-a34f-4fa8d8a330db/0_1.png",
  "https://cdn.midjourney.com/e3e86fee-d2a0-4d29-bb44-bdf4c4b5b30b/0_2.png",
  "https://cdn.midjourney.com/9c3e6a2e-4d24-4bf1-b083-dc93892fb9a5/0_0.png",
  "https://cdn.midjourney.com/67dc5e66-74cd-40d9-9225-16a387af8ad0/0_0.png",
  "https://cdn.midjourney.com/9b3d2c5c-7f0b-498d-a5d2-a3977bbd3bcc/0_0.png",
  "https://cdn.midjourney.com/0f10ce35-88a8-4a03-8266-e9c91fc09459/0_3.png",
  "https://cdn.midjourney.com/0c2c50f0-7596-493d-975c-ae5c29c71ea6/0_0.png",
  "https://cdn.midjourney.com/33d67600-a43e-43eb-8a72-a3a0e8de3b1a/0_1.png",
  "https://cdn.midjourney.com/8fb9db6c-4f0e-442a-ad36-04ac13abb926/0_2.png",
  "https://cdn.midjourney.com/65363d10-9fc0-4a5b-93fd-28c05700e171/0_1.png",
  "https://cdn.midjourney.com/a1ccc90d-0ca2-4dea-a7e2-ec6af9e6ee9d/0_3.png"
];

const landscapeImages = [
  "https://cdn.midjourney.com/4a08c931-ba32-4c1b-9f6a-3c82f3328a01/0_3.png",
  "https://cdn.midjourney.com/aa539e75-e458-4714-9a66-22e3b14a0165/0_1.png",
  "https://cdn.midjourney.com/7aa1e5d5-f645-4ac8-a827-8ddfcfec346e/0_2.png",
  "https://cdn.midjourney.com/64294e30-4d75-4c8b-a3a4-d4b6a97d00ee/0_1.png",
  "https://cdn.midjourney.com/34823858-9f41-4a5c-ac1a-3e1b608aaddf/0_0.png",
  "https://cdn.midjourney.com/4a72aace-2c3b-44f4-a0bb-af44fae5ab89/0_3.png",
  "https://cdn.midjourney.com/c13c8eb9-66a9-4161-93b0-3e7263426c29/0_1.png",
  "https://cdn.midjourney.com/dae26bad-7b5b-4ce3-bf40-c7a39de3df71/0_3.png",
  "https://cdn.midjourney.com/a60f5db1-4579-4c5c-9d5e-11adb75a6252/0_2.png",
  "https://cdn.midjourney.com/5fab2d85-bd36-4ad7-a83c-cb12df1ed131/0_1.png",
  "https://cdn.midjourney.com/8a52ee2c-6d1e-490d-a0dc-30e1a808c6be/0_0.png",
  "https://cdn.midjourney.com/e17e4a22-8fae-47f8-9110-aad75dabbf23/0_3.png"
];

const abstractImages = [
  "https://cdn.midjourney.com/83661ad7-c4b7-4954-913a-8cfd7dd023c2/0_1.png",
  "https://cdn.midjourney.com/db91c0c9-db43-4bfc-afae-1ec5bb182ab5/0_2.png",
  "https://cdn.midjourney.com/53e6e1f1-7ac0-4a25-bdff-a2bc2f3664a7/0_0.png",
  "https://cdn.midjourney.com/3dc2eec6-52f3-4186-a955-1ca39da47fb2/0_3.png",
  "https://cdn.midjourney.com/15e4e74e-f349-465c-b31a-fb226ef44938/0_0.png",
  "https://cdn.midjourney.com/a58ae148-6129-4c93-889d-ac1af2852949/0_2.png",
  "https://cdn.midjourney.com/4aa3efc3-23c3-4650-af73-4bb5b392afa7/0_3.png",
  "https://cdn.midjourney.com/1fa4c5a9-9d67-4c2e-a018-d9e0a234eb13/0_1.png",
  "https://cdn.midjourney.com/96a6e5e6-86a9-4a9c-88f2-3f4e2c9fcc87/0_0.png",
  "https://cdn.midjourney.com/6d5b7b7e-1b1e-4d3a-ad73-8a8f9c0c0c1a/0_2.png"
];

const cyberpunkImages = [
  "https://cdn.midjourney.com/4c728ba9-f5a9-4183-a031-de8f4d61225a/0_0.png",
  "https://cdn.midjourney.com/6c69cf08-bf95-477a-8be0-7772496c9acd/0_3.png",
  "https://cdn.midjourney.com/ef2e9c17-2705-4d59-b10d-d72a9ac3cc57/0_1.png",
  "https://cdn.midjourney.com/98f87d09-d4ba-4fd8-bcd6-6f3b151e2223/0_2.png",
  "https://cdn.midjourney.com/d8bbb5bc-3f93-44fd-9f9c-f21d117c49af/0_0.png",
  "https://cdn.midjourney.com/fd1e6474-7917-4097-9f30-66d51fac1acb/0_3.png",
  "https://cdn.midjourney.com/81a88c77-e7e5-4b5b-bff1-da44155ec175/0_1.png",
  "https://cdn.midjourney.com/aca39373-d786-4c2e-bfa5-46dc5e6643ba/0_0.png",
  "https://cdn.midjourney.com/1bc0d745-49c0-4651-b46d-55306a553eb1/0_2.png",
  "https://cdn.midjourney.com/77fe6c30-be7d-4303-9b53-a5fc8bc6c7cb/0_3.png",
  "https://cdn.midjourney.com/32dc31e8-e2fd-4e3d-9f3f-8cc6396b88cd/0_1.png",
  "https://cdn.midjourney.com/32b62bb8-6a7b-4d0c-ac29-c671194232a6/0_2.png"
];

const scifiImages = [
  "https://cdn.midjourney.com/25f0a3a8-db6c-4a6e-a61b-fa6076e0969a/0_1.png",
  "https://cdn.midjourney.com/65a58339-7cac-4c84-8ae7-d567c8cc46ef/0_2.png",
  "https://cdn.midjourney.com/60ae8f9a-e94a-45af-a3e6-c7a9ed6c05d9/0_3.png",
  "https://cdn.midjourney.com/ab6f423e-e8de-4e83-9436-b66b27da7886/0_0.png",
  "https://cdn.midjourney.com/1c0a1a9c-7c35-4c41-9215-78a86526b4c5/0_1.png",
  "https://cdn.midjourney.com/e69ed5ab-36b0-47e8-b4ca-0cd5cce7a012/0_2.png",
  "https://cdn.midjourney.com/68a8a0fa-e6a7-4552-960a-afb1a2e626dd/0_0.png",
  "https://cdn.midjourney.com/d5b9a12c-4e4b-4c40-8fef-d11268d01502/0_3.png",
  "https://cdn.midjourney.com/1fdd9d17-3a02-47b1-9c06-19ebb5edc795/0_1.png",
  "https://cdn.midjourney.com/45d62a57-a4a2-40d5-9cdd-4f32cc6de013/0_3.png",
  "https://cdn.midjourney.com/c7a8cc30-a362-4bf5-a926-8dccf0e0ab52/0_2.png",
  "https://cdn.midjourney.com/9e1e5ff7-e4d3-43c7-9bee-92a9fc6e74dc/0_0.png"
];

const animalImages = [
  "https://cdn.midjourney.com/e9c25797-2ef6-48a8-917e-9ae324f4dc41/0_1.png",
  "https://cdn.midjourney.com/27b2d8ea-cbcb-48de-95c9-7c6f9c235a4c/0_2.png",
  "https://cdn.midjourney.com/2fbec5d7-e0ad-48b9-a3ac-7c0f98765b41/0_3.png",
  "https://cdn.midjourney.com/a1e89a1c-a277-4eb7-a79e-9c50cb68da8d/0_0.png",
  "https://cdn.midjourney.com/a2e6d836-c974-4f42-81f5-f3f83c7be9aa/0_1.png",
  "https://cdn.midjourney.com/f66c1d09-3bd4-4fa5-9f44-5c6d80c6cd6c/0_2.png",
  "https://cdn.midjourney.com/3697caa3-69b2-4b38-bfc3-31a7eeccda9d/0_0.png",
  "https://cdn.midjourney.com/1aad7216-64a7-4967-bc56-2734b7d1c317/0_3.png",
  "https://cdn.midjourney.com/48f79c5e-49f0-4365-82dd-da5db9dd8144/0_1.png",
  "https://cdn.midjourney.com/cd7e397d-a9f7-49e9-baad-2c7f0e4b5968/0_2.png",
  "https://cdn.midjourney.com/4de1b9fa-5a52-44ab-939b-ba7aa2fe894e/0_0.png",
  "https://cdn.midjourney.com/2d3fba7c-10bf-4b87-8d67-14a0a0df1574/0_3.png"
];

// Fantasy prompts
const fantasyPrompts = [
  "A majestic dragon perched on castle ruins, breathing blue fire, fantasy digital art",
  "Mystical forest with floating lanterns and bioluminescent plants, fantasy landscape",
  "Ancient wizard tower on a floating island with magical waterfalls, epic fantasy scene",
  "Crystal palace with rainbow bridges and magical beings, ethereal fantasy landscape",
  "Battle between light and dark magical creatures in a fantasy realm",
  "A fairy kingdom hidden in giant mushrooms with glowing insects, fantasy environment",
  "Ancient tree of life with magical creatures living in its branches, fantasy world",
  "Enchanted library with floating books and magical artifacts, fantasy interior",
  "Phoenix rising from magical flames in a sacred fantasy temple",
  "Knight facing a giant crystal golem in an enchanted cave, fantasy battle",
  "Magical portal opening between fantasy worlds with energy swirling around it",
  "Underwater fantasy kingdom with merfolk and bioluminescent architecture"
];

// Portrait prompts
const portraitPrompts = [
  "Portrait of a celestial empress with cosmic headdress, digital painting",
  "Close-up portrait of a weathered warrior with scars and intense eyes",
  "Ethereal female portrait with flowing hair and glowing magical elements",
  "Fantasy portrait of an elven king with antlers and forest elements",
  "Dark fantasy portrait of a necromancer with shadowy tendrils, highly detailed",
  "Portrait of a cybernetic being with glowing circuitry and human features",
  "Tribal warrior portrait with elaborate face paint and fierce expression",
  "Angelic portrait with golden light and ethereal features, digital painting",
  "Portrait of a steampunk inventor with mechanical eye and Victorian attire",
  "Mysterious hooded figure portrait with glowing eyes in the shadows",
  "Royal portrait of fantasy queen with elaborate jeweled crown and regal pose",
  "Portrait of a druid with living plants growing from their body and ancient symbols"
];

// Anime prompts
const animePrompts = [
  "Anime girl with pastel pink hair in a magical garden, kawaii style",
  "Anime cyberpunk samurai with neon sword in futuristic Tokyo",
  "Magical anime schoolgirl with spellbook and familiar, cute anime style",
  "Anime mecha pilot in cockpit with holographic displays",
  "Battle scene between anime heroes with energy powers, dynamic pose",
  "Anime cat girl in a cozy cafe, slice of life style",
  "Demon lord anime character with dramatic lighting and dark powers",
  "Anime magical transformation sequence with sparkles and energy",
  "Anime character with dragon familiar in fantasy setting",
  "Anime alchemist brewing magical potions in ancient laboratory",
  "Anime space explorer with futuristic suit on alien planet",
  "Anime witch with magical familiar in enchanted forest"
];

// Landscape prompts
const landscapePrompts = [
  "Epic mountain range with waterfalls and morning mist, panoramic landscape",
  "Alien planet landscape with strange flora and multiple moons in the sky",
  "Floating islands with waterfalls in a sunset sky, fantasy landscape",
  "Cyberpunk cityscape at night with neon lights and flying vehicles",
  "Ancient ruins in a jungle with mystic fog and ray of light",
  "Underwater landscape with coral cities and bioluminescent life",
  "Desert oasis with crystal clear water and palm trees at twilight",
  "Volcanic landscape with lava rivers and ash storms, dramatic lighting",
  "Arctic landscape with aurora borealis and ice formations",
  "Enchanted forest with giant luminescent mushrooms and magical creatures",
  "Terraced rice fields in mountainous region with morning mist",
  "Futuristic eco-city with vertical gardens and clean energy technology"
];

// Abstract prompts
const abstractPrompts = [
  "Abstract flow of colors resembling cosmic nebulas and galactic clouds",
  "Geometric patterns and shapes forming an intricate futuristic design",
  "Fluid abstract art with vibrant colors and dynamic movement",
  "Fractal mathematics visualized as an abstract art piece",
  "Abstract representation of human emotions through color and form",
  "Surreal abstract landscape with impossible architecture",
  "Digital abstract art with glitching elements and data visualization",
  "Organic abstract shapes that resemble microscopic life forms",
  "Abstract art inspired by quantum physics and wave patterns",
  "Minimalist abstract composition with simple shapes and bold colors"
];

// Cyberpunk prompts
const cyberpunkPrompts = [
  "Cyberpunk street scene with neon advertisements and rain-slicked streets",
  "Cybernetic human with glowing implants in a high-tech laboratory",
  "Cyberpunk hacker den with multiple holographic screens and cables",
  "Corporate cyberpunk dystopia with megastructures and flying vehicles",
  "Cyberpunk bar scene with robotic bartender and diverse patrons",
  "Cybernetic surgery in progress with advanced medical technology",
  "Cyberpunk street fashion with neon accessories and tech modifications",
  "Underground resistance hideout in a cyberpunk world",
  "Cyberpunk marketplace with black market tech and holographic displays",
  "Cybernetic sports competition in a neon-lit arena",
  "Cyberpunk detective in rain-soaked alley with holographic clues",
  "Data courier with neural implants in a cyberpunk metropolis"
];

// Sci-fi prompts
const scifiPrompts = [
  "Massive generation ship traveling through deep space, sci-fi concept art",
  "Terraforming in progress on Mars with huge machinery and domes",
  "Alien megastructure discovery by human explorers, sense of scale",
  "Space elevator connecting Earth to orbital station, sci-fi engineering",
  "Futuristic research facility studying exotic matter, sci-fi interior",
  "First contact scene with peaceful alien civilization, sci-fi moment",
  "Quantum computer core in advanced research facility, sci-fi technology",
  "Space battle between advanced civilizations, sci-fi action scene",
  "Abandoned alien technology being studied by future archaeologists",
  "Dyson sphere construction around a distant star, sci-fi megastructure",
  "Interstellar jump gate with ships preparing for faster-than-light travel",
  "Moon base with Earth visible in the background, realistic sci-fi"
];

// Animal prompts
const animalPrompts = [
  "Majestic lion with cosmic mane in surreal savanna landscape",
  "Mystical fox with multiple tails and glowing markings in enchanted forest",
  "Ocean guardian - giant turtle with ecosystem living on its shell",
  "Spectral wolf with ethereal energy and forest spirits, fantasy creature",
  "Ancient dragon turtle emerging from the ocean with island on its back",
  "Mythical phoenix in mid-transformation with spectacular fire effects",
  "Spirit bear with constellation patterns in fur and cosmic energy",
  "Guardian owl with magical symbols and glowing eyes in ancient tree",
  "Underwater dragon serpent with bioluminescent patterns in deep ocean",
  "Celestial stag with galaxy antlers in an enchanted twilight forest",
  "Armored war elephant with fantasy decorations in battle scene",
  "Crystal fox with gemstone features in snowy magical landscape"
];

// Define usernames for generated images
const usernames = [
  "artmaster",
  "dreamweaver",
  "pixelwizard",
  "creativesoul",
  "imagineer",
  "visioncraft",
  "digitalbrush",
  "artforge",
  "ai_creator",
  "midjourney_pro",
  "prompt_master",
  "dalle_artist"
];

// Map category names to their image and prompt arrays
const categoryMap: Record<string, { images: string[], prompts: string[] }> = {
  "fantasy": { images: fantasyImages, prompts: fantasyPrompts },
  "portraits": { images: portraitImages, prompts: portraitPrompts },
  "anime": { images: animeImages, prompts: animePrompts },
  "landscapes": { images: landscapeImages, prompts: landscapePrompts },
  "abstract": { images: abstractImages, prompts: abstractPrompts },
  "cyberpunk": { images: cyberpunkImages, prompts: cyberpunkPrompts },
  "scifi": { images: scifiImages, prompts: scifiPrompts },
  "animals": { images: animalImages, prompts: animalPrompts },
};

/**
 * Generate sample image data for a specific category
 * @param category Category name to generate images for
 * @param count Number of images to generate (default 10)
 * @param models List of available models
 * @param styles List of available styles
 * @returns Array of Image objects
 */
export function generateSampleImages(
  category: "fantasy" | "portraits" | "anime" | "landscapes" | "abstract" | "cyberpunk" | "scifi" | "animals" | "trending" | "newest" | "mostLiked",
  count: number = 10,
  models: Model[],
  styles: Style[]
): Image[] {
  let imageUrls: string[] = [];
  let prompts: string[] = [];
  
  // Select the appropriate image set based on category
  if (category === "trending" || category === "newest" || category === "mostLiked") {
    // For these categories, combine images from all categories
    const allCategories = Object.keys(categoryMap) as Array<keyof typeof categoryMap>;
    const selectedCategories = allCategories.sort(() => 0.5 - Math.random()).slice(0, 4); // Randomly select 4 categories
    
    // Take 3 images from each of the selected categories
    selectedCategories.forEach(cat => {
      const catData = categoryMap[cat];
      if (catData) {
        const randomIndices: number[] = [];
        // Get 3 unique random indices
        while (randomIndices.length < 3) {
          const randIndex = Math.floor(Math.random() * catData.images.length);
          if (!randomIndices.includes(randIndex)) {
            randomIndices.push(randIndex);
          }
        }
        
        // Add the random images and prompts
        randomIndices.forEach(idx => {
          imageUrls.push(catData.images[idx]);
          prompts.push(catData.prompts[idx]);
        });
      }
    });
  } else {
    const catData = categoryMap[category];
    if (catData) {
      imageUrls = catData.images;
      prompts = catData.prompts;
    }
  }
  
  // If no images were found, return empty array
  if (imageUrls.length === 0) {
    return [];
  }
  
  // Generate the requested number of images
  return Array.from({ length: Math.min(count, Math.max(12, imageUrls.length)) }, (_, i) => {
    // Use modulo to cycle through the available images if count > imageUrls.length
    const index = i % imageUrls.length;
    
    // Make a more realistic image object
    return {
      id: 10000 + i, // Use high IDs to avoid conflicts with real user images
      imageUrl: imageUrls[index],
      prompt: prompts[index] || `${category} image prompt`,
      userId: Math.floor(Math.random() * 5) + 1,
      username: usernames[Math.floor(Math.random() * usernames.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000), // Random date within last 30 days
      isPublic: true,
      likes: Math.floor(Math.random() * 200) + 10, // More realistic like counts
      modelId: models[Math.floor(Math.random() * models.length)].id,
      styleId: styles[Math.floor(Math.random() * styles.length)].id
    } as Image;
  });
}