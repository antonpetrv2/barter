/**
 * Admin Panel Page
 * Manage users, approvals, bans, and system statistics
 */

import { adminService, authService, listingsService, storageService } from '../services/supabaseService.js'
import JSZip from 'jszip'

export async function renderAdmin(params) {
    const content = document.getElementById('content')
    
    // Show loading first
    content.innerHTML = `
        <div class="container py-5">
            <div class="text-center">
                <div class="spinner-border" role="status"></div>
                <p class="mt-3">Проверка на достъп...</p>
            </div>
        </div>
    `
    
    // Check if user is admin
    const user = await authService.getCurrentUser()
    const userProfile = user ? await authService.getUserProfile(user.id) : null
    
    if (!user || !userProfile || userProfile.role !== 'admin') {
        content.innerHTML = `
            <div class="container py-5">
                <div class="alert alert-danger" role="alert">
                    <h4 class="alert-heading">Забранен достъп!</h4>
                    <p>Само администраторите имат достъп до този панел.</p>
                    <hr>
                    <a href="#/" class="btn btn-primary">Назад в началото</a>
                </div>
            </div>
        `
        return
    }

    // Show admin panel
    content.innerHTML = `
        <div class="container-fluid py-4">
            <!-- Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="display-5 mb-2">Администраторски Панел</h1>
                    <p class="text-muted">Управление на потребители и система</p>
                </div>
            </div>

            <!-- Statistics Dashboard -->
            <div id="statistics" class="row mb-4">
                <div class="col-md-6 col-lg-3 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title text-muted">Всички потребители</h6>
                            <h3 class="mb-0" id="total-users">-</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title text-muted">Чакащи одобрение</h6>
                            <h3 class="mb-0" id="pending-approvals">-</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title text-muted">Блокирани потребители</h6>
                            <h3 class="mb-0" id="banned-users">-</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title text-muted">Активни обяви</h6>
                            <h3 class="mb-0" id="active-listings">-</h3>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col-lg-3 mb-3">
                    <div class="card">
                        <div class="card-body">
                            <h6 class="card-title text-muted">Обяви за одобрение</h6>
                            <h3 class="mb-0" id="pending-listings">-</h3>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Tabs -->
            <ul class="nav nav-tabs mb-3" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="pending-listings-tab" data-bs-toggle="tab" data-bs-target="#pending-listings-panel" type="button">Обяви за одобрение</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending-panel" type="button">Чакащи одобрение (потребители)</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="all-users-tab" data-bs-toggle="tab" data-bs-target="#all-users-panel" type="button">Всички потребители</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="banned-tab" data-bs-toggle="tab" data-bs-target="#banned-panel" type="button">Блокирани</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="import-export-tab" data-bs-toggle="tab" data-bs-target="#import-export-panel" type="button">Import/Export</button>
                </li>
            </ul>

            <!-- Tab Content -->
            <div class="tab-content">
                <!-- Pending Listings -->
                <div class="tab-pane fade show active" id="pending-listings-panel" role="tabpanel">
                    <div id="pending-listings-list" class="alert alert-info">Зареждане...</div>
                </div>

                <!-- Pending Approvals -->
                <div class="tab-pane fade" id="pending-panel" role="tabpanel">
                    <div id="pending-list" class="alert alert-info">Зареждане...</div>
                </div>

                <!-- All Users -->
                <div class="tab-pane fade" id="all-users-panel" role="tabpanel">
                    <div class="mb-3">
                        <input type="text" id="search-users" class="form-control" placeholder="Търси по имейл или име...">
                    </div>
                    <div id="all-users-list" class="alert alert-info">Зареждане...</div>
                </div>

                <!-- Banned Users -->
                <div class="tab-pane fade" id="banned-panel" role="tabpanel">
                    <div id="banned-list" class="alert alert-info">Зареждане...</div>
                </div>

                <!-- Import/Export -->
                <div class="tab-pane fade" id="import-export-panel" role="tabpanel">
                    <div class="row">
                        <div class="col-md-6 mb-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title"><i class="bi bi-download"></i> Експорт на обяви</h5>
                                    <p class="text-muted">Експортирай всички твои обяви в ZIP архив с JSON + снимки</p>
                                    <button id="export-listings-btn" class="btn btn-primary">
                                        <i class="bi bi-file-earmark-arrow-down"></i> Експортирай обяви
                                    </button>
                                    <div id="export-status" class="mt-3"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 mb-4">
                            <div class="card">
                                <div class="card-body">
                                    <h5 class="card-title"><i class="bi bi-upload"></i> Импорт на обяви</h5>
                                    <p class="text-muted">Импортирай обяви от ZIP архив (JSON + снимки)</p>
                                    <div class="mb-3">
                                        <input type="file" class="form-control" id="import-file" accept=".zip">
                                    </div>
                                    <button id="import-listings-btn" class="btn btn-success">
                                        <i class="bi bi-file-earmark-arrow-up"></i> Импортирай обяви
                                    </button>
                                    <div id="import-status" class="mt-3"></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="alert alert-info">
                        <h6 class="alert-heading">📋 Инструкции:</h6>
                        <ul class="mb-0">
                            <li>Експортът създава ZIP архив с JSON файл + всички снимки</li>
                            <li>Импортът чете ZIP файл и качва снимките в storage</li>
                            <li><strong>⚠️ Импортът създава НОВИ обяви - ще има дублиране ако обявите вече съществуват!</strong></li>
                            <li>Всички импортирани обяви чакат одобрение от администратор</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `

    // Load data
    await loadStatistics()
    await loadPendingListings()
    await loadPendingUsers()
    await loadAllUsers()
    await loadBannedUsers()

    // Setup event listeners
    setupEventListeners()
}

/**
 * Load and display statistics
 */
async function loadStatistics() {
    const { stats, error } = await adminService.getUserStatistics()
    
    if (!error && stats) {
        document.getElementById('total-users').textContent = stats.totalUsers
        document.getElementById('pending-approvals').textContent = stats.pendingApprovals
        document.getElementById('banned-users').textContent = stats.bannedUsers
        document.getElementById('active-listings').textContent = stats.activeListings
        document.getElementById('pending-listings').textContent = stats.pendingListings
    }
}

/**
 * Load pending listings for approval
 */
async function loadPendingListings() {
    const { listings, error } = await adminService.getPendingListings()
    const container = document.getElementById('pending-listings-list')

    if (error) {
        container.innerHTML = `<div class="alert alert-danger">Грешка при зареждане</div>`
        return
    }

    if (!listings || listings.length === 0) {
        container.innerHTML = `<div class="alert alert-success">Няма чакащи одобрение обяви</div>`
        return
    }

    container.innerHTML = listings.map(listing => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-8">
                        <h5 class="card-title">${listing.title}</h5>
                        <p class="card-text">${listing.description}</p>
                        <p class="card-text text-muted mb-2">
                            <strong>Категория:</strong> ${listing.category} | 
                            <strong>Локация:</strong> ${listing.location}
                        </p>
                        <p class="card-text text-muted mb-0">
                            <strong>Автор:</strong> ${listing.users?.full_name || 'Неизвестен'} 
                            (${listing.users?.email})
                        </p>
                    </div>
                    <div class="col-md-4 text-md-end">
                        <button class="btn btn-sm btn-success approve-listing-btn" data-listing-id="${listing.id}">
                            ✓ Одобри
                        </button>
                        <button class="btn btn-sm btn-danger reject-listing-btn" data-listing-id="${listing.id}">
                            ✕ Отклони
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('')
}

/**
 * Load pending approval users
 */
async function loadPendingUsers() {
    const { data: users, error } = await adminService.getAllUsers({ status: 'pending' })
    const container = document.getElementById('pending-list')

    if (error) {
        container.innerHTML = `<div class="alert alert-danger">Грешка при зареждане</div>`
        return
    }

    if (!users || users.length === 0) {
        container.innerHTML = `<div class="alert alert-success">Няма чакащи одобрение потребители</div>`
        return
    }

    container.innerHTML = users.map(user => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-8">
                        <h5 class="card-title">${user.full_name || user.email}</h5>
                        <p class="card-text text-muted mb-2">Email: ${user.email}</p>
                        <p class="card-text text-muted mb-0">Телефон: ${user.phone || 'N/A'} | Град: ${user.city || 'N/A'}</p>
                    </div>
                    <div class="col-md-4 text-md-end">
                        <button class="btn btn-sm btn-success approve-btn" data-user-id="${user.id}">
                            <i class="bi bi-check-circle"></i> Одобри
                        </button>
                        <button class="btn btn-sm btn-danger reject-btn" data-user-id="${user.id}">
                            <i class="bi bi-x-circle"></i> Отхвърли
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('')
}

/**
 * Load all users
 */
async function loadAllUsers() {
    const { data: users, error } = await adminService.getAllUsers()
    const container = document.getElementById('all-users-list')

    if (error) {
        container.innerHTML = `<div class="alert alert-danger">Грешка при зареждане</div>`
        return
    }

    if (!users || users.length === 0) {
        container.innerHTML = `<div class="alert alert-info">Няма потребители</div>`
        return
    }

    renderUsersList(users, container)
}

/**
 * Load banned users
 */
async function loadBannedUsers() {
    const { data: users, error } = await adminService.getAllUsers({ is_banned: true })
    const container = document.getElementById('banned-list')

    if (error) {
        container.innerHTML = `<div class="alert alert-danger">Грешка при зареждане</div>`
        return
    }

    if (!users || users.length === 0) {
        container.innerHTML = `<div class="alert alert-success">Няма блокирани потребители</div>`
        return
    }

    container.innerHTML = users.map(user => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="row">
                    <div class="col-md-8">
                        <h5 class="card-title">${user.full_name || user.email}</h5>
                        <p class="card-text text-muted mb-2">Email: ${user.email}</p>
                        <p class="card-text text-muted mb-2">Причина: ${user.ban_reason || 'Не е посочена'}</p>
                        <p class="card-text text-muted mb-0">Блокиран на: ${new Date(user.banned_at).toLocaleDateString('bg-BG')}</p>
                    </div>
                    <div class="col-md-4 text-md-end">
                        <button class="btn btn-sm btn-warning unban-btn" data-user-id="${user.id}">
                            <i class="bi bi-unlock"></i> Отблокирай
                        </button>
                        <button class="btn btn-sm btn-danger delete-btn" data-user-id="${user.id}">
                            <i class="bi bi-trash"></i> Изтрий
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('')
}

/**
 * Render users list with actions
 */
function renderUsersList(users, container) {
    container.innerHTML = `
        <div class="table-responsive">
            <table class="table table-hover">
                <thead>
                    <tr>
                        <th>Име</th>
                        <th>Email</th>
                        <th>Статус</th>
                        <th>Роля</th>
                        <th>Рейтинг</th>
                        <th>Обяви</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.map(user => `
                        <tr>
                            <td>${user.full_name || 'N/A'}</td>
                            <td><small>${user.email}</small></td>
                            <td>
                                <span class="badge ${getStatusBadgeClass(user.status)}">
                                    ${getStatusLabel(user.status)}
                                </span>
                            </td>
                            <td>
                                <span class="badge ${user.role === 'admin' ? 'bg-warning' : 'bg-secondary'}">
                                    ${user.role === 'admin' ? 'Админ' : 'Потребител'}
                                </span>
                            </td>
                            <td>
                                <i class="bi bi-star-fill text-warning"></i> ${user.rating || 5.0}
                            </td>
                            <td>${user.listings_count || 0}</td>
                            <td>
                                <button class="btn btn-xs btn-info ban-btn" data-user-id="${user.id}" title="Блокирай">
                                    <i class="bi bi-hand-thumbs-down"></i>
                                </button>
                                ${user.role !== 'admin' 
                                    ? `<button class="btn btn-xs btn-warning make-admin-btn" data-user-id="${user.id}" title="Направи админ"><i class="bi bi-shield-check"></i></button>`
                                    : `<button class="btn btn-xs btn-secondary remove-admin-btn" data-user-id="${user.id}" title="Премахни админ"><i class="bi bi-shield-x"></i></button>`
                                }
                                <button class="btn btn-xs btn-danger delete-btn" data-user-id="${user.id}" title="Изтрий">
                                    <i class="bi bi-trash"></i>
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `
}

/**
 * Get status badge class
 */
function getStatusBadgeClass(status) {
    switch (status) {
        case 'approved':
            return 'bg-success'
        case 'pending':
            return 'bg-warning'
        case 'rejected':
            return 'bg-danger'
        default:
            return 'bg-secondary'
    }
}

/**
 * Get status label
 */
function getStatusLabel(status) {
    switch (status) {
        case 'approved':
            return 'Одобрен'
        case 'pending':
            return 'Чакащ'
        case 'rejected':
            return 'Отхвърлен'
        default:
            return 'Неизвестен'
    }
}

/**
 * Setup event listeners for all actions
 */
function setupEventListeners() {
    // Approve listing buttons
    document.querySelectorAll('.approve-listing-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const listingId = e.currentTarget.dataset.listingId
            await approveListing(listingId)
        })
    })

    // Reject listing buttons
    document.querySelectorAll('.reject-listing-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const listingId = e.currentTarget.dataset.listingId
            await rejectListing(listingId)
        })
    })

    // Approve buttons
    document.querySelectorAll('.approve-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const userId = e.currentTarget.dataset.userId
            await approveUser(userId)
        })
    })

    // Reject buttons
    document.querySelectorAll('.reject-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const userId = e.currentTarget.dataset.userId
            await rejectUser(userId)
        })
    })

    // Ban buttons
    document.querySelectorAll('.ban-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const userId = e.currentTarget.dataset.userId
            await banUserWithReason(userId)
        })
    })

    // Unban buttons
    document.querySelectorAll('.unban-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const userId = e.currentTarget.dataset.userId
            await unbanUser(userId)
        })
    })

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const userId = e.currentTarget.dataset.userId
            await deleteUser(userId)
        })
    })

    // Make admin buttons
    document.querySelectorAll('.make-admin-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const userId = e.currentTarget.dataset.userId
            await makeUserAdmin(userId)
        })
    })

    // Remove admin buttons
    document.querySelectorAll('.remove-admin-btn').forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const userId = e.currentTarget.dataset.userId
            await removeAdminPrivileges(userId)
        })
    })

    // Search users
    const searchInput = document.getElementById('search-users')
    if (searchInput) {
        searchInput.addEventListener('input', async (e) => {
            const search = e.target.value
            const { data: users } = await adminService.getAllUsers({ search })
            const container = document.getElementById('all-users-list')
            renderUsersList(users || [], container)
            setupEventListeners()
        })
    }

    // Export listings button
    const exportBtn = document.getElementById('export-listings-btn')
    if (exportBtn) {
        exportBtn.addEventListener('click', exportListings)
    }

    // Import listings button
    const importBtn = document.getElementById('import-listings-btn')
    if (importBtn) {
        importBtn.addEventListener('click', importListings)
    }
}

/**
 * Approve user
 */
async function approveUser(userId) {
    if (!confirm('Сигурен ли си, че искаш да одобриш този потребител?')) return

    const { error } = await adminService.approveUser(userId)
    if (error) {
        alert('Грешка при одобрение: ' + error.message)
        return
    }

    alert('✅ Потребителят е одобрен!')
    await loadPendingUsers()
    await loadStatistics()
}

/**
 * Reject user
 */
async function rejectUser(userId) {
    const reason = prompt('Причина за отхвърляне (опционално):')
    if (reason === null) return

    const { error } = await adminService.rejectUser(userId, reason)
    if (error) {
        alert('Грешка при отхвърляне: ' + error.message)
        return
    }

    alert('❌ Потребителят е отхвърлен!')
    await loadPendingUsers()
    await loadStatistics()
}

/**
 * Ban user with reason
 */
async function banUserWithReason(userId) {
    const reason = prompt('Причина за блокиране:')
    if (reason === null) return

    const { error } = await adminService.banUser(userId, reason)
    if (error) {
        alert('Грешка при блокиране: ' + error.message)
        return
    }

    alert('🚫 Потребителят е блокиран!')
    await loadAllUsers()
    await loadBannedUsers()
    await loadStatistics()
}

/**
 * Unban user
 */
async function unbanUser(userId) {
    if (!confirm('Сигурен ли си, че искаш да разблокираш този потребител?')) return

    const { error } = await adminService.unbanUser(userId)
    if (error) {
        alert('Грешка при разблокиране: ' + error.message)
        return
    }

    alert('✅ Потребителят е разблокиран!')
    await loadBannedUsers()
    await loadStatistics()
}

/**
 * Delete user
 */
async function deleteUser(userId) {
    if (!confirm('⚠️ ВНИМАНИЕ: Това ще изтрие всички данни на потребителя. Продължи ли?')) return

    const { error } = await adminService.deleteUser(userId)
    if (error) {
        alert('Грешка при изтриване: ' + error.message)
        return
    }

    alert('✅ Потребителят е изтрит!')
    await loadAllUsers()
    await loadBannedUsers()
    await loadStatistics()
}

/**
 * Make user admin
 */
async function makeUserAdmin(userId) {
    if (!confirm('Сигурен ли си, че искаш да направиш този потребител администратор?')) return

    const { error } = await adminService.makeUserAdmin(userId)
    if (error) {
        alert('Грешка: ' + error.message)
        return
    }

    alert('✅ Потребителят е администратор!')
    await loadAllUsers()
    setupEventListeners()
}

/**
 * Remove admin privileges
 */
async function removeAdminPrivileges(userId) {
    if (!confirm('Сигурен ли си, че искаш да премахнеш администраторските привилегии?')) return

    const { error } = await adminService.removeAdminPrivileges(userId)
    if (error) {
        alert('Грешка: ' + error.message)
        return
    }

    alert('✅ Администраторските привилегии са премахнати!')
    await loadAllUsers()
    setupEventListeners()
}
/**
 * Approve a listing
 */
async function approveListing(listingId) {
    if (!confirm('Одобриш ли тази обява?')) return

    const { error } = await adminService.approveListing(listingId)
    if (error) {
        alert('❌ Грешка: ' + error.message)
        return
    }

    alert('✅ Обявата е одобрена!')
    await loadStatistics()
    await loadPendingListings()
}

/**
 * Reject a listing
 */
async function rejectListing(listingId) {
    if (!confirm('Сигурен ли си, че искаш да отклониш тази обява?')) return

    const { error } = await adminService.rejectListing(listingId)
    if (error) {
        alert('❌ Грешка: ' + error.message)
        return
    }

    alert('✅ Обявата е отклонена!')
    await loadStatistics()
    await loadPendingListings()
}

/**
 * Export all user's listings to JSON with images in ZIP
 */
async function exportListings() {
    const exportBtn = document.getElementById('export-listings-btn')
    const exportStatus = document.getElementById('export-status')
    
    try {
        exportBtn.disabled = true
        exportStatus.innerHTML = '<div class="alert alert-info">Експортиране...</div>'
        
        // Get current user's listings
        const user = await authService.getCurrentUser()
        const listings = await listingsService.getUserListings(user.id)
        
        if (!listings || listings.length === 0) {
            exportStatus.innerHTML = '<div class="alert alert-warning">Няма обяви за експорт</div>'
            exportBtn.disabled = false
            return
        }
        
        // Create ZIP file
        const zip = new JSZip()
        
        // Create export data
        const exportData = {
            version: '1.0',
            exportDate: new Date().toISOString(),
            userId: user.id,
            listingsCount: listings.length,
            listings: listings
        }
        
        // Add JSON file
        zip.file('listings.json', JSON.stringify(exportData, null, 2))
        
        // Download all images
        const imagesFolder = zip.folder('images')
        let imageCount = 0
        
        for (let i = 0; i < listings.length; i++) {
            const listing = listings[i]
            if (listing.images && listing.images.length > 0) {
                exportStatus.innerHTML = `<div class="alert alert-info">Изтегляне на снимки... (${i + 1}/${listings.length})</div>`
                
                for (let j = 0; j < listing.images.length; j++) {
                    const imageUrl = listing.images[j]
                    try {
                        // Fetch image as blob
                        const response = await fetch(imageUrl)
                        const blob = await response.blob()
                        
                        // Extract filename or create one
                        const urlParts = imageUrl.split('/')
                        const filename = urlParts[urlParts.length - 1] || `listing-${listing.id}-image-${j}.webp`
                        
                        imagesFolder.file(filename, blob)
                        imageCount++
                    } catch (err) {
                        console.error(`Failed to download image ${imageUrl}:`, err)
                    }
                }
            }
        }
        
        exportStatus.innerHTML = '<div class="alert alert-info">Създаване на ZIP архив...</div>'
        
        // Generate ZIP file
        const zipBlob = await zip.generateAsync({ type: 'blob' })
        
        // Download ZIP file
        const url = URL.createObjectURL(zipBlob)
        const a = document.createElement('a')
        a.href = url
        a.download = `barter-listings-export-${new Date().toISOString().split('T')[0]}.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        exportStatus.innerHTML = `<div class="alert alert-success">✅ Експортирани ${listings.length} обяви и ${imageCount} снимки успешно!</div>`
        
    } catch (error) {
        console.error('Export error:', error)
        exportStatus.innerHTML = `<div class="alert alert-danger">❌ Грешка: ${error.message}</div>`
    } finally {
        exportBtn.disabled = false
    }
}

/**
 * Import listings from ZIP file with images
 */
async function importListings() {
    const fileInput = document.getElementById('import-file')
    const importBtn = document.getElementById('import-listings-btn')
    const importStatus = document.getElementById('import-status')
    
    const file = fileInput.files[0]
    if (!file) {
        importStatus.innerHTML = '<div class="alert alert-warning">Моля избери ZIP файл за импорт</div>'
        return
    }
    
    if (!file.name.endsWith('.zip')) {
        importStatus.innerHTML = '<div class="alert alert-danger">Моля избери ZIP файл (не JSON)</div>'
        return
    }
    
    try {
        importBtn.disabled = true
        importStatus.innerHTML = '<div class="alert alert-info">Четене на ZIP файл...</div>'
        
        // Read ZIP file
        const zip = new JSZip()
        const zipContent = await zip.loadAsync(file)
        
        // Read JSON file
        const jsonFile = zipContent.file('listings.json')
        if (!jsonFile) {
            throw new Error('Липсва listings.json във файла')
        }
        
        const jsonText = await jsonFile.async('text')
        const importData = JSON.parse(jsonText)
        
        // Validate format
        if (!importData.version || !importData.listings || !Array.isArray(importData.listings)) {
            throw new Error('Невалиден формат на файла')
        }
        
        const user = await authService.getCurrentUser()
        let successCount = 0
        let errorCount = 0
        let duplicateCount = 0
        
        // Get images folder
        const imagesFolder = zipContent.folder('images')
        const imageFiles = {}
        
        if (imagesFolder) {
            imagesFolder.forEach((relativePath, file) => {
                imageFiles[relativePath] = file
            })
        }
        
        importStatus.innerHTML = `<div class="alert alert-info">⚠️ ВНИМАНИЕ: Ще се създадат ${importData.listings.length} НОВИ обяви. 
        Ако вече имаш тези обяви, ще се дублират!<br><br>
        <button id="confirm-import-btn" class="btn btn-warning">Продължи с импорта</button>
        <button id="cancel-import-btn" class="btn btn-secondary">Отказ</button></div>`
        
        // Wait for confirmation
        const confirmed = await new Promise((resolve) => {
            document.getElementById('confirm-import-btn').addEventListener('click', () => resolve(true))
            document.getElementById('cancel-import-btn').addEventListener('click', () => resolve(false))
        })
        
        if (!confirmed) {
            importStatus.innerHTML = '<div class="alert alert-info">Импортът е отменен</div>'
            importBtn.disabled = false
            return
        }
        
        // Import each listing
        for (let i = 0; i < importData.listings.length; i++) {
            const listing = importData.listings[i]
            
            try {
                importStatus.innerHTML = `<div class="alert alert-info">Импортиране на обява ${i + 1}/${importData.listings.length}...</div>`
                
                // Upload images from ZIP
                const uploadedImageUrls = []
                
                if (listing.images && listing.images.length > 0) {
                    for (const oldImageUrl of listing.images) {
                        // Extract filename from old URL
                        const urlParts = oldImageUrl.split('/')
                        const filename = urlParts[urlParts.length - 1]
                        
                        // Find image in ZIP
                        const imageFile = imageFiles[filename]
                        if (imageFile) {
                            try {
                                const imageBlob = await imageFile.async('blob')
                                const file = new File([imageBlob], filename, { type: imageBlob.type || 'image/webp' })
                                
                                // Upload to Supabase storage
                                const { url, error } = await storageService.uploadImage(file, 'listings')
                                
                                if (url) {
                                    uploadedImageUrls.push(url)
                                } else if (error) {
                                    console.error(`Upload error for ${filename}:`, error)
                                }
                            } catch (err) {
                                console.error(`Failed to upload image ${filename}:`, err)
                            }
                        } else {
                            console.warn(`Image ${filename} not found in ZIP`)
                        }
                    }
                }
                
                // Prepare listing data
                const newListing = {
                    user_id: user.id,
                    title: listing.title,
                    description: listing.description,
                    category: listing.category,
                    price: listing.price,
                    location: listing.location,
                    condition: listing.condition,
                    year: listing.year,
                    working: listing.working,
                    images: uploadedImageUrls.length > 0 ? uploadedImageUrls : [],
                    subcategory: listing.subcategory || null,
                    slot_type: listing.slot_type || null,
                    video_standard: listing.video_standard || null,
                    video_input: listing.video_input || null
                }
                
                console.log('Creating listing:', newListing)
                
                // Create listing using service
                const result = await listingsService.createListing(newListing)
                
                console.log('Create result:', result)
                
                if (result.error) {
                    console.error('Create listing error:', result.error)
                    throw result.error
                }
                successCount++
                
            } catch (err) {
                console.error('Error importing listing:', listing.title, err)
                errorCount++
            }
        }
        
        // Show results
        let message = `<div class="alert alert-success">✅ Импортирани успешно: ${successCount}</div>`
        if (errorCount > 0) {
            message += `<div class="alert alert-warning">⚠️ Грешки при импорт: ${errorCount}</div>`
        }
        importStatus.innerHTML = message
        
        // Reload statistics
        await loadStatistics()
        await loadPendingListings()
        
        // Clear file input
        fileInput.value = ''
        
    } catch (error) {
        console.error('Import error:', error)
        importStatus.innerHTML = `<div class="alert alert-danger">❌ Грешка: ${error.message}</div>`
    } finally {
        importBtn.disabled = false
    }
}
