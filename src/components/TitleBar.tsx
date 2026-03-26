import { useEffect, useState } from 'react';
import { Minus, Square, X } from 'lucide-react';
import { TitleBarUpdate } from './TitleBarUpdate';

export function TitleBar() {
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    if (window.electronAPI && window.electronAPI.onMaximizeState) {
      window.electronAPI.onMaximizeState((maximized: boolean) => {
        setIsMaximized(!!maximized);
      });
    }
  }, []);

  return (
    <div className="h-10 bg-[#FF4500] flex items-center justify-between select-none border-b border-black/10" style={{ WebkitAppRegion: 'drag' } as any}>
      <div className="flex items-center h-full">
        <div className="flex items-center px-3 gap-2" style={{ WebkitAppRegion: 'no-drag' } as any}>
          <img src="/logo zasly inco.png" alt="Zasly" className="h-6 w-auto" />
          <span className="text-white font-bold text-sm tracking-tight uppercase">ZASLY KITCHEN PRO</span>
        </div>
        
        <TitleBarUpdate />
      </div>

      <div className="flex h-full" style={{ WebkitAppRegion: 'no-drag' } as any}>
        <button 
          onClick={() => window.electronAPI?.minimizeWindow()}
          className="px-4 h-full hover:bg-black/10 transition-colors text-white flex items-center justify-center"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button 
          onClick={() => window.electronAPI?.toggleMaximizeWindow()}
          className="px-4 h-full hover:bg-black/10 transition-colors text-white flex items-center justify-center"
        >
          {isMaximized ? (
            <svg width="12" height="12" viewBox="0 0 12 12" className="w-3 h-3"><path fill="currentColor" d="M2.1,0v2H0v8.1h8.2v-2h2V0H2.1z M7.2,9.2H1.1V3h6.1V9.2z M9.2,7.1h-1V3H3.1V1.1h6.1V7.1z"/></svg>
          ) : (
            <Square className="w-3.5 h-3.5" />
          )}
        </button>
        <button 
          onClick={() => window.electronAPI?.closeWindow()}
          className="px-4 h-full hover:bg-rose-600 transition-colors text-white flex items-center justify-center"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
