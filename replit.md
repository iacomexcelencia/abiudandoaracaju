# Overview

This is a tourism web application called "Ajudando Aju" designed to promote tourist attractions in Aracaju, Brazil. The application serves tourist spots with QR code functionality, allowing visitors to scan QR codes at physical locations to access detailed information about each attraction. The app supports multilingual content (Portuguese, English, and Spanish) and includes accessibility features like VLibras integration for sign language translation.

# Recent Updates

**January 23, 2026** - Security Hardening & Data Integrity (IT Audit Response):
- ✅ **HELMET.JS SECURITY HEADERS**: Complete security header implementation
  - Content Security Policy (CSP) configured for VLibras, Google Fonts, media content
  - HSTS enabled with 1-year max-age and preload
  - X-Content-Type-Options, X-Frame-Options, X-XSS-Protection enabled
  - X-Powered-By header removed (hides Node.js/Express fingerprinting)
  - Referrer-Policy set to strict-origin-when-cross-origin
- ✅ **SECURE SESSION COOKIES**: Full cookie hardening
  - HttpOnly: true (prevents JavaScript access)
  - Secure: true (HTTPS only)
  - SameSite: strict (CSRF protection)
  - Custom session name (not default connect.sid)
- ✅ **API ROUTE PROTECTION**: All admin endpoints require authentication
  - Middleware `requireAuth` applied to all sensitive routes
  - Protected: /api/tourist-feedback (GET), /api/dashboard/stats, /api/spots (POST/PUT/DELETE)
  - Protected: /api/upload, /api/badges (POST), /api/routes (POST/PUT/DELETE), /api/migration/*
  - Public routes preserved for tourist functionality (GET /api/spots, /api/routes, etc.)
- ✅ **DATA NORMALIZATION**: Backend data hygiene for consistent analytics
  - Country normalization (Brasil, br, BR → Brasil)
  - Accommodation normalization (hotel del mar, Hotel → hotel)
  - Prevents data fragmentation in analytics dashboards
- ✅ **DROPDOWN VALIDATION**: Frontend uses controlled Select components
  - Countries, States, Accommodation types all use predefined options
  - Eliminates free-text input errors (typos, inconsistent casing)

**November 21, 2025** - Voice Enhancement, Email Integration & Video Support:
- ✅ **VIDEO URL INTEGRATION**: Complete video support for tourist spots
  - Added `videoUrl` field to database schema (PostgreSQL)
  - Admin form now includes video URL input field (for Cloudflare-hosted videos)
  - Video player displayed on tourist spot page (below cover image, with native HTML5 controls)
  - Responsive 16:9 aspect ratio player that works perfectly on mobile
  - Videos complement (not replace) the cover photo for richer visitor experience
  - Conditional rendering: only shows when video URL exists
- ✅ **VOICE CONSISTENCY SYSTEM**: Intelligent voice selector for audio descriptions
  - Created utility function `getBrazilianFemaleVoice()` that prioritizes female Brazilian Portuguese voices
  - Added `createSpeech()` function supporting multilingual female voice selection (pt-BR, en-US, es-ES)
  - Applied to all speech synthesis points: language selector, spot descriptions, thank you messages
  - Debug mode in development to list available voices on device
  - Fallback logic ensuring consistent experience across different devices
- ✅ **EMAIL INTEGRATION IN FEEDBACK**: Optional email field added to tourist feedback form
  - Email stored in digital passport for recovery and future communications
  - Backend automatically creates passport with email when provided
  - Informative message explaining passport access via email
  - Public passport page (`/meu-passaporte`) for tourists to view their achievements
- ✅ **COORDINATE FORMAT FIX**: Backend now normalizes latitude/longitude from comma to dot format
  - Fixes "invalid input syntax for type numeric" error when editing tourist spots
  - Handles both creation and update operations

**October 21, 2025** - Complete System Upgrade with Gamification, Analytics & Public Features:
- ✅ **GAMIFICATION SYSTEM COMPLETE**: Digital Passport implementation with automatic tourist tracking
  - Tourist passports automatically created on first visit with unique code (e.g., "AJU-7F2K9")
  - Passport stored in browser localStorage with optional email recovery
  - Real-time badge/achievement system with bronze, silver, gold, and legendary rarities
  - 5 default badges: "Primeira Visita", "Explorador de Praias", "Guardião da História", "Amante da Cultura", "Mestre de Aracaju"
  - Automatic badge awarding based on visit patterns (category visits, all spots completion, etc.)
  - Points system integrated with passport progression and levels
- ✅ **NEXT DESTINATIONS PAGE**: Complete tourist exploration flow
  - Dynamic "Próximos Destinos" page showing all tourist spots after feedback submission
  - Cover images, category badges, spot descriptions, and addresses
  - "Ver Detalhes" button for each spot
  - "Como Chegar" GPS navigation button opening Google Maps with directions
  - Visited spot indicator showing which location was just completed
- ✅ **BACKEND EXPANSION**: Full API suite for gamification
  - Passport CRUD routes: create, get by code, get by email (recovery)
  - Badge routes: get all badges, get earned badges, award badges
  - Visit tracking routes: record visits, get visits by passport/spot, check if visited
  - Tourist route routes: get all routes, get by ID, recommended routes with filters
  - Enhanced feedback submission with automatic visit recording and badge checking
- ✅ **DATABASE SCHEMA ENHANCEMENT**: 5 new tables for gamification
  - `tourist_passports`: Digital passport storage with unique codes
  - `badges`: Achievement definitions with multilingual content
  - `tourist_badges`: Junction table for earned badges
  - `spot_visits`: Visit tracking linked to passports and feedback
  - `tourist_routes`: Curated tourist routes with durations and categories
- ✅ **TOURIST ROUTES SYSTEM**: Intelligent route suggestion and navigation
  - Complete tourist route page with filtering by duration and category
  - Routes display duration, difficulty level, and included spots
  - GPS navigation integration opening Google Maps with directions
  - Optimized route cards showing full itinerary and categories
  - Difficulty badges (Fácil, Moderado, Difícil) with color coding
- ✅ **PUBLIC TRANSPARENCY PANEL**: Open data dashboard for public access
  - Real-time statistics: total visitors, average rating, satisfaction rate
  - Interactive charts: country distribution (pie chart), category visits (bar chart)
  - Top-rated tourist spots ranking with visit counts
  - No login required - fully accessible to public
  - Responsive design with institutional branding
- ✅ **ADVANCED ANALYTICS DASHBOARD**: Professional reporting with visualizations
  - Time series line charts showing visit trends over last 30 days
  - Heatmap bar charts for visits by day of week
  - Pie charts for geographic distribution (top 5 countries)
  - Rating distribution bar charts with star emojis
  - Dynamic filtering by period (7/30/90 days) and category
  - Export functionality for JSON reports
- ✅ **FIXES**: Rating distribution bug fixed (decimal ratings now properly counted)
- ✅ **UX IMPROVEMENTS**: Logo sizing optimized in admin sidebar
- ✅ **INTEGRATION COMPLETE**: All systems (passport, badges, routes, analytics, transparency) fully operational

**September 11, 2025** - Complete QR Tourist Flow Implementation with Star Rating System:
- ✅ Homepage redesigned with "AJUDANDO AJU" branding following Lovable project model
- ✅ Administrative form enhanced with multilingual tabs (Portuguese, English, Spanish)
- ✅ Language selector with voice narration "Por favor, escolha o seu idioma"
- ✅ Spot details page with audio description functionality in selected language
- ✅ Interactive star rating system (1-5 stars) integrated above feedback form
- ✅ Google Maps integration links for each tourist spot when available
- ✅ Tourist feedback form collecting visitor demographics, experiences, and opinions
- ✅ Tourist feedback submission bug - corrected API endpoint and validation
- ✅ Thank you flow with "A Prefeitura de Aracaju agradece" message and next spot recommendations
- ✅ Complete backend API implementation for tourist feedback storage in internal database
- ✅ Database enhanced with 10 official Aracaju tourist spots from government document
- ✅ End-to-end flow validation: QR Code → Language Selection → Spot Details → Star Rating → Feedback Form → Next Destinations Page

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Library**: Shadcn/ui components built on Radix UI primitives for accessibility
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for client-side routing
- **Maps Integration**: React-Leaflet for interactive maps showing tourist locations

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Pattern**: REST API with dedicated routes for tourist spot operations
- **Storage Layer**: In-memory storage implementation with interface for future database integration
- **Development Setup**: Vite middleware integration for hot reloading in development

## Data Storage Solutions
- **Database**: PostgreSQL (Neon) with Drizzle ORM - fully operational with data persistence
- **Tables**: 
  - `tourist_spots`: Multilingual tourist spot data with coordinates, categories, images, and features
  - `tourist_feedback`: Visitor feedback with ratings, demographics, and opinions
  - `tourist_passports`: Digital passports for gamification and visitor tracking
  - `badges`: Achievement/badge definitions with multilingual descriptions
  - `tourist_badges`: Earned badges junction table
  - `spot_visits`: Visit tracking with passport and feedback linkage
  - `tourist_routes`: Curated routes with duration and category filters
- **Seeding**: Automatic initialization with 10 Aracaju tourist spots and 5 default badges

## Authentication and Authorization
- **Current**: Basic user schema defined but not actively implemented
- **Planned**: User management system with authentication capabilities

## Key Features
- **QR Code Integration**: Each tourist spot has a unique QR code for easy access
- **Multilingual Support**: Content available in Portuguese, English, and Spanish
- **Digital Passport System**: Automatic tourist tracking with unique passport codes
- **Gamification**: Badge/achievement system with points, levels, and progress tracking
- **Next Destinations Page**: Seamless exploration flow with GPS navigation to other spots
- **Visit Tracking**: Automatic recording of spot visits linked to digital passports
- **Interactive Maps**: Real-time location display with geolocation support
- **Category Filtering**: Spots organized by categories (beaches, historic, culture, restaurants)
- **Search Functionality**: Text-based search across tourist attractions
- **Mobile-First Design**: Responsive layout optimized for mobile devices
- **Accessibility**: VLibras integration for Brazilian Sign Language support
- **Analytics Dashboard**: Real-time visitor statistics, ratings, and feedback reports

## Component Structure
- **Modular UI Components**: Reusable components following atomic design principles
- **Custom Hooks**: Geolocation, language switching, and mobile detection utilities
- **Page Components**: Home, spot details, language selector, QR scanner, and admin pages

# External Dependencies

## Core Frontend Dependencies
- **React Ecosystem**: React 18 with TypeScript support
- **UI Framework**: Radix UI components for accessibility-first design
- **Styling**: Tailwind CSS for utility-first styling
- **Maps**: Leaflet and React-Leaflet for interactive mapping
- **State Management**: TanStack Query for server state synchronization
- **Forms**: React Hook Form with Zod validation

## Backend Dependencies
- **Web Framework**: Express.js for API server
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Database Provider**: Neon Database serverless PostgreSQL
- **Development**: tsx for TypeScript execution and hot reloading

## Build and Development Tools
- **Build Tool**: Vite for fast development and optimized builds
- **TypeScript**: Full TypeScript support across frontend and backend
- **Code Quality**: ESLint and Prettier (implied by project structure)
- **Deployment**: Configured for production builds with static asset serving

## Accessibility and Internationalization
- **VLibras**: Brazilian government's sign language translation service
- **Geolocation API**: Native browser geolocation for location-based features
- **Speech Synthesis API**: Text-to-speech for language selection guidance

## Planned Integrations
- **PostgreSQL**: Production database setup with connection pooling
- **Session Management**: Connect-pg-simple for PostgreSQL session storage
- **QR Code Generation**: For creating unique QR codes for each tourist spot