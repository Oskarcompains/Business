import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MemberDashboard } from './MemberDashboard';
import { AdminDashboard } from './AdminDashboard';
import { LayoutDashboard, ShieldCheck, Eye } from 'lucide-react';

export const DashboardView: React.FC = () => {
  const { currentUser } = useApp();
  const isAdmin = currentUser.role === 'SUPERADMIN' || currentUser.role === 'ADMIN';

  // If admin, they can toggle between Admin Mode and Member Mode
  const [adminMode, setAdminMode] = useState<boolean>(isAdmin);

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="flex items-center justify-between bg-[#0a1329]/80 p-2.5 px-4 rounded-2xl border border-[#1b3164] text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <ShieldCheck className="w-4 h-4 text-red-400" />
            <span>Perfil Administrador activo ({currentUser.role})</span>
          </div>
          <div className="flex items-center gap-1.5 bg-[#070e20] p-1 rounded-xl border border-[#1d346b]">
            <button
              onClick={() => setAdminMode(true)}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                adminMode 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Métricas Club
            </button>
            <button
              onClick={() => setAdminMode(false)}
              className={`px-3 py-1 rounded-lg font-semibold flex items-center gap-1 transition ${
                !adminMode 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Vista Miembro
            </button>
          </div>
        </div>
      )}

      {isAdmin && adminMode ? <AdminDashboard /> : <MemberDashboard />}
    </div>
  );
};
