export type {
  BarangayResult,
  BarangaySearchClearDetail,
  BarangaySearchErrorDetail,
  BarangaySearchEventMap,
  BarangaySearchSelectDetail,
} from './types'

export { BarangaySearchElement, defineBarangaySearch } from './barangay-search'

import { defineBarangaySearch } from './barangay-search'

/** Registers `<barangay-search>` on import. */
defineBarangaySearch()
