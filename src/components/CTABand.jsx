import { useEffect, useRef } from 'react'

export default function CTABand({ onOpenFaq }) {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )
    if (sectionRef.current) {
      sectionRef.current.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section className="cta-band" ref={sectionRef}>
      <h2 className="font-display text-heading-lg reveal">Ready to transform your events?</h2>
      <p className="reveal">Join thousands of organizations delivering world-class events with Vistream.</p>
      <div className="reveal" style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <button 
          className="btn" 
          style={{ background: '#fff', color: '#0284c7', padding: '13px 32px', borderRadius: '10px', fontWeight: 500, boxShadow: '0 2px 8px rgba(0,0,0,.1)', cursor: 'pointer', border: 'none' }}
          data-cal-namespace="30min"
          data-cal-link="vistreamevents/30min"
          data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"light"}'
        >
          Book a demo
        </button>
        <button 
          className="btn" 
          style={{ background: 'transparent', color: '#fff', padding: '13px 32px', borderRadius: '10px', fontWeight: 500, border: '1.5px solid rgba(255,255,255,0.4)' }}
          onClick={onOpenFaq}
        >
          FAQ
        </button>
      </div>
    </section>
  )
}
