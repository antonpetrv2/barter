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
    
    // Fetch listing from Supabase or use demo data
    let listing = null
    
    if (isSupabaseConnected()) {
        listing = await listingsService.getListingById(listingId)
    }
    
    // If not found in Supabase, try demo data
    if (!listing) {
        const demoListings = getDemoListings()
        listing = demoListings.find(l => l.id === parseInt(listingId))
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
    
    // Fetch related listings
    let relatedListings = []
    if (isSupabaseConnected()) {
        const allListings = await listingsService.getAllListings()
        relatedListings = allListings
            .filter(l => l.category === listing.category && l.id !== listing.id)
            .slice(0, 3)
    }
    
    if (relatedListings.length === 0) {
        const demoListings = getDemoListings()
        relatedListings = demoListings
            .filter(l => l.category === listing.category && l.id !== listing.id)
            .slice(0, 3)
    }
    
    const owner = listing.users?.full_name || listing.owner || 'Неизвестен'
    const ownerEmail = listing.users?.email || listing.email || 'N/A'
    const ownerPhone = listing.users?.phone || listing.phone || 'N/A'
    const ownerCity = listing.users?.city || listing.city || 'Неизвестен'
    const ownerRating = listing.users?.rating || listing.ownerRating || 5.0
    const ownerListings = listing.users?.listings_count || listing.ownerListings || 0
    
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
                        <div class="bg-light d-flex align-items-center justify-content-center" style="height: 400px; font-size: 10rem;">
                            ${listing.image || listing.images?.[0] || '📦'}
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
    if (!listing.year && listing.condition === undefined && listing.working === undefined) {
        return ''
    }
    
    return `
        <h4 class="mt-4">Технически детайли</h4>
        <div class="row g-3">
            ${listing.year ? `
                <div class="col-md-6">
                    <small class="text-muted">Година на производство</small>
                    <p class="mb-0">${listing.year}</p>
                </div>
            ` : ''}
            ${listing.condition ? `
                <div class="col-md-6">
                    <small class="text-muted">Състояние</small>
                    <p class="mb-0">${listing.condition}</p>
                </div>
            ` : ''}
            ${listing.working !== undefined ? `
                <div class="col-md-6">
                    <small class="text-muted">Статус</small>
                    <p class="mb-0">${listing.working ? '✅ Работи' : '⚠️ Не е тестирана'}</p>
                </div>
            ` : ''}
        </div>
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
                ${related.map(listing => `
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100 listing-card">
                            <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px; font-size: 4rem;">
                                <a href="#/listing/${listing.id}" style="text-decoration: none; color: inherit; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                                    ${listing.image || '📦'}
                                </a>
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">
                                    <a href="#/listing/${listing.id}" style="text-decoration: none; color: inherit;">
                                        ${listing.title}
                                    </a>
                                </h5>
                                <p class="card-text text-muted small">${listing.description || 'Няма описание'}</p>
                            </div>
                            <div class="card-footer bg-transparent">
                                <div class="d-flex justify-content-between align-items-center">
                                    <span class="fw-bold">${listing.price || 'за разговор'}</span>
                                    <a href="#/listing/${listing.id}" class="btn btn-sm btn-primary">
                                        <i class="bi bi-eye"></i> Подробности
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                `).join('')}
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

function getDemoListings() {
    return [
        {
            id: 1,
            title: 'Commodore 64',
            description: 'Работи отлично, комплект с джойстик',
            fullDescription: 'Перфектно функциониращ Commodore 64 с оригинална кутия и всички включени аксесоари. Включва джойстик, захранващ кабел и RF кабел. Преглед при договаряне на място.',
            price: 'за разговор',
            location: 'София',
            category: 'Компютри',
            image: '🖥️',
            owner: 'Ivan Ivanov',
            ownerRating: 4.8,
            ownerListings: 5,
            created_at: new Date(Date.now() - 2 * 60000).toISOString(),
            views: 234,
            year: 1982,
            condition: 'Отлично',
            working: true
        },
        {
            id: 2,
            title: 'Amiga 500',
            description: 'Оригинален модел от 1987г',
            fullDescription: 'Оригинален Amiga 500 от 1987 година. В работещо състояние. Включва монитор Commodore 1084S и всички необходими кабели. Идеално за събиране или использване.',
            price: 'за разговор',
            location: 'Пловдив',
            category: 'Компютри',
            image: '💾',
            owner: 'Maria Georgieva',
            ownerRating: 5.0,
            ownerListings: 3,
            created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
            views: 567,
            year: 1987,
            condition: 'Много добро',
            working: true
        },
        {
            id: 3,
            title: 'IBM PC XT',
            description: 'Класически компютър, всички документи',
            fullDescription: 'Класически IBM PC XT от 80-те години. Работи с DOS и включва оригинална документация. Перфектно за ретро фанатици и събиране на старинни компютри.',
            price: 'за разговор',
            location: 'Варна',
            category: 'Компютри',
            image: '🔌',
            owner: 'Petko Borisov',
            ownerRating: 4.6,
            ownerListings: 8,
            created_at: new Date(Date.now() - 3 * 24 * 3600000).toISOString(),
            views: 123,
            year: 1983,
            condition: 'Добро',
            working: true
        },
    ]
}

// Mock database of listings (deprecated - kept for reference)
const LISTINGS_DB = {
    1: {
        id: 1,
        title: 'Commodore 64',
        description: 'Оригинален Commodore 64 от 1983г. Работи отлично, всички кабели и джойстик включени. Има малко косметични драскотини но функционално е в идеално състояние.',
        fullDescription: 'Това е истинска реликва от ретро света на компютрите. Машината е тествана и работи на 100%. Идеално за събирачи или за хора които искат да се вкусят в ретро гейминг.',
        price: 'Открит за разговор',
        location: 'София, България',
        category: 'Компютри',
        image: '🖥️',
        owner: 'Ivan Ivanov',
        ownerRating: 4.8,
        ownerListings: 5,
        date: '2 часа назад',
        views: 234,
        phone: '+359 88 123 4567',
        email: 'ivan@example.com',
        images: ['🖥️', '💾', '⌨️'],
        condition: 'Добро',
        year: 1983,
        working: true
    },
    2: {
        id: 2,
        title: 'Amiga 500',
        description: 'Работеща Amiga 500 със всички аксесоари',
        fullDescription: 'Класическа машина с над 30-годишна история. Идеална за проучване на ретро компютрите.',
        price: 'Открит за разговор',
        location: 'Пловдив, България',
        category: 'Компютри',
        image: '💾',
        owner: 'Maria Georgieva',
        ownerRating: 5.0,
        ownerListings: 3,
        date: '1 день назад',
        views: 156,
        phone: '+359 89 987 6543',
        email: 'maria@example.com',
        images: ['💾', '🖥️'],
        condition: 'Отлично',
        year: 1987,
        working: true
    },
    3: {
        id: 3,
        title: 'IBM PC XT',
        description: 'Събор IBM PC XT със всички документи',
        fullDescription: 'Един от първите персонални компютри. Идеален за историческо значение в личната компютърна индустрия.',
        price: 'Открит за разговор',
        location: 'Варна, България',
        category: 'Компютри',
        image: '🔌',
        owner: 'Petko Borisov',
        ownerRating: 4.5,
        ownerListings: 8,
        date: '3 дни назад',
        views: 89,
        phone: '+359 87 654 3210',
        email: 'petko@example.com',
        images: ['🔌', '⌨️', '💾'],
        condition: 'Добро',
        year: 1983,
        working: true
    },
}

export function renderListingDetail(params) {
    const content = document.getElementById('content')
    const id = parseInt(params.id)
    
    const listing = LISTINGS_DB[id]
    
    if (!listing) {
        content.innerHTML = `
            <div class="container py-5">
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading"><i class="bi bi-exclamation-triangle"></i> Обява не намерена!</h4>
                    <p>Съжаляваме, обявата която търсите не съществува или е била изтрита.</p>
                    <hr>
                    <a href="#/listings" class="btn btn-primary">
                        <i class="bi bi-arrow-left"></i> Назад към всички обяви
                    </a>
                </div>
            </div>
        `
        return
    }
    
    content.innerHTML = `
        <div class="container py-5">
            <!-- Back Button -->
            <div class="row mb-3">
                <div class="col-12">
                    <a href="#/listings" class="btn btn-outline-secondary btn-sm">
                        <i class="bi bi-arrow-left"></i> Назад
                    </a>
                </div>
            </div>

            <!-- Main Content -->
            <div class="row">
                <!-- Left side - Images and Description -->
                <div class="col-lg-8">
                    <!-- Image Gallery -->
                    <div class="card mb-4">
                        <div class="listing-detail-image bg-light d-flex align-items-center justify-content-center" style="height: 400px; font-size: 8rem;">
                            ${listing.image}
                        </div>
                        <div class="card-body">
                            <div class="d-flex gap-2">
                                ${listing.images.map(img => `
                                    <div class="bg-light p-2 rounded cursor-pointer" style="width: 60px; height: 60px; display: flex; align-items: center; justify-content: center; font-size: 2rem;">
                                        ${img}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    </div>

                    <!-- Description -->
                    <div class="card mb-4">
                        <div class="card-body">
                            <h2 class="card-title">${listing.title}</h2>
                            <p class="card-text">${listing.description}</p>
                            <hr>
                            <h5>Пълно описание</h5>
                            <p>${listing.fullDescription}</p>
                        </div>
                    </div>

                    <!-- Details -->
                    <div class="card">
                        <div class="card-header">
                            <h5>Технически детайли</h5>
                        </div>
                        <div class="card-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <p><strong>Категория:</strong> ${listing.category}</p>
                                    <p><strong>Година:</strong> ${listing.year}</p>
                                    <p><strong>Състояние:</strong> ${listing.condition}</p>
                                </div>
                                <div class="col-md-6">
                                    <p><strong>Работи:</strong> ${listing.working ? '✅ Да' : '❌ Не'}</p>
                                    <p><strong>Локация:</strong> ${listing.location}</p>
                                    <p><strong>Постав:</strong> ${listing.date}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right side - Price and Seller Info -->
                <div class="col-lg-4">
                    <!-- Price Card -->
                    <div class="card mb-4 border-primary">
                        <div class="card-body text-center">
                            <h3 class="card-title text-primary">${listing.price}</h3>
                            <p class="text-muted">Цена е открита за договаряне</p>
                            <div class="d-grid gap-2">
                                <button class="btn btn-primary btn-lg">
                                    <i class="bi bi-envelope"></i> Контакт със собственика
                                </button>
                                <button class="btn btn-outline-secondary">
                                    <i class="bi bi-bookmark"></i> Запази
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Seller Info -->
                    <div class="card mb-4">
                        <div class="card-header">
                            <h5>Информация за продавача</h5>
                        </div>
                        <div class="card-body">
                            <div class="text-center mb-3">
                                <div style="width: 60px; height: 60px; background: #0066cc; border-radius: 50%; margin: 0 auto 10px; display: flex; align-items: center; justify-content: center; color: white; font-size: 2rem;">
                                    👤
                                </div>
                                <h6 class="fw-bold">${listing.owner}</h6>
                                <p class="text-warning small">
                                    ${'⭐'.repeat(Math.floor(listing.ownerRating))} ${listing.ownerRating}/5
                                </p>
                                <p class="text-muted small">${listing.ownerListings} обяви</p>
                            </div>
                            <hr>
                            <p class="mb-2">
                                <small><i class="bi bi-telephone"></i> <a href="tel:${listing.phone}">${listing.phone}</a></small>
                            </p>
                            <p class="mb-3">
                                <small><i class="bi bi-envelope"></i> <a href="mailto:${listing.email}">${listing.email}</a></small>
                            </p>
                            <a href="#/" class="btn btn-sm btn-outline-primary w-100">
                                Всички обяви на продавача
                            </a>
                        </div>
                    </div>

                    <!-- Stats -->
                    <div class="card">
                        <div class="card-body text-center text-muted">
                            <small>
                                <i class="bi bi-eye"></i> ${listing.views} преглеждания
                            </small>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Similar Listings -->
            <div class="row mt-5">
                <div class="col-12">
                    <h3 class="mb-4">Подобни обяви</h3>
                </div>
                ${renderSimilarListings(listing)}
            </div>
        </div>
    `
}

function renderSimilarListings(currentListing) {
    const similar = Object.values(LISTINGS_DB)
        .filter(l => l.id !== currentListing.id && l.category === currentListing.category)
        .slice(0, 3)
    
    if (similar.length === 0) {
        return '<div class="col-12"><p class="text-muted">Няма подобни обяви в момента.</p></div>'
    }
    
    return similar.map(listing => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100">
                <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 150px; font-size: 3rem;">
                    ${listing.image}
                </div>
                <div class="card-body">
                    <h6 class="card-title">
                        <a href="#/listing/${listing.id}" style="text-decoration: none; color: inherit;">
                            ${listing.title}
                        </a>
                    </h6>
                    <p class="card-text text-muted small">${listing.location}</p>
                </div>
                <div class="card-footer bg-transparent">
                    <a href="#/listing/${listing.id}" class="btn btn-sm btn-primary w-100">
                        Виж повече
                    </a>
                </div>
            </div>
        </div>
    `).join('')
}
