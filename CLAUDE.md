# SpatialChat Platform — Complete Feature & Flow Reference

A guide for Claude (or any AI agent) to understand every functionality, screen, and user flow in this prototype. The app is a **virtual events platform** (competitor to Goldcast / Zuddl / Livestorm) built on top of **SpatialChat-style spatial rooms**.

---

## 1. Tech / File Map

The prototype is vanilla React + Babel-standalone loaded from `index.html`. Each major surface lives in its own JSX file under `public/` (mirrored at project root).

| File | Surface |
|---|---|
| `app.jsx` | Root mount, view router (`shell` / `stage` / `analytics`) |
| `platform-shell.jsx` | Left sidebar + top bar layout for admin platform |
| `platform-pages.jsx` | All sidebar pages: Events, Registration, Recordings, Revenue, Engagement, Community, My Spaces, People |
| `platform-modals.jsx` | Create Event wizard, success/share modals, invite (Upload CSV / CRM / People), Calendar |
| `event-extras.jsx` | Tabs inside Create Event: Tickets, Agenda, Emails, Engagement, Streaming, Integrations, Mobile + extra analytics widgets |
| `analytics-sections.jsx` | Analytics dashboard with widget gallery + edit mode (Stripe-style) |
| `analytics-pulse.jsx` | "At a Glance" KPI summary block |
| `analytics-data.js` | Mock event data (Thinkies, Cecil's) — KPIs, rooms, personas, attendees |
| `platform-data.js` | Mock data for Events, People, Recordings, Revenue |
| `stage-room.jsx` | Live stage view — speakers, top nav (Stage/Rooms/Agenda/Sponsors), tour launcher |
| `stage-room.css` | Stage-specific styles |
| `bottom-bar.jsx` | Stage bottom control bar (Mic/Cam/Share/Record+Transcribe/Reactions/Leave) |
| `side-panel.jsx` | Right side panel — Chat, People, Polls, Q&A |
| `stage-tour.jsx` | Glass spotlight onboarding tour (Admin + Guest steps) |
| `integrations-page.jsx` | Integration cards (HubSpot, Salesforce, Slack, Zapier, etc.) |
| `tweaks-panel.jsx` | Dev panel for tweaking layout |
| `platform.css` / `styles.css` / `stage-room.css` / `analytics-dashboard.css` / `integrations.css` | Theme tokens + component styles |

---

## 2. Top-Level App Flow

```
index.html → app.jsx mounts <App/>
            ├── view='shell'     → PlatformShell (admin dashboard)
            ├── view='stage'     → StageRoom (live event)
            └── view='analytics' → AnalyticsView (post-event intel)
```

State is held in `app.jsx` and switched via top-bar buttons and event handlers (e.g. "Go live" jumps to `stage`, "View analytics" jumps to `analytics`).

---

## 3. Admin Platform (Sidebar Surfaces)

The left sidebar in `PlatformShell` lists:

1. **Events** — list of upcoming/past events, "Create event" CTA opens wizard
2. **Registration** — registrants table, approval queue (when "Require Approval" is on)
3. **Recordings** — past event recordings + **Summary / Transcription** buttons (transcripts saved automatically when an event ends)
4. **Revenue** — ticket sales (paid tickets), conversion
5. **Engagement** — engagement scoring with filter panel
6. **Community** — members across events
7. **My Spaces** — spatial rooms library, category sidebar (matches user's reference screenshot)
8. **People** — contact database, reusable as invite source
9. **Integrations** — connector cards (separate page)

### Shared FilterPanel
A reusable `FilterPanel` component (search + pill filters: Title, Company, Country, Date joined) appears on: **Events, Registration, Engagement, Community, My Spaces, People**. NOT on Revenue or Recordings (kept original `plat-toolbar`).

---

## 4. Create Event Wizard (`platform-modals.jsx` + `event-extras.jsx`)

Multi-step modal. Step views:

1. **Template** — pick a template (Webinar, Conference, Workshop, etc.)
2. **Details (`DetailsView`)** — name, location, description, date/time, timezone, capacity, event type, **Require Registration Approval**, **Ticket type (Free/Paid)**, **Invite attendees** (chips) with three sources:
   - **Upload CSV** (parses CSV/TXT/TSV, dedupes)
   - **Sync with CRM** (HubSpot, Salesforce, Pipedrive, Zoho, Marketo)
   - **Import from People** (uses internal People DB with search + filter pills)
3. **Tickets** — tiers, pricing, promo codes
4. **Agenda** — multi-track, time-slotted sessions, speaker assignment
5. **Emails** — invite / reminder / post-event sequences
6. **Engagement** — polls, Q&A, reactions toggles + filter panel for audience targeting
7. **Streaming** — RTMP, simulcast to YouTube/LinkedIn
8. **Integrations** — CRM / Slack / Zapier per-event
9. **Mobile** — branded mobile experience
10. **Publish / Success** — confirmation screen with:
    - Share link
    - **Add to Google Calendar** button (and ICS download) — calendar integration like Luma/competitors

---

## 5. Stage Room (Live Event)

`stage-room.jsx` renders:

### Top Nav Tabs
- **Stage** — main speaker grid
- **Rooms** — spatial breakout rooms (modal grid)
- **Agenda** — modal listing sessions: time, presenter, topic + **Enter space** button per row
- **Sponsors** — modal listing sponsor cards

Agenda + Sponsors use the same `plat-overlay` + `plat-modal mid` styling as Rooms for consistency.

### Speaker Grid
Multiple video tiles. The **HD badge appears only on the first (host) tile** — not all four.

### Right Side Panel (`side-panel.jsx`)
Tabs: **Chat**, **People**, **Polls** (renamed from "Poll"), **Q&A**.

### Bottom Bar (`bottom-bar.jsx`)
Buttons (all 48px height, 24px icon containers — vertically aligned):
- Mic, Camera, Share Screen
- **Record** (popover includes **Transcribe** toggle) + standalone **Transcribe** button
- Reactions
- Leave call

**No** Poll button (moved to side panel). **No** "Exit stage" button (removed from top nav).

### Tour (`stage-tour.jsx`)
- **Glass immersive spotlight** style — SVG mask cuts a hole over the targeted element, rest of screen dims with frosted glass
- Tooltips float next to the spotlight with step copy + Next/Back/Skip
- Two flows: `ADMIN_STEPS` (7–8 steps covering speaker controls, recording, agenda, rooms, analytics) and `GUEST_STEPS` (mic, reactions, rooms, chat)
- Launcher button in top-right of stage

### Post-Event
When the event ends:
- Recording saved → appears in **Recordings** sidebar page
- Transcript auto-saved → **Summary** button on the recording opens the transcription

---

## 6. Analytics (`analytics-sections.jsx`)

Post-event intelligence view, data from `analytics-data.js`.

### Sections
1. **EngagementPulse** (`analytics-pulse.jsx`) — At-a-Glance KPI tiles + 4 narrative highlights
2. **Concurrency chart** — line chart over event window
3. **Dwell histogram**
4. **Rooms table** — type, role (Gateway/Anchor/Connector/Supporting), attendees, share %, avg dwell
5. **Personas** — Explorer / Observer / Drop-in / Connector with counts and color coding
6. **Top Attendees** — name, persona, tier (Champion / Highly Engaged), badges
7. **Actions breakdown** — chat, mic, camera, shared elements
8. **Badges legend**
9. **Recommendations** — actionable narrative bullets

### Edit Mode (Stripe-style)
- "Edit dashboard" toggle in the header
- Each widget gets drag handle + remove (×) controls
- **Widget gallery** drawer with addable widgets (KPI tiles, charts, custom metrics)
- Additional widgets from `event-extras.jsx`: Conversion funnel, Email performance, Source attribution, Sponsor CTR, Geographic heatmap

### AI Assistant
Branded **"SpatialChat AI"** (renamed from generic "AI Agent") — natural-language Q&A about the event data.

---

## 7. People / CRM / Upload Flow

Three reusable pickers used wherever attendees/contacts are selected:

1. **Upload CSV** — `<input type="file">`, regex parse, dedupe, returns email[]
2. **Sync with CRM** — modal lists connected CRMs (HubSpot/Salesforce/etc.), pick list/segment
3. **Import from People** — searches internal People table with the standard filter pill panel

All three feed the same chip-list (`InviteChips`) in the Details step and in re-invite flows.

---

## 8. Integrations (`integrations-page.jsx`)

Card grid for: HubSpot, Salesforce, Marketo, Pipedrive, Slack, Zapier, Google Calendar, Outlook, YouTube Live, LinkedIn Live, Zoom (legacy import), Stripe (payments). Each card has Connect / Disconnect / Configure.

---

## 9. Theme Tokens

Defined in `styles.css` / `platform.css` as CSS variables. Dark-leaning, glassmorphism accents, primary accent per event (e.g. Thinkies `#5B5BF5`, Cecil's `#16A34A`). Personas have fixed colors:
- Explorer `#5B5BF5`, Observer `#F59E0B`, Drop-in `#94949E`, Connector `#16A34A`

---

## 10. Known Conventions for Future Edits

- **Don't** add Poll to bottom bar — it lives in side panel as "Polls".
- **Don't** add an "Exit stage" button to stage top nav.
- **HD badge** is host-tile only.
- **Upload CSV** is the canonical label (never "Import").
- **AI agent** is always called **SpatialChat AI**.
- Agenda/Sponsors modals must match Rooms modal styling.
- Filter panel goes on Events / Registration / Engagement / Community / My Spaces / People only — NOT Revenue or Recordings.
- Calendar integration shows on event-published success screen.
- Transcripts auto-save when events end and surface on the Recordings page via a Summary button.
- TanStack Start port plan lives in `.lovable/plan.md` (routes: `/`, `/room`, `/analytics`, `/analytics/:eventId`, `/integrations`, `/stage`).

---

## 11. End-to-End User Stories

**Admin creates and runs an event:**
Sidebar → Events → Create event → pick template → fill Details (with CSV/CRM/People invites) → Tickets → Agenda → Emails → Engagement → Streaming → Integrations → Mobile → Publish → success screen → Add to Google Calendar → Go live → Stage Room (manages speakers, runs polls in side panel, records + transcribes, opens Agenda/Sponsors/Rooms) → ends event → Recordings page shows recording + Summary (transcript) → Analytics page shows post-event intel, can edit dashboard and add widgets.

**Guest attends:**
Receives email → lands on registration → joins → Stage Room → guided tour (Guest steps) → uses mic/reactions/chat/polls in side panel → hops to spatial Rooms or Agenda sessions via "Enter space".
