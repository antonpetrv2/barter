/**
 * Messages Page
 * Conversation view with active and archived threads
 */

import { authService, messageService } from '../services/supabaseService.js'
import { formatBgDateTime } from '../utils/dateFormat.js'
import { renderNavbar } from '../components/navbar.js'

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

    const [{ messages, error: messagesError }, { states, error: statesError }] = await Promise.all([
        messageService.getUserMessages(currentUser.id),
        messageService.getConversationStates(currentUser.id)
    ])

    if (messagesError || statesError) {
        content.innerHTML = `
            <div class="container py-5">
                <div class="alert alert-danger" role="alert">
                    Грешка при зареждане на съобщенията.
                </div>
            </div>
        `
        return
    }

    const conversations = buildConversations(messages || [], states || [], currentUser.id)
    const activeConversations = conversations.filter(c => !c.archived)
    const archivedConversations = conversations.filter(c => c.archived)

    const unreadCounterpartyIds = conversations
        .filter(c => c.unreadCount > 0)
        .map(c => c.counterpartyId)

    if (unreadCounterpartyIds.length > 0) {
        await Promise.all(
            unreadCounterpartyIds.map(counterpartyId =>
                messageService.markConversationRead(currentUser.id, counterpartyId)
            )
        )

        await renderNavbar()
    }

    content.innerHTML = `
        <div class="container py-5">
            <div class="row mb-4">
                <div class="col-12">
                    <h1 class="display-6 fw-bold mb-2">Мои съобщения</h1>
                    <p class="text-muted mb-0">Активни разговори: ${activeConversations.length} | Архив: ${archivedConversations.length}</p>
                </div>
            </div>

            <ul class="nav nav-tabs mb-3" role="tablist">
                <li class="nav-item" role="presentation">
                    <button class="nav-link active" data-bs-toggle="tab" data-bs-target="#active-panel" type="button">Актуални</button>
                </li>
                <li class="nav-item" role="presentation">
                    <button class="nav-link" data-bs-toggle="tab" data-bs-target="#archive-panel" type="button">Архив</button>
                </li>
            </ul>

            <div class="tab-content">
                <div class="tab-pane fade show active" id="active-panel" role="tabpanel">
                    ${renderConversationList(activeConversations, currentUser.id, false)}
                </div>
                <div class="tab-pane fade" id="archive-panel" role="tabpanel">
                    ${renderConversationList(archivedConversations, currentUser.id, true)}
                </div>
            </div>
        </div>
    `

    attachConversationHandlers(currentUser.id)
}

function buildConversations(messages, states, currentUserId) {
    const stateMap = new Map((states || []).map(s => [s.counterparty_id, !!s.archived]))
    const grouped = new Map()

    for (const msg of messages) {
        const isIncoming = msg.receiver_id === currentUserId
        const counterpartyId = isIncoming ? msg.sender_id : msg.receiver_id
        if (!counterpartyId) continue

        const counterparty = isIncoming ? msg.sender : msg.receiver
        const key = counterpartyId

        if (!grouped.has(key)) {
            grouped.set(key, {
                counterpartyId,
                counterpartyName: counterparty?.full_name || counterparty?.email || 'Потребител',
                archived: stateMap.get(counterpartyId) === true,
                messages: [],
                lastAt: msg.created_at,
                unreadCount: 0,
            })
        }

        const conv = grouped.get(key)
        conv.messages.push(msg)

        if (isIncoming && msg.read === false) {
            conv.unreadCount += 1
        }

        if (!conv.lastAt || new Date(msg.created_at) > new Date(conv.lastAt)) {
            conv.lastAt = msg.created_at
        }
    }

    return Array.from(grouped.values()).sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt))
}

function renderConversationList(conversations, currentUserId, isArchiveTab) {
    if (!conversations || conversations.length === 0) {
        return `<div class="alert alert-info">${isArchiveTab ? 'Няма архивирани разговори.' : 'Няма актуални разговори.'}</div>`
    }

    return conversations.map(conv => {
        const sorted = [...conv.messages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
        const last = sorted[sorted.length - 1]

        return `
        <div class="card mb-3">
            <div class="card-body">
                <div class="d-flex justify-content-between align-items-start mb-3">
                    <div>
                        <h5 class="mb-1">Разговор с ${conv.counterpartyName}</h5>
                        <small class="text-muted">Последно: ${formatBgDateTime(last?.created_at)}</small>
                    </div>
                    <button class="btn btn-sm ${isArchiveTab ? 'btn-outline-success unarchive-conversation-btn' : 'btn-outline-secondary archive-conversation-btn'}" data-counterparty-id="${conv.counterpartyId}">
                        ${isArchiveTab ? 'Върни в актуални' : 'Архивирай'}
                    </button>
                </div>

                <div class="border rounded p-3 mb-3" style="max-height: 260px; overflow-y: auto; background: #fafafa;">
                    ${sorted.map(msg => {
                        const own = msg.sender_id === currentUserId
                        return `
                            <div class="d-flex ${own ? 'justify-content-end' : 'justify-content-start'} mb-2">
                                <div class="p-2 rounded ${own ? 'bg-primary text-white' : 'bg-white border'}" style="max-width: 80%;">
                                    ${msg.listings?.id ? `<div class="small ${own ? 'text-white-50' : 'text-muted'}">Обява: <a class="${own ? 'text-white' : ''}" href="#/listing/${msg.listings.id}">${msg.listings.title || ('#' + msg.listings.id)}</a></div>` : ''}
                                    <div>${msg.message || ''}</div>
                                    <div class="small ${own ? 'text-white-50' : 'text-muted'}">${formatBgDateTime(msg.created_at)}</div>
                                </div>
                            </div>
                        `
                    }).join('')}
                </div>

                <form class="reply-form" data-counterparty-id="${conv.counterpartyId}" data-listing-id="${last?.listing_id || ''}">
                    <div class="input-group">
                        <input type="text" class="form-control" name="reply" placeholder="Напиши отговор..." required>
                        <button class="btn btn-primary" type="submit">Отговори</button>
                    </div>
                </form>
            </div>
        </div>
    `
    }).join('')
}

function attachConversationHandlers(currentUserId) {
    document.querySelectorAll('.reply-form').forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault()

            const counterpartyId = form.dataset.counterpartyId
            const listingIdRaw = form.dataset.listingId
            const input = form.querySelector('input[name="reply"]')
            const text = input.value.trim()

            if (!text) return

            const listingId = listingIdRaw ? Number(listingIdRaw) : null
            const { error } = await messageService.sendMessage({
                senderId: currentUserId,
                receiverId: counterpartyId,
                listingId,
                message: text,
            })

            if (error) {
                alert('Грешка при изпращане: ' + (error.message || 'Неуспешна операция'))
                return
            }

            await renderMessages()
        })
    })

    document.querySelectorAll('.archive-conversation-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const counterpartyId = btn.dataset.counterpartyId
            const { error } = await messageService.setConversationArchived(currentUserId, counterpartyId, true)
            if (error) {
                alert('Грешка при архивиране: ' + (error.message || 'Неуспешна операция'))
                return
            }
            await renderMessages()
        })
    })

    document.querySelectorAll('.unarchive-conversation-btn').forEach(btn => {
        btn.addEventListener('click', async () => {
            const counterpartyId = btn.dataset.counterpartyId
            const { error } = await messageService.setConversationArchived(currentUserId, counterpartyId, false)
            if (error) {
                alert('Грешка при връщане от архив: ' + (error.message || 'Неуспешна операция'))
                return
            }
            await renderMessages()
        })
    })
}
