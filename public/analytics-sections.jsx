/* global React, Icon */
// Event Intelligence — chart primitives + report sections

const { useState: useEidState } = React;

// ---------- Charts ----------
function AreaConcurrency({ data, peak, accent = 'var(--brand-indigo)' }) {
  const W = 640, H = 190, padX = 6, padTop = 18, padB = 26;
  const innerW = W - padX * 2, innerH = H - padTop - padB;
  const max = Math.ceil((peak + 6) / 10) * 10;
  const stepX = innerW / (data.length - 1);
  const x = (i) => padX + i * stepX;
  const y = (v) => padTop + innerH - (v / max) * innerH;

  let line = `M ${x(0)} ${y(data[0].c)}`;
  for (let i = 1; i < data.length; i++) {
    const xc = (x(i - 1) + x(i)) / 2, yc = (y(data[i - 1].c) + y(data[i].c)) / 2;
    line += ` Q ${x(i - 1)} ${y(data[i - 1].c)} ${xc} ${yc}`;
  }
  line += ` T ${x(data.length - 1)} ${y(data[data.length - 1].c)}`;
  const area = `${line} L ${x(data.length - 1)} ${padTop + innerH} L ${x(0)} ${padTop + innerH} Z`;

  const peakIdx = data.reduce((mi, d, i, a) => d.c > a[mi].c ? i : mi, 0);
  const ticks = [0, Math.round(max / 2), max];
  const xLabels = data.filter((_, i) => i % 6 === 0 || i === data.length - 1);

  return (
    <svg className="area-svg" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="concFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.26"/>
          <stop offset="100%" stopColor={accent} stopOpacity="0.02"/>
        </linearGradient>
      </defs>
      {ticks.map(t => (
        <g key={t}>
          <line x1={padX} x2={W - padX} y1={y(t)} y2={y(t)} stroke="var(--border)" strokeWidth="1" strokeDasharray="3 4" vectorEffect="non-scaling-stroke"/>
          <text className="area-axis" x={padX} y={y(t) - 3}>{t}</text>
        </g>
      ))}
      <path d={area} fill="url(#concFill)"/>
      <path d={line} fill="none" stroke={accent} strokeWidth="2.5" vectorEffect="non-scaling-stroke" strokeLinecap="round"/>
      <circle cx={x(peakIdx)} cy={y(data[peakIdx].c)} r="4" fill={accent} stroke="var(--bg-elevated)" strokeWidth="2"/>
      {xLabels.map((d, i) => {
        const idx = data.indexOf(d);
        return <text key={i} className="area-axis" x={x(idx)} y={H - 8} textAnchor="middle">{d.t}</text>;
      })}
    </svg>
  );
}

function DwellBars({ data }) {
  const max = Math.max(...data.map(d => d.count));
  return (
    <div className="eid-bars">
      {data.map((d, i) => (
        <div key={i} className="eid-bar-col">
          <div className="eid-bar" style={{ height: `${Math.max(2, (d.count / max) * 100)}%` }}>
            {d.count > 0 && <span className="eid-bar-count">{d.count}</span>}
          </div>
          <span className="eid-bar-label">{d.range}</span>
        </div>
      ))}
    </div>
  );
}

function PersonaDonut({ personas }) {
  const total = personas.reduce((s, p) => s + p.count, 0);
  const r = 60, cx = 84, cy = 84, sw = 22;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg className="eid-donut" viewBox="0 0 168 168">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="var(--surface-2)" strokeWidth={sw}/>
      {personas.map((p, i) => {
        const len = (p.count / total) * circ;
        const seg = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke={p.color} strokeWidth={sw}
            strokeDasharray={`${len} ${circ - len}`} strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}/>
        );
        offset += len;
        return seg;
      })}
      <text className="eid-donut-center" x={cx} y={cy - 2} textAnchor="middle" dominantBaseline="middle">{total}</text>
      <text className="eid-donut-center-sub" x={cx} y={cy + 16} textAnchor="middle">ATTENDEES</text>
    </svg>
  );
}

// ---------- Report sections ----------
const ACTION_ICONS = { chat: Icon.chat, mic: Icon.mic, cam: Icon.cam, share: Icon.share, megaphone: Icon.megaphone };

function KpiStrip({ k }) {
  const items = [
    { ico: Icon.users, tint: '#5B5BF5', label: 'Unique Attendees', value: k.uniqueAttendees, sub: k.attendeeMix },
    { ico: Icon.broadcast, tint: '#16A34A', label: 'Peak Concurrency', value: k.peakConcurrency, sub: 'Simultaneous presence' },
    { ico: Icon.clock, tint: '#F59E0B', label: 'Average Dwell', value: k.avgDwell, unit: 'm', sub: `Median ${k.medianDwell}m` },
    { ico: Icon.grid, tint: '#7C3AED', label: 'Exploration Rate', value: k.explorationRate, unit: '%', sub: `${k.avgRooms} avg rooms` },
    { ico: Icon.chat, tint: '#EF4444', label: 'Interaction Rate', value: k.interactionRate, unit: '%', sub: 'Tracked actions' },
  ];
  return (
    <div className="eid-kpis">
      {items.map((it, i) => (
        <div key={i} className="eid-kpi">
          <div className="eid-kpi-top">
            <span className="eid-kpi-ico" style={{ background: `${it.tint}1A`, color: it.tint }}><it.ico size={16}/></span>
            <span className="eid-kpi-label">{it.label}</span>
          </div>
          <div className="eid-kpi-value">{it.value}{it.unit && <span className="unit">{it.unit}</span>}</div>
          <div className="eid-kpi-sub">{it.sub}</div>
        </div>
      ))}
    </div>
  );
}

function AttendanceSection({ ev }) {
  return (
    <div className="eid-section">
      <div className="eid-section-head">
        <div>
          <div className="eid-section-title">Attendance Quality</div>
          <div className="eid-section-sub">{ev.kpis.stayed30}% stayed 30+ min · {ev.kpis.multiRoom}% explored multiple rooms</div>
        </div>
      </div>
      <div className="eid-grid-2">
        <div className="eid-card">
          <div className="eid-card-title">Dwell Distribution</div>
          <div className="eid-card-sub">Attendees grouped by minutes spent</div>
          <DwellBars data={ev.dwellHistogram}/>
        </div>
        <div className="eid-card">
          <div className="eid-card-title">Live Concurrency</div>
          <div className="eid-card-sub">Concurrent attendees over the event window · peak {ev.kpis.peakConcurrency}</div>
          <AreaConcurrency data={ev.concurrency} peak={ev.kpis.peakConcurrency} accent={ev.accent}/>
        </div>
      </div>
    </div>
  );
}

function RoomsSection({ ev }) {
  const maxShare = Math.max(...ev.rooms.map(r => r.share));
  return (
    <div className="eid-section">
      <div className="eid-section-head">
        <div>
          <div className="eid-section-title">Room Effectiveness</div>
          <div className="eid-section-sub">Read as a dwell network — unique traffic combined with dwell weight</div>
        </div>
        <span className="eid-section-tag">{ev.rooms.length} top rooms</span>
      </div>
      <div className="eid-card">
        {ev.rooms.map((r, i) => (
          <div key={i} className="eid-room-row">
            <div>
              <div className="eid-room-name">{r.name}</div>
              <div className="eid-room-tags">
                <span className="eid-rtag">{r.type}</span>
                <span className={`eid-rtag ${r.role.toLowerCase()}`}>{r.role}</span>
              </div>
            </div>
            <div className="eid-room-stat">{r.attendees}<span className="sub"> att</span></div>
            <div>
              <div className="eid-room-share-track">
                <div className="eid-room-share-fill" style={{ width: `${(r.share / maxShare) * 100}%` }}/>
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>{r.dwell.toLocaleString()} min · {r.share}%</div>
            </div>
            <div className="eid-room-stat" style={{ textAlign: 'right' }}>{r.avg}<span className="sub"> avg</span></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SegmentationSection({ ev }) {
  return (
    <div className="eid-section">
      <div className="eid-section-head">
        <div>
          <div className="eid-section-title">Attendee Segmentation</div>
          <div className="eid-section-sub">Personas assigned from event-relative behavior, not a global rulebook</div>
        </div>
      </div>
      <div className="eid-card">
        <div className="eid-donut-wrap">
          <PersonaDonut personas={ev.personas}/>
          <div className="eid-legend">
            {ev.personas.map((p, i) => (
              <div key={i} className="eid-persona-row">
                <span className="eid-persona-bar" style={{ background: p.color }}/>
                <div className="eid-persona-info">
                  <div className="eid-persona-top">
                    <span className="eid-persona-name">{p.name}</span>
                    <span className="eid-persona-count">{p.count}</span>
                  </div>
                  <div className="eid-persona-meta">{p.avgMin}m avg · score {p.avgScore} · {p.interaction}% interaction</div>
                  <div className="eid-persona-desc">{p.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RosterSection({ ev }) {
  return (
    <div className="eid-section">
      <div className="eid-section-head">
        <div>
          <div className="eid-section-title">Top Attendees</div>
          <div className="eid-section-sub">Who combined dwell, movement, and tracked actions</div>
        </div>
      </div>
      <div className="eid-att-grid">
        {ev.topAttendees.map((a, i) => (
          <div key={i} className="eid-att">
            <div className="eid-att-score">
              <span className="eid-att-score-num">{a.score}</span>
              <span className="eid-att-score-cap">score</span>
            </div>
            <div className="eid-att-main">
              <div className="eid-att-name">
                {a.name}
                <span className="eid-att-persona">{a.persona}</span>
              </div>
              <div className="eid-att-role">{a.role}{a.country ? ` · ${a.country}` : ''}</div>
              <div className="eid-att-stats">
                <span className="eid-att-stat"><Icon.clock size={12}/> <b>{a.min}</b>m</span>
                <span className="eid-att-stat"><Icon.grid size={12}/> <b>{a.rooms}</b> rooms</span>
                <span className="eid-att-stat"><Icon.broadcast size={12}/> <b>{a.actions}</b> actions</span>
              </div>
              <div className="eid-att-badges">
                {a.badges.map((b, bi) => <span key={bi} className="eid-badge-chip">{b}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JourneySection({ ev }) {
  return (
    <div className="eid-section">
      <div className="eid-section-head">
        <div>
          <div className="eid-section-title">Movement &amp; Journey</div>
          <div className="eid-section-sub">Movement is the SpatialChat signal — how attendees flowed between rooms</div>
        </div>
      </div>
      <div className="eid-card">
        {ev.paths.map((p, i) => (
          <div key={i} className="eid-path-row">
            <span className="eid-path-count">{p.count}</span>
            <div className="eid-path-chips">
              {p.path.map((room, ri) => (
                <React.Fragment key={ri}>
                  <span className="eid-path-chip">{room}</span>
                  {ri < p.path.length - 1 && <span className="eid-path-arrow"><Icon.caretRight size={12}/></span>}
                </React.Fragment>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InteractionSection({ ev }) {
  const maxCount = Math.max(...ev.actions.map(a => a.count));
  return (
    <div className="eid-section">
      <div className="eid-section-head">
        <div>
          <div className="eid-section-title">Interaction Analysis</div>
          <div className="eid-section-sub">Where the event produced visible behavior hosts can amplify</div>
        </div>
      </div>
      <div className="eid-grid-12">
        <div className="eid-card">
          <div className="eid-card-title">Action Mix</div>
          <div className="eid-card-sub">Tracked events by type</div>
          {ev.actions.map((a, i) => {
            const Ico = ACTION_ICONS[a.icon] || Icon.broadcast;
            return (
              <div key={i} className="eid-action-row">
                <span className="eid-action-ico"><Ico size={16}/></span>
                <span className="eid-action-name">{a.name}</span>
                <span className="eid-action-track"><span className="eid-action-fill" style={{ width: `${(a.count / maxCount) * 100}%` }}/></span>
                <span className="eid-action-count">{a.count}</span>
                <span className="eid-action-users">{a.users} users</span>
              </div>
            );
          })}
        </div>
        <div className="eid-card">
          <div className="eid-card-title">Badge Guide</div>
          <div className="eid-card-sub">Optional overlays on top of personas</div>
          <div className="eid-badge-grid">
            {ev.badges.map((b, i) => (
              <div key={i} className="eid-badge-card">
                <span className="eid-badge-mark">{b.mark}</span>
                <div className="eid-badge-info">
                  <div className="eid-badge-name">{b.label} <span className="eid-badge-num">×{b.count}</span></div>
                  <div className="eid-badge-desc">{b.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function RecommendationsSection({ ev }) {
  return (
    <div className="eid-section">
      <div className="eid-section-head">
        <div>
          <div className="eid-section-title">Recommendations</div>
          <div className="eid-section-sub">Grounded in the actual room network and measured dwell/interaction balance</div>
        </div>
      </div>
      <div className="eid-rec-list">
        {ev.recommendations.map((r, i) => (
          <div key={i} className="eid-rec">
            <span className="eid-rec-num">{i + 1}</span>
            <span className="eid-rec-text">{r}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

Object.assign(window, {
  EidSections: {
    KpiStrip, AttendanceSection, RoomsSection, SegmentationSection,
    RosterSection, JourneySection, InteractionSection, RecommendationsSection,
  },
});
