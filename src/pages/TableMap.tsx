import { useState } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { LayoutGrid, Users, Clock } from "lucide-react";
import KitchenHeader from "../components/kitchen/KitchenHeader";
import { cn } from "../lib/utils";

interface Table {
  id: string;
  name: string;
  status: 'available' | 'occupied' | 'billing' | 'ordered';
  capacity: number;
  time?: string;
  total?: number;
}

export default function TableMap() {
  const [tables] = useState<Table[]>([
    { id: '1', name: 'Mesa 1', status: 'occupied', capacity: 4, time: '45 min', total: 45.50 },
    { id: '2', name: 'Mesa 2', status: 'available', capacity: 2 },
    { id: '3', name: 'Mesa 3', status: 'ordered', capacity: 4, time: '12 min', total: 28.00 },
    { id: '4', name: 'Mesa 4', status: 'billing', capacity: 6, time: '1h 10min', total: 112.00 },
    { id: '5', name: 'Mesa 5', status: 'available', capacity: 2 },
    { id: '6', name: 'Mesa 6', status: 'occupied', capacity: 4, time: '20 min', total: 34.50 },
    { id: '7', name: 'Bar 1', status: 'occupied', capacity: 1, time: '15 min', total: 12.00 },
    { id: '8', name: 'Bar 2', status: 'available', capacity: 1 },
  ]);

  const getStatusColor = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'occupied': return 'bg-sky-500/10 text-sky-400 border-sky-500/20';
      case 'ordered': return 'bg-[#FF4500]/10 text-[#FF4500] border-[#FF4500]/20';
      case 'billing': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      default: return 'bg-white/5 text-white/40 border-white/10';
    }
  };

  const getStatusText = (status: Table['status']) => {
    switch (status) {
      case 'available': return 'Disponible';
      case 'occupied': return 'Ocupada';
      case 'ordered': return 'Pidiendo';
      case 'billing': return 'Cuenta';
      default: return status;
    }
  };

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      <KitchenHeader 
        title="MESAS" 
        rightMeta={<>Total Mesas: {tables.length} · Ocupadas: {tables.filter(t => t.status !== 'available').length}</>}
      />

      <main className="flex-1 min-h-0 overflow-y-auto p-6 custom-scrollbar">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {tables.map((table) => (
            <Card 
              key={table.id} 
              className={cn(
                "border-2 bg-[#1A1A1A] rounded-[2rem] overflow-hidden transition-all duration-300 hover:scale-[1.02] active:scale-95 cursor-pointer shadow-xl",
                table.status === 'available' ? "border-transparent opacity-60" : 
                table.status === 'ordered' ? "border-[#FF4500]" : "border-white/5"
              )}
            >
              <CardContent className="p-6 flex flex-col h-full gap-4">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-white/5 rounded-2xl">
                    <LayoutGrid className={cn("w-6 h-6", table.status === 'ordered' ? "text-[#FF4500]" : "text-white/20")} />
                  </div>
                  <Badge className={cn("font-black uppercase tracking-widest px-3 py-1 rounded-xl border", getStatusColor(table.status))}>
                    {getStatusText(table.status)}
                  </Badge>
                </div>

                <div className="space-y-1">
                  <h3 className="text-3xl font-black tracking-tighter uppercase italic">{table.name}</h3>
                  <div className="flex items-center gap-2 text-[#A0A0A0] font-bold text-sm">
                    <Users className="w-4 h-4" />
                    Capacidad: {table.capacity}
                  </div>
                </div>

                {table.status !== 'available' && (
                  <div className="mt-auto pt-4 border-t border-white/5 space-y-2">
                    <div className="flex justify-between items-center text-[#A0A0A0] font-bold text-xs uppercase tracking-widest">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {table.time}
                      </div>
                      <div className="text-white font-black text-lg">${table.total?.toFixed(2)}</div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      <footer className="h-16 bg-black border-t border-white/10 px-8 flex items-center justify-center gap-8 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-sky-500" />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Ocupada</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#FF4500]" />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-50">Pidiendo</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <span className="text-[10px] font-black uppercase tracking-widest opacity-50">En Cuenta</span>
        </div>
      </footer>
    </div>
  );
}
