// structure for a menu item
export interface MenuItem {
  item_id: number;
  name: string;
  sale_price: number;
  requires_packaging: boolean;
}

// structure for an order item
export interface OrderItem extends MenuItem {
  quantity: number;
}
