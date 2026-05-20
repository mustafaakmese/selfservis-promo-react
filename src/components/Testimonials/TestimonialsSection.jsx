import React, { useEffect, useRef, useCallback } from 'react'

const quoteIcon = (
  <svg className="testimonial-quote-icon" width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="currentColor"/>
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="currentColor"/>
  </svg>
)

const slides = [
  {
    img: '/testimonials/person-1.png',
    alt: 'Sarah Mitchell',
    quote: '"Vistream replaced three separate tools we were juggling. Setup takes minutes, not days. Our attendee engagement jumped 40% in the first month."',
    name: 'Sarah Mitchell',
    title: 'VP of Marketing · Novartis'
  },
  {
    img: '/testimonials/person-2.png',
    alt: 'Daniel Carter',
    quote: '"The AI-powered registration and landing page builder is a game-changer. We went from concept to live event in under 15 minutes. The analytics dashboard alone is worth it."',
    name: 'Daniel Carter',
    title: 'Head of Events · Roche'
  },
  {
    img: '/testimonials/person-3.png',
    alt: 'Dr. Lin Wei',
    quote: '"We run 50+ webinars per quarter across 12 countries. Vistream\'s multi-language support and compliance features made it the only platform that checked every box."',
    name: 'Dr. Lin Wei',
    title: 'Global Medical Affairs · Pfizer'
  }
]

const stats = [
  { target: 10000, suffix: '+', label: 'Events Hosted' },
  { target: 500000, suffix: '+', label: 'Attendees Worldwide' },
  { target: 99, suffix: '.9%', label: 'Platform Uptime' },
  { target: 45, suffix: '+', label: 'Countries Served' },
]

export default function TestimonialsSection() {
  const slidesRef = useRef([])
  const currentSlideRef = useRef(0)
  const isAnimating = useRef(false)
  const autoTimerRef = useRef(null)

  // Reveal observer for stat counter
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            entry.target.querySelectorAll('.proof-stat-number').forEach(el => {
              if (el.dataset.animated) return
              el.dataset.animated = 'true'
              const target = parseInt(el.dataset.target, 10)
              const suffix = el.dataset.suffix || '+'
              const duration = 2000
              const start = performance.now()
              function update(now) {
                const elapsed = now - start
                const progress = Math.min(elapsed / duration, 1)
                const eased = 1 - Math.pow(1 - progress, 4)
                const current = Math.floor(eased * target)
                el.textContent = (target >= 1000 ? current.toLocaleString() : current) + (progress >= 1 ? suffix : '')
                if (progress < 1) requestAnimationFrame(update)
              }
              requestAnimationFrame(update)
            })
          }
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )

    // Observe all reveal elements in this section
    const section = document.getElementById('social-proof')
    if (section) {
      section.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    }
    return () => observer.disconnect()
  }, [])

  const goToSlide = useCallback((index, direction = 'next') => {
    if (isAnimating.current || index === currentSlideRef.current) return
    isAnimating.current = true

    const oldSlide = slidesRef.current[currentSlideRef.current]
    const newSlide = slidesRef.current[index]
    if (!oldSlide || !newSlide) { isAnimating.current = false; return }

    // Position incoming slide off-screen before transition starts
    newSlide.style.transition = 'none'
    newSlide.style.transform = direction === 'next' ? 'translateX(60px)' : 'translateX(-60px)'
    newSlide.style.opacity = '0'
    void newSlide.offsetWidth // force reflow

    // Animate old slide out
    oldSlide.classList.remove('active')
    oldSlide.classList.add(direction === 'next' ? 'slide-out-left' : 'slide-out-right')

    // Animate new slide in
    newSlide.style.transition = ''
    newSlide.classList.add('active')
    newSlide.style.transform = ''
    newSlide.style.opacity = ''

    currentSlideRef.current = index

    setTimeout(() => {
      oldSlide.classList.remove('slide-out-left', 'slide-out-right')
      isAnimating.current = false
    }, 650)
  }, [])

  const nextSlide = useCallback(() => {
    goToSlide((currentSlideRef.current + 1) % slides.length, 'next')
  }, [goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide((currentSlideRef.current - 1 + slides.length) % slides.length, 'prev')
  }, [goToSlide])

  // Auto-rotate — stable interval, runs once
  useEffect(() => {
    autoTimerRef.current = setInterval(() => {
      nextSlide()
    }, 6000)
    return () => clearInterval(autoTimerRef.current)
  }, [nextSlide])

  const pauseAuto = useCallback(() => {
    clearInterval(autoTimerRef.current)
  }, [])

  const resumeAuto = useCallback(() => {
    clearInterval(autoTimerRef.current)
    autoTimerRef.current = setInterval(() => { nextSlide() }, 6000)
  }, [nextSlide])

  return (
    <section className="section" id="social-proof">
      <div className="container">
        <div className="testimonial-header reveal">
          <h2 className="font-display text-heading-lg">Hear from the teams who trust Vistream Events every single day.</h2>
        </div>

        <div className="proof-stats-bar reveal">
          {stats.map((stat, i) => (
            <React.Fragment key={i}>
              {i > 0 && <div className="proof-stat-divider"></div>}
              <div className="proof-stat">
                <span className="proof-stat-number" data-target={stat.target} data-suffix={stat.suffix}>0</span>
                <span className="proof-stat-label">{stat.label}</span>
              </div>
            </React.Fragment>
          ))}
        </div>

        <div 
          className="testimonial-carousel reveal" 
          id="testimonial-carousel"
          onMouseEnter={pauseAuto}
          onMouseLeave={resumeAuto}
        >
          <div className="testimonial-slides" id="testimonial-slides">
            {slides.map((slide, i) => (
              <div 
                key={i}
                className={`testimonial-slide${i === 0 ? ' active' : ''}`}
                data-slide={i}
                ref={el => slidesRef.current[i] = el}
              >
                <div className="testimonial-image-col">
                  <img src={slide.img} alt={slide.alt} loading="lazy" />
                </div>
                <div className="testimonial-quote-col">
                  {quoteIcon}
                  <blockquote className="testimonial-text">{slide.quote}</blockquote>
                  <div className="testimonial-author">
                    <div className="testimonial-author-info">
                      <strong>{slide.name}</strong>
                      <span>{slide.title}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="testimonial-nav">
            <button className="testimonial-nav-btn" onClick={prevSlide} aria-label="Previous testimonial">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <button className="testimonial-nav-btn" onClick={nextSlide} aria-label="Next testimonial">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
