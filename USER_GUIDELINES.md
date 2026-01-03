# MASS Car Workshop VWMS
## User Guidelines & Manual

---

## 📖 Welcome

Welcome to **MASS Car Workshop Vehicle Workshop Management System (VWMS)**! This guide will help you navigate and use the system effectively, whether you're an administrator, service advisor, technician, or customer.

---

## 🚀 Getting Started

### Logging In

1. Navigate to the application URL
2. Enter your **email** and **password**
3. Click **"Sign In"**
4. If you don't have an account, click **"Register"** to create one

> **Note:** New accounts are created with "Customer" role by default. Contact an administrator to upgrade your role.

### First Time Setup

| Step | Action |
|------|--------|
| 1 | Register an account with your work email |
| 2 | Contact admin to set your role (Admin/Staff/Technician) |
| 3 | Complete your profile with name and phone number |
| 4 | Familiarize yourself with the sidebar navigation |

---

## 🧭 Navigation Guide

### Sidebar Menu

The left sidebar contains all modules. Click any item to navigate:

| Icon | Module | Description |
|------|--------|-------------|
| 📊 | Dashboard | Overview and KPIs |
| 📋 | Work Orders | Job cards and workflow |
| 👥 | Customers | Customer database |
| 🚗 | Vehicles | Vehicle registry |
| 📅 | Appointments | Scheduling |
| 📦 | Inventory | Parts and stock |
| 👷 | Technicians | Team management |
| 🏢 | Suppliers | Vendor directory |
| 🔍 | Inspections | Digital vehicle inspections |
| 💰 | Estimates | Quotes and invoices |
| 📈 | Reports | Analytics |
| 🤖 | AI Tools | AI assistant |

### Header Bar

- **Module Title** - Shows current module name
- **Connection Status** - Shows database connection (green = connected)
- **User Menu** - Profile settings, logout

---

## 📊 Dashboard

The Dashboard is your central hub for monitoring workshop activity.

### Key Performance Indicators (KPIs)

| KPI | What It Shows |
|-----|---------------|
| **Total Revenue** | Weekly income with comparison to last week |
| **Active Jobs** | Current work orders in progress |
| **Vehicles In** | Number of vehicles currently at the workshop |
| **Pending Parts** | Parts orders awaiting delivery |

### Revenue Chart

- View revenue by **Daily**, **Weekly**, or **Monthly**
- Click the time buttons to switch views
- Hover over chart points for exact values

### Live Activity Feed

- Shows real-time updates
- Color-coded by activity type:
  - 🟢 Green = Completed jobs
  - 🔵 Blue = New bookings
  - 🟡 Yellow = Delays/Warnings
  - 🟣 Purple = Documents sent

### Technician Status

Quick view of all technicians:
- **Working** - Currently on a job (green)
- **Available** - Ready for assignment (blue)
- **Break** - On break (yellow)

---

## 📋 Work Orders

### Kanban Board View

Work orders are displayed in three columns:

| Column | Description |
|--------|-------------|
| **CHECK IN** | New jobs just received |
| **IN PROGRESS** | Jobs being worked on |
| **COMPLETE** | Finished jobs |

### Creating a Work Order

1. Click **"+ New Work Order"**
2. Select customer (or create new)
3. Select vehicle (or register new)
4. Choose services required
5. Assign technician
6. Set priority (Normal/High)
7. Add notes if needed
8. Click **"Create"**

### Managing Work Orders

| Action | How To |
|--------|--------|
| View details | Click on any work order card |
| Move to next stage | Click **"Start"** or **"Complete"** button |
| Add notes | Open card → Add note |
| Edit | Click edit icon on card |

---

## 👥 Customers

### Viewing Customers

- All customers displayed in card format
- Search by name, email, or phone
- See vehicle count and total spent

### Adding a New Customer

1. Click **"+ Add Customer"**
2. Fill in required fields:
   - First Name
   - Last Name
   - Email
   - Phone
3. Optional fields:
   - Address
   - City
4. Click **"Save"**

### Customer Card Information

| Field | Description |
|-------|-------------|
| **Vehicles** | Number of vehicles registered |
| **Total Spent** | Lifetime revenue from customer |
| **Last Visit** | Most recent service date |
| **Status** | Active or Inactive |

---

## 🚗 Vehicles

### Vehicle Registry

All registered vehicles with:
- Make, Model, Year
- License Plate
- Owner name
- Current status

### Registering a New Vehicle

1. Click **"Register New Vehicle"**
2. Select or create customer
3. Enter vehicle details:
   - Make (e.g., Toyota)
   - Model (e.g., Land Cruiser)
   - Year
   - License Plate
   - VIN (17 characters)
   - Color
   - Mileage
4. Click **"Register"**

### Vehicle Status Types

| Status | Meaning |
|--------|---------|
| 🟢 Active | No current service |
| 🟡 In Service | Currently being worked on |
| 🔵 Completed | Service recently completed |

### Quick Actions

- **Service History** - View all past services
- **Schedule Service** - Book new appointment

---

## 📅 Appointments

### Calendar View

- Select date using the calendar picker
- View modes: **Day**, **Week**, **Month**
- Filter by status

### Booking an Appointment

1. Click **"New Appointment"**
2. Select customer and vehicle
3. Choose date and time
4. Select service type
5. Assign technician
6. Set duration (in minutes)
7. Set priority if urgent
8. Add notes
9. Click **"Book"**

### Appointment Status

| Status | Action Available |
|--------|------------------|
| **Scheduled** | Start button |
| **In Progress** | Complete button |
| **Completed** | View details |
| **Cancelled** | Reschedule |

### Identifying Urgent Appointments

- Red left border indicates **URGENT**
- Urgent badge displayed on card

---

## 📦 Inventory

### Parts Overview

View all parts with:
- Part name and SKU
- Category (Fluids, Brakes, Electrical, etc.)
- Stock quantity
- Price and cost

### Stock Status Indicators

| Indicator | Meaning |
|-----------|---------|
| 🟢 Green | Stock OK |
| 🟡 Yellow | Low stock warning |
| 🔴 Red | Critical - below minimum |

### Adding New Parts

1. Click **"+ Add Part"**
2. Enter part details:
   - Part Number/SKU
   - Name
   - Category
   - Cost Price
   - Selling Price
   - Initial Quantity
   - Minimum Stock Level
   - Maximum Stock Level
   - Supplier
   - Bin Location
3. Click **"Save"**

### Adjusting Stock

1. Find the part
2. Click **"Adjust Stock"**
3. Enter new quantity or adjustment (+/-)
4. Add reason for adjustment
5. Confirm

---

## 👷 Technicians

### Team Overview

View all technicians with:
- Name and role
- Current status
- Current job (if working)
- Daily performance

### Performance Metrics

| Metric | Description |
|--------|-------------|
| **Completed Today** | Jobs finished today |
| **Efficiency** | Actual vs. estimated time |
| **Rating** | Customer feedback score |

### Assigning Jobs

1. Find available technician (status = Available)
2. Click **"Assign Job"**
3. Select work order
4. Confirm assignment

---

## 🔍 Inspections (DVI)

### Digital Vehicle Inspection

Complete inspection checklists digitally.

### Performing an Inspection

1. Select vehicle
2. Choose inspection template
3. Go through each item:
   - **OK** (green) - Passed
   - **Attention** (yellow) - Monitor/Minor issue
   - **Immediate** (red) - Needs immediate repair
4. Add notes for any issues
5. Take photos if needed
6. Submit inspection

### Inspection Items Example

| Category | Items |
|----------|-------|
| **Engine** | Oil level, Belts, Filters |
| **Brakes** | Pads, Rotors, Fluid |
| **Tires** | Tread, Pressure, Condition |
| **Electrical** | Battery, Lights, Wipers |
| **Body** | Windshield, Paint, Damage |

### Sending to Customer

1. Complete inspection
2. Click **"Send to Customer"**
3. Customer receives link to view/approve

---

## 💰 Estimates

### Creating an Estimate

1. Click **"Create Estimate"**
2. Select customer and vehicle
3. Add line items:
   - **Parts** - Select from inventory
   - **Labor** - Select from labor guide
   - **Services** - Custom entries
4. System calculates totals
5. Add notes or terms
6. Save as draft or send

### Estimate Status

| Status | Meaning |
|--------|---------|
| **Draft** | Not yet sent |
| **Sent** | Awaiting customer response |
| **Viewed** | Customer has opened |
| **Approved** | Customer accepted |
| **Declined** | Customer rejected |
| **Expired** | Past validity date |

### Converting to Work Order

1. Open approved estimate
2. Click **"Convert to Work Order"**
3. Review details
4. Confirm

---

## 📈 Reports

### Available Reports

| Report | Description |
|--------|-------------|
| **Revenue** | Income by day/week/month |
| **Labor** | Technician productivity |
| **Vehicles** | Service trends |
| **Customers** | Customer analytics |

### Generating Reports

1. Select report type
2. Choose date range
3. Apply filters (optional)
4. Click **"Generate"**
5. Export as CSV or PDF

---

## 🤖 AI Tools

### AI Assistant Features

| Tool | Use For |
|------|---------|
| **Rapid Diagnostics** | Identify issues from symptoms |
| **Parts Finder** | Find compatible parts |
| **Repair Procedures** | Step-by-step guides |

### Using the Chat Assistant

1. Type your question in the chat box
2. Press **Enter** or click **Send**
3. AI responds with relevant information

### Example Questions

- "What causes a P0300 code in a Toyota Camry?"
- "What brake pads fit a 2020 Honda Civic?"
- "How long should an oil change take for a Ford F-150?"
- "Steps to replace a water pump on Nissan Patrol"

---

## ⚙️ Admin Functions

> **Note:** Admin functions are only available to users with Admin role.

### System Diagnostics

Access via **Database Test** in sidebar:
- Check database connection
- View response latency
- Verify RLS policies
- View table statistics

### Managing Users

1. Go to Supabase Dashboard
2. Navigate to **Table Editor** → **user_profiles**
3. Find user and edit role:
   - `admin` - Full access
   - `staff` - Standard access
   - `technician` - Limited access
   - `customer` - Minimal access

---

## 🔒 Security Best Practices

### Password Guidelines

- Use at least 8 characters
- Include uppercase and lowercase
- Include numbers
- Include special characters

### Session Security

- Log out when leaving shared computers
- Don't share login credentials
- Report suspicious activity to admin

### Data Protection

- Customer data is encrypted
- Row Level Security prevents unauthorized access
- Regular backups are maintained

---

## ❓ Troubleshooting

### Common Issues

| Issue | Solution |
|-------|----------|
| Can't log in | Check email/password, use "Forgot Password" |
| Page not loading | Refresh browser, check internet |
| Connection error (red) | Database issue, contact admin |
| Missing features | Check your role permissions |
| Slow performance | Clear browser cache, try different browser |

### Getting Help

1. Check this user guide
2. Ask your system administrator
3. Contact technical support

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Quick search |
| `Esc` | Close modal/dialog |
| `Enter` | Submit form |
| `Tab` | Next field |
| `Shift + Tab` | Previous field |

---

## 📱 Mobile Usage

The system is fully responsive. On mobile devices:

- Sidebar becomes a hamburger menu
- Cards stack vertically
- Touch-friendly buttons
- Swipe gestures supported

---

## 🔄 Updates & Changelog

The system receives regular updates. New features are announced in the dashboard activity feed.

### Reporting Bugs

1. Note the exact issue
2. Screenshot if possible
3. Contact administrator
4. Include: Module, Action, Error message

---

## 📞 Support Contacts

| Contact | For |
|---------|-----|
| System Administrator | User access, role changes |
| Technical Support | Bugs, errors, outages |
| Training | Learning the system |

---

*User Guidelines Version 1.0*
*Last Updated: December 29, 2025*

---

© 2025 MASS Car Workshop. All rights reserved.
