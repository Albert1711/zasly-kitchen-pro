import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import type { Order, OrderItem } from '../types/supabase';

export function useOrders(
  restaurantId: string,
  options?: {
    onNewOrder?: (order: Order & { order_items: OrderItem[] }) => void;
  }
) {
  const [orders, setOrders] = useState<(Order & { order_items: OrderItem[] })[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const hasValidRestaurantId = Boolean(restaurantId && uuidRegex.test(restaurantId));

    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('useOrders: Iniciando carga con restaurantId:', restaurantId);

        let query = supabase
          .from('orders')
          .select('*, order_items(*)')
          .in('status', ['pendiente', 'preparando', 'listo'])
          .order('created_at', { ascending: true });

        if (hasValidRestaurantId) {
          query = query.eq('restaurant_id', restaurantId);
        } else {
          console.warn('useOrders: restaurantId vacío o inválido; cargando órdenes activas sin filtro (modo diagnóstico)');
        }

        const { data, error } = await query;

        if (error) throw error;
        const next = (data || []).slice().sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''));
        console.log('useOrders: Órdenes obtenidas:', next.length);
        setOrders(next);

        // Diagnóstico cuando el filtro devuelve 0
        if ((data?.length || 0) === 0) {
          try {
            if (hasValidRestaurantId) {
              const { data: anyStatusOrders, error: anyStatusError } = await supabase
                .from('orders')
                .select('id, status, created_at')
                .eq('restaurant_id', restaurantId)
                .order('created_at', { ascending: false })
                .limit(5);

              if (!anyStatusError) {
                console.log('useOrders: Diagnóstico - últimas órdenes de este restaurante (cualquier status):', anyStatusOrders);
              }
            }

            const { data: sampleOrders, error: sampleError } = await supabase
              .from('orders')
              .select('id, restaurant_id, status, created_at')
              .order('created_at', { ascending: false })
              .limit(5);

            if (!sampleError) {
              console.log('useOrders: Diagnóstico - últimas órdenes globales:', sampleOrders);
            }
          } catch (e) {
            console.warn('useOrders: Diagnóstico falló:', e);
          }
        }
      } catch (err: any) {
        console.error('useOrders Error:', err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();

    const upsertOrder = (fullOrder: Order & { order_items: OrderItem[] }) => {
      setOrders((prev) => {
        const exists = prev.some((o) => o.id === fullOrder.id);
        const next = exists ? prev.map((o) => (o.id === fullOrder.id ? fullOrder : o)) : [...prev, fullOrder];
        next.sort((a, b) => (a.created_at || '').localeCompare(b.created_at || ''));
        return next;
      });
    };

    const channel = supabase
      .channel(`orders-realtime:${hasValidRestaurantId ? restaurantId : 'all'}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
        },
        async (payload) => {
          const newRestaurantId = (payload.new as any)?.restaurant_id;
          const oldRestaurantId = (payload.old as any)?.restaurant_id;
          const payloadRestaurantId = newRestaurantId || oldRestaurantId;

          // Si tenemos restaurantId válido, filtramos localmente
          if (hasValidRestaurantId && payloadRestaurantId && payloadRestaurantId !== restaurantId) return;

          if (payload.eventType === 'INSERT') {
            const { data: fullOrder, error } = await supabase
              .from('orders')
              .select('*, order_items(*)')
              .eq('id', payload.new.id)
              .single();
            
            if (!error && fullOrder) {
              options?.onNewOrder?.(fullOrder);
              upsertOrder(fullOrder);
            }
          } else if (payload.eventType === 'UPDATE') {
            const updatedOrder = payload.new as Order;
            if (['entregado', 'cancelado'].includes(updatedOrder.status)) {
              setOrders((prev) => prev.filter((o) => o.id !== updatedOrder.id));
            } else {
              const { data: fullOrder, error } = await supabase
                .from('orders')
                .select('*, order_items(*)')
                .eq('id', updatedOrder.id)
                .single();
              
              if (!error && fullOrder) {
                upsertOrder(fullOrder);
              }
            }
          } else if (payload.eventType === 'DELETE') {
            const deletedId = (payload.old as any)?.id;
            if (deletedId) {
              setOrders((prev) => prev.filter((o) => o.id !== deletedId));
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [restaurantId]);

  const updateOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', orderId);

      if (error) throw error;
    } catch (err: any) {
      console.error('Error updating order status:', err.message);
      throw err;
    }
  };

  return { orders, loading, error, updateOrderStatus };
}
