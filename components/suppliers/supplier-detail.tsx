// components/suppliers/supplier-detail.tsx

import type React from "react"

interface SupplierDetailProps {
  supplierId: string
}

const SupplierDetail: React.FC<SupplierDetailProps> = ({ supplierId }) => {
  return (
    <div>
      <h1>Supplier Detail</h1>
      <p>Supplier ID: {supplierId}</p>
      {/* Add more supplier details here */}
    </div>
  )
}

export default SupplierDetail
