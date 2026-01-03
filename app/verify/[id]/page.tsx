import { Suspense } from 'react'
import VehiclePassportPublic from './vehicle-passport-public'

export default function VerifyPage({ params }: { params: { id: string } }) {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    }>
      <VehiclePassportPublic vehicleId={params.id} />
    </Suspense>
  )
}
