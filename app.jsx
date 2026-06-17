/* global React, ReactDOM, Icon, SidePanel, BottomBar, PlatformDashboard, StageRoom,
          useTweaks, TweaksPanel, TweakSection, TweakRadio, TweakColor, TweakToggle */

const { useState: useAppState, useEffect: useAppEffect, useRef: useAppRef } = React;

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "light",
  "accent": "#5B5BF5",
  "panelStyle": "theme",
  "scene": "lobby"
} /*EDITMODE-END*/;

const SCENES = [
{ id: 'lobby', label: 'Welcome lobby' },
{ id: 'stage', label: 'Stage room' },
{ id: 'spatial', label: 'Spatial field' },
{ id: 'workplace', label: 'Workplace' },
{ id: 'empty', label: 'Empty grid' }];

// Participants shown in the grid view (first is "you")
const GRID_PARTICIPANTS = [
  { name: 'Riddhik', photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=600&q=80', muted: false },
  { name: 'Priya',   photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&q=80', muted: false },
  { name: 'Marco',   photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&q=80', muted: true  },
  { name: 'Sarah',   photo: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=600&q=80', muted: false },
  { name: 'Diego',   photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80', muted: false },
  { name: 'Amelia',  photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&q=80', muted: true  },
];


function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [view, setView] = useAppState('room'); // 'room' | 'dashboard' | 'stage'
  const [sidePanelTab, setSidePanelTab] = useAppState('rooms');
  const [sidePanelOpen, setSidePanelOpen] = useAppState(true);
  const [userMenuOpen, setUserMenuOpen] = useAppState(false);
  const [menuDrawerOpen, setMenuDrawerOpen] = useAppState(false);
  const [camOn, setCamOn] = useAppState(false);
  const [micOn, setMicOn] = useAppState(false);
  const [gridOn, setGridOn] = useAppState(false);
  const [toast, setToast] = useAppState(null);
  const userMenuRef = useAppRef(null);
  const toastTimerRef = useAppRef(null);

  // Apply theme
  useAppEffect(() => {
    document.documentElement.setAttribute('data-theme', t.theme);
  }, [t.theme]);

  // Apply accent
  useAppEffect(() => {
    document.documentElement.style.setProperty('--brand-indigo', t.accent);
    const hex = t.accent.replace('#', '');
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const darken = (c) => Math.max(0, Math.round(c * 0.85));
    document.documentElement.style.setProperty('--brand-indigo-hover',
    `rgb(${darken(r)}, ${darken(g)}, ${darken(b)})`);
  }, [t.accent]);

  // Panel style
  useAppEffect(() => {
    if (t.panelStyle === 'theme') {
      document.documentElement.style.setProperty('--panel-bg',
      t.theme === 'dark' ? '#1F1F23' : '#FFFFFF');
      document.documentElement.style.setProperty('--panel-text',
      t.theme === 'dark' ? '#ECECEE' : '#0A0A0A');
      document.documentElement.style.setProperty('--panel-text-secondary',
      t.theme === 'dark' ? '#A1A1A8' : '#6B6B72');
      document.documentElement.style.setProperty('--panel-bg-hover',
      t.theme === 'dark' ? '#2A2A30' : '#F7F7F8');
      document.documentElement.style.setProperty('--panel-border',
      t.theme === 'dark' ? 'rgba(255,255,255,0.05)' : '#E8E8EB');
    } else {
      document.documentElement.style.removeProperty('--panel-bg');
      document.documentElement.style.removeProperty('--panel-text');
      document.documentElement.style.removeProperty('--panel-text-secondary');
      document.documentElement.style.removeProperty('--panel-bg-hover');
      document.documentElement.style.removeProperty('--panel-border');
    }
  }, [t.panelStyle, t.theme]);

  // Click-away for user menu
  useAppEffect(() => {
    if (!userMenuOpen) return;
    const onDown = (e) => {
      if (userMenuRef.current?.contains(e.target)) return;
      setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [userMenuOpen]);

  // Toast auto-dismiss
  const showToast = (msg) => {
    setToast(msg);
    clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 1800);
  };

  const toggleTheme = () => setTweak('theme', t.theme === 'light' ? 'dark' : 'light');

  if (view === 'dashboard') {
    return (
      <>
        <PlatformDashboard
          onEnterRoom={(space) => setView(space && space.stage ? 'stage' : 'room')}
          theme={t.theme}
          onToggleTheme={toggleTheme}
        />
        <TweaksUI tweaks={t} setTweak={setTweak} />
      </>);

  }

  if (view === 'stage') {
    return (
      <>
        <StageRoom
          theme={t.theme}
          onToggleTheme={toggleTheme}
          onLeave={() => setView('room')}
        />
        <TweaksUI tweaks={t} setTweak={setTweak} />
      </>);

  }

  return (
    <div className={`app ${sidePanelOpen ? '' : 'panel-closed'} ${menuDrawerOpen ? 'menu-open' : ''}`}>
      {/* Room canvas */}
      <div className="room-canvas" data-screen-label="Main room" data-scene={t.scene}>
        <div className="room-bg" />
        <div className="room-podium" />
        <RoomDecor />

        {/* Scene-specific overlays */}
        {t.scene === 'stage' &&
        <>
            <div className="stage-neon stage-neon-1" />
            <div className="stage-neon stage-neon-2" />
            <div className="stage-neon stage-neon-3" />
          </>
        }
        {t.scene === 'spatial' &&
        <>
            <div className="spatial-stands" />
            <div className="spatial-field" />
          </>
        }

        {/* User avatar (hidden in grid view or empty scene) */}
        {!gridOn && t.scene !== 'empty' &&
        <div className="room-avatar-wrap">
            <div className="room-avatar">
              R
              <div className={`room-avatar-mic ${micOn ? '' : 'muted'}`}>
                {micOn ? <Icon.mic size={12} /> : <Icon.micOff size={12} />}
              </div>
            </div>
            <div className="room-avatar-name">Riddhik</div>
          </div>
        }

        {/* Grid view overlay */}
        {gridOn &&
        <div className="grid-view">
            {GRID_PARTICIPANTS.map((p, i) => {
              const isYou = i === 0;
              const muted = isYou ? !micOn : p.muted;
              return (
                <div key={p.name} className={`grid-tile ${isYou ? 'you' : ''}`}>
                  <div className="grid-tile-bg" style={{ backgroundImage: `url('${p.photo}')` }}/>
                  <div className="grid-tile-name">{p.name}{isYou ? ' (you)' : ''}</div>
                  <div className={`grid-tile-mic ${muted ? 'muted' : ''}`}>
                    {muted ? <Icon.micOff size={12}/> : <Icon.mic size={12}/>}
                  </div>
                </div>
              );
            })}
          </div>
        }
      </div>

      {/* Top bar */}
      <div className="topbar">
        <div className="topbar-cluster">
          <button className="menu-btn" onClick={() => setMenuDrawerOpen((o) => !o)}>
            <Icon.menu size={16} />
            MENU
          </button>
          <div className="space-tag">
            <span className="space-tag-avatar"><img src="assets/spatialchat-logo.png" alt="SpatialChat"/></span>
            <span className="space-tag-name"><img src="assets/spatialchat-wordmark.png" alt="SpatialChat"/></span>
            <span className="space-tag-divider" />
            <span className="space-tag-room">Riddhik's Space</span>
            <span className="space-tag-count">
              <Icon.user size={10} /> 1
            </span>
          </div>
        </div>

        <div className="topbar-cluster">
          <button className="top-action">
            <Icon.invite size={16} />
            INVITE
          </button>
          <button className="top-action primary">
            <Icon.meet size={16} />
            MEET
          </button>
          <button className="icon-btn" onClick={toggleTheme} title="Toggle theme">
            {t.theme === 'light' ? <Icon.moon size={18} /> : <Icon.sun size={18} />}
          </button>
          <button className="icon-btn" onClick={() => setView('dashboard')} title="Event dashboard">
            <Icon.grid size={18} />
          </button>
          <div style={{ position: 'relative' }} ref={userMenuRef}>
            <button className="user-avatar" onClick={() => setUserMenuOpen((o) => !o)}>R</button>
            {userMenuOpen &&
            <div className="dropdown" style={{ top: 'calc(100% + 8px)', right: 0 }}>
                <div className="dropdown-header">
                  <div className="dropdown-name">Rohit <span style={{ fontWeight: 400, color: 'var(--text-secondary)' }}>(you)</span></div>
                  <div className="dropdown-role">Team admin</div>
                </div>
                <button className="dropdown-item">
                  <Icon.user size={14} /> Your profile
                </button>
                <button className="dropdown-item" onClick={() => {setUserMenuOpen(false);setView('dashboard');}}>
                  <Icon.home size={14} /> Open dashboard
                </button>
                <div className="dropdown-divider" />
                <div className="dropdown-item" style={{ cursor: 'default' }}>
                  <span style={{ flex: 1 }}>Sound effects</span>
                  <span className="toggle on" style={{ pointerEvents: 'none' }} />
                </div>
              </div>
            }
          </div>
        </div>
      </div>

      {/* MENU drawer */}
      {menuDrawerOpen &&
      <div className="menu-drawer" data-screen-label="MENU drawer">
          <div className="menu-drawer-header">
            <span className="menu-drawer-title">Space</span>
            <button className="icon-btn" onClick={() => setMenuDrawerOpen(false)}>
              <Icon.close size={16} />
            </button>
          </div>

          <button className="menu-drawer-item">
            <Icon.shield size={16} /> Space Settings
          </button>
          <button className="menu-drawer-item">
            <Icon.shield size={16} /> Room Permissions
          </button>
          <button className="menu-drawer-item" onClick={() => {setMenuDrawerOpen(false);setView('dashboard');}}>
            <Icon.receipt size={16} /> Plan Details
          </button>

          <div className="menu-drawer-title" style={{ padding: '20px 4px 8px' }}>Live</div>
          <button className="menu-drawer-item" style={{ color: 'var(--brand-indigo)', fontWeight: 600 }} onClick={() => {setMenuDrawerOpen(false);setView('stage');}}>
            <Icon.broadcast size={16} /> Enter Stage Room
          </button>

          <div className="menu-drawer-title" style={{ padding: '20px 4px 8px' }}>Room scene</div>
          {SCENES.map((scene) =>
        <button
          key={scene.id}
          className={`menu-drawer-item ${t.scene === scene.id ? 'active' : ''}`}
          onClick={() => {setTweak('scene', scene.id);setMenuDrawerOpen(false);}}>
          
              <Icon.whiteboard size={16} /> {scene.label}
            </button>
        )}

          <button className="menu-drawer-item danger" onClick={() => {setMenuDrawerOpen(false);setView('dashboard');}}>
            <Icon.power size={16} /> Leave space
          </button>
        </div>
      }

      {/* Left rail */}
      <div className="left-rail">
        <button className="rail-btn active" title="Location"><Icon.user size={16} /></button>
        <button className="rail-btn" title="Background"><Icon.whiteboard size={16} /></button>
        <button className="rail-btn" title="Controls"><Icon.settings size={16} /></button>
        <button className="rail-btn" title="History"><Icon.clock size={16} /></button>
      </div>

      {/* Right side panel */}
      {sidePanelOpen &&
      <SidePanel
        activeTab={sidePanelTab}
        onTabChange={(tab) => {
          if (tab === sidePanelTab) setSidePanelOpen(false);else
          setSidePanelTab(tab);
        }} />

      }

      {!sidePanelOpen &&
      <div style={{ position: 'absolute', top: 72, right: 16, display: 'flex', flexDirection: 'column', gap: 6, zIndex: 15 }}>
          <button className="icon-btn" style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }} onClick={() => {setSidePanelTab('rooms');setSidePanelOpen(true);}}>
            <Icon.user size={16} />
          </button>
          <button className="icon-btn" style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }} onClick={() => {setSidePanelTab('chat');setSidePanelOpen(true);}}>
            <Icon.chat size={16} />
          </button>
          <button className="icon-btn" style={{
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          boxShadow: 'var(--shadow-sm)'
        }} onClick={() => {setSidePanelTab('calendar');setSidePanelOpen(true);}}>
            <Icon.calendar size={16} />
          </button>
        </div>
      }

      {/* Bottom bar */}
      <BottomBar
        camOn={camOn}
        micOn={micOn}
        gridOn={gridOn}
        onToggleCam={() => {setCamOn((c) => !c);showToast(camOn ? 'Camera off' : 'Camera on');}}
        onToggleMic={() => {setMicOn((m) => !m);showToast(micOn ? 'Mic muted' : 'Mic on');}}
        onToggleGrid={() => {setGridOn((g) => !g);showToast(gridOn ? 'Exit grid view' : 'Grid view');}}
        onLeave={() => {showToast('Left space');setTimeout(() => setView('dashboard'), 400);}}
        onOpenChat={() => {setSidePanelTab('chat');setSidePanelOpen(true);}}
        onToast={showToast} />
      

      {/* Toast */}
      {toast && <div className="toast">{toast}</div>}

      {/* Utility cluster */}
      <div className="utility-cluster">
        <button className="utility-btn" title="Help" onClick={() => showToast('Help')}><Icon.help size={14} /></button>
        <button className="utility-btn" title="Report bug" onClick={() => showToast('Report bug')}><Icon.bug size={14} /></button>
      </div>

      <TweaksUI tweaks={t} setTweak={setTweak} />
    </div>);

}

function TopBarFloating({ onTheme, theme, onBackToRoom }) {
  return (
    <div style={{
      position: 'absolute', top: 16, right: 16, zIndex: 30,
      display: 'flex', gap: 8
    }}>
      <button className="btn btn-secondary" onClick={onBackToRoom}>
        <Icon.home size={14} /> Back to room
      </button>
      <button className="icon-btn" onClick={onTheme} style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)'
      }}>
        {theme === 'light' ? <Icon.moon size={16} /> : <Icon.sun size={16} />}
      </button>
    </div>);

}

function RoomDecor() {
  return (
    <svg className="room-decor" viewBox="0 0 120 100" preserveAspectRatio="none">
      <path d="M30 20 Q30 10 40 10 L80 10 Q90 10 90 20 L90 55 Q90 60 85 60 L35 60 Q30 60 30 55 Z"
      fill="rgba(0,0,0,0.04)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
      <line x1="60" y1="60" x2="60" y2="85" stroke="rgba(0,0,0,0.12)" strokeWidth="1" />
      <ellipse cx="60" cy="92" rx="20" ry="3" fill="rgba(0,0,0,0.06)" />
    </svg>);

}

function TweaksUI({ tweaks, setTweak }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Theme" />
      <TweakRadio
        label="Mode"
        value={tweaks.theme}
        options={['light', 'dark']}
        onChange={(v) => setTweak('theme', v)} />
      
      <TweakColor
        label="Accent"
        value={tweaks.accent}
        options={['#5B5BF5', '#7C3AED', '#0EA5E9', '#16A34A', '#F97316']}
        onChange={(v) => setTweak('accent', v)} />
      
      <TweakSection label="Side panel" />
      <TweakRadio
        label="Style"
        value={tweaks.panelStyle}
        options={['dark', 'theme']}
        onChange={(v) => setTweak('panelStyle', v)} />
      
      <TweakSection label="Room scene" />
      <TweakRadio
        label="Scene"
        value={tweaks.scene}
        options={SCENES.map((s) => s.id)}
        onChange={(v) => setTweak('scene', v)} />
      
    </TweaksPanel>);

}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);