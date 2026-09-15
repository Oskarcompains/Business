import React from 'react';
import { 
  CalendarDays, 
  Sparkles, 
  Building2, 
  ArrowRight, 
  Briefcase, 
  Users, 
  MapPin, 
  MessageSquare,
  Gift,
  QrCode,
  CheckCircle2,
  Share2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MemberDashboard: React.FC = () => {
  const { 
    currentUser, 
    companies, 
    events, 
    registrations, 
    posts, 
    opportunities, 
    perks, 
    setActiveView, 
    setSelectedEventId, 
    setSelectedCompanyId,
    startDirectChatWithUser,
    startCompanyChat,
    registerForEvent
  } = useApp();

  // Upcoming events
  const upcomingEvents = events.filter(e => e.status !== 'FINALIZADO' && e.status !== 'CANCELADO').slice(0, 2);

  // My registered events
  const myRegistrations = registrations.filter(r => r.userId === currentUser.id);

  // Newly joined companies
  const newlyJoinedCompanies = [...companies].sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime()).slice(0, 3);

  // Active opportunities
  const activeOpportunities = opportunities.filter(o => !o.isResolved).slice(0, 3);

  // Recommended companies based on tags / complementary needs
  const recommendedCompanies = companies
    .filter(c => c.id !== currentUser.companyId)
    .slice(0, 3);

  // Latest club post / announcement
  const latestPost = posts[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0a142c] via-[#102046] to-[#0a142c] border border-[#1d3568] p-5 sm:p-7 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-600/25 text-red-300 border border-red-500/40 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-red-400" />
                Bienvenido al Club
              </span>
              <span className="text-xs text-slate-400">
                {currentUser.companyName}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Hola, {currentUser.name}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Descubre las próximas oportunidades de networking, confirma tu asistencia con acreditación QR y conecta con los directores de las {companies.length} empresas del club.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              id="btn-dash-create-opp"
              onClick={() => setActiveView('opportunities')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-700 via-red-600 to-red-700 hover:from-red-600 hover:to-red-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-red-950/40 border border-red-500/40 transition"
            >
              <Briefcase className="w-4 h-4" />
              <span>Publicar Oportunidad B2B</span>
            </button>
            <button
              id="btn-dash-browse-events"
              onClick={() => setActiveView('events')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0c1630] hover:bg-[#13234b] border border-[#1f376d] text-white font-medium text-xs sm:text-sm transition"
            >
              <CalendarDays className="w-4 h-4 text-red-400" />
              <span>Ver Agenda de Eventos</span>
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Grid: Events & QR Passes */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Próximos Eventos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-red-500" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Próximos Eventos y Networking
              </h2>
            </div>
            <button
              onClick={() => setActiveView('events')}
              className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              Ver todos ({events.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {upcomingEvents.map(event => {
              const reg = myRegistrations.find(r => r.eventId === event.id);
              const isRegistered = !!reg;
              return (
                <div 
                  key={event.id}
                  className="rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] overflow-hidden hover:border-red-500/40 transition flex flex-col group shadow-md"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img 
                      src={event.bannerImage} 
                      alt={event.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#070d1e] via-[#070d1e]/40 to-transparent" />
                    <span className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#0a1329]/90 backdrop-blur-md text-red-300 border border-red-500/40">
                      {event.type}
                    </span>
                    {isRegistered && (
                      <span className="absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/90 text-white flex items-center gap-1 shadow">
                        <CheckCircle2 className="w-3 h-3" /> Inscrito
                      </span>
                    )}
                    <div className="absolute bottom-2 left-3 right-3 text-xs text-slate-300 flex items-center justify-between">
                      <span className="font-semibold text-white">{event.date} • {event.time}</span>
                      <span className="text-[11px] text-slate-400">{event.capacity} aforo</span>
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h3 
                        onClick={() => {
                          setSelectedEventId(event.id);
                          setActiveView('events');
                        }}
                        className="text-sm font-bold text-white hover:text-red-400 cursor-pointer line-clamp-2 transition"
                      >
                        {event.title}
                      </h3>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1.5">
                        <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
                        <span className="truncate">{event.location}</span>
                      </p>
                    </div>

                    <div className="pt-2 border-t border-[#182a52] flex items-center justify-between gap-2">
                      <button
                        onClick={() => {
                          setSelectedEventId(event.id);
                          setActiveView('events');
                        }}
                        className="text-xs text-slate-300 hover:text-white font-medium py-1.5"
                      >
                        Detalles y Programa
                      </button>

                      {isRegistered ? (
                        <button
                          onClick={() => {
                            setSelectedEventId(event.id);
                            setActiveView('events');
                          }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold hover:bg-emerald-500/30 transition"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                          <span>Ver Pase QR</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            registerForEvent(event.id);
                            setSelectedEventId(event.id);
                            setActiveView('events');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white text-xs font-bold shadow-md transition"
                        >
                          Inscribirme Gratis
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Mi Pase Digital & Check-in Rápido */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-red-500" />
              <h2 className="text-base sm:text-lg font-bold text-white">
                Mi Carnet & Pases
              </h2>
            </div>
            <button
              onClick={() => setActiveView('checkin')}
              className="text-xs font-semibold text-red-400 hover:text-red-300"
            >
              Lector QR
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#0a1329] to-[#070d1e] border border-[#1b3164] space-y-4 shadow-md">
            <div className="flex items-center gap-3">
              <img 
                src={currentUser.avatar} 
                alt={currentUser.name} 
                className="w-12 h-12 rounded-xl object-cover ring-2 ring-red-500/40"
              />
              <div className="min-w-0">
                <h4 className="text-sm font-bold text-white truncate">{currentUser.name}</h4>
                <p className="text-xs text-red-400 font-semibold truncate">{currentUser.position}</p>
                <p className="text-[11px] text-slate-400 truncate">{currentUser.companyName}</p>
              </div>
            </div>

            {myRegistrations.length > 0 ? (
              <div className="p-3.5 rounded-xl bg-[#070e20] border border-[#1d346b] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Próximo pase activo:</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Confirmado
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-200 line-clamp-1">
                  {events.find(e => e.id === myRegistrations[0].eventId)?.title || 'Encuentro Networking'}
                </p>
                <p className="text-[11px] font-mono text-slate-400">
                  Código: {myRegistrations[0].ticketCode}
                </p>
                <button
                  onClick={() => {
                    setSelectedEventId(myRegistrations[0].eventId);
                    setActiveView('events');
                  }}
                  className="w-full mt-2 py-2 px-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>Mostrar QR de Acceso</span>
                </button>
              </div>
            ) : (
              <div className="p-3.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-center space-y-2 text-xs text-slate-400">
                <p>No tienes inscripciones activas actualmente.</p>
                <button
                  onClick={() => setActiveView('events')}
                  className="text-red-400 font-semibold hover:underline"
                >
                  Inscribirse a un evento
                </button>
              </div>
            )}

            <div className="pt-2 border-t border-[#182a52] flex items-center justify-between text-xs text-slate-400">
              <span>Socio Activo: #{currentUser.id.toUpperCase()}</span>
              <span className="text-emerald-400 font-medium">Verificado ✓</span>
            </div>
          </div>
        </div>

      </div>

      {/* Section: "EMPRESAS QUE DEBERÍAS CONOCER" (Matchmaking / Recomendaciones) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="text-base sm:text-lg font-bold text-white">
                Empresas que Deberías Conocer
              </h2>
              <p className="text-xs text-slate-400">
                Sinergias y recomendaciones basadas en sectores e intereses comerciales
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveView('directory')}
            className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
          >
            Directorio completo ({companies.length})
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recommendedCompanies.map((comp) => (
            <div 
              key={comp.id}
              className="p-4 rounded-2xl bg-[#0a1329] border border-[#1b3164] hover:border-red-500/50 transition shadow-md flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-2.5">
                    <img 
                      src={comp.logo} 
                      alt={comp.name} 
                      className="w-10 h-10 rounded-xl object-cover ring-1 ring-[#1b3164] group-hover:ring-red-500/50 transition"
                    />
                    <div>
                      <h4 
                        onClick={() => {
                          setSelectedCompanyId(comp.id);
                          setActiveView('directory');
                        }}
                        className="text-sm font-bold text-white hover:text-red-400 cursor-pointer transition line-clamp-1"
                      >
                        {comp.name}
                      </h4>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{comp.sector}</p>
                    </div>
                  </div>
                  {comp.tier.includes('PATROCINADOR') && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-red-600/30 text-red-200 border border-red-500/40">
                      VIP
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mb-2">
                  {comp.description}
                </p>

                {/* Sinergia badge */}
                <div className="bg-[#070e20] rounded-lg p-2 border border-[#182a52] text-[11px] space-y-1">
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="text-red-400 font-bold">Ofrece:</span>
                    <span className="text-slate-300 truncate">{comp.offers[0] || 'Servicios especializados'}</span>
                  </div>
                  <div className="flex items-center gap-1 text-slate-400">
                    <span className="text-sky-400 font-bold">Busca:</span>
                    <span className="text-slate-300 truncate">{comp.seeking[0] || 'Alianzas y clientes'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-[#182a52] flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setSelectedCompanyId(comp.id);
                    setActiveView('directory');
                  }}
                  className="text-xs text-slate-400 hover:text-white font-medium"
                >
                  Ver Ficha
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => startCompanyChat(comp)}
                    className="p-1.5 rounded-lg bg-[#12234e] hover:bg-[#1a3372] text-slate-200 text-xs transition"
                    title="Enviar mensaje directo"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-red-400" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedCompanyId(comp.id);
                      setActiveView('directory');
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/40 text-red-300 text-xs font-bold transition"
                  >
                    Conectar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Grid: Oportunidades Comerciales & Novedades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Oportunidades Comerciales B2B */}
        <div className="p-5 rounded-2xl bg-[#0a1329] border border-[#1b3164] space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-white">
                Tablón de Oportunidades B2B
              </h3>
            </div>
            <button
              onClick={() => setActiveView('opportunities')}
              className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              Ver todas ({opportunities.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {activeOpportunities.map(opp => (
              <div 
                key={opp.id}
                onClick={() => setActiveView('opportunities')}
                className="p-3 rounded-xl bg-[#070e20] border border-[#182a52] hover:border-[#203a74] transition cursor-pointer space-y-1.5"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md ${
                    opp.type === 'BUSCO' 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40' 
                      : opp.type === 'OFREZCO'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                  }`}>
                    {opp.type}
                  </span>
                  <span className="text-[11px] text-slate-400">{opp.companyName}</span>
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                  {opp.title}
                </h4>
                <p className="text-xs text-slate-300 line-clamp-2">
                  {opp.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Ventajas & Convenios Exclusivos */}
        <div className="p-5 rounded-2xl bg-[#0a1329] border border-[#1b3164] space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-white">
                Ventajas y Convenios para Socios
              </h3>
            </div>
            <button
              onClick={() => setActiveView('perks')}
              className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1"
            >
              Ver catálogo ({perks.length})
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {perks.slice(0, 3).map(perk => (
              <div 
                key={perk.id}
                onClick={() => setActiveView('perks')}
                className="p-3 rounded-xl bg-[#070e20] border border-[#182a52] hover:border-[#203a74] transition cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <img src={perk.companyLogo} alt={perk.companyName} className="w-10 h-10 rounded-lg object-cover ring-1 ring-[#182a52] shrink-0" />
                  <div className="min-w-0">
                    <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">{perk.category}</span>
                    <h5 className="text-xs font-bold text-white truncate">{perk.title}</h5>
                    <p className="text-[11px] text-slate-400 truncate">{perk.companyName}</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-red-600/20 border border-red-500/40 text-red-200 text-xs font-bold shrink-0">
                  {perk.discount}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
