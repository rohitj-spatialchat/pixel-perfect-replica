/* global React, Icon */
// Event extras — additional Create Event tabs + Event Intelligence widgets
// All data is mock/prototype. Wired in from platform-modals.jsx + platform-pages.jsx.

const { useState: useExState } = React;

/* ---------- shared little bits ---------- */
function ExSection({ title, sub, action, children }) {
  return (
    <div className="ex-section">
      <div className="ex-section-head">
        <div>
          <div className="ex-section-title">{title}</div>
          {sub && <div className="ex-section-sub">{sub}</div>}
        </div>
        {action}
      </div>
      <div className="ex-section-body">{children}</div>
    </div>
  );
}
function ExToggle({ on, onChange, label, help }) {
  return (
    <label className="ex-toggle-row">
      <div>
        <div className="ex-tg-label">{label}</div>
        {help && <div className="ex-tg-help">{help}</div>}
      </div>
      <button type="button" className={`ev-toggle ${on ? 'on' : ''}`} onClick={() => onChange(!on)} aria-pressed={on}>
        <span className="ev-toggle-knob"/>
      </button>
    </label>
  );
}
function ExChip({ tint, children }) {
  return <span className="ex-chip" style={{ background: `${tint}1A`, color: tint, borderColor: `${tint}33` }}>{children}</span>;
}
function ExCard({ children, className = '' }) {
  return <div className={`ex-card ${className}`}>{children}</div>;
}
let _eid = 500; const eid = () => ++_eid;

/* ============================================================
   1) TICKETS — paid tiers, early-bird, coupons, tax, invoices
   ============================================================ */
function TicketsView({ onToast }) {
  const [currency, setCur] = useExState('USD');
  const [tiers, setTiers] = useExState([
    { id: eid(), name: 'Early Bird', price: 99, qty: 100, sold: 64, until: '2026-08-15', visible: true },
    { id: eid(), name: 'General Admission', price: 149, qty: 500, sold: 212, until: '2026-09-30', visible: true },
    { id: eid(), name: 'VIP + Networking Dinner', price: 349, qty: 50, sold: 18, until: '2026-09-30', visible: true },
    { id: eid(), name: 'Student', price: 29, qty: 75, sold: 9, until: '2026-09-30', visible: true },
  ]);
  const [coupons, setCoupons] = useExState([
    { id: eid(), code: 'TEAM10', off: '10%', uses: 24, cap: 100 },
    { id: eid(), code: 'SPEAKER', off: '100%', uses: 12, cap: 30 },
  ]);
  const [tax, setTax] = useExState(true);
  const [invoice, setInvoice] = useExState(true);
  const [refund, setRefund] = useExState('Refundable up to 7 days before the event.');

  const upd = (id, k, v) => setTiers(ts => ts.map(t => t.id === id ? { ...t, [k]: v } : t));
  const addTier = () => setTiers(ts => [...ts, { id: eid(), name: 'New tier', price: 0, qty: 100, sold: 0, until: '', visible: true }]);
  const delTier = (id) => setTiers(ts => ts.filter(t => t.id !== id));
  const addCoupon = () => setCoupons(c => [...c, { id: eid(), code: 'NEWCODE', off: '10%', uses: 0, cap: 50 }]);
  const delCoupon = (id) => setCoupons(c => c.filter(x => x.id !== id));

  const revenue = tiers.reduce((s, t) => s + t.price * t.sold, 0);

  return (
    <div className="ex-wrap">
      <div className="ex-inner">
        <div className="ex-head">
          <div className="ex-h">Tickets & pricing</div>
          <div className="ex-sub">Sell free or paid tickets via Stripe — tiers, early-bird windows, coupons, tax and invoices.</div>
        </div>

        <div className="ex-kpi-row">
          <ExCard><div className="ex-kpi-v">{tiers.reduce((s, t) => s + t.sold, 0)}</div><div className="ex-kpi-l">Sold</div></ExCard>
          <ExCard><div className="ex-kpi-v">{currency} {revenue.toLocaleString()}</div><div className="ex-kpi-l">Revenue</div></ExCard>
          <ExCard><div className="ex-kpi-v">{tiers.length}</div><div className="ex-kpi-l">Tiers</div></ExCard>
          <ExCard><div className="ex-kpi-v">{coupons.length}</div><div className="ex-kpi-l">Coupons</div></ExCard>
        </div>

        <ExSection title="Ticket tiers" sub="Drag to reorder. Set quantity, price and a sale-end date per tier."
          action={<button className="plat-cta" onClick={addTier}><Icon.plus size={14}/> Add tier</button>}>
          <div className="ex-tier-head">
            <span>Tier</span><span>Price ({currency})</span><span>Qty</span><span>Sold</span><span>Sales end</span><span/>
          </div>
          {tiers.map(t => (
            <div key={t.id} className="ex-tier">
              <input className="ex-input" value={t.name} onChange={e => upd(t.id, 'name', e.target.value)}/>
              <input className="ex-input" type="number" value={t.price} onChange={e => upd(t.id, 'price', +e.target.value)}/>
              <input className="ex-input" type="number" value={t.qty} onChange={e => upd(t.id, 'qty', +e.target.value)}/>
              <div className="ex-tier-bar">
                <div className="ex-tier-bar-fill" style={{ width: `${Math.min(100, (t.sold/t.qty)*100)}%` }}/>
                <span>{t.sold}/{t.qty}</span>
              </div>
              <input className="ex-input" type="date" value={t.until} onChange={e => upd(t.id, 'until', e.target.value)}/>
              <button className="ex-row-del" onClick={() => delTier(t.id)} title="Remove"><Icon.close size={13}/></button>
            </div>
          ))}
        </ExSection>

        <ExSection title="Coupons & promo codes" sub="Discount codes attendees can apply at checkout."
          action={<button className="plat-cta ghost" onClick={addCoupon}><Icon.plus size={14}/> New code</button>}>
          {coupons.map(c => (
            <div key={c.id} className="ex-coupon">
              <input className="ex-input ex-mono" value={c.code} onChange={e => setCoupons(cs => cs.map(x => x.id===c.id?{...x, code:e.target.value.toUpperCase()}:x))}/>
              <input className="ex-input" value={c.off} onChange={e => setCoupons(cs => cs.map(x => x.id===c.id?{...x, off:e.target.value}:x))} style={{ maxWidth: 90 }}/>
              <div className="ex-tier-bar"><div className="ex-tier-bar-fill" style={{ width: `${(c.uses/c.cap)*100}%` }}/><span>{c.uses}/{c.cap}</span></div>
              <button className="ex-row-del" onClick={() => delCoupon(c.id)}><Icon.close size={13}/></button>
            </div>
          ))}
        </ExSection>

        <ExSection title="Tax, invoicing & refunds">
          <div className="ex-grid-2">
            <label className="ex-field">
              <span className="ev-label">Currency</span>
              <select className="ex-input" value={currency} onChange={e => setCur(e.target.value)}>
                {['USD','EUR','GBP','INR','AUD','CAD','JPY','SGD'].map(c => <option key={c}>{c}</option>)}
              </select>
            </label>
            <label className="ex-field">
              <span className="ev-label">Refund policy (shown at checkout)</span>
              <input className="ex-input" value={refund} onChange={e => setRefund(e.target.value)}/>
            </label>
          </div>
          <ExToggle on={tax} onChange={setTax} label="Collect VAT / Sales tax" help="Adds country-based tax at checkout (Stripe Tax)."/>
          <ExToggle on={invoice} onChange={setInvoice} label="Send PDF invoices" help="Auto-generate a branded PDF invoice for each paid registration."/>
        </ExSection>

        <div className="ex-foot">
          <button className="plat-cta ghost" onClick={() => onToast('Stripe Test mode opened')}><Icon.code size={14}/> Test checkout</button>
          <button className="plat-cta" onClick={() => onToast('Tickets saved')}><Icon.check size={14}/> Save tickets</button>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   2) AGENDA — sessions, tracks, speakers, sponsors/booths
   ============================================================ */
function AgendaView({ onToast }) {
  const [tracks, setTracks] = useExState([
    { id: 1, name: 'Main Stage', color: '#5B5BF5' },
    { id: 2, name: 'Product', color: '#16A34A' },
    { id: 3, name: 'Growth', color: '#F59E0B' },
  ]);
  const [sessions, setSessions] = useExState([
    { id: eid(), time: '09:00', dur: '30m', title: 'Doors open & coffee', track: 1, speakers: [] },
    { id: eid(), time: '10:00', dur: '45m', title: 'Opening keynote: The next decade of events', track: 1, speakers: ['Maya Chen'] },
    { id: eid(), time: '11:00', dur: '40m', title: 'Designing for engagement at scale', track: 2, speakers: ['Daniel Park'] },
    { id: eid(), time: '11:00', dur: '40m', title: 'From signup to advocate: lifecycle that works', track: 3, speakers: ['Priya Raman'] },
    { id: eid(), time: '13:30', dur: '60m', title: 'Workshop: building a hybrid run-of-show', track: 2, speakers: ['Daniel Park', 'Liam Ortiz'] },
    { id: eid(), time: '15:00', dur: '30m', title: 'Closing fireside + community awards', track: 1, speakers: ['Maya Chen', 'Priya Raman'] },
  ]);
  const [speakers, setSpeakers] = useExState([
    { id: eid(), name: 'Maya Chen', title: 'CEO, GlowFlow', conf: true },
    { id: eid(), name: 'Daniel Park', title: 'Head of Product, Nimbus', conf: true },
    { id: eid(), name: 'Priya Raman', title: 'Lifecycle Lead, Loop', conf: true },
    { id: eid(), name: 'Liam Ortiz', title: 'Workshop Facilitator', conf: false },
  ]);
  const [sponsors, setSponsors] = useExState([
    { id: eid(), name: 'Notion', tier: 'Platinum', booth: true, leads: 124 },
    { id: eid(), name: 'Linear', tier: 'Gold', booth: true, leads: 78 },
    { id: eid(), name: 'Stripe', tier: 'Gold', booth: true, leads: 92 },
    { id: eid(), name: 'Figma', tier: 'Silver', booth: false, leads: 0 },
  ]);
  const trackOf = (id) => tracks.find(t => t.id === id) || tracks[0];
  const addSession = () => setSessions(s => [...s, { id: eid(), time: '12:00', dur: '30m', title: 'New session', track: 1, speakers: [] }]);

  return (
    <div className="ex-wrap">
      <div className="ex-inner">
        <div className="ex-head">
          <div className="ex-h">Agenda, speakers & sponsors</div>
          <div className="ex-sub">Multi-track schedule with per-session registration, speaker portal and sponsor booths.</div>
        </div>

        <ExSection title="Tracks"
          action={<button className="plat-cta ghost" onClick={() => setTracks(t => [...t, { id: eid(), name: 'New track', color: '#7C3AED' }])}><Icon.plus size={14}/> Add track</button>}>
          <div className="ex-track-row">
            {tracks.map(t => (
              <div key={t.id} className="ex-track-chip" style={{ borderColor: `${t.color}55`, background: `${t.color}14`, color: t.color }}>
                <span className="ex-track-dot" style={{ background: t.color }}/>{t.name}
              </div>
            ))}
          </div>
        </ExSection>

        <ExSection title="Sessions" sub="Drag-and-drop in production. Click a row to assign speakers, add resources, or open the green room."
          action={<button className="plat-cta" onClick={addSession}><Icon.plus size={14}/> Add session</button>}>
          <div className="ex-agenda">
            {sessions.map(s => {
              const t = trackOf(s.track);
              return (
                <div key={s.id} className="ex-ag-row" style={{ borderLeftColor: t.color }}>
                  <div className="ex-ag-time"><div className="ex-ag-t">{s.time}</div><div className="ex-ag-d">{s.dur}</div></div>
                  <div className="ex-ag-body">
                    <div className="ex-ag-title">{s.title}</div>
                    <div className="ex-ag-meta">
                      <ExChip tint={t.color}>{t.name}</ExChip>
                      {s.speakers.map(sp => <span key={sp} className="ex-ag-sp"><Icon.user size={11}/> {sp}</span>)}
                    </div>
                  </div>
                  <div className="ex-ag-actions">
                    <button className="plat-cta ghost" onClick={() => onToast(`Green room for "${s.title}"`)}><Icon.door size={13}/> Green room</button>
                    <button className="ex-row-del" onClick={() => setSessions(ss => ss.filter(x => x.id !== s.id))}><Icon.close size={13}/></button>
                  </div>
                </div>
              );
            })}
          </div>
        </ExSection>

        <ExSection title="Speakers" sub="Send each speaker a portal link to upload bio, headshot, slides and join the dry-run."
          action={<button className="plat-cta ghost" onClick={() => setSpeakers(s => [...s, { id: eid(), name: 'New speaker', title: '', conf: false }])}><Icon.plus size={14}/> Invite speaker</button>}>
          <div className="ex-speaker-grid">
            {speakers.map(s => (
              <div key={s.id} className="ex-speaker">
                <div className="ex-speaker-av">{s.name.split(' ').map(p => p[0]).slice(0,2).join('')}</div>
                <div className="ex-speaker-info">
                  <div className="ex-speaker-name">{s.name}</div>
                  <div className="ex-speaker-title">{s.title || 'Add title'}</div>
                  <div className="ex-speaker-status">
                    {s.conf
                      ? <ExChip tint="#16A34A"><Icon.check size={10}/> Confirmed</ExChip>
                      : <ExChip tint="#F59E0B">Awaiting reply</ExChip>}
                  </div>
                </div>
                <button className="ex-row-del" onClick={() => onToast(`Portal link copied for ${s.name}`)} title="Copy portal link"><Icon.share size={13}/></button>
              </div>
            ))}
          </div>
        </ExSection>

        <ExSection title="Sponsors & expo booths" sub="Sponsor pages capture leads, host demo videos and chat with attendees."
          action={<button className="plat-cta ghost" onClick={() => setSponsors(s => [...s, { id: eid(), name: 'New sponsor', tier: 'Silver', booth: false, leads: 0 }])}><Icon.plus size={14}/> Add sponsor</button>}>
          <div className="ex-sponsor-grid">
            {sponsors.map(s => (
              <div key={s.id} className="ex-sponsor">
                <div className="ex-sponsor-logo">{s.name[0]}</div>
                <div className="ex-sponsor-info">
                  <div className="ex-sponsor-name">{s.name}</div>
                  <div className="ex-sponsor-tier">{s.tier}</div>
                </div>
                <div className="ex-sponsor-leads">{s.leads}<span>leads</span></div>
                <ExChip tint={s.booth ? '#16A34A' : '#94949E'}>{s.booth ? 'Booth live' : 'No booth'}</ExChip>
              </div>
            ))}
          </div>
        </ExSection>
      </div>
    </div>
  );
}

/* ============================================================
   3) EMAILS — sequence + SMS/WhatsApp
   ============================================================ */
function EmailsView({ onToast }) {
  const initial = [
    { id: eid(), kind: 'Confirmation', when: 'On registration', subject: "You're in! Here's everything you need", on: true, ics: true, sms: false },
    { id: eid(), kind: 'Reminder', when: '7 days before', subject: '1 week to go — add to calendar', on: true, ics: true, sms: false },
    { id: eid(), kind: 'Reminder', when: '24 hours before', subject: 'Tomorrow: your event link inside', on: true, ics: true, sms: false },
    { id: eid(), kind: 'Reminder', when: '1 hour before', subject: 'Starts in 1 hour — join early to test audio', on: true, ics: false, sms: true },
    { id: eid(), kind: 'Live now', when: 'At start time', subject: "We're live — tap to join", on: true, ics: false, sms: true },
    { id: eid(), kind: 'Follow-up · Attended', when: '2h after end', subject: 'Thanks for joining — your replay + slides', on: true, ics: false, sms: false },
    { id: eid(), kind: 'Follow-up · No-show', when: '24h after end', subject: 'Sorry we missed you — watch the replay', on: true, ics: false, sms: false },
  ];
  const [steps, setSteps] = useExState(initial);
  const [sender, setSender] = useExState({ name: 'GlowFlow Events', email: 'events@glowflow.io', domain: 'glowflow.io', verified: true });
  const upd = (id, k, v) => setSteps(s => s.map(x => x.id === id ? { ...x, [k]: v } : x));
  const add = () => setSteps(s => [...s, { id: eid(), kind: 'Custom', when: 'Schedule', subject: 'New email', on: true, ics: false, sms: false }]);

  return (
    <div className="ex-wrap">
      <div className="ex-inner">
        <div className="ex-head">
          <div className="ex-h">Email & comms sequence</div>
          <div className="ex-sub">Automated confirmations, reminders and follow-ups — branched by attended vs no-show. Add SMS for last-mile nudges.</div>
        </div>

        <ExSection title="Sender">
          <div className="ex-grid-3">
            <label className="ex-field"><span className="ev-label">From name</span><input className="ex-input" value={sender.name} onChange={e => setSender({ ...sender, name: e.target.value })}/></label>
            <label className="ex-field"><span className="ev-label">From email</span><input className="ex-input" value={sender.email} onChange={e => setSender({ ...sender, email: e.target.value })}/></label>
            <label className="ex-field"><span className="ev-label">Sender domain (DKIM)</span>
              <div className="ex-input ex-flex">{sender.domain} {sender.verified
                ? <ExChip tint="#16A34A"><Icon.check size={10}/> Verified</ExChip>
                : <ExChip tint="#F59E0B">Pending</ExChip>}</div></label>
          </div>
        </ExSection>

        <ExSection title="Sequence"
          action={<button className="plat-cta" onClick={add}><Icon.plus size={14}/> Add step</button>}>
          <div className="ex-seq">
            {steps.map((s, i) => (
              <div key={s.id} className="ex-seq-step">
                <div className="ex-seq-when">
                  <div className="ex-seq-when-tag">{s.when}</div>
                  {i < steps.length - 1 && <div className="ex-seq-line"/>}
                </div>
                <div className="ex-seq-card">
                  <div className="ex-seq-head">
                    <ExChip tint={s.kind.includes('No-show') ? '#EC4899' : s.kind.includes('Attended') ? '#16A34A' : s.kind === 'Live now' ? '#EF4444' : '#5B5BF5'}>{s.kind}</ExChip>
                    <ExToggle on={s.on} onChange={v => upd(s.id, 'on', v)} label=""/>
                  </div>
                  <input className="ex-input" value={s.subject} onChange={e => upd(s.id, 'subject', e.target.value)}/>
                  <div className="ex-seq-meta">
                    <label className="ex-mini-toggle"><input type="checkbox" checked={s.ics} onChange={e => upd(s.id, 'ics', e.target.checked)}/> <Icon.calendar size={12}/> Attach .ics</label>
                    <label className="ex-mini-toggle"><input type="checkbox" checked={s.sms} onChange={e => upd(s.id, 'sms', e.target.checked)}/> <Icon.chat size={12}/> Also send SMS / WhatsApp</label>
                    <button className="ex-mini-link" onClick={() => onToast(`Editing "${s.subject}"`)}><Icon.pencil size={12}/> Edit template</button>
                    <button className="ex-mini-link" onClick={() => onToast('Sending test email')}><Icon.send size={12}/> Send test</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ExSection>

        <ExSection title="Calendar invites" sub="Attendees see Add-to-calendar buttons on the confirmation page and inside emails.">
          <div className="ex-cal-row">
            {['Google', 'Outlook', 'Apple', '.ics download'].map(p => (
              <ExCard key={p} className="ex-cal-card"><Icon.calendar size={16}/> {p}</ExCard>
            ))}
          </div>
        </ExSection>
      </div>
    </div>
  );
}

/* ============================================================
   4) ENGAGEMENT — polls, Q&A, breakouts, captions, gamification
   ============================================================ */
function EngagementView({ onToast }) {
  const [polls, setPolls] = useExState([
    { id: eid(), q: 'How are you joining today?', opts: ['Solo', 'With a team'], votes: 312 },
    { id: eid(), q: 'Which session are you most excited about?', opts: ['Keynote', 'Workshop', 'Networking'], votes: 184 },
  ]);
  const [qa, setQa] = useExState(true);
  const [raiseHand, setRaise] = useExState(true);
  const [breakouts, setBreakouts] = useExState({ on: true, size: 4, mode: 'Random' });
  const [captions, setCaptions] = useExState({ on: true, translate: true, langs: ['English','Spanish','German','Hindi','Japanese'] });
  const [game, setGame] = useExState({ on: true, points: { join: 10, poll: 5, qa: 15, booth: 20 } });

  return (
    <div className="ex-wrap">
      <div className="ex-inner">
        <div className="ex-head">
          <div className="ex-h">In-event engagement</div>
          <div className="ex-sub">Polls, Q&amp;A, breakouts, live captions and gamification — switch on what you need.</div>
        </div>

        <div className="ex-filter-card">
          <div className="ev-picker-toolbar">
            <div className="ev-picker-search">
              <Icon.search size={14}/>
              <input placeholder="Search by name, email or company…" />
            </div>
            <button className="ev-picker-pill" type="button">Title <Icon.caretDown size={12}/></button>
            <button className="ev-picker-pill" type="button">Company <Icon.caretDown size={12}/></button>
            <button className="ev-picker-pill" type="button"><Icon.globe size={13}/> Country <Icon.caretDown size={12}/></button>
            <button className="ev-picker-pill" type="button"><Icon.calendar size={13}/> Date joined <Icon.caretDown size={12}/></button>
          </div>
        </div>

        <ExSection title="Polls & quizzes"
          action={<button className="plat-cta" onClick={() => setPolls(p => [...p, { id: eid(), q: 'New poll', opts: ['Option 1','Option 2'], votes: 0 }])}><Icon.plus size={14}/> New poll</button>}>
          {polls.map(p => (
            <div key={p.id} className="ex-poll">
              <input className="ex-input ex-poll-q" value={p.q} onChange={e => setPolls(ps => ps.map(x => x.id===p.id?{...x, q:e.target.value}:x))}/>
              <div className="ex-poll-opts">
                {p.opts.map((o, i) => <span key={i} className="ex-poll-opt">{o}</span>)}
                <button className="ex-poll-add" onClick={() => setPolls(ps => ps.map(x => x.id===p.id?{...x, opts:[...x.opts, 'New option']}:x))}><Icon.plus size={12}/></button>
              </div>
              <div className="ex-poll-meta">{p.votes} votes</div>
              <button className="ex-row-del" onClick={() => setPolls(ps => ps.filter(x => x.id!==p.id))}><Icon.close size={13}/></button>
            </div>
          ))}
        </ExSection>

        <ExSection title="Q&A and audience interaction">
          <ExToggle on={qa} onChange={setQa} label="Live Q&A with upvoting" help="Attendees submit and upvote questions; moderators promote answered ones."/>
          <ExToggle on={raiseHand} onChange={setRaise} label="Raise hand → invite to stage" help="Audience members can request to come on stage; hosts approve from the backstage."/>
        </ExSection>

        <ExSection title="Breakout rooms">
          <ExToggle on={breakouts.on} onChange={v => setBreakouts({ ...breakouts, on: v })} label="Enable breakouts" help="Auto-create small group rooms during the event."/>
          {breakouts.on && (
            <div className="ex-grid-2">
              <label className="ex-field"><span className="ev-label">Room size</span><input type="number" min="2" max="20" className="ex-input" value={breakouts.size} onChange={e => setBreakouts({ ...breakouts, size: +e.target.value })}/></label>
              <label className="ex-field"><span className="ev-label">Assignment</span>
                <select className="ex-input" value={breakouts.mode} onChange={e => setBreakouts({ ...breakouts, mode: e.target.value })}>
                  {['Random','Manual','By interest tag','By company'].map(m => <option key={m}>{m}</option>)}
                </select></label>
            </div>
          )}
        </ExSection>

        <ExSection title="Live captions & translation">
          <ExToggle on={captions.on} onChange={v => setCaptions({ ...captions, on: v })} label="Live captions" help="AI captions appear under the stream in real time."/>
          <ExToggle on={captions.translate} onChange={v => setCaptions({ ...captions, translate: v })} label="Real-time translation" help="Attendees choose their preferred language from the player."/>
          {captions.translate && (
            <div className="ex-lang-row">
              {captions.langs.map(l => <ExChip key={l} tint="#5B5BF5">{l}</ExChip>)}
              <button className="ex-poll-add" onClick={() => onToast('Pick more languages')}><Icon.plus size={12}/></button>
            </div>
          )}
        </ExSection>

        <ExSection title="Gamification & leaderboard">
          <ExToggle on={game.on} onChange={v => setGame({ ...game, on: v })} label="Award points & show leaderboard" help="Attendees earn points for actions; top names show on a live leaderboard."/>
          {game.on && (
            <div className="ex-points-grid">
              {Object.entries(game.points).map(([k, v]) => (
                <ExCard key={k} className="ex-points-card">
                  <div className="ex-points-key">{k.toUpperCase()}</div>
                  <input type="number" className="ex-input" value={v} onChange={e => setGame({ ...game, points: { ...game.points, [k]: +e.target.value } })}/>
                  <div className="ex-points-l">points</div>
                </ExCard>
              ))}
            </div>
          )}
        </ExSection>
      </div>
    </div>
  );
}

/* ============================================================
   5) STREAMING — RTMP, restream, recording, replay hub
   ============================================================ */
function StreamingView({ onToast }) {
  const [rtmpIn, setRtmpIn] = useExState(false);
  const [destinations, setDest] = useExState([
    { id: eid(), name: 'YouTube Live', icon: '▶', on: true, key: '••••-••••-glow' },
    { id: eid(), name: 'LinkedIn Live', icon: 'in', on: true, key: '••••-••••-link' },
    { id: eid(), name: 'Facebook Live', icon: 'f', on: false, key: '' },
    { id: eid(), name: 'Custom RTMP', icon: '∞', on: false, key: 'rtmp://' },
  ]);
  const [rec, setRec] = useExState({ on: true, chapters: true, highlights: true, clips: true });
  const [replay, setReplay] = useExState({ on: true, gated: true, expires: '2026-12-31' });

  return (
    <div className="ex-wrap">
      <div className="ex-inner">
        <div className="ex-head">
          <div className="ex-h">Streaming, recording & replay</div>
          <div className="ex-sub">Bring your own RTMP feed, restream to social, auto-record with AI chapters, and gate the on-demand replay.</div>
        </div>

        <ExSection title="RTMP input (bring your own production)">
          <ExToggle on={rtmpIn} onChange={setRtmpIn} label="Allow RTMP-in from OBS / vMix / Wirecast" help="Stream your studio mix into SpatialChat as a stage source."/>
          {rtmpIn && (
            <div className="ex-rtmp">
              <div className="ex-rtmp-row"><span className="ev-label">Server URL</span><code className="ex-mono">rtmps://ingest.spatial.chat/live</code></div>
              <div className="ex-rtmp-row"><span className="ev-label">Stream key</span><code className="ex-mono">sk_live_glowflow_a8f2…</code><button className="plat-cta ghost" onClick={() => onToast('Stream key copied')}><Icon.share size={13}/> Copy</button></div>
            </div>
          )}
        </ExSection>

        <ExSection title="Restream destinations" sub="Send the live feed to one or more platforms simultaneously."
          action={<button className="plat-cta ghost" onClick={() => setDest(d => [...d, { id: eid(), name: 'New destination', icon: '+', on: false, key: '' }])}><Icon.plus size={14}/> Add destination</button>}>
          <div className="ex-dest-grid">
            {destinations.map(d => (
              <ExCard key={d.id} className="ex-dest">
                <div className="ex-dest-head">
                  <span className="ex-dest-icon">{d.icon}</span>
                  <span className="ex-dest-name">{d.name}</span>
                  <ExToggle on={d.on} onChange={v => setDest(ds => ds.map(x => x.id===d.id?{...x, on:v}:x))} label=""/>
                </div>
                <input className="ex-input ex-mono" value={d.key} placeholder="Stream key" onChange={e => setDest(ds => ds.map(x => x.id===d.id?{...x, key:e.target.value}:x))}/>
              </ExCard>
            ))}
          </div>
        </ExSection>

        <ExSection title="Recording & AI highlights">
          <ExToggle on={rec.on} onChange={v => setRec({ ...rec, on: v })} label="Auto-record every session" help="Each session is saved automatically with its own file."/>
          {rec.on && <>
            <ExToggle on={rec.chapters} onChange={v => setRec({ ...rec, chapters: v })} label="AI-generated chapters" help="Detects topic shifts and inserts navigable chapter markers."/>
            <ExToggle on={rec.highlights} onChange={v => setRec({ ...rec, highlights: v })} label="AI highlight reel" help="Produces a 60-second sizzle clip for sharing."/>
            <ExToggle on={rec.clips} onChange={v => setRec({ ...rec, clips: v })} label="One-click social clips" help="Speakers can clip and caption a moment in under 10 seconds."/>
          </>}
        </ExSection>

        <ExSection title="On-demand replay hub">
          <ExToggle on={replay.on} onChange={v => setReplay({ ...replay, on: v })} label="Publish replays after the event"/>
          {replay.on && <>
            <ExToggle on={replay.gated} onChange={v => setReplay({ ...replay, gated: v })} label="Gate replays behind registration" help="Only registrants can watch on-demand. Required for accurate lead capture."/>
            <label className="ex-field"><span className="ev-label">Hub expires on</span><input type="date" className="ex-input" value={replay.expires} onChange={e => setReplay({ ...replay, expires: e.target.value })}/></label>
          </>}
        </ExSection>
      </div>
    </div>
  );
}

/* ============================================================
   6) INTEGRATIONS — CRM, webhooks, SSO, GDPR
   ============================================================ */
function IntegrationsTabView({ onToast }) {
  const [crm, setCrm] = useExState([
    { id: eid(), name: 'HubSpot', tint: '#FF7A59', connected: true, syncs: 'Contacts, deals, engagement score' },
    { id: eid(), name: 'Salesforce', tint: '#00A1E0', connected: true, syncs: 'Leads, campaigns, opportunities' },
    { id: eid(), name: 'Marketo', tint: '#5C4C9F', connected: false, syncs: 'Leads, programs' },
    { id: eid(), name: 'Pardot', tint: '#0EA5E9', connected: false, syncs: 'Prospects, scoring' },
    { id: eid(), name: 'Zapier', tint: '#FF4F00', connected: true, syncs: '7,000+ apps' },
    { id: eid(), name: 'Make', tint: '#6D5BFE', connected: false, syncs: 'Workflows' },
  ]);
  const [hooks, setHooks] = useExState([
    { id: eid(), url: 'https://api.glowflow.io/hooks/register', events: ['registration.created','registration.cancelled'], on: true },
    { id: eid(), url: 'https://hooks.zapier.com/x/8a92…', events: ['attendance.checked_in','engagement.scored'], on: true },
  ]);
  const [sso, setSso] = useExState({ on: false, idp: 'Okta' });
  const [gdpr, setGdpr] = useExState({ consent: true, retention: 365, audit: true });

  return (
    <div className="ex-wrap">
      <div className="ex-inner">
        <div className="ex-head">
          <div className="ex-h">Integrations, access & compliance</div>
          <div className="ex-sub">Push registrants and engagement into your CRM, fire webhooks, enable SSO and configure GDPR.</div>
        </div>

        <ExSection title="CRM & marketing automation">
          <div className="ex-int-grid">
            {crm.map(c => (
              <ExCard key={c.id} className="ex-int">
                <div className="ex-int-logo" style={{ background: `${c.tint}1A`, color: c.tint }}>{c.name[0]}</div>
                <div className="ex-int-info">
                  <div className="ex-int-name">{c.name}</div>
                  <div className="ex-int-sub">{c.syncs}</div>
                </div>
                <button className={`plat-cta ${c.connected ? 'ghost' : ''}`} onClick={() => {
                  setCrm(cs => cs.map(x => x.id===c.id?{...x, connected: !x.connected}:x));
                  onToast(c.connected ? `${c.name} disconnected` : `${c.name} connected`);
                }}>{c.connected ? 'Connected' : 'Connect'}</button>
              </ExCard>
            ))}
          </div>
        </ExSection>

        <ExSection title="Webhooks" sub="Fire HTTP POSTs in real-time for any event lifecycle change."
          action={<button className="plat-cta" onClick={() => setHooks(h => [...h, { id: eid(), url: 'https://', events: [], on: true }])}><Icon.plus size={14}/> Add webhook</button>}>
          {hooks.map(h => (
            <div key={h.id} className="ex-hook">
              <input className="ex-input ex-mono" value={h.url} onChange={e => setHooks(hs => hs.map(x => x.id===h.id?{...x, url:e.target.value}:x))}/>
              <div className="ex-hook-events">{h.events.map(e => <ExChip key={e} tint="#5B5BF5">{e}</ExChip>)}</div>
              <ExToggle on={h.on} onChange={v => setHooks(hs => hs.map(x => x.id===h.id?{...x, on:v}:x))} label=""/>
              <button className="ex-row-del" onClick={() => setHooks(hs => hs.filter(x => x.id!==h.id))}><Icon.close size={13}/></button>
            </div>
          ))}
        </ExSection>

        <ExSection title="SSO / SAML for enterprise attendees">
          <ExToggle on={sso.on} onChange={v => setSso({ ...sso, on: v })} label="Require SSO sign-in" help="Attendees authenticate via your IdP — no separate password."/>
          {sso.on && (
            <label className="ex-field"><span className="ev-label">Identity provider</span>
              <select className="ex-input" value={sso.idp} onChange={e => setSso({ ...sso, idp: e.target.value })}>
                {['Okta','Azure AD','Google Workspace','OneLogin','Generic SAML 2.0'].map(o => <option key={o}>{o}</option>)}
              </select></label>
          )}
        </ExSection>

        <ExSection title="Roles & permissions">
          <div className="ex-roles">
            {[
              { r: 'Owner', perm: 'Full control, billing, delete' },
              { r: 'Organizer', perm: 'Create/edit events, view analytics' },
              { r: 'Moderator', perm: 'Run polls/Q&A, manage chat during live' },
              { r: 'Speaker', perm: 'Access green room + portal, upload slides' },
            ].map(x => (
              <ExCard key={x.r} className="ex-role">
                <div className="ex-role-name">{x.r}</div>
                <div className="ex-role-perm">{x.perm}</div>
              </ExCard>
            ))}
          </div>
        </ExSection>

        <ExSection title="GDPR, consent & audit log">
          <ExToggle on={gdpr.consent} onChange={v => setGdpr({ ...gdpr, consent: v })} label="Show consent checkbox at registration" help="Required for processing personal data in EU/UK."/>
          <ExToggle on={gdpr.audit} onChange={v => setGdpr({ ...gdpr, audit: v })} label="Maintain audit log" help="Records all admin actions for compliance review."/>
          <label className="ex-field"><span className="ev-label">Retain attendee data for (days)</span><input type="number" min="30" className="ex-input" value={gdpr.retention} onChange={e => setGdpr({ ...gdpr, retention: +e.target.value })}/></label>
        </ExSection>
      </div>
    </div>
  );
}

/* ============================================================
   7) MOBILE & EMBED — embed widgets, mobile preview
   ============================================================ */
function MobileEmbedView({ onToast, eventName }) {
  const [code, setCode] = useExState('button');
  const snippets = {
    button: `<script src="https://embed.spatial.chat/v1.js" async></script>\n<a data-spatial-event="${(eventName||'event').toLowerCase().replace(/\\s+/g,'-')}" class="spatial-register-btn">Register</a>`,
    list: `<script src="https://embed.spatial.chat/v1.js" async></script>\n<div data-spatial-upcoming="glowflow" data-limit="5"></div>`,
    iframe: `<iframe src="https://reg.spatial.chat/embed/${(eventName||'event').toLowerCase().replace(/\\s+/g,'-')}" width="100%" height="640" frameborder="0"></iframe>`,
  };

  return (
    <div className="ex-wrap">
      <div className="ex-inner">
        <div className="ex-head">
          <div className="ex-h">Mobile & embed</div>
          <div className="ex-sub">Drop registration widgets on any site, and preview how the attendee app looks on mobile.</div>
        </div>

        <ExSection title="Embeddable widgets">
          <div className="ex-seg ex-embed-seg">
            {[
              { id: 'button', name: 'Register button' },
              { id: 'list', name: 'Upcoming events list' },
              { id: 'iframe', name: 'Full registration iframe' },
            ].map(o => (
              <button key={o.id} className={`ev-seg-opt ${code === o.id ? 'on' : ''}`} onClick={() => setCode(o.id)}>
                <span className="ev-seg-name">{o.name}</span>
              </button>
            ))}
          </div>
          <pre className="ex-snippet"><code>{snippets[code]}</code></pre>
          <button className="plat-cta" onClick={() => onToast('Embed snippet copied')}><Icon.share size={14}/> Copy snippet</button>
        </ExSection>

        <ExSection title="Mobile attendee preview" sub="Optimised attendee experience on phones — registration, agenda, stream, polls and chat.">
          <div className="ex-mobile-row">
            {['Register', 'Agenda', 'Live stage', 'Polls / Q&A'].map(s => (
              <div key={s} className="ex-phone">
                <div className="ex-phone-notch"/>
                <div className="ex-phone-screen">
                  <div className="ex-phone-bar">9:41</div>
                  <div className="ex-phone-h">{s}</div>
                  <div className="ex-phone-card"/>
                  <div className="ex-phone-card alt"/>
                  <div className="ex-phone-card"/>
                  <div className="ex-phone-cta">{s === 'Register' ? 'Register' : s === 'Live stage' ? 'Join' : 'Open'}</div>
                </div>
              </div>
            ))}
          </div>
        </ExSection>
      </div>
    </div>
  );
}

/* ============================================================
   ANALYTICS WIDGETS — extra Event Intelligence sections
   ============================================================ */
function CRMSyncWidget({ ev }) {
  const rows = [
    { sys: 'HubSpot', tint: '#FF7A59', sent: ev.kpis.uniqueAttendees, ok: ev.kpis.uniqueAttendees - 3, failed: 3 },
    { sys: 'Salesforce', tint: '#00A1E0', sent: ev.kpis.uniqueAttendees, ok: ev.kpis.uniqueAttendees, failed: 0 },
    { sys: 'Zapier', tint: '#FF4F00', sent: ev.kpis.uniqueAttendees * 2, ok: ev.kpis.uniqueAttendees * 2, failed: 0 },
  ];
  return (
    <div className="ex-widget">
      <div className="ex-widget-h">CRM & automation sync</div>
      <div className="ex-widget-sub">Records pushed to your downstream systems with engagement scores attached.</div>
      <div className="ex-crm-rows">
        {rows.map(r => (
          <div key={r.sys} className="ex-crm-row">
            <div className="ex-int-logo" style={{ background: `${r.tint}1A`, color: r.tint }}>{r.sys[0]}</div>
            <div className="ex-crm-name">{r.sys}</div>
            <div className="ex-crm-stat"><b>{r.sent}</b><span>sent</span></div>
            <div className="ex-crm-stat ok"><b>{r.ok}</b><span>OK</span></div>
            <div className="ex-crm-stat fail"><b>{r.failed}</b><span>failed</span></div>
            <ExChip tint={r.failed ? '#F59E0B' : '#16A34A'}>{r.failed ? 'Needs review' : 'Healthy'}</ExChip>
          </div>
        ))}
      </div>
    </div>
  );
}

function WebhookFeedWidget() {
  const items = [
    { t: '12:04', ev: 'registration.created', url: 'api.glowflow.io/hooks/register', code: 200 },
    { t: '12:04', ev: 'registration.created', url: 'hooks.zapier.com/x/8a92…', code: 200 },
    { t: '11:58', ev: 'engagement.scored', url: 'api.glowflow.io/hooks/score', code: 200 },
    { t: '11:46', ev: 'attendance.checked_in', url: 'api.glowflow.io/hooks/checkin', code: 200 },
    { t: '11:31', ev: 'session.ended', url: 'hooks.zapier.com/x/8a92…', code: 500 },
    { t: '11:30', ev: 'session.started', url: 'api.glowflow.io/hooks/session', code: 200 },
  ];
  return (
    <div className="ex-widget">
      <div className="ex-widget-h">Webhook activity</div>
      <div className="ex-widget-sub">Last 6 outgoing webhook deliveries for this event.</div>
      <div className="ex-hook-feed">
        {items.map((it, i) => (
          <div key={i} className="ex-hook-feed-row">
            <span className="ex-hook-t">{it.t}</span>
            <ExChip tint={it.code === 200 ? '#16A34A' : '#EF4444'}>{it.code}</ExChip>
            <span className="ex-hook-ev">{it.ev}</span>
            <span className="ex-hook-url">{it.url}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReplayHubWidget({ ev }) {
  const sessions = (ev.rooms || []).slice(0, 4).map((r, i) => ({
    name: r.name || `Session ${i+1}`, views: 120 + i * 47, watch: 62 + i * 5, clips: 3 + i,
  }));
  return (
    <div className="ex-widget">
      <div className="ex-widget-h">On-demand replay hub</div>
      <div className="ex-widget-sub">Post-event views and average watch time per recorded session.</div>
      <div className="ex-replay-grid">
        {sessions.map(s => (
          <ExCard key={s.name} className="ex-replay">
            <div className="ex-replay-thumb"><Icon.video size={20}/></div>
            <div className="ex-replay-name">{s.name}</div>
            <div className="ex-replay-stats">
              <span><b>{s.views}</b> views</span>
              <span><b>{s.watch}%</b> watch</span>
              <span><b>{s.clips}</b> clips</span>
            </div>
          </ExCard>
        ))}
      </div>
    </div>
  );
}

function AttributionWidget({ ev }) {
  const total = ev.kpis.uniqueAttendees;
  const sources = [
    { src: 'Direct', pct: 32, tint: '#5B5BF5' },
    { src: 'Email · launch', pct: 24, tint: '#7C3AED' },
    { src: 'LinkedIn organic', pct: 18, tint: '#0EA5E9' },
    { src: 'Partner co-promo', pct: 12, tint: '#16A34A' },
    { src: 'Paid · Google', pct: 9, tint: '#F59E0B' },
    { src: 'Referral / other', pct: 5, tint: '#94949E' },
  ];
  return (
    <div className="ex-widget">
      <div className="ex-widget-h">Source attribution</div>
      <div className="ex-widget-sub">Where this event's {total} attendees came from (UTM + referrer rollup).</div>
      <div className="ex-attr-bar">
        {sources.map(s => <div key={s.src} style={{ width: `${s.pct}%`, background: s.tint }} title={`${s.src}: ${s.pct}%`}/>)}
      </div>
      <div className="ex-attr-legend">
        {sources.map(s => (
          <div key={s.src} className="ex-attr-row">
            <span className="ex-attr-dot" style={{ background: s.tint }}/>
            <span className="ex-attr-src">{s.src}</span>
            <span className="ex-attr-pct">{s.pct}%</span>
            <span className="ex-attr-n">{Math.round(total * s.pct / 100)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function AccountsWidget({ ev }) {
  const accts = [
    { co: 'Notion', n: 14, eng: 92, deals: 2 },
    { co: 'Linear', n: 11, eng: 88, deals: 1 },
    { co: 'Stripe', n: 9, eng: 84, deals: 1 },
    { co: 'Figma', n: 8, eng: 79, deals: 0 },
    { co: 'Vercel', n: 7, eng: 76, deals: 1 },
    { co: 'Loom', n: 5, eng: 71, deals: 0 },
  ];
  return (
    <div className="ex-widget">
      <div className="ex-widget-h">Account-based engagement (ABM)</div>
      <div className="ex-widget-sub">Top companies represented at {ev.name} with rolled-up engagement score.</div>
      <div className="ex-acct-head"><span>Company</span><span>Attendees</span><span>Account score</span><span>Open deals</span></div>
      {accts.map(a => (
        <div key={a.co} className="ex-acct">
          <span className="ex-acct-co">{a.co}</span>
          <span>{a.n}</span>
          <div className="ex-acct-eng">
            <div className="ex-tier-bar"><div className="ex-tier-bar-fill" style={{ width: `${a.eng}%` }}/><span>{a.eng}</span></div>
          </div>
          <span><ExChip tint={a.deals ? '#16A34A' : '#94949E'}>{a.deals}</ExChip></span>
        </div>
      ))}
    </div>
  );
}

Object.assign(window, {
  EventExtras: {
    TicketsView, AgendaView, EmailsView, EngagementView, StreamingView, IntegrationsTabView, MobileEmbedView,
    CRMSyncWidget, WebhookFeedWidget, ReplayHubWidget, AttributionWidget, AccountsWidget,
  },
});
