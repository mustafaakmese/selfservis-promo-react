import { forwardRef, useEffect, useRef, useImperativeHandle } from 'react'

// ── Card Animation Engine ──
// All per-card activation/deactivation effects, ported 1:1 from main.js

const chatMessages = [
  'Great talk! 🔥',
  'When is the next one?',
  'Very insightful 👏',
  'Can you share the slides?',
  'Amazing presentation!',
  'This is so helpful 🙌',
  'Love the demo!',
  'How do we get started?'
]

const signupPool = [
  { name: 'Dr. Sarah K.', color: '#0369a1' },
  { name: 'Mark Johnson', color: '#0284c7' },
  { name: 'Lisa Wang', color: '#0ea5e9' },
  { name: 'James Chen', color: '#0c4a6e' },
  { name: 'Emily Ross', color: '#075985' },
  { name: 'David Kim', color: '#0369a1' },
  { name: 'Anna Müller', color: '#0284c7' },
  { name: 'Robert Patel', color: '#0c4a6e' },
  { name: 'Sophie Liu', color: '#0ea5e9' },
  { name: 'Alex Turner', color: '#075985' }
]

function animateCounter(el, target, suffix, duration) {
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

const ScrollCards = forwardRef(function ScrollCards({ progressFillRef, stepLabelsRef }, ref) {
  const effectsRef = useRef({
    typewriterTimeout: null,
    chatFeedInterval: null,
    signupFeedInterval: null,
    timerInterval: null,
    viewerInterval: null,
    timerSeconds: 47 * 60 + 23,
    chatMsgIndex: 0,
    signupIndex: 0,
  })

  // Expose activate/deactivate to parent (HeroSection)
  useImperativeHandle(ref, () => ({
    getSequenceEl: () => document.getElementById('scroll-sequence'),
    activateCard: (index) => activateCardEffects(index),
    deactivateCard: (index) => deactivateCardEffects(index),
  }))

  // Cleanup all intervals on unmount
  useEffect(() => {
    return () => {
      const e = effectsRef.current
      if (e.typewriterTimeout) clearTimeout(e.typewriterTimeout)
      if (e.chatFeedInterval) clearTimeout(e.chatFeedInterval)
      if (e.signupFeedInterval) clearTimeout(e.signupFeedInterval)
      if (e.timerInterval) clearInterval(e.timerInterval)
      if (e.viewerInterval) clearInterval(e.viewerInterval)
    }
  }, [])

  // ── Card 1: Typewriter ──
  function startTypewriter() {
    stopTypewriter()
    const el = document.getElementById('typewriter-title')
    const btnText = document.getElementById('publish-btn-text')
    if (!el) return
    const text = 'Q3 Pharma Innovation Summit'
    el.textContent = ''
    if (btnText) btnText.textContent = 'Publish Event'
    let i = 0
    function type() {
      if (i < text.length) {
        el.textContent += text[i]
        i++
        effectsRef.current.typewriterTimeout = setTimeout(type, 60)
      } else {
        effectsRef.current.typewriterTimeout = setTimeout(() => {
          if (btnText) btnText.textContent = 'Published ✓'
        }, 600)
      }
    }
    effectsRef.current.typewriterTimeout = setTimeout(type, 400)
  }
  function stopTypewriter() {
    if (effectsRef.current.typewriterTimeout) {
      clearTimeout(effectsRef.current.typewriterTimeout)
      effectsRef.current.typewriterTimeout = null
    }
  }

  // ── Card 2: Signup Feed ──
  function startSignupFeed() {
    stopSignupFeed()
    effectsRef.current.signupIndex = 0
    const feed = document.getElementById('signup-feed')
    if (!feed) return
    feed.innerHTML = ''

    function createRow(person, time) {
      const row = document.createElement('div')
      row.className = 'signup-entry'
      row.innerHTML = `<div class="mock-avatar" style="background:${person.color}">${person.name[0]}</div><div class="signup-entry-info"><span class="signup-entry-name">${person.name}</span><span class="signup-entry-time">${time}</span></div>`
      return row
    }

    // Seed 3 initial entries
    feed.appendChild(createRow(signupPool[0], 'just now'))
    feed.appendChild(createRow(signupPool[1], '2 min ago'))
    feed.appendChild(createRow(signupPool[2], '5 min ago'))
    effectsRef.current.signupIndex = 3

    function addSignup() {
      const person = signupPool[effectsRef.current.signupIndex % signupPool.length]
      effectsRef.current.signupIndex++
      const row = createRow(person, 'just now')
      feed.insertBefore(row, feed.firstChild)

      // Update older entries' time labels
      const entries = feed.querySelectorAll('.signup-entry')
      entries.forEach((e, i) => {
        if (i > 0) {
          const timeEl = e.querySelector('.signup-entry-time')
          if (timeEl) timeEl.textContent = i === 1 ? '2 min ago' : (i * 2) + ' min ago'
        }
      })

      // Keep max 3 visible
      while (feed.children.length > 3) {
        feed.removeChild(feed.lastChild)
      }

      effectsRef.current.signupFeedInterval = setTimeout(addSignup, 1800)
    }
    effectsRef.current.signupFeedInterval = setTimeout(addSignup, 2000)
  }
  function stopSignupFeed() {
    if (effectsRef.current.signupFeedInterval) {
      clearTimeout(effectsRef.current.signupFeedInterval)
      effectsRef.current.signupFeedInterval = null
    }
    const feed = document.getElementById('signup-feed')
    if (feed) feed.innerHTML = ''
  }

  // ── Card 3: Timer, Viewer Count, Chat Feed ──
  function startTimer() {
    stopTimer()
    const timerEl = document.getElementById('studio-timer')
    if (!timerEl) return
    effectsRef.current.timerInterval = setInterval(() => {
      effectsRef.current.timerSeconds++
      const h = String(Math.floor(effectsRef.current.timerSeconds / 3600)).padStart(2, '0')
      const m = String(Math.floor((effectsRef.current.timerSeconds % 3600) / 60)).padStart(2, '0')
      const s = String(effectsRef.current.timerSeconds % 60).padStart(2, '0')
      timerEl.textContent = `${h}:${m}:${s}`
    }, 1000)
  }
  function stopTimer() {
    if (effectsRef.current.timerInterval) {
      clearInterval(effectsRef.current.timerInterval)
      effectsRef.current.timerInterval = null
    }
  }

  function startViewerCount() {
    stopViewerCount()
    const el = document.getElementById('studio-viewers-count')
    if (!el) return
    let count = 2341
    effectsRef.current.viewerInterval = setInterval(() => {
      count += Math.floor(Math.random() * 3) + 1
      el.textContent = count.toLocaleString()
    }, 3000)
  }
  function stopViewerCount() {
    if (effectsRef.current.viewerInterval) {
      clearInterval(effectsRef.current.viewerInterval)
      effectsRef.current.viewerInterval = null
    }
  }

  function startChatFeed() {
    stopChatFeed()
    effectsRef.current.chatMsgIndex = 0
    const feed = document.getElementById('chat-feed')
    if (!feed) return
    feed.innerHTML = ''

    function addMessage() {
      const msg = document.createElement('div')
      msg.className = 'chat-bubble-msg'
      msg.textContent = chatMessages[effectsRef.current.chatMsgIndex % chatMessages.length]
      effectsRef.current.chatMsgIndex++
      feed.appendChild(msg)

      while (feed.children.length > 4) {
        feed.removeChild(feed.firstChild)
      }

      effectsRef.current.chatFeedInterval = setTimeout(addMessage, 1200)
    }
    effectsRef.current.chatFeedInterval = setTimeout(addMessage, 400)
  }
  function stopChatFeed() {
    if (effectsRef.current.chatFeedInterval) {
      clearTimeout(effectsRef.current.chatFeedInterval)
      effectsRef.current.chatFeedInterval = null
    }
    const feed = document.getElementById('chat-feed')
    if (feed) feed.innerHTML = ''
  }

  // ── Activate / Deactivate ──
  function activateCardEffects(index) {
    if (index === 0) {
      startTypewriter()
    } else {
      stopTypewriter()
    }
    if (index === 1) {
      const statNum = document.querySelector('#card-step-2 .mock-stat-number')
      if (statNum) animateCounter(statNum, 1247, '', 1500)
      const barFill = document.querySelector('#card-step-2 .mock-capacity-bar-fill')
      if (barFill) setTimeout(() => { barFill.style.width = '83%' }, 200)
      startSignupFeed()
    } else {
      stopSignupFeed()
    }
    if (index === 2) {
      startTimer()
      startViewerCount()
      startChatFeed()
    } else {
      stopTimer()
      stopViewerCount()
      stopChatFeed()
    }
    if (index === 3) {
      document.querySelectorAll('#card-step-4 .mock-kpi-value').forEach(el => {
        const target = parseInt(el.dataset.target)
        const suffix = el.dataset.suffix || ''
        animateCounter(el, target, suffix, 1200)
      })
    }
  }

  function deactivateCardEffects(index) {
    if (index === 0) {
      const el = document.getElementById('typewriter-title')
      if (el) el.textContent = ''
      const btnText = document.getElementById('publish-btn-text')
      if (btnText) btnText.textContent = 'Publish Event'
    }
    if (index === 1) {
      const statNum = document.querySelector('#card-step-2 .mock-stat-number')
      if (statNum) statNum.textContent = '0'
      const barFill = document.querySelector('#card-step-2 .mock-capacity-bar-fill')
      if (barFill) barFill.style.width = '0%'
      stopSignupFeed()
    }
    if (index === 3) {
      document.querySelectorAll('#card-step-4 .mock-kpi-value').forEach(el => {
        el.textContent = '0' + (el.dataset.suffix || '')
      })
    }
  }

  return (
    <div id="scroll-sequence" className="scroll-sequence">
      {/* Card 1: Event Builder */}
      <div className="scroll-card" id="card-step-1">
        <div className="cascade-card">
          <div className="card-header">
            <div className="card-dot"></div>
            <div className="card-title">Setup &amp; Publish</div>
            <div className="card-badge">Step 1</div>
          </div>
          <div className="card-body">
            <div className="mock-field card-anim-item">
              <label className="mock-label">Event Title</label>
              <div className="mock-input" id="typewriter-title"></div>
            </div>
            <div className="mock-row card-anim-item">
              <div className="mock-field" style={{ flex: 1 }}>
                <label className="mock-label">Date &amp; Time</label>
                <div className="mock-input mock-input-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                  Jun 15, 2026
                </div>
              </div>
              <div className="mock-field" style={{ flex: 1 }}>
                <label className="mock-label">Format</label>
                <div className="mock-input mock-input-sm">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                  Webinar
                </div>
              </div>
            </div>
            <div className="mock-preview card-anim-item">
              <label className="mock-label">Landing Page Preview</label>
              <div className="mock-preview-box">
                <div className="mock-preview-bar"></div>
                <div className="mock-preview-line" style={{ width: '70%' }}></div>
                <div className="mock-preview-line" style={{ width: '50%' }}></div>
                <div className="mock-preview-line" style={{ width: '80%' }}></div>
                <div className="mock-preview-line" style={{ width: '40%' }}></div>
              </div>
            </div>
            <button className="mock-publish-btn card-anim-item" id="publish-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
              <span id="publish-btn-text">Publish Event</span>
            </button>
          </div>
        </div>
      </div>

      {/* Card 2: Registration Dashboard */}
      <div className="scroll-card" id="card-step-2">
        <div className="cascade-card">
          <div className="card-header">
            <div className="card-dot"></div>
            <div className="card-title">Audience Acquired</div>
            <div className="card-badge">Step 2</div>
          </div>
          <div className="card-body">
            <div className="mock-stats-row card-anim-item">
              <div className="mock-stat-card">
                <div className="mock-stat-number" data-target="1247">0</div>
                <div className="mock-stat-label">Registered</div>
              </div>
              <div className="mock-capacity-card">
                <div className="mock-capacity-bar-track">
                  <div className="mock-capacity-bar-fill" data-width="83"></div>
                </div>
                <div className="mock-capacity-text">83% capacity</div>
              </div>
            </div>
            <div className="mock-signups card-anim-item">
              <label className="mock-label">Recent Sign-ups</label>
              <div className="signup-feed" id="signup-feed"></div>
            </div>
            <div className="invite-badges card-anim-item">
              <div className="invite-badge i-1">✓ Invites Sent</div>
              <div className="invite-badge i-2">✓ Reminders Scheduled</div>
              <svg className="float-mail" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <svg className="float-mail" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3: Live Broadcast Console */}
      <div className="scroll-card" id="card-step-3">
        <div className="cascade-card">
          <div className="card-header">
            <div className="card-dot pulse-red"></div>
            <div className="card-title">Live Studio</div>
            <div className="card-badge">Step 3</div>
          </div>
          <div className="card-body studio-stacked">
            <div className="studio-video-16x9 card-anim-item">
              <div className="studio-video-inner">
                <video className="studio-video-bg" src="/video/video3.mp4" autoPlay muted loop playsInline></video>
                <div className="studio-overlay-meta">
                  <div className="studio-timer" id="studio-timer">00:47:23</div>
                </div>
                <div className="studio-overlay-viewers">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                  <span id="studio-viewers-count">2,341</span>
                </div>
                <svg className="internal-float-icon icon-reaction r-1" width="22" height="22" viewBox="0 0 24 24" fill="#0ea5e9" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <svg className="internal-float-icon icon-reaction r-2" width="22" height="22" viewBox="0 0 24 24" fill="#0369a1" stroke="none"><path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path></svg>
                <svg className="internal-float-icon icon-reaction r-3" width="22" height="22" viewBox="0 0 24 24" fill="#38bdf8" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
              </div>
            </div>
            <div className="studio-chat-stacked card-anim-item">
              <div className="mock-label" style={{ marginBottom: '6px' }}>Q&amp;A</div>
              <div className="chat-feed" id="chat-feed"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Card 4: Analytics Report */}
      <div className="scroll-card" id="card-step-4">
        <div className="cascade-card">
          <div className="card-header">
            <div className="card-dot"></div>
            <div className="card-title">Post Event Activities</div>
            <div className="card-badge">Step 4</div>
          </div>
          <div className="card-body">
            <div className="mock-kpi-row card-anim-item">
              <div className="mock-kpi">
                <div className="mock-kpi-value" data-target="89" data-suffix="%">0%</div>
                <div className="mock-kpi-delta">▲ 12%</div>
                <div className="mock-stat-label">Attendance</div>
              </div>
              <div className="mock-kpi">
                <div className="mock-kpi-value" data-target="74" data-suffix="%">0%</div>
                <div className="mock-kpi-delta">▲ 8%</div>
                <div className="mock-stat-label">Engagement</div>
              </div>
              <div className="mock-kpi">
                <div className="mock-kpi-value" data-target="42" data-suffix="m">0m</div>
                <div className="mock-kpi-delta">▲ 5m</div>
                <div className="mock-stat-label">Avg. Watch</div>
              </div>
            </div>
            <div className="mock-chart card-anim-item">
              <div className="mock-chart-bar" style={{ '--bar-h': '30%' }} data-delay="0"></div>
              <div className="mock-chart-bar" style={{ '--bar-h': '50%' }} data-delay="1"></div>
              <div className="mock-chart-bar" style={{ '--bar-h': '40%' }} data-delay="2"></div>
              <div className="mock-chart-bar" style={{ '--bar-h': '70%' }} data-delay="3"></div>
              <div className="mock-chart-bar" style={{ '--bar-h': '90%' }} data-delay="4"></div>
              <div className="mock-chart-bar" style={{ '--bar-h': '65%' }} data-delay="5"></div>
              <div className="mock-chart-bar" style={{ '--bar-h': '85%' }} data-delay="6"></div>
            </div>
            <div className="invite-badges card-anim-item">
              <div className="invite-badge i-1">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                Follow-up Emails Sent
              </div>
              <div className="invite-badge i-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
                CRM Synced
              </div>
              <div className="invite-badge i-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>
                On-Demand Replay
              </div>
              <svg className="float-mail" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              <svg className="float-mail" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default ScrollCards
