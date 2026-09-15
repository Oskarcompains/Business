import React from 'react';
import { 
  Building2, 
  CalendarDays, 
  Users2, 
  QrCode
} from 'lucide-react';
import { useApp, ActiveView } from '../../context/AppContext';

export const MobileNav: React.FC = () => {
  const { activeView, setActiveView, currentUser } = useApp();

  const isAdmin = currentUser.role === 'SUPERADMIN' || currentUser.role === 'ADMIN';

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    {
      id: 'companies',
      label: 'Empresas',
      icon: <Building2 className="w-5 h-5" />
    },
    {
      id: 'events',
      label: 'Eventos',
      icon: <CalendarDays className="w-5 h-5" />
    },
    {
      id: 'users',
      label: 'Usuarios',
      icon: <Users2 className="w-5 h-5" />
    },
    ...(isAdmin ? [{
      id: 'checkin' as ActiveView,
      label: 'Acceso QR',
      icon: <QrCode className="w-5 h-5 text-red-400" />
    }] : [])
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0a1329]/95 backdrop-blur-md border-t border-[#1b3164] px-2 py-1">
      <div className="flex items-center justify-around">
        {navItems.map((item) => {
          const isActive = 
            activeView === item.id || 
            (item.id === 'companies' && activeView === 'directory');
            
          return (
            <button
              key={item.id}
              id={`mob-nav-${item.id}`}
              onClick={() => setActiveView(item.id)}
              className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition cursor-pointer ${
                isActive
                  ? 'text-red-400 font-bold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="relative">
                {item.icon}
              </div>
              <span className="text-[10px] mt-0.5 tracking-tight">
                {item.label}
              </span>
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
