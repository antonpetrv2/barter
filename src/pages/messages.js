/**
 * Messages Page
 * Shows inbox and sent messages
 */

import { authService, messageService } from '../services/supabaseService.js'
import { formatBgDateTime } from '../utils/dateFormat.js'

export async function renderMessages() {
    const content = document.getElementById('content')

    content.innerHTML = `
        <div class="container py-5">
            <div class="text-center">
                <div class="spinner-border" role="status"></div>
                <p class="mt-3">Зареждане на съобщения...</p>
            </div>
        </div>
    `

    const currentUser = await authService.getCurrentUser()
    if (!currentUser) {
        content.innerHTML = `
            <div class="container py-5">
                <div class="alert alert-warning" role="alert">
                    Трябва да влезеш в профила си, за да виждаш съобщения.
                </div>
                <a href="#/auth" class="btn btn-primary">Вход</a>
            </div>
        `
        return
    }

    const [{ messages: inbox, error: inboxError }, { messages: sent, error: sentError }] = await Promise.all([
        messageService.getInboxMessages(currentUser.id),
        messageService.getSentMessages(currentUser.id)
    ])

    if (inboxError || sentError) {
        content.innerHTML = `
            <div class="container py-5">
                <div class="alert alert-danger" role="alert">
                    Грешка при зареждане на съобщенията.
                </div>
            </div>
        `
        return
    }

    content.innerHTML = `
        <div class="container py-5">
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="display-6 fw-bold mb-2">Мои съобщения</h1>
                    <p class="text-muted mb-0">Входящи: ${inbox.length} | Изпратени: ${sent.length}</p>
                </div>
            </div>

            <ul class="nav nav-tabs mb-3" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#inbox-panel" type="button">Входящи</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#sent-panel" type="button">Изпратени</button>
                </li>
            </ul>

            <div class="tab-content">
                <div class="tab-pane fade show active" id="inbox-panel" role="tabpanel">
                    ${renderInbox(inbox)}
                </div>
                <div class="tab-pane fade" id="sent-panel" role="tabpanel">
                    ${renderSent(sent)}
                </div>
            </div>
        </div>
    `
}

function renderInbox(messages) {
    if (!messages || messages.length === 0) {
        return '<div class="alert alert-info">Няма входящи съобщения.</div>'
    }

    return messages.map(msg => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h6 class="mb-1">От: ${msg.users?.full_name || msg.users?.email || 'Потребител'}</h6>
                        <small class="text-muted">${formatBgDateTime(msg.created_at)}</small>
                    </div>
                    ${msg.listings?.id ? `<a href="#/listing/${msg.listings.id}" class="btn btn-sm btn-outline-primary">Обява</a>` : ''}
                </div>
                ${msg.listings?.title ? `<p class="mb-2"><strong>Относно:</strong> ${msg.listings.title}</p>` : ''}
                <p class="mb-0">${msg.message || ''}</p>
            </div>
        </div>
    `).join('')
}

function renderSent(messages) {
    if (!messages || messages.length === 0) {
        return '<div class="alert alert-info">Няма изпратени съобщения.</div>'
    }

    return messages.map(msg => `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-2">
                    <div>
                        <h6 class="mb-1">До: ${msg.users?.full_name || msg.users?.email || 'Потребител'}</h6>
                        <small class="text-muted">${formatBgDateTime(msg.created_at)}</small>
                    </div>
                    ${msg.listings?.id ? `<a href="#/listing/${msg.listings.id}" class="btn btn-sm btn-outline-primary">Обява</a>` : ''}
                </div>
                ${msg.listings?.title ? `<p class="mb-2"><strong>Относно:</strong> ${msg.listings.title}</p>` : ''}
                <p class="mb-0">${msg.message || ''}</p>
            </div>
        </div>
    `).join('')
}
