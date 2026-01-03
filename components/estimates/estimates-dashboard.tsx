"use client"

import * as React from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

type Status = "draft" | "sent" | "approved" | "declined"

export interface EstimateRow {
  id: string
  number: string
  customer: string
  vehicle: string
  total: number
  status: Status
  createdAt: Date
}

export interface EstimatesDashboardProps {
  /** Called when the user clicks “Create Estimate” */
  onCreate?: () => void
  /** Called when the user clicks an estimate row */
  onOpen?: (id: string) => void
}

/**
 * Lightweight dashboard that lists recent estimates.
 * Uses mock data when no props are provided so the preview never crashes.
 */
export function EstimatesDashboard({ onCreate, onOpen }: EstimatesDashboardProps) {
  /* -------------------------------------------------------------------- */
  /* Mock data – replace with Supabase query                              */
  /* -------------------------------------------------------------------- */
  const mockData: EstimateRow[] = React.useMemo(
    () => [
      {
        id: "est-1001",
        number: "EST-1001",
        customer: "Ahmed Hassan",
        vehicle: "Toyota Corolla 2015",
        total: 356.5,
        status: "draft",
        createdAt: new Date(),
      },
      {
        id: "est-1002",
        number: "EST-1002",
        customer: "Fatima Ali",
        vehicle: "Hyundai Tucson 2018",
        total: 742.0,
        status: "sent",
        createdAt: new Date(Date.now() - 86_400_000),
      },
      {
        id: "est-1003",
        number: "EST-1003",
        customer: "Mohamed Omar",
        vehicle: "Nissan Patrol 2020",
        total: 1295.75,
        status: "approved",
        createdAt: new Date(Date.now() - 172_800_000),
      },
    ],
    [],
  )

  const statusColor: Record<Status, string> = {
    draft: "secondary",
    sent: "warning",
    approved: "success",
    declined: "destructive",
  }

  /* -------------------------------------------------------------------- */

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-lg font-semibold">Recent Estimates</CardTitle>
        {onCreate && (
          <Button onClick={onCreate} size="sm">
            + Create Estimate
          </Button>
        )}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No.</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Vehicle</TableHead>
              <TableHead className="text-right">Total ($)</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((est) => (
              <TableRow key={est.id} className="cursor-pointer hover:bg-muted/50" onClick={() => onOpen?.(est.id)}>
                <TableCell>{est.number}</TableCell>
                <TableCell>{est.customer}</TableCell>
                <TableCell>{est.vehicle}</TableCell>
                <TableCell className="text-right">{est.total.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={statusColor[est.status]}>
                    {est.status.charAt(0).toUpperCase() + est.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell>{format(est.createdAt, "dd MMM yyyy")}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export default EstimatesDashboard
