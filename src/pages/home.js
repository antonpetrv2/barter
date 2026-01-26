/**
 * Home Page
 * Landing page with categories and featured listings
 */

import { listingsService, isSupabaseConnected } from '../services/supabaseService.js'

export async function renderHome() {
    const content = document.getElementById('content')
    
    content.innerHTML = `
        <div class="container py-5">
            <!-- Hero Section -->
            <div class="row mb-5">
                <div class="col-md-8 offset-md-2 text-center">
                    <h1 class="display-4 fw-bold mb-3">Добре дошли в BARTER</h1>
                    <p class="lead mb-4">Обменяй ретро компютри и части със събирачи и ентусиасти</p>
                    <div class="gap-2 d-flex justify-content-center">
                        <a href="#/my-listings" class="btn btn-primary btn-lg">Създай обява</a>
                        <a href="#/listings" class="btn btn-outline-primary btn-lg">Разгледай обяви</a>
                    </div>
                </div>
            </div>

            <!-- Categories Section -->
            <div class="row mb-5">
                <div class="col-12">
                    <h2 class="mb-4">Категории</h2>
                </div>
                ${generateCategories()}
            </div>

            <!-- Featured Listings -->
            <div class="row">
                <div class="col-12">
                    <h2 class="mb-4">Последни обяви</h2>
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
        { name: 'Компютри', icon: '💻', path: '/listings' },
        { name: 'Клавиатури', icon: '⌨️', path: '/listings' },
        { name: 'Монитори', icon: '🖥️', path: '/listings' },
        { name: 'Мишки', icon: '🖱️', path: '/listings' },
        { name: 'Периферия', icon: '🔌', path: '/listings' },
        { name: 'Части', icon: '🔧', path: '/listings' },
    ]
    
    return categories.map(cat => `
        <div class="col-md-4 col-lg-2 mb-3">
            <a href="#${cat.path}" style="text-decoration: none; color: inherit;">
                <div class="card text-center cursor-pointer h-100">
                    <div class="card-body">
                        <div style="font-size: 2rem; margin-bottom: 0.5rem;">${cat.icon}</div>
                        <h6 class="card-title">${cat.name}</h6>
                    </div>
                </div>
            </a>
        </div>
    `).join('')
}

function generateFeaturedListings(listings) {
    if (!listings || listings.length === 0) {
        return '<div class="col-12"><p class="text-muted">Няма налични обяви</p></div>'
    }
    
    return listings.map(listing => {
        const imageUrl = (listing.images && listing.images[0]) || listing.image_url
        return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                    ${imageUrl ? `<img src="${imageUrl}" alt="${listing.title}" style="max-height: 100%; max-width: 100%; object-fit: contain;">` : '📦'}
                </div>
                <div class="card-body">
                    <h5 class="card-title">${listing.title}</h5>
                    <p class="card-text text-muted">${listing.location || 'Неизвестно'}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold">${listing.price || 'за разговор'}</span>
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
