"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Server, Cpu, Globe, Database, Shield, Zap, Layers, Combine, Map as MapIcon, 
  Smartphone, Monitor, Search, Lock, Users, Activity, Settings, Workflow, 
  Wallet, Truck, ShoppingCart, Wrench, AppWindow, PlaySquare, ArrowRight, Network, WifiOff
} from "lucide-react";

// --- Data Models ---
const sitemap = [
  { path: "/", name: "Public Entry", icon: Globe },
  { path: "/login", name: "Auth & RBX", icon: Lock },
  { path: "/dashboard", name: "RBX 2.0 Dash", icon: Monitor },
  { path: "/dashboard/jobs", name: "Job Board", icon: Wrench },
  { path: "/dashboard/vehicles", name: "Vehicles", icon: Truck },
  { path: "/dashboard/customers", name: "Customers", icon: Users },
  { path: "/dashboard/inspections", name: "AutoFlow Layer", icon: Search },
  { path: "/dashboard/inventory", name: "Inventory Stock", icon: ShoppingCart },
  { path: "/dashboard/pos", name: "MASS Pay", icon: Wallet },
  { path: "/dashboard/reports", name: "KPI Analytics", icon: Activity },
  { path: "/dashboard/ai-tools", name: "MIL Panels", icon: Cpu },
  { path: "/admin", name: "National Gov Dash", icon: Shield },
];

const layers = [
  {
    id: "user",
    title: "User Layer (RBX Experience)",
    desc: "Role-Based Access Experience",
    color: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    nodes: ["Workshop Owner", "Service Advisor", "Mechanic", "Customer", "Government/Fleet"]
  },
  {
    id: "interface",
    title: "Frontend Interface (Next.js)",
    desc: "React / PWA Delivery",
    color: "bg-blue-500/10 border-blue-500/30 text-blue-400",
    nodes: ["Dashboard RBX UI", "Mobile App / PWA", "MASS Protect App"]
  },
  {
    id: "mcl",
    title: "MASS Control Layer (MCL)",
    desc: "Core Business Logic",
    color: "bg-purple-500/10 border-purple-500/30 text-purple-400",
    nodes: ["RBX Engine", "API Layer", "Server Actions", "Event Bus System"]
  },
  {
    id: "mil",
    title: "MASS Intelligence Layer (MIL)",
    desc: "Agentic AI Operations",
    color: "bg-red-500/10 border-red-500/30 text-red-400",
    nodes: ["Diagnostic AI", "Pricing AI", "Fraud Detection AI", "Workflow AI", "Market Intelligence"]
  },
  {
    id: "backend",
    title: "Convex Core Backend",
    desc: "Real-time Database",
    color: "bg-orange-500/10 border-orange-500/30 text-orange-400",
    nodes: ["Users/Orgs", "Work Orders / Vehicles", "Inventory / Pricing", "Audit Logs / Payments"]
  },
  {
    id: "offline",
    title: "Offline Sync Engine",
    desc: "Low-Bandwidth Resilience",
    color: "bg-slate-500/10 border-slate-500/30 text-slate-400",
    nodes: ["Local IndexedDB", "Sync Queue", "Conflict Resolver"]
  },
  {
    id: "external",
    title: "External Integrations",
    desc: "Third-party APIs",
    color: "bg-zinc-500/10 border-zinc-500/30 text-zinc-400",
    nodes: ["OBD-II Microservice", "ZAAD / eDahab", "WhatsApp API", "Media Storage"]
  }
];

const engines = [
  { name: "Job Flow Engine", desc: "Tracks check-in → repair → payment", icon: Workflow },
  { name: "Auto Scheduler", desc: "Smart assignment of techs & bays", icon: Server },
  { name: "KPI Intelligence", desc: "Throughput & repair time analytics", icon: Activity },
  { name: "Predictive Optimization", desc: "Predicts bottlenecks & delays", icon: Zap },
  { name: "Offline Engine", desc: "Local caching & conflict resolution", icon: WifiOff },
];

export function SystemBlueprint() {
  const [activeTab, setActiveTab] = useState<"architecture" | "sitemap" | "engines">("architecture");

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-slate-800">
        {[{ id: "architecture", label: "Architecture Flow", icon: Network },
          { id: "sitemap", label: "Unified Sitemap", icon: Layers },
          { id: "engines", label: "Core Engines", icon: Cpu }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors relative ${
              activeTab === tab.id ? "text-red-500" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="min-h-[600px]">
        <AnimatePresence mode="wait">
          
          {/* ARCHITECTURE VIEW */}
          {activeTab === "architecture" && (
            <motion.div
              key="architecture"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col gap-8"
            >
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Visual Flow diagram container */}
                <div className="col-span-1 lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-6 md:p-10 relative overflow-hidden">
                  <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.05]" />
                  <h3 className="text-xl font-semibold text-white mb-8 relative z-10 flex items-center gap-2">
                    <Network className="w-5 h-5 text-red-500" /> 
                    Data Flow Topology
                  </h3>
                  
                  <div className="flex flex-col gap-6 relative z-10 w-full max-w-2xl mx-auto">
                    {/* Render visual layers like a stack */}
                    {layers.slice(0,5).map((layer, idx) => (
                      <div key={layer.id} className="relative">
                        {idx > 0 && (
                          <div className="absolute -top-6 left-1/2 -ml-px w-0.5 h-6 bg-gradient-to-b from-slate-700 to-transparent" />
                        )}
                        <div className={`p-5 rounded-xl border backdrop-blur-sm ${layer.color}`}>
                          <div className="text-sm font-bold uppercase tracking-wider mb-1">{layer.title}</div>
                          <div className="text-xs opacity-70 mb-4">{layer.desc}</div>
                          <div className="flex flex-wrap gap-2">
                            {layer.nodes.map(node => (
                              <span key={node} className="px-2 py-1 bg-black/20 rounded text-xs">
                                {node}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Side blocks for Offline / Externals */}
                <div className="col-span-1 flex flex-col gap-6">
                  {layers.slice(5).map(layer => (
                    <div key={layer.id} className={`p-6 rounded-2xl border backdrop-blur-sm ${layer.color}`}>
                       <h3 className="text-lg font-semibold mb-2">{layer.title}</h3>
                       <p className="text-sm opacity-80 mb-6">{layer.desc}</p>
                       <ul className="space-y-3">
                         {layer.nodes.map(node => (
                           <li key={node} className="flex items-center gap-2 text-sm bg-black/20 p-2 rounded">
                             <div className="w-1.5 h-1.5 rounded-full bg-current opacity-50" />
                             {node}
                           </li>
                         ))}
                       </ul>
                    </div>
                  ))}

                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mt-auto">
                    <h4 className="text-sm font-semibold text-slate-300 mb-4 uppercase tracking-wider">Flow Connections</h4>
                    <div className="text-xs text-slate-500 space-y-2">
                      <p>• UI ↔️ MCL ↔️ Convex Backend</p>
                      <p>• MCL ↔️ MIL (AI Processing)</p>
                      <p>• UI ↔️ Offline Engine ↔️ Backend</p>
                      <p>• Backend ↔️ External APIs</p>
                    </div>
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* SITEMAP VIEW */}
          {activeTab === "sitemap" && (
            <motion.div
              key="sitemap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {sitemap.map((route, i) => (
                <div key={route.path} className="flex items-start gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-red-500/20 group-hover:text-red-400 transition-colors">
                    <route.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-white font-medium mb-1">{route.name}</h4>
                    <code className="text-xs text-slate-500 tracking-wider">
                      {route.path}
                    </code>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {/* ENGINES VIEW */}
          {activeTab === "engines" && (
            <motion.div
              key="engines"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {engines.map((engine, i) => (
                  <div key={engine.name} className="relative group p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900 border border-slate-800 hover:border-red-500/50 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl pointer-events-none" />
                    <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center mb-6 text-slate-300 group-hover:text-red-400 group-hover:scale-110 transition-all duration-300">
                      <engine.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{engine.name}</h3>
                    <p className="text-sm text-slate-400">{engine.desc}</p>
                    
                    <div className="mt-6 flex items-center text-xs font-semibold text-red-500 opacity-0 group-hover:opacity-100 transition-opacity translate-x-[-10px] group-hover:translate-x-0 duration-300">
                       SYSTEM ACTIVE <ArrowRight className="w-3 h-3 ml-1" />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
