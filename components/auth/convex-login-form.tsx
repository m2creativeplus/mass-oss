"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { useConvexAuth } from "./convex-auth-provider"

// ============================================================
// MASS OSS - Ultra-Simple Login Form
// One field to start: email OR phone. That's it.
// ============================================================

export function ConvexLoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { login, signup, isLoading } = useConvexAuth()

  // Forgot password mutations (proper ES imports)
  const requestReset = useMutation(api.auth.requestPasswordReset)
  const resetWithToken = useMutation(api.auth.resetPasswordWithToken)

  const [mode, setMode] = useState<"login" | "signup" | "forgot" | "reset">("login")
  const [identifier, setIdentifier] = useState("") // email or phone
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [error, setError] = useState("")
  const [successMsg, setSuccessMsg] = useState("")
  const [isResetting, setIsResetting] = useState(false)

  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard"

  // Detect if input looks like a phone number
  const isPhone = /^[+\d]/.test(identifier) && !identifier.includes("@")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!identifier || !password) {
      setError("Please fill in all fields")
      return
    }

    // For phone numbers, convert to an email-like format for storage
    const email = isPhone
      ? `${identifier.replace(/[^0-9]/g, "")}@phone.mass.local`
      : identifier.toLowerCase()

    if (mode === "login") {
      const result = await login(email, password)
      if (result.success) {
        router.push(callbackUrl)
      } else {
        setError(result.error || "Invalid credentials")
      }
    } else if (mode === "signup") {
      if (!name.trim()) {
        setError("Please enter your name")
        return
      }
      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }

      const nameParts = name.trim().split(" ")
      const firstName = nameParts[0]
      const lastName = nameParts.slice(1).join(" ") || "-"

      const result = await signup({
        email,
        password,
        firstName,
        lastName,
        phone: isPhone ? identifier : undefined,
      })
      if (result.success) {
        router.push("/dashboard")
      } else {
        setError(result.error || "Signup failed")
      }
    } else if (mode === "forgot") {
      setIsResetting(true)
      try {
        const res = await requestReset({ email })
        setSuccessMsg(res.message)
        if (res._demoToken) {
          // For zero-cost demo only: Auto-fill token so user doesn't need to check email
          setResetToken(res._demoToken)
        }
        setMode("reset")
      } catch (err: any) {
        setError(err.message || "Failed to request reset")
      } finally {
        setIsResetting(false)
      }
    } else if (mode === "reset") {
      if (password.length < 6) {
        setError("Password must be at least 6 characters")
        return
      }
      setIsResetting(true)
      try {
        await resetWithToken({ token: resetToken, newPassword: password })
        setSuccessMsg("Password reset successfully! You can now log in.")
        setMode("login")
        setPassword("")
      } catch (err: any) {
        setError(err.message || "Invalid or expired token")
      } finally {
        setIsResetting(false)
      }
    }
  }

  const isFormLoading = isLoading || isResetting;

  return (
    <div className="auth-card">
      {/* Tab Switcher */}
      {mode === "login" || mode === "signup" ? (
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab ${mode === "login" ? "active" : ""}`}
            onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab ${mode === "signup" ? "active" : ""}`}
            onClick={() => { setMode("signup"); setError(""); setSuccessMsg(""); }}
          >
            Sign Up
          </button>
        </div>
      ) : (
        <div className="auth-header">
          <button 
            type="button" 
            className="auth-back" 
            onClick={() => { setMode("login"); setError(""); setSuccessMsg(""); }}
          >
            ← Back to Login
          </button>
          <h2>{mode === "forgot" ? "Reset Password" : "New Password"}</h2>
        </div>
      )}

      {error && <div className="auth-error">{error}</div>}
      {successMsg && <div className="auth-success">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        {/* Only show name field for signup */}
        {mode === "signup" && (
          <div className="auth-field">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your full name"
              required
              autoComplete="name"
              className="auth-input"
            />
          </div>
        )}

        {/* Identifier (Email/Phone) — Only show for Login, Signup, Forgot */}
        {(mode === "login" || mode === "signup" || mode === "forgot") && (
          <div className="auth-field">
            <input
              type={isPhone ? "tel" : "email"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Email or phone number"
              required
              autoComplete={mode === "login" ? "email" : "email"}
              className="auth-input"
            />
            {isPhone && (
              <span className="auth-hint">📱 Phone login detected</span>
            )}
          </div>
        )}

        {/* Reset Token — Only for Reset Mode */}
        {mode === "reset" && (
          <div className="auth-field">
            <input
              type="text"
              value={resetToken}
              onChange={(e) => setResetToken(e.target.value)}
              placeholder="Paste Reset Token (check console/email)"
              required
              className="auth-input"
            />
          </div>
        )}

        {/* Password */}
        {mode !== "forgot" && (
          <div className="auth-field">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={
                mode === "signup" 
                  ? "Create password (6+ chars)" 
                  : mode === "reset"
                  ? "New Password (6+ chars)"
                  : "Password"
              }
              required
              minLength={mode === "signup" || mode === "reset" ? 6 : 1}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="auth-input"
            />
          </div>
        )}

        {(mode === "login" || mode === "signup") && (
          <div className="auth-forgot-row">
            {mode === "login" && (
              <button
                type="button"
                className="auth-forgot-link"
                onClick={() => { setMode("forgot"); setError(""); setSuccessMsg(""); }}
              >
                Forgot password?
              </button>
            )}
          </div>
        )}

        <button
          type="submit"
          disabled={isFormLoading}
          className="auth-submit"
        >
          {isFormLoading ? (
            <span className="auth-spinner" />
          ) : mode === "login" ? (
            "Sign In →"
          ) : mode === "signup" ? (
            "Create Account →"
          ) : mode === "forgot" ? (
            "Send Reset Link"
          ) : (
            "Update Password"
          )}
        </button>
      </form>

      <style jsx>{`
        .auth-card {
          width: 100%;
          max-width: 400px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          padding: 2rem;
          backdrop-filter: blur(20px);
        }
        .auth-tabs {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4px;
          background: rgba(255, 255, 255, 0.04);
          border-radius: 12px;
          padding: 4px;
          margin-bottom: 1.5rem;
        }
        .auth-tab {
          padding: 0.6rem;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          transition: all 0.2s;
        }
        .auth-tab.active {
          background: rgba(249, 115, 22, 0.15);
          color: #F97316;
        }
        .auth-error {
          padding: 0.65rem 1rem;
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.2);
          border-radius: 10px;
          color: #f87171;
          font-size: 0.85rem;
          margin-bottom: 1rem;
          text-align: center;
        }
        .auth-success {
          padding: 0.65rem 1rem;
          background: rgba(34, 197, 94, 0.1);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 10px;
          color: #4ade80;
          font-size: 0.85rem;
          margin-bottom: 1rem;
          text-align: center;
        }
        .auth-header {
          margin-bottom: 1.5rem;
          text-align: center;
        }
        .auth-header h2 {
          color: #fff;
          font-size: 1.2rem;
          margin: 0.5rem 0 0;
        }
        .auth-back {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.85rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .auth-back:hover {
          color: #F97316;
        }
        .auth-form {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }
        .auth-field {
          position: relative;
        }
        .auth-input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          color: #fff;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .auth-input:focus {
          border-color: #F97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.12);
        }
        .auth-input::placeholder {
          color: rgba(255, 255, 255, 0.25);
        }
        .auth-hint {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.75rem;
          color: rgba(249, 115, 22, 0.7);
        }
        .auth-forgot-row {
          display: flex;
          justify-content: flex-end;
          margin-top: -0.25rem;
          margin-bottom: 0.5rem;
        }
        .auth-forgot-link {
          background: none;
          border: none;
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.8rem;
          cursor: pointer;
          transition: color 0.2s;
        }
        .auth-forgot-link:hover {
           color: #F97316;
        }
        .auth-submit {
          margin-top: 0.5rem;
          padding: 0.9rem;
          background: linear-gradient(135deg, #F97316, #EA580C);
          border: none;
          border-radius: 12px;
          color: #fff;
          font-size: 1.05rem;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.2s, transform 0.15s;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 50px;
        }
        .auth-submit:hover:not(:disabled) {
          opacity: 0.92;
          transform: translateY(-1px);
        }
        .auth-submit:active:not(:disabled) {
          transform: translateY(0);
        }
        .auth-submit:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        .auth-spinner {
          width: 20px;
          height: 20px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
