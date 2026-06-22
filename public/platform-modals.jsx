/* global React, Icon, PLATFORM */
// Platform modals: Change Plan (real SpatialChat pricing) + Create Event wizard

const { useState: useModalState } = React;

function Modal({ title, sub, onClose, children, footer, size = 'mid' }) {
  return (
    <div className="plat-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={`plat-modal ${size}`}>
        <div className="plat-modal-head">
          <div>
            <div className="plat-modal-title">{title}</div>
            {sub && <div className="plat-modal-sub">{sub}</div>}
          </div>
          <button className="plat-modal-close" onClick={onClose}><Icon.close size={18}/></button>
        </div>
        <div className="plat-modal-body">{children}</div>
        {footer && <div className="plat-modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

/* ============================================================
   Change Plan modal
   ============================================================ */
function ChangePlanModal({ onClose, onToast }) {
  const plans = PLATFORM.plans;
  const [cycle, setCycle] = useModalState('monthly');
  const [tab, setTab] = useModalState('subscription');
  const [bizUsers, setBizUsers] = useModalState(100);
  const [packUsers, setPackUsers] = useModalState(50);
  const currentPlan = PLATFORM.billing.plan.toLowerCase();

  const bizTier = plans.businessTiers.find(t => t.users === bizUsers);
  const bizPrice = cycle === 'monthly' ? bizTier?.monthly : bizTier?.yearly;
  const packTier = plans.oneTime[1].tiers.find(t => t.users === packUsers);

  const pick = (name) => { onToast(`${name} selected — redirecting to checkout`); onClose(); };

  return (
    <Modal title="Choose your plan" sub="SpatialChat pricing — switch or upgrade anytime" onClose={onClose} size="wide"
      footer={<div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
        <button className="plat-cta ghost" onClick={onClose}>Maybe later</button>
        <a className="plat-cta" href="https://spatial.chat/pricing" target="_blank" rel="noopener noreferrer"><Icon.expand size={14}/> Full comparison</a>
      </div>}>

      <div className="plan-tabs">
        <button className={`plan-tab ${tab === 'subscription' ? 'active' : ''}`} onClick={() => setTab('subscription')}>Subscription</button>
        <button className={`plan-tab ${tab === 'onetime' ? 'active' : ''}`} onClick={() => setTab('onetime')}>One-time event</button>
      </div>

      {tab === 'subscription' && (
        <>
          <div className="plan-toggle">
            <div className="plan-seg">
              <button className={`plan-seg-btn ${cycle === 'monthly' ? 'active' : ''}`} onClick={() => setCycle('monthly')}>Monthly</button>
              <button className={`plan-seg-btn ${cycle === 'yearly' ? 'active' : ''}`} onClick={() => setCycle('yearly')}>Yearly</button>
            </div>
            <span className="plan-save">Save up to 40%</span>
          </div>

          <div className="plan-grid">
            {plans.subscription.map(p => {
              const isCurrent = p.id === currentPlan;
              let priceEl;
              if (p.id === 'free') priceEl = <div className="plan-price">$0<span className="per"> /mo</span></div>;
              else if (p.id === 'business') {
                priceEl = bizPrice
                  ? <div className="plan-price">${bizPrice.toLocaleString()}<span className="per"> /{cycle === 'monthly' ? 'mo' : 'yr'}</span></div>
                  : <div className="plan-price sales">Talk to Sales</div>;
              } else priceEl = <div className="plan-price sales">Custom</div>;
              return (
                <div key={p.id} className={`plan-card ${p.popular ? 'popular' : ''} ${isCurrent ? 'current' : ''}`}>
                  {isCurrent ? <span className="plan-badge cur">Current plan</span> : p.popular ? <span className="plan-badge">Most popular</span> : null}
                  <div className="plan-name">{p.name}</div>
                  <div className="plan-tagline">{p.tagline}</div>
                  {priceEl}
                  {p.id === 'business' && (
                    <div className="plan-users-sel">
                      {plans.businessTiers.map(t => (
                        <button key={t.users} className={`plan-user-chip ${bizUsers === t.users ? 'active' : ''}`} onClick={() => setBizUsers(t.users)}>
                          {t.users.toLocaleString()}
                        </button>
                      ))}
                    </div>
                  )}
                  <ul className="plan-feats">
                    {p.features.map((f, i) => (
                      <li key={i} className="plan-feat"><span className="plan-feat-ico"><Icon.check size={14}/></span>{f}</li>
                    ))}
                  </ul>
                  {isCurrent
                    ? <button className="plan-cta current">Your current plan</button>
                    : <button className={`plan-cta ${p.popular ? 'primary' : ''}`} onClick={() => pick(p.name)}>
                        {p.id === 'business' && !bizPrice ? 'Talk to Sales' : p.cta}
                      </button>}
                </div>
              );
            })}
          </div>
        </>
      )}

      {tab === 'onetime' && (
        <div className="plan-grid" style={{ gridTemplateColumns: 'repeat(2, 1fr)', maxWidth: 720, margin: '0 auto' }}>
          {plans.oneTime.map(p => {
            const isPack = p.id === 'eventpack';
            return (
              <div key={p.id} className={`plan-card ${p.popular ? 'popular' : ''}`}>
                {p.popular && <span className="plan-badge">Best for big events</span>}
                <div className="plan-name">{p.name}</div>
                <div className="plan-tagline">{p.tagline}</div>
                <div className="plan-price">{isPack ? `$${packTier.day.toLocaleString()}` : p.price}<span className="per"> {isPack ? '/day' : p.unit}</span></div>
                {isPack && (
                  <div className="plan-users-sel">
                    {p.tiers.map(t => (
                      <button key={t.users} className={`plan-user-chip ${packUsers === t.users ? 'active' : ''}`} onClick={() => setPackUsers(t.users)}>{t.users.toLocaleString()}</button>
                    ))}
                  </div>
                )}
                {!isPack && <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginBottom: 6 }}>{p.alt}</div>}
                <ul className="plan-feats">
                  {p.features.map((f, i) => <li key={i} className="plan-feat"><span className="plan-feat-ico"><Icon.check size={14}/></span>{f}</li>)}
                </ul>
                <button className={`plan-cta ${p.popular ? 'primary' : ''}`} onClick={() => pick(p.name)}>{p.cta}</button>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

/* ============================================================
   Create Event wizard
   ============================================================ */
const WIZ_STEPS = ['Details', 'Space & Rooms', 'Registration', 'Review'];
const ROOM_TYPES = [
  { type: 'Stage', icon: Icon.broadcast, color: '#5B5BF5' },
  { type: 'Spatial', icon: Icon.grid, color: '#16A34A' },
  { type: 'Breakout', icon: Icon.users, color: '#F59E0B' },
  { type: 'Networking', icon: Icon.share, color: '#7C3AED' },
];
const TEMPLATES = [
  { id: 'conference', name: 'Conference', desc: 'Keynote stage + breakout rooms + networking', icon: Icon.broadcast, color: '#5B5BF5',
    rooms: [{ name: 'Keynote Room', type: 'Stage' }, { name: 'Breakout A', type: 'Breakout' }, { name: 'Breakout B', type: 'Breakout' }, { name: 'Networking Lounge', type: 'Networking' }] },
  { id: 'workshop', name: 'Workshop', desc: 'Stage + collaborative table rooms', icon: Icon.whiteboard, color: '#16A34A',
    rooms: [{ name: 'Main Stage', type: 'Stage' }, { name: 'Table Room 1', type: 'Spatial' }, { name: 'Table Room 2', type: 'Spatial' }] },
  { id: 'blank', name: 'Blank Space', desc: 'Start from scratch with one room', icon: Icon.plus, color: '#94949E',
    rooms: [{ name: 'Main Room', type: 'Stage' }] },
];

// ============================================================
// Create Event — Zuddl-style registration FLOW BUILDER
// ============================================================
let _fid = 100;
const nid = () => ++_fid;

function CreateEventModal({ onClose, onToast, inline, eventType }) {
  const [eventName, setEventName] = useModalState('Untitled event');
  const [sel, setSel] = useModalState('reg');
  const [published, setPublished] = useModalState(false);
  const [view, setView] = useModalState('details');
  const [css, setCss] = useModalState('');

  // Event details
  const [evLocation, setEvLocation] = useModalState('SpatialChat (online)');
  const [evDescription, setEvDescription] = useModalState('Join us for an interactive session with live speakers, breakout rooms and networking.');
  const [evDate, setEvDate] = useModalState(() => {
    const d = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    return d.toISOString().slice(0, 10);
  });
  const [evTime, setEvTime] = useModalState('17:00');
  const [evTimezone, setEvTimezone] = useModalState('UTC');
  const [evCapacity, setEvCapacity] = useModalState('250');
  const [evType, setEvType] = useModalState(eventType === 'webinar' ? 'webinar' : 'virtual');
  const [requireApproval, setRequireApproval] = useModalState(false);
  const [ticketType, setTicketType] = useModalState('free');
  const [inviteInput, setInviteInput] = useModalState('');
  const [invitees, setInvitees] = useModalState([]);

  const addInvitees = () => {
    const parts = inviteInput.split(/[\s,;]+/).map(s => s.trim()).filter(Boolean);
    const valid = parts.filter(e => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
    if (!valid.length) { onToast('Enter at least one valid email'); return; }
    setInvitees(list => Array.from(new Set([...list, ...valid])));
    setInviteInput('');
    onToast(`${valid.length} invitee${valid.length === 1 ? '' : 's'} added`);
  };
  const removeInvitee = (e) => setInvitees(list => list.filter(x => x !== e));
  const fileInputRef = React.useRef(null);
  const onImportClick = () => fileInputRef.current && fileInputRef.current.click();
  const onImportFile = async (ev) => {
    const files = Array.from(ev.target.files || []);
    if (!files.length) return;
    let added = 0, skipped = 0;
    const collected = [];
    for (const f of files) {
      try {
        const text = await f.text();
        const parts = text.split(/[\s,;\r\n\t"']+/).map(s => s.trim()).filter(Boolean);
        for (const p of parts) {
          if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p)) collected.push(p.toLowerCase());
          else if (p.includes('@')) skipped++;
        }
      } catch { /* ignore */ }
    }
    if (!collected.length) { onToast('No valid emails found in file'); ev.target.value = ''; return; }
    setInvitees(list => {
      const set = new Set(list);
      collected.forEach(e => { if (!set.has(e)) { set.add(e); added++; } });
      return Array.from(set);
    });
    onToast(`Imported ${added} email${added === 1 ? '' : 's'}${skipped ? ` · ${skipped} skipped` : ''}`);
    ev.target.value = '';
  };


  const [regFields, setRegFields] = useModalState([
    { id: 1, label: 'First name', ph: 'Enter first name', locked: true },
    { id: 2, label: 'Last name', ph: 'Enter last name', locked: true },
    { id: 3, label: 'Email address', ph: 'Enter email address', locked: true },
    { id: 4, label: 'How will you be attending?', ph: 'Select answer', type: 'select' },
  ]);
  const [prefFields, setPrefFields] = useModalState([
    { id: 11, label: 'Which city are you from?', ph: 'Select city', type: 'select' },
    { id: 12, label: 'Dietary preferences', ph: 'Choose preferences', type: 'select' },
    { id: 13, label: 'Emergency contact', ph: 'Name and contact number' },
  ]);
  const [tickets, setTickets] = useModalState([
    { id: 21, name: 'Diamond', price: '$200' },
    { id: 22, name: 'Gold', price: '$80' },
    { id: 23, name: 'Virtual', price: 'Free' },
  ]);

  const addRegField = () => setRegFields(f => [...f, { id: nid(), label: 'New question', ph: 'Enter answer' }]);
  const delRegField = (id) => setRegFields(f => f.filter(x => x.id !== id));
  const editRegField = (id, label) => setRegFields(f => f.map(x => x.id === id ? { ...x, label } : x));
  const addPref = () => setPrefFields(f => [...f, { id: nid(), label: 'New question', ph: 'Enter answer' }]);
  const delPref = (id) => setPrefFields(f => f.filter(x => x.id !== id));
  const editPref = (id, label) => setPrefFields(f => f.map(x => x.id === id ? { ...x, label } : x));
  const addTicket = () => setTickets(t => [...t, { id: nid(), name: 'New tier', price: '$0' }]);
  const delTicket = (id) => setTickets(t => t.filter(x => x.id !== id));
  const editTicket = (id, k, v) => setTickets(t => t.map(x => x.id === id ? { ...x, [k]: v } : x));

  if (published) {
    // Build a Google Calendar link with the event details
    const pad = (n) => String(n).padStart(2, '0');
    const start = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    start.setUTCHours(17, 0, 0, 0);
    const end = new Date(start.getTime() + 60 * 60 * 1000);
    const fmtG = (d) => `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE`
      + `&text=${encodeURIComponent(eventName)}`
      + `&dates=${fmtG(start)}/${fmtG(end)}`
      + `&details=${encodeURIComponent('Join us on SpatialChat. Registration link will be shared.')}`
      + `&location=${encodeURIComponent('SpatialChat (online)')}`;
    return (
      <div className={inline ? 'fb-inline-wrap' : 'fb-overlay'}>
        <div className="fb-success">
          <div className="fb-success-ico"><Icon.check size={38}/></div>
          <div className="fb-success-h">{eventName} is live 🎉</div>
          <div className="fb-success-p">Your registration flow is published. Share the link, add it to your calendar, or open the event space to start customizing rooms.</div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 24, flexWrap: 'wrap' }}>
            <button className="plat-cta ghost" onClick={() => onToast('Registration link copied')}><Icon.share size={14}/> Copy link</button>
            <a className="plat-cta ghost" href={gcalUrl} target="_blank" rel="noreferrer" onClick={() => onToast('Opening Google Calendar…')}>
              <Icon.calendar size={14}/> Add to Google Calendar
            </a>
            <button className="plat-cta" onClick={onClose}><Icon.door size={14}/> Open event space</button>
          </div>
        </div>
      </div>
    );
  }

  const FieldRow = ({ f, onEdit, onDel }) => (
    <div className={`fb-field ${sel === 'reg' || sel === 'pref' ? '' : ''}`}>
      <div className="fb-field-label">
        <input value={f.label} onChange={e => onEdit(f.id, e.target.value)} spellCheck={false}/>
        {!f.locked && <button className="fb-field-del" onClick={() => onDel(f.id)} title="Remove"><Icon.close size={13}/></button>}
      </div>
      {f.type === 'select'
        ? <div className="fb-input fb-select">{f.ph}<Icon.caretDown size={14}/></div>
        : <div className="fb-input">{f.ph}</div>}
    </div>
  );

  return (
    <div className={inline ? 'fb-inline-wrap' : 'fb-overlay'}>
      <div className={`fb-shell ${inline ? 'fb-inline' : ''}`}>
        {/* Top bar */}
        <div className="fb-top">
          <div className="fb-top-left">
            <button className="fb-icon-btn" onClick={onClose} title="Close"><Icon.caretRight size={18} style={{ transform: 'rotate(180deg)' }}/></button>
            <span className="fb-logo-dot"/>
            <input className="fb-name" value={eventName} onChange={e => setEventName(e.target.value)} spellCheck={false}/>
            <span className="fb-draft">Draft</span>
          </div>
          <div className="fb-top-tabs">
            <button className={`fb-tab ${view === 'details' ? 'active' : ''}`} onClick={() => setView('details')}>Event details</button>
            <button className={`fb-tab ${view === 'registration' ? 'active' : ''}`} onClick={() => setView('registration')}>Registration</button>
            <button className={`fb-tab ${view === 'builder' ? 'active' : ''}`} onClick={() => setView('builder')}>Landing page</button>
            <button className={`fb-tab ${view === 'branding' ? 'active' : ''}`} onClick={() => setView('branding')}>Branding &amp; CSS</button>
          </div>
          <div className="fb-top-right">
            <button className="fb-ghost-btn" onClick={() => onToast('Running test flow…')}><Icon.caretRight size={14}/> Test flow</button>
            <button className="fb-publish" onClick={() => {
              setPublished(true);
              if (invitees.length) onToast(`Event published · invites sent to ${invitees.length} attendee${invitees.length === 1 ? '' : 's'}`);
              else onToast('Event published');
            }}><Icon.send size={14}/> Publish</button>
          </div>

        </div>

        {/* Canvas */}
        {view === 'registration' && <div className="fb-canvas">
          <div className="fb-flow">
            {/* Start */}
            <div className="fb-col">
              <div className="fb-flow-label">Attendee journey</div>
              <div className="fb-start"><Icon.caretRight size={13}/> Start</div>
            </div>
            <FbConn onAdd={() => onToast('Add step between nodes')}/>

            {/* Registration form */}
            <FlowNode id="reg" sel={sel} setSel={setSel} icon={Icon.doc} title="Registration form" tint="#5B5BF5" onMore={() => onToast('Form settings')}>
              {regFields.map(f => <FieldRow key={f.id} f={f} onEdit={editRegField} onDel={delRegField}/>)}
              <button className="fb-add-field" onClick={addRegField}><Icon.plus size={13}/> Add question</button>
              <button className="fb-node-cta" onClick={() => onToast('Preview: Register now')}>Register now</button>
            </FlowNode>
            <FbConn onAdd={() => onToast('Add step')}/>

            {/* Preferences */}
            <FlowNode id="pref" sel={sel} setSel={setSel} icon={Icon.doc} title="Attendee preferences" tint="#7C3AED" onMore={() => onToast('Form settings')}>
              {prefFields.map(f => <FieldRow key={f.id} f={f} onEdit={editPref} onDel={delPref}/>)}
              <button className="fb-add-field" onClick={addPref}><Icon.plus size={13}/> Add question</button>
              <button className="fb-node-cta" onClick={() => onToast('Preview: Continue')}>Continue</button>
            </FlowNode>
            <FbConn onAdd={() => onToast('Add step')}/>

            {/* Ticket selection */}
            <FlowNode id="tickets" sel={sel} setSel={setSel} icon={Icon.receipt} title="Ticket selection" tint="#0EA5E9" onMore={() => onToast('Ticket settings')}>
              {tickets.map(t => (
                <div key={t.id} className="fb-ticket">
                  <div className="fb-ticket-main">
                    <input className="fb-ticket-name" value={t.name} onChange={e => editTicket(t.id, 'name', e.target.value)} spellCheck={false}/>
                    <input className="fb-ticket-price" value={t.price} onChange={e => editTicket(t.id, 'price', e.target.value)} spellCheck={false}/>
                  </div>
                  {tickets.length > 1 && <button className="fb-field-del" onClick={() => delTicket(t.id)}><Icon.close size={13}/></button>}
                </div>
              ))}
              <button className="fb-add-field" onClick={addTicket}><Icon.plus size={13}/> Add ticket tier</button>
            </FlowNode>
            <FbConn onAdd={() => onToast('Add step between nodes')}/>

            {/* Payment gateway */}
            <FlowNode id="pay" sel={sel} setSel={setSel} icon={Icon.receipt} title="Payment gateway" tint="#16A34A" compact onMore={() => onToast('Payment settings')}>
              <div className="fb-pay">
                <span className="fb-pay-status"><span className="fb-pay-dot"/> Connected</span>
                <span className="fb-pay-stripe">stripe</span>
              </div>
              <div className="fb-pay-note">Card, Apple Pay & Google Pay enabled</div>
              <button className="fb-add-field" onClick={() => onToast('Manage payment methods')}><Icon.plus size={13}/> Payment methods</button>
            </FlowNode>
            <FbConn onAdd={() => onToast('Add step between nodes')}/>

            {/* Confirmation email */}
            <FlowNode id="email" sel={sel} setSel={setSel} icon={Icon.chat} title="Confirmation email" tint="#EC4899" compact onMore={() => onToast('Edit email template')}>
              <div className="fb-email-sub">Subject</div>
              <div className="fb-input">You're in! Here are your event details</div>
              <div className="fb-email-sub">Includes</div>
              <div className="fb-email-chips">
                <span className="wiz-chip"><Icon.calendar size={11}/> Calendar invite</span>
                <span className="wiz-chip"><Icon.door size={11}/> Join link</span>
                <span className="wiz-chip"><Icon.doc size={11}/> Ticket PDF</span>
              </div>
              <button className="fb-add-field" onClick={() => onToast('Edit email template')}><Icon.pencil size={13}/> Edit template</button>
            </FlowNode>
            <FbConn onAdd={() => onToast('Add step between nodes')}/>

            {/* Thank you */}
            <FlowNode id="thanks" sel={sel} setSel={setSel} icon={Icon.star} title="Thank You page" tint="#F59E0B" compact onMore={() => onToast('Edit thank-you page')}>
              <div className="fb-thanks-h">Your registration was successful! 🎉</div>
              <div className="fb-thanks-p">We've sent you an email with your ticket details and the event link.</div>
              <div className="fb-thanks-preview">
                <div className="fb-thanks-row"><span/><span/></div>
                <div className="fb-thanks-row"><span/><span/></div>
              </div>
            </FlowNode>
          </div>
        </div>}

        {view === 'details' && <DetailsView
          name={eventName} setName={setEventName}
          location={evLocation} setLocation={setEvLocation}
          description={evDescription} setDescription={setEvDescription}
          date={evDate} setDate={setEvDate}
          time={evTime} setTime={setEvTime}
          timezone={evTimezone} setTimezone={setEvTimezone}
          capacity={evCapacity} setCapacity={setEvCapacity}
          type={evType} setType={setEvType}
          requireApproval={requireApproval} setRequireApproval={setRequireApproval}
          ticketType={ticketType} setTicketType={setTicketType}
          inviteInput={inviteInput} setInviteInput={setInviteInput}
          invitees={invitees} addInvitees={addInvitees} removeInvitee={removeInvitee}
          fileInputRef={fileInputRef} onImportClick={onImportClick} onImportFile={onImportFile}
          onNext={() => setView('registration')}
        />}
        {view === 'builder' && <BuilderView onToast={onToast}/>}
        {view === 'branding' && <BrandingView css={css} setCss={setCss} onToast={onToast}/>}

      </div>
    </div>
  );
}

function FlowNode({ id, sel, setSel, icon, title, tint, compact, onMore, children }) {
  const Ic = icon;
  return (
    <div className={`fb-node ${sel === id ? 'sel' : ''} ${compact ? 'compact' : ''}`} onMouseDown={() => setSel(id)}>
      <div className="fb-node-head">
        <span className="fb-node-ico" style={{ background: `${tint}1A`, color: tint }}><Ic size={15}/></span>
        <span className="fb-node-title">{title}</span>
        <button className="fb-node-more" onClick={(e) => { e.stopPropagation(); onMore && onMore(); }}><Icon.more size={16}/></button>
      </div>
      <div className="fb-node-body">{children}</div>
    </div>
  );
}

function FbConn({ onAdd }) {
  return (
    <div className="fb-conn">
      <span className="fb-conn-line"/>
      {onAdd && <button className="fb-conn-add" onClick={onAdd} title="Add step"><Icon.plus size={14}/></button>}
    </div>
  );
}

// ---- Event details form ----
const TIMEZONES = ['UTC', 'America/Los_Angeles', 'America/New_York', 'America/Chicago', 'Europe/London', 'Europe/Berlin', 'Europe/Paris', 'Asia/Dubai', 'Asia/Kolkata', 'Asia/Singapore', 'Asia/Tokyo', 'Australia/Sydney'];

function DetailsView({
  name, setName, location, setLocation, description, setDescription,
  date, setDate, time, setTime, timezone, setTimezone,
  capacity, setCapacity, type, setType,
  requireApproval, setRequireApproval, ticketType, setTicketType,
  inviteInput, setInviteInput, invitees, addInvitees, removeInvitee,
  fileInputRef, onImportClick, onImportFile, onNext
}) {
  return (
    <div className="ev-details">
      <div className="ev-details-inner">
        <div className="ev-details-head">
          <div className="ev-details-h">Event details</div>
          <div className="ev-details-sub">Set up the basics — these power the registration page, calendar invites and confirmation emails.</div>
        </div>

        <div className="ev-section">
          <div className="ev-section-title">Basics</div>
          <div className="ev-grid">
            <label className="ev-field ev-col-2">
              <span className="ev-label">Event name</span>
              <input className="ev-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. GlowFlow Summit 2026"/>
            </label>
            <label className="ev-field ev-col-2">
              <span className="ev-label">Description</span>
              <textarea className="ev-input ev-textarea" rows={3} value={description} onChange={e => setDescription(e.target.value)} placeholder="Tell attendees what to expect"/>
            </label>
            <label className="ev-field ev-col-2">
              <span className="ev-label">Location</span>
              <input className="ev-input" value={location} onChange={e => setLocation(e.target.value)} placeholder="SpatialChat (online) or physical address"/>
            </label>
          </div>
        </div>

        <div className="ev-section">
          <div className="ev-section-title">Date &amp; time</div>
          <div className="ev-grid">
            <label className="ev-field">
              <span className="ev-label">Date</span>
              <input type="date" className="ev-input" value={date} onChange={e => setDate(e.target.value)}/>
            </label>
            <label className="ev-field">
              <span className="ev-label">Start time</span>
              <input type="time" className="ev-input" value={time} onChange={e => setTime(e.target.value)}/>
            </label>
            <label className="ev-field ev-col-2">
              <span className="ev-label">Timezone</span>
              <select className="ev-input" value={timezone} onChange={e => setTimezone(e.target.value)}>
                {TIMEZONES.map(tz => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </label>
          </div>
        </div>

        <div className="ev-section">
          <div className="ev-section-title">Format &amp; access</div>
          <div className="ev-grid">
            <div className="ev-field ev-col-2">
              <span className="ev-label">Event type</span>
              <div className="ev-seg">
                {[
                  { id: 'webinar', label: 'Webinar', desc: 'One-to-many broadcast' },
                  { id: 'virtual', label: 'Virtual event', desc: 'Multi-room with breakouts' },
                  { id: 'hybrid', label: 'Hybrid', desc: 'In-person + online' },
                ].map(o => (
                  <button key={o.id} type="button" className={`ev-seg-opt ${type === o.id ? 'on' : ''}`} onClick={() => setType(o.id)}>
                    <span className="ev-seg-name">{o.label}</span>
                    <span className="ev-seg-desc">{o.desc}</span>
                  </button>
                ))}
              </div>
            </div>
            <label className="ev-field">
              <span className="ev-label">Capacity</span>
              <input type="number" min="1" className="ev-input" value={capacity} onChange={e => setCapacity(e.target.value)}/>
            </label>
            <div className="ev-field">
              <span className="ev-label">Ticket type</span>
              <div className="ev-seg ev-seg-2">
                <button type="button" className={`ev-seg-opt ${ticketType === 'free' ? 'on' : ''}`} onClick={() => setTicketType('free')}>
                  <span className="ev-seg-name">Free</span>
                  <span className="ev-seg-desc">No payment required</span>
                </button>
                <button type="button" className={`ev-seg-opt ${ticketType === 'paid' ? 'on' : ''}`} onClick={() => setTicketType('paid')}>
                  <span className="ev-seg-name">Paid</span>
                  <span className="ev-seg-desc">Charge via Stripe</span>
                </button>
              </div>
            </div>
            <label className="ev-toggle-row ev-col-2">
              <div>
                <div className="ev-label">Require registration approval</div>
                <div className="ev-help">Admins manually approve each signup before they receive a confirmation email.</div>
              </div>
              <button type="button" className={`ev-toggle ${requireApproval ? 'on' : ''}`} onClick={() => setRequireApproval(v => !v)} aria-pressed={requireApproval}>
                <span className="ev-toggle-knob"/>
              </button>
            </label>
          </div>
        </div>

        <div className="ev-section">
          <div className="ev-section-title">Invite attendees</div>
          <div className="ev-help" style={{ marginBottom: 10 }}>Add emails individually or import a CSV/TXT file to trigger invitation emails with the event landing page link as soon as you publish.</div>
          <div className="ev-invite-row">
            <input className="ev-input" value={inviteInput} onChange={e => setInviteInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addInvitees(); } }}
              placeholder="alex@acme.com, sam@startup.io"/>
            <button className="plat-cta ghost" onClick={onImportClick} type="button" title="Import emails from a CSV or text file"><Icon.upload size={14}/> Import</button>
            <button className="plat-cta" onClick={addInvitees} type="button"><Icon.plus size={14}/> Add</button>
            <input ref={fileInputRef} type="file" accept=".csv,.txt,.tsv,text/csv,text/plain" multiple style={{ display: 'none' }} onChange={onImportFile}/>
          </div>
          {invitees.length > 0 && (
            <div className="ev-invitees">
              <div className="ev-invitees-head">{invitees.length} attendee{invitees.length === 1 ? '' : 's'} will receive an invite</div>
              <div className="ev-chips">
                {invitees.map(e => (
                  <span key={e} className="ev-chip">
                    <Icon.user size={12}/> {e}
                    <button onClick={() => removeInvitee(e)} title="Remove"><Icon.close size={11}/></button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="ev-details-actions">
          <button className="plat-cta" onClick={onNext}>Continue to registration <Icon.caretRight size={14}/></button>
        </div>
      </div>
    </div>
  );
}


// ---- Landing-page (site template) builder ----
const BUILDER_WIDGETS = [
  { label: 'Schedule', icon: Icon.calendar }, { label: 'Contact Form', icon: Icon.doc },
  { label: 'Media Slider', icon: Icon.video }, { label: 'Text', icon: Icon.text },
  { label: 'Button', icon: Icon.grid }, { label: 'Image', icon: Icon.whiteboard },
  { label: 'Icon', icon: Icon.star }, { label: 'Map', icon: Icon.globe },
  { label: 'Photo Gallery', icon: Icon.user }, { label: 'Embed HTML', icon: Icon.code },
];
function BuilderView({ onToast }) {
  const [blocks, setBlocks] = useModalState([]);
  const addBlock = (w) => { setBlocks(b => [...b, { id: nid(), type: w.label }]); onToast(`${w.label} added to page`); };
  const delBlock = (id) => setBlocks(b => b.filter(x => x.id !== id));

  const renderBlock = (b) => {
    switch (b.type) {
      case 'Schedule': return <div className="bb-schedule">{['9:00 — Doors open','10:00 — Keynote','11:30 — Breakouts','14:00 — Networking'].map(s => <div key={s} className="bb-sched-row"><Icon.clock size={14}/> {s}</div>)}</div>;
      case 'Contact Form': return <div className="bb-form"><div className="bb-form-row">Name</div><div className="bb-form-row">Email</div><div className="bb-form-row">Message</div><button className="bb-form-btn">Send message</button></div>;
      case 'Media Slider': return <div className="bb-slider"><div className="bb-slide">Slide 1</div><div className="bb-slide alt">Slide 2</div><div className="bb-slide alt2">Slide 3</div></div>;
      case 'Text': return <div className="bb-text">Double-click to edit this text block. Tell attendees what makes your event unmissable.</div>;
      case 'Button': return <button className="bb-cta">Register now</button>;
      case 'Image': return <div className="bb-image"><Icon.whiteboard size={26}/></div>;
      case 'Icon': return <div className="bb-icons">{[Icon.star,Icon.broadcast,Icon.users].map((I,i)=><span key={i} className="bb-icon"><I size={20}/></span>)}</div>;
      case 'Map': return <div className="bb-map"><Icon.globe size={26}/> Raleigh, NC</div>;
      case 'Photo Gallery': return <div className="bb-gallery">{[0,1,2,3].map(i=><span key={i} className="bb-gphoto"/>)}</div>;
      default: return <div className="bb-text" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>&lt;embed /&gt; — paste your HTML or embed code</div>;
    }
  };

  return (
    <div className="bld">
      <div className="bld-side">
        <div className="bld-side-title">Widgets</div>
        <div className="bld-side-sub">Click to add to your page</div>
        <div className="bld-widgets">
          {BUILDER_WIDGETS.map(w => (
            <button key={w.label} className="bld-widget" onClick={() => addBlock(w)}>
              <span className="bld-widget-ico"><w.icon size={18}/></span>
              {w.label}
            </button>
          ))}
        </div>
      </div>
      <div className="bld-canvas">
        <div className="bld-page">
          <div className="bld-nav">
            <span className="bld-nav-logo">#glowflow</span>
            <span className="bld-nav-links"><span>About</span><span>Why Attend</span><span>Speakers</span><span>Schedule</span></span>
            <button className="bld-nav-cta" onClick={() => onToast('Edit Register button')}>Register</button>
          </div>
          <div className="bld-hero">
            <div className="bld-hero-title">Slide Title</div>
            <div className="bld-hero-sub">Slide description</div>
            <button className="bld-hero-btn" onClick={() => onToast('Edit button')}>Button</button>
            <div className="bld-dots"><span className="on"/><span/><span/></div>
            <button className="bld-section-tag">Section · Media Slider</button>
          </div>
          <div className="bld-about">
            <div className="bld-about-h">About #GLOWFLOW Summit</div>
            <div className="bld-about-p">An invite-only conference for entrepreneurs, growth marketers, and product owners from consumer brands.</div>
          </div>

          {blocks.map(b => (
            <div key={b.id} className="bb-block">
              <div className="bb-block-tag">{b.type}<button className="bb-block-del" onClick={() => delBlock(b.id)}><Icon.close size={12}/></button></div>
              {renderBlock(b)}
            </div>
          ))}

          <button className="bld-add-row" onClick={() => onToast('Pick a widget from the left to add a section')}>
            <Icon.plus size={16}/> Add a section
          </button>
        </div>
      </div>
    </div>
  );
}

// ---- Branding + Custom CSS generator ----
const CSS_PRESET = `@import url('https://fonts.googleapis.com/css2?family=Open+Sans&display=swap');

.Form__label { font-family: 'Open Sans', sans-serif; color: #fff; }
.Form__heading { font-weight: 700; color: #fff; }
.Form__wrap { background: #3B1366; border-radius: 22px; }
.Form__input { background: rgba(255,255,255,0.08); color: #fff; border-color: rgba(255,255,255,0.25); }
.Form__button { background: #E84CC0 !important; color: #fff; border-radius: 999px; }`;

function BrandingView({ css, setCss, onToast }) {
  return (
    <div className="brand">
      <div className="brand-left">
        <div className="brand-bar">
          <span className="brand-title">Registration form preview</span>
          <button className="fb-publish" onClick={() => onToast('Branding saved')}><Icon.check size={14}/> Save</button>
        </div>
        <div className="brand-preview">
          <style dangerouslySetInnerHTML={{ __html: css }}/>
          <div className="Form__wrap brand-form">
            <div className="Form__field"><div className="Form__label">First name</div><div className="Form__input">Enter first name</div></div>
            <div className="Form__field"><div className="Form__label">Last name</div><div className="Form__input">Enter last name</div></div>
            <div className="Form__field"><div className="Form__label">Email address</div><div className="Form__input">Enter email address</div></div>
            <div className="Form__field"><div className="Form__label">How will you be attending?</div><div className="Form__input Form__select">Select answer <Icon.caretDown size={14}/></div></div>
            <button className="Form__button">Register Now</button>
          </div>
        </div>
      </div>
      <div className="brand-right">
        <div className="brand-css-head"><Icon.code size={16}/> Custom CSS</div>
        <div className="brand-css-sub">Add custom styles to your registration flow.</div>
        <div className="brand-css-presets">
          <button className="brand-preset" onClick={() => setCss(CSS_PRESET)}>✨ Generate theme</button>
          <button className="brand-preset ghost" onClick={() => setCss('')}>Clear</button>
        </div>
        <textarea className="brand-css-area" value={css} onChange={e => setCss(e.target.value)} spellCheck={false}
          placeholder={"Eg: .Form__heading {\n  color: #000000;\n}"}/>
      </div>
    </div>
  );
}

function SpacePickerModal({ onClose, onPick }) {
  const spaces = PLATFORM.spaces;
  return (
    <Modal title="Choose your space" sub="Pick a space to jump into" onClose={onClose} size="mid"
      footer={<div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
        <button className="plat-cta ghost" onClick={onClose}>Cancel</button>
        <button className="plat-cta" onClick={() => onPick(spaces[0])}><Icon.plus size={14}/> New space</button>
      </div>}>
      <div className="sp-list">
        {spaces.map(s => (
          <div key={s.id} className="sp-row" onClick={() => onPick(s)}>
            <span className="sp-mark" style={{ background: s.accent }}>{s.initials}</span>
            <span className="sp-info">
              <span className="sp-name">
                {s.name}
                {s.live > 0 && <span className="sp-live"><span className="sp-live-dot"/> {s.live} live</span>}
              </span>
              <span className="sp-sub">{s.team} · {s.visited}</span>
            </span>
            <span className="sp-enter">Enter <Icon.caretRight size={13}/></span>
          </div>
        ))}
      </div>
    </Modal>
  );
}

const CREATE_TYPES = [
  { id: 'webinar', name: 'Webinar', desc: 'One-to-many broadcast — speakers on stage, audience watching.', icon: Icon.broadcast, tint: '#5B5BF5' },
  { id: 'virtual', name: 'Virtual Event', desc: 'Multi-room experience with stages, breakouts and networking.', icon: Icon.grid, tint: '#16A34A' },
];

function CreateEventIntro({ stage, setStage, type, setType, onCancel, onToast }) {
  return (
    <div className="cei-wrap">
      <div className="cei-card">
        <button className="cei-close" onClick={onCancel}><Icon.close size={18}/></button>
        <div className="cei-steps">
          <span className={`cei-step ${stage === 'type' ? 'on' : 'done'}`}>1</span>
          <span className="cei-step-line"/>
          <span className={`cei-step ${stage === 'method' ? 'on' : ''}`}>2</span>
        </div>

        {stage === 'type' && <>
          <div className="cei-h">What kind of event?</div>
          <div className="cei-sub">Choose the format — you can customize everything later.</div>
          <div className="cei-options">
            {CREATE_TYPES.map(t => (
              <button key={t.id} className={`cei-opt ${type === t.id ? 'sel' : ''}`} onClick={() => setType(t.id)}>
                <span className="cei-opt-ico" style={{ background: `${t.tint}1A`, color: t.tint }}><t.icon size={24}/></span>
                <span className="cei-opt-name">{t.name}</span>
                <span className="cei-opt-desc">{t.desc}</span>
                {type === t.id && <span className="cei-opt-check"><Icon.check size={14}/></span>}
              </button>
            ))}
          </div>
          <div className="cei-actions">
            <button className="plat-cta ghost" onClick={onCancel}>Cancel</button>
            <button className="plat-cta" onClick={() => setStage('method')}>Continue <Icon.caretRight size={14}/></button>
          </div>
        </>}

        {stage === 'method' && <>
          <div className="cei-h">How do you want to build it?</div>
          <div className="cei-sub">Start from scratch, or let SpatialChat AI draft it for you.</div>
          <div className="cei-options">
            <button className="cei-opt" onClick={() => setStage('build')}>
              <span className="cei-opt-ico" style={{ background: 'rgba(43,111,219,0.1)', color: '#2B6FDB' }}><Icon.pencil size={24}/></span>
              <span className="cei-opt-name">Create manually</span>
              <span className="cei-opt-desc">Build your registration flow and landing page step by step.</span>
            </button>
            <button className="cei-opt ai" onClick={() => { onToast('SpatialChat AI is drafting your event…'); setStage('build'); }}>
              <span className="cei-opt-ico" style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)', color: '#fff' }}><Icon.megaphone size={24}/></span>
              <span className="cei-opt-name">With SpatialChat AI <span className="cei-ai-badge">AI</span></span>
              <span className="cei-opt-desc">Describe your event and we'll generate rooms, registration and emails.</span>
            </button>
          </div>
          <div className="cei-actions">
            <button className="plat-cta ghost" onClick={() => setStage('type')}><Icon.caretRight size={14} style={{ transform: 'rotate(180deg)' }}/> Back</button>
          </div>
        </>}
      </div>
    </div>
  );
}

Object.assign(window, { ChangePlanModal, CreateEventModal, SpacePickerModal, CreateEventIntro });
