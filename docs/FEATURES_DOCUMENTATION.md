# GameAtlas - Complete Features Documentation

## Table of Contents
1. [Core Features](#core-features)
2. [User Management](#user-management)
3. [Project Management](#project-management)
4. [Discovery & Intelligence](#discovery--intelligence)
5. [Analytics & Tracking](#analytics--tracking)
6. [Marketing Tools](#marketing-tools)
7. [Team Collaboration](#team-collaboration)

---

## Core Features

### 1. AI-Powered Game Signal Profile
**Location:** Project Detail → Game Intelligence Tab

**Description:** 
Creates a comprehensive marketing profile for games using AI analysis of game metadata, themes, and mechanics.

**Functionalities:**
- Input game description, genre, platform, and key details
- AI analyzes game data and suggests relevant themes/mechanics
- Auto-complete suggestions for tags based on similar successful games
- Signal profile building using IGDB, RAWG, and Steam APIs
- Export/import signal profiles for reuse
- Version history tracking for profile changes

**User Flow:**
1. User creates new project with basic game info
2. System fetches game data from external APIs (IGDB, RAWG, Steam)
3. AI generates suggested themes and mechanics
4. User refines and confirms signal profile
5. Profile is used for all matching algorithms

---

### 2. Cross-Game Match Engine
**Location:** Project Detail → Game Intelligence Tab

**Description:**
Identifies similar games based on developer circumstances, gameplay mechanics, and launch context rather than just theme similarity.

**Functionalities:**
- Matches games by developer profile (first-time dev, team size, budget)
- Analyzes launch circumstances (platform, marketing approach, timing)
- Considers gameplay mechanics and target audience overlap
- Provides match confidence scores with explanations
- Shows trajectory data: what happened after launch
- Filters by revenue range, release date, and success metrics
- Links to similar games' marketing strategies

**Matching Algorithm Priorities:**
1. Developer Profile (40%): First game, team size, budget level
2. Launch Context (30%): Platform, distribution, marketing approach
3. Gameplay Similarity (20%): Genre, mechanics, style
4. Target Audience (10%): Age range, player preferences

**Data Sources:**
- IGDB for game metadata and mechanics
- RAWG for community engagement metrics
- Steam for sales data and player reviews

---

### 3. Community Discovery Engine
**Location:** Project Detail → Marketing Opportunities Tab → Communities

**Description:**
AI-powered discovery of relevant gaming communities on Reddit, Discord, and forums where target players are active.

**Functionalities:**
- Reddit integration via Reddit API
  - Subreddit discovery based on game matches
  - Activity level analysis (posts/day, comments/day)
  - Community sentiment tracking
  - Posting guidelines extraction
  - Best posting times recommendation
  - Moderator identification
  
- Discord server recommendations
  - Server size and activity metrics
  - Genre-specific communities
  - Invite link generation
  
- Community scoring system:
  - Relevance score (0-100)
  - Activity level (High/Medium/Low)
  - Engagement quality score
  - Spam risk assessment
  
- Filtering capabilities:
  - By platform (Reddit, Discord)
  - By size (member count ranges)
  - By activity level
  - By content type (discussion, media, dev-friendly)

**Real-time Data:**
- Recent post topics in community
- Trending discussions
- Community rules and guidelines
- Response rate to similar game posts

---

### 4. Creator Match System
**Location:** Project Detail → Marketing Opportunities Tab → Creators

**Description:**
Identifies YouTube content creators, Twitch streamers, and other influencers who cover similar games.

**Functionalities:**
- YouTube API integration:
  - Search creators by game coverage history
  - Channel size (subscriber count)
  - Average view count and engagement rate
  - Video upload frequency
  - Recent games covered
  - Audience demographics (when available)
  - Contact information extraction
  
- Creator scoring:
  - Relevance score based on content history
  - Engagement rate (views/subs ratio)
  - Consistency score (upload frequency)
  - Audience match (based on similar games)
  
- Filtering and sorting:
  - By subscriber count ranges
  - By engagement rate
  - By platform (YouTube, Twitch)
  - By content type (reviews, let's plays, tutorials)
  - By geographic region
  
- CRM functionality:
  - Track outreach attempts
  - Note-taking for each creator
  - Status tracking (contacted, responded, declined, collaborated)
  - Follow-up reminders

---

### 5. Marketing Campaign Manager
**Location:** Project Detail → Marketing Opportunities Tab

**Description:**
Plan, execute, and track marketing campaigns across multiple platforms.

**Functionalities:**
- Campaign creation wizard
- Multi-platform campaign support
- Content template library:
  - Reddit post templates
  - Discord announcement templates
  - Creator outreach email templates
  - Social media post templates
  
- Campaign scheduling:
  - Best time recommendations
  - Multi-platform scheduling
  - Automated posting (future feature)
  
- Performance tracking:
  - Click-through rates
  - Engagement metrics
  - Conversion tracking
  - ROI calculation
  
- A/B testing:
  - Multiple message variations
  - AI-powered copy suggestions
  - Performance comparison

---

### 6. Analytics Dashboard
**Location:** Project Detail → Analytics Tab

**Description:**
Comprehensive performance tracking and competitive intelligence.

**Functionalities:**

#### Market Performance Analytics:
- Visibility metrics across platforms
- Search ranking tracking
- Community mention tracking
- Sentiment analysis
- Market share estimation

#### Competitor Analysis:
- Track similar games' marketing activities
- Compare engagement metrics
- Identify successful strategies
- Gap analysis (untapped opportunities)

#### Player Behavior Analytics:
- Audience demographics
- Engagement patterns
- Conversion funnels
- Retention metrics

#### Marketing Intelligence:
- Campaign performance over time
- Channel effectiveness comparison
- ROI tracking per channel
- Attribution modeling

**Data Visualization:**
- Line charts for trends
- Bar charts for comparisons
- Pie charts for distributions
- Heat maps for timing optimization

---

## User Management

### 7. Authentication System
**Location:** /login, /signup, /reset-password

**Functionalities:**
- Email/password authentication via Supabase Auth
- Email verification
- Password reset flow
- Session management
- "Remember me" functionality
- Protected route system

---

### 8. User Settings
**Location:** /settings

**Functionalities:**

#### Account Profile:
- Update display name
- Change email
- Update password
- Avatar upload
- Account deletion

#### API Keys Management:
- YouTube API key configuration
- Reddit API credentials
- IGDB API credentials
- RAWG API key
- Gemini AI API key
- Key validation and testing

#### Notification Settings:
- Email notification preferences
- Campaign alert settings
- Weekly report subscriptions
- New opportunity alerts

#### Security:
- Two-factor authentication (planned)
- Active session management
- Login history
- Connected devices

---

## Project Management

### 9. Project Creation & Management
**Location:** /project/new, /dashboard

**Functionalities:**
- Create new game project
- Project metadata:
  - Game name
  - Description
  - Genre (single and multiple)
  - Platform (PC, Console, Mobile)
  - Development status
  - Release date
  - Website/Steam link
  - Budget range
  - Team size
  
- Project templates for common scenarios
- Import game data from Steam/IGDB
- Duplicate existing projects
- Archive completed projects
- Delete projects (with confirmation)
- Project status tracking:
  - Development
  - Published
  - Archived

---

### 10. Discovery Lists
**Location:** Within Projects → Discovery

**Functionalities:**
- Save custom discovery filters
- Name and describe discovery lists
- Filter by:
  - Platforms
  - Genres
  - Price ranges
  - Business models
  - Release date ranges
  - Player count
  
- Share discovery lists with team
- Export results as CSV/JSON
- Schedule automated updates

---

## Team Collaboration

### 11. Organization Management
**Location:** Settings → Organization, /team

**Functionalities:**
- Create organization/studio account
- Invite team members by email
- Role-based access control:
  - Owner (full access)
  - Admin (project management)
  - Member (view and edit assigned projects)
  - Viewer (read-only access)
  
- Usage limits per plan:
  - Project limits
  - Team member limits
  - API call limits
  - Storage limits
  
- Accept/decline team invitations
- Remove team members
- Transfer project ownership

---

### 12. Project Templates
**Location:** Project Creation → Templates

**Functionalities:**
- Pre-configured project setups:
  - Indie Developer First Game
  - Mobile F2P Launch
  - Steam Early Access
  - Console Port Marketing
  - Kickstarter Campaign
  
- Template customization
- Save custom templates
- Share templates with team

---

## Marketing Tools

### 13. AI Copy Generation
**Location:** Throughout app in marketing contexts

**Functionalities:**
- Gemini AI-powered copy generation
- Context-aware suggestions:
  - Reddit post titles and content
  - Discord announcements
  - Creator outreach emails
  - Social media posts
  
- Multiple variations per request
- Tone adjustment (casual, professional, enthusiastic)
- Length controls
- Regenerate until satisfied
- Copy to clipboard

---

### 14. Best Practices Library
**Location:** Throughout app as tooltips and guides

**Functionalities:**
- Community-specific guidelines
- Timing recommendations
- Content format suggestions
- Success stories and case studies
- Common mistakes to avoid
- Platform-specific best practices

---

## Additional Features

### 15. Onboarding Wizard
**Location:** First login at /dashboard

**Functionalities:**
- Welcome screen with product overview
- Feature tour (4 steps)
- First project creation assistance
- API key setup guidance
- Sample data for testing
- Skip option (can restart via "Take Tour")

---

### 16. Demo Mode
**Location:** /demo (public)

**Functionalities:**
- Interactive preview of platform features
- Sample signal profile
- Mock match engine results
- Community map preview
- Creator match preview
- No login required

---

### 17. Limit Management
**Location:** Transparent across app

**Functionalities:**
- Track usage per organization:
  - Projects created/limit
  - API calls made/limit
  - Team members/limit
  - Storage used/limit
  
- Upgrade prompts when limits reached
- Usage reset schedules
- Plan comparison on limits
- Grace period for overages

---

### 18. Data Export
**Location:** Settings → Data Export

**Functionalities:**
- Export all user data
- Format options (JSON, CSV, PDF)
- Scheduled exports
- GDPR compliance
- Data retention policy

---

## Planned Features (Not Yet Implemented)

### 19. Advanced Features (Roadmap)
- Two-factor authentication
- Advanced campaign automation
- Custom API integrations
- White-label reporting
- Automated social posting
- In-app creator messaging
- Budget allocation optimizer
- A/B test automation
- Custom analytics dashboards
- Webhook integrations

---

## Technical Stack

### Frontend:
- React 18.3
- TypeScript
- Vite
- TailwindCSS
- Shadcn/ui components
- React Router
- TanStack Query (React Query)
- Recharts for analytics

### Backend:
- Supabase (PostgreSQL database)
- Supabase Auth
- Supabase Edge Functions (Deno)
- Row Level Security policies

### External APIs:
- YouTube Data API v3
- Reddit API
- IGDB API (Twitch)
- RAWG API
- Steam Web API
- Google Gemini AI API

### Deployment:
- Lovable Cloud hosting
- Automatic CI/CD
- Custom domain support
- Edge caching
