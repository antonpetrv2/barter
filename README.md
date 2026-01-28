# BARTER - Retro Computer Bartering Platform

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Version](https://img.shields.io/badge/version-1.0.0-green.svg)

## 📋 Project Description

**Barter** is a specialized web platform designed for enthusiasts and collectors to exchange vintage computers, retro hardware, and related components. The platform facilitates direct peer-to-peer bartering without monetary transactions, fostering a community of retro computing enthusiasts.

### Key Features
- **User Authentication**: Secure registration and login with email verification
- **Listing Management**: Create, edit, and delete listings with image uploads
- **Category Filtering**: Browse by computer type (desktops, laptops, peripherals, etc.)
- **Search Functionality**: Find specific items quickly
- **Soft Delete System**: Preserve data and recover accidentally deleted listings
- **Image Optimization**: Automatic WebP conversion for reduced storage costs
- **Admin Panel**: User management, approval system, and moderation tools
- **Contact System**: Integrated contact form with anti-spam protection
- **Responsive Design**: Mobile-first Bootstrap 5 interface

### User Roles
- **Visitors**: Browse listings and view details
- **Registered Users**: Create listings, manage their items, send messages
- **Administrators**: User approval, moderation, platform management

---

## 🏗️ Architecture

### Frontend
- **Language**: Vanilla JavaScript (ES6+)
- **Build Tool**: Vite 6.0
- **UI Framework**: Bootstrap 5.3
- **Icons**: Bootstrap Icons
- **Routing**: Hash-based SPA router with dynamic parameters
- **Image Processing**: Canvas API for client-side compression and WebP conversion

### Backend (Supabase)
- **Database**: PostgreSQL with Row Level Security (RLS)
- **Authentication**: Supabase Auth with email/password
- **Storage**: Supabase Storage buckets for image uploads
- **API**: Auto-generated REST API from Supabase

### Database Schema

**Tables:**
1. **users** - User profiles and authentication
   - id, email, full_name, phone, city, avatar_url, rating, role, status
   
2. **listings** - Item listings for barter
   - id, user_id, title, description, category, price, location, condition, year, working, images, deleted_at
   
3. **categories** - Item categories
   - id, name, icon, description
   
4. **messages** - User-to-user messaging
   - id, sender_id, receiver_id, listing_id, message, read
   
5. **reviews** - User ratings and reviews
   - id, reviewer_id, reviewed_user_id, listing_id, rating, review_text

### File Structure
```
barter/
├── public/                 # Static assets
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── footer.js       # Footer with links
│   │   ├── navbar.js       # Navigation bar with auth state
│   │   └── imageUpload.js  # Drag-drop image upload with compression
│   ├── pages/              # Page components
│   │   ├── home.js         # Landing page with categories
│   │   ├── listings.js     # Browse all listings with filters
│   │   ├── listingDetail.js# Single listing view
│   │   ├── auth.js         # Login/register forms
│   │   ├── myListings.js   # User's listings management
│   │   ├── createListing.js# Create new listing form
│   │   ├── editListing.js  # Edit existing listing
│   │   ├── admin.js        # Admin panel
│   │   ├── contact.js      # Contact form
│   │   └── terms.js        # Terms of service
│   ├── services/
│   │   └── supabaseService.js # All backend operations (auth, CRUD, storage)
│   ├── styles/
│   │   └── main.css        # Global styles
│   ├── utils/              # Helper functions (future)
│   └── main.js             # Entry point, router setup
├── .env.local              # Environment variables (not committed)
├── database.sql            # Database schema
├── soft-delete-migration.sql # Soft delete migration
├── SUPABASE_SETUP.md       # Supabase configuration guide
├── package.json
└── vite.config.js

```

---

## 🚀 Local Development Setup

### Prerequisites
- Node.js 18+ and npm
- Supabase account (free tier available)
- Git

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/barter.git
cd barter

```bash
git clone https://github.com/your-username/barter.git
cd barter
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Supabase Setup
1. Create a free account at [supabase.com](https://supabase.com)
2. Create a new project
3. Run the SQL schema from `database.sql` in Supabase SQL Editor
4. Get your API credentials from Project Settings > API
5. Enable Email Auth in Authentication > Providers

### Step 4: Configure Environment
```bash
# Create environment file
cp .env.example .env.local

# Edit .env.local with your Supabase credentials:
# VITE_SUPABASE_URL=https://your-project.supabase.co
# VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Step 5: Run Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 6: Create Demo Users
In Supabase SQL Editor, run:
```sql
-- Create demo user
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('demo@barter.bg', crypt('demo123', gen_salt('bf')), now());

-- Create admin user
INSERT INTO auth.users (email, encrypted_password, email_confirmed_at)
VALUES ('admin@barter.bg', crypt('admin123', gen_salt('bf')), now());

-- Set admin role
UPDATE users SET role = 'admin', status = 'approved' 
WHERE email = 'admin@barter.bg';
```

---

## 📁 Key Folders and Files

### `/src/pages/` - Page Components
- **home.js**: Landing page with category icons linking to filtered listings
- **listings.js**: Main listings page with search, filters, and pagination
- **listingDetail.js**: Single listing view with image gallery and seller info
- **auth.js**: Login and registration forms with Supabase Auth integration
- **myListings.js**: User dashboard for managing own listings (edit, delete, restore)
- **createListing.js**: Form for creating new listings with image upload
- **editListing.js**: Form for editing existing listings with image management
- **admin.js**: Admin panel with user management, approval system, statistics
- **contact.js**: Contact form with captcha and email integration (Web3Forms)
- **terms.js**: Terms of service page

### `/src/components/` - Reusable Components
- **navbar.js**: Responsive navigation bar with conditional rendering based on auth state
- **footer.js**: Footer with links to pages and copyright info
- **imageUpload.js**: Drag-and-drop image upload component with:
  - Client-side WebP compression
  - Resize to 800x600px
  - Multiple file support (max 3 images)
  - Preview gallery with delete functionality

### `/src/services/` - Backend Services
- **supabaseService.js**: Centralized service for all backend operations
  - `authService`: login, register, logout, getCurrentUser, getUserProfile
  - `listingsService`: getAllListings, getUserListings, getListingById, createListing, updateListing, deleteListing (soft), restoreListing, permanentlyDeleteListing
  - `adminService`: getAllUsers, updateUserStatus, deleteUser, makeAdmin, getStats
  - `storageService`: uploadImage, uploadMultipleImages, deleteImage

### Root Files
- **database.sql**: Complete PostgreSQL schema with RLS policies
- **soft-delete-migration.sql**: Migration script to add deleted_at column
- **SUPABASE_SETUP.md**: Detailed Supabase configuration instructions
- **vite.config.js**: Vite build configuration
- **.env.local**: Environment variables (not committed to Git)

---

## 🔧 Technologies Used

| Category | Technology |
|----------|-----------|
| **Frontend** | HTML5, CSS3, JavaScript (ES6+) |
| **Build Tool** | Vite 6.0 |
| **UI Framework** | Bootstrap 5.3 |
| **Icons** | Bootstrap Icons |
| **Backend** | Supabase (PostgreSQL + Auth + Storage) |
| **Image Processing** | Canvas API, WebP format |
| **Email Service** | Web3Forms API |
| **Version Control** | Git & GitHub |

---

---

## 🎯 Features Status

### ✅ Implemented
- Multi-page navigation with hash-based routing
- User authentication (login/register with Supabase)
- Browse listings with category filters and search
- Detailed listing view with image gallery
- Create new listings with WebP image optimization
- Edit listings with image management
- Soft delete system (trash/restore functionality)
- Admin panel with user management and statistics
- Contact form with anti-spam captcha
- Terms of service page
- Responsive Bootstrap UI
- Row Level Security policies

### 🔜 Planned Features
- User-to-user messaging system
- User ratings and reviews
- Profile pages with user statistics
- Email notifications
- Advanced search with multiple filters
- Favorites/watchlist functionality

---

## 📊 Demo Credentials

For testing the app, use the following demo account:

**Regular User:**
- Email: `demo@barter.bg`
- Password: `demo123`

**Admin User:**
- Email: `admin@barter.bg`
- Password: `admin123`

> **Note**: These credentials work only if the Supabase database is configured and the demo users are created.

---

## 🛠️ Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build locally
npm run preview
```

The build output will be in the `dist/` folder, ready for deployment to Netlify, Vercel, or any static hosting service.

---

## 🤝 Development Guidelines

### Code Style
- Use ESM modules (import/export)
- Functional programming preferred over classes
- ES6+ features (arrow functions, template literals, const/let)
- Mobile-first responsive design
- Semantic HTML5 tags

### No External Frameworks
- ❌ No React, Vue, Angular
- ❌ No TypeScript
- ❌ No complex build pipelines
- ✅ Pure HTML, CSS, and Vanilla JavaScript

---

## 📝 Project Phases

### Phase 1 ✅ - Foundation
- Project setup with Vite and Bootstrap
- Folder structure and basic components

### Phase 2 ✅ - Multi-page Navigation
- Hash-based router with dynamic parameters
- All core pages implemented

### Phase 3 ✅ - Supabase Integration
- Auth service with login/register
- Database schema with RLS policies
- Real-time data from PostgreSQL

### Phase 4 ✅ - Core Features
- Listing CRUD operations
- Image uploads with WebP optimization
- Soft delete system
- Admin panel

### Phase 5 🔜 - Polish & Deploy
- Messaging system
- Performance optimization
- Production deployment

---

## 📄 License

ISC License - see LICENSE file for details

---

## 💬 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/your-username/barter/issues)
- **Telegram**: [Join our community](https://t.me/+D22g7iCjMR44ZTg8)
- **Contact**: Use the contact form on the platform

---

**Built with ❤️ for retro computing enthusiasts**

*This project was developed as part of the SoftUni AI-Assisted Development course*
