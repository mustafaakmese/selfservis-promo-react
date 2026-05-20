import { useEffect, useCallback, useState, useRef } from 'react'

const faqData = [
  {
    q: "What's the difference between a Webinar and a Meeting?",
    a: 'A <strong>Webinar</strong> is a broadcast-style event where speakers present to a view-only audience — ideal for product launches, keynotes, and large-scale presentations. A <strong>Meeting</strong> is an interactive event where all participants can share video, audio, and screen — perfect for workshops and training sessions.'
  },
  {
    q: 'How does the calendar invite email system work?',
    a: 'When an attendee registers, they automatically receive a confirmation email with an embedded .ics calendar invite. This adds the event directly to their calendar with all the details including the join link, significantly reducing no-shows.'
  },
  {
    q: 'Can I use both Zoom and Microsoft Teams?',
    a: 'Yes! Each event can be configured with either Zoom or Microsoft Teams. You can use different providers for different events. Both integrations support webinars and meetings with full feature parity.'
  },
  {
    q: 'How does the AI Agent (MCP) integration work?',
    a: 'Our MCP Server allows AI agents like Claude and Copilot to create, configure, and manage events on your behalf. Generate an API key, connect it to your AI agent, and it handles event setup, speaker management, and publishing autonomously.'
  },
  {
    q: 'Is the platform compliant for pharma/healthcare events?',
    a: 'Absolutely. Vistream includes automated user journey documentation, consent management, GDPR-compliant data handling, and complete audit trails. Trusted by pharma companies and healthcare organizations worldwide.'
  },
  {
    q: 'Can I customize the branding of my event pages?',
    a: 'Full white-labeling is available. Customize color palettes, typography, logos, hero images, your own domain, and create reusable templates. Every touchpoint can be branded to match your organization.'
  }
]

function FaqItem({ item, isOpen, onToggle }) {
  const answerRef = useRef(null)
  const innerRef = useRef(null)
  const [height, setHeight] = useState(0)

  useEffect(() => {
    if (isOpen && innerRef.current) {
      setHeight(innerRef.current.scrollHeight)
    } else {
      setHeight(0)
    }
  }, [isOpen])

  return (
    <div className={`faq-item${isOpen ? ' open' : ''}`}>
      <button className="faq-question" onClick={onToggle}>
        {item.q}
        <svg className="faq-chevron" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5l5 5 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      </button>
      <div ref={answerRef} className="faq-answer" style={{ maxHeight: height + 'px' }}>
        <div ref={innerRef} className="faq-answer-inner" dangerouslySetInnerHTML={{ __html: item.a }} />
      </div>
    </div>
  )
}

function FaqContent() {
  const [openIndex, setOpenIndex] = useState(-1)

  const toggle = useCallback((i) => {
    setOpenIndex(prev => prev === i ? -1 : i)
  }, [])

  return (
    <div className="faq-list">
      {faqData.map((item, i) => (
        <FaqItem
          key={i}
          item={item}
          isOpen={openIndex === i}
          onToggle={() => toggle(i)}
        />
      ))}
    </div>
  )
}

function PrivacyContent() {
  return (
    <>
      <p className="legal-effective">Last updated: May 15, 2026</p>
      <p>Vistream Events ("Vistream", "we", "our", or "us") is a product of <strong>Niceye Group</strong>, headquartered in Istanbul, Türkiye.</p>

      <h4>1. Data Controller and Processor</h4>
      <p>Depending on the context, Niceye Group acts as either a Data Controller or a Data Processor. When you create a Vistream account, we act as the Data Controller. For data submitted by attendees joining your events, the Organizer acts as the Data Controller, and Vistream acts strictly as a Data Processor.</p>

      <h4>2. Legal Basis for Processing</h4>
      <p>Under GDPR Article 6 and KVKK Article 5, we process data based on: contractual necessity (delivering the service), our legitimate interests (security and product improvement), legal obligations, and your explicit consent where applicable.</p>

      <h4>3. Data Collection</h4>
      <p>We collect Account Data (name, email), Event/Usage Data (logs, connection metadata), and Integration Data (only when you connect third-party platforms).</p>

      <h4>4. Data Isolation and Third-Party Integrations</h4>
      <p>We <strong>do not sell or share</strong> your data. Data only flows to integrations you explicitly enable, such as Salesforce, Marketo, Teams, Zoom, Google Analytics, or Adobe Analytics.</p>

      <h4>5. AI Features and Data Training</h4>
      <p>Our AI features are strictly opt-in. We utilize OpenAI, Anthropic, and Google Gemini as sub-processors for these features. <strong>We guarantee that your data is NEVER used to train any third-party AI models.</strong> Enterprise customers may also use our Model Context Protocol (MCP) integrations.</p>

      <h4>6. Data Hosting and Security</h4>
      <p>Your data is securely hosted on Microsoft Azure in the Eastern Europe region. We implement pharma/healthcare-grade security measures compliant with HIPAA, ISO 27001, and SOC 2.</p>

      <h4>7. Sub-Processors</h4>
      <p>We use trusted sub-processors including Microsoft Azure, OpenAI, Anthropic, and Google. All sub-processors are bound by strict Data Processing Agreements (DPAs).</p>

      <h4>8. Breach Notification</h4>
      <p>In the event of a personal data breach, we will notify the relevant supervisory authority and affected users within 72 hours, in compliance with GDPR and KVKK requirements.</p>

      <h4>9. Recording Consent</h4>
      <p>Event Organizers may record sessions. Attendees will always receive a clear notification when joining a recordable session. Continued participation constitutes consent.</p>

      <h4>10. Your Rights</h4>
      <p>You have the right to access, rectify, or delete your data, and the right to lodge a complaint with a supervisory authority (such as the Turkish Data Protection Authority / KVKK Kurumu or your local EU authority).</p>

      <p>For any privacy inquiries, please contact us at: <a href="mailto:connect@vistream.tv">connect@vistream.tv</a></p>
    </>
  )
}

function TermsContent() {
  return (
    <>
      <p className="legal-effective">Last updated: May 15, 2026</p>

      <h4>1. Acceptance of Terms</h4>
      <p>By using Vistream Events, you agree to these Terms of Use. If you do not agree, do not use the platform.</p>

      <h4>2. Service Description and Usage</h4>
      <p>Vistream Events is a B2B SaaS platform. You agree not to use the service for any unlawful activities or to distribute prohibited content.</p>

      <h4>3. Data Processing Agreement (DPA)</h4>
      <p>Our handling of your data is governed by our Privacy Policy and the Data Processing Agreement (DPA) incorporated by reference into these Terms.</p>

      <h4>4. AI Output Disclaimer</h4>
      <p>Vistream provides AI-assisted features (e.g., event scheduling, transcriptions). AI outputs are generated algorithmically and are provided "AS IS". You are responsible for reviewing and verifying any AI-generated content before use.</p>

      <h4>5. Confidentiality</h4>
      <p>Both parties agree to maintain the confidentiality of each other's proprietary information. This obligation survives the termination of these Terms.</p>

      <h4>6. Recording Consent for Content</h4>
      <p>As an Organizer, you are solely responsible for obtaining all necessary consents from speakers and attendees prior to recording any session, in accordance with applicable laws.</p>

      <h4>7. Warranty Disclaimer</h4>
      <p>VISTREAM EVENTS IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR NON-INFRINGEMENT.</p>

      <h4>8. Force Majeure</h4>
      <p>We are not liable for any failure or delay in performance due to circumstances beyond our reasonable control, including natural disasters, acts of government, or internet service provider failures.</p>

      <h4>9. Severability and Waiver</h4>
      <p>If any provision of these Terms is found to be unenforceable, the remaining provisions will remain in full force. Failure to enforce any right does not constitute a waiver of that right.</p>

      <h4>10. Entire Agreement</h4>
      <p>These Terms, along with the Privacy Policy and any applicable order forms, constitute the entire agreement between you and Niceye Group regarding Vistream Events.</p>

      <p>For any legal inquiries, contact us at: <a href="mailto:connect@vistream.tv">connect@vistream.tv</a></p>
    </>
  )
}

const modalTitles = {
  faq: 'Frequently Asked Questions',
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
}

const contentMap = {
  faq: FaqContent,
  privacy: PrivacyContent,
  terms: TermsContent,
}

export default function LegalModal({ type, onClose }) {
  const [phase, setPhase] = useState('entering') // 'entering' | 'visible' | 'exiting'
  const backdropRef = useRef(null)

  // Animate in on mount
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    // Trigger enter animation on next frame
    const raf = requestAnimationFrame(() => {
      setPhase('visible')
    })

    function onKey(e) { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)

    return () => {
      cancelAnimationFrame(raf)
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Animated close — wait for exit transition before unmounting
  function handleClose() {
    setPhase('exiting')
    setTimeout(() => {
      onClose()
    }, 300)
  }

  const Content = contentMap[type]

  const backdropStyle = {
    display: 'flex',
    opacity: phase === 'visible' ? 1 : 0,
    transition: 'opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  }

  const contentStyle = {
    transform: phase === 'visible' ? 'translateY(0) scale(1)' : 'translateY(24px) scale(0.97)',
    opacity: phase === 'visible' ? 1 : 0,
    transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
  }

  return (
    <div
      ref={backdropRef}
      className="legal-modal"
      style={backdropStyle}
      onClick={(e) => { if (e.target === e.currentTarget) handleClose() }}
    >
      <div className="legal-modal-content" style={contentStyle}>
        <div className="legal-modal-header">
          <h3>{modalTitles[type] || 'Legal'}</h3>
          <button className="legal-modal-close" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div className="legal-modal-body">
          {Content ? <Content /> : <p>Content not found.</p>}
        </div>
      </div>
    </div>
  )
}
