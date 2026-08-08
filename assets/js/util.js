/* =============================================================================
   C.O.R.E. — SHARED UTILITIES
   Small helpers used by every other module. No app logic lives here.
   ========================================================================== */

/* Shorthand DOM lookups. */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

/* -----------------------------------------------------------------------------
   escapeHtml
   Everything on this page that ends up inside innerHTML goes through here first.
   Users type free text and it gets echoed back into the scan feed, the beacon
   list, and the reply threads — without this, a single `<` breaks the render and
   a crafted string injects markup.
--------------------------------------------------------------------------- */
function escapeHtml(value) {
  return String(value == null ? '' : value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/* Honour the OS "reduce motion" setting — this app is aimed at people who may be
   reading it on an old phone in a loud room, so animation is never load-bearing. */
function prefersReducedMotion() {
  return window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/* -----------------------------------------------------------------------------
   typeLine
   Appends text to a terminal-style feed one character at a time. Text is escaped
   before insertion, and the whole animation collapses to an instant append when
   reduced motion is requested.
--------------------------------------------------------------------------- */
function typeLine(el, text, speed = 12) {
  const safe = escapeHtml(text);

  if (prefersReducedMotion()) {
    el.insertAdjacentHTML('beforeend', safe);
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    let i = 0;
    const timer = setInterval(() => {
      // Escape per-character so a lone `<` never lands in the DOM mid-animation.
      el.insertAdjacentHTML('beforeend', escapeHtml(text[i]));
      i += 1;
      if (i >= text.length) {
        clearInterval(timer);
        resolve();
      }
    }, speed);
  });
}

/* -----------------------------------------------------------------------------
   copyText
   navigator.clipboard requires a secure context, which a double-clicked
   index.html (file://) is not. Fall back to the old execCommand path so the
   "copy this intro" button works no matter how the page was opened.
--------------------------------------------------------------------------- */
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      /* fall through to the legacy path below */
    }
  }

  const scratch = document.createElement('textarea');
  scratch.value = text;
  scratch.setAttribute('readonly', '');
  scratch.style.position = 'fixed';
  scratch.style.top = '-1000px';
  document.body.appendChild(scratch);
  scratch.select();

  let ok = false;
  try {
    ok = document.execCommand('copy');
  } catch (err) {
    ok = false;
  }
  document.body.removeChild(scratch);
  return ok;
}

/* Briefly swap a button's label to confirm an action, then restore it. */
function flashButton(btn, message, ms = 1800) {
  if (btn.dataset.flashing === '1') return;
  const original = btn.textContent;
  btn.dataset.flashing = '1';
  btn.textContent = message;
  setTimeout(() => {
    btn.textContent = original;
    delete btn.dataset.flashing;
  }, ms);
}

/* Locale-formatted timestamp, with hard fallbacks: unparseable values (such as
   the locale strings written by the original prototype) are echoed as-is rather
   than silently vanishing. */
function stamp(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  try {
    return d.toLocaleString(undefined, {
      month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit'
    });
  } catch (err) {
    return d.toISOString().slice(0, 16).replace('T', ' ');
  }
}

/* -----------------------------------------------------------------------------
   localStorage wrappers
   Private-browsing mode and some embedded webviews throw on access rather than
   returning null, so every read and write is guarded.
--------------------------------------------------------------------------- */
function readStore(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed == null ? fallback : parsed;
  } catch (err) {
    return fallback;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (err) {
    return false;
  }
}

/* -----------------------------------------------------------------------------
   LINKEDIN DEEP LINKS
   Plain search URLs — no API, no key, no OAuth. They work signed-out (LinkedIn
   shows its login wall, which is the expected behaviour) and land the user on a
   pre-filled, genuinely useful query rather than a generic homepage.
--------------------------------------------------------------------------- */
const LI = {
  people: (q) => 'https://www.linkedin.com/search/results/people/?keywords=' + encodeURIComponent(q),
  jobs: (q) => 'https://www.linkedin.com/jobs/search/?keywords=' + encodeURIComponent(q) +
    '&location=' + encodeURIComponent('San Francisco Bay Area'),
  groups: (q) => 'https://www.linkedin.com/search/results/groups/?keywords=' + encodeURIComponent(q),
  content: (q) => 'https://www.linkedin.com/search/results/content/?keywords=' + encodeURIComponent(q),
  post: (text) => 'https://www.linkedin.com/feed/?shareActive=true&text=' + encodeURIComponent(text),
  profile: () => 'https://www.linkedin.com/in/me/'
};

/* Look up a track record by id, falling back to the first track. */
function getTrack(trackId) {
  return TRACKS.find((t) => t.id === trackId) || TRACKS[0];
}

/* The origin from the user's most recent scan, if they ran one this device. */
const LAST_ORIGIN_KEY = 'core_last_origin';
function lastOriginId() {
  return readStore(LAST_ORIGIN_KEY, '');
}
function rememberOrigin(originId) {
  writeStore(LAST_ORIGIN_KEY, originId);
}

/* The little "in" chip that marks every button which leaves for LinkedIn. */
const LI_MARK = '<span class="li-mark" aria-hidden="true">in</span>';

/* Allies are illustrative, so we search LinkedIn for their ROLE rather than
   linking a profile that does not exist. `from` reads "Ex-cook → POS/AI Trainer";
   everything after the arrow is the searchable part. */
function allyLinkedInQuery(ally) {
  const parts = String(ally.from).split('→');
  return (parts[1] || parts[0] || '').trim();
}
