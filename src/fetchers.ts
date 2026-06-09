import type { ShopContextFetcher } from '@fakeware/core'

export interface PickwareWarehouseRow {
  id: string
  name?: string
  code?: string
  [key: string]: unknown
}

export const PICKWARE_WAREHOUSES_KEY = 'pickwareWarehouses'

export function pickwareWarehouses(extensions: Record<string, unknown>): PickwareWarehouseRow[] {
  return (extensions[PICKWARE_WAREHOUSES_KEY] as PickwareWarehouseRow[] | undefined) ?? []
}

export const warehousesFetcher: ShopContextFetcher = {
  entity: 'pickware warehouses',
  fetch: (client) =>
    (client.invoke as (path: string, params: unknown) => Promise<unknown>)(
      'post /search/pickware-erp-warehouse',
      { body: { limit: 500 } },
    ),
  merge: (data, raw) => {
    const rows = (raw as { data?: PickwareWarehouseRow[] } | null)?.data ?? []
    data.extensions[PICKWARE_WAREHOUSES_KEY] = rows
  },
}
