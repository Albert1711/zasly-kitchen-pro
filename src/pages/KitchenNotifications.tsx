import { Card, CardContent } from "../components/ui/card";
import { Bell, AlertTriangle } from "lucide-react";
import KitchenHeader from "../components/kitchen/KitchenHeader";

export default function KitchenNotifications() {
  const notifications = [
    { title: "Stock Bajo", message: "Las papas fritas están por debajo del límite crítico.", type: "warning", time: "10 min" },
    { title: "Nuevo Pedido", message: "Orden #125 recibida con prioridad alta.", type: "info", time: "15 min" },
    { title: "Actualización de Sistema", message: "Nueva versión de Zasly Kitchen Pro instalada.", type: "success", time: "1 hora" },
  ];

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      <KitchenHeader title="NOTIFICACIONES" />

      <main className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar">
        <div className="space-y-3">
          {notifications.map((note, index) => (
            <Card key={index} className="border-none bg-[#1A1A1A] rounded-2xl shadow-xl">
              <CardContent className="p-4 flex items-start gap-3">
                <div className={`p-2 rounded-xl ${
                  note.type === 'warning' ? 'bg-amber-500/10 text-amber-300' : 
                  note.type === 'info' ? 'bg-sky-500/10 text-sky-300' : 'bg-emerald-500/10 text-emerald-300'
                }`}>
                  {note.type === 'warning' ? <AlertTriangle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-black text-white truncate">{note.title}</p>
                    <span className="text-[10px] text-[#A0A0A0] font-black uppercase tracking-widest shrink-0">{note.time}</span>
                  </div>
                  <p className="text-[#A0A0A0] text-sm font-bold leading-snug">{note.message}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
