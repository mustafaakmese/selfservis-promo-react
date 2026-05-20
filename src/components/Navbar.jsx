import { useState, useEffect, useCallback } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const handleNavClick = useCallback((e) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute('href')
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <div className="nav-inner">
        <a href="#" className="nav-logo-link" onClick={(e) => {
          e.preventDefault()
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}>
          <img src="/img/vistream-logo.ico" alt="Vistream" className="nav-logo" />
        </a>
        {/* ── Mobile: brand text + home icon ── */}
        <span className="nav-brand-text">Vistream Events</span>
        <div className="nav-icons-mobile">
          <a href="#hero" onClick={handleNavClick} title="Home" aria-label="Home">
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3l9 8h-3v9h-5v-6h-2v6H6v-9H3l9-8z"/></svg>
          </a>
          <button
            className="nav-arrow-btn"
            aria-label="Previous section"
            title="Previous section"
            onClick={() => window.__snapNav?.prev()}
          >
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"/></svg>
          </button>
          <button
            className="nav-arrow-btn"
            aria-label="Next section"
            title="Next section"
            onClick={() => window.__snapNav?.next()}
          >
            <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6z"/></svg>
          </button>
        </div>

        {/* ── Desktop text navigation ── */}
        <div className="nav-links">
          <a href="#hero" onClick={handleNavClick}>Home</a>
          <a href="#features" onClick={handleNavClick}>Features</a>
          <a href="#integrations" onClick={handleNavClick}>Integrations</a>
          <a href="#social-proof" onClick={handleNavClick}>Testimonials</a>
          <a href="#comparison" onClick={handleNavClick}>Why Vistream Events</a>
        </div>
        <div className="nav-ctas">
          <button
            className="btn-cta-nav"
            data-cal-namespace="30min"
            data-cal-link="vistreamevents/30min"
            data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"light"}'
          >
            Book Now
          </button>
        </div>
      </div>
    </nav>
  )
}
