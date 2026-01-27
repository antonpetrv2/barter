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
            <div class="container">
                <a class="navbar-brand fw-bold" href="#/">
                    <i class="bi bi-laptop"></i> Ретро Бартер
                </a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav ms-auto align-items-center gap-2">
                        <li class="nav-item">
                            <a class="btn nav-btn" href="#/">Начало</a>
                        </li>
                        <li class="nav-item">
                            <a class="btn nav-btn" href="#/my-listings">Моите обяви</a>
                        </li>
                        ${isLoggedIn ? `
                        <li class="nav-item">
                            <a class="btn nav-btn nav-btn-primary" href="#/create-listing">
                                <i class="bi bi-plus-circle me-1"></i> Добави обява
                            </a>
                        </li>
                        ` : ''}
                        ${isAdmin ? `
                        <li class="nav-item">
                            <a class="btn nav-btn" href="#/admin">
                                <i class="bi bi-shield-check me-1"></i> Админ Панел
                            </a>
                        </li>
                        ` : ''}
                        ${isLoggedIn ? `
                        <li class="nav-item">
                            <button class="btn nav-btn" id="refresh-profile" title="Освежи профила">
                                <i class="bi bi-arrow-clockwise"></i>
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="btn nav-btn" id="logout-btn">Изход</button>
                        </li>
                        ` : `
                        <li class="nav-item">
                            <a class="btn nav-btn" href="#/auth">Вход / Регистрация</a>
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
        .nav-btn {
            border: 1px solid #d9d9d9;
            background: #ffffff;
            color: #333;
            border-radius: 999px;
            padding: 0.35rem 0.85rem;
            font-weight: 600;
            font-size: 0.95rem;
            line-height: 1.1rem;
            transition: all 0.15s ease;
        }
        .nav-btn:hover,
        .nav-btn:focus {
            background: #f5f5f5;
            color: #111;
            border-color: #c7c7c7;
            box-shadow: none;
        }
        .nav-btn-primary {
            background: #f6c343;
            border-color: #f6c343;
            color: #3a2d00;
        }
        .nav-btn-primary:hover,
        .nav-btn-primary:focus {
            background: #eab324;
            border-color: #eab324;
            color: #2c2100;
        }
        @media (max-width: 991px) {
            .navbar-nav {
                gap: 0.5rem;
                padding-top: 0.5rem;
            }
            .nav-btn {
                width: 100%;
                text-align: left;
            }
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
