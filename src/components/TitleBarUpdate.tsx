import React, { useState, useEffect } from 'react';
import { Download, RefreshCw, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

export function TitleBarUpdate() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'error'>('idle');
  const [progress, setProgress] = useState<number | null>(null);
  const [version, setVersion] = useState<string | null>(null);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getAppVersion().then((v) => setVersion(v));

      window.electronAPI.onUpdateChecking(() => setStatus('checking'));
      window.electronAPI.onUpdateAvailable(() => setStatus('available'));
      window.electronAPI.onUpdateNotAvailable(() => setStatus('idle'));
      window.electronAPI.onUpdateDownloadProgress((p: { percent?: number }) => {
        setStatus('downloading');
        setProgress(p.percent || 0);
      });
      window.electronAPI.onUpdateDownloaded(() => setStatus('downloaded'));
      window.electronAPI.onUpdateError(() => setStatus('error'));

      // Auto check on mount
      window.electronAPI.checkForUpdates();
    }
  }, []);

  if (!window.electronAPI) return null;

  return (
    <div className="flex items-center gap-2 px-3 h-full border-r border-white/10">
      <div className="text-[10px] font-medium text-white/50 uppercase tracking-wider mr-2">
        v{version}
      </div>

      {status === 'idle' && (
        <button 
          onClick={() => window.electronAPI.checkForUpdates()}
          className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white/80"
          title="Buscar actualizaciones"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>
      )}

      {status === 'checking' && (
        <div className="flex items-center gap-2 text-white/90 text-xs">
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span className="hidden sm:inline">Buscando...</span>
        </div>
      )}

      {status === 'available' && (
        <div className="flex items-center gap-2 text-white/90 text-xs">
          <Download className="w-3.5 h-3.5 animate-bounce" />
          <span className="hidden sm:inline">Nueva versión!</span>
        </div>
      )}

      {status === 'downloading' && (
        <div className="flex items-center gap-2 bg-white/10 px-2 py-1 rounded text-xs text-white">
          <div className="w-12 h-1 bg-white/20 rounded-full overflow-hidden">
            <div 
              className="h-full bg-white transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-[10px]">{Math.round(progress || 0)}%</span>
        </div>
      )}

      {status === 'downloaded' && (
        <button 
          onClick={() => window.electronAPI.restartApp()}
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-2 py-1 rounded text-xs text-white font-bold transition-all animate-pulse"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>REINICIAR</span>
        </button>
      )}

      {status === 'error' && (
        <button 
          onClick={() => window.electronAPI.checkForUpdates()}
          className="flex items-center gap-2 text-rose-200 hover:text-white transition-colors"
          title="Error al actualizar. Reintentar?"
        >
          <AlertCircle className="w-3.5 h-3.5" />
          <span className="text-[10px] font-bold">ERROR</span>
        </button>
      )}
    </div>
  );
}
