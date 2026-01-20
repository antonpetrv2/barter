/**
 * Navigation Bar Component
 * Displays the main navigation for the app
 */

export function renderNavbar() {
    const navbar = document.getElementById('navbar')
    
    navbar.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-light bg-white">
            <div class="container-fluid">
                <a class="navbar-brand fw-bold" href="#/">
                    <i class="bi bi-laptop"></i> BARTER
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
                            <a class="nav-link" href="#/listings">Обяви</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#/my-listings">Моите обяви</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="#/auth">Вход / Регистрация</a>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    `
    
    // Add navbar styling
    const style = document.createElement('style')
    style.textContent = `
        .navbar-brand {
            font-size: 1.5rem;
            color: #0066cc !important;
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
    `
    if (!document.head.querySelector('style[data-navbar]')) {
        style.setAttribute('data-navbar', 'true')
        document.head.appendChild(style)
    }
}
