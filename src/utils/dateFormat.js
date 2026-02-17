/**
 * Shared date formatting helpers
 */

/**
 * Format date in Bulgarian locale
 */
export function formatBgDate(dateString) {
    if (!dateString) return '—'

    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return '—'

    return date.toLocaleDateString('bg-BG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

/**
 * Format date & time in Bulgarian locale
 */
export function formatBgDateTime(dateString) {
    if (!dateString) return '—'

    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return '—'

    return date.toLocaleDateString('bg-BG', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

/**
 * Relative time in Bulgarian, fallback to date
 */
export function formatBgRelativeDate(dateString) {
    if (!dateString) return 'Неизвестна дата'

    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return 'Неизвестна дата'

    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 60) return `${minutes} мин назад`
    if (hours < 24) return `${hours} часа назад`
    if (days < 7) return `${days} дни назад`

    return formatBgDate(dateString)
}
