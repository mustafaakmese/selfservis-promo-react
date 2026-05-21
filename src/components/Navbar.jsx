import { useState, useEffect, useCallback, useRef } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMobileMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleNavClick = useCallback((e) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const href = e.currentTarget.getAttribute('href')
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }, [])

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav" ref={menuRef}>
      <div className="nav-inner">
        <a href="#" className="nav-logo-link" onClick={(e) => {
          e.preventDefault()
          setMobileMenuOpen(false)
          window.scrollTo({ top: 0, behavior: 'smooth' })
        }}>
          <img src="/img/vistream-logo.ico" alt="Vistream" className="nav-logo" />
        </a>
        {/* ── Mobile: brand text + 3-dot menu ── */}
        <span className="nav-brand-text">Vistream Events</span>
        <div className="nav-icons-mobile">
          <button 
            className="mobile-menu-toggle" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {/* 3 dots vertical (kebab) icon */}
            <svg viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="2"/>
              <circle cx="12" cy="12" r="2"/>
              <circle cx="12" cy="19" r="2"/>
            </svg>
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

      {/* ── Mobile Pocket Dropdown ── */}
      <div className={`mobile-dropdown ${mobileMenuOpen ? 'open' : ''}`}>
        <a href="#hero" onClick={handleNavClick}>Home</a>
        <a href="#features" onClick={handleNavClick}>Features</a>
        <a href="#integrations" onClick={handleNavClick}>Integrations</a>
        <a href="#social-proof" onClick={handleNavClick}>Testimonials</a>
        <a href="#comparison" onClick={handleNavClick}>Why Vistream Events</a>
      </div>
    </nav>
  )
}
