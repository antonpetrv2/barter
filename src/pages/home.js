/**
 * Home Page
 * Landing page with categories and featured listings
 */

import { listingsService, isSupabaseConnected } from '../services/supabaseService.js'

export async function renderHome() {
    const content = document.getElementById('content')
    
    content.innerHTML = `
        <div class="container py-4">
            <!-- Categories Section -->
            <div class="row mb-4">
                <div class="col-12">
                    <h4 class="mb-3">Категории</h4>
                </div>
                ${generateCategories()}
            </div>

            <!-- Featured Listings -->
            <div class="row">
                <div class="col-12">
                    <h4 class="mb-3">Последни обяви</h4>
                </div>
                <div id="featured-listings">
                    <div class="text-center">
                        <div class="spinner-border" role="status">
                            <span class="visually-hidden">Зареждане...</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    
    // Load real listings
    await loadFeaturedListings()
}

function generateCategories() {
    const categories = [
        { name: 'Компютри', icon: '🖴', path: '/listings' },
        { name: 'Клавиатури', icon: '⌨️', path: '/listings' },
        { name: 'Монитори', icon: '📟', path: '/listings' },
        { name: 'Мишки', icon: '🖱️', path: '/listings' },
        { name: 'Периферия', icon: '🖨️', path: '/listings' },
        { name: 'Части', icon: '🎛️', path: '/listings' },
    ]
    
    return categories.map(cat => `
        <div class="col-6 col-md-4 col-lg-2 mb-2">
            <a href="#${cat.path}" style="text-decoration: none; color: inherit;">
                <div class="card text-center cursor-pointer h-100">
                    <div class="card-body py-2 px-2">
                        <div style="font-size: 1.5rem; margin-bottom: 0.25rem;">${cat.icon}</div>
                        <small class="card-title">${cat.name}</small>
                    </div>
                </div>
            </a>
        </div>
    `).join('')
}

// Neutral gray placeholder to indicate missing photo
const placeholderImage = 'https://dummyimage.com/800x600/cfcfcf/8a8a8a&text=%D0%B1%D0%B5%D0%B7+%D1%81%D0%BD%D0%B8%D0%BC%D0%BA%D0%B0'

function generateFeaturedListings(listings) {
    if (!listings || listings.length === 0) {
        return '<div class="col-12"><p class="text-muted">Няма налични обяви</p></div>'
    }
    
    return listings.map(listing => {
        const imageUrl = (listing.images && listing.images[0]) || listing.image_url
        const displayImage = imageUrl || placeholderImage
        return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                    <img src="${displayImage}" alt="${listing.title}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
                </div>
                <div class="card-body">
                    <h5 class="card-title">${listing.title}</h5>
                    <p class="card-text text-muted">${listing.location || 'Неизвестно'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold">${listing.price || 'по договаряне'}</span>
                        <a href="#/listing/${listing.id}" class="btn btn-sm btn-outline-primary">Повече</a>
                    </div>
                </div>
            </div>
        </div>
    `
    }).join('')
}

async function loadFeaturedListings() {
    const container = document.getElementById('featured-listings')
    
    if (!isSupabaseConnected()) {
        container.innerHTML = '<div class="col-12"><p class="text-muted">Няма налични обяви</p></div>'
        return
    }
    
    const listings = await listingsService.getAllListings()
    const featured = listings.slice(0, 3) // Show last 3 listings
    
    container.innerHTML = generateFeaturedListings(featured)
}
