import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { generateImage } from "./huggingface";
import { createPayPalOrder, capturePayPalOrder } from "./paypal";
import { generateImageSchema, insertUserSchema, loginSchema } from "@shared/schema";
import { z } from "zod";
import { generateSampleImages } from "./sample-data";

// Middleware to check if user is authenticated
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication routes
  setupAuth(app);

  // Get available models
  app.get("/api/models", async (req, res) => {
    try {
      const models = await storage.getModels();
      res.json(models);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch models" });
    }
  });

  // Get available styles
  app.get("/api/styles", async (req, res) => {
    try {
      const styles = await storage.getStyles();
      res.json(styles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch styles" });
    }
  });

  // Generate image (requires authentication)
  app.post("/api/images/generate", isAuthenticated, async (req, res) => {
    try {
      const validationResult = generateImageSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({ 
          message: "Invalid input", 
          errors: validationResult.error.errors 
        });
      }
      
      const userId = req.user!.id;
      const result = await generateImage(userId, validationResult.data);
      
      if (result.error) {
        return res.status(400).json({ message: result.error });
      }
      
      res.json({ imageUrl: result.imageUrl });
    } catch (error) {
      console.error(error);
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to generate image" 
      });
    }
  });

  // Get user's personal gallery
  app.get("/api/images/personal", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const images = await storage.getUserImages(userId);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch personal gallery" });
    }
  });

  // Get user's recent images
  app.get("/api/images/recent", isAuthenticated, async (req, res) => {
    try {
      const userId = req.user!.id;
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 2;
      const images = await storage.getRecentUserImages(userId, limit);
      res.json(images);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recent images" });
    }
  });

  // Get public gallery images
  app.get("/api/images/public", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
      const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
      const filter = req.query.filter as string || "trending";
      
      // Get models and styles for the sample images
      const models = await storage.getModels();
      const styles = await storage.getStyles();
      
      // Use the appropriate category based on the filter
      let category: "fantasy" | "portraits" | "anime" | "landscapes" | "abstract" | "trending" | "newest" | "mostLiked" = "trending";
      
      if (filter === "fantasy" || filter === "portraits" || filter === "anime" || 
          filter === "newest" || filter === "mostLiked") {
        category = filter as any;
      }
      
      // Generate sample images for the requested category
      const sampleImages = generateSampleImages(category, limit, models, styles);
      
      // Return existing images from storage if available, or sample images if not
      const dbImages = await storage.getPublicImages(limit, offset);
      const images = dbImages.length > 0 ? dbImages : sampleImages;
      
      res.json(images);
    } catch (error) {
      console.error("Error fetching public gallery:", error);
      res.status(500).json({ message: "Failed to fetch public gallery" });
    }
  });

  // Create PayPal order
  app.post("/api/payments/create-order", isAuthenticated, async (req, res) => {
    try {
      const { packageId } = req.body;
      
      if (!packageId) {
        return res.status(400).json({ message: "Package ID is required" });
      }
      
      const userId = req.user!.id;
      const order = await createPayPalOrder(packageId, userId);
      res.json(order);
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to create order" 
      });
    }
  });

  // Capture PayPal order and add credits
  app.post("/api/payments/capture-order", isAuthenticated, async (req, res) => {
    try {
      const { orderId, packageId } = req.body;
      
      if (!orderId || !packageId) {
        return res.status(400).json({ message: "Order ID and Package ID are required" });
      }
      
      // In a real app, we would validate the order with PayPal first
      const captureResponse = await capturePayPalOrder(orderId);
      
      if (captureResponse.status !== "COMPLETED") {
        return res.status(400).json({ message: "Payment not completed" });
      }
      
      // Find the credit package
      const creditPackage = z.number().parse(packageId);
      const userId = req.user!.id;
      
      // Add credits to user account
      const purchase = await storage.createCreditPurchase(userId, {
        amount: 0, // This would be the actual amount in cents
        credits: 0, // This would be the actual credits
        paypalOrderId: orderId,
      });
      
      // Get updated user
      const user = await storage.getUser(userId);
      
      res.json({ 
        message: "Payment successful", 
        user,
        purchase 
      });
    } catch (error) {
      res.status(500).json({ 
        message: error instanceof Error ? error.message : "Failed to capture payment" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
