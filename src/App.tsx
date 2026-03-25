import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import KitchenLayout from "./components/kitchen/KitchenLayout";
import KitchenOrders from "./pages/KitchenOrders";
import KitchenHistory from "./pages/KitchenHistory";
import KitchenInventory from "./pages/KitchenInventory";
import KitchenStaff from "./pages/KitchenStaff";
import KitchenNotifications from "./pages/KitchenNotifications";
import KitchenSettings from "./pages/KitchenSettings";
import POSModule from "./pages/POSModule";
import Onboarding from "./Onboarding";
import { UpdateNotifier } from "./components/UpdateNotifier";

function App() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    console.log("App initializing...");
    const complete = localStorage.getItem("kitchen_onboarding_complete");
    console.log("Onboarding status:", complete);
    if (complete !== "true") {
      setShowOnboarding(true);
    }
    setIsInitialized(true);
  }, []);

  const resetOnboarding = () => {
    localStorage.removeItem("kitchen_onboarding_complete");
    setShowOnboarding(true);
  };

  if (!isInitialized) {
    console.log("App not initialized yet");
    return <div className="h-screen bg-black flex items-center justify-center text-white">Iniciando...</div>;
  }

  if (showOnboarding) {
    console.log("Showing onboarding");
    return <Onboarding onComplete={() => setShowOnboarding(false)} />;
  }

  console.log("Rendering KitchenLayout and Routes");

  return (
    <>
      <KitchenLayout onResetOnboarding={resetOnboarding}>
        <Routes>
          <Route path="/" element={<KitchenOrders />} />
          <Route path="/pos" element={<POSModule />} />
          <Route path="/historial" element={<KitchenHistory />} />
          <Route path="/inventario" element={<KitchenInventory />} />
          <Route path="/personal" element={<KitchenStaff />} />
          <Route path="/notificaciones" element={<KitchenNotifications />} />
          <Route path="/configuracion" element={<KitchenSettings />} />
        </Routes>
      </KitchenLayout>
      <UpdateNotifier />
    </>
  );
}

export default App;
