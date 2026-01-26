/**
 * Listing Detail Page
 * Display detailed view of a single listing
 */

import { listingsService, isSupabaseConnected } from '../services/supabaseService.js'

export async function renderListingDetail(params) {
    const content = document.getElementById('content')
    const listingId = params.id
    
    // Show loading state
    content.innerHTML = `
        <div class="container py-5">
            <div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Зареждане...</span>
                </div>
                <p class="mt-3">Зареждане на обяви...</p>
            </div>
        </div>
    `
    
    // Fetch listing from Supabase
    let listing = null
    
    if (isSupabaseConnected()) {
        listing = await listingsService.getListingById(listingId)
    }
    
    if (!listing) {
        content.innerHTML = `
            <div class="container py-5">
                <div class="alert alert-danger" role="alert">
                    <i class="bi bi-exclamation-triangle"></i> Обявата не е намерена.
                </div>
                <a href="#/listings" class="btn btn-primary">Назад към обявите</a>
            </div>
        `
        return
    }

    let relatedListings = []
    if (isSupabaseConnected()) {
        const allListings = await listingsService.getAllListings()
        relatedListings = allListings
            .filter(l => l.category === listing.category && l.id !== listing.id)
            .slice(0, 3)
    }
    
    const owner = listing.users?.full_name || listing.owner || 'Неизвестен'
    const ownerEmail = listing.users?.email || listing.email || 'N/A'
    const ownerPhone = listing.users?.phone || listing.phone || 'N/A'
    const ownerCity = listing.users?.city || listing.city || 'Неизвестен'
    const ownerRating = listing.users?.rating || listing.ownerRating || 5.0
    const ownerListings = listing.users?.listings_count || listing.ownerListings || 0
    const mainImage = (listing.images && listing.images[0]) || listing.image_url
    
    content.innerHTML = `
        <div class="container py-5">
            <!-- Back Button -->
            <a href="#/listings" class="btn btn-outline-secondary mb-4">
                <i class="bi bi-arrow-left"></i> Назад към обявите
            </a>

            <!-- Main Listing Content -->
            <div class="row g-4">
                <!-- Left Column - Images and Description -->
                <div class="col-lg-8">
                    <!-- Image Gallery -->
                    <div class="card mb-4">
                        <div class="bg-light d-flex align-items-center justify-content-center" style="height: 400px;">
                            ${mainImage ? `<img src="${mainImage}" alt="${listing.title}" style="max-height: 100%; max-width: 100%; object-fit: contain;">` : '📦'}
                        </div>
                    </div>

                    <!-- Listing Details -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <h1 class="card-title mb-3">${listing.title}</h1>
                            
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <p class="text-muted"><i class="bi bi-calendar"></i> ${formatDate(listing.created_at)}</p>
                                    <p class="text-muted"><i class="bi bi-geo-alt"></i> ${listing.location || 'Неопределено'}</p>
                                    <p class="text-muted"><i class="bi bi-eye"></i> ${listing.views || 0} прегледа</p>
                                </div>
                                <div class="col-md-6 text-md-end">
                                    <p class="fs-4 fw-bold text-primary">${listing.price || 'за разговор'}</p>
                                </div>
                            </div>

                            <hr>

                            <!-- Description -->
                            <h4>Описание</h4>
                            <p>${listing.fullDescription || listing.description || 'Няма описание'}</p>

                            <!-- Technical Details -->
                            ${renderTechnicalDetails(listing)}
                        </div>
                    </div>
                </div>

                <!-- Right Column - Seller Info and Actions -->
                <div class="col-lg-4">
                    <!-- Seller Card -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title mb-3">Продавач</h5>
                            
                            <div class="d-flex align-items-center mb-3">
                                <div class="fs-2 me-3">👤</div>
                                <div>
                                    <h6 class="mb-0">${owner}</h6>
                                    <small class="text-muted">${ownerCity}</small>
                                </div>
                            </div>

                            <div class="d-flex justify-content-between mb-3">
                                <span><i class="bi bi-star-fill text-warning"></i> ${ownerRating.toFixed(1)} звезди</span>
                                <span>${ownerListings} обяви</span>
                            </div>

                            <hr>

                            <div class="mb-3">
                                <small class="text-muted">Имейл:</small>
                                <p class="mb-2">${ownerEmail}</p>
                                <small class="text-muted">Телефон:</small>
                                <p>${ownerPhone}</p>
                            </div>

                            <button class="btn btn-primary w-100 mb-2">
                                <i class="bi bi-chat-left"></i> Изпрати съобщение
                            </button>
                            <button class="btn btn-outline-secondary w-100">
                                <i class="bi bi-exclamation-circle"></i> Докладване
                            </button>
                        </div>
                    </div>

                    <!-- Share Card -->
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title mb-3">Споделяне</h5>
                            <button class="btn btn-light w-100 mb-2">📱 WhatsApp</button>
                            <button class="btn btn-light w-100 mb-2">📧 Имейл</button>
                            <button class="btn btn-light w-100">🔗 Копирай линк</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Related Listings -->
            ${renderRelatedListings(relatedListings, listing.category)}
        </div>
    `
}

function renderTechnicalDetails(listing) {
    const details = []
    
    if (listing.year) details.push(`<p><strong>Година:</strong> ${listing.year}</p>`)
    if (listing.condition) details.push(`<p><strong>Състояние:</strong> ${listing.condition}</p>`)
    if (listing.working !== undefined) details.push(`<p><strong>Работно състояние:</strong> ${listing.working ? 'Работи' : 'Не работи'}</p>`)
    
    if (details.length === 0) return ''
    
    return `
        <hr>
        <h4>Технически детайли</h4>
        ${details.join('')}
    `
}

function renderRelatedListings(related, category) {
    if (related.length === 0) {
        return ''
    }
    
    return `
        <div class="mt-5">
            <h4 class="mb-4">Още обяви в категория "${category}"</h4>
            <div class="row g-4">
                ${related.map(listing => {
                    const imageUrl = (listing.images && listing.images[0]) || listing.image_url
                    return `
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100">
                            <div class="bg-light d-flex align-items-center justify-content-center" style="height: 150px;">
                                ${imageUrl ? `<img src="${imageUrl}" alt="${listing.title}" style="max-height: 100%; max-width: 100%; object-fit: contain;">` : '📦'}
                            </div>
                            <div class="card-body">
                                <h6 class="card-title">${listing.title}</h6>
                                <p class="card-text text-muted small">${listing.location}</p>
                                <p class="card-text fw-bold">${listing.price || 'за разговор'}</p>
                                <a href="#/listing/${listing.id}" class="btn btn-sm btn-primary">Подробности</a>
                            </div>
                        </div>
                    </div>
                `
                }).join('')}
            </div>
        </div>
    `
}

function formatDate(dateString) {
    if (!dateString) return 'Неизвестна дата'
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)
    
    if (minutes < 60) return `${minutes} мин назад`
    if (hours < 24) return `${hours} часа назад`
    if (days < 7) return `${days} дни назад`
    
    return date.toLocaleDateString('bg-BG')
}


