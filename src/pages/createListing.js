/**
 * Create Listing Page
 * Form for creating a new listing
 */

import { listingsService, isSupabaseConnected } from '../services/supabaseService.js'

export async function renderCreateListing() {
    const content = document.getElementById('content')
    
    // Check if user is logged in
    if (!window.authState?.isLoggedIn) {
        content.innerHTML = `
            <div class="container py-5">
                <div class="alert alert-warning" role="alert">
                    <h4 class="alert-heading"><i class="bi bi-exclamation-triangle"></i> Необходима е автентификация</h4>
                    <p>Трябва да си логнал(а) за да създадеш обява.</p>
                    <hr>
                    <a href="#/auth" class="btn btn-primary">
                        <i class="bi bi-box-arrow-in-right"></i> Влез в профила
                    </a>
                </div>
            </div>
        `
        return
    }
    
    content.innerHTML = `
        <div class="container py-5">
            <!-- Page Title -->
            <div class="row mb-5">
                <div class="col-12">
                    <h1 class="display-5 fw-bold mb-3">Създай нова обява</h1>
                    <p class="text-muted">Публикувай своите ретро компютри и части за бартер</p>
                </div>
            </div>

            <!-- Create Form -->
            <div class="row">
                <div class="col-lg-8">
                    <div class="card">
                        <div class="card-body">
                            <form id="createListingForm">
                                <!-- Title -->
                                <div class="mb-3">
                                    <label for="title" class="form-label">Название <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="title" name="title" placeholder="Commodore 64" required>
                                    <small class="form-text text-muted">Кратко и описателното название на обекта</small>
                                </div>

                                <!-- Description -->
                                <div class="mb-3">
                                    <label for="description" class="form-label">Кратко описание <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="description" name="description" placeholder="Оригинален модел в отлично състояние" required>
                                    <small class="form-text text-muted">Един ред описание на продукта</small>
                                </div>

                                <!-- Full Description -->
                                <div class="mb-3">
                                    <label for="fullDescription" class="form-label">Пълно описание</label>
                                    <textarea class="form-control" id="fullDescription" name="fullDescription" rows="4" placeholder="Детайлно описание на състоянието, функционалност, включени аксесоари..."></textarea>
                                    <small class="form-text text-muted">Детайли като година на производство, състояние, функционалност</small>
                                </div>

                                <!-- Category -->
                                <div class="mb-3">
                                    <label for="category" class="form-label">Категория <span class="text-danger">*</span></label>
                                    <select class="form-select" id="category" name="category" required>
                                        <option value="">Избери категория...</option>
                                        <option value="Компютри">Компютри</option>
                                        <option value="Клавиатури">Клавиатури</option>
                                        <option value="Монитори">Монитори</option>
                                        <option value="Мишки">Мишки</option>
                                        <option value="Периферия">Периферия</option>
                                        <option value="Части">Части</option>
                                    </select>
                                </div>

                                <!-- Price -->
                                <div class="mb-3">
                                    <label for="price" class="form-label">Цена</label>
                                    <input type="text" class="form-control" id="price" name="price" placeholder="за разговор">
                                    <small class="form-text text-muted">Остави празно за "за разговор"</small>
                                </div>

                                <!-- Location -->
                                <div class="mb-3">
                                    <label for="location" class="form-label">Локация <span class="text-danger">*</span></label>
                                    <input type="text" class="form-control" id="location" name="location" placeholder="София, България" required>
                                </div>

                                <!-- Condition -->
                                <div class="mb-3">
                                    <label for="condition" class="form-label">Състояние</label>
                                    <select class="form-select" id="condition" name="condition">
                                        <option value="">Избери състояние...</option>
                                        <option value="Отлично">Отлично</option>
                                        <option value="Много добро">Много добро</option>
                                        <option value="Добро">Добро</option>
                                        <option value="Приемливо">Приемливо</option>
                                        <option value="Нуждае се от ремонт">Нуждае се от ремонт</option>
                                    </select>
                                </div>

                                <!-- Year -->
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="year" class="form-label">Година на производство</label>
                                        <input type="number" class="form-control" id="year" name="year" placeholder="1982" min="1900" max="2024">
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="working" class="form-label">Работно ли е?</label>
                                        <div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="working" id="workingYes" value="true" checked>
                                                <label class="form-check-label" for="workingYes">
                                                    ✅ Работи
                                                </label>
                                            </div>
                                            <div class="form-check">
                                                <input class="form-check-input" type="radio" name="working" id="workingNo" value="false">
                                                <label class="form-check-label" for="workingNo">
                                                    ⚠️ Не е тестирана
                                                </label>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <!-- Image URL (optional) -->
                                <div class="mb-3">
                                    <label for="image" class="form-label">Снимка (Emoji за демо)</label>
                                    <input type="text" class="form-control" id="image" name="image" placeholder="🖥️" maxlength="4">
                                    <small class="form-text text-muted">За демо версия използвай емоджи (🖥️, 💾, ⌨️, 🖱️, 📦 и т.н.)</small>
                                </div>

                                <!-- Buttons -->
                                <div class="d-flex gap-2">
                                    <button type="submit" class="btn btn-primary btn-lg" id="submitBtn">
                                        <i class="bi bi-check-circle"></i> Публикувай обява
                                    </button>
                                    <a href="#/my-listings" class="btn btn-secondary btn-lg">
                                        <i class="bi bi-x-circle"></i> Отмени
                                    </a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                <!-- Info Card -->
                <div class="col-lg-4">
                    <div class="card mb-4 bg-light">
                        <div class="card-body">
                            <h5 class="card-title mb-3">💡 Съвети за добра обява</h5>
                            <ul class="list-unstyled">
                                <li>✓ Използвай ясен и описателен названи</li>
                                <li>✓ Добави детайли за състоянието</li>
                                <li>✓ Посочи дали артикулът работи</li>
                                <li>✓ Добави година на производство</li>
                                <li>✓ Избери правилната категория</li>
                                <li>✓ Посочи точна локация</li>
                            </ul>
                        </div>
                    </div>

                    <div class="card bg-info text-white">
                        <div class="card-body">
                            <h5 class="card-title mb-2">ℹ️ Важно</h5>
                            <p class="mb-0">Всички обяви се преглеждат преди публикуване. Пълните правила намираш в Terms & Conditions.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    
    // Attach form handler
    const form = document.getElementById('createListingForm')
    if (form) {
        form.addEventListener('submit', handleCreateListing)
    }
}

async function handleCreateListing(e) {
    e.preventDefault()
    
    const submitBtn = document.getElementById('submitBtn')
    const originalText = submitBtn.innerHTML
    
    try {
        // Show loading state
        submitBtn.disabled = true
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> Публикуване...'
        
        // Get form data
        const formData = new FormData(document.getElementById('createListingForm'))
        
        const listing = {
            title: formData.get('title'),
            description: formData.get('description'),
            fullDescription: formData.get('fullDescription'),
            category: formData.get('category'),
            price: formData.get('price') || 'за разговор',
            location: formData.get('location'),
            condition: formData.get('condition'),
            year: formData.get('year') ? parseInt(formData.get('year')) : null,
            working: formData.get('working') === 'true',
            image: formData.get('image') || '📦'
        }
        
        // Validate required fields
        if (!listing.title || !listing.description || !listing.category || !listing.location) {
            throw new Error('Задължителни полета липсват')
        }
        
        // Create listing via Supabase
        if (isSupabaseConnected()) {
            const userId = window.authState.user.id
            const result = await listingsService.createListing({
                ...listing,
                user_id: userId
            })
            
            if (result) {
                // Show success message
                showSuccessAlert('Обявата е успешно публикувана!')
                
                // Redirect to my listings after 2 seconds
                setTimeout(() => {
                    window.location.hash = '#/my-listings'
                }, 2000)
            } else {
                throw new Error('Грешка при създаване на обява')
            }
        } else {
            // For demo mode without Supabase
            showSuccessAlert('Обявата е успешно публикувана! (demo mode)')
            setTimeout(() => {
                window.location.hash = '#/my-listings'
            }, 2000)
        }
    } catch (error) {
        console.error('Error creating listing:', error)
        showErrorAlert(error.message || 'Възникна грешка при публикуване на обява')
    } finally {
        submitBtn.disabled = false
        submitBtn.innerHTML = originalText
    }
}

function showSuccessAlert(message) {
    const content = document.getElementById('content')
    const alertHtml = `
        <div class="alert alert-success alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 1050; max-width: 400px;">
            <i class="bi bi-check-circle"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `
    document.body.insertAdjacentHTML('beforeend', alertHtml)
}

function showErrorAlert(message) {
    const content = document.getElementById('content')
    const alertHtml = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert" style="position: fixed; top: 20px; right: 20px; z-index: 1050; max-width: 400px;">
            <i class="bi bi-exclamation-circle"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `
    document.body.insertAdjacentHTML('beforeend', alertHtml)
}
