/**
 * My Listings Page
 * User's own listings management
 */

import { listingsService, isSupabaseConnected } from '../services/supabaseService.js'

export async function renderMyListings() {
    const content = document.getElementById('content')
    
    // Check if user is logged in
    const isLoggedIn = window.authState?.isLoggedIn
    
    if (!isLoggedIn) {
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
    
    if (isLoggedIn && isSupabaseConnected()) {
        try {
            const userId = window.authState.user.id
            userListings = await listingsService.getUserListings(userId)
        } catch (error) {
            console.error('Error fetching user listings:', error)
        }
    }
    
    // Mock user listings
    const mockListings = [
        {
            id: 1,
            title: 'Commodore 64',
            status: 'Активна',
            views: 234,
            date: '2 часа назад',
            price: 'Открит за разговор'
        },
        {
            id: 2,
            title: 'Amiga 500',
            status: 'Активна',
            views: 156,
            date: '1 день назад',
            price: 'Открит за разговор'
        },
    ]
    
    // Use mock if no data from Supabase
    if (userListings.length === 0) {
        userListings = mockListings
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
                        <a href="#/create-listing" class="btn btn-primary btn-lg">
                            <i class="bi bi-plus-lg"></i> Нова обява
                        </a>
                    </div>
                </div>
            </div>

            <!-- Listings Table -->
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
                                                    <button class="btn btn-outline-secondary" title="Редактирай">
                                                        <i class="bi bi-pencil"></i>
                                                    </button>
                                                    <button class="btn btn-outline-danger" title="Изтрий">
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
}
