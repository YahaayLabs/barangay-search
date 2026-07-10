/** Selected / listed barangay shape from api.gis.ph (via gis.ph-sdk). */
export interface BarangayResult {
  id?: string | number
  name?: string
  code?: string
  municipality?: string
  city?: string
  province?: string
  fullName?: string
  full_name?: string
  lCode?: string
  pCode?: string
  rCode?: string
  l_code?: string
  p_code?: string
  r_code?: string
  [key: string]: unknown
}

export type BarangaySearchSelectDetail = BarangayResult
export type BarangaySearchErrorDetail = { message: string }
export type BarangaySearchClearDetail = null

export interface BarangaySearchEventMap {
  select: CustomEvent<BarangaySearchSelectDetail>
  error: CustomEvent<BarangaySearchErrorDetail>
  clear: CustomEvent<BarangaySearchClearDetail>
}
