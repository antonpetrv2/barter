/**
 * Footer Component
 * Displays the footer for the app
 */

export function renderFooter() {
    const footer = document.getElementById('footer')
    
    const year = new Date().getFullYear()
    footer.innerHTML = `
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5>BARTER</h5>
                    <p>Платформа за бартер на ретро компютри и части</p>
                </div>
                <div class="col-md-4">
                    <h5>Быстрые ссылки</h5>
                    <ul class="list-unstyled">
                        <li><a href="#/" class="text-white-50">Начало</a></li>
                        <li><a href="#/listings" class="text-white-50">Обяви</a></li>
                        <li><a href="#/contact" class="text-white-50">Контакт</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5>Свързване</h5>
                    <p class="text-white-50">
                        <i class="bi bi-telegram"></i> Telegram Group<br>
                        <i class="bi bi-envelope"></i> info@barter.local
                    </p>
                </div>
            </div>
            <hr class="bg-white-50">
            <p class="text-white-50">&copy; ${year} BARTER. Всички права запазени.</p>
        </div>
    `
}
