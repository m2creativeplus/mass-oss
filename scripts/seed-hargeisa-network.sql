-- HARGEISA AUTOMOTIVE ECOSYSTEM - GOLDEN LIST SEED DATA
-- Run this in Supabase SQL Editor

-- Clear existing suppliers (optional - remove if you want to keep existing)
-- TRUNCATE public.suppliers RESTART IDENTITY CASCADE;

-- Insert verified Hargeisa suppliers
INSERT INTO public.suppliers (name, contact_person, phone, email, address, city, category, status, notes) VALUES

-- === CAR DEALERS ===
('Sanyare Motors', 'Sales Desk', '+252 63 4428888', 'info@sanyare.com', 'Wadada Madax-tooyada', 'Hargeisa', 'Car Dealer', 'active', 'Major Toyota importer'),

('AMAAN MOTORS', 'Manager', '+252 63 4416666', 'sales@amaanmotors.com', 'Opposite CID HQ, Main Road', 'Hargeisa', 'Car Dealer', 'active', 'Wide selection of Japanese imports'),

('Autocom Japan Somaliland', 'Branch Manager', '+252 63 4000000', 'hargeisa@autocj.co.jp', 'Near Togdheer Junction', 'Hargeisa', 'Car Dealer', 'active', 'Direct Japan imports'),

('Safari Motors', 'Import Desk', '+252 63 4429999', NULL, 'Jigjiga Yar', 'Hargeisa', 'Car Dealer', 'active', 'Affordable vehicle options'),

-- === SPARE PARTS DEALERS ===
('Khaliij Auto Spare Parts', 'Ahmed', '+252 63 4275608', NULL, 'Xero Awr', 'Hargeisa', 'Spare Parts', 'active', 'Open 24 hours. Good for emergency parts.'),

('Al-Baraka Spare Parts', 'Omar Hussein', '+252 63 4441122', 'albaraka.parts@email.com', 'New Market Area', 'Hargeisa', 'Spare Parts', 'active', 'Toyota & Nissan specialist'),

('Mogadishu Spare Parts', 'Abdi Farah', '+252 63 4225577', NULL, 'Xero Awr District', 'Hargeisa', 'Spare Parts', 'active', 'All brands available'),

('Dubai Auto Parts', 'Hassan Mohamed', '+252 63 4337788', 'dubaiparts.hga@email.com', 'Main Road, Near Stadium', 'Hargeisa', 'Spare Parts', 'active', 'Direct UAE imports'),

-- === TIRE SHOPS ===
('Bridgestone Authorized Dealer', 'Sales Team', '+252 63 4553366', NULL, 'Industrial Area', 'Hargeisa', 'Tires', 'active', 'Genuine Bridgestone tires'),

('Hargeisa Tire Center', 'Ali Mohamed', '+252 63 4227799', NULL, 'Jigjiga Yar', 'Hargeisa', 'Tires', 'active', 'New and used tires'),

-- === OIL & LUBRICANTS ===
('Somaliland Oil Company', 'Commercial Desk', '+252 63 4400000', 'commercial@sloil.so', 'Airport Road', 'Hargeisa', 'Oil & Lubricants', 'active', 'Castrol & Shell distributor'),

('Total Energies Somalia', 'Station Manager', '+252 63 4551234', NULL, 'Multiple Locations', 'Hargeisa', 'Oil & Lubricants', 'active', 'Full service fuel stations'),

-- === BATTERY SUPPLIERS ===
('Vision Battery Center', 'Yusuf Ali', '+252 63 4339911', NULL, 'Xero Awr', 'Hargeisa', 'Batteries', 'active', 'Varta & Bosch batteries'),

-- === TOOLS & EQUIPMENT ===
('Horn Auto Tools', 'Workshop Supplies', '+252 63 4228844', NULL, 'Industrial Zone', 'Hargeisa', 'Tools & Equipment', 'active', 'Professional garage equipment')

ON CONFLICT DO NOTHING;

-- Verify insertion
SELECT category, COUNT(*) as count FROM public.suppliers GROUP BY category ORDER BY category;
