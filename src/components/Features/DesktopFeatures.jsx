import { useRef, useState, useEffect } from 'react'
import { featureCards } from './featureData'
import FeatureCard from './FeatureCard'

export default function DesktopFeatures() {
  const wrapperRef = useRef(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const totalCards = featureCards.length

  useEffect(() => {
    const handleScroll = () => {
      if (!wrapperRef.current) return
      const rect = wrapperRef.current.getBoundingClientRect()
      const wrapperH = wrapperRef.current.offsetHeight
      const progress = Math.max(0, Math.min(1, -rect.top / (wrapperH - window.innerHeight)))
      const idx = Math.min(totalCards - 1, Math.floor(progress * totalCards))
      setActiveIndex(idx)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [totalCards])

  return (
    <section id="features" className="relative" ref={wrapperRef} style={{ height: `${totalCards * 60}vh` }}>
      <div className="sticky top-0 h-screen flex items-center overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-4xl font-bold text-slate-900 mb-3">
              Everything you need to run world-class events
            </h2>
            <p className="text-lg text-slate-500">
              From self-service setup to post-event analytics — a complete platform that replaces your entire event stack.
            </p>
          </div>

          {/* Card + Minimap row */}
          <div className="flex gap-6 items-start">
            {/* Card Stage */}
            <div className="flex-1 relative h-[480px]">
              {featureCards.map((feature, i) => {
                const isActive = i === activeIndex
                const isPassed = i < activeIndex
                const offset = isPassed ? -20 : isActive ? 0 : 20
                const scale = isActive ? 1 : 0.96
                const opacity = isActive ? 1 : isPassed ? 0 : 0.3

                return (
                  <div
                    key={i}
                    className="absolute inset-0 transition-all duration-500 ease-out"
                    style={{
                      transform: `translateY(${offset}px) scale(${scale})`,
                      opacity,
                      zIndex: isActive ? 10 : 1,
                      pointerEvents: isActive ? 'auto' : 'none',
                    }}
                  >
                    <FeatureCard feature={feature} index={i} className="h-full" />
                  </div>
                )
              })}
            </div>

            {/* Minimap */}
            <div className="w-28 flex flex-col gap-2 pt-4">
              {featureCards.map((feature, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg transition-all duration-300 cursor-pointer text-xs ${
                    i === activeIndex
                      ? 'bg-brand-50 text-brand-700 font-semibold shadow-sm'
                      : i < activeIndex
                        ? 'text-slate-400'
                        : 'text-slate-400'
                  }`}
                >
                  <span className="text-sm">{feature.icon}</span>
                  <span className="truncate">{feature.eyebrow.split(' ').pop()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-4 h-1 bg-slate-100 rounded-full overflow-hidden max-w-xl mx-auto">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${((activeIndex + 1) / totalCards) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
