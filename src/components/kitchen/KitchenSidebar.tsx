import { 
  ChefHat, 
  ClipboardList, 
  Timer, 
  Package, 
  Users, 
  Settings, 
  Bell,
  ShoppingCart,
  UserCircle2 
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

const menuGroups = [
  {
    label: "Cocina",
    items: [
      { title: "Pedidos en cola", url: "/", icon: ClipboardList },
      { title: "Punto de Venta (POS)", url: "/pos", icon: ShoppingCart },
      { title: "Historial de cocina", url: "/historial", icon: Timer },
      { title: "Inventario / Stock", url: "/inventario", icon: Package },
    ]
  },
  {
    label: "Equipo",
    items: [
      { title: "Personal", url: "/personal", icon: Users },
      { title: "Notificaciones", url: "/notificaciones", icon: Bell },
    ]
  }
];

export function KitchenSidebar({ onResetOnboarding }: { onResetOnboarding?: () => void }) {
  const location = useLocation();

  return (
    <div className="w-16 border-r border-white/10 bg-black flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300">
      <div className="p-3 flex justify-center py-6">
        <button 
          onClick={onResetOnboarding}
          className="flex items-center hover:opacity-80 transition-opacity"
        >
          <div className="p-2 rounded-xl canva-gradient text-white shadow-lg shadow-purple-500/20">
            <ChefHat className="w-5 h-5 shrink-0" />
          </div>
        </button>
      </div>
      
      <nav className="flex-1 min-h-0 px-2 space-y-4 overflow-y-auto overflow-x-hidden custom-scrollbar py-2">
        {menuGroups.map((group) => (
          <div key={group.label} className="space-y-1">
            <div className="space-y-1">
              {group.items.map((item) => {
                const isActive = location.pathname === item.url;
                return (
                  <Link
                    key={item.url}
                    to={item.url}
                    className={cn(
                      "flex items-center justify-center rounded-xl transition-all duration-200 group relative mx-auto w-10 h-10",
                      isActive 
                        ? "bg-[#FF4500] text-white shadow-lg shadow-[#FF4500]/20" 
                        : "text-[#A0A0A0] hover:bg-white/5 hover:text-white"
                    )}
                    title={item.title}
                  >
                    <item.icon className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200 group-hover:scale-110",
                      isActive ? "text-white" : "text-[#A0A0A0]"
                    )} />
                    {isActive && (
                      <div className="absolute -left-2 w-1.5 h-8 bg-[#FF4500] rounded-r-full shadow-[0_0_10px_#FF4500]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>
      
      <div className="p-2 mt-auto border-t border-white/5 bg-black/50 space-y-2">
        <button 
          className="flex items-center justify-center rounded-xl text-[#A0A0A0] hover:bg-white/5 hover:text-white transition-all duration-300 mx-auto w-10 h-10"
          title="Cambio de Turno / Usuario"
        >
          <UserCircle2 className="h-5 w-5" />
        </button>
        <Link
          to="/configuracion"
          className={cn(
            "flex items-center justify-center rounded-xl transition-all duration-300 mx-auto w-10 h-10",
            location.pathname === "/configuracion"
              ? "bg-[#FF4500] text-white shadow-lg shadow-[#FF4500]/20"
              : "text-[#A0A0A0] hover:bg-white/5 hover:text-white"
          )}
          title="Configuración"
        >
          <Settings className={cn(
            "h-4 w-4",
            location.pathname === "/configuracion" ? "text-white" : "text-[#A0A0A0]"
          )} />
        </Link>
      </div>
    </div>
  );
}

