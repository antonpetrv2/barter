-- Migration: Add subcategories and hardware filters for parts and monitors
-- Run this in Supabase SQL Editor

-- Add new columns to listings table
ALTER TABLE listings 
ADD COLUMN IF NOT EXISTS subcategory TEXT,
ADD COLUMN IF NOT EXISTS slot_type TEXT,
ADD COLUMN IF NOT EXISTS video_standard TEXT,
ADD COLUMN IF NOT EXISTS video_input TEXT;

-- Add comments for documentation
COMMENT ON COLUMN listings.subcategory IS 'Subcategory: Parts(Видеокарти,Звукови карти,Лан карти,Други), Mice(COM/RS232,PS/2,USB), Keyboards(DIN5,PS/2,USB,SDL,Други), Computers(x86,Apple II,MAC,Atari,ZX Spectrum,Oric,Amiga,Други)';
COMMENT ON COLUMN listings.slot_type IS 'Slot type for parts: ISA, VLB, AGP, PCI, PCIe';
COMMENT ON COLUMN listings.video_standard IS 'Video standard for video cards: VGA, CGA, EGA, MDA, Hercules';
COMMENT ON COLUMN listings.video_input IS 'Video input for monitors: VGA, CGA, EGA, MDA, Hercules, Чинч, DVI, HDMI';

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_listings_subcategory ON listings(subcategory);
CREATE INDEX IF NOT EXISTS idx_listings_slot_type ON listings(slot_type);
CREATE INDEX IF NOT EXISTS idx_listings_video_standard ON listings(video_standard);
CREATE INDEX IF NOT EXISTS idx_listings_video_input ON listings(video_input);
