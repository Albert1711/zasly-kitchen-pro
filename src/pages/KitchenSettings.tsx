import { Card, CardContent } from "../components/ui/card";
import { Volume2, Monitor, Database, Printer } from "lucide-react";
import { Button } from "../components/ui/button";
import KitchenHeader from "../components/kitchen/KitchenHeader";

export default function KitchenSettings() {
  const sections = [
    { title: "General", icon: Monitor, description: "Brillo, idioma y preferencias visuales." },
    { title: "Sonido", icon: Volume2, description: "Volumen de alertas para nuevos pedidos." },
    { title: "Base de Datos", icon: Database, description: "Sincronización y estado de la conexión." },
    { title: "Impresora", icon: Printer, description: "Configuración de tickets y comandas físicas." },
  ];

  return (
    <div className="h-full w-full bg-black text-white flex flex-col overflow-hidden font-sans select-none">
      <KitchenHeader title="CONFIG" />

      <main className="flex-1 min-h-0 overflow-y-auto p-4 custom-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sections.map((section, index) => (
            <Card key={index} className="border-none bg-[#1A1A1A] rounded-2xl shadow-xl hover:ring-2 hover:ring-[#FF4500]/40 transition-all cursor-pointer group">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="p-3 bg-white/5 rounded-2xl text-[#A0A0A0] group-hover:text-[#FF4500] transition-colors">
                  <section.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-black text-lg text-white leading-tight truncate">{section.title}</p>
                  <p className="text-[#A0A0A0] font-bold text-sm leading-snug">{section.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="pt-6">
          <Button className="rounded-xl h-12 px-8 font-black bg-[#FF4500] hover:bg-[#ff5a1f] text-white">
            Guardar Cambios
          </Button>
        </div>
      </main>
    </div>
  );
}
