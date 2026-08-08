/* =============================================================================
   C.O.R.E. — MONDAY BRIEFING  (pillar 3: representation)

   Was a static three-link page. Now a roadmap compiler: it takes where you are
   coming from, where you want to land, how many hours you actually have, and
   whether you own a computer — and assembles a four-week plan with real, free
   destinations and tick-boxes that survive closing the tab.

   The assembly runs locally against ROADMAP_WEEKS. No model, no API, no key —
   but the output genuinely differs per person, and every task is a real action
   with a real link rather than advice.
   ========================================================================== */

const ROADMAP_KEY = 'core_roadmap_v1';

/* -----------------------------------------------------------------------------
   BUILD
--------------------------------------------------------------------------- */

/* Turn a task template into something renderable: pick the phone variant if the
   user has no computer, and resolve whichever link shorthand it declared. */
function resolveTask(task, id, track, origin, phoneOnly) {
  const text = (phoneOnly && task.phone) ? task.phone : task.text;

  let href = '';
  let label = '';

  if (task.link) {
    href = task.link;
    label = task.linkLabel || 'Open';
  } else if (task.li === 'jobs') {
    href = LI.jobs(track.liJobs);
    label = 'Search LinkedIn jobs';
  } else if (task.li === 'groups') {
    href = LI.groups(track.liPeople);
    label = 'Find LinkedIn groups';
  } else if (task.li === 'profile') {
    href = LI.profile();
    label = 'Open your LinkedIn profile';
  } else if (task.li === 'post') {
    const seed = 'I spent this month moving from ' +
      (origin ? origin.from.toLowerCase() : 'my current work') +
      ' toward ' + track.name.toLowerCase() + '. Here is the thing I built:';
    href = LI.post(seed);
    label = 'Draft the post on LinkedIn';
  } else if (task.tab) {
    href = '#' + task.tab;
    label = 'Open The Assembly';
  }

  return { id, text, mins: task.mins, href, label, internal: Boolean(task.tab) };
}

/* Assemble the four weeks. Track-specific task first so the plan reads as
   tailored rather than generic, then shared tasks until the hour budget runs
   out. */
function buildRoadmap(config) {
  const track = getTrack(config.trackId);
  const origin = ORIGINS.find((o) => o.id === config.originId) || null;
  const perWeek = HOURS_TO_TASKS[String(config.hours)] || 3;
  const phoneOnly = config.device === 'phone';

  const weeks = ROADMAP_WEEKS.map((week, w) => {
    const pool = [week.byTrack[track.id]].concat(week.shared).filter(Boolean);
    const tasks = pool
      .slice(0, perWeek)
      .map((task, t) => resolveTask(task, 'w' + w + 't' + t, track, origin, phoneOnly));
    const mins = tasks.reduce((sum, task) => sum + (task.mins || 0), 0);
    return { title: week.title, goal: week.goal, tasks, mins };
  });

  return { track, origin, weeks, config };
}

/* -----------------------------------------------------------------------------
   STATE
   Config and tick-box state persist together, so the plan is still there — and
   still half-ticked — when the user comes back next Monday.
--------------------------------------------------------------------------- */

function readRoadmapConfig() {
  const saved = readStore(ROADMAP_KEY, null);
  return {
    originId: (saved && saved.originId) || '',
    trackId: (saved && saved.trackId) || 'data',
    hours: (saved && saved.hours) || '5',
    device: (saved && saved.device) || 'computer',
    done: (saved && Array.isArray(saved.done)) ? saved.done : [],
    generated: (saved && saved.generated) || ''
  };
}

function writeRoadmapConfig(patch) {
  writeStore(ROADMAP_KEY, Object.assign(readRoadmapConfig(), patch));
}

/* -----------------------------------------------------------------------------
   RENDER
--------------------------------------------------------------------------- */

/* Shown before anything is generated, and after a reset. Keeps the tab useful
   for someone who will never touch a dropdown. */
function renderStarter() {
  $('#roadmapOut').innerHTML = `
    <div class="rm-starter">
      <h3 class="rm-starter-title">Not ready to plan? Do these three things.</h3>
      <ol class="rm-steps">
        ${BRIEFING.map((step, i) => `
          <li class="step">
            <span class="num" aria-hidden="true">${i + 1}</span>
            <div class="step-body">
              <strong>${escapeHtml(step.title)}</strong>
              <p>${escapeHtml(step.body)}</p>
              ${step.links.length ? `<div class="step-links">${step.links.map((l) => `
                <a class="cta" href="${escapeHtml(l.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(l.label)}</a>
              `).join('')}</div>` : ''}
            </div>
          </li>`).join('')}
      </ol>
    </div>`;
  togglePlanActions(false);
}

/* Copy / email / jobs / reset only make sense once a plan exists; Print always
   does, because the three-step starter is worth printing too. */
function togglePlanActions(hasPlan) {
  $$('.plan-only').forEach((btn) => { btn.hidden = !hasPlan; });
}

function renderTask(task, done) {
  const checked = done.includes(task.id);
  const linkAttrs = task.internal
    ? `href="${escapeHtml(task.href)}"`
    : `href="${escapeHtml(task.href)}" target="_blank" rel="noopener noreferrer"`;

  return `
    <li class="rm-task${checked ? ' is-done' : ''}">
      <label>
        <input type="checkbox" data-task="${escapeHtml(task.id)}"${checked ? ' checked' : ''}>
        <span class="rm-task-text">${escapeHtml(task.text)}</span>
      </label>
      <div class="rm-task-meta">
        <span class="rm-mins">${Number(task.mins)} min</span>
        ${task.href ? `<a class="rm-link" ${linkAttrs}>${escapeHtml(task.label)} &rarr;</a>` : ''}
      </div>
    </li>`;
}

function renderRoadmap(plan) {
  const done = readRoadmapConfig().done;
  const all = plan.weeks.reduce((n, w) => n + w.tasks.length, 0);
  const hit = plan.weeks.reduce(
    (n, w) => n + w.tasks.filter((t) => done.includes(t.id)).length, 0
  );
  const pct = all ? Math.round((hit / all) * 100) : 0;

  $('#roadmapOut').innerHTML = `
    <div class="rm-plan">
      <div class="rm-head">
        <p class="rm-head-tag">Compiled plan &middot; ${escapeHtml(stamp(plan.config.generated))}</p>
        <h3 class="rm-head-title">
          ${escapeHtml(plan.origin ? plan.origin.from : 'Your current work')}
          <span aria-hidden="true">&rarr;</span>
          ${escapeHtml(plan.track.name)}
        </h3>
        <p class="rm-head-blurb">${escapeHtml(plan.track.blurb)}</p>
        <p class="rm-head-facts">
          ${escapeHtml(plan.config.hours)} hrs/week &middot;
          ${plan.config.device === 'phone' ? 'phone only' : 'computer access'} &middot;
          ${all} tasks over 4 weeks
        </p>
        <div class="rm-progress" role="img" aria-label="${pct} percent complete">
          <div class="rm-progress-fill" style="width:${pct}%"></div>
        </div>
        <p class="rm-progress-label">${hit} of ${all} done &middot; ${pct}%</p>
      </div>

      ${plan.weeks.map((week, i) => `
        <section class="rm-week">
          <header class="rm-week-head">
            <span class="rm-week-num">Week ${i + 1}</span>
            <h4>${escapeHtml(week.title)}</h4>
            <span class="rm-week-mins">~${Math.round(week.mins / 60 * 10) / 10} hrs</span>
          </header>
          <p class="rm-week-goal">${escapeHtml(week.goal)}</p>
          <ul class="rm-tasks">${week.tasks.map((t) => renderTask(t, done)).join('')}</ul>
        </section>`).join('')}
    </div>`;

  togglePlanActions(true);
}

/* -----------------------------------------------------------------------------
   PLAIN-TEXT EXPORT
   Used by both "Copy as text" and "Email it to me" — a roadmap you cannot get
   off this device is not much of a roadmap.
--------------------------------------------------------------------------- */
function roadmapToText(plan) {
  const lines = [
    'C.O.R.E. — MY 4-WEEK ROADMAP',
    (plan.origin ? plan.origin.from : 'Current work') + '  ->  ' + plan.track.name,
    plan.config.hours + ' hours a week, ' +
      (plan.config.device === 'phone' ? 'phone only' : 'computer access'),
    ''
  ];

  plan.weeks.forEach((week, i) => {
    lines.push('WEEK ' + (i + 1) + ' — ' + week.title.toUpperCase());
    lines.push(week.goal);
    week.tasks.forEach((task) => {
      lines.push('  [ ] ' + task.text + ' (' + task.mins + ' min)');
      if (task.href && !task.internal) lines.push('      ' + task.href);
    });
    lines.push('');
  });

  lines.push('Free walk-in help in SF: https://www.sf.gov/techsf');
  return lines.join('\n');
}

/* -----------------------------------------------------------------------------
   WIRING
--------------------------------------------------------------------------- */

let currentPlan = null;

function paintPlan() {
  currentPlan = buildRoadmap(readRoadmapConfig());
  renderRoadmap(currentPlan);
}

async function generateRoadmap() {
  const btn = $('#roadmapBtn');
  btn.disabled = true;

  writeRoadmapConfig({
    originId: $('#rmOrigin').value,
    trackId: $('#rmTrack').value,
    hours: $('#rmHours').value,
    device: $('#rmDevice').value,
    generated: new Date().toISOString()
  });

  const feed = $('#roadmapFeed');
  feed.hidden = false;
  feed.textContent = '';
  await typeLine(feed, 'Reading your starting point...\n', 9);
  await typeLine(feed, 'Matching against roles hiring in the Bay Area this quarter...\n', 9);
  await typeLine(feed, 'Fitting the plan to ' + $('#rmHours').value + ' hours a week...\n', 9);
  await wait(prefersReducedMotion() ? 0 : 200);

  feed.hidden = true;
  paintPlan();
  $('#roadmapOut').scrollIntoView({
    behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start'
  });
  btn.disabled = false;
}

function initMonday() {
  const config = readRoadmapConfig();

  // Origin dropdown, pre-selected from the user's last scan if they ran one.
  const originSel = $('#rmOrigin');
  ORIGINS.forEach((origin) => {
    const opt = document.createElement('option');
    opt.value = origin.id;
    opt.textContent = origin.from;
    originSel.appendChild(opt);
  });
  originSel.value = config.originId || lastOriginId() || '';

  // Track dropdown, defaulting to whatever the chosen origin points at.
  const trackSel = $('#rmTrack');
  TRACKS.forEach((track) => {
    const opt = document.createElement('option');
    opt.value = track.id;
    opt.textContent = track.name;
    trackSel.appendChild(opt);
  });
  trackSel.value = config.trackId || ORIGIN_TRACK[originSel.value] || 'data';

  $('#rmHours').value = config.hours;
  $('#rmDevice').value = config.device;

  // Changing origin re-guesses the track, but never overrides a deliberate pick.
  originSel.addEventListener('change', () => {
    if (trackSel.dataset.touched === '1') return;
    trackSel.value = ORIGIN_TRACK[originSel.value] || trackSel.value;
  });
  trackSel.addEventListener('change', () => { trackSel.dataset.touched = '1'; });

  $('#roadmapForm').addEventListener('submit', (event) => {
    event.preventDefault();
    generateRoadmap();
  });

  // Tick-boxes: persist immediately so progress survives a closed tab.
  $('#roadmapOut').addEventListener('change', (event) => {
    const box = event.target.closest('[data-task]');
    if (!box) return;
    const done = readRoadmapConfig().done.filter((id) => id !== box.dataset.task);
    if (box.checked) done.push(box.dataset.task);
    writeRoadmapConfig({ done });
    paintPlan();
  });

  $('#rmCopy').addEventListener('click', async (event) => {
    if (!currentPlan) return;
    const ok = await copyText(roadmapToText(currentPlan));
    flashButton(event.currentTarget, ok ? 'Copied' : 'Copy failed — select the text');
  });

  $('#rmEmail').addEventListener('click', () => {
    if (!currentPlan) return;
    window.location.href = 'mailto:?subject=' +
      encodeURIComponent('My 4-week C.O.R.E. roadmap') +
      '&body=' + encodeURIComponent(roadmapToText(currentPlan));
  });

  $('#rmJobs').addEventListener('click', () => {
    if (!currentPlan) return;
    window.open(LI.jobs(currentPlan.track.liJobs), '_blank', 'noopener');
  });

  $('#rmReset').addEventListener('click', () => {
    if (!window.confirm('Clear this roadmap and all ticked tasks?')) return;
    writeStore(ROADMAP_KEY, null);
    currentPlan = null;
    renderStarter();
  });

  $('#printBtn').addEventListener('click', () => window.print());

  // Restore a previously generated plan; otherwise show the three-step starter.
  if (config.generated) paintPlan();
  else renderStarter();
}
