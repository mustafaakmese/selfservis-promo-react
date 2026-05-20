import { useEffect, useRef, useState, useCallback } from 'react'
import LaptopMockup from './LaptopMockup'
import TrustBar from './TrustBar'
import ScrollCards from './ScrollCards'

export default function HeroSection() {
  const heroRef = useRef(null)
  const heroTextRef = useRef(null)
  const laptopRef = useRef(null)
  const scrollSeqRef = useRef(null)
  const wizardTextRef = useRef(null)
  const countdownRef = useRef(null)
  const countdownNumRef = useRef(null)
  const progressFillRef = useRef(null)
  const stepLabelsRef = useRef([])

  const [countdownDone, setCountdownDone] = useState(false)
  const [scrollEnabled, setScrollEnabled] = useState(false)
  const lastActiveRef = useRef(-1)
  const lastMobileCardRef = useRef(-1)

  // ── Countdown on page load ──
  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    // Mobile also gets the countdown now

    let cancelled = false
    const timers = []

    const sequence = [
      { text: '3', cls: 'pop', duration: 600 },
      { text: '2', cls: 'pop', duration: 600 },
      { text: '1', cls: 'pop', duration: 600 },
      { text: 'ACTION!', cls: 'action-pop', duration: 1000 }
    ]

    const setupTimer = setTimeout(() => {
      if (cancelled) return

      // Hide hero text initially
      if (heroTextRef.current) {
        heroTextRef.current.style.transform = 'translateY(40px) scale(1)'
        heroTextRef.current.style.opacity = '0'
      }
      if (scrollSeqRef.current?.getSequenceEl) {
        const seqEl = scrollSeqRef.current.getSequenceEl()
        if (seqEl) seqEl.style.opacity = '0'
      }

      let step = 0
      function showNext() {
        if (cancelled) return
        if (step >= sequence.length) {
          // Done — reveal content
          if (countdownRef.current) countdownRef.current.classList.add('done')
          const t1 = setTimeout(() => {
            if (cancelled) return
            if (heroTextRef.current) {
              heroTextRef.current.style.transform = 'translateY(0) scale(1)'
              heroTextRef.current.style.opacity = '1'
            }
            if (laptopRef.current && !laptopRef.current.classList.contains('visible')) {
              laptopRef.current.style.transition = 'transform 0.8s var(--ease-out-quint)'
              laptopRef.current.classList.add('visible')
              // Reveal all hero-reveal children (presenter video, slides carousel)
              const t2 = setTimeout(() => {
                if (cancelled) return
                document.querySelectorAll('.hero-reveal').forEach(el => el.classList.add('visible'))
              }, 150)
              timers.push(t2)
              const t3 = setTimeout(() => {
                if (cancelled) return
                if (laptopRef.current) laptopRef.current.style.transition = 'none'
              }, 850)
              timers.push(t3)
            }
            const t4 = setTimeout(() => {
              if (cancelled) return
              setScrollEnabled(true)
              setCountdownDone(true)
            }, 400)
            timers.push(t4)
          }, 250)
          timers.push(t1)
          return
        }

        const current = sequence[step]
        if (countdownNumRef.current) {
          countdownNumRef.current.textContent = current.text
          countdownNumRef.current.className = 'countdown-number'
          void countdownNumRef.current.offsetWidth // reflow
          countdownNumRef.current.classList.add(current.cls)
        }
        step++
        const t = setTimeout(showNext, current.duration)
        timers.push(t)
      }

      const startTimer = setTimeout(showNext, 400)
      timers.push(startTimer)
    }, 100)
    timers.push(setupTimer)

    return () => {
      cancelled = true
      timers.forEach(t => clearTimeout(t))
    }
  }, [])

  // ── Track which snap step the hero is at ──
  const heroSnapIndex = useRef(0)

  // ── Snap-index driven discrete state (desktop) ──
  useEffect(() => {
    const onSnapChange = (e) => {
      const { index } = e.detail
      heroSnapIndex.current = index
      const isMobile = window.matchMedia('(max-width: 768px)').matches
      if (isMobile) return
      // Slide toggle: snap 1 = slide 2, anything else = slide 1
      const track = document.querySelector('.slides-track')
      if (!track) return
      const onSlide2 = index === 1
      track.classList.toggle('at-slide-1', onSlide2)
      document.querySelectorAll('.slide-dot').forEach((d, i) => {
        d.classList.toggle('active', i === (onSlide2 ? 1 : 0))
      })
    }
    window.addEventListener('snapChange', onSnapChange)
    return () => window.removeEventListener('snapChange', onSnapChange)
  }, [])

  // ── Cached viewport height (updated on resize only, not per-scroll) ──
  const viewHeightRef = useRef(window.innerHeight)

  // ── Scroll handler — optimized: batched reads then writes ──
  const onScroll = useCallback(() => {
    if (!scrollEnabled) return

    const heroSection = heroRef.current
    if (!heroSection) return
    const rect = heroSection.getBoundingClientRect()
    const viewH = viewHeightRef.current
    const scrollDistance = -rect.top
    const maxScroll = rect.height - viewH
    if (maxScroll <= 0) return
    const rawProgress = Math.max(0, Math.min(1, scrollDistance / maxScroll))

    // ── MOBILE scroll-driven experience ──
    if (window.matchMedia('(max-width: 768px)').matches) {
      // Phase thresholds
      const SLIDE2      = 0.14  // phone switches to slide 2
      const FADE_START  = 0.28  // phone starts fading out
      const FADE_END    = 0.42  // phone gone, section 2 fully visible
      const CARD1       = 0.42
      const CARD2       = 0.57
      const CARD3       = 0.71
      const CARD4       = 0.85

      // Phone section opacity
      let phoneOpacity = 1
      if (rawProgress >= FADE_START) {
        phoneOpacity = Math.max(0, 1 - (rawProgress - FADE_START) / (FADE_END - FADE_START))
      }

      // Section 2 opacity
      let s2Opacity = 0
      if (rawProgress >= FADE_START) {
        s2Opacity = Math.min(1, (rawProgress - FADE_START) / (FADE_END - FADE_START))
      }

      // Slide change on phone mockup
      const track = document.querySelector('.slides-track')
      if (track) {
        const onSlide2 = rawProgress >= SLIDE2 && rawProgress < FADE_END
        track.classList.toggle('at-slide-1', onSlide2)
        document.querySelectorAll('.slide-dot').forEach((d, i) => {
          d.classList.toggle('active', i === (onSlide2 ? 1 : 0))
        })
      }

      // Write phone opacity
      if (heroTextRef.current) {
        heroTextRef.current.style.opacity = phoneOpacity
        heroTextRef.current.style.pointerEvents = phoneOpacity > 0.1 ? 'auto' : 'none'
      }

      // Write wizard text
      const wizardText = wizardTextRef.current
      if (wizardText) {
        wizardText.style.opacity = s2Opacity
        wizardText.style.transform = s2Opacity > 0 ? 'translateY(0)' : 'translateY(16px)'
      }

      // Write scroll-sequence opacity
      const seq = document.getElementById('scroll-sequence')
      if (seq) seq.style.opacity = s2Opacity

      // Active card from scroll position
      let targetCard = -1
      if      (rawProgress >= CARD4) targetCard = 3
      else if (rawProgress >= CARD3) targetCard = 2
      else if (rawProgress >= CARD2) targetCard = 1
      else if (rawProgress >= CARD1) targetCard = 0

      if (targetCard !== lastMobileCardRef.current) {
        const prev = lastMobileCardRef.current
        lastMobileCardRef.current = targetCard
        if (prev >= 0 && scrollSeqRef.current?.deactivateCard) scrollSeqRef.current.deactivateCard(prev)
        const cards = document.querySelectorAll('.scroll-card')
        cards.forEach((card, i) => {
          card.classList.remove('mobile-card-active', 'mobile-card-prev', 'stack-top', 'stacked', 'stack-pending')
          if (i === targetCard) card.classList.add('mobile-card-active')
          else if (i < targetCard) card.classList.add('mobile-card-prev')
        })
        if (targetCard >= 0 && scrollSeqRef.current?.activateCard) scrollSeqRef.current.activateCard(targetCard)
        const progressFill = progressFillRef.current
        if (progressFill) progressFill.style.width = targetCard >= 0 ? ((targetCard + 1) / 4 * 100) + '%' : '0%'
        stepLabelsRef.current.forEach((lbl, i) => {
          if (!lbl) return
          lbl.classList.remove('active', 'done')
          if (targetCard >= 0) {
            if (i < targetCard) lbl.classList.add('done')
            else if (i === targetCard) lbl.classList.add('active')
          }
        })
      }

      // ── Exit fade: clean transition out of hero ──
      const EXIT_START = 0.93
      const heroContent = document.querySelector('.hero-content')
      if (heroContent) {
        if (rawProgress >= EXIT_START) {
          const exitProgress = Math.min(1, (rawProgress - EXIT_START) / (1 - EXIT_START))
          heroContent.style.opacity = 1 - exitProgress
        } else {
          heroContent.style.opacity = 1
        }
      }

      return
    }

    // ── DESKTOP: continue with existing logic ──
    const heroTextBlock = heroTextRef.current
    const laptopFrameEl = laptopRef.current
    const scrollSequence = document.getElementById('scroll-sequence')
    const wizardText = wizardTextRef.current
    const progressFill = progressFillRef.current
    const laptopVisible = laptopFrameEl && laptopFrameEl.classList.contains('visible')

    // ═══ COMPUTE PHASE — pure calculations, no DOM access ═══
    // Phase boundaries:
    // 0.00-0.09 = Slide 1 → Slide 2 (ONLY slide changes, nothing else moves)
    // 0.12-0.19 = Hero text fades out, laptop scales down (buffer after slide 2 snap at 0.09)
    // 0.19-0.20 = Wizard text appears
    // 0.20+     = Step cards appear
    const FADE_START = 0.12
    const FADE_END = 0.19
    const cardsStart = 0.20

    // ── GATE: if snap index <= 1, restore initial state ──
    // Safe to force hero text visible here — countdown is always done
    // (scrollEnabled check at line 140 blocks this during countdown)
    if (heroSnapIndex.current <= 1) {
      // Restore hero text
      if (heroTextBlock) {
        heroTextBlock.style.transform = 'translateY(0) scale(1)'
        heroTextBlock.style.opacity = '1'
      }
      // Restore laptop to full size
      if (laptopFrameEl && laptopVisible) {
        laptopFrameEl.style.transform = 'scale(1.4)'
      }
      // Hide wizard and cards
      if (wizardText) {
        wizardText.style.opacity = '0'
        wizardText.style.transform = 'translateY(35vh) scale(1.1)'
      }
      if (scrollSequence) scrollSequence.style.opacity = '0'
      return
    }

    // Hero text transforms — stays fully visible until FADE_START
    let heroTextTransform, heroTextOpacity
    if (rawProgress >= FADE_END) {
      heroTextTransform = `translateY(${-viewH * 0.26}px) scale(0.95)`
      heroTextOpacity = '0'
    } else if (rawProgress > FADE_START) {
      const textProgress = (rawProgress - FADE_START) / (FADE_END - FADE_START)
      const translateY = -textProgress * (viewH * 0.26)
      heroTextTransform = `translateY(${translateY}px) scale(${1 - textProgress * 0.05})`
      heroTextOpacity = String(1 - textProgress)
    } else {
      heroTextTransform = 'translateY(0) scale(1)'
      heroTextOpacity = '1'
    }

    // Wizard text transforms
    let wizardOpacity, wizardTransform
    if (rawProgress > FADE_END && rawProgress < 0.95) {
      wizardOpacity = '1'
      const moveStart = FADE_END
      const moveEnd = cardsStart
      let moveProgress = 0
      if (rawProgress >= moveEnd) {
        moveProgress = 1
      } else if (rawProgress > moveStart) {
        const mp = (rawProgress - moveStart) / (moveEnd - moveStart)
        moveProgress = 1 - Math.pow(1 - mp, 4)
      }
      const yOffset = (1 - moveProgress) * 30
      const scale = 1 + ((1 - moveProgress) * 0.2)
      wizardTransform = `translateY(${yOffset}vh) scale(${scale})`
    } else if (rawProgress >= 0.95) {
      wizardOpacity = '0'
      wizardTransform = 'translateY(0) scale(1)'
    } else {
      wizardOpacity = '0'
      wizardTransform = 'translateY(35vh) scale(1.1)'
    }

    // Scroll sequence visibility
    const seqOpacity = rawProgress >= cardsStart - 0.02 ? '1' : '0'

    // Laptop scale — stays at 1.4 until FADE_START, then scales down
    let laptopTransform = null
    if (laptopVisible) {
      if (rawProgress >= FADE_END) {
        laptopTransform = 'scale(0.95)'
      } else if (rawProgress > FADE_START) {
        const t = (rawProgress - FADE_START) / (FADE_END - FADE_START)
        const s = 1.4 + (0.95 - 1.4) * t
        laptopTransform = `scale(${s})`
      }
    }

    // Active card index
    let activeIndex = -1
    if (rawProgress > cardsStart) {
      const cardProgress = (rawProgress - cardsStart) / (1 - cardsStart - 0.02)
      const clamped = Math.max(0, Math.min(0.9999, cardProgress))
      activeIndex = Math.floor(clamped * 4)
      if (activeIndex >= 4) activeIndex = 3
    }

    // ═══ WRITE PHASE — all DOM mutations together, no reads ═══
    if (heroTextBlock) {
      heroTextBlock.style.transform = heroTextTransform
      heroTextBlock.style.opacity = heroTextOpacity
    }

    if (wizardText) {
      wizardText.style.opacity = wizardOpacity
      wizardText.style.transform = wizardTransform
    }

    if (scrollSequence) {
      scrollSequence.style.opacity = seqOpacity
    }

    if (laptopTransform !== null && laptopFrameEl) {
      laptopFrameEl.style.transform = laptopTransform
    }

    // Card stacking state (only when changed)
    if (activeIndex !== lastActiveRef.current) {
      const prevActive = lastActiveRef.current
      lastActiveRef.current = activeIndex

      // Deactivate previous card effects
      if (prevActive >= 0 && scrollSeqRef.current?.deactivateCard) {
        scrollSeqRef.current.deactivateCard(prevActive)
      }

      // Apply stack state to cards
      const cards = document.querySelectorAll('.scroll-card')
      cards.forEach((card, i) => {
        card.classList.remove('stack-top', 'stacked', 'stack-pending')
        if (activeIndex < 0) {
          card.classList.add('stack-pending')
          card.style.transform = 'translateX(120%)'
          card.style.zIndex = 1
          card.style.opacity = 0
          return
        }
        if (i < activeIndex) {
          const depth = activeIndex - i
          const offsetX = depth * 30
          const scale = 1 - (depth * 0.03)
          card.classList.add('stacked')
          card.style.transform = `translateX(-${offsetX}px) scale(${scale})`
          card.style.zIndex = 10 - depth
          card.style.opacity = Math.max(0.4, 1 - depth * 0.2)
        } else if (i === activeIndex) {
          card.classList.add('stack-top')
          card.style.transform = 'translateX(0) scale(1)'
          card.style.zIndex = 15
          card.style.opacity = 1
        } else {
          card.classList.add('stack-pending')
          card.style.transform = 'translateX(120%)'
          card.style.zIndex = 1
          card.style.opacity = 0
        }
      })

      // Update progress bar
      if (progressFill) {
        const fillPct = activeIndex < 0 ? 0 : ((activeIndex + 1) / 4 * 100)
        progressFill.style.width = fillPct + '%'
      }

      // Update step labels
      stepLabelsRef.current.forEach((lbl, i) => {
        if (!lbl) return
        lbl.classList.remove('active', 'done')
        if (activeIndex >= 0) {
          if (i < activeIndex) lbl.classList.add('done')
          else if (i === activeIndex) lbl.classList.add('active')
        }
      })

      // Activate current card effects
      if (activeIndex >= 0 && scrollSeqRef.current?.activateCard) {
        scrollSeqRef.current.activateCard(activeIndex)
      }
    }
  }, [scrollEnabled])

  useEffect(() => {
    let ticking = false
    const handler = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          onScroll()
          ticking = false
        })
      }
    }
    const onResize = () => {
      viewHeightRef.current = window.innerHeight
      onScroll() // immediate, no rAF needed for resize
    }
    window.addEventListener('scroll', handler, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    return () => {
      window.removeEventListener('scroll', handler)
      window.removeEventListener('resize', onResize)
    }
  }, [onScroll])

  // ── Canvas particles (desktop only — no mousemove on touch devices) ──
  useEffect(() => {
    // Skip canvas particle system on mobile — saves CPU/GPU and battery
    if (window.matchMedia('(max-width: 768px)').matches) return

    const canvas = document.getElementById('hero-canvas')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let width, height
    let particles = []
    let mouse = { x: null, y: null }
    let lastMouse = { x: null, y: null }
    let animId = null
    let running = false

    function resize() {
      width = canvas.width = window.innerWidth
      const hero = heroRef.current
      height = canvas.height = hero ? hero.clientHeight : window.innerHeight
    }
    window.addEventListener('resize', resize)
    resize()

    function animate() {
      if (particles.length === 0) {
        running = false
        ctx.clearRect(0, 0, width, height)
        return
      }
      ctx.clearRect(0, 0, width, height)
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy; p.life -= p.decay
        if (p.life <= 0) { particles.splice(i, 1); continue }
        ctx.globalAlpha = p.life * 0.8
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = 'rgb(255, 255, 255)'
        ctx.fill()
      }
      ctx.globalAlpha = 1
      animId = requestAnimationFrame(animate)
    }

    function startLoop() {
      if (!running) { running = true; animId = requestAnimationFrame(animate) }
    }

    function onMouseMove(e) {
      const rect = canvas.getBoundingClientRect()
      lastMouse.x = mouse.x; lastMouse.y = mouse.y
      mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top
      if (lastMouse.x !== null) {
        let dx = mouse.x - lastMouse.x, dy = mouse.y - lastMouse.y
        let dist = Math.sqrt(dx*dx + dy*dy)
        let count = Math.min(Math.floor(dist / 5), 6)
        for (let i = 0; i < count; i++) {
          particles.push({
            x: mouse.x + (Math.random()-0.5)*10,
            y: mouse.y + (Math.random()-0.5)*10,
            vx: (Math.random() - 0.5) * 1.5,
            vy: (Math.random() - 0.5) * 1.5 - 0.5,
            life: 1,
            decay: Math.random() * 0.02 + 0.01,
            size: Math.random() * 2 + 1,
          })
        }
        startLoop()
      }
    }
    window.addEventListener('mousemove', onMouseMove)

    return () => {
      if (animId) cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [])




  return (
    <section className="hero" id="hero" ref={heroRef}>
      {/* Canvas for particles */}
      <canvas id="hero-canvas"></canvas>

      {/* Studio Spotlights */}
      <div className="studio-spotlights">
        <div className="spotlight spot-left"></div>
        <div className="spotlight spot-right"></div>
      </div>

      {/* Countdown Overlay */}
      <div className="hero-countdown" id="hero-countdown" ref={countdownRef}>
        <div className="viewfinder-corner top-left"></div>
        <div className="viewfinder-corner top-right"></div>
        <div className="viewfinder-corner bottom-left"></div>
        <div className="viewfinder-corner bottom-right"></div>
        <div className="recording-indicator">
          <span className="rec-dot"></span> REC
        </div>
        <span className="countdown-number" ref={countdownNumRef}>3</span>
      </div>

      {/* Hero Content (sticky) */}
      <div className="hero-content">
        {/* Hero Text Block */}
        <div className="hero-text-block" ref={heroTextRef}>
          <LaptopMockup ref={laptopRef} />
          <TrustBar />
        </div>

        {/* Wizard Text + Progress Bar (unified block) */}
        <div className="hero-wizard-text" ref={wizardTextRef} id="hero-wizard-text">
          <h2 className="font-display text-heading-lg">From idea to live in minutes</h2>
          <p>Our guided wizard takes you through every step — no training needed.</p>
          {/* Progress bar — inside wizard text for mobile layout */}
          <div className="wizard-progress-bar" id="wizard-step-progress">
            <div className="step-progress-track">
              <div className="step-progress-fill" ref={progressFillRef}></div>
            </div>
            <div className="step-progress-labels">
              <span className="step-label active" data-step="0" ref={el => { if (stepLabelsRef) stepLabelsRef.current[0] = el }}>Setup</span>
              <span className="step-label" data-step="1" ref={el => { if (stepLabelsRef) stepLabelsRef.current[1] = el }}>Audience</span>
              <span className="step-label" data-step="2" ref={el => { if (stepLabelsRef) stepLabelsRef.current[2] = el }}>Live</span>
              <span className="step-label" data-step="3" ref={el => { if (stepLabelsRef) stepLabelsRef.current[3] = el }}>Post-Event</span>
            </div>
          </div>
        </div>

        {/* Scroll Cards */}
        <ScrollCards 
          ref={scrollSeqRef}
          progressFillRef={progressFillRef}
          stepLabelsRef={stepLabelsRef}
        />
      </div>
    </section>
  )
}
