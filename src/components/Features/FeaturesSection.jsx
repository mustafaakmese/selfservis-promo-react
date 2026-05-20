import { useEffect, useRef } from 'react'

// Feature card data
const featureCards = [
  {
    index: 0,
    icon: '✦',
    eyebrow: 'AI Copilot Agent',
    title: 'Use your own Microsoft Copilot to manage every event',
    desc: 'No new tools to learn. The same Microsoft Copilot already on your desktop becomes your event manager. Just type what you need: create events, add speakers, send invites, publish landing pages. All through simple conversation in the tool your team already uses every day.',
    bullets: ['Works inside your existing Microsoft Copilot', 'Create full events with a simple conversation', 'Zero learning curve, no training required'],
    feature: 'ai',
    mediaHtml: `<div class="ft-ai-chat"><div class="ft-ai-copilot-badge"><span class="ft-copilot-logo">✦</span> Microsoft Copilot</div><div class="ft-ai-msg user">Schedule a webinar for next Friday at 2 PM</div><div class="ft-ai-msg bot"><span class="ft-ai-typing"><span></span><span></span><span></span></span>Done! "Q3 Innovation Summit" is live with registration open ✓</div><div class="ft-ai-msg user">Add Dr. Smith and send invites to the team</div><div class="ft-ai-msg bot">Speaker added, 340 invites sent &amp; calendar blocked ✓</div></div>`
  },
  {
    index: 1,
    icon: '⚙️',
    eyebrow: 'Self-Service Studio',
    title: 'Launch professional webinars in minutes',
    desc: 'Our intuitive wizard guides you through every step. No technical team required. Full branding control, custom domains, and reusable templates included.',
    bullets: ['Step-by-step guided event wizard', 'Full branding & white-labeling', 'Dry run & rehearsal mode'],
    feature: 'studio',
    mediaHtml: `<div class="ft-screen-body"><div class="ft-wizard-step active"><div class="ft-wiz-icon">📋</div><div class="ft-wiz-line"></div></div><div class="ft-wizard-step"><div class="ft-wiz-icon">🎨</div><div class="ft-wiz-line"></div></div><div class="ft-wizard-step"><div class="ft-wiz-icon">🚀</div></div></div><div class="ft-screen-fields"><div class="ft-field-skeleton" style="width:80%"></div><div class="ft-field-skeleton" style="width:60%"></div><div class="ft-field-skeleton short" style="width:45%"></div></div><div class="ft-screen-btn">Publish Event</div>`
  },
  {
    index: 2,
    icon: '📧',
    eyebrow: 'Intelligent Emails',
    title: 'Data-driven emails that maximize attendance',
    desc: 'AI-optimized send timing, real-time delivery and engagement stats, and automatic .ics calendar invites that block attendees\' calendars. Every email is tracked, measured, and designed to convert.',
    bullets: ['AI-suggested optimal send date & time', 'Real-time open, click & delivery stats', 'Auto .ics calendar blocking for attendees'],
    feature: 'emails',
    mediaHtml: `<div class="ft-email-preview"><div class="ft-email-header"><div class="ft-email-icon">📧</div><div class="ft-email-lines"><div class="ft-email-line" style="width:70%"></div><div class="ft-email-line short" style="width:45%"></div></div></div><div class="ft-email-stats-row"><div class="ft-email-stat"><span class="ft-email-stat-val">94%</span><span class="ft-email-stat-lbl">Delivered</span></div><div class="ft-email-stat"><span class="ft-email-stat-val">67%</span><span class="ft-email-stat-lbl">Opened</span></div><div class="ft-email-stat"><span class="ft-email-stat-val">42%</span><span class="ft-email-stat-lbl">Clicked</span></div></div><div class="ft-email-body"><div class="ft-email-cal"><div class="ft-cal-icon">📅</div><div class="ft-cal-details"><div class="ft-cal-line" style="width:80%"></div><div class="ft-cal-line" style="width:55%"></div></div></div></div><div class="ft-email-suggest"><span class="ft-suggest-icon">🕐</span><span>Best send time: Tue 10:30 AM</span></div><div class="ft-email-badge">.ics Calendar Blocked ✓</div></div>`
  },
  {
    index: 3,
    icon: '📋',
    eyebrow: 'Intelligent Register',
    title: 'Smart registration with parallel sessions & multi-day support',
    desc: 'Automatically detects and presents parallel sessions for attendee selection, supports seamless multi-day event registration with a single checkout, and integrates directly with the Intelligent Agenda for session-level sign-ups.',
    bullets: ['Automatic parallel session detection & selection', 'Multi-day registration in a single flow', 'Deep integration with Intelligent Agenda'],
    feature: 'registration',
    mediaHtml: `<div class="ft-reg-form"><div class="ft-form-field"><div class="ft-form-label"></div><div class="ft-form-input"></div></div><div class="ft-reg-parallel"><div class="ft-parallel-badge">⚡ Parallel Sessions</div><div class="ft-parallel-options"><div class="ft-parallel-opt selected">Track A</div><div class="ft-parallel-opt">Track B</div></div></div><div class="ft-reg-days"><div class="ft-day-chip active">Day 1</div><div class="ft-day-chip active">Day 2</div><div class="ft-day-chip">Day 3</div></div><div class="ft-form-consent"><div class="ft-consent-check"></div><div class="ft-consent-text"></div></div><div class="ft-form-submit">Register Now</div></div>`
  },
  {
    index: 4,
    icon: '🗓️',
    eyebrow: 'Intelligent Agenda',
    title: 'Dynamic schedules with timezone intelligence',
    desc: 'Build multi-day, multi-track agendas with auto-calculated time slots. Attendees see sessions in their local timezone automatically. Parallel sessions, breaks, and speaker assignments, all managed from one intuitive interface.',
    bullets: ['Auto-calculated time slots with timezone display', 'Multi-day sessions with parallel tracks', 'Drag-and-drop speaker assignment'],
    feature: 'agenda',
    mediaHtml: `<div class="ft-agenda-preview"><div class="ft-agenda-tabs"><div class="ft-agenda-tab active">Day 1</div><div class="ft-agenda-tab">Day 2</div></div><div class="ft-agenda-tz"><span class="ft-tz-icon">🌐</span><span>GMT+3 (auto-detected)</span></div><div class="ft-agenda-item"><div class="ft-agenda-time">09:00</div><div class="ft-agenda-line"></div><div class="ft-agenda-dot"></div></div><div class="ft-agenda-item"><div class="ft-agenda-time">10:30</div><div class="ft-agenda-line"></div><div class="ft-agenda-parallel-badge">⚡ 2 parallel</div></div><div class="ft-agenda-item"><div class="ft-agenda-time">12:00</div><div class="ft-agenda-line short"></div><div class="ft-agenda-break">☕</div></div></div>`
  },
  {
    index: 5,
    icon: '🎨',
    eyebrow: 'Customized Event Page',
    title: 'Your brand, your stage. Fully customizable event pages',
    desc: 'Custom fonts, curated color palettes, dynamic backgrounds, and fully responsive layouts. Every event page reflects your brand identity with pixel-perfect precision. Total design freedom, no templates.',
    bullets: ['Custom fonts & color palettes', 'Dynamic backgrounds & visual themes', 'Fully responsive across all devices'],
    feature: 'eventpage',
    mediaHtml: `<div class="ft-design-preview"><div class="ft-design-palette"><div class="ft-palette-dot" style="background:#0ea5e9"></div><div class="ft-palette-dot" style="background:#8b5cf6"></div><div class="ft-palette-dot" style="background:#10b981"></div><div class="ft-palette-dot" style="background:#f59e0b"></div></div><div class="ft-design-font"><div class="ft-font-label">Aa</div><div class="ft-font-name">Inter</div></div><div class="ft-design-bg"><div class="ft-bg-block bg-gradient"></div><div class="ft-bg-block bg-pattern"></div><div class="ft-bg-block bg-solid active"></div></div><div class="ft-design-mockup"><div class="ft-mockup-bar"></div><div class="ft-mockup-line" style="width:70%"></div><div class="ft-mockup-line" style="width:50%"></div></div></div>`
  },
  {
    index: 6,
    icon: '🗺️',
    eyebrow: 'Intelligent Journey',
    title: 'Visualize every touchpoint of your attendee experience',
    desc: 'A live screenshot-based journey map showing every page your attendees interact with, from registration to certificates. Preview, download as PDF, regenerate on-demand, and share with stakeholders for approval before going live.',
    bullets: ['Live screenshot previews of every page', 'One-click PDF export for stakeholder review', 'On-demand regeneration & approval workflow'],
    feature: 'journey',
    mediaHtml: `<div class="ft-journey-preview"><div class="ft-journey-row"><div class="ft-journey-thumb"><div class="ft-journey-dot green"></div><div class="ft-journey-line-h"></div></div><div class="ft-journey-thumb"><div class="ft-journey-dot green"></div><div class="ft-journey-line-h"></div></div><div class="ft-journey-thumb"><div class="ft-journey-dot blue"></div></div></div><div class="ft-journey-row"><div class="ft-journey-thumb"><div class="ft-journey-dot green"></div><div class="ft-journey-line-h"></div></div><div class="ft-journey-thumb"><div class="ft-journey-dot gray"></div><div class="ft-journey-line-h"></div></div><div class="ft-journey-thumb"><div class="ft-journey-dot gray"></div></div></div><div class="ft-journey-actions"><div class="ft-journey-btn">👁 Preview</div><div class="ft-journey-btn">📄 PDF</div></div></div>`
  },
  {
    index: 7,
    icon: '✅',
    eyebrow: 'Surveys & Certificates',
    title: 'Capture feedback first, then reward with certificates',
    desc: 'Post-event surveys collect actionable feedback and NPS scores before attendees receive their branded PDF attendance certificates. The survey-first flow ensures maximum response rates while rewarding participation.',
    bullets: ['Survey-first flow for maximum response rates', 'Custom survey builder with NPS tracking', 'Branded PDF certificates auto-generated'],
    feature: 'surveys',
    mediaHtml: `<div class="ft-cert-preview"><div class="ft-survey-mini"><div class="ft-survey-q"></div><div class="ft-survey-stars">★★★★★</div></div><div class="ft-survey-nps"><div class="ft-nps-label">NPS</div><div class="ft-nps-score">+72</div></div><div class="ft-cert-doc"><div class="ft-cert-seal">🏆</div><div class="ft-cert-title-line"></div><div class="ft-cert-name-line"></div><div class="ft-cert-date-line"></div><div class="ft-cert-badge">Verified ✓</div></div></div>`
  },
  {
    index: 8,
    icon: '📈',
    eyebrow: 'Live Analytics',
    title: 'Real-time insights that drive decisions',
    desc: 'Track attendees, engagement metrics, watch time, and participation in real time. Comprehensive post-event dashboards with exportable reports.',
    bullets: ['Real-time attendee tracking', 'Engagement heatmaps', 'Exportable PDF reports'],
    feature: 'analytics',
    mediaHtml: `<div class="ft-analytics-dash"><div class="ft-stat-row"><div class="ft-stat-box"><div class="ft-stat-val">1,247</div><div class="ft-stat-lbl">Live Viewers</div></div><div class="ft-stat-box"><div class="ft-stat-val">89%</div><div class="ft-stat-lbl">Engagement</div></div></div><div class="ft-chart-mini"><div class="ft-bar" style="--h:30%"></div><div class="ft-bar" style="--h:50%"></div><div class="ft-bar" style="--h:75%"></div><div class="ft-bar" style="--h:90%"></div><div class="ft-bar" style="--h:65%"></div><div class="ft-bar" style="--h:85%"></div></div></div>`
  }
]

const miniCards = [
  { icon: '✦', label: 'AI Copilot' },
  { icon: '⚙️', label: 'Studio' },
  { icon: '📧', label: 'Emails' },
  { icon: '📋', label: 'Register' },
  { icon: '🗓️', label: 'Agenda' },
  { icon: '🎨', label: 'Event Page' },
  { icon: '🗺️', label: 'Journey' },
  { icon: '✅', label: 'Surveys' },
  { icon: '📈', label: 'Analytics' },
]

function FeatureCard({ card }) {
  return (
    <div className="ft-card" data-ft-index={card.index}>
      <div className="ft-card-inner">
        <div className="ft-card-media">
          <div className="ft-media-placeholder" data-feature={card.feature}>
            <div className="ft-media-screen">
              <div className="ft-screen-topbar">
                <span className="ft-topbar-dot" style={{ background: '#ff5f56' }}></span>
                <span className="ft-topbar-dot" style={{ background: '#ffbd2e' }}></span>
                <span className="ft-topbar-dot" style={{ background: '#27c93f' }}></span>
              </div>
              <div dangerouslySetInnerHTML={{ __html: card.mediaHtml }} />
            </div>
          </div>
          <div className="ft-media-label">See it in action →</div>
        </div>
        <div className="ft-card-content">
          <div className="ft-card-eyebrow">
            <span className="ft-eyebrow-icon">{card.icon}</span>
            <span className="ft-eyebrow-text">{card.eyebrow}</span>
          </div>
          <h3 className="ft-card-title">{card.title}</h3>
          <p className="ft-card-desc">{card.desc}</p>
          <ul className="ft-card-bullets">
            {card.bullets.map((b, i) => (
              <li key={i}><span className="ft-bullet-check">✓</span> {b}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default function FeaturesSection() {
  const wrapperRef = useRef(null)
  const currentIndexRef = useRef(-1)

  const clickLockRef = useRef(false)

  useEffect(() => {
    if (window.matchMedia('(max-width: 768px)').matches) return

    const wrapper = wrapperRef.current
    if (!wrapper) return

    const cards = wrapper.querySelectorAll('.ft-card')
    const minis = wrapper.querySelectorAll('.ft-mini-card')
    const progressFill = document.getElementById('ft-progress-fill')
    const CARD_COUNT = cards.length

    // ── Feature card animation effects ──
    const effectTimers = { wizard: [], trackToggle: null, dayToggle: null }

    function animateCounterFt(el, target, suffix, duration) {
      const startTime = performance.now()
      function tick(now) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.round(target * eased)
        el.textContent = current.toLocaleString() + (suffix || '')
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    function activateFeatureEffects(index) {
      // Card 1 (index 1): Wizard step progression
      if (index === 1) {
        const steps = wrapper.querySelectorAll('[data-ft-index="1"] .ft-wizard-step')
        steps.forEach(s => { s.classList.remove('ft-step-done', 'ft-step-active', 'active') })
        if (steps[0]) steps[0].classList.add('active', 'ft-step-active')
        effectTimers.wizard.push(setTimeout(() => {
          if (steps[0]) { steps[0].classList.remove('ft-step-active', 'active'); steps[0].classList.add('ft-step-done') }
          if (steps[1]) steps[1].classList.add('active', 'ft-step-active')
        }, 1000))
        effectTimers.wizard.push(setTimeout(() => {
          if (steps[1]) { steps[1].classList.remove('ft-step-active', 'active'); steps[1].classList.add('ft-step-done') }
          if (steps[2]) steps[2].classList.add('active', 'ft-step-active')
        }, 2000))
      }

      // Card 2 (index 2): Email stats counter
      if (index === 2) {
        const statVals = wrapper.querySelectorAll('[data-ft-index="2"] .ft-email-stat-val')
        const targets = [94, 67, 42]
        statVals.forEach((el, i) => {
          if (targets[i] !== undefined) {
            setTimeout(() => animateCounterFt(el, targets[i], '%', 1200), i * 200)
          }
        })
      }

      // Card 3 (index 3): Registration track toggle
      if (index === 3) {
        const opts = wrapper.querySelectorAll('[data-ft-index="3"] .ft-parallel-opt')
        if (opts.length >= 2) {
          let trackState = true // true = Track A
          effectTimers.trackToggle = setInterval(() => {
            trackState = !trackState
            opts[0].classList.toggle('selected', trackState)
            opts[1].classList.toggle('selected', !trackState)
          }, 2000)
        }
      }

      // Card 4 (index 4): Agenda day tab switching
      if (index === 4) {
        const tabs = wrapper.querySelectorAll('[data-ft-index="4"] .ft-agenda-tab')
        if (tabs.length >= 2) {
          let dayState = true // true = Day 1
          effectTimers.dayToggle = setInterval(() => {
            dayState = !dayState
            tabs[0].classList.toggle('active', dayState)
            tabs[1].classList.toggle('active', !dayState)
          }, 3000)
        }
      }

      // Card 7 (index 7): NPS score reveal
      if (index === 7) {
        const npsEl = wrapper.querySelector('[data-ft-index="7"] .ft-nps-score')
        if (npsEl) {
          const startTime = performance.now()
          function tickNps(now) {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / 1500, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(72 * eased)
            npsEl.textContent = '+' + current
            // Color transition: red → yellow → green
            if (current < 30) npsEl.style.color = '#ef4444'
            else if (current < 55) npsEl.style.color = '#eab308'
            else npsEl.style.color = '#67e8f9'
            if (progress < 1) requestAnimationFrame(tickNps)
          }
          requestAnimationFrame(tickNps)
        }
      }

      // Card 8 (index 8): Analytics stat counters
      if (index === 8) {
        const statVals = wrapper.querySelectorAll('[data-ft-index="8"] .ft-stat-val')
        statVals.forEach(el => {
          const text = el.dataset.ftOriginal || el.textContent
          if (!el.dataset.ftOriginal) el.dataset.ftOriginal = text
          const numMatch = text.match(/([\d,]+)/)
          const suffix = text.replace(/([\d,]+)/, '')
          if (numMatch) {
            const target = parseInt(numMatch[1].replace(/,/g, ''), 10)
            animateCounterFt(el, target, suffix, 1400)
          }
        })
      }
    }

    function deactivateFeatureEffects(prevIndex) {
      // Card 1: Reset wizard
      if (prevIndex === 1) {
        effectTimers.wizard.forEach(t => clearTimeout(t))
        effectTimers.wizard = []
        const steps = wrapper.querySelectorAll('[data-ft-index="1"] .ft-wizard-step')
        steps.forEach(s => s.classList.remove('ft-step-done', 'ft-step-active'))
        if (steps[0]) steps[0].classList.add('active')
      }
      // Card 2: Reset email stats
      if (prevIndex === 2) {
        const statVals = wrapper.querySelectorAll('[data-ft-index="2"] .ft-email-stat-val')
        const originals = ['94%', '67%', '42%']
        statVals.forEach((el, i) => { el.textContent = originals[i] || el.textContent })
      }
      // Card 3: Stop track toggle
      if (prevIndex === 3) {
        if (effectTimers.trackToggle) { clearInterval(effectTimers.trackToggle); effectTimers.trackToggle = null }
        const opts = wrapper.querySelectorAll('[data-ft-index="3"] .ft-parallel-opt')
        if (opts[0]) opts[0].classList.add('selected')
        if (opts[1]) opts[1].classList.remove('selected')
      }
      // Card 4: Stop day toggle
      if (prevIndex === 4) {
        if (effectTimers.dayToggle) { clearInterval(effectTimers.dayToggle); effectTimers.dayToggle = null }
        const tabs = wrapper.querySelectorAll('[data-ft-index="4"] .ft-agenda-tab')
        if (tabs[0]) tabs[0].classList.add('active')
        if (tabs[1]) tabs[1].classList.remove('active')
      }
      // Card 7: Reset NPS
      if (prevIndex === 7) {
        const npsEl = wrapper.querySelector('[data-ft-index="7"] .ft-nps-score')
        if (npsEl) { npsEl.textContent = '+72'; npsEl.style.color = '#67e8f9' }
      }
      // Card 8: Reset analytics
      if (prevIndex === 8) {
        const statVals = wrapper.querySelectorAll('[data-ft-index="8"] .ft-stat-val')
        statVals.forEach(el => {
          if (el.dataset.ftOriginal) el.textContent = el.dataset.ftOriginal
        })
      }
    }

    function applyState(index) {
      if (index === currentIndexRef.current) return
      const prevIndex = currentIndexRef.current
      currentIndexRef.current = index

      // Deactivate previous card effects
      if (prevIndex >= 0) deactivateFeatureEffects(prevIndex)

      cards.forEach((card, i) => {
        card.classList.remove('ft-active', 'ft-passed', 'ft-upcoming')
        if (i === index) card.classList.add('ft-active')
        else if (i < index) card.classList.add('ft-passed')
        else card.classList.add('ft-upcoming')
      })

      // Sync minimap
      minis.forEach((mini, i) => {
        mini.classList.remove('ft-mini-active', 'ft-mini-done')
        if (i === index) mini.classList.add('ft-mini-active')
        else if (i < index) mini.classList.add('ft-mini-done')
      })

      // Minimap scroll window
      const VISIBLE = 6
      const minimapScroll = document.getElementById('ft-minimap-scroll')
      if (minimapScroll && CARD_COUNT > VISIBLE) {
        let scrollStart = Math.max(0, index - Math.floor(VISIBLE / 2))
        scrollStart = Math.min(scrollStart, CARD_COUNT - VISIBLE)
        const itemH = 46
        minimapScroll.style.transform = `translateY(-${scrollStart * itemH}px)`
      }

      if (progressFill) {
        const pct = ((index + 1) / CARD_COUNT) * 100
        progressFill.style.width = `${pct}%`
      }

      // Activate current card effects
      activateFeatureEffects(index)
    }

    // Transition cooldown — prevents rapid-fire card changes from trackpad momentum
    let lastChangeTime = 0
    const COOLDOWN_MS = 200
    let cachedViewHeight = window.innerHeight

    function onScroll() {
      if (clickLockRef.current) return
      const rect = wrapper.getBoundingClientRect()
      const wrapperHeight = wrapper.offsetHeight
      const scrolled = -rect.top
      const maxScroll = wrapperHeight - cachedViewHeight

      if (scrolled < 0 || maxScroll <= 0) {
        applyState(0)
        return
      }

      const progress = Math.min(Math.max(scrolled / maxScroll, 0), 1)
      const rawIndex = progress * CARD_COUNT
      const newIndex = Math.min(Math.floor(rawIndex), CARD_COUNT - 1)

      applyState(newIndex)
    }

    let ticking = false
    function onScrollThrottled() {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(() => {
          onScroll()
          ticking = false
        })
      }
    }

    function onResize() {
      cachedViewHeight = window.innerHeight
    }

    window.addEventListener('scroll', onScrollThrottled, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })

    // Minimap click — lock scroll handler during smooth scroll to prevent fighting
    let clickTimer = null
    minis.forEach(mini => {
      mini.addEventListener('click', () => {
        const idx = parseInt(mini.dataset.miniIndex, 10)
        if (isNaN(idx)) return
        clickLockRef.current = true
        if (clickTimer) clearTimeout(clickTimer)
        currentIndexRef.current = -1
        applyState(idx)
        const wrapperRect = wrapper.getBoundingClientRect()
        const wrapperTop = window.scrollY + wrapperRect.top
        const maxScroll = wrapper.offsetHeight - cachedViewHeight
        const targetScroll = wrapperTop + ((idx + 0.5) / CARD_COUNT) * maxScroll
        window.scrollTo({ top: targetScroll, behavior: 'smooth' })
        clickTimer = setTimeout(() => { clickLockRef.current = false }, 900)
      })
    })

    onScroll()

    return () => {
      window.removeEventListener('scroll', onScrollThrottled)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  // ── MOBILE: scroll-driven carousel ──
  useEffect(() => {
    if (!window.matchMedia('(max-width: 768px)').matches) return

    const wrapper = wrapperRef.current
    if (!wrapper) return

    const cards = wrapper.querySelectorAll('.ft-card')
    const dots = wrapper.querySelectorAll('.ft-mobile-dot')
    const progressFill = wrapper.querySelector('.ft-mobile-progress-fill')
    const CARD_COUNT = cards.length
    let currentIdx = -1
    let viewH = window.innerHeight

    // ── JS animation effects (same as desktop) ──
    const effectTimers = { wizard: [], trackToggle: null, dayToggle: null }

    function animateCounterMobile(el, target, suffix, duration) {
      const startTime = performance.now()
      function tick(now) {
        const elapsed = now - startTime
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        const current = Math.round(target * eased)
        el.textContent = current.toLocaleString() + (suffix || '')
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    function activateMobileEffects(index) {
      if (index === 1) {
        const steps = wrapper.querySelectorAll('[data-ft-index="1"] .ft-wizard-step')
        steps.forEach(s => { s.classList.remove('ft-step-done', 'ft-step-active', 'active') })
        if (steps[0]) steps[0].classList.add('active', 'ft-step-active')
        effectTimers.wizard.push(setTimeout(() => {
          if (steps[0]) { steps[0].classList.remove('ft-step-active', 'active'); steps[0].classList.add('ft-step-done') }
          if (steps[1]) steps[1].classList.add('active', 'ft-step-active')
        }, 1000))
        effectTimers.wizard.push(setTimeout(() => {
          if (steps[1]) { steps[1].classList.remove('ft-step-active', 'active'); steps[1].classList.add('ft-step-done') }
          if (steps[2]) steps[2].classList.add('active', 'ft-step-active')
        }, 2000))
      }
      if (index === 2) {
        const statVals = wrapper.querySelectorAll('[data-ft-index="2"] .ft-email-stat-val')
        const targets = [94, 67, 42]
        statVals.forEach((el, i) => {
          if (targets[i] !== undefined) setTimeout(() => animateCounterMobile(el, targets[i], '%', 1200), i * 200)
        })
      }
      if (index === 3) {
        const opts = wrapper.querySelectorAll('[data-ft-index="3"] .ft-parallel-opt')
        if (opts.length >= 2) {
          let trackState = true
          effectTimers.trackToggle = setInterval(() => {
            trackState = !trackState
            opts[0].classList.toggle('selected', trackState)
            opts[1].classList.toggle('selected', !trackState)
          }, 2000)
        }
      }
      if (index === 4) {
        const tabs = wrapper.querySelectorAll('[data-ft-index="4"] .ft-agenda-tab')
        if (tabs.length >= 2) {
          let dayState = true
          effectTimers.dayToggle = setInterval(() => {
            dayState = !dayState
            tabs[0].classList.toggle('active', dayState)
            tabs[1].classList.toggle('active', !dayState)
          }, 3000)
        }
      }
      if (index === 7) {
        const npsEl = wrapper.querySelector('[data-ft-index="7"] .ft-nps-score')
        if (npsEl) {
          const startTime = performance.now()
          function tickNps(now) {
            const elapsed = now - startTime
            const progress = Math.min(elapsed / 1500, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            const current = Math.round(72 * eased)
            npsEl.textContent = '+' + current
            if (current < 30) npsEl.style.color = '#ef4444'
            else if (current < 55) npsEl.style.color = '#eab308'
            else npsEl.style.color = '#67e8f9'
            if (progress < 1) requestAnimationFrame(tickNps)
          }
          requestAnimationFrame(tickNps)
        }
      }
      if (index === 8) {
        const statVals = wrapper.querySelectorAll('[data-ft-index="8"] .ft-stat-val')
        statVals.forEach(el => {
          const text = el.dataset.ftOriginal || el.textContent
          if (!el.dataset.ftOriginal) el.dataset.ftOriginal = text
          const numMatch = text.match(/([\d,]+)/)
          const suffix = text.replace(/([\d,]+)/, '')
          if (numMatch) {
            const target = parseInt(numMatch[1].replace(/,/g, ''), 10)
            animateCounterMobile(el, target, suffix, 1400)
          }
        })
      }
    }

    function deactivateMobileEffects(prevIndex) {
      if (prevIndex === 1) {
        effectTimers.wizard.forEach(t => clearTimeout(t))
        effectTimers.wizard = []
      }
      if (prevIndex === 3 && effectTimers.trackToggle) {
        clearInterval(effectTimers.trackToggle); effectTimers.trackToggle = null
      }
      if (prevIndex === 4 && effectTimers.dayToggle) {
        clearInterval(effectTimers.dayToggle); effectTimers.dayToggle = null
      }
    }

    function applyMobileState(index) {
      if (index === currentIdx) return
      const prevIdx = currentIdx
      currentIdx = index

      // Deactivate previous JS effects
      if (prevIdx >= 0) deactivateMobileEffects(prevIdx)

      cards.forEach((card, i) => {
        card.classList.remove('ft-mobile-active', 'ft-mobile-prev', 'ft-mobile-next', 'ft-active', 'ft-passed', 'ft-upcoming')
        if (i === index) {
          card.classList.add('ft-mobile-active', 'ft-active')
        } else if (i < index) {
          card.classList.add('ft-mobile-prev', 'ft-passed')
        } else {
          card.classList.add('ft-mobile-next', 'ft-upcoming')
        }
      })

      // Activate JS effects for new card
      activateMobileEffects(index)

      dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index)
      })

      if (progressFill) {
        progressFill.style.width = `${((index + 1) / CARD_COUNT) * 100}%`
      }
    }

    let ticking = false
    function onScroll() {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const rect = wrapper.getBoundingClientRect()
        const scrolled = -rect.top
        const maxScroll = wrapper.offsetHeight - viewH
        if (maxScroll <= 0) { ticking = false; return }
        const progress = Math.max(0, Math.min(1, scrolled / maxScroll))
        const newIndex = Math.min(Math.floor(progress * CARD_COUNT), CARD_COUNT - 1)
        if (scrolled >= 0) applyMobileState(newIndex)

        // Removed exit fade logic to prevent blank screen issue before Integrations section.
        const viewport = wrapper.querySelector('.ft-stack-viewport')
        if (viewport) {
          viewport.style.opacity = '1'
        }

        ticking = false
      })
    }

    function onResize() { viewH = window.innerHeight }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize, { passive: true })
    onScroll()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      // Clean up timers
      effectTimers.wizard.forEach(t => clearTimeout(t))
      if (effectTimers.trackToggle) clearInterval(effectTimers.trackToggle)
      if (effectTimers.dayToggle) clearInterval(effectTimers.dayToggle)
    }
  }, [])

  return (
    <section className="features-stacking-section" id="features">
      <div className="ft-stack-wrapper" id="ft-stack-wrapper" ref={wrapperRef}>
        <div className="ft-stack-viewport" id="ft-stack-viewport">
          <div className="ft-stack-header">
            <h2 className="font-display text-heading-lg">Everything you need to run world-class events</h2>
            <p>From self-service setup to post-event analytics — a complete platform that replaces your entire event stack.</p>
          </div>
          <div className="ft-stack-body">
            <div className="ft-stack-stage" id="ft-stack-stage">
              {featureCards.map(card => (
                <FeatureCard key={card.index} card={card} />
              ))}
              {/* Desktop Progress indicator */}
              <div className="ft-stack-progress" id="ft-stack-progress">
                <div className="ft-progress-fill" id="ft-progress-fill"></div>
              </div>
            </div>
            {/* Minimap (desktop only) */}
            <div className="ft-stack-minimap" id="ft-stack-minimap">
              <div className="ft-minimap-scroll" id="ft-minimap-scroll">
                {miniCards.map((mini, i) => (
                  <div key={i} className="ft-mini-card" data-mini-index={i}>
                    <span className="ft-mini-icon">{mini.icon}</span>
                    <span className="ft-mini-label">{mini.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          {/* Mobile progress bar + dots */}
          <div className="ft-mobile-nav">
            <div className="ft-mobile-progress-track">
              <div className="ft-mobile-progress-fill"></div>
            </div>
            <div className="ft-mobile-dots">
              {featureCards.map((_, i) => (
                <span key={i} className={`ft-mobile-dot${i === 0 ? ' active' : ''}`}></span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
