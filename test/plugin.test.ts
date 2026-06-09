import { describe, expect, test } from 'bun:test'
import { pickware, stockMovementIn, warehousesFetcher } from '../src/index'

describe('pickware()', () => {
  test('returns a valid fakeware plugin with the warehouses fetcher', () => {
    const plugin = pickware()
    expect(plugin.name).toBe('pickware')
    expect(plugin.fetchers).toEqual([warehousesFetcher])
    expect(plugin.setup).toBeUndefined()
  })
})

describe('warehousesFetcher', () => {
  test('merges rows from a search response into the extensions bag', () => {
    const extensions: Record<string, unknown> = {}
    const data = { extensions } as Parameters<typeof warehousesFetcher.merge>[0]
    warehousesFetcher.merge(data, { data: [{ id: 'wh-1', code: 'WH-01' }] })
    expect(extensions.pickwareWarehouses).toEqual([{ id: 'wh-1', code: 'WH-01' }])
  })

  test('defaults to an empty list when the response has no data', () => {
    const extensions: Record<string, unknown> = {}
    const data = { extensions } as Parameters<typeof warehousesFetcher.merge>[0]
    warehousesFetcher.merge(data, null)
    expect(extensions.pickwareWarehouses).toEqual([])
  })

  test('fetch posts to the pickware warehouse search endpoint', async () => {
    const calls: Array<[string, unknown]> = []
    const client = {
      invoke: (path: string, params: unknown) => {
        calls.push([path, params])
        return Promise.resolve({ data: [] })
      },
    } as unknown as Parameters<typeof warehousesFetcher.fetch>[0]
    await warehousesFetcher.fetch(client)
    expect(calls).toEqual([['post /search/pickware-erp-warehouse', { body: { limit: 500 } }]])
  })
})

describe('stockMovementIn()', () => {
  test('builds a positive inbound movement record', () => {
    const record = stockMovementIn({ productId: 'p1', warehouseId: 'w1', quantity: 100 })
    expect(record).toEqual({ productId: 'p1', quantity: 100, destinationWarehouseId: 'w1' })
  })

  test('includes $key only when provided', () => {
    const withKey = stockMovementIn({ productId: 'p1', warehouseId: 'w1', quantity: 5, $key: 'm1' })
    expect(withKey.$key).toBe('m1')
    const withoutKey = stockMovementIn({ productId: 'p1', warehouseId: 'w1', quantity: 5 })
    expect('$key' in withoutKey).toBe(false)
  })

  test('rejects non-positive quantities', () => {
    expect(() => stockMovementIn({ productId: 'p1', warehouseId: 'w1', quantity: 0 })).toThrow()
    expect(() => stockMovementIn({ productId: 'p1', warehouseId: 'w1', quantity: -3 })).toThrow()
  })
})
