/* SpatialChat Event Platform — derived platform data (all real, from event exports) */

window.PLATFORM = {
  org: { name: 'Twilight City', plan: 'Scale', initials: 'TC' },
  user: { name: 'Arty Starr', email: 'arty@twilightcity.net', initials: 'AS', role: 'Team Admin' },

  // Spaces the user can jump into (mirrors app.spatial.chat "Last visited")
  spaces: [
    { id: 'thinkies', name: 'Thinkies World Congress', team: 'Twilight City', visited: 'Visited 6 days ago', initials: 'TW', accent: '#5B5BF5', live: 3, stage: true },
    { id: 'myspace', name: 'My Space', team: 'In My Team', visited: 'Visited 13 days ago', initials: 'MS', accent: '#C77BFF', live: 0 },
    { id: 'cecils', name: "Cecil's Virtual Lounge", team: 'Pomona College', visited: 'Visited 1 month ago', initials: 'CV', accent: '#16A34A', live: 0 },
    { id: 'demo', name: 'Live Demo', team: 'Demo', visited: 'Visited 2 months ago', initials: 'LD', accent: '#0EA5E9', live: 1 },
  ],

  // Home aggregates (computed from the two real events)
  home: {
    totalEvents: 2,
    totalAttendees: 107,
    attendeeMinutes: 12640,     // 83·134.1 + 24·62.9
    avgDwell: 118,              // weighted
    avgExploration: 92.5,
    totalRooms: 23,
    peakConcurrency: 68,
    registrations: 107,
    recordings: 6,
    activePolls: 1,
    avgSession: '118m',
    // monthly attendee-minutes trend (real events sit in Apr + May)
    trend: [
      { m: 'Jan', v: 0 }, { m: 'Feb', v: 0 }, { m: 'Mar', v: 0 },
      { m: 'Apr', v: 1510 }, { m: 'May', v: 11130 }, { m: 'Jun', v: 0 },
    ],
    // attendee geography (real, from Thinkies country column)
    geo: [
      { name: 'United States', pct: 46, color: '#5B5BF5' },
      { name: 'Europe (DE·SE·NL·IE·PT·AT·CZ)', pct: 34, color: '#16A34A' },
      { name: 'Americas (CA·BR)', pct: 12, color: '#F59E0B' },
      { name: 'Other', pct: 8, color: '#EF4444' },
    ],
    // event performance = exploration rate per event
    performance: [
      { name: 'Thinkies World Congress', pct: 89 },
      { name: "Cecil's Virtual Lounge", pct: 96 },
    ],
    activity: [
      { who: 'Arty Starr', act: 'sustained a 335-minute session across 8 rooms', when: 'May 20', tint: '#5B5BF5' },
      { who: 'Pritina Irvin', act: 'drove 74 tracked actions as event Connector', when: 'Apr 17', tint: '#16A34A' },
      { who: 'Thinkies World Congress', act: 'reached peak concurrency of 68', when: 'May 20', tint: '#F59E0B' },
      { who: "Cecil's Virtual Lounge", act: 'held 91.7% of attendees past 30 minutes', when: 'Apr 17', tint: '#7C3AED' },
    ],
    // Zuddl-style headline trio
    statTrio: [
      { label: 'Registrants', value: 107, sub: 'across 2 events' },
      { label: 'First-time registrants', value: 83, sub: '77.6% of total' },
      { label: 'Returning registrants', value: 24, sub: '22.4% of total' },
    ],
    // Registrations timeline — daily new (bars) + cumulative (line)
    regTimeline: [
      { d: 'Apr 02', n: 6 }, { d: 'Apr 05', n: 11 }, { d: 'Apr 08', n: 9 }, { d: 'Apr 11', n: 14 },
      { d: 'Apr 14', n: 8 }, { d: 'Apr 17', n: 21 }, { d: 'Apr 24', n: 5 }, { d: 'May 02', n: 7 },
      { d: 'May 08', n: 12 }, { d: 'May 12', n: 18 }, { d: 'May 16', n: 24 }, { d: 'May 20', n: 31 },
      { d: 'May 24', n: 9 }, { d: 'May 28', n: 6 },
    ],
    // Weekly registrations (line)
    weeklyReg: [
      { w: 'Wk 1', v: 26 }, { w: 'Wk 2', v: 51 }, { w: 'Wk 3', v: 39 }, { w: 'Wk 4', v: 33 },
      { w: 'Wk 5', v: 61 }, { w: 'Wk 6', v: 48 }, { w: 'Wk 7', v: 22 },
    ],
    // Revenue by ticket (donut + legend)
    revenueByTicket: [
      { name: 'Full Congress Pass', amt: '$18,420', pct: 56, color: '#5B5BF5' },
      { name: 'Workshop Add-on', amt: '$7,240', pct: 22, color: '#7C3AED' },
      { name: 'Day Pass', amt: '$4,180', pct: 13, color: '#0EA5E9' },
      { name: 'Student / Intern', amt: '$1,610', pct: 5, color: '#16A34A' },
      { name: 'Virtual (Free)', amt: '$0', pct: 4, color: '#94A3B8' },
    ],
    revenueTotal: '$31,450',
    // Registrations by ticket (donut + legend)
    regByTicket: [
      { name: 'Full Congress Pass', cnt: '44 (41%)', pct: 41, color: '#5B5BF5' },
      { name: 'Day Pass', cnt: '28 (26%)', pct: 26, color: '#0EA5E9' },
      { name: 'Workshop Add-on', cnt: '19 (18%)', pct: 18, color: '#7C3AED' },
      { name: 'Virtual (Free)', cnt: '10 (9%)', pct: 9, color: '#94A3B8' },
      { name: 'Student / Intern', cnt: '6 (6%)', pct: 6, color: '#16A34A' },
    ],
    regTotal: 107,
  },

  // Events list (real)
  events: [
    {
      id: 'thinkies', name: 'Twilight City — Thinkies World', space: 'Thinkies World Congress',
      host: 'Twilight City', date: 'May 20, 2026', status: 'Ended', accent: '#5B5BF5',
      attendees: 83, peak: 68, dwell: 134.1, rooms: 13, exploration: 89.2,
      tickets: 'Free + Member', registered: 95,
    },
    {
      id: 'cecils', name: "Cecil's Virtual Lounge", space: 'CecilsVirtualLounge',
      host: 'Pomona College', date: 'Apr 17, 2026', status: 'Ended', accent: '#16A34A',
      attendees: 24, peak: 20, dwell: 62.9, rooms: 10, exploration: 95.8,
      tickets: 'Free', registered: 28,
    },
  ],

  // People directory (real attendees, both events)
  people: [
    { name: 'Arty Starr', email: 'arty@twilightcity.net', role: 'Team Admin', event: 'Thinkies World', persona: 'Connector', min: 335.4, rooms: 8, actions: 12, score: 93.1, country: '', tint: '#5B5BF5' },
    { name: 'Mario', email: 'mario@mariomelo.com', role: 'Admin', event: 'Thinkies World', persona: 'Connector', min: 174.9, rooms: 8, actions: 14, score: 84.4, country: '', tint: '#16A34A' },
    { name: 'Eugenia · Tech Support', email: 'eug@spatial.chat', role: 'Guest', event: 'Thinkies World', persona: 'Explorer', min: 180, rooms: 5, actions: 5, score: 82.2, country: '', tint: '#F59E0B' },
    { name: 'Pritina Irvin', email: 'pritina@pomona.edu', role: 'Host', event: "Cecil's Lounge", persona: 'Connector', min: 108.8, rooms: 6, actions: 74, score: 99.2, country: 'United States', tint: '#7C3AED' },
    { name: 'Doe Thomas', email: 'doe@pomona.edu', role: 'Host', event: "Cecil's Lounge", persona: 'Connector', min: 90.7, rooms: 3, actions: 50, score: 81.4, country: 'United States', tint: '#EF4444' },
    { name: 'Ana Livia', email: 'ana@spatial.chat', role: 'Moderator', event: "Cecil's Lounge", persona: 'Connector', min: 76.3, rooms: 3, actions: 17, score: 76.7, country: '', tint: '#0EA5E9' },
    { name: 'Diana Larse', email: 'diana@dianalarsen.com', role: 'Guest', event: 'Thinkies World', persona: 'Explorer', min: 180, rooms: 7, actions: 0, score: 72.7, country: '', tint: '#5B5BF5' },
    { name: 'Alex Thurow', email: 'info@onmoderndev.de', role: 'Guest', event: 'Thinkies World', persona: 'Explorer', min: 180, rooms: 8, actions: 0, score: 72.1, country: 'Germany', tint: '#16A34A' },
    { name: 'Eric', email: 'bjoerklunderic@gmail.com', role: 'Guest', event: 'Thinkies World', persona: 'Explorer', min: 180, rooms: 7, actions: 0, score: 71.9, country: 'Sweden', tint: '#F59E0B' },
    { name: 'Ananthaneshan', email: 'poornan@gmail.com', role: 'Guest', event: 'Thinkies World', persona: 'Explorer', min: 179.6, rooms: 9, actions: 0, score: 71.7, country: '', tint: '#7C3AED' },
    { name: 'Kent', email: 'kentlbeck@gmail.com', role: 'Guest', event: 'Thinkies World', persona: 'Explorer', min: 179.6, rooms: 8, actions: 0, score: 69.9, country: '', tint: '#EF4444' },
    { name: 'Brian Marcus', email: 'brian@pomona.edu', role: 'Guest', event: "Cecil's Lounge", persona: 'Explorer', min: 81.7, rooms: 5, actions: 0, score: 67.6, country: 'United States', tint: '#0EA5E9' },
    { name: 'Caer Sanders', email: 'with@caer.cc', role: 'Guest', event: 'Thinkies World', persona: 'Explorer', min: 178, rooms: 9, actions: 0, score: 65.4, country: '', tint: '#5B5BF5' },
    { name: 'Dmitrii', email: 'dmitriy.kuragin@gmail.com', role: 'Guest', event: 'Thinkies World', persona: 'Explorer', min: 180, rooms: 6, actions: 0, score: 65.3, country: 'United States', tint: '#16A34A' },
    { name: 'Blake Lindsay', email: 'blake@twilightcity.net', role: 'Admin', event: 'Thinkies World', persona: 'Explorer', min: 164.3, rooms: 3, actions: 5, score: 64.2, country: '', tint: '#F59E0B' },
    { name: 'Eric Laquer', email: 'ericlaquer@gmail.com', role: 'Guest', event: 'Thinkies World', persona: 'Explorer', min: 174.6, rooms: 10, actions: 0, score: 63, country: '', tint: '#7C3AED' },
    { name: 'Douglas Reveley', email: 'douglas@pomona.edu', role: 'Guest', event: "Cecil's Lounge", persona: 'Explorer', min: 73.6, rooms: 5, actions: 0, score: 62.9, country: 'United States', tint: '#EF4444' },
    { name: 'Ed Thome', email: 'ed.thome@gmail.com', role: 'Guest', event: 'Thinkies World', persona: 'Explorer', min: 176.4, rooms: 8, actions: 0, score: 62.3, country: 'United States', tint: '#0EA5E9' },
    { name: 'Bruce Pfeffer', email: 'bruce@pomona.edu', role: 'Guest', event: "Cecil's Lounge", persona: 'Explorer', min: 83.6, rooms: 3, actions: 0, score: 61.8, country: 'United States', tint: '#5B5BF5' },
    { name: 'Steve Kuo', email: 'steve.kuo@gmail.com', role: 'Guest', event: 'Thinkies World', persona: 'Explorer', min: 179.6, rooms: 6, actions: 0, score: 62.2, country: 'United States', tint: '#16A34A' },
  ],

  personaTotals: [
    { name: 'Explorer', count: 82, color: '#5B5BF5' },
    { name: 'Observer', count: 16, color: '#F59E0B' },
    { name: 'Connector', count: 5, color: '#16A34A' },
    { name: 'Drop-in', count: 4, color: '#94949E' },
  ],

  // Engagement (real action counts, both events)
  engagement: {
    polls: [
      { q: 'Which session should we run first?', votes: 23, status: 'Closed', event: 'Thinkies World',
        options: [{ label: 'Live prototyping demo', pct: 48 }, { label: 'Roadmap deep-dive', pct: 30 }, { label: 'Open Q&A', pct: 22 }] },
    ],
    actions: [
      { name: 'Megaphone', count: 56, icon: 'megaphone' },
      { name: 'Mic Toggle', count: 57, icon: 'mic' },
      { name: 'Chat Message', count: 35, icon: 'chat' },
      { name: 'Camera Toggle', count: 16, icon: 'cam' },
      { name: 'Element Shared', count: 7, icon: 'share' },
    ],
    stats: { messages: 35, reactions: 0, questions: 0, polls: 1 },
  },

  // Recordings (real rooms = recorded sessions)
  recordings: [
    { name: 'Keynote Room — Thinkies World', dur: '3:00:00', date: 'May 20, 2026', views: 83, type: 'Stage' },
    { name: 'Emerald Table Room (2)', dur: '0:42:30', date: 'May 20, 2026', views: 40, type: 'Spatial' },
    { name: 'Emerald Idea Garden (2)', dur: '0:28:40', date: 'May 20, 2026', views: 52, type: 'Spatial' },
    { name: 'Welcome Nest — Cecil\u2019s Lounge', dur: '1:49:00', date: 'Apr 17, 2026', views: 24, type: 'Stage' },
    { name: 'Opening Session — In Memoriam', dur: '0:46:00', date: 'Apr 17, 2026', views: 23, type: 'Spatial' },
    { name: 'Photo Booth', dur: '0:16:30', date: 'Apr 17, 2026', views: 16, type: 'Spatial' },
  ],

  // Community (persistent spaces)
  community: [
    { name: 'Thinkies World Congress', members: 83, rooms: 13, active: 'May 20', accent: '#5B5BF5' },
    { name: 'CecilsVirtualLounge', members: 24, rooms: 10, active: 'Apr 17', accent: '#16A34A' },
  ],

  // Billing — the org's SpatialChat subscription (real plan: Business, 100 users)
  billing: {
    plan: 'Business', tier: '100 users', monthly: 799, cycle: 'monthly',
    nextCycle: 'Jul 1, 2026', activeUsers: 100,
    items: [
      { name: 'SpatialChat Business (100 users)', cost: 799 },
    ],
    invoices: [
      { id: 'INV-2042', date: 'Jun 1, 2026', amount: 799, status: 'Paid' },
      { id: 'INV-2018', date: 'May 1, 2026', amount: 799, status: 'Paid' },
      { id: 'INV-1994', date: 'Apr 1, 2026', amount: 799, status: 'Paid' },
    ],
  },

  // Real SpatialChat plans (from spatial.chat/pricing)
  plans: {
    // Business price by user-capacity tier { monthly, yearly }  (null = Talk to Sales)
    businessTiers: [
      { users: 50, monthly: 399, yearly: 2800 },
      { users: 100, monthly: 799, yearly: 5700 },
      { users: 250, monthly: null, yearly: null },
      { users: 500, monthly: null, yearly: null },
      { users: 1000, monthly: null, yearly: null },
      { users: 3000, monthly: null, yearly: null },
      { users: 5000, monthly: null, yearly: null },
      { users: 10000, monthly: null, yearly: null },
    ],
    subscription: [
      { id: 'free', name: 'Free', tagline: 'Ideal for hands-on trials before purchasing', cta: 'Start for Free',
        features: ['Up to 2 hours of meetings daily with 12 participants', 'Use up to 4 customized Rooms', 'Share up to 3 screens or files at once', 'Hop on directly from browser'] },
      { id: 'business', name: 'Business', tagline: 'Engaging events with multiple simultaneous sessions', cta: 'Buy Now', popular: true,
        features: ['Organize unlimited events for up to 10,000 attendees', 'Multi-session space with interactive breakout rooms', 'Share multiple screens & pin unlimited files', 'Passwords & invitation-only events', 'Store up to 3 session recordings', 'Premium email technical support'] },
      { id: 'enterprise', name: 'Enterprise', tagline: 'Multiple event Spaces with branding & VIP support', cta: 'Contact Us',
        features: ['Run various events simultaneously with reusable Spaces', 'Design Rooms in advance for any format', 'Pin materials & embed websites with no limits', 'Full access control + Private Space', 'Record unlimited Event sessions', 'Technical onboarding + live support', 'Advanced branding options'] },
    ],
    oneTime: [
      { id: 'daypass', name: 'Day Pass', tagline: 'Small-scale events, no commitment — scales in 10-user steps', price: '$5', unit: '/user/day', alt: 'or $40/month', cta: 'Buy Now',
        features: ['24-hour event access, no subscription', '72-hour early access for setup', 'Up to 50 Rooms', 'Multiple screen sharing', 'Locked & Hidden rooms', 'Record Stage sessions'] },
      { id: 'eventpack', name: 'Event Pack', tagline: 'Large, complex events needing premium features', price: '$400', unit: '/day', alt: 'from 50 users', cta: 'Buy Now', popular: true,
        features: ['1-month early access to your Space', 'Premium on-Space specialist support', 'Technical onboarding', 'Dedicated personal manager', 'Kahoot, Slido & MindMeister', 'Invoice-based payment & custom terms'],
        tiers: [{ users: 50, day: 400 }, { users: 100, day: 750 }, { users: 200, day: 1400 }, { users: 300, day: 2000 }, { users: 500, day: 3000 }, { users: 700, day: 4100 }, { users: 1000, day: 5800 }] },
    ],
  },
};
