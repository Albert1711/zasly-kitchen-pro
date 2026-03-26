import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { AlertCircle, Download, RefreshCw } from 'lucide-react';

declare global {
  interface Window {
    electronAPI: {
      onUpdateChecking: (callback: () => void) => void;
      onUpdateAvailable: (callback: () => void) => void;
      onUpdateNotAvailable: (callback: () => void) => void;
      onUpdateDownloadProgress: (callback: (payload: { percent?: number }) => void) => void;
      onUpdateDownloaded: (callback: () => void) => void;
      onUpdateError: (callback: (payload: { message: string }) => void) => void;
      restartApp: () => void;
    };
  }
}

export function UpdateNotifier() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'downloading' | 'downloaded' | 'error'>('idle');
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check if we are running in Electron
    if (window.electronAPI) {
      window.electronAPI.onUpdateChecking(() => {
        setError(null);
        setProgress(null);
        setStatus('checking');
      });

      window.electronAPI.onUpdateAvailable(() => {
        setError(null);
        setStatus('downloading');
      });

      window.electronAPI.onUpdateNotAvailable(() => {
        setError(null);
        setProgress(null);
        setStatus('idle');
      });

      window.electronAPI.onUpdateDownloadProgress((payload) => {
        if (typeof payload?.percent === 'number') {
          setProgress(Math.max(0, Math.min(100, payload.percent)));
        }
        setStatus('downloading');
      });

      window.electronAPI.onUpdateDownloaded(() => {
        setProgress(100);
        setStatus('downloaded');
      });

      window.electronAPI.onUpdateError((payload) => {
        setError(payload?.message || 'Error desconocido');
        setStatus('error');
      });
    }
  }, []);

  if (status === 'idle') return null;

  const title =
    status === 'downloaded'
      ? '¡Actualización Lista!'
      : status === 'error'
        ? 'Error de Actualización'
        : status === 'checking'
          ? 'Buscando actualización...'
          : 'Actualizando...';

  const description =
    status === 'downloaded'
      ? 'La nueva versión se ha descargado. Reinicia para aplicar los cambios.'
      : status === 'error'
        ? error || 'No se pudo completar la actualización.'
        : status === 'checking'
          ? 'Estamos revisando si hay una versión nueva disponible.'
          : `Descargando actualización${progress === null ? '...' : ` (${progress.toFixed(0)}%)`}`;

  return (
    <div className="fixed bottom-6 right-6 z-[200] animate-in slide-in-from-right duration-500">
      <div className="bg-white border border-slate-200 shadow-2xl rounded-2xl p-6 max-w-sm ring-1 ring-black/5">
        <div className="flex items-start gap-4">
          <div
            className={`p-3 rounded-xl flex-shrink-0 ${
              status === 'downloaded'
                ? 'bg-emerald-100 text-emerald-600'
                : status === 'error'
                  ? 'bg-rose-100 text-rose-600'
                  : 'bg-blue-100 text-blue-600'
            }`}
          >
            {status === 'downloaded' ? <Download className="w-6 h-6" /> : <AlertCircle className="w-6 h-6" />}
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900">{title}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          {status === 'downloaded' ? (
            <Button 
              onClick={() => window.electronAPI.restartApp()}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Reiniciar y Actualizar
            </Button>
          ) : status === 'error' ? (
            <div className="text-xs font-medium text-rose-700 bg-rose-50 px-3 py-2 rounded-lg w-full text-center">
              Falló la actualización
            </div>
          ) : (
            <div className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-2 rounded-lg w-full text-center">
              {status === 'checking'
                ? 'Buscando versión nueva...'
                : `Descargando${progress === null ? '...' : ` ${progress.toFixed(0)}%`}`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
