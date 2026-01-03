# MASS Car Workshop - Vehicle Workshop Management System (VWMS)
## Complete Technical Documentation

---

## 📋 Executive Summary

**MASS Car Workshop VWMS** is a comprehensive, enterprise-grade Vehicle Workshop Management System designed to digitize and streamline all aspects of automotive service center operations. Built with modern web technologies, it provides a complete solution for managing customers, vehicles, appointments, work orders, inventory, technicians, and reporting.

### Key Highlights
- 🚗 **16+ Integrated Modules** - Complete workshop operations coverage
- 🔐 **Role-Based Access Control** - 4 user roles with granular permissions
- 📊 **Real-Time Analytics** - Revenue tracking, performance metrics
- 🤖 **AI-Powered Assistant** - Intelligent diagnostics and parts lookup
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🔄 **Real-Time Updates** - Supabase-powered live data synchronization

---

## 🛠️ Technology Stack

| Category | Technology | Version |
|----------|------------|---------|
| **Framework** | Next.js | 15.2.4 |
| **UI Library** | React | 19 |
| **Language** | TypeScript | 5.x |
| **Styling** | Tailwind CSS | 3.4.17 |
| **Animations** | Framer Motion | 12.23.26 |
| **UI Components** | Radix UI + shadcn/ui | Latest |
| **Backend/Database** | Supabase (PostgreSQL) | Latest |
| **Charts** | Recharts | Latest |
| **Forms** | React Hook Form + Zod | Latest |
| **Date Handling** | date-fns | Latest |
| **Icons** | Lucide React | 0.454.0 |

---

## 🏗️ Architecture Overview

### Application Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    Next.js 15 Frontend                       │
├─────────────────────────────────────────────────────────────┤
│  App Router → Layout → MassWorkshopSystem → Modules         │
├─────────────────────────────────────────────────────────────┤
│                 Authentication Layer                         │
│  Supabase Auth Provider → Login Form → Role Permissions     │
├─────────────────────────────────────────────────────────────┤
│                  Backend - Supabase                          │
│  PostgreSQL → RLS Policies → Triggers → Real-time           │
└─────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
MASS-Car-Workshop-VWMS/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   ├── globals.css               # Global Styles
│   ├── layout.tsx                # Root Layout
│   └── page.tsx                  # Entry Point
├── components/
│   ├── admin/                    # Admin-only components
│   │   └── database-test.tsx     # System Diagnostics
│   ├── ai-tools/                 # AI Assistant
│   │   └── ai-tools.tsx
│   ├── appointments/             # Scheduling
│   │   └── appointments.tsx
│   ├── auth/                     # Authentication
│   │   ├── auth-provider.tsx
│   │   ├── login-form.tsx
│   │   ├── premium-login.tsx
│   │   ├── supabase-auth-provider.tsx
│   │   └── supabase-login-form.tsx
│   ├── customers/                # CRM
│   │   └── customers.tsx
│   ├── dashboard/                # Main Dashboard
│   │   └── dashboard.tsx
│   ├── estimates/                # Quotes & Invoices
│   │   ├── create-estimate.tsx
│   │   ├── estimate-viewer.tsx
│   │   ├── estimates-dashboard.tsx
│   │   └── estimates-module.tsx
│   ├── inspections/              # Digital Vehicle Inspections
│   │   ├── create-inspection.tsx
│   │   ├── customer-approval.tsx
│   │   ├── enhanced-inspection-checklist.tsx
│   │   ├── inspection-checklist.tsx
│   │   ├── inspection-dashboard.tsx
│   │   └── inspections-module.tsx
│   ├── inventory/                # Parts Management
│   │   └── inventory-management.tsx
│   ├── layout/                   # App Layout
│   │   ├── sidebar.tsx
│   │   └── user-menu.tsx
│   ├── reports/                  # Analytics
│   │   └── reports-analytics.tsx
│   ├── suppliers/                # Supplier Management
│   │   ├── add-supplier-form.tsx
│   │   ├── supplier-detail.tsx
│   │   ├── suppliers-directory.tsx
│   │   └── suppliers-module.tsx
│   ├── technicians/              # Staff Management
│   │   └── technician-dashboard.tsx
│   ├── ui/                       # shadcn/ui Components (18)
│   ├── vehicles/                 # Fleet Management
│   │   └── vehicles.tsx
│   └── work-orders/              # Job Management
│       └── work-orders-kanban.tsx
├── lib/                          # Utilities
│   ├── supabase.ts               # Supabase Client
│   ├── supabase-server.ts        # Server-side Client
│   └── utils.ts                  # Helpers
├── scripts/                      # Database Scripts (5)
├── mass-workshop-system.tsx      # Main App Component
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 📱 Module Documentation

### 1. Dashboard (`/components/dashboard/dashboard.tsx`)

**Purpose:** Central command center for workshop oversight

**Features:**
- 📊 **Premium KPI Cards** - Revenue, Active Jobs, Vehicles In, Pending Parts
- 📈 **Revenue Analytics Chart** - Interactive area chart with daily/weekly/monthly views
- 🔔 **Live Activity Feed** - Real-time workshop updates
- 👷 **Technician Status Board** - At-a-glance team availability

**Key Components:**
- `PremiumKPICard` - Animated stat cards with trends
- `AreaChart` (Recharts) - Revenue visualization
- Time range selector (Daily/Week/Month)

---

### 2. Work Orders Kanban (`/components/work-orders/work-orders-kanban.tsx`)

**Purpose:** Visual workflow management for service jobs

**Features:**
- 🎯 **Kanban Board** - CHECK_IN → IN_PROGRESS → COMPLETE stages
- 🔍 **Search & Filter** - Find orders by ID, vehicle, customer
- 📋 **Order Cards** - Full job details at a glance
- ⏰ **Time Tracking** - Check-in/completion timestamps

**Status Types:** `CHECK_IN` | `IN_PROGRESS` | `COMPLETE`

---

### 3. Customers (`/components/customers/customers.tsx`)

**Purpose:** Customer Relationship Management (CRM)

**Features:**
- 👥 **Customer Directory** - Searchable customer list
- 📞 **Contact Info** - Phone, email, address
- 🚗 **Vehicle Count** - Linked vehicles per customer
- 💰 **Spending History** - Total revenue per customer
- 🏷️ **Status Badges** - Active/Inactive customers

---

### 4. Vehicles (`/components/vehicles/vehicles.tsx`)

**Purpose:** Fleet and vehicle registry management

**Features:**
- 🚙 **Vehicle Cards** - Detailed vehicle information
- 🔎 **Smart Search** - By make, model, plate, or owner
- 📅 **Service Timeline** - Last/next service dates
- 📜 **Service History** - Record count per vehicle
- 🏷️ **Status Tracking** - Active/In-Service/Completed

---

### 5. Appointments (`/components/appointments/appointments.tsx`)

**Purpose:** Service scheduling and calendar management

**Features:**
- 📅 **Interactive Calendar** - Date picker for appointments
- 🕐 **Time Slots** - Duration and time management
- 👨‍🔧 **Technician Assignment** - Assign to specific tech
- 🚨 **Priority Flags** - Normal/Urgent appointments
- 💵 **Cost Estimates** - Revenue projections

**View Modes:** Day | Week | Month

**Status Types:** `scheduled` | `in-progress` | `completed` | `cancelled`

---

### 6. Inventory Management (`/components/inventory/inventory-management.tsx`)

**Purpose:** Parts and supplies stock control

**Features:**
- 📦 **Parts Catalog** - Complete parts database
- ⚠️ **Low Stock Alerts** - Automatic reorder warnings
- 📍 **Location Tracking** - Warehouse bin locations
- 💰 **Pricing** - Cost vs. selling prices
- 📊 **Stock Levels** - Current/Min/Max quantities

---

### 7. Technician Dashboard (`/components/technicians/technician-dashboard.tsx`)

**Purpose:** Team management and performance tracking

**Features:**
- 👷 **Staff Profiles** - Photo, role, certifications
- 🟢 **Status Indicators** - Available/Working/Break/Offline
- 📈 **Performance Metrics** - Jobs completed, efficiency %
- ⭐ **Ratings** - Customer feedback scores
- 🎖️ **Certifications** - ASE, OEM certifications

---

### 8. Suppliers Module (`/components/suppliers/suppliers-module.tsx`)

**Purpose:** Vendor and supplier relationship management

**Features:**
- 🏢 **Supplier Directory** - Contact information
- 📧 **Communication** - Email/phone integration
- 🏷️ **Categories** - Parts, Service, Tools
- ✅ **Active Status** - Track active suppliers

---

### 9. Inspections (`/components/inspections/`)

**Purpose:** Digital Vehicle Inspection (DVI) system

**Components:**
- `enhanced-inspection-checklist.tsx` - Main inspection form
- `customer-approval.tsx` - Digital approval workflow

**Features:**
- ✅ **Multi-Point Inspection** - Comprehensive checklists
- 📸 **Photo Documentation** - Visual evidence
- 🚦 **Status Indicators** - OK/Attention/Immediate
- 📱 **Customer Portal** - Digital approval

---

### 10. Estimates (`/components/estimates/`)

**Purpose:** Quote generation and invoice management

**Components:**
- `create-estimate.tsx` - Quote builder
- `estimate-viewer.tsx` - View/print quotes

**Features:**
- 🧮 **Line Item Builder** - Parts + Labor
- 🖨️ **Print/PDF Export** - Professional quotes
- ✅ **Approval Workflow** - Digital signatures

---

### 11. Reports & Analytics (`/components/reports/reports-analytics.tsx`)

**Purpose:** Business intelligence and reporting

**Features:**
- 📊 **Revenue Reports** - Daily/Weekly/Monthly
- 👷 **Labor Reports** - Tech utilization
- 📈 **Growth Analytics** - Year-over-year
- 📥 **Export Options** - CSV/PDF

---

### 12. AI Tools (`/components/ai-tools/ai-tools.tsx`)

**Purpose:** AI-powered workshop assistant

**Features:**
- 🤖 **Chat Interface** - Natural language queries
- 🔧 **Rapid Diagnostics** - Symptom analysis
- 🔍 **Parts Finder** - Compatibility lookup
- 📖 **Repair Procedures** - Step-by-step guides

---

### 13. System Diagnostics (`/components/admin/database-test.tsx`)

**Purpose:** Admin-only system health monitoring

**Features:**
- 🔌 **Connection Status** - Database connectivity
- ⏱️ **Latency Monitoring** - Response times
- 🛡️ **Security Check** - RLS policy status
- 📋 **Diagnostic Logs** - Real-time console

**Access:** Admin role only

---

## 🗃️ Database Schema

### Tables (13)

| Table | Description | Key Fields |
|-------|-------------|------------|
| `user_profiles` | User accounts & roles | user_id, role, first_name, last_name |
| `customers` | Customer records | email, phone, address, city |
| `vehicles` | Vehicle registry | customer_id, make, model, year, vin |
| `suppliers` | Vendor database | name, contact_person, category |
| `parts_catalog` | Parts inventory | part_number, cost/selling_price, stock_quantity |
| `labor_guide` | Service operations | operation_code, standard_hours, rate |
| `inspection_templates` | DVI templates | name, category |
| `inspection_template_items` | Template line items | item_name, is_required |
| `inspections` | Inspection records | vehicle_id, technician_id, status |
| `inspection_items` | Inspection results | status: ok/attention/immediate |
| `estimates` | Quotes & invoices | estimate_number, status, total_amount |
| `estimate_line_items` | Quote line items | type: part/labor/service |
| `appointments` | Service bookings | appointment_date, duration, status |

### Entity Relationships

```
USER_PROFILES ──┬── INSPECTIONS (performs)
                └── APPOINTMENTS (assigned)

CUSTOMERS ──┬── VEHICLES (owns)
            ├── ESTIMATES (receives)
            └── APPOINTMENTS (books)

VEHICLES ──┬── INSPECTIONS (inspected)
           ├── ESTIMATES (quoted)
           └── APPOINTMENTS (serviced)

SUPPLIERS ──── PARTS_CATALOG (supplies)

INSPECTION_TEMPLATES ──┬── INSPECTION_TEMPLATE_ITEMS
                       └── INSPECTIONS (uses template)

INSPECTIONS ──┬── INSPECTION_ITEMS (has)
              └── ESTIMATES (generates)

ESTIMATES ──── ESTIMATE_LINE_ITEMS ──┬── PARTS_CATALOG
                                     └── LABOR_GUIDE
```

---

## 🔐 Authentication & Authorization

### User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| **Admin** | System administrator | Full CRUD on all modules |
| **Staff** | Front desk/service advisor | Read/Write most modules, no delete |
| **Technician** | Mechanic/Tech | Limited to vehicles, work orders, inspections |
| **Customer** | End customer | View own vehicles, appointments, estimates |

### Permission Matrix

| Module | Admin | Staff | Technician | Customer |
|--------|-------|-------|------------|----------|
| Dashboard | ✅ All | 📖 Read | 📖 Read | ❌ |
| Customers | ✅ All | ✏️ R/W | 📖 Read | 📖 Own |
| Vehicles | ✅ All | ✏️ R/W | ✏️ R/W | 📖 Own |
| Work Orders | ✅ All | ✏️ R/W | ✏️ R/W | ❌ |
| Appointments | ✅ All | ✏️ R/W | ✏️ R/W | ✏️ Own |
| Inventory | ✅ All | ✏️ R/W | 📖 Read | ❌ |
| Technicians | ✅ All | 📖 Read | 📖 Read | ❌ |
| Reports | ✅ All | 📖 Read | ❌ | ❌ |
| AI Tools | ✅ All | ✏️ R/W | ✏️ R/W | ❌ |
| Diagnostics | ✅ All | ❌ | ❌ | ❌ |

### Row Level Security (RLS)

All database tables have RLS enabled with policies based on:
- User authentication status
- User role (from `user_profiles` table)
- Resource ownership

---

## 🌐 API Endpoints

The application uses Supabase's auto-generated REST API:

### Base URL
```
https://<project-id>.supabase.co/rest/v1/
```

### Available Endpoints

| Resource | Methods |
|----------|---------|
| `/user_profiles` | GET, POST, PATCH, DELETE |
| `/customers` | GET, POST, PATCH, DELETE |
| `/vehicles` | GET, POST, PATCH, DELETE |
| `/suppliers` | GET, POST, PATCH, DELETE |
| `/parts_catalog` | GET, POST, PATCH, DELETE |
| `/labor_guide` | GET, POST, PATCH, DELETE |
| `/inspections` | GET, POST, PATCH, DELETE |
| `/estimates` | GET, POST, PATCH, DELETE |
| `/appointments` | GET, POST, PATCH, DELETE |

---

## 🚀 Deployment Guide

### Environment Variables

```bash
# Supabase Configuration (Required)
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>

# Optional: Service Role Key (server-side only)
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
```

### Build Commands

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint check
npm run lint
```

### Recommended Deployment Platforms

| Platform | Setup Time | Best For |
|----------|-----------|----------|
| Railway.app | 15 min | Fastest setup, built-in PostgreSQL |
| Render.com | 20 min | Generous free tier |
| Google Cloud Run | 45 min | Scalable, Google ecosystem |

---

## 💻 Development Setup

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account

### Quick Start

```bash
# 1. Clone repository
git clone <repository-url>
cd MASS-Car-Workshop-VWMS

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Run database setup
# Go to Supabase Dashboard > SQL Editor
# Run scripts/complete-database-setup.sql

# 5. Start development server
npm run dev
```

### Creating Admin User

1. Register a new user via the login form
2. Go to Supabase Dashboard > Table Editor > user_profiles
3. Update the user's `role` field to `admin`

---

## 📈 Future Roadmap

### Planned Features

| Feature | Priority | Status |
|---------|----------|--------|
| SMS Notifications | High | 🔄 Planned |
| Multi-Location Support | High | 🔄 Planned |
| Customer Mobile App | Medium | 🔄 Planned |
| Accounting Integration | Medium | 🔄 Planned |
| OBD-II Integration | Low | 🔄 Planned |
| Parts Ordering Automation | Medium | 🔄 Planned |

---

## 📞 Support

**Documentation Version:** 1.0.0
**Last Updated:** December 29, 2025

---

*© 2025 MASS Car Workshop. All rights reserved.*
