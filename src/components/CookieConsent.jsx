import { useState, useEffect, useCallback } from 'react'

const CONSENT_KEY = 'vistream_cookie_consent'
const CONSENT_VERSION = 1 // Bump to re-ask consent after policy changes

/**
 * Read saved consent from localStorage.
 * Returns null if no consent has been recorded or version has changed.
 */
function getSavedConsent() {
  try {
    const raw = localStorage.getItem(CONSENT_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (parsed.version !== CONSENT_VERSION) return null
    return parsed
  } catch {
    return null
  }
}

/**
 * Persist consent state to localStorage with timestamp for audit trail.
 */
function saveConsent(state) {
  try {
    const record = {
      version: CONSENT_VERSION,
      timestamp: new Date().toISOString(),
      analytics: state.analytics,
      marketing: state.marketing,
    }
    localStorage.setItem(CONSENT_KEY, JSON.stringify(record))
  } catch {
    // Silently fail if localStorage is full or unavailable (e.g. private browsing)
  }
}

/**
 * Push consent update to Google Consent Mode v2 via gtag.
 */
function updateGtagConsent(state) {
  if (typeof window.gtag === 'function') {
    window.gtag('consent', 'update', {
      analytics_storage: state.analytics ? 'granted' : 'denied',
      ad_storage: state.marketing ? 'granted' : 'denied',
      ad_user_data: state.marketing ? 'granted' : 'denied',
      ad_personalization: state.marketing ? 'granted' : 'denied',
    })
  }
}

export default function CookieConsent({ forceOpen = false, onOpenPrivacy }) {
  const [visible, setVisible] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false)
  const [marketingEnabled, setMarketingEnabled] = useState(false)
  const [animateIn, setAnimateIn] = useState(false)

  // On mount: read saved consent to pre-populate toggles and decide visibility.
  useEffect(() => {
    const saved = getSavedConsent()

    // Pre-populate toggles from saved state (if any)
    if (saved) {
      setAnalyticsEnabled(saved.analytics)
      setMarketingEnabled(saved.marketing)
    }

    if (forceOpen) {
      // Re-opening from footer "Cookie Settings" — always show
      setVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true))
      })
      return
    }

    if (saved) {
      // Returning visitor — consent already restored by the inline script in
      // index.html, so we just stay hidden. No need for a redundant gtag call.
    } else {
      // First visit — show the banner
      setVisible(true)
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAnimateIn(true))
      })
    }
  }, [forceOpen])

  const dismiss = useCallback(() => {
    setAnimateIn(false)
    setTimeout(() => setVisible(false), 350)
  }, [])

  const handleAcceptAll = useCallback(() => {
    const state = { analytics: true, marketing: true }
    saveConsent(state)
    updateGtagConsent(state)
    dismiss()
  }, [dismiss])

  const handleRejectAll = useCallback(() => {
    const state = { analytics: false, marketing: false }
    saveConsent(state)
    updateGtagConsent(state)
    dismiss()
  }, [dismiss])

  const handleSavePreferences = useCallback(() => {
    const state = { analytics: analyticsEnabled, marketing: marketingEnabled }
    saveConsent(state)
    updateGtagConsent(state)
    dismiss()
  }, [analyticsEnabled, marketingEnabled, dismiss])

  /**
   * "Learn more" handler — opens the Privacy Policy modal.
   * Dismisses the banner temporarily (no consent saved).
   * On next page load the banner reappears since localStorage is still empty.
   * User can also re-open via footer "Cookie Settings" anytime.
   */
  const handleLearnMore = useCallback((e) => {
    e.preventDefault()
    if (!onOpenPrivacy) return
    dismiss()
    setTimeout(() => onOpenPrivacy(), 350)
  }, [onOpenPrivacy, dismiss])

  if (!visible) return null

  return (
    <div
      className={`cookie-consent-banner ${animateIn ? 'cookie-consent-visible' : ''}`}
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
    >
      <div className="cookie-consent-inner">
        {/* Main banner content */}
        <div className="cookie-consent-main">
          <div className="cookie-consent-text">
            <div className="cookie-consent-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5" />
                <path d="M8.5 8.5v.01" /><path d="M16 15.5v.01" />
                <path d="M12 12v.01" /><path d="M11 17v.01" /><path d="M7 14v.01" />
              </svg>
            </div>
            <div>
              <p className="cookie-consent-heading">We value your privacy</p>
              <p className="cookie-consent-description">
                We use cookies to analyze site performance and improve your experience.
                No data is shared with third parties for advertising. You can change your preferences anytime.{' '}
                <a
                  href="#"
                  className="cookie-consent-link"
                  onClick={handleLearnMore}
                >
                  Learn more
                </a>
              </p>
            </div>
          </div>
          <div className="cookie-consent-actions">
            <button
              className="cookie-btn cookie-btn-reject"
              onClick={handleRejectAll}
              type="button"
            >
              Reject All
            </button>
            <button
              className="cookie-btn cookie-btn-preferences"
              onClick={() => setShowPreferences(!showPreferences)}
              type="button"
            >
              Preferences
            </button>
            <button
              className="cookie-btn cookie-btn-accept"
              onClick={handleAcceptAll}
              type="button"
            >
              Accept All
            </button>
          </div>
        </div>

        {/* Expandable preferences panel */}
        {showPreferences && (
          <div className="cookie-preferences">
            <div className="cookie-preferences-header">
              <h4>Cookie Preferences</h4>
              <p>Choose which cookies you'd like to allow. Your selection will be saved for future visits.</p>
            </div>
            <div className="cookie-category">
              <div className="cookie-category-info">
                <div className="cookie-category-header">
                  <span className="cookie-category-name">Strictly Necessary</span>
                  <span className="cookie-category-badge cookie-badge-always">Always Active</span>
                </div>
                <p className="cookie-category-desc">
                  Essential for core site functionality, security, and page navigation. These cookies
                  do not collect personal data and cannot be disabled.
                </p>
              </div>
            </div>
            <div className="cookie-category">
              <div className="cookie-category-info">
                <div className="cookie-category-header">
                  <span className="cookie-category-name">Analytics</span>
                  <label className="cookie-toggle" htmlFor="consent-analytics">
                    <input
                      type="checkbox"
                      id="consent-analytics"
                      checked={analyticsEnabled}
                      onChange={(e) => setAnalyticsEnabled(e.target.checked)}
                    />
                    <span className="cookie-toggle-slider" />
                  </label>
                </div>
                <p className="cookie-category-desc">
                  Google Analytics 4 — helps us understand how visitors interact with our site
                  to improve content and user experience. Cookies: <code>_ga</code>, <code>_ga_*</code>.
                  Retention: up to 14 months.
                </p>
              </div>
            </div>
            <div className="cookie-category">
              <div className="cookie-category-info">
                <div className="cookie-category-header">
                  <span className="cookie-category-name">Marketing</span>
                  <label className="cookie-toggle" htmlFor="consent-marketing">
                    <input
                      type="checkbox"
                      id="consent-marketing"
                      checked={marketingEnabled}
                      onChange={(e) => setMarketingEnabled(e.target.checked)}
                    />
                    <span className="cookie-toggle-slider" />
                  </label>
                </div>
                <p className="cookie-category-desc">
                  Enables audience measurement and personalized advertising across Google services.
                  Controls <code>ad_storage</code>, <code>ad_user_data</code>, and <code>ad_personalization</code> signals
                  used by Google Consent Mode v2.
                </p>
              </div>
            </div>
            <div className="cookie-preferences-actions">
              <button
                className="cookie-btn cookie-btn-save"
                onClick={handleSavePreferences}
                type="button"
              >
                Save Preferences
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
