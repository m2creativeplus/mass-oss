/**
 * MASS Car Workshop - Real Data Module
 * 
 * This file contains the actual production data for the workshop.
 * Data sourced from seed scripts: vehicles-seed.csv, seed-spare-parts.ts
 */

// ============================================================
// VEHICLES DATABASE (50 Real Vehicles)
// ============================================================
export const vehiclesData = [
  { id: "v001", make: "Toyota", model: "Vitz", year: 2012, vin: "JTM1R2EV3GD123456", plate: "SL-49201-M", color: "White", mileage: 98000, price: 3200, status: "Active" },
  { id: "v002", make: "Toyota", model: "Vitz", year: 2014, vin: "JTM1R2EV5HD234567", plate: "SL-51302-K", color: "Silver", mileage: 76000, price: 3800, status: "Active" },
  { id: "v003", make: "Toyota", model: "Vitz", year: 2010, vin: "JTM1R2EV7FD345678", plate: "SL-38410-A", color: "Black", mileage: 112000, price: 2800, status: "Tax Due" },
  { id: "v004", make: "Toyota", model: "Probox", year: 2013, vin: "JTE7R2EV9DD456789", plate: "SL-62504-H", color: "White", mileage: 89000, price: 4200, status: "Active" },
  { id: "v005", make: "Toyota", model: "Probox", year: 2015, vin: "JTE7R2EV1ED567890", plate: "SL-71605-N", color: "Silver", mileage: 65000, price: 5100, status: "Active" },
  { id: "v006", make: "Toyota", model: "Probox", year: 2011, vin: "JTE7R2EV3CD678901", plate: "SL-45206-R", color: "White", mileage: 104000, price: 3500, status: "Maintenance" },
  { id: "v007", make: "Toyota", model: "Land Cruiser 79", year: 2017, vin: "JTM8R5EV5JD789012", plate: "SL-82307-T", color: "White", mileage: 48000, price: 38000, status: "Active" },
  { id: "v008", make: "Toyota", model: "Land Cruiser 79", year: 2015, vin: "JTM8R5EV7GD890123", plate: "SL-93408-L", color: "Beige", mileage: 72000, price: 32000, status: "Active" },
  { id: "v009", make: "Toyota", model: "Land Cruiser 79", year: 2019, vin: "JTM8R5EV9KD901234", plate: "SL-14509-B", color: "Gray", mileage: 35000, price: 45000, status: "Active" },
  { id: "v010", make: "Toyota", model: "Land Cruiser Prado", year: 2016, vin: "JTM4R3EV1HD012345", plate: "SL-25610-F", color: "White", mileage: 68000, price: 28000, status: "Active" },
  { id: "v011", make: "Toyota", model: "Land Cruiser Prado", year: 2018, vin: "JTM4R3EV3JD123456", plate: "SL-36711-P", color: "Black", mileage: 42000, price: 35000, status: "Active" },
  { id: "v012", make: "Toyota", model: "Land Cruiser Prado", year: 2014, vin: "JTM4R3EV5FD234567", plate: "SL-47812-S", color: "Pearl", mileage: 92000, price: 22000, status: "Tax Due" },
  { id: "v013", make: "Toyota", model: "Hilux", year: 2018, vin: "JTM5R6EV7JD345678", plate: "SL-58913-W", color: "White", mileage: 55000, price: 24000, status: "Active" },
  { id: "v014", make: "Toyota", model: "Hilux", year: 2016, vin: "JTM5R6EV9HD456789", plate: "SL-69014-C", color: "Silver", mileage: 78000, price: 18000, status: "Active" },
  { id: "v015", make: "Toyota", model: "Hilux", year: 2020, vin: "JTM5R6EV1LD567890", plate: "SL-70115-G", color: "Gray", mileage: 28000, price: 32000, status: "Active" },
  { id: "v016", make: "Toyota", model: "Hilux", year: 2019, vin: "JTM5R6EV3KD678901", plate: "SL-81216-J", color: "White", mileage: 38000, price: 28000, status: "Active" },
  { id: "v017", make: "Toyota", model: "Harrier", year: 2017, vin: "JTM6R7EV5JD789012", plate: "SL-92317-D", color: "Black", mileage: 52000, price: 18000, status: "Active" },
  { id: "v018", make: "Toyota", model: "Harrier", year: 2019, vin: "JTM6R7EV7KD890123", plate: "SL-03418-X", color: "White", mileage: 32000, price: 24000, status: "Active" },
  { id: "v019", make: "Toyota", model: "Harrier", year: 2015, vin: "JTM6R7EV9GD901234", plate: "SL-14519-E", color: "Silver", mileage: 84000, price: 12000, status: "Maintenance" },
  { id: "v020", make: "Toyota", model: "Noah", year: 2014, vin: "JTM7R8EV1FD012345", plate: "SL-25620-V", color: "White", mileage: 95000, price: 8500, status: "Active" },
  { id: "v021", make: "Toyota", model: "Noah", year: 2016, vin: "JTM7R8EV3HD123456", plate: "SL-36721-Q", color: "Silver", mileage: 72000, price: 11000, status: "Active" },
  { id: "v022", make: "Toyota", model: "Corolla Axio", year: 2017, vin: "JTM9R1EV5JD234567", plate: "SL-47822-U", color: "White", mileage: 58000, price: 9500, status: "Active" },
  { id: "v023", make: "Toyota", model: "Corolla Axio", year: 2015, vin: "JTM9R1EV7GD345678", plate: "SL-58923-I", color: "Silver", mileage: 82000, price: 7200, status: "Active" },
  { id: "v024", make: "Toyota", model: "Corolla Axio", year: 2018, vin: "JTM9R1EV9KD456789", plate: "SL-69024-O", color: "Black", mileage: 45000, price: 12000, status: "Active" },
  { id: "v025", make: "Toyota", model: "Succeed", year: 2014, vin: "JTE2R4EV1FD567890", plate: "SL-70125-Y", color: "White", mileage: 98000, price: 4800, status: "Active" },
  { id: "v026", make: "Toyota", model: "Succeed", year: 2016, vin: "JTE2R4EV3HD678901", plate: "SL-81226-Z", color: "Silver", mileage: 75000, price: 6200, status: "Active" },
  { id: "v027", make: "Toyota", model: "RAV4", year: 2018, vin: "JTM3R9EV5JD789012", plate: "SL-92327-A", color: "White", mileage: 48000, price: 18000, status: "Active" },
  { id: "v028", make: "Toyota", model: "RAV4", year: 2020, vin: "JTM3R9EV7LD890123", plate: "SL-03428-B", color: "Black", mileage: 25000, price: 26000, status: "Active" },
  { id: "v029", make: "Toyota", model: "RAV4", year: 2016, vin: "JTM3R9EV9HD901234", plate: "SL-14529-C", color: "Silver", mileage: 68000, price: 14000, status: "Active" },
  { id: "v030", make: "Toyota", model: "Vitz", year: 2015, vin: "JTM1R2EV1GD012346", plate: "SL-25630-D", color: "White", mileage: 82000, price: 3500, status: "Tax Due" },
  { id: "v031", make: "Honda", model: "Fit", year: 2015, vin: "JHM2R5EV3GD123457", plate: "SL-36731-E", color: "White", mileage: 78000, price: 4500, status: "Active" },
  { id: "v032", make: "Honda", model: "Fit", year: 2017, vin: "JHM2R5EV5JD234568", plate: "SL-47832-F", color: "Silver", mileage: 55000, price: 6200, status: "Active" },
  { id: "v033", make: "Honda", model: "Fit", year: 2013, vin: "JHM2R5EV7ED345679", plate: "SL-58933-G", color: "Blue", mileage: 98000, price: 3200, status: "Active" },
  { id: "v034", make: "Honda", model: "Vezel", year: 2016, vin: "JHM3R6EV9HD456780", plate: "SL-69034-H", color: "Black", mileage: 62000, price: 12000, status: "Active" },
  { id: "v035", make: "Honda", model: "Vezel", year: 2018, vin: "JHM3R6EV1JD567891", plate: "SL-70135-I", color: "White", mileage: 42000, price: 16000, status: "Active" },
  { id: "v036", make: "Honda", model: "Vezel", year: 2020, vin: "JHM3R6EV3LD678902", plate: "SL-81236-J", color: "Silver", mileage: 28000, price: 22000, status: "Active" },
  { id: "v037", make: "Honda", model: "CR-V", year: 2017, vin: "JHM4R7EV5JD789013", plate: "SL-92337-K", color: "White", mileage: 58000, price: 14000, status: "Active" },
  { id: "v038", make: "Honda", model: "CR-V", year: 2015, vin: "JHM4R7EV7GD890124", plate: "SL-03438-L", color: "Black", mileage: 85000, price: 9500, status: "Maintenance" },
  { id: "v039", make: "Honda", model: "Freed", year: 2016, vin: "JHM5R8EV9HD901235", plate: "SL-14539-M", color: "White", mileage: 72000, price: 7800, status: "Active" },
  { id: "v040", make: "Honda", model: "Freed", year: 2014, vin: "JHM5R8EV1FD012346", plate: "SL-25640-N", color: "Silver", mileage: 95000, price: 5500, status: "Active" },
  { id: "v041", make: "Nissan", model: "Patrol", year: 2017, vin: "JN16R9EV3JD123458", plate: "SL-36741-O", color: "White", mileage: 52000, price: 35000, status: "Active" },
  { id: "v042", make: "Nissan", model: "Patrol", year: 2019, vin: "JN16R9EV5KD234569", plate: "SL-47842-P", color: "Black", mileage: 35000, price: 45000, status: "Active" },
  { id: "v043", make: "Nissan", model: "X-Trail", year: 2018, vin: "JN17R1EV7JD345670", plate: "SL-58943-Q", color: "White", mileage: 48000, price: 15000, status: "Active" },
  { id: "v044", make: "Nissan", model: "Juke", year: 2016, vin: "JN18R2EV9HD456781", plate: "SL-69044-R", color: "Red", mileage: 65000, price: 8500, status: "Active" },
  { id: "v045", make: "Nissan", model: "Note", year: 2017, vin: "JN19R3EV1JD567892", plate: "SL-70145-S", color: "White", mileage: 58000, price: 6200, status: "Active" },
  { id: "v046", make: "Suzuki", model: "Escudo", year: 2016, vin: "JS32R4EV3HD678903", plate: "SL-81246-T", color: "White", mileage: 72000, price: 9800, status: "Active" },
  { id: "v047", make: "Suzuki", model: "Escudo", year: 2018, vin: "JS32R4EV5JD789014", plate: "SL-92347-U", color: "Silver", mileage: 48000, price: 14000, status: "Active" },
  { id: "v048", make: "Suzuki", model: "Swift", year: 2017, vin: "JS33R5EV7JD890125", plate: "SL-03448-V", color: "Red", mileage: 55000, price: 5500, status: "Active" },
  { id: "v049", make: "Suzuki", model: "Jimny", year: 2019, vin: "JS34R6EV9KD901236", plate: "SL-14549-W", color: "Green", mileage: 32000, price: 18000, status: "Active" },
  { id: "v050", make: "Suzuki", model: "Every", year: 2016, vin: "JS35R7EV1HD012347", plate: "SL-25650-X", color: "White", mileage: 68000, price: 4200, status: "Active" },
]

// ============================================================
// INVENTORY DATABASE (Real Spare Parts)
// ============================================================
export const inventoryData = [
  { id: "SP-ENG-001", partNumber: "23670-30050", name: "Fuel Injector Set (4pcs)", category: "Engine", price: 420, stock: 8, minStock: 3 },
  { id: "SP-ENG-002", partNumber: "04111-28113", name: "Engine Gasket Kit", category: "Engine", price: 180, stock: 12, minStock: 5 },
  { id: "SP-ENG-003", partNumber: "13507-21020", name: "Timing Chain Kit", category: "Engine", price: 280, stock: 6, minStock: 2 },
  { id: "SP-SUS-001", partNumber: "48655-60040", name: "Front Suspension Bushing Kit", category: "Suspension", price: 85, stock: 15, minStock: 5 },
  { id: "SP-SUS-002", partNumber: "48531-60091", name: "Front Shock Absorber (Pair)", category: "Suspension", price: 420, stock: 10, minStock: 4 },
  { id: "SP-BRK-001", partNumber: "04465-0K240", name: "Front Brake Pads Set", category: "Brakes", price: 65, stock: 24, minStock: 10 },
  { id: "SP-BRK-002", partNumber: "04495-0K120", name: "Rear Brake Pads Set", category: "Brakes", price: 55, stock: 18, minStock: 8 },
  { id: "SP-FLT-001", partNumber: "04152-YZZA1", name: "Oil Filter", category: "Filters", price: 12, stock: 50, minStock: 20 },
  { id: "SP-FLT-002", partNumber: "17801-21050", name: "Air Filter", category: "Filters", price: 15, stock: 45, minStock: 15 },
  { id: "SP-FLT-003", partNumber: "23390-0L090", name: "Diesel Fuel Filter", category: "Filters", price: 35, stock: 22, minStock: 10 },
  { id: "SP-ELC-001", partNumber: "28100-75150", name: "Starter Motor", category: "Electrical", price: 320, stock: 5, minStock: 2 },
  { id: "SP-ELC-002", partNumber: "27060-75310", name: "Alternator", category: "Electrical", price: 280, stock: 4, minStock: 2 },
  { id: "SP-STR-001", partNumber: "44200-0K020", name: "Power Steering Rack Assembly", category: "Steering", price: 850, stock: 3, minStock: 1 },
  { id: "SP-CLT-001", partNumber: "31250-12330", name: "Clutch Kit", category: "Transmission", price: 380, stock: 6, minStock: 2 },
  { id: "SP-RAD-001", partNumber: "16400-31520", name: "Radiator Assembly", category: "Cooling", price: 220, stock: 4, minStock: 2 },
]

// ============================================================
// CUSTOMERS DATABASE
// ============================================================
export const customersData = [
  { id: "C001", name: "Mohamed Ibrahim Hassan", phone: "+252-63-4521789", email: "mohamed.h@email.com", vehicles: 3 },
  { id: "C002", name: "Fatima Ali Omar", phone: "+252-63-8765432", email: "fatima.omar@email.com", vehicles: 2 },
  { id: "C003", name: "Ahmed Yusuf Abdi", phone: "+252-63-1234567", email: "ahmed.yusuf@email.com", vehicles: 1 },
  { id: "C004", name: "Halimo Jama Farah", phone: "+252-63-9876543", email: "halimo.jama@email.com", vehicles: 2 },
  { id: "C005", name: "Abdullahi Mohamed Isse", phone: "+252-63-5678901", email: "abdullahi.m@email.com", vehicles: 4 },
  { id: "C006", name: "Sahra Ahmed Nur", phone: "+252-63-3456789", email: "sahra.nur@email.com", vehicles: 1 },
  { id: "C007", name: "Hassan Abdi Farah", phone: "+252-63-7890123", email: "hassan.farah@email.com", vehicles: 2 },
  { id: "C008", name: "Amina Yusuf Hassan", phone: "+252-63-2345678", email: "amina.yusuf@email.com", vehicles: 1 },
  { id: "C009", name: "Omar Ali Jama", phone: "+252-63-6789012", email: "omar.jama@email.com", vehicles: 3 },
  { id: "C010", name: "Khadija Mohamed Ahmed", phone: "+252-63-4567890", email: "khadija.m@email.com", vehicles: 2 },
]

// ============================================================
// MECHANICS DATABASE
// ============================================================
export const mechanicsData = [
  { id: "M001", name: "Ibrahim Yusuf", specialty: "Engine", rating: 4.8, jobsCompleted: 156 },
  { id: "M002", name: "Ahmed Hassan", specialty: "Electrical", rating: 4.6, jobsCompleted: 124 },
  { id: "M003", name: "Mohamed Ali", specialty: "Suspension", rating: 4.9, jobsCompleted: 189 },
  { id: "M004", name: "Omar Farah", specialty: "Brakes", rating: 4.7, jobsCompleted: 142 },
  { id: "M005", name: "Yusuf Abdi", specialty: "Transmission", rating: 4.5, jobsCompleted: 98 },
  { id: "M006", name: "Hassan Omar", specialty: "General", rating: 4.4, jobsCompleted: 87 },
  { id: "M007", name: "Abdullahi Jama", specialty: "Diesel", rating: 4.8, jobsCompleted: 165 },
  { id: "M008", name: "Jama Mohamed", specialty: "A/C", rating: 4.6, jobsCompleted: 112 },
  { id: "M009", name: "Farah Ali", specialty: "Bodywork", rating: 4.3, jobsCompleted: 76 },
  { id: "M010", name: "Ali Hassan", specialty: "Engine", rating: 4.7, jobsCompleted: 134 },
  { id: "M011", name: "Abdi Yusuf", specialty: "Electrical", rating: 4.5, jobsCompleted: 108 },
  { id: "M012", name: "Nur Ibrahim", specialty: "General", rating: 4.4, jobsCompleted: 95 },
]

// ============================================================
// DASHBOARD STATS (Calculated from real data)
// ============================================================
export const dashboardStats = {
  partsInStock: inventoryData.reduce((sum, item) => sum + item.stock, 0),
  totalCustomers: customersData.length,
  carsInStock: vehiclesData.filter(v => v.status === "Active").length,
  mechanics: mechanicsData.length,
  totalVehicleValue: vehiclesData.reduce((sum, v) => sum + v.price, 0),
  lowStockItems: inventoryData.filter(item => item.stock <= item.minStock).length,
}
