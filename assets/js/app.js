/* =============================================================================
   C.O.R.E. — SHELL & BOOT

   Tab routing, the Monday Briefing render (pillar 3: representation), and the
   single entry point that starts the other modules. Loaded last.
   ========================================================================== */

const TABS = ['scan', 'assembly', 'monday'];

/* -----------------------------------------------------------------------------
   TABS
   Implemented as a real ARIA tablist: arrow keys move between tabs, only the
   active tab is in the page tab order, and the panel is announced properly.
   This page is aimed at people using screen readers and old phones — the tabs
   being three unlabelled <button>s was a genuine access failure.
--------------------------------------------------------------------------- */

function activateTab(name, { focus = false, updateHash = true } = {}) {
  const target = TABS.includes(name) ? name : TABS[0];

  $$('.tabbtn').forEach((btn) => {
    const isActive = btn.dataset.tab === target;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-selected', String(isActive));
    btn.setAttribute('tabindex', isActive ? '0' : '-1');
    if (isActive && focus) btn.focus();
  });

  $$('main section').forEach((section) => {
    const isActive = section.id === 'view-' + target;
    section.classList.toggle('active', isActive);
    section.hidden = !isActive;
  });

  if (updateHash && window.location.hash !== '#' + target) {
    try {
      // replaceState keeps the back button useful for leaving the page rather
      // than walking back through every tab the user glanced at.
      history.replaceState(null, '', '#' + target);
    } catch (err) {
      // Chrome throws SecurityError for replaceState on file:// (origin "null"),
      // which is exactly how most people will open this. Fall back to setting
      // the hash directly — the hashchange handler below is idempotent, so the
      // resulting re-entry is harmless.
      window.location.hash = target;
    }
  }
}

function initTabs() {
  const buttons = $$('.tabbtn');

  buttons.forEach((btn) => {
    btn.addEventListener('click', () => activateTab(btn.dataset.tab));

    btn.addEventListener('keydown', (event) => {
      const index = buttons.indexOf(btn);
      let next = null;

      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % buttons.length;
      else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = buttons.length - 1;

      if (next === null) return;
      event.preventDefault();
      activateTab(buttons[next].dataset.tab, { focus: true });
    });
  });

  window.addEventListener('hashchange', () => {
    activateTab(window.location.hash.replace('#', ''), { updateHash: false });
  });

  activateTab(window.location.hash.replace('#', ''), { updateHash: false });
}

/* -----------------------------------------------------------------------------
   BOOT
--------------------------------------------------------------------------- */

function boot() {
  initTabs();
  initScanner();
  initCommunity();
  initMonday();
}

// All scripts are `defer`red, so the DOM is parsed by the time this runs.
boot();
