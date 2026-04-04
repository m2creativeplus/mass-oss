"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, Wrench, Users, Monitor, Search, Wallet, 
  Activity, Cpu, WifiOff, Wifi, BrainCircuit, Bell,
  CheckCircle, ArrowRight, PlaySquare, FileText, UploadCloud, Server
} from "lucide-react";

type Role = "Owner" | "Advisor" | "Mechanic" | "Customer" | "Government";

const ROLES: Role[] = ["Owner", "Advisor", "Mechanic", "Customer", "Government"];

const JOB_FLOW = [
  { id: "checkin", name: "Vehicle Check-in" },
  { id: "ai_diag", name: "AI Diagnosis" },
  { id: "wo", name: "Work Order Creation" },
  { id: "assign", name: "Mechanic Assignment" },
  { id: "repair", name: "Repair Execution" },
  { id: "proof", name: "Upload Proof" },
  { id: "approval", name: "Customer Approval" },
  { id: "payment", name: "Mass Pay" },
  { id: "complete", name: "Job Complete" },
];

export function MassOsSimulator() {
  const [role, setRole] = useState<Role>("Advisor");
  const [isOffline, setIsOffline] = useState(false);
  const [offlineQueue, setOfflineQueue] = useState<string[]>([]);
  const [currentJobStep, setCurrentJobStep] = useState(0);
  const [aiPanelOpen, setAiPanelOpen] = useState(true);

  // Helper to trigger actions that might queue offline
  const handleAction = (actionName: string) => {
    if (isOffline) {
      setOfflineQueue(prev => [...prev, actionName]);
    } else {
      // Execute immediately (simulate)
      if (actionName.includes("Advance Workflow") && currentJobStep < JOB_FLOW.length - 1) {
        setCurrentJobStep(s => s + 1);
      }
    }
  };

  const syncOffline = () => {
    setIsOffline(false);
    if (offlineQueue.length > 0) {
      // Simulate sync playing out the queued events
      const queue = [...offlineQueue];
      setOfflineQueue([]);
      // Just advance workflow if there were workflow things in queue
      const advances = queue.filter(q => q.includes("Advance Workflow")).length;
      if (advances > 0) {
        setCurrentJobStep(s => Math.min(s + advances, JOB_FLOW.length - 1));
      }
    }
  };

  // Visibility logic (RBX)
  const canSeeFinance = role === "Owner" || role === "Advisor";
  const canSeeKanban = role === "Mechanic" || role === "Advisor" || role === "Owner";
  const canSeeCustomerView = role === "Customer";
  const canSeeGovView = role === "Government";

  return (
    <div className="flex h-[800px] w-full rounded-2xl border border-zinc-800 bg-zinc-950 overflow-hidden relative shadow-2xl shadow-black">
      
      {/* SIDEBAR: RBX MODULES */}
      <div className="w-64 border-r border-zinc-800 bg-zinc-900/50 p-4 flex flex-col z-20">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white tracking-tighter flex items-center gap-2">
            MASS OS <span className="text-orange-500">v5</span>
          </h2>
          <p className="text-xs text-zinc-500 mt-1 uppercase tracking-widest">{role} VIEW</p>
        </div>

        {/* Role Switcher */}
        <div className="mb-8">
          <p className="text-xs font-semibold text-zinc-500 mb-2 uppercase">RBX Switcher</p>
          <div className="flex flex-col gap-1">
            {ROLES.map(r => (
              <button 
                key={r}
                onClick={() => setRole(r)}
                className={`text-left px-3 py-2 rounded-lg text-sm transition-colors ${role === r ? "bg-orange-500/10 text-orange-500 font-medium border border-orange-500/20" : "text-zinc-400 hover:text-white"}`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Module Guarding based on RBX */}
        <div className="flex-1 overflow-y-auto">
          <p className="text-xs font-semibold text-zinc-500 mb-2 uppercase">Modules</p>
          <ul className="space-y-1">
             {(role === "Owner" || role === "Advisor") && <SidebarItem icon={Activity} label="Dashboard" />}
             {canSeeKanban && <SidebarItem icon={Wrench} label="Live Jobs" badge="12" />}
             {(role === "Owner" || role === "Advisor") && <SidebarItem icon={Users} label="Customers" />}
             {canSeeFinance && <SidebarItem icon={Wallet} label="MASS Pay" />}
             {canSeeGovView && <SidebarItem icon={Shield} label="Compliance Audit" />}
             {canSeeCustomerView && <SidebarItem icon={Monitor} label="My Garage" />}
          </ul>
        </div>

        {/* Connectivity Toggle */}
        <div className="mt-auto pt-4 border-t border-zinc-800">
          <button 
            onClick={() => isOffline ? syncOffline() : setIsOffline(true)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
              isOffline ? "bg-red-500/10 border-red-500/30 text-red-500 animate-pulse" : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white"
            }`}
          >
            {isOffline ? (
              <><span className="flex items-center gap-2"><WifiOff className="w-4 h-4"/> Offline Mode</span> <span>Sync?</span></>
            ) : (
              <><span className="flex items-center gap-2"><Wifi className="w-4 h-4"/> Online Sync</span> <span>MCL Active</span></>
            )}
          </button>
        </div>
      </div>

      {/* MAIN DASHBOARD AREA */}
      <div className="flex-1 flex flex-col relative z-20">
        {/* Top bar */}
        <header className="h-16 border-b border-zinc-800 flex items-center justify-between px-6 bg-zinc-900/50">
          <div className="flex items-center gap-4">
             {isOffline && offlineQueue.length > 0 && (
               <div className="px-3 py-1 rounded bg-orange-500/20 border border-orange-500/50 text-orange-500 text-xs font-medium flex items-center gap-2">
                 <Server className="w-3 h-3" /> Queued Actions: {offlineQueue.length}
               </div>
             )}
          </div>
          <div className="flex items-center gap-4 text-zinc-400">
            <Search className="w-5 h-5 hover:text-white cursor-pointer" />
            <Bell className="w-5 h-5 hover:text-white cursor-pointer" />
          </div>
        </header>

        {/* Dynamic Content Body */}
        <div className="flex-1 p-6 overflow-y-auto bg-zinc-950">
           
           {/* ADVISOR / OWNER VIEW */}
           {(role === "Advisor" || role === "Owner") && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <KpiCard title="Live Revenue today" value="$4,250" trend="+12.5%" />
                  <KpiCard title="Vehicles in Queue" value="8" sub="2 High Priority" />
                  <KpiCard title="Avg Repair Time" value="2.4 Hrs" trend="-0.2 Hrs" />
                </div>
                
                <h3 className="text-lg font-bold text-white mt-8 mb-4">Job Flow Engine (Interactive)</h3>
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-8">
                     {JOB_FLOW.map((step, idx) => (
                       <div key={idx} className="flex flex-col items-center gap-2 relative z-10 w-full">
                         <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors border-2 ${
                           idx < currentJobStep ? "bg-orange-500 border-orange-500 text-white" :
                           idx === currentJobStep ? "bg-zinc-900 border-orange-500 text-orange-500 ring-4 ring-orange-500/20" :
                           "bg-zinc-900 border-zinc-700 text-zinc-600"
                         }`}>
                           {idx < currentJobStep ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                         </div>
                         <span className={`text-[10px] text-center max-w-[80px] leading-tight ${idx <= currentJobStep ? "text-zinc-300" : "text-zinc-600"}`}>
                           {step.name}
                         </span>
                         {idx < JOB_FLOW.length - 1 && (
                           <div className={`absolute top-4 left-[50%] w-full h-[2px] -z-10 ${idx < currentJobStep ? "bg-orange-500" : "bg-zinc-800"}`} />
                         )}
                       </div>
                     ))}
                  </div>

                  <div className="flex justify-between items-center bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                    <div>
                      <h4 className="text-white font-medium">Currently: {JOB_FLOW[currentJobStep].name}</h4>
                      <p className="text-sm text-zinc-400">Proceed to next workflow step in the MCL.</p>
                    </div>
                    <button 
                      onClick={() => handleAction(`Advance Workflow to ${JOB_FLOW[currentJobStep+1]?.name}`)}
                      disabled={currentJobStep >= JOB_FLOW.length - 1}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg disabled:opacity-50 transition-colors flex items-center gap-2"
                    >
                      Process Action <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
             </motion.div>
           )}

           {/* MECHANIC VIEW */}
           {role === "Mechanic" && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6">
                <h3 className="text-lg font-bold text-white mb-4">My Bay Pipeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col gap-4 border-l-4 border-l-orange-500 shadow-lg shadow-black/20">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-white font-medium">Toyota Hilux - Plate 45192</h4>
                        <p className="text-xs text-orange-500 font-medium">URGENT • AI Diagnosed</p>
                      </div>
                      <div className="p-2 bg-zinc-800 rounded text-zinc-300 bg-orange-500/10"><Wrench className="w-4 h-4 text-orange-500"/></div>
                    </div>
                    <p className="text-sm text-zinc-400 border-t border-zinc-800 pt-3">
                      <strong>AI Suggestion:</strong> Replace front brake pads. 95% confidence based on sensor OBD-II data and auditory scan.
                    </p>
                    <div className="flex gap-2 mt-auto pt-2">
                       <button onClick={() => handleAction("Upload Proof: Hilux")} className="flex-1 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-sm text-zinc-300 border border-zinc-700 flex items-center justify-center gap-2">
                         <UploadCloud className="w-4 h-4" /> Media Proof
                       </button>
                       <button onClick={() => handleAction("Complete Repair: Hilux")} className="flex-1 py-2 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium">
                         Finish Rep
                       </button>
                    </div>
                  </div>
                </div>
             </motion.div>
           )}

           {/* CUSTOMER VIEW */}
           {role === "Customer" && (
             <motion.div initial={{opacity:0}} animate={{opacity:1}} className="space-y-6 max-w-md mx-auto">
                <div className="bg-zinc-900 border border-orange-500/30 rounded-2xl p-6 relative overflow-hidden shadow-xl">
                  <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Shield className="w-24 h-24 text-orange-500" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-1 relative z-10">MASS Protect</h3>
                  <p className="text-sm text-zinc-400 mb-6 relative z-10">Vehicle Tracking: Toyota Land Cruiser</p>
                  
                  <div className="space-y-4 relative z-10">
                    <div className="p-4 rounded-xl bg-orange-500/10 border border-orange-500/30">
                      <h4 className="text-orange-500 font-medium text-sm flex items-center gap-2">
                         <CheckCircle className="w-4 h-4" /> Action Required
                      </h4>
                      <p className="text-zinc-300 text-sm mt-1 mb-3">AI diagnostic complete. New brake pads required ($150). Do you approve?</p>
                      <button onClick={() => handleAction("Customer Approved Quotation")} className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg font-medium shadow-lg shadow-orange-500/20">
                        Approve via eDahab
                      </button>
                    </div>
                  </div>
                </div>
             </motion.div>
           )}

        </div>
      </div>

      {/* FLOATING MIL (MASS INTELLIGENCE LAYER) PANEL */}
      <AnimatePresence>
        {aiPanelOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="absolute top-4 right-4 w-80 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl z-50 overflow-hidden flex flex-col"
          >
            <div className="bg-zinc-950 border-b border-zinc-800 p-3 flex items-center justify-between cursor-pointer" onClick={() => setAiPanelOpen(false)}>
              <div className="flex items-center gap-2 text-orange-500 font-bold text-sm tracking-widest uppercase">
                <BrainCircuit className="w-4 h-4" /> MIL Core
              </div>
              <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
            </div>
            <div className="p-4 space-y-4">
               {role === "Advisor" && (
                 <>
                   <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                     <p className="text-xs text-zinc-400 mb-1">PREDICTIVE OPTIMIZATION</p>
                     <p className="text-sm text-zinc-300 font-medium">Assign Ahmed to Land Cruiser. He is 24% faster at Brake Pad replacement than shop average.</p>
                     <button className="mt-2 text-xs text-orange-500 font-medium hover:underline">Auto-Assign</button>
                   </div>
                   <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                     <p className="text-xs text-zinc-400 mb-1">PARTS CACHE</p>
                     <p className="text-sm text-zinc-300 font-medium">Brake pad inventory running low (2 left). Re-order suggested.</p>
                   </div>
                 </>
               )}
               {role === "Mechanic" && (
                 <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                   <p className="text-xs text-zinc-400 mb-1">DIAGNOSTIC AI</p>
                   <p className="text-sm text-zinc-300 font-medium">Given the noise profile, check the rotor wear. Often associated with current symptom.</p>
                 </div>
               )}
               {role === "Customer" && (
                 <div className="p-3 bg-zinc-950 rounded-lg border border-zinc-800">
                   <p className="text-xs text-zinc-400 mb-1">MARKET INTELLIGENCE</p>
                   <p className="text-sm text-zinc-300 font-medium">Your quote is competitive. Average market rate: $165.</p>
                 </div>
               )}
               {isOffline && (
                 <div className="p-3 bg-zinc-950 rounded-lg border border-red-500/30">
                   <p className="text-xs text-red-500 mb-1">NETWORK LOST</p>
                   <p className="text-sm text-red-400">Offline Queue active. Actions will be logged to IndexedDB.</p>
                 </div>
               )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle for AI Panel if closed */}
      {!aiPanelOpen && (
        <button 
          onClick={() => setAiPanelOpen(true)}
          className="absolute bottom-6 right-6 w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-500/20 z-50 hover:bg-orange-600 transition-colors"
        >
          <BrainCircuit className="w-6 h-6" />
        </button>
      )}

      {/* Grid Pattern Background fixed behind all */}
      <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03] pointer-events-none z-0" />
    </div>
  );
}

function SidebarItem({ icon: Icon, label, badge }: { icon: any, label: string, badge?: string }) {
  return (
    <li className="flex items-center justify-between px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer border border-transparent hover:border-zinc-700">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 opacity-70" /> {label}
      </div>
      {badge && <span className="bg-orange-500/20 text-orange-500 px-2 py-0.5 rounded text-xs px-1.5">{badge}</span>}
    </li>
  );
}

function KpiCard({ title, value, trend, sub }: { title: string, value: string, trend?: string, sub?: string }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex flex-col hover:border-orange-500/30 transition-colors shadow-lg shadow-black/20">
      <p className="text-zinc-400 text-xs font-medium uppercase tracking-wider mb-2">{title}</p>
      <div className="flex items-end gap-2 mt-auto">
        <span className="text-3xl font-bold text-white">{value}</span>
        {trend && <span className={`text-sm mb-1 ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>{trend}</span>}
        {sub && <span className="text-xs text-orange-500 font-medium mb-1">{sub}</span>}
      </div>
    </div>
  );
}
