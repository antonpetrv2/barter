/**
 * Main entry point for Barter App
 * Initializes the application and loads Bootstrap
 */

import 'bootstrap/dist/css/bootstrap.css'
import './styles/main.css'

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Barter App initialized!')
    initializeApp()
})

async function initializeApp() {
    const app = document.getElementById('app')
    
    // Load header and footer
    app.innerHTML = `
        <header id="navbar"></header>
        <main id="content"></main>
        <footer id="footer"></footer>
    `
    
    // Import and initialize components
    const { renderNavbar } = await import('./components/navbar.js')
    const { renderFooter } = await import('./components/footer.js')
    const { renderHome } = await import('./pages/home.js')
    
    // Render components
    renderNavbar()
    renderHome()
    renderFooter()
}

// Simple router for multi-page navigation
window.navigateTo = (page) => {
    console.log(`Navigating to: ${page}`)
    // Will be implemented in next steps
}
