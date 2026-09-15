import React, { useState } from 'react';
import { Download, Smartphone, X, CheckCircle2 } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  className?: string;
  variant?: 'compact' | 'full';
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ 
  className = '',
  variant = 'compact'
}) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showGuide, setShowGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  if (isInstalled || installedSuccess) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        <span>PWA Instalada</span>
      </div>
    );
  }

  const handleAction = async () => {
    if (isInstallable) {
      const ok = await install();
      if (ok) setInstalledSuccess(true);
    } else {
      // Show instructions modal for iOS or browsers that don't support beforeinstallprompt
      setShowGuide(true);
    }
  };

  return (
    <>
      <button
        id="btn-pwa-install"
        onClick={handleAction}
        className={`flex items-center gap-2 rounded-lg font-medium transition-all shadow-sm ${
          variant === 'full'
            ? 'w-full justify-center px-4 py-2.5 bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white text-sm font-semibold shadow-md shadow-red-950/40'
            : 'px-3 py-1.5 bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-200 text-xs hover:text-white'
        } ${className}`}
        title="Instalar como aplicación en tu móvil o escritorio"
      >
        <Smartphone className="w-4 h-4 text-red-400 shrink-0" />
        <span>{variant === 'full' ? 'Instalar App en Móvil' : 'Instalar App'}</span>
      </button>

      {showGuide && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setShowGuide(false)}
        >
          <div 
            className="w-full max-w-sm rounded-2xl bg-[#0a1329] border border-[#1b3164] p-6 shadow-2xl relative text-slate-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowGuide(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#12234e]"
              aria-label="Cerrar"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-400 mb-4">
              <Download className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">
              Instalar ClubNexus en tu dispositivo
            </h3>
            
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              Disfruta de la experiencia completa de aplicación nativa, acceso rápido a tu carnet de socio y check-in de eventos sin depender del navegador.
            </p>

            {isIOS ? (
              <div className="space-y-3 bg-[#070e20] rounded-xl p-3.5 border border-[#182a52] text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-600/25 text-red-300 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Pulsa el botón de <strong>Compartir</strong> <span className="inline-block px-1.5 py-0.5 bg-[#12234e] rounded">⎙ / ↑</span> en la barra de Safari.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-600/25 text-red-300 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Baja y pulsa en <strong>"Añadir a pantalla de inicio"</strong>.</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-600/25 text-red-300 font-bold flex items-center justify-center shrink-0">3</span>
                  <span>Confirma pulsando <strong>"Añadir"</strong> en la esquina superior.</span>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-[#070e20] rounded-xl p-3.5 border border-[#182a52] text-xs text-slate-300">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-600/25 text-red-300 font-bold flex items-center justify-center shrink-0">1</span>
                  <span>Abre el menú de opciones de tu navegador (los tres puntos <strong>⋮</strong>).</span>
                </div>
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-red-600/25 text-red-300 font-bold flex items-center justify-center shrink-0">2</span>
                  <span>Selecciona <strong>"Instalar aplicación"</strong> o <strong>"Añadir a pantalla de inicio"</strong>.</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowGuide(false)}
              className="mt-5 w-full rounded-xl bg-[#12234e] hover:bg-[#1a3372] py-2.5 text-sm font-medium text-slate-200 transition"
            >
              Entendido
            </button>
          </div>
        </div>
      )}
    </>
  );
};
