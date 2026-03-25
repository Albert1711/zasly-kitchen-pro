import { Card, CardContent } from "../components/ui/card";
import { Badge } from "../components/ui/badge";
import { Puzzle, Server, Database, Globe, CheckCircle2, Wifi, Zap } from "lucide-react";
import KitchenHeader from "../components/kitchen/KitchenHeader";
import { cn } from "../lib/utils";

export default function IntegrationsPage() {
  const integrations = [
    { 
      id: 'kds', 
      name: 'Kitchen Display (KDS)', 
      description: 'Conecta el área de preparación con la caja en tiempo real.', 
      status: 'connected', 
      icon: Zap,
      type: 'Local'
    },
    { 
      id: 'db', 
      name: 'Supabase Cloud', 
      description: 'Sincronización de datos, inventario y ventas en la nube.', 
      status: 'connected', 
      icon: Database,
      type: 'Cloud'
    },
    { 
      id: 'delivery', 
      name: 'Plataformas de Delivery', 
      description: 'Recibe órdenes de PedidosYa y UberEats directamente.', 
      status: 'disconnected', 
      icon: Globe,
      type: 'External'
    },
    { 
      id: 'fiscal', 
      name: 'Impresora Fiscal', 
      description: 'Control de facturación legal y reportes Z/X.', 
      status: 'warning', 
      icon: Server,
      type: 'Hardware'
    },
  ];

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      <KitchenHeader title="INTEGRACIONES" />

      <main className="flex-1 min-h-0 overflow-y-auto p-6 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {integrations.map((item) => (
            <Card key={item.id} className="border-none bg-[#1A1A1A] rounded-[2rem] shadow-xl overflow-hidden group hover:ring-2 hover:ring-[#FF4500]/40 transition-all">
              <CardContent className="p-6">
                <div className="flex items-start gap-6">
                  <div className={cn(
                    "p-4 rounded-[1.5rem] transition-colors",
                    item.status === 'connected' ? 'bg-[#FF4500]/10 text-[#FF4500]' : 
                    item.status === 'warning' ? 'bg-amber-500/10 text-amber-400' : 'bg-white/5 text-[#A0A0A0]'
                  )}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-xl font-black uppercase tracking-tight leading-tight mb-1">{item.name}</h3>
                        <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest border-white/10 text-[#A0A0A0]">{item.type}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.status === 'connected' ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">
                            <Wifi className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">En Línea</span>
                          </div>
                        ) : item.status === 'warning' ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 rounded-full border border-amber-500/20">
                            <Server className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Atención</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 text-[#A0A0A0] rounded-full border border-white/10">
                            <CheckCircle2 className="w-3 h-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">Configurar</span>
                          </div>
                        )}
                      </div>
                    </div>
                    <p className="mt-4 text-[#A0A0A0] font-bold text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="mt-8 border-2 border-dashed border-white/5 bg-transparent rounded-[2rem] p-12 text-center flex flex-col items-center">
          <div className="p-4 bg-white/5 rounded-full mb-4">
            <Puzzle className="w-10 h-10 text-white/20" />
          </div>
          <h3 className="text-xl font-black uppercase tracking-widest text-white/20">Sugerir Nueva Integración</h3>
          <p className="text-[#A0A0A0] font-bold text-sm mt-2">¿Necesitas conectar algo más? Estamos expandiendo el ecosistema Zasly.</p>
        </Card>
      </main>
    </div>
  );
}
