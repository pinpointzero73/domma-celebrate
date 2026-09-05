/**
 * The control widget's stylesheet, injected once on first mount.
 *
 * It ships inside the JavaScript rather than as a separate `.css` file so a
 * plain site gets the whole library - engine, canvas and controls - from one
 * `<script>` tag with nothing else to remember to link.
 *
 * Every colour is a `var(--dm-*, fallback)`. On a Domma page those variables
 * exist and the widget inherits the active theme for free; anywhere else the
 * fallback applies and it renders as a neutral light control. A page that wants
 * to restyle it can define the same variables, or override
 * `.domma-celebrate-*` directly - the injected sheet is first in the cascade.
 */

const STYLE_ID = 'domma-celebrate-styles';

export const CSS = `
.domma-celebrate-control {
  position: fixed;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-family: var(--dm-font-family, system-ui, -apple-system, "Segoe UI", Roboto, sans-serif);
  color: var(--dm-text, #212529);
}
.domma-celebrate-control[data-position="bottom-right"] { bottom: 16px; right: 16px; align-items: flex-end; }
.domma-celebrate-control[data-position="bottom-left"]  { bottom: 16px; left: 16px;  align-items: flex-start; }
.domma-celebrate-control[data-position="top-right"]    { top: 16px;    right: 16px; align-items: flex-end; }
.domma-celebrate-control[data-position="top-left"]     { top: 16px;    left: 16px;  align-items: flex-start; }

/* The panel opens away from the edge the widget is pinned to, so it never
   pushes itself off screen. Flex order does the work; DOM order stays the
   reading order. */
.domma-celebrate-control[data-position^="bottom"] .domma-celebrate-panel     { order: 0; }
.domma-celebrate-control[data-position^="bottom"] .domma-celebrate-intensity { order: 1; }
.domma-celebrate-control[data-position^="bottom"] .domma-celebrate-discs     { order: 2; }
.domma-celebrate-control[data-position^="top"] .domma-celebrate-discs        { order: 0; }
.domma-celebrate-control[data-position^="top"] .domma-celebrate-intensity    { order: 1; }
.domma-celebrate-control[data-position^="top"] .domma-celebrate-panel        { order: 2; }

.domma-celebrate-discs {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
}

.domma-celebrate-toggle,
.domma-celebrate-settings {
  position: relative;
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 9999px;
  background: var(--dm-surface, #fff);
  border: 1px solid var(--dm-border, #dee2e6);
  color: var(--dm-text, #212529);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s ease, transform 0.2s ease, color 0.2s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.domma-celebrate-toggle:hover,
.domma-celebrate-settings:hover {
  background: var(--dm-hover-bg, rgba(0, 0, 0, 0.04));
  transform: scale(1.05);
}
.domma-celebrate-toggle:focus-visible,
.domma-celebrate-settings:focus-visible {
  outline: 2px solid var(--dm-primary, #0d6efd);
  outline-offset: 2px;
}
.domma-celebrate-toggle svg,
.domma-celebrate-settings svg {
  width: 20px;
  height: 20px;
  display: block;
}
.domma-celebrate-toggle[aria-pressed="true"],
.domma-celebrate-settings[aria-expanded="true"] {
  color: var(--dm-primary, #0d6efd);
  border-color: var(--dm-primary, #0d6efd);
}

/* Tooltip, drawn from each button's own accessible name so there is one source
   of truth for the label. */
.domma-celebrate-toggle::after,
.domma-celebrate-settings::after {
  content: attr(aria-label);
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--dm-gray-800, #343a40);
  color: var(--dm-white, #fff);
  padding: 0.35rem 0.6rem;
  border-radius: 4px;
  font-size: 0.75rem;
  white-space: nowrap;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
}
.domma-celebrate-control[data-position^="top"] .domma-celebrate-toggle::after,
.domma-celebrate-control[data-position^="top"] .domma-celebrate-settings::after {
  bottom: auto;
  top: calc(100% + 8px);
}
.domma-celebrate-toggle:hover::after,
.domma-celebrate-toggle:focus-visible::after,
.domma-celebrate-settings:hover::after,
.domma-celebrate-settings:focus-visible::after { opacity: 1; }

.domma-celebrate-intensity {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  opacity: 0;
  visibility: hidden;
  transform: translateY(-8px);
  transition: opacity 0.2s ease, transform 0.2s ease, visibility 0.2s;
}
.domma-celebrate-control:hover .domma-celebrate-intensity,
.domma-celebrate-control:focus-within .domma-celebrate-intensity {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.domma-celebrate-intensity button {
  padding: 0.35rem 0.6rem;
  background: var(--dm-surface, #fff);
  border: 1px solid var(--dm-border, #dee2e6);
  border-radius: 4px;
  color: var(--dm-text, #212529);
  font: inherit;
  font-size: 0.75rem;
  cursor: pointer;
  white-space: nowrap;
  transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.domma-celebrate-intensity button:hover { background: var(--dm-hover-bg, rgba(0, 0, 0, 0.04)); }
.domma-celebrate-intensity button:focus-visible {
  outline: 2px solid var(--dm-primary, #0d6efd);
  outline-offset: 2px;
}
.domma-celebrate-intensity button[aria-pressed="true"] {
  background: var(--dm-primary, #0d6efd);
  border-color: var(--dm-primary, #0d6efd);
  color: var(--dm-white, #fff);
}

/* Traits panel. Capped in height because Halloween publishes fourteen traits
   and an uncapped list would run off a phone screen. */
.domma-celebrate-panel {
  width: 200px;
  max-height: min(280px, 50vh);
  overflow-y: auto;
  padding: 0.6rem 0.7rem;
  background: var(--dm-surface, #fff);
  border: 1px solid var(--dm-border, #dee2e6);
  border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
  font-size: 0.8125rem;
  line-height: 1.4;
}
.domma-celebrate-panel-title {
  margin: 0 0 0.5rem;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  opacity: 0.7;
}
.domma-celebrate-panel-empty {
  margin: 0;
  opacity: 0.7;
}
.domma-celebrate-panel-list {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}
.domma-celebrate-trait {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}
.domma-celebrate-trait input {
  flex: none;
  width: 15px;
  height: 15px;
  margin: 0;
  accent-color: var(--dm-primary, #0d6efd);
  cursor: pointer;
}
.domma-celebrate-trait:hover { color: var(--dm-primary, #0d6efd); }

@media (prefers-reduced-motion: reduce) {
  .domma-celebrate-toggle,
  .domma-celebrate-settings,
  .domma-celebrate-intensity,
  .domma-celebrate-intensity button { transition: none; }
  .domma-celebrate-toggle:hover,
  .domma-celebrate-settings:hover { transform: none; }
}
`;

/** Inject the stylesheet once per document. */
export function injectStyles(doc = document) {
  if (doc.getElementById(STYLE_ID)) return;

  const style = doc.createElement('style');
  style.id = STYLE_ID;
  style.textContent = CSS;
  doc.head.appendChild(style);
}
