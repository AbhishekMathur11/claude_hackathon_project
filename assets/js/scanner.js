/* =============================================================================
   C.O.R.E. — ORIGIN SCAN  (pillar 1: transitions)

   Takes a plain sentence about what someone does all day and matches it to an
   ORIGINS entry using local keyword scoring. Deliberately no API, no model, no
   network call: it must work on a locked-down library computer with no account.
   ========================================================================== */

/* -----------------------------------------------------------------------------
   MATCHING ENGINE
--------------------------------------------------------------------------- */

/* Collapse input to a space-padded, punctuation-free string so that every
   keyword test below can be a whole-word check rather than a substring check.
   Substring matching was the old behaviour and it fired "art" inside "start". */
function normalise(text) {
  return ' ' + String(text).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim() + ' ';
}

/* Whole-word (or whole-phrase) presence test, tolerant of a trailing plural. */
function containsTerm(haystack, term) {
  const t = term.toLowerCase().trim();
  if (!t) return false;
  if (haystack.includes(' ' + t + ' ')) return true;
  if (haystack.includes(' ' + t + 's ')) return true;
  if (t.endsWith('s') && haystack.includes(' ' + t.slice(0, -1) + ' ')) return true;
  return false;
}

/* Multi-word keywords are much stronger evidence than a single common word,
   so they are worth more. `hits` is tracked separately to break score ties. */
function scoreOrigin(origin, haystack) {
  let score = 0;
  let hits = 0;
  origin.keywords.forEach((keyword) => {
    if (containsTerm(haystack, keyword)) {
      score += keyword.trim().split(/\s+/).length >= 2 ? 3 : 2;
      hits += 1;
    }
  });
  return { origin, score, hits };
}

/* Every origin, ranked. Callers decide how many to show. */
function rankOrigins(text) {
  const haystack = normalise(text);
  return ORIGINS
    .map((origin) => scoreOrigin(origin, haystack))
    .filter((r) => r.score > 0)
    .sort((a, b) => (b.score - a.score) || (b.hits - a.hits));
}

/* -----------------------------------------------------------------------------
   RENDERING
--------------------------------------------------------------------------- */

function findAlly(originId) {
  return ALLIES.find((ally) => ally.originIds.includes(originId)) || null;
}

function renderOriginHeader(origin) {
  return `
    <div class="dossier">
      <div class="dossier-tag">Origin identified</div>
      <h3 class="dossier-name">${escapeHtml(origin.codename)}</h3>
      <div class="dossier-from">${escapeHtml(origin.from)}</div>
      <div class="powers-label">Powers detected — ${origin.powers.length}</div>
      <ul class="powers">
        ${origin.powers.map((p) => `<li>${escapeHtml(p)}</li>`).join('')}
      </ul>
    </div>`;
}

function renderRoleCard(match) {
  return `
    <article class="resultcard">
      <h3>${escapeHtml(match.role)}</h3>
      <p class="why">${escapeHtml(match.why)}</p>
      <div class="taglist">
        ${match.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join('')}
      </div>
      <div class="meterlabel"><span>Signal strength</span><span>${Number(match.pct)}%</span></div>
      <div class="meter" role="img" aria-label="Signal strength ${Number(match.pct)} percent">
        <div class="meterfill" data-pct="${Number(match.pct)}"></div>
      </div>
      <div class="card-actions">
        <a class="cta" href="${escapeHtml(match.link)}" target="_blank" rel="noopener noreferrer">
          See this path &rarr;
        </a>
        <a class="cta cta-li" href="${LI.jobs(match.role)}" target="_blank" rel="noopener noreferrer">
          ${LI_MARK} Open roles in the Bay Area
        </a>
      </div>
    </article>`;
}

function renderAllyCard(ally) {
  const subject = encodeURIComponent('C.O.R.E. — quick question about your transition');
  const body = encodeURIComponent(ally.intro);
  const liQuery = allyLinkedInQuery(ally);
  return `
    <div class="allymatch">
      <h3>&#9650; Ally located</h3>
      <div class="ally-head">
        <div class="avatar" style="background:${escapeHtml(ally.color)}" aria-hidden="true">${escapeHtml(ally.name[0])}</div>
        <div>
          <strong class="ally-name">${escapeHtml(ally.name)}</strong>
          <span class="ally-code">${escapeHtml(ally.codename)}</span>
          <small class="role">${escapeHtml(ally.from)}</small>
        </div>
      </div>
      <p class="draft-label">Your opening message is already written:</p>
      <blockquote class="draft">${escapeHtml(ally.intro)}</blockquote>
      <div class="ally-actions">
        <button type="button" class="cta cta-magenta" data-action="copy-intro">Copy message</button>
        <a class="cta cta-ghost" href="mailto:?subject=${subject}&body=${body}">Open in email</a>
        <a class="cta cta-li" href="${LI.people(liQuery)}" target="_blank" rel="noopener noreferrer">
          ${LI_MARK} Find people like ${escapeHtml(ally.name)}
        </a>
      </div>
      <p class="ally-note">
        Allies are illustrative profiles built from real transition patterns, so the LinkedIn
        button searches for <strong>real people in that same role</strong> rather than a fake
        profile. Swap in your own community roster to make them individually linkable.
      </p>
    </div>`;
}

function renderSecondaries(ranked) {
  if (ranked.length < 2) return '';
  const others = ranked.slice(1, 4);
  return `
    <div class="secondaries">
      <span class="secondaries-label">Other signatures detected:</span>
      ${others.map((r) => `
        <button type="button" class="chip" data-origin="${escapeHtml(r.origin.id)}">
          ${escapeHtml(r.origin.from)}
        </button>`).join('')}
    </div>`;
}

/* Paint a full result set. `ranked` is optional — the manual dropdown passes a
   single origin with no runner-up context. */
function showResults(origin, ranked) {
  const box = $('#results');
  const ally = findAlly(origin.id);

  box.innerHTML = [
    renderOriginHeader(origin),
    origin.matches.map(renderRoleCard).join(''),
    ally ? renderAllyCard(ally) : '',
    ranked ? renderSecondaries(ranked) : ''
  ].join('');

  box.dataset.introText = ally ? ally.intro : '';

  // Remember the match so the Monday Briefing can pre-fill its roadmap form.
  rememberOrigin(origin.id);

  // Meters start at 0% in CSS; flipping the width on the next frame animates them.
  requestAnimationFrame(() => {
    $$('.meterfill', box).forEach((fill) => { fill.style.width = fill.dataset.pct + '%'; });
  });

  box.setAttribute('tabindex', '-1');
  box.focus({ preventScroll: true });
  box.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'nearest' });
}

/* -----------------------------------------------------------------------------
   SCAN SEQUENCE
--------------------------------------------------------------------------- */

let scanning = false;

async function runScan() {
  if (scanning) return;

  const input = $('#textInput');
  const text = input.value.trim();
  if (!text) {
    input.focus();
    return;
  }

  scanning = true;
  const btn = $('#scanBtn');
  btn.disabled = true;

  const feed = $('#scanFeed');
  feed.innerHTML = '';
  $('#results').innerHTML = '';
  $('#manualSelect').value = '';

  await typeLine(feed, '> INPUT RECEIVED: "' + text + '"\n');
  await typeLine(feed, '> SCANNING FOR TRANSFERABLE POWER SIGNATURE');
  for (let i = 0; i < 3; i += 1) {
    await wait(prefersReducedMotion() ? 0 : 280);
    feed.insertAdjacentHTML('beforeend', '.');
  }
  feed.insertAdjacentHTML('beforeend', '\n');
  await wait(prefersReducedMotion() ? 0 : 250);

  const ranked = rankOrigins(text);

  if (!ranked.length) {
    await typeLine(feed, '> NO CLEAR SIGNATURE FOUND.\n> Add what tasks fill your day, or pick a category below.\n');
    $('#manualSelect').classList.add('nudge');
    btn.disabled = false;
    scanning = false;
    return;
  }

  $('#manualSelect').classList.remove('nudge');
  await typeLine(feed, '> SIGNATURE MATCHED: "' + ranked[0].origin.from + '"\n> DECODING AI-ADJACENT PATHWAYS...\n');
  showResults(ranked[0].origin, ranked);

  btn.disabled = false;
  scanning = false;
}

/* Jump straight to an origin without running the animation — used by the manual
   dropdown and by the runner-up chips. */
function selectOrigin(originId) {
  const origin = ORIGINS.find((o) => o.id === originId);
  if (!origin) return;
  $('#scanFeed').innerHTML = '';
  $('#manualSelect').classList.remove('nudge');
  $('#manualSelect').value = originId;
  showResults(origin, null);
}

/* -----------------------------------------------------------------------------
   VOICE INPUT — Web Speech API, on-device, free, no key
--------------------------------------------------------------------------- */

function initVoice() {
  const micBtn = $('#micBtn');
  const status = $('#micStatus');
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;

  // Chrome routes speech recognition through a network service and refuses to
  // start on file:// pages, so tell the user the truth up front rather than
  // letting them tap a button that silently fails.
  const insecure = !window.isSecureContext;

  if (!SpeechRec || insecure) {
    micBtn.disabled = true;
    micBtn.setAttribute('aria-disabled', 'true');
    status.textContent = insecure && SpeechRec
      ? 'Voice needs a served page (or localhost). Typing works exactly the same.'
      : 'Voice input needs Chrome or Edge. Typing works exactly the same.';
    return;
  }

  const rec = new SpeechRec();
  rec.continuous = false;
  rec.interimResults = false;
  rec.lang = 'en-US';

  let listening = false;

  const stopUI = (message) => {
    listening = false;
    micBtn.classList.remove('listening');
    micBtn.setAttribute('aria-pressed', 'false');
    status.textContent = message || '';
  };

  micBtn.addEventListener('click', () => {
    if (listening) {
      rec.stop();
      return;
    }
    try {
      rec.start();
      listening = true;
      micBtn.classList.add('listening');
      micBtn.setAttribute('aria-pressed', 'true');
      status.textContent = 'Listening — say what you do all day.';
    } catch (err) {
      // start() throws InvalidStateError if the engine is still winding down.
      stopUI('Microphone busy — try again in a second.');
    }
  });

  rec.onresult = (event) => {
    const said = event.results[0][0].transcript;
    $('#textInput').value = said;
    status.textContent = 'Heard you. Press Run Scan.';
  };

  rec.onnomatch = () => stopUI('Did not catch that — try again, or type it.');
  rec.onerror = (event) => {
    const message = event && event.error === 'not-allowed'
      ? 'Microphone blocked by the browser. Type it instead.'
      : 'Voice failed — type it instead, it works the same.';
    stopUI(message);
  };
  rec.onend = () => {
    if (listening) stopUI('');
  };
}

/* -----------------------------------------------------------------------------
   WIRING
--------------------------------------------------------------------------- */

function initScanner() {
  // Populate the manual fallback dropdown from the same data as the scanner.
  const manual = $('#manualSelect');
  ORIGINS.forEach((origin) => {
    const opt = document.createElement('option');
    opt.value = origin.id;
    opt.textContent = origin.from;
    manual.appendChild(opt);
  });
  manual.addEventListener('change', () => {
    if (manual.value) selectOrigin(manual.value);
  });

  $('#scanBtn').addEventListener('click', runScan);

  // Enter submits. Without this, the most obvious interaction on the page did
  // nothing at all.
  $('#textInput').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      runScan();
    }
  });

  // One delegated handler for everything rendered into #results.
  $('#results').addEventListener('click', async (event) => {
    const chip = event.target.closest('[data-origin]');
    if (chip) {
      selectOrigin(chip.dataset.origin);
      return;
    }

    const copyBtn = event.target.closest('[data-action="copy-intro"]');
    if (copyBtn) {
      const ok = await copyText($('#results').dataset.introText || '');
      flashButton(copyBtn, ok ? 'Copied to clipboard' : 'Select the text above to copy');
    }
  });

  initVoice();
}
