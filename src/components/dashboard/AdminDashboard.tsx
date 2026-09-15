import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  CalendarDays, 
  CheckCircle2, 
  TrendingUp, 
  Crown, 
  QrCode, 
  PlusCircle, 
  Download, 
  Sparkles, 
  MessageSquare,
  ArrowUpRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface AdminDashboardProps {
  onOpenCreateEvent?: () => void;
  onOpenCreateCompany?: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onOpenCreateEvent,
  onOpenCreateCompany
}) => {
  const { 
    companies, 
    users, 
    events, 
    registrations, 
    posts, 
    opportunities, 
    setActiveView,
    setSelectedEventId
  } = useApp();

  const [exportNotice, setExportNotice] = useState(false);

  // Computed KPIs
  const totalCompanies = companies.length;
  const totalMembers = users.length;
  const activeMembersPct = 94; // %
  const upcomingEvents = events.filter(e => e.status !== 'FINALIZADO' && e.status !== 'CANCELADO');
  const totalRegistrations = registrations.length;
  const checkedInCount = registrations.filter(r => r.status === 'Asistente').length;
  const attendanceRate = totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 85;
  const activeSponsors = companies.filter(c => c.tier.includes('PATROCINADOR')).length;
  const totalPosts = posts.length;
  const totalOpportunities = opportunities.length;

  const handleExportData = () => {
    // Generate CSV string of companies
    const headers = ['ID', 'Nombre', 'CIF', 'Sector', 'Categoría', 'Ubicación', 'Fecha Alta'];
    const rows = companies.map(c => [
      c.id,
      `"${c.name}"`,
      c.cif || 'N/A',
      `"${c.sector}"`,
      c.tier,
      `"${c.location}"`,
      c.joinedAt
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `clubnexus_empresas_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setExportNotice(true);
    setTimeout(() => setExportNotice(false), 3000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Top Banner with Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-[#0a142c] via-[#102046] to-[#0a142c] border border-[#1d3568] shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-red-600/25 text-red-300 border border-red-500/40 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-red-400" />
              Consola de Administración
            </span>
            <span className="text-xs text-slate-400">
              Gestión Integral del Club
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">
            Panel de Control y Métricas Ejecutivas
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Supervisión en tiempo real de membresías, eventos, aforos e interacciones de la comunidad.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            id="btn-admin-scan-qr"
            onClick={() => setActiveView('checkin')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-xs shadow-md transition"
          >
            <QrCode className="w-4 h-4" />
            <span>Escanear QR de Eventos</span>
          </button>
          <button
            id="btn-admin-export-csv"
            onClick={handleExportData}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#0c1630] hover:bg-[#13234b] border border-[#1f376d] text-slate-200 text-xs font-semibold transition"
          >
            <Download className="w-4 h-4 text-red-400" />
            <span>Exportar CSV</span>
          </button>
        </div>
      </div>

      {exportNotice && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Datos de empresas exportados con éxito a formato CSV.</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        
        {/* Total Empresas */}
        <div 
          onClick={() => setActiveView('directory')}
          className="p-4 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] hover:border-red-500/40 transition cursor-pointer space-y-2 shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Empresas</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalCompanies}</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center">
              +3 este mes <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">Empresas socias y registradas</p>
        </div>

        {/* Miembros / Usuarios */}
        <div 
          onClick={() => setActiveView('admin')}
          className="p-4 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] hover:border-red-500/40 transition cursor-pointer space-y-2 shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Total Miembros</span>
            <div className="w-8 h-8 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalMembers}</span>
            <span className="text-[11px] font-bold text-emerald-400 flex items-center">
              {activeMembersPct}% activos
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">Representantes y directivos</p>
        </div>

        {/* Eventos & Inscripciones */}
        <div 
          onClick={() => setActiveView('events')}
          className="p-4 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] hover:border-red-500/40 transition cursor-pointer space-y-2 shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Inscripciones</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{totalRegistrations}</span>
            <span className="text-[11px] font-bold text-red-400 flex items-center">
              {upcomingEvents.length} prox. eventos
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">Tasa asistencia {attendanceRate}%</p>
        </div>

        {/* Patrocinadores VIP */}
        <div 
          onClick={() => setActiveView('directory')}
          className="p-4 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] hover:border-red-500/40 transition cursor-pointer space-y-2 shadow-md"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Patrocinadores</span>
            <div className="w-8 h-8 rounded-lg bg-red-600/20 text-red-400 flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">{activeSponsors}</span>
            <span className="text-[11px] font-bold text-red-400 flex items-center">
              Gold & Silver
            </span>
          </div>
          <p className="text-[11px] text-slate-400 truncate">Visibilidad destacada activa</p>
        </div>

      </div>

      {/* Grid: Events Management & Attendance QR Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Gestión de Eventos & Control de Asistencias */}
        <div className="lg:col-span-2 p-5 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-white">
                Eventos Activos & Control de Aforo
              </h3>
            </div>
            <button
              onClick={() => setActiveView('events')}
              className="text-xs font-semibold text-red-400 hover:text-red-300"
            >
              Gestionar todos
            </button>
          </div>

          <div className="space-y-3">
            {events.map(event => {
              const eventRegs = registrations.filter(r => r.eventId === event.id);
              const checkedIn = eventRegs.filter(r => r.status === 'Asistente').length;
              const pct = Math.min(100, Math.round((eventRegs.length / event.capacity) * 100));

              return (
                <div 
                  key={event.id}
                  className="p-4 rounded-xl bg-[#070e20] border border-[#1d346b] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0a1329] text-red-300 border border-[#1f376d]">
                        {event.type}
                      </span>
                      <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                        event.status === 'INSCRIPCIONES ABIERTAS'
                          ? 'bg-emerald-500/20 text-emerald-300'
                          : event.status === 'COMPLETO'
                          ? 'bg-red-600/20 text-red-300 border border-red-500/40'
                          : 'bg-[#12234e] text-slate-300'
                      }`}>
                        {event.status}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white truncate">{event.title}</h4>
                    <p className="text-xs text-slate-400">{event.date} • {event.time} • {event.location}</p>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="text-right">
                      <p className="text-xs font-bold text-white">
                        {eventRegs.length} / {event.capacity} <span className="text-slate-400 font-normal">inscritos</span>
                      </p>
                      <div className="w-24 h-1.5 bg-[#0a1329] rounded-full mt-1 overflow-hidden">
                        <div 
                          className="h-full bg-red-600 rounded-full" 
                          style={{ width: `${pct}%` }} 
                        />
                      </div>
                      <p className="text-[10px] text-emerald-400 mt-0.5">
                        {checkedIn} asistentes validados
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedEventId(event.id);
                        setActiveView('checkin');
                      }}
                      className="p-2 rounded-xl bg-[#0c1630] hover:bg-[#13234b] text-red-400 border border-[#1f376d] transition"
                      title="Abrir Check-in QR de este evento"
                    >
                      <QrCode className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Nuevas Altas & Solicitudes */}
        <div className="p-5 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] space-y-4 shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-white">
                Nuevas Empresas del Club
              </h3>
            </div>
            <button
              onClick={() => setActiveView('directory')}
              className="text-xs font-semibold text-red-400 hover:text-red-300"
            >
              Directorio
            </button>
          </div>

          <div className="space-y-3">
            {companies.slice(0, 4).map(comp => (
              <div 
                key={comp.id}
                className="p-3 rounded-xl bg-[#070e20] border border-[#1d346b] flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <img src={comp.logo} alt={comp.name} className="w-9 h-9 rounded-lg object-cover ring-1 ring-[#1f376d] shrink-0" />
                  <div className="min-w-0">
                    <h5 className="text-xs font-bold text-white truncate">{comp.name}</h5>
                    <p className="text-[11px] text-slate-400 truncate">{comp.sector}</p>
                    <span className="text-[9px] text-slate-500 font-mono">Alta: {comp.joinedAt}</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#0a1329] text-slate-300 border border-[#1f376d] shrink-0">
                  {comp.tier.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-[#182a52]">
            <button
              onClick={() => setActiveView('admin')}
              className="w-full py-2 px-3 rounded-xl bg-[#0c1630] hover:bg-[#13234b] text-slate-200 text-xs font-semibold transition"
            >
              Gestionar Permisos & Miembros
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
