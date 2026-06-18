/* global React, Icon */
// Stage Room — live broadcast experience (Goldcast / 6sense / Livestorm style)
// Speaker tiles, side panel (Chat/Messages/Q&A/Poll/Media/Docs), live captions
// with language, on-stage Q&A + polls, recording w/ quality + clips + share,
// and brand background switching.

const { useState: useStageState, useEffect: useStageFx, useRef: useStageRef } = React;

const SPEAKERS = [
  { name: 'Drew Brucker', role: 'Host', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80', muted: false },
  { name: 'Emma Carter', role: 'Speaker', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80', muted: false },
  { name: 'Liam Walsh', role: 'Speaker', photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=800&q=80', muted: false },
  { name: 'Sofia Reyes', role: 'Speaker', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80', muted: false },
];

const STAGE_BGS = [
  { id: 'spatial', name: 'SpatialChat', swatch: 'linear-gradient(135deg,#5B5BF5,#7C3AED)', mark: 'S' },
  { id: 'studio', name: 'Studio Dark', swatch: 'linear-gradient(135deg,#16161F,#0B0B12)', mark: '◐' },
  { id: 'aurora', name: 'Aurora', swatch: 'linear-gradient(135deg,#5B5BF5,#C7468F,#F59E0B)', mark: '✦' },
  { id: 'sixsense', name: '6sense', swatch: 'linear-gradient(135deg,#00C2CB,#0A7C8A)', mark: '6' },
  { id: 'goldcast', name: 'Goldcast', swatch: 'linear-gradient(135deg,#FF6B35,#E8410B)', mark: 'G' },
  { id: 'hp', name: 'HP', swatch: 'linear-gradient(135deg,#0096D6,#00547A)', mark: 'hp' },
  { id: 'sony', name: 'Sony', swatch: 'linear-gradient(135deg,#1a1a1a,#000)', mark: 'S' },
];

const LANGUAGES = [
  { id: 'en', name: 'English', native: 'English' },
  { id: 'es', name: 'Spanish', native: 'Español' },
  { id: 'fr', name: 'French', native: 'Français' },
  { id: 'de', name: 'German', native: 'Deutsch' },
  { id: 'hi', name: 'Hindi', native: 'हिन्दी' },
  { id: 'ja', name: 'Japanese', native: '日本語' },
  { id: 'pt', name: 'Portuguese', native: 'Português' },
];

const CAPTION_LINES = {
  en: [
    { who: 'Drew Brucker', text: "So the biggest shift we've seen this year is teams treating events as a channel, not a one-off." },
    { who: 'Emma Carter', text: "Exactly — and the data backs it up. Repeat attendance is up almost forty percent." },
    { who: 'Drew Brucker', text: "Right. And that's where the engagement tooling really starts to pay off." },
    { who: 'Emma Carter', text: "Polls, Q&A, breakout rooms — every interaction becomes a signal you can act on." },
  ],
  es: [
    { who: 'Drew Brucker', text: "El mayor cambio este año es que los equipos tratan los eventos como un canal, no algo único." },
    { who: 'Emma Carter', text: "Exacto, y los datos lo confirman. La asistencia recurrente subió casi cuarenta por ciento." },
  ],
  hi: [
    { who: 'Drew Brucker', text: "इस साल सबसे बड़ा बदलाव यह है कि टीमें इवेंट्स को एक चैनल की तरह देख रही हैं।" },
    { who: 'Emma Carter', text: "बिलकुल — और डेटा इसकी पुष्टि करता है। दोबारा उपस्थिति लगभग चालीस प्रतिशत बढ़ी है।" },
  ],
};

const QUALITIES = [
  { id: '720', name: '720p', sub: 'HD · smaller files', badge: 'HD' },
  { id: '1080', name: '1080p', sub: 'Full HD · recommended', badge: 'HD' },
  { id: '4k', name: '2160p', sub: 'Ultra HD · 4K master', badge: '4K' },
];

const SHARE_DESTS = [
  { id: 'linkedin', name: 'LinkedIn', sub: 'Post as native video', color: '#0A66C2', mark: 'in' },
  { id: 'youtube', name: 'YouTube', sub: 'Upload as Short', color: '#FF0000', mark: '▶' },
  { id: 'x', name: 'X', sub: 'Post to timeline', color: '#111', mark: '𝕏' },
  { id: 'download', name: 'Download', sub: 'MP4 to your device', color: '#5B5BF5', mark: '↓' },
];

const SIDE_TABS = ['Chat', 'People', 'Q&A', 'Polls'];

const AGENDA = [
  { time: '2:30pm', dur: '15 min', title: 'Doors open & networking', speaker: 'Lounge', tag: 'Pre-show', done: true },
  { time: '2:45pm', dur: '15 min', title: 'Welcome & housekeeping', speaker: 'Drew Brucker', tag: 'Opening', done: true },
  { time: '3:00pm', dur: '30 min', title: 'Keynote — Events as a channel, not a one-off', speaker: 'Emma Carter', tag: 'Keynote', live: true },
  { time: '3:30pm', dur: '25 min', title: 'Panel — Turning dwell into participation', speaker: 'Liam Walsh, Sofia Reyes', tag: 'Panel' },
  { time: '3:55pm', dur: '20 min', title: 'Live Q&A with the speakers', speaker: 'All speakers', tag: 'Q&A' },
  { time: '4:15pm', dur: '15 min', title: 'Sponsor spotlight — HP Studio', speaker: 'HP', tag: 'Sponsor' },
  { time: '4:30pm', dur: '30 min', title: 'Breakouts — Pick a room', speaker: 'Self-serve', tag: 'Breakout' },
];

const SPONSORS = [
  { name: 'HP', tier: 'Title sponsor', mark: 'hp', color: '#0096D6', blurb: 'Powering the studio behind every broadcast.', cta: 'Visit booth' },
  { name: 'Sony', tier: 'Stage sponsor', mark: 'S', color: '#111', blurb: 'Cinema-grade audio for hybrid events.', cta: 'Watch reel' },
  { name: '6sense', tier: 'Lounge sponsor', mark: '6', color: '#00C2CB', blurb: 'Revenue AI for the events channel.', cta: 'Book a demo' },
  { name: 'Goldcast', tier: 'Networking', mark: 'G', color: '#FF6B35', blurb: 'B2B video for marketers.', cta: 'Get the guide' },
];

const DM_PEOPLE = [
  { name: 'Emma Carter', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', last: 'Great session — let\u2019s sync after', unread: 1,
    thread: [
      { who: 'Emma Carter', time: '3:02pm', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', text: 'Loved your point on dwell time!' },
      { who: 'You', time: '3:04pm', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80', text: 'Thanks Emma — slides coming your way.' },
    ] },
  { name: 'Marco Reyes', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', last: 'Can you share the recording?', unread: 1,
    thread: [
      { who: 'Marco Reyes', time: '2:58pm', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', text: 'Can you share the recording afterwards?' },
    ] },
  { name: 'Sarah Kim', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', last: 'Voted 👍', unread: 0,
    thread: [
      { who: 'Sarah Kim', time: '2:50pm', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', text: 'Voted 👍' },
    ] },
];

const CHAT_SEED = [
  { who: 'Vanessa Ray', time: '3:13pm', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80', emoji: '😮' },
  { who: 'James Raynor', time: '3:13pm', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', text: 'Excellent presentation guys. Really am going to walk away feeling like I learned something.' },
  { who: 'Cheryl White', time: '3:14pm', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=80&q=80', emoji: '🔥🔥🔥🔥' },
  { who: 'Omar Vega', time: '3:14pm', photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&q=80', text: 'What would you recommend for someone just getting into content creation?' },
  { who: 'Marissa Santiego', time: '3:15pm', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80', text: 'Customer testimonials are a great place to start tbh… success always resonates well.' },
];

const QA_SEED = [
  { id: 1, q: 'How do you measure ROI on a virtual event versus an in-person one?', who: 'Omar Vega', votes: 24, onstage: false },
  { id: 2, q: 'What integrations do you support for pushing leads into our CRM?', who: 'Isabella Moore', votes: 18, onstage: false },
  { id: 3, q: 'Can attendees rewatch sessions on demand afterwards?', who: 'Samual Green', votes: 12, onstage: false },
  { id: 4, q: 'Any tips for keeping energy up in a 3-hour event?', who: 'Cheryl White', votes: 7, onstage: false },
];

const POLL = {
  q: 'What marketing channel is most effective for your business?',
  opts: [
    { id: 'a', label: 'Video marketing', votes: 142 },
    { id: 'b', label: 'Webinars', votes: 98 },
    { id: 'c', label: 'Content marketing', votes: 76 },
    { id: 'd', label: 'Partner marketing', votes: 54 },
    { id: 'e', label: 'Paid search / SEO', votes: 41 },
    { id: 'f', label: 'Other', votes: 12 },
  ],
};

function StageRoom({ theme, onToggleTheme, onLeave }) {
  const [tab, setTab] = useStageState('Chat');
  const [micOn, setMicOn] = useStageState(true);
  const [camOn, setCamOn] = useStageState(true);
  const [raiseHand, setRaiseHand] = useStageState(false);
  const [captionsOn, setCaptionsOn] = useStageState(true);
  const [lang, setLang] = useStageState('en');
  const [capIdx, setCapIdx] = useStageState(0);
  const [bg, setBg] = useStageState('spatial');
  const [logoSize, setLogoSize] = useStageState(28);
  const [stageFont, setStageFont] = useStageState('Geist');
  const [logoImg, setLogoImg] = useStageState(null);
  const [onStage, setOnStage] = useStageState('none'); // 'none' | 'poll' | 'qa'
  const [recording, setRecording] = useStageState(false);
  const [recTime, setRecTime] = useStageState(0);
  const [transcribing, setTranscribing] = useStageState(false);
  const [quality, setQuality] = useStageState('1080');
  const [elapsed, setElapsed] = useStageState(2589); // 43:09
  const [pop, setPop] = useStageState(null); // 'bg' | 'rec' | 'lang' | null
  const [modal, setModal] = useStageState(null); // 'clip' | 'share'
  const [pollVote, setPollVote] = useStageState(null);
  const [qa, setQa] = useStageState(QA_SEED);
  const [qaVotes, setQaVotes] = useStageState({});
  const [presentedQa, setPresentedQa] = useStageState(null);
  const [toast, setToast] = useStageState(null);
  const toastT = useStageRef(null);
  const popRef = useStageRef(null);

  const showToast = (m) => { setToast(m); clearTimeout(toastT.current); toastT.current = setTimeout(() => setToast(null), 1900); };

  // event timer
  useStageFx(() => { const t = setInterval(() => setElapsed(e => e + 1), 1000); return () => clearInterval(t); }, []);
  // recording timer
  useStageFx(() => { if (!recording) return; const t = setInterval(() => setRecTime(s => s + 1), 1000); return () => clearInterval(t); }, [recording]);
  // captions ticker
  useStageFx(() => {
    if (!captionsOn) return;
    const lines = CAPTION_LINES[lang] || CAPTION_LINES.en;
    const t = setInterval(() => setCapIdx(i => (i + 1) % lines.length), 3800);
    return () => clearInterval(t);
  }, [captionsOn, lang]);
  // close popover on outside click
  useStageFx(() => {
    if (!pop) return;
    const onDown = (e) => { if (!popRef.current?.contains(e.target)) setPop(null); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [pop]);

  const fmt = (s) => {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    const mm = String(m).padStart(2, '0'), ss = String(sec).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
  };

  const lines = CAPTION_LINES[lang] || CAPTION_LINES.en;
  const caption = lines[capIdx % lines.length];

  const pollTotal = POLL.opts.reduce((s, o) => s + o.votes, 0) + (pollVote ? 1 : 0);
  const votePoll = (id) => { if (pollVote) return; setPollVote(id); showToast('Vote counted'); };

  const upvoteQa = (id) => {
    setQaVotes(v => ({ ...v, [id]: !v[id] }));
  };
  const presentQa = (item) => { setPresentedQa(item); setOnStage('qa'); setPop(null); showToast('Question on stage'); };

  return (
    <div className="stage-room" data-screen-label="Stage room">
      {/* Top nav */}
      <div className="stage-nav">
        <div className="stage-nav-logo">
          <img className="mark" src="assets/spatialchat-logo.png" alt=""/>
          <img className="word" src="assets/spatialchat-wordmark.png" alt="SpatialChat"/>
        </div>
        <div className="stage-nav-tabs">
          {['Stage', 'Rooms', 'Agenda', 'Sponsors'].map((t, i) => (
            <button key={t} className={`stage-nav-tab ${i === 0 ? 'active' : ''}`}
              onClick={() => { if (t === 'Rooms') setModal('rooms'); if (t === 'Agenda') setModal('agenda'); if (t === 'Sponsors') setModal('sponsors'); }}>{t}</button>
          ))}
        </div>
        <div className="stage-nav-spacer"/>
        <div className="stage-nav-actions">
          <span className="stage-attendee-pill"><Icon.user size={13}/> 482 watching</span>
          <button className="stage-golive" onClick={() => setModal('destination')}><span className="stage-golive-dot"/> Go Live</button>
          <button className="icon-btn" onClick={onToggleTheme} title="Toggle theme">
            {theme === 'light' ? <Icon.moon size={18}/> : <Icon.sun size={18}/>}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="stage-main">
        <div className="stage-left">
          <div className="stage-canvas" data-bg={bg} style={{ fontFamily: `'${stageFont}', sans-serif` }}>
            <div className="stage-brand-watermark">
              {logoImg
                ? <img src={logoImg} alt="" style={{ height: logoSize, width: 'auto', display: 'block' }}/>
                : <><span className="dot" style={{ width: logoSize, height: logoSize, fontSize: logoSize * 0.5 }}>{STAGE_BGS.find(b => b.id === bg)?.mark}</span>
                  <span style={{ fontSize: Math.max(13, logoSize * 0.5) }}>{STAGE_BGS.find(b => b.id === bg)?.name}</span></>}
            </div>

            {(onStage === 'poll' || onStage === 'qa') ? (
              <div className="stage-overlay">
                <div className="stage-overlay-speakers">
                  {SPEAKERS.map((s, i) => (
                    <div key={i} className="speaker-tile" style={{ backgroundImage: `url('${s.photo}')` }}/>
                  ))}
                </div>
                {onStage === 'poll' ? (
                <div className="stage-poll-card">
                  <div className="stage-poll-q">{POLL.q}</div>
                  <div className="stage-poll-opts">
                    {POLL.opts.map(o => {
                      const pct = Math.round(((o.votes + (pollVote === o.id ? 1 : 0)) / pollTotal) * 100);
                      const voted = pollVote === o.id;
                      return (
                        <div key={o.id} className={`stage-poll-opt ${voted ? 'voted' : ''}`} onClick={() => votePoll(o.id)}>
                          {pollVote && <span className="stage-poll-opt-fill" style={{ width: `${pct}%`, position: 'absolute' }}/>}
                          <span className="stage-poll-opt-label">{o.label}</span>
                          {pollVote && <span className="stage-poll-opt-pct">{pct}%</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
                ) : presentedQa && (
                <div className="stage-poll-card stage-qa-card">
                  <span className="stage-qa-card-tag"><Icon.help size={13}/> Q&amp;A · Live question</span>
                  <div className="stage-qa-card-who">{presentedQa.who} asked</div>
                  <div className="stage-qa-card-q">{presentedQa.q}</div>
                </div>
                )}
              </div>
            ) : (
              <div className={`stage-tiles count-${SPEAKERS.length}`}>
                {SPEAKERS.map((s, i) => (
                  <div key={i} className={`speaker-tile ${i === 0 ? 'speaking' : ''}`} style={{ backgroundImage: `url('${s.photo}')` }}>
                    {i === 0 && <span className="speaker-hd">{quality === '4k' ? '4K' : 'HD'}</span>}
                    <span className="speaker-name">
                      <span className={`mic-ico ${i === 1 && !micOn ? 'muted' : ''}`}>
                        {(i === 0 || micOn) ? <Icon.mic size={12}/> : <Icon.micOff size={12}/>}
                      </span>
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* On-stage Q&A lower third */}
            {false && onStage === 'qa' && presentedQa && (
              <div className="stage-qa-lower">
                <span className="stage-qa-lower-tag">Q&amp;A</span>
                <div className="stage-qa-lower-body">
                  <div className="stage-qa-lower-who">{presentedQa.who} asked</div>
                  <div className="stage-qa-lower-q">{presentedQa.q}</div>
                </div>
                <button className="stage-qa-lower-close" onClick={() => setOnStage('none')}><Icon.close size={18}/></button>
              </div>
            )}

            {/* Live captions */}
            {captionsOn && caption && (
              <div className="stage-captions">
                <div className="stage-caption-name">{caption.who}</div>
                <div className="stage-caption-text">{caption.text}</div>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="stage-controls">
            <span className="stage-live"><span className="stage-live-dot"/> LIVE</span>
            <span className="stage-timer">{fmt(elapsed)}</span>
            <div className="stage-controls-spacer"/>

            <button className={`stage-cbtn ${micOn ? 'on' : ''}`} onClick={() => { setMicOn(m => !m); showToast(micOn ? 'Mic muted' : 'Mic on'); }}>
              <span className="stage-cbtn-ico">{micOn ? <Icon.mic size={19}/> : <Icon.micOff size={19}/>}</span> Mic
            </button>
            <button className={`stage-cbtn ${camOn ? 'on' : ''}`} onClick={() => { setCamOn(c => !c); showToast(camOn ? 'Camera off' : 'Camera on'); }}>
              <span className="stage-cbtn-ico">{camOn ? <Icon.cam size={19}/> : <Icon.camOff size={19}/>}</span> Camera
            </button>
            <button className={`stage-cbtn ${captionsOn ? 'on' : ''}`} onClick={() => setCaptionsOn(c => !c)}>
              <span className="stage-cbtn-ico"><Icon.text size={19}/></span> Captions
            </button>
            <button className="stage-cbtn" onClick={() => setModal('summary')}>
              <span className="stage-cbtn-ico"><Icon.doc size={19}/></span> Summary
            </button>
            <button className="stage-cbtn" onClick={() => showToast('Sharing your screen…')}>
              <span className="stage-cbtn-ico"><Icon.share size={19}/></span> Share screen
            </button>

            {/* Language */}
            <div style={{ position: 'relative' }} ref={pop === 'lang' ? popRef : null}>
              <button className="stage-cbtn" onClick={() => setPop(pop === 'lang' ? null : 'lang')}>
                <span className="stage-cbtn-ico"><Icon.globe size={19}/></span> {LANGUAGES.find(l => l.id === lang)?.id.toUpperCase()}
              </button>
              {pop === 'lang' && (
                <div className="stage-pop" style={{ right: 0 }}>
                  <div className="stage-pop-title">Caption language</div>
                  {LANGUAGES.map(l => (
                    <button key={l.id} className={`stage-pop-item ${lang === l.id ? 'active' : ''}`} onClick={() => { setLang(l.id); setCapIdx(0); setPop(null); showToast(`Captions: ${l.name}`); }}>
                      {l.native}<span style={{ color: 'var(--text-tertiary)', marginLeft: 6, fontSize: 11 }}>{l.name}</span>
                      <span className="stage-pop-radio"/>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Background */}
            <div style={{ position: 'relative' }}>
              <button className="stage-cbtn" onClick={() => setModal('customize')}>
                <span className="stage-cbtn-ico"><Icon.whiteboard size={19}/></span> Customize
              </button>
            </div>

            <button className={`stage-raise ${raiseHand ? 'on' : ''}`} onClick={() => { setRaiseHand(r => !r); showToast(raiseHand ? 'Hand lowered' : 'Hand raised ✋'); }}>
              ✋ Raise Hand
            </button>

            {/* Record + Transcribe (grouped) */}
            <div style={{ position: 'relative', display: 'inline-flex', gap: 6 }} ref={pop === 'rec' ? popRef : null}>
              <button className={`stage-record ${recording ? 'recording' : ''}`} onClick={() => setPop(pop === 'rec' ? null : 'rec')}>
                <span className="stage-record-dot"/>
                {recording ? <>Recording <span className="stage-record-time">{fmt(recTime)}</span></> : 'Record'}
              </button>
              <button
                className={`stage-cbtn ${transcribing ? 'on' : ''}`}
                title={transcribing ? 'Stop live transcription' : 'Start live transcription'}
                onClick={() => { setTranscribing(t => !t); showToast(transcribing ? 'Transcription stopped' : 'Transcribing live'); }}>
                <span className="stage-cbtn-ico"><Icon.text size={19}/></span>
                {transcribing ? 'Transcribing' : 'Transcribe'}
              </button>
              {pop === 'rec' && (
                <div className="stage-pop" style={{ right: 0, minWidth: 280 }} ref={popRef}>
                  <div className="stage-pop-title">Recording quality</div>
                  {QUALITIES.map(q => (
                    <button key={q.id} className={`stage-pop-item stage-pop-quality ${quality === q.id ? 'active' : ''}`} onClick={() => { setQuality(q.id); showToast(`Quality: ${q.name}`); }}>
                      <span>{q.name}<span className="q-badge">{q.badge}</span><div style={{ fontSize: 11, color: 'var(--text-tertiary)', fontWeight: 400 }}>{q.sub}</div></span>
                      <span className="stage-pop-radio"/>
                    </button>
                  ))}
                  <div className="stage-pop-divider"/>
                  <button className="stage-pop-item" onClick={() => { setRecording(r => !r); setPop(null); showToast(recording ? 'Recording stopped' : 'Recording started'); }}>
                    <span style={{ color: recording ? 'var(--brand-red)' : 'var(--text)' }}>{recording ? '■ Stop recording' : '● Start recording'}</span>
                  </button>
                  <button className="stage-pop-item" onClick={() => { setTranscribing(t => !t); setPop(null); showToast(transcribing ? 'Transcription stopped' : 'Transcription started — saved to event when finished'); }}>
                    <span style={{ color: transcribing ? 'var(--brand-red)' : 'var(--text)' }}>{transcribing ? '■ Stop transcription' : '✎ Start transcription'}</span>
                  </button>
                </div>
              )}
            </div>

            <button className="stage-cbtn danger" onClick={onLeave}>
              <span className="stage-cbtn-ico"><Icon.power size={19}/></span> Leave
            </button>
          </div>
        </div>

        {/* Right side panel */}
        <div className="stage-side">
          <div className="stage-side-tabs">
            {SIDE_TABS.map(t => (
              <button key={t} className={`stage-side-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
                {t}
                {t === 'Q&A' && <span className="tab-badge">{qa.length}</span>}
                {t === 'Chat' && <span className="tab-badge">9+</span>}
              </button>
            ))}
          </div>
          <div className="stage-side-body">
            {tab === 'Chat' && <StageChat showToast={showToast}/>}
            {tab === 'People' && <StagePeople showToast={showToast}/>}
            {tab === 'Q&A' && <StageQa qa={qa} qaVotes={qaVotes} onUpvote={upvoteQa} onPresent={presentQa} presentedId={onStage === 'qa' ? presentedQa?.id : null}/>}
            {tab === 'Polls' && <StagePoll pollVote={pollVote} onVote={votePoll} onShowStage={() => { setOnStage('poll'); showToast('Poll on stage'); }}/>}
            {tab === 'Media' && <StageMedia showToast={showToast}/>}
            {tab === 'Docs' && <StageDocs showToast={showToast}/>}
          </div>
        </div>
      </div>

      {/* Clip / Share modal */}
      {modal === 'clip' && <ClipModal speaker={SPEAKERS[0]} onClose={() => setModal(null)} onShare={() => setModal('share')} showToast={showToast}/>}
      {modal === 'share' && <ShareModal onClose={() => setModal(null)} showToast={showToast}/>}
      {modal === 'destination' && <DestinationModal onClose={() => setModal(null)} showToast={showToast}/>}
      {modal === 'summary' && <SummaryModal onClose={() => setModal(null)} showToast={showToast}/>}
      {modal === 'rooms' && <RoomsModal onClose={() => setModal(null)} showToast={showToast}/>}
      {modal === 'agenda' && <AgendaModal onClose={() => setModal(null)}/>}
      {modal === 'sponsors' && <SponsorsModal onClose={() => setModal(null)} showToast={showToast}/>}
      {modal === 'customize' && <StageCustomizeModal
        bg={bg} setBg={setBg} logoSize={logoSize} setLogoSize={setLogoSize}
        font={stageFont} setFont={setStageFont} logoImg={logoImg} setLogoImg={setLogoImg}
        onClose={() => setModal(null)} showToast={showToast}/>}

      {toast && <div className="toast">{toast}</div>}
    </div>
  );
}

/* ---- Side panels ---- */
function StageChat({ showToast }) {
  const [draft, setDraft] = useStageState('');
  const [mode, setMode] = useStageState('group'); // 'group' | 'direct'
  const [dmTo, setDmTo] = useStageState(null);
  const [msgs, setMsgs] = useStageState(CHAT_SEED);
  const [picker, setPicker] = useStageState(null); // 'emoji' | 'gif'
  const threadRef = useStageRef(null);
  useStageFx(() => { if (threadRef.current) threadRef.current.scrollTop = threadRef.current.scrollHeight; }, [msgs]);
  const EMOJIS = ['👍','❤️','🔥','🎉','😮','😂','👏','🙌','🙏','✨','🚀','💯'];
  const GIFS = [
    { t: 'Applause', bg: 'linear-gradient(135deg,#5B5BF5,#8B5BF5)' },
    { t: 'Mind blown', bg: 'linear-gradient(135deg,#F59E0B,#EF4444)' },
    { t: 'LOL', bg: 'linear-gradient(135deg,#16A34A,#5EE6A8)' },
    { t: 'Wow', bg: 'linear-gradient(135deg,#0EA5E9,#5B5BF5)' },
    { t: 'Yes!', bg: 'linear-gradient(135deg,#EC4899,#F59E0B)' },
    { t: 'Thank you', bg: 'linear-gradient(135deg,#7C3AED,#EC4899)' },
  ];
  const sendEmoji = (e) => { setMsgs(m => [...m, { who: 'You', time: 'now', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80', emoji: e }]); setPicker(null); };
  const sendGif = (g) => { setMsgs(m => [...m, { who: 'You', time: 'now', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80', gif: g }]); setPicker(null); showToast(`GIF: ${g.t}`); };
  const send = () => {
    if (!draft.trim()) return;
    setMsgs(m => [...m, { who: 'You', time: 'now', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&q=80', text: draft.trim() }]);
    setDraft('');
  };
  return (
    <>
      <div className="stage-chat-seg">
        <button className={`stage-chat-seg-btn ${mode === 'group' ? 'active' : ''}`} onClick={() => { setMode('group'); setDmTo(null); }}>Group chat</button>
        <button className={`stage-chat-seg-btn ${mode === 'direct' ? 'active' : ''}`} onClick={() => setMode('direct')}>Direct <span className="stage-chat-seg-badge">2</span></button>
      </div>
      {mode === 'direct' && !dmTo ? (
        <div className="stage-chat-thread">
          {DM_PEOPLE.map(p => (
            <button key={p.name} className="stage-dm-row" onClick={() => setDmTo(p)}>
              <span className="stage-msg-av" style={{ backgroundImage: `url('${p.photo}')` }}/>
              <span className="stage-dm-info">
                <span className="stage-dm-name">{p.name}</span>
                <span className="stage-dm-last">{p.last}</span>
              </span>
              {p.unread > 0 && <span className="stage-chat-seg-badge">{p.unread}</span>}
            </button>
          ))}
        </div>
      ) : (
      <div className="stage-chat-thread" ref={threadRef}>
        {mode === 'direct' && dmTo && (
          <button className="stage-dm-back" onClick={() => setDmTo(null)}><Icon.caretRight size={13} style={{ transform: 'rotate(180deg)' }}/> {dmTo.name}</button>
        )}
        {(mode === 'direct' && dmTo ? dmTo.thread : msgs).map((m, i) => (
          <div key={i} className="stage-msg">
            <span className="stage-msg-av" style={{ backgroundImage: `url('${m.photo}')` }}/>
            <div className="stage-msg-body">
              <div className="stage-msg-head"><span className="stage-msg-name">{m.who}</span><span className="stage-msg-time">{m.time}</span></div>
              {m.text && <div className="stage-msg-text">{m.text}</div>}
              {m.emoji && <div className="stage-msg-emoji">{m.emoji}</div>}
              {m.gif && <div className="stage-msg-gif" style={{ background: m.gif.bg }}>{m.gif.t} <span className="stage-msg-gif-tag">GIF</span></div>}
            </div>
          </div>
        ))}
      </div>
      )}
      <div className="stage-composer">
        {picker === 'emoji' && (
          <div className="stage-picker">
            {EMOJIS.map(e => <button key={e} className="stage-picker-emoji" onClick={() => sendEmoji(e)}>{e}</button>)}
          </div>
        )}
        {picker === 'gif' && (
          <div className="stage-picker gif">
            {GIFS.map(g => <button key={g.t} className="stage-picker-gif" style={{ background: g.bg }} onClick={() => sendGif(g)}>{g.t}<span className="stage-msg-gif-tag">GIF</span></button>)}
          </div>
        )}
        <div className="stage-composer-box">
          <input placeholder={mode === 'direct' && dmTo ? `Message ${dmTo.name}…` : 'Contribute to the discussion!'} value={draft}
            onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') send(); }}/>
          <div className="stage-composer-tools">
            <button className="stage-composer-tool" title="Mention"><span style={{ fontWeight: 700 }}>@</span></button>
            <button className={`stage-composer-tool gif ${picker === 'gif' ? 'on' : ''}`} title="GIF" onClick={() => setPicker(picker === 'gif' ? null : 'gif')}>GIF</button>
            <button className={`stage-composer-tool ${picker === 'emoji' ? 'on' : ''}`} title="Emoji" onClick={() => setPicker(picker === 'emoji' ? null : 'emoji')}><Icon.emoji size={16}/></button>
          </div>
          <button className="stage-composer-send" onClick={send}><Icon.send size={15}/></button>
        </div>
      </div>
    </>
  );
}

function StagePeople({ showToast }) {
  const people = [
    { name: 'Drew Brucker', role: 'Host', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80', live: true },
    { name: 'Emma Carter', role: 'Speaker', photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80', live: true },
    { name: 'Marco Reyes', role: 'Moderator', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80', live: true },
    { name: 'Sarah Kim', role: 'Attendee', photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80' },
    { name: 'Diego Alvarez', role: 'Attendee', photo: 'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&q=80' },
    { name: 'Amelia Stone', role: 'Attendee', photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80' },
  ];
  return (
    <div className="people-panel">
      <div className="people-panel-count"><Icon.user size={13}/> 482 in this room</div>
      {people.map((p, i) => (
        <div key={i} className="people-prow">
          <span className="people-pava" style={{ backgroundImage: `url('${p.photo}')` }}>{p.live && <span className="people-plive"/>}</span>
          <div className="people-pinfo">
            <div className="people-pname">{p.name}</div>
            <div className="people-prole">{p.role}</div>
          </div>
          <button className="people-pdm" title="Direct message" onClick={() => showToast(`Direct message to ${p.name}`)}><Icon.send size={14}/></button>
        </div>
      ))}
    </div>
  );
}

function StageMessages() {
  return (
    <div className="qa-panel">
      {[
        { who: 'Event Team', text: 'Welcome! Drop your questions in Q&A and we\'ll get to them live.', time: '2:55pm' },
        { who: 'Emma Carter', text: 'Slides are in the chat if you want to follow along.', time: '3:01pm' },
      ].map((m, i) => (
        <div key={i} className="qa-item">
          <div className="qa-item-q">{m.text}</div>
          <div className="qa-item-meta"><span className="qa-item-who">{m.who} · {m.time}</span></div>
        </div>
      ))}
    </div>
  );
}

function StageQa({ qa, qaVotes, onUpvote, onPresent, presentedId }) {
  const sorted = [...qa].sort((a, b) => (b.votes + (qaVotes[b.id] ? 1 : 0)) - (a.votes + (qaVotes[a.id] ? 1 : 0)));
  return (
    <div className="qa-panel">
      {sorted.map(item => {
        const voted = qaVotes[item.id];
        const live = presentedId === item.id;
        return (
          <div key={item.id} className={`qa-item ${live ? 'onstage' : ''}`}>
            {live && <div className="qa-onstage-tag" style={{ marginBottom: 6 }}>● On stage now</div>}
            <div className="qa-item-q">{item.q}</div>
            <div className="qa-item-meta">
              <span className="qa-item-who">{item.who}</span>
              <button className={`qa-upvote ${voted ? 'voted' : ''}`} onClick={() => onUpvote(item.id)}>
                ▲ {item.votes + (voted ? 1 : 0)}
              </button>
              <button className="qa-present" onClick={() => onPresent(item)}>Present</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StagePoll({ pollVote, onVote, onShowStage }) {
  const total = POLL.opts.reduce((s, o) => s + o.votes, 0) + (pollVote ? 1 : 0);
  return (
    <div className="pollp">
      <div className="pollp-q">{POLL.q}</div>
      <div className="pollp-opts">
        {POLL.opts.map(o => {
          const sel = pollVote === o.id;
          const pct = Math.round(((o.votes + (sel ? 1 : 0)) / total) * 100);
          return (
            <div key={o.id} className={`pollp-opt ${sel ? 'sel' : ''}`} onClick={() => onVote(o.id)}>
              {pollVote && <span className="stage-poll-opt-fill" style={{ width: `${pct}%` }}/>}
              <span>{o.label}{pollVote ? ` · ${pct}%` : ''}</span>
            </div>
          );
        })}
      </div>
      <button className="btn btn-secondary" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }} onClick={onShowStage}>
        <Icon.broadcast size={14}/> Show on stage
      </button>
    </div>
  );
}

function StageMedia({ showToast }) {
  const items = [
    { cap: 'Keynote intro reel', thumb: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&q=80' },
    { cap: 'Product demo', thumb: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&q=80' },
    { cap: 'Customer story', thumb: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=400&q=80' },
    { cap: 'Sponsor spotlight', thumb: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&q=80' },
  ];
  return (
    <div className="media-grid">
      {items.map((m, i) => (
        <div key={i} className="media-card" onClick={() => showToast(`Playing: ${m.cap}`)}>
          <div className="media-thumb" style={{ backgroundImage: `url('${m.thumb}')` }}>
            <span className="media-play"><Icon.video size={16}/></span>
          </div>
          <div className="media-cap">{m.cap}</div>
        </div>
      ))}
    </div>
  );
}

function StageDocs({ showToast }) {
  const docs = [
    { name: 'Event deck — Q2 Launch.pdf', meta: 'PDF · 4.2 MB', ico: Icon.doc },
    { name: 'Speaker bios.pdf', meta: 'PDF · 820 KB', ico: Icon.doc },
    { name: 'Benchmark report 2026.xlsx', meta: 'Sheet · 1.1 MB', ico: Icon.chart },
    { name: 'Session agenda.pdf', meta: 'PDF · 340 KB', ico: Icon.calendar },
  ];
  return (
    <div className="docs-list">
      {docs.map((d, i) => (
        <div key={i} className="doc-row" onClick={() => showToast(`Opening ${d.name}`)}>
          <span className="doc-ico"><d.ico size={17}/></span>
          <div style={{ flex: 1 }}>
            <div className="doc-name">{d.name}</div>
            <div className="doc-meta">{d.meta}</div>
          </div>
          <Icon.upload size={15} style={{ color: 'var(--text-tertiary)', transform: 'rotate(180deg)' }}/>
        </div>
      ))}
    </div>
  );
}

/* ---- Clip & Share modals (reuse platform modal shell) ---- */
function ClipModal({ speaker, onClose, onShare, showToast }) {
  return (
    <div className="plat-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="plat-modal mid">
        <div className="plat-modal-head">
          <div>
            <div className="plat-modal-title">Create clip</div>
            <div className="plat-modal-sub">Trim a highlight and turn it into a shareable Short</div>
          </div>
          <button className="plat-modal-close" onClick={onClose}><Icon.close size={18}/></button>
        </div>
        <div className="plat-modal-body">
          <div className="clip-shot" style={{ backgroundImage: `url('${speaker.photo}')` }}>
            <span className="clip-shot-badge">● REC · 4K master</span>
          </div>
          <div className="clip-range">
            <span className="clip-time">12:04</span>
            <span className="clip-track"><span className="clip-track-sel"/></span>
            <span className="clip-time">12:38</span>
          </div>
          <div className="wiz-field">
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Clip title</label>
            <input className="wiz-input" defaultValue="The shift to events as a channel"/>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['9:16 Short', '1:1 Square', '16:9 Wide'].map((r, i) => (
              <button key={r} className={`plan-tab ${i === 0 ? 'active' : ''}`} style={{ flex: 1 }}>{r}</button>
            ))}
          </div>
        </div>
        <div className="plat-modal-foot">
          <button className="plat-cta ghost" onClick={onClose}>Cancel</button>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
            <button className="plat-cta ghost" onClick={() => showToast('Clip saved to Recordings')}>Save clip</button>
            <button className="plat-cta" onClick={onShare}><Icon.share size={14}/> Share</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ShareModal({ onClose, showToast }) {
  const [sel, setSel] = useStageState(['linkedin']);
  const toggle = (id) => setSel(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  return (
    <div className="plat-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="plat-modal mid">
        <div className="plat-modal-head">
          <div>
            <div className="plat-modal-title">Share clip</div>
            <div className="plat-modal-sub">Push your Short straight to social — pick destinations</div>
          </div>
          <button className="plat-modal-close" onClick={onClose}><Icon.close size={18}/></button>
        </div>
        <div className="plat-modal-body">
          <div className="share-dests">
            {SHARE_DESTS.map(d => (
              <button key={d.id} className={`share-dest ${sel.includes(d.id) ? 'sel' : ''}`} onClick={() => toggle(d.id)}>
                <span className="share-dest-ico" style={{ background: d.color }}>{d.mark}</span>
                <div style={{ flex: 1 }}>
                  <div className="share-dest-name">{d.name}</div>
                  <div className="share-dest-sub">{d.sub}</div>
                </div>
                {sel.includes(d.id) && <Icon.check size={17} style={{ color: 'var(--brand-indigo)' }}/>}
              </button>
            ))}
          </div>
          <div className="wiz-field" style={{ marginTop: 18 }}>
            <label style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 7 }}>Caption</label>
            <textarea className="wiz-textarea" defaultValue="Big takeaway from today's session: treat events as a channel, not a one-off. 🎥 #events #marketing"/>
          </div>
        </div>
        <div className="plat-modal-foot">
          <button className="plat-cta ghost" onClick={onClose}>Cancel</button>
          <button className="plat-cta" style={{ marginLeft: 'auto' }} disabled={!sel.length}
            onClick={() => { showToast(`Shared to ${sel.length} destination${sel.length > 1 ? 's' : ''}`); onClose(); }}>
            <Icon.share size={14}/> Share to {sel.length || 0}
          </button>
        </div>
      </div>
    </div>
  );
}

function DestinationModal({ onClose, showToast }) {
  const PLATFORMS = [
    { id: 'youtube', name: 'YouTube', mark: '▶', color: '#FF0000', server: 'Primary YouTube ingest server' },
    { id: 'facebook', name: 'Facebook', mark: 'f', color: '#1877F2', server: 'Facebook Live RTMP' },
    { id: 'linkedin', name: 'LinkedIn', mark: 'in', color: '#0A66C2', server: 'LinkedIn Live ingest' },
    { id: 'x', name: 'X', mark: '𝕏', color: '#111', server: 'X / Twitter RTMP' },
    { id: 'custom', name: 'Custom', mark: '⚙', color: '#6B7280', server: 'Custom RTMP URL' },
  ];
  const [plat, setPlat] = useStageState('youtube');
  const [showKey, setShowKey] = useStageState(false);
  const p = PLATFORMS.find(x => x.id === plat);
  return (
    <div className="plat-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="plat-modal mid">
        <div className="plat-modal-head">
          <div>
            <div className="plat-modal-title">Add destination</div>
            <div className="plat-modal-sub">Stream this stage live to an external platform</div>
          </div>
          <button className="plat-modal-close" onClick={onClose}><Icon.close size={18}/></button>
        </div>
        <div className="plat-modal-body">
          <div className="dest-label">Platform</div>
          <div className="dest-platforms">
            {PLATFORMS.map(x => (
              <button key={x.id} className={`dest-plat ${plat === x.id ? 'sel' : ''}`} onClick={() => setPlat(x.id)}>
                <span className="dest-plat-mark" style={{ color: x.color }}>{x.mark}</span>
                {x.name}
              </button>
            ))}
          </div>
          <div className="dest-label" style={{ marginTop: 20 }}>Server</div>
          <div className="dest-field dest-select">{p.server}<Icon.caretDown size={15}/></div>
          <div className="dest-key-row">
            <span className="dest-label" style={{ margin: 0 }}>Stream key</span>
            <a className="dest-link" href="#" onClick={e => e.preventDefault()}>Where to find stream key?</a>
          </div>
          <div className="dest-key">
            <div className="dest-field" style={{ flex: 1, fontFamily: 'var(--font-mono)' }}>{showKey ? 'live_882-4kx9-22ab-71zq' : 'xxxx-xxxx-xxxx-xxxx'}</div>
            <button className="dest-getkey" onClick={() => showToast('Opening platform…')}>Get stream key <Icon.expand size={12}/></button>
          </div>
        </div>
        <div className="plat-modal-foot">
          <button className="plat-cta ghost" onClick={onClose}>Cancel</button>
          <button className="plat-cta" style={{ marginLeft: 'auto' }} onClick={() => { showToast(`${p.name} destination added — you're live`); onClose(); }}>Create destination</button>
        </div>
      </div>
    </div>
  );
}

function RoomsModal({ onClose, showToast }) {
  const rooms = [
    { name: 'Main Stage', type: 'Stage', here: 482, live: true },
    { name: 'Keynote Room', type: 'Stage', here: 0 },
    { name: 'Emerald Idea Garden', type: 'Spatial', here: 34 },
    { name: 'Sapphire Idea Garden', type: 'Spatial', here: 21 },
    { name: 'Workshop Table A', type: 'Breakout', here: 12 },
    { name: 'Workshop Table B', type: 'Breakout', here: 8 },
    { name: 'Networking Lounge', type: 'Networking', here: 27 },
    { name: 'Welcome Nest', type: 'Lobby', here: 5 },
  ];
  return (
    <div className="plat-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="plat-modal mid">
        <div className="plat-modal-head">
          <div>
            <div className="plat-modal-title">Rooms</div>
            <div className="plat-modal-sub">{rooms.length} rooms in this event — jump to any one</div>
          </div>
          <button className="plat-modal-close" onClick={onClose}><Icon.close size={18}/></button>
        </div>
        <div className="plat-modal-body">
          <div className="sr-rooms">
            {rooms.map(r => (
              <button key={r.name} className="sr-room" onClick={() => { showToast(`Joining ${r.name}…`); onClose(); }}>
                <span className="sr-room-ico"><Icon.grid size={16}/></span>
                <span className="sr-room-info">
                  <span className="sr-room-name">{r.name}{r.live && <span className="sr-room-live">● Live</span>}</span>
                  <span className="sr-room-type">{r.type} room</span>
                </span>
                <span className="sr-room-here"><Icon.user size={12}/> {r.here}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const STAGE_FONTS = ['Geist', 'Inter', 'Poppins', 'Playfair Display', 'DM Sans'];
function StageCustomizeModal({ bg, setBg, logoSize, setLogoSize, font, setFont, logoImg, setLogoImg, onClose, showToast }) {
  const onPick = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => { setLogoImg(r.result); showToast('Logo updated'); };
    r.readAsDataURL(f);
  };
  return (
    <div className="plat-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="plat-modal mid">
        <div className="plat-modal-head">
          <div>
            <div className="plat-modal-title">Customize stage</div>
            <div className="plat-modal-sub">Background, logo, sizing and fonts</div>
          </div>
          <button className="plat-modal-close" onClick={onClose}><Icon.close size={18}/></button>
        </div>
        <div className="plat-modal-body">
          <div className="sc-label">Background</div>
          <div className="sc-bgs">
            {STAGE_BGS.map(b => (
              <button key={b.id} className={`sc-bg ${bg === b.id ? 'sel' : ''}`} style={{ background: b.swatch }} onClick={() => setBg(b.id)} title={b.name}>
                {bg === b.id && <Icon.check size={16}/>}
              </button>
            ))}
          </div>

          <div className="sc-label" style={{ marginTop: 20 }}>Logo</div>
          <div className="sc-logo-row">
            <div className="sc-logo-preview" style={{ background: STAGE_BGS.find(b => b.id === bg)?.swatch }}>
              {logoImg ? <img src={logoImg} alt="" style={{ height: logoSize }}/> : <span style={{ color: '#fff', fontWeight: 800, fontSize: logoSize * 0.6 }}>{STAGE_BGS.find(b => b.id === bg)?.mark}</span>}
            </div>
            <label className="sc-upload">
              <Icon.upload size={14}/> Add picture
              <input type="file" accept="image/*" onChange={onPick} hidden/>
            </label>
            {logoImg && <button className="sc-clear" onClick={() => { setLogoImg(null); showToast('Logo removed'); }}>Remove</button>}
          </div>

          <div className="sc-label" style={{ marginTop: 20 }}>Logo size <span className="sc-val">{logoSize}px</span></div>
          <input className="sc-slider" type="range" min="18" max="56" value={logoSize} onChange={e => setLogoSize(Number(e.target.value))}/>

          <div className="sc-label" style={{ marginTop: 18 }}>Font</div>
          <div className="sc-fonts">
            {STAGE_FONTS.map(f => (
              <button key={f} className={`sc-font ${font === f ? 'sel' : ''}`} style={{ fontFamily: `'${f}', sans-serif` }} onClick={() => setFont(f)}>{f}</button>
            ))}
          </div>
        </div>
        <div className="plat-modal-foot">
          <button className="plat-cta ghost" onClick={onClose}>Cancel</button>
          <button className="plat-cta" style={{ marginLeft: 'auto' }} onClick={() => { showToast('Stage customization saved'); onClose(); }}>Save changes</button>
        </div>
      </div>
    </div>
  );
}

function SummaryModal({ onClose, showToast }) {
  const points = [
    'Teams are treating events as an ongoing channel, not one-off moments.',
    'Repeat attendance is up nearly 40% year over year.',
    'Engagement tooling (polls, Q&A, breakouts) turns dwell time into measurable signals.',
    'Recording + replay distribution extends reach well beyond the live audience.',
  ];
  const actions = [
    'Share the recording and Shorts within 24 hours.',
    'Follow up with the 12 attendees who asked questions.',
    'Re-run the top poll as a LinkedIn post.',
  ];
  return (
    <div className="plat-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="plat-modal mid">
        <div className="plat-modal-head">
          <div>
            <div className="plat-modal-title">Transcription summary</div>
            <div className="plat-modal-sub">AI-generated from the live transcript · 43:09 captured</div>
          </div>
          <button className="plat-modal-close" onClick={onClose}><Icon.close size={18}/></button>
        </div>
        <div className="plat-modal-body">
          <div className="sum-tag"><Icon.megaphone size={13}/> Key points</div>
          <ul className="sum-list">
            {points.map((p, i) => <li key={i}><span className="sum-dot"/>{p}</li>)}
          </ul>
          <div className="sum-tag" style={{ marginTop: 20 }}><Icon.check size={13}/> Suggested follow-ups</div>
          <ul className="sum-list">
            {actions.map((a, i) => <li key={i}><span className="sum-dot" style={{ background: '#16A34A' }}/>{a}</li>)}
          </ul>
        </div>
        <div className="plat-modal-foot">
          <button className="plat-cta ghost" onClick={onClose}>Close</button>
          <button className="plat-cta" style={{ marginLeft: 'auto' }} onClick={() => { showToast('Summary copied'); onClose(); }}><Icon.doc size={14}/> Copy summary</button>
        </div>
      </div>
    </div>
  );
}

function AgendaModal({ onClose }) {
  return (
    <div className="plat-modal-overlay" onClick={onClose}>
      <div className="plat-modal" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
        <div className="plat-modal-head">
          <div>
            <div className="plat-modal-eyebrow">Event agenda</div>
            <div className="plat-modal-title">Live broadcast — May 20, 2026</div>
          </div>
          <button className="plat-modal-close" onClick={onClose}><Icon.close size={18}/></button>
        </div>
        <div className="plat-modal-body" style={{ padding: 0 }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {AGENDA.map((a, i) => (
              <div key={i} style={{
                display: 'grid', gridTemplateColumns: '90px 1fr auto', gap: 16, padding: '14px 20px',
                borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                background: a.live ? 'color-mix(in srgb, var(--brand) 8%, transparent)' : 'transparent',
                opacity: a.done ? 0.55 : 1,
              }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{a.time}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{a.dur}</div>
                </div>
                <div>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5,
                      padding: '2px 8px', borderRadius: 999, background: 'var(--surface-2)', color: 'var(--text-secondary)',
                    }}>{a.tag}</span>
                    {a.live && <span className="stage-live" style={{ fontSize: 10 }}><span className="stage-live-dot"/> ON NOW</span>}
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{a.speaker}</div>
                </div>
                <div style={{ alignSelf: 'center' }}>
                  {a.done ? <Icon.check size={16}/> : <Icon.caretRight size={14}/>}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="plat-modal-foot">
          <button className="plat-cta ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function SponsorsModal({ onClose, showToast }) {
  return (
    <div className="plat-modal-overlay" onClick={onClose}>
      <div className="plat-modal" style={{ maxWidth: 720 }} onClick={e => e.stopPropagation()}>
        <div className="plat-modal-head">
          <div>
            <div className="plat-modal-eyebrow">Brought to you by</div>
            <div className="plat-modal-title">Event sponsors</div>
          </div>
          <button className="plat-modal-close" onClick={onClose}><Icon.close size={18}/></button>
        </div>
        <div className="plat-modal-body">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {SPONSORS.map(s => (
              <div key={s.name} style={{
                border: '1px solid var(--border)', borderRadius: 14, padding: 16,
                display: 'flex', flexDirection: 'column', gap: 10, background: 'var(--surface)',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{
                    width: 40, height: 40, borderRadius: 10, background: s.color, color: '#fff',
                    display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700,
                  }}>{s.mark}</span>
                  <div>
                    <div style={{ fontWeight: 600 }}>{s.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-tertiary)' }}>{s.tier}</div>
                  </div>
                </div>
                <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{s.blurb}</div>
                <button className="plat-cta ghost" style={{ alignSelf: 'flex-start' }}
                  onClick={() => showToast(`Opening ${s.name} booth…`)}>{s.cta}</button>
              </div>
            ))}
          </div>
        </div>
        <div className="plat-modal-foot">
          <button className="plat-cta ghost" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { StageRoom, ClipModal, ShareModal, AgendaModal, SponsorsModal });
