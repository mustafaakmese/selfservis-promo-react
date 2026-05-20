const logos = [
  { src: '/company-logos/Viatris Logo SVG.svg', alt: 'Viatris' },
  { src: '/company-logos/abbvie-logo.svg', alt: 'Abbvie' },
  { src: '/company-logos/amgen-1.svg', alt: 'Amgen' },
  { src: '/company-logos/astra-zeneca-1.svg', alt: 'AstraZeneca' },
  { src: '/company-logos/bd-company-logo.svg', alt: 'BD' },
  { src: '/company-logos/boston-scientific-logo.svg', alt: 'Boston Scientific' },
  { src: '/company-logos/bristol-myers-squibb-logo-2020--1.svg', alt: 'Bristol Myers Squibb' },
  { src: '/company-logos/gilead-sciences-logo.svg', alt: 'Gilead Sciences' },
  { src: '/company-logos/gsk-1.svg', alt: 'GSK' },
  { src: '/company-logos/hoffmann-la-roche-logo.svg', alt: 'Hoffmann-La Roche' },
  { src: '/company-logos/johnson-johnson-2023-.svg', alt: 'Johnson & Johnson' },
  { src: '/company-logos/logo-takeda.svg', alt: 'Takeda' },
  { src: '/company-logos/medtronic-3.svg', alt: 'Medtronic' },
  { src: '/company-logos/merck-logo.svg', alt: 'Merck' },
  { src: '/company-logos/novartis-logo.svg', alt: 'Novartis' },
  { src: '/company-logos/novo-nordisk-logo.svg', alt: 'Novo Nordisk' },
  { src: '/company-logos/pfizer-2021-.svg', alt: 'Pfizer' },
  { src: '/company-logos/sanofi-logo-2022.svg', alt: 'Sanofi' },
]

export default function LogoMarquee() {
  return (
    <div className="w-full mt-6">
      <p className="text-center text-[11px] md:text-xs text-slate-400 uppercase tracking-widest font-medium mb-3">
        Trusted by industry leaders
      </p>
      <div className="relative overflow-hidden">
        {/* Fade edges */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white/80 to-transparent z-10 pointer-events-none hidden md:block" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none hidden md:block" />

        <div className="flex animate-[marquee_30s_linear_infinite] w-max">
          {[...logos, ...logos].map((logo, i) => (
            <img
              key={i}
              src={logo.src}
              alt={logo.alt}
              className="h-5 md:h-7 mx-4 md:mx-6 opacity-40 hover:opacity-80 transition-opacity grayscale hover:grayscale-0"
            />
          ))}
        </div>
      </div>
    </div>
  )
}
