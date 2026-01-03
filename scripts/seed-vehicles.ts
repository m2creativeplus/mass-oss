
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import path from 'path'

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Error: Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const vehicles = [
  // Toyota (60%)
  { make: 'Toyota', model: 'Vitz', year: 2012, vin: 'JTM1R2EV3GD123456', license_plate: 'SL-49201-M', color: 'White', mileage: 98000 },
  { make: 'Toyota', model: 'Vitz', year: 2014, vin: 'JTM1R2EV5HD234567', license_plate: 'SL-51302-K', color: 'Silver', mileage: 76000 },
  { make: 'Toyota', model: 'Vitz', year: 2010, vin: 'JTM1R2EV7FD345678', 'license_plate': 'SL-38410-A', color: 'Black', mileage: 112000 },
  { make: 'Toyota', model: 'Probox', year: 2013, vin: 'JTE7R2EV9DD456789', license_plate: 'SL-62504-H', color: 'White', mileage: 89000 },
  { make: 'Toyota', model: 'Probox', year: 2015, vin: 'JTE7R2EV1ED567890', license_plate: 'SL-71605-N', color: 'Silver', mileage: 65000 },
  { make: 'Toyota', model: 'Probox', year: 2011, vin: 'JTE7R2EV3CD678901', license_plate: 'SL-45206-R', color: 'White', mileage: 104000 },
  { make: 'Toyota', model: 'Land Cruiser 79', year: 2017, vin: 'JTM8R5EV5JD789012', license_plate: 'SL-82307-T', color: 'White', mileage: 48000 },
  { make: 'Toyota', model: 'Land Cruiser 79', year: 2015, vin: 'JTM8R5EV7GD890123', license_plate: 'SL-93408-L', color: 'Beige', mileage: 72000 },
  { make: 'Toyota', model: 'Land Cruiser 79', year: 2019, vin: 'JTM8R5EV9KD901234', license_plate: 'SL-14509-B', color: 'Gray', mileage: 35000 },
  { make: 'Toyota', model: 'Land Cruiser Prado', year: 2016, vin: 'JTM4R3EV1HD012345', license_plate: 'SL-25610-F', color: 'White', mileage: 68000 },
  { make: 'Toyota', model: 'Land Cruiser Prado', year: 2018, vin: 'JTM4R3EV3JD123456', license_plate: 'SL-36711-P', color: 'Black', mileage: 42000 },
  { make: 'Toyota', model: 'Land Cruiser Prado', year: 2014, vin: 'JTM4R3EV5FD234567', license_plate: 'SL-47812-S', color: 'Pearl', mileage: 92000 },
  { make: 'Toyota', model: 'Hilux', year: 2018, vin: 'JTM5R6EV7JD345678', license_plate: 'SL-58913-W', color: 'White', mileage: 55000 },
  { make: 'Toyota', model: 'Hilux', year: 2016, vin: 'JTM5R6EV9HD456789', license_plate: 'SL-69014-C', color: 'Silver', mileage: 78000 },
  { make: 'Toyota', model: 'Hilux', year: 2020, vin: 'JTM5R6EV1LD567890', license_plate: 'SL-70115-G', color: 'Gray', mileage: 28000 },
  { make: 'Toyota', model: 'Hilux', year: 2019, vin: 'JTM5R6EV3KD678901', license_plate: 'SL-81216-J', color: 'White', mileage: 38000 },
  { make: 'Toyota', model: 'Harrier', year: 2017, vin: 'JTM6R7EV5JD789012', license_plate: 'SL-92317-D', color: 'Black', mileage: 52000 },
  { make: 'Toyota', model: 'Harrier', year: 2019, vin: 'JTM6R7EV7KD890123', license_plate: 'SL-03418-X', color: 'White', mileage: 32000 },
  { make: 'Toyota', model: 'Harrier', year: 2015, vin: 'JTM6R7EV9GD901234', license_plate: 'SL-14519-E', color: 'Silver', mileage: 84000 },
  { make: 'Toyota', model: 'Noah', year: 2014, vin: 'JTM7R8EV1FD012345', license_plate: 'SL-25620-V', color: 'White', mileage: 95000 },
  { make: 'Toyota', model: 'Noah', year: 2016, vin: 'JTM7R8EV3HD123456', license_plate: 'SL-36721-Q', color: 'Silver', mileage: 72000 },
  { make: 'Toyota', model: 'Corolla Axio', year: 2017, vin: 'JTM9R1EV5JD234567', license_plate: 'SL-47822-U', color: 'White', mileage: 58000 },
  { make: 'Toyota', model: 'Corolla Axio', year: 2015, vin: 'JTM9R1EV7GD345678', license_plate: 'SL-58923-I', color: 'Silver', mileage: 82000 },
  { make: 'Toyota', model: 'Corolla Axio', year: 2018, vin: 'JTM9R1EV9KD456789', license_plate: 'SL-69024-O', color: 'Black', mileage: 45000 },
  { make: 'Toyota', model: 'Succeed', year: 2014, vin: 'JTE2R4EV1FD567890', license_plate: 'SL-70125-Y', color: 'White', mileage: 98000 },
  { make: 'Toyota', model: 'Succeed', year: 2016, vin: 'JTE2R4EV3HD678901', license_plate: 'SL-81226-Z', color: 'Silver', mileage: 75000 },
  { make: 'Toyota', model: 'RAV4', year: 2018, vin: 'JTM3R9EV5JD789012', license_plate: 'SL-92327-A', color: 'White', mileage: 48000 },
  { make: 'Toyota', model: 'RAV4', year: 2020, vin: 'JTM3R9EV7LD890123', license_plate: 'SL-03428-B', color: 'Black', mileage: 25000 },
  { make: 'Toyota', model: 'RAV4', year: 2016, vin: 'JTM3R9EV9HD901234', license_plate: 'SL-14529-C', color: 'Silver', mileage: 68000 },
  { make: 'Toyota', model: 'Vitz', year: 2015, vin: 'JTM1R2EV1GD012346', license_plate: 'SL-25630-D', color: 'White', mileage: 82000 },

  // Honda (20%)
  { make: 'Honda', model: 'Fit', year: 2015, vin: 'JHM2R5EV3GD123457', license_plate: 'SL-36731-E', color: 'White', mileage: 78000 },
  { make: 'Honda', model: 'Fit', year: 2017, vin: 'JHM2R5EV5JD234568', license_plate: 'SL-47832-F', color: 'Silver', mileage: 55000 },
  { make: 'Honda', model: 'Fit', year: 2013, vin: 'JHM2R5EV7ED345679', license_plate: 'SL-58933-G', color: 'Blue', mileage: 98000 },
  { make: 'Honda', model: 'Vezel', year: 2016, vin: 'JHM3R6EV9HD456780', license_plate: 'SL-69034-H', color: 'Black', mileage: 62000 },
  { make: 'Honda', model: 'Vezel', year: 2018, vin: 'JHM3R6EV1JD567891', license_plate: 'SL-70135-I', color: 'White', mileage: 42000 },
  { make: 'Honda', model: 'Vezel', year: 2020, vin: 'JHM3R6EV3LD678902', license_plate: 'SL-81236-J', color: 'Silver', mileage: 28000 },
  { make: 'Honda', model: 'CR-V', year: 2017, vin: 'JHM4R7EV5JD789013', license_plate: 'SL-92337-K', color: 'White', mileage: 58000 },
  { make: 'Honda', model: 'CR-V', year: 2015, vin: 'JHM4R7EV7GD890124', license_plate: 'SL-03438-L', color: 'Black', mileage: 85000 },
  { make: 'Honda', model: 'Freed', year: 2016, vin: 'JHM5R8EV9HD901235', license_plate: 'SL-14539-M', color: 'White', mileage: 72000 },
  { make: 'Honda', model: 'Freed', year: 2014, vin: 'JHM5R8EV1FD012346', license_plate: 'SL-25640-N', color: 'Silver', mileage: 95000 },

  // Nissan (10%)
  { make: 'Nissan', model: 'Patrol', year: 2017, vin: 'JN16R9EV3JD123458', license_plate: 'SL-36741-O', color: 'White', mileage: 52000 },
  { make: 'Nissan', model: 'Patrol', year: 2019, vin: 'JN16R9EV5KD234569', license_plate: 'SL-47842-P', color: 'Black', mileage: 35000 },
  { make: 'Nissan', model: 'X-Trail', year: 2018, vin: 'JN17R1EV7JD345670', license_plate: 'SL-58943-Q', color: 'White', mileage: 48000 },
  { make: 'Nissan', model: 'Juke', year: 2016, vin: 'JN18R2EV9HD456781', license_plate: 'SL-69044-R', color: 'Red', mileage: 65000 },
  { make: 'Nissan', model: 'Note', year: 2017, vin: 'JN19R3EV1JD567892', license_plate: 'SL-70145-S', color: 'White', mileage: 58000 },

  // Suzuki (10%)
  { make: 'Suzuki', model: 'Escudo', year: 2016, vin: 'JS32R4EV3HD678903', license_plate: 'SL-81246-T', color: 'White', mileage: 72000 },
  { make: 'Suzuki', model: 'Escudo', year: 2018, vin: 'JS32R4EV5JD789014', license_plate: 'SL-92347-U', color: 'Silver', mileage: 48000 },
  { make: 'Suzuki', model: 'Swift', year: 2017, vin: 'JS33R5EV7JD890125', license_plate: 'SL-03448-V', color: 'Red', mileage: 55000 },
  { make: 'Suzuki', model: 'Jimny', year: 2019, vin: 'JS34R6EV9KD901236', license_plate: 'SL-14549-W', color: 'Green', mileage: 32000 },
  { make: 'Suzuki', model: 'Every', year: 2016, vin: 'JS35R7EV1HD012347', license_plate: 'SL-25650-X', color: 'White', mileage: 68000 }
]

async function seedVehicles() {
  console.log('🚗 Starting Operation INSTANT FLEET...')
  console.log(`📋 Preparing to seed ${vehicles.length} vehicles...`)

  let successCount = 0
  let failCount = 0

  for (const vehicle of vehicles) {
    const { error } = await supabase
      .from('vehicles')
      .upsert(vehicle, { onConflict: 'vin' })
    
    if (error) {
      console.error(`❌ Failed to add ${vehicle.make} ${vehicle.model} (${vehicle.license_plate}):`, error.message)
      failCount++
    } else {
      console.log(`✅ Added ${vehicle.make} ${vehicle.model} - ${vehicle.license_plate}`)
      successCount++
    }
  }

  console.log('\n=============================================')
  console.log(`🏁 Operation Complete`)
  console.log(`✅ Successfully seeded: ${successCount}`)
  console.log(`❌ Failed: ${failCount}`)
  console.log('=============================================')
}

seedVehicles().catch(console.error)
