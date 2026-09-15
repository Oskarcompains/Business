import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Award, 
  CheckCircle2, 
  XCircle, 
  UserPlus, 
  Clock, 
  Lock, 
  TrendingUp,
  Download,
  Search,
  Eye,
  Settings
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UserRole, User } from '../../types';

export const AdminManagementView: React.FC = () => {
  const { 
    currentUser, 
    users, 
    companies, 
    events, 
    registrations, 
    updateUserRole, 
    addUser 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'users' | 'requests' | 'sponsors' | 'audit'>('users');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // New user form state
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState<UserRole>('REPRESENTANTE');
  const [newUserCompanyId, setNewUserCompanyId] = useState(companies[0]?.id || '');
  const [newUserPosition, setNewUserPosition] = useState('Director Comercial');

  // Pending approval requests mock
  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 'req-1',
      companyName: 'Vanguard BioHealth S.L.',
      applicantName: 'Dra. Carmen Morales',
      email: 'carmen.morales@vanguardbio.com',
      sector: 'Biotecnología & Salud',
      date: '2025-05-18',
      status: 'PENDIENTE'
    },
    {
      id: 'req-2',
      companyName: 'Iberia Logística & Transporte',
      applicantName: 'Ignacio Vega',
      email: 'ivega@iberialog.es',
      sector: 'Industria & Logística',
      date: '2025-05-19',
      status: 'PENDIENTE'
    }
  ]);

  const handleApproveRequest = (id: string) => {
    setPendingRequests(prev => prev.filter(r => r.id !== id));
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;

    const comp = companies.find(c => c.id === newUserCompanyId);
    addUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      role: newUserRole,
      companyId: newUserCompanyId,
      companyName: comp?.name || 'Club de Empresas',
      position: newUserPosition.trim(),
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
    });

    setNewUserName('');
    setNewUserEmail('');
    setShowAddUserModal(false);
  };

  const filteredUsers = users.filter(u => {
    return !searchTerm || 
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const sponsors = companies.filter(c => c.tier.includes('PATROCINADOR'));

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <ShieldCheck className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Consola de Administración y Gobierno
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Control de usuarios, asignación de roles RBAC, aprobación de solicitudes y auditoría del club.
          </p>
        </div>

        <button
          onClick={() => setShowAddUserModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-xs sm:text-sm shadow-md transition shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>Añadir Usuario</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-[#0a1329] border border-[#1b3164] rounded-2xl overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${
            activeTab === 'users' 
              ? 'bg-red-600 text-white shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Gestión de Usuarios & Roles ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl font-bold flex items-center gap-2 transition shrink-0 ${
            activeTab === 'requests' 
              ? 'bg-red-600 text-white shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <span>Solicitudes de Alta</span>
          {pendingRequests.length > 0 && (
            <span className="w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center">
              {pendingRequests.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setActiveTab('sponsors')}
          className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${
            activeTab === 'sponsors' 
              ? 'bg-red-600 text-white shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Impacto de Patrocinadores ({sponsors.length})
        </button>
        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2 rounded-xl font-bold transition shrink-0 ${
            activeTab === 'audit' 
              ? 'bg-red-600 text-white shadow' 
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Auditoría & Logs
        </button>
      </div>

      {/* Tab: Users & Roles */}
      {activeTab === 'users' && (
        <div className="p-5 rounded-3xl bg-[#0a1329]/90 border border-[#1b3164] space-y-4 shadow-lg">
          <div className="flex items-center justify-between gap-3">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar usuario o empresa..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-xs text-white outline-none focus:border-red-500"
              />
            </div>
            <span className="text-xs text-slate-400">{filteredUsers.length} usuarios registrados</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#070e20]/60 text-slate-400 uppercase text-[10px] border-b border-[#1b3164]">
                <tr>
                  <th className="py-3 px-3">Usuario</th>
                  <th className="py-3 px-3">Empresa & Cargo</th>
                  <th className="py-3 px-3">Rol del Sistema</th>
                  <th className="py-3 px-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#182a52]">
                {filteredUsers.map(u => (
                  <tr key={u.id} className="hover:bg-[#101e3f] transition">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <img src={u.avatar} alt={u.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#1b3164]" />
                        <div>
                          <p className="font-bold text-white text-xs">{u.name}</p>
                          <p className="text-[11px] text-slate-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <p className="font-medium text-slate-200">{u.companyName}</p>
                      <p className="text-[11px] text-slate-400">{u.position}</p>
                    </td>
                    <td className="py-3 px-3">
                      <select
                        value={u.role}
                        onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold border outline-none cursor-pointer ${
                          u.role === 'SUPERADMIN' 
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                            : u.role === 'ADMIN'
                            ? 'bg-red-500/20 text-red-300 border-red-500/40'
                            : u.role === 'PATROCINADOR'
                            ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
                            : 'bg-[#12234e] text-slate-300 border-[#1b3164]'
                        }`}
                      >
                        <option value="SUPERADMIN">SUPERADMIN</option>
                        <option value="ADMIN">ADMIN</option>
                        <option value="EMPRESA">EMPRESA</option>
                        <option value="REPRESENTANTE">REPRESENTANTE</option>
                        <option value="PATROCINADOR">PATROCINADOR</option>
                        <option value="INVITADO">INVITADO</option>
                      </select>
                    </td>
                    <td className="py-3 px-3 text-right">
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        Activo ✓
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab: Requests */}
      {activeTab === 'requests' && (
        <div className="p-5 rounded-3xl bg-[#0a1329]/90 border border-[#1b3164] space-y-4 shadow-lg">
          <h3 className="text-sm font-bold text-white">Solicitudes de Incorporación Pendientes de Revisión</h3>
          {pendingRequests.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No hay solicitudes pendientes de validación.</p>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map(req => (
                <div key={req.id} className="p-4 rounded-2xl bg-[#070e20] border border-[#1b3164] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">{req.companyName}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-[#12234e] text-red-300 border border-[#1b3164]">{req.sector}</span>
                    </div>
                    <p className="text-xs text-slate-300">Solicitante: {req.applicantName} ({req.email})</p>
                    <p className="text-[10px] text-slate-500">Recibida el {req.date}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleApproveRequest(req.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow transition"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Aprobar Membresía</span>
                    </button>
                    <button
                      onClick={() => handleApproveRequest(req.id)}
                      className="p-1.5 rounded-xl bg-[#12234e] hover:bg-rose-950/40 text-slate-400 hover:text-rose-400 transition"
                      title="Rechazar solicitud"
                    >
                      <XCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Sponsors Metrics */}
      {activeTab === 'sponsors' && (
        <div className="p-5 rounded-3xl bg-[#0a1329]/90 border border-[#1b3164] space-y-4 shadow-lg">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-red-500" />
              Retorno de Inversión y Visibilidad de Patrocinadores
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sponsors.map(sp => (
              <div key={sp.id} className="p-4 rounded-2xl bg-[#070e20] border border-[#1b3164] space-y-3">
                <div className="flex items-center gap-3">
                  <img src={sp.logo} alt={sp.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-red-500/40" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{sp.name}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300 border border-red-500/30">
                      {sp.tier.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-2 border-t border-[#182a52] text-xs">
                  <div className="p-2 rounded-xl bg-[#0a1329]">
                    <span className="text-[10px] text-slate-400 block">Impresiones Banner</span>
                    <span className="font-extrabold text-white text-sm">4,820</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0a1329]">
                    <span className="text-[10px] text-slate-400 block">Visitas a Ficha</span>
                    <span className="font-extrabold text-red-400 text-sm">342</span>
                  </div>
                  <div className="p-2 rounded-xl bg-[#0a1329]">
                    <span className="text-[10px] text-slate-400 block">Leads Generados</span>
                    <span className="font-extrabold text-emerald-400 text-sm">28</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab: Audit Log */}
      {activeTab === 'audit' && (
        <div className="p-5 rounded-3xl bg-[#0a1329]/90 border border-[#1b3164] space-y-4 shadow-lg text-xs">
          <h3 className="text-sm font-bold text-white">Registro de Actividad y Seguridad</h3>
          <div className="space-y-2">
            <div className="p-3 rounded-xl bg-[#070e20] border border-[#182a52] flex items-center justify-between">
              <span className="text-slate-300">Acreditación QR validada: NET-2025-01 (Carlos Mendoza)</span>
              <span className="text-[10px] text-slate-500 font-mono">Hoy, 10:14 h</span>
            </div>
            <div className="p-3 rounded-xl bg-[#070e20] border border-[#182a52] flex items-center justify-between">
              <span className="text-slate-300">Nueva oportunidad comercial publicada en B2B por Elena Rivas</span>
              <span className="text-[10px] text-slate-500 font-mono">Ayer, 18:30 h</span>
            </div>
            <div className="p-3 rounded-xl bg-[#070e20] border border-[#182a52] flex items-center justify-between">
              <span className="text-slate-300">Cambio de Rol: Usuario Roberto Silva promovido a ADMIN</span>
              <span className="text-[10px] text-slate-500 font-mono">14 Mayo, 12:00 h</span>
            </div>
            <div className="p-3 rounded-xl bg-[#070e20] border border-[#182a52] flex items-center justify-between">
              <span className="text-slate-300">Alta de nueva empresa socia: FinNext Wealth Partners</span>
              <span className="text-[10px] text-slate-500 font-mono">10 Mayo, 09:15 h</span>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add User */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[#0a1329] border border-[#1b3164] shadow-2xl p-6 text-slate-100">
            <h3 className="text-base font-bold text-white mb-4">Añadir Usuario al Club</h3>
            <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">Nombre Completo *</label>
                <input 
                  type="text"
                  required
                  value={newUserName}
                  onChange={(e) => setNewUserName(e.target.value)}
                  placeholder="Ej. Laura Méndez"
                  className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Correo Electrónico *</label>
                <input 
                  type="email"
                  required
                  value={newUserEmail}
                  onChange={(e) => setNewUserEmail(e.target.value)}
                  placeholder="laura@empresa.com"
                  className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Empresa Asociada</label>
                <select
                  value={newUserCompanyId}
                  onChange={(e) => setNewUserCompanyId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white outline-none focus:border-red-500"
                >
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Cargo / Posición</label>
                <input 
                  type="text"
                  value={newUserPosition}
                  onChange={(e) => setNewUserPosition(e.target.value)}
                  placeholder="Ej. Directora de Expansión"
                  className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white outline-none focus:border-red-500"
                />
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">Rol Inicial</label>
                <select
                  value={newUserRole}
                  onChange={(e) => setNewUserRole(e.target.value as UserRole)}
                  className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white outline-none focus:border-red-500"
                >
                  <option value="REPRESENTANTE">REPRESENTANTE</option>
                  <option value="EMPRESA">EMPRESA</option>
                  <option value="PATROCINADOR">PATROCINADOR</option>
                  <option value="ADMIN">ADMIN</option>
                  <option value="SUPERADMIN">SUPERADMIN</option>
                  <option value="INVITADO">INVITADO</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#182a52]">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#12234e] hover:bg-[#1a3372] text-slate-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold shadow transition"
                >
                  Crear Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
