/**
 * Supabase Service
 * Handles all database operations and authentication
 */

import { createClient } from '@supabase/supabase-js'

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
    console.warn('⚠️ Supabase credentials not configured. Using demo mode.')
}

const supabase = supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null

/**
 * Check if Supabase is connected
 */
export function isSupabaseConnected() {
    return supabase !== null
}

/**
 * Authentication Service
 */
export const authService = {
    /**
     * Register new user
     */
    async register(email, password, fullName, phone, city) {
        if (!supabase) {
            return { error: { message: 'Supabase не е конфигуриран' } }
        }

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
            })

            if (error) return { error }

            // Create user profile
            if (data.user) {
                await supabase.from('users').insert([{
                    id: data.user.id,
                    email,
                    full_name: fullName,
                    phone,
                    city,
                    rating: 5.0,
                    created_at: new Date().toISOString(),
                }])
            }

            return { data }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Login user
     */
    async login(email, password) {
        if (!supabase) {
            return { error: { message: 'Supabase не е конфигуриран' } }
        }

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Logout user
     */
    async logout() {
        if (!supabase) return { error: null }

        try {
            const { error } = await supabase.auth.signOut()
            return { error }
        } catch (error) {
            console.error('Logout error:', error)
            return { error }
        }
    },

    /**
     * Get current user
     */
    async getCurrentUser() {
        if (!supabase) return null

        try {
            const { data: { user }, error } = await supabase.auth.getUser()
            return error ? null : user
        } catch (error) {
            return null
        }
    },

    /**
     * Get user session
     */
    async getSession() {
        if (!supabase) return null

        try {
            const { data: { session }, error } = await supabase.auth.getSession()
            return error ? null : session
        } catch (error) {
            return null
        }
    },

    /**
     * Get user profile from database
     */
    async getUserProfile(userId) {
        if (!supabase) return null

        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()

            if (error) {
                console.error('Error fetching user profile:', error.message || error)
                return null
            }

            return data
        } catch (error) {
            console.error('Error fetching user profile:', error.message || error)
            return null
        }
    },

    /**
     * Update user profile
     */
    async updateUserProfile(userId, updates) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            const { data, error } = await supabase
                .from('users')
                .update(updates)
                .eq('id', userId)

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },
}

/**
 * Listings Service
 */
export const listingsService = {
    /**
     * Get all listings
     */
    async getAllListings() {
        if (!supabase) return []

        try {
            const { data, error } = await supabase
                .from('listings')
                .select(`
                    *,
                    users (
                        full_name,
                        email,
                        phone,
                        rating
                    )
                `)
                .eq('status', 'approved')
                .is('deleted_at', null)
                .order('created_at', { ascending: false })

            if (error) {
                console.error('❌ Грешка при зареждане на листинги:', error)
                return []
            }

            console.log('✅ Зареждени листинги:', data?.length || 0, data)
            return data || []
        } catch (error) {
            console.error('Error fetching listings:', error)
            return []
        }
    },

    /**
     * Get listing by ID
     */
    async getListingById(id) {
        if (!supabase) return null

        console.log('getListingById called with id:', id)

        try {
            const { data, error } = await supabase
                .from('listings')
                .select(`
                    *,
                    users (
                        full_name,
                        email,
                        phone,
                        rating
                    )
                `)
                .eq('id', id)
                .single()

            if (error) {
                console.error('Error in getListingById:', error)
                return null
            }

            console.log('getListingById result:', data)
            return data
        } catch (error) {
            console.error('Error fetching listing:', error)
            return null
        }
    },

    /**
     * Get user's listings
     */
    async getUserListings(userId) {
        if (!supabase) return []

        try {
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .eq('user_id', userId)
                .is('deleted_at', null)
                .order('created_at', { ascending: false })

            return error ? [] : (data || [])
        } catch (error) {
            console.error('Error fetching user listings:', error)
            return []
        }
    },

    /**
     * Create new listing
     */
    async createListing(listing) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            const { data, error } = await supabase
                .from('listings')
                .insert([{
                    ...listing,
                    status: 'pending',
                    created_at: new Date().toISOString(),
                    views: 0,
                }])

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Update listing
     */
    async updateListing(id, updates) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            const { data, error } = await supabase
                .from('listings')
                .update({
                    ...updates,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', id)

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Delete listing (soft delete)
     */
    async deleteListing(id, userId) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            // First check if the listing belongs to the user
            const { data: listing, error: fetchError } = await supabase
                .from('listings')
                .select('user_id')
                .eq('id', id)
                .single()

            if (fetchError) return { error: fetchError }
            
            if (!listing) {
                return { error: { message: 'Обявата не е намерена' } }
            }

            // Check ownership
            if (listing.user_id !== userId) {
                return { error: { message: 'Нямате право да изтриете тази обява' } }
            }

            // Soft delete: mark as deleted
            const { error } = await supabase
                .from('listings')
                .update({ 
                    deleted_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .eq('user_id', userId)

            return error ? { error } : { success: true }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Restore deleted listing
     */
    async restoreListing(id, userId) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            // Check ownership
            const { data: listing, error: fetchError } = await supabase
                .from('listings')
                .select('user_id')
                .eq('id', id)
                .single()

            if (fetchError) return { error: fetchError }
            
            if (!listing) {
                return { error: { message: 'Обявата не е намерена' } }
            }

            if (listing.user_id !== userId) {
                return { error: { message: 'Нямате право да възстановите тази обява' } }
            }

            // Restore: remove deleted_at
            const { error } = await supabase
                .from('listings')
                .update({ 
                    deleted_at: null,
                    updated_at: new Date().toISOString()
                })
                .eq('id', id)
                .eq('user_id', userId)

            return error ? { error } : { success: true }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Get deleted listings for a user
     */
    async getDeletedListings(userId) {
        if (!supabase) return []

        try {
            const { data, error } = await supabase
                .from('listings')
                .select('*')
                .eq('user_id', userId)
                .not('deleted_at', 'is', null)
                .order('deleted_at', { ascending: false })

            return error ? [] : (data || [])
        } catch (error) {
            console.error('Error fetching deleted listings:', error)
            return []
        }
    },

    /**
     * Permanently delete listing
     */
    async permanentlyDeleteListing(id, userId) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            // Check ownership
            const { data: listing, error: fetchError } = await supabase
                .from('listings')
                .select('user_id')
                .eq('id', id)
                .single()

            if (fetchError) return { error: fetchError }
            
            if (!listing) {
                return { error: { message: 'Обявата не е намерена' } }
            }

            if (listing.user_id !== userId) {
                return { error: { message: 'Нямате право да изтриете тази обява' } }
            }

            // Permanent delete
            const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', id)
                .eq('user_id', userId)

            return error ? { error } : { success: true }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Increment view count
     */
    async incrementViews(id) {
        if (!supabase) return

        try {
            await supabase.rpc('increment_views', { listing_id: id })
        } catch (error) {
            console.error('Error incrementing views:', error)
        }
    },
}

/**
 * Admin Service
 */
export const adminService = {
    /**
     * Get all users with filters
     */
    async getAllUsers(filters = {}) {
        if (!supabase) return { error: 'Supabase не е конфигуриран', data: [] }

        try {
            let query = supabase.from('users').select('*')

            // Apply filters
            if (filters.status) {
                query = query.eq('status', filters.status)
            }
            if (filters.role) {
                query = query.eq('role', filters.role)
            }
            if (filters.is_banned !== undefined) {
                query = query.eq('is_banned', filters.is_banned)
            }
            if (filters.search) {
                query = query.or(`email.ilike.%${filters.search}%,full_name.ilike.%${filters.search}%`)
            }

            const { data, error } = await query.order('created_at', { ascending: false })

            return error ? { error, data: [] } : { data }
        } catch (error) {
            return { error, data: [] }
        }
    },

    /**
     * Approve user account
     */
    async approveUser(userId) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            const { data, error } = await supabase
                .from('users')
                .update({ status: 'approved' })
                .eq('id', userId)

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Reject user account
     */
    async rejectUser(userId, reason = '') {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            const { data, error } = await supabase
                .from('users')
                .update({ status: 'rejected', ban_reason: reason })
                .eq('id', userId)

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Ban user
     */
    async banUser(userId, reason = '') {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            const { data, error } = await supabase
                .from('users')
                .update({ 
                    is_banned: true, 
                    ban_reason: reason,
                    banned_at: new Date().toISOString()
                })
                .eq('id', userId)

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Unban user
     */
    async unbanUser(userId) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            const { data, error } = await supabase
                .from('users')
                .update({ 
                    is_banned: false, 
                    ban_reason: null,
                    banned_at: null
                })
                .eq('id', userId)

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Delete user account
     */
    async deleteUser(userId) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            // Delete user profile (cascade will handle listings, messages, etc)
            const { data, error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId)

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Make user admin
     */
    async makeUserAdmin(userId) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            const { data, error } = await supabase
                .from('users')
                .update({ role: 'admin' })
                .eq('id', userId)

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Remove admin privileges
     */
    async removeAdminPrivileges(userId) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            const { data, error } = await supabase
                .from('users')
                .update({ role: 'user' })
                .eq('id', userId)

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Get user statistics
     */
    async getUserStatistics() {
        if (!supabase) return { error: 'Supabase не е конфигуриран', stats: {} }

        try {
            // Total users
            const { data: totalUsers } = await supabase
                .from('users')
                .select('id', { count: 'exact' })

            // Pending approvals
            const { data: pendingUsers } = await supabase
                .from('users')
                .select('id', { count: 'exact' })
                .eq('status', 'pending')

            // Banned users
            const { data: bannedUsers } = await supabase
                .from('users')
                .select('id', { count: 'exact' })
                .eq('is_banned', true)

            // Active listings
            const { data: activeListings } = await supabase
                .from('listings')
                .select('id', { count: 'exact' })
                .eq('status', 'approved')

            // Pending listings
            const { data: pendingListings } = await supabase
                .from('listings')
                .select('id', { count: 'exact' })
                .eq('status', 'pending')

            const stats = {
                totalUsers: totalUsers?.length || 0,
                pendingApprovals: pendingUsers?.length || 0,
                bannedUsers: bannedUsers?.length || 0,
                activeListings: activeListings?.length || 0,
                pendingListings: pendingListings?.length || 0,
            }

            return { stats }
        } catch (error) {
            return { error, stats: {} }
        }
    },

    /**
     * Get pending listings (awaiting approval)
     */
    async getPendingListings() {
        if (!supabase) return { error: 'Supabase не е конфигуриран', listings: [] }

        try {
            const { data, error } = await supabase
                .from('listings')
                .select(`
                    *,
                    users (
                        id,
                        full_name,
                        email,
                        phone
                    )
                `)
                .eq('status', 'pending')
                .order('created_at', { ascending: false })

            return error ? { error, listings: [] } : { listings: data || [] }
        } catch (error) {
            return { error, listings: [] }
        }
    },

    /**
     * Approve a listing
     */
    async approveListing(listingId) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            const { data, error } = await supabase
                .from('listings')
                .update({ status: 'approved' })
                .eq('id', listingId)

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Reject a listing
     */
    async rejectListing(listingId) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            const { data, error } = await supabase
                .from('listings')
                .update({ status: 'rejected' })
                .eq('id', listingId)

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },

    /**
     * Delete a listing
     */
    async deleteListing(listingId) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            const { data, error } = await supabase
                .from('listings')
                .delete()
                .eq('id', listingId)

            return error ? { error } : { data }
        } catch (error) {
            return { error }
        }
    },
}

/**
 * Storage Service
 * Handles file uploads to Supabase Storage
 */
export const storageService = {
    /**
     * Upload image to storage
     */
    async uploadImage(file, bucketName = 'listings') {
        if (!supabase) {
            return { error: 'Supabase не е конфигуриран', url: null }
        }

        try {
            // Generate unique filename
            const timestamp = Date.now()
            const randomStr = Math.random().toString(36).substring(2, 8)
            const filename = `${timestamp}-${randomStr}-${file.name}`
            const path = `${bucketName}/${filename}`

            // Upload file
            const { data, error } = await supabase.storage
                .from(bucketName)
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: false,
                })

            if (error) {
                console.error('Upload error:', error.message)
                return { error, url: null }
            }

            // Get public URL
            const { data: publicUrlData } = supabase.storage
                .from(bucketName)
                .getPublicUrl(path)

            // Ensure full URL with base URL
            const publicUrl = publicUrlData.publicUrl.startsWith('http') 
                ? publicUrlData.publicUrl 
                : `${supabaseUrl}${publicUrlData.publicUrl}`

            return { url: publicUrl, path }
        } catch (error) {
            console.error('Upload error:', error.message)
            return { error, url: null }
        }
    },

    /**
     * Upload multiple images
     */
    async uploadMultipleImages(files, bucketName = 'listings') {
        if (!supabase) {
            return { error: 'Supabase не е конфигуриран', urls: [] }
        }

        const urls = []
        const errors = []

        for (const file of files) {
            const { url, error } = await this.uploadImage(file, bucketName)
            
            if (error) {
                errors.push({ file: file.name, error: error.message })
            } else {
                urls.push(url)
            }
        }

        return { urls, errors: errors.length > 0 ? errors : null }
    },

    /**
     * Delete image from storage
     */
    async deleteImage(imagePath, bucketName = 'listings') {
        if (!supabase) {
            return { error: 'Supabase не е конфигуриран' }
        }

        try {
            const { error } = await supabase.storage
                .from(bucketName)
                .remove([imagePath])

            return error ? { error } : { success: true }
        } catch (error) {
            return { error }
        }
    },
}

export default supabase
