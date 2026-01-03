-- ============================================================================
-- MASS Car Workshop - Vehicle Seed Data (Operation INSTANT FLEET)
-- Run this in Supabase SQL Editor: Dashboard > SQL Editor > New Query
-- ============================================================================

-- 50 vehicles based on BE FORWARD imports to Somaliland
-- Distribution: 60% Toyota, 20% Honda, 10% Nissan, 10% Suzuki

INSERT INTO vehicles (make, model, year, vin, license_plate, color, mileage) VALUES
-- Toyota (30 vehicles - 60%)
('Toyota', 'Vitz', 2012, 'JTM1R2EV3GD123456', 'SL-49201-M', 'White', 98000),
('Toyota', 'Vitz', 2014, 'JTM1R2EV5HD234567', 'SL-51302-K', 'Silver', 76000),
('Toyota', 'Vitz', 2010, 'JTM1R2EV7FD345678', 'SL-38410-A', 'Black', 112000),
('Toyota', 'Probox', 2013, 'JTE7R2EV9DD456789', 'SL-62504-H', 'White', 89000),
('Toyota', 'Probox', 2015, 'JTE7R2EV1ED567890', 'SL-71605-N', 'Silver', 65000),
('Toyota', 'Probox', 2011, 'JTE7R2EV3CD678901', 'SL-45206-R', 'White', 104000),
('Toyota', 'Land Cruiser 79', 2017, 'JTM8R5EV5JD789012', 'SL-82307-T', 'White', 48000),
('Toyota', 'Land Cruiser 79', 2015, 'JTM8R5EV7GD890123', 'SL-93408-L', 'Beige', 72000),
('Toyota', 'Land Cruiser 79', 2019, 'JTM8R5EV9KD901234', 'SL-14509-B', 'Gray', 35000),
('Toyota', 'Land Cruiser Prado', 2016, 'JTM4R3EV1HD012345', 'SL-25610-F', 'White', 68000),
('Toyota', 'Land Cruiser Prado', 2018, 'JTM4R3EV3JD123456', 'SL-36711-P', 'Black', 42000),
('Toyota', 'Land Cruiser Prado', 2014, 'JTM4R3EV5FD234567', 'SL-47812-S', 'Pearl', 92000),
('Toyota', 'Hilux', 2018, 'JTM5R6EV7JD345678', 'SL-58913-W', 'White', 55000),
('Toyota', 'Hilux', 2016, 'JTM5R6EV9HD456789', 'SL-69014-C', 'Silver', 78000),
('Toyota', 'Hilux', 2020, 'JTM5R6EV1LD567890', 'SL-70115-G', 'Gray', 28000),
('Toyota', 'Hilux', 2019, 'JTM5R6EV3KD678901', 'SL-81216-J', 'White', 38000),
('Toyota', 'Harrier', 2017, 'JTM6R7EV5JD789012', 'SL-92317-D', 'Black', 52000),
('Toyota', 'Harrier', 2019, 'JTM6R7EV7KD890123', 'SL-03418-X', 'White', 32000),
('Toyota', 'Harrier', 2015, 'JTM6R7EV9GD901234', 'SL-14519-E', 'Silver', 84000),
('Toyota', 'Noah', 2014, 'JTM7R8EV1FD012345', 'SL-25620-V', 'White', 95000),
('Toyota', 'Noah', 2016, 'JTM7R8EV3HD123456', 'SL-36721-Q', 'Silver', 72000),
('Toyota', 'Corolla Axio', 2017, 'JTM9R1EV5JD234567', 'SL-47822-U', 'White', 58000),
('Toyota', 'Corolla Axio', 2015, 'JTM9R1EV7GD345678', 'SL-58923-I', 'Silver', 82000),
('Toyota', 'Corolla Axio', 2018, 'JTM9R1EV9KD456789', 'SL-69024-O', 'Black', 45000),
('Toyota', 'Succeed', 2014, 'JTE2R4EV1FD567890', 'SL-70125-Y', 'White', 98000),
('Toyota', 'Succeed', 2016, 'JTE2R4EV3HD678901', 'SL-81226-Z', 'Silver', 75000),
('Toyota', 'RAV4', 2018, 'JTM3R9EV5JD789012', 'SL-92327-A', 'White', 48000),
('Toyota', 'RAV4', 2020, 'JTM3R9EV7LD890123', 'SL-03428-B', 'Black', 25000),
('Toyota', 'RAV4', 2016, 'JTM3R9EV9HD901234', 'SL-14529-C', 'Silver', 68000),
('Toyota', 'Vitz', 2015, 'JTM1R2EV1GD012346', 'SL-25630-D', 'White', 82000),

-- Honda (10 vehicles - 20%)
('Honda', 'Fit', 2015, 'JHM2R5EV3GD123457', 'SL-36731-E', 'White', 78000),
('Honda', 'Fit', 2017, 'JHM2R5EV5JD234568', 'SL-47832-F', 'Silver', 55000),
('Honda', 'Fit', 2013, 'JHM2R5EV7ED345679', 'SL-58933-G', 'Blue', 98000),
('Honda', 'Vezel', 2016, 'JHM3R6EV9HD456780', 'SL-69034-H', 'Black', 62000),
('Honda', 'Vezel', 2018, 'JHM3R6EV1JD567891', 'SL-70135-I', 'White', 42000),
('Honda', 'Vezel', 2020, 'JHM3R6EV3LD678902', 'SL-81236-J', 'Silver', 28000),
('Honda', 'CR-V', 2017, 'JHM4R7EV5JD789013', 'SL-92337-K', 'White', 58000),
('Honda', 'CR-V', 2015, 'JHM4R7EV7GD890124', 'SL-03438-L', 'Black', 85000),
('Honda', 'Freed', 2016, 'JHM5R8EV9HD901235', 'SL-14539-M', 'White', 72000),
('Honda', 'Freed', 2014, 'JHM5R8EV1FD012346', 'SL-25640-N', 'Silver', 95000),

-- Nissan (5 vehicles - 10%)
('Nissan', 'Patrol', 2017, 'JN16R9EV3JD123458', 'SL-36741-O', 'White', 52000),
('Nissan', 'Patrol', 2019, 'JN16R9EV5KD234569', 'SL-47842-P', 'Black', 35000),
('Nissan', 'X-Trail', 2018, 'JN17R1EV7JD345670', 'SL-58943-Q', 'White', 48000),
('Nissan', 'Juke', 2016, 'JN18R2EV9HD456781', 'SL-69044-R', 'Red', 65000),
('Nissan', 'Note', 2017, 'JN19R3EV1JD567892', 'SL-70145-S', 'White', 58000),

-- Suzuki (5 vehicles - 10%)
('Suzuki', 'Escudo', 2016, 'JS32R4EV3HD678903', 'SL-81246-T', 'White', 72000),
('Suzuki', 'Escudo', 2018, 'JS32R4EV5JD789014', 'SL-92347-U', 'Silver', 48000),
('Suzuki', 'Swift', 2017, 'JS33R5EV7JD890125', 'SL-03448-V', 'Red', 55000),
('Suzuki', 'Jimny', 2019, 'JS34R6EV9KD901236', 'SL-14549-W', 'Green', 32000),
('Suzuki', 'Every', 2016, 'JS35R7EV1HD012347', 'SL-25650-X', 'White', 68000)
ON CONFLICT (vin) DO NOTHING;

-- Verify insertion
SELECT 
    make,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / 50, 1) as percentage
FROM vehicles 
GROUP BY make 
ORDER BY count DESC;

-- Show sample data
SELECT make, model, year, license_plate, color, mileage 
FROM vehicles 
ORDER BY make, year DESC 
LIMIT 20;
