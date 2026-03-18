"use client"

import { useConvexAuth } from "@/components/auth/convex-auth-provider"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function ProfilePage() {
  const { user, refreshSession, isLoading } = useConvexAuth()
  const router = useRouter()

  const [firstName, setFirstName] = useState(user?.firstName || "")
  const [lastName, setLastName] = useState(user?.lastName || "")
  const [phone, setPhone] = useState(user?.phone || "")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  // Password change
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [passwordMessage, setPasswordMessage] = useState("")
  const [changingPassword, setChangingPassword] = useState(false)

  if (isLoading) {
    return <div style={{ padding: "2rem", color: "rgba(255,255,255,0.5)" }}>Loading profile...</div>
  }

  if (!user) {
    router.push("/login")
    return null
  }

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage("")

    try {
      const res = await fetch("/api/auth/session", { credentials: "include" })
      const session = await res.json()
      if (!session.user) throw new Error("Not authenticated")

      // Profile update goes through a dedicated endpoint or Convex mutation
      // For now we'll use the session API pattern
      const updateRes = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ firstName, lastName, phone }),
      })

      if (updateRes.ok) {
        await refreshSession()
        setMessage("Profile updated successfully!")
      } else {
        const data = await updateRes.json()
        setMessage(data.error || "Update failed")
      }
    } catch (err) {
      setMessage("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setChangingPassword(true)
    setPasswordMessage("")

    try {
      const res = await fetch("/api/auth/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ currentPassword, newPassword }),
      })

      if (res.ok) {
        setPasswordMessage("Password changed successfully!")
        setCurrentPassword("")
        setNewPassword("")
      } else {
        const data = await res.json()
        setPasswordMessage(data.error || "Password change failed")
      }
    } catch {
      setPasswordMessage("Failed to change password")
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", marginBottom: "0.5rem" }}>
        My Profile
      </h1>
      <p style={{ color: "rgba(255,255,255,0.5)", marginBottom: "2rem" }}>
        Manage your account settings
      </p>

      {/* Profile Info */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.5rem", marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "1rem" }}>Account Details</h2>
        <form onSubmit={handleProfileUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.3rem" }}>First Name</label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                style={{ width: "100%", padding: "0.6rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: "0.9rem" }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.3rem" }}>Last Name</label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                style={{ width: "100%", padding: "0.6rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: "0.9rem" }}
              />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.3rem" }}>Email</label>
            <input
              value={user.email}
              disabled
              style={{ width: "100%", padding: "0.6rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, color: "rgba(255,255,255,0.4)", fontSize: "0.9rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.3rem" }}>Phone</label>
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+252 63 1234567"
              style={{ width: "100%", padding: "0.6rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: "0.9rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.3rem" }}>Role</label>
            <div style={{ padding: "0.6rem", background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: 8, color: "#F97316", fontSize: "0.85rem", fontWeight: 600, textTransform: "capitalize", display: "inline-block" }}>
              {user.role}
            </div>
          </div>
          {message && (
            <p style={{ fontSize: "0.85rem", color: message.includes("success") ? "#4ade80" : "#f87171" }}>{message}</p>
          )}
          <button
            type="submit"
            disabled={saving}
            style={{ padding: "0.7rem", background: "linear-gradient(135deg, #F97316, #EA580C)", border: "none", borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "pointer", opacity: saving ? 0.5 : 1 }}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </div>

      {/* Password Change */}
      <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12, padding: "1.5rem" }}>
        <h2 style={{ fontSize: "1rem", fontWeight: 600, color: "#fff", marginBottom: "1rem" }}>Change Password</h2>
        <form onSubmit={handlePasswordChange} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.3rem" }}>Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
              style={{ width: "100%", padding: "0.6rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: "0.9rem" }}
            />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)", marginBottom: "0.3rem" }}>New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
              style={{ width: "100%", padding: "0.6rem", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, color: "#fff", fontSize: "0.9rem" }}
            />
          </div>
          {passwordMessage && (
            <p style={{ fontSize: "0.85rem", color: passwordMessage.includes("success") ? "#4ade80" : "#f87171" }}>{passwordMessage}</p>
          )}
          <button
            type="submit"
            disabled={changingPassword}
            style={{ padding: "0.7rem", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 8, color: "#fff", fontWeight: 600, cursor: "pointer", opacity: changingPassword ? 0.5 : 1 }}
          >
            {changingPassword ? "Changing..." : "Change Password"}
          </button>
        </form>
      </div>
    </div>
  )
}
