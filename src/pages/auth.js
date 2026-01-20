/**
 * Authentication Page
 * Login and Registration forms with Supabase integration
 */

import { authService, isSupabaseConnected } from '../services/supabaseService.js'

export function renderAuth() {
    const content = document.getElementById('content')
    
    content.innerHTML = `
        <div class="container py-5">
            <div class="row">
                <div class="col-md-8 offset-md-2">
                    ${!isSupabaseConnected() ? `
                        <div class="alert alert-warning alert-dismissible fade show" role="alert">
                            <i class="bi bi-exclamation-triangle"></i>
                            <strong>Demo режим!</strong> Supabase не е конфигуриран. 
                            За реална функционалност, конфигурирай .env.local с твоите Supabase API ключове.
                            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                        </div>
                    ` : ''}

                    <ul class="nav nav-tabs mb-4" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="login-tab" data-bs-toggle="tab" data-bs-target="#login" type="button" role="tab">
                                <i class="bi bi-box-arrow-in-right"></i> Вход
                            </button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="register-tab" data-bs-toggle="tab" data-bs-target="#register" type="button" role="tab">
                                <i class="bi bi-person-plus"></i> Регистрация
                            </button>
                        </li>
                    </ul>

                    <div class="tab-content">
                        <!-- Login Tab -->
                        <div class="tab-pane fade show active" id="login" role="tabpanel">
                            <div class="card">
                                <div class="card-body">
                                    <h2 class="card-title mb-4">Вход в профила</h2>
                                    <form id="loginForm">
                                        <div class="mb-3">
                                            <label for="loginEmail" class="form-label">Email адрес</label>
                                            <input type="email" class="form-control" id="loginEmail" placeholder="your@email.com" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="loginPassword" class="form-label">Парола</label>
                                            <input type="password" class="form-control" id="loginPassword" placeholder="••••••••" required>
                                        </div>
                                        <div class="mb-3 form-check">
                                            <input type="checkbox" class="form-check-input" id="rememberMe">
                                            <label class="form-check-label" for="rememberMe">
                                                Запомни ме
                                            </label>
                                        </div>
                                        <button type="submit" class="btn btn-primary w-100" id="loginBtn">
                                            <i class="bi bi-box-arrow-in-right"></i> Влез
                                        </button>
                                        <div id="loginError" class="alert alert-danger mt-3" style="display: none;"></div>
                                    </form>
                                    <hr>
                                    <p class="text-center text-muted">
                                        <a href="#/">Забрави парола?</a>
                                    </p>
                                </div>
                            </div>
                        </div>

                        <!-- Register Tab -->
                        <div class="tab-pane fade" id="register" role="tabpanel">
                            <div class="card">
                                <div class="card-body">
                                    <h2 class="card-title mb-4">Създай нов профил</h2>
                                    <form id="registerForm">
                                        <div class="mb-3">
                                            <label for="registerName" class="form-label">Пълно име</label>
                                            <input type="text" class="form-control" id="registerName" placeholder="Иван Иванов" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="registerEmail" class="form-label">Email адрес</label>
                                            <input type="email" class="form-control" id="registerEmail" placeholder="your@email.com" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="registerPhone" class="form-label">Телефон</label>
                                            <input type="tel" class="form-control" id="registerPhone" placeholder="+359 88 123 4567">
                                        </div>
                                        <div class="mb-3">
                                            <label for="registerCity" class="form-label">Град</label>
                                            <select class="form-select" id="registerCity">
                                                <option value="">Избери град</option>
                                                <option value="Sofia">София</option>
                                                <option value="Plovdiv">Пловдив</option>
                                                <option value="Varna">Варна</option>
                                                <option value="Burgas">Бургас</option>
                                                <option value="Ruse">Русе</option>
                                                <option value="Other">Друго</option>
                                            </select>
                                        </div>
                                        <div class="mb-3">
                                            <label for="registerPassword" class="form-label">Парола</label>
                                            <input type="password" class="form-control" id="registerPassword" placeholder="••••••••" required>
                                        </div>
                                        <div class="mb-3">
                                            <label for="registerPasswordConfirm" class="form-label">Повтори парола</label>
                                            <input type="password" class="form-control" id="registerPasswordConfirm" placeholder="••••••••" required>
                                        </div>
                                        <div class="mb-3 form-check">
                                            <input type="checkbox" class="form-check-input" id="terms" required>
                                            <label class="form-check-label" for="terms">
                                                Съглашам се с условията на ползване
                                            </label>
                                        </div>
                                        <button type="submit" class="btn btn-primary w-100" id="registerBtn">
                                            <i class="bi bi-person-plus"></i> Регистрирай се
                                        </button>
                                        <div id="registerError" class="alert alert-danger mt-3" style="display: none;"></div>
                                        <div id="registerSuccess" class="alert alert-success mt-3" style="display: none;"></div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    
    // Add event listeners
    attachAuthListeners()
}

function attachAuthListeners() {
    const loginForm = document.getElementById('loginForm')
    const registerForm = document.getElementById('registerForm')
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin)
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister)
    }
}

async function handleLogin(e) {
    e.preventDefault()
    
    const email = document.getElementById('loginEmail').value
    const password = document.getElementById('loginPassword').value
    const loginBtn = document.getElementById('loginBtn')
    const errorDiv = document.getElementById('loginError')
    
    try {
        loginBtn.disabled = true
        loginBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Влизане...'
        errorDiv.style.display = 'none'
        
        const { error } = await authService.login(email, password)
        
        if (error) {
            throw error
        }
        
        // Success
        alert('✅ Успешно влизане! Профилът е активен.')
        window.location.hash = '#/'
    } catch (error) {
        errorDiv.textContent = error.message || 'Грешка при вход. Проверете email и парола.'
        errorDiv.style.display = 'block'
    } finally {
        loginBtn.disabled = false
        loginBtn.innerHTML = '<i class="bi bi-box-arrow-in-right"></i> Влез'
    }
}

async function handleRegister(e) {
    e.preventDefault()
    
    const fullName = document.getElementById('registerName').value
    const email = document.getElementById('registerEmail').value
    const phone = document.getElementById('registerPhone').value
    const city = document.getElementById('registerCity').value
    const password = document.getElementById('registerPassword').value
    const passwordConfirm = document.getElementById('registerPasswordConfirm').value
    
    const registerBtn = document.getElementById('registerBtn')
    const errorDiv = document.getElementById('registerError')
    const successDiv = document.getElementById('registerSuccess')
    
    errorDiv.style.display = 'none'
    successDiv.style.display = 'none'
    
    try {
        // Validate
        if (password !== passwordConfirm) {
            throw new Error('Паролите не съвпадат!')
        }
        
        if (!city) {
            throw new Error('Избери град')
        }
        
        registerBtn.disabled = true
        registerBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Регистриране...'
        
        const { error } = await authService.register(email, password, fullName, phone, city)
        
        if (error) {
            throw error
        }
        
        // Success
        successDiv.textContent = '✅ Регистрацията е успешна! Проверете имейла за потвърждение.'
        successDiv.style.display = 'block'
        
        setTimeout(() => {
            window.location.hash = '#/auth'
        }, 2000)
    } catch (error) {
        errorDiv.textContent = error.message || 'Грешка при регистрация.'
        errorDiv.style.display = 'block'
    } finally {
        registerBtn.disabled = false
        registerBtn.innerHTML = '<i class="bi bi-person-plus"></i> Регистрирай се'
    }
}
