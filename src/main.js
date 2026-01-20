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

// Component imports
import { renderNavbar } from './components/navbar.js'
import { renderFooter } from './components/footer.js'

// Router configuration
const routes = {
    '/': renderHome,
    '/listings': renderListings,
    '/listing/:id': renderListingDetail,
    '/auth': renderAuth,
    '/my-listings': renderMyListings,
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Barter App initialized!')
    initializeApp()
    setupRouter()
})

async function initializeApp() {
    const app = document.getElementById('app')
    
    // Load header and footer
    app.innerHTML = `
        <header id="navbar"></header>
        <main id="content"></main>
        <footer id="footer"></footer>
    `
    
    // Render static components
    renderNavbar()
    renderFooter()
}

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
    
    console.log(`📍 Routing to: ${pathname}`)
    
    const content = document.getElementById('content')
    content.innerHTML = '<div class="container py-5"><p class="text-center">Зареждане...</p></div>'
    
    // Find matching route
    let pageRenderer = routes[pathname]
    
    // Check for dynamic routes
    if (!pageRenderer) {
        for (const route in routes) {
            if (route.includes(':')) {
                const pattern = route.replace(/:[^/]+/g, '([^/]+)')
                const regex = new RegExp(`^${pattern}$`)
                if (regex.test(pathname)) {
                    pageRenderer = routes[route]
                    break
                }
            }
        }
    }
    
    if (pageRenderer) {
        await pageRenderer(params)
    } else {
        renderHome()
    }
}

/**
 * Parse route and extract parameters
 */
function parseRoute(hash) {
    const parts = hash.split('/')
    let pathname = hash
    const params = {}
    
    // Check if it's a dynamic route like /listing/123
    if (parts.length > 1) {
        const id = parts[parts.length - 1]
        if (!isNaN(id) || id.length > 0) {
            pathname = '/' + parts.slice(0, -1).join('/').replace(/^\//, '')
            if (pathname === '') pathname = '/'
            params.id = id
        }
    }
    
    return [pathname, params]
}
