/**
 * Authentication Page
 * Login and Registration forms
 */

export function renderAuth() {
    const content = document.getElementById('content')
    
    content.innerHTML = `
        <div class="container py-5">
            <div class="row">
                <div class="col-md-8 offset-md-2">
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
                                        <button type="submit" class="btn btn-primary w-100">
                                            <i class="bi bi-box-arrow-in-right"></i> Влез
                                        </button>
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
                                        <button type="submit" class="btn btn-primary w-100">
                                            <i class="bi bi-person-plus"></i> Регистрирай се
                                        </button>
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
    const loginForm = document.getElementById('loginForm')
    const registerForm = document.getElementById('registerForm')
    
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault()
            alert('Вход функционалност ще бъде добавена в Стъпка 3 със Supabase')
            console.log('Login attempt')
        })
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault()
            const password = document.getElementById('registerPassword').value
            const passwordConfirm = document.getElementById('registerPasswordConfirm').value
            
            if (password !== passwordConfirm) {
                alert('Паролите не съвпадат!')
                return
            }
            
            alert('Регистрация функционалност ще бъде добавена в Стъпка 3 със Supabase')
            console.log('Register attempt')
        })
    }
}
