import { useState, useEffect, useRef } from 'react'
import LaptopMockup from './LaptopMockup'
import TrustBar from './TrustBar'
import LogoMarquee from './LogoMarquee'
import ScrollCards from './ScrollCards'

export default function DesktopHero() {
  const heroRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [countdownNum, setCountdownNum] = useState(3)
  const [showContent, setShowContent] = useState(false)
  const [showWizardText, setShowWizardText] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      const heroHeight = heroRef.current.offsetHeight
      const progress = Math.max(0, Math.min(1, -rect.top / (heroHeight - window.innerHeight)))
      setScrollProgress(progress)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Countdown sequence
  useEffect(() => {
    const timers = []
    timers.push(setTimeout(() => setCountdownNum(2), 1000))
    timers.push(setTimeout(() => setCountdownNum(1), 2000))
    timers.push(setTimeout(() => {
      setCountdownNum(0)
      setShowContent(true)
    }, 3000))
    return () => timers.forEach(clearTimeout)
  }, [])

  // Wizard text appears after scrolling 30%
  useEffect(() => {
    setShowWizardText(scrollProgress > 0.15)
  }, [scrollProgress])

  // Laptop scale: starts at 1.05, grows to 1.4 as you scroll down to ~20%
  const laptopScale = 1.05 + Math.min(scrollProgress * 2, 1) * 0.35
  const laptopOpacity = scrollProgress > 0.35 ? Math.max(0, 1 - (scrollProgress - 0.35) * 4) : 1

  return (
    <header
      ref={heroRef}
      id="hero"
      className="relative bg-hero"
      style={{ height: '550vh' }}
    >
      <div className="sticky top-0 h-screen overflow-hidden">
        {/* Background spotlights */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-[120px]" />
          <div className="absolute top-1/3 right-1/4 w-72 h-72 bg-brand-300/20 rounded-full blur-[100px]" />
        </div>

        {/* Canvas placeholder for hero particles (optional) */}

        <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
          {/* Countdown Overlay */}
          {!showContent && (
            <div className="absolute inset-0 z-30 flex items-center justify-center">
              {/* Viewfinder corners */}
              <div className="absolute top-20 left-20 w-12 h-12 border-t-2 border-l-2 border-white/40" />
              <div className="absolute top-20 right-20 w-12 h-12 border-t-2 border-r-2 border-white/40" />
              <div className="absolute bottom-20 left-20 w-12 h-12 border-b-2 border-l-2 border-white/40" />
              <div className="absolute bottom-20 right-20 w-12 h-12 border-b-2 border-r-2 border-white/40" />

              {/* REC indicator */}
              <div className="absolute top-24 left-24 flex items-center gap-2 text-white/80 text-sm font-mono">
                <span className="w-2 h-2 rounded-full bg-red-500" style={{ animation: 'rec-blink 1s infinite' }} />
                REC
              </div>

              {/* Countdown number */}
              {countdownNum > 0 && (
                <span
                  key={countdownNum}
                  className="text-8xl font-light text-white/70"
                  style={{ animation: 'countdown-pulse 1s ease-out' }}
                >
                  {countdownNum}
                </span>
              )}
            </div>
          )}

          {/* Hero Content */}
          <div
            className="flex flex-col items-center transition-all duration-700"
            style={{
              opacity: showContent ? 1 : 0,
              transform: showContent ? 'translateY(0)' : 'translateY(40px)',
            }}
          >
            {/* Laptop with scroll-driven scaling */}
            <div
              className="transition-transform will-change-transform"
              style={{
                transform: `scale(${laptopScale})`,
                opacity: laptopOpacity,
              }}
            >
              <LaptopMockup />
            </div>

            {/* Trust bar + Logos (fade out when scrolling deep) */}
            <div
              className="transition-opacity duration-300"
              style={{ opacity: laptopOpacity }}
            >
              <TrustBar />
              <LogoMarquee />
            </div>
          </div>

          {/* Wizard text — appears after scroll */}
          <div
            className="absolute bottom-32 left-0 right-0 text-center transition-all duration-500"
            style={{
              opacity: showWizardText && scrollProgress < 0.5 ? 1 : 0,
              transform: showWizardText ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            <h2 className="text-3xl font-bold text-white mb-2">From idea to live in minutes</h2>
            <p className="text-white/70 text-lg">Our guided wizard takes you through every step — no training needed.</p>
          </div>

          {/* Scroll-driven Step Cards */}
          {scrollProgress > 0.3 && (
            <ScrollCards progress={scrollProgress} />
          )}
        </div>
      </div>
    </header>
  )
}
