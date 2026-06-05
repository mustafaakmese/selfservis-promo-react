import { forwardRef, useEffect, useRef, useState } from 'react'

/**
 * LaptopMockup — pixel-perfect port of the original HTML structure.
 *
 * Original hierarchy (index.html lines 73-157):
 *   .hero-text-block
 *     .laptop-wrapper#laptop-frame
 *       .laptop-lid
 *         .laptop-camera
 *         .laptop-screen
 *           .browser-chrome  (macOS-style: dots + address bar)
 *           .webinar-stage
 *             .webinar-presenter  (speaker video + mask + name label)
 *             .slides-carousel    (cursor + track + dots)
 *       .laptop-base
 *         .laptop-base-notch
 */

const LaptopMockup = forwardRef(function LaptopMockup(props, ref) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const trackRef = useRef(null)
  const cursorRef = useRef(null)
  const carouselRef = useRef(null)

  // ── Rotating Words ──
  useEffect(() => {
    const words = document.querySelectorAll('.rotating-word')
    if (!words.length) return
    let current = 0
    const interval = setInterval(() => {
      const prev = words[current]
      current = (current + 1) % words.length
      const next = words[current]
      prev.classList.remove('active')
      prev.classList.add('exit')
      next.classList.remove('exit')
      next.classList.add('active')
      setTimeout(() => prev.classList.remove('exit'), 500)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  // ── Slide Carousel — wheel (desktop) + touch swipe (mobile) ──
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    let transitioning = false
    let currentSlideLocal = 0
    const track = trackRef.current
    const laptopWrapper = ref?.current
    const carousel = carouselRef.current

    function goToSlide(index) {
      if (currentSlideLocal === index) return
      currentSlideLocal = index
      setCurrentSlide(index)
      transitioning = true
      if (track) {
        if (index === 1) track.classList.add('at-slide-1')
        else track.classList.remove('at-slide-1')
      }
      // Sync dots
      document.querySelectorAll('.slide-dot').forEach((d, i) => {
        d.classList.toggle('active', i === index)
      })
      setTimeout(() => { transitioning = false }, 1000)
    }

    // ── Mobile: touch swipe on carousel ──
    if (isMobile) {
      if (!carousel) return
      let touchStartX = 0
      let touchStartY = 0
      const SWIPE_THRESHOLD = 50

      function onTouchStart(e) {
        touchStartX = e.touches[0].clientX
        touchStartY = e.touches[0].clientY
      }
      function onTouchEnd(e) {
        if (transitioning) return
        const dx = e.changedTouches[0].clientX - touchStartX
        const dy = e.changedTouches[0].clientY - touchStartY
        // Only trigger horizontal swipes (ignore vertical scrolls)
        if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return
        if (dx < 0 && currentSlideLocal === 0) {
          goToSlide(1)  // Swipe left → next slide
        } else if (dx > 0 && currentSlideLocal === 1) {
          goToSlide(0)  // Swipe right → prev slide
        }
      }
      carousel.addEventListener('touchstart', onTouchStart, { passive: true })
      carousel.addEventListener('touchend', onTouchEnd, { passive: true })
      return () => {
        carousel.removeEventListener('touchstart', onTouchStart)
        carousel.removeEventListener('touchend', onTouchEnd)
      }
    }

    // ── Desktop: wheel-driven transitions ──
    function isLaptopInView() {
      if (!laptopWrapper) return false
      const rect = laptopWrapper.getBoundingClientRect()
      return rect.top < window.innerHeight && rect.bottom > 0
    }

    function onWheel(e) {
      if (transitioning) { e.preventDefault(); return }
      if (!isLaptopInView()) return

      const scrollingDown = e.deltaY > 0
      const scrollingUp = e.deltaY < 0

      // Scrolling down while on slide 1 → go to slide 2, block page scroll
      if (scrollingDown && currentSlideLocal === 0) {
        e.preventDefault()
        goToSlide(1)
        return
      }

      // Scrolling up while on slide 2 and laptop is near top → go back to slide 1
      if (scrollingUp && currentSlideLocal === 1) {
        const rect = laptopWrapper.getBoundingClientRect()
        if (rect.top > -100) {
          e.preventDefault()
          goToSlide(0)
          return
        }
      }
      // Otherwise allow normal page scroll
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    return () => window.removeEventListener('wheel', onWheel)
  }, [ref])

  // ── Custom Cursor Follower (desktop only) ──
  useEffect(() => {
    // Skip on mobile — no mouse, cursor is hidden via CSS anyway
    if (window.matchMedia('(max-width: 768px)').matches) return

    const carousel = carouselRef.current
    const cursor = cursorRef.current
    if (!carousel || !cursor) return

    // Track both the target (mouse) and current (rendered) positions
    let targetX = 0, targetY = 0
    let currentX = 0, currentY = 0
    let animId = null
    let isInside = false

    // Lerp factor — higher = snappier, lower = smoother trail
    const LERP = 0.25

    function tick() {
      if (!isInside) { animId = null; return }
      // Interpolate toward target
      currentX += (targetX - currentX) * LERP
      currentY += (targetY - currentY) * LERP
      // Offset by (-1, -1) so the SVG arrow tip (path starts at M1,1) aligns with the real cursor
      cursor.style.transform = `translate(${currentX - 1}px, ${currentY - 1}px)`
      animId = requestAnimationFrame(tick)
    }

    function onMove(e) {
      const rect = carousel.getBoundingClientRect()
      // getBoundingClientRect returns screen-space (post-transform) dimensions,
      // but translate() operates in local (pre-transform) space.
      // Dividing by the scale ratio corrects the mismatch caused by
      // the parent laptop-wrapper's scale(1.4) transform.
      const scaleX = rect.width / carousel.offsetWidth
      const scaleY = rect.height / carousel.offsetHeight
      targetX = (e.clientX - rect.left) / scaleX
      targetY = (e.clientY - rect.top) / scaleY
      if (!isInside) {
        // First entry — snap immediately (no lerp lag on enter)
        isInside = true
        currentX = targetX
        currentY = targetY
        cursor.style.transform = `translate(${currentX - 1}px, ${currentY - 1}px)`
      }
      if (!animId) animId = requestAnimationFrame(tick)
    }

    function onLeave() {
      isInside = false
      if (animId) { cancelAnimationFrame(animId); animId = null }
    }

    carousel.addEventListener('mousemove', onMove)
    carousel.addEventListener('mouseleave', onLeave)
    return () => {
      carousel.removeEventListener('mousemove', onMove)
      carousel.removeEventListener('mouseleave', onLeave)
      if (animId) cancelAnimationFrame(animId)
    }
  }, [])

  // ── Dot click handler ──
  function handleDotClick(index) {
    setCurrentSlide(index)
    const track = trackRef.current
    if (track) {
      if (index === 1) track.classList.add('at-slide-1')
      else track.classList.remove('at-slide-1')
    }
  }

  return (
    <div className="laptop-wrapper" id="laptop-frame" ref={ref}>
      {/* ── Lid ── */}
      <div className="laptop-lid">
        <div className="laptop-camera"></div>
        <div className="laptop-screen">
          {/* ── Browser Chrome (macOS-style) ── */}
          <div className="browser-chrome">
            <div className="browser-chrome-left">
              <div className="browser-dots">
                <span></span><span></span><span></span>
              </div>
            </div>
            <div className="browser-chrome-center">
              <div className="browser-address-bar">events.vistream.tv</div>
            </div>
            <div className="browser-chrome-right"></div>
          </div>

          {/* ── Webinar Stage ── */}
          <div className="webinar-stage">
            {/* ── Presenter Camera (Top-Left PIP) ── */}
            <div className="webinar-presenter hero-reveal">
              <video
                src="/video/speaker1.mp4"
                autoPlay
                muted
                loop
                playsInline
                disablePictureInPicture
                disableRemotePlayback
                className="presenter-image"
              />
              <div className="presenter-mask"></div>
              <div className="presenter-name">Dr. Sarah Jenkins</div>
            </div>

            {/* ── Slides Carousel ── */}
            <div className="slides-carousel hero-reveal" ref={carouselRef}>
              {/* Custom Cursor */}
              <div className="slide-cursor" id="slideCursor" ref={cursorRef}>
                <svg className="cursor-arrow" width="12" height="16" viewBox="0 0 12 16" fill="none">
                  <path d="M1 1L11 8L6 8.5L4 15L1 1Z" fill="#0ea5e9" stroke="#fff" strokeWidth="1"/>
                </svg>
                <span className="cursor-label">You</span>
              </div>

              <div className="slides-track" ref={trackRef}>
                {/* Slide 1: Vistream Branding */}
                <div className="webinar-slide slide-brand">
                  <div className="laptop-live-badge">
                    <span className="live-dot"></span>LIVE
                  </div>
                  <div className="silk-bg"></div>
                  <div className="slide-inner brand-inner">
                    <img src="/img/vistream-logo.ico" alt="Vistream" className="brand-logo" />
                    <h2 className="brand-title">Vistream Events</h2>
                    <p className="brand-subtitle">where intelligence meets expertise</p>
                  </div>
                </div>

                {/* Slide 2: Product Features */}
                <div className="webinar-slide slide-features">
                  <div className="laptop-live-badge">
                    <span className="live-dot"></span>LIVE
                  </div>
                  <div className="slide-inner">
                    <div className="slide-content">
                      <h2 className="font-display text-display">
                        <span className="rotating-words">
                          <span className="rotating-word active">Create</span>
                          <span className="rotating-word">Manage</span>
                          <span className="rotating-word">Share</span>
                        </span>
                        <br />AI-powered Digital Events
                      </h2>
                      <p className="hero-sub">AI-guided workflows and instant suggestions, intelligent user journey builders, Microsoft Co-pilot &amp; Claude Co-work connections and many more...</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide Dots */}
              <div className="slide-dots">
                <span
                  className={`slide-dot${currentSlide === 0 ? ' active' : ''}`}
                  data-slide="0"
                  onClick={() => handleDotClick(0)}
                ></span>
                <span
                  className={`slide-dot${currentSlide === 1 ? ' active' : ''}`}
                  data-slide="1"
                  onClick={() => handleDotClick(1)}
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Base ── */}
      <div className="laptop-base">
        <div className="laptop-base-notch"></div>
      </div>
    </div>
  )
})

export default LaptopMockup
