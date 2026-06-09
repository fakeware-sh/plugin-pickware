export interface PickwareWarehouseRecord {
  $key?: string
  name: string
  code: string
}

export interface PickwareBinLocationRecord {
  $key?: string
  code: string
  warehouseId: string
}

export interface PickwareStockMovementRecord {
  $key?: string
  productId: string
  quantity: number
  destinationWarehouseId: string
}

declare module '@fakeware/core' {
  interface EntityRegistry {
    pickware_erp_warehouse: PickwareWarehouseRecord
    pickware_erp_bin_location: PickwareBinLocationRecord
    pickware_erp_stock_movement: PickwareStockMovementRecord
  }
}
