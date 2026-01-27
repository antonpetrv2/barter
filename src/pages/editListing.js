/**
 * Edit Listing Page
 * Edit existing listing
 */

import { listingsService, storageService, isSupabaseConnected } from '../services/supabaseService.js'
import { renderImageUpload, getUploadedImages, clearUploadedImages } from '../components/imageUpload.js'

export async function renderEditListing(params) {
    const content = document.getElementById('content')
    const listingId = params?.id || params
    
    console.log('Edit listing called with ID:', listingId)
    
    // Check if user is logged in
    const isLoggedIn = window.authState?.isLoggedIn
    
    if (!isLoggedIn) {
        window.location.hash = '#/auth'
        return
    }

    // Show loading state
    content.innerHTML = `
        <div class="container py-5">
            <div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Зареждане...</span>
                </div>
                <p class="mt-3">Зареждане на обявата...</p>
            </div>
        </div>
    `

    // Fetch the listing
    let listing
    if (isSupabaseConnected()) {
        console.log('Fetching listing with ID:', listingId)
        listing = await listingsService.getListingById(listingId)
        console.log('Fetched listing:', listing)
    }

    if (!listing) {
        console.log('Listing not found')
        content.innerHTML = `
            <div class="container py-5">
                <div class="alert alert-danger">
                    <h4>Грешка</h4>
                    <p>Не може да се зареди обявата.</p>
                    <a href="#/my-listings" class="btn btn-primary">Моите обяви</a>
                </div>
            </div>
        `
        return
    }

    // Check if user owns this listing
    if (listing.user_id !== window.authState.user.id) {
        content.innerHTML = `
            <div class="container py-5">
                <div class="alert alert-danger">
                    <h4>Нямате права</h4>
                    <p>Можете да редактирате само свои обяви.</p>
                    <a href="#/my-listings" class="btn btn-primary">Моите обяви</a>
                </div>
            </div>
        `
        return
    }

    content.innerHTML = `
        <div class="container py-5">
            <!-- Header -->
            <div class="row mb-5">
                <div class="col-12">
                    <nav aria-label="breadcrumb">
                        <ol class="breadcrumb">
                            <li class="breadcrumb-item"><a href="#/">Начало</a></li>
                            <li class="breadcrumb-item"><a href="#/my-listings">Моите обяви</a></li>
                            <li class="breadcrumb-item active">Редактирай обява</li>
                        </ol>
                    </nav>
                    <h1 class="display-5 fw-bold">Редактирай обява</h1>
                    <p class="text-muted">Обнови информацията за твоята обява</p>
                </div>
            </div>

            <!-- Form -->
            <div class="row">
                <div class="col-lg-8 mx-auto">
                    <div class="card shadow-sm">
                        <div class="card-body p-4">
                            <form id="edit-listing-form">
                                <!-- Basic Info Section -->
                                <h4 class="mb-4"><i class="bi bi-info-circle"></i> Основна информация</h4>

                                <div class="row mb-3">
                                    <div class="col-md-12">
                                        <label for="title" class="form-label">Заглавие на обявата *</label>
                                        <input type="text" class="form-control" id="title" name="title" 
                                               value="${listing.title}" required>
                                    </div>
                                </div>

                                <div class="row mb-3">
                                    <div class="col-md-12">
                                        <label for="description" class="form-label">Описание *</label>
                                        <textarea class="form-control" id="description" name="description" 
                                                  rows="5" required>${listing.description}</textarea>
                                        <small class="form-text text-muted">Опиши състоянието, какво включва и всички други важни детайли</small>
                                    </div>
                                </div>

                                <div class="row mb-4">
                                    <div class="col-md-6">
                                        <label for="category" class="form-label">Категория *</label>
                                        <select class="form-select" id="category" name="category" required>
                                            <option value="">Избери категория</option>
                                            <option value="Компютри" ${listing.category === 'Компютри' ? 'selected' : ''}>🖴 Компютри</option>
                                            <option value="Клавиатури" ${listing.category === 'Клавиатури' ? 'selected' : ''}>⌨️ Клавиатури</option>
                                            <option value="Монитори" ${listing.category === 'Монитори' ? 'selected' : ''}>📟 Монитори</option>
                                            <option value="Мишки" ${listing.category === 'Мишки' ? 'selected' : ''}>🖱️ Мишки</option>
                                            <option value="Периферия" ${listing.category === 'Периферия' ? 'selected' : ''}>🖨️ Периферия</option>
                                            <option value="Части" ${listing.category === 'Части' ? 'selected' : ''}>🎛️ Части</option>
                                        </select>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="price" class="form-label">Цена</label>
                                        <input type="text" class="form-control" id="price" name="price" 
                                               value="${listing.price === 'по договаряне' ? '' : listing.price}" 
                                               placeholder="по договаряне">
                                        <small class="form-text text-muted">Остави празно за "по договаряне"</small>
                                    </div>
                                </div>

                                <!-- Details Section -->
                                <h4 class="mb-4 mt-5"><i class="bi bi-sliders"></i> Детайли</h4>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label for="location" class="form-label">Локация *</label>
                                        <input type="text" class="form-control" id="location" name="location" 
                                               value="${listing.location}" required>
                                    </div>
                                    <div class="col-md-6">
                                        <label for="condition" class="form-label">Състояние *</label>
                                        <select class="form-select" id="condition" name="condition" required>
                                            <option value="">Избери състояние</option>
                                            <option value="Отлично" ${listing.condition === 'Отлично' ? 'selected' : ''}>Отлично</option>
                                            <option value="Много добро" ${listing.condition === 'Много добро' ? 'selected' : ''}>Много добро</option>
                                            <option value="Добро" ${listing.condition === 'Добро' ? 'selected' : ''}>Добро</option>
                                            <option value="Задоволително" ${listing.condition === 'Задоволително' ? 'selected' : ''}>Задоволително</option>
                                            <option value="За части" ${listing.condition === 'За части' ? 'selected' : ''}>За части</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="row mb-4">
                                    <div class="col-md-6">
                                        <label for="year" class="form-label">Година на производство</label>
                                        <input type="number" class="form-control" id="year" name="year" 
                                               value="${listing.year || ''}" min="1970" max="2025">
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">Работи ли?</label>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="working" id="working-yes" 
                                                   value="true" ${listing.working ? 'checked' : ''}>
                                            <label class="form-check-label" for="working-yes">
                                                Да, изправно е
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="working" id="working-no" 
                                                   value="false" ${!listing.working ? 'checked' : ''}>
                                            <label class="form-check-label" for="working-no">
                                                Не, има проблеми
                                            </label>
                                        </div>
                                    </div>
                                </div>

                                <!-- Images Section -->
                                <h4 class="mb-4 mt-5"><i class="bi bi-images"></i> Снимки</h4>

                                <div class="row mb-3">
                                    <div class="col-12">
                                        <div class="alert alert-info">
                                            <i class="bi bi-info-circle"></i> Текущи снимки: 
                                            ${listing.images && listing.images.length > 0 ? `
                                                <div class="d-flex flex-wrap gap-2 mt-2">
                                                    ${listing.images.map((img, idx) => `
                                                        <div class="position-relative">
                                                            <img src="${img}" alt="Current ${idx + 1}" style="max-width: 150px; max-height: 150px; object-fit: cover; border-radius: 4px;">
                                                        </div>
                                                    `).join('')}
                                                </div>
                                            ` : 'Няма качени снимки'}
                                        </div>
                                        <p class="text-muted small">
                                            Качи нови снимки (до 3), за да замениш старите. 
                                            Ако не качиш нови, старите ще бъдат запазени.
                                        </p>
                                        <div id="editImageUploadContainer"></div>
                                    </div>
                                </div>

                                <!-- Form Actions -->
                                <div class="d-flex justify-content-between align-items-center mt-5 pt-4 border-top">
                                    <a href="#/my-listings" class="btn btn-outline-secondary">
                                        <i class="bi bi-arrow-left"></i> Отказ
                                    </a>
                                    <button type="submit" class="btn btn-primary btn-lg">
                                        <i class="bi bi-check-lg"></i> Запази промените
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

    // Initialize existing images in the upload component
    if (listing.images && listing.images.length > 0) {
        window.uploadedImages = [...listing.images]
    } else {
        window.uploadedImages = []
    }

    // Initialize image upload component
    renderImageUpload('editImageUploadContainer', {
        maxFiles: 3,
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.85,
    })

    // Handle form submission
    const form = document.getElementById('edit-listing-form')
    form.addEventListener('submit', async (e) => {
        e.preventDefault()

        const submitButton = form.querySelector('button[type="submit"]')
        const originalButtonText = submitButton.innerHTML
        submitButton.disabled = true
        submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Запазване...'

        try {
            if (!isSupabaseConnected()) {
                throw new Error('Supabase не е конфигуриран')
            }

            const formData = new FormData(form)
            const updates = {
                title: formData.get('title'),
                description: formData.get('description'),
                category: formData.get('category'),
                price: formData.get('price') || 'по договаряне',
                location: formData.get('location'),
                condition: formData.get('condition'),
                year: formData.get('year') ? parseInt(formData.get('year')) : null,
                working: formData.get('working') === 'true',
            }

            // Get uploaded images
            const uploadedImages = getUploadedImages()
            if (uploadedImages && uploadedImages.length > 0) {
                updates.images = uploadedImages
                updates.image_url = uploadedImages[0]
            }

            // Update listing
            const result = await listingsService.updateListing(listingId, updates)
            
            if (result.error) {
                throw new Error(result.error)
            }

            // Show success message
            alert('Обявата е обновена успешно!')
            
            // Redirect to listing detail
            window.location.hash = `#/listing/${listingId}`

        } catch (error) {
            console.error('Error updating listing:', error)
            alert('Грешка при обновяване на обявата: ' + error.message)
            submitButton.disabled = false
            submitButton.innerHTML = originalButtonText
        }
    })
}
