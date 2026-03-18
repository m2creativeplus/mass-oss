// ============================================================
// MASS OSS - RBAC Permission System
// Shared between frontend (lib/permissions.ts) and backend
// ============================================================

import { query } from "./_generated/server";
import { v } from "convex/values";

// Permission definitions
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

// Check if a role has a specific permission
export function can(role: string, permission: Permission): boolean {
  const allowedRoles = PERMISSIONS[permission];
  if (!allowedRoles) return false;
  return (allowedRoles as readonly string[]).includes(role);
}

// Module-level permissions (for UI visibility)
export const MODULE_PERMISSIONS: Record<string, Record<string, Record<string, boolean>>> = {
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
    "ai-tools": { read: true, write: true, delete: false, manage: false },
    pos: { read: true, write: true, delete: false, manage: false },
    delivery: { read: true, write: true, delete: false, manage: false },
    reminders: { read: true, write: true, delete: false, manage: false },
    "work-orders": { read: true, write: true, delete: false, manage: false },
    settings: { read: false, write: false, delete: false, manage: false },
    "audit-logs": { read: false, write: false, delete: false, manage: false },
    profile: { read: true, write: true, delete: false, manage: false },
  },
  technician: {
    dashboard: { read: true, write: false, delete: false, manage: false },
    customers: { read: true, write: false, delete: false, manage: false },
    vehicles: { read: true, write: true, delete: false, manage: false },
    appointments: { read: true, write: true, delete: false, manage: false },
    inspections: { read: true, write: true, delete: false, manage: true },
    estimates: { read: true, write: true, delete: false, manage: false },
    inventory: { read: true, write: false, delete: false, manage: false },
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

export function hasModulePermission(role: string, module: string, action: string): boolean {
  const rolePerms = MODULE_PERMISSIONS[role];
  if (!rolePerms) return false;
  const modulePerms = rolePerms[module];
  if (!modulePerms) return false;
  return modulePerms[action] || false;
}
