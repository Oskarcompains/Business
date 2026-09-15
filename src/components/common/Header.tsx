import React, { useState } from 'react';
import { 
  Bell, 
  ChevronDown, 
  ShieldCheck, 
  Building2, 
  Crown, 
  UserCheck, 
  Sparkles, 
  RotateCcw,
  Check,
  Award,
  LogOut
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from './PWAInstallButton';
import { UserRole } from '../../types';

export const Header: React.FC = () => {
  const { 
    currentUser, 
    users, 
    switchUserById, 
    notifications, 
    unreadNotificationsCount, 
    markNotificationAsRead, 
    markAllNotificationsAsRead,
    setActiveView,
    resetToInitialDemo,
    logout
  } = useApp();

  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const getRoleBadge = (role: UserRole) => {
    switch (role) {
      case 'SUPERADMIN':
        return {
          bg: 'bg-red-600/25 text-red-300 border-red-500/40',
          icon: <ShieldCheck className="w-3.5 h-3.5 text-red-400" />,
          label: 'Superadmin'
        };
      case 'ADMIN':
        return {
          bg: 'bg-red-500/20 text-red-200 border-red-500/30',
          icon: <Crown className="w-3.5 h-3.5 text-red-400" />,
          label: 'Gestor del Club'
        };
      case 'PATROCINADOR':
        return {
          bg: 'bg-red-600/30 text-red-200 border-red-500/40',
          icon: <Award className="w-3.5 h-3.5 text-red-400" />,
          label: 'Patrocinador'
        };
      case 'EMPRESA':
        return {
          bg: 'bg-blue-600/25 text-blue-300 border-blue-500/40',
          icon: <Building2 className="w-3.5 h-3.5 text-blue-400" />,
          label: 'Socio Empresa'
        };
      case 'REPRESENTANTE':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          icon: <UserCheck className="w-3.5 h-3.5 text-emerald-400" />,
          label: 'Representante'
        };
      case 'INVITADO':
      default:
        return {
          bg: 'bg-slate-700/50 text-slate-300 border-slate-600',
          icon: <Sparkles className="w-3.5 h-3.5 text-slate-400" />,
          label: 'Invitado'
        };
    }
  };

  const roleInfo = getRoleBadge(currentUser.role);

  return (
    <header className="sticky top-0 z-40 bg-[#0a1329]/95 backdrop-blur-md border-b border-[#1b3164]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 sm:gap-4">
          
          {/* Logo & Platform Name */}
          <div 
            id="brand-logo-btn"
            onClick={() => setActiveView('companies')}
            className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-red-700 via-red-600 to-red-500 p-0.5 shadow-lg shadow-red-900/30 group-hover:scale-105 transition">
              <div className="w-full h-full bg-[#070d1e] rounded-[10px] flex items-center justify-center">
                <Crown className="w-5 h-5 text-red-500" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-white text-base sm:text-lg">
                  Club<span className="text-red-500">Rojillo</span>
                </span>
                <span className="text-[10px] font-black px-1.5 py-0.2 rounded bg-red-600/20 text-red-300 border border-red-500/40 hidden xs:inline-block">
                  B2B
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block -mt-0.5">
                Club de Empresas • Red Privada
              </p>
            </div>
          </div>

          {/* Center / Right controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* PWA Install Button */}
            <PWAInstallButton className="hidden sm:flex" />

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                id="btn-notifications-toggle"
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowRoleSwitcher(false);
                }}
                className="relative p-2 rounded-xl text-slate-300 hover:text-white hover:bg-[#122044] transition"
                aria-label="Ver notificaciones"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationsCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-black rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotificationsCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div 
                  className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#0c1630] border border-[#1e366b] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#182a52] mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-4 h-4 text-red-400" />
                      <h4 className="font-semibold text-sm text-white">Notificaciones Privadas</h4>
                    </div>
                    {unreadNotificationsCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs text-red-400 hover:text-red-300"
                      >
                        Marcar todas leídas
                      </button>
                    )}
                  </div>

                  <div className="max-h-72 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-6">No tienes notificaciones pendientes</p>
                    ) : (
                      notifications.map(notif => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            markNotificationAsRead(notif.id);
                            if (notif.linkTo) setActiveView(notif.linkTo as any);
                            setShowNotifications(false);
                          }}
                          className={`p-2.5 rounded-xl transition cursor-pointer text-xs ${
                            notif.read 
                              ? 'bg-[#070e20]/60 text-slate-400 hover:bg-[#122044]' 
                              : 'bg-[#101e40] text-slate-200 border-l-2 border-red-500 hover:bg-[#162752]'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 mb-1">
                            <span className="font-semibold text-white">{notif.title}</span>
                            <span className="text-[10px] text-slate-400">{notif.time}</span>
                          </div>
                          <p className="line-clamp-2 text-slate-300">{notif.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Role & User Switcher Pill */}
            <div className="relative">
              <button
                id="btn-user-role-switcher"
                onClick={() => {
                  setShowRoleSwitcher(!showRoleSwitcher);
                  setShowNotifications(false);
                }}
                className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl bg-[#0e1b38] hover:bg-[#14264e] border border-[#1d3568] transition text-left"
              >
                <img 
                  src={currentUser.avatar} 
                  alt={currentUser.name} 
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover ring-1 ring-red-500/40"
                />
                <div className="hidden sm:block">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-white max-w-[130px] truncate">
                      {currentUser.name}
                    </span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md border flex items-center gap-1 ${roleInfo.bg}`}>
                      {roleInfo.icon}
                      {roleInfo.label}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                    {currentUser.companyName}
                  </p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
              </button>

              {/* User Dropdown Menu */}
              {showRoleSwitcher && (
                <div 
                  className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-[#0c1630] border border-[#1e366b] shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-[#182a52]">
                    <img 
                      src={currentUser.avatar} 
                      alt={currentUser.name} 
                      className="w-11 h-11 rounded-xl object-cover ring-1 ring-red-500/40 shrink-0" 
                    />
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
                      <p className="text-xs text-slate-400 truncate">{currentUser.companyName}</p>
                      <p className="text-[11px] text-slate-400 font-mono truncate">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="py-2.5 space-y-1">
                    <div className="flex items-center justify-between text-xs py-1 px-1">
                      <span className="text-slate-400">Rol del Club:</span>
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded border ${roleInfo.bg}`}>
                        {roleInfo.icon}
                        {roleInfo.label}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveView('users');
                        setShowRoleSwitcher(false);
                      }}
                      className="w-full mt-2 flex items-center justify-between p-2 rounded-xl bg-[#070e20] hover:bg-[#122248] border border-[#1d3568] text-xs text-slate-200 font-semibold transition"
                    >
                      <span>Censo y Gestión de Usuarios</span>
                      <span className="text-red-400 text-[11px]">Ver →</span>
                    </button>
                  </div>

                  {/* Actions Footer: Logout */}
                  <div className="pt-3 mt-1 border-t border-[#182a52] flex items-center justify-end">
                    <button
                      id="btn-header-logout"
                      onClick={() => {
                        setShowRoleSwitcher(false);
                        logout();
                      }}
                      className="w-full flex items-center justify-center gap-2 text-xs font-bold text-red-300 hover:text-white bg-red-600/20 hover:bg-red-600/30 px-3 py-2 rounded-xl border border-red-500/40 transition cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

          </div>

        </div>
      </div>
    </header>
  );
};
