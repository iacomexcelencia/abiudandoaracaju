import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import path from "path";
import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import session from "express-session";
import connectPgSimple from "connect-pg-simple";
import { storage } from "./storage";
import { 
  insertTouristSpotSchema, 
  insertTouristFeedbackSchema, 
  insertTouristPassportSchema,
  insertBadgeSchema,
  insertSpotVisitSchema,
  insertTouristRouteSchema,
  imageUploadSchema, 
  updateImageSchema 
} from "@shared/schema";
import { migrateAllTouristSpots, checkMigrationNeeds, migrateTouristSpotImages } from "./migration-tools";
import { promises as fs } from "fs";

// Extend express-session types
declare module "express-session" {
  interface SessionData {
    userId?: string;
  }
}

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  },
});

// Helper function to upload file to local storage (fallback)
async function uploadToLocalStorage(file: Express.Multer.File): Promise<string> {
  const fileExtension = path.extname(file.originalname);
  const fileName = `${randomUUID()}${fileExtension}`;
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'tourist-images');
  const filePath = path.join(uploadDir, fileName);

  try {
    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Write file to local storage
    await fs.writeFile(filePath, file.buffer);
    
    // Return public URL
    return `/uploads/tourist-images/${fileName}`;
    
  } catch (error) {
    console.error('Erro no upload local:', error);
    throw new Error('Falha no upload local');
  }
}

// Helper function to upload file to object storage with fallback
async function uploadToObjectStorage(file: Express.Multer.File): Promise<string> {
  const bucketId = process.env.DEFAULT_OBJECT_STORAGE_BUCKET_ID;
  
  // Try Object Storage first
  if (bucketId) {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${randomUUID()}${fileExtension}`;
    const objectPath = `/public/tourist-images/${fileName}`;

    try {
      // Upload para o Object Storage do Replit
      const uploadUrl = `https://objectstorage.replit.com/${bucketId}${objectPath}`;
      
      const response = await fetch(uploadUrl, {
        method: 'PUT',
        body: file.buffer,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': file.size.toString(),
        },
      });

      if (response.ok) {
        // Retornar URL pública do arquivo
        return `https://objectstorage.replit.com/${bucketId}${objectPath}`;
      }
      
    } catch (error) {
      console.log('Object Storage não disponível, usando storage local...');
    }
  }
  
  // Fallback to local storage
  return await uploadToLocalStorage(file);
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Trust proxy for production (Replit runs behind a reverse proxy)
  if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);
  }

  // Configure session with PostgreSQL store
  const PgSession = connectPgSimple(session);
  
  app.use(
    session({
      store: new PgSession({
        conString: process.env.DATABASE_URL,
        tableName: "session",
        createTableIfMissing: true,
      }),
      secret: process.env.SESSION_SECRET || "abiudando-aju-secret-key-2025",
      resave: false,
      saveUninitialized: false,
      name: "abiudando.sid", // Custom session name (not default connect.sid)
      cookie: {
        secure: process.env.NODE_ENV === "production", // Secure only in production (HTTPS)
        httpOnly: true, // Prevents JavaScript access to cookie
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        sameSite: process.env.NODE_ENV === "production" ? "strict" : "lax", // Strict in prod, lax in dev
      },
    })
  );

  // Middleware to require authentication for admin routes
  const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.session.userId) {
      return res.status(401).json({ error: "Acesso não autorizado. Faça login para continuar." });
    }
    next();
  };

  // Register Object Storage routes with auth protection on upload
  const { ObjectStorageService, ObjectNotFoundError } = await import("./replit_integrations/object_storage");
  const objectStorageService = new ObjectStorageService();

  app.post("/api/uploads/request-url", requireAuth, async (req, res) => {
    try {
      const { name, size, contentType } = req.body;
      if (!name) {
        return res.status(400).json({ error: "Missing required field: name" });
      }
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      const objectPath = objectStorageService.normalizeObjectEntityPath(uploadURL);
      res.json({ uploadURL, objectPath, metadata: { name, size, contentType } });
    } catch (error) {
      console.error("Error generating upload URL:", error);
      res.status(500).json({ error: "Failed to generate upload URL" });
    }
  });

  app.get("/objects/:objectPath(*)", async (req, res) => {
    try {
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error) {
      if (error instanceof ObjectNotFoundError) {
        return res.status(404).json({ error: "Object not found" });
      }
      return res.status(500).json({ error: "Failed to serve object" });
    }
  });

  // =====================
  // AUTHENTICATION ROUTES
  // =====================

  // Login route
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ error: "Email e senha são obrigatórios" });
      }

      const user = await storage.getAdminUserByEmail(email);
      
      if (!user) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      const isValidPassword = await bcrypt.compare(password, user.passwordHash);
      
      if (!isValidPassword) {
        return res.status(401).json({ error: "Credenciais inválidas" });
      }

      // Update last login
      await storage.updateAdminUserLastLogin(user.id);

      // Set session
      req.session.userId = user.id;
      
      res.json({ 
        success: true,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        }
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao fazer logout" });
      }
      res.clearCookie("connect.sid");
      res.json({ success: true });
    });
  });

  // Get current user
  app.get("/api/auth/me", async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ error: "Não autenticado" });
      }

      const user = await storage.getAdminUserById(req.session.userId);
      
      if (!user) {
        req.session.destroy(() => {});
        return res.status(401).json({ error: "Usuário não encontrado" });
      }

      res.json({
        id: user.id,
        name: user.name,
        email: user.email,
      });
    } catch (error) {
      console.error("Get user error:", error);
      res.status(500).json({ error: "Erro interno do servidor" });
    }
  });

  // Get all tourist spots
  app.get("/api/spots", async (req, res) => {
    try {
      const spots = await storage.getAllTouristSpots();
      res.json(spots);
    } catch (error) {
      console.error("Error fetching spots:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get tourist spots by category
  app.get("/api/spots/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const spots = await storage.getTouristSpotsByCategory(category);
      res.json(spots);
    } catch (error) {
      console.error("Error fetching spots by category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Search tourist spots
  app.get("/api/spots/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      const spots = await storage.searchTouristSpots(q);
      res.json(spots);
    } catch (error) {
      console.error("Error searching spots:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get tourist spot by ID
  app.get("/api/spots/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const spot = await storage.getTouristSpotById(id);
      if (!spot) {
        return res.status(404).json({ error: "Tourist spot not found" });
      }
      res.json(spot);
    } catch (error) {
      console.error("Error fetching spot:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get tourist spot by QR code
  app.get("/api/spots/qr/:qrCode", async (req, res) => {
    try {
      const { qrCode } = req.params;
      const spot = await storage.getTouristSpotByQRCode(qrCode);
      if (!spot) {
        return res.status(404).json({ error: "Tourist spot not found for QR code" });
      }
      res.json(spot);
    } catch (error) {
      console.error("Error fetching spot by QR code:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get all tourist feedback - PROTECTED (admin only)
  app.get("/api/tourist-feedback", requireAuth, async (req, res) => {
    try {
      const feedbacks = await storage.getAllTouristFeedback();
      res.json(feedbacks);
    } catch (error) {
      console.error("Error fetching tourist feedback:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get dashboard statistics - PROTECTED (admin only)
  app.get("/api/dashboard/stats", requireAuth, async (req, res) => {
    try {
      const spots = await storage.getAllTouristSpots();
      const feedbacks = await storage.getAllTouristFeedback();
      
      // Calculate statistics
      const totalSpots = spots.length;
      const totalFeedbacks = feedbacks.length;
      const averageRating = feedbacks.length > 0 
        ? feedbacks.reduce((acc, f) => acc + parseFloat(f.rating || "0"), 0) / feedbacks.length
        : 0;
      
      // Spots per category
      const spotsPerCategory = spots.reduce((acc, spot) => {
        acc[spot.category] = (acc[spot.category] || 0) + 1;
        return acc;
      }, {} as { [key: string]: number });
      
      // Recent feedbacks (last 10)
      const recentFeedbacks = feedbacks
        .sort((a, b) => new Date(b.createdAt || "").getTime() - new Date(a.createdAt || "").getTime())
        .slice(0, 10);
      
      // Top rated spots
      const spotsWithRatings = spots.map(spot => {
        const spotFeedbacks = feedbacks.filter(f => f.spotId === spot.id);
        const avgRating = spotFeedbacks.length > 0
          ? spotFeedbacks.reduce((acc, f) => acc + parseFloat(f.rating || "0"), 0) / spotFeedbacks.length
          : 0;
        return { ...spot, avgRating, feedbackCount: spotFeedbacks.length };
      });
      
      const topRatedSpots = spotsWithRatings
        .filter(spot => spot.feedbackCount > 0)
        .sort((a, b) => b.avgRating - a.avgRating)
        .slice(0, 10);
      
      const stats = {
        totalSpots,
        totalFeedbacks,
        averageRating: Number(averageRating.toFixed(2)),
        spotsPerCategory,
        recentFeedbacks,
        topRatedSpots,
        activeSpots: spots.filter(s => s.isActive).length,
        spotsWithImages: spots.filter(s => s.images && s.images.length > 0).length,
        spotsWithAddress: spots.filter(s => s.address).length,
        spotsWithQRCode: spots.filter(s => s.qrCode).length,
      };
      
      res.json(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create new tourist spot - PROTECTED (admin only)
  app.post("/api/spots", requireAuth, async (req, res) => {
    try {
      // Normalize latitude and longitude (convert commas to dots for PostgreSQL)
      const normalizedBody = {
        ...req.body,
        latitude: req.body.latitude ? String(req.body.latitude).replace(',', '.') : req.body.latitude,
        longitude: req.body.longitude ? String(req.body.longitude).replace(',', '.') : req.body.longitude,
      };
      
      const validatedData = insertTouristSpotSchema.parse(normalizedBody);
      const spot = await storage.createTouristSpot(validatedData);
      res.status(201).json(spot);
    } catch (error) {
      console.error("Error creating spot:", error);
      res.status(400).json({ error: "Invalid data provided" });
    }
  });

  // Update tourist spot - PROTECTED (admin only)
  app.put("/api/spots/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      
      // Normalize latitude and longitude (convert commas to dots for PostgreSQL)
      const normalizedBody = {
        ...req.body,
        latitude: req.body.latitude ? String(req.body.latitude).replace(',', '.') : req.body.latitude,
        longitude: req.body.longitude ? String(req.body.longitude).replace(',', '.') : req.body.longitude,
      };
      
      const validatedData = insertTouristSpotSchema.parse(normalizedBody);
      const updatedSpot = await storage.updateTouristSpot(id, validatedData);
      if (!updatedSpot) {
        return res.status(404).json({ error: "Tourist spot not found" });
      }
      res.json(updatedSpot);
    } catch (error) {
      console.error("Error updating spot:", error);
      res.status(400).json({ error: "Invalid data provided" });
    }
  });

  // Delete tourist spot - PROTECTED (admin only)
  app.delete("/api/spots/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteTouristSpot(id);
      if (!deleted) {
        return res.status(404).json({ error: "Tourist spot not found" });
      }
      res.json({ success: true, message: "Tourist spot deleted successfully" });
    } catch (error) {
      console.error("Error deleting spot:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Upload image to tourist spot - PROTECTED (admin only)
  app.post("/api/spots/:id/images", requireAuth, upload.single('image'), async (req, res) => {
    try {
      const { id } = req.params;
      if (!req.file) {
        return res.status(400).json({ error: "No image file provided" });
      }

      // Upload to object storage
      const imageUrl = await uploadToObjectStorage(req.file);
      
      // Parse additional metadata
      const metadata = {
        type: req.body.type || 'gallery',
        caption_pt: req.body.caption_pt || '',
        caption_en: req.body.caption_en || '',
        caption_es: req.body.caption_es || '',
        altText_pt: req.body.altText_pt || '',
        altText_en: req.body.altText_en || '',
        altText_es: req.body.altText_es || '',
        order: parseInt(req.body.order) || 0,
        inlinePosition: req.body.inlinePosition ? parseInt(req.body.inlinePosition) : undefined,
      };

      const imageMetadata = {
        id: randomUUID(),
        url: imageUrl,
        ...metadata,
      };

      const updatedSpot = await storage.addImageToSpot(id, imageMetadata);
      if (!updatedSpot) {
        return res.status(404).json({ error: "Tourist spot not found" });
      }

      res.status(201).json({ 
        success: true, 
        image: imageMetadata,
        spot: updatedSpot 
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ error: "Failed to upload image" });
    }
  });

  // Update image metadata - PROTECTED (admin only)
  app.put("/api/spots/:spotId/images/:imageId", requireAuth, async (req, res) => {
    try {
      const { spotId, imageId } = req.params;
      const validatedData = updateImageSchema.parse(req.body);
      
      const updatedSpot = await storage.updateImageMetadata(spotId, imageId, validatedData);
      if (!updatedSpot) {
        return res.status(404).json({ error: "Tourist spot or image not found" });
      }

      res.json({ success: true, spot: updatedSpot });
    } catch (error) {
      console.error("Error updating image metadata:", error);
      res.status(400).json({ error: "Invalid data provided" });
    }
  });

  // Delete image from tourist spot - PROTECTED (admin only)
  app.delete("/api/spots/:spotId/images/:imageId", requireAuth, async (req, res) => {
    try {
      const { spotId, imageId } = req.params;
      
      const updatedSpot = await storage.removeImageFromSpot(spotId, imageId);
      if (!updatedSpot) {
        return res.status(404).json({ error: "Tourist spot or image not found" });
      }

      res.json({ success: true, spot: updatedSpot });
    } catch (error) {
      console.error("Error deleting image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Set cover image - PROTECTED (admin only)
  app.put("/api/spots/:spotId/cover-image/:imageId", requireAuth, async (req, res) => {
    try {
      const { spotId, imageId } = req.params;
      
      const updatedSpot = await storage.setCoverImage(spotId, imageId);
      if (!updatedSpot) {
        return res.status(404).json({ error: "Tourist spot or image not found" });
      }

      res.json({ success: true, spot: updatedSpot });
    } catch (error) {
      console.error("Error setting cover image:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Reorder images - PROTECTED (admin only)
  app.put("/api/spots/:spotId/images/reorder", requireAuth, async (req, res) => {
    try {
      const { spotId } = req.params;
      const { imageOrders } = req.body; // Array of { id, order }
      
      const updatedSpot = await storage.reorderImages(spotId, imageOrders);
      if (!updatedSpot) {
        return res.status(404).json({ error: "Tourist spot not found" });
      }

      res.json({ success: true, spot: updatedSpot });
    } catch (error) {
      console.error("Error reordering images:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Simple file upload for images (used by form) - PROTECTED (admin only)
  // Now uses presigned URL flow via /api/uploads/request-url and /objects/* routes

  // Data normalization helper functions for consistent database storage
  const normalizeCountry = (country: string): string => {
    if (!country) return country;
    const countryMap: Record<string, string> = {
      'brasil': 'Brasil', 'BR': 'Brasil', 'br': 'Brasil', 'BRASIL': 'Brasil',
      'argentina': 'Argentina', 'AR': 'Argentina', 'ARGENTINA': 'Argentina',
      'uruguai': 'Uruguai', 'UY': 'Uruguai', 'URUGUAI': 'Uruguai',
      'paraguai': 'Paraguai', 'PY': 'Paraguai', 'PARAGUAI': 'Paraguai',
      'chile': 'Chile', 'CL': 'Chile', 'CHILE': 'Chile',
      'colombia': 'Colombia', 'CO': 'Colombia', 'COLOMBIA': 'Colombia',
      'peru': 'Peru', 'PE': 'Peru', 'PERU': 'Peru',
      'estados unidos': 'Estados Unidos', 'USA': 'Estados Unidos', 'US': 'Estados Unidos', 'EUA': 'Estados Unidos',
      'canada': 'Canada', 'CA': 'Canada', 'CANADA': 'Canada', 'canadá': 'Canada',
      'portugal': 'Portugal', 'PT': 'Portugal', 'PORTUGAL': 'Portugal',
      'espanha': 'Espanha', 'ES': 'Espanha', 'ESPANHA': 'Espanha', 'spain': 'Espanha',
      'frança': 'França', 'FR': 'França', 'FRANÇA': 'França', 'france': 'França',
      'alemanha': 'Alemanha', 'DE': 'Alemanha', 'ALEMANHA': 'Alemanha', 'germany': 'Alemanha',
      'italia': 'Italia', 'IT': 'Italia', 'ITALIA': 'Italia', 'italy': 'Italia', 'itália': 'Italia',
      'reino unido': 'Reino Unido', 'UK': 'Reino Unido', 'GB': 'Reino Unido',
      'japao': 'Japao', 'JP': 'Japao', 'JAPAO': 'Japao', 'japão': 'Japao', 'japan': 'Japao',
      'china': 'China', 'CN': 'China', 'CHINA': 'China',
    };
    return countryMap[country.toLowerCase()] || countryMap[country] || country;
  };

  const normalizeAccommodation = (accommodation: string): string => {
    if (!accommodation) return accommodation;
    const accMap: Record<string, string> = {
      'hotel': 'hotel', 'Hotel': 'hotel', 'HOTEL': 'hotel', 'hotel del mar': 'hotel', 'hotel na orla': 'hotel',
      'pousada': 'pousada', 'Pousada': 'pousada', 'POUSADA': 'pousada',
      'airbnb': 'airbnb', 'Airbnb': 'airbnb', 'AIRBNB': 'airbnb', 'aluguel temporário': 'airbnb',
      'hostel': 'hostel', 'Hostel': 'hostel', 'HOSTEL': 'hostel',
      'resort': 'resort', 'Resort': 'resort', 'RESORT': 'resort',
      'casa de familia': 'casa-familia', 'casa de familiares': 'casa-familia', 'casa de amigos': 'casa-familia',
      'casa-familia': 'casa-familia', 'Casa de família': 'casa-familia', 'cara de familia': 'casa-familia',
      'morador local': 'morador-local', 'morador-local': 'morador-local', 'local': 'morador-local',
      'outro': 'outro', 'Outro': 'outro', 'outros': 'outro',
    };
    return accMap[accommodation.toLowerCase()] || accMap[accommodation] || accommodation;
  };

  // Submit tourist feedback
  app.post("/api/tourist-feedback", async (req, res) => {
    try {
      console.log("Tourist feedback received:", req.body);
      
      // Extract email separately (not part of feedback schema)
      const { email: userEmail, ...feedbackBody } = req.body;
      
      // Normalize data before validation to ensure consistency
      const normalizedBody = {
        ...feedbackBody,
        country: normalizeCountry(feedbackBody.country),
        accommodation: normalizeAccommodation(feedbackBody.accommodation),
      };
      
      const validatedData = insertTouristFeedbackSchema.parse(normalizedBody);
      
      let passportId = validatedData.passportId;
      let passportCode: string | undefined;
      let isNewPassport = false;
      
      // CRITICAL FIX: Always ensure a passport exists
      // If no passportId provided, create one automatically
      if (!passportId) {
        console.log("No passport ID provided - creating new passport automatically");
        const newPassportCode = generatePassportCode();
        
        const newPassport = await storage.createPassport({
          passportCode: newPassportCode,
          email: userEmail || null, // Use email from form if provided
          totalPoints: "10", // Initial points for first visit
          totalVisits: "1",
          level: "Explorador Iniciante"
        });
        
        passportId = newPassport.id;
        passportCode = newPassport.passportCode;
        isNewPassport = true;
        
        console.log(`Auto-created passport: ${passportCode} (ID: ${passportId}) with email: ${userEmail || 'none'}`);
      }
      
      // Create feedback with passport ID
      const feedbackData = {
        ...validatedData,
        passportId: passportId
      };
      
      const feedback = await storage.createTouristFeedback(feedbackData);
      
      // Record visit and check for badges
      await storage.recordVisit({
        passportId: passportId,
        spotId: validatedData.spotId,
        feedbackId: feedback.id
      });
      
      // Check and award new badges
      const newBadges = await storage.checkAndAwardBadges(passportId);
      
      res.status(201).json({ 
        success: true, 
        message: "Feedback received successfully",
        feedbackId: feedback.id,
        passportCode: passportCode, // Return passport code if newly created
        isNewPassport: isNewPassport,
        newBadges: newBadges.length > 0 ? newBadges : undefined
      });
    } catch (error) {
      console.error("Error saving tourist feedback:", error);
      res.status(400).json({ error: "Invalid data provided" });
    }
  });

  // ===== TOURIST PASSPORT ROUTES =====
  
  // Generate unique passport code
  function generatePassportCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = 'AJU-';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }

  // Create new passport
  app.post("/api/passport/create", async (req, res) => {
    try {
      const { email } = req.body;
      const passportCode = generatePassportCode();
      
      const passport = await storage.createPassport({
        passportCode,
        email: email || null,
        totalPoints: "0",
        totalVisits: "0",
        level: "Explorador Iniciante"
      });
      
      res.status(201).json(passport);
    } catch (error) {
      console.error("Error creating passport:", error);
      res.status(500).json({ error: "Failed to create passport" });
    }
  });

  // Get passport by code or email
  app.get("/api/passport/:codeOrEmail", async (req, res) => {
    try {
      const { codeOrEmail } = req.params;
      
      // Try to find by code first
      let passport = await storage.getPassportByCode(codeOrEmail);
      
      // If not found and looks like email, try email search
      if (!passport && codeOrEmail.includes('@')) {
        passport = await storage.getPassportByEmail(codeOrEmail);
      }
      
      if (!passport) {
        return res.status(404).json({ error: "Passport not found" });
      }
      
      const stats = await storage.getPassportWithStats(passport.id);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching passport:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get passport by email (for recovery)
  app.get("/api/passport/recovery/:email", async (req, res) => {
    try {
      const { email } = req.params;
      const passport = await storage.getPassportByEmail(email);
      
      if (!passport) {
        return res.status(404).json({ error: "No passport found with this email" });
      }
      
      res.json({ passportCode: passport.passportCode });
    } catch (error) {
      console.error("Error recovering passport:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== BADGE ROUTES =====
  
  // Get all badges
  app.get("/api/badges", async (req, res) => {
    try {
      const allBadges = await storage.getAllBadges();
      res.json(allBadges);
    } catch (error) {
      console.error("Error fetching badges:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get earned badges for passport
  app.get("/api/passport/:passportId/badges", async (req, res) => {
    try {
      const { passportId } = req.params;
      const earnedBadges = await storage.getEarnedBadges(passportId);
      res.json(earnedBadges);
    } catch (error) {
      console.error("Error fetching earned badges:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get earned badges by passport code (alternative endpoint)
  app.get("/api/badges/earned/:passportCode", async (req, res) => {
    try {
      const { passportCode } = req.params;
      
      // First, find the passport by code
      const passport = await storage.getPassportByCode(passportCode);
      
      if (!passport) {
        return res.json([]); // Return empty array if no passport found
      }
      
      const earnedBadges = await storage.getEarnedBadges(passport.id);
      res.json(earnedBadges);
    } catch (error) {
      console.error("Error fetching earned badges by code:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create badge - PROTECTED (admin only)
  app.post("/api/badges", requireAuth, async (req, res) => {
    try {
      const validatedData = insertBadgeSchema.parse(req.body);
      const badge = await storage.createBadge(validatedData);
      res.status(201).json(badge);
    } catch (error) {
      console.error("Error creating badge:", error);
      res.status(400).json({ error: "Invalid data provided" });
    }
  });

  // ===== VISIT TRACKING ROUTES =====
  
  // Get visits by passport
  app.get("/api/passport/:passportId/visits", async (req, res) => {
    try {
      const { passportId } = req.params;
      const visits = await storage.getVisitsByPassport(passportId);
      res.json(visits);
    } catch (error) {
      console.error("Error fetching visits:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Check if visited
  app.get("/api/passport/:passportId/visited/:spotId", async (req, res) => {
    try {
      const { passportId, spotId } = req.params;
      const hasVisited = await storage.hasVisited(passportId, spotId);
      res.json({ visited: hasVisited });
    } catch (error) {
      console.error("Error checking visit:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // ===== TOURIST ROUTE ROUTES =====
  
  // Get all routes
  app.get("/api/routes", async (req, res) => {
    try {
      const routes = await storage.getAllRoutes();
      res.json(routes);
    } catch (error) {
      console.error("Error fetching routes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get route by ID
  app.get("/api/routes/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const route = await storage.getRouteById(id);
      
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      
      res.json(route);
    } catch (error) {
      console.error("Error fetching route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Get recommended routes
  app.get("/api/routes/recommended", async (req, res) => {
    try {
      const { duration, categories } = req.query;
      const preferences = {
        duration: duration as string,
        categories: categories ? (categories as string).split(',') : undefined
      };
      
      const routes = await storage.getRecommendedRoutes(preferences);
      res.json(routes);
    } catch (error) {
      console.error("Error fetching recommended routes:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Create route - PROTECTED (admin only)
  app.post("/api/routes", requireAuth, async (req, res) => {
    try {
      const validatedData = insertTouristRouteSchema.parse(req.body);
      const route = await storage.createRoute(validatedData);
      res.status(201).json(route);
    } catch (error) {
      console.error("Error creating route:", error);
      res.status(400).json({ error: "Invalid data provided" });
    }
  });

  // Update route - PROTECTED (admin only)
  app.put("/api/routes/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const updates = insertTouristRouteSchema.partial().parse(req.body);
      const route = await storage.updateRoute(id, updates);
      
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      
      res.json(route);
    } catch (error) {
      console.error("Error updating route:", error);
      res.status(400).json({ error: "Invalid data provided" });
    }
  });

  // Toggle route status (activate/deactivate) - PROTECTED (admin only)
  app.patch("/api/routes/:id/toggle", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const route = await storage.getRouteById(id);
      
      if (!route) {
        return res.status(404).json({ error: "Route not found" });
      }
      
      const updated = await storage.updateRoute(id, { isActive: !route.isActive });
      res.json(updated);
    } catch (error) {
      console.error("Error toggling route status:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Delete route - PROTECTED (admin only)
  app.delete("/api/routes/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteRoute(id);
      
      if (!deleted) {
        return res.status(404).json({ error: "Route not found" });
      }
      
      res.json({ success: true, message: "Route deleted successfully" });
    } catch (error) {
      console.error("Error deleting route:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Migration tools routes - PROTECTED (admin only)
  
  // Check migration needs
  app.get("/api/migration/check", requireAuth, async (req, res) => {
    try {
      const result = await checkMigrationNeeds();
      res.json(result);
    } catch (error) {
      console.error("Error checking migration needs:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Run full migration - PROTECTED (admin only)
  app.post("/api/migration/run", requireAuth, async (req, res) => {
    try {
      const result = await migrateAllTouristSpots();
      res.json({
        message: "Migration completed",
        ...result
      });
    } catch (error) {
      console.error("Error running migration:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Migrate single spot - PROTECTED (admin only)
  app.post("/api/migration/spot/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const spot = await storage.getTouristSpotById(id);
      if (!spot) {
        return res.status(404).json({ error: "Tourist spot not found" });
      }

      const migratedSpot = await migrateTouristSpotImages(spot);
      const { id: spotId, createdAt, updatedAt, ...updateData } = migratedSpot;
      // Type-cast to ensure compatibility
      const typedUpdateData = {
        ...updateData,
        imageGallery: Array.isArray(updateData.imageGallery) ? updateData.imageGallery : [],
        features: updateData.features || {}
      };
      await storage.updateTouristSpot(id, typedUpdateData);
      
      res.json({
        success: true,
        message: "Spot migration completed",
        spot: migratedSpot
      });
    } catch (error) {
      console.error("Error migrating spot:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
