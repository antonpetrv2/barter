/**
 * Listings Page
 * Display all listings with filters and search
 */

export function renderListings() {
    const content = document.getElementById('content')
    
    // Mock data - will be replaced with Supabase data
    const allListings = [
        {
            id: 1,
            title: 'Commodore 64',
            description: 'Работи отлично, комплект с джойстик',
            price: 'за разговор',
            location: 'София',
            category: 'Компютри',
            image: '🖥️',
            owner: 'Ivan Ivanov',
            date: '2 часа назад'
        },
        {
            id: 2,
            title: 'Amiga 500',
            description: 'Оригинален модел от 1987г',
            price: 'за разговор',
            location: 'Пловдив',
            category: 'Компютри',
            image: '💾',
            owner: 'Maria Georgieva',
            date: '1 день назад'
        },
        {
            id: 3,
            title: 'IBM PC XT',
            description: 'Класически компютър, всички документи',
            price: 'за разговор',
            location: 'Варна',
            category: 'Компютри',
            image: '🔌',
            owner: 'Petko Borisov',
            date: '3 дни назад'
        },
        {
            id: 4,
            title: 'Механична клавиатура',
            description: 'Немска клавиатура, идеално състояние',
            price: 'за разговор',
            location: 'Бургас',
            category: 'Клавиатури',
            image: '⌨️',
            owner: 'Aleksandar Aleksandrov',
            date: '5 часа назад'
        },
        {
            id: 5,
            title: 'CRT Монитор',
            description: 'Безопасност монитор 17 инча, перфектен пиксел',
            price: 'за разговор',
            location: 'Велико Търново',
            category: 'Монитори',
            image: '🖱️',
            owner: 'Elena Popova',
            date: '1 неделя назад'
        },
        {
            id: 6,
            title: 'Логитех мишка',
            description: 'Старовинна мишка, работи отлично',
            price: 'за разговор',
            location: 'Плевен',
            category: 'Мишки',
            image: '🔧',
            owner: 'Nikolay Nikolov',
            date: '2 дни назад'
        },
    ]
    
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
            <div class="row mb-4">
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
                    <button class="btn btn-secondary w-100" id="resetBtn">Очистить</button>
                </div>
            </div>

            <!-- Listings Grid -->
            <div class="row" id="listingsGrid">
                ${renderListingsGrid(allListings)}
            </div>
        </div>
    `
    
    // Add event listeners for filters
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
    
    return listings.map(listing => `
        <div class="col-md-6 col-lg-4 mb-4">
            <div class="card h-100 listing-card">
                <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px; font-size: 4rem; cursor: pointer;">
                    <a href="#/listing/${listing.id}" style="text-decoration: none; color: inherit; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                        ${listing.image}
                    </a>
                </div>
                <div class="card-body">
                    <h5 class="card-title">
                        <a href="#/listing/${listing.id}" style="text-decoration: none; color: inherit;">
                            ${listing.title}
                        </a>
                    </h5>
                    <p class="card-text text-muted small">${listing.description}</p>
                    <p class="card-text">
                        <small>
                            <i class="bi bi-geo-alt"></i> ${listing.location} |
                            <i class="bi bi-person"></i> ${listing.owner}
                        </small>
                    </p>
                    <p class="card-text text-muted small">${listing.date}</p>
                </div>
                <div class="card-footer bg-transparent">
                    <div class="d-flex justify-content-between align-items-center">
                        <span class="fw-bold">${listing.price}</span>
                        <a href="#/listing/${listing.id}" class="btn btn-sm btn-primary">
                            <i class="bi bi-eye"></i> Подробности
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('')
}
