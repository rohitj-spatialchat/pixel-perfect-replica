/* global React */
// Custom guided tour for the Stage Room — "Glass immersive spotlight" style.
// Uses an SVG-mask spotlight that smoothly scales/translates between targets,
// with a glassmorphism guide card above/below the highlighted element.

const { useState: useTourState, useEffect: useTourFx, useLayoutEffect: useTourLayout, useRef: useTourRef } = React;

const ADMIN_STEPS = [
  { sel: '.stage-nav-tabs', title: 'Move around the event', body: 'Switch between the Stage, breakout Rooms, the live Agenda and your Sponsors — all from the top nav.', placement: 'bottom' },
  { sel: '.stage-nav-actions', title: 'See your audience & go live', body: 'Track who is watching and hit Go Live when you’re ready to broadcast to attendees or out to LinkedIn / YouTube.', placement: 'bottom' },
  { sel: '.stage-canvas', title: 'Your stage canvas', body: 'Speakers, captions and on-stage polls all render here. Customise the backdrop and logo at any time.', placement: 'top' },
  { sel: '.stage-controls', title: 'Run the broadcast', body: 'Mic, camera, captions and stage customisation live in this cluster — your day-of-show essentials.', placement: 'top' },
  { sel: '.stage-record', title: 'Record in HD or 4K', body: 'Pick your quality and start recording. Saved straight to the event when the session ends.', placement: 'top' },
  { sel: '.stage-cbtn.on, .stage-cbtn[title*="transcrib"]', title: 'Live transcription', body: 'Turn on captions + transcription. Transcripts are saved to the event tab so attendees can revisit later.', placement: 'top' },
  { sel: '.stage-side-tabs', title: 'Engage the room', body: 'Run Chat, Q&A and Polls from the side panel — push the best questions or polls onto the stage in one click.', placement: 'left' },
  { sel: '.stage-cbtn.danger', title: 'Wrap the event', body: 'When you leave, recording stops and your transcript + analytics are filed under the event automatically.', placement: 'top' },
];

const GUEST_STEPS = [
  { sel: '.stage-nav-tabs', title: 'Welcome to the event', body: 'Hop between the live Stage, breakout Rooms, the Agenda and Sponsors right here.', placement: 'bottom' },
  { sel: '.stage-canvas', title: 'The main stage', body: 'Speakers are live here. Turn on captions any time if you prefer to read along.', placement: 'top' },
  { sel: '.stage-cbtn.on', title: 'Mic & camera', body: 'You join muted by default. Unmute or share video when a host invites you up.', placement: 'top' },
  { sel: '.stage-raise', title: 'Raise your hand', body: 'Want to speak or ask something out loud? Raise your hand and the host will see it.', placement: 'top' },
  { sel: '.stage-side-tab', title: 'Chat with the room', body: 'Group chat, direct messages, Q&A and Polls all live in this side panel.', placement: 'left' },
  { sel: '.stage-side-tabs', title: 'Ask a question', body: 'Drop questions in Q&A and upvote others — the host pulls top questions on stage.', placement: 'left' },
  { sel: '.stage-attendee-pill', title: 'You’re not alone', body: 'See how many people are watching live with you — engagement gets better the more you participate.', placement: 'bottom' },
];

function StageTour({ role = 'admin', onFinish }) {
  const STEPS = role === 'guest' ? GUEST_STEPS : ADMIN_STEPS;
  const [i, setI] = useTourState(0);
  const [rect, setRect] = useTourState(null);
  const [cardPos, setCardPos] = useTourState({ left: 0, top: 0, placement: 'bottom' });
  const cardRef = useTourRef(null);

  const measure = () => {
    const step = STEPS[i];
    if (!step) return;
    const el = document.querySelector(step.sel);
    if (!el) { setRect(null); return; }
    const r = el.getBoundingClientRect();
    const pad = 12;
    const target = {
      x: r.left - pad,
      y: r.top - pad,
      w: r.width + pad * 2,
      h: r.height + pad * 2,
    };
    setRect(target);

    // Place card around the target
    const cw = 380, ch = 280;
    const margin = 22;
    let placement = step.placement || 'bottom';
    let left, top;
    if (placement === 'bottom' && target.y + target.h + ch + margin < window.innerHeight) {
      left = target.x + target.w / 2 - cw / 2;
      top = target.y + target.h + margin;
    } else if (placement === 'top' && target.y - ch - margin > 0) {
      left = target.x + target.w / 2 - cw / 2;
      top = target.y - ch - margin;
    } else if (placement === 'left' && target.x - cw - margin > 0) {
      left = target.x - cw - margin;
      top = target.y + target.h / 2 - ch / 2;
    } else if (placement === 'right' && target.x + target.w + cw + margin < window.innerWidth) {
      left = target.x + target.w + margin;
      top = target.y + target.h / 2 - ch / 2;
    } else {
      // Fallback: above if there's room, else below, else centered
      if (target.y > window.innerHeight / 2) {
        left = target.x + target.w / 2 - cw / 2;
        top = Math.max(margin, target.y - ch - margin);
        placement = 'top';
      } else {
        left = target.x + target.w / 2 - cw / 2;
        top = Math.min(window.innerHeight - ch - margin, target.y + target.h + margin);
        placement = 'bottom';
      }
    }
    // Clamp inside viewport
    left = Math.max(margin, Math.min(window.innerWidth - cw - margin, left));
    top = Math.max(margin, Math.min(window.innerHeight - ch - margin, top));
    setCardPos({ left, top, placement });
  };

  useTourLayout(() => {
    measure();
    const onResize = () => measure();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
    // eslint-disable-next-line
  }, [i]);

  useTourFx(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onFinish?.();
      if (e.key === 'ArrowRight') setI(x => Math.min(STEPS.length - 1, x + 1));
      if (e.key === 'ArrowLeft') setI(x => Math.max(0, x - 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const step = STEPS[i];
  const last = i === STEPS.length - 1;

  const next = () => last ? onFinish?.() : setI(i + 1);
  const back = () => setI(Math.max(0, i - 1));

  const maskId = 'stage-tour-mask';

  return (
    <div className="tour-root" role="dialog" aria-label="Product tour">
      {/* Spotlight overlay using SVG mask */}
      <svg className="tour-svg" width="100%" height="100%">
        <defs>
          <mask id={maskId}>
            <rect x="0" y="0" width="100%" height="100%" fill="white"/>
            {rect && (
              <rect
                x={rect.x} y={rect.y} width={rect.w} height={rect.h}
                rx="14" ry="14" fill="black"
                style={{ transition: 'all 480ms cubic-bezier(0.22, 1, 0.36, 1)' }}
              />
            )}
          </mask>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="rgba(8, 10, 22, 0.62)" mask={`url(#${maskId})`}/>
      </svg>

      {/* Spotlight ring (animated) */}
      {rect && (
        <div className="tour-ring" style={{
          left: rect.x, top: rect.y, width: rect.w, height: rect.h,
        }}/>
      )}

      {/* Guide card */}
      <div ref={cardRef} className={`tour-card placement-${cardPos.placement}`} style={{
        left: cardPos.left, top: cardPos.top,
      }}>
        <div className="tour-card-head">
          <div className="tour-card-step">
            <span className="tour-card-bar"/>
            <span>Step {i + 1} of {STEPS.length}</span>
          </div>
          <button className="tour-card-close" onClick={onFinish} aria-label="Close tour">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 18L18 6M6 6l12 12" strokeLinecap="round"/></svg>
          </button>
        </div>
        <div className="tour-card-eyebrow">{role === 'guest' ? 'Guest experience' : 'Admin experience'}</div>
        <h2 className="tour-card-title">{step.title}</h2>
        <p className="tour-card-body">{step.body}</p>
        <div className="tour-card-foot">
          <button className="tour-skip" onClick={onFinish}>Skip tour</button>
          <div className="tour-card-actions">
            <button className="tour-back" onClick={back} disabled={i === 0} aria-label="Previous step">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button className="tour-next" onClick={next}>{last ? 'Finish' : 'Next'}</button>
          </div>
        </div>
        <div className="tour-dots">
          {STEPS.map((_, k) => (
            <span key={k} className={`tour-dot ${k === i ? 'active' : ''} ${k < i ? 'done' : ''}`}/>
          ))}
        </div>
      </div>
    </div>
  );
}

window.StageTour = StageTour;
