import { Card, CardContent } from "../components/ui/card";
import { Package, AlertTriangle, TrendingDown } from "lucide-react";
import KitchenHeader from "../components/kitchen/KitchenHeader";

export default function KitchenInventory() {
  const inventory = [
    { name: "Pan de Hamburguesa", stock: 45, unit: "unid", status: "ok" },
    { name: "Carne Molida", stock: 12, unit: "kg", status: "low" },
    { name: "Papas Fritas", stock: 8, unit: "kg", status: "critical" },
    { name: "Queso Cheddar", stock: 20, unit: "unid", status: "ok" },
  ];

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      <KitchenHeader title="INVENTARIO" />

      <main className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {inventory.map((item, index) => (
            <Card key={index} className="border-none bg-[#1A1A1A] rounded-2xl shadow-xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      item.status === 'critical' ? 'bg-red-500/10 text-red-400' : 
                      item.status === 'low' ? 'bg-amber-500/10 text-amber-300' : 'bg-emerald-500/10 text-emerald-300'
                    }`}>
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-black text-white leading-tight">{item.name}</p>
                      <p className="text-sm text-[#A0A0A0] font-bold">{item.stock} {item.unit} disponibles</p>
                    </div>
                  </div>
                  {item.status !== 'ok' && (
                    <div className={item.status === 'critical' ? 'text-red-400' : 'text-amber-300'}>
                      {item.status === 'critical' ? <AlertTriangle className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
