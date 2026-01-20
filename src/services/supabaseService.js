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
        if (!supabase) return

        try {
            await supabase.auth.signOut()
        } catch (error) {
            console.error('Logout error:', error)
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
                .order('created_at', { ascending: false })

            return error ? [] : (data || [])
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

            return error ? null : data
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
     * Delete listing
     */
    async deleteListing(id) {
        if (!supabase) return { error: 'Supabase не е конфигуриран' }

        try {
            const { error } = await supabase
                .from('listings')
                .delete()
                .eq('id', id)

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
 * User Service
 */
export const userService = {
    /**
     * Get user profile
     */
    async getUserProfile(userId) {
        if (!supabase) return null

        try {
            const { data, error } = await supabase
                .from('users')
                .select('*')
                .eq('id', userId)
                .single()

            return error ? null : data
        } catch (error) {
            console.error('Error fetching user profile:', error)
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

export default supabase
