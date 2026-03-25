import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Order {
  id: string;
  restaurant_id: string;
  order_number: number;
  table_name: string;
  status: "pendiente" | "preparando" | "listo" | "entregado" | "cancelado";
  priority: boolean;
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  delivery_driver_id: string | null;
  delivery_status: "picking_up" | "on_the_way" | "delivered" | null;
  estimated_delivery_time: string;
  subtotal: number;
  total: number;
  notes: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  menu_item_id: string | null;
  name: string;
  quantity: number;
  unit_price: number;
  notes: string;
  created_at: string;
}

export type OrderWithItems = Order & { order_items: OrderItem[] };

export function useOrders(restaurantId: string | undefined) {
  const [data, setData] = useState<OrderWithItems[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!restaurantId) {
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const { data, error } = await supabase
          .from("orders")
          .select("*, order_items(*)")
          .eq("restaurant_id", restaurantId)
          .order("created_at", { ascending: false });
        
        if (error) {
          console.error("Supabase Error:", error);
          throw error;
        }
        setData(data as OrderWithItems[]);
      } catch (err) {
        console.error("Fetch Orders Catch:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    // Set up real-time subscription
    const subscription = supabase
      .channel('orders')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `restaurant_id=eq.${restaurantId}`
        }, 
        () => {
          fetchOrders(); // Refetch when changes occur
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [restaurantId]);

  return { data, loading, error };
}

export function useUpdateOrderStatus() {
  const updateStatus = async (id: string, status: string) => {
    const { data, error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  };

  return { updateStatus };
}
