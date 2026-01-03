# MASS Car Workshop - Complete Stitch Design Prompts
## UI/UX Design System for Vehicle Workshop Management

---

## 🎨 MASTER DESIGN BRIEF

**Project:** MASS Car Workshop - Vehicle Workshop Management System (VWMS)
**Industry:** Automotive Service / Workshop Management
**Target Market:** Somaliland / East Africa
**Style:** Modern SaaS Dashboard, Dark Theme, Professional
**Brand Colors:** Orange (#F97316), Emerald (#10B981), Zinc (#18181B), Amber (#F59E0B)

---

## 📱 SCREEN-BY-SCREEN PROMPTS

### 1. LOGIN SCREEN

```
Design a modern dark-themed login page for an automotive workshop management system called "MASS Car Workshop". 

Include:
- Centered login card with glass-morphism effect
- Email and password input fields with icons
- Orange gradient "Sign In" button
- "Forgot Password" link
- Company logo at the top (car wrench icon)
- Background: Dark zinc (#18181B) with subtle gradient
- Accent colors: Orange (#F97316) and Emerald (#10B981)
- Clean, minimal, professional SaaS aesthetic
- Mobile responsive design
```

---

### 2. MAIN DASHBOARD

```
Design a comprehensive workshop dashboard for an automotive service center management system.

Layout:
- Left sidebar navigation (collapsible, dark zinc)
- Top header with search bar and user profile
- Main content area with grid of cards

Include these sections:
1. KPI Cards row (4 cards):
   - Total Revenue (with green up arrow trend)
   - Active Jobs (orange highlight)
   - Vehicles In Service
   - Pending Parts

2. Revenue Analytics Chart:
   - Area chart with orange gradient fill
   - Daily/Weekly/Monthly toggle tabs
   - Dark card background with subtle border

3. Live Activity Feed:
   - Scrollable list of recent activities
   - Color-coded status dots (green, orange, red)
   - Timestamps and action descriptions

4. Technician Status Grid:
   - Avatar + name + current status
   - Status badges: Available (green), Working (orange), Break (yellow)

Style: Dark theme (#0A0A0A background), orange accents, modern SaaS dashboard aesthetic, glassmorphism cards
```

---

### 3. WORK ORDERS KANBAN

```
Design a Kanban board screen for managing car repair work orders.

Three columns:
1. CHECK-IN (Blue header)
2. IN PROGRESS (Orange header)
3. COMPLETE (Green header)

Each work order card shows:
- Vehicle: Make, Model, Year
- License Plate badge
- Customer name
- Assigned technician with avatar
- List of services
- Priority flag (Normal/High)
- Time elapsed badge

Include:
- Drag handles on cards
- "New Work Order" button (orange)
- Search/filter bar at top
- Column count badges
- Dark theme with colored accents
```

---

### 4. VEHICLE REGISTRY

```
Design a vehicle management screen for a workshop system.

Header:
- "Vehicle Registry" title
- "Register New Vehicle" button (orange)
- Search bar with filters

Stats Row (4 cards):
- Total Vehicles
- In Service
- Scheduled Service
- Service History

Vehicle Cards Grid:
Each card shows:
- Car image/icon
- Make, Model, Year
- License Plate (Somaliland format: SL-XXXXX-X)
- Owner name
- Last service date
- Status badge (Active/In-Service/Completed)
- "View Details" and "Schedule Service" buttons

Style: Card-based layout, dark theme, green and orange accents
```

---

### 5. CUSTOMER MANAGEMENT

```
Design a Customer CRM screen for an auto workshop.

Layout:
- Search bar with filters (Status, Date range)
- Customer cards in grid layout

Each customer card shows:
- Customer avatar/initials
- Full name
- Phone number
- Email
- Number of vehicles owned
- Total spent (USD)
- Last visit date
- Status badge (Active/Inactive)
- Quick action buttons (View, Edit, Call)

Stats at top:
- Total Customers
- Active Customers
- New This Month
- Average Revenue per Customer

Style: Dark professional theme, subtle shadows, clean typography
```

---

### 6. APPOINTMENTS / SCHEDULING

```
Design an appointment scheduling screen for a vehicle service center.

Left Panel:
- Mini calendar widget (month view)
- Date selection with highlighted days
- Quick stats: Today's appointments, Revenue estimate

Right Panel:
- Day/Week/Month view toggle
- Appointment list or timeline view

Each appointment card:
- Time slot (e.g., 09:00 AM - 10:30 AM)
- Customer name
- Vehicle info
- Service type
- Assigned technician
- Status indicator (Scheduled/In-Progress/Completed/Cancelled)
- Estimated cost

Include:
- "New Appointment" button
- Filter by status
- Color-coded priority (red border = urgent)

Style: Calendar-focused dark UI, time-based layout, orange/green accents
```

---

### 7. INVENTORY / PARTS MANAGEMENT

```
Design an inventory management screen for auto parts.

Header:
- "Parts Inventory" title
- "Add Part" button
- Search by name/SKU
- Category filter dropdown

Stats Row:
- Total Parts
- Low Stock Alerts (red)
- Total Value
- Suppliers

Parts Table/Grid:
Columns:
- Part Name
- SKU/Part Number
- Category (Fluids, Brakes, Electrical, etc.)
- Stock Quantity (with low stock warning)
- Cost Price
- Selling Price
- Supplier
- Location/Bin
- Actions

Include:
- Stock level progress bars
- Low stock highlighted in red/orange
- Quick reorder button

Style: Data-heavy table layout, dark theme, clear hierarchy
```

---

### 8. TECHNICIAN DASHBOARD

```
Design a technician team management screen.

Team Stats Row:
- Total Technicians
- Currently Working
- Jobs Completed Today
- Average Efficiency %

Technician Cards:
Each card shows:
- Profile photo
- Name and role
- Status indicator (Available/Working/Break/Offline)
- Current job (if working)
- Today's completed jobs
- Efficiency rating (percentage)
- Customer rating (stars)
- Specialties badges (Engine, Brakes, Electrical)
- Certifications (ASE, OEM)

Include:
- "Assign Job" quick action
- Performance trend mini-chart
- Contact buttons

Style: People-focused cards, avatar-heavy, status-driven UI
```

---

### 9. DIGITAL VEHICLE INSPECTION (DVI)

```
Design a digital vehicle inspection checklist screen.

Header:
- Vehicle info (Make, Model, Year, Plate)
- Customer name
- Inspector name
- Date/Time

Inspection Categories (Accordion style):
1. Engine
2. Brakes
3. Tires & Wheels
4. Electrical
5. Suspension
6. Body & Interior
7. Fluids

Each item has:
- Checkbox or status selector
- Status colors: Green (OK), Yellow (Attention), Red (Immediate)
- Notes field
- Photo upload button
- Expand for details

Bottom:
- Overall vehicle health score
- "Submit Inspection" button
- "Send to Customer" button

Style: Checklist-focused, color-coded status, mobile-friendly
```

---

### 10. ESTIMATES & INVOICES

```
Design an estimate/quote creation screen.

Header:
- Estimate number (EST-2025-001)
- Date created
- Status badge (Draft/Sent/Approved/Declined)

Customer Info:
- Name, Phone, Email
- Vehicle details

Line Items Table:
Columns:
- Type (Part/Labor/Service)
- Description
- Quantity
- Unit Price
- Total
- Actions (Edit/Remove)

Add buttons:
- "+ Add Part" (from inventory)
- "+ Add Labor" (from labor guide)
- "+ Add Service"

Totals Section:
- Subtotal
- Tax (%)
- Discount
- Grand Total (large, bold)

Actions:
- Save Draft
- Print/PDF
- Send to Customer (email)
- Convert to Work Order

Style: Document-focused, clean table layout, print-ready design
```

---

### 11. REPORTS & ANALYTICS

```
Design an analytics dashboard for workshop performance.

Report Cards:
1. Revenue Overview
   - Line/Area chart (daily, weekly, monthly)
   - Comparison to previous period
   
2. Service Breakdown
   - Donut/Pie chart by service type
   - Top 5 services listed

3. Technician Performance
   - Bar chart comparing technicians
   - Jobs completed, efficiency, ratings

4. Customer Analytics
   - New vs returning customers
   - Customer acquisition trend

5. Inventory Turnover
   - Most used parts
   - Low stock items

Filters:
- Date range picker
- Export to PDF/CSV

Style: Chart-heavy, data visualization focused, executive dashboard feel
```

---

### 12. AI ASSISTANT

```
Design an AI chat assistant interface for a workshop system.

Layout:
- Left sidebar with quick tools:
  - Rapid Diagnostics
  - Parts Finder
  - Repair Procedures
  - Time Estimates

- Main chat area:
  - Message bubbles (user: right, AI: left)
  - AI avatar icon
  - Typing indicator animation
  - Suggested questions chips

- Input area:
  - Text input with placeholder
  - Send button (orange)
  - Attachment button

Sample conversation:
User: "What causes a P0300 code?"
AI: "P0300 indicates random misfires. Common causes include..."

Style: Chat app aesthetic, dark theme, AI-modern feel with subtle gradients
```

---

### 13. SUPPLIERS DIRECTORY

```
Design a supplier management screen.

Stats:
- Total Suppliers
- Active Suppliers
- Categories

Supplier Cards:
Each shows:
- Company name
- Contact person
- Phone & Email
- Category (Parts, Tools, Service)
- Active status badge
- Location/City
- Quick actions (View, Edit, Order)

Include:
- "Add Supplier" button
- Search and filter
- Category tabs

Style: Directory/contact-list layout, business-card style cards
```

---

### 14. 404 / ERROR PAGE

```
Design a custom 404 error page with automotive theme.

Include:
- Large "404" number in gradient (orange to amber)
- "Garage Closed" or "Bay Empty" headline
- Friendly message: "The page you're looking for doesn't exist"
- Animated wrench or car icon
- "Return to Dashboard" button (orange)
- Dark background with subtle grid pattern

Style: Fun but professional, automotive metaphors, dark theme
```

---

### 15. LOADING STATE

```
Design a premium loading screen for a workshop system.

Include:
- Centered animated logo/spinner
- Multiple spinning rings (orange, green, gold)
- "MASS Workshop" text with fade animation
- Loading dots animation
- Background: Dark zinc with gradient orbs
- Subtle glow effects

Style: Premium, animated, brand-focused loading experience
```

---

## 🎨 DESIGN SYSTEM TOKENS

### Colors
```
Primary: #F97316 (Orange)
Secondary: #10B981 (Emerald)
Accent: #F59E0B (Amber)
Background: #0A0A0A (Near Black)
Surface: #18181B (Zinc 900)
Card: #27272A (Zinc 800)
Border: #3F3F46 (Zinc 700)
Text Primary: #FFFFFF
Text Secondary: #A1A1AA (Zinc 400)
Success: #22C55E
Warning: #EAB308
Error: #EF4444
```

### Typography
```
Font Family: Inter, system-ui, sans-serif
Headings: Bold, tracking-tight
Body: Regular, 16px base
Small: 14px
```

### Spacing
```
Card Padding: 24px
Grid Gap: 16px
Border Radius: 12px (large), 8px (medium), 4px (small)
```

---

## 📱 MOBILE CONSIDERATIONS

For all screens:
- Hamburger menu instead of sidebar
- Stack cards vertically
- Touch-friendly button sizes (min 44px)
- Swipe gestures for Kanban cards
- Bottom navigation for key actions

---

*Use these prompts in Stitch to generate consistent, professional UI designs for the MASS Car Workshop system.*
