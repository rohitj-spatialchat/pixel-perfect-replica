/* global React, Icon, EidSections, EVENTS_DATA, PLATFORM */
// Platform content pages — all real data

const { useState: usePageState } = React;
const P = () => PLATFORM;

// Reusable working filter dropdown (consistent design across all pages)
function PlatFilter({ label, icon, options }) {
  const [open, setOpen] = usePageState(false);
  const [val, setVal] = usePageState(null);
  const Ic = icon;
  return (
    <div className="plat-filter-wrap">
      <button className={`plat-filter ${val ? 'active' : ''}`} onClick={() => setOpen(o => !o)}>
        {Ic && <Ic size={13}/>} {val || label} <Icon.caretDown size={12}/>
      </button>
      {open && <>
        <div className="plat-filter-backdrop" onClick={() => setOpen(false)}/>
        <div className="plat-filter-menu">
          {options.map(o => (
            <button key={o} className={`plat-filter-opt ${val === o ? 'sel' : ''}`} onClick={() => { setVal(o === val ? null : o); setOpen(false); }}>
              {o}{val === o && <Icon.check size={14}/>}
            </button>
          ))}
        </div>
      </>}
    </div>
  );
}

function PageHead({ title, sub, action }) {
  return (
    <div className="plat-page-head">
      <div>
        <h1 className="plat-page-title">{title}</h1>
        {sub && <div className="plat-page-sub">{sub}</div>}
      </div>
      {action}
    </div>
  );
}

function initials(name) {
  const parts = name.replace(/[·•].*$/, '').trim().split(/\s+/);
  return (parts[0]?.[0] || '') + (parts[1]?.[0] || '');
}

/* ---------------- Analytics (Event Intelligence) ---------------- */
function AnalyticsView({ onEnterRoom, initialEvent }) {
  const [eventId, setEventId] = usePageState(initialEvent || null);
  const ev = eventId ? EVENTS_DATA[eventId] : null;
  const S = EidSections;
  const events = Object.values(EVENTS_DATA);

  if (!ev) {
    return (
      <>
        <PageHead title="Event Intelligence" sub="Per-event analytics reconstructed from SpatialChat room sessions"
          action={<button className="plat-cta ghost"><Icon.upload size={15}/> Export all</button>}/>
        <div className="plat-events-grid">
          {events.map(e => (
            <div key={e.id} className="plat-event-tile" onClick={() => setEventId(e.id)}>
              <div className={`plat-event-banner ${e.accent === '#16A34A' ? 'green' : 'indigo'}`}>
                <span className="plat-event-status">Analyzed</span>
                <span className="plat-event-name">{e.name}</span>
              </div>
              <div className="plat-event-body">
                <div className="plat-event-meta"><Icon.calendar size={14}/> {e.date} · {e.host}</div>
                <div className="plat-event-kpis">
                  <div><div className="plat-event-kpi-v">{e.kpis.uniqueAttendees}</div><div className="plat-event-kpi-l">Attendees</div></div>
                  <div><div className="plat-event-kpi-v">{e.kpis.peakConcurrency}</div><div className="plat-event-kpi-l">Peak</div></div>
                  <div><div className="plat-event-kpi-v">{e.kpis.avgDwell}m</div><div className="plat-event-kpi-l">Avg dwell</div></div>
                  <div><div className="plat-event-kpi-v">{e.kpis.explorationRate}%</div><div className="plat-event-kpi-l">Explored</div></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: 'var(--text-secondary)' }}>
          <span style={{ cursor: 'pointer' }} onClick={() => setEventId(null)}>Event Intelligence</span>
          <Icon.caretRight size={12}/> <b style={{ color: 'var(--text)' }}>{ev.space}</b>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="plat-cta ghost"><Icon.doc size={14}/> Download PDF</button>
          <button className="plat-cta ghost"><Icon.upload size={14}/> Raw data (CSV)</button>
        </div>
      </div>
      <div className={`eid-hero ${ev.accent === '#16A34A' ? 'green' : ''}`}>
        <span className="eid-hero-badge"><Icon.recording size={11}/> Event Intelligence Report</span>
        <div className="eid-hero-title">{ev.name}</div>
        <div className="eid-hero-meta">
          <div className="eid-hero-meta-item"><span className="eid-hero-meta-label">Host</span><span className="eid-hero-meta-val">{ev.host}</span></div>
          <div className="eid-hero-meta-item"><span className="eid-hero-meta-label">Space</span><span className="eid-hero-meta-val">{ev.space}</span></div>
          <div className="eid-hero-meta-item"><span className="eid-hero-meta-label">Date</span><span className="eid-hero-meta-val">{ev.date}</span></div>
          <div className="eid-hero-meta-item"><span className="eid-hero-meta-label">Timezone</span><span className="eid-hero-meta-val">{ev.tz}</span></div>
        </div>
        <div className="eid-hero-summary">{ev.summary}</div>
      </div>
      <S.KpiStrip k={ev.kpis}/>
      <EngagementPulse ev={ev}/>
      <S.AttendanceSection ev={ev}/>
      <S.RoomsSection ev={ev}/>
      <S.JourneySection ev={ev}/>
      <S.SegmentationSection ev={ev}/>
      <S.RosterSection ev={ev}/>
      <S.InteractionSection ev={ev}/>
      <S.RecommendationsSection ev={ev}/>
    </>
  );
}

/* ---------------- Events ---------------- */
function EventsPage({ onOpenAnalytics, onCreateEvent }) {
  return (
    <>
      <PageHead title="Events" sub="Every event hosted in your SpatialChat spaces"
        action={<button className="plat-cta" onClick={onCreateEvent}><Icon.plus size={16}/> Create Event</button>}/>
      <div className="plat-events-grid">
        {P().events.map(e => (
          <div key={e.id} className="plat-event-tile" onClick={() => onOpenAnalytics(e.id)}>
            <div className={`plat-event-banner ${e.accent === '#16A34A' ? 'green' : 'indigo'}`}>
              <span className="plat-event-status">{e.status}</span>
              <span className="plat-event-name">{e.name}</span>
            </div>
            <div className="plat-event-body">
              <div className="plat-event-meta"><Icon.calendar size={14}/> {e.date} · {e.host} · {e.space}</div>
              <div className="plat-event-kpis">
                <div><div className="plat-event-kpi-v">{e.attendees}</div><div className="plat-event-kpi-l">Attendees</div></div>
                <div><div className="plat-event-kpi-v">{e.peak}</div><div className="plat-event-kpi-l">Peak</div></div>
                <div><div className="plat-event-kpi-v">{e.dwell}m</div><div className="plat-event-kpi-l">Avg dwell</div></div>
                <div><div className="plat-event-kpi-v">{e.rooms}</div><div className="plat-event-kpi-l">Rooms</div></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- People ---------------- */
const TITLES = ['Marketing Manager', 'Growth Marketing', 'Product Manager', 'CEO', 'Founder', 'Software Engineer', 'CFO', 'Finance Manager'];
const DEPTS = ['Product', 'Engineering', 'Marketing', 'Design', 'Sales', 'Operations', 'Leadership'];
const COUNTRIES = ['United States', 'United Kingdom', 'Germany', 'Canada', 'India', 'Australia', 'Singapore'];
const JOINED = ['Jun 12, 2026', 'Jun 08, 2026', 'May 30, 2026', 'May 24, 2026', 'May 18, 2026', 'May 11, 2026', 'Apr 28, 2026'];
const COMPANIES = ['Apple', 'Google', 'Microsoft', 'Stripe', 'Notion', 'Figma', 'Linear'];
const SOURCES = [
  { label: 'Salesforce', tint: '#00A1E0' }, { label: 'HubSpot', tint: '#FF7A59' },
  { label: 'Registration', tint: '#5B5BF5' }, { label: 'Zapier', tint: '#FF4F00' },
  { label: 'Manual import', tint: '#6B7280' },
];
function PeoplePage() {
  const [q, setQ] = usePageState('');
  const [scope, setScope] = usePageState('all');
  const [sel, setSel] = usePageState({});
  const [toast, setToast] = usePageState(null);
  const ping = (m) => { setToast(m); clearTimeout(window.__ppT); window.__ppT = setTimeout(() => setToast(null), 1800); };
  const all = P().people.map((p, i) => ({
    ...p,
    title: TITLES[i % TITLES.length],
    dept: DEPTS[i % DEPTS.length],
    country: COUNTRIES[i % COUNTRIES.length],
    joined: JOINED[i % JOINED.length],
    company: COMPANIES[i % COMPANIES.length],
    source: SOURCES[i % SOURCES.length],
  }));
  const people = all.filter(p => p.name.toLowerCase().includes(q.toLowerCase()) || p.email.toLowerCase().includes(q.toLowerCase()) || p.company.toLowerCase().includes(q.toLowerCase()));
  const allChecked = people.length > 0 && people.every(p => sel[p.email]);
  const toggleAll = () => { const n = {}; if (!allChecked) people.forEach(p => n[p.email] = true); setSel(n); };
  const selCount = Object.values(sel).filter(Boolean).length;
  return (
    <>
      <PageHead title="People" sub={`${P().home.totalAttendees} attendees across ${P().home.totalEvents} events`}
        action={<div style={{ display: 'flex', gap: 8 }}>
          <button className="plat-cta ghost" onClick={() => ping('Upload a CSV of contacts')}><Icon.upload size={15}/> Upload CSV</button>
          <button className="plat-cta ghost" onClick={() => ping('Syncing with Salesforce…')}><Icon.code size={15}/> Sync with CRM</button>
          <button className="plat-cta" onClick={() => ping('Invite flow — add people by email or CSV')}><Icon.invite size={16}/> Invite</button>
        </div>}/>
      <div className="people-scope">
        <button className={`people-scope-btn ${scope === 'all' ? 'active' : ''}`} onClick={() => setScope('all')}>All events</button>
        <button className={`people-scope-btn ${scope === 'event' ? 'active' : ''}`} onClick={() => setScope('event')}>Event-specific</button>
      </div>
      <div className="plat-toolbar">
        <div className="plat-search">
          <span className="plat-search-ico"><Icon.search size={16}/></span>
          <input placeholder="Search by name, email or company…" value={q} onChange={e => setQ(e.target.value)}/>
        </div>
        {scope === 'event' && <PlatFilter label="Event" options={['Thinkies World Congress', "Cecil's Virtual Lounge"]}/>}
        <PlatFilter label="Title" options={TITLES}/>
        <PlatFilter label="Company" options={COMPANIES}/>
        <PlatFilter label="Country" icon={Icon.globe} options={COUNTRIES}/>
        <PlatFilter label="Date joined" icon={Icon.calendar} options={['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time']}/>
      </div>
      {selCount > 0 && (
        <div className="people-bulk">
          <span>{selCount} selected</span>
          <button className="plat-cta ghost" onClick={() => ping(`Inviting ${selCount} people…`)}><Icon.invite size={14}/> Invite selected</button>
          <button className="plat-cta ghost" onClick={() => ping('Exported to CSV')}><Icon.upload size={14}/> Export</button>
        </div>
      )}
      <div className="plat-table">
        <div className="plat-thead" style={{ gridTemplateColumns: '28px 1.7fr 1.2fr 1fr 1.1fr 1fr 1.1fr' }}>
          <span><button className={`people-check ${allChecked ? 'on' : ''}`} onClick={toggleAll}>{allChecked && <Icon.check size={12}/>}</button></span>
          <span>Attendee</span><span>Title</span><span>Company</span><span>Country</span><span>Date joined</span><span>Source</span>
        </div>
        {people.map((p, i) => (
          <div key={i} className="plat-trow" style={{ gridTemplateColumns: '28px 1.7fr 1.2fr 1fr 1.1fr 1fr 1.1fr' }}>
            <span><button className={`people-check ${sel[p.email] ? 'on' : ''}`} onClick={() => setSel(s => ({ ...s, [p.email]: !s[p.email] }))}>{sel[p.email] && <Icon.check size={12}/>}</button></span>
            <span className="plat-cell-name">
              <span className="plat-avatar" style={{ background: p.tint }}>{initials(p.name)}</span>
              <span style={{ minWidth: 0 }}>
                <b style={{ display: 'block' }}>{p.name}</b>
                <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{p.email}</span>
              </span>
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>{p.title}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{p.company}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{p.country}</span>
            <span style={{ color: 'var(--text-secondary)', fontVariantNumeric: 'tabular-nums' }}>{p.joined}</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12.5, color: 'var(--text-secondary)' }}>
              <span style={{ width: 8, height: 8, borderRadius: 999, background: p.source.tint, flexShrink: 0 }}/>{p.source.label}
            </span>
          </div>
        ))}
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

/* ---------------- Registration ---------------- */
function RegistrationPage() {
  const [tier, setTier] = usePageState('guest');
  const tickets = [
    { id: 'guest', name: 'Guest Access', desc: 'Free — join any open room', price: 'Free' },
    { id: 'member', name: 'Member', desc: 'Reserved seat + member rooms', price: 'Free' },
    { id: 'vip', name: 'Front Row', desc: 'Stage access + speaker networking', price: '$0' },
  ];
  return (
    <>
      <PageHead title="Registration" sub="Registration page for Thinkies World Congress"
        action={<div style={{ display: 'flex', gap: 8 }}>
          <button className="plat-cta ghost"><Icon.expand size={15}/> Preview</button>
          <button className="plat-cta"><Icon.share size={15}/> Publish</button>
        </div>}/>
      <div className="plat-reg">
        <div className="plat-reg-preview">
          <div className="plat-reg-hero">
            <span className="plat-reg-hero-tag">Twilight City presents</span>
            <div className="plat-reg-hero-title">Thinkies World Congress</div>
            <div className="plat-reg-hero-meta">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.calendar size={14}/> May 20, 2026</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.clock size={14}/> 8:00–11:00 PT</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon.user size={14}/> 83 registered</span>
            </div>
          </div>
          <div className="plat-reg-form">
            <h3>Reserve your spot</h3>
            <p>Join a multi-room SpatialChat congress — keynote, idea gardens and table rooms.</p>
            <div className="plat-field"><label>Full name</label><div className="plat-field-input disabled">Your name</div></div>
            <div className="plat-field"><label>Email address</label><div className="plat-field-input disabled">you@email.com</div></div>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 500, color: 'var(--text-secondary)', marginBottom: 9 }}>Choose your ticket</label>
            <div className="plat-tickets">
              {tickets.map(t => (
                <div key={t.id} className={`plat-ticket ${tier === t.id ? 'sel' : ''}`} onClick={() => setTier(t.id)}>
                  <span className="plat-ticket-radio"/>
                  <span className="plat-ticket-info">
                    <span className="plat-ticket-name">{t.name}</span>
                    <span className="plat-ticket-desc">{t.desc}</span>
                  </span>
                  <span className="plat-ticket-price">{t.price}</span>
                </div>
              ))}
            </div>
            <button className="plat-reg-submit">Complete registration</button>
          </div>
        </div>
        <div className="plat-reg-side">
          <div className="plat-reg-stat-card">
            <div className="plat-reg-stat-label">Registered</div>
            <div className="plat-reg-stat-val">95</div>
          </div>
          <div className="plat-card" style={{ padding: '20px 22px' }}>
            <div className="plat-card-title" style={{ fontSize: 14 }}>Conversion funnel</div>
            <Funnel rows={[
              { label: 'Page views', v: 100, n: '312' },
              { label: 'Started', v: 61, n: '190' },
              { label: 'Registered', v: 30, n: '95' },
              { label: 'Attended', v: 27, n: '83' },
            ]}/>
          </div>
          <div className="plat-reg-stat-card">
            <div className="plat-reg-stat-label">Show-up rate</div>
            <div className="plat-reg-stat-val">87%</div>
            <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)', marginTop: 2 }}>83 of 95 registrants joined</div>
          </div>
        </div>
      </div>
    </>
  );
}

function Funnel({ rows }) {
  return (
    <div>
      {rows.map((r, i) => (
        <div key={i} className="plat-funnel-row">
          <span className="plat-funnel-label">{r.label}</span>
          <span className="plat-funnel-track">
            <span className="plat-funnel-fill" style={{ width: `${r.v}%` }}><span>{r.n}</span></span>
          </span>
        </div>
      ))}
    </div>
  );
}

/* ---------------- Engagement ---------------- */
const ENG_ICONS = { chat: Icon.chat, mic: Icon.mic, cam: Icon.cam, share: Icon.share, megaphone: Icon.megaphone };
function EngagementPage() {
  const e = P().engagement;
  const maxAct = Math.max(...e.actions.map(a => a.count));
  return (
    <>
      <PageHead title="Engagement" sub="Polls, chat and live interaction across your events"
        action={<PlatFilter label="All events" options={['Thinkies World Congress', "Cecil's Virtual Lounge", 'All events']}/>}/>
      <div className="plat-mini" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[[Icon.chart, e.stats.polls, 'Polls run'],[Icon.chat, e.stats.messages, 'Chat messages'],[Icon.broadcast, '174', 'Tracked actions'],[Icon.users, '7', 'Active facilitators']].map(([Ic, v, l]) => (
          <div key={l} className="plat-mini-tile">
            <span className="plat-mini-ico"><Ic size={17}/></span>
            <span className="plat-mini-val">{v}</span>
            <span className="plat-mini-label">{l}</span>
          </div>
        ))}
      </div>
      <div className="plat-charts" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <div className="plat-card">
          <div className="plat-card-title">Live Polls</div>
          <div className="plat-card-sub" style={{ marginBottom: 16 }}>Results captured during the event</div>
          {e.polls.map((poll, i) => (
            <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 14, padding: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <span className="plat-tag explorer" style={{ fontSize: 10 }}><Icon.chart size={11}/> Poll</span>
                <span className="plat-tag ended" style={{ fontSize: 10 }}>{poll.status}</span>
                <span style={{ marginLeft: 'auto', fontSize: 11.5, color: 'var(--text-tertiary)' }}>{poll.votes} votes</span>
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>{poll.q}</div>
              {poll.options.map((o, oi) => (
                <div key={oi} style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12.5, marginBottom: 4 }}>
                    <span style={{ color: 'var(--text)' }}>{o.label}</span>
                    <span style={{ fontWeight: 700, color: 'var(--text)' }}>{o.pct}%</span>
                  </div>
                  <div style={{ height: 7, background: 'var(--surface)', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ width: `${o.pct}%`, height: '100%', background: 'linear-gradient(90deg, var(--brand-indigo), #8B5BF5)', borderRadius: 999 }}/>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="plat-card">
          <div className="plat-card-title">Action Mix</div>
          <div className="plat-card-sub" style={{ marginBottom: 8 }}>Tracked interaction events across both events</div>
          {e.actions.map((a, i) => {
            const Ic = ENG_ICONS[a.icon] || Icon.broadcast;
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 0', borderTop: i ? '1px solid color-mix(in srgb, var(--border) 55%, transparent)' : 'none' }}>
                <span className="plat-mini-ico" style={{ width: 32, height: 32 }}><Ic size={15}/></span>
                <span style={{ flex: 1, fontSize: 13, color: 'var(--text)' }}>{a.name}</span>
                <span style={{ width: 120, height: 7, background: 'var(--surface)', borderRadius: 999, overflow: 'hidden' }}>
                  <span style={{ display: 'block', width: `${(a.count/maxAct)*100}%`, height: '100%', background: 'linear-gradient(90deg, var(--brand-indigo), #8B5BF5)', borderRadius: 999 }}/>
                </span>
                <span style={{ minWidth: 28, textAlign: 'right', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: 'var(--text)' }}>{a.count}</span>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ---------------- Recordings ---------------- */
function RecordingsPage() {
  const [toast, setToast] = usePageState(null);
  const [modal, setModal] = usePageState(null);
  const [activeRec, setActiveRec] = usePageState(null);
  const [section, setSection] = usePageState('recordings');
  const ping = (m) => { setToast(m); clearTimeout(window.__recT); window.__recT = setTimeout(() => setToast(null), 1700); };
  const Clip = window.ClipModal, Share = window.ShareModal, Summary = window.SummaryModal;
  const openClip = (r) => { setActiveRec(r); setModal('clip'); };
  const openSummary = (r) => { setActiveRec(r); setModal('summary'); };
  const recs = [
    { name: 'Opening Keynote — The Future of Gathering', speaker: 'Arty Starr', dur: '48:12', date: 'May 20', views: '3,204', q: '4K', thumb: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?w=400&q=80', published: true },
    { name: 'Idea Garden: Designing for Presence', speaker: 'Pritina Irvin', dur: '1:12:40', date: 'May 20', views: '1,486', q: '1080p', thumb: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=400&q=80', published: true },
    { name: "Cecil's Lounge — Fireside Chat", speaker: 'Marco Reyes', dur: '34:08', date: 'Apr 17', views: '892', q: '1080p', thumb: 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=400&q=80', published: false },
    { name: 'Workshop: Building Your First Space', speaker: 'Sarah Kim', dur: '52:31', date: 'Apr 17', views: '1,140', q: '720p', thumb: 'https://images.unsplash.com/photo-1531058020387-3be344556be6?w=400&q=80', published: false },
  ];
  const clips = [
    { name: 'Why events are a channel, not a one-off', speaker: 'Arty Starr', dur: '0:42', date: 'May 20', views: '8,410', q: '1080p', thumb: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&q=80', published: true },
    { name: '40% repeat attendance — the data', speaker: 'Emma Carter', dur: '0:28', date: 'May 20', views: '5,120', q: '1080p', thumb: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=400&q=80', published: true },
    { name: 'Turning dwell into participation', speaker: 'Marco Reyes', dur: '0:55', date: 'Apr 17', views: '2,030', q: '720p', thumb: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=400&q=80', published: false },
  ];
  const list = section === 'recordings' ? recs : clips;
  return (
    <>
      <PageHead title="Recordings" sub="Recorded sessions — edit, set quality, create clips and share"/>
      <div className="people-scope">
        <button className={`people-scope-btn ${section === 'recordings' ? 'active' : ''}`} onClick={() => setSection('recordings')}>Recordings <span style={{ opacity: 0.6 }}>{recs.length}</span></button>
        <button className={`people-scope-btn ${section === 'clips' ? 'active' : ''}`} onClick={() => setSection('clips')}>Clips <span style={{ opacity: 0.6 }}>{clips.length}</span></button>
      </div>
      <div className="plat-toolbar">
        <div className="plat-search">
          <span className="plat-search-ico"><Icon.search size={16}/></span>
          <input placeholder={`Search ${section}…`}/>
        </div>
        <PlatFilter label="All events" options={['Thinkies World Congress', "Cecil's Virtual Lounge", 'All events']}/>
        <PlatFilter label="Quality" options={['4K', '1080p', '720p']}/>
        <PlatFilter label="Date" icon={Icon.calendar} options={['Last 7 days', 'Last 30 days', 'All time']}/>
        <PlatFilter label="Status" options={['Completed', 'Failed']}/>
      </div>
      <div className="rec-grid">
        {list.map((r, i) => (
          <div key={i} className="rec-card">
            <div className="rec-thumb" style={{ backgroundImage: `url('${r.thumb}')` }}>
              <span className="rec-play"><Icon.video size={20}/></span>
              <span className="rec-q">{r.q}</span>
              <span className="rec-dur">{section === 'clips' && <span className="rec-clip-badge">CLIP</span>}{r.dur}</span>
              {r.published && <span className="rec-live-tag">Completed</span>}
              {!r.published && <span className="rec-live-tag" style={{ background: 'var(--brand-red)' }}>Failed</span>}
            </div>
            <div className="rec-body">
              <div className="rec-name">{r.name}</div>
              <div className="rec-meta">{r.speaker} · {r.date} · {r.views} views</div>
              <div className="rec-actions">
                <button className="rec-btn" onClick={() => openClip(r)}><Icon.pencil size={13}/> Edit</button>
                {section === 'recordings' && <button className="rec-btn" onClick={() => openClip(r)}><Icon.video size={13}/> Clip</button>}
                {section === 'recordings' && <button className="rec-btn" onClick={() => openSummary(r)}><Icon.doc size={13}/> Summary</button>}
                <button className="rec-btn" onClick={() => setModal('share')}><Icon.share size={13}/> Share</button>
                <button className="rec-btn primary" onClick={() => ping(r.published ? 'Opening…' : 'Published')}>{r.published ? 'View' : 'Publish'}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {toast && <div className="toast">{toast}</div>}
      {modal === 'clip' && Clip && <Clip speaker={{ photo: (activeRec && activeRec.thumb) }} onClose={() => setModal(null)} onShare={() => setModal('share')} showToast={ping}/>}
      {modal === 'share' && Share && <Share onClose={() => setModal(null)} showToast={ping}/>}
      {modal === 'summary' && Summary && <Summary onClose={() => setModal(null)} showToast={ping}/>}
    </>
  );
}

/* ---------------- Revenue (per-attendee with company) ---------------- */
function RevenuePage() {
  const tx = [
    { who: 'Sarah Johnson', company: 'Apple', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', ticket: 'Diamond', events: 2, amt: 299 },
    { who: 'Michael Chen', company: 'Microsoft', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', ticket: 'Diamond', events: 2, amt: 299 },
    { who: 'Emily Rodriguez', company: 'Google', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80', ticket: 'Gold', events: 1, amt: 149 },
    { who: 'David Park', company: 'Stripe', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', ticket: 'Gold', events: 2, amt: 149 },
    { who: 'Aisha Patel', company: 'Notion', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', ticket: 'Gold', events: 1, amt: 149 },
    { who: 'Tom Becker', company: 'Figma', photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&q=80', ticket: 'Day Pass', events: 1, amt: 79 },
    { who: 'Lena Hoff', company: 'Linear', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80', ticket: 'Day Pass', events: 3, amt: 79 },
  ];
  const byCompany = [
    { name: 'Apple', amt: 897, seats: 3, color: '#5B5BF5' },
    { name: 'Google', amt: 746, seats: 5, color: '#16A34A' },
    { name: 'Microsoft', amt: 598, seats: 2, color: '#0EA5E9' },
    { name: 'Stripe', amt: 447, seats: 3, color: '#7C3AED' },
    { name: 'Notion', amt: 298, seats: 2, color: '#F59E0B' },
  ];
  const maxCo = byCompany[0].amt;
  return (
    <>
      <PageHead title="Revenue" sub="Ticket revenue by attendee and by company"
        action={<button className="plat-cta"><Icon.upload size={16}/> Export</button>}/>
      <div className="plat-toolbar">
        <div className="plat-search">
          <span className="plat-search-ico"><Icon.search size={16}/></span>
          <input placeholder="Search attendee or company…"/>
        </div>
        <PlatFilter label="All events" options={['Thinkies World Congress', "Cecil's Virtual Lounge", 'All events']}/>
        <PlatFilter label="Date range" icon={Icon.calendar} options={['Last 7 days', 'Last 30 days', 'Last 90 days', 'All time']}/>
        <PlatFilter label="Company" options={['Apple', 'Google', 'Microsoft', 'Stripe', 'Notion']}/>
        <PlatFilter label="Ticket" options={['Diamond', 'Gold', 'Day Pass']}/>
      </div>
      <div className="plat-kpis">
        <MiniKpi ico={Icon.receipt} tint="#16A34A" label="Ticket revenue" value="$31,450" sub="+8% vs last event"/>
        <MiniKpi ico={Icon.user} tint="#5B5BF5" label="Paying attendees" value="83" sub="of 107 registered"/>
        <MiniKpi ico={Icon.chart} tint="#F59E0B" label="Avg revenue / attendee" value="$379" sub="Across all tiers"/>
        <MiniKpi ico={Icon.globe} tint="#7C3AED" label="Top company" value="Apple" sub="$897 from 3 seats"/>
      </div>

      <div className="plat-card" style={{ marginBottom: 16 }}>
        <div className="plat-card-title">Revenue by company</div>
        <div className="plat-card-sub" style={{ marginBottom: 6 }}>Which organizations drove the most ticket revenue</div>
        {byCompany.map(c => (
          <div key={c.name} className="plat-perf-row">
            <span className="plat-perf-name">{c.name} <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>· {c.seats} seats</span></span>
            <span className="plat-perf-track"><span className="plat-perf-fill" style={{ width: `${(c.amt/maxCo)*100}%`, background: c.color }}/></span>
            <span className="plat-perf-pct">${c.amt}</span>
          </div>
        ))}
      </div>

      <h2 className="plat-sec-title">Revenue by attendee</h2>
      <div className="plat-table">
        <div className="plat-thead" style={{ gridTemplateColumns: '2fr 1.4fr 1fr 0.8fr 1fr' }}>
          <span>Attendee</span><span>Company</span><span>Ticket</span><span style={{ textAlign: 'center' }}>Events</span><span style={{ textAlign: 'right' }}>Revenue</span>
        </div>
        {tx.map((t, i) => (
          <div key={i} className="plat-trow" style={{ gridTemplateColumns: '2fr 1.4fr 1fr 0.8fr 1fr' }}>
            <span className="plat-cell-name">
              <span className="plat-avatar" style={{ backgroundImage: `url('${t.photo}')`, backgroundSize: 'cover' }}/>
              <b>{t.who}</b>
            </span>
            <span style={{ color: 'var(--text-secondary)' }}>{t.company}</span>
            <span><span className="plat-tag explorer">{t.ticket}</span></span>
            <span style={{ textAlign: 'center', fontVariantNumeric: 'tabular-nums', color: 'var(--text-secondary)' }}>{t.events} {t.events === 1 ? 'event' : 'events'}</span>
            <span style={{ textAlign: 'right', fontWeight: 700, color: '#16A34A', fontVariantNumeric: 'tabular-nums' }}>+${t.amt}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function MiniKpi({ ico, tint, label, value, sub }) {
  const Ic = ico;
  return (
    <div className="plat-kpi">
      <div className="plat-kpi-top">
        <span className="plat-kpi-label">{label}</span>
        <span className="plat-kpi-ico" style={{ background: `${tint}1A`, color: tint }}><Ic size={16}/></span>
      </div>
      <div className="plat-kpi-value">{value}</div>
      <div style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>{sub}</div>
    </div>
  );
}

/* ---------------- Community ---------------- */
function CommunityPage() {
  const metrics = [
    { ico: Icon.users, v: '1,284', l: 'Members', tint: '#5B5BF5' },
    { ico: Icon.chat, v: '3,902', l: 'Posts', tint: '#16A34A' },
    { ico: Icon.broadcast, v: '12.4K', l: 'Likes', tint: '#EC4899' },
    { ico: Icon.calendar, v: '42', l: 'Events hosted', tint: '#0EA5E9' },
    { ico: Icon.clock, v: '68%', l: 'Monthly active', tint: '#7C3AED' },
  ];
  return (
    <>
      <PageHead title="Community" sub="Your always-on home between events"/>
      <div className="comm-hero">
        <div className="comm-hero-emoji">🌐</div>
        <div style={{ flex: 1 }}>
          <div className="comm-hero-title">Welcome to your community</div>
        </div>
        <button className="comm-hero-btn"><Icon.door size={15}/> Go to your community</button>
      </div>
      <h2 className="plat-sec-title">Community analytics</h2>
      <div className="plat-kpis" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
        {metrics.map(m => (
          <div key={m.l} className="plat-kpi" style={{ padding: '18px 16px', textAlign: 'center' }}>
            <span className="plat-kpi-ico" style={{ background: `${m.tint}1A`, color: m.tint, margin: '0 auto 10px' }}><m.ico size={17}/></span>
            <div className="plat-kpi-value" style={{ fontSize: 26, margin: '0 0 4px' }}>{m.v}</div>
            <div className="plat-kpi-label" style={{ fontSize: 12 }}>{m.l}</div>
          </div>
        ))}
      </div>
      <h2 className="plat-sec-title">Active groups</h2>
      <div className="plat-events-grid">
        {P().community.map((c, i) => (
          <div key={i} className="plat-card" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <span style={{ width: 48, height: 48, borderRadius: 13, background: c.accent, color: '#fff', display: 'grid', placeItems: 'center' }}><Icon.globe size={22}/></span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{c.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', marginTop: 2 }}>{c.members} members · {c.rooms} rooms · active {c.active}</div>
            </div>
            <button className="plat-cta ghost"><Icon.door size={14}/> Open</button>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- SpatialChat AI ---------------- */
function AIAgentPage({ onToast }) {
  const [msgs, setMsgs] = usePageState([
    { role: 'agent', text: "Hi Arty 👋 I'm SpatialChat AI. Tell me what you want to run and I'll set up the whole event — rooms, registration flow, agenda and emails." },
  ]);
  const [draft, setDraft] = usePageState('');
  const prompts = [
    'Plan a 200-person product summit with a keynote + 3 breakouts',
    'Draft a registration page for a free webinar',
    'Summarize my last event\u2019s engagement',
    'Build a 2-email reminder sequence',
  ];
  const send = (text) => {
    const t = (text || draft).trim(); if (!t) return;
    setMsgs(m => [...m, { role: 'user', text: t }, { role: 'agent', text: 'On it — drafting that now. I\u2019ll create the rooms, a registration flow and a reminder email, then drop them in your dashboard for review.' }]);
    setDraft('');
  };
  return (
    <>
      <PageHead title="SpatialChat AI" sub="Your event copilot — build and run events from a prompt"/>
      <div className="ai-wrap">
        <div className="ai-chat">
          <div className="ai-head">
            <span className="ai-head-ava"><Icon.megaphone size={17}/></span>
            <div style={{ flex: 1 }}>
              <div className="ai-head-name">SpatialChat AI</div>
              <div className="ai-head-status"><span className="ai-head-dot"/> Online · ready to build</div>
            </div>
            <button className="plat-cta ghost" onClick={() => { setMsgs(m => m.slice(0,1)); onToast && onToast('New chat'); }}><Icon.plus size={14}/> New chat</button>
          </div>
          <div className="ai-thread">
            {msgs.map((m, i) => (
              <div key={i} className={`ai-msg ${m.role}`}>
                {m.role === 'agent' && <span className="ai-ava"><Icon.megaphone size={15}/></span>}
                <div className="ai-bubble">{m.text}</div>
              </div>
            ))}
          </div>
          <div className="ai-composer">
            <input placeholder="Ask SpatialChat AI…" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}/>
            <button className="ai-send" onClick={() => send()}><Icon.send size={16}/></button>
          </div>
        </div>
        <div className="ai-side">
          <div className="ai-side-title">Try a prompt</div>
          {prompts.map(p => <button key={p} className="ai-prompt" onClick={() => send(p)}>{p}</button>)}
          <div className="ai-side-title" style={{ marginTop: 18 }}>What SpatialChat AI can do</div>
          {[['Create events end-to-end', Icon.calendar],['Generate registration pages', Icon.doc],['Summarize analytics', Icon.chart],['Write attendee emails', Icon.chat]].map(([t, Ic]) => (
            <div key={t} className="ai-skill"><span className="ai-skill-ico"><Ic size={15}/></span>{t}</div>
          ))}
        </div>
      </div>
    </>
  );
}

/* ---------------- Billing ---------------- */
function BillingPage({ onChangePlan }) {
  const b = P().billing;
  return (
    <>
      <PageHead title="Billing" sub="Your SpatialChat subscription and invoices"
        action={<button className="plat-cta" onClick={onChangePlan}>Change plan</button>}/>
      <div className="plat-bill-grid">
        <div className="plat-bill-card"><div className="plat-bill-label">Current plan</div><div className="plat-bill-val">{b.plan}</div></div>
        <div className="plat-bill-card"><div className="plat-bill-label">Next billing cycle</div><div className="plat-bill-val" style={{ fontSize: 18 }}>{b.nextCycle}</div></div>
        <div className="plat-bill-card"><div className="plat-bill-label">Active users</div><div className="plat-bill-val">{b.activeUsers}</div></div>
        <div className="plat-bill-card"><div className="plat-bill-label">Monthly payment</div><div className="plat-bill-val">${b.monthly}.00</div></div>
      </div>
      <div className="plat-card" style={{ maxWidth: 560 }}>
        <div className="plat-card-title" style={{ marginBottom: 8 }}>Subscription breakdown</div>
        {b.items.map((it, i) => (
          <div key={i} className="plat-bill-row"><span>{it.name}</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>${it.cost}.00</span></div>
        ))}
        <div className="plat-bill-row total"><span>Total</span><span style={{ fontVariantNumeric: 'tabular-nums' }}>${b.monthly}.00</span></div>
      </div>
      <h2 className="plat-sec-title">Invoices</h2>
      <div className="plat-table">
        <div className="plat-thead" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr' }}>
          <span>Invoice</span><span>Date</span><span>Amount</span><span>Status</span>
        </div>
        {b.invoices.map((inv, i) => (
          <div key={i} className="plat-trow" style={{ gridTemplateColumns: '1.5fr 1fr 1fr 1fr' }}>
            <span style={{ fontWeight: 600 }}>{inv.id}</span>
            <span style={{ color: 'var(--text-secondary)' }}>{inv.date}</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>${inv.amount}.00</span>
            <span><span className="plat-tag paid">{inv.status}</span></span>
          </div>
        ))}
      </div>
    </>
  );
}

/* ---------------- Settings ---------------- */
const SETTINGS_NAV = ['Basic Info', 'Team', 'Community Experience', 'Homepage', 'Onboarding', 'Appearance', 'Gamification', 'User Safety', 'Profile', 'Verification', 'Notification Centre'];
const TEAM_MEMBERS = [
  { name: 'Tina Geizen', email: 'tina@spatial.chat', role: 'Administrator', login: '3 hours ago', tint: '#C9B8FF', status: 'active' },
  { name: 'Shanmukha V', email: 'shanmukha.v@spatial.chat', role: 'Administrator', login: '6 hours ago', tint: '#FFE08A', status: 'active' },
  { name: 'Riddhik Kochhar', email: 'riddhik.k@spatial.chat', role: 'Super Administrator', login: '4 days ago', tint: '#9DB8FF', you: true, status: 'active' },
  { name: 'Oleg Danylenko', email: 'oleg@teemyco.com', role: 'Super Administrator', extra: '1 others', login: '4 days ago', tint: '#B8A8FF', owner: true, status: 'active' },
  { name: 'Andre Borrelly', email: 'ab@spatial.chat', role: 'Super Administrator', extra: '1 others', login: '2 weeks ago', tint: '#9DE8B8', status: 'active' },
  { name: 'James Park', email: 'james.p@spatial.chat', role: 'Administrator', login: '3 weeks ago', tint: '#9DD8F5', status: 'active' },
  { name: 'Saurav Kumar', email: 'saurav.k@spatial.chat', role: 'Administrator', login: '3 weeks ago', tint: '#C9B8FF', status: 'active' },
  { name: 'Anastasia Davis', email: 'anastasia@spatial.chat', role: 'Administrator', login: '4 weeks ago', tint: '#C9B8FF', status: 'inactive' },
];
function SettingsPage() {
  const [nav, setNav] = usePageState('Team');
  const [s, setS] = usePageState({ directory: true, emails: true, replays: false, branding: true });
  const [memberFilter, setMemberFilter] = usePageState('all');
  const [sortBy, setSortBy] = usePageState('Roles');
  const [sel, setSel] = usePageState({});
  const [toast, setToast] = usePageState(null);
  const ping = (m) => { setToast(m); clearTimeout(window.__setT); window.__setT = setTimeout(() => setToast(null), 1700); };

  const counts = { all: TEAM_MEMBERS.length, active: TEAM_MEMBERS.filter(m => m.status === 'active').length, pending: 0, inactive: TEAM_MEMBERS.filter(m => m.status === 'inactive').length };
  const filtered = TEAM_MEMBERS.filter(m => memberFilter === 'all' || m.status === memberFilter);
  const allChecked = filtered.length > 0 && filtered.every(m => sel[m.email]);
  const toggleAll = () => { const n = {}; if (!allChecked) filtered.forEach(m => n[m.email] = true); setSel(n); };

  return (
    <>
      <PageHead title="Settings" sub="Workspace preferences and team management"/>
      <div className="set-layout">
        <aside className="set-nav">
          <div className="set-nav-title">Settings</div>
          {SETTINGS_NAV.map(n => (
            <button key={n} className={`set-nav-item ${nav === n ? 'active' : ''}`} onClick={() => setNav(n)}>{n}</button>
          ))}
        </aside>
        <div className="set-content">
          {nav === 'Team' ? (
            <>
              <div className="set-h">Team Management</div>
              <div className="set-sub">Manage your team members, roles, and permissions.</div>
              <div className="tm-pills">
                {[['all', 'All members'],['active', 'Active members'],['pending', 'Pending invites'],['inactive', 'Inactive members']].map(([k, l]) => (
                  <button key={k} className={`tm-pill ${memberFilter === k ? 'active' : ''}`} onClick={() => setMemberFilter(k)}>{l} <span>{counts[k]}</span></button>
                ))}
              </div>
              <div className="tm-actions">
                <button className="plat-cta ghost" onClick={() => ping('Exported team to CSV')}><Icon.upload size={15}/> Export</button>
                <button className="plat-cta" onClick={() => ping('Add a team member')}><Icon.plus size={16}/> Add member</button>
              </div>
              <div className="tm-sorts">
                {['Roles', 'Status', 'Name', 'Email'].map(t => (
                  <button key={t} className={`tm-sort ${sortBy === t ? 'active' : ''}`} onClick={() => setSortBy(t)}>{t}</button>
                ))}
              </div>
              <div className="plat-table">
                <div className="plat-thead" style={{ gridTemplateColumns: '28px 1.7fr 1.6fr 1.2fr 0.9fr 1fr 40px' }}>
                  <span><button className={`people-check ${allChecked ? 'on' : ''}`} onClick={toggleAll}>{allChecked && <Icon.check size={12}/>}</button></span>
                  <span>Name</span><span>Email</span><span>Roles</span><span>Auth</span><span>Last login</span><span/>
                </div>
                {filtered.map((m, i) => (
                  <div key={i} className="plat-trow" style={{ gridTemplateColumns: '28px 1.7fr 1.6fr 1.2fr 0.9fr 1fr 40px' }}>
                    <span><button className={`people-check ${sel[m.email] ? 'on' : ''}`} onClick={() => setSel(x => ({ ...x, [m.email]: !x[m.email] }))}>{sel[m.email] && <Icon.check size={12}/>}</button></span>
                    <span className="plat-cell-name">
                      <span className="plat-avatar" style={{ background: m.tint, color: '#1A1A2E' }}>{initials(m.name)}</span>
                      <span style={{ minWidth: 0 }}>
                        <b style={{ display: 'block' }}>{m.name}</b>
                        {m.you && <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>You</span>}
                        {m.owner && <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)' }}>Owner</span>}
                      </span>
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>{m.email}</span>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{m.role}{m.extra && <span style={{ display: 'block', fontSize: 11.5, fontWeight: 400, color: 'var(--text-tertiary)' }}>+ {m.extra}</span>}</span>
                    <span style={{ color: '#16A34A', fontSize: 12.5, fontWeight: 600 }}>Two-step</span>
                    <span style={{ color: 'var(--text-secondary)' }}>{m.login}</span>
                    <button className="icon-btn" onClick={() => ping(`Manage ${m.name}`)}><Icon.more size={16}/></button>
                  </div>
                ))}
              </div>
            </>
          ) : nav === 'Basic Info' ? (
            <>
              <div className="set-h">Basic Info</div>
              <div className="set-sub">Workspace preferences and policies.</div>
              <div className="plat-field" style={{ marginBottom: 20, maxWidth: 520 }}>
                <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-secondary)', display: 'block', marginBottom: 8 }}>Organization name</label>
                <input className="plat-field-input" defaultValue="Twilight City"/>
              </div>
              <div className="plat-card" style={{ padding: '4px 22px', maxWidth: 640 }}>
                {[['directory','Public event directory','Let anyone discover your published events'],
                  ['emails','Registration emails','Send confirmation emails to new registrants'],
                  ['replays','Auto-publish replays','Make recordings public as soon as an event ends'],
                  ['branding','Custom branding','Show your logo and colors on registration pages']].map(([k,t,d], i) => (
                  <div key={k} className="setting-row" style={{ borderTop: i ? '1px solid color-mix(in srgb, var(--border) 60%, transparent)' : 'none' }}>
                    <div className="setting-info"><div className="setting-title">{t}</div><div className="setting-desc">{d}</div></div>
                    <button className={`toggle ${s[k] ? 'on' : ''}`} onClick={() => setS(p => ({ ...p, [k]: !p[k] }))}/>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="plat-empty" style={{ marginTop: 0 }}>
              <div className="plat-empty-ico"><Icon.settings size={26}/></div>
              <div className="plat-empty-title">{nav}</div>
              <div className="plat-empty-text">This section is part of your workspace settings.</div>
            </div>
          )}
        </div>
      </div>
      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

/* ---------------- Networking (Speed Networking) ---------------- */
function NetworkingPage() {
  const members = [
    { name: 'Sarah Johnson', company: 'Apple', role: 'Product Manager', loc: 'San Francisco, CA', score: '9.4', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80', bio: 'Leading product strategy for developer tools at Apple. Passionate about building products that delight users.', tags: ['Product Strategy', 'AI/ML', 'Developer Tools'] },
    { name: 'Michael Chen', company: 'Microsoft', role: 'CEO', loc: 'New York, NY', score: '9.2', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80', bio: 'Serial entrepreneur turned CEO. Building the next generation of collaboration software.', tags: ['Leadership', 'SaaS', 'Growth'] },
    { name: 'Emily Rodriguez', company: 'Google', role: 'Engineering Lead', loc: 'Austin, TX', score: '8.5', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80', bio: 'Engineering lead building next-gen search. Loves mentoring and distributed systems.', tags: ['Engineering', 'Search', 'Mentoring'] },
    { name: 'David Park', company: 'Stripe', role: 'Design Director', loc: 'Seattle, WA', score: '8.9', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80', bio: 'Design director shaping payments UX for millions. Advocate for inclusive design.', tags: ['Design', 'Payments', 'UX'] },
    { name: 'Aisha Patel', company: 'Notion', role: 'Head of Marketing', loc: 'Boston, MA', score: '8.7', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80', bio: 'Building community-led growth at Notion. Storyteller and brand builder.', tags: ['Marketing', 'Community', 'Brand'] },
    { name: 'Tom Becker', company: 'Figma', role: 'Staff Engineer', loc: 'Remote', score: '8.3', photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=200&q=80', bio: 'Staff engineer on the multiplayer team. Obsessed with realtime collaboration.', tags: ['Realtime', 'Infra', 'Collaboration'] },
    { name: 'Lena Hoff', company: 'Linear', role: 'Founder', loc: 'Berlin, DE', score: '9.0', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80', bio: 'Founder focused on developer productivity. Ex-design lead, now building tools.', tags: ['Founder', 'Dev Tools', 'Product'] },
  ];
  const [active, setActive] = usePageState(members[0]);
  return (
    <>
      <PageHead title="Networking" sub="Speed networking lives inside your community — here's a preview"/>

      <div className="net-preview-banner">
        <span className="net-preview-ico"><Icon.globe size={20}/></span>
        <div style={{ flex: 1 }}>
          <div className="net-preview-title">This is a preview</div>
          <div className="net-preview-sub">Networking runs through your community. Visit the community to shuffle, connect and message members live.</div>
        </div>
      </div>

      <div className="net-locked">
        <div className="net-feature">
          <div className="net-feature-avatar" style={{ backgroundImage: `url('${active.photo}')` }}><span className="net-online"/></div>
          <div className="net-feature-name">{active.name}</div>
          <div className="net-feature-company">{active.company}</div>
          <div className="net-feature-role">{active.role}</div>
          <div className="net-feature-bio">{active.bio}</div>
          <div className="net-feature-tags">{active.tags.map(t => <span key={t} className="net-tag-chip">{t}</span>)}</div>
          <div className="net-feature-actions">
            <button className="net-btn primary"><Icon.door size={15}/> Visit community to network</button>
          </div>
        </div>

        <div className="net-online-head">
          <span className="net-online-title"><Icon.users size={17}/> Online Now</span>
          <span className="net-online-count">{members.length} members</span>
        </div>
        <div className="net-grid">
          {members.map(m => (
            <div key={m.name} className={`net-card ${active.name === m.name ? 'sel' : ''}`} onClick={() => setActive(m)}>
              <span className="net-card-avatar" style={{ backgroundImage: `url('${m.photo}')` }}><span className="net-online sm"/></span>
              <div className="net-card-info">
                <div className="net-card-name">{m.name}</div>
                <div className="net-card-company">{m.company}</div>
                <div className="net-card-role">{m.role}</div>
                <div className="net-card-loc"><Icon.globe size={11}/> {m.loc}</div>
              </div>
              <span className={`net-score ${parseFloat(m.score) >= 9 ? 'hi' : ''}`}>{m.score}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function SpacesPage({ onEnter }) {
  const spaces = P().spaces;
  const [scope, setScope] = usePageState('last');
  const [menuFor, setMenuFor] = usePageState(null);
  const teams = Array.from(new Set(spaces.map(s => s.team))).filter(Boolean);
  const filtered = scope === 'last' ? spaces
    : scope.startsWith('team:') ? spaces.filter(s => s.team === scope.slice(5))
    : spaces;
  return (
    <>
      <PageHead title="My Spaces" sub="Jump into any of your live or persistent spaces"
        action={<button className="plat-cta"><Icon.plus size={16}/> New space</button>}/>
      <div className="spaces-layout">
        <aside className="spaces-side">
          <button className={`spaces-side-item ${scope === 'last' ? 'active' : ''}`} onClick={() => setScope('last')}>
            <Icon.clock size={16}/> Last visited
          </button>
          <button className={`spaces-side-item ${scope === 'demo' ? 'active' : ''}`} onClick={() => setScope('demo')}>
            <Icon.star size={16}/> Live Demo
          </button>
          <div className="spaces-side-label">Your teams</div>
          {teams.map(t => (
            <button key={t} className={`spaces-side-item ${scope === `team:${t}` ? 'active' : ''}`} onClick={() => setScope(`team:${t}`)}>
              <span className="spaces-side-team">{(t.match(/\b\w/g) || []).slice(0, 1).join('').toUpperCase()}</span> {t}
            </button>
          ))}
          <button className="spaces-side-item"><Icon.plus size={16}/> New team</button>
        </aside>
        <div className="spaces-main">
          <div className="spaces-main-title">
            {scope === 'last' ? 'Last visited' : scope === 'demo' ? 'Live Demo' : scope.slice(5)}
          </div>
          <div className="spaces-list">
            {filtered.map(s => (
              <div key={s.id} className="spaces-row" onClick={() => onEnter(s)}>
                <span className="spaces-row-avatar" style={{ background: 'var(--bg-elevated)', color: 'var(--text)' }}>{s.initials}</span>
                <div className="spaces-row-info">
                  <div className="spaces-row-name">
                    {s.name}
                    {s.live > 0 && <span className="spaces-row-live">{s.live} live</span>}
                  </div>
                  <div className="spaces-row-sub">{s.team !== 'Demo' ? `In ${s.team} · ` : ''}{s.visited}</div>
                </div>
                <div className="spaces-row-menu-wrap" onClick={(e) => e.stopPropagation()}>
                  <button className="spaces-row-menu" onClick={() => setMenuFor(menuFor === s.id ? null : s.id)}>···</button>
                  {menuFor === s.id && (
                    <>
                      <div className="plat-filter-backdrop" onClick={() => setMenuFor(null)}/>
                      <div className="plat-filter-menu" style={{ right: 0, left: 'auto', minWidth: 160 }}>
                        <button className="plat-filter-opt" onClick={() => { setMenuFor(null); onEnter(s); }}><Icon.door size={14}/> Enter</button>
                        <button className="plat-filter-opt"><Icon.pencil size={14}/> Rename</button>
                        <button className="plat-filter-opt"><Icon.share size={14}/> Share link</button>
                        <button className="plat-filter-opt" style={{ color: 'var(--brand-red)' }}><Icon.close size={14}/> Remove</button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function ComingSoon({ title, sub, icon, text }) {
  const Ic = icon || Icon.globe;
  return (
    <>
      <PageHead title={title} sub={sub}/>
      <div className="plat-empty">
        <div className="plat-empty-ico"><Ic size={28}/></div>
        <div className="plat-empty-title">{title} is coming together</div>
        <div className="plat-empty-text">{text}</div>
        <button className="plat-cta" style={{ margin: '0 auto' }}><Icon.plus size={16}/> Get started</button>
      </div>
    </>
  );
}

Object.assign(window, {
  PlatformPages: {
    AnalyticsView, EventsPage, PeoplePage, RegistrationPage, EngagementPage,
    RecordingsPage, RevenuePage, CommunityPage, BillingPage, SettingsPage,
    NetworkingPage, AIAgentPage, SpacesPage, ComingSoon,
  },
});
