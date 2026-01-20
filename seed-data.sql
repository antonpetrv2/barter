-- Seed Data for BARTER Application
-- This file contains sample data for testing

-- Insert test users (optional - if you want to create specific users)
-- Note: Use the Supabase Auth panel to create users as this requires proper password hashing

-- Insert sample listings
INSERT INTO listings (user_id, title, description, category, price, location, condition, year, working, views, created_at, updated_at)
VALUES
    ('00000000-0000-0000-0000-000000000001', 'Commodore 64 - Classic Computer', 'Original Commodore 64 from 1982 in excellent working condition. Includes power supply, RF cable, and original joystick. All keys are responsive and responsive.', 'Компютри', 'за разговор', 'София, България', 'Отлично', 1982, true, 234, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000001', 'Amiga 500 with Extras', 'Working Amiga 500 from 1987. Comes with 1084S monitor, extra floppy drive, and original documentation. Machine has been tested and runs great.', 'Компютри', 'за разговор', 'Пловдив, България', 'Много добро', 1987, true, 156, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000002', 'IBM PC XT Clone', 'Classic 80XT compatible computer. Original IBM documentation included. Powers on and runs DOS 5.0. Perfect for retro enthusiasts and historians.', 'Компютри', 'за разговор', 'Варна, България', 'Добро', 1983, true, 89, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000002', 'Mechanical Keyboard - Cherry MX', 'Vintage German mechanical keyboard from 1990. Clicky switches in excellent condition. Perfect for any retro computing setup.', 'Клавиатури', 'за разговор', 'Бургас, България', 'Отлично', 1990, true, 123, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000003', 'CRT Monitor - 17 inch', 'Beautiful 17-inch CRT monitor with perfect color accuracy. Ideal for retro computing and gaming. Tested and working perfectly.', 'Монитори', 'за разговор', 'Велико Търново, България', 'Много добро', 1998, true, 198, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000003', 'Logitech Mouse - Vintage', 'Rare vintage Logitech mouse from the 1980s. Mechanical design, fully functional. Great addition to any retro collection.', 'Мишки', 'за разговор', 'Плевен, България', 'Добро', 1986, true, 67, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000001', 'Floppy Disk Drives - Lot of 3', 'Three working 3.5-inch floppy drives from different era. Tested and verified. Great for retro computer enthusiasts.', 'Части', 'за разговор', 'София, България', 'Добро', 1995, true, 45, NOW(), NOW()),
    ('00000000-0000-0000-0000-000000000002', 'Vintage Computer Manuals Collection', 'Original manuals and documentation for various computers. Includes Commodore, Amiga, and IBM documentation. Excellent reference materials.', 'Периферия', 'за разговор', 'Пловдив, България', 'Отлично', 2000, false, 89, NOW(), NOW());

-- Note: Replace '00000000-0000-0000-0000-000000000001' with actual user IDs from your Supabase Auth users
-- You can find user IDs by navigating to Authentication > Users in your Supabase dashboard
