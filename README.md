# BARTER - Retro Computer Bartering Platform

## About
Barter is a web platform for exchanging retro computers and components between enthusiasts and collectors.

## Quick Start

### Installation
```bash
# Install dependencies
npm install

# Create local environment file
cp .env.example .env.local

# Start development server
npm run dev
```

### Configuration
Before running the app, you need to set up Supabase:

1. See [SUPABASE_SETUP.md](SUPABASE_SETUP.md) for detailed Supabase configuration
2. Update `.env.local` with your Supabase credentials

### Build for Production
```bash
npm run build
npm run preview
```

## Project Structure
```
src/
├── pages/          # Page components (Home, Listings, Auth, etc.)
├── services/       # Supabase service and external APIs
├── components/     # Reusable UI components (Navbar, Footer)
├── styles/         # Global CSS styles
├── utils/          # Helper functions
├── main.js         # App entry point with router
└── assets/         # Images and static files
```

## Features

### Current (Step 4) ✅
- ✅ Multi-page navigation with hash-based routing
- ✅ Home page with categories
- ✅ Browse listings from Supabase database with filters and search
- ✅ Detailed listing view with seller information
- ✅ User authentication (login/register)
- ✅ My Listings - view and manage user's own listings
- ✅ Create new listing form with validation
- ✅ Graceful fallback to demo data if Supabase not configured
- ✅ Loading states and error handling
- ✅ RLS policies ready for production
- ✅ User authentication (login/register)
- ✅ My Listings - view and manage user's own listings
- ✅ Create new listing form with validation
- ✅ Graceful fallback to demo data if Supabase not configured
- ✅ Loading states and error handling
- ✅ RLS policies ready for production
- ✅ Responsive Bootstrap UI
- ✅ Admin Panel for user management
  - User approval system (pending/approved/rejected)
  - Ban/unban users with reasons
  - Delete user accounts
  - Make users administrators
  - System statistics dashboard
  - Advanced user filtering and search


### Coming Soon (Step 5)
- 🔜 Image uploads to Supabase Storage
- 🔜 User profiles and ratings
- 🔜 Edit/Delete listings functionality
- 🔜 Messaging between users
- 🔜 Review/rating system
- 🔜 Advanced filtering and search
- 🔜 Performance optimization

## Technologies
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Build Tool**: Vite
- **UI Framework**: Bootstrap 5
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Version Control**: Git

## Development

### Tech Stack
- Node.js + npm for package management
- Vite for fast development and production builds
- Bootstrap 5 for responsive UI components
- Supabase for backend services

### No External Frameworks
- ❌ No React, Vue, Angular
- ❌ No TypeScript
- ❌ No complex build pipelines
- ✅ Pure HTML, CSS, and Vanilla JavaScript

### Code Style
- ESM modules (import/export)
- Functional programming preferred
- ES6+ features (arrow functions, template literals, const/let)
- Mobile-first responsive design

## AI Development
This project was built with AI-assisted development practices:
- See `.github/copilot-instructions.md` for detailed AI development guidelines
- Modular architecture for easy AI understanding
- Clear separation of concerns for better maintainability

## Project Phases

### Phase 1 ✅ - Foundation
- Project setup with Vite and Bootstrap
- Folder structure
- Navigation and basic components

### Phase 2 ✅ - Multi-page Navigation
- Hash-based router
- All core pages implemented
- Dynamic routing with parameters

### Phase 3 ⏳ - Supabase Integration
- Auth service with login/register
- Database schema designed
- Service layer created

### Phase 4 - Core Features
- Real database integration
- User profiles and listings management
- Messaging system

### Phase 5 - Polish & Deploy
- Error handling and validation
- Performance optimization
- Deployment setup

## Repository
- **GitHub**: [github.com/your-username/barter](https://github.com/your-username/barter)
- **Live Demo**: [barter.example.com](https://barter.example.com) (coming soon)

## License
ISC

## Support
For questions or issues, see `.github/copilot-instructions.md` for development guidelines.

---

**Built with ❤️ for the SoftUni AI course**
