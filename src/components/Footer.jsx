export default function Footer({ onOpenLegal }) {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <img src="/vistream_beyaz.png" alt="Vistream" style={{ height: '24px', opacity: 0.7 }} />
            <p>The all-in-one platform for professional webinars, hybrid meetings, and TV-quality webcasts.</p>
          </div>
          <div className="footer-col">
            <h4>Navigation</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#integrations">Integrations</a></li>
              <li><a href="#social-proof">Testimonials</a></li>
              <li><a href="#comparison">Why Vistream Events</a></li>
            </ul>
          </div>
          <div className="footer-col">
            <h4>Contact</h4>
            <ul>
              <li><a href="#" data-cal-namespace="30min" data-cal-link="vistreamevents/30min" data-cal-config='{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"light"}' onClick={(e) => e.preventDefault()}>Book a Demo</a></li>
              <li><a href="https://vistream.tv" target="_blank" rel="noopener">vistream.tv</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Vistream Events. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '24px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); onOpenLegal('faq') }}>FAQ</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onOpenLegal('privacy') }}>Privacy Policy</a>
            <a href="#" onClick={(e) => { e.preventDefault(); onOpenLegal('terms') }}>Terms of Use</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
