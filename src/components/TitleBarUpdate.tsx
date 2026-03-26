import React, { useState, useEffect } from 'react';
import { CloudDownload, RefreshCw, AlertCircle, CheckCircle2, Loader2, Bell } from 'lucide-react';

export function TitleBarUpdate() {
  const [status, setStatus] = useState<'idle' | 'checking' | 'available' | 'downloading' | 'downloaded' | 'error' | 'no-update'>('idle');
  const [progress, setProgress] = useState<number | null>(null);
  const [version, setVersion] = useState<string | null>(null);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    if (window.electronAPI) {
      window.electronAPI.getAppVersion().then((v) => setVersion(v));

      window.electronAPI.onUpdateChecking(() => {
        setStatus('checking');
        setShowNotification(false);
      });

      window.electronAPI.onUpdateAvailable(() => {
        setStatus('available');
        setShowNotification(true);
      });

      window.electronAPI.onUpdateNotAvailable(() => {
        setStatus('no-update');
        setTimeout(() => setStatus('idle'), 3000); // Reset to idle after 3s
      });

      window.electronAPI.onUpdateDownloadProgress((p: { percent?: number }) => {
        setStatus('downloading');
        setProgress(p.percent || 0);
      });

      window.electronAPI.onUpdateDownloaded(() => {
        setStatus('downloaded');
        setShowNotification(true);
      });

      window.electronAPI.onUpdateError(() => {
        setStatus('error');
      });

      // Auto check on mount
      window.electronAPI.checkForUpdates();
    }
  }, []);

  if (!window.electronAPI) return null;

  return (
    <div className="flex items-center gap-2 px-3 h-full border-r border-white/10 relative">
      <div className="text-[10px] font-medium text-white/50 uppercase tracking-wider mr-2">
        v{version}
      </div>

      {/* Cloud Download Icon - Trigger */}
      <button 
        onClick={() => window.electronAPI.checkForUpdates()}
        disabled={status === 'checking' || status === 'downloading'}
        className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-white relative group"
        title="Buscar actualizaciones"
      >
        <CloudDownload className={`w-4 h-4 ${status === 'available' ? 'text-yellow-300 animate-bounce' : 'text-white/80'}`} />
        
        {/* Adobe-style status indicator dots */}
        {status === 'available' && <span className="absolute top-1 right-1 w-2 h-2 bg-yellow-400 rounded-full border border-[#FF4500]" />}
        {status === 'downloaded' && <span className="absolute top-1 right-1 w-2 h-2 bg-emerald-400 rounded-full border border-[#FF4500]" />}
      </button>

      {/* Status Messages */}
      {status === 'checking' && (
        <div className="flex items-center gap-2 text-white/90 text-[11px] animate-pulse">
          <Loader2 className="w-3 h-3 animate-spin" />
          <span>Buscando...</span>
        </div>
      )}

      {status === 'no-update' && (
        <div className="text-white/70 text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded border border-white/5">
          AL DÍA
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
          className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 px-2 py-1 rounded text-xs text-white font-bold transition-all animate-pulse shadow-lg"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          <span>INSTALAR</span>
        </button>
      )}

      {status === 'error' && (
        <button 
          onClick={() => window.electronAPI.checkForUpdates()}
          className="flex items-center gap-1 text-rose-200 hover:text-white transition-colors"
          title="Error. Reintentar?"
        >
          <AlertCircle className="w-3 h-3" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">ERROR</span>
        </button>
      )}

      {/* Notification Toast for New Version (Adobe style) */}
      {showNotification && (status === 'available' || status === 'downloaded') && (
        <div className="absolute top-12 left-0 z-[300] bg-white text-slate-900 p-3 rounded-lg shadow-2xl border border-slate-200 w-48 animate-in slide-in-from-top-2 duration-300">
          <div className="flex items-start gap-2">
            <div className="bg-blue-100 p-1.5 rounded-full text-blue-600">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] font-bold leading-tight">
                {status === 'available' ? '¡Nueva actualización!' : 'Lista para instalar'}
              </p>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {status === 'available' ? 'Se está descargando en segundo plano.' : 'Reinicia para aplicar los cambios.'}
              </p>
            </div>
          </div>
          <button 
            onClick={() => setShowNotification(false)}
            className="absolute top-1 right-1 p-1 text-slate-400 hover:text-slate-600"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}
