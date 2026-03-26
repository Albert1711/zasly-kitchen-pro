import { useEffect, useState } from "react";
import { Minus, Square, X } from "lucide-react";

declare global {
  interface Window {
    electronAPI?: {
      minimizeWindow: () => void;
      toggleMaximizeWindow: () => void;
      closeWindow: () => void;
      onMaximizeState: (callback: (payload: { isMaximized: boolean }) => void) => void;
    };
  }
}

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (!window.electronAPI?.onMaximizeState) return;
    window.electronAPI.onMaximizeState((payload) => {
      setIsMaximized(Boolean(payload?.isMaximized));
    });
  }, []);

  return (
    <div
      className="h-10 w-full bg-[#FF4500] text-white flex items-center justify-between select-none"
      style={{ WebkitAppRegion: "drag" } as any}
    >
      <div className="flex items-center gap-2 px-3 min-w-0">
        <img
          src="./logo%20zasly%20inco.png"
          alt="Logo"
          className="h-7 w-auto object-contain"
          draggable={false}
        />
        <div className="font-black tracking-tight truncate">Zasly Kitchen Pro</div>
      </div>

      <div className="flex items-stretch h-full" style={{ WebkitAppRegion: "no-drag" } as any}>
        <button
          onClick={() => window.electronAPI?.minimizeWindow()}
          className="w-12 hover:bg-black/15 transition-colors flex items-center justify-center"
          aria-label="Minimizar"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => window.electronAPI?.toggleMaximizeWindow()}
          className="w-12 hover:bg-black/15 transition-colors flex items-center justify-center"
          aria-label={isMaximized ? "Restaurar" : "Maximizar"}
          title={isMaximized ? "Restaurar" : "Maximizar"}
        >
          <Square className="w-4 h-4" />
        </button>
        <button
          onClick={() => window.electronAPI?.closeWindow()}
          className="w-12 hover:bg-black/25 transition-colors flex items-center justify-center"
          aria-label="Cerrar"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
