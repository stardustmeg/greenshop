export interface ShoppingList {
  id: string;
  products: ShoppingListProduct[];
  version: number;
}

export interface ShoppingListProduct {
  lineItemId: string;
  productId: string;
}
