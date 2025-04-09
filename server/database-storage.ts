import { 
  users, 
  User, 
  InsertUser, 
  images, 
  Image, 
  models, 
  Model,
  styles,
  Style,
  creditPurchases,
  CreditPurchase,
  InsertCreditPurchase
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import { IStorage } from "./storage";

const PostgresSessionStore = connectPg(session);

// Database implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.Store;

  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool,
      createTableIfMissing: true
    });

    // Initialize default models and styles
    this.initializeDefaults();
  }

  private async initializeDefaults() {
    // Check if models exist, if not, add default models
    const existingModels = await this.getModels();
    if (existingModels.length === 0) {
      await this.initDefaultModels();
    }

    // Check if styles exist, if not, add default styles
    const existingStyles = await this.getStyles();
    if (existingStyles.length === 0) {
      await this.initDefaultStyles();
    }
  }

  private async initDefaultModels() {
    const defaultModels = [
      { 
        name: "stable-diffusion-v1-5", 
        displayName: "SD v1.5", 
        description: "Basic", 
        creditCost: 1,
        modelId: "runwayml/stable-diffusion-v1-5",
        tier: "Basic"
      },
      { 
        name: "sdxl", 
        displayName: "SDXL", 
        description: "Standard", 
        creditCost: 2,
        modelId: "stabilityai/stable-diffusion-xl-base-1.0",
        tier: "Standard"
      },
      { 
        name: "anything-v5", 
        displayName: "Anything V5", 
        description: "Premium", 
        creditCost: 4,
        modelId: "stablediffusionapi/anything-v5",
        tier: "Premium"
      }
    ];
    
    for (const model of defaultModels) {
      await db.insert(models).values(model);
    }
  }
  
  private async initDefaultStyles() {
    const defaultStyles = [
      { name: "Realistic", description: "Photo-realistic style" },
      { name: "Anime", description: "Japanese animation style" },
      { name: "Fantasy", description: "Magical and fantastical elements" },
      { name: "Cyberpunk", description: "Futuristic high-tech low-life" },
      { name: "Portrait", description: "Focused on subjects' faces" },
      { name: "Watercolor", description: "Soft watercolor painting look" },
      { name: "3D Render", description: "Computer-generated 3D imagery" }
    ];
    
    for (const style of defaultStyles) {
      await db.insert(styles).values(style);
    }
  }
  
  async getUser(id: number): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.email, email));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const result = await db.insert(users).values(userData).returning();
    return result[0];
  }
  
  async updateUserCredits(userId: number, credits: number): Promise<User | undefined> {
    const result = await db
      .update(users)
      .set({ credits })
      .where(eq(users.id, userId))
      .returning();
    
    return result.length > 0 ? result[0] : undefined;
  }
  
  async createImage(
    userId: number, 
    imageUrl: string, 
    prompt: string, 
    styleId?: number, 
    modelId?: number, 
    isPublic: boolean = false
  ): Promise<Image> {
    const result = await db
      .insert(images)
      .values({
        userId,
        imageUrl,
        prompt,
        styleId: styleId || null,
        modelId: modelId || null,
        isPublic
      })
      .returning();
    
    return result[0];
  }
  
  async getUserImages(userId: number): Promise<Image[]> {
    return await db
      .select()
      .from(images)
      .where(eq(images.userId, userId))
      .orderBy(desc(images.createdAt));
  }
  
  async getPublicImages(limit: number = 20, offset: number = 0): Promise<Image[]> {
    return await db
      .select()
      .from(images)
      .where(eq(images.isPublic, true))
      .orderBy(desc(images.createdAt))
      .limit(limit)
      .offset(offset);
  }
  
  async getRecentUserImages(userId: number, limit: number = 2): Promise<Image[]> {
    return await db
      .select()
      .from(images)
      .where(eq(images.userId, userId))
      .orderBy(desc(images.createdAt))
      .limit(limit);
  }
  
  async getLikedImages(userId: number): Promise<Image[]> {
    // In a real implementation, you'd check a likes table
    // For this example, we'll just return an empty array
    return [];
  }
  
  async getModels(): Promise<Model[]> {
    return await db.select().from(models);
  }
  
  async getModelById(id: number): Promise<Model | undefined> {
    const result = await db.select().from(models).where(eq(models.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async getStyles(): Promise<Style[]> {
    return await db.select().from(styles);
  }
  
  async getStyleById(id: number): Promise<Style | undefined> {
    const result = await db.select().from(styles).where(eq(styles.id, id));
    return result.length > 0 ? result[0] : undefined;
  }
  
  async createCreditPurchase(userId: number, purchase: InsertCreditPurchase): Promise<CreditPurchase> {
    // First create the purchase record
    const result = await db
      .insert(creditPurchases)
      .values({
        userId,
        ...purchase,
        status: "completed"
      })
      .returning();
    
    const creditPurchase = result[0];
    
    // Update user credits
    const user = await this.getUser(userId);
    if (user) {
      const newCredits = user.credits + purchase.credits;
      await this.updateUserCredits(userId, newCredits);
    }
    
    return creditPurchase;
  }
  
  async getUserPurchases(userId: number): Promise<CreditPurchase[]> {
    return await db
      .select()
      .from(creditPurchases)
      .where(eq(creditPurchases.userId, userId))
      .orderBy(desc(creditPurchases.createdAt));
  }
}