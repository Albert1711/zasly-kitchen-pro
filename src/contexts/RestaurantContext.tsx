import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { supabase } from "../lib/supabase";

interface Restaurant {
  id: string;
  name: string;
  // Add other restaurant fields as needed
}

interface RestaurantContextType {
  restaurant: Restaurant | null;
  isLoading: boolean;
}

const RestaurantContext = createContext<RestaurantContextType>({ restaurant: null, isLoading: true });

export function RestaurantProvider({ children }: { children: ReactNode }) {
  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const defaultRestaurantId = import.meta.env.VITE_DEFAULT_RESTAURANT_ID as string | undefined;

    const ensureRestaurantHasOrders = async (candidate: Restaurant) => {
      try {
        // Si hay un restaurante fijo por env, no hacemos autoselección.
        if (defaultRestaurantId && uuidRegex.test(defaultRestaurantId)) return;

        const { data: countData, error: countError } = await supabase
          .from('orders')
          .select('id', { count: 'exact', head: true })
          .eq('restaurant_id', candidate.id)
          .in('status', ['pendiente', 'preparando', 'listo']);

        if (countError) {
          console.warn('RestaurantContext: cannot verify orders count (possible RLS):', countError.message);
          return;
        }

        const activeCount = countData === null ? 0 : 0; // head:true => data null; count is on response, but supabase-js types vary
        // If we can't reliably read count via types, do a small probe:
        const { data: probeOrders, error: probeError } = await supabase
          .from('orders')
          .select('id')
          .eq('restaurant_id', candidate.id)
          .in('status', ['pendiente', 'preparando', 'listo'])
          .limit(1);

        if (probeError) {
          console.warn('RestaurantContext: cannot probe orders (possible RLS):', probeError.message);
          return;
        }

        if (probeOrders && probeOrders.length > 0) return;

        // No hay órdenes activas para este restaurante. Buscamos cualquier orden activa para auto-detectar restaurant_id.
        const { data: anyOrders, error: anyOrdersError } = await supabase
          .from('orders')
          .select('restaurant_id')
          .in('status', ['pendiente', 'preparando', 'listo'])
          .order('created_at', { ascending: false })
          .limit(1);

        if (anyOrdersError) {
          console.warn('RestaurantContext: cannot fetch any active order (possible RLS):', anyOrdersError.message);
          return;
        }

        const detectedRestaurantId = anyOrders?.[0]?.restaurant_id;
        if (!detectedRestaurantId || !uuidRegex.test(detectedRestaurantId)) return;

        if (detectedRestaurantId !== candidate.id) {
          console.warn('RestaurantContext: switching restaurant to match orders table:', detectedRestaurantId);
          // Intentamos cargar nombre real del restaurante; si falla por RLS, usamos placeholder.
          const { data: detectedRestaurant, error: detectedRestaurantError } = await supabase
            .from('restaurants')
            .select('id, name')
            .eq('id', detectedRestaurantId)
            .limit(1)
            .single();

          if (!detectedRestaurantError && detectedRestaurant) {
            setRestaurant(detectedRestaurant);
          } else {
            setRestaurant({ id: detectedRestaurantId, name: 'Restaurante' });
          }
        }
      } catch (e) {
        console.warn('RestaurantContext: ensureRestaurantHasOrders failed:', e);
      }
    };

    const getRestaurant = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          console.log("RestaurantContext: User authenticated", user.id);

          if (defaultRestaurantId && uuidRegex.test(defaultRestaurantId)) {
            setRestaurant({ id: defaultRestaurantId, name: "Restaurante" });
            return;
          }
          
          // Primero intentamos buscar el restaurante asociado al usuario
          // Si el usuario tiene un metadato 'restaurant_id', lo usamos
          const userRestaurantId = user.user_metadata?.restaurant_id;
          
          let query = supabase.from('restaurants').select('id, name');
          
          if (userRestaurantId) {
            query = query.eq('id', userRestaurantId);
          }

          const { data: restaurants, error } = await query.limit(1);

          if (error) {
            console.error("RestaurantContext: Error fetching restaurant:", error);
          }

          if (restaurants && restaurants.length > 0) {
            console.log("RestaurantContext: Restaurant found", restaurants[0]);
            setRestaurant(restaurants[0]);
            void ensureRestaurantHasOrders(restaurants[0]);
          } else {
            console.warn("RestaurantContext: No restaurants found, attempting to get ANY available");
            // Fallback: Si no hay filtro, traemos el primero de la tabla para que el KDS funcione
            const { data: allRestaurants } = await supabase.from('restaurants').select('id, name').limit(1).single();
            if (allRestaurants) {
              setRestaurant(allRestaurants);
              void ensureRestaurantHasOrders(allRestaurants);
            }
          }
        }
      } catch (error) {
        console.error("RestaurantContext: Catch error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getRestaurant();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        getRestaurant();
      } else {
        setRestaurant(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);
  
  return (
    <RestaurantContext.Provider value={{ restaurant, isLoading }}>
      {children}
    </RestaurantContext.Provider>
  );
}

export function useCurrentRestaurant() {
  return useContext(RestaurantContext);
}
