"use client"

import { useState } from "react"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Wrench,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Package,
  Zap,
  BarChart3,
  Timer,
  TrendingUp,
} from "lucide-react"

export function LiveWorkshopBoard({ orgId = "mass-hargeisa" }: { orgId?: string }) {
  const workOrders = useQuery(api.functions.getWorkOrders, { orgId })
  const users = useQuery(api.functions.getUsers)
  const kpis = useQuery(api.engines.advancedKPIs, { orgId })

  const autoAssign = useMutation(api.engines.autoAssignJob)
  const markPartsReq = useMutation(api.engines.markPartsRequested)
  const markPartsRcv = useMutation(api.engines.markPartsReceived)
  const moveToQC = useMutation(api.engines.moveToQualityCheck)
  const completeJob = useMutation(api.engines.completeJob)
  const approveStart = useMutation(api.engines.approveAndStart)

  const [busy, setBusy] = useState<string | null>(null)

  const technicians = (users || []).filter((u) => u.role === "technician")
  const jobs = workOrders || []

  const run = async (jobId: string, fn: () => Promise<unknown>) => {
    setBusy(jobId)
    try {
      await fn()
    } catch (e) {
      console.error(e)
    } finally {
      setBusy(null)
    }
  }

  const columns = [
    { key: "check-in", label: "Check-In", icon: <Clock className="h-4 w-4" />, color: "bg-slate-500" },
    { key: "diagnosis", label: "Diagnosis", icon: <Wrench className="h-4 w-4" />, color: "bg-indigo-500" },
    { key: "awaiting-approval", label: "Awaiting Approval", icon: <AlertTriangle className="h-4 w-4" />, color: "bg-amber-500" },
    { key: "in-progress", label: "In Progress", icon: <Zap className="h-4 w-4" />, color: "bg-blue-600" },
    { key: "waiting-parts", label: "Waiting Parts", icon: <Package className="h-4 w-4" />, color: "bg-rose-500" },
    { key: "quality-check", label: "Quality Check", icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-teal-500" },
    { key: "complete", label: "Complete", icon: <CheckCircle2 className="h-4 w-4" />, color: "bg-emerald-500" },
  ]

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-600 text-[10px] px-1.5">URGENT</Badge>
      case "high":
        return <Badge className="bg-orange-500 text-[10px] px-1.5">HIGH</Badge>
      case "normal":
        return <Badge className="bg-blue-500 text-[10px] px-1.5">NORMAL</Badge>
      default:
        return (
          <Badge variant="outline" className="text-[10px] px-1.5">
            LOW
          </Badge>
        )
    }
  }

  const getTechName = (techId: string | undefined) => {
    if (!techId) return "Unassigned"
    const tech = technicians.find((t) => t._id === techId)
    return tech ? `${tech.firstName} ${tech.lastName}` : "Unknown"
  }

  return (
    <div className="h-full flex flex-col bg-slate-50 dark:bg-slate-950 p-4">
      {/* KPI Top Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <BarChart3 className="h-3.5 w-3.5" /> Throughput
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {kpis?.throughput ?? 0}
          </div>
          <div className="text-[10px] text-slate-400">Jobs completed</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Timer className="h-3.5 w-3.5" /> Avg Repair
          </div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">
            {Math.round(kpis?.avgRepairTimeMinutes ?? 0)}m
          </div>
          <div className="text-[10px] text-slate-400">Minutes per job</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <Package className="h-3.5 w-3.5" /> Parts Delay
          </div>
          <div
            className={`text-2xl font-bold ${
              (kpis?.avgPartsDelayMinutes ?? 0) > 60
                ? "text-rose-500"
                : "text-slate-900 dark:text-white"
            }`}
          >
            {Math.round(kpis?.avgPartsDelayMinutes ?? 0)}m
          </div>
          <div className="text-[10px] text-slate-400">Avg delay (minutes)</div>
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-4 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <TrendingUp className="h-3.5 w-3.5" /> Revenue
          </div>
          <div className="text-2xl font-bold text-emerald-600">
            ${(kpis?.totalRevenueToday ?? 0).toLocaleString()}
          </div>
          <div className="text-[10px] text-slate-400">Total invoiced</div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto">
        <div className="flex gap-3 min-w-max pb-4" style={{ minHeight: 400 }}>
          {columns.map((col) => {
            const colJobs = jobs.filter((j) => j.status === col.key)
            return (
              <div key={col.key} className="w-64 flex-shrink-0 flex flex-col">
                {/* Column Header */}
                <div
                  className={`${col.color} text-white rounded-t-lg px-3 py-2 flex items-center justify-between`}
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    {col.icon} {col.label}
                  </div>
                  <Badge className="bg-white/20 text-white text-[10px]">
                    {colJobs.length}
                  </Badge>
                </div>

                {/* Column Body */}
                <div className="bg-slate-100 dark:bg-slate-900/50 flex-1 rounded-b-lg border border-t-0 border-slate-200 dark:border-slate-800 p-2 space-y-2 overflow-y-auto max-h-[500px]">
                  {colJobs.length === 0 && (
                    <div className="text-center text-xs text-slate-400 py-8">
                      No jobs
                    </div>
                  )}
                  {colJobs.map((job) => (
                    <div
                      key={job._id}
                      className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                          #{job.jobNumber}
                        </span>
                        {getPriorityBadge(job.priority)}
                      </div>

                      <div className="text-[11px] text-slate-500 space-y-1">
                        <div className="flex items-center gap-1">
                          <Wrench className="h-3 w-3" />
                          <span className="truncate">
                            {job.services?.[0] || "Service"}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="font-medium text-slate-700 dark:text-slate-300">
                            Tech: {getTechName(job.technicianId)}
                          </span>
                        </div>
                        {col.key === "complete" && job.totalAmount ? (
                          <div className="text-emerald-600 font-bold text-xs">
                            ${job.totalAmount.toLocaleString()}
                          </div>
                        ) : null}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-1 mt-2 pt-2 border-t border-slate-100 dark:border-slate-700 flex-wrap">
                        {col.key === "check-in" && (
                          <Button
                            size="sm"
                            disabled={busy === job._id}
                            className="h-6 text-[10px] bg-indigo-500 hover:bg-indigo-600 text-white flex-1"
                            onClick={() =>
                              run(job._id, () =>
                                autoAssign({
                                  workOrderId: job._id as any,
                                  orgId,
                                })
                              )
                            }
                          >
                            <Zap className="h-3 w-3 mr-1" />
                            {busy === job._id ? "..." : "Auto-Assign"}
                          </Button>
                        )}
                        {col.key === "awaiting-approval" && (
                          <Button
                            size="sm"
                            disabled={busy === job._id}
                            className="h-6 text-[10px] bg-blue-600 hover:bg-blue-700 text-white flex-1"
                            onClick={() =>
                              run(job._id, () =>
                                approveStart({ workOrderId: job._id as any })
                              )
                            }
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {busy === job._id ? "..." : "Approve & Start"}
                          </Button>
                        )}
                        {(col.key === "in-progress" ||
                          col.key === "diagnosis") && (
                          <>
                            <Button
                              size="sm"
                              disabled={busy === job._id}
                              className="h-6 text-[10px] bg-rose-500 hover:bg-rose-600 text-white flex-1"
                              onClick={() =>
                                run(job._id, () =>
                                  markPartsReq({
                                    workOrderId: job._id as any,
                                  })
                                )
                              }
                            >
                              <Package className="h-3 w-3 mr-1" />
                              {busy === job._id ? "..." : "Need Parts"}
                            </Button>
                            <Button
                              size="sm"
                              disabled={busy === job._id}
                              className="h-6 text-[10px] bg-teal-500 hover:bg-teal-600 text-white flex-1"
                              onClick={() =>
                                run(job._id, () =>
                                  moveToQC({ workOrderId: job._id as any })
                                )
                              }
                            >
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                              {busy === job._id ? "..." : "Move to QC"}
                            </Button>
                          </>
                        )}
                        {col.key === "waiting-parts" && (
                          <Button
                            size="sm"
                            disabled={busy === job._id}
                            className="h-6 text-[10px] bg-emerald-500 hover:bg-emerald-600 text-white flex-1"
                            onClick={() =>
                              run(job._id, () =>
                                markPartsRcv({ workOrderId: job._id as any })
                              )
                            }
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {busy === job._id ? "..." : "Parts Arrived"}
                          </Button>
                        )}
                        {col.key === "quality-check" && (
                          <Button
                            size="sm"
                            disabled={busy === job._id}
                            className="h-6 text-[10px] bg-emerald-600 hover:bg-emerald-700 text-white flex-1"
                            onClick={() =>
                              run(job._id, () =>
                                completeJob({
                                  workOrderId: job._id as any,
                                  totalAmount: 150,
                                })
                              )
                            }
                          >
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            {busy === job._id ? "..." : "Complete Job ✓"}
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Technician Load Strip */}
      <div className="mt-4 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-800 p-3">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
          Technician Load Overview
        </h3>
        <div className="flex gap-3 overflow-x-auto pb-1">
          {technicians.map((tech) => {
            const load = tech.currentLoad || 0
            const max = tech.maxCapacity || 3
            const pct = (load / max) * 100
            return (
              <div
                key={tech._id}
                className="flex-shrink-0 w-32 bg-slate-50 dark:bg-slate-800 rounded-lg p-2 border border-slate-200 dark:border-slate-700"
              >
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 truncate">
                  {tech.firstName} {tech.lastName}
                </div>
                <div className="mt-1 w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      pct >= 100
                        ? "bg-red-500"
                        : pct >= 66
                          ? "bg-orange-400"
                          : "bg-emerald-500"
                    }`}
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>
                <div className="text-[10px] text-slate-400 mt-0.5">
                  {load}/{max} jobs
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
