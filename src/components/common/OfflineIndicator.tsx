import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div 
      id="offline-status-banner"
      className="fixed bottom-20 md:bottom-6 left-4 right-4 md:right-auto md:left-6 z-50 flex items-center gap-2.5 rounded-xl bg-red-600/95 text-white px-4 py-2.5 text-xs font-semibold shadow-2xl backdrop-blur-md border border-red-400 animate-in slide-in-from-bottom duration-300"
    >
      <WifiOff className="w-4 h-4 shrink-0 text-white animate-bounce" />
      <div>
        <p className="font-bold">Modo Sin Conexión</p>
        <p className="text-[11px] text-red-100 font-normal">Estás navegando en modo local. Los datos se sincronizarán al reconectar.</p>
      </div>
    </div>
  );
};
