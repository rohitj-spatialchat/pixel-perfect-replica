/* global React, Icon */
// "At a Glance" — clean, friendly headline read of the event (real data)

function EngagementPulse({ ev }) {
  const k = ev.kpis;
  const topRoom = ev.rooms[0];

  const tiles = [
    { ico: Icon.clock, tint: '#5B5BF5', value: k.avgDwell, unit: 'min', label: 'Average time spent', sub: `${k.stayed30}% stayed past 30 minutes` },
    { ico: Icon.grid, tint: '#16A34A', value: k.avgRooms, unit: 'rooms', label: 'Explored per person', sub: `${k.multiRoom}% visited more than one room` },
    { ico: Icon.users, tint: '#F59E0B', value: k.peakConcurrency, unit: '', label: 'Peak people together', sub: `of ${k.uniqueAttendees} total attendees` },
  ];

  const highlights = [
    { ico: Icon.clock, tint: '#5B5BF5', head: 'People stayed a long time',
      text: `Sessions ran ${k.avgDwell} minutes on average — well past a quick drop-in, with ${k.stayed30}% staying at least half an hour.` },
    { ico: Icon.grid, tint: '#16A34A', head: 'Attendees moved around',
      text: `The average guest explored ${k.avgRooms} rooms, and ${k.multiRoom}% visited more than one — this behaved like a real space, not a single webinar.` },
    { ico: Icon.star, tint: '#7C3AED', head: `${topRoom.name} was the anchor`,
      text: `It held ${topRoom.share}% of all room time. Keep your most important moments here.` },
    { ico: Icon.chat, tint: '#EF4444', head: 'Room to lift interaction',
      text: `Only ${k.interactionRate}% used chat, mic or tools. On-stage prompts and room hosts can turn all that dwell into visible participation.` },
  ];

  return (
    <div className="eid-section">
      <div className="eid-section-head">
        <div>
          <div className="eid-section-title">At a Glance</div>
          <div className="eid-section-sub">The headline numbers for this event, in plain language</div>
        </div>
      </div>

      <div className="glance-tiles">
        {tiles.map((t, i) => (
          <div key={i} className="glance-tile">
            <span className="glance-ico" style={{ background: `${t.tint}1A`, color: t.tint }}><t.ico size={18}/></span>
            <div className="glance-val">{t.value}{t.unit && <span className="glance-unit"> {t.unit}</span>}</div>
            <div className="glance-label">{t.label}</div>
            <div className="glance-sub">{t.sub}</div>
          </div>
        ))}
      </div>

      <div className="eid-card" style={{ marginTop: 14 }}>
        <div className="eid-card-title">What this means</div>
        <div className="eid-card-sub" style={{ marginBottom: 4 }}>Four takeaways from the data</div>
        <div className="glance-hi-list">
          {highlights.map((h, i) => (
            <div key={i} className="glance-hi">
              <span className="glance-hi-ico" style={{ background: `${h.tint}1A`, color: h.tint }}><h.ico size={16}/></span>
              <div>
                <div className="glance-hi-head">{h.head}</div>
                <div className="glance-hi-text">{h.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { EngagementPulse });
