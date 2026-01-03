/**
 * Unified Database Client
 * 
 * Uses Google Sheets as the backend via sheets-client.
 * This provides consistent data access for all components.
 */

import { sheetsDb, isSheetsConfigured, testSheetsConnection } from './sheets-client'

// Connection test that works with the Sheets backend
export async function testConnection(): Promise<{ 
  connected: boolean
  backend: 'sheets' | 'none'
  error?: string 
}> {
  if (isSheetsConfigured()) {
    const result = await testSheetsConnection()
    return { 
      ...result, 
      backend: result.connected ? 'sheets' : 'none' 
    }
  }
  
  return { 
    connected: false, 
    backend: 'none',
    error: 'No database configured. Set NEXT_PUBLIC_SHEETS_API_URL'
  }
}

// Type definitions for our data models
export interface Vehicle {
  id: string
  make: string
  model: string
  year: number
  vin: string
  license_plate: string
  color: string
  mileage: number
  price?: number
  status?: string
  created_at?: string
}

export interface Customer {
  id: string
  first_name: string
  last_name: string
  email?: string
  phone?: string
  address?: string
  city?: string
  created_at?: string
}

export interface WorkOrder {
  id: string
  vehicle_id: string
  customer_id: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  description: string
  technician?: string
  cost?: number
  started_at?: string
  completed_at?: string
}

// Convenience functions for common operations
export const database = {
  vehicles: {
    async getAll() {
      return sheetsDb.from<Vehicle>('Vehicles').select()
    },
    async getById(id: string) {
      return sheetsDb.from<Vehicle>('Vehicles').select().eq('id', id).single()
    },
    async create(vehicle: Partial<Vehicle>) {
      return sheetsDb.from<Vehicle>('Vehicles').insert(vehicle).select()
    },
    async update(id: string, updates: Partial<Vehicle>) {
      return sheetsDb.from<Vehicle>('Vehicles').update(updates).eq('id', id).select()
    }
  },
  customers: {
    async getAll() {
      return sheetsDb.from<Customer>('Customers').select()
    },
    async getById(id: string) {
      return sheetsDb.from<Customer>('Customers').select().eq('id', id).single()
    },
    async create(customer: Partial<Customer>) {
      return sheetsDb.from<Customer>('Customers').insert(customer).select()
    }
  },
  workOrders: {
    async getAll() {
      return sheetsDb.from<WorkOrder>('WorkOrders').select()
    },
    async getByStatus(status: WorkOrder['status']) {
      return sheetsDb.from<WorkOrder>('WorkOrders').select().eq('status', status)
    },
    async create(order: Partial<WorkOrder>) {
      return sheetsDb.from<WorkOrder>('WorkOrders').insert(order).select()
    },
    async updateStatus(id: string, status: WorkOrder['status']) {
      return sheetsDb.from<WorkOrder>('WorkOrders').update({ status }).eq('id', id).select()
    }
  }
}

export default database
