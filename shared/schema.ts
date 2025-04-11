import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  credits: integer("credits").notNull().default(5),
  profileImage: text("profile_image"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const styles = pgTable("styles", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description"),
});

export const models = pgTable("models", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  displayName: text("display_name").notNull(),
  description: text("description"),
  creditCost: integer("credit_cost").notNull(),
  modelId: text("model_id").notNull(),
  tier: text("tier").notNull(),
  isPremium: boolean("is_premium").default(false), // Added isPremium column
});

export const images = pgTable("images", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  prompt: text("prompt").notNull(),
  styleId: integer("style_id").references(() => styles.id),
  modelId: integer("model_id").references(() => models.id),
  imageUrl: text("image_url").notNull(),
  isPublic: boolean("is_public").default(false).notNull(),
  likes: integer("likes").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const creditPurchases = pgTable("credit_purchases", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  amount: integer("amount").notNull(),
  credits: integer("credits").notNull(),
  paypalOrderId: text("paypal_order_id").notNull(),
  status: text("status").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Insert Schemas
export const insertUserSchema = createInsertSchema(users)
  .pick({
    username: true,
    email: true,
    password: true,
  });

export const insertImageSchema = createInsertSchema(images)
  .pick({
    prompt: true,
    styleId: true,
    modelId: true,
    isPublic: true,
  })
  .extend({
    styleId: z.number().optional(),
  });

export const insertCreditPurchaseSchema = createInsertSchema(creditPurchases)
  .pick({
    amount: true,
    credits: true,
    paypalOrderId: true,
  });

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Style = typeof styles.$inferSelect;
export type Model = typeof models.$inferSelect;
export type Image = typeof images.$inferSelect;
export type InsertImage = z.infer<typeof insertImageSchema>;
export type CreditPurchase = typeof creditPurchases.$inferSelect;
export type InsertCreditPurchase = z.infer<typeof insertCreditPurchaseSchema>;

// Frontend Schema for Image Generation
export const generateImageSchema = z.object({
  prompt: z.string().min(1, "Prompt is required"),
  modelId: z.number(),
  styleId: z.number().optional(),
  isPublic: z.boolean().default(false),
});

export type GenerateImageInput = z.infer<typeof generateImageSchema>;

// User auth schemas
export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Credit packages
export const CREDIT_PACKAGES = [
  { id: 1, name: "Starter Pack", credits: 20, price: 4.99, description: "Perfect for beginners" },
  { id: 2, name: "Premium Pack", credits: 50, price: 9.99, description: "Most value for money", popular: true },
  { id: 3, name: "Pro Pack", credits: 150, price: 24.99, description: "For serious creators" },
];

export const MODELS = [
  {
    id: 3,
    name: "sana-sprint",
    displayName: "SanaSprint (Premium)",
    description: "High-quality image generation with fast inference",
    creditCost: 10,
    modelId: "Efficient-Large-Model/SanaSprint", // Added model ID
    tier: "premium", // Added tier information
    isPremium: true,
  },
];