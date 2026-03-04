import { eq, desc, like, or } from "drizzle-orm";
import { db } from "./db";
import { 
  touristSpots, 
  touristFeedback,
  touristPassports,
  badges,
  touristBadges,
  spotVisits,
  touristRoutes,
  adminUsers,
  users,
  type User,
  type InsertUser,
  type TouristSpot, 
  type InsertTouristSpot, 
  type TouristFeedback, 
  type InsertTouristFeedback,
  type TouristPassport,
  type InsertTouristPassport,
  type Badge,
  type InsertBadge,
  type TouristBadge,
  type InsertTouristBadge,
  type SpotVisit,
  type InsertSpotVisit,
  type TouristRoute,
  type InsertTouristRoute,
  type AdminUser,
  type InsertAdminUser,
  type ImageMetadata,
  type UpdateImage
} from "@shared/schema";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import { aracajuSpots } from "../client/src/lib/aracaju-spots";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Tourist spots methods
  getAllTouristSpots(): Promise<TouristSpot[]>;
  getTouristSpotById(id: string): Promise<TouristSpot | undefined>;
  getTouristSpotsByCategory(category: string): Promise<TouristSpot[]>;
  searchTouristSpots(query: string): Promise<TouristSpot[]>;
  createTouristSpot(spot: InsertTouristSpot): Promise<TouristSpot>;
  updateTouristSpot(id: string, spot: Partial<InsertTouristSpot>): Promise<TouristSpot | undefined>;
  deleteTouristSpot(id: string): Promise<boolean>;
  getTouristSpotByQRCode(qrCode: string): Promise<TouristSpot | undefined>;
  
  // Image management methods
  addImageToSpot(spotId: string, image: ImageMetadata): Promise<TouristSpot | undefined>;
  updateImageMetadata(spotId: string, imageId: string, updates: UpdateImage): Promise<TouristSpot | undefined>;
  removeImageFromSpot(spotId: string, imageId: string): Promise<TouristSpot | undefined>;
  setCoverImage(spotId: string, imageId: string): Promise<TouristSpot | undefined>;
  reorderImages(spotId: string, imageOrders: Array<{id: string, order: number}>): Promise<TouristSpot | undefined>;
  
  // Tourist feedback methods
  getAllTouristFeedback(): Promise<TouristFeedback[]>;
  createTouristFeedback(feedback: InsertTouristFeedback): Promise<TouristFeedback>;
  
  // Tourist Passport methods
  getPassportByCode(passportCode: string): Promise<TouristPassport | undefined>;
  getPassportByEmail(email: string): Promise<TouristPassport | undefined>;
  createPassport(passport: InsertTouristPassport): Promise<TouristPassport>;
  updatePassport(id: string, updates: Partial<InsertTouristPassport>): Promise<TouristPassport | undefined>;
  getPassportWithStats(passportId: string): Promise<any>;
  
  // Badge methods
  getAllBadges(): Promise<Badge[]>;
  getBadgeById(id: string): Promise<Badge | undefined>;
  createBadge(badge: InsertBadge): Promise<Badge>;
  updateBadge(id: string, updates: Partial<InsertBadge>): Promise<Badge | undefined>;
  
  // Tourist Badge methods (earned badges)
  getEarnedBadges(passportId: string): Promise<TouristBadge[]>;
  awardBadge(passportId: string, badgeId: string): Promise<TouristBadge>;
  checkAndAwardBadges(passportId: string): Promise<TouristBadge[]>;
  
  // Spot Visit methods
  recordVisit(visit: InsertSpotVisit): Promise<SpotVisit>;
  getVisitsByPassport(passportId: string): Promise<SpotVisit[]>;
  getVisitsBySpot(spotId: string): Promise<SpotVisit[]>;
  hasVisited(passportId: string, spotId: string): Promise<boolean>;
  
  // Tourist Route methods
  getAllRoutes(): Promise<TouristRoute[]>;
  getRouteById(id: string): Promise<TouristRoute | undefined>;
  createRoute(route: InsertTouristRoute): Promise<TouristRoute>;
  updateRoute(id: string, updates: Partial<InsertTouristRoute>): Promise<TouristRoute | undefined>;
  deleteRoute(id: string): Promise<boolean>;
  getRecommendedRoutes(preferences: { duration?: string, categories?: string[] }): Promise<TouristRoute[]>;
  
  // Admin User methods
  getAdminUserById(id: string): Promise<AdminUser | undefined>;
  getAdminUserByEmail(email: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
  updateAdminUserLastLogin(id: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  constructor() {
    // Initialize database with Aracaju spots, badges and admin users if needed
    this.initializeAracajuSpots();
    this.initializeBadges();
    this.initializeAdminUsers();
  }

  private async initializeAdminUsers() {
    try {
      const existingUsers = await db.select().from(adminUsers).limit(1);
      if (existingUsers.length > 0) {
        return; // Already initialized
      }

      // Hash the password Pm@12345
      const passwordHash = await bcrypt.hash("Pm@12345", 10);

      const defaultAdminUsers: InsertAdminUser[] = [
        {
          name: "Samuel Hipólito",
          email: "samuel.hipolito@aracaju.se.gov.br",
          passwordHash,
        },
        {
          name: "Ícaro Carvalho",
          email: "icaro.carvalho@aracaju.se.gov.br",
          passwordHash,
        },
        {
          name: "Luara Lázaro",
          email: "luara.santos@aracaju.se.gov.br",
          passwordHash,
        },
        {
          name: "Jardel Bispo",
          email: "jardel.bispo@aracaju.se.gov.br",
          passwordHash,
        },
        {
          name: "Bárbara Menezes",
          email: "barbara.menezes@aracaju.se.gov.br",
          passwordHash,
        },
      ];

      await db.insert(adminUsers).values(defaultAdminUsers);
      console.log("Admin users initialized successfully");
    } catch (error) {
      console.log("Admin users initialization:", error);
    }
  }

  private async initializeAracajuSpots() {
    try {
      // Check if we already have spots in the database
      const existingSpots = await db.select().from(touristSpots).limit(1);
      if (existingSpots.length > 0) {
        return; // Already initialized
      }

      // Insert Aracaju spots data
      const spotsToInsert = aracajuSpots.map(spot => ({
        ...spot,
        qrCode: `qr-${randomUUID()}`,
        isActive: true,
        address: spot.address || null,
        images: spot.images || null,
        imageGallery: [] as ImageMetadata[],
        coverImage: null,
        features: spot.features || {},
        googleMapsLink: spot.googleMapsLink || null,
        openingHours: "",
        is24Hours: false,
        isFree: true,
        entryFee: "",
      }));
      
      await db.insert(touristSpots).values(spotsToInsert);
    } catch (error) {
      console.log('Database initialization:', error);
    }
  }

  private async initializeBadges() {
    try {
      const existingBadges = await db.select().from(badges).limit(1);
      if (existingBadges.length > 0) {
        return; // Already initialized
      }

      const defaultBadges: InsertBadge[] = [
        {
          name_pt: "Primeira Visita",
          name_en: "First Visit",
          name_es: "Primera Visita",
          description_pt: "Visitou seu primeiro ponto turístico em Aracaju!",
          description_en: "Visited your first tourist spot in Aracaju!",
          description_es: "¡Visitó su primer punto turístico en Aracaju!",
          icon: "🎯",
          category: "especial",
          rarity: "bronze",
          points: "10",
          requirement: { type: "visit_count", value: 1 },
          isActive: true,
        },
        {
          name_pt: "Explorador de Praias",
          name_en: "Beach Explorer",
          name_es: "Explorador de Playas",
          description_pt: "Visitou 3 praias diferentes em Aracaju!",
          description_en: "Visited 3 different beaches in Aracaju!",
          description_es: "¡Visitó 3 playas diferentes en Aracaju!",
          icon: "🏖️",
          category: "praia",
          rarity: "silver",
          points: "25",
          requirement: { type: "category_visits", category: "praia", value: 3 },
          isActive: true,
        },
        {
          name_pt: "Guardião da História",
          name_en: "History Guardian",
          name_es: "Guardián de la Historia",
          description_pt: "Visitou todos os pontos históricos de Aracaju!",
          description_en: "Visited all historical spots in Aracaju!",
          description_es: "¡Visitó todos los puntos históricos de Aracaju!",
          icon: "🏛️",
          category: "historico",
          rarity: "gold",
          points: "50",
          requirement: { type: "category_complete", category: "historico" },
          isActive: true,
        },
        {
          name_pt: "Amante da Cultura",
          name_en: "Culture Lover",
          name_es: "Amante de la Cultura",
          description_pt: "Explorou pontos culturais de Aracaju!",
          description_en: "Explored cultural spots in Aracaju!",
          description_es: "¡Exploró puntos culturales de Aracaju!",
          icon: "🎨",
          category: "cultura",
          rarity: "silver",
          points: "30",
          requirement: { type: "category_visits", category: "cultura", value: 2 },
          isActive: true,
        },
        {
          name_pt: "Mestre de Aracaju",
          name_en: "Master of Aracaju",
          name_es: "Maestro de Aracaju",
          description_pt: "Visitou todos os pontos turísticos de Aracaju!",
          description_en: "Visited all tourist spots in Aracaju!",
          description_es: "¡Visitó todos los puntos turísticos de Aracaju!",
          icon: "👑",
          category: "especial",
          rarity: "legendary",
          points: "100",
          requirement: { type: "all_spots" },
          isActive: true,
        },
      ];

      await db.insert(badges).values(defaultBadges);
    } catch (error) {
      console.log('Badge initialization:', error);
    }
  }

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getAllTouristSpots(): Promise<TouristSpot[]> {
    return await db.select().from(touristSpots).orderBy(desc(touristSpots.createdAt));
  }

  async getTouristSpotById(id: string): Promise<TouristSpot | undefined> {
    const [spot] = await db.select().from(touristSpots).where(eq(touristSpots.id, id));
    return spot || undefined;
  }

  async getTouristSpotsByCategory(category: string): Promise<TouristSpot[]> {
    return await db.select().from(touristSpots).where(eq(touristSpots.category, category));
  }

  async searchTouristSpots(query: string): Promise<TouristSpot[]> {
    const lowercaseQuery = `%${query.toLowerCase()}%`;
    return await db.select().from(touristSpots).where(
      or(
        like(touristSpots.name_pt, lowercaseQuery),
        like(touristSpots.name_en, lowercaseQuery),
        like(touristSpots.name_es, lowercaseQuery),
        like(touristSpots.description_pt, lowercaseQuery),
        like(touristSpots.description_en, lowercaseQuery),
        like(touristSpots.description_es, lowercaseQuery)
      )
    );
  }

  async createTouristSpot(spot: InsertTouristSpot): Promise<TouristSpot> {
    const [createdSpot] = await db
      .insert(touristSpots)
      .values({
        ...spot,
        qrCode: `qr-${randomUUID()}`,
      })
      .returning();
    return createdSpot;
  }

  async updateTouristSpot(id: string, spot: Partial<InsertTouristSpot>): Promise<TouristSpot | undefined> {
    const [updatedSpot] = await db
      .update(touristSpots)
      .set({ ...spot, updatedAt: new Date().toISOString() })
      .where(eq(touristSpots.id, id))
      .returning();
    return updatedSpot || undefined;
  }

  async deleteTouristSpot(id: string): Promise<boolean> {
    const result = await db.delete(touristSpots).where(eq(touristSpots.id, id));
    return result.rowCount > 0;
  }

  async getTouristSpotByQRCode(qrCode: string): Promise<TouristSpot | undefined> {
    const [spot] = await db.select().from(touristSpots).where(eq(touristSpots.qrCode, qrCode));
    return spot || undefined;
  }

  // Image management methods
  async addImageToSpot(spotId: string, image: ImageMetadata): Promise<TouristSpot | undefined> {
    const spot = await this.getTouristSpotById(spotId);
    if (!spot) return undefined;

    const currentGallery = Array.isArray(spot.imageGallery) ? spot.imageGallery : [];
    const newGallery = [...currentGallery, image];

    return await this.updateTouristSpot(spotId, { imageGallery: newGallery });
  }

  async updateImageMetadata(spotId: string, imageId: string, updates: UpdateImage): Promise<TouristSpot | undefined> {
    const spot = await this.getTouristSpotById(spotId);
    if (!spot) return undefined;

    const currentGallery = Array.isArray(spot.imageGallery) ? spot.imageGallery : [];
    const updatedGallery = currentGallery.map(img => 
      img.id === imageId ? { ...img, ...updates } : img
    );

    return await this.updateTouristSpot(spotId, { imageGallery: updatedGallery });
  }

  async removeImageFromSpot(spotId: string, imageId: string): Promise<TouristSpot | undefined> {
    const spot = await this.getTouristSpotById(spotId);
    if (!spot) return undefined;

    const currentGallery = Array.isArray(spot.imageGallery) ? spot.imageGallery : [];
    const filteredGallery = currentGallery.filter(img => img.id !== imageId);

    return await this.updateTouristSpot(spotId, { imageGallery: filteredGallery });
  }

  async setCoverImage(spotId: string, imageId: string): Promise<TouristSpot | undefined> {
    const spot = await this.getTouristSpotById(spotId);
    if (!spot) return undefined;

    const currentGallery = Array.isArray(spot.imageGallery) ? spot.imageGallery : [];
    const image = currentGallery.find(img => img.id === imageId);
    if (!image) return undefined;

    return await this.updateTouristSpot(spotId, { coverImage: image.url });
  }

  async reorderImages(spotId: string, imageOrders: Array<{id: string, order: number}>): Promise<TouristSpot | undefined> {
    const spot = await this.getTouristSpotById(spotId);
    if (!spot) return undefined;

    const currentGallery = Array.isArray(spot.imageGallery) ? spot.imageGallery : [];
    const reorderedGallery = currentGallery.map(img => {
      const newOrder = imageOrders.find(order => order.id === img.id);
      return newOrder ? { ...img, order: newOrder.order } : img;
    }).sort((a, b) => a.order - b.order);

    return await this.updateTouristSpot(spotId, { imageGallery: reorderedGallery });
  }

  // Tourist feedback methods
  async getAllTouristFeedback(): Promise<TouristFeedback[]> {
    return await db.select().from(touristFeedback).orderBy(desc(touristFeedback.createdAt));
  }

  async createTouristFeedback(insertFeedback: InsertTouristFeedback): Promise<TouristFeedback> {
    const [feedback] = await db
      .insert(touristFeedback)
      .values(insertFeedback)
      .returning();
    return feedback;
  }

  // Tourist Passport methods
  async getPassportByCode(passportCode: string): Promise<TouristPassport | undefined> {
    const [passport] = await db.select().from(touristPassports).where(eq(touristPassports.passportCode, passportCode));
    return passport || undefined;
  }

  async getPassportByEmail(email: string): Promise<TouristPassport | undefined> {
    const [passport] = await db.select().from(touristPassports).where(eq(touristPassports.email, email));
    return passport || undefined;
  }

  async createPassport(insertPassport: InsertTouristPassport): Promise<TouristPassport> {
    const [passport] = await db.insert(touristPassports).values(insertPassport).returning();
    return passport;
  }

  async updatePassport(id: string, updates: Partial<InsertTouristPassport>): Promise<TouristPassport | undefined> {
    const [updatedPassport] = await db
      .update(touristPassports)
      .set({ ...updates, lastVisit: new Date().toISOString() })
      .where(eq(touristPassports.id, id))
      .returning();
    return updatedPassport || undefined;
  }

  async getPassportWithStats(passportId: string): Promise<any> {
    const passport = await db.select().from(touristPassports).where(eq(touristPassports.id, passportId));
    if (!passport[0]) return null;

    const visits = await this.getVisitsByPassport(passportId);
    const earnedBadges = await this.getEarnedBadges(passportId);
    
    return {
      ...passport[0],
      visits,
      badges: earnedBadges,
    };
  }

  // Badge methods
  async getAllBadges(): Promise<Badge[]> {
    return await db.select().from(badges).where(eq(badges.isActive, true));
  }

  async getBadgeById(id: string): Promise<Badge | undefined> {
    const [badge] = await db.select().from(badges).where(eq(badges.id, id));
    return badge || undefined;
  }

  async createBadge(insertBadge: InsertBadge): Promise<Badge> {
    const [badge] = await db.insert(badges).values(insertBadge).returning();
    return badge;
  }

  async updateBadge(id: string, updates: Partial<InsertBadge>): Promise<Badge | undefined> {
    const [updatedBadge] = await db
      .update(badges)
      .set(updates)
      .where(eq(badges.id, id))
      .returning();
    return updatedBadge || undefined;
  }

  // Tourist Badge methods (earned badges)
  async getEarnedBadges(passportId: string): Promise<TouristBadge[]> {
    return await db.select().from(touristBadges).where(eq(touristBadges.passportId, passportId)).orderBy(desc(touristBadges.earnedAt));
  }

  async awardBadge(passportId: string, badgeId: string): Promise<TouristBadge> {
    // Check if already earned
    const existing = await db.select().from(touristBadges)
      .where(eq(touristBadges.passportId, passportId))
      .where(eq(touristBadges.badgeId, badgeId));
    
    if (existing.length > 0) {
      return existing[0];
    }

    const [earnedBadge] = await db.insert(touristBadges).values({ passportId, badgeId }).returning();
    
    // Update passport points
    const badge = await this.getBadgeById(badgeId);
    if (badge) {
      const passport = await db.select().from(touristPassports).where(eq(touristPassports.id, passportId));
      if (passport[0]) {
        const newPoints = Number(passport[0].totalPoints || 0) + Number(badge.points);
        await this.updatePassport(passportId, { totalPoints: newPoints.toString() });
      }
    }
    
    return earnedBadge;
  }

  async checkAndAwardBadges(passportId: string): Promise<TouristBadge[]> {
    const allBadges = await this.getAllBadges();
    const visits = await this.getVisitsByPassport(passportId);
    const spots = await this.getAllTouristSpots();
    const newlyEarned: TouristBadge[] = [];

    for (const badge of allBadges) {
      const requirement = badge.requirement as any;
      
      if (requirement.type === 'visit_count' && visits.length >= requirement.value) {
        const earned = await this.awardBadge(passportId, badge.id);
        newlyEarned.push(earned);
      } else if (requirement.type === 'category_visits') {
        const categoryVisits = await Promise.all(
          visits.map(async v => {
            const spot = await this.getTouristSpotById(v.spotId);
            return spot?.category === requirement.category ? 1 : 0;
          })
        );
        const count = categoryVisits.reduce((a, b) => a + b, 0);
        if (count >= requirement.value) {
          const earned = await this.awardBadge(passportId, badge.id);
          newlyEarned.push(earned);
        }
      } else if (requirement.type === 'category_complete') {
        const categorySpots = spots.filter(s => s.category === requirement.category);
        const visitedSpotIds = visits.map(v => v.spotId);
        const allVisited = categorySpots.every(s => visitedSpotIds.includes(s.id));
        if (allVisited) {
          const earned = await this.awardBadge(passportId, badge.id);
          newlyEarned.push(earned);
        }
      } else if (requirement.type === 'all_spots') {
        if (visits.length >= spots.length) {
          const earned = await this.awardBadge(passportId, badge.id);
          newlyEarned.push(earned);
        }
      }
    }

    return newlyEarned;
  }

  // Spot Visit methods
  async recordVisit(insertVisit: InsertSpotVisit): Promise<SpotVisit> {
    const [visit] = await db.insert(spotVisits).values(insertVisit).returning();
    
    // Update passport visit count
    if (insertVisit.passportId) {
      const passport = await db.select().from(touristPassports).where(eq(touristPassports.id, insertVisit.passportId));
      if (passport[0]) {
        const newCount = Number(passport[0].totalVisits || 0) + 1;
        await this.updatePassport(insertVisit.passportId, { totalVisits: newCount.toString() });
      }
    }
    
    return visit;
  }

  async getVisitsByPassport(passportId: string): Promise<SpotVisit[]> {
    return await db.select().from(spotVisits).where(eq(spotVisits.passportId, passportId)).orderBy(desc(spotVisits.visitedAt));
  }

  async getVisitsBySpot(spotId: string): Promise<SpotVisit[]> {
    return await db.select().from(spotVisits).where(eq(spotVisits.spotId, spotId)).orderBy(desc(spotVisits.visitedAt));
  }

  async hasVisited(passportId: string, spotId: string): Promise<boolean> {
    const visits = await db.select().from(spotVisits)
      .where(eq(spotVisits.passportId, passportId))
      .where(eq(spotVisits.spotId, spotId));
    return visits.length > 0;
  }

  // Tourist Route methods
  async getAllRoutes(): Promise<TouristRoute[]> {
    return await db.select().from(touristRoutes).where(eq(touristRoutes.isActive, true));
  }

  async getRouteById(id: string): Promise<TouristRoute | undefined> {
    const [route] = await db.select().from(touristRoutes).where(eq(touristRoutes.id, id));
    return route || undefined;
  }

  async createRoute(insertRoute: InsertTouristRoute): Promise<TouristRoute> {
    const [route] = await db.insert(touristRoutes).values(insertRoute).returning();
    return route;
  }

  async updateRoute(id: string, updates: Partial<InsertTouristRoute>): Promise<TouristRoute | undefined> {
    const [updatedRoute] = await db
      .update(touristRoutes)
      .set(updates)
      .where(eq(touristRoutes.id, id))
      .returning();
    return updatedRoute || undefined;
  }

  async deleteRoute(id: string): Promise<boolean> {
    const deleted = await db.delete(touristRoutes).where(eq(touristRoutes.id, id)).returning();
    return deleted.length > 0;
  }

  async getRecommendedRoutes(preferences: { duration?: string, categories?: string[] }): Promise<TouristRoute[]> {
    let routes = await this.getAllRoutes();
    
    if (preferences.duration) {
      routes = routes.filter(r => r.duration === preferences.duration);
    }
    
    if (preferences.categories && preferences.categories.length > 0) {
      routes = routes.filter(r => 
        r.categories.some(c => preferences.categories?.includes(c))
      );
    }
    
    return routes;
  }

  // =====================
  // ADMIN USER METHODS
  // =====================

  async getAdminUserById(id: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.id, id));
    return user || undefined;
  }

  async getAdminUserByEmail(email: string): Promise<AdminUser | undefined> {
    const [user] = await db.select().from(adminUsers).where(eq(adminUsers.email, email));
    return user || undefined;
  }

  async createAdminUser(user: InsertAdminUser): Promise<AdminUser> {
    const [created] = await db.insert(adminUsers).values(user).returning();
    return created;
  }

  async updateAdminUserLastLogin(id: string): Promise<void> {
    await db
      .update(adminUsers)
      .set({ lastLogin: new Date().toISOString() })
      .where(eq(adminUsers.id, id));
  }
}

export const storage = new DatabaseStorage();