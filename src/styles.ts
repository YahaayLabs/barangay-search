/** Shadow DOM styles for <barangay-search>. Theme via CSS variables on the host. */
export const styles = /* css */ `
:host {
  display: block;
  width: 100%;
  font-family: var(
    --barangay-search-font,
    ui-sans-serif,
    system-ui,
    -apple-system,
    BlinkMacSystemFont,
    "Segoe UI",
    Roboto,
    "Helvetica Neue",
    Arial,
    sans-serif
  );
  box-sizing: border-box;
  --bs-border: var(--barangay-search-border, #e2e8f0);
  --bs-radius: var(--barangay-search-radius, 8px);
  --bs-focus: var(--barangay-search-focus, #3b82f6);
  --bs-focus-ring: var(--barangay-search-focus-ring, rgba(59, 130, 246, 0.15));
  --bs-text: var(--barangay-search-text, #1e293b);
  --bs-muted: var(--barangay-search-muted, #64748b);
  --bs-bg: var(--barangay-search-bg, #fff);
  --bs-hover: var(--barangay-search-hover, #f1f5f9);
  --bs-selected-bg: var(--barangay-search-selected-bg, #f0fdf4);
  --bs-selected-border: var(--barangay-search-selected-border, #86efac);
  --bs-error: var(--barangay-search-error, #ef4444);
  --bs-check: var(--barangay-search-check, #16a34a);
}

:host([disabled]) {
  opacity: 0.6;
  pointer-events: none;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

.root {
  position: relative;
  width: 100%;
}

.input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

input[part="input"] {
  width: 100%;
  padding: 10px 36px 10px 14px;
  border: 1px solid var(--bs-border);
  border-radius: var(--bs-radius);
  font-size: 1rem;
  line-height: 1.5;
  color: var(--bs-text);
  background: var(--bs-bg);
  transition: border-color 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  font-family: inherit;
}

input[part="input"]::placeholder {
  color: #94a3b8;
}

input[part="input"]:focus {
  outline: none;
  border-color: var(--bs-focus);
  box-shadow: 0 0 0 3px var(--bs-focus-ring);
}

input[part="input"].is-selected {
  border-color: var(--bs-selected-border);
  background: var(--bs-selected-bg);
}

input[part="input"].is-selected:focus {
  border-color: var(--bs-check);
  box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15);
}

.trailing {
  position: absolute;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 4px;
  pointer-events: none;
}

.loader {
  font-size: 0.8rem;
  color: var(--bs-muted);
}

.check {
  color: var(--bs-check);
  font-weight: 700;
  font-size: 0.9rem;
}

.clear-btn {
  pointer-events: auto;
  border: none;
  background: transparent;
  color: var(--bs-muted);
  cursor: pointer;
  padding: 2px 4px;
  font-size: 1rem;
  line-height: 1;
  border-radius: 4px;
}

.clear-btn:hover {
  color: var(--bs-text);
  background: var(--bs-hover);
}

.list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  margin: 0;
  padding: 4px;
  list-style: none;
  max-height: 250px;
  overflow-y: auto;
  z-index: 1000;
  background: var(--bs-bg);
  border: 1px solid var(--bs-border);
  border-radius: var(--bs-radius);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.option {
  padding: 10px 12px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  border-radius: 6px;
  color: var(--bs-text);
  transition: background-color 0.15s ease;
}

.option:hover,
.option.is-active {
  background: var(--bs-hover);
}

.name {
  font-weight: 600;
  font-size: 0.95rem;
}

.context {
  font-size: 0.8rem;
  color: var(--bs-muted);
  margin-top: 2px;
}

.empty {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  padding: 12px;
  z-index: 1000;
  text-align: center;
  font-size: 0.9rem;
  color: var(--bs-muted);
  background: var(--bs-bg);
  border: 1px solid var(--bs-border);
  border-radius: var(--bs-radius);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.error {
  color: var(--bs-error);
  font-size: 0.875rem;
  margin-top: 6px;
}

.list::-webkit-scrollbar {
  width: 6px;
}
.list::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 20px;
}
`
