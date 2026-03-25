import { ReactNode } from "react";
import { Outlet } from "react-router-dom";
import { KitchenSidebar } from "./KitchenSidebar";
import { RestaurantProvider } from "../../contexts/RestaurantContext";

export default function KitchenLayout({ children, onResetOnboarding }: { children?: ReactNode, onResetOnboarding?: () => void }) {
  return (
    <RestaurantProvider>
      <div className="h-screen w-screen flex overflow-hidden bg-black text-white selection:bg-primary/30">
        <KitchenSidebar onResetOnboarding={onResetOnboarding} />
        <div className="flex-1 flex flex-col min-w-0">
          <main className="flex-1 overflow-hidden relative">
            {children || <Outlet />}
          </main>
        </div>
      </div>
    </RestaurantProvider>
  );
}
