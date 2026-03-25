export interface Order {
  id: string;
  restaurant_id: string;
  order_number: number;
  table_name: string;
  status: 'pendiente' | 'preparando' | 'listo' | 'entregado' | 'cancelado';
  priority: boolean;
  customer_name?: string;
  customer_phone?: string;
  customer_address?: string;
  delivery_driver_id?: string;
  delivery_status?: 'picking_up' | 'on_the_way' | 'delivered';
  estimated_delivery_time?: string;
  subtotal: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_name: string;
  quantity: number;
  price: number;
  modifiers?: string[];
  notes?: string;
}
