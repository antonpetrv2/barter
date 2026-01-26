/**
 * Navigation Bar Component
 * Displays the main navigation for the app
 */

import { authService } from '../services/supabaseService.js'

export function renderNavbar() {
    const navbar = document.getElementById('navbar')
    const isAdmin = window.authState?.isAdmin || false
    const isLoggedIn = window.authState?.isLoggedIn || false
    
    navbar.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-white">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold" href="#/">
                    <i class="bi bi-laptop"></i> Ретро Бартер
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto">
                        <li class="nav-item">
                            <a class="nav-link" href="#/">Начало</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#/my-listings">Моите обяви</a>
                        </li>
                        ${isLoggedIn ? `
                        <li class="nav-item">
                            <a class="btn btn-warning btn-sm" href="#/create-listing">
                                <i class="bi bi-plus-circle"></i> Добави обява
                            </a>
                        </li>
                        ` : ''}
                        ${isAdmin ? `
                        <li class="nav-item">
                            <a class="nav-link text-danger fw-bold" href="#/admin">
                                <i class="bi bi-shield-check"></i> Админ Панел
                            </a>
                        </li>
                        ` : ''}
                        ${isLoggedIn ? `
                        <li class="nav-item">
                            <button class="nav-link btn btn-link" id="refresh-profile" title="Освежи профила">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link btn btn-link" id="logout-btn">Изход</button>
                        </li>
                        ` : `
                        <li class="nav-item">
                            <a class="nav-link" href="#/auth">Вход / Регистрация</a>
                        </li>
                        `}
                    </ul>
                </div>
            </div>
        </nav>
    `
    
    // Add navbar styling
    const style = document.createElement('style')
    style.textContent = `
        .navbar-brand {
            font-size: 1.3rem;
            color: #0066cc !important;
            white-space: nowrap;
        }
        .navbar {
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .navbar-nav .nav-link {
            cursor: pointer;
            transition: color 0.2s;
        }
        .navbar-nav .nav-link:hover {
            color: #0066cc !important;
        }
        #refresh-profile {
            border: none;
            padding: 0.5rem !important;
            color: #0066cc !important;
        }
        #refresh-profile:hover {
            color: #0066cc !important;
        }
    `
    if (!document.head.querySelector('style[data-navbar]')) {
        style.setAttribute('data-navbar', 'true')
        document.head.appendChild(style)
    }

    // Setup refresh profile button
    const refreshBtn = document.getElementById('refresh-profile')
    if (refreshBtn) {
        refreshBtn.addEventListener('click', async () => {
            refreshBtn.classList.add('spinning')
            await refreshUserProfile()
            refreshBtn.classList.remove('spinning')
        })
    }

    // Setup logout button
    const logoutBtn = document.getElementById('logout-btn')
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            const { error } = await authService.logout()
            if (error) {
                alert('❌ Грешка при изход: ' + error.message)
                return
            }
            // Clear auth state
            window.authState = {
                user: null,
                isLoggedIn: false,
                isAdmin: false,
                userStatus: null
            }
            console.log('✅ Успешно излязохте')
            renderNavbar() // Refresh navbar
            window.location.hash = '#/'
        })
    }
}

/**
 * Refresh user profile from Supabase
 */
async function refreshUserProfile() {
    const user = await authService.getCurrentUser()
    if (!user) return

    const userProfile = await authService.getUserProfile(user.id)
    if (userProfile) {
        window.authState.user = user
        window.authState.isLoggedIn = true
        window.authState.isAdmin = userProfile.role === 'admin'
        
        console.log('✅ Профил освежен')
        
        if (window.authState.isAdmin) {
            console.log('👑 Вече имате админ привилегии!')
            alert('✅ Успешно! Вече сте администратор. Админ панелът е достъпен.')
            // Re-render navbar to show admin panel
            renderNavbar()
        }
    }
}
