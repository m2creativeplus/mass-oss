// ============================================================
// MASS OSS - Shared Permissions Library
// Used by both frontend components and Convex backend
// ============================================================

export const PERMISSIONS = {
  create_job: ["admin", "staff"],
  assign_job: ["admin", "staff"],
  view_jobs: ["admin", "staff", "technician"],
  manage_users: ["admin"],
  manage_vehicles: ["admin", "staff"],
  manage_inventory: ["admin", "staff"],
  view_reports: ["admin", "staff"],
  manage_customers: ["admin", "staff"],
  manage_settings: ["admin"],
  manage_billing: ["admin"],
  perform_inspection: ["admin", "staff", "technician"],
  create_estimate: ["admin", "staff"],
  approve_estimate: ["admin"],
  process_payment: ["admin", "staff"],
  view_own_vehicles: ["admin", "staff", "technician", "customer"],
  view_own_appointments: ["admin", "staff", "technician", "customer"],
  view_audit_logs: ["admin"],
} as const;

export type Permission = keyof typeof PERMISSIONS;
export type UserRole = "admin" | "staff" | "technician" | "customer";

/** Check if a role has a specific permission */
export function can(role: string, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;
  return (allowedRoles as readonly string[]).includes(role);
}

/** Module-level permissions used by the UI to show/hide sidebar items */
export const MODULE_ACCESS: Record<string, Record<string, { read: boolean; write: boolean; delete: boolean; manage: boolean }>> = {
  admin: {
    dashboard: { read: true, write: true, delete: true, manage: true },
    customers: { read: true, write: true, delete: true, manage: true },
    vehicles: { read: true, write: true, delete: true, manage: true },
    appointments: { read: true, write: true, delete: true, manage: true },
    technicians: { read: true, write: true, delete: true, manage: true },
    suppliers: { read: true, write: true, delete: true, manage: true },
    inspections: { read: true, write: true, delete: true, manage: true },
    estimates: { read: true, write: true, delete: true, manage: true },
    inventory: { read: true, write: true, delete: true, manage: true },
    reports: { read: true, write: true, delete: false, manage: true },
    "ai-tools": { read: true, write: true, delete: false, manage: true },
    pos: { read: true, write: true, delete: true, manage: true },
    delivery: { read: true, write: true, delete: true, manage: true },
    reminders: { read: true, write: true, delete: true, manage: true },
    "work-orders": { read: true, write: true, delete: true, manage: true },
    settings: { read: true, write: true, delete: true, manage: true },
    "audit-logs": { read: true, write: false, delete: false, manage: false },
    profile: { read: true, write: true, delete: false, manage: false },
  },
  staff: {
    dashboard: { read: true, write: false, delete: false, manage: false },
    customers: { read: true, write: true, delete: false, manage: false },
    vehicles: { read: true, write: true, delete: false, manage: false },
    appointments: { read: true, write: true, delete: false, manage: true },
    technicians: { read: true, write: false, delete: false, manage: false },
    suppliers: { read: true, write: true, delete: false, manage: false },
    inspections: { read: true, write: true, delete: false, manage: false },
    estimates: { read: true, write: true, delete: false, manage: true },
    inventory: { read: true, write: true, delete: false, manage: false },
    reports: { read: true, write: false, delete: false, manage: false },
    pos: { read: true, write: true, delete: false, manage: false },
    "work-orders": { read: true, write: true, delete: false, manage: false },
    profile: { read: true, write: true, delete: false, manage: false },
  },
  technician: {
    dashboard: { read: true, write: false, delete: false, manage: false },
    vehicles: { read: true, write: true, delete: false, manage: false },
    appointments: { read: true, write: true, delete: false, manage: false },
    inspections: { read: true, write: true, delete: false, manage: true },
    estimates: { read: true, write: true, delete: false, manage: false },
    "work-orders": { read: true, write: true, delete: false, manage: false },
    profile: { read: true, write: true, delete: false, manage: false },
  },
  customer: {
    dashboard: { read: true, write: false, delete: false, manage: false },
    vehicles: { read: true, write: false, delete: false, manage: false },
    appointments: { read: true, write: true, delete: false, manage: false },
    inspections: { read: true, write: false, delete: false, manage: false },
    estimates: { read: true, write: false, delete: false, manage: false },
    profile: { read: true, write: true, delete: false, manage: false },
  },
};

/** Check if a role can access a module with a specific action */
export function hasModuleAccess(role: string, module: string, action: "read" | "write" | "delete" | "manage"): boolean {
  const roleModules = MODULE_ACCESS[role];
  if (!roleModules) return false;
  const modulePerms = roleModules[module];
  if (!modulePerms) return false;
  return modulePerms[action];
}
