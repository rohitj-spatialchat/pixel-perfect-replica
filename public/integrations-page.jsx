/* global React, Icon */
// Integrations marketplace — Goldcast / Zuddl style, in SpatialChat theme.
// Brand-colored letter marks (no external logos), categories, search, connect state.

const { useState: useIntState, useMemo: useIntMemo } = React;

// mark: short text shown in the colored tile; bg: brand color
const INTEGRATIONS = [
  // CRM
  { id: 'salesforce', name: 'Salesforce', cat: 'CRM', mark: 'sf', bg: '#00A1E0', desc: 'Sync registrants, attendance and engagement to leads & campaigns.', popular: true, connected: true },
  { id: 'hubspot', name: 'HubSpot', cat: 'CRM', mark: 'H', bg: '#FF7A59', desc: 'Push attendees into workflows and score them on event activity.', popular: true, connected: true },
  { id: 'pipedrive', name: 'Pipedrive', cat: 'CRM', mark: 'P', bg: '#1A1A1A', desc: 'Create deals from registrations and track event-sourced pipeline.' },
  { id: 'dynamics', name: 'MS Dynamics', cat: 'CRM', mark: 'D', bg: '#002050', desc: 'Two-way contact sync with Microsoft Dynamics 365.' },

  // Marketing automation
  { id: 'marketo', name: 'Marketo', cat: 'Marketing', mark: 'M', bg: '#5C4C9F', desc: 'Send attendance & engagement as activities into Marketo programs.', popular: true },
  { id: 'pardot', name: 'Pardot', cat: 'Marketing', mark: 'pd', bg: '#0085CA', desc: 'Map event signals to Account Engagement scoring.' },
  { id: 'mailchimp', name: 'Mailchimp', cat: 'Marketing', mark: 'mc', bg: '#FFE01B', fg: '#1A1A1A', desc: 'Add registrants to audiences and trigger follow-up journeys.' },
  { id: 'activecampaign', name: 'ActiveCampaign', cat: 'Marketing', mark: 'AC', bg: '#356AE6', desc: 'Automate post-event nurture based on session attendance.' },

  // Video & webinar
  { id: 'zoom', name: 'Zoom', cat: 'Video', mark: 'Z', bg: '#2D8CFF', desc: 'Import Zoom webinar registrants and stream into the stage.', popular: true },
  { id: 'youtube', name: 'YouTube', cat: 'Video', mark: '▶', bg: '#FF0000', desc: 'Auto-publish recordings and Shorts to your channel.' },
  { id: 'vimeo', name: 'Vimeo', cat: 'Video', mark: 'V', bg: '#1AB7EA', desc: 'Host and embed session replays from your Vimeo library.' },
  { id: 'wistia', name: 'Wistia', cat: 'Video', mark: 'W', bg: '#54BBFF', desc: 'Send recordings to Wistia with engagement tracking.' },

  // Engagement
  { id: 'slido', name: 'Slido', cat: 'Engagement', mark: 'sli', bg: '#3B5AFE', desc: 'Run live polls and Q&A and sync results to your reports.', popular: true },
  { id: 'kahoot', name: 'Kahoot!', cat: 'Engagement', mark: 'K', bg: '#46178F', desc: 'Embed interactive quizzes directly on the stage.' },
  { id: 'mentimeter', name: 'Mentimeter', cat: 'Engagement', mark: 'Me', bg: '#1A1A2E', desc: 'Add word clouds and live voting to any session.' },
  { id: 'mindmeister', name: 'MindMeister', cat: 'Engagement', mark: 'mm', bg: '#00B4A0', desc: 'Collaborative mind-mapping in breakout rooms.' },

  // Productivity
  { id: 'slack', name: 'Slack', cat: 'Productivity', mark: '#', bg: '#4A154B', desc: 'Post event alerts, registrations and recordings to channels.', popular: true, connected: true },
  { id: 'gcal', name: 'Google Calendar', cat: 'Productivity', mark: '31', bg: '#4285F4', desc: 'Add events to attendee calendars with one click.' },
  { id: 'outlook', name: 'Outlook', cat: 'Productivity', mark: 'O', bg: '#0078D4', desc: 'Calendar invites and reminders for Microsoft 365 users.' },
  { id: 'notion', name: 'Notion', cat: 'Productivity', mark: 'N', bg: '#1A1A1A', desc: 'Sync agendas and speaker notes into your Notion workspace.' },

  // Analytics & data
  { id: 'ga', name: 'Google Analytics', cat: 'Analytics', mark: 'GA', bg: '#E8710A', desc: 'Track registration funnels and landing-page conversion.' },
  { id: 'segment', name: 'Segment', cat: 'Analytics', mark: 'Se', bg: '#52BD94', desc: 'Stream event data to every tool in your CDP.' },
  { id: 'mixpanel', name: 'Mixpanel', cat: 'Analytics', mark: 'mp', bg: '#7856FF', desc: 'Analyze attendee behavior and cohort retention.' },
  { id: 'snowflake', name: 'Snowflake', cat: 'Analytics', mark: '❄', bg: '#29B5E8', desc: 'Pipe raw event data into your warehouse for BI.' },
  { id: '6sense', name: '6sense', cat: 'Analytics', mark: '6', bg: '#00C2CB', desc: 'Enrich attendees with intent and account data.', popular: true },

  // Automation & payments
  { id: 'zapier', name: 'Zapier', cat: 'Automation', mark: 'Zap', bg: '#FF4F00', desc: 'Connect SpatialChat to 6,000+ apps with no code.', popular: true },
  { id: 'make', name: 'Make', cat: 'Automation', mark: 'mk', bg: '#6D00CC', desc: 'Build advanced multi-step event automations.' },
  { id: 'workato', name: 'Workato', cat: 'Automation', mark: 'wk', bg: '#43D1B1', desc: 'Enterprise-grade recipes across your stack.' },
  { id: 'stripe', name: 'Stripe', cat: 'Payments', mark: 'S', bg: '#635BFF', desc: 'Sell paid tickets and reconcile event revenue.', connected: true },
  { id: 'paypal', name: 'PayPal', cat: 'Payments', mark: 'PP', bg: '#003087', desc: 'Accept ticket payments worldwide.' },
];

const CATEGORIES = ['All', 'CRM', 'Marketing', 'Video', 'Engagement', 'Productivity', 'Analytics', 'Automation', 'Payments'];

function IntegrationsPage() {
  const [cat, setCat] = useIntState('All');
  const [q, setQ] = useIntState('');
  const [connected, setConnected] = useIntState(() => {
    const init = {};
    INTEGRATIONS.forEach(i => { if (i.connected) init[i.id] = true; });
    return init;
  });
  const [toast, setToast] = useIntState(null);

  const toggle = (it) => {
    setConnected(c => {
      const next = { ...c, [it.id]: !c[it.id] };
      return next;
    });
    setToast(`${it.name} ${connected[it.id] ? 'disconnected' : 'connected'}`);
    clearTimeout(window.__intToast);
    window.__intToast = setTimeout(() => setToast(null), 1800);
  };

  const connectedCount = Object.values(connected).filter(Boolean).length;

  const filtered = useIntMemo(() => INTEGRATIONS.filter(it => {
    const okCat = cat === 'All' || it.cat === cat;
    const okQ = !q || it.name.toLowerCase().includes(q.toLowerCase()) || it.desc.toLowerCase().includes(q.toLowerCase());
    return okCat && okQ;
  }), [cat, q]);

  const popular = INTEGRATIONS.filter(i => i.popular).slice(0, 4);

  return (
    <>
      <div className="plat-page-head">
        <div>
          <h1 className="plat-page-title">Integrations</h1>
          <div className="plat-page-sub">Connect SpatialChat to the tools your team already runs on</div>
        </div>
        <button className="plat-cta" onClick={() => setToast('Browse the developer API')}>
          <Icon.code size={16}/> Build with API
        </button>
      </div>

      {/* Stat strip */}
      <div className="int-stats">
        <div className="int-stat"><div className="int-stat-val">{connectedCount}</div><div className="int-stat-lbl">Connected</div></div>
        <div className="int-stat"><div className="int-stat-val">{INTEGRATIONS.length}+</div><div className="int-stat-lbl">Available</div></div>
        <div className="int-stat"><div className="int-stat-val">8</div><div className="int-stat-lbl">Categories</div></div>
        <div className="int-stat"><div className="int-stat-val">6,000+</div><div className="int-stat-lbl">Apps via Zapier</div></div>
      </div>

      {/* Featured */}
      {cat === 'All' && !q && (
        <div className="int-featured">
          <div className="int-featured-head">
            <span className="int-section-title">Most popular</span>
          </div>
          <div className="int-featured-grid">
            {popular.map(it => (
              <div key={it.id} className="int-feat-card">
                <span className="int-mark lg" style={{ background: it.bg, color: it.fg || '#fff' }}>{it.mark}</span>
                <div className="int-feat-name">{it.name}</div>
                <div className="int-feat-cat">{it.cat}</div>
                <button
                  className={`int-connect ${connected[it.id] ? 'on' : ''}`}
                  onClick={() => toggle(it)}>
                  {connected[it.id] ? <><Icon.check size={14}/> Connected</> : 'Connect'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="int-toolbar">
        <div className="int-search">
          <span className="int-search-ico"><Icon.search size={16}/></span>
          <input placeholder="Search integrations…" value={q} onChange={e => setQ(e.target.value)}/>
        </div>
      </div>
      <div className="int-cats">
        {CATEGORIES.map(c => (
          <button key={c} className={`int-cat ${cat === c ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
        ))}
      </div>

      {/* Grid */}
      <div className="int-grid">
        {filtered.map(it => (
          <div key={it.id} className="int-card">
            <div className="int-card-top">
              <span className="int-mark" style={{ background: it.bg, color: it.fg || '#fff' }}>{it.mark}</span>
              {connected[it.id] && <span className="int-badge"><span className="int-badge-dot"/> Connected</span>}
            </div>
            <div className="int-card-name">{it.name}</div>
            <div className="int-card-cat">{it.cat}</div>
            <div className="int-card-desc">{it.desc}</div>
            <button
              className={`int-connect ${connected[it.id] ? 'on' : ''}`}
              onClick={() => toggle(it)}>
              {connected[it.id] ? <><Icon.check size={14}/> Connected</> : <><Icon.plus size={14}/> Connect</>}
            </button>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="plat-empty" style={{ marginTop: 8 }}>
          <div className="plat-empty-ico"><Icon.search size={26}/></div>
          <div className="plat-empty-title">No integrations found</div>
          <div className="plat-empty-text">Try a different search or category — or request it from our team.</div>
        </div>
      )}

      {/* Request CTA */}
      <div className="int-request">
        <div className="int-request-ico"><Icon.plus size={20}/></div>
        <div style={{ flex: 1 }}>
          <div className="int-request-title">Don't see what you need?</div>
          <div className="int-request-sub">Tell us which tool to connect next, or build it yourself with our REST API & webhooks.</div>
        </div>
        <button className="plat-cta ghost" onClick={() => setToast('Request sent to our team')}>Request integration</button>
      </div>

      {toast && <div className="toast">{toast}</div>}
    </>
  );
}

Object.assign(window, { IntegrationsPage });
