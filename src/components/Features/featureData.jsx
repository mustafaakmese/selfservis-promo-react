export const FluentIcon = ({ folder }) => {
  const name = folder.toLowerCase().replace(/ /g, '_');
  const url = `https://raw.githubusercontent.com/microsoft/fluentui-emoji/main/assets/${encodeURIComponent(folder)}/3D/${name}_3d.png`;
  return <img src={url} alt={folder} style={{ width: '1.2em', height: '1.2em', display: 'inline-block', verticalAlign: 'middle', filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.08))' }} />;
};

export const featureCards = [
  {
    icon: <FluentIcon folder="Sparkles" />,
    eyebrow: 'AI Copilot Agent',
    title: 'Use your own Microsoft Copilot to manage every event',
    desc: 'No new tools to learn. The same Microsoft Copilot already on your desktop becomes your event manager. Just type what you need: create events, add speakers, send invites, publish landing pages.',
    bullets: [
      'Works inside your existing Microsoft Copilot',
      'Create full events with a simple conversation',
      'Zero learning curve, no training required',
    ],
    mediaType: 'ai',
  },
  {
    icon: <FluentIcon folder="Gear" />,
    eyebrow: 'Self-Service Studio',
    title: 'Launch professional webinars in minutes',
    desc: 'Our intuitive wizard guides you through every step. No technical team required. Full branding control, custom domains, and reusable templates included.',
    bullets: [
      'Step-by-step guided event wizard',
      'Full branding & white-labeling',
      'Dry run & rehearsal mode',
    ],
    mediaType: 'studio',
  },
  {
    icon: <FluentIcon folder="Envelope" />,
    eyebrow: 'Intelligent Emails',
    title: 'Data-driven emails that maximize attendance',
    desc: 'AI-optimized send timing, real-time delivery and engagement stats, and automatic .ics calendar invites that block attendees\' calendars.',
    bullets: [
      'AI-suggested optimal send date & time',
      'Real-time open, click & delivery stats',
      'Auto .ics calendar blocking for attendees',
    ],
    mediaType: 'emails',
  },
  {
    icon: <FluentIcon folder="Clipboard" />,
    eyebrow: 'Intelligent Register',
    title: 'Smart registration with parallel sessions & multi-day support',
    desc: 'Automatically detects and presents parallel sessions for attendee selection, supports seamless multi-day event registration with a single checkout.',
    bullets: [
      'Automatic parallel session detection & selection',
      'Multi-day registration in a single flow',
      'Deep integration with Intelligent Agenda',
    ],
    mediaType: 'registration',
  },
  {
    icon: <FluentIcon folder="Spiral calendar" />,
    eyebrow: 'Intelligent Agenda',
    title: 'Dynamic schedules with timezone intelligence',
    desc: 'Build multi-day, multi-track agendas with auto-calculated time slots. Attendees see sessions in their local timezone automatically.',
    bullets: [
      'Auto-calculated time slots with timezone display',
      'Multi-day sessions with parallel tracks',
      'Drag-and-drop speaker assignment',
    ],
    mediaType: 'agenda',
  },
  {
    icon: <FluentIcon folder="Artist palette" />,
    eyebrow: 'Customized Event Page',
    title: 'Your brand, your stage. Fully customizable event pages',
    desc: 'Custom fonts, curated color palettes, dynamic backgrounds, and fully responsive layouts. Every event page reflects your brand identity.',
    bullets: [
      'Custom fonts & color palettes',
      'Dynamic backgrounds & visual themes',
      'Fully responsive across all devices',
    ],
    mediaType: 'eventpage',
  },
  {
    icon: <FluentIcon folder="World map" />,
    eyebrow: 'Intelligent Journey',
    title: 'Visualize every touchpoint of your attendee experience',
    desc: 'A live screenshot-based journey map showing every page your attendees interact with, from registration to certificates.',
    bullets: [
      'Live screenshot previews of every page',
      'One-click PDF export for stakeholder review',
      'On-demand regeneration & approval workflow',
    ],
    mediaType: 'journey',
  },
  {
    icon: <FluentIcon folder="Check mark button" />,
    eyebrow: 'Surveys & Certificates',
    title: 'Capture feedback first, then reward with certificates',
    desc: 'Post-event surveys collect actionable feedback and NPS scores before attendees receive their branded PDF attendance certificates.',
    bullets: [
      'Survey-first flow for maximum response rates',
      'Custom survey builder with NPS tracking',
      'Branded PDF certificates auto-generated',
    ],
    mediaType: 'surveys',
  },
  {
    icon: <FluentIcon folder="Bar chart" />,
    eyebrow: 'Live Analytics',
    title: 'Real-time insights that drive decisions',
    desc: 'Track attendees, engagement metrics, watch time, and participation in real time. Comprehensive post-event dashboards with exportable reports.',
    bullets: [
      'Real-time attendee tracking',
      'Engagement heatmaps',
      'Exportable PDF reports',
    ],
    mediaType: 'analytics',
  },
]
