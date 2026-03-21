// ============================================================
// MASS Car Workshop - Central Function Router
// Automatically split into domain files for maintainability.
// Do not add large logic here. Instead, create a domain file and re-export.
// ============================================================

export { getUsers, getUserByEmail, createUser, getUserOrgs } from "./users";
export { getCustomers, getCustomerById, addCustomer, updateCustomer, deleteCustomer } from "./customers";
export { getVehicles, getVehiclesByCustomer, addVehicle, updateVehicle, deleteVehicle } from "./vehicles";
export { getSuppliers, addSupplier } from "./suppliers";
export { getInventory, getInventoryByCategory, getLowStockItems, addInventoryItem, updateInventoryQuantity } from "./inventorywithStockTracking";
export { getLaborGuide, addLaborOperation } from "./laborGuide";
export { getAppointments, getAppointmentsByDate, createAppointment, deleteAppointment } from "./appointments";
export { getWorkOrders, getWorkOrdersByStatus, createWorkOrder, updateWorkOrderStatus, deleteWorkOrder } from "./workOrders";
export { getInspections, getInspectionById, updateInspectionItem, updateInspectionStatus, createInspection } from "./inspections";
export { getEstimates, getEstimateById, createEstimate, updateEstimateStatus } from "./estimates";
export { getInvoices, getInvoiceById, updateInvoiceStatus, createInvoiceFromEstimate } from "./invoices";
export { getSales, getSalesToday, createSale } from "./salesPos";
export { getReminders, getPendingReminders, createReminder } from "./reminders";
export { getDashboardStats } from "./dashboardStats";
export { getTechnicians } from "./techniciansusersWithTechnicianRole";
export { getDeliveries } from "./deliveriesfromWorkOrdersMarkedAsComplete";
export { getAutomotivePois, getPoisByCity, getPoisByCategory, addAutomotivePoi } from "./automotivePoisstakeholderNetwork";
export { getSparePartsMaster, getPartsByCategory, getPartsByModel, getSteeringSideCriticalParts, addSparePart } from "./sparePartsMastertoyotasuzukiCatalog";
export { getMarketPrices, getPricesByMake, addMarketPrice } from "./marketPriceIntelligence";
export { getMassPartners, getPartnersByCity, getPartnersByStatus, addMassPartner } from "./massPartnersbbNetwork";
export { getPaymentsByInvoice, addPayment, getExpenses, addExpense, getExpenseCategories, addExpenseCategory } from "./financialIntegrityschema";
export { getPurchaseOrders, createPurchaseOrder, receivePurchaseOrder, getInventoryAdjustments, adjustStock } from "./supplyChainschema";
export { getServicePackages, createServicePackage, getTechnicianTimes, clockIn, clockOut } from "./operationsschema";
export { getInspectionTemplates, getDefaultTemplate, createInspectionTemplate, updateInspectionTemplate } from "./inspectionTemplatestekmetricstyleDvi";
export { getCannedJobs, getCannedJobsByCategory, createCannedJob, updateCannedJob } from "./cannedJobsprebuiltServicePackages";
export { createCustomerApproval, getApprovalByToken, approveEstimate } from "./customerApprovalsdigitalSignatures";
export { getDviByWorkOrder, startDvi, updateDviFinding, completeDvi, sendDviToCustomer } from "./dviResultscompletedInspections";
export { getOrgSettings, updateOrgSettings } from "./settingssaasAdmin";
export { seedDemoUsers } from "./seeding";
export { processCheckout } from "./pos";
export { getChartStats } from "./dashboardStats";
export { getSAIPMarketPrices, checkVinRegistry, getSAIPAnalytics } from "./intelligence";
