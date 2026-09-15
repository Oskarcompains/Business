import React, { useEffect, useState } from 'react';
import { Mail, CheckCircle2, X, ExternalLink, Calendar, MapPin, QrCode } from 'lucide-react';
import { EmailConfirmationPayload } from '../../services/emailService';

interface EmailSentToastProps {
  emailData: EmailConfirmationPayload | null;
  onClose: () => void;
}

export const EmailSentToast: React.FC<EmailSentToastProps> = ({ emailData, onClose }) => {
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!emailData) return;
    const timer = setTimeout(() => {
      // Auto dismiss after 8 seconds if modal not opened
      if (!showPreview) {
        onClose();
      }
    }, 8000);
    return () => clearTimeout(timer);
  }, [emailData, showPreview, onClose]);

  if (!emailData) return null;

  return (
    <>
      {/* Toast Notification */}
      <div className="fixed bottom-6 right-6 z-50 max-w-md w-full animate-in slide-in-from-bottom-5 duration-300">
        <div className="rounded-2xl bg-[#0a1329] border border-emerald-500/40 p-4 shadow-2xl shadow-emerald-950/40 text-slate-100 flex items-start gap-3.5 backdrop-blur-xl">
          <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
            <Mail className="w-5 h-5 animate-pulse" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 mb-0.5">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Correo de confirmación enviado</span>
            </div>
            <p className="text-xs text-white font-medium truncate">
              Destinatario: <span className="font-mono text-emerald-300">{emailData.to}</span>
            </p>
            <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">
              {emailData.subject}
            </p>

            <div className="mt-2.5 flex items-center gap-2">
              <button
                onClick={() => setShowPreview(true)}
                className="px-2.5 py-1 rounded-lg bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 text-[11px] font-semibold transition flex items-center gap-1 cursor-pointer"
              >
                <ExternalLink className="w-3 h-3" />
                <span>Ver copia del correo</span>
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-[#12234e] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Modal Preview of the sent email */}
      {showPreview && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in"
          onClick={() => setShowPreview(false)}
        >
          <div 
            className="w-full max-w-lg rounded-3xl bg-[#0c1630] border border-[#1e366b] shadow-2xl overflow-hidden relative text-slate-100 p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#182a52]">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <Mail className="w-4 h-4" />
                <span>Comprobante de Correo Enviado</span>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#12234e]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <div className="text-xs bg-[#070e20] p-3 rounded-xl border border-[#1b3164] space-y-1">
                <p><strong className="text-slate-400">De:</strong> Club de Empresas Rojillo &lt;no-reply@clubempresarial.es&gt;</p>
                <p><strong className="text-slate-400">Para:</strong> {emailData.recipientName} &lt;{emailData.to}&gt;</p>
                <p><strong className="text-slate-400">Asunto:</strong> {emailData.subject}</p>
              </div>

              {/* Email simulation box */}
              <div className="rounded-2xl border border-red-500/30 overflow-hidden bg-[#070d1e]">
                <div className="bg-gradient-to-r from-red-800 to-red-600 p-4 text-white text-center">
                  <h4 className="font-extrabold text-sm tracking-wide">Club de Empresas Rojillo</h4>
                  <p className="text-[11px] text-red-100">Confirmación Oficial de Asistencia</p>
                </div>
                
                <div className="p-5 space-y-3 text-xs text-slate-200">
                  <p>Estimado/a <strong>{emailData.recipientName}</strong>,</p>
                  <p className="text-slate-300">
                    Confirmamos que tu reserva para el encuentro empresarial se ha procesado con éxito.
                  </p>

                  {emailData.eventName && (
                    <div className="p-3.5 rounded-xl bg-[#0a1329] border border-[#1e366b] space-y-1.5">
                      <p className="font-bold text-white text-sm text-red-400">{emailData.eventName}</p>
                      <p className="text-slate-300 flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        {emailData.eventDate} • {emailData.eventTime} h
                      </p>
                      <p className="text-slate-300 flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {emailData.eventLocation}
                      </p>
                      {emailData.hasCompanion && (
                        <p className="text-emerald-300 text-[11px]">
                          + Invitado registrado: {emailData.companionName || 'Acompañante confirmado'}
                        </p>
                      )}
                    </div>
                  )}

                  {emailData.ticketCode && (
                    <div className="p-3 rounded-xl bg-[#081125] border border-dashed border-red-500/40 text-center">
                      <p className="text-[10px] text-slate-400 uppercase font-semibold">Tu código de acreditación / QR:</p>
                      <p className="text-base font-mono font-black text-red-400 tracking-wider mt-0.5">
                        {emailData.ticketCode}
                      </p>
                    </div>
                  )}

                  <p className="text-[11px] text-slate-400 pt-2 border-t border-[#182a52]">
                    Puedes visualizar tu pase QR en cualquier momento desde la sección de Eventos del Club.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowPreview(false)}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold"
              >
                Cerrar vista previa
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
