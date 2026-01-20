/**
 * Listing Detail Page
 * Display full details of a single listing
 */

// Mock database of listings
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
