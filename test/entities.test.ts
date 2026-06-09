import { expect, test } from 'bun:test'
import { define } from '@fakeware/core'
import { stockMovementIn } from '../src/index'

type Expect<T extends true> = T
type Extends<A, B> = A extends B ? true : false

type DefineEntity = Parameters<typeof define>[0]

type _warehouseIsKnown = Expect<Extends<'pickware_erp_warehouse', DefineEntity>>
type _binLocationIsKnown = Expect<Extends<'pickware_erp_bin_location', DefineEntity>>
type _stockMovementIsKnown = Expect<Extends<'pickware_erp_stock_movement', DefineEntity>>
type _unknownEntityRejected = Expect<
  Extends<'pickware_erp_not_real', DefineEntity> extends true ? false : true
>

export type _Checks = [
  _warehouseIsKnown,
  _binLocationIsKnown,
  _stockMovementIsKnown,
  _unknownEntityRejected,
]

test('pickware entities are accepted by define() with their authored shapes', () => {
  define('pickware_erp_warehouse', { $key: 'main', name: 'Main', code: 'WH-01' })
  define('pickware_erp_bin_location', [{ $key: 'a1', code: 'A1', warehouseId: 'wh-id' }])
  define(
    'pickware_erp_stock_movement',
    stockMovementIn({ productId: 'p1', warehouseId: 'wh-id', quantity: 10 }),
  )
  expect(true).toBe(true)
})
