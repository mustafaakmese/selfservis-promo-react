import { useState, useEffect } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav className={`nav${scrolled ? ' scrolled' : ''}`} id="nav">
      <div className="nav-inner">
        <a href="#" className="nav-logo-link">
          <img src="/img/vistream-logo.ico" alt="Vistream" className="nav-logo" />
        </a>
        <div className="nav-links">
          <a href="#features">Features</a>
          <a href="#integrations">Integrations</a>
          <a href="#testimonials">Testimonials</a>
          <a href="#comparison">Why Vistream</a>
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
