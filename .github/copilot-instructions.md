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

### Phase 1: Foundation (Completed ✅)
- [x] Project setup with Vite and Bootstrap
- [x] Folder structure
- [x] Navigation bar and footer
- [x] Home page with categories
- [x] Git initialization and first push

### Phase 2: Multi-Page Navigation (Completed ✅)
- [x] Hash-based router
- [x] All core pages (Home, Listings, Detail, Auth, My Listings)
- [x] Dynamic routing with parameters
- [x] Page transitions and navigation

### Phase 3: Supabase Integration & Auth (Current)
- [x] Supabase SDK installation
- [x] Environment configuration (.env)
- [x] supabaseService.js with auth methods
- [x] Login/Register forms with Supabase
- [x] Database schema documentation
- [ ] Row Level Security (RLS) policies
- [ ] Sample data seeding
- [ ] Real listings data integration

### Phase 4: Enhanced Features
- [ ] Messaging system between users
- [ ] Advanced search and filtering
- [ ] Image uploads to Supabase Storage
- [ ] User ratings and reviews
- [ ] Edit/Delete listings functionality

### Phase 5: Polish & Deployment
- [ ] Error handling and validation
- [ ] Performance optimization
- [ ] Testing
- [ ] Deployment setup

## Supabase Schema (To Be Implemented)

### Tables

#### `users` - User profiles and authentication
```sql
id: UUID (PRIMARY KEY)
email: TEXT (UNIQUE)
full_name: TEXT
phone: TEXT
city: TEXT
avatar_url: TEXT
rating: NUMERIC (default 5.0)
listings_count: INTEGER (default 0)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### `listings` - Retro computer items for barter
```sql
id: BIGINT (PRIMARY KEY)
user_id: UUID (FOREIGN KEY -> users.id)
title: TEXT
description: TEXT
category: TEXT
price: TEXT
location: TEXT
condition: TEXT
year: INTEGER
working: BOOLEAN
image_url: TEXT
images: JSON (array of URLs)
views: INTEGER (default 0)
created_at: TIMESTAMP
updated_at: TIMESTAMP
```

#### `categories` - Item categories
```sql
id: BIGINT (PRIMARY KEY)
name: TEXT (UNIQUE)
icon: TEXT
description: TEXT
```

#### `messages` - User-to-user messaging
```sql
id: BIGINT (PRIMARY KEY)
sender_id: UUID (FOREIGN KEY -> users.id)
receiver_id: UUID (FOREIGN KEY -> users.id)
listing_id: BIGINT (FOREIGN KEY -> listings.id)
message: TEXT
read: BOOLEAN (default false)
created_at: TIMESTAMP
```

#### `reviews` - User ratings and reviews
```sql
id: BIGINT (PRIMARY KEY)
reviewer_id: UUID (FOREIGN KEY -> users.id)
reviewed_user_id: UUID (FOREIGN KEY -> users.id)
listing_id: BIGINT (FOREIGN KEY -> listings.id)
rating: INTEGER (1-5)
review_text: TEXT
created_at: TIMESTAMP
```

### Setup Instructions

1. Create Supabase project at https://supabase.com
2. In SQL Editor, run the schema creation scripts
3. Enable Row Level Security (RLS) for security
4. Get your API URL and Anon Key from Settings > API
5. Create `.env.local` file with:
   ```
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```
6. Import sample data if needed

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
✅ Step 2: Multi-page routing with all core pages
✅ Step 3: Supabase SDK installed and configured
⏳ Next: Setup Supabase project and database schema
