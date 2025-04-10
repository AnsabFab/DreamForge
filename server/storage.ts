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
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// Interface for all storage operations
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(userId: number, credits: number): Promise<User | undefined>;
  
  // Image operations
  createImage(userId: number, imageUrl: string, prompt: string, styleId?: number, modelId?: number, isPublic?: boolean): Promise<Image>;
  getUserImages(userId: number): Promise<Image[]>;
  getPublicImages(limit?: number, offset?: number): Promise<Image[]>;
  getRecentUserImages(userId: number, limit?: number): Promise<Image[]>;
  getLikedImages(userId: number): Promise<Image[]>;
  
  // Model operations
  getModels(): Promise<Model[]>;
  getModelById(id: number): Promise<Model | undefined>;
  
  // Style operations
  getStyles(): Promise<Style[]>;
  getStyleById(id: number): Promise<Style | undefined>;
  
  // Credit purchase operations
  createCreditPurchase(userId: number, purchase: InsertCreditPurchase): Promise<CreditPurchase>;
  getUserPurchases(userId: number): Promise<CreditPurchase[]>;
  
  // Session store
  sessionStore: session.Store;
}

// In-memory implementation
export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private imagesMap: Map<number, Image>;
  private modelsMap: Map<number, Model>;
  private stylesMap: Map<number, Style>;
  private purchasesMap: Map<number, CreditPurchase>;
  sessionStore: session.Store;
  
  private userIdCounter: number;
  private imageIdCounter: number;
  private purchaseIdCounter: number;
  
  constructor() {
    this.usersMap = new Map();
    this.imagesMap = new Map();
    this.modelsMap = new Map();
    this.stylesMap = new Map();
    this.purchasesMap = new Map();
    
    this.userIdCounter = 1;
    this.imageIdCounter = 1;
    this.purchaseIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // 24 hours
    });
    
    // Initialize default models
    this.initDefaultModels();
    this.initDefaultStyles();
  }
  
  private initDefaultModels() {
    const defaultModels: Model[] = [
      { 
        id: 1, 
        name: "stable-diffusion-v1-5", 
        displayName: "SD v1.5", 
        description: "Basic", 
        creditCost: 1,
        modelId: "runwayml/stable-diffusion-v1-5",
        tier: "Basic"
      },
      { 
        id: 2, 
        name: "sdxl", 
        displayName: "SDXL", 
        description: "Standard", 
        creditCost: 2,
        modelId: "stabilityai/stable-diffusion-xl-base-1.0",
        tier: "Standard"
      },
      { 
        id: 3, 
        name: "anything-v5", 
        displayName: "Anything V5", 
        description: "Premium", 
        creditCost: 4,
        modelId: "stablediffusionapi/anything-v5",
        tier: "Premium"
      }
    ];
    
    defaultModels.forEach(model => this.modelsMap.set(model.id, model));
  }
  
  private initDefaultStyles() {
    const defaultStyles: Style[] = [
      { id: 1, name: "Realistic", description: "Photo-realistic style" },
      { id: 2, name: "Anime", description: "Japanese animation style" },
      { id: 3, name: "Fantasy", description: "Magical and fantastical elements" },
      { id: 4, name: "Cyberpunk", description: "Futuristic high-tech low-life" },
      { id: 5, name: "Portrait", description: "Focused on subjects' faces" },
      { id: 6, name: "Watercolor", description: "Soft watercolor painting look" },
      { id: 7, name: "3D Render", description: "Computer-generated 3D imagery" }
    ];
    
    defaultStyles.forEach(style => this.stylesMap.set(style.id, style));
  }
  
  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(user => user.email === email);
  }
  
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(user => user.username === username);
  }
  
  async createUser(userData: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = {
      id,
      ...userData,
      credits: 100, // New users get 100 free credits
      profileImage: null,
      createdAt: now
    };
    
    this.usersMap.set(id, user);
    return user;
  }
  
  async updateUserCredits(userId: number, credits: number): Promise<User | undefined> {
    const user = await this.getUser(userId);
    if (!user) return undefined;
    
    const updatedUser = { ...user, credits };
    this.usersMap.set(userId, updatedUser);
    return updatedUser;
  }
  
  // Image operations
  async createImage(
    userId: number, 
    imageUrl: string, 
    prompt: string, 
    styleId?: number, 
    modelId?: number, 
    isPublic: boolean = false
  ): Promise<Image> {
    const id = this.imageIdCounter++;
    const now = new Date();
    
    const image: Image = {
      id,
      userId,
      prompt,
      styleId: styleId || null,
      modelId: modelId || null,
      imageUrl,
      isPublic,
      likes: 0,
      createdAt: now
    };
    
    this.imagesMap.set(id, image);
    return image;
  }
  
  async getUserImages(userId: number): Promise<Image[]> {
    return Array.from(this.imagesMap.values())
      .filter(image => image.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
  
  async getPublicImages(limit: number = 20, offset: number = 0): Promise<Image[]> {
    return Array.from(this.imagesMap.values())
      .filter(image => image.isPublic)
      .sort((a, b) => b.likes - a.likes || b.createdAt.getTime() - a.createdAt.getTime())
      .slice(offset, offset + limit);
  }
  
  async getRecentUserImages(userId: number, limit: number = 2): Promise<Image[]> {
    return Array.from(this.imagesMap.values())
      .filter(image => image.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }
  
  async getLikedImages(userId: number): Promise<Image[]> {
    // In a real implementation, this would get images the user has liked
    // For now, return empty array
    return [];
  }
  
  // Model operations
  async getModels(): Promise<Model[]> {
    return Array.from(this.modelsMap.values());
  }
  
  async getModelById(id: number): Promise<Model | undefined> {
    return this.modelsMap.get(id);
  }
  
  // Style operations
  async getStyles(): Promise<Style[]> {
    return Array.from(this.stylesMap.values());
  }
  
  async getStyleById(id: number): Promise<Style | undefined> {
    return this.stylesMap.get(id);
  }
  
  // Credit purchase operations
  async createCreditPurchase(userId: number, purchase: InsertCreditPurchase): Promise<CreditPurchase> {
    const id = this.purchaseIdCounter++;
    const now = new Date();
    
    const creditPurchase: CreditPurchase = {
      id,
      userId,
      ...purchase,
      status: "completed",
      createdAt: now
    };
    
    this.purchasesMap.set(id, creditPurchase);
    
    // Update user's credits
    const user = await this.getUser(userId);
    if (user) {
      await this.updateUserCredits(userId, user.credits + purchase.credits);
    }
    
    return creditPurchase;
  }
  
  async getUserPurchases(userId: number): Promise<CreditPurchase[]> {
    return Array.from(this.purchasesMap.values())
      .filter(purchase => purchase.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

// Import our database implementation
import { DatabaseStorage } from "./database-storage";

// Use database storage instead of in-memory storage
export const storage = new DatabaseStorage();
