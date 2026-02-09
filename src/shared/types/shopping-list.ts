export interface ShoppingList {
  anonymousId: null | string;
  id: string;
  products: ShoppingListProduct[];
  version: number;
}

export interface ShoppingListProduct {
  lineItemId: string;
  productId: string;
}
