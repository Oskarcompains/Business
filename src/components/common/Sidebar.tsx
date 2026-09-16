import React from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  CalendarDays, 
  Users2, 
  Briefcase, 
  MessageSquare, 
  QrCode,
  ShieldCheck, 
  Sparkles,
  Award,
  ExternalLink
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const { 
    activeView, 
    setActiveView, 
    unreadMessagesCount, 
    currentUser, 
    companies,
    setSelectedCompanyId
  } = useApp();

  const isAdmin = currentUser.role === 'SUPERADMIN' || currentUser.role === 'ADMIN';

  // Find gold sponsor for spotlight banner
  const goldSponsor = companies.find(c => c.tier === 'PATROCINADOR_GOLD') || companies[0];

  const menuItems: { id: ActiveView; label: string; icon: React.ReactNode; badge?: number; adminOnly?: boolean }[] = [
    {
      id: 'companies',
      label: 'Empresas y Directorio',
      icon: <Building2 className="w-4 h-4" />
    },
    {
      id: 'events',
      label: 'Eventos y Calendario',
      icon: <CalendarDays className="w-4 h-4" />
    },
    {
      id: 'users',
      label: 'Usuarios y Socios',
      icon: <Users2 className="w-4 h-4" />
    },
    {
      id: 'checkin',
      label: 'Control Asistencia QR',
      icon: <QrCode className="w-4 h-4 text-red-400" />,
      adminOnly: true
    }
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-[#0a1329]/80 border-r border-[#1b3164] shrink-0 p-4 space-y-6">
      
      {/* Navigation list */}
      <div className="space-y-1">
        <p className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Navegación Club
        </p>
        {menuItems.map((item) => {
          if (item.adminOnly && !isAdmin) return null;
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              onClick={() => setActiveView(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition group ${
                isActive
                  ? 'bg-red-600/20 text-white border border-red-500/40 font-semibold shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-[#122248]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`${isActive ? 'text-red-400' : 'text-slate-400 group-hover:text-red-400 transition'}`}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </div>
              {item.badge && item.badge > 0 ? (
                <span className="px-2 py-0.5 text-[10px] font-bold bg-red-600 text-white rounded-full">
                  {item.badge}
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {/* Gold Sponsor Spotlight Card */}
      {goldSponsor && (
        <div className="pt-2 border-t border-[#182a52]">
          <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#15244a] to-[#0c1630] border border-[#203a74] relative overflow-hidden">
            <div className="flex items-center justify-between gap-1 mb-2">
              <span className="flex items-center gap-1 text-[10px] font-extrabold uppercase tracking-wider text-red-200 bg-red-600/30 px-2 py-0.5 rounded-full border border-red-500/50">
                <Award className="w-3 h-3 text-red-400" /> Patrocinador Oficial
              </span>
            </div>

            <div className="flex items-center gap-2.5 my-2">
              <img 
                src={goldSponsor.logo} 
                alt={goldSponsor.name} 
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-red-500/50"
              />
              <div className="min-w-0">
                <h5 className="text-xs font-bold text-white truncate">{goldSponsor.name}</h5>
                <p className="text-[11px] text-slate-300 truncate">{goldSponsor.sector}</p>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed mb-3">
              {goldSponsor.description}
            </p>

            <button
              id="btn-sponsor-profile"
              onClick={() => {
                setSelectedCompanyId(goldSponsor.id);
                setActiveView('companies');
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 rounded-lg bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-300 text-xs font-semibold transition cursor-pointer"
            >
              <span>Ver Ficha Corporativa</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}

      {/* Quick Action Helper */}
      <div className="mt-auto pt-4 border-t border-[#182a52] text-[11px] text-slate-400 flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-slate-300">Ibarbaso Business Club</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> PWA Activa
          </span>
        </div>
        <p className="text-[10px] text-slate-400">
          C.D. Soto-Ibarbaso • Red empresarial verificada.
        </p>
      </div>

    </aside>
  );
};
