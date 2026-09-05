/**
 * The optional control widget: an on/off disc, light/medium/heavy buttons, and
 * a panel listing every trait the current theme publishes.
 *
 * The engine deliberately knows nothing about this - it is mounted separately
 * and drives the instance through its public API - so a host with its own
 * chrome (Domma's layout system, for one) can skip it entirely and still get
 * the same behaviour by calling `enable()`, `disable()`, `setIntensity()` and
 * `setTrait()`.
 *
 * Choices are remembered in localStorage, which is the only reason a visitor
 * who turned the effect off, or turned the steam train off, does not meet it
 * again on the next page.
 */

import { injectStyles } from './styles.js';

const SPARKLES_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3z"/><path d="M19 15l.9 2.1L22 18l-2.1.9L19 21l-.9-2.1L16 18l2.1-.9L19 15z"/><path d="M5 3l.6 1.4L7 5l-1.4.6L5 7l-.6-1.4L3 5l1.4-.6L5 3z"/></svg>`;

const SLIDERS_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/><circle cx="9" cy="6" r="2"/><circle cx="15" cy="12" r="2"/><circle cx="8" cy="18" r="2"/></svg>`;

const INTENSITIES = ['light', 'medium', 'heavy'];

/**
 * Mount the widget and wire it to an instance.
 *
 * @param {import('../core/engine.js').Celebrations} celebrations - Instance to drive
 * @param {Object} [options]
 * @param {string} [options.position='bottom-right'] - 'bottom-right' |
 *   'bottom-left' | 'top-right' | 'top-left'
 * @param {HTMLElement} [options.mount=document.body] - Where to append it
 * @param {boolean} [options.intensity=true] - Show the intensity buttons
 * @param {boolean} [options.traits=true] - Show the per-trait panel
 * @param {string} [options.label='Celebration effects'] - Accessible name and
 *   tooltip text on the disc
 * @param {string} [options.storageKey='domma-celebrate'] - localStorage prefix.
 *   Pass null to remember nothing
 * @param {string} [options.icon] - Replacement SVG markup for the disc
 * @returns {{element: HTMLElement, refresh: Function, destroy: Function}}
 */
export function mountControl(celebrations, options = {}) {
  const config = {
    position: options.position || 'bottom-right',
    mount: options.mount || document.body,
    intensity: options.intensity !== false,
    traits: options.traits !== false,
    label: options.label || 'Celebration effects',
    storageKey: options.storageKey === null ? null : (options.storageKey || 'domma-celebrate'),
    icon: options.icon || SPARKLES_ICON
  };

  injectStyles(config.mount.ownerDocument || document);

  const store = createStore(config.storageKey);
  const teardown = [];

  const element = document.createElement('div');
  element.className = 'domma-celebrate-control';
  element.dataset.position = config.position;

  // --- The on/off disc ---
  const discs = document.createElement('div');
  discs.className = 'domma-celebrate-discs';

  const toggle = button('domma-celebrate-toggle', config.label, config.icon);
  toggle.setAttribute('aria-pressed', 'false');
  discs.appendChild(toggle);

  // --- The traits panel ---
  let traitsButton = null;
  let panel = null;
  let traitInputs = new Map();

  if (config.traits) {
    traitsButton = button('domma-celebrate-settings', 'Choose what appears', SLIDERS_ICON);
    traitsButton.setAttribute('aria-expanded', 'false');
    discs.appendChild(traitsButton);

    panel = document.createElement('div');
    panel.className = 'domma-celebrate-panel';
    panel.hidden = true;
    element.appendChild(panel);
  }

  element.appendChild(discs);

  // --- Intensity ---
  let intensityButtons = [];
  if (config.intensity) {
    const group = document.createElement('div');
    group.className = 'domma-celebrate-intensity';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Celebration intensity');

    intensityButtons = INTENSITIES.map(level => {
      const item = document.createElement('button');
      item.type = 'button';
      item.dataset.intensity = level;
      item.textContent = level.charAt(0).toUpperCase() + level.slice(1);
      item.setAttribute('aria-pressed', 'false');
      group.appendChild(item);
      return item;
    });

    element.appendChild(group);
  }

  config.mount.appendChild(element);

  /**
   * Rebuild the trait checkboxes.
   *
   * Called on every theme change as well as on mount, because the traits are
   * the theme's: switching from Christmas to Halloween replaces "Steam train"
   * with "Witches", and a stale list would offer switches that control nothing.
   */
  function renderTraits() {
    if (!panel) return;

    const traits = celebrations.getTraits();
    const names = Object.keys(traits);

    panel.textContent = '';
    traitInputs = new Map();

    if (names.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'domma-celebrate-panel-empty';
      empty.textContent = celebrations.getState().theme
        ? 'This theme has no individual settings.'
        : 'Turn the effect on to choose what appears.';
      panel.appendChild(empty);
      return;
    }

    const heading = document.createElement('p');
    heading.className = 'domma-celebrate-panel-title';
    heading.textContent = 'What appears';
    panel.appendChild(heading);

    const list = document.createElement('div');
    list.className = 'domma-celebrate-panel-list';

    for (const name of names) {
      const trait = traits[name];
      const row = document.createElement('label');
      row.className = 'domma-celebrate-trait';

      const input = document.createElement('input');
      input.type = 'checkbox';
      input.checked = trait.enabled;
      input.dataset.trait = name;
      input.addEventListener('change', onTraitChange);

      const text = document.createElement('span');
      text.textContent = trait.label;

      row.append(input, text);
      list.appendChild(row);
      traitInputs.set(name, input);
    }

    panel.appendChild(list);
  }

  /** Redraw pressed states from whatever the engine actually reports. */
  function refresh() {
    const state = celebrations.getState();
    toggle.setAttribute('aria-pressed', String(state.enabled));
    for (const item of intensityButtons) {
      item.setAttribute('aria-pressed', String(item.dataset.intensity === state.intensity));
    }

    const traits = celebrations.getTraits();
    for (const [name, input] of traitInputs) {
      if (traits[name]) input.checked = traits[name].enabled;
    }
  }

  async function onToggle() {
    // Guard against a double-click starting two `init()`s: the first is still
    // awaiting its theme chunk when the second arrives.
    if (toggle.disabled) return;
    toggle.disabled = true;
    try {
      const running = await celebrations.toggle();
      store.set('enabled', running);
    } finally {
      toggle.disabled = false;
      renderTraits();
      refresh();
    }
  }

  function onIntensity(event) {
    const level = event.currentTarget.dataset.intensity;
    celebrations.setIntensity(level);
    store.set('intensity', level);
    refresh();
  }

  function onTraitChange(event) {
    const name = event.currentTarget.dataset.trait;
    const enabled = event.currentTarget.checked;

    celebrations.setTrait(name, enabled);

    // Remembered across the whole library rather than per theme: the trait
    // names are theme-specific anyway, so a Christmas key is simply never
    // consulted at Halloween.
    const saved = store.get('traits') || {};
    saved[name] = enabled;
    store.set('traits', saved);
  }

  function openPanel() {
    if (!panel) return;
    renderTraits();
    panel.hidden = false;
    traitsButton.setAttribute('aria-expanded', 'true');
    document.addEventListener('click', onDocumentClick, true);
    document.addEventListener('keydown', onKeydown);
  }

  function closePanel() {
    if (!panel || panel.hidden) return;
    panel.hidden = true;
    traitsButton.setAttribute('aria-expanded', 'false');
    document.removeEventListener('click', onDocumentClick, true);
    document.removeEventListener('keydown', onKeydown);
  }

  function onPanelToggle() {
    if (panel.hidden) openPanel();
    else closePanel();
  }

  function onDocumentClick(event) {
    if (!element.contains(event.target)) closePanel();
  }

  function onKeydown(event) {
    if (event.key === 'Escape') {
      closePanel();
      traitsButton.focus();
    }
  }

  toggle.addEventListener('click', onToggle);
  teardown.push(() => toggle.removeEventListener('click', onToggle));

  for (const item of intensityButtons) {
    item.addEventListener('click', onIntensity);
    teardown.push(() => item.removeEventListener('click', onIntensity));
  }

  if (traitsButton) {
    traitsButton.addEventListener('click', onPanelToggle);
    teardown.push(() => traitsButton.removeEventListener('click', onPanelToggle));
  }

  // Keep in step with changes made through the API rather than the widget.
  teardown.push(
    celebrations.on('stateChange', refresh),
    celebrations.on('intensityChange', refresh),
    celebrations.on('traitChange', refresh),
    celebrations.on('themeChange', () => { renderTraits(); refresh(); }),
    celebrations.on('init', () => { renderTraits(); refresh(); }),
    celebrations.on('destroy', refresh)
  );

  renderTraits();
  refresh();

  return {
    element,
    refresh,
    renderTraits,
    destroy() {
      closePanel();
      for (const off of teardown) off();
      if (element.parentNode) element.parentNode.removeChild(element);
    }
  };
}

/** @private */
function button(className, label, icon) {
  const element = document.createElement('button');
  element.type = 'button';
  element.className = className;
  element.setAttribute('aria-label', label);
  element.innerHTML = icon;
  return element;
}

/**
 * Read the visitor's remembered preferences.
 *
 * Exported because `autoInit()` needs them *before* the instance exists, to
 * decide whether to start enabled, at which intensity, and with what switched
 * off.
 *
 * @param {string|null} [storageKey='domma-celebrate']
 * @returns {{enabled: boolean|null, intensity: string|null, traits: Object|null}}
 */
export function readPreferences(storageKey = 'domma-celebrate') {
  const store = createStore(storageKey);
  const enabled = store.get('enabled');
  const intensity = store.get('intensity');
  const traits = store.get('traits');

  return {
    enabled: typeof enabled === 'boolean' ? enabled : null,
    intensity: INTENSITIES.includes(intensity) ? intensity : null,
    traits: traits && typeof traits === 'object' ? traits : null
  };
}

/**
 * localStorage, wrapped so it cannot take the page down.
 *
 * Reading `window.localStorage` throws outright in a Safari private window and
 * under a third-party-cookie block, and `setItem` throws once the quota is
 * full. An effect that decorates the page must not be the thing that breaks it,
 * so every access is guarded and a failure simply means nothing is remembered.
 *
 * @private
 */
function createStore(prefix) {
  const usable = prefix !== null && (() => {
    try {
      const probe = '__domma_celebrate__';
      window.localStorage.setItem(probe, '1');
      window.localStorage.removeItem(probe);
      return true;
    } catch {
      return false;
    }
  })();

  return {
    get(key) {
      if (!usable) return undefined;
      try {
        const raw = window.localStorage.getItem(`${prefix}:${key}`);
        return raw === null ? undefined : JSON.parse(raw);
      } catch {
        return undefined;
      }
    },
    set(key, value) {
      if (!usable) return;
      try {
        window.localStorage.setItem(`${prefix}:${key}`, JSON.stringify(value));
      } catch {
        /* quota or blocked storage - preferences just are not remembered */
      }
    }
  };
}
