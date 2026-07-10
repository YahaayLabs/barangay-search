import { GisPh } from 'gis.ph-sdk'
import type { BarangayResult } from './types'
import { styles } from './styles'

const TAG = 'barangay-search'

function debounce<T extends (...args: never[]) => void>(fn: T, ms: number) {
  let timer: ReturnType<typeof setTimeout> | undefined
  const wrapped = (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }
  wrapped.cancel = () => {
    if (timer) clearTimeout(timer)
  }
  return wrapped
}

function labelFor(item: BarangayResult | null | undefined): string {
  if (!item) return ''
  return String(item.name ?? '')
}

function contextFor(item: BarangayResult): string {
  const city = item.municipality || item.city || ''
  const province = item.province || ''
  if (city && province) return `${city}, ${province}`
  return String(city || province)
}

/**
 * Framework-agnostic Philippine barangay autocomplete.
 *
 * @example
 * ```html
 * <barangay-search api-key="gis_sk_…"></barangay-search>
 * <script type="module">
 *   document.querySelector('barangay-search')
 *     .addEventListener('select', (e) => console.log(e.detail))
 * </script>
 * ```
 */
export class BarangaySearchElement extends HTMLElement {
  static get observedAttributes() {
    return [
      'api-key',
      'access-token',
      'placeholder',
      'disabled',
      'province',
      'municipality',
      'debounce-ms',
      'min-query-length',
      'clearable',
    ]
  }

  #shadow: ShadowRoot
  #input!: HTMLInputElement
  #list!: HTMLUListElement
  #empty!: HTMLDivElement
  #errorEl!: HTMLDivElement
  #loader!: HTMLSpanElement
  #check!: HTMLSpanElement
  #clearBtn!: HTMLButtonElement

  #results: BarangayResult[] = []
  #value: BarangayResult | null = null
  #isLoading = false
  #showDropdown = false
  #error: string | null = null
  #isCommitted = false
  #suppressSearch = false
  #activeIndex = -1
  #searchSeq = 0
  #outsideHandler: ((e: MouseEvent) => void) | null = null

  #debouncedSearch: ReturnType<typeof debounce<(q: string) => void>>

  constructor() {
    super()
    this.#shadow = this.attachShadow({ mode: 'open' })
    this.#debouncedSearch = debounce((q: string) => {
      void this.#runSearch(q)
    }, this.debounceMs)
    this.#renderShell()
  }

  connectedCallback() {
    this.#bind()
    this.#syncFromAttributes()
    this.#outsideHandler = (e: MouseEvent) => {
      const path = e.composedPath()
      if (!path.includes(this)) this.#closeDropdown()
    }
    document.addEventListener('mousedown', this.#outsideHandler)
  }

  disconnectedCallback() {
    this.#debouncedSearch.cancel()
    if (this.#outsideHandler) {
      document.removeEventListener('mousedown', this.#outsideHandler)
      this.#outsideHandler = null
    }
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (name === 'debounce-ms') {
      this.#debouncedSearch.cancel()
      this.#debouncedSearch = debounce((q: string) => {
        void this.#runSearch(q)
      }, this.debounceMs)
    }
    if (name === 'disabled') {
      this.#input.disabled = value !== null
    }
    if (name === 'placeholder') {
      this.#input.placeholder = value || 'Search barangay, city, or province…'
    }
    if (name === 'clearable') {
      this.#updateTrailing()
    }
  }

  // ——— Public API ———

  get apiKey(): string {
    return this.getAttribute('api-key') || ''
  }
  set apiKey(v: string) {
    this.#setOrRemove('api-key', v)
  }

  get accessToken(): string {
    return this.getAttribute('access-token') || ''
  }
  set accessToken(v: string) {
    this.#setOrRemove('access-token', v)
  }

  get placeholder(): string {
    return this.getAttribute('placeholder') || 'Search barangay, city, or province…'
  }
  set placeholder(v: string) {
    this.setAttribute('placeholder', v)
  }

  get disabled(): boolean {
    return this.hasAttribute('disabled')
  }
  set disabled(v: boolean) {
    if (v) this.setAttribute('disabled', '')
    else this.removeAttribute('disabled')
  }

  get province(): string {
    return this.getAttribute('province') || ''
  }
  set province(v: string) {
    this.#setOrRemove('province', v)
  }

  get municipality(): string {
    return this.getAttribute('municipality') || ''
  }
  set municipality(v: string) {
    this.#setOrRemove('municipality', v)
  }

  get debounceMs(): number {
    const n = Number(this.getAttribute('debounce-ms'))
    return Number.isFinite(n) && n >= 0 ? n : 300
  }
  set debounceMs(v: number) {
    this.setAttribute('debounce-ms', String(v))
  }

  get minQueryLength(): number {
    const n = Number(this.getAttribute('min-query-length'))
    return Number.isFinite(n) && n >= 1 ? n : 2
  }
  set minQueryLength(v: number) {
    this.setAttribute('min-query-length', String(v))
  }

  get clearable(): boolean {
    const v = this.getAttribute('clearable')
    if (v === null) return true
    return v !== 'false'
  }
  set clearable(v: boolean) {
    this.setAttribute('clearable', v ? 'true' : 'false')
  }

  /** Selected barangay object (property only). */
  get value(): BarangayResult | null {
    return this.#value
  }
  set value(v: BarangayResult | null) {
    this.#applyExternalValue(v)
  }

  focus() {
    this.#input?.focus()
  }

  blur() {
    this.#input?.blur()
  }

  clear() {
    this.#suppressSearch = true
    this.#input.value = ''
    this.#value = null
    this.#isCommitted = false
    this.#results = []
    this.#showDropdown = false
    this.#error = null
    this.#activeIndex = -1
    this.#searchSeq++
    this.#isLoading = false
    this.#updateUI()
    this.#emit('clear', null)
  }

  // ——— Internals ———

  #setOrRemove(attr: string, v: string) {
    if (v) this.setAttribute(attr, v)
    else this.removeAttribute(attr)
  }

  #syncFromAttributes() {
    this.#input.placeholder = this.placeholder
    this.#input.disabled = this.disabled
  }

  #emit<T>(name: string, detail: T) {
    this.dispatchEvent(
      new CustomEvent(name, {
        detail,
        bubbles: true,
        composed: true,
      }),
    )
  }

  #renderShell() {
    const style = document.createElement('style')
    style.textContent = styles

    const root = document.createElement('div')
    root.className = 'root'
    root.innerHTML = `
      <div class="input-wrap">
        <input
          part="input"
          type="text"
          autocomplete="off"
          role="combobox"
          aria-autocomplete="list"
          aria-expanded="false"
          aria-haspopup="listbox"
        />
        <div class="trailing">
          <span class="loader" hidden>Searching…</span>
          <span class="check" hidden title="Selected">✓</span>
          <button type="button" class="clear-btn" part="clear" hidden aria-label="Clear selection">×</button>
        </div>
      </div>
      <ul class="list" part="list" role="listbox" hidden></ul>
      <div class="empty" part="empty" hidden>No results found.</div>
      <div class="error" part="error" role="alert" hidden></div>
    `

    this.#shadow.append(style, root)
    this.#input = root.querySelector('input')!
    this.#list = root.querySelector('.list')!
    this.#empty = root.querySelector('.empty')!
    this.#errorEl = root.querySelector('.error')!
    this.#loader = root.querySelector('.loader')!
    this.#check = root.querySelector('.check')!
    this.#clearBtn = root.querySelector('.clear-btn')!
  }

  #bind() {
    this.#input.addEventListener('input', () => this.#onInput())
    this.#input.addEventListener('focus', () => this.#onFocus())
    this.#input.addEventListener('keydown', (e) => this.#onKeydown(e))
    this.#clearBtn.addEventListener('click', (e) => {
      e.preventDefault()
      this.clear()
      this.#input.focus()
    })
  }

  #onInput() {
    if (this.#suppressSearch) {
      this.#suppressSearch = false
      return
    }

    if (this.#isCommitted) {
      this.#isCommitted = false
      this.#value = null
      this.#emit('clear', null)
    }

    this.#error = null
    this.#activeIndex = -1
    const trimmed = this.#input.value.trim()

    if (trimmed.length < this.minQueryLength) {
      this.#searchSeq++
      this.#results = []
      this.#showDropdown = false
      this.#isLoading = false
      this.#updateUI()
      return
    }

    this.#debouncedSearch(this.#input.value)
  }

  #onFocus() {
    if (this.#isCommitted) return
    if (
      this.#results.length > 0
      || (this.#input.value.trim().length >= this.minQueryLength && !this.#isLoading)
    ) {
      this.#showDropdown = true
      this.#updateUI()
    }
  }

  #onKeydown(event: KeyboardEvent) {
    const open = this.#showDropdown && !this.#isCommitted

    if (event.key === 'Escape') {
      event.preventDefault()
      this.#closeDropdown()
      this.#input.blur()
      return
    }

    if (!open && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
      if (this.#results.length > 0) {
        this.#showDropdown = true
        this.#activeIndex = event.key === 'ArrowDown' ? 0 : this.#results.length - 1
        this.#updateUI()
        event.preventDefault()
      }
      return
    }

    if (!open || this.#results.length === 0) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      this.#activeIndex = Math.min(this.#activeIndex + 1, this.#results.length - 1)
      if (this.#activeIndex < 0) this.#activeIndex = 0
      this.#updateUI()
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      this.#activeIndex = Math.max(this.#activeIndex - 1, 0)
      this.#updateUI()
    } else if (event.key === 'Enter') {
      if (this.#activeIndex >= 0 && this.#results[this.#activeIndex]) {
        event.preventDefault()
        this.#selectItem(this.#results[this.#activeIndex])
      }
    }
  }

  #closeDropdown() {
    this.#showDropdown = false
    this.#activeIndex = -1
    this.#updateUI()
  }

  async #runSearch(query: string) {
    const trimmed = query.trim()
    if (!trimmed || trimmed.length < this.minQueryLength || this.#isCommitted) {
      this.#results = []
      this.#isLoading = false
      this.#updateUI()
      return
    }

    const seq = ++this.#searchSeq
    this.#isLoading = true
    this.#error = null
    this.#updateUI()

    try {
      const token = this.accessToken || this.apiKey
      // Bearer only — X-API-Key is blocked by api.gis.ph browser CORS.
      const client = new GisPh(token ? { accessToken: token } : {})
      const { data } = await client.barangays.search({ q: trimmed })

      if (seq !== this.#searchSeq || this.#isCommitted) return

      this.#results = (data || []) as BarangayResult[]
      this.#showDropdown = true
      this.#activeIndex = this.#results.length > 0 ? 0 : -1
    } catch (err: unknown) {
      if (seq !== this.#searchSeq) return
      console.error('[barangay-search]', err)
      const raw = err instanceof Error ? err.message : 'Failed to fetch barangays'
      const message =
        raw === 'Failed to fetch'
          ? 'Network/CORS error talking to api.gis.ph. Check your API key and console.'
          : raw
      this.#error = message
      this.#results = []
      this.#emit('error', { message })
    } finally {
      if (seq === this.#searchSeq) {
        this.#isLoading = false
        this.#updateUI()
      }
    }
  }

  #selectItem(item: BarangayResult) {
    this.#searchSeq++
    this.#isLoading = false
    this.#isCommitted = true
    this.#suppressSearch = true
    this.#value = item
    this.#input.value = labelFor(item)
    this.#results = []
    this.#showDropdown = false
    this.#error = null
    this.#activeIndex = -1
    this.#updateUI()
    this.#emit('select', item)
    queueMicrotask(() => this.#input.blur())
  }

  #applyExternalValue(value: BarangayResult | null) {
    if (!value) {
      if (this.#isCommitted || this.#input.value) {
        this.#suppressSearch = true
        this.#input.value = ''
        this.#isCommitted = false
      }
      this.#value = null
      this.#results = []
      this.#showDropdown = false
      this.#updateUI()
      return
    }
    this.#suppressSearch = true
    this.#value = value
    this.#input.value = labelFor(value)
    this.#isCommitted = true
    this.#results = []
    this.#showDropdown = false
    this.#error = null
    this.#updateUI()
  }

  #updateTrailing() {
    this.#loader.hidden = !this.#isLoading
    this.#check.hidden = !this.#isCommitted || this.#isLoading
    this.#clearBtn.hidden = !(this.clearable && this.#isCommitted && !this.#isLoading)
  }

  #updateUI() {
    this.#updateTrailing()

    this.#input.classList.toggle('is-selected', this.#isCommitted)
    this.#input.setAttribute(
      'aria-expanded',
      String(this.#showDropdown && !this.#isCommitted && this.#results.length > 0),
    )

    const showList = this.#showDropdown && !this.#isCommitted && this.#results.length > 0
    const showEmpty =
      this.#showDropdown
      && !this.#isCommitted
      && !this.#isLoading
      && this.#input.value.trim().length >= this.minQueryLength
      && this.#results.length === 0
      && !this.#error

    this.#list.hidden = !showList
    this.#empty.hidden = !showEmpty

    if (showList) {
      this.#list.innerHTML = ''
      this.#results.forEach((item, index) => {
        const li = document.createElement('li')
        li.className = 'option' + (index === this.#activeIndex ? ' is-active' : '')
        li.setAttribute('part', 'option')
        li.setAttribute('role', 'option')
        li.setAttribute('aria-selected', String(index === this.#activeIndex))
        li.dataset.index = String(index)
        li.innerHTML = `
          <span class="name"></span>
          <small class="context"></small>
        `
        li.querySelector('.name')!.textContent = String(item.name ?? '')
        li.querySelector('.context')!.textContent = contextFor(item)
        li.addEventListener('mousedown', (e) => {
          e.preventDefault()
          this.#selectItem(item)
        })
        this.#list.appendChild(li)
      })

      const active = this.#list.querySelector('.is-active') as HTMLElement | null
      active?.scrollIntoView({ block: 'nearest' })
    } else {
      this.#list.innerHTML = ''
    }

    if (this.#error) {
      this.#errorEl.hidden = false
      this.#errorEl.textContent = this.#error
    } else {
      this.#errorEl.hidden = true
      this.#errorEl.textContent = ''
    }
  }
}

export function defineBarangaySearch(tagName = TAG): typeof BarangaySearchElement {
  if (!customElements.get(tagName)) {
    customElements.define(tagName, BarangaySearchElement)
  }
  return BarangaySearchElement
}

declare global {
  interface HTMLElementTagNameMap {
    'barangay-search': BarangaySearchElement
  }
}
