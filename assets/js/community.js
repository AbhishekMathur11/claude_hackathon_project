/* =============================================================================
   C.O.R.E. — THE ASSEMBLY  (pillar 2: community)

   Two halves:
     1. The ally roster — people who already made the jump, always visible.
     2. The distress beacon — post what you are stuck on, get replies.

   The beacon persists to localStorage, which means it is this-device-only. That
   limitation is stated in the UI rather than hidden; swapping `loadBeacon` and
   `saveBeacon` for a Supabase/Firebase free-tier table is the only change needed
   to make it genuinely multi-user.
   ========================================================================== */

const BEACON_KEY = 'core_beacon_v2';
const BEACON_LEGACY_KEY = 'reboot_sos';

/* -----------------------------------------------------------------------------
   STORAGE
--------------------------------------------------------------------------- */

/* Simple unique id — enough to address a signal in a single-device list. */
let idCounter = 0;
function makeId() {
  idCounter += 1;
  return 's' + Date.now().toString(36) + idCounter.toString(36);
}

/* Coerce whatever is in storage into the current shape. Entries written by the
   original single-file prototype used {name, msg, time} and had no replies. */
function normaliseSignal(raw) {
  if (!raw || typeof raw !== 'object') return null;
  const msg = String(raw.msg || '').trim();
  if (!msg) return null;
  return {
    id: raw.id || makeId(),
    name: String(raw.name || 'Anonymous').trim() || 'Anonymous',
    msg,
    ts: raw.ts || raw.time || new Date().toISOString(),
    replies: Array.isArray(raw.replies)
      ? raw.replies
          .map((r) => (r && r.msg ? {
            id: r.id || makeId(),
            name: String(r.name || 'Anonymous').trim() || 'Anonymous',
            msg: String(r.msg).trim(),
            ts: r.ts || new Date().toISOString()
          } : null))
          .filter(Boolean)
      : []
  };
}

function loadBeacon() {
  let list = readStore(BEACON_KEY, null);

  if (list === null) {
    // One-time migration so anyone who used the prototype keeps their signals.
    const legacy = readStore(BEACON_LEGACY_KEY, []);
    list = Array.isArray(legacy) ? legacy : [];
  }

  return (Array.isArray(list) ? list : []).map(normaliseSignal).filter(Boolean);
}

function saveBeacon(list) {
  writeStore(BEACON_KEY, list);
}

/* -----------------------------------------------------------------------------
   RENDERING
--------------------------------------------------------------------------- */

/* Every word worth matching a search query against. */
function allyHaystack(ally) {
  const origins = ally.originIds
    .map((id) => (ORIGINS.find((o) => o.id === id) || {}).from || '')
    .join(' ');
  const track = getTrack(ORIGIN_TRACK[ally.originIds[0]]);
  return [ally.name, ally.codename, ally.from, ally.quote, origins, track.name]
    .join(' ')
    .toLowerCase();
}

function allyTrackId(ally) {
  return ORIGIN_TRACK[ally.originIds[0]] || 'data';
}

function renderAllyRow(ally) {
  const track = getTrack(allyTrackId(ally));
  const liQuery = allyLinkedInQuery(ally);

  return `
    <article class="ally" data-name="${escapeHtml(ally.name)}">
      <div class="avatar" style="background:${escapeHtml(ally.color)}" aria-hidden="true">${escapeHtml(ally.name[0])}</div>
      <div class="ally-body">
        <div class="ally-top">
          <strong class="ally-name">${escapeHtml(ally.name)}</strong>
          <span class="degree" title="Second-degree connection">2nd</span>
        </div>
        <small class="role">${escapeHtml(ally.from)}</small>
        <div class="ally-meta">
          <span class="ally-code">${escapeHtml(ally.codename)}</span>
          <span class="track-chip">${escapeHtml(track.name)}</span>
        </div>
        <blockquote class="bubble">${escapeHtml(ally.quote)}</blockquote>
        <div class="ally-row-actions">
          <button type="button" class="cta cta-magenta" data-act="msg">Message</button>
          <a class="cta cta-li" href="${LI.people(liQuery)}" target="_blank" rel="noopener noreferrer">
            ${LI_MARK} Find on LinkedIn
          </a>
          <a class="cta cta-ghost" href="${LI.jobs(track.liJobs)}" target="_blank" rel="noopener noreferrer">
            Jobs like theirs
          </a>
        </div>
      </div>
    </article>`;
}

/* Filter the roster by the search box and the track dropdown. */
function renderAllies() {
  const query = ($('#allySearch').value || '').trim().toLowerCase();
  const trackFilter = $('#allyTrack').value;

  const shown = ALLIES.filter((ally) => {
    if (trackFilter && allyTrackId(ally) !== trackFilter) return false;
    if (!query) return true;
    return query.split(/\s+/).every((term) => allyHaystack(ally).includes(term));
  });

  $('#allyCount').textContent = shown.length === ALLIES.length
    ? ALLIES.length + ' people'
    : shown.length + ' of ' + ALLIES.length + ' people';

  $('#allies').innerHTML = shown.length
    ? shown.map(renderAllyRow).join('')
    : `<p class="empty">
         Nobody in the local roster matches that. Search the same words on LinkedIn instead —
         <a class="rm-link" href="${LI.people(query || 'career change into AI')}"
            target="_blank" rel="noopener noreferrer">open that search &rarr;</a>
       </p>`;
}

function renderReply(reply) {
  return `
    <li class="reply">
      <strong>${escapeHtml(reply.name)}</strong>
      <span>${escapeHtml(reply.msg)}</span>
      <time datetime="${escapeHtml(reply.ts)}">${escapeHtml(stamp(reply.ts))}</time>
    </li>`;
}

function renderSignal(signal) {
  const count = signal.replies.length;
  return `
    <article class="signal" data-id="${escapeHtml(signal.id)}">
      <header class="signal-head">
        <strong class="signal-name">${escapeHtml(signal.name)}</strong>
        <time datetime="${escapeHtml(signal.ts)}">${escapeHtml(stamp(signal.ts))}</time>
        <button type="button" class="signal-del" data-action="delete-signal"
                aria-label="Delete signal from ${escapeHtml(signal.name)}">&times;</button>
      </header>
      <p class="signal-msg">${escapeHtml(signal.msg)}</p>

      ${count ? `<ul class="replies">${signal.replies.map(renderReply).join('')}</ul>` : ''}

      <form class="reply-form" data-action="reply-form">
        <label class="sr-only" for="reply-name-${escapeHtml(signal.id)}">Your name</label>
        <input id="reply-name-${escapeHtml(signal.id)}" class="reply-name" type="text"
               placeholder="You" maxlength="40" autocomplete="nickname">
        <label class="sr-only" for="reply-msg-${escapeHtml(signal.id)}">Your answer</label>
        <input id="reply-msg-${escapeHtml(signal.id)}" class="reply-msg" type="text"
               placeholder="${count ? 'Add another answer' : 'Answer this'}" maxlength="280" required>
        <button type="submit">Reply</button>
      </form>

      <div class="signal-actions">
        <a class="cta cta-li" href="${LI.post(signal.msg)}" target="_blank" rel="noopener noreferrer">
          ${LI_MARK} Ask this on LinkedIn
        </a>
        <a class="cta cta-ghost" href="${LI.people(signal.msg.split(/\s+/).slice(0, 6).join(' '))}"
           target="_blank" rel="noopener noreferrer">Find someone who knows</a>
      </div>
    </article>`;
}

function renderBeacon() {
  const all = loadBeacon();
  const container = $('#signalList');
  const query = ($('#signalSearch').value || '').trim().toLowerCase();
  const onlyOpen = $('#signalOpen').getAttribute('aria-pressed') === 'true';

  const list = all.filter((signal) => {
    if (onlyOpen && signal.replies.length) return false;
    if (!query) return true;
    const hay = (signal.name + ' ' + signal.msg + ' ' +
      signal.replies.map((r) => r.name + ' ' + r.msg).join(' ')).toLowerCase();
    return hay.includes(query);
  });

  $('#signalCount').textContent = all.length
    ? (list.length === all.length ? all.length : list.length + ' of ' + all.length) +
      (all.length === 1 && list.length === all.length ? ' signal up' : ' signals up')
    : 'No signals yet';

  $('#clearBeacon').hidden = all.length === 0;
  $('#signalTools').hidden = all.length === 0;

  if (!all.length) {
    container.innerHTML = '<p class="empty">Nothing on the wire yet — be the first to send one up.</p>';
    return;
  }
  if (!list.length) {
    container.innerHTML = `<p class="empty">
      No signal matches that. Ask the wider network instead —
      <a class="rm-link" href="${LI.content(query || 'career change into AI')}"
         target="_blank" rel="noopener noreferrer">search LinkedIn posts &rarr;</a>
    </p>`;
    return;
  }

  // Newest first.
  container.innerHTML = list.slice().reverse().map(renderSignal).join('');
}

/* -----------------------------------------------------------------------------
   ACTIONS
--------------------------------------------------------------------------- */

function postSignal(event) {
  event.preventDefault();
  const nameField = $('#signalName');
  const msgField = $('#signalMsg');

  const msg = msgField.value.trim();
  if (!msg) {
    msgField.focus();
    return;
  }

  const list = loadBeacon();
  list.push({
    id: makeId(),
    name: nameField.value.trim() || 'Anonymous',
    msg,
    ts: new Date().toISOString(),
    replies: []
  });
  saveBeacon(list);

  // Drop any active filter, otherwise the signal the user just posted can land
  // outside the current view and read as a failed submit.
  $('#signalSearch').value = '';
  $('#signalOpen').setAttribute('aria-pressed', 'false');
  $('#signalOpen').classList.remove('on');

  msgField.value = '';
  renderBeacon();
  msgField.focus();
}

function addReply(signalId, name, msg) {
  const list = loadBeacon();
  const signal = list.find((s) => s.id === signalId);
  if (!signal) return;

  signal.replies.push({
    id: makeId(),
    name: name.trim() || 'Anonymous',
    msg: msg.trim(),
    ts: new Date().toISOString()
  });
  saveBeacon(list);
  renderBeacon();
}

function deleteSignal(signalId) {
  const list = loadBeacon().filter((s) => s.id !== signalId);
  saveBeacon(list);
  renderBeacon();
}

/* -----------------------------------------------------------------------------
   WIRING
--------------------------------------------------------------------------- */

function initCommunity() {
  // --- roster search -------------------------------------------------------
  const trackSel = $('#allyTrack');
  TRACKS.forEach((track) => {
    const opt = document.createElement('option');
    opt.value = track.id;
    opt.textContent = track.name;
    trackSel.appendChild(opt);
  });

  $('#allySearch').addEventListener('input', renderAllies);
  trackSel.addEventListener('change', renderAllies);
  $('#allyClear').addEventListener('click', () => {
    $('#allySearch').value = '';
    trackSel.value = '';
    renderAllies();
    $('#allySearch').focus();
  });

  // "Message" copies the ally's pre-written intro so nobody has to draft the
  // scary opening line themselves.
  $('#allies').addEventListener('click', async (event) => {
    const btn = event.target.closest('[data-act="msg"]');
    if (!btn) return;
    const card = btn.closest('.ally');
    const ally = ALLIES.find((a) => a.name === card.dataset.name);
    if (!ally) return;
    const ok = await copyText(ally.intro);
    flashButton(btn, ok ? 'Intro copied' : 'Copy failed');
  });

  renderAllies();

  // --- beacon --------------------------------------------------------------
  renderBeacon();

  $('#signalSearch').addEventListener('input', renderBeacon);
  $('#signalOpen').addEventListener('click', (event) => {
    const btn = event.currentTarget;
    const on = btn.getAttribute('aria-pressed') === 'true';
    btn.setAttribute('aria-pressed', String(!on));
    btn.classList.toggle('on', !on);
    renderBeacon();
  });

  $('#signalForm').addEventListener('submit', postSignal);

  $('#clearBeacon').addEventListener('click', () => {
    if (!window.confirm('Clear every signal stored on this device? This cannot be undone.')) return;
    saveBeacon([]);
    renderBeacon();
  });

  // Delegated: the signal list is re-rendered on every change, so per-node
  // listeners would have to be re-attached each time.
  const list = $('#signalList');

  list.addEventListener('click', (event) => {
    const del = event.target.closest('[data-action="delete-signal"]');
    if (!del) return;
    const card = del.closest('.signal');
    if (!card) return;
    if (!window.confirm('Delete this signal and its replies?')) return;
    deleteSignal(card.dataset.id);
  });

  list.addEventListener('submit', (event) => {
    const form = event.target.closest('[data-action="reply-form"]');
    if (!form) return;
    event.preventDefault();

    const card = form.closest('.signal');
    const msg = $('.reply-msg', form).value.trim();
    if (!card || !msg) return;

    addReply(card.dataset.id, $('.reply-name', form).value, msg);
  });
}
