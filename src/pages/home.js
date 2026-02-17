/**
 * Home Page
 * Landing page with categories and featured listings
 */

import { listingsService, isSupabaseConnected } from '../services/supabaseService.js'

export async function renderHome() {
    const content = document.getElementById('content')
    
    content.innerHTML = `
        <div class="container py-2">
            <!-- Search Section -->
            <div class="row mb-4 mt-3">
                <div class="col-12">
                    <form id="homeSearchForm">
                        <div class="input-group">
                            <input 
                                type="text" 
                                class="form-control" 
                                id="homeSearchInput" 
                                placeholder="Търси компютри, клавиатури, части..."
                                aria-label="Търсене">
                            <button class="btn btn-primary" type="submit">
                                <i class="bi bi-search"></i> Търси
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <!-- Categories Section -->
            <div class="row mb-4 mt-2">
                <div class="col-12">
                    <h4 class="mb-3">Категории</h4>
                </div>
                ${generateCategories()}
            </div>

            <!-- Listing Type Tabs -->
            <div class="row mb-4">
                <div class="col-12">
                    <ul class="nav nav-tabs" id="listingTypeTabs" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="offering-tab" data-bs-toggle="tab" data-bs-target="#offering-pane" type="button" role="tab" aria-controls="offering-pane" aria-selected="true" style="color: #28a745;">
                                <span style="font-size: 1.3rem; margin-right: 0.5rem;">🔄</span> Предлагам
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="looking-tab" data-bs-toggle="tab" data-bs-target="#looking-pane" type="button" role="tab" aria-controls="looking-pane" aria-selected="false" style="color: #007bff;">
                                <i class="bi bi-search" style="font-size: 1.3rem; margin-right: 0.5rem;"></i> Търся
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Featured Listings -->
            <div class="tab-content" id="listingTypeContent">
                <!-- Offering Tab -->
                <div class="tab-pane fade show active" id="offering-pane" role="tabpanel" aria-labelledby="offering-tab">
                    <div id="offering-listings" class="row g-3">
                        <div class="col-12 text-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Зареждане...</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Looking Tab -->
                <div class="tab-pane fade" id="looking-pane" role="tabpanel" aria-labelledby="looking-tab">
                    <div id="looking-listings" class="row g-3">
                        <div class="col-12 text-center">
                            <div class="spinner-border" role="status">
                                <span class="visually-hidden">Зареждане...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    
    // Setup search form handler
    const searchForm = document.getElementById('homeSearchForm')
    searchForm.addEventListener('submit', (e) => {
        e.preventDefault()
        const searchInput = document.getElementById('homeSearchInput')
        const query = searchInput.value.trim()
        if (query) {
            window.location.hash = `#/listings?search=${encodeURIComponent(query)}`
        } else {
            window.location.hash = '#/listings'
        }
    })
    
    // Load real listings
    await loadFeaturedListings()
}

function generateCategories() {
    const categories = [
        { name: 'Компютри', icon: 'bi-pc-display', path: '/listings' },
        { name: 'Клавиатури', icon: 'bi-keyboard', path: '/listings' },
        { name: 'Монитори', icon: 'bi-display', path: '/listings' },
        { name: 'Мишки', icon: 'bi-mouse', path: '/listings' },
        { name: 'Периферия', icon: 'bi-printer', path: '/listings' },
        { name: 'Части', icon: 'bi-gpu-card', path: '/listings' },
    ]
    
    return categories.map(cat => `
        <div class="col-6 col-md-4 col-lg-2 mb-2">
            <a href="#${cat.path}?category=${encodeURIComponent(cat.name)}" style="text-decoration: none; color: inherit;">
                <div class="card text-center cursor-pointer h-100">
                    <div class="card-body py-2 px-2">
                        <i class="bi ${cat.icon}" style="font-size: 1.5rem; margin-bottom: 0.25rem; display: block;"></i>
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
                        <span class="fw-bold">${formatListingPrice(listing.price)}</span>
                        <a href="#/listing/${listing.id}" class="btn btn-sm btn-outline-primary">Повече</a>
                    </div>
                </div>
            </div>
        </div>
    `
    }).join('')
}

function formatListingPrice(priceValue) {
    const exchangeRate = 1.95583

    if (priceValue === null || priceValue === undefined || priceValue === '') {
        return 'Цена: по договаряне'
    }

    const normalized = String(priceValue).trim().replace(',', '.')
    const numericPrice = Number(normalized)

    if (Number.isFinite(numericPrice)) {
        const euroText = Number.isInteger(numericPrice)
            ? numericPrice.toString()
            : numericPrice.toFixed(2)
        const levaText = (numericPrice * exchangeRate).toFixed(2)
        return `Цена: ${euroText} € (${levaText} лв)`
    }

    return `Цена: ${priceValue}`
}

async function loadFeaturedListings() {
    const offeringContainer = document.getElementById('offering-listings')
    const lookingContainer = document.getElementById('looking-listings')
    
    if (!isSupabaseConnected()) {
        offeringContainer.innerHTML = '<div class="col-12"><p class="text-muted">Няма налични обяви</p></div>'
        lookingContainer.innerHTML = '<div class="col-12"><p class="text-muted">Няма налични обяви</p></div>'
        return
    }
    
    const listings = await listingsService.getAllListings()
    console.log('📦 Featured listings loaded:', listings.length, listings)
    
    // Separate listings by type
    const offeringListings = listings.filter(l => l.listing_type === 'offering' || !l.listing_type).slice(0, 6)
    const lookingListings = listings.filter(l => l.listing_type === 'looking').slice(0, 6)
    
    offeringContainer.innerHTML = generateFeaturedListings(offeringListings)
    lookingContainer.innerHTML = generateFeaturedListings(lookingListings)
}
