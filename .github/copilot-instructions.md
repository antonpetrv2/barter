# BARTER App - AI Development Instructions

## Project Overview
**Barter** is a web platform for bartering retro computers and parts. It's a modern, multi-page JavaScript application built with Vite, Bootstrap, and Supabase.

**Target Users**: 50 members of a Telegram group (initially), expandable to public use

## Technology Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Build Tool**: Vite
- **UI Framework**: Bootstrap 5
- **Backend**: Supabase (Database, Auth, Storage)
- **Deployment**: [TBD]

## Project Architecture

### Folder Structure
```
src/
├── pages/          # Multi-page components (Home, Listings, etc.)
├── services/       # Supabase and external API services
├── components/     # Reusable UI components
├── styles/         # Global and component-specific CSS
├── utils/          # Helper functions
└── assets/         # Images, icons, static files

.github/
└── copilot-instructions.md  # This file
```

### Design Principles
1. **Modular Design**: Each feature in a separate file
2. **Multi-Page Navigation**: Router-based (not SPA with popups)
3. **Separation of Concerns**: UI, logic, and styles in separate files
4. **No Frameworks**: Plain JavaScript only (no React, Vue, TypeScript)
5. **Performance**: Lazy loading, minimal bundle size

## Development Guidelines

### File Organization
- Each page gets its own file in `src/pages/`
- Reusable components go in `src/components/`
- Business logic in `src/services/`
- Utilities in `src/utils/`
- Styles in `src/styles/`

### Naming Conventions
- **Files**: camelCase (e.g., `listingCard.js`)
- **Components**: `render{ComponentName}()` function
- **CSS Classes**: kebab-case (e.g., `.listing-card`)
- **JavaScript Variables**: camelCase

### Code Style
- Use ES6+ (const/let, arrow functions, template literals)
- Prefer functional programming over classes
- Keep functions small and focused (single responsibility)
- Add JSDoc comments for functions
- Use semantic HTML5 tags

### Bootstrap Integration
- Use Bootstrap 5 utility classes for layout
- Custom CSS only for app-specific styling
- Mobile-first responsive design
- Avoid inline styles

## Feature Implementation Plan

### Phase 1: Foundation (Current)
- [x] Project setup with Vite and Bootstrap
- [x] Folder structure
- [x] Navigation bar and footer
- [x] Home page with categories
- [ ] Git initialization and first push

### Phase 2: Authentication & Data
- [ ] Supabase configuration
- [ ] User registration/login page
- [ ] User authentication flow
- [ ] Database schema design

### Phase 3: Core Features
- [ ] Create listing page
- [ ] View listings with filters
- [ ] Listing detail page
- [ ] User profile page

### Phase 4: Enhanced Features
- [ ] Messaging system between users
- [ ] Advanced search and filtering
- [ ] Image uploads to Supabase Storage
- [ ] User ratings and reviews

### Phase 5: Polish & Deployment
- [ ] Error handling and validation
- [ ] Performance optimization
- [ ] Testing
- [ ] Deployment

## Supabase Schema (To Be Implemented)

### Tables
- `users` - User profiles and authentication
- `listings` - Retro computer items for barter
- `categories` - Item categories
- `messages` - User-to-user messaging
- `reviews` - User ratings and reviews

## Git Workflow
- Commit after each completed feature/step
- Use descriptive commit messages
- Push to main branch after each phase completion
- Include CHANGELOG updates

## Common Commands
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Notes for AI Agent
- Keep the code simple and maintainable
- Prioritize user experience and responsiveness
- Always test multi-page navigation
- Document new services and utilities
- Test on mobile devices
- Bootstrap components should be used where applicable
- Avoid over-engineering; simple solutions preferred

## Current Status
✅ Step 1.1: Project initialized with Vite and Bootstrap
⏳ Next: Create pages and routing system
