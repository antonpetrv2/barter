/**
 * Listing Detail Page
 * Display detailed view of a single listing
 */

import { listingsService, isSupabaseConnected, authService, messageService } from '../services/supabaseService.js'

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
    
    // Neutral gray placeholder to indicate missing photo
    const placeholderImage = 'https://dummyimage.com/800x600/cfcfcf/8a8a8a&text=%D0%B1%D0%B5%D0%B7+%D1%81%D0%BD%D0%B8%D0%BC%D0%BA%D0%B0'

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

    if (isSupabaseConnected() && listing.id) {
        await listingsService.incrementViews(listing.id)
        listing.views = (listing.views || 0) + 1
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
    const mainImage = (listing.images && listing.images[0]) || listing.image_url || placeholderImage
    
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
                            <img id="mainImage" src="${mainImage}" alt="${listing.title}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
                        </div>
                        ${listing.images && listing.images.length > 1 ? `
                            <div class="card-body">
                                <div class="d-flex gap-2 overflow-auto">
                                    ${listing.images.map((img, idx) => `
                                        <img 
                                            src="${img}" 
                                            alt="Снимка ${idx + 1}" 
                                            class="thumbnail-img ${idx === 0 ? 'border-primary' : ''}" 
                                            style="width: 100px; height: 100px; object-fit: cover; cursor: pointer; border: 2px solid ${idx === 0 ? '#0d6efd' : '#dee2e6'}; border-radius: 4px;"
                                            onclick="document.getElementById('mainImage').src='${img}'; 
                                                     document.querySelectorAll('.thumbnail-img').forEach(t => t.style.border = '2px solid #dee2e6');
                                                     this.style.border = '2px solid #0d6efd';">
                                    `).join('')}
                                </div>
                            </div>
                        ` : ''}
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
                                    <p class="fs-4 fw-bold text-primary">${formatListingPrice(listing.price)}</p>
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

                            <button class="btn btn-primary w-100 mb-2" id="sendMessageBtn">
                                <i class="bi bi-chat-left"></i> Изпрати съобщение
                            </button>
                            <button class="btn btn-outline-secondary w-100" id="reportListingBtn">
                                <i class="bi bi-exclamation-circle"></i> Докладване
                            </button>
                        </div>
                    </div>

                    <!-- Share Card -->
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title mb-3">Споделяне</h5>
                            <button class="btn btn-light w-100" id="copyLinkBtn">🔗 Копирай линк</button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Related Listings -->
            ${renderRelatedListings(relatedListings, listing.category, placeholderImage)}
        </div>
    `

    const listingUrl = `${window.location.origin}${window.location.pathname}#/listing/${listing.id}`

    const sendMessageBtn = document.getElementById('sendMessageBtn')
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', async () => {
            if (!isSupabaseConnected()) {
                alert('Системата за съобщения временно не е налична.')
                return
            }

            const currentUser = await authService.getCurrentUser()
            if (!currentUser) {
                alert('Трябва да влезеш в профила си, за да изпратиш съобщение.')
                window.location.hash = '#/auth'
                return
            }

            if (currentUser.id === listing.user_id) {
                alert('Това е твоя обява.')
                return
            }

            const text = prompt('Въведи съобщение до продавача:')
            if (text === null) return

            const trimmed = text.trim()
            if (!trimmed) {
                alert('Съобщението не може да е празно.')
                return
            }

            const { error } = await messageService.sendMessage({
                senderId: currentUser.id,
                receiverId: listing.user_id,
                listingId: listing.id,
                message: trimmed,
            })

            if (error) {
                alert('Грешка при изпращане: ' + (error.message || 'Неуспешна операция'))
                return
            }

            alert('✅ Съобщението е изпратено.')
        })
    }

    const reportListingBtn = document.getElementById('reportListingBtn')
    if (reportListingBtn) {
        reportListingBtn.addEventListener('click', () => {
            const prefill = {
                subject: `Доклад за обява #${listing.id}`,
                message: `Здравейте,\n\nИскам да докладвам нередност за следната обява:\nЗаглавие: ${listing.title}\nЛинк: ${listingUrl}\n\nПричина:`
            }
            sessionStorage.setItem('contactPrefill', JSON.stringify(prefill))
            window.location.hash = '#/contact'
        })
    }

    const copyLinkBtn = document.getElementById('copyLinkBtn')
    if (copyLinkBtn) {
        copyLinkBtn.addEventListener('click', async () => {
            try {
                if (navigator.clipboard && window.isSecureContext) {
                    await navigator.clipboard.writeText(listingUrl)
                } else {
                    const tempInput = document.createElement('textarea')
                    tempInput.value = listingUrl
                    tempInput.style.position = 'fixed'
                    tempInput.style.opacity = '0'
                    document.body.appendChild(tempInput)
                    tempInput.focus()
                    tempInput.select()
                    document.execCommand('copy')
                    document.body.removeChild(tempInput)
                }

                copyLinkBtn.textContent = '✅ Линкът е копиран'
                setTimeout(() => {
                    copyLinkBtn.textContent = '🔗 Копирай линк'
                }, 1500)
            } catch (error) {
                alert('Неуспешно копиране на линка. Копирай ръчно от адресната лента.')
            }
        })
    }
}

function renderTechnicalDetails(listing) {
    const details = []
    
    if (listing.year) details.push(`<p><strong>Година:</strong> ${listing.year}</p>`)
    if (listing.condition) details.push(`<p><strong>Състояние:</strong> ${listing.condition}</p>`)
    if (listing.working !== undefined) details.push(`<p><strong>Работно състояние:</strong> ${listing.working ? 'Работи' : 'Не работи'}</p>`)
    
    // Parts-specific fields
    if (listing.category === 'Части') {
        if (listing.subcategory) details.push(`<p><strong>Вид част:</strong> ${listing.subcategory}</p>`)
        if (listing.slot_type) details.push(`<p><strong>Тип слот:</strong> ${listing.slot_type}</p>`)
        if (listing.video_standard) details.push(`<p><strong>Видеостандарт:</strong> ${listing.video_standard}</p>`)
    }
    
    // Monitor-specific fields
    if (listing.category === 'Монитори' && listing.video_input) {
        details.push(`<p><strong>Видеовход:</strong> ${listing.video_input}</p>`)
    }
    
    // Subcategory for mice, keyboards, computers
    const subcategoryOnlyCategories = ['Мишки', 'Клавиатури', 'Компютри']
    if (subcategoryOnlyCategories.includes(listing.category) && listing.subcategory) {
        details.push(`<p><strong>Тип:</strong> ${listing.subcategory}</p>`)
    }
    
    if (details.length === 0) return ''
    
    return `
        <hr>
        <h4>Технически детайли</h4>
        ${details.join('')}
    `
}

function renderRelatedListings(related, category, placeholderImage) {
    if (related.length === 0) {
        return ''
    }
    
    return `
        <div class="mt-5">
            <h4 class="mb-4">Още обяви в категория "${category}"</h4>
            <div class="row g-4">
                ${related.map(listing => {
                    const imageUrl = (listing.images && listing.images[0]) || listing.image_url || placeholderImage
                    return `
                    <div class="col-md-6 col-lg-4">
                        <div class="card h-100">
                            <div class="bg-light d-flex align-items-center justify-content-center" style="height: 150px;">
                                <img src="${imageUrl}" alt="${listing.title}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
                            </div>
                            <div class="card-body">
                                <h6 class="card-title">${listing.title}</h6>
                                <p class="card-text text-muted small">${listing.location}</p>
                                <p class="card-text fw-bold">${formatListingPrice(listing.price)}</p>
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


