/**
 * Create Listing Page
 * Form for creating a new listing
 */

import { listingsService, isSupabaseConnected, authService } from '../services/supabaseService.js'
import { renderImageUpload, getUploadedImages, clearUploadedImages } from '../components/imageUpload.js'

export async function renderCreateListing() {
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

                                <!-- Image Upload -->
                                <div class="mb-4">
                                    <label class="form-label">Снимки <span class="badge bg-info">Ново</span></label>
                                    <div id="imageUploadContainer"></div>
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

                                <!-- Listing Type (Offering vs Looking) -->
                                <div class="mb-4">
                                    <label class="form-label">Какво правиш? <span class="text-danger">*</span></label>
                                    <div class="btn-group w-100" role="group">
                                        <input type="radio" class="btn-check" name="listingType" id="offeringType" value="offering" checked required>
                                        <label class="btn btn-outline-primary" for="offeringType">
                                            <i class="bi bi-hand-thumbs-up"></i> Предлагам
                                        </label>

                                        <input type="radio" class="btn-check" name="listingType" id="lookingType" value="looking" required>
                                        <label class="btn btn-outline-primary" for="lookingType">
                                            <i class="bi bi-search"></i> Търся
                                        </label>
                                    </div>
                                    <small class="form-text text-muted d-block mt-2">
                                        Избери дали предлагаш нещо за бартер или търсиш нещо
                                    </small>
                                </div>
                                
                                <!-- Parts-specific fields (shown only when category is "Части") -->
                                <div id="partsFields" style="display: none;">
                                    <div class="mb-3">
                                        <label for="subcategory" class="form-label">Подкатегория</label>
                                        <select class="form-select" id="subcategory" name="subcategory">
                                            <option value="">Избери подкатегория...</option>
                                            <option value="Видеокарти">Видеокарти</option>
                                            <option value="Звукови карти">Звукови карти</option>
                                            <option value="Лан карти">Лан карти</option>
                                            <option value="Други">Други</option>
                                        </select>
                                    </div>
                                    
                                    <div class="row">
                                        <div class="col-md-6 mb-3">
                                            <label for="slotType" class="form-label">Тип слот</label>
                                            <select class="form-select" id="slotType" name="slotType">
                                                <option value="">Избери тип слот...</option>
                                                <option value="ISA">ISA</option>
                                                <option value="VLB">VLB</option>
                                                <option value="AGP">AGP</option>
                                                <option value="PCI">PCI</option>
                                                <option value="PCIe">PCIe</option>
                                            </select>
                                        </div>
                                        
                                        <div class="col-md-6 mb-3">
                                            <label for="videoStandard" class="form-label">Видеостандарт</label>
                                            <select class="form-select" id="videoStandard" name="videoStandard">
                                                <option value="">Избери видеостандарт...</option>
                                                <option value="VGA">VGA</option>
                                                <option value="CGA">CGA</option>
                                                <option value="EGA">EGA</option>
                                                <option value="MDA">MDA</option>
                                                <option value="Hercules">Hercules</option>
                                            </select>
                                            <small class="form-text text-muted">Само за видеокарти</small>
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Monitor-specific fields (shown only when category is "Монитори") -->
                                <div id="monitorFields" style="display: none;">
                                    <div class="mb-3">
                                        <label for="videoInput" class="form-label">Видеовход</label>
                                        <select class="form-select" id="videoInput" name="videoInput">
                                            <option value="">Избери видеовход...</option>
                                            <option value="VGA">VGA</option>
                                            <option value="CGA">CGA</option>
                                            <option value="EGA">EGA</option>
                                            <option value="MDA">MDA</option>
                                            <option value="Hercules">Hercules</option>
                                            <option value="Чинч">Чинч (Composite/RCA)</option>
                                            <option value="DVI">DVI</option>
                                            <option value="HDMI">HDMI</option>
                                        </select>
                                    </div>
                                </div>
                                
                                <!-- Subcategory fields for Mice, Keyboards, Computers -->
                                <div id="subcategoryOnlyFields" style="display: none;">
                                    <div class="mb-3">
                                        <label for="subcategoryOnly" class="form-label">Подкатегория</label>
                                        <select class="form-select" id="subcategoryOnly" name="subcategoryOnly">
                                            <option value="">Избери подкатегория...</option>
                                        </select>
                                    </div>
                                </div>

                                <!-- Price -->
                                <div class="mb-3">
                                    <label for="price" class="form-label">Цена</label>
                                    <input type="text" class="form-control" id="price" name="price" placeholder="по договаряне">
                                    <small class="form-text text-muted">Остави празно за "по договаряне"</small>
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
    
    // Initialize image upload
    renderImageUpload('imageUploadContainer', {
        maxFiles: 3,
        maxWidth: 800,
        maxHeight: 600,
        quality: 0.85,
    })
    
    // Show/hide category-specific fields based on category selection
    const categorySelect = document.getElementById('category')
    const partsFields = document.getElementById('partsFields')
    const monitorFields = document.getElementById('monitorFields')
    const subcategoryOnlyFields = document.getElementById('subcategoryOnlyFields')
    const subcategoryOnlySelect = document.getElementById('subcategoryOnly')
    
    const subcategoryOptions = {
        'Мишки': ['COM/RS232', 'PS/2', 'USB'],
        'Клавиатури': ['DIN5', 'PS/2', 'USB', 'SDL', 'Други'],
        'Компютри': ['x86 съвместими', 'Apple II съвместими', 'MAC серия', 'Atari', 'ZX Spectrum', 'Oric', 'Amiga', 'Други']
    }
    
    categorySelect.addEventListener('change', () => {
        const category = categorySelect.value
        
        // Hide all first
        partsFields.style.display = 'none'
        monitorFields.style.display = 'none'
        subcategoryOnlyFields.style.display = 'none'
        
        if (category === 'Части') {
            partsFields.style.display = 'block'
        } else if (category === 'Монитори') {
            monitorFields.style.display = 'block'
        } else if (subcategoryOptions[category]) {
            subcategoryOnlyFields.style.display = 'block'
            
            // Populate options
            subcategoryOnlySelect.innerHTML = '<option value="">Избери подкатегория...</option>'
            subcategoryOptions[category].forEach(opt => {
                subcategoryOnlySelect.innerHTML += `<option value="${opt}">${opt}</option>`
            })
        }
        
        // Reset all fields
        document.getElementById('subcategory').value = ''
        document.getElementById('slotType').value = ''
        document.getElementById('videoStandard').value = ''
        document.getElementById('videoInput').value = ''
        subcategoryOnlySelect.value = ''
    })
    
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
            category: formData.get('category'),
            listing_type: formData.get('listingType') || 'offering',
            price: formData.get('price') || 'по договаряне',
            location: formData.get('location'),
            condition: formData.get('condition'),
            year: formData.get('year') ? parseInt(formData.get('year')) : null,
            working: formData.get('working') === 'true',
            images: getUploadedImages()
        }
        
        // Add parts-specific fields if category is "Части"
        if (listing.category === 'Части') {
            listing.subcategory = formData.get('subcategory') || null
            listing.slot_type = formData.get('slotType') || null
            listing.video_standard = formData.get('videoStandard') || null
        }
        
        // Add monitor-specific fields if category is "Монитори"
        if (listing.category === 'Монитори') {
            listing.video_input = formData.get('videoInput') || null
        }
        
        // Add subcategory for mice, keyboards, computers
        const subcategoryOnlyCategories = ['Мишки', 'Клавиатури', 'Компютри']
        if (subcategoryOnlyCategories.includes(listing.category)) {
            listing.subcategory = formData.get('subcategoryOnly') || null
        }
        
        console.log('📝 Данни на листинга:', listing)
        
        // Validate required fields
        if (!listing.title || !listing.description || !listing.category || !listing.location) {
            throw new Error('Задължителни полета липсват')
        }
        
        // Create listing via Supabase
        if (isSupabaseConnected()) {
            const currentUser = await authService.getCurrentUser()
            console.log('👤 User ID:', currentUser.id)
            
            const result = await listingsService.createListing({
                ...listing,
                user_id: currentUser.id
            })
            
            console.log('✅ Резултат от createListing:', result)
            
            if (result && !result.error) {
                // Clear uploaded images
                clearUploadedImages()
                
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
