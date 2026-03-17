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
import type * as cms from "../cms.js";
import type * as directives from "../directives.js";
import type * as engines from "../engines.js";
import type * as functions from "../functions.js";
import type * as helpers from "../helpers.js";
import type * as ingestion from "../ingestion.js";
import type * as partRequests from "../partRequests.js";
import type * as seed from "../seed.js";
import type * as seedCms from "../seedCms.js";
import type * as seedDemo from "../seedDemo.js";
import type * as seedWorkshop from "../seedWorkshop.js";
import type * as seeding from "../seeding.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  aiContent: typeof aiContent;
  cms: typeof cms;
  directives: typeof directives;
  engines: typeof engines;
  functions: typeof functions;
  helpers: typeof helpers;
  ingestion: typeof ingestion;
  partRequests: typeof partRequests;
  seed: typeof seed;
  seedCms: typeof seedCms;
  seedDemo: typeof seedDemo;
  seedWorkshop: typeof seedWorkshop;
  seeding: typeof seeding;
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
