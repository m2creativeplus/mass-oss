"use client";

import { useRouter } from "next/navigation";
import VehicleCheckInWizard from "@/components/inspections/vehicle-check-in-wizard";

export default function NewCheckInPage() {
  const router = useRouter();
  
  // TODO: Get orgId from auth context
  const orgId = "demo-org-001";
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <VehicleCheckInWizard 
        orgId={orgId}
        onComplete={(data) => {
          console.log("Check-in complete:", data);
          // Redirect to work orders page
          router.push("/dashboard/work-orders");
        }}
        onCancel={() => {
          router.push("/dashboard");
        }}
      />
    </div>
  );
}
