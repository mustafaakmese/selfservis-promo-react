import { useEffect, useRef, useCallback } from 'react'

/**
 * Full-page scroll snap controller.
 * Uses INSTANT scrollTo — no smooth animation, no timing locks.
 * One wheel/touch gesture = one snap. Period.
 */
export default function useScrollSnap() {
  const currentIndex = useRef(0)
  const snapPoints = useRef([])
  const touchStartY = useRef(0)

  // Wheel gesture detection: locked after first event, unlocked after 200ms of silence
  const wheelLocked = useRef(false)
  const wheelTimer = useRef(null)

  /* ── Calculate every snap position ── */
  const calculate = useCallback(() => {
    const pts = []
    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const vh = window.innerHeight

    // ── HERO snap points ──
    const hero = document.getElementById('hero')
    if (hero) {
      const heroTop = hero.offsetTop
      const heroH = hero.scrollHeight
      const maxScroll = heroH - vh
      if (maxScroll > 0) {
        if (isMobile) {
          const phases = [0, 0.14, 0.42, 0.57, 0.71, 0.85]
          phases.forEach(p => pts.push({ pos: heroTop + p * maxScroll, section: 'hero' }))
        } else {
          const phases = [0, 0.09, 0.20, 0.395, 0.59, 0.79]
          phases.forEach(p => pts.push({ pos: heroTop + p * maxScroll, section: 'hero' }))
        }
      }
    }

    // ── FEATURES snap points ──
    const featSection = document.querySelector('.features-stacking-section')
    if (featSection) {
      const wrapper = featSection.querySelector('.ft-stack-wrapper')
      if (wrapper) {
        const wrapperTop = wrapper.getBoundingClientRect().top + window.scrollY
        const wrapperH = wrapper.scrollHeight
        const maxScroll = wrapperH - vh
        if (maxScroll > 0) {
          const CARD_COUNT = 9
          for (let i = 0; i < CARD_COUNT; i++) {
            // Use (i + 0.1) to land safely INSIDE each card's zone
            // Avoids floating point: floor((4/9)*9) = floor(3.999...) = 3 (wrong!)
            const progress = (i + 0.1) / CARD_COUNT
            pts.push({ pos: wrapperTop + progress * maxScroll, section: 'features' })
          }
          pts.push({ pos: wrapperTop + maxScroll, section: 'features' })
        }
      }
    }

    // ── REGULAR SECTIONS ──
    const sections = [
      ['#integrations', 'integrations'],
      ['#social-proof', 'social-proof'],
      ['#comparison', 'comparison'],
      ['.cta-band', 'cta']
    ]
    sections.forEach(([sel, name]) => {
      const el = document.querySelector(sel)
      if (el) pts.push({ pos: el.getBoundingClientRect().top + window.scrollY, section: name })
    })

    const footer = document.querySelector('footer')
    if (footer) pts.push({ pos: footer.getBoundingClientRect().top + window.scrollY, section: 'footer' })

    // Sort & deduplicate (merge points within 20px)
    pts.sort((a, b) => a.pos - b.pos)
    const deduped = [pts[0]]
    for (let i = 1; i < pts.length; i++) {
      if (pts[i].pos - deduped[deduped.length - 1].pos > 20) {
        deduped.push(pts[i])
      }
    }
    snapPoints.current = deduped
  }, [])

  /* ── Go to a snap index ── */
  const goTo = useCallback((index) => {
    const pts = snapPoints.current
    if (index < 0 || index >= pts.length) return
    const prevIndex = currentIndex.current
    if (index === prevIndex) return
    currentIndex.current = index

    // Same section = instant (sticky viewport, no visible scroll)
    // Cross section = smooth (viewport changes, needs visual transition)
    const fromSection = pts[prevIndex]?.section
    const toSection = pts[index]?.section
    const behavior = (fromSection === toSection) ? 'instant' : 'smooth'

    window.scrollTo({ top: pts[index].pos, behavior })

    // Notify listeners
    window.dispatchEvent(new CustomEvent('snapChange', { detail: { index, prevIndex } }))
  }, [])

  /* ── Find closest snap index ── */
  const findClosest = useCallback(() => {
    const y = window.scrollY
    let best = 0
    let bestDist = Infinity
    snapPoints.current.forEach((pt, i) => {
      const d = Math.abs(y - pt.pos)
      if (d < bestDist) { bestDist = d; best = i }
    })
    return best
  }, [])

  useEffect(() => {
    const initTimer = setTimeout(() => {
      calculate()
      currentIndex.current = findClosest()
    }, 600)

    let resizeTimer
    const onResize = () => {
      clearTimeout(resizeTimer)
      resizeTimer = setTimeout(() => {
        calculate()
        currentIndex.current = findClosest()
      }, 200)
    }

    /* ── WHEEL ── */
    const onWheel = (e) => {
      // Sync currentIndex with actual scroll position (handles nav clicks, scrollIntoView, etc.)
      if (!wheelLocked.current) {
        currentIndex.current = findClosest()
      }

      const scrollable = e.target.closest('.legal-modal-content, .comparison-table-wrapper, [data-scroll-free]')

      // If inside a scrollable element AND this is a NEW gesture → allow native scroll
      if (scrollable && !wheelLocked.current) return

      // Block everything else (including momentum over scrollable elements)
      e.preventDefault()

      // Reset unlock timer on every event — keeps lock alive during gesture
      clearTimeout(wheelTimer.current)
      wheelTimer.current = setTimeout(() => { wheelLocked.current = false }, 200)

      if (wheelLocked.current) return

      // First event of gesture — snap and lock
      wheelLocked.current = true
      if (scrollable) return // New gesture inside scrollable — don't snap, just lock
      const dir = e.deltaY > 0 ? 1 : -1
      goTo(currentIndex.current + dir)
    }

    /* ── TOUCH ── */
    const onTouchStart = (e) => {
      if (e.target.closest('.legal-modal-content, .comparison-table-wrapper, [data-scroll-free]')) return
      // Sync currentIndex with actual scroll position
      currentIndex.current = findClosest()
      touchStartY.current = e.touches[0].clientY
    }

    const onTouchMove = (e) => {
      if (e.target.closest('.legal-modal-content, .comparison-table-wrapper, [data-scroll-free]')) return
      e.preventDefault()
    }

    const onTouchEnd = (e) => {
      if (e.target.closest('.legal-modal-content, .comparison-table-wrapper, [data-scroll-free]')) return
      const deltaY = touchStartY.current - e.changedTouches[0].clientY
      if (Math.abs(deltaY) > 40) {
        const dir = deltaY > 0 ? 1 : -1
        goTo(currentIndex.current + dir)
      }
    }

    /* ── KEYBOARD ── */
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault()
        goTo(currentIndex.current + 1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        goTo(currentIndex.current - 1)
      } else if (e.key === 'Home') {
        e.preventDefault()
        goTo(0)
      } else if (e.key === 'End') {
        e.preventDefault()
        goTo(snapPoints.current.length - 1)
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: false })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onTouchEnd, { passive: true })
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('resize', onResize)

    return () => {
      clearTimeout(initTimer)
      clearTimeout(resizeTimer)
      clearTimeout(wheelTimer.current)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('touchend', onTouchEnd)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('resize', onResize)
    }
  }, [calculate, findClosest, goTo])

  // Expose global section-level navigation for the Navbar arrows
  useEffect(() => {
    window.__snapNav = {
      prev: () => {
        const pts = snapPoints.current
        if (!pts.length) return
        const cur = findClosest()
        const curSection = pts[cur]?.section
        // Find the first snap point of the previous section
        for (let i = cur - 1; i >= 0; i--) {
          if (pts[i].section !== curSection) {
            // Jump to the first snap point of that section
            const targetSection = pts[i].section
            let first = i
            while (first > 0 && pts[first - 1].section === targetSection) first--
            currentIndex.current = cur
            goTo(first)
            return
          }
        }
      },
      next: () => {
        const pts = snapPoints.current
        if (!pts.length) return
        const cur = findClosest()
        const curSection = pts[cur]?.section
        // Find the first snap point of the next section
        for (let i = cur + 1; i < pts.length; i++) {
          if (pts[i].section !== curSection) {
            currentIndex.current = cur
            goTo(i)
            return
          }
        }
      },
    }
    return () => { delete window.__snapNav }
  }, [findClosest, goTo])

  return { snapPoints, currentIndex, goTo, recalculate: calculate }
}
