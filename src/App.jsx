import { useEffect, useState, useCallback } from 'react'
import useScrollSnap from './hooks/useScrollSnap'
import Navbar from './components/Navbar'
import HeroSection from './components/Hero/HeroSection'
import FeaturesSection from './components/Features/FeaturesSection'
import IntegrationsSection from './components/Integrations/IntegrationsSection'
import TestimonialsSection from './components/Testimonials/TestimonialsSection'
import ComparisonSection from './components/Comparison/ComparisonSection'
import CTABand from './components/CTABand'
import Footer from './components/Footer'
import LegalModal from './components/LegalModal'
import CookieConsent from './components/CookieConsent'

function App() {
  const [legalType, setLegalType] = useState(null)
  const [cookieOpenCount, setCookieOpenCount] = useState(0)
  useScrollSnap()

  // Re-open cookie consent banner (called from Footer "Cookie Settings" link)
  // Uses a counter instead of boolean so each click generates a new React key,
  // guaranteeing a fresh remount even if the user opens→saves→opens again.
  const handleOpenCookieSettings = useCallback(() => {
    setCookieOpenCount(prev => prev + 1)
  }, [])

  // ── Cal.com EU embed initialization ──
  useEffect(() => {
    // Load embed script from cal.eu (EU instance)
    ;(function (C, A, L) {
      let p = function (a, ar) { a.q.push(ar) }
      let d = C.document
      C.Cal = C.Cal || function () {
        let cal = C.Cal; let ar = arguments
        if (!cal.loaded) {
          cal.ns = {}; cal.q = cal.q || []
          d.head.appendChild(d.createElement('script')).src = A
          cal.loaded = true
        }
        if (ar[0] === L) {
          const api = function () { p(api, arguments) }
          const namespace = ar[1]
          api.q = api.q || []
          if (typeof namespace === 'string') {
            cal.ns[namespace] = cal.ns[namespace] || api
            p(cal.ns[namespace], ar)
            p(cal, ['initNamespace', namespace])
          } else p(cal, ar)
          return
        }
        p(cal, ar)
      }
    })(window, 'https://cal.eu/embed/embed.js', 'init')

    window.Cal('init', '30min', { origin: 'https://cal.eu' })
    window.Cal.ns['30min']('ui', {
      theme: 'light',
      cssVarsPerTheme: { light: { 'cal-brand': '#0284c7' } },
      hideEventTypeDetails: false,
      layout: 'month_view'
    })
  }, [])

  // Global sparkle canvas removed — hero canvas already provides particle effects.
  // Keeping a single canvas system eliminates redundant mousemove + rAF loops.

  // Smooth scroll for anchor links
  useEffect(() => {
    function onClick(e) {
      const anchor = e.target.closest('a[href^="#"]')
      if (!anchor) return
      const targetId = anchor.getAttribute('href')
      if (targetId === '#') return
      const targetEl = document.querySelector(targetId)
      if (targetEl) {
        e.preventDefault()
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <IntegrationsSection />
        <TestimonialsSection />
        <ComparisonSection />
        <CTABand onOpenFaq={() => setLegalType('faq')} />
      </main>
      <Footer onOpenLegal={setLegalType} onOpenCookieSettings={handleOpenCookieSettings} />
      {legalType && (
        <LegalModal type={legalType} onClose={() => setLegalType(null)} />
      )}
      <CookieConsent
        forceOpen={cookieOpenCount > 0}
        key={cookieOpenCount}
        onOpenPrivacy={() => setLegalType('privacy')}
      />
    </>
  )
}

export default App
