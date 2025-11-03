# GameAtlas - Visual Style Guide

## Design System Overview

GameAtlas uses a consistent design system built on TailwindCSS with custom semantic tokens. The design emphasizes clarity, professionalism, and gaming aesthetics.

---

## Color Palette

### Primary Brand Colors
```css
--atlas-purple: #6E59A5    /* Primary brand color - buttons, CTAs, highlights */
--atlas-teal: #33C3F0      /* Secondary brand color - accents, links */
--atlas-orange: #F97316    /* Tertiary accent - warnings, special features */
--atlas-dark: #221F26      /* Dark backgrounds, text */
--atlas-light: #F6F6F7     /* Light backgrounds, subtle sections */
```

### Semantic Theme Colors (Light Mode)
```css
--background: 0 0% 100%              /* White backgrounds */
--foreground: 240 10% 3.9%           /* Dark text */
--card: 0 0% 100%                    /* White cards */
--card-foreground: 240 10% 3.9%     /* Card text */
--primary: 262.1 83.3% 57.8%        /* Mapped to atlas-purple */
--primary-foreground: 210 40% 98%   /* White on primary */
--secondary: 240 4.8% 95.9%         /* Light gray backgrounds */
--secondary-foreground: 240 5.9% 10% /* Dark text on secondary */
--muted: 240 4.8% 95.9%             /* Muted backgrounds */
--muted-foreground: 240 3.8% 46.1%  /* Muted text */
--accent: 240 4.8% 95.9%            /* Accent backgrounds */
--accent-foreground: 240 5.9% 10%   /* Accent text */
--destructive: 0 84.2% 60.2%        /* Red for destructive actions */
--border: 240 5.9% 90%              /* Border color */
--input: 240 5.9% 90%               /* Input borders */
--ring: 262.1 83.3% 57.8%           /* Focus rings */
```

### Dark Mode Support
All semantic tokens have dark mode variants defined in `.dark` class.

---

## Typography

### Font Family
- Primary: System font stack (default)
- Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

### Font Sizes & Weights
```css
/* Headings */
.text-4xl   /* 2.25rem - Hero titles */
.text-3xl   /* 1.875rem - Page titles */
.text-2xl   /* 1.5rem - Section titles */
.text-xl    /* 1.25rem - Card titles */
.text-lg    /* 1.125rem - Subheadings */

/* Body */
.text-base  /* 1rem - Regular text */
.text-sm    /* 0.875rem - Small text */
.text-xs    /* 0.75rem - Tiny text */

/* Weights */
.font-bold       /* 700 */
.font-semibold   /* 600 */
.font-medium     /* 500 */
.font-normal     /* 400 */
```

---

## Screen-by-Screen Visual Descriptions

### 1. Landing Page (/)
**Layout:** Full-width, vertically scrolling

**Sections:**
- **Navbar:** 
  - Fixed top, white background, subtle shadow
  - Logo on left (GameAtlas with teal accent)
  - Navigation links centered
  - Login/Signup buttons on right
  - Height: 64px
  - Responsive hamburger menu on mobile

- **Hero Section:**
  - Purple-to-teal gradient background
  - Large white headline (48-64px)
  - Subtext in white/light gray
  - Two CTAs: Primary (purple) and Secondary (outlined)
  - Right side: Dashboard preview image
  - Min height: 600px

- **Features Section:**
  - Light gray background (#F6F6F7)
  - 3-column grid on desktop, stacked on mobile
  - Each feature card:
    - White background
    - Rounded corners (16px)
    - Purple icon in circle
    - Bold title
    - Gray descriptive text
    - Hover effect: lift + shadow

- **Pricing Section:**
  - White background
  - 4-column pricing cards
  - Middle card ("Professional") highlighted with purple border and scale
  - Checkmarks in green
  - Purple CTA buttons

- **Call to Action:**
  - Purple gradient background
  - Centered white text
  - Large CTA button
  - Max width: 800px centered

- **Footer:**
  - Dark background (#221F26)
  - White text
  - 4-column layout (Logo, Product, Company, Legal)
  - Links in gray with white hover
  - Copyright centered at bottom

---

### 2. Dashboard (/dashboard)
**Layout:** Full-width content area below navbar

**Visual Elements:**
- **Header:**
  - Welcome message with user name
  - "Take Tour" button (outline) on right
  - Spacing: 32px top/bottom

- **Quick Actions:**
  - 3 cards in grid
  - Each with colored icon box (purple, teal, purple-600)
  - Title and description
  - Hover: shadow increase
  - Height: auto, equal heights

- **Projects Grid:**
  - 2-3 column responsive grid
  - Each project card:
    - White background
    - Status badge (top-right, colored by status)
    - Genre icon with text
    - Platform text
    - Update date with calendar icon
    - Delete dropdown (appears on hover)
    - Hover: shadow lift

- **Empty State:**
  - Centered content
  - Large gray icon circle
  - Bold headline
  - Descriptive text
  - Purple CTA button
  - Tip box with light background

- **Getting Started Steps:**
  - 4-column grid
  - Step 1: Green (completed)
  - Step 2: Blue (current)
  - Steps 3-4: Gray (upcoming)
  - Numbered circles
  - Click-through on active steps

---

### 3. Project Detail (/project/:id)
**Layout:** Sidebar + main content

**Sidebar (Left):**
- Fixed width: 240px (expanded), 56px (collapsed)
- White background
- Project name at top
- Navigation sections:
  - Game Intelligence (target icon)
  - Marketing Opportunities (users icon)
  - Analytics (bar chart icon)
  - Settings (settings icon)
- Active state: Purple background, white text
- Stats badges at bottom (matches, communities, creators)

**Main Content:**
- Header:
  - Project name + description
  - Status badge
  - Genre/platform pills
  - Settings button (right)

- **Game Intelligence Tab:**
  - Signal profile builder card
  - Theme/mechanic tag selectors
  - AI suggestion buttons
  - Match results in card grid
  - Each match shows:
    - Game cover image
    - Title + developer
    - Match score (purple badge)
    - Key metrics
    - "View Details" link

- **Marketing Opportunities Tab:**
  - Two sub-tabs: Communities, Creators
  - Filter panel (top)
  - Results in card grid or list
  - Each community/creator card:
    - Activity indicator (colored dot)
    - Name + stats
    - Relevance score
    - "View" or "Track" button

- **Analytics Tab:**
  - Tab navigation: Market, Competitor, Player, Marketing
  - Charts using Recharts library
  - Color scheme: Purple/teal gradients
  - Metrics cards (white background, colored borders)
  - Date range selector

---

### 4. Discovery Page (/discovery)
**Layout:** Centered content, max-width 1200px

**Visual Elements:**
- Large centered title
- Explanatory text
- Project selection grid (if projects exist)
- Empty state with two cards:
  - "Create Project" (purple)
  - "Select Project" (outline)
- Info box (blue background, blue border)

---

### 5. Analytics Page (/analytics)
**Layout:** Similar to Discovery
- Same layout structure as Discovery page
- Links to project analytics tabs
- Projects show "View Analytics" CTA
- Info box (green background, green border)

---

### 6. Settings (/settings)
**Layout:** Horizontal tabs + content area

**Tab Navigation:**
- Profile, Security, API Keys, Organization, Notifications, Data Export
- Active tab: Purple underline
- Tab content in white cards

**Forms:**
- Label above input
- Input: Gray border, focus purple ring
- Submit buttons: Purple
- Cancel buttons: Outline gray
- Helper text: Small gray text below inputs

---

### 7. Authentication Pages (/login, /signup, /reset-password)
**Layout:** Centered card on gradient background

**Visual Elements:**
- Background: Subtle purple-to-blue gradient
- Card:
  - White background
  - Max width: 400px
  - Shadow + rounded corners
  - Logo/title at top
  - Form fields with labels
  - Purple submit button (full width)
  - Links in teal
  - Divider with "or" text
  - Social login options (future)

---

## Component Styles

### Buttons
```css
/* Primary */
.atlas-button-primary {
  background: #6E59A5;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s;
}
.atlas-button-primary:hover {
  opacity: 0.9;
  transform: translateY(-2px);
}

/* Secondary */
.atlas-button-secondary {
  background: #33C3F0;
  color: white;
  /* Same padding/transition */
}

/* Outline */
.atlas-button-outline {
  background: transparent;
  color: #6E59A5;
  border: 2px solid #6E59A5;
  /* Same padding/transition */
}
```

### Cards
```css
.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  transition: all 0.3s;
}
.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.15);
}
```

### Status Badges
```css
/* Development */
.badge-development {
  background: #DBEAFE;  /* blue-100 */
  color: #1E40AF;       /* blue-800 */
}

/* Published */
.badge-published {
  background: #D1FAE5;  /* green-100 */
  color: #065F46;       /* green-800 */
}

/* Archived */
.badge-archived {
  background: #F3F4F6;  /* gray-100 */
  color: #1F2937;       /* gray-800 */
}
```

### Gradients
```css
.hero-gradient {
  background: linear-gradient(135deg, #6E59A5 0%, #33C3F0 100%);
}
```

---

## Responsive Breakpoints

```css
/* Mobile First Approach */
sm: 640px   /* Small devices */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

### Responsive Patterns
- Mobile: Single column, full width, stacked cards
- Tablet: 2 columns, hamburger menu
- Desktop: 3+ columns, full navigation

---

## Animations

```css
/* Fade in */
@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Pulse subtle */
@keyframes pulse-subtle {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.8; }
}
```

---

## Accessibility

- **Focus states:** Purple ring around all interactive elements
- **Color contrast:** WCAG AA compliant
- **Alt text:** All images have descriptive alt attributes
- **Keyboard navigation:** Tab order follows visual flow
- **ARIA labels:** Used on icon-only buttons
- **Semantic HTML:** Proper heading hierarchy (h1 → h6)

---

## Icons

**Library:** Lucide React

**Common Icons:**
- Plus: New/Create actions
- Target: Projects/Goals
- Users: Communities/Teams
- TrendingUp: Analytics
- BarChart: Analytics
- Calendar: Dates
- Settings: Configuration
- Search: Discovery
- CheckCircle: Success states
- AlertCircle: Warnings
- X: Close/Delete

**Icon Sizing:**
- Small: 16px (w-4 h-4)
- Medium: 20px (w-5 h-5)
- Large: 24px (w-6 h-6)
- Extra Large: 32px (w-8 h-8)

---

## Spacing Scale

```css
0.5rem = 8px   /* gap-2 */
1rem = 16px    /* gap-4 */
1.5rem = 24px  /* gap-6 */
2rem = 32px    /* gap-8 */
3rem = 48px    /* gap-12 */
4rem = 64px    /* gap-16 */
```

---

## Shadow System

```css
/* Subtle */
shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05)

/* Default */
shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)

/* Medium */
shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)

/* Large */
shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)

/* Extra Large */
shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)
```

---

## Design Principles

1. **Clarity First:** Every element should have clear purpose
2. **Consistent Spacing:** Use 8px base grid
3. **Hierarchy:** Size, weight, and color establish importance
4. **Feedback:** Hover states, loading states, success/error states
5. **Progressive Disclosure:** Show advanced features gradually
6. **Mobile Responsive:** Design mobile-first, enhance for desktop
7. **Performance:** Minimize animations on low-end devices
8. **Accessibility:** WCAG 2.1 Level AA compliance
