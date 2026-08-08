# C.O.R.E. — Candidate Origin Recognition Engine

> Every origin story starts with a day job.

A single-page, zero-dependency web app for a San Franciscan whose work is being
displaced. Say one sentence about what you do all day; C.O.R.E. names the powers
you already have, points at AI-adjacent roles that are hiring now, and hands you
a pre-written opening message to someone who already made that exact jump.

**No paid APIs. No accounts. No build step. No network required after load.**

---

## Run it

Two options, both fine:

```bash
# 1. Just open it
xdg-open index.html          # macOS: open index.html

# 2. Or serve it (needed for voice input — see below)
python3 -m http.server 8000
# then visit http://localhost:8000
```

There is nothing to install and nothing to compile.

> **Voice input caveat:** Chrome's Web Speech API refuses to run on `file://`
> pages because it is not a secure context. Double-clicking `index.html` works
> fine for everything else — the mic button disables itself and says so. Serve
> over `localhost` or HTTPS to get voice.

---

## The three pillars

| Tab | Problem it answers | What it actually does |
|---|---|---|
| ① **Origin Scan** | Job displacement | Local keyword engine maps plain-English work descriptions onto 9 origins → real AI-adjacent roles with honest reasons and live links |
| ② **The Assembly** | Community support | Searchable, LinkedIn-style directory of people who made the same jump (filter by track, deep-link to real LinkedIn people/job searches), plus a distress beacon with threaded replies and its own search |
| ③ **Monday Briefing** | Representation / access | A four-week roadmap compiler: pick origin, track, hours/week and device, get a tailored plan with a real free link on every task, persistent tick-boxes, and a clean printout |

Every scan result surfaces an ally, so pillar ① always hands off to pillar ② —
the community is not a separate tab you have to think to visit.

---

## Layout

```
index.html                  markup + ARIA only
assets/
  css/
    base.css                tokens, shell, tabs, button language
    scanner.css             console, dossier, role cards, ally match
    network.css             ally roster, distress beacon
    monday.css              light comic-panel mode + print stylesheet
  js/
    data.js                 ORIGINS, ALLIES, BRIEFING, TRACKS, ROADMAP_WEEKS
    util.js                 escapeHtml, typeLine, clipboard, storage guards
    scanner.js              matching engine, rendering, voice input
    community.js            searchable roster, beacon CRUD
    monday.js               roadmap compiler, progress, text export
    app.js                  tab routing, boot
```

Scripts are classic `defer`red tags, **not** ES modules — modules are blocked by
CORS on `file://`, and the app has to survive being double-clicked or emailed
around as a folder.

---

## Making it yours

Almost everything you would want to change is in **`assets/js/data.js`**:

- **Add an origin** — append to `ORIGINS`. Multi-word `keywords` score 3, single
  words score 2, and matching is whole-word (so `art` no longer fires inside
  `start`).
- **Add an ally** — append to `ALLIES` with an `originIds` array. Keep at least
  one ally per origin or that scan result loses its human hand-off.
- **Change the Monday steps** — edit `BRIEFING` (the pre-generation starter).
- **Change the roadmap** — edit `ROADMAP_WEEKS`. Each week takes one
  track-specific task plus shared ones; how many survive depends on the hours
  the user picks (`HOURS_TO_TASKS`). A task can declare `link`, or a LinkedIn
  shorthand (`li: 'jobs' | 'groups' | 'profile' | 'post'`), or `tab` for an
  internal jump, and an optional `phone` variant for users with no computer.

### LinkedIn integration

No API, no OAuth, no key. `LI` in `assets/js/util.js` builds plain LinkedIn
search URLs (people / jobs / groups / content / share composer) that land the
user on a pre-filled, genuinely useful query. Because the shipped allies are
illustrative, **Find on LinkedIn** searches for real people currently in that
role rather than linking a profile that does not exist.

The ally profiles shipped here are **illustrative**, built from documented
transition patterns rather than real individuals. Both the roster and the scan
results say so in the UI. Swap in a real roster before showing this to anyone as
a live service.

### Making the beacon real

The distress beacon persists to `localStorage`, so it is this-device-only. That
limit is stated in the UI rather than hidden. To make it genuinely multi-user,
replace exactly two functions in `assets/js/community.js`:

```js
function loadBeacon() { /* → SELECT from a Supabase/Firebase free-tier table */ }
function saveBeacon(list) { /* → UPSERT */ }
```

Everything else — rendering, replies, deletes, the legacy migration — already
works against that interface.

---

## Accessibility notes

The audience for this app is specifically people on old phones, library
computers, and screen readers, so the following are load-bearing rather than
nice-to-have:

- Real ARIA `tablist` with arrow-key / Home / End navigation and roving tabindex
- Every input has a label; the scan feed and mic status are `aria-live` regions
- All user-supplied text is escaped before it touches `innerHTML`
- `prefers-reduced-motion` collapses the typewriter effect and every animation
- Focus is visible against the dark palette (gold outline)
- The Monday tab drops the terminal aesthetic entirely for large, plain,
  high-contrast type, and prints to one page with URLs spelled out

---

## License / credits

Built at a hackathon. Content and code are original; the aesthetic is a
generic superhero-HUD homage and uses no trademarked names, logos, or
characters. External links point to free public resources
(Elements of AI, Google AI Essentials, TechSF, Code Tenderloin, SF JobsNow,
Outlier, Remotasks, Prolific, Hack the Hood, BAVC).
