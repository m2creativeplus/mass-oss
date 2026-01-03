# MASS (Motor & Auto Service System) - Operational Guideline

**Version:** 2.0 (Enterprise Edition)
**Last Updated:** January 1, 2026

---

## 🚀 1. System Overview

MASS is a cloud-native **Vehicle Workshop Management System (VWMS)** designed for the Somali automotive market. It integrates workshop operations, supply chain management, and financial tracking into a single "Operating System" for your business.

### Core Modules
| Module | Function | key Features |
| :--- | :--- | :--- |
| **Dashboard** | Command Center | Real-time stats, Financial health, Active jobs. |
| **Network** | Stakeholder Map | 80+ Pre-loaded businesses (Parts, Fleets, Dealers). |
| **Inventory** | Parts Management | Stock tracking, Low-stock alerts, Barcode ready. |
| **Work Orders** | Job Management | Kanban board, Technician assignment, Status tracking. |
| **Finance** | Integrity System | Split-payments (Zaad/Cash), Expense tracking. |

---

## 🛠️ 2. Deployment & Setup

### A. Automatic Deployment (Vercel)
The system is linked to GitHub. Every "Push" to the `main` branch triggers a new live build.
- **Live URL**: [https://mass-car-workshop-vwms.vercel.app/](https://mass-car-workshop-vwms.vercel.app/)

### B. Backend Connection (Convex)
To connect your local environment to the live database:
1. **Get Deployment URL**: Go to your [Convex Dashboard](https://dashboard.convex.dev/t/mahmoudawaleh/mass-motor-auto-service-system).
2. **Update Environment**:
   - Copy the `CONVEX_DEPLOYMENT` and `NEXT_PUBLIC_CONVEX_URL` from Settings.
   - Paste them into your `.env.local` file.
3. **Deploy Schema**:
   ```bash
   npx convex deploy
   ```

---

## 📊 3. Operational Workflows

### 🟢 Daily Workflow (Service Advisor)
1. **Check-In**: Open **Dashboard** to see "Appointments Today".
2. **New Job**:
   - Go to **Work Orders** -> "New Order".
   - Select Customer & Vehicle (or create new).
   - Add **Service Package** (e.g., "Gold Service").
   - Assign **Technician**.
3. **Draft Invoice**:
   - The Estimate is auto-generated.
   - Click "Convert to Invoice" when approved.

### 🟠 Technician Workflow
1. **Clock-In**: Select the assigned Job Card.
2. **Track Time**: Click "Start Timer" for accurate billing.
3. **Parts Request**: If new parts are needed, request via the app (decrements Inventory).
4. **Completion**: Mark job as "Ready for QC".

### 🔵 Supply Chain (Manager)
1. **Low Stock**: Check **Inventory** for red "Low Stock" alerts.
2. **Network**: Use the **Network Explorer** to find a wholesaler.
   - Filter by "Spare Parts" + "Hargeisa".
   - Look for the **Green Verified Badge**.
3. **Purchase Order**: Create a PO in the system to track the incoming stock.

---

## 🔐 4. Data & Compliance

### Gold Standard Data
- The system includes **50+ Verified Wholesalers** (seeded Jan 2026).
- **Source**: `gold_standard` tag indicates manual verification.
- **API**: `api_import` tag indicates data from scraping/enrichment.

### Financial Integrity
- **No Deletions**: Invoices cannot be deleted, only "Voided" (audit trail).
- **Split Payments**: Accept partial Zaad + partial Cash for a single invoice.

---

## 🆘 5. Support & Maintenance

**Developer Contacts:**
- **Lead Engineer**: M2 Creative
- **Tech Stack**: Next.js 15, Convex, TypeScript.

**Common Commands:**
- `npm run dev`: Start local operational server.
- `npx convex dashboard`: Open database UI.
- `npx convex deploy`: Push new database structure.
