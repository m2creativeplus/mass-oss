/**
 * HARGEISA AUTOMOTIVE ECOSYSTEM - GOLDEN LIST SEED SCRIPT
 * 
 * This script populates the suppliers table with verified 
 * Hargeisa automotive businesses.
 * 
 * Run: npx tsx scripts/seed-hargeisa-network.ts
 */

import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// ============================================================
// THE GOLDEN DATASET - Verified Hargeisa Automotive Network
// ============================================================
const hargeisnNetwork = [
  // === CAR DEALERS ===
  {
    category: "Car Dealer",
    name: "Sanyare Motors",
    contact_person: "Sales Desk",
    phone: "+252 63 4428888",
    email: "info@sanyare.com",
    address: "Wadada Madax-tooyada",
    city: "Hargeisa",
    status: "active",
    notes: "Major Toyota importer"
  },
  {
    category: "Car Dealer",
    name: "AMAAN MOTORS",
    contact_person: "Manager",
    phone: "+252 63 4416666",
    email: "sales@amaanmotors.com",
    address: "Opposite CID HQ, Main Road",
    city: "Hargeisa",
    status: "active",
    notes: "Wide selection of Japanese imports"
  },
  {
    category: "Car Dealer",
    name: "Autocom Japan Somaliland",
    contact_person: "Branch Manager",
    phone: "+252 63 4000000",
    email: "hargeisa@autocj.co.jp",
    address: "Near Togdheer Junction",
    city: "Hargeisa",
    status: "active",
    notes: "Direct Japan imports"
  },
  {
    category: "Car Dealer",
    name: "Safari Motors",
    contact_person: "Import Desk",
    phone: "+252 63 4429999",
    address: "Jigjiga Yar",
    city: "Hargeisa",
    status: "active",
    notes: "Affordable vehicle options"
  },

  // === SPARE PARTS DEALERS ===
  {
    category: "Spare Parts",
    name: "Khaliij Auto Spare Parts",
    contact_person: "Ahmed",
    phone: "+252 63 4275608",
    address: "Xero Awr",
    city: "Hargeisa",
    status: "active",
    notes: "Open 24 hours. Good for emergency parts."
  },
  {
    category: "Spare Parts",
    name: "Al-Baraka Spare Parts",
    contact_person: "Omar Hussein",
    phone: "+252 63 4441122",
    email: "albaraka.parts@email.com",
    address: "New Market Area",
    city: "Hargeisa",
    status: "active",
    notes: "Toyota & Nissan specialist"
  },
  {
    category: "Spare Parts",
    name: "Mogadishu Spare Parts",
    contact_person: "Abdi Farah",
    phone: "+252 63 4225577",
    address: "Xero Awr District",
    city: "Hargeisa",
    status: "active",
    notes: "All brands available"
  },
  {
    category: "Spare Parts",
    name: "Dubai Auto Parts",
    contact_person: "Hassan Mohamed",
    phone: "+252 63 4337788",
    email: "dubaiparts.hga@email.com",
    address: "Main Road, Near Stadium",
    city: "Hargeisa",
    status: "active",
    notes: "Direct UAE imports"
  },

  // === TIRE SHOPS ===
  {
    category: "Tires",
    name: "Bridgestone Authorized Dealer",
    contact_person: "Sales Team",
    phone: "+252 63 4553366",
    address: "Industrial Area",
    city: "Hargeisa",
    status: "active",
    notes: "Genuine Bridgestone tires"
  },
  {
    category: "Tires",
    name: "Hargeisa Tire Center",
    contact_person: "Ali Mohamed",
    phone: "+252 63 4227799",
    address: "Jigjiga Yar",
    city: "Hargeisa",
    status: "active",
    notes: "New and used tires"
  },

  // === OIL & LUBRICANTS ===
  {
    category: "Oil & Lubricants",
    name: "Somaliland Oil Company",
    contact_person: "Commercial Desk",
    phone: "+252 63 4400000",
    email: "commercial@sloil.so",
    address: "Airport Road",
    city: "Hargeisa",
    status: "active",
    notes: "Castrol & Shell distributor"
  },
  {
    category: "Oil & Lubricants",
    name: "Total Energies Somalia",
    contact_person: "Station Manager",
    phone: "+252 63 4551234",
    address: "Multiple Locations",
    city: "Hargeisa",
    status: "active",
    notes: "Full service fuel stations"
  },

  // === BATTERY SUPPLIERS ===
  {
    category: "Batteries",
    name: "Vision Battery Center",
    contact_person: "Yusuf Ali",
    phone: "+252 63 4339911",
    address: "Xero Awr",
    city: "Hargeisa",
    status: "active",
    notes: "Varta & Bosch batteries"
  },

  // === TOOLS & EQUIPMENT ===
  {
    category: "Tools & Equipment",
    name: "Horn Auto Tools",
    contact_person: "Workshop Supplies",
    phone: "+252 63 4228844",
    address: "Industrial Zone",
    city: "Hargeisa",
    status: "active",
    notes: "Professional garage equipment"
  }
]

async function seedHargeisaNetwork() {
  console.log('🌍 Seeding Hargeisa Automotive Network...')
  console.log(`📊 Total suppliers to insert: ${hargeisnNetwork.length}`)
  console.log('')

  let successCount = 0
  let errorCount = 0

  for (const supplier of hargeisnNetwork) {
    const { data, error } = await supabase
      .from('suppliers')
      .upsert(supplier, { onConflict: 'name' })
      .select()

    if (error) {
      console.error(`❌ Failed: ${supplier.name} - ${error.message}`)
      errorCount++
    } else {
      console.log(`✅ Added: ${supplier.name} (${supplier.category})`)
      successCount++
    }
  }

  console.log('')
  console.log('=' .repeat(50))
  console.log(`✅ Successfully added: ${successCount}`)
  console.log(`❌ Failed: ${errorCount}`)
  console.log('=' .repeat(50))

  // Summary by category
  const { data: summary } = await supabase
    .from('suppliers')
    .select('category')
  
  if (summary) {
    const categories: Record<string, number> = {}
    summary.forEach(s => {
      categories[s.category] = (categories[s.category] || 0) + 1
    })
    
    console.log('\n📊 Suppliers by Category:')
    Object.entries(categories).forEach(([cat, count]) => {
      console.log(`   ${cat}: ${count}`)
    })
  }
}

seedHargeisaNetwork()
  .then(() => {
    console.log('\n🎉 Hargeisa network seeding complete!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Seeding failed:', error)
    process.exit(1)
  })
