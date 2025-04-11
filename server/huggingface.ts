import { storage } from "./storage";
import { GenerateImageInput } from "@shared/schema";

const HF_API_URL = "https://api-inference.huggingface.co/models";
const HF_API_KEY = process.env.HUGGING_FACE_API_KEY || "";

// Interface for image generation results
interface GenerationResult {
  imageUrl: string;
  error?: string;
}

export async function generateGhibliImage(
  userId: number,
  imageData: string
): Promise<{ imageUrl: string; error?: string }> {
  try {
    const { Client } = await import("@gradio/client");

    // Convert base64 to blob
    const base64Data = imageData.split(',')[1];
    const binaryData = atob(base64Data);
    const array = new Uint8Array(binaryData.length);
    for (let i = 0; i < binaryData.length; i++) {
      array[i] = binaryData.charCodeAt(i);
    }
    const blob = new Blob([array], { type: 'image/png' });

    const client = await Client.connect("jamesliu1217/EasyControl_Ghibli");
    const result = await client.predict("/single_condition_generate_image", {
      prompt: "Ghibli Studio style, Charming hand-drawn anime-style illustration",
      spatial_img: blob,
      height: 512,
      width: 512,
      seed: Math.floor(Math.random() * 1000),
      control_type: "Ghibli",
      use_zero_init: true,
      zero_steps: 3,
    });

    if (!result.data || !result.data[0]) {
      throw new Error("No image generated");
    }

    // The result.data[0] is already a base64 string from Gradio
    return { imageUrl: `data:image/jpeg;base64,${result.data[0]}` };
  } catch (error) {
    console.error("Ghibli image generation error:", error);
    const errorMessage = error instanceof Error ? error.message : 
      (error as any)?.message === 'You have exceeded your GPU quota (60s requested vs. 0s left).' 
        ? "GPU quota exceeded. Please try again in a minute." 
        : "Failed to generate image. Please try again.";

    return {
      imageUrl: "",
      error: errorMessage
    };
  }
}

export async function generateImage(
  userId: number,
  input: GenerateImageInput
): Promise<{ imageUrl: string; error?: string }> {
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
    const errorMessage = error instanceof Error ? error.message : 
      (error as any)?.message === 'You have exceeded your GPU quota (60s requested vs. 0s left).' 
        ? "GPU quota exceeded. Please try again in a minute." 
        : "Failed to generate image. Please try again.";

    return {
      imageUrl: "",
      error: errorMessage
    };
  }
}