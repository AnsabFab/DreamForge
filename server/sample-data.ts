import { Image, Style, Model } from "@shared/schema";

// Sample image URLs for different categories
const fantasyImages = [
  "https://replicate.delivery/pbxt/VZJp67d9eE9r3QXTHw8gpaJvF4QTGf06a8iIwwz9CWHL8QdFC/out-0.png",
  "https://replicate.delivery/pbxt/X8VTpANXQUw9FWVEJh6f4oCXUwdWG8WUXLmQlZY3Tj7Z5prCB/out-0.png",
  "https://replicate.delivery/pbxt/aeXkZoQ2XkNbDMFsQMOKoEAuDm9u4YvGx1jhTLZ4U1vxqgiPB/out-0.png",
  "https://replicate.delivery/pbxt/3JDxzdYfDvHY4kODdl1KnvG2fXtJG1BrOxrtV77wLZ39BprCB/out-0.png",
  "https://replicate.delivery/pbxt/QiE1ZkCBCFmjqDCRb3hbBIavtqoYMJQkvKiHrESO7jVz2giPB/out-0.png",
  "https://replicate.delivery/pbxt/8QKVX3bP4YrXLhYnUwG8nQsR7uXsA5NrqhU8hhNGgzm7FprCB/out-0.png"
];

const portraitImages = [
  "https://replicate.delivery/pbxt/INfGseszbL9GZGdBK6dtRdqyjnRE7wQBnwURY71kTLDVnprCB/out-0.png",
  "https://replicate.delivery/pbxt/FY0EeoBUJfkUdqDV4Oe2q6YIQf7Qr0c1Wj6B1ZgVFQPl9prCB/out-0.png",
  "https://replicate.delivery/pbxt/w5qBdlQvZimXLSPi6wy7xXMQK1CZXAYj3MptLTMwgM50nwiPB/out-0.png",
  "https://replicate.delivery/pbxt/AwNXEqNlfLiO9EPVS9GEj5vCOMhKEgfvU6Hcg8ykEARmk5hAA/out-0.png",
  "https://replicate.delivery/pbxt/FY0EeoBUJfkUdqDV4Oe2q6YIQf7Qr0c1Wj6B1ZgVFQPl9prCB/out-0.png"
];

const animeImages = [
  "https://replicate.delivery/pbxt/Z4LGmvuaIpkYHR4iCJkJy1cAUbeiNqXtc7SdeKOQJSURaWE/out-0.png",
  "https://replicate.delivery/pbxt/uqfhcPJVGLMkKr4gq1yjYCGfvmL3oXzs8TIB7DZeSdgPXWE/out-0.png",
  "https://replicate.delivery/pbxt/2QiOTkxPEXa90G1CQjCdUm9w17NsU8rD9XBmAC6fPtdgpWE/out-0.png",
  "https://replicate.delivery/pbxt/7bqPsGcHF0QWzYzDxJJqL9CHCRuH7nqz3VZY7y1X8lUz6WE/out-0.png",
  "https://replicate.delivery/pbxt/A6hB3zPIi9xbRIvCuHjy3WOYH7Z1BcgaKcwi3ZcIDRpbXWE/out-0.png"
];

const landscapeImages = [
  "https://replicate.delivery/pbxt/CgbUw1XnExToZPVx5HaWYAhYdFULhgR0qACVNvt6SiO55giPB/out-0.png",
  "https://replicate.delivery/pbxt/d9BZx7J7zL22OVqLRYzYFbYEu3D6xpEQM85rFi2dcimQFx4iA/out-0.png",
  "https://replicate.delivery/pbxt/uC6QcINFQPk9fXRlI2dkKKuxAqhZ19TmzPZ4lLnWX61wKx4iA/out-0.png",
  "https://replicate.delivery/pbxt/oMhw9tBPdQQotsyJhkj9qM8umHEA3YLMoBbE8Rnvp8ztox4iA/out-0.png"
];

const abstractImages = [
  "https://replicate.delivery/pbxt/3cXJPPyLOqWNIvI9TPljnVxGFBEoTsZXTaS9WYTpfYEsQx4iA/out-0.png",
  "https://replicate.delivery/pbxt/Z9E4Qcqx7reFI7dCdFXoOGMufnqPh5QZmRZDdDVLJ7vu6s4TB/out-0.png",
  "https://replicate.delivery/pbxt/Y0n0QGmUYGnIX4DUsBczGjfXibOr3DURqUiPbDGC9y85xs4TB/out-0.png",
  "https://replicate.delivery/pbxt/XG9dNZKHPpgLiItHLk21J3HMOJcpEuBGO28ylmEEDmeSfprCB/out-0.png"
];

// Fantasy prompts
const fantasyPrompts = [
  "A mystical forest with glowing mushrooms and floating lanterns, fantasy art",
  "A dragon perched on a mountain overlooking a medieval kingdom, epic fantasy scene",
  "An ancient wizard's tower with magical energy swirling around it, fantasy illustration",
  "A knight facing a giant crystal golem in an enchanted cave, fantasy battle",
  "A fairy garden with tiny creatures and magical flowers under moonlight, whimsical fantasy",
  "An elven city built into massive trees with hanging bridges and magical lights"
];

// Portrait prompts
const portraitPrompts = [
  "A striking portrait of a woman with fire in her eyes, dramatic lighting",
  "A thoughtful portrait of an old sailor with weathered face, telling stories of the sea",
  "A detailed portrait of a warrior woman with tribal markings, strong and determined",
  "A mysterious portrait of a person half in shadow with glowing eyes, atmospheric",
  "An elegant portrait of a royal figure with ornate clothing and jewelry, regal pose"
];

// Anime prompts
const animePrompts = [
  "A magical girl anime character with pink hair casting a spell, cute anime style",
  "A detailed anime samurai with glowing sword in a cherry blossom field, action pose",
  "A cyberpunk anime character with neon highlights and futuristic city background",
  "A cute anime witch with her black cat familiar brewing potions, kawaii style",
  "An anime hero with elemental powers facing a powerful villain, epic anime battle scene"
];

// Landscape prompts
const landscapePrompts = [
  "A breathtaking mountain vista with waterfalls and morning mist, panoramic landscape",
  "A tranquil bamboo forest with sunlight filtering through, serene landscape",
  "An alien landscape with strange rock formations and multiple moons in the sky",
  "A dramatic coastline with crashing waves against cliffs during sunset, ocean landscape"
];

// Abstract prompts
const abstractPrompts = [
  "Abstract flow of colors resembling cosmic nebulas and galactic clouds",
  "Geometric patterns and shapes forming an intricate futuristic design",
  "Fluid abstract art with vibrant colors and dynamic movement",
  "Surreal abstract landscape with impossible architecture and distorted perspective"
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
  "artforge"
];

// Generate sample image data for a specific category
export function generateSampleImages(
  category: "fantasy" | "portraits" | "anime" | "landscapes" | "abstract" | "trending" | "newest" | "mostLiked",
  count: number = 8,
  models: Model[],
  styles: Style[]
): Image[] {
  let imageUrls: string[] = [];
  let prompts: string[] = [];
  
  // Select the appropriate image set based on category
  switch(category) {
    case "fantasy":
      imageUrls = fantasyImages;
      prompts = fantasyPrompts;
      break;
    case "portraits":
      imageUrls = portraitImages;
      prompts = portraitPrompts;
      break;
    case "anime":
      imageUrls = animeImages;
      prompts = animePrompts;
      break;
    case "landscapes":
      imageUrls = landscapeImages;
      prompts = landscapePrompts;
      break;
    case "abstract":
      imageUrls = abstractImages;
      prompts = abstractPrompts;
      break;
    case "trending":
    case "newest":
    case "mostLiked":
      // For these categories, mix all images
      imageUrls = [
        ...fantasyImages.slice(0, 2),
        ...portraitImages.slice(0, 2),
        ...animeImages.slice(0, 2),
        ...landscapeImages.slice(0, 1),
        ...abstractImages.slice(0, 1)
      ];
      prompts = [
        ...fantasyPrompts.slice(0, 2),
        ...portraitPrompts.slice(0, 2),
        ...animePrompts.slice(0, 2),
        ...landscapePrompts.slice(0, 1),
        ...abstractPrompts.slice(0, 1)
      ];
      break;
  }
  
  // Generate the requested number of images
  return Array.from({ length: Math.min(count, imageUrls.length) }, (_, i) => {
    // Use modulo to cycle through the available images if count > imageUrls.length
    const index = i % imageUrls.length;
    
    // Make a more realistic image object
    return {
      id: i + 1,
      imageUrl: imageUrls[index],
      prompt: prompts[index] || `${category} image prompt`,
      userId: Math.floor(Math.random() * 5) + 1,
      username: usernames[Math.floor(Math.random() * usernames.length)],
      createdAt: new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000), // Random date within last 30 days
      isPublic: true,
      likes: Math.floor(Math.random() * 100),
      modelId: models[Math.floor(Math.random() * models.length)].id,
      styleId: styles[Math.floor(Math.random() * styles.length)].id
    } as Image;
  });
}