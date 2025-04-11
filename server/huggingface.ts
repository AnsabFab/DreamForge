import { storage } from "./storage";
import { GenerateImageInput } from "@shared/schema";

const HF_API_URL = "https://api-inference.huggingface.co/models";
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY || "";

// Interface for image generation results
interface GenerationResult {
  imageUrl: string;
  error?: string;
}

export async function generateImage(
  userId: number,
  input: GenerateImageInput
): Promise<GenerationResult> {
  try {
    // Get the model information
    const model = await storage.getModelById(input.modelId);
    if (!model) {
      throw new Error("Invalid model selected");
    }

    // Check if user has enough credits
    const user = await storage.getUser(userId);
    if (!user) {
      throw new Error("User not found");
    }

    if (user.credits < model.creditCost) {
      throw new Error(`Not enough credits. This model requires ${model.creditCost} credits.`);
    }

    // Enhance prompt with style if provided
    let enhancedPrompt = input.prompt;
    if (input.styleId) {
      const style = await storage.getStyleById(input.styleId);
      if (style) {
        enhancedPrompt = `${input.prompt}, ${style.name.toLowerCase()} style`;
      }
    }

    // Call Hugging Face API
    const response = await fetch(`${HF_API_URL}/${model.modelId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${HF_API_KEY}`,
      },
      body: JSON.stringify({
        inputs: model.name === "ghibli" ? {
          prompt: enhancedPrompt,
          negative_prompt: "blurry, bad quality, distorted, deformed",
          style_strength: 0.8,
          steps: 30
        } : {
          inputs: enhancedPrompt,
          parameters: {
            negative_prompt: "blurry, bad quality, distorted, deformed",
          }
        }
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(
        `Hugging Face API error: ${response.status} ${
          errorData?.error || response.statusText
        }`
      );
    }

    // The API returns the image directly as binary data
    const blob = await response.blob();
    
    // In a real-world application, you would upload this to a storage service
    // For this example, we'll create a data URL (not ideal for production)
    const buffer = await blob.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:image/jpeg;base64,${base64}`;

    // Deduct credits from user
    await storage.updateUserCredits(userId, user.credits - model.creditCost);

    // Save the image to the database
    await storage.createImage(
      userId,
      dataUrl,
      input.prompt,
      input.styleId,
      input.modelId,
      input.isPublic
    );

    return { imageUrl: dataUrl };
  } catch (error) {
    console.error("Image generation error:", error);
    return {
      imageUrl: "",
      error: error instanceof Error ? error.message : "Unknown error occurred",
    };
  }
}
