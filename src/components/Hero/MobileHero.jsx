import LaptopMockup from './LaptopMockup'
import TrustBar from './TrustBar'
import LogoMarquee from './LogoMarquee'

export default function MobileHero() {
  return (
    <header
      id="hero"
      className="relative min-h-screen bg-hero overflow-hidden pt-20 pb-12 px-4"
    >
      {/* Spotlights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-white/10 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-brand-300/20 rounded-full blur-[80px]" />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-md mx-auto">
        {/* Laptop Mockup */}
        <LaptopMockup className="mb-6" />

        {/* Trust Bar */}
        <TrustBar />

        {/* Logo Marquee */}
        <LogoMarquee />
      </div>
    </header>
  )
}
