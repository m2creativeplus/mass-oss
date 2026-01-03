"use client"

import type React from "react"
import { useState } from "react"

interface AddSupplierFormProps {
  onAddSupplier: (supplier: { name: string; contact: string }) => void
}

const AddSupplierForm: React.FC<AddSupplierFormProps> = ({ onAddSupplier }) => {
  const [name, setName] = useState("")
  const [contact, setContact] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAddSupplier({ name, contact })
    setName("")
    setContact("")
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="name">Supplier Name:</label>
        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>
      <div>
        <label htmlFor="contact">Contact Information:</label>
        <input type="text" id="contact" value={contact} onChange={(e) => setContact(e.target.value)} required />
      </div>
      <button type="submit">Add Supplier</button>
    </form>
  )
}

export default AddSupplierForm
