import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Clock, CheckCircle2, ChefHat, Truck } from "lucide-react";
import { useCurrentRestaurant } from "../contexts/RestaurantContext";
import KitchenHeader from "../components/kitchen/KitchenHeader";

interface Order {
  id: string;
  customerName: string;
  items: Array<{
    name: string;
    quantity: number;
    notes?: string;
  }>;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  createdAt: string;
  deliveredAt?: string;
}

export default function KitchenHistory() {
  const { restaurant } = useCurrentRestaurant();
  
  // Mock data - replace with actual Supabase data
  const [orders] = useState<Order[]>([
    {
      id: "3",
      customerName: "Carlos López",
      items: [
        { name: "Hamburguesa Clásica", quantity: 1 },
        { name: "Papas Fritas", quantity: 1 }
      ],
      status: "delivered",
      createdAt: new Date(Date.now() - 2 * 60 * 60000).toISOString(),
      deliveredAt: new Date(Date.now() - 1 * 60 * 60000).toISOString()
    },
    {
      id: "4",
      customerName: "Ana Martínez",
      items: [
        { name: "Pizza Hawaiana", quantity: 1 },
        { name: "Refresco", quantity: 1 }
      ],
      status: "delivered",
      createdAt: new Date(Date.now() - 3 * 60 * 60000).toISOString(),
      deliveredAt: new Date(Date.now() - 2.5 * 60 * 60000).toISOString()
    }
  ]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'ready': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'preparing': return <ChefHat className="w-4 h-4" />;
      case 'ready': return <CheckCircle2 className="w-4 h-4" />;
      case 'delivered': return <Truck className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'preparing': return 'Preparando';
      case 'ready': return 'Listo';
      case 'delivered': return 'Entregado';
      default: return status;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      <KitchenHeader
        title="HISTORIAL"
        rightMeta={<>{restaurant?.name || ""}{restaurant?.name ? " · " : ""}{orders.length} completados</>}
      />

      <main className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid gap-3">
        {orders.length === 0 ? (
          <Card className="border-none bg-[#1A1A1A] rounded-2xl shadow-xl">
            <CardContent className="p-8 text-center">
              <Clock className="w-12 h-12 mx-auto text-white/20 mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay pedidos en el historial</h3>
              <p className="text-[#A0A0A0] font-bold">Los pedidos completados aparecerán aquí</p>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id} className="overflow-hidden border-none bg-[#1A1A1A] rounded-2xl shadow-xl">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-white">Orden #{order.id}</CardTitle>
                    <p className="text-[#A0A0A0] font-bold">{order.customerName}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{getStatusText(order.status)}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span>
                        {item.quantity}x {item.name}
                        {item.notes && <span className="text-[#A0A0A0] ml-2 font-bold">({item.notes})</span>}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="text-xs text-[#A0A0A0] font-bold space-y-1">
                  <div>Creado: {formatDate(order.createdAt)}</div>
                  {order.deliveredAt && (
                    <div>Entregado: {formatDate(order.deliveredAt)}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
        </div>
      </main>
    </div>
  );
}
