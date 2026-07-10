import '../src/index'

/**
 * Marketing / GIF demo — checkout-style form using the global <barangay-search> element.
 * API key: set VITE_GISPH_API_KEY in .env.local (same as vue-barangay-search playground).
 */

const apiKey = (import.meta.env.VITE_GISPH_API_KEY as string | undefined) || ''

const app = document.querySelector('#app')!

app.innerHTML = `
  <div class="demo">
    <div class="page">
      <header class="page-header">
        <h1 class="page-title">barangay-search</h1>
        <p class="page-tagline">Philippine barangay autocomplete — Web Component demo</p>
        <a
          class="page-repo"
          href="https://github.com/YahaayLabs/barangay-search"
          target="_blank"
          rel="noopener noreferrer"
        >https://github.com/YahaayLabs/barangay-search</a>
      </header>

    <div class="card">
      <header class="card-header">
        <p class="eyebrow">Checkout</p>
        <h2 class="card-title">Delivery address</h2>
        <p class="sub">Powered by <code>&lt;barangay-search&gt;</code> web component</p>
      </header>

      <form class="fields" id="form">
        <div class="row two">
          <label class="field">
            <span>Full name</span>
            <input type="text" name="fullName" value="Maria Santos" autocomplete="name" />
          </label>
          <label class="field">
            <span>Mobile</span>
            <input type="tel" name="phone" value="+63 917 555 0142" autocomplete="tel" />
          </label>
        </div>

        <label class="field">
          <span>Street</span>
          <input
            type="text"
            name="street"
            value="123 Mabini Street"
            placeholder="House no., street, subdivision"
            autocomplete="street-address"
          />
        </label>

        <label class="field field-barangay">
          <span>Barangay</span>
          <barangay-search
            id="brgy"
            placeholder="e.g. Poblacion Batangas"
            base-url="/gis-api/v1"
            ${apiKey ? `api-key="${escapeAttr(apiKey)}"` : ''}
          ></barangay-search>
        </label>

        <div id="selection" class="selection" hidden>
          <span class="selection-dot"></span>
          <span id="selection-text"></span>
        </div>

        <div id="banner" class="banner" hidden></div>

        <button type="submit" class="btn">Continue</button>
      </form>

      <details class="dev" ${apiKey ? '' : 'open'}>
        <summary>Dev settings</summary>
        <label>
          API key
          <input id="apiKeyInput" type="password" placeholder="gis_sk_…" autocomplete="off" value="${escapeAttr(apiKey)}" />
        </label>
        <p class="hint">
          Or set <code>VITE_GISPH_API_KEY</code> in <code>.env.local</code> and restart
          <code>npm run dev</code>. Demo uses <code>base-url="/gis-api/v1"</code>
          (Vite proxy) so localhost ports are not blocked by API CORS.
        </p>
      </details>
    </div>

      <p class="page-footer">
        <a href="https://github.com/YahaayLabs/barangay-search" target="_blank" rel="noopener noreferrer">GitHub</a>
        ·
        <a href="https://gis.ph" target="_blank" rel="noopener noreferrer">gis.ph</a>
      </p>
    </div>
  </div>
`

const style = document.createElement('style')
style.textContent = `
  .demo {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem 1rem;
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #0f172a;
    -webkit-font-smoothing: antialiased;
  }
  .page {
    width: 100%;
    max-width: 28rem;
  }
  .page-header {
    text-align: center;
    margin-bottom: 1.25rem;
  }
  .page-title {
    margin: 0;
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.03em;
    color: #0f172a;
  }
  .page-tagline {
    margin: 0.35rem 0 0;
    font-size: 0.85rem;
    color: #64748b;
  }
  .page-repo {
    display: inline-block;
    margin-top: 0.5rem;
    font-size: 0.8rem;
    font-weight: 500;
    color: #059669;
    text-decoration: none;
    word-break: break-all;
  }
  .page-repo:hover {
    text-decoration: underline;
  }
  .page-footer {
    margin: 1rem 0 0;
    text-align: center;
    font-size: 0.75rem;
    color: #94a3b8;
  }
  .page-footer a {
    color: #64748b;
    text-decoration: none;
  }
  .page-footer a:hover {
    color: #059669;
    text-decoration: underline;
  }
  .card {
    width: 100%;
    background: #fff;
    border-radius: 1rem;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04), 0 12px 32px rgba(15, 23, 42, 0.06);
    padding: 1.75rem 1.5rem 1.5rem;
  }
  .card-header { margin-bottom: 1.5rem; }
  .eyebrow {
    margin: 0 0 0.25rem;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #059669;
  }
  .card-title {
    margin: 0;
    font-size: 1.35rem;
    font-weight: 700;
    letter-spacing: -0.02em;
  }
  .sub {
    margin: 0.4rem 0 0;
    font-size: 0.8rem;
    color: #64748b;
  }
  .sub code {
    font-size: 0.75rem;
    background: #f1f5f9;
    padding: 0.1rem 0.35rem;
    border-radius: 4px;
  }
  .fields {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
  .row.two {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.75rem;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
  }
  .field > span {
    font-size: 0.8rem;
    font-weight: 500;
    color: #475569;
  }
  .field input:not([type="password"]) {
    width: 100%;
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 0.6rem 0.75rem;
    font-size: 0.9rem;
    color: #0f172a;
    background: #fff;
  }
  .field input:focus {
    outline: none;
    border-color: #34d399;
    box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
  }
  .field-barangay { min-height: 4.5rem; }
  .selection {
    display: flex;
    align-items: flex-start;
    gap: 0.5rem;
    padding: 0.65rem 0.75rem;
    border-radius: 0.5rem;
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    font-size: 0.8rem;
    font-weight: 500;
    color: #065f46;
    line-height: 1.35;
  }
  .selection-dot {
    flex-shrink: 0;
    width: 0.45rem;
    height: 0.45rem;
    margin-top: 0.3rem;
    border-radius: 999px;
    background: #10b981;
  }
  .banner {
    padding: 0.65rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.8rem;
  }
  .banner.error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #b91c1c;
  }
  .banner.ok {
    background: #ecfdf5;
    border: 1px solid #a7f3d0;
    color: #065f46;
  }
  .btn {
    margin-top: 0.25rem;
    width: 100%;
    border: none;
    border-radius: 0.5rem;
    padding: 0.7rem 1rem;
    font-size: 0.9rem;
    font-weight: 600;
    color: #fff;
    background: #059669;
    cursor: pointer;
  }
  .btn:hover { background: #047857; }
  .dev {
    margin-top: 1.25rem;
    padding-top: 1rem;
    border-top: 1px solid #f1f5f9;
    font-size: 0.8rem;
    color: #64748b;
  }
  .dev summary {
    cursor: pointer;
    font-weight: 600;
    color: #475569;
  }
  .dev label {
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    margin-top: 0.75rem;
  }
  .dev input {
    border: 1px solid #e2e8f0;
    border-radius: 0.5rem;
    padding: 0.5rem 0.65rem;
    font-size: 0.85rem;
  }
  .hint {
    margin: 0.5rem 0 0;
    font-size: 0.72rem;
    line-height: 1.4;
    color: #94a3b8;
  }
  .hint code { font-size: 0.68rem; }
  @media (max-width: 420px) {
    .row.two { grid-template-columns: 1fr; }
  }
`
document.head.appendChild(style)

function escapeAttr(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

const brgy = document.querySelector('barangay-search') as HTMLElement & {
  value: unknown
  apiKey: string
  addEventListener: HTMLElement['addEventListener']
}
const selection = document.querySelector('#selection') as HTMLElement
const selectionText = document.querySelector('#selection-text') as HTMLElement
const banner = document.querySelector('#banner') as HTMLElement
const apiKeyInput = document.querySelector('#apiKeyInput') as HTMLInputElement
const form = document.querySelector('#form') as HTMLFormElement

function showSelection(detail: Record<string, unknown> | null) {
  if (!detail) {
    selection.hidden = true
    selectionText.textContent = ''
    return
  }
  const parts = [
    detail.name,
    detail.municipality || detail.city,
    detail.province,
  ].filter(Boolean)
  selection.hidden = false
  selectionText.textContent = parts.join(', ')
}

brgy.addEventListener('select', ((e: CustomEvent) => {
  banner.hidden = true
  showSelection(e.detail)
  console.log('[demo] select', e.detail)
}) as EventListener)

brgy.addEventListener('clear', (() => {
  showSelection(null)
}) as EventListener)

brgy.addEventListener('error', ((e: CustomEvent) => {
  const msg = e.detail?.message || String(e.detail)
  banner.hidden = false
  banner.className = 'banner error'
  banner.textContent = msg
}) as EventListener)

apiKeyInput.addEventListener('change', () => {
  brgy.setAttribute('api-key', apiKeyInput.value.trim())
})
apiKeyInput.addEventListener('input', () => {
  brgy.setAttribute('api-key', apiKeyInput.value.trim())
})

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const val = (brgy as { value?: unknown }).value
  if (!val) {
    banner.hidden = false
    banner.className = 'banner error'
    banner.textContent = 'Please select a barangay before continuing.'
    return
  }
  banner.hidden = false
  banner.className = 'banner ok'
  banner.textContent = 'Ready to submit (demo only — no network POST).'
})
