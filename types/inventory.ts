export interface InventoryItem {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  minQuantity: number;
  unit: string;
  category: string;
  location: string;
  price: number;
  supplier: string;
  lastRestockDate: string;
}