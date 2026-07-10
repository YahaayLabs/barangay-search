import '../src/index'
import './tokens.css'

/**
 * Marketing / GIF demo — GIS.ph brand shell + <barangay-search>
 * API key: VITE_GISPH_API_KEY in .env.local
 */

const apiKey = (import.meta.env.VITE_GISPH_API_KEY as string | undefined) || ''

function escapeAttr(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
}

const app = document.querySelector('#app')!

app.innerHTML = `
  <div class="gis-demo">
    <div class="gis-demo-page">
      <header class="gis-demo-header">
        <h1 class="gis-demo-title">barangay-search</h1>
        <p class="gis-demo-tagline">Philippine barangay autocomplete — Web Component demo</p>
        <a
          class="gis-demo-repo"
          href="https://github.com/YahaayLabs/barangay-search"
          target="_blank"
          rel="noopener noreferrer"
        >https://github.com/YahaayLabs/barangay-search</a>
      </header>

      <div class="gis-demo-card">
        <header>
          <p class="gis-demo-eyebrow">Checkout</p>
          <h2 class="gis-demo-card-title">Delivery address</h2>
          <p class="gis-demo-sub">Powered by <code>&lt;barangay-search&gt;</code> web component</p>
        </header>

        <form class="gis-demo-fields" id="form">
          <div class="gis-demo-row-2">
            <label class="gis-demo-field">
              <span>Full name</span>
              <input type="text" name="fullName" value="Maria Santos" autocomplete="name" />
            </label>
            <label class="gis-demo-field">
              <span>Mobile</span>
              <input type="tel" name="phone" value="+63 917 555 0142" autocomplete="tel" />
            </label>
          </div>

          <label class="gis-demo-field">
            <span>Street</span>
            <input
              type="text"
              name="street"
              value="123 Mabini Street"
              placeholder="House no., street, subdivision"
              autocomplete="street-address"
            />
          </label>

          <div class="gis-demo-field gis-demo-field-highlight">
            <span>Barangay — package component</span>
            <barangay-search
              id="brgy"
              placeholder="e.g. Poblacion Batangas"
              base-url="/gis-api/v1"
              ${apiKey ? `api-key="${escapeAttr(apiKey)}"` : ''}
            ></barangay-search>
          </div>

          <div id="selection" class="gis-demo-selection" hidden>
            <span class="gis-demo-selection-dot"></span>
            <span id="selection-text"></span>
          </div>

          <div id="banner" class="gis-demo-banner" hidden></div>

          <button type="submit" class="gis-demo-btn">Continue</button>
        </form>
      </div>

      <details class="gis-demo-dev" ${apiKey ? '' : 'open'}>
        <summary>Dev settings</summary>
        <label>
          API key
          <input id="apiKeyInput" type="password" placeholder="gis_sk_…" autocomplete="off" value="${escapeAttr(apiKey)}" />
        </label>
        <p class="gis-demo-hint">
          Or set <code>VITE_GISPH_API_KEY</code> in <code>.env.local</code>.
          Demo uses <code>base-url="/gis-api/v1"</code> (Vite proxy).
        </p>
      </details>

      <p class="gis-demo-footer">
        <a href="https://github.com/YahaayLabs/barangay-search" target="_blank" rel="noopener noreferrer">GitHub</a>
        ·
        <a href="https://gis.ph" target="_blank" rel="noopener noreferrer">gis.ph</a>
        ·
        <a href="https://www.npmjs.com/package/barangay-search" target="_blank" rel="noopener noreferrer">npm</a>
      </p>
    </div>
  </div>
`

const brgy = document.querySelector('barangay-search') as HTMLElement & {
  value: unknown
  setAttribute: HTMLElement['setAttribute']
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
  banner.className = 'gis-demo-banner error'
  banner.textContent = msg
}) as EventListener)

const syncKey = () => brgy.setAttribute('api-key', apiKeyInput.value.trim())
apiKeyInput.addEventListener('change', syncKey)
apiKeyInput.addEventListener('input', syncKey)

form.addEventListener('submit', (e) => {
  e.preventDefault()
  const val = (brgy as { value?: unknown }).value
  if (!val) {
    banner.hidden = false
    banner.className = 'gis-demo-banner error'
    banner.textContent = 'Please select a barangay before continuing.'
    return
  }
  banner.hidden = false
  banner.className = 'gis-demo-banner ok'
  banner.textContent = 'Ready to submit (demo only — no network POST).'
})
