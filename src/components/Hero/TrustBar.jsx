import { useEffect, useRef } from 'react'

const badges = [
  { src: '/certificate-badges/hipaa.svg', alt: 'HIPAA', label: 'HIPAA', tooltip: 'Health Insurance Portability & Accountability Act. Your patient and healthcare professional data is protected with enterprise-grade safeguards required by US federal law.' },
  { src: '/certificate-badges/gdpr.svg', alt: 'GDPR', label: 'GDPR', tooltip: 'General Data Protection Regulation. Full compliance with EU data privacy law. Your attendees\' personal data is processed lawfully with explicit consent controls.' },
  { src: '/certificate-badges/iso27001.svg', alt: 'ISO 27001', label: 'ISO 27001', tooltip: 'Information Security Management. Internationally recognized standard proving our security controls, risk management, and data protection processes are independently audited.' },
  { src: '/certificate-badges/iso27701.svg', alt: 'ISO 27701', label: 'ISO 27701', tooltip: 'Privacy Information Management. Extension of ISO 27001 focused specifically on personal data privacy.' },
  { src: '/certificate-badges/soc2.svg', alt: 'SOC 2', label: 'SOC 2', tooltip: 'Service Organization Control 2. Independent audit verifying our security, availability, and confidentiality controls.' },
  { src: '/certificate-badges/ISO42001.svg', alt: 'ISO 42001', label: 'ISO 42001', tooltip: 'AI Management System. The first international standard for responsible AI.' },
  { src: '/certificate-badges/EU AI Act.svg', alt: 'EU AI Act', label: 'EU AI Act', tooltip: 'EU Artificial Intelligence Act. Aligned with Europe\'s landmark AI regulation.' },
  { src: '/certificate-badges/NIST AI RMF.svg', alt: 'NIST AI RMF', label: 'NIST AI RMF', tooltip: 'National Institute of Standards & Technology AI Risk Management Framework.' },
  { src: '/certificate-badges/NIS 2.svg', alt: 'NIS 2', label: 'NIS 2', tooltip: 'Network and Information Security Directive 2. Compliance with the EU\'s cybersecurity directive.' },
  { src: '/certificate-badges/awsftr.svg', alt: 'AWS FTR', label: 'AWS FTR', tooltip: 'AWS Foundational Technical Review. Our infrastructure has been vetted by Amazon Web Services.' },
  { src: '/certificate-badges/microsoftsspa.svg', alt: 'Microsoft SSPA', label: 'Microsoft SSPA', tooltip: 'Microsoft Supplier Security & Privacy Assurance. Certified as a trusted Microsoft supplier.' },
]

const companyLogos = [
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

function BadgeItem({ badge }) {
  return (
    <>
      <div className="trust-badge" data-tooltip={badge.tooltip}>
        <img src={badge.src} alt={badge.alt} />
        <span>{badge.label}</span>
      </div>
      <div className="trust-divider"></div>
    </>
  )
}

export default function TrustBar() {
  // Badge tooltip system — same as original
  useEffect(() => {
    const tooltip = document.createElement('div')
    tooltip.className = 'badge-tooltip'
    document.body.appendChild(tooltip)

    function onEnter(e) {
      if (!e.target || e.target.nodeType !== 1) return
      const badge = e.target.closest('.trust-badge[data-tooltip]')
      if (!badge) return
      const text = badge.getAttribute('data-tooltip')
      if (!text) return
      tooltip.textContent = text
      const rect = badge.getBoundingClientRect()
      const tooltipWidth = 260
      let left = rect.left + rect.width / 2 - tooltipWidth / 2
      left = Math.max(8, Math.min(left, window.innerWidth - tooltipWidth - 8))
      tooltip.style.left = left + 'px'
      tooltip.style.top = 'auto'
      tooltip.style.bottom = (window.innerHeight - rect.top + 14) + 'px'
      tooltip.style.transform = 'translateY(6px)'
      requestAnimationFrame(() => {
        tooltip.classList.add('visible')
        tooltip.style.transform = 'translateY(0)'
      })
    }

    function onLeave() {
      tooltip.classList.remove('visible')
    }

    document.addEventListener('mouseenter', onEnter, true)
    document.addEventListener('mouseleave', onLeave, true)

    return () => {
      document.removeEventListener('mouseenter', onEnter, true)
      document.removeEventListener('mouseleave', onLeave, true)
      tooltip.remove()
    }
  }, [])

  return (
    <div className="hero-trust-bar" id="hero-trust-bar">
      {/* Compliance Badges */}
      <div className="trust-compliance">
        <div className="trust-compliance-track">
          {/* Original set */}
          {badges.map((b, i) => <BadgeItem key={i} badge={b} />)}
          {/* Duplicate for seamless loop */}
          {badges.map((b, i) => <BadgeItem key={`dup-${i}`} badge={b} />)}
        </div>
      </div>

      {/* Social Proof */}
      <div className="trust-social-proof">
        <div className="avatar-stack">
          <img src="https://i.pravatar.cc/100?img=68" alt="User" />
          <img src="https://i.pravatar.cc/100?img=47" alt="User" />
          <img src="https://i.pravatar.cc/100?img=33" alt="User" />
          <img src="https://i.pravatar.cc/100?img=12" alt="User" />
          <img src="https://i.pravatar.cc/100?img=5" alt="User" />
        </div>
        <p className="trust-user-count">
          <strong>10,000+</strong> events hosted by leading pharma &amp; healthcare organizations worldwide
        </p>
      </div>

      {/* Moving Logos */}
      <div className="trust-logos">
        <p className="trust-logos-title">Trusted by industry leaders</p>
        <div className="trust-logos-marquee">
          <div className="trust-logos-track">
            {companyLogos.map((logo, i) => (
              <img key={i} src={logo.src} alt={logo.alt} />
            ))}
          </div>
          <div className="trust-logos-track" aria-hidden="true">
            {companyLogos.map((logo, i) => (
              <img key={`dup-${i}`} src={logo.src} alt={logo.alt} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
