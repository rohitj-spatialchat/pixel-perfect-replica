/* global React, Icon */
// Right-side floating panel: Rooms / Chat / Calendar tabs
// Chat includes a live-poll system (create, vote, live results) modeled on
// how Slido / Zoom / Mentimeter run in-meeting polls.

const { useState, useRef, useEffect } = React;

const ROOMS = [
  { id: 'welcome', name: 'SCU Welcome Lobby', cap: '1/50', active: true, sub: [
    { id: 'r', name: 'Riddhik', you: true, star: true },
  ]},
  { id: 'stage',   name: 'SCU Stage Room', cap: '0/5000' },
  { id: 'work',    name: 'Workshop Room',  cap: '0/50' },
  { id: 'meet',    name: 'Meeting',        cap: '0/25' },
  { id: 'phd',     name: 'ASU PHD Classroom', cap: '0/50' },
  { id: 'lobby',   name: 'SCU Lobby',      cap: '0/50' },
];

const PHOTOS = {
  priya: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
  marco: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
  sarah: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
};

function SidePanel({ activeTab = 'rooms', onTabChange, onClose }) {
  const [expanded, setExpanded] = useState({ welcome: true });
  const [activeRoom, setActiveRoom] = useState('welcome');

  return (
    <aside
      className={`side-panel ${activeTab === 'chat' ? 'chat-active' : ''}`}
      data-screen-label="Side panel"
    >
      <div className="panel-header">
        <span className="panel-title">
          {activeTab === 'rooms' && 'Rooms'}
          {activeTab === 'chat' && 'Chat'}
          {activeTab === 'calendar' && 'Calendar'}
        </span>
        <div className="panel-header-tabs">
          <button
            className={`panel-tab ${activeTab === 'rooms' ? 'active' : ''}`}
            onClick={() => onTabChange?.('rooms')}
            title="Rooms"
          ><Icon.user size={15}/></button>
          <button
            className={`panel-tab ${activeTab === 'chat' ? 'active' : ''}`}
            onClick={() => onTabChange?.('chat')}
            title="Chat"
          ><Icon.chat size={15}/></button>
          <button
            className={`panel-tab ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => onTabChange?.('calendar')}
            title="Calendar"
          ><Icon.calendar size={15}/></button>
        </div>
      </div>

      {activeTab === 'rooms' && (
        <>
          <div className="panel-search">
            <span className="panel-search-icon"><Icon.search size={14}/></span>
            <input placeholder="Find Users / Rooms"/>
          </div>

          <div className="panel-body">
            {ROOMS.map(room => {
              const isExpanded = !!expanded[room.id];
              const isActive = activeRoom === room.id;
              return (
                <div key={room.id}>
                  <div
                    className={`room-row ${isActive ? 'active' : ''} ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => {
                      setActiveRoom(room.id);
                      if (room.sub) setExpanded(e => ({...e, [room.id]: !e[room.id] }));
                    }}
                  >
                    <span className="room-row-caret">
                      {room.sub ? <Icon.caretRight size={10}/> : null}
                    </span>
                    <span className="room-row-icon">
                      {room.id === 'work' ? <Icon.whiteboard size={14}/>
                        : room.id === 'meet' ? <Icon.grid size={14}/>
                        : <Icon.user size={14}/>}
                    </span>
                    <span className="room-name">{room.name}</span>
                    <span className="room-cap">{room.cap}</span>
                  </div>

                  {isExpanded && room.sub && room.sub.map(m => (
                    <div key={m.id} className="member-row">
                      <span className={`member-avatar ${m.star ? 'star' : ''}`}>R</span>
                      <span className="member-name">
                        {m.name}{' '}
                        {m.you && <span className="member-name-you">(you)</span>}
                      </span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>

          <div className="panel-footer">
            <button className="add-room-btn">
              <Icon.plus size={14}/>
              Add Room
            </button>
          </div>
        </>
      )}

      {activeTab === 'chat' && <ChatPanel/>}
      {activeTab === 'calendar' && <CalendarPanel/>}
    </aside>
  );
}

// ---- Seed conversation (with an embedded live poll) ----
const SEED_MESSAGES = [
  { id: 1, type: 'msg', who: 'Priya', photo: PHOTOS.priya, time: '10:02', text: 'Morning everyone! Welcome to the product workshop 🎉' },
  { id: 2, type: 'msg', who: 'Marco', photo: PHOTOS.marco, time: '10:03', text: 'Glad to be here. The new room backgrounds look amazing.', reactions: [{ emoji: '🔥', count: 3, mine: false }] },
  { id: 3, type: 'msg', who: 'You', me: true, time: '10:04', text: 'Thanks! We shipped those last week. Letʼs kick off with a quick poll.' },
  {
    id: 4, type: 'poll', who: 'You', me: true, time: '10:04',
    poll: {
      question: 'Which session should we run first?',
      multi: false,
      anonymous: true,
      status: 'live',
      totalBase: 23,
      options: [
        { id: 'a', label: 'Live prototyping demo', votes: 11 },
        { id: 'b', label: 'Roadmap deep-dive', votes: 7 },
        { id: 'c', label: 'Open Q&A', votes: 5 },
      ],
    },
  },
  { id: 5, type: 'msg', who: 'Sarah', photo: PHOTOS.sarah, time: '10:06', text: 'Voted! Prototyping demo would be 🙌' },
  { id: 6, type: 'msg', who: 'Marco', photo: PHOTOS.marco, time: '10:07', text: 'Same here. Can we get the recording afterwards?' },
  { id: 7, type: 'msg', who: 'You', me: true, time: '10:07', text: 'Yep — itʼll be in Recordings under the dashboard.' },
];

const EMOJIS = ['👍', '❤️', '🔥', '🎉', '😂', '👏', '🙌', '✅'];

function ChatPanel() {
  const [seg, setSeg] = useState('room');
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [draft, setDraft] = useState('');
  const [composingPoll, setComposingPoll] = useState(false);
  const threadRef = useRef(null);
  const textareaRef = useRef(null);

  // Auto-scroll to bottom on new message
  useEffect(() => {
    if (threadRef.current) {
      threadRef.current.scrollTop = threadRef.current.scrollHeight;
    }
  }, [messages, composingPoll]);

  const sendMessage = () => {
    const text = draft.trim();
    if (!text) return;
    setMessages(m => [...m, {
      id: Date.now(), type: 'msg', who: 'You', me: true,
      time: nowTime(), text,
    }]);
    setDraft('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const vote = (msgId, optId) => {
    setMessages(ms => ms.map(m => {
      if (m.id !== msgId || m.type !== 'poll') return m;
      const poll = m.poll;
      if (poll.status !== 'live') return m;
      const prev = poll.myVote;
      if (prev === optId) return m; // already voted this
      const options = poll.options.map(o => {
        let votes = o.votes;
        if (o.id === optId) votes += 1;
        if (o.id === prev) votes -= 1;
        return { ...o, votes };
      });
      return { ...m, poll: { ...poll, options, myVote: optId, voted: true } };
    }));
  };

  const endPoll = (msgId) => {
    setMessages(ms => ms.map(m =>
      m.id === msgId && m.type === 'poll'
        ? { ...m, poll: { ...m.poll, status: 'closed' } }
        : m
    ));
  };

  const addPoll = (pollData) => {
    setMessages(m => [...m, {
      id: Date.now(), type: 'poll', who: 'You', me: true,
      time: nowTime(), poll: { ...pollData, status: 'live', totalBase: 0 },
    }]);
    setComposingPoll(false);
  };

  const addReaction = (msgId, emoji) => {
    setMessages(ms => ms.map(m => {
      if (m.id !== msgId) return m;
      const reactions = [...(m.reactions || [])];
      const existing = reactions.find(r => r.emoji === emoji);
      if (existing) {
        existing.count += existing.mine ? -1 : 1;
        existing.mine = !existing.mine;
        return { ...m, reactions: reactions.filter(r => r.count > 0) };
      }
      return { ...m, reactions: [...reactions, { emoji, count: 1, mine: true }] };
    }));
  };

  return (
    <div className="chat-wrap">
      <div className="chat-seg">
        <button className={`chat-seg-btn ${seg === 'room' ? 'active' : ''}`} onClick={() => setSeg('room')}>
          Room chat
        </button>
        <button className={`chat-seg-btn ${seg === 'direct' ? 'active' : ''}`} onClick={() => setSeg('direct')}>
          Direct <span className="chat-seg-badge">2</span>
        </button>
      </div>

      {seg === 'room' ? (
        <>
          <div className="chat-thread" ref={threadRef}>
            <div className="chat-day"><span>Today</span></div>
            {messages.map(m =>
              m.type === 'poll'
                ? <PollMessage key={m.id} msg={m} onVote={vote} onEnd={endPoll}/>
                : <ChatMessage key={m.id} msg={m} onReact={addReaction}/>
            )}
          </div>

          {composingPoll ? (
            <PollComposer onLaunch={addPoll} onCancel={() => setComposingPoll(false)}/>
          ) : (
            <div className="chat-composer">
              <div className="chat-quickbar">
                <button className="chat-quick" onClick={() => setComposingPoll(true)}>
                  <Icon.chart size={13}/> Create poll
                </button>
                <button className="chat-quick">
                  <Icon.megaphone size={13}/> Announce
                </button>
              </div>
              <div className="chat-input-row">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  placeholder="Message the room…"
                  value={draft}
                  onChange={(e) => {
                    setDraft(e.target.value);
                    e.target.style.height = 'auto';
                    e.target.style.height = e.target.scrollHeight + 'px';
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
                  }}
                />
                <div className="chat-input-tools">
                  <button className="chat-tool-btn poll" title="Create poll" onClick={() => setComposingPoll(true)}>
                    <Icon.chart size={16}/>
                  </button>
                  <button className="chat-tool-btn" title="Emoji"><Icon.emoji size={16}/></button>
                </div>
                <button className="chat-send" onClick={sendMessage} disabled={!draft.trim()}>
                  <Icon.send size={15}/>
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <DirectList/>
      )}
    </div>
  );
}

function ChatMessage({ msg, onReact }) {
  const [showPicker, setShowPicker] = useState(false);
  return (
    <div className={`chat-msg ${msg.me ? 'me' : ''}`}>
      <span
        className="chat-msg-avatar"
        style={msg.photo
          ? { backgroundImage: `url('${msg.photo}')` }
          : { background: 'var(--brand-mint)' }}
      >{!msg.photo && (msg.who[0])}</span>
      <div className="chat-msg-content">
        <div className="chat-msg-head">
          <span className="chat-msg-name">{msg.who}</span>
          <span className="chat-msg-time">{msg.time}</span>
        </div>
        <div
          className="chat-bubble"
          onDoubleClick={() => onReact(msg.id, '👍')}
          onClick={() => !msg.me && setShowPicker(s => !s)}
        >
          {msg.text}
        </div>
        {showPicker && (
          <div className="chat-reactions">
            {EMOJIS.slice(0, 6).map(e => (
              <button key={e} className="chat-reaction" onClick={() => { onReact(msg.id, e); setShowPicker(false); }}>{e}</button>
            ))}
          </div>
        )}
        {msg.reactions && msg.reactions.length > 0 && (
          <div className="chat-reactions">
            {msg.reactions.map(r => (
              <button key={r.emoji} className={`chat-reaction ${r.mine ? 'mine' : ''}`} onClick={() => onReact(msg.id, r.emoji)}>
                {r.emoji} {r.count}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PollMessage({ msg, onVote, onEnd }) {
  const poll = msg.poll;
  const live = poll.status === 'live';
  const totalVotes = poll.options.reduce((s, o) => s + o.votes, 0) + (poll.totalBase || 0);
  const showResults = poll.voted || !live;

  return (
    <div className={`chat-msg ${msg.me ? 'me' : ''}`}>
      <span
        className="chat-msg-avatar"
        style={msg.photo ? { backgroundImage: `url('${msg.photo}')` } : { background: 'var(--brand-mint)' }}
      >{!msg.photo && msg.who[0]}</span>
      <div className="chat-msg-content" style={{ maxWidth: '92%', width: '100%' }}>
        <div className="chat-msg-head">
          <span className="chat-msg-name">{msg.who}</span>
          <span className="chat-msg-time">{msg.time}</span>
        </div>
        <div className="poll-card">
          <div className="poll-card-head">
            <span className="poll-badge"><Icon.chart size={11}/> Poll</span>
            {live
              ? <span className="poll-status"><span className="poll-live-dot"/> Live</span>
              : <span className="poll-status">Closed</span>}
          </div>
          <div className="poll-q">{poll.question}</div>
          <div className="poll-sub">
            {poll.multi ? 'Select all that apply' : 'Select one'}
            {poll.anonymous ? ' · Anonymous' : ''}
          </div>

          <div className="poll-opts">
            {poll.options.map(o => {
              const optTotal = poll.options.reduce((s, x) => s + x.votes, 0) + (poll.totalBase || 0);
              const pct = optTotal > 0 ? Math.round((o.votes / optTotal) * 100) : 0;
              const mine = poll.myVote === o.id;
              return (
                <div
                  key={o.id}
                  className={`poll-opt ${mine ? 'mine' : ''}`}
                  onClick={() => live && onVote(msg.id, o.id)}
                  style={!live ? { cursor: 'default' } : undefined}
                >
                  {showResults && <span className="poll-opt-fill" style={{ width: `${pct}%` }}/>}
                  <span className="poll-opt-check">
                    {mine && <Icon.check size={11}/>}
                  </span>
                  <span className="poll-opt-label">{o.label}</span>
                  {showResults && <span className="poll-opt-pct">{pct}%</span>}
                </div>
              );
            })}
          </div>

          <div className="poll-foot">
            <span className="poll-foot-stat">
              {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
              {!poll.voted && live ? ' · tap to vote' : ''}
            </span>
            {msg.me && live
              ? <span className="poll-foot-action" onClick={() => onEnd(msg.id)}>End poll</span>
              : (poll.voted && live ? <span className="poll-foot-stat">✓ You voted</span> : null)}
          </div>
        </div>
      </div>
    </div>
  );
}

function PollComposer({ onLaunch, onCancel }) {
  const [question, setQuestion] = useState('');
  const [opts, setOpts] = useState([{ id: 'o1', label: '' }, { id: 'o2', label: '' }]);
  const [multi, setMulti] = useState(false);
  const [anonymous, setAnonymous] = useState(true);

  const setOpt = (id, label) => setOpts(o => o.map(x => x.id === id ? { ...x, label } : x));
  const addOpt = () => setOpts(o => [...o, { id: 'o' + (o.length + 1) + Date.now(), label: '' }]);
  const removeOpt = (id) => setOpts(o => o.length > 2 ? o.filter(x => x.id !== id) : o);

  const validOpts = opts.filter(o => o.label.trim());
  const canLaunch = question.trim() && validOpts.length >= 2;

  const launch = () => {
    if (!canLaunch) return;
    onLaunch({
      question: question.trim(),
      multi, anonymous,
      options: validOpts.map((o, i) => ({ id: 'a' + i, label: o.label.trim(), votes: 0 })),
    });
  };

  return (
    <div className="poll-composer">
      <div className="poll-composer-head">
        <span className="poll-composer-title"><Icon.chart size={15}/> New poll</span>
        <button className="chat-tool-btn" onClick={onCancel}><Icon.close size={15}/></button>
      </div>

      <input
        className="poll-field"
        placeholder="Ask a question…"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        autoFocus
      />

      {opts.map((o, i) => (
        <div key={o.id} className="poll-composer-opt">
          <input
            className="poll-field"
            placeholder={`Option ${i + 1}`}
            value={o.label}
            onChange={(e) => setOpt(o.id, e.target.value)}
          />
          {opts.length > 2 && (
            <button className="poll-opt-remove" onClick={() => removeOpt(o.id)}>
              <Icon.close size={14}/>
            </button>
          )}
        </div>
      ))}

      {opts.length < 6 && (
        <button className="poll-add-opt" onClick={addOpt}>
          <Icon.plus size={13}/> Add option
        </button>
      )}

      <div className="poll-settings">
        <button className={`poll-setting ${multi ? 'on' : ''}`} onClick={() => setMulti(m => !m)}>
          <span className="poll-mini-toggle"/> Multiple choice
        </button>
        <button className={`poll-setting ${anonymous ? 'on' : ''}`} onClick={() => setAnonymous(a => !a)}>
          <span className="poll-mini-toggle"/> Anonymous
        </button>
      </div>

      <div className="poll-composer-actions">
        <button className="poll-btn poll-btn-ghost" onClick={onCancel}>Cancel</button>
        <button className="poll-btn poll-btn-primary" disabled={!canLaunch} onClick={launch}>
          Launch poll
        </button>
      </div>
    </div>
  );
}

function DirectList() {
  const people = [
    { name: 'Priya Nair', photo: PHOTOS.priya, last: 'See you in the stage room', time: '9:58', unread: 2 },
    { name: 'Marco Reyes', photo: PHOTOS.marco, last: 'Thanks for the invite!', time: 'Yest', unread: 0 },
    { name: 'Sarah Kim', photo: PHOTOS.sarah, last: 'Voted 👍', time: 'Yest', unread: 0 },
  ];
  return (
    <div className="chat-thread" style={{ gap: 2 }}>
      {people.map(p => (
        <div key={p.name} className="member-row" style={{ padding: '10px 8px', gap: 12 }}>
          <span className="chat-msg-avatar" style={{ backgroundImage: `url('${p.photo}')`, width: 38, height: 38 }}/>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--panel-text)' }}>{p.name}</span>
              <span style={{ fontSize: 11, color: 'var(--panel-text-secondary)' }}>{p.time}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
              <span style={{ fontSize: 12, color: 'var(--panel-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.last}</span>
              {p.unread > 0 && <span className="chat-seg-badge">{p.unread}</span>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarPanel() {
  return (
    <div className="panel-body" style={{ padding: '0 12px 12px', color: 'var(--panel-text)' }}>
      <div style={{ fontSize: 12, color: 'var(--panel-text-secondary)', padding: '8px 0' }}>
        Today · June 2
      </div>
      {[
        { time: '10:00', title: 'Design sync', dur: '30m' },
        { time: '14:00', title: 'Workshop room', dur: '1h' },
        { time: '16:30', title: 'PHD Classroom', dur: '45m' },
      ].map((e, i) => (
        <div key={i} style={{
          display: 'flex', gap: 12, padding: '10px 12px', borderRadius: 8,
          marginBottom: 4, cursor: 'pointer',
        }}
          onMouseOver={(ev) => ev.currentTarget.style.background = 'var(--panel-bg-hover)'}
          onMouseOut={(ev) => ev.currentTarget.style.background = 'transparent'}
        >
          <span style={{ fontSize: 12, color: 'var(--panel-text-secondary)', minWidth: 40, fontVariantNumeric: 'tabular-nums' }}>{e.time}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{e.title}</div>
            <div style={{ fontSize: 11, color: 'var(--panel-text-secondary)' }}>{e.dur}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

function nowTime() {
  const d = new Date();
  let h = d.getHours();
  const m = d.getMinutes().toString().padStart(2, '0');
  const ampm = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
}

Object.assign(window, { SidePanel });
