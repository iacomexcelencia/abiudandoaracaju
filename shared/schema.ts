import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, jsonb, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

// Admin users for system authentication
export const adminUsers = pgTable("admin_users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  lastLogin: text("last_login"),
});

export const touristSpots = pgTable("tourist_spots", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Conteúdo em Português
  name_pt: text("name_pt").notNull(),
  description_pt: text("description_pt").notNull(),
  description_pt_2: text("description_pt_2").default(""),
  description_pt_3: text("description_pt_3").default(""),
  // Conteúdo em Inglês
  name_en: text("name_en").notNull(),
  description_en: text("description_en").notNull(),
  description_en_2: text("description_en_2").default(""),
  description_en_3: text("description_en_3").default(""),
  // Conteúdo em Espanhol
  name_es: text("name_es").notNull(),
  description_es: text("description_es").notNull(),
  description_es_2: text("description_es_2").default(""),
  description_es_3: text("description_es_3").default(""),
  
  category: text("category").notNull(), // "praia", "historico", "cultura", "restaurante"
  latitude: decimal("latitude", { precision: 10, scale: 8 }).notNull(),
  longitude: decimal("longitude", { precision: 11, scale: 8 }).notNull(),
  address: text("address"),
  images: text("images").array().default([]),
  // Sistema avançado de imagens com metadata
  imageGallery: jsonb("image_gallery").default([]), // Array de objetos com url, type, order, caption, etc.
  coverImage: text("cover_image"), // URL da imagem de capa principal
  videoUrl: text("video_url"), // URL do vídeo hospedado no Cloudflare
  qrCode: text("qr_code"),
  googleMapsLink: text("google_maps_link"),
  isActive: boolean("is_active").default(true),
  // Informações operacionais
  openingHours: text("opening_hours").default(""), // Formato: "Segunda a Sexta: 8h-17h" ou "24 horas"
  is24Hours: boolean("is_24_hours").default(false),
  isFree: boolean("is_free").default(true),
  entryFee: text("entry_fee").default(""), // Valor da entrada se não for gratuito
  features: jsonb("features").default({}), // Additional features like opening hours, contact info, etc.
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at").default(sql`CURRENT_TIMESTAMP`),
});

// Schema para validação de imagens
export const imageSchema = z.object({
  id: z.string(),
  url: z.string().refine((url) => {
    // Permitir URLs completas, URLs locais que começam com /uploads/ ou /objects/ (Object Storage)
    return z.string().url().safeParse(url).success || url.startsWith('/uploads/') || url.startsWith('/objects/');
  }, "URL deve ser válida ou um caminho local/storage"),
  type: z.enum(['cover', 'gallery', 'inline']),
  order: z.number().min(0),
  caption_pt: z.string().optional(),
  caption_en: z.string().optional(),
  caption_es: z.string().optional(),
  altText_pt: z.string().optional(),
  altText_en: z.string().optional(),
  altText_es: z.string().optional(),
  inlinePosition: z.number().optional(), // Para fotos que aparecem entre textos
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertTouristSpotSchema = createInsertSchema(touristSpots).omit({
  id: true,
}).extend({
  imageGallery: z.array(imageSchema).optional(),
});

// Schema para upload de imagens
export const imageUploadSchema = z.object({
  file: z.any(),
  type: z.enum(['cover', 'gallery', 'inline']),
  caption_pt: z.string().optional(),
  caption_en: z.string().optional(),
  caption_es: z.string().optional(),
  altText_pt: z.string().optional(),
  altText_en: z.string().optional(),
  altText_es: z.string().optional(),
  order: z.number().min(0).optional(),
  inlinePosition: z.number().optional(),
});

// Schema para atualização de imagem
export const updateImageSchema = z.object({
  id: z.string(),
  caption_pt: z.string().optional(),
  caption_en: z.string().optional(),
  caption_es: z.string().optional(),
  altText_pt: z.string().optional(),
  altText_en: z.string().optional(),
  altText_es: z.string().optional(),
  order: z.number().min(0).optional(),
  inlinePosition: z.number().optional(),
});

// Tourist feedback table
export const touristFeedback = pgTable("tourist_feedback", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  spotId: varchar("spot_id").notNull(),
  passportId: varchar("passport_id"), // Link to digital passport
  name: text("name").notNull(),
  birthDate: text("birth_date").notNull(),
  city: text("city").notNull(),
  state: text("state").notNull(),
  country: text("country").notNull(),
  visitReason: text("visit_reason").notNull(),
  cityOpinion: text("city_opinion").notNull(),
  stayDuration: text("stay_duration").notNull(),
  accommodation: text("accommodation").notNull(),
  rating: decimal("rating", { precision: 2, scale: 1 }),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

// Digital Passport - stores tourist identity across visits
export const touristPassports = pgTable("tourist_passports", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  passportCode: text("passport_code").notNull().unique(), // Código único tipo "AJU-7F2K9"
  email: text("email"), // Opcional para recuperação
  totalPoints: decimal("total_points", { precision: 10, scale: 0 }).default("0"),
  totalVisits: decimal("total_visits", { precision: 10, scale: 0 }).default("0"),
  level: text("level").default("Explorador Iniciante"), // Níveis de gamificação
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
  lastVisit: text("last_visit").default(sql`CURRENT_TIMESTAMP`),
});

// Badges/Achievements definitions
export const badges = pgTable("badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name_pt: text("name_pt").notNull(),
  name_en: text("name_en").notNull(),
  name_es: text("name_es").notNull(),
  description_pt: text("description_pt").notNull(),
  description_en: text("description_en").notNull(),
  description_es: text("description_es").notNull(),
  icon: text("icon").notNull(), // URL ou nome do ícone
  category: text("category").notNull(), // "praia", "historico", "cultura", "especial"
  rarity: text("rarity").notNull(), // "bronze", "silver", "gold", "legendary"
  points: decimal("points", { precision: 10, scale: 0 }).notNull(),
  requirement: jsonb("requirement").notNull(), // Condições para desbloquear
  isActive: boolean("is_active").default(true),
});

// Tourist earned badges (many-to-many)
export const touristBadges = pgTable("tourist_badges", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  passportId: varchar("passport_id").notNull(),
  badgeId: varchar("badge_id").notNull(),
  earnedAt: text("earned_at").default(sql`CURRENT_TIMESTAMP`),
});

// Spot visits tracking
export const spotVisits = pgTable("spot_visits", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  passportId: varchar("passport_id").notNull(),
  spotId: varchar("spot_id").notNull(),
  visitedAt: text("visited_at").default(sql`CURRENT_TIMESTAMP`),
  feedbackId: varchar("feedback_id"), // Link ao feedback dado
});

// Tourist routes (saved itineraries)
export const touristRoutes = pgTable("tourist_routes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name_pt: text("name_pt").notNull(),
  name_en: text("name_en").notNull(),
  name_es: text("name_es").notNull(),
  description_pt: text("description_pt").notNull(),
  description_en: text("description_en").notNull(),
  description_es: text("description_es").notNull(),
  duration: text("duration").notNull(), // "2 horas", "meio dia", "dia inteiro"
  difficulty: text("difficulty").notNull(), // "fácil", "moderado", "desafiador"
  spotIds: text("spot_ids").array().notNull(), // Array ordenado de IDs
  categories: text("categories").array().notNull(), // Categorias incluídas
  totalDistance: decimal("total_distance", { precision: 10, scale: 2 }), // Em km
  isActive: boolean("is_active").default(true),
  createdAt: text("created_at").default(sql`CURRENT_TIMESTAMP`),
});

export const insertTouristFeedbackSchema = createInsertSchema(touristFeedback).omit({
  id: true,
  createdAt: true,
});

export const insertTouristPassportSchema = createInsertSchema(touristPassports).omit({
  id: true,
  createdAt: true,
  lastVisit: true,
});

export const insertBadgeSchema = createInsertSchema(badges).omit({
  id: true,
});

export const insertTouristBadgeSchema = createInsertSchema(touristBadges).omit({
  id: true,
  earnedAt: true,
});

export const insertSpotVisitSchema = createInsertSchema(spotVisits).omit({
  id: true,
  visitedAt: true,
});

export const insertTouristRouteSchema = createInsertSchema(touristRoutes).omit({
  id: true,
  createdAt: true,
});

export const insertAdminUserSchema = createInsertSchema(adminUsers).omit({
  id: true,
  createdAt: true,
  lastLogin: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type AdminUser = typeof adminUsers.$inferSelect;
export type InsertAdminUser = z.infer<typeof insertAdminUserSchema>;
export type TouristSpot = typeof touristSpots.$inferSelect;
export type InsertTouristSpot = z.infer<typeof insertTouristSpotSchema>;
export type TouristFeedback = typeof touristFeedback.$inferSelect;
export type InsertTouristFeedback = z.infer<typeof insertTouristFeedbackSchema>;
export type TouristPassport = typeof touristPassports.$inferSelect;
export type InsertTouristPassport = z.infer<typeof insertTouristPassportSchema>;
export type Badge = typeof badges.$inferSelect;
export type InsertBadge = z.infer<typeof insertBadgeSchema>;
export type TouristBadge = typeof touristBadges.$inferSelect;
export type InsertTouristBadge = z.infer<typeof insertTouristBadgeSchema>;
export type SpotVisit = typeof spotVisits.$inferSelect;
export type InsertSpotVisit = z.infer<typeof insertSpotVisitSchema>;
export type TouristRoute = typeof touristRoutes.$inferSelect;
export type InsertTouristRoute = z.infer<typeof insertTouristRouteSchema>;
export type ImageMetadata = z.infer<typeof imageSchema>;
export type ImageUpload = z.infer<typeof imageUploadSchema>;
export type UpdateImage = z.infer<typeof updateImageSchema>;
