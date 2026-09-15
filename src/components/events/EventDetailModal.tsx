import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Building2, 
  QrCode, 
  CheckCircle2, 
  Share2, 
  CalendarPlus, 
  MessageSquare, 
  Sparkles,
  Award,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ClubEvent, EventRegistration, User } from '../../types';
import { useApp } from '../../context/AppContext';

interface EventDetailModalProps {
  event: ClubEvent;
  onClose: () => void;
  onOpenTicket: (reg: EventRegistration) => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  onClose,
  onOpenTicket
}) => {
  const { 
    currentUser, 
    registrations, 
    registerForEvent, 
    cancelEventRegistration,
    startDirectChatWithUser,
    users
  } = useApp();

  const [hasCompanion, setHasCompanion] = useState(false);
  const [companionName, setCompanionName] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'agenda' | 'attendees' | 'speakers'>('info');

  const myRegistration = registrations.find(
    r => r.eventId === event.id && r.userId === currentUser.id
  );
  const isRegistered = !!myRegistration;

  const eventRegistrations = registrations.filter(r => r.eventId === event.id);
  const isFull = eventRegistrations.length >= event.capacity;

  const handleRegister = () => {
    registerForEvent(
      event.id, 
      hasCompanion, 
      hasCompanion ? companionName : undefined
    );
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const handleAddToGoogleCalendar = () => {
    const text = encodeURIComponent(event.title);
    const details = encodeURIComponent(event.description);
    const location = encodeURIComponent(event.location);
    // Rough date format for gcal
    const gcalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}&location=${location}`;
    window.open(gcalUrl, '_blank');
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden my-6 relative text-slate-100 flex flex-col max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-slate-950/70 hover:bg-slate-800 text-slate-300 hover:text-white transition backdrop-blur-md"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Event Banner */}
        <div className="relative h-48 sm:h-56 bg-[#070e20] shrink-0 overflow-hidden">
          <img 
            src={event.bannerImage} 
            alt={event.title} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1329] via-[#0a1329]/40 to-transparent" />
          
          <div className="absolute top-4 left-4 flex flex-wrap gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#070e20]/80 text-red-300 border border-red-500/40 backdrop-blur-md">
              {event.type}
            </span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md ${
              event.status === 'INSCRIPCIONES ABIERTAS'
                ? 'bg-emerald-500/90 text-white'
                : event.status === 'COMPLETO'
                ? 'bg-red-600/90 text-white'
                : 'bg-[#12234e] text-slate-300'
            }`}>
              {event.status}
            </span>
          </div>

          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-xs text-slate-200">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1.5 font-semibold text-white bg-[#070e20]/70 px-3 py-1 rounded-lg backdrop-blur-sm">
                <Calendar className="w-3.5 h-3.5 text-red-400" />
                {event.date} • {event.time} h
              </span>
            </div>
            <span className="bg-[#070e20]/70 px-3 py-1 rounded-lg backdrop-blur-sm">
              Aforo: <strong>{eventRegistrations.length}</strong> / {event.capacity}
            </span>
          </div>
        </div>

        {/* Title & Primary Action Bar */}
        <div className="p-6 pb-3 border-b border-[#182a52] shrink-0 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {event.title}
              </h2>
              <p className="text-xs text-slate-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <span>{event.location}</span>
              </p>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleAddToGoogleCalendar}
                className="p-2.5 rounded-xl bg-[#12234e] hover:bg-[#1a3372] text-slate-300 hover:text-white transition"
                title="Añadir a Google Calendar"
              >
                <CalendarPlus className="w-4 h-4 text-red-400" />
              </button>

              {isRegistered ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenTicket(myRegistration)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition shadow"
                  >
                    <QrCode className="w-4 h-4" />
                    <span>Ver Mi Pase QR</span>
                  </button>
                  <button
                    onClick={() => cancelEventRegistration(event.id)}
                    className="px-3 py-2 rounded-xl bg-[#12234e] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 text-xs font-medium transition"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  disabled={isFull}
                  className={`flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg transition ${
                    isFull 
                      ? 'bg-[#12234e] text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isFull ? 'Aforo Completo' : 'Confirmar Mi Asistencia'}</span>
                </button>
              )}
            </div>
          </div>

          {/* Optional Companion Toggle when registering */}
          {!isRegistered && !isFull && (
            <div className="p-3 rounded-xl bg-[#070e20]/80 border border-[#1b3164] text-xs space-y-2">
              <label className="flex items-center gap-2 cursor-pointer select-none text-slate-300">
                <input 
                  type="checkbox" 
                  checked={hasCompanion} 
                  onChange={(e) => setHasCompanion(e.target.checked)}
                  className="rounded accent-red-600 w-4 h-4"
                />
                <span>Asistiré con un invitado / acompañante de mi empresa (+1)</span>
              </label>

              {hasCompanion && (
                <input 
                  type="text"
                  value={companionName}
                  onChange={(e) => setCompanionName(e.target.value)}
                  placeholder="Nombre y cargo del acompañante (ej. María Gómez, Directora Comercial)"
                  className="w-full px-3 py-1.5 rounded-lg bg-[#0a1329] border border-[#1d346b] text-white placeholder:text-slate-500 text-xs outline-none focus:border-red-500"
                />
              )}
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-1">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'info' 
                  ? 'bg-red-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Descripción & Detalles
            </button>
            <button
              onClick={() => setActiveTab('agenda')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'agenda' 
                  ? 'bg-red-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Programa ({event.agenda?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('attendees')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'attendees' 
                  ? 'bg-red-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Asistentes ({eventRegistrations.length})
            </button>
            <button
              onClick={() => setActiveTab('speakers')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'speakers' 
                  ? 'bg-red-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ponentes ({event.speakers?.length || 0})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          {activeTab === 'info' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Acerca del Encuentro
                </h4>
                <p className="text-slate-200 leading-relaxed">
                  {event.description}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#070e20]/70 border border-[#1b3164] space-y-2 text-xs">
                  <span className="text-slate-400 block font-semibold">Organizador Oficial</span>
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Building2 className="w-4 h-4 text-red-500" />
                    <span>{event.organizer}</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-[#070e20]/70 border border-[#1b3164] space-y-2 text-xs">
                  <span className="text-slate-400 block font-semibold">Público Objetivo</span>
                  <div className="flex items-center gap-2 font-bold text-white">
                    <Users className="w-4 h-4 text-sky-400" />
                    <span>{event.targetAudience || 'Socios, Directores y Representantes'}</span>
                  </div>
                </div>
              </div>

              {/* Sponsors / Collaborators */}
              {event.sponsors && event.sponsors.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-red-400" />
                    Patrocinadores del Evento
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {event.sponsors.map((sp, idx) => (
                      <span key={idx} className="text-xs px-3 py-1 rounded-lg bg-red-500/10 text-red-300 border border-red-500/30 font-semibold">
                        {sp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'agenda' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Horario y Orden del Día
              </h4>
              <div className="space-y-3">
                {event.agenda?.map((item, idx) => (
                  <div key={idx} className="flex gap-4 p-3.5 rounded-xl bg-[#070e20]/60 border border-[#1b3164]">
                    <span className="font-mono text-xs font-bold text-red-400 shrink-0 w-16 pt-0.5">
                      {item.time}
                    </span>
                    <div className="space-y-0.5">
                      <h5 className="font-bold text-white text-sm">{item.title}</h5>
                      {item.description && (
                        <p className="text-xs text-slate-400">{item.description}</p>
                      )}
                    </div>
                  </div>
                )) || <p className="text-xs text-slate-400">El programa detallado se comunicará próximamente.</p>}
              </div>
            </div>
          )}

          {activeTab === 'attendees' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Empresas y Profesionales Confirmados ({eventRegistrations.length})
                </h4>
                <span className="text-xs text-emerald-400 font-semibold">
                  Abierto para Networking
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {eventRegistrations.map((reg) => {
                  const userObj = users.find(u => u.id === reg.userId);
                  return (
                    <div key={reg.id} className="p-3.5 rounded-2xl bg-[#070e20]/70 border border-[#1b3164] flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 min-w-0">
                        <img 
                          src={userObj?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'} 
                          alt={reg.userName} 
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#1b3164] shrink-0" 
                        />
                        <div className="min-w-0">
                          <h5 className="text-xs font-bold text-white truncate">{reg.userName}</h5>
                          <p className="text-[11px] text-red-400 truncate">{reg.userCompany}</p>
                          <span className="text-[10px] text-slate-400 block">{reg.status}</span>
                        </div>
                      </div>

                      {reg.userId !== currentUser.id && userObj && (
                        <button
                          onClick={() => {
                            startDirectChatWithUser(userObj);
                            onClose();
                          }}
                          className="p-2 rounded-xl bg-[#12234e] hover:bg-[#1a3372] text-slate-200 text-xs shrink-0 transition"
                          title="Enviar mensaje antes del evento"
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-red-400" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'speakers' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Ponentes y Especialistas Invitados
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {event.speakers?.map((sp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#070e20]/70 border border-[#1b3164] flex items-start gap-3.5">
                    <img src={sp.avatar} alt={sp.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#1b3164] shrink-0" />
                    <div className="space-y-1">
                      <h5 className="text-sm font-bold text-white">{sp.name}</h5>
                      <p className="text-xs text-red-400 font-semibold">{sp.role}</p>
                      <p className="text-xs text-slate-400">{sp.company}</p>
                      {sp.bio && (
                        <p className="text-xs text-slate-300 mt-1 leading-relaxed">{sp.bio}</p>
                      )}
                    </div>
                  </div>
                )) || <p className="text-xs text-slate-400">Próximamente se anunciarán los ponentes.</p>}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
