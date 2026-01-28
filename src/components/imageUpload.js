/**
 * Image Upload Component
 * Handles image uploads with drag & drop support
 */

import { storageService } from '../services/supabaseService.js'

export function renderImageUpload(containerId, options = {}) {
    const container = document.getElementById(containerId)
    if (!container) return

    const {
        maxFiles = 3,
        maxSizeMB = 5,
        maxWidth = 800,
        maxHeight = 600,
        quality = 0.85,
        onUpload = null,
    } = options

    const maxSizeBytes = maxSizeMB * 1024 * 1024

    container.innerHTML = `
        <div class="image-upload-container">
            <div class="upload-area" id="uploadArea">
                <div class="upload-content">
                    <i class="bi bi-cloud-upload" style="font-size: 2rem; color: #0066cc;"></i>
                    <h5 class="mt-3">Изтегли или избери снимки</h5>
                    <p class="text-muted small">
                        До 3 снимки, макс 800x600px<br>
                        <small>Снимките автоматично се оптимизират</small>
                    </p>
                    <input 
                        type="file" 
                        id="fileInput" 
                        multiple 
                        accept="image/*" 
                        style="display: none;"
                    >
                </div>
            </div>

            <!-- Progress bar -->
            <div id="uploadProgress" style="display: none;" class="mt-3">
                <div class="progress">
                    <div id="progressBar" class="progress-bar progress-bar-animated" role="progressbar" style="width: 0%"></div>
                </div>
                <small class="text-muted">Качване в ход...</small>
            </div>

            <!-- Uploaded images preview -->
            <div id="imagePreview" class="mt-3">
                <div id="imageGallery" class="row g-2"></div>
            </div>

            <!-- Error messages -->
            <div id="uploadError" class="alert alert-danger mt-3" style="display: none;"></div>
        </div>
    `

    // Store uploaded images
    window.uploadedImages = window.uploadedImages || []

    // Setup event listeners
    const uploadArea = document.getElementById('uploadArea')
    const fileInput = document.getElementById('fileInput')
    const uploadProgress = document.getElementById('uploadProgress')
    const progressBar = document.getElementById('progressBar')
    const imageGallery = document.getElementById('imageGallery')
    const errorDiv = document.getElementById('uploadError')

    // Click to select
    uploadArea.addEventListener('click', () => fileInput.click())

    // Drag and drop
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault()
        uploadArea.style.borderColor = '#0066cc'
        uploadArea.style.backgroundColor = 'rgba(0, 102, 204, 0.1)'
    })

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#ddd'
        uploadArea.style.backgroundColor = '#f9f9f9'
    })

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault()
        uploadArea.style.borderColor = '#ddd'
        uploadArea.style.backgroundColor = '#f9f9f9'
        
        const files = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
        if (files.length > 0) {
            handleFiles(files)
        }
    })

    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFiles(Array.from(e.target.files))
    })

    // Handle file uploads
    async function handleFiles(files) {
        errorDiv.style.display = 'none'
        
        // Validate and compress files
        const validFiles = []
        const errors = []

        for (const file of files) {
            if (!file.type.startsWith('image/')) {
                errors.push(`${file.name} не е снимка`)
                continue
            }
            if (window.uploadedImages.length + validFiles.length >= maxFiles) {
                errors.push(`Максимум ${maxFiles} снимки`)
                break
            }
            
            try {
                // Compress and resize image
                console.log(`Компресиране на ${file.name}: ${(file.size / 1024).toFixed(1)}KB...`)
                const compressedFile = await compressImage(file, maxWidth, maxHeight, quality)
                console.log(`✅ Компресирано: ${(file.size / 1024).toFixed(1)}KB → ${(compressedFile.size / 1024).toFixed(1)}KB`)
                validFiles.push(compressedFile)
            } catch (error) {
                errors.push(`${file.name}: грешка при обработка`)
                console.error('Image compression error:', error)
            }
        }

        if (errors.length > 0) {
            errorDiv.textContent = errors.join('\n')
            errorDiv.style.display = 'block'
        }

        if (validFiles.length === 0) return

        // Show progress
        uploadProgress.style.display = 'block'
        uploadArea.style.pointerEvents = 'none'
        uploadArea.style.opacity = '0.5'

        // Upload files
        const { urls, errors: uploadErrors } = await storageService.uploadMultipleImages(validFiles)

        // Update progress
        progressBar.style.width = '100%'

        // Handle responses
        if (uploadErrors && uploadErrors.length > 0) {
            const errorMessages = uploadErrors.map(e => `${e.file}: ${e.error}`).join('\n')
            errorDiv.textContent = 'Грешка при качване:\n' + errorMessages
            errorDiv.style.display = 'block'
        }

        // Add images to preview
        urls.forEach(url => {
            window.uploadedImages.push(url)
            addImagePreview(url)
        })

        // Reset
        setTimeout(() => {
            uploadProgress.style.display = 'none'
            progressBar.style.width = '0%'
            uploadArea.style.pointerEvents = 'auto'
            uploadArea.style.opacity = '1'
            fileInput.value = ''
            
            // Callback
            if (onUpload) {
                onUpload(window.uploadedImages)
            }
        }, 500)
    }

    function addImagePreview(url) {
        const imageDiv = document.createElement('div')
        imageDiv.className = 'col-md-3 col-sm-4'
        imageDiv.innerHTML = `
            <div class="position-relative">
                <img src="${url}" alt="Preview" class="img-thumbnail" style="width: 100%; height: 150px; object-fit: cover;">
                <button type="button" class="btn btn-sm btn-danger position-absolute top-0 end-0" 
                    onclick="removeImage('${url}')" style="margin: 5px;">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `
        imageGallery.appendChild(imageDiv)
    }

    // Make removeImage global
    window.removeImage = (url) => {
        window.uploadedImages = window.uploadedImages.filter(img => img !== url)
        imageGallery.innerHTML = ''
        window.uploadedImages.forEach(img => addImagePreview(img))
        
        if (onUpload) {
            onUpload(window.uploadedImages)
        }
    }

    // Add styles
    const style = document.createElement('style')
    style.textContent = `
        .image-upload-container {
            margin: 20px 0;
        }
        
        .upload-area {
            border: 2px dashed #ddd;
            border-radius: 8px;
            padding: 40px 20px;
            text-align: center;
            cursor: pointer;
            background-color: #f9f9f9;
            transition: all 0.3s ease;
        }
        
        .upload-area:hover {
            border-color: #0066cc;
            background-color: rgba(0, 102, 204, 0.05);
        }
        
        .upload-content {
            pointer-events: none;
        }
        
        #imageGallery {
            padding: 10px 0;
        }
        
        .img-thumbnail {
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
        }
        
        .img-thumbnail:hover {
            opacity: 0.8;
        }
    `
    
    if (!document.head.querySelector('style[data-image-upload]')) {
        style.setAttribute('data-image-upload', 'true')
        document.head.appendChild(style)
    }
}

/**
 * Get uploaded images
 */
export function getUploadedImages() {
    return window.uploadedImages || []
}

/**
 * Clear uploaded images
 */
export function clearUploadedImages() {
    window.uploadedImages = []
}

/**
 * Compress and resize image
 */
async function compressImage(file, maxWidth, maxHeight, quality) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = (e) => {
            const img = new Image()
            
            img.onload = () => {
                // Calculate new dimensions
                let width = img.width
                let height = img.height
                
                if (width > maxWidth || height > maxHeight) {
                    const ratio = Math.min(maxWidth / width, maxHeight / height)
                    width = Math.floor(width * ratio)
                    height = Math.floor(height * ratio)
                }
                
                // Create canvas
                const canvas = document.createElement('canvas')
                canvas.width = width
                canvas.height = height
                
                // Draw and compress
                const ctx = canvas.getContext('2d')
                ctx.drawImage(img, 0, 0, width, height)
                
                // Try WebP format first (better compression)
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            reject(new Error('Failed to compress image'))
                            return
                        }
                        
                        // Create new file from blob with WebP extension
                        const fileName = file.name.replace(/\.[^.]+$/, '.webp')
                        const compressedFile = new File([blob], fileName, {
                            type: 'image/webp',
                            lastModified: Date.now()
                        })
                        
                        console.log(`Compressed ${file.name}: ${(file.size / 1024).toFixed(1)}KB → ${(compressedFile.size / 1024).toFixed(1)}KB (WebP)`)
                        resolve(compressedFile)
                    },
                    'image/webp',
                    quality
                )
            }
            
            img.onerror = () => reject(new Error('Failed to load image'))
            img.src = e.target.result
        }
        
        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsDataURL(file)
    })
}
