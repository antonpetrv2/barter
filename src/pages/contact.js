/**
 * Contact Page
 * Display contact information and form
 */

export function renderContact() {
    const content = document.getElementById('content')
    
    content.innerHTML = `
        <div class="container py-5">
            <div class="row justify-content-center">
                <div class="col-lg-8">
                    <h1 class="mb-4">
                        <i class="bi bi-envelope"></i> Свържете се с нас
                    </h1>
                    
                    <div class="card mb-4">
                        <div class="card-body">
                            <h5 class="card-title mb-3">Информация за контакт</h5>
                            
                            <div class="row g-4">
                                <div class="col-md-6">
                                    <div class="d-flex align-items-start">
                                        <i class="bi bi-telegram fs-4 me-3 text-primary"></i>
                                        <div>
                                            <h6 class="mb-1">Telegram група</h6>
                                            <a href="https://t.me/+D22g7iCjMR44ZTg8" target="_blank" class="text-decoration-none">Присъедини се към групата</a>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="d-flex align-items-start">
                                        <i class="bi bi-clock fs-4 me-3 text-primary"></i>
                                        <div>
                                            <h6 class="mb-1">Работно време</h6>
                                            <p class="mb-0 text-muted">Всеки ден: 8:00 - 22:00</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div class="col-md-6">
                                    <div class="d-flex align-items-start">
                                        <i class="bi bi-geo-alt fs-4 me-3 text-primary"></i>
                                        <div>
                                            <h6 class="mb-1">Адрес</h6>
                                            <p class="mb-0 text-muted">София, България</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title mb-3">Изпратете съобщение</h5>
                            
                            <form id="contactForm">
                                <div class="mb-3">
                                    <label for="name" class="form-label">Име</label>
                                    <input type="text" class="form-control" id="name" required>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="email" class="form-label">Имейл адрес</label>
                                    <input type="email" class="form-control" id="email" required>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="subject" class="form-label">Тема</label>
                                    <input type="text" class="form-control" id="subject" required>
                                </div>
                                
                                <div class="mb-3">
                                    <label for="message" class="form-label">Съобщение</label>
                                    <textarea class="form-control" id="message" rows="5" required></textarea>
                                </div>
                                
                                <div class="mb-3">
                                    <label class="form-label">Проверка за сигурност</label>
                                    <div class="d-flex align-items-center gap-3">
                                        <span id="captchaQuestion" class="fw-bold"></span>
                                        <input type="number" class="form-control" id="captchaAnswer" style="max-width: 100px;" required>
                                    </div>
                                    <small class="text-muted">Решете примера за да изпратите съобщението</small>
                                </div>
                                
                                <button type="submit" class="btn btn-primary">
                                    <i class="bi bi-send"></i> Изпрати
                                </button>
                            </form>
                        </div>
                    </div>
                    
                    <div class="alert alert-info mt-4">
                        <i class="bi bi-info-circle"></i>
                        <strong>Имате въпроси?</strong> Можете да се свържете с нас чрез Telegram групата за най-бърз отговор.
                    </div>
                </div>
            </div>
        </div>
    `
    
    // Generate random math captcha
    let captchaNum1, captchaNum2, captchaAnswer
    function generateCaptcha() {
        captchaNum1 = Math.floor(Math.random() * 10) + 1
        captchaNum2 = Math.floor(Math.random() * 10) + 1
        captchaAnswer = captchaNum1 + captchaNum2
        document.getElementById('captchaQuestion').textContent = `${captchaNum1} + ${captchaNum2} = ?`
    }
    
    generateCaptcha()
    
    // Handle form submission
    const form = document.getElementById('contactForm')
    form.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        const name = document.getElementById('name').value
        const email = document.getElementById('email').value
        const subject = document.getElementById('subject').value
        const message = document.getElementById('message').value
        const userAnswer = parseInt(document.getElementById('captchaAnswer').value)
        
        // Validate captcha
        if (userAnswer !== captchaAnswer) {
            const errorDiv = document.createElement('div')
            errorDiv.className = 'alert alert-danger alert-dismissible fade show mt-3'
            errorDiv.innerHTML = `
                <i class="bi bi-x-circle"></i>
                Грешен отговор на проверката за сигурност. Опитайте отново.
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `
            form.parentElement.insertBefore(errorDiv, form)
            generateCaptcha()
            document.getElementById('captchaAnswer').value = ''
            return
        }
        
        // Disable submit button
        const submitBtn = form.querySelector('button[type="submit"]')
        const originalBtnText = submitBtn.innerHTML
        submitBtn.disabled = true
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Изпращане...'
        
        try {
            // Send email using Web3Forms API
            const formData = new FormData()
            formData.append('access_key', 'db32eeb4-d00f-4a3d-b1a9-1808e51627fd')
            formData.append('subject', `🔥 РЕТРО БАРТЕР 🔥 Съобщение от ${name} - ${subject}`)
            formData.append('from_name', name)
            formData.append('email', email)
            formData.append('message', `📧 НОВО СЪОБЩЕНИЕ ОТ САЙТА РЕТРО БАРТЕР\n\n` +
                `👤 От: ${name}\n` +
                `📧 Имейл: ${email}\n` +
                `📝 Тема: ${subject}\n` +
                `⏰ Дата: ${new Date().toLocaleString('bg-BG')}\n\n` +
                `💬 Съобщение:\n${message}\n\n` +
                `---\n` +
                `Изпратено от: https://barter.bg/contact`)
            formData.append('to', 'anton_io_banderas@abv.bg')
            
            const response = await fetch('https://api.web3forms.com/submit', {
                method: 'POST',
                body: formData
            })
            
            const result = await response.json()
            
            if (result.success) {
                // Show success message
                const alertDiv = document.createElement('div')
                alertDiv.className = 'alert alert-success alert-dismissible fade show mt-3'
                alertDiv.innerHTML = `
                    <i class="bi bi-check-circle"></i>
                    Съобщението е изпратено успешно! Ще се свържем с Вас скоро.
                    <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
                `
                form.parentElement.insertBefore(alertDiv, form)
                
                // Reset form
                form.reset()
                generateCaptcha()
            } else {
                throw new Error('Failed to send message')
            }
        } catch (error) {
            console.error('Error sending message:', error)
            
            // Show error and fallback to mailto
            const errorDiv = document.createElement('div')
            errorDiv.className = 'alert alert-warning alert-dismissible fade show mt-3'
            errorDiv.innerHTML = `
                <i class="bi bi-exclamation-triangle"></i>
                Възникна грешка. Моля, изпратете съобщението директно на anton_io_banderas@abv.bg
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            `
            form.parentElement.insertBefore(errorDiv, form)
        } finally {
            // Re-enable submit button
            submitBtn.disabled = false
            submitBtn.innerHTML = originalBtnText
        }
        
        console.log('Contact form submitted:', { name, email, subject, message })
    })
}
