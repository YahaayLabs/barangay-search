# barangay-search

<p align="center">
  <a href="https://www.npmjs.com/package/barangay-search"><img src="https://img.shields.io/npm/v/barangay-search.svg?style=flat-square" alt="npm version"/></a>
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"/></a>
  <a href="https://gis.ph"><img src="https://img.shields.io/badge/API-gis.ph-10b981?style=flat-square" alt="GIS.ph"/></a>
</p>

**Web component for Philippine barangay autocomplete** — powered by the [GIS.ph API](https://api.gis.ph).

Framework-agnostic custom element: use it from plain HTML, React, Vue, Svelte, or anything that can host `<barangay-search>`.

```html
<script type="module" src="./node_modules/barangay-search/dist/barangay-search.js"></script>

<barangay-search api-key="gis_sk_…" placeholder="e.g. Poblacion Batangas"></barangay-search>

<script type="module">
  document.querySelector('barangay-search')
    .addEventListener('select', (e) => console.log(e.detail))
</script>
```

Product notes: **[docs/PRD.md](./docs/PRD.md)**

---

## Features

- **Global custom element** — `<barangay-search>` after one import
- **Debounced search** against live barangay data
- **Natural multi-word queries** — e.g. `poblacion bat`
- **Events** — `select`, `error`, `clear` (bubble + composed)
- **Keyboard** — ArrowUp/Down, Enter, Escape
- **Shadow DOM** + CSS variables for theming
- **TypeScript** types included

## Install

```bash
npm install barangay-search
# or
bun add barangay-search
# or
pnpm add barangay-search
```

Get an API key at [gis.ph](https://gis.ph) / [dashboard.gis.ph](https://dashboard.gis.ph). Prefer **restricted** keys for browser use.

## Usage

### npm (ESM)

```js
import 'barangay-search'

const el = document.querySelector('barangay-search')
el.apiKey = 'gis_sk_…'
el.addEventListener('select', (e) => {
  console.log(e.detail) // barangay object
})
```

```html
<barangay-search api-key="gis_sk_…" placeholder="Search barangay…"></barangay-search>
```

### Events

| Event | `detail` | When |
| --- | --- | --- |
| `select` | Barangay object | User picks a result |
| `error` | `{ message: string }` | API / network failure |
| `clear` | `null` | Selection cleared (edit after pick or `.clear()`) |

### Attributes / properties

| Name | Attribute | Description |
| --- | --- | --- |
| `apiKey` | `api-key` | GIS.ph API key (`gis_sk_…`) — sent as Bearer |
| `accessToken` | `access-token` | Alternative Bearer token |
| `placeholder` | `placeholder` | Input placeholder |
| `disabled` | `disabled` | Disable control |
| `clearable` | `clearable` | Show clear (×) when selected (default true) |
| `debounceMs` | `debounce-ms` | Debounce ms (default 300) |
| `minQueryLength` | `min-query-length` | Min chars (default 2) |
| `value` | — (property) | Selected object or `null` |

### Methods

- `clear()` — clear selection and query  
- `focus()` / `blur()` — focus the inner input  

### Theming

```css
barangay-search {
  --barangay-search-border: #e2e8f0;
  --barangay-search-radius: 8px;
  --barangay-search-focus: #3b82f6;
  --barangay-search-selected-bg: #f0fdf4;
}
```

Parts: `input`, `list`, `option`, `empty`, `error`, `clear`.

## Demo

```bash
cp .env.example .env.local   # VITE_GISPH_API_KEY=gis_sk_…
npm install
npm run dev
# → playground checkout form
```

## Related

| Package | Role |
| --- | --- |
| [`gis.ph-sdk`](https://github.com/YahaayLabs/gis.ph-sdk-js) | Official JS/TS API client (used under the hood) |
| [`vue-barangay-search`](https://github.com/YahaayLabs/vue-barangay-search) | Vue 3 component |
| [`laravel-barangay-search`](https://github.com/YahaayLabs/laravel-barangay-search) | Laravel Livewire component |

## License

[MIT](./LICENSE) © [Yahaay Labs](https://github.com/YahaayLabs)
