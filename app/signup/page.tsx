"use client"

import { Suspense } from "react"
import { ConvexLoginForm } from "@/components/auth/convex-login-form"

export default function SignupPage() {
  return (
    <div className="login-page">
      <div className="login-glow" />
      <div className="login-center">
        <div className="login-brand">
          <div className="login-icon">
            <svg width="32" height="32" viewBox="0 0 48 48" fill="none">
              <path d="M12 32V16l6 8 6-8 6 8 6-8v16" stroke="#F97316" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <h1>MASS OSS</h1>
          <p>Workshop Operating System</p>
        </div>
        <Suspense fallback={<div style={{ color: "rgba(255,255,255,0.3)", textAlign: "center" }}>Loading...</div>}>
          <ConvexLoginForm />
        </Suspense>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #0a0a0a;
          position: relative;
          overflow: hidden;
        }
        .login-glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 50% 20%, rgba(249, 115, 22, 0.06) 0%, transparent 50%);
        }
        .login-center {
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1.5rem;
          padding: 2rem;
          width: 100%;
        }
        .login-brand {
          text-align: center;
        }
        .login-icon {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          background: rgba(249, 115, 22, 0.1);
          border: 1px solid rgba(249, 115, 22, 0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.75rem;
        }
        .login-brand h1 {
          font-size: 1.6rem;
          font-weight: 800;
          color: #fff;
          letter-spacing: 0.05em;
          margin: 0 0 0.25rem;
        }
        .login-brand p {
          color: rgba(255, 255, 255, 0.35);
          font-size: 0.85rem;
          margin: 0;
        }
      `}</style>
    </div>
  )
}
