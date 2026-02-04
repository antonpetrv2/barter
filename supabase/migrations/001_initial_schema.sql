-- Initial Database Schema for BARTER App
-- Created: 2026-02-04
-- This migration creates the complete database schema for the retro computer barter platform

-- =====================================================
-- TABLES
-- =====================================================

-- Users table - User profiles and authentication
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    city TEXT,
    avatar_url TEXT,
    rating NUMERIC DEFAULT 5.0,
    listings_count INTEGER DEFAULT 0,
    role TEXT DEFAULT 'user'::text CHECK (role = ANY (ARRAY['user'::text, 'admin'::text])),
    status TEXT DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
    is_banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    banned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Listings table - Retro computer items for barter
CREATE TABLE IF NOT EXISTS listings (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    category TEXT,
    price TEXT,
    location TEXT,
    condition TEXT,
    year INTEGER,
    working BOOLEAN DEFAULT true,
    image_url TEXT,
    images JSON,
    views INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending'::text CHECK (status = ANY (ARRAY['pending'::text, 'approved'::text, 'rejected'::text])),
    deleted_at TIMESTAMP,
    subcategory TEXT,
    slot_type TEXT,
    video_standard TEXT,
    video_input TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Categories table - Item categories
CREATE TABLE IF NOT EXISTS categories (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT
);

-- Messages table - User-to-user messaging
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id BIGINT REFERENCES listings(id) ON DELETE SET NULL,
    message TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Reviews table - User ratings and reviews
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id BIGINT REFERENCES listings(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_listings_user_id ON listings(user_id);
CREATE INDEX IF NOT EXISTS idx_listings_category ON listings(category);
CREATE INDEX IF NOT EXISTS idx_messages_sender ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_reviews_user ON reviews(reviewed_user_id);

-- =====================================================
-- DATA
-- =====================================================

-- Insert default categories
INSERT INTO categories (name, icon, description) VALUES
('Компютри', '💻', 'Ретро компютри и системи'),
('Клавиатури', '⌨️', 'Механични и стари клавиатури'),
('Монитори', '🖥️', 'CRT и старинни дисплеи'),
('Мишки', '🖱️', 'Механични мишки'),
('Периферия', '🔌', 'Принтери, скенери и др.'),
('Части', '🔧', 'Компоненти и резервни части')
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- ===== USERS TABLE POLICIES =====
-- Anyone can read all user profiles
CREATE POLICY "Allow public read users"
ON users FOR SELECT
TO public
USING (true);

-- Only own user can update their profile
CREATE POLICY "Allow user to update own profile"
ON users FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- ===== LISTINGS TABLE POLICIES =====
-- Anyone can read all listings
CREATE POLICY "Allow public read listings"
ON listings FOR SELECT
TO public
USING (true);

-- Only authenticated users can create listings
CREATE POLICY "Allow authenticated to insert listings"
ON listings FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Only owner can update their listings
CREATE POLICY "Allow owner to update own listings"
ON listings FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Only owner can delete their listings
CREATE POLICY "Allow owner to delete own listings"
ON listings FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

-- ===== MESSAGES TABLE POLICIES =====
-- Only sender or receiver can read messages
CREATE POLICY "Users can read own messages"
ON messages FOR SELECT
TO authenticated
USING (auth.uid() = sender_id OR auth.uid() = receiver_id);

-- Only authenticated can insert messages
CREATE POLICY "Allow authenticated to insert messages"
ON messages FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = sender_id);

-- ===== REVIEWS TABLE POLICIES =====
-- Anyone can read reviews
CREATE POLICY "Allow public read reviews"
ON reviews FOR SELECT
TO public
USING (true);

-- Only authenticated users can create reviews
CREATE POLICY "Allow authenticated to insert reviews"
ON reviews FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = reviewer_id);

-- =====================================================
-- COMMENTS (Documentation)
-- =====================================================

COMMENT ON COLUMN listings.subcategory IS 'Subcategory: Parts(Видеокарти,Звукови карти,Лан карти,Други), Mice(COM/RS232,PS/2,USB), Keyboards(DIN5,PS/2,USB,SDL,Други), Computers(x86,Apple II,MAC,Atari,ZX Spectrum,Oric,Amiga,Други)';
COMMENT ON COLUMN listings.slot_type IS 'Slot type for parts: ISA, VLB, AGP, PCI, PCIe';
COMMENT ON COLUMN listings.video_standard IS 'Video standard for video cards: VGA, CGA, EGA, MDA, Hercules';
COMMENT ON COLUMN listings.video_input IS 'Video input for monitors: VGA, CGA, EGA, MDA, Hercules, Чинч, DVI, HDMI';
