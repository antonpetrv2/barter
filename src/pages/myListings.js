/**
 * My Listings Page
 * User's own listings management
 */

import { listingsService, isSupabaseConnected, authService } from '../services/supabaseService.js'

export async function renderMyListings() {
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
    
    // Check if user is logged in
    const user = await authService.getCurrentUser()
    if (!user) {
        content.innerHTML = `
            <div class="container py-5">
                <div class="alert alert-warning" role="alert">
                    <h4 class="alert-heading"><i class="bi bi-exclamation-triangle"></i> Необходима е автентификация</h4>
                    <p>Трябва да си логнал(а) за да видиш своите обяви.</p>
                    <hr>
                    <a href="#/auth" class="btn btn-primary">
                        <i class="bi bi-box-arrow-in-right"></i> Влез в профила
                    </a>
                </div>
            </div>
        `
        return
    }
    // Show loading state
    content.innerHTML = `
        <div class="container py-5">
            <div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Зареждане...</span>
                </div>
                <p class="mt-3">Зареждане на Вашите обяви...</p>
            </div>
        </div>
    `
    
    // Fetch user's listings from Supabase
    let userListings = []
    
    if (isSupabaseConnected()) {
        try {
            userListings = await listingsService.getUserListings(user.id)
        } catch (error) {
            console.error('Error fetching user listings:', error)
        }
    }
    
    content.innerHTML = `
        <div class="container py-5">
            <!-- Page Title -->
            <div class="row mb-5">
                <div class="col-12">
                    <div class="d-flex justify-content-between align-items-center">
                        <div>
                            <h1 class="display-5 fw-bold mb-2">Моите обяви</h1>
                            <p class="text-muted">${userListings.length} активни обяви</p>
                        </div>
                        <div class="btn-group" role="group">
                            <button type="button" class="btn btn-outline-secondary" id="viewTrashBtn">
                                <i class="bi bi-trash"></i> Кошче
                            </button>
                            <a href="#/create-listing" class="btn btn-primary">
                                <i class="bi bi-plus-lg"></i> Нова обява
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Active Listings Table -->
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="table-responsive">
                            <table class="table table-hover mb-0">
                                <thead>
                                    <tr>
                                        <th>Название</th>
                                        <th>Статус</th>
                                        <th>Преглеждания</th>
                                        <th>Постав</th>
                                        <th>Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${userListings.map(listing => `
                                        <tr>
                                            <td>
                                                <a href="#/listing/${listing.id}" style="text-decoration: none;">
                                                    ${listing.title}
                                                </a>
                                            </td>
                                            <td>
                                                <span class="badge bg-success">
                                                    <i class="bi bi-check-circle"></i> ${listing.status}
                                                </span>
                                            </td>
                                            <td>
                                                <i class="bi bi-eye"></i> ${listing.views}
                                            </td>
                                            <td>
                                                <small class="text-muted">${listing.date}</small>
                                            </td>
                                            <td>
                                                <div class="btn-group btn-group-sm" role="group">
                                                    <a href="#/listing/${listing.id}" class="btn btn-outline-primary" title="Преглед">
                                                        <i class="bi bi-eye"></i>
                                                    </a>
                                                    <a href="#/edit-listing/${listing.id}" class="btn btn-outline-secondary" title="Редактирай">
                                                        <i class="bi bi-pencil"></i>
                                                    </a>
                                                    <button class="btn btn-outline-danger delete-listing-btn" data-listing-id="${listing.id}" title="Изтрий">
                                                        <i class="bi bi-trash"></i>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Create Listing Card -->
            <div class="row mt-5">
                <div class="col-md-6">
                    <div class="card text-center">
                        <div class="card-body">
                            <h3 class="card-title">Създай нова обява</h3>
                            <p class="card-text text-muted">Публикувай своите ретро компютри и части</p>
                            <button class="btn btn-primary">
                                <i class="bi bi-plus-lg"></i> Начало
                            </button>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card text-center">
                        <div class="card-body">
                            <h3 class="card-title">Мои съобщения</h3>
                            <p class="card-text text-muted">Вижте съобщенията от другите потребители</p>
                            <button class="btn btn-secondary">
                                <i class="bi bi-envelope"></i> Съобщения
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

    // Add event listeners for delete buttons
    const deleteButtons = document.querySelectorAll('.delete-listing-btn')
    deleteButtons.forEach(button => {
        button.addEventListener('click', async (e) => {
            const listingId = e.currentTarget.getAttribute('data-listing-id')
            
            if (confirm('Сигурни ли сте, че искате да изтриете тази обява?')) {
                try {
                    const currentUser = await authService.getCurrentUser()
                    const result = await listingsService.deleteListing(listingId, currentUser.id)
                    
                    if (result.error) {
                        throw new Error(result.error.message || result.error)
                    }
                    
                            alert('✅ Обявата е преместена в кошчето!')
                    // Reload the page
                    await renderMyListings()
                } catch (error) {
                    console.error('Error deleting listing:', error)
                    alert('Грешка при изтриване на обявата: ' + error.message)
                }
            }
        })
    })
    
    // Add event listener for trash button
    const viewTrashBtn = document.getElementById('viewTrashBtn')
    if (viewTrashBtn) {
        viewTrashBtn.addEventListener('click', () => {
            showTrashModal()
        })
    }
}

/**
 * Show trash modal with deleted listings
 */
async function showTrashModal() {
    const currentUser = await authService.getCurrentUser()
    const deletedListings = await listingsService.getDeletedListings(currentUser.id)
    
    // Create modal
    const modalHtml = `
        <div class="modal fade" id="trashModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">
                            <i class="bi bi-trash"></i> Кошче (${deletedListings.length} обяви)
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        ${deletedListings.length === 0 ? `
                            <div class="alert alert-info">
                                <i class="bi bi-info-circle"></i> Кошчето е празно
                            </div>
                        ` : `
                            <div class="table-responsive">
                                <table class="table">
                                    <thead>
                                        <tr>
                                            <th>Название</th>
                                            <th>Изтрито на</th>
                                            <th>Действия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${deletedListings.map(listing => `
                                            <tr>
                                                <td>${listing.title}</td>
                                                <td><small class="text-muted">${formatDeletedDate(listing.deleted_at)}</small></td>
                                                <td>
                                                    <button class="btn btn-sm btn-success restore-btn" data-listing-id="${listing.id}">
                                                        <i class="bi bi-arrow-counterclockwise"></i> Възстанови
                                                    </button>
                                                    <button class="btn btn-sm btn-danger permanent-delete-btn" data-listing-id="${listing.id}">
                                                        <i class="bi bi-x-circle"></i> Изтрий завинаги
                                                    </button>
                                                </td>
                                            </tr>
                                        `).join('')}
                                    </tbody>
                                </table>
                            </div>
                        `}
                    </div>
                </div>
            </div>
        </div>
    `
    
    // Remove existing modal if any
    const existingModal = document.getElementById('trashModal')
    if (existingModal) {
        existingModal.remove()
    }
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHtml)
    
    // Show modal using Bootstrap
    const modalElement = document.getElementById('trashModal')
    const modal = new bootstrap.Modal(modalElement)
    modal.show()
    
    // Add event listeners
    const restoreButtons = modalElement.querySelectorAll('.restore-btn')
    restoreButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const listingId = e.currentTarget.getAttribute('data-listing-id')
            
            try {
                const result = await listingsService.restoreListing(listingId, userId)
                
                if (result.error) {
                    throw new Error(result.error.message || result.error)
                }
                
                alert('✅ Обявата е възстановена!')
                modal.hide()
                await renderMyListings()
            } catch (error) {
                alert('Грешка: ' + error.message)
            }
        })
    })
    
    const permanentDeleteButtons = modalElement.querySelectorAll('.permanent-delete-btn')
    permanentDeleteButtons.forEach(btn => {
        btn.addEventListener('click', async (e) => {
            const listingId = e.currentTarget.getAttribute('data-listing-id')
            
            if (confirm('⚠️ ВНИМАНИЕ! Обявата ще бъде изтрита ЗАВИНАГИ (включително снимките). Сигурни ли сте?')) {
                try {
                    const result = await listingsService.permanentlyDeleteListing(listingId, userId)
                    
                    if (result.error) {
                        throw new Error(result.error.message || result.error)
                    }
                    
                    alert('✅ Обявата е изтрита завинаги')
                    modal.hide()
                    await renderMyListings()
                } catch (error) {
                    alert('Грешка: ' + error.message)
                }
            }
        })
    })
}

/**
 * Format deleted date
 */
function formatDeletedDate(dateString) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('bg-BG', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    })
}