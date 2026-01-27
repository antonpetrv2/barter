-- Soft Delete Migration Script
-- Add deleted_at column to existing listings table
-- Run this in Supabase SQL Editor if you already have a listings table

-- Add deleted_at column
ALTER TABLE listings ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP;

-- Update existing data (all existing listings are not deleted)
UPDATE listings SET deleted_at = NULL WHERE deleted_at IS NULL;

-- Optional: Create index for performance
CREATE INDEX IF NOT EXISTS idx_listings_deleted_at ON listings(deleted_at);

-- Success message
SELECT 'Soft delete migration completed successfully!' AS status;
