/**
 * Main entry point for Barter App
 * Initializes the application and loads Bootstrap
 */

import 'bootstrap/dist/css/bootstrap.css'
import './styles/main.css'

// Page imports
import { renderHome } from './pages/home.js'
import { renderListings } from './pages/listings.js'
import { renderListingDetail } from './pages/listingDetail.js'
import { renderAuth } from './pages/auth.js'
import { renderMyListings } from './pages/myListings.js'
import { renderCreateListing } from './pages/createListing.js'
import { renderEditListing } from './pages/editListing.js'
import { renderAdmin } from './pages/admin.js'

// Component imports
import { renderNavbar } from './components/navbar.js'
import { renderFooter } from './components/footer.js'

// Service imports
import { authService } from './services/supabaseService.js'

// Global auth state
window.authState = {
    user: null,
    isLoggedIn: false,
    isAdmin: false,
}

// Router configuration
const routes = {
    '/': renderHome,
    '/listings': renderListings,
    '/listing/:id': renderListingDetail,
    '/auth': renderAuth,
    '/my-listings': renderMyListings,
    '/create-listing': renderCreateListing,
    '/edit-listing/:id': renderEditListing,
    '/admin': renderAdmin,
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Barter App initialized!')
    initializeApp()
    setupRouter()
    checkAuthStatus()
})

async function initializeApp() {
    const app = document.getElementById('app')
    console.log('📦 App element:', app)
    
    // Load header and footer
    app.innerHTML = `
        <header id="navbar"></header>
        <main id="content"></main>
        <footer id="footer"></footer>
    `
    
    console.log('📦 App HTML structure created')
    
    // Render static components
    renderNavbar()
    renderFooter()
    
    console.log('📦 Navbar and Footer rendered')
}
/**
 * Check user authentication status
 */
async function checkAuthStatus() {
    const user = await authService.getCurrentUser()
    if (user) {
        const userProfile = await authService.getUserProfile(user.id)
        window.authState.user = user
        window.authState.isLoggedIn = true
        window.authState.isAdmin = userProfile && userProfile.role === 'admin'
        window.authState.userStatus = userProfile && userProfile.status
        console.log('👤 User logged in:', user.email)
        if (window.authState.isAdmin) {
            console.log('👑 Admin privileges granted')
        }
    }
}

/**
 * Export for external use
 */
window.checkAuthStatus = checkAuthStatus

/**
 * Setup hash-based router for multi-page navigation
 */
function setupRouter() {
    // Handle initial route
    handleRoute()
    
    // Handle route changes
    window.addEventListener('hashchange', handleRoute)
    
    // Make navigate function global
    window.navigateTo = (page) => {
        window.location.hash = page
    }
}

/**
 * Handle route change and render appropriate page
 */
async function handleRoute() {
    const hash = window.location.hash.slice(1) || '/'
    const [pathname, params] = parseRoute(hash)
    
    console.log(`📍 Routing to: ${pathname}`, params)
    
    const content = document.getElementById('content')
    content.innerHTML = '<div class="container py-5"><p class="text-center">Зареждане...</p></div>'
    
    // Find matching route
    let pageRenderer = routes[pathname]
    console.log('Available routes:', Object.keys(routes))
    console.log('Looking for route:', pathname)
    console.log('Found renderer:', !!pageRenderer)
    
    // Check for dynamic routes
    if (!pageRenderer) {
        for (const route in routes) {
            if (route.includes(':')) {
                const pattern = route.replace(/:[^/]+/g, '([^/]+)')
                const regex = new RegExp(`^${pattern}$`)
                if (regex.test(pathname)) {
                    pageRenderer = routes[route]
                    console.log('Matched dynamic route:', route)
                    break
                }
            }
        }
    }
    
    if (pageRenderer) {
        try {
            await pageRenderer(params)
        } catch (error) {
            console.error('Error rendering page:', error)
            content.innerHTML = `<div class="container py-5"><div class="alert alert-danger">Грешка при зареждане на страницата: ${error.message}</div></div>`
        }
    } else {
        console.log('No renderer found, rendering home')
        renderHome()
    }
}

/**
 * Parse route and extract parameters
 */
function parseRoute(hash) {
    const parts = hash.split('/').filter(p => p) // Remove empty parts
    let pathname = '/'
    const params = {}
    
    // Build pathname
    if (parts.length > 0) {
        if (parts.length === 1) {
            pathname = '/' + parts[0]
        } else if (parts.length >= 2) {
            // For routes like /listing/123
            pathname = '/' + parts[0] + '/:id'
            params.id = parts[1]
        }
    }
    
    return [pathname, params]
}
