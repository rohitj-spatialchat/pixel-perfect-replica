/* global React, ReactDOM, Icon */
// Bottom bar — new clean style matching senior's design.
// - All 14 tools pinned by default (icon + label)
// - "+" opens overflow popover to pin/unpin items (rendered via portal so
//   the bottom bar's transform-translate doesn't pin it to bar-local coords)
// - Camera / Mic / Leave on the right
// - Each tool click shows a toast (visual feedback)

const { useState, useRef, useEffect } = React;

const ALL_TOOLS = [
{ id: 'upload', label: 'Upload', icon: Icon.upload },
{ id: 'text', label: 'Text & Li…', icon: Icon.text },
{ id: 'document', label: 'Document', icon: Icon.doc },
{ id: 'video', label: 'Video', icon: Icon.video },
{ id: 'embed', label: 'Embed iFra…', icon: Icon.code },
{ id: 'miro', label: 'Miro white…', icon: Icon.whiteboard },
{ id: 'gdocs', label: 'Google Do…', icon: Icon.globe },
{ id: 'private', label: 'Private area', icon: Icon.door },
{ id: 'draw', label: 'Draw', icon: Icon.pencil },
{ id: 'share', label: 'Share scre…', icon: Icon.share },
{ id: 'chat', label: 'Chat', icon: Icon.chat },
{ id: 'broadcast', label: 'Broadcast', icon: Icon.broadcast },
{ id: 'megaphone', label: 'Megaphone', icon: Icon.megaphone },
{ id: 'view', label: 'View', icon: Icon.grid }];


const STORAGE_KEY = 'sc-pinned-v2';
const DEFAULT_PINNED = ALL_TOOLS.map((t) => t.id);

function BottomBar({ camOn, micOn, gridOn, onToggleCam, onToggleMic, onLeave, onOpenChat, onToggleGrid, onToast }) {
  const [pinned, setPinned] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_PINNED;
    } catch {return DEFAULT_PINNED;}
  });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [popoverPos, setPopoverPos] = useState({ left: 0, bottom: 0 });
  const popRef = useRef(null);
  const btnRef = useRef(null);

  useEffect(() => {
    try {localStorage.setItem(STORAGE_KEY, JSON.stringify(pinned));} catch {}
  }, [pinned]);

  // Compute popover position from the Add button (so the panel opens right above it)
  const computePopoverPos = () => {
    const rect = btnRef.current?.getBoundingClientRect();
    if (!rect) return null;
    return {
      // Anchor popover left edge to button left edge, clamp to viewport
      left: Math.max(16, Math.min(window.innerWidth - 276, rect.left)),
      // Popover sits just above the button
      bottom: window.innerHeight - rect.top + 10
    };
  };

  useEffect(() => {
    if (!popoverOpen) return;
    const onDown = (e) => {
      if (popRef.current?.contains(e.target)) return;
      if (btnRef.current?.contains(e.target)) return;
      setPopoverOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [popoverOpen]);

  const togglePin = (id) => {
    setPinned((p) => p.includes(id) ? p.filter((x) => x !== id) : [...p, id]);
  };

  const handleToolClick = (toolId, toolLabel) => {
    if (toolId === 'chat' && onOpenChat) {
      onOpenChat();
    } else if (toolId === 'view' && onToggleGrid) {
      onToggleGrid();
    } else if (onToast) {
      onToast(`${toolLabel} clicked`);
    }
    setPopoverOpen(false);
  };

  const pinnedTools = ALL_TOOLS.filter((t) => pinned.includes(t.id));

  return (
    <div className="bottom-bar" data-screen-label="Bottom bar">
      {/* Add / overflow */}
      <div style={{ position: 'relative' }}>
        <button
          ref={btnRef}
          className={`bb-btn bb-add ${popoverOpen ? 'open' : ''}`}
          onClick={() => {
            if (!popoverOpen) {
              const pos = computePopoverPos();
              if (pos) setPopoverPos(pos);
            }
            setPopoverOpen((o) => !o);
          }}
          title="Pin or unpin tools">
          
          <span className="bb-btn-icon"><Icon.plus size={18} /></span>
          <span className="bb-btn-label">Add</span>
        </button>

        {popoverOpen && ReactDOM.createPortal(
        <div
          className="bb-popover"
          ref={popRef}
          style={{ left: popoverPos.left, bottom: popoverPos.bottom }}>
          
            <div className="bb-popover-header">Pin tools to bar</div>
            {ALL_TOOLS.map((tool) => {
            const isPinned = pinned.includes(tool.id);
            const ToolIcon = tool.icon;
            return (
              <div
                key={tool.id}
                className={`bb-pop-item ${isPinned ? 'pinned' : ''}`}>
                
                  <button
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    flex: 1, padding: 0, textAlign: 'left', color: 'inherit'
                  }}
                  onClick={() => handleToolClick(tool.id, tool.label.replace(/…/, ''))}>
                  
                    <span className="bb-btn-icon"><ToolIcon size={16} /></span>
                    <span style={{ flex: 1 }}>{tool.label.replace(/…/, '')}</span>
                  </button>
                  <button
                  className="bb-pop-pin"
                  onClick={(e) => {e.stopPropagation();togglePin(tool.id);}}
                  title={isPinned ? 'Unpin from bar' : 'Pin to bar'}>
                  
                    {isPinned ? <Icon.pinFilled size={14} /> : <Icon.pin size={14} />}
                  </button>
                </div>);

          })}
          </div>,
        document.body)
        }
      </div>

      {/* Pinned tools */}
      {pinnedTools.map((tool) => {
        const ToolIcon = tool.icon;
        return (
          <button
            key={tool.id}
            className="bb-btn"
            title={tool.label.replace(/…/, '')}
            onClick={() => handleToolClick(tool.id, tool.label.replace(/…/, ''))}>
            
            <span className="bb-btn-icon"><ToolIcon size={18} /></span>
            <span className="bb-btn-label">{tool.label}</span>
          </button>);

      })}

      <button
        className={`bb-btn ${camOn ? 'camera-on' : ''}`}
        onClick={onToggleCam}
        title={camOn ? 'Turn camera off' : 'Turn camera on'}>
        
        <span className="bb-btn-icon">{camOn ? <Icon.cam size={18} /> : <Icon.camOff size={18} />}</span>
        <span className="bb-btn-label">Camera</span>
      </button>

      <button
        className={`bb-btn ${micOn ? 'mic-on' : ''}`}
        onClick={onToggleMic}
        title={micOn ? 'Mute mic' : 'Unmute mic'}>
        
        <span className="bb-btn-icon">{micOn ? <Icon.mic size={18} /> : <Icon.micOff size={18} />}</span>
        <span className="bb-btn-label">Mic</span>
      </button>

      <button className="bb-btn danger" onClick={onLeave} title="Leave space">
        <span className="bb-btn-icon"><Icon.power size={18} /></span>
        <span className="bb-btn-label">Leave</span>
      </button>
    </div>);

}

Object.assign(window, { BottomBar });