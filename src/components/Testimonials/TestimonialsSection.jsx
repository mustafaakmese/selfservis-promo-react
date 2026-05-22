import React, { useEffect, useRef, useCallback } from 'react'

const quoteIcon = (
  <svg className="testimonial-quote-icon" width="48" height="48" viewBox="0 0 24 24" fill="none">
    <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="currentColor"/>
    <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="currentColor"/>
  </svg>
)

const slides = [
  {
    img: '/testimonials/osman-daggezen (1).jpg',
    alt: 'Osman Dağgezen',
    quote: '"Vistream streamlined our global pharma event strategies, perfectly balancing seamless omnichannel execution with strict regulatory compliance."',
    name: 'Osman Dağgezen',
    title: <>Founder, OD Pharma Consulting <br /> Ex-VP, Viatris</>
  },
  {
    img: '/testimonials/nicolas-bargas-new.jpeg',
    alt: 'Nicolas Bargas',
    quote: '"Vistream\'s hands-on onboarding and deep customization empowered us to perfectly tailor our digital events and scale campaigns across Greater Asia."',
    name: 'Nicolas Bargas',
    title: <>Omnichannel & Marketing Communication Director <br /> BD, Greater Asia Region</>
  },
  {
    img: '/testimonials/gokhan-isik.jpeg',
    alt: 'Gökhan Cüneyt Işık',
    quote: '"Vistream simplified our complex event operations in Turkiye. Their reliable platform guarantees flawless execution while ensuring complete compliance."',
    name: 'Gökhan Cüneyt Işık',
    title: <>Event Management and Operations Manager <br /> J&J Innovative Medicine</>
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
  const touchStartRef = useRef({ x: 0, y: 0 })

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

    // Update dots
    document.querySelectorAll('.testimonial-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === index)
    })

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

  // Touch swipe for mobile carousel
  const handleTouchStart = useCallback((e) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const handleTouchEnd = useCallback((e) => {
    const dx = touchStartRef.current.x - e.changedTouches[0].clientX
    const dy = touchStartRef.current.y - e.changedTouches[0].clientY
    // Only trigger if horizontal swipe is dominant and > 40px
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) nextSlide()
      else prevSlide()
    }
  }, [nextSlide, prevSlide])

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
          data-scroll-free
          onMouseEnter={pauseAuto}
          onMouseLeave={resumeAuto}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
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
            <button className="testimonial-nav-arrow prev-arrow" onClick={prevSlide} aria-label="Previous testimonial">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
            </button>
            <div className="testimonial-dots">
              {slides.map((_, i) => (
                <button
                  key={i}
                  className={`testimonial-dot${i === 0 ? ' active' : ''}`}
                  onClick={() => goToSlide(i, i > currentSlideRef.current ? 'next' : 'prev')}
                  aria-label={`Go to testimonial ${i + 1}`}
                />
              ))}
            </div>
            <button className="testimonial-nav-arrow next-arrow" onClick={nextSlide} aria-label="Next testimonial">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 6 15 12 9 18"></polyline></svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
