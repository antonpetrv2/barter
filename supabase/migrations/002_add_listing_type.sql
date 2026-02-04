-- Add listing_type field to track "offering" vs "looking for" listings
-- Created: 2026-02-04

ALTER TABLE listings 
ADD COLUMN listing_type TEXT DEFAULT 'offering'::text 
CHECK (listing_type = ANY (ARRAY['offering'::text, 'looking'::text]));

-- Add index for faster filtering
CREATE INDEX IF NOT EXISTS idx_listings_type ON listings(listing_type);

-- Add comment for documentation
COMMENT ON COLUMN listings.listing_type IS 'Type of listing: offering (предлагам) or looking (търся)';
