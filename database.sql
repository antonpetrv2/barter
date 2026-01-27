-- BARTER App - Database Schema for Supabase
-- Copy and paste this entire script into Supabase SQL Editor

-- Drop existing tables if they exist (CASCADE to handle dependencies)
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS listings CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- Create users table
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    phone TEXT,
    city TEXT,
    avatar_url TEXT,
    rating NUMERIC DEFAULT 5.0,
    listings_count INTEGER DEFAULT 0,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    status TEXT DEFAULT 'approved' CHECK (status IN ('pending', 'approved', 'rejected')),
    is_banned BOOLEAN DEFAULT false,
    ban_reason TEXT,
    banned_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create listings table
CREATE TABLE listings (
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
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create categories table
CREATE TABLE categories (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name TEXT UNIQUE NOT NULL,
    icon TEXT,
    description TEXT
);

-- Create messages table
CREATE TABLE messages (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id BIGINT REFERENCES listings(id) ON DELETE SET NULL,
    message TEXT,
    read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create reviews table
CREATE TABLE reviews (
    id BIGINT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    reviewer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    reviewed_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    listing_id BIGINT REFERENCES listings(id) ON DELETE SET NULL,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_listings_user_id ON listings(user_id);
CREATE INDEX idx_listings_category ON listings(category);
CREATE INDEX idx_messages_sender ON messages(sender_id);
CREATE INDEX idx_messages_receiver ON messages(receiver_id);
CREATE INDEX idx_reviews_user ON reviews(reviewed_user_id);

-- Insert sample categories
INSERT INTO categories (name, icon, description) VALUES
('Компютри', '💻', 'Ретро компютри и системи'),
('Клавиатури', '⌨️', 'Механични и стари клавиатури'),
('Монитори', '🖥️', 'CRT и старинни дисплеи'),
('Мишки', '🖱️', 'Механични мишки'),
('Периферия', '🔌', 'Принтери, скенери и др.'),
('Части', '🔧', 'Компоненти и резервни части');
