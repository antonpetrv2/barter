/**
 * Admin Panel Page
 * Manage users, approvals, bans, and system statistics
 */

import { adminService, authService } from '../services/supabaseService.js'

export async function renderAdmin(params) {
    const content = document.getElementById('content')
    
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
            </div>

            <!-- Tabs -->
            <ul class="nav nav-tabs mb-3" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" id="pending-tab" data-bs-toggle="tab" data-bs-target="#pending-panel" type="button">Чакащи одобрение</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="all-users-tab" data-bs-toggle="tab" data-bs-target="#all-users-panel" type="button">Всички потребители</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" id="banned-tab" data-bs-toggle="tab" data-bs-target="#banned-panel" type="button">Блокирани</button>
                </li>
            </ul>

            <!-- Tab Content -->
            <div class="tab-content">
                <!-- Pending Approvals -->
                <div class="tab-pane fade show active" id="pending-panel" role="tabpanel">
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
            </div>
        </div>
    `

    // Load data
    await loadStatistics()
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
    }
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
