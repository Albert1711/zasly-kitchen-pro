import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { AlertCircle, Download, RefreshCw } from 'lucide-react';

declare global {
  interface Window {
    electronAPI: {
      onUpdateAvailable: (callback: () => void) => void;
      onUpdateDownloaded: (callback: () => void) => void;
      restartApp: () => void;
    };
  }
}

export function UpdateNotifier() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [updateDownloaded, setUpdateDownloaded] = useState(false);

  useEffect(() => {
    // Check if we are running in Electron
    if (window.electronAPI) {
      window.electronAPI.onUpdateAvailable(() => {
        setUpdateAvailable(true);
      });

      window.electronAPI.onUpdateDownloaded(() => {
        setUpdateAvailable(false);
        setUpdateDownloaded(true);
      });
    }
  }, []);

  if (!updateAvailable && !updateDownloaded) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-right duration-500">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-sm ring-1 ring-black/5">
        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl flex-shrink-0 ${updateDownloaded ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
            {updateDownloaded ? <Download className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900">
              {updateDownloaded ? '¡Actualización Lista!' : 'Nueva Versión'}
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {updateDownloaded 
                ? 'La nueva versión de Zasly Kitchen Pro se ha descargado. Reinicia para aplicar los cambios.' 
                : 'Hay una nueva actualización disponible con mejoras y nuevas funciones.'}
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          {updateDownloaded ? (
            <Button 
              onClick={() => window.electronAPI.restartApp()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reiniciar y Actualizar
            </Button>
          ) : (
            <div className="text-xs font-medium text-blue-600 animate-pulse bg-blue-50 px-3 py-2 rounded-lg w-full text-center">
              Descargando actualización...
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
