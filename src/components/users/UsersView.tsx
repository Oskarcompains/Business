import React, { useState, useMemo } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  ShieldCheck, 
  Building2, 
  Mail, 
  Phone, 
  Linkedin, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  X,
  Award,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { User, UserRole } from '../../types';

export const UsersView: React.FC = () => {
  const { 
    currentUser, 
    users, 
    companies, 
    addUser, 
    updateUser, 
    deleteUser,
    membershipApplications,
    approveMembershipApplication,
    setActiveView,
    setSelectedCompanyId
  } = useApp();

  const isAdmin = currentUser.role === 'SUPERADMIN' || currentUser.role === 'ADMIN';

  // Tabs: 'users' | 'applications'
  const [activeTab, setActiveTab] = useState<'users' | 'applications'>('users');

  // Search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');
  const [selectedCompanyId, setFilterCompanyId] = useState<string>('ALL');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [detailUser, setDetailUser] = useState<User | null>(null);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // New User Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState('');
  const [companyId, setCompanyId] = useState(companies[0]?.id || '');
  const [role, setRole] = useState<UserRole>('EMPRESA');
  const [phone, setPhone] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [avatar, setAvatar] = useState('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256');

  // Pending applications count
  const pendingApps = membershipApplications.filter(a => a.status === 'PENDIENTE');

  // Reset form when modal opens
  const openCreateModal = () => {
    setName('');
    setEmail('');
    setPosition('Director / Responsable');
    setCompanyId(companies[0]?.id || '');
    setRole('EMPRESA');
    setPhone('');
    setLinkedin('');
    setAvatar('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256');
    setIsCreateModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setName(user.name);
    setEmail(user.email);
    setPosition(user.position);
    setCompanyId(user.companyId);
    setRole(user.role);
    setPhone(user.phone || '');
    setLinkedin(user.linkedin || '');
    setAvatar(user.avatar);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const company = companies.find(c => c.id === companyId);
    addUser({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      position: position.trim() || 'Directivo',
      role,
      companyId,
      companyName: company?.name || 'Club de Empresas',
      phone: phone.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      avatar: avatar.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
      isOnline: true
    });

    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !name.trim() || !email.trim()) return;

    const company = companies.find(c => c.id === companyId);
    updateUser(editingUser.id, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      position: position.trim(),
      role,
      companyId,
      companyName: company?.name || editingUser.companyName,
      phone: phone.trim() || undefined,
      linkedin: linkedin.trim() || undefined,
      avatar: avatar.trim() || editingUser.avatar
    });

    setEditingUser(null);
  };

  const handleDeleteConfirm = () => {
    if (!userToDelete) return;
    if (userToDelete.id === currentUser.id) {
      alert('No puedes eliminar tu propia cuenta activa de administrador.');
      setUserToDelete(null);
      return;
    }
    deleteUser(userToDelete.id);
    setUserToDelete(null);
  };

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        !term ||
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term) ||
        user.position.toLowerCase().includes(term) ||
        user.companyName.toLowerCase().includes(term);

      const matchesRole = selectedRole === 'ALL' || user.role === selectedRole;
      const matchesCompany = selectedCompanyId === 'ALL' || user.companyId === selectedCompanyId;

      return matchesSearch && matchesRole && matchesCompany;
    });
  }, [users, searchTerm, selectedRole, selectedCompanyId]);

  const getRoleBadge = (userRole: UserRole) => {
    switch (userRole) {
      case 'SUPERADMIN':
        return { label: 'Superadmin', bg: 'bg-red-600/20 text-red-300 border-red-500/40' };
      case 'ADMIN':
        return { label: 'Gestor Club', bg: 'bg-red-600/15 text-red-200 border-red-500/30' };
      case 'PATROCINADOR':
        return { label: 'Patrocinador', bg: 'bg-amber-600/20 text-amber-300 border-amber-500/40' };
      case 'EMPRESA':
        return { label: 'Empresa Socia', bg: 'bg-blue-600/20 text-blue-300 border-blue-500/40' };
      case 'REPRESENTANTE':
        return { label: 'Representante', bg: 'bg-emerald-600/20 text-emerald-300 border-emerald-500/40' };
      default:
        return { label: 'Socio', bg: 'bg-slate-700/50 text-slate-300 border-slate-600' };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Gestión de Usuarios y Socios
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Control del censo oficial de directivos, representantes de empresas y administradores del Club.
          </p>
        </div>

        {isAdmin && (
          <button
            id="btn-add-user"
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-xs sm:text-sm shadow-md transition shrink-0 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Nuevo Usuario</span>
          </button>
        )}
      </div>

      {/* Stats Counter Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] shadow-sm">
          <p className="text-xs text-slate-400 font-medium">Total Usuarios</p>
          <p className="text-2xl font-black text-white mt-1">{users.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Socios acreditados</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] shadow-sm">
          <p className="text-xs text-slate-400 font-medium">Administradores</p>
          <p className="text-2xl font-black text-red-500 mt-1">
            {users.filter(u => u.role === 'SUPERADMIN' || u.role === 'ADMIN').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Gestión y control</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] shadow-sm">
          <p className="text-xs text-slate-400 font-medium">Directivos de Empresa</p>
          <p className="text-2xl font-black text-blue-400 mt-1">
            {users.filter(u => u.role === 'EMPRESA' || u.role === 'REPRESENTANTE').length}
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Representantes B2B</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] shadow-sm">
          <p className="text-xs text-slate-400 font-medium">Solicitudes Pendientes</p>
          <p className="text-2xl font-black text-amber-400 mt-1">{pendingApps.length}</p>
          <p className="text-[11px] text-slate-500 mt-0.5">Por aprobar</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#182a52] pb-1">
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'users'
              ? 'bg-red-600/20 text-white border border-red-500/40'
              : 'text-slate-400 hover:text-white hover:bg-[#0c1630]'
          }`}
        >
          <Users className="w-4 h-4 text-red-400" />
          <span>Censo de Usuarios ({users.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('applications')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
            activeTab === 'applications'
              ? 'bg-red-600/20 text-white border border-red-500/40'
              : 'text-slate-400 hover:text-white hover:bg-[#0c1630]'
          }`}
        >
          <Clock className="w-4 h-4 text-amber-400" />
          <span>Solicitudes de Adhesión</span>
          {pendingApps.length > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-black">
              {pendingApps.length}
            </span>
          )}
        </button>
      </div>

      {activeTab === 'users' ? (
        <>
          {/* Search & Filter Toolbar */}
          <div className="p-4 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] space-y-3 shadow-md">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              {/* Search bar */}
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar por nombre, cargo, empresa o email..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] focus:border-red-500 text-sm text-white placeholder:text-slate-500 transition outline-none"
                />
              </div>

              {/* Role filter */}
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-slate-200 text-xs font-semibold outline-none focus:border-red-500"
                >
                  <option value="ALL">Todos los roles</option>
                  <option value="SUPERADMIN">Superadmin</option>
                  <option value="ADMIN">Gestor Club</option>
                  <option value="EMPRESA">Empresa Socia</option>
                  <option value="PATROCINADOR">Patrocinador</option>
                  <option value="REPRESENTANTE">Representante</option>
                </select>

                {/* Company filter */}
                <select
                  value={selectedCompanyId}
                  onChange={(e) => setFilterCompanyId(e.target.value)}
                  className="w-full sm:w-auto px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-slate-200 text-xs font-semibold outline-none focus:border-red-500 max-w-[200px] truncate"
                >
                  <option value="ALL">Todas las empresas</option>
                  {companies.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Users List / Table */}
          {filteredUsers.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0a1329] border border-[#1b3164] space-y-3">
              <Users className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-base font-bold text-white">No se encontraron usuarios</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Prueba con otro término de búsqueda o restablece los filtros de rol y empresa.
              </p>
            </div>
          ) : (
            <div className="bg-[#0a1329]/90 border border-[#1b3164] rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-[#182a52] bg-[#070e20]/80 text-slate-400 uppercase tracking-wider font-bold text-[11px]">
                      <th className="py-3.5 px-4">Usuario / Directivo</th>
                      <th className="py-3.5 px-4">Empresa</th>
                      <th className="py-3.5 px-4">Rol en el Club</th>
                      <th className="py-3.5 px-4 hidden md:table-cell">Contacto</th>
                      <th className="py-3.5 px-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#15254a]">
                    {filteredUsers.map((user) => {
                      const badge = getRoleBadge(user.role);
                      const isCurrent = user.id === currentUser.id;

                      return (
                        <tr 
                          key={user.id}
                          className="hover:bg-[#0f1d3d]/50 transition group"
                        >
                          {/* User info */}
                          <td className="py-3.5 px-4">
                            <div className="flex items-center gap-3">
                              <img 
                                src={user.avatar} 
                                alt={user.name} 
                                className="w-10 h-10 rounded-xl object-cover ring-1 ring-red-500/30 shrink-0"
                              />
                              <div className="min-w-0">
                                <div className="flex items-center gap-1.5">
                                  <p className="font-bold text-white text-sm truncate">
                                    {user.name}
                                  </p>
                                  {isCurrent && (
                                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-red-600/30 text-red-200 border border-red-500/40">
                                      TÚ
                                    </span>
                                  )}
                                </div>
                                <p className="text-slate-400 text-xs truncate">{user.position}</p>
                                <p className="text-slate-500 text-[11px] truncate md:hidden">{user.email}</p>
                              </div>
                            </div>
                          </td>

                          {/* Company */}
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => {
                                setSelectedCompanyId(user.companyId);
                                setActiveView('companies');
                              }}
                              className="text-left group/comp"
                            >
                              <div className="flex items-center gap-1.5">
                                <Building2 className="w-3.5 h-3.5 text-slate-400 group-hover/comp:text-red-400 transition" />
                                <span className="font-semibold text-slate-200 group-hover/comp:text-white group-hover/comp:underline transition">
                                  {user.companyName}
                                </span>
                              </div>
                            </button>
                          </td>

                          {/* Role Badge */}
                          <td className="py-3.5 px-4">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-md border text-[10px] font-bold ${badge.bg}`}>
                              {badge.label}
                            </span>
                          </td>

                          {/* Contact Info */}
                          <td className="py-3.5 px-4 hidden md:table-cell text-slate-300">
                            <p className="text-xs font-mono">{user.email}</p>
                            {user.phone && <p className="text-[11px] text-slate-400 mt-0.5">{user.phone}</p>}
                          </td>

                          {/* Actions */}
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* View Profile */}
                              <button
                                onClick={() => setDetailUser(user)}
                                title="Ver Perfil Detallado"
                                className="p-2 rounded-lg bg-[#0e1c3a] hover:bg-[#162a56] border border-[#1d356b] text-slate-300 hover:text-white transition cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>

                              {/* Edit User (Admin only) */}
                              {isAdmin && (
                                <button
                                  onClick={() => openEditModal(user)}
                                  title="Editar Usuario"
                                  className="p-2 rounded-lg bg-[#0e1c3a] hover:bg-[#162a56] border border-[#1d356b] text-slate-300 hover:text-white transition cursor-pointer"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                              )}

                              {/* Delete User (Admin only, not self) */}
                              {isAdmin && !isCurrent && (
                                <button
                                  onClick={() => setUserToDelete(user)}
                                  title="Dar de baja usuario"
                                  className="p-2 rounded-lg bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-300 hover:text-red-100 transition cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* Applications Tab */
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#182a52]">
            <div>
              <h3 className="text-base font-bold text-white">Solicitudes de Adhesión al Club</h3>
              <p className="text-xs text-slate-400">
                Empresas y directivos que han remitido su solicitud oficial de membresía para validación.
              </p>
            </div>
          </div>

          {membershipApplications.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0a1329] border border-[#1b3164] space-y-2">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto" />
              <h4 className="text-base font-bold text-white">No hay solicitudes registradas</h4>
              <p className="text-xs text-slate-400">
                Las nuevas solicitudes remitidas desde el portal de acceso aparecerán aquí para revisión.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {membershipApplications.map((app) => (
                <div 
                  key={app.id}
                  className="p-5 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] shadow-md flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div>
                        <h4 className="font-black text-white text-base">{app.companyName}</h4>
                        <p className="text-xs text-slate-400">{app.sector}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${
                        app.status === 'PENDIENTE'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : app.status === 'APROBADA'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : 'bg-red-500/20 text-red-300 border-red-500/40'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-300 bg-[#070e20] p-3 rounded-xl border border-[#18284e] mb-3">
                      <p><strong>Solicitante:</strong> {app.contactName} ({app.contactRole})</p>
                      <p><strong>Email:</strong> {app.email}</p>
                      <p><strong>Teléfono:</strong> {app.phone}</p>
                      <p><strong>Categoría solicitada:</strong> {app.tierRequested}</p>
                      {app.cif && <p><strong>CIF:</strong> {app.cif}</p>}
                    </div>

                    <p className="text-xs text-slate-300 line-clamp-3 italic">
                      "{app.motivation}"
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-[#182a52] text-xs">
                    <span className="text-slate-400 text-[11px]">Fecha: {app.submittedAt}</span>
                    {app.status === 'PENDIENTE' && isAdmin && (
                      <button
                        onClick={() => approveMembershipApplication(app.id)}
                        className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aprobar y Dar de Alta</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Modal: Create User */}
      {isCreateModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setIsCreateModalOpen(false)}
        >
          <div 
            className="w-full max-w-lg bg-[#0b152d] border border-[#1d3568] rounded-3xl p-6 shadow-2xl space-y-4 my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#182a52]">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-black text-white">Alta de Nuevo Usuario</h3>
              </div>
              <button 
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Nombre Completo *
                </label>
                <input 
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="ej. Laura Sánchez Echeverría"
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input 
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ej. laura@empresa.com"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Cargo / Puesto *
                  </label>
                  <input 
                    type="text"
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    placeholder="ej. Directora de Operaciones"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Empresa Asociada *
                  </label>
                  <select
                    value={companyId}
                    onChange={e => setCompanyId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Rol en el Club *
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                  >
                    <option value="EMPRESA">Empresa Socia</option>
                    <option value="PATROCINADOR">Patrocinador Oficial</option>
                    <option value="REPRESENTANTE">Representante</option>
                    <option value="ADMIN">Gestor del Club</option>
                    <option value="SUPERADMIN">Superadministrador</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Teléfono Corporativo
                  </label>
                  <input 
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    placeholder="+34 600 000 000"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    LinkedIn (opcional)
                  </label>
                  <input 
                    type="url"
                    value={linkedin}
                    onChange={e => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/perfil"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#182a52] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Guardar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit User */}
      {editingUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto"
          onClick={() => setEditingUser(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#0b152d] border border-[#1d3568] rounded-3xl p-6 shadow-2xl space-y-4 my-8"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#182a52]">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-black text-white">Editar Usuario</h3>
              </div>
              <button 
                onClick={() => setEditingUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                  Nombre Completo *
                </label>
                <input 
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Correo Electrónico *
                  </label>
                  <input 
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Cargo / Puesto *
                  </label>
                  <input 
                    type="text"
                    value={position}
                    onChange={e => setPosition(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Empresa Asociada
                  </label>
                  <select
                    value={companyId}
                    onChange={e => setCompanyId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                  >
                    {companies.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Rol en el Club
                  </label>
                  <select
                    value={role}
                    onChange={e => setRole(e.target.value as UserRole)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                  >
                    <option value="EMPRESA">Empresa Socia</option>
                    <option value="PATROCINADOR">Patrocinador Oficial</option>
                    <option value="REPRESENTANTE">Representante</option>
                    <option value="ADMIN">Gestor del Club</option>
                    <option value="SUPERADMIN">Superadministrador</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    Teléfono Corporativo
                  </label>
                  <input 
                    type="text"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-slate-300 mb-1">
                    LinkedIn (opcional)
                  </label>
                  <input 
                    type="url"
                    value={linkedin}
                    onChange={e => setLinkedin(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#182a52] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 text-white font-bold text-xs shadow-md transition cursor-pointer"
                >
                  Actualizar Usuario
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: View User Details */}
      {detailUser && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setDetailUser(null)}
        >
          <div 
            className="w-full max-w-md bg-[#0b152d] border border-[#1d3568] rounded-3xl p-6 shadow-2xl space-y-5"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-[#182a52]">
              <h3 className="text-base font-black text-white">Ficha de Usuario Oficial</h3>
              <button 
                onClick={() => setDetailUser(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <img 
                src={detailUser.avatar} 
                alt={detailUser.name} 
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-red-500/40 shrink-0"
              />
              <div className="min-w-0">
                <h4 className="text-lg font-black text-white truncate">{detailUser.name}</h4>
                <p className="text-xs text-slate-300">{detailUser.position}</p>
                <p className="text-xs text-red-400 font-semibold">{detailUser.companyName}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs bg-[#070e20] p-4 rounded-2xl border border-[#18284e]">
              <div className="flex items-center justify-between py-1 border-b border-[#132244]">
                <span className="text-slate-400">Rol Acreditado:</span>
                <span className={`px-2 py-0.5 rounded border text-[10px] font-bold ${getRoleBadge(detailUser.role).bg}`}>
                  {getRoleBadge(detailUser.role).label}
                </span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-[#132244]">
                <span className="text-slate-400">Correo Electrónico:</span>
                <span className="text-white font-mono">{detailUser.email}</span>
              </div>
              {detailUser.phone && (
                <div className="flex items-center justify-between py-1 border-b border-[#132244]">
                  <span className="text-slate-400">Teléfono:</span>
                  <span className="text-white">{detailUser.phone}</span>
                </div>
              )}
              {detailUser.linkedin && (
                <div className="flex items-center justify-between py-1 border-b border-[#132244]">
                  <span className="text-slate-400">LinkedIn:</span>
                  <a href={detailUser.linkedin} target="_blank" rel="noreferrer" className="text-red-400 hover:underline">
                    Ver perfil
                  </a>
                </div>
              )}
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">Fecha de Alta:</span>
                <span className="text-slate-300">{detailUser.joinedAt}</span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setSelectedCompanyId(detailUser.companyId);
                  setActiveView('companies');
                  setDetailUser(null);
                }}
                className="text-xs font-semibold text-red-400 hover:text-red-300 flex items-center gap-1.5"
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Ver ficha de {detailUser.companyName}</span>
              </button>

              <button
                onClick={() => setDetailUser(null)}
                className="px-4 py-2 rounded-xl bg-[#101f42] text-xs font-bold text-white hover:bg-[#162752]"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {userToDelete && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={() => setUserToDelete(null)}
        >
          <div 
            className="w-full max-w-md bg-[#0b152d] border border-red-800/60 rounded-3xl p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 text-red-400">
              <AlertCircle className="w-6 h-6 shrink-0" />
              <h3 className="text-lg font-black text-white">¿Dar de baja usuario?</h3>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              ¿Estás seguro de que deseas eliminar al usuario <strong className="text-white">{userToDelete.name}</strong> ({userToDelete.email}) de <strong className="text-white">{userToDelete.companyName}</strong>? Perderá acceso inmediato a la plataforma del Club.
            </p>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#182a52]">
              <button
                onClick={() => setUserToDelete(null)}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md transition cursor-pointer"
              >
                Sí, Eliminar Usuario
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
