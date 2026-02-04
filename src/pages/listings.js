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
            
            <!-- Advanced Filters for Parts (shown only when category is "Части") -->
            <div class="row mb-4 g-3" id="partsFilters" style="display: none;">
                <div class="col-md-4">
                    <label class="form-label small text-muted">Подкатегория</label>
                    <select class="form-select" id="subcategoryFilter">
                        <option value="">Всички подкатегории</option>
                        <option value="Видеокарти">Видеокарти</option>
                        <option value="Звукови карти">Звукови карти</option>
                        <option value="Лан карти">Лан карти</option>
                        <option value="Други">Други</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label small text-muted">Тип слот</label>
                    <select class="form-select" id="slotFilter">
                        <option value="">Всички слотове</option>
                        <option value="ISA">ISA</option>
                        <option value="VLB">VLB</option>
                        <option value="AGP">AGP</option>
                        <option value="PCI">PCI</option>
                        <option value="PCIe">PCIe</option>
                    </select>
                </div>
                <div class="col-md-4">
                    <label class="form-label small text-muted">Видеостандарт</label>
                    <select class="form-select" id="videoStandardFilter">
                        <option value="">Всички стандарти</option>
                        <option value="VGA">VGA</option>
                        <option value="CGA">CGA</option>
                        <option value="EGA">EGA</option>
                        <option value="MDA">MDA</option>
                        <option value="Hercules">Hercules</option>
                    </select>
                </div>
            </div>
            
            <!-- Advanced Filters for Monitors (shown only when category is "Монитори") -->
            <div class="row mb-4 g-3" id="monitorsFilters" style="display: none;">
                <div class="col-md-12">
                    <label class="form-label small text-muted">Видеовход</label>
                    <select class="form-select" id="videoInputFilter">
                        <option value="">Всички входове</option>
                        <option value="VGA">VGA</option>
                        <option value="CGA">CGA</option>
                        <option value="EGA">EGA</option>
                        <option value="MDA">MDA</option>
                        <option value="Hercules">Hercules</option>
                        <option value="Чинч">Чинч (Composite/RCA)</option>
                        <option value="DVI">DVI</option>
                        <option value="HDMI">HDMI</option>
                    </select>
                </div>
            </div>
            
            <!-- Subcategory Filters (shown for Mice, Keyboards, Computers) -->
            <div class="row mb-4 g-3" id="subcategoryOnlyFilters" style="display: none;">
                <div class="col-md-12">
                    <label class="form-label small text-muted">Подкатегория</label>
                    <select class="form-select" id="subcategoryOnlyFilter">
                        <option value="">Всички подкатегории</option>
                    </select>
                </div>
            </div>

            <!-- Listings Grid -->
            <div class="row" id="listingsGrid">
                ${renderListingsGrid(allListings)}
            </div>
            
            <!-- Pagination -->
            <div id="paginationContainer"></div>
        </div>
    `

    // Add event listeners for filters
    attachFilterListeners(allListings)
    
    // Apply initial filters from query parameters
    if (params.query?.category) {
        const categoryFilter = document.getElementById('categoryFilter')
        if (categoryFilter) {
            categoryFilter.value = params.query.category
            // Trigger filtering
            categoryFilter.dispatchEvent(new Event('change'))
        }
    }
    
    if (params.query?.search) {
        const searchInput = document.getElementById('searchInput')
        if (searchInput) {
            searchInput.value = decodeURIComponent(params.query.search)
            // Trigger filtering
            searchInput.dispatchEvent(new Event('input'))
        }
    }
}

function attachFilterListeners(allListings) {
    const searchInput = document.getElementById('searchInput')
    const categoryFilter = document.getElementById('categoryFilter')
    const sortFilter = document.getElementById('sortFilter')
    const resetBtn = document.getElementById('resetBtn')
    const partsFilters = document.getElementById('partsFilters')
    const monitorsFilters = document.getElementById('monitorsFilters')
    const subcategoryOnlyFilters = document.getElementById('subcategoryOnlyFilters')
    const subcategoryFilter = document.getElementById('subcategoryFilter')
    const slotFilter = document.getElementById('slotFilter')
    const videoStandardFilter = document.getElementById('videoStandardFilter')
    const videoInputFilter = document.getElementById('videoInputFilter')
    const subcategoryOnlyFilter = document.getElementById('subcategoryOnlyFilter')
    
    let currentPage = 1
    const itemsPerPage = 15
    
    // Subcategory options for different categories
    const subcategoryOptions = {
        'Мишки': ['COM/RS232', 'PS/2', 'USB'],
        'Клавиатури': ['DIN5', 'PS/2', 'USB', 'SDL', 'Други'],
        'Компютри': ['x86 съвместими', 'Apple II съвместими', 'MAC серия', 'Atari', 'ZX Spectrum', 'Oric', 'Amiga', 'Други']
    }
    
    // Show/hide category-specific filters
    const toggleCategoryFilters = () => {
        const category = categoryFilter.value
        
        // Reset all filters first
        partsFilters.style.display = 'none'
        monitorsFilters.style.display = 'none'
        subcategoryOnlyFilters.style.display = 'none'
        
        if (category === 'Части') {
            partsFilters.style.display = 'flex'
        } else if (category === 'Монитори') {
            monitorsFilters.style.display = 'flex'
        } else if (subcategoryOptions[category]) {
            // Show subcategory filter for Mice, Keyboards, Computers
            subcategoryOnlyFilters.style.display = 'flex'
            
            // Populate subcategory options
            subcategoryOnlyFilter.innerHTML = '<option value="">Всички подкатегории</option>'
            subcategoryOptions[category].forEach(opt => {
                subcategoryOnlyFilter.innerHTML += `<option value="${opt}">${opt}</option>`
            })
        }
        
        // Reset all filter values
        if (category !== 'Части') {
            subcategoryFilter.value = ''
            slotFilter.value = ''
            videoStandardFilter.value = ''
        }
        if (category !== 'Монитори') {
            videoInputFilter.value = ''
        }
        if (!subcategoryOptions[category]) {
            subcategoryOnlyFilter.value = ''
        }
    }
    
    const updateListings = () => {
        let filtered = allListings.filter(listing => {
            const matchesSearch = listing.title.toLowerCase().includes(searchInput.value.toLowerCase())
            const matchesCategory = !categoryFilter.value || listing.category === categoryFilter.value
            
            // Subcategory matching (works for Parts, Mice, Keyboards, Computers)
            const subcategoryValue = categoryFilter.value === 'Части' ? subcategoryFilter.value : subcategoryOnlyFilter.value
            const matchesSubcategory = !subcategoryValue || listing.subcategory === subcategoryValue
            
            const matchesSlot = !slotFilter.value || listing.slot_type === slotFilter.value
            const matchesVideoStandard = !videoStandardFilter.value || listing.video_standard === videoStandardFilter.value
            const matchesVideoInput = !videoInputFilter.value || listing.video_input === videoInputFilter.value
            return matchesSearch && matchesCategory && matchesSubcategory && matchesSlot && matchesVideoStandard && matchesVideoInput
        })
        
        // Sort
        if (sortFilter.value === 'title') {
            filtered.sort((a, b) => a.title.localeCompare(b.title, 'bg'))
        } else if (sortFilter.value === 'oldest') {
            filtered.reverse()
        }
        
        // Pagination
        const totalPages = Math.ceil(filtered.length / itemsPerPage)
        const startIndex = (currentPage - 1) * itemsPerPage
        const endIndex = startIndex + itemsPerPage
        const paginatedListings = filtered.slice(startIndex, endIndex)
        
        document.getElementById('listingsGrid').innerHTML = renderListingsGrid(paginatedListings)
        document.getElementById('paginationContainer').innerHTML = renderPagination(currentPage, totalPages, filtered.length)
        
        // Attach pagination event listeners
        attachPaginationListeners(totalPages)
    }
    
    const attachPaginationListeners = (totalPages) => {
        const paginationLinks = document.querySelectorAll('.page-link')
        paginationLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault()
                const page = parseInt(link.dataset.page)
                if (page && page !== currentPage && page > 0 && page <= totalPages) {
                    currentPage = page
                    updateListings()
                    window.scrollTo({ top: 0, behavior: 'smooth' })
                }
            })
        })
    }
    
    searchInput.addEventListener('input', () => {
        currentPage = 1
        updateListings()
    })
    categoryFilter.addEventListener('change', () => {
        currentPage = 1
        toggleCategoryFilters()
        updateListings()
    })
    subcategoryFilter.addEventListener('change', () => {
        currentPage = 1
        updateListings()
    })
    subcategoryOnlyFilter.addEventListener('change', () => {
        currentPage = 1
        updateListings()
    })
    slotFilter.addEventListener('change', () => {
        currentPage = 1
        updateListings()
    })
    videoStandardFilter.addEventListener('change', () => {
        currentPage = 1
        updateListings()
    })
    videoInputFilter.addEventListener('change', () => {
        currentPage = 1
        updateListings()
    })
    sortFilter.addEventListener('change', updateListings)
    
    resetBtn.addEventListener('click', () => {
        searchInput.value = ''
        categoryFilter.value = ''
        sortFilter.value = 'latest'
        subcategoryFilter.value = ''
        subcategoryOnlyFilter.value = ''
        slotFilter.value = ''
        videoStandardFilter.value = ''
        videoInputFilter.value = ''
        currentPage = 1
        toggleCategoryFilters()
        updateListings()
    })
    
    // Initial check for category-specific filters
    toggleCategoryFilters()
}

function renderPagination(currentPage, totalPages, totalItems) {
    if (totalPages <= 1) return ''
    
    let pages = []
    
    // Previous button
    pages.push(`
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage - 1}">
                <i class="bi bi-chevron-left"></i>
            </a>
        </li>
    `)
    
    // Page numbers (show max 5 pages)
    let startPage = Math.max(1, currentPage - 2)
    let endPage = Math.min(totalPages, currentPage + 2)
    
    if (startPage > 1) {
        pages.push(`<li class="page-item"><a class="page-link" href="#" data-page="1">1</a></li>`)
        if (startPage > 2) {
            pages.push(`<li class="page-item disabled"><span class="page-link">...</span></li>`)
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        pages.push(`
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" data-page="${i}">${i}</a>
            </li>
        `)
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            pages.push(`<li class="page-item disabled"><span class="page-link">...</span></li>`)
        }
        pages.push(`<li class="page-item"><a class="page-link" href="#" data-page="${totalPages}">${totalPages}</a></li>`)
    }
    
    // Next button
    pages.push(`
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" data-page="${currentPage + 1}">
                <i class="bi bi-chevron-right"></i>
            </a>
        </li>
    `)
    
    return `
        <div class="d-flex justify-content-between align-items-center mt-4">
            <div class="text-muted">
                Показани ${(currentPage - 1) * 15 + 1} - ${Math.min(currentPage * 15, totalItems)} от ${totalItems} обяви
            </div>
            <nav>
                <ul class="pagination mb-0">
                    ${pages.join('')}
                </ul>
            </nav>
        </div>
    `
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
