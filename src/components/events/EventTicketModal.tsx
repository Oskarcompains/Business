import React, { useEffect, useState } from 'react';
import { X, QrCode, Calendar, MapPin, Download, CheckCircle2, User, Building2, Users } from 'lucide-react';
import QRCode from 'qrcode';
import { ClubEvent, EventRegistration } from '../../types';

interface EventTicketModalProps {
  event: ClubEvent;
  registration: EventRegistration;
  onClose: () => void;
}

export const EventTicketModal: React.FC<EventTicketModalProps> = ({
  event,
  registration,
  onClose
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(registration.ticketCode, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0f172a',
        light: '#ffffff'
      }
    }).then(url => {
      setQrDataUrl(url);
    }).catch(err => {
      console.error('Error generating QR', err);
    });
  }, [registration.ticketCode]);

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `Acreditacion_${event.title.substring(0, 20)}_${registration.userName}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-sm rounded-3xl bg-[#0a1329] border border-[#1b3164] shadow-2xl overflow-hidden relative text-slate-100 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-20 p-1.5 rounded-full bg-[#070e20]/80 hover:bg-[#12234e] text-slate-400 hover:text-white transition"
          aria-label="Cerrar ticket"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-red-800 via-red-600 to-red-700 p-5 text-white shadow-md">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-1 text-red-100">
            <span>Acreditación Oficial B2B</span>
            <span className="font-extrabold tracking-wide">Club Empresarial</span>
          </div>
          <h3 className="text-base font-black leading-tight line-clamp-2">
            {event.title}
          </h3>
          <div className="flex items-center gap-1.5 text-xs font-semibold mt-2 text-red-100">
            <Calendar className="w-3.5 h-3.5 text-red-200" />
            <span>{event.date} • {event.time} h</span>
          </div>
        </div>

        {/* Perforated divider visual */}
        <div className="relative flex items-center justify-between px-2 -my-2 z-10">
          <div className="w-4 h-4 rounded-full bg-black -ml-4" />
          <div className="flex-1 border-t-2 border-dashed border-[#1b3164] mx-2" />
          <div className="w-4 h-4 rounded-full bg-black -mr-4" />
        </div>

        {/* Ticket Body with QR */}
        <div className="p-6 text-center space-y-4">
          
          {/* QR Code Container */}
          <div className="bg-white p-4 rounded-2xl inline-block shadow-xl mx-auto ring-4 ring-[#12234e]/50">
            {qrDataUrl ? (
              <img 
                src={qrDataUrl} 
                alt={`QR Ticket ${registration.ticketCode}`} 
                className="w-48 h-48 mx-auto"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-slate-400 text-xs">
                Generando código...
              </div>
            )}
            <p className="text-[10px] font-mono text-slate-800 font-bold tracking-widest mt-2 uppercase">
              {registration.ticketCode}
            </p>
          </div>

          {/* Attendee Info */}
          <div className="p-3 rounded-xl bg-[#070e20] border border-[#1b3164] text-left space-y-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Titular del Pase:</span>
              <span className="font-bold text-white flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {registration.status}
              </span>
            </div>
            <p className="font-bold text-slate-100 text-sm">{registration.userName}</p>
            <p className="text-red-400 font-medium">{registration.userCompany}</p>
            
            {registration.hasCompanion && (
              <div className="pt-2 mt-2 border-t border-[#182a52] text-xs text-slate-300 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-red-400" />
                <span>Acompañante: <strong>{registration.companionName || '+1 Confirmado'}</strong></span>
              </div>
            )}
          </div>

          <p className="text-[11px] text-slate-400">
            Presenta este código QR en el acceso del evento para registrar tu asistencia de forma automática.
          </p>

          <button
            onClick={handleDownload}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#12234e] hover:bg-[#1a3372] text-slate-200 text-xs font-semibold transition"
          >
            <Download className="w-4 h-4 text-red-400" />
            <span>Descargar Pase en Imagen</span>
          </button>
        </div>

      </div>
    </div>
  );
};
