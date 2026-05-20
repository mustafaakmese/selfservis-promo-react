import { useEffect, useRef } from 'react'

const innerOrbit = [
  { src: '/logo/zoom-app.svg', alt: 'Zoom', label: 'Zoom', armNum: 1 },
  { src: '/logo/microsoft-teams-1.svg', alt: 'Microsoft Teams', label: 'Microsoft Teams', armNum: 2 },
  { src: '/logo/copilot-icon.svg', alt: 'Microsoft Copilot', label: 'Microsoft Copilot', armNum: 3 },
  { src: '/logo/claude-logo.svg', alt: 'Claude Cowork', label: 'Claude Cowork', armNum: 4 },
  { src: '/logo/Microsoft-365.svg', alt: 'Microsoft 365', label: 'Microsoft 365', armNum: 5 },
  { src: '/logo/microsoft-outlook-1.svg', alt: 'Microsoft Outlook', label: 'Microsoft Outlook', armNum: 6 },
]

const outerOrbit = [
  { src: '/logo/salesforce-2.svg', alt: 'Salesforce', label: 'Salesforce', armNum: 7 },
  { src: '/logo/slack-new-logo.svg', alt: 'Slack', label: 'Slack', armNum: 8 },
  { src: '/logo/hubspot-1.svg', alt: 'HubSpot', label: 'HubSpot', armNum: 9 },
  { src: '/logo/zapier.svg', alt: 'Zapier', label: 'Zapier', armNum: 10 },
  { src: '/logo/marketo-svgrepo-com.svg', alt: 'Marketo', label: 'Marketo', armNum: 11 },
  { src: '/logo/google-analytics-3.svg', alt: 'Google Analytics', label: 'Google Analytics', armNum: 12 },
  { src: '/logo/microsoft-azure-3.svg', alt: 'Microsoft Azure', label: 'Microsoft Azure', armNum: 13 },
]

const floatMsgs = [
  { cls: 'msg-1', icon: '🔶', bg: '#fff7ed', text: 'Syncing leads to Marketo...' },
  { cls: 'msg-2', icon: '🎥', bg: '#e0f2fe', text: 'Embedding your MS Teams meeting...' },
  { cls: 'msg-3', icon: '☁️', bg: '#dbeafe', text: 'Updating Salesforce records...' },
  { cls: 'msg-4', icon: '⚡', bg: '#ecfdf5', text: 'The agent is building the event platform...' },
]

function OrbitNode({ node }) {
  return (
    <div className={`orbit-arm arm-${node.armNum}`}>
      <div className={`orbit-node-counter counter-${node.armNum}`}>
        <div className="orbit-node">
          <img src={node.src} width="36" height="36" alt={node.alt} />
          <span className="node-tooltip">{node.label}</span>
        </div>
      </div>
    </div>
  )
}

export default function IntegrationsSection() {
  const sectionRef = useRef(null)

  // Reveal observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('visible')
        })
      },
      { threshold: 0.08, rootMargin: '0px 0px -60px 0px' }
    )
    const el = sectionRef.current?.querySelector('.integration-canvas')
    if (el) observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section" id="integrations" ref={sectionRef}>
      <div className="container">
        <div className="integration-header" style={{ textAlign: 'center', marginBottom: '60px' }}>
          <h2 className="font-display text-heading-lg" style={{ marginBottom: '16px' }}>Works with your entire stack.</h2>
          <p style={{ color: '#64748b', fontSize: '1.125rem', maxWidth: '480px', margin: '0 auto' }}>
            Vistream Events integrates deeply with your existing tools so nothing changes, except how fast you move.
          </p>
        </div>

        <div className="integration-canvas reveal">
          <div className="integration-orbits">
            {/* Dashed circles */}
            <div className="orbit-circle orbit-1"></div>
            <div className="orbit-circle orbit-2"></div>

            {/* Center hub */}
            <div className="orbit-hub">
              <img src="/favicon.ico" alt="Vistream" style={{ width: '48px', height: '48px', borderRadius: '12px' }} />
            </div>

            {/* Inner orbit */}
            <div className="orbit-track track-1">
              {innerOrbit.map(node => (
                <OrbitNode key={node.armNum} node={node} />
              ))}
            </div>

            {/* Outer orbit */}
            <div className="orbit-track track-2">
              {outerOrbit.map(node => (
                <OrbitNode key={node.armNum} node={node} />
              ))}
            </div>

            {/* Floating messages */}
            <div className="msg-container">
              {floatMsgs.map((msg, i) => (
                <div key={i} className={`float-msg ${msg.cls}`}>
                  <div className="msg-icon" style={{ background: msg.bg }}>{msg.icon}</div>
                  <span className="typing-text">{msg.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="integration-footer">
            <div className="line-fade left"></div>
            <span>+ 40 more integrations available</span>
            <div className="line-fade right"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
