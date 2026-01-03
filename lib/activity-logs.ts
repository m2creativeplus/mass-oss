/**
 * MASS Car Workshop - Activity Logs (Audit Trail)
 * 
 * Track all user actions for security and accountability
 */

export type ActivityAction = 
  | 'login'
  | 'logout'
  | 'create'
  | 'update'
  | 'delete'
  | 'view'
  | 'export'
  | 'payment'
  | 'print'
  | 'send_notification'
  | 'status_change'

export type ActivityModule = 
  | 'auth'
  | 'dashboard'
  | 'customers'
  | 'vehicles'
  | 'appointments'
  | 'work_orders'
  | 'inventory'
  | 'pos'
  | 'invoices'
  | 'delivery'
  | 'reminders'
  | 'reports'
  | 'settings'

export interface ActivityLog {
  id: string
  timestamp: string
  userId: string
  userName: string
  userRole: string
  action: ActivityAction
  module: ActivityModule
  description: string
  metadata?: Record<string, unknown>
  ipAddress?: string
  userAgent?: string
}

// In-memory log store (would be replaced by Convex in production)
const activityLogs: ActivityLog[] = []

// Generate unique ID
function generateId(): string {
  return `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

// Get client info
function getClientInfo(): { ipAddress?: string; userAgent?: string } {
  if (typeof window === 'undefined') return {}
  return {
    userAgent: navigator.userAgent,
  }
}

// Log an activity
export function logActivity(
  userId: string,
  userName: string,
  userRole: string,
  action: ActivityAction,
  module: ActivityModule,
  description: string,
  metadata?: Record<string, unknown>
): ActivityLog {
  const log: ActivityLog = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    userId,
    userName,
    userRole,
    action,
    module,
    description,
    metadata,
    ...getClientInfo(),
  }
  
  activityLogs.unshift(log) // Add to beginning
  
  // Keep only last 10,000 logs in memory
  if (activityLogs.length > 10000) {
    activityLogs.pop()
  }
  
  // Console log for development
  console.log(`[AUDIT] ${log.timestamp} | ${userName} (${userRole}) | ${action} | ${module} | ${description}`)
  
  return log
}

// Get recent logs
export function getRecentLogs(limit: number = 100): ActivityLog[] {
  return activityLogs.slice(0, limit)
}

// Get logs by user
export function getLogsByUser(userId: string, limit: number = 100): ActivityLog[] {
  return activityLogs.filter(log => log.userId === userId).slice(0, limit)
}

// Get logs by module
export function getLogsByModule(module: ActivityModule, limit: number = 100): ActivityLog[] {
  return activityLogs.filter(log => log.module === module).slice(0, limit)
}

// Get logs by action
export function getLogsByAction(action: ActivityAction, limit: number = 100): ActivityLog[] {
  return activityLogs.filter(log => log.action === action).slice(0, limit)
}

// Get logs by date range
export function getLogsByDateRange(startDate: Date, endDate: Date): ActivityLog[] {
  return activityLogs.filter(log => {
    const logDate = new Date(log.timestamp)
    return logDate >= startDate && logDate <= endDate
  })
}

// Search logs
export function searchLogs(query: string): ActivityLog[] {
  const lowerQuery = query.toLowerCase()
  return activityLogs.filter(log =>
    log.description.toLowerCase().includes(lowerQuery) ||
    log.userName.toLowerCase().includes(lowerQuery) ||
    log.module.toLowerCase().includes(lowerQuery)
  )
}

// Export logs to CSV
export function exportLogsToCSV(logs: ActivityLog[]): string {
  const headers = ['Timestamp', 'User', 'Role', 'Action', 'Module', 'Description']
  const rows = logs.map(log => [
    log.timestamp,
    log.userName,
    log.userRole,
    log.action,
    log.module,
    `"${log.description.replace(/"/g, '""')}"`
  ])
  
  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n')
}

// Convenience logging functions
export const AuditLog = {
  login: (userId: string, userName: string, userRole: string) =>
    logActivity(userId, userName, userRole, 'login', 'auth', `User logged in`),
  
  logout: (userId: string, userName: string, userRole: string) =>
    logActivity(userId, userName, userRole, 'logout', 'auth', `User logged out`),
  
  createWorkOrder: (userId: string, userName: string, userRole: string, workOrderId: string, vehiclePlate: string) =>
    logActivity(userId, userName, userRole, 'create', 'work_orders', 
      `Created work order #${workOrderId} for vehicle ${vehiclePlate}`,
      { workOrderId, vehiclePlate }),
  
  updateWorkOrderStatus: (userId: string, userName: string, userRole: string, workOrderId: string, oldStatus: string, newStatus: string) =>
    logActivity(userId, userName, userRole, 'status_change', 'work_orders',
      `Changed work order #${workOrderId} status: ${oldStatus} → ${newStatus}`,
      { workOrderId, oldStatus, newStatus }),
  
  processPayment: (userId: string, userName: string, userRole: string, invoiceId: string, amount: number, method: string) =>
    logActivity(userId, userName, userRole, 'payment', 'pos',
      `Processed ${method} payment of $${amount} for invoice #${invoiceId}`,
      { invoiceId, amount, method }),
  
  addInventory: (userId: string, userName: string, userRole: string, partName: string, quantity: number) =>
    logActivity(userId, userName, userRole, 'update', 'inventory',
      `Added ${quantity}x ${partName} to inventory`,
      { partName, quantity }),
  
  deleteRecord: (userId: string, userName: string, userRole: string, module: ActivityModule, recordId: string, recordName: string) =>
    logActivity(userId, userName, userRole, 'delete', module,
      `Deleted ${recordName} (ID: ${recordId})`,
      { recordId, recordName }),
  
  exportReport: (userId: string, userName: string, userRole: string, reportType: string) =>
    logActivity(userId, userName, userRole, 'export', 'reports',
      `Exported ${reportType} report`,
      { reportType }),
  
  printInvoice: (userId: string, userName: string, userRole: string, invoiceId: string) =>
    logActivity(userId, userName, userRole, 'print', 'invoices',
      `Printed invoice #${invoiceId}`,
      { invoiceId }),
}
