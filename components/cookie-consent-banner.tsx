"use client"

import { useState, useEffect } from "react"

// ============================================================
// MASS OSS - Cookie Consent Banner (GDPR-style)
// ============================================================

const CONSENT_KEY = "mass_cookie_consent"

interface CookiePreferences {
  essential: boolean
  analytics: boolean
  preferences: boolean
}

export function CookieConsentBanner() {
  const [visible, setVisible] = useState(false)
  const [showCustomize, setShowCustomize] = useState(false)
  const [prefs, setPrefs] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    preferences: false,
  })

  useEffect(() => {
    const stored = localStorage.getItem(CONSENT_KEY)
    if (!stored) {
      // Show banner after a short delay
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const saveConsent = (consent: CookiePreferences) => {
    localStorage.setItem(CONSENT_KEY, JSON.stringify(consent))
    setVisible(false)

    // Optionally sync to Convex (fire and forget)
    const visitorId = getVisitorId()
    fetch("/api/auth/session", { credentials: "include" })
      .then((r) => r.json())
      .catch(() => null)
  }

  const acceptAll = () => {
    saveConsent({ essential: true, analytics: true, preferences: true })
  }

  const rejectNonEssential = () => {
    saveConsent({ essential: true, analytics: false, preferences: false })
  }

  const saveCustom = () => {
    saveConsent({ ...prefs, essential: true })
  }

  if (!visible) return null

  return (
    <div className="cookie-banner-overlay">
      <div className="cookie-banner">
        <div className="cookie-banner-content">
          <h3>🍪 Cookie Preferences</h3>
          <p>
            We use cookies to provide essential functionality and improve your experience.
            You can choose which cookies to accept.
          </p>

          {showCustomize && (
            <div className="cookie-options">
              <label className="cookie-option">
                <input type="checkbox" checked disabled />
                <div>
                  <strong>Essential</strong>
                  <span>Required for login and security (always on)</span>
                </div>
              </label>
              <label className="cookie-option">
                <input
                  type="checkbox"
                  checked={prefs.analytics}
                  onChange={(e) => setPrefs({ ...prefs, analytics: e.target.checked })}
                />
                <div>
                  <strong>Analytics</strong>
                  <span>Help us understand how you use MASS OSS</span>
                </div>
              </label>
              <label className="cookie-option">
                <input
                  type="checkbox"
                  checked={prefs.preferences}
                  onChange={(e) => setPrefs({ ...prefs, preferences: e.target.checked })}
                />
                <div>
                  <strong>Preferences</strong>
                  <span>Remember your UI settings and preferences</span>
                </div>
              </label>
            </div>
          )}

          <div className="cookie-actions">
            {showCustomize ? (
              <button onClick={saveCustom} className="cookie-btn cookie-btn-primary">
                Save Preferences
              </button>
            ) : (
              <>
                <button onClick={acceptAll} className="cookie-btn cookie-btn-primary">
                  Accept All
                </button>
                <button onClick={rejectNonEssential} className="cookie-btn cookie-btn-secondary">
                  Essential Only
                </button>
                <button onClick={() => setShowCustomize(true)} className="cookie-btn cookie-btn-ghost">
                  Customize
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .cookie-banner-overlay {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 9999;
          padding: 1rem;
          animation: slideUp 0.4s ease-out;
        }
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .cookie-banner {
          max-width: 600px;
          margin: 0 auto;
          background: rgba(20, 20, 20, 0.95);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          backdrop-filter: blur(20px);
          box-shadow: 0 -4px 40px rgba(0, 0, 0, 0.4);
        }
        .cookie-banner-content {
          padding: 1.5rem;
        }
        .cookie-banner-content h3 {
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
          margin: 0 0 0.5rem;
        }
        .cookie-banner-content p {
          color: rgba(255, 255, 255, 0.5);
          font-size: 0.85rem;
          line-height: 1.5;
          margin: 0 0 1rem;
        }
        .cookie-options {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-bottom: 1rem;
        }
        .cookie-option {
          display: flex;
          align-items: flex-start;
          gap: 0.75rem;
          cursor: pointer;
        }
        .cookie-option input {
          margin-top: 3px;
          accent-color: #F97316;
        }
        .cookie-option strong {
          display: block;
          color: #fff;
          font-size: 0.9rem;
        }
        .cookie-option span {
          display: block;
          color: rgba(255, 255, 255, 0.4);
          font-size: 0.8rem;
        }
        .cookie-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }
        .cookie-btn {
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          border: none;
          transition: opacity 0.2s;
        }
        .cookie-btn:hover { opacity: 0.85; }
        .cookie-btn-primary {
          background: linear-gradient(135deg, #F97316, #EA580C);
          color: #fff;
        }
        .cookie-btn-secondary {
          background: rgba(255, 255, 255, 0.08);
          color: #fff;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }
        .cookie-btn-ghost {
          background: transparent;
          color: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  )
}

function getVisitorId(): string {
  let id = localStorage.getItem("mass_visitor_id")
  if (!id) {
    id = crypto.randomUUID()
    localStorage.setItem("mass_visitor_id", id)
  }
  return id
}
