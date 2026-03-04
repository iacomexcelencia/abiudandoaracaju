# Design Guidelines: AJUDANDO AJU Tourism Platform

## Design Approach
**Reference-Based with Institutional Authority**: Drawing inspiration from Airbnb's destination cards, Duolingo's gamification UI, and government portal accessibility standards. Balancing engaging tourism experience with institutional credibility.

## Color Palette

**Primary Colors:**
- Orange Primary: 25 95% 53% (vibrant institutional orange)
- Orange Dark: 25 80% 45% (hover states, emphasis)
- White: 0 0% 100%
- Dark Gray: 220 15% 20% (text, backgrounds)
- Light Gray: 220 10% 96% (section backgrounds)

**Semantic Colors:**
- Success (badges): 142 70% 45%
- Info (analytics): 210 85% 55%
- Warning (achievements): 45 90% 55%

## Typography

**Fonts:**
- Headings: Montserrat (700, 600) - modern institutional authority
- Body: Inter (400, 500) - exceptional readability
- Accents/Stats: Poppins (600) - gamification elements

**Scale:**
- Hero: text-5xl lg:text-7xl font-bold
- Section Headers: text-3xl lg:text-4xl font-bold
- Card Titles: text-xl font-semibold
- Body: text-base leading-relaxed
- Small/Meta: text-sm

## Layout System

**Spacing Primitives:** Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm.

**Container Strategy:**
- Full-width hero and major sections
- Inner content: max-w-7xl mx-auto px-4 sm:px-6 lg:px-8
- Cards/Content: max-w-6xl for reading comfort
- Dashboard: Full viewport with sidebar navigation

**Grid Patterns:**
- Tourist Spots: 1-2-3 column grid (mobile-tablet-desktop)
- Badges/Achievements: 2-3-4 column grid
- Analytics: 1-2 column dashboard cards

## Component Library

### Navigation
**Sticky Header:** Dark gray (220 15% 20%) background, white text, orange accent on active items, institutional logo left, navigation center, user profile/points right.

### Hero Section
**Full-width immersive hero** (85vh):
- Large hero image: Aracaju beach/landmark panorama with gradient overlay (dark gray 40% opacity)
- Centered content: Large white headline "Explore Aracaju", orange subtitle "Descubra, Colecione, Conquiste"
- Primary CTA: Large orange button "Começar Aventura" with white text
- Secondary info: Small badge showing "12,000+ visitantes explorando"
- QR code integration teaser below fold

### Tourist Spot Cards
**Elevated card design:**
- Rounded corners (rounded-xl), subtle shadow (shadow-lg)
- Image: aspect-ratio-video (16:9), object-cover
- Overlay gradient for QR badge overlay
- Content: White background, dark gray text
- Badge indicator: Small orange pill showing "5 badges disponíveis"
- Quick stats: Visitors count, difficulty level
- Hover: Slight scale transform, deeper shadow

### Digital Passport Section
**Interactive passport display:**
- Large card mimicking physical passport aesthetic
- Cover: Orange with institutional seal
- Interior: Grid of stamp/badge slots (some filled, some empty/grayed)
- Progress bar: Orange fill showing completion percentage
- Stats sidebar: Total visits, badges earned, rank

### Gamification Elements

**Badge Cards:**
- Hexagonal or shield-shaped containers
- Locked state: Grayscale with lock icon overlay
- Unlocked: Full color with glow effect (orange shadow)
- Rarity indicators: Bronze/Silver/Gold borders

**Achievement Notifications:**
- Toast-style slides from top-right
- Orange accent bar, white background
- Badge icon, achievement name, points earned

### Analytics Dashboard
**Admin/Public Dashboard:**
- Sidebar navigation: Dark gray background, orange active states
- Card-based layout: White cards with shadow-md
- Charts: Orange/dark gray color scheme for data visualization
- Stats cards: Large numbers (text-4xl), orange accent icons
- Filters: Dropdown selects with orange focus rings

### Transparency Panel
**Public data display:**
- Clean table layouts: Striped rows (light gray alternating)
- Headers: Dark gray background, white text
- Download buttons: Orange outline variant
- Charts: Bar/line charts with orange primary color
- Info cards: White background, orange left border accent

### QR Code Integration
**Scan interface:**
- Floating action button: Orange circular button (bottom-right)
- Scanner modal: Full-screen overlay, white camera viewfinder
- Success state: Green checkmark animation, badge reveal
- Points animation: Numbers floating up with orange glow

### Forms & Inputs
**Consistent form styling:**
- Inputs: Border gray, orange focus ring (ring-orange-500)
- Labels: Dark gray, font-medium
- Buttons: Orange primary, dark gray secondary
- Validation: Green success, red error states

## Images

**Hero Image:**
Large, high-quality panoramic photograph of Aracaju's iconic coastline or landmark (Orla de Atalaia or Passarela do Caranguejo). Position: Full-width hero section background with subtle gradient overlay for text readability.

**Tourist Spot Cards:**
Professional photographs of each location (beaches, historical sites, cultural centers). Position: Card thumbnails in grid layout, 16:9 aspect ratio, object-cover to maintain consistency.

**Badge Icons:**
Custom illustrated icons representing achievements (lighthouse, beach, historical building, local food, cultural event). Position: Within badge cards and passport stamps.

**Background Patterns:**
Subtle geometric patterns or maps of Aracaju as section backgrounds. Position: Light opacity behind transparency panel and analytics sections.

**Dashboard Charts:**
Data visualization graphics showing visitor trends, popular spots, engagement metrics. Position: Analytics dashboard main content area.

## Animations

**Minimal, purposeful interactions:**
- Badge unlock: Scale + fade-in with orange glow pulse
- Card hover: Subtle lift (translateY -2px) with shadow transition
- Progress bars: Smooth width animation
- QR scan success: Checkmark draw animation
- Avoid excessive scroll animations

## Accessibility

**Dark Mode Consistency:**
- Maintain dark gray backgrounds across dashboards
- Ensure form inputs have sufficient contrast
- Orange buttons maintain WCAG AA compliance against dark backgrounds

**Focus States:**
- Clear orange focus rings (ring-2 ring-orange-500)
- Keyboard navigation fully supported
- Screen reader labels for all interactive elements

## Page Structure Recommendations

**Landing Page:** Hero → Quick Stats → Featured Tourist Spots Grid → Digital Passport Preview → How It Works → CTA

**Tourist Spots:** Filter/Search Bar → Category Tabs → Card Grid → Map Integration

**Passport:** User Stats Header → Badge Collection Grid → Achievement Timeline → Leaderboard

**Dashboard:** Sidebar Nav → KPI Cards Row → Charts (2-column) → Data Tables

**Transparency:** Info Header → Budget Cards → Spending Charts → Downloadable Reports Table