/**
 * Listings Page
 * Display all listings with filters and search
 */

import { listingsService, isSupabaseConnected } from '../services/supabaseService.js'

// Neutral gray placeholder to hint missing photo
const placeholderImage = 'https://dummyimage.com/800x600/cfcfcf/8a8a8a&text=%D0%B1%D0%B5%D0%B7+%D1%81%D0%BD%D0%B8%D0%BC%D0%BA%D0%B0'

export async function renderListings(params = {}) {
    const content = document.getElementById('content')
    
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
    
    // Fetch listings from Supabase
    let allListings = []
    if (isSupabaseConnected()) {
        allListings = await listingsService.getAllListings()
    }

    content.innerHTML = `
        <div class="container py-5">
            <!-- Page Title -->
            <div class="row mb-5">
                <div class="col-12">
                    <h1 class="display-5 fw-bold mb-3">Всички обяви</h1>
                    <p class="text-muted">Вижте всички налични обяви за бартер (${allListings.length} обяви)</p>
                </div>
            </div>

            <!-- Filters and Search -->
            <div class="row mb-4 g-3">
                <div class="col-md-3">
                    <input type="text" class="form-control" placeholder="Търсене по название..." id="searchInput">
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="categoryFilter">
                        <option value="">Всички категории</option>
                        <option value="Компютри">Компютри</option>
                        <option value="Клавиатури">Клавиатури</option>
                        <option value="Монитори">Монитори</option>
                        <option value="Мишки">Мишки</option>
                        <option value="Периферия">Периферия</option>
                        <option value="Части">Части</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <select class="form-select" id="sortFilter">
                        <option value="latest">Най-нови</option>
                        <option value="oldest">Най-стари</option>
                        <option value="title">По име (А-Я)</option>
                    </select>
                </div>
                <div class="col-md-3">
                    <button class="btn btn-secondary w-100" id="resetBtn">Изчистване</button>
                </div>
            </div>

            <!-- Listings Grid -->
            <div class="row" id="listingsGrid">
                ${renderListingsGrid(allListings)}
            </div>
        </div>
    `

    // Add event listeners for filters
    attachFilterListeners(allListings)
    
    // Apply initial category filter from query if provided
    if (params.query?.category) {
        const categoryFilter = document.getElementById('categoryFilter')
        if (categoryFilter) {
            categoryFilter.value = params.query.category
            // Trigger filtering
            categoryFilter.dispatchEvent(new Event('change'))
        }
    }
}

function attachFilterListeners(allListings) {
    const searchInput = document.getElementById('searchInput')
    const categoryFilter = document.getElementById('categoryFilter')
    const sortFilter = document.getElementById('sortFilter')
    const resetBtn = document.getElementById('resetBtn')
    
    const updateListings = () => {
        let filtered = allListings.filter(listing => {
            const matchesSearch = listing.title.toLowerCase().includes(searchInput.value.toLowerCase())
            const matchesCategory = !categoryFilter.value || listing.category === categoryFilter.value
            return matchesSearch && matchesCategory
        })
        
        // Sort
        if (sortFilter.value === 'title') {
            filtered.sort((a, b) => a.title.localeCompare(b.title, 'bg'))
        } else if (sortFilter.value === 'oldest') {
            filtered.reverse()
        }
        
        document.getElementById('listingsGrid').innerHTML = renderListingsGrid(filtered)
    }
    
    searchInput.addEventListener('input', updateListings)
    categoryFilter.addEventListener('change', updateListings)
    sortFilter.addEventListener('change', updateListings)
    
    resetBtn.addEventListener('click', () => {
        searchInput.value = ''
        categoryFilter.value = ''
        sortFilter.value = 'latest'
        updateListings()
    })
}

function renderListingsGrid(listings) {
    if (listings.length === 0) {
        return `
            <div class="col-12">
                <div class="alert alert-info" role="alert">
                    <i class="bi bi-info-circle"></i> Не са намерени обяви. Опитайте с други критерии.
                </div>
            </div>
        `
    }
    
    return listings.map(listing => {
        const imageUrl = (listing.images && listing.images[0]) || listing.image_url
        const displayImage = imageUrl || placeholderImage

        return `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 listing-card">
                <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px; cursor: pointer;">
                    <a href="#/listing/${listing.id}" style="text-decoration: none; color: inherit; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                        <img src="${displayImage}" alt="${listing.title}" style="max-height: 100%; max-width: 100%; object-fit: contain;">
                    </a>
                </div>
                <div class="card-body">
                    <h5 class="card-title">
                        <a href="#/listing/${listing.id}" style="text-decoration: none; color: inherit;">
                            ${listing.title}
                        </a>
                    </h5>
                    <p class="card-text text-muted small">${listing.description || 'Няма описание'}</p>
                    <p class="card-text">
                        <small>
                            <i class="bi bi-geo-alt"></i> ${listing.location || 'Неопределено'} |
                            <i class="bi bi-person"></i> ${listing.users?.full_name || listing.owner || 'Неизвестен'}
                        </small>
                    </p>
                    <p class="card-text text-muted small">${formatDate(listing.created_at)}</p>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold">${listing.price || 'по договаряне'}</span>
                        <a href="#/listing/${listing.id}" class="btn btn-sm btn-primary">
                            <i class="bi bi-eye"></i> Подробности
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `
    }).join('')
}

function formatDate(dateString) {
    if (!dateString) return 'Неизвестна дата'
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (minutes < 1) return 'току-що'
    if (minutes < 60) return `${minutes} минути`
    if (hours < 24) return `${hours} часа`
    return `${days} дни`
}
