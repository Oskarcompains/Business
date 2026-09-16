import React, { useState, useMemo } from 'react';
import { 
  CalendarDays, 
  PlusCircle, 
  MapPin, 
  Users, 
  CheckCircle2, 
  QrCode, 
  Calendar, 
  Search, 
  ArrowRight,
  Filter,
  Sparkles,
  Download,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClubEvent, EventRegistration, EventType } from '../../types';
import { EventDetailModal } from './EventDetailModal';
import { EventTicketModal } from './EventTicketModal';
import { CreateEventModal } from './CreateEventModal';
import { GoogleSheetsSyncModal } from '../sheets/GoogleSheetsSyncModal';

export const EventsView: React.FC = () => {
  const { 
    events, 
    registrations, 
    currentUser, 
    addEvent, 
    selectedEventId, 
    setSelectedEventId,
    setActiveView
  } = useApp();

  const isAdmin = currentUser.role === 'SUPERADMIN' || currentUser.role === 'ADMIN';

  // Tabs & filters
  const [activeTab, setActiveTab] = useState<'all' | 'my-events' | 'past'>('all');
  const [selectedType, setSelectedType] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [detailEvent, setDetailEvent] = useState<ClubEvent | null>(() => {
    return events.find(e => e.id === selectedEventId) || null;
  });
  const [ticketModalData, setTicketModalData] = useState<{ event: ClubEvent; registration: EventRegistration } | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);

  // My registered events
  const myRegistrations = registrations.filter(r => r.userId === currentUser.id);
  const myRegisteredEventIds = new Set(myRegistrations.map(r => r.eventId));

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const isPast = event.status === 'FINALIZADO';
      
      // Tab filter
      if (activeTab === 'past' && !isPast) return false;
      if (activeTab === 'all' && isPast) return false;
      if (activeTab === 'my-events' && !myRegisteredEventIds.has(event.id)) return false;

      // Type filter
      if (selectedType !== 'ALL' && event.type !== selectedType) return false;

      // Search filter
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchTitle = event.title.toLowerCase().includes(term);
        const matchLoc = event.location.toLowerCase().includes(term);
        const matchDesc = event.description.toLowerCase().includes(term);
        if (!matchTitle && !matchLoc && !matchDesc) return false;
      }

      return true;
    });
  }, [events, activeTab, selectedType, searchTerm, myRegisteredEventIds]);

  const handleOpenDetail = (event: ClubEvent) => {
    setDetailEvent(event);
    setSelectedEventId(event.id);
  };

  const handleOpenTicket = (event: ClubEvent, reg: EventRegistration) => {
    setTicketModalData({ event, registration: reg });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <CalendarDays className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Agenda de Eventos y Networking
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Conferencias, desayunos de trabajo, visitas corporativas y encuentros exclusivos para socios.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <button
                id="btn-sync-sheets-events"
                onClick={() => setIsSheetsModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Google Sheets</span>
              </button>

              <button
                id="btn-admin-create-event"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-xs sm:text-sm shadow-md transition"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Crear Evento</span>
              </button>
            </>
          )}
          <button
            onClick={() => setActiveView('checkin')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c1630] hover:bg-[#13234b] text-slate-200 text-xs sm:text-sm font-semibold border border-[#1f376d] transition"
          >
            <QrCode className="w-4 h-4 text-red-400" />
            <span>Control de Check-in QR</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Main Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#070e20] rounded-xl border border-[#1d346b] w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'all' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Próximos Convocados
            </button>
            <button
              onClick={() => setActiveTab('my-events')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition ${
                activeTab === 'my-events' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Mis Pases</span>
              {myRegistrations.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-white text-red-700 text-[10px] font-black flex items-center justify-center">
                  {myRegistrations.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab('past')}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition ${
                activeTab === 'past' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Histórico / Pasados
            </button>
          </div>

          {/* Search & Type filter */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por título o ciudad..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
              />
            </div>

            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-slate-200 text-xs outline-none focus:border-red-500"
            >
              <option value="ALL">Todos los formatos</option>
              <option value="Encuentro de Networking">Networking</option>
              <option value="Desayuno Empresarial">Desayuno</option>
              <option value="Afterwork & Cóctel">Afterwork</option>
              <option value="Conferencia Magistral">Conferencia</option>
              <option value="Jornada de Formación">Formación</option>
              <option value="Visita Corporativa">Visita</option>
              <option value="Mesa Redonda VIP">Mesa Redonda</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0a1329] border border-[#1b3164] space-y-3">
          <CalendarDays className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No hay eventos para este filtro</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Selecciona "Próximos Convocados" o borra el término de búsqueda para ver el calendario completo.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEvents.map(event => {
            const myReg = registrations.find(r => r.eventId === event.id && r.userId === currentUser.id);
            const isReg = !!myReg;
            const eventRegsCount = registrations.filter(r => r.eventId === event.id).length;
            const pct = Math.min(100, Math.round((eventRegsCount / event.capacity) * 100));

            return (
              <div 
                key={event.id}
                id={`event-card-${event.id}`}
                className="rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] hover:border-red-500/40 transition flex flex-col justify-between overflow-hidden shadow-lg group"
              >
                <div>
                  {/* Banner Image */}
                  <div className="relative h-44 overflow-hidden">
                    <img 
                      src={event.bannerImage} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070e20] via-[#070e20]/40 to-transparent" />
                    
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#0a1329]/90 backdrop-blur-md text-red-300 border border-red-500/40">
                      {event.type}
                    </span>

                    {isReg && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white flex items-center gap-1 shadow">
                        <CheckCircle2 className="w-3 h-3" /> Inscrito
                      </span>
                    )}

                    <div className="absolute bottom-2.5 left-3.5 right-3.5 flex items-center justify-between text-xs text-slate-200">
                      <span className="font-bold text-white bg-[#070e20]/80 px-2.5 py-0.5 rounded-md backdrop-blur-sm">
                        {event.date} • {event.time} h
                      </span>
                      <span className="text-[11px] bg-[#070e20]/80 px-2 py-0.5 rounded-md backdrop-blur-sm text-slate-300">
                        {eventRegsCount} / {event.capacity} aforo
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 
                        onClick={() => handleOpenDetail(event)}
                        className="text-base font-bold text-white hover:text-red-400 cursor-pointer transition line-clamp-2"
                      >
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </p>
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {event.description}
                    </p>

                    {/* Progress Bar of Capacity */}
                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] text-slate-400">
                        <span>Ocupación de aforo</span>
                        <span className="font-bold text-red-400">{pct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#070e20] rounded-full overflow-hidden">
                        <div className="h-full bg-red-600 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="p-5 pt-0">
                  <div className="pt-3 border-t border-[#182a52] flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleOpenDetail(event)}
                      className="text-xs font-semibold text-slate-300 hover:text-white"
                    >
                      Programa & Ponentes
                    </button>

                    {isReg ? (
                      <button
                        onClick={() => handleOpenTicket(event, myReg)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 text-xs font-bold transition shadow"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                        <span>Ver Pase QR</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => handleOpenDetail(event)}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white text-xs font-bold transition shadow"
                      >
                        <span>Inscribirme</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Event Detail Modal */}
      {detailEvent && (
        <EventDetailModal 
          event={detailEvent}
          onClose={() => setDetailEvent(null)}
          onOpenTicket={(reg) => {
            setDetailEvent(null);
            setTicketModalData({ event: detailEvent, registration: reg });
          }}
        />
      )}

      {/* Ticket Pass QR Modal */}
      {ticketModalData && (
        <EventTicketModal 
          event={ticketModalData.event}
          registration={ticketModalData.registration}
          onClose={() => setTicketModalData(null)}
        />
      )}

      {/* Create Event Modal */}
      {isCreateModalOpen && (
        <CreateEventModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={(data) => addEvent(data)}
        />
      )}

      {/* Google Sheets Sync Modal */}
      {isSheetsModalOpen && (
        <GoogleSheetsSyncModal 
          mode="events"
          onClose={() => setIsSheetsModalOpen(false)}
        />
      )}

    </div>
  );
};
