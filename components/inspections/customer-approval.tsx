"use client"

import type React from "react"

interface CustomerApprovalProps {
  approved: boolean
  onApprove: () => void
  onReject: () => void
}

const CustomerApproval: React.FC<CustomerApprovalProps> = ({ approved, onApprove, onReject }) => {
  return (
    <div>
      {approved ? (
        <p>Customer has approved the inspection.</p>
      ) : (
        <>
          <button onClick={onApprove}>Approve</button>
          <button onClick={onReject}>Reject</button>
        </>
      )}
    </div>
  )
}

export default CustomerApproval
