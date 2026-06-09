import type { PickwareStockMovementRecord } from './entities'

export interface StockMovementInInput {
  productId: string
  warehouseId: string
  quantity: number
  $key?: string
}

export function stockMovementIn(input: StockMovementInInput): PickwareStockMovementRecord {
  if (!Number.isFinite(input.quantity) || input.quantity <= 0) {
    throw new Error(`stockMovementIn: quantity must be a positive number, got ${input.quantity}.`)
  }
  return {
    ...(input.$key ? { $key: input.$key } : {}),
    productId: input.productId,
    quantity: input.quantity,
    destinationWarehouseId: input.warehouseId,
  }
}
