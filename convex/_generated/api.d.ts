/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as aiContent from "../aiContent.js";
import type * as appointments from "../appointments.js";
import type * as automotivePoisstakeholderNetwork from "../automotivePoisstakeholderNetwork.js";
import type * as cannedJobsprebuiltServicePackages from "../cannedJobsprebuiltServicePackages.js";
import type * as cms from "../cms.js";
import type * as customerApprovalsdigitalSignatures from "../customerApprovalsdigitalSignatures.js";
import type * as customers from "../customers.js";
import type * as dashboardStats from "../dashboardStats.js";
import type * as deliveriesfromWorkOrdersMarkedAsComplete from "../deliveriesfromWorkOrdersMarkedAsComplete.js";
import type * as directives from "../directives.js";
import type * as dviResultscompletedInspections from "../dviResultscompletedInspections.js";
import type * as engines from "../engines.js";
import type * as estimates from "../estimates.js";
import type * as financialIntegrityschema from "../financialIntegrityschema.js";
import type * as functions from "../functions.js";
import type * as helpers from "../helpers.js";
import type * as ingestion from "../ingestion.js";
import type * as inspectionTemplatestekmetricstyleDvi from "../inspectionTemplatestekmetricstyleDvi.js";
import type * as inspections from "../inspections.js";
import type * as intelligence from "../intelligence.js";
import type * as inventorywithStockTracking from "../inventorywithStockTracking.js";
import type * as invoices from "../invoices.js";
import type * as laborGuide from "../laborGuide.js";
import type * as marketPriceIntelligence from "../marketPriceIntelligence.js";
import type * as massPartnersbbNetwork from "../massPartnersbbNetwork.js";
import type * as operationsschema from "../operationsschema.js";
import type * as partRequests from "../partRequests.js";
import type * as pos from "../pos.js";
import type * as reminders from "../reminders.js";
import type * as salesPos from "../salesPos.js";
import type * as seed from "../seed.js";
import type * as seedCms from "../seedCms.js";
import type * as seedDemo from "../seedDemo.js";
import type * as seedWorkshop from "../seedWorkshop.js";
import type * as seeding from "../seeding.js";
import type * as settingssaasAdmin from "../settingssaasAdmin.js";
import type * as sparePartsMastertoyotasuzukiCatalog from "../sparePartsMastertoyotasuzukiCatalog.js";
import type * as suppliers from "../suppliers.js";
import type * as supplyChainschema from "../supplyChainschema.js";
import type * as techniciansusersWithTechnicianRole from "../techniciansusersWithTechnicianRole.js";
import type * as users from "../users.js";
import type * as vehicles from "../vehicles.js";
import type * as workOrders from "../workOrders.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiContent: typeof aiContent;
  appointments: typeof appointments;
  automotivePoisstakeholderNetwork: typeof automotivePoisstakeholderNetwork;
  cannedJobsprebuiltServicePackages: typeof cannedJobsprebuiltServicePackages;
  cms: typeof cms;
  customerApprovalsdigitalSignatures: typeof customerApprovalsdigitalSignatures;
  customers: typeof customers;
  dashboardStats: typeof dashboardStats;
  deliveriesfromWorkOrdersMarkedAsComplete: typeof deliveriesfromWorkOrdersMarkedAsComplete;
  directives: typeof directives;
  dviResultscompletedInspections: typeof dviResultscompletedInspections;
  engines: typeof engines;
  estimates: typeof estimates;
  financialIntegrityschema: typeof financialIntegrityschema;
  functions: typeof functions;
  helpers: typeof helpers;
  ingestion: typeof ingestion;
  inspectionTemplatestekmetricstyleDvi: typeof inspectionTemplatestekmetricstyleDvi;
  inspections: typeof inspections;
  intelligence: typeof intelligence;
  inventorywithStockTracking: typeof inventorywithStockTracking;
  invoices: typeof invoices;
  laborGuide: typeof laborGuide;
  marketPriceIntelligence: typeof marketPriceIntelligence;
  massPartnersbbNetwork: typeof massPartnersbbNetwork;
  operationsschema: typeof operationsschema;
  partRequests: typeof partRequests;
  pos: typeof pos;
  reminders: typeof reminders;
  salesPos: typeof salesPos;
  seed: typeof seed;
  seedCms: typeof seedCms;
  seedDemo: typeof seedDemo;
  seedWorkshop: typeof seedWorkshop;
  seeding: typeof seeding;
  settingssaasAdmin: typeof settingssaasAdmin;
  sparePartsMastertoyotasuzukiCatalog: typeof sparePartsMastertoyotasuzukiCatalog;
  suppliers: typeof suppliers;
  supplyChainschema: typeof supplyChainschema;
  techniciansusersWithTechnicianRole: typeof techniciansusersWithTechnicianRole;
  users: typeof users;
  vehicles: typeof vehicles;
  workOrders: typeof workOrders;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
