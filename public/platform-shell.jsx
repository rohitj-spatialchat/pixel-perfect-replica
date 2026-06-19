/* global React, Icon, PlatformPages, PLATFORM, CreateEventModal, CreateEventIntro, ChangePlanModal, SpacePickerModal, IntegrationsPage */
// Event Platform — shell (sidebar + header), Home dashboard, page router

const { useState: useShellState, useRef: useShellRef, useEffect: useShellFx } = React;

const NAV = [
  { id: 'home', label: 'Home', icon: Icon.home },
  { id: 'spaces', label: 'My Spaces', icon: Icon.grid },
  { id: 'events', label: 'Events', icon: Icon.calendar },
  { id: 'registration', label: 'Registration', icon: Icon.doc },
  { id: 'people', label: 'People', icon: Icon.users },
  { id: 'engagement', label: 'Engagement', icon: Icon.chat },
  { id: 'analytics', label: 'Analytics', icon: Icon.chart },
  { id: 'revenue', label: 'Revenue', icon: Icon.receipt },
  { id: 'recordings', label: 'Recordings', icon: Icon.video },
  { id: 'networking', label: 'Networking', icon: Icon.share },
  { id: 'community', label: 'Community', icon: Icon.globe },
  { id: 'ai', label: 'SpatialChat AI', icon: Icon.megaphone },
  { id: 'integrations', label: 'Integrations', icon: Icon.code },
  { sep: true },
  { id: 'billing', label: 'Billing', icon: Icon.receipt },
  { id: 'settings', label: 'Settings', icon: Icon.settings },
  { id: 'support', label: 'Support', icon: Icon.help },
];

// ---- charts ----
function AreaChart({ data, fmt }) {
  const W = 640, H = 240, padX = 8, padTop = 18, padB = 28;
  const innerW = W - padX * 2, innerH = H - padTop - padB;
  const max = Math.max(...data.map(d => d.v)) * 1.15 || 1;
  const stepX = innerW / (data.length - 1);
  const x = i => padX + i * stepX;
  const y = v => padTop + innerH - (v / max) * innerH;
  let line = `M ${x(0)} ${y(data[0].v)}`;
  for (let i = 1; i < data.length; i++) {
    const xc = (x(i - 1) + x(i)) / 2, yc = (y(data[i - 1].v) + y(data[i].v)) / 2;
    line += ` Q ${x(i - 1)} ${y(data[i - 1].v)} ${xc} ${yc}`;
  }
  line += ` T ${x(data.length - 1)} ${y(data[data.length - 1].v)}`;
  const area = `${line} L ${x(data.length - 1)} ${padTop + innerH} L ${x(0)} ${padTop + innerH} Z`;
  const ticks = [0, max / 2, max];
  return (
    <svg className="plat-area" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="platArea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-indigo)" stopOpacity="0.26"/>
          <stop offset="100%" stopColor="var(--brand-indigo)" stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padX} x2={W - padX} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke"/>
          <text className="plat-axis" x={padX} y={y(t) - 3}>{fmt ? fmt(t) : Math.round(t)}</text>
        </g>
      ))}
      <path d={area} fill="url(#platArea)"/>
      <path d={line} fill="none" stroke="var(--brand-indigo)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
      {data.map((d, i) => <text key={i} className="plat-axis" x={x(i)} y={H - 8} textAnchor="middle">{d.m}</text>)}
    </svg>
  );
}

function Donut({ segments }) {
  const r = 60, cx = 84, cy = 84, sw = 22;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg className="plat-donut" viewBox="0 0 168 168">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={sw}/>
      {segments.map((s, i) => {
        const len = (s.pct / 100) * circ;
        const seg = <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={s.color} strokeWidth={sw}
          strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-offset} transform={`rotate(-90 ${cx} ${cy})`}/>;
        offset += len;
        return seg;
      })}
    </svg>
  );
}

// Combo chart — daily new registrations (bars) + cumulative total (line)
function ComboChart({ data }) {
  const W = 660, H = 250, padX = 36, padTop = 16, padB = 34;
  const innerW = W - padX * 2, innerH = H - padTop - padB;
  const maxN = Math.max(...data.map(d => d.n)) * 1.2 || 1;
  let cum = 0; const cumData = data.map(d => (cum += d.n));
  const maxC = cum * 1.05 || 1;
  const bw = innerW / data.length;
  const xC = i => padX + bw * i + bw / 2;
  const yN = v => padTop + innerH - (v / maxN) * innerH;
  const yC = v => padTop + innerH - (v / maxC) * innerH;
  let line = `M ${xC(0)} ${yC(cumData[0])}`;
  for (let i = 1; i < cumData.length; i++) {
    const xc = (xC(i - 1) + xC(i)) / 2;
    line += ` Q ${xC(i - 1)} ${yC(cumData[i - 1])} ${xc} ${(yC(cumData[i - 1]) + yC(cumData[i])) / 2}`;
  }
  line += ` T ${xC(data.length - 1)} ${yC(cumData[data.length - 1])}`;
  const ticks = [0, maxN / 2, maxN];
  return (
    <svg className="plat-area" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: 250 }}>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padX} x2={W - padX} y1={yN(t)} y2={yN(t)} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke"/>
          <text className="plat-axis" x={padX - 6} y={yN(t) + 3} textAnchor="end">{Math.round(t)}</text>
        </g>
      ))}
      {data.map((d, i) => {
        const bh = (d.n / maxN) * innerH;
        return <rect key={i} x={xC(i) - bw * 0.3} y={padTop + innerH - bh} width={bw * 0.6} height={bh} rx="3" fill="#9DC9C2"/>;
      })}
      <path d={line} fill="none" stroke="var(--brand-indigo)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
      {cumData.map((v, i) => <circle key={i} cx={xC(i)} cy={yC(v)} r="3" fill="var(--brand-indigo)"/>)}
      {data.map((d, i) => (i % 2 === 0) && <text key={i} className="plat-axis" x={xC(i)} y={H - 10} textAnchor="middle">{d.d}</text>)}
    </svg>
  );
}

// Simple smooth line chart
function LineChart({ data, valKey, labelKey }) {
  const W = 560, H = 250, padX = 30, padTop = 16, padB = 34;
  const innerW = W - padX * 2, innerH = H - padTop - padB;
  const max = Math.max(...data.map(d => d[valKey])) * 1.2 || 1;
  const stepX = innerW / (data.length - 1);
  const x = i => padX + i * stepX;
  const y = v => padTop + innerH - (v / max) * innerH;
  let line = `M ${x(0)} ${y(data[0][valKey])}`;
  for (let i = 1; i < data.length; i++) {
    const xc = (x(i - 1) + x(i)) / 2;
    line += ` Q ${x(i - 1)} ${y(data[i - 1][valKey])} ${xc} ${(y(data[i - 1][valKey]) + y(data[i][valKey])) / 2}`;
  }
  line += ` T ${x(data.length - 1)} ${y(data[data.length - 1][valKey])}`;
  const area = `${line} L ${x(data.length - 1)} ${padTop + innerH} L ${x(0)} ${padTop + innerH} Z`;
  const ticks = [0, max / 2, max];
  return (
    <svg className="plat-area" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ height: 250 }}>
      <defs>
        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--brand-indigo)" stopOpacity="0.22"/>
          <stop offset="100%" stopColor="var(--brand-indigo)" stopOpacity="0.01"/>
        </linearGradient>
      </defs>
      {ticks.map((t, i) => (
        <g key={i}>
          <line x1={padX} x2={W - padX} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke"/>
          <text className="plat-axis" x={padX - 6} y={y(t) + 3} textAnchor="end">{Math.round(t)}</text>
        </g>
      ))}
      <path d={area} fill="url(#lineFill)"/>
      <path d={line} fill="none" stroke="var(--brand-indigo)" strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
      {data.map((d, i) => <text key={i} className="plat-axis" x={x(i)} y={H - 10} textAnchor="middle">{d[labelKey]}</text>)}
    </svg>
  );
}

// Donut with centered total + amount legend list (Zuddl revenue style)
function DonutLegend({ segments, center, valueKey }) {
  return (
    <div className="plat-donut-legend">
      <div className="plat-donut-c">
        <Donut segments={segments}/>
        <div className="plat-donut-center">{center}</div>
      </div>
      <div className="plat-legend2">
        {segments.map(s => (
          <div key={s.name} className="plat-legend2-row">
            <span className="plat-legend-dot" style={{ background: s.color }}/>
            <span className="plat-legend2-name">{s.name}</span>
            <span className="plat-legend2-val">{s[valueKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function HomePage({ onEnterRoom, onNav, onCreateEvent }) {
  const h = PLATFORM.home;
  const STORAGE_KEY = 'sc-home-widgets-v1';

  const WIDGET_CATALOG = {
    'reg-timeline': {
      label: 'Registrations timeline',
      desc: 'Daily new vs cumulative total',
      defaultTitle: 'Registrations timeline',
      defaultSub: 'New (bars) vs. cumulative total (line)',
      span: 1,
      group: 'charts',
    },
    'weekly-reg': {
      label: 'Weekly registrations',
      desc: 'New registrations per week',
      defaultTitle: 'Weekly registrations',
      defaultSub: 'New registrations per week',
      span: 1,
      group: 'charts',
    },
    'stat-trio': {
      label: 'Registration summary',
      desc: 'Registrants, first-time & returning',
      defaultTitle: 'Registration summary',
      defaultSub: 'Headline registration counts',
      span: 2,
      group: 'metrics',
    },
    'revenue-ticket': {
      label: 'Revenue by ticket',
      desc: 'Breakdown across ticket tiers',
      defaultTitle: 'Revenue by ticket',
      defaultSub: 'Across all ticket tiers',
      span: 1,
      group: 'charts',
    },
    'reg-ticket': {
      label: 'Registrations by ticket',
      desc: 'Distribution by ticket type',
      defaultTitle: 'Registrations by ticket',
      defaultSub: `Distribution of ${h.regTotal} registrations`,
      span: 1,
      group: 'charts',
    },
    'event-performance': {
      label: 'Event performance',
      desc: 'Exploration rate by event',
      defaultTitle: 'Event Performance',
      defaultSub: 'Exploration rate by event',
      span: 1,
      group: 'lists',
    },
    'recent-activity': {
      label: 'Recent activity',
      desc: 'Highlights from your events',
      defaultTitle: 'Recent Activity',
      defaultSub: 'Highlights from your events',
      span: 1,
      group: 'lists',
    },
  };

  const DEFAULT_LAYOUT = [
    { id: 'reg-timeline', visible: true, span: 1 },
    { id: 'weekly-reg', visible: true, span: 1 },
    { id: 'stat-trio', visible: true, span: 2 },
    { id: 'revenue-ticket', visible: true, span: 1 },
    { id: 'reg-ticket', visible: true, span: 1 },
    { id: 'event-performance', visible: true, span: 1 },
    { id: 'recent-activity', visible: true, span: 1 },
  ];

  const loadLayout = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_LAYOUT;
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return DEFAULT_LAYOUT;
      const known = new Set(Object.keys(WIDGET_CATALOG));
      const cleaned = parsed.filter(w => known.has(w.id)).map(w => ({
        id: w.id,
        visible: w.visible !== false,
        span: w.span === 2 ? 2 : 1,
        title: w.title || '',
        sub: w.sub || '',
      }));
      DEFAULT_LAYOUT.forEach(def => {
        if (!cleaned.some(w => w.id === def.id)) cleaned.push({ ...def });
      });
      return cleaned;
    } catch { return DEFAULT_LAYOUT; }
  };

  const [layout, setLayout] = useShellState(loadLayout);
  const [editing, setEditing] = useShellState(false);
  const [addOpen, setAddOpen] = useShellState(false);
  const [settingsId, setSettingsId] = useShellState(null);

  const persist = (next) => {
    setLayout(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const visibleWidgets = layout.filter(w => w.visible);
  const hiddenWidgets = layout.filter(w => !w.visible);

  const meta = (id) => WIDGET_CATALOG[id] || {};
  const titleOf = (w) => w.title || meta(w.id).defaultTitle || w.id;
  const subOf = (w) => w.sub || meta(w.id).defaultSub || '';

  const updateWidget = (id, patch) => persist(layout.map(w => w.id === id ? { ...w, ...patch } : w));
  const removeWidget = (id) => updateWidget(id, { visible: false });
  const addWidget = (id) => updateWidget(id, { visible: true });
  const moveWidget = (id, dir) => {
    const vis = layout.filter(w => w.visible);
    const idx = vis.findIndex(w => w.id === id);
    if (idx < 0) return;
    const swap = dir === 'up' ? idx - 1 : idx + 1;
    if (swap < 0 || swap >= vis.length) return;
    const order = vis.map(w => w.id);
    [order[idx], order[swap]] = [order[swap], order[idx]];
    const hidden = layout.filter(w => !w.visible);
    const reordered = order.map(oid => layout.find(w => w.id === oid)).concat(hidden);
    persist(reordered);
  };

  const resetLayout = () => {
    localStorage.removeItem(STORAGE_KEY);
    setLayout(DEFAULT_LAYOUT.map(w => ({ ...w })));
    setSettingsId(null);
    setAddOpen(false);
  };

  const renderWidgetBody = (w) => {
    switch (w.id) {
      case 'reg-timeline':
        return (
          <>
            <div className="plat-card-head">
              <div>
                <div className="plat-card-title">{titleOf(w)}</div>
                <div className="plat-card-sub">{subOf(w)}</div>
              </div>
              {!editing && <span className="plat-card-link" onClick={() => onNav('analytics')}>View Details <Icon.expand size={12}/></span>}
            </div>
            <ComboChart data={h.regTimeline}/>
          </>
        );
      case 'weekly-reg':
        return (
          <>
            <div className="plat-card-head">
              <div>
                <div className="plat-card-title">{titleOf(w)}</div>
                <div className="plat-card-sub">{subOf(w)}</div>
              </div>
            </div>
            <LineChart data={h.weeklyReg} valKey="v" labelKey="w"/>
          </>
        );
      case 'stat-trio':
        return (
          <div className="home-stat-trio-inner">
            {(editing || !w.title) && (
              <div className="home-widget-section-label">
                <div className="plat-card-title">{titleOf(w)}</div>
                {subOf(w) && <div className="plat-card-sub">{subOf(w)}</div>}
              </div>
            )}
            <div className="plat-trio" style={{ marginBottom: 0 }}>
              {h.statTrio.map(s => (
                <div key={s.label} className="plat-stat-big">
                  <div className="plat-stat-big-label">{s.label}</div>
                  <div className="plat-stat-big-val">{s.value.toLocaleString()}</div>
                  <div className="plat-stat-big-sub">{s.sub}</div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'revenue-ticket':
        return (
          <>
            <div className="plat-card-head">
              <div>
                <div className="plat-card-title">{titleOf(w)}</div>
                <div className="plat-card-sub">{subOf(w)}</div>
              </div>
              {!editing && <span className="plat-card-link" onClick={() => onNav('revenue')}>Revenue <Icon.expand size={12}/></span>}
            </div>
            <DonutLegend segments={h.revenueByTicket} center={h.revenueTotal} valueKey="amt"/>
          </>
        );
      case 'reg-ticket':
        return (
          <>
            <div className="plat-card-head">
              <div>
                <div className="plat-card-title">{titleOf(w)}</div>
                <div className="plat-card-sub">{subOf(w)}</div>
              </div>
            </div>
            <DonutLegend segments={h.regByTicket} center={h.regTotal} valueKey="cnt"/>
          </>
        );
      case 'event-performance':
        return (
          <>
            <div className="plat-card-head" style={{ marginBottom: 2 }}>
              <div>
                <div className="plat-card-title">{titleOf(w)}</div>
                <div className="plat-card-sub">{subOf(w)}</div>
              </div>
              {!editing && <span className="plat-card-link" onClick={() => onNav('analytics')}>All Analytics <Icon.expand size={12}/></span>}
            </div>
            {h.performance.map(p => (
              <div key={p.name} className="plat-perf-row">
                <span className="plat-perf-name">{p.name}</span>
                <span className="plat-perf-track"><span className="plat-perf-fill" style={{ width: `${p.pct}%` }}/></span>
                <span className="plat-perf-pct">{p.pct}%</span>
              </div>
            ))}
          </>
        );
      case 'recent-activity':
        return (
          <>
            <div className="plat-card-title" style={{ marginBottom: 2 }}>{titleOf(w)}</div>
            <div className="plat-card-sub" style={{ marginBottom: 6 }}>{subOf(w)}</div>
            {h.activity.map((a, i) => (
              <div key={i} className="plat-act-row">
                <span className="plat-act-dot" style={{ background: a.tint }}/>
                <span className="plat-act-text"><b>{a.who}</b> {a.act}</span>
                <span className="plat-act-when">{a.when}</span>
              </div>
            ))}
          </>
        );
      default: return null;
    }
  };

  const settingsWidget = settingsId ? layout.find(w => w.id === settingsId) : null;

  return (
    <>
      <div className="plat-page-head">
        <div>
          <h1 className="plat-page-title">Welcome back, Arty</h1>
          <div className="plat-page-sub">Twilight City · 2 events · updated 4 minutes ago</div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {editing ? (
            <>
              <button className="home-dash-btn" onClick={() => setAddOpen(o => !o)}><Icon.plus size={14}/> Add widget</button>
              <button className="home-dash-btn" onClick={resetLayout}>Reset</button>
              <button className="plat-cta" onClick={() => { setEditing(false); setAddOpen(false); setSettingsId(null); }}>Done</button>
            </>
          ) : (
            <>
              <button className="home-dash-btn" onClick={() => setEditing(true)}><Icon.pencil size={14}/> Customize dashboard</button>
              <button className="plat-cta" onClick={onCreateEvent}><Icon.plus size={16}/> Create Event</button>
            </>
          )}
        </div>
      </div>

      {editing && (
        <div className="home-edit-banner">
          <Icon.settings size={15}/>
          <span>Drag-free customize: reorder widgets, change size, edit titles, or hide widgets. Layout saves automatically.</span>
        </div>
      )}

      {editing && addOpen && (
        <div className="home-add-panel">
          <div className="home-add-head">
            <span>Add widgets to your dashboard</span>
            <button className="home-add-close" onClick={() => setAddOpen(false)}><Icon.close size={14}/></button>
          </div>
          <div className="home-add-grid">
            {hiddenWidgets.length === 0 && <div className="home-add-empty">All widgets are already on your dashboard.</div>}
            {hiddenWidgets.map(w => {
              const m = meta(w.id);
              return (
                <button key={w.id} className="home-add-item" onClick={() => addWidget(w.id)}>
                  <span className="home-add-item-name">{m.label}</span>
                  <span className="home-add-item-desc">{m.desc}</span>
                  <span className="home-add-item-action"><Icon.plus size={14}/> Add</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="plat-banner">
        <span className="plat-banner-emoji">🚀</span>
        <div className="plat-banner-text">
          <div className="plat-banner-title">Launch Your Live Space</div>
          <div className="plat-banner-sub">Start hosting immersive virtual events</div>
        </div>
        <button className="plat-banner-btn" onClick={onEnterRoom}>Go to My Space <Icon.caretRight size={14}/></button>
      </div>

      <div className={`home-widgets ${editing ? 'editing' : ''}`}>
        {visibleWidgets.map((w, i) => (
          <div
            key={w.id}
            className={`home-widget ${w.span === 2 ? 'span-2' : 'span-1'} ${w.id === 'stat-trio' ? 'is-trio' : ''}`}
            data-widget={w.id}
          >
            {editing && (
              <div className="home-widget-toolbar">
                <span className="home-widget-drag-label"><Icon.grid size={13}/> {meta(w.id).label}</span>
                <div className="home-widget-actions">
                  <button title="Move up" disabled={i === 0} onClick={() => moveWidget(w.id, 'up')}><Icon.caretDown size={14} style={{ transform: 'rotate(180deg)' }}/></button>
                  <button title="Move down" disabled={i === visibleWidgets.length - 1} onClick={() => moveWidget(w.id, 'down')}><Icon.caretDown size={14}/></button>
                  <button title="Widget settings" className={settingsId === w.id ? 'active' : ''} onClick={() => setSettingsId(settingsId === w.id ? null : w.id)}><Icon.settings size={14}/></button>
                  <button title="Remove widget" onClick={() => removeWidget(w.id)}><Icon.close size={14}/></button>
                </div>
              </div>
            )}
            {editing && settingsId === w.id && (
              <div className="home-widget-settings">
                <label>
                  <span>Title</span>
                  <input value={w.title ?? ''} placeholder={meta(w.id).defaultTitle}
                    onChange={e => updateWidget(w.id, { title: e.target.value })}/>
                </label>
                <label>
                  <span>Subtitle</span>
                  <input value={w.sub ?? ''} placeholder={meta(w.id).defaultSub}
                    onChange={e => updateWidget(w.id, { sub: e.target.value })}/>
                </label>
                {w.id !== 'stat-trio' && (
                  <label>
                    <span>Width</span>
                    <div className="home-width-pills">
                      <button className={w.span === 1 ? 'active' : ''} onClick={() => updateWidget(w.id, { span: 1 })}>Half</button>
                      <button className={w.span === 2 ? 'active' : ''} onClick={() => updateWidget(w.id, { span: 2 })}>Full</button>
                    </div>
                  </label>
                )}
              </div>
            )}
            <div className={`plat-card home-widget-card ${w.id === 'stat-trio' ? 'home-trio-card' : ''}`}>
              {renderWidgetBody(w)}
            </div>
          </div>
        ))}
      </div>

      {editing && visibleWidgets.length === 0 && (
        <div className="home-empty-dash">
          <div className="plat-empty-ico"><Icon.chart size={24}/></div>
          <div className="plat-empty-title">No widgets on your dashboard</div>
          <div className="plat-empty-text">Add analytics widgets to build a view that works for your team.</div>
          <button className="plat-cta" onClick={() => setAddOpen(true)}><Icon.plus size={14}/> Add widget</button>
        </div>
      )}
    </>
  );
}

function Kpi({ label, value, trend, icon, tint }) {
  const Ic = icon;
  return (
    <div className="plat-kpi">
      <div className="plat-kpi-top">
        <span className="plat-kpi-label">{label}</span>
        <span className="plat-kpi-ico" style={{ background: `${tint}1A`, color: tint }}><Ic size={16}/></span>
      </div>
      <div className="plat-kpi-value">{value}</div>
      <div className="plat-kpi-trend"><Icon.chart size={13}/> <span className="lbl">{trend}</span></div>
    </div>
  );
}
function Mini({ icon, value, label }) {
  const Ic = icon;
  return (
    <div className="plat-mini-tile">
      <span className="plat-mini-ico"><Ic size={17}/></span>
      <span className="plat-mini-val">{value}</span>
      <span className="plat-mini-label">{label}</span>
    </div>
  );
}

function PlatformDashboard({ onEnterRoom, theme, onToggleTheme }) {
  const [page, setPage] = useShellState('home');
  const [collapsed, setCollapsed] = useShellState(false);
  const [userOpen, setUserOpen] = useShellState(false);
  const [analyticsEvent, setAnalyticsEvent] = useShellState(null);
  const [createStage, setCreateStage] = useShellState('type');
  const [createType, setCreateType] = useShellState('webinar');
  const [modal, setModal] = useShellState(null); // 'create' | 'plan'
  const [toast, setToast] = useShellState(null);
  const mainRef = useShellRef(null);
  const userRef = useShellRef(null);
  const toastTimer = useShellRef(null);
  const PP = PlatformPages;

  useShellFx(() => { if (mainRef.current) mainRef.current.scrollTop = 0; }, [page]);
  useShellFx(() => {
    if (!userOpen) return;
    const onDown = e => { if (!userRef.current?.contains(e.target)) setUserOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [userOpen]);

  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  };
  const openCreate = () => { setCreateStage('type'); go('registration'); };
  const openPlan = () => setModal('plan');
  const openSpacePicker = () => setModal('space');
  const pickSpace = (space) => { setModal(null); onEnterRoom(space); };

  const go = (id) => { setPage(id); setAnalyticsEvent(null); };
  const openAnalytics = (evId) => { setPage('analytics'); setAnalyticsEvent(evId); };

  let content;
  switch (page) {
    case 'home': content = <HomePage onEnterRoom={openSpacePicker} onNav={go} onCreateEvent={openCreate}/>; break;
    case 'spaces': content = <PP.SpacesPage onEnter={pickSpace}/>; break;
    case 'events': content = <PP.EventsPage onOpenAnalytics={openAnalytics} onCreateEvent={openCreate}/>; break;
    case 'registration': content = createStage === 'build'
      ? <CreateEventModal inline onClose={() => go('home')} onToast={showToast} eventType={createType}/>
      : <CreateEventIntro stage={createStage} setStage={setCreateStage} type={createType} setType={setCreateType} onCancel={() => go('home')} onToast={showToast}/>;
      break;
    case 'people': content = <PP.PeoplePage/>; break;
    case 'engagement': content = <PP.EngagementPage/>; break;
    case 'analytics': content = <PP.AnalyticsView key={analyticsEvent || 'list'} initialEvent={analyticsEvent} onEnterRoom={openSpacePicker}/>; break;
    case 'revenue': content = <PP.RevenuePage/>; break;
    case 'recordings': content = <PP.RecordingsPage/>; break;
    case 'networking': content = <PP.NetworkingPage/>; break;
    case 'community': content = <PP.CommunityPage/>; break;
    case 'billing': content = <PP.BillingPage onChangePlan={openPlan}/>; break;
    case 'settings': content = <PP.SettingsPage/>; break;
    case 'ai': content = <PP.AIAgentPage onToast={showToast}/>; break;
    case 'integrations': content = <IntegrationsPage/>; break;
    case 'support': content = <PP.ComingSoon title="Support" sub="We're here to help" icon={Icon.help} text="Browse the help center, watch product tours, or reach our team directly."/>; break;
    default: content = <HomePage onEnterRoom={openSpacePicker} onNav={go} onCreateEvent={openCreate}/>;
  }

  return (
    <div className={`plat ${collapsed ? 'collapsed' : ''}`} data-screen-label={`Platform – ${page}`}>
      <aside className="plat-side">
        <div className="plat-logo">
          <span className="plat-logo-mark"><img src="assets/spatialchat-logo.png" alt=""/></span>
          <img className="plat-logo-word" src="assets/spatialchat-wordmark.png" alt="SpatialChat"/>
          <button className="plat-collapse-top" onClick={() => setCollapsed(c => !c)} title={collapsed ? 'Expand' : 'Collapse'}>
            <Icon.menu size={17}/>
          </button>
        </div>
        <nav className="plat-nav">
          {NAV.map((item, i) => item.sep
            ? <div key={i} className="plat-nav-sep"/>
            : (
              <button key={item.id} className={`plat-nav-item ${page === item.id ? 'active' : ''}`}
                onClick={() => !item.soon && go(item.id)} title={item.label}>
                <span className="plat-nav-ico"><item.icon size={16}/></span>
                <span className="plat-nav-label">{item.label}</span>
                {item.soon && <span className="plat-nav-soon">SOON</span>}
              </button>
            ))}
        </nav>
      </aside>

      <div className="plat-main" ref={mainRef}>
        <div className="plat-header">
          <div className="plat-header-right">
            <button className="plat-hbtn" onClick={onToggleTheme} title="Toggle theme">
              {theme === 'light' ? <Icon.moon size={15}/> : <Icon.sun size={15}/>}
            </button>
            <div style={{ position: 'relative' }} ref={userRef}>
              <button className="plat-user" onClick={() => setUserOpen(o => !o)}>
                <span className="plat-user-avatar">{PLATFORM.user.initials}</span>
                <span className="plat-user-name">{PLATFORM.user.name}</span>
                <Icon.caretDown size={13}/>
              </button>
              {userOpen && (
                <div className="dropdown" style={{ top: 'calc(100% + 6px)', right: 0 }}>
                  <div className="dropdown-header">
                    <div className="dropdown-name">{PLATFORM.user.name}</div>
                    <div className="dropdown-role">{PLATFORM.user.email}</div>
                  </div>
                  <button className="dropdown-item" onClick={() => { setUserOpen(false); go('settings'); }}><Icon.settings size={14}/> Settings</button>
                  <button className="dropdown-item" onClick={() => { setUserOpen(false); openSpacePicker(); }}><Icon.door size={14}/> Go to My Space</button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="plat-body">{content}</div>
      </div>

      {modal === 'plan' && <ChangePlanModal onClose={() => setModal(null)} onToast={showToast}/>}
      {modal === 'space' && <SpacePickerModal onClose={() => setModal(null)} onPick={pickSpace}/>}
      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

Object.assign(window, { PlatformDashboard });
