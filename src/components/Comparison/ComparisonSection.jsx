import { useEffect, useRef } from 'react'

const rows = [
  ['Self-service event creation', '✔ Step-by-step wizard', 'success', '⚠ Complex to manage', 'warning'],
  ['Intelligent setup wizard with dynamic recommendations', '✔ AI-powered', 'success', '✕', 'error'],
  ['Multi-day event support', '✔ Built-in', 'success', '⚠ Limited', 'warning'],
  ['Multi-language event support', '✔ Built-in', 'success', '⚠ Limited', 'warning'],
  ['Intelligent agenda linking sessions dynamically', '✔ Automated', 'success', '✕', 'error'],
  ['Draft updates after publishing — no downtime', '✔ Supported', 'success', '✕', 'error'],
  ['Full branding suite (color palette, fonts, layout, dynamic backgrounds)', '✔ Full control', 'success', '⚠ Basic', 'warning'],
  ['Whitelabel with custom domain & branding', '✔ Enterprise', 'success', '✕', 'error'],
  ['Regulated-native registration fields (HCP, specialty, NPI)', '✔ Built-in', 'success', '✕', 'error'],
  ['Auto-confirmation e-mails with calendar integration', '✔ Auto-sent', 'success', '⚠ Manual', 'warning'],
  ['Intelligent rehearsal & live event invite management', '✔ Full suite', 'success', '⚠ Basic', 'warning'],
  ['Smart e-mail unsubscription management', '✔ Built-in', 'success', '✕', 'error'],
  ['Enterprise meeting integration (MS Teams, Zoom)', '✔ Native', 'success', '⚠ Via Zapier', 'warning'],
  ['Breakout room setups', '✔ Built-in', 'success', '⚠ Limited', 'warning'],
  ['Interactive tools (polling, surveys, quizzes, screen sharing, collaborative boards)', '✔ Full suite', 'success', '⚠ Partial', 'warning'],
  ['Agenda-triggered surveys activated per session', '✔ Automated', 'success', '✕', 'error'],
  ['MLR audit trail — auto-captured journey screenshots', '✔ Smart Journey', 'success', '✕', 'error'],
  ['Journey evaluator with behavior predictions & suggestions', '✔ AI-powered', 'success', '✕', 'error'],
  ['Watch-time or survey gated certificates', '✔ Automated', 'success', '✕', 'error'],
  ['AI agent integration (Copilot, Claude)', '✔ Enterprise', 'success', '✕', 'error'],
  ['GDPR / KVKK consent management', '✔ Built-in', 'success', '⚠ Partial', 'warning'],
  ['HIPAA-compliant infrastructure', '✔ Pharma-grade', 'success', '⚠ BAA available', 'warning'],
  ['Native Salesforce CRM sync', '✔ Native', 'success', '⚠ Via Zapier', 'warning'],
]

export default function ComparisonSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )
    if (sectionRef.current) {
      sectionRef.current.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    }
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section" id="comparison" style={{ backgroundColor: '#fafafa' }} ref={sectionRef}>
      <div className="container">
        <div className="section-header reveal">
          <h2 className="font-display text-heading-lg" style={{ marginBottom: '16px' }}>Purpose-built for regulated industries.</h2>
          <p style={{ maxWidth: '680px', margin: '0 auto', fontSize: '18px', color: '#64748b' }}>Vistream Events is designed for pharma, healthcare, and highly regulated teams.</p>
        </div>

        <div className="comparison-container reveal">
          <div className="comparison-table-wrapper">
            <table className="comparison-table">
              <thead>
                <tr>
                  <th className="col-feature">Feature</th>
                  <th className="col-vistream">
                    <div className="vistream-th-inner">
                      <img src="/assets/favicon.ico" alt="Vistream" style={{ height: '24px', display: 'block' }} />
                      Vistream Events
                    </div>
                  </th>
                  <th className="col-other">Other companies</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([feature, vText, vType, oText, oType], i) => (
                  <tr key={i}>
                    <td>{feature}</td>
                    <td className="cell-vistream"><span className={`badge-${vType}`}>{vText}</span></td>
                    <td className="cell-other"><span className={`badge-${oType}`}>{oText}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  )
}
