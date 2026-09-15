import React, { useState } from 'react';
import { 
  X, 
  Building2, 
  MapPin, 
  Globe, 
  Linkedin, 
  Mail, 
  Phone, 
  Calendar, 
  CheckCircle2, 
  MessageSquare, 
  UserPlus, 
  Briefcase, 
  Award, 
  Users, 
  Sparkles,
  Edit3
} from 'lucide-react';
import { Company, User } from '../../types';
import { useApp } from '../../context/AppContext';

interface CompanyDetailModalProps {
  company: Company | null;
  onClose: () => void;
  onEdit?: (company: Company) => void;
}

export const CompanyDetailModal: React.FC<CompanyDetailModalProps> = ({
  company,
  onClose,
  onEdit
}) => {
  const { 
    currentUser, 
    startCompanyChat, 
    startDirectChatWithUser, 
    opportunities, 
    events, 
    users 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'info' | 'services' | 'team' | 'opportunities'>('info');
  const [connected, setConnected] = useState(false);

  if (!company) return null;

  const isAdmin = currentUser.role === 'SUPERADMIN' || currentUser.role === 'ADMIN';

  // Opportunities by this company
  const companyOpps = opportunities.filter(o => o.companyId === company.id);

  // Associated club users
  const associatedUsers = users.filter(u => u.companyId === company.id);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 overflow-y-auto animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl rounded-3xl bg-[#0a1329] border border-[#1b3164] shadow-2xl overflow-hidden my-8 relative text-slate-100 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-[#070e20]/80 hover:bg-[#12234e] text-slate-300 hover:text-white transition backdrop-blur-md"
          aria-label="Cerrar modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Cover Header */}
        <div className="relative h-40 sm:h-48 bg-gradient-to-r from-[#070e20] via-[#0a1329] to-[#12234e] shrink-0 overflow-hidden">
          {company.coverImage && (
            <img 
              src={company.coverImage} 
              alt={company.name} 
              className="w-full h-full object-cover opacity-50" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1329] via-transparent to-black/30" />
          
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#070e20]/90 text-red-300 border border-red-500/40 backdrop-blur-md">
              {company.tier.replace('_', ' ')}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-medium bg-[#070e20]/80 text-slate-300 backdrop-blur-md">
              Socio desde {company.joinedAt}
            </span>
          </div>
        </div>

        {/* Header Profile Info */}
        <div className="px-6 pt-0 pb-4 border-b border-[#182a52] shrink-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 mb-3 relative z-10">
            <div className="flex items-end gap-4">
              <img 
                src={company.logo} 
                alt={company.name} 
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover ring-4 ring-[#0a1329] bg-[#070e20] shadow-2xl shrink-0" 
              />
              <div className="min-w-0 pb-1">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                  {company.name}
                </h2>
                <p className="text-xs sm:text-sm font-semibold text-red-400">
                  {company.sector}
                </p>
                <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-500" />
                  <span>{company.location}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isAdmin && onEdit && (
                <button
                  onClick={() => onEdit(company)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#12234e] hover:bg-[#1a3372] text-slate-200 text-xs font-semibold transition"
                >
                  <Edit3 className="w-3.5 h-3.5 text-red-400" />
                  <span>Editar</span>
                </button>
              )}
              <button
                onClick={() => {
                  startCompanyChat(company);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#12234e] hover:bg-[#1a3372] text-white text-xs font-bold transition"
              >
                <MessageSquare className="w-3.5 h-3.5 text-red-400" />
                <span>Contactar B2B</span>
              </button>
              <button
                onClick={() => setConnected(!connected)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow ${
                  connected
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white'
                }`}
              >
                {connected ? <CheckCircle2 className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                <span>{connected ? 'Conectado' : 'Conectar'}</span>
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pt-2">
            <button
              onClick={() => setActiveTab('info')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'info' 
                  ? 'bg-red-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ficha & Necesidades
            </button>
            <button
              onClick={() => setActiveTab('services')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'services' 
                  ? 'bg-red-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Servicios ({company.services?.length || 0})
            </button>
            <button
              onClick={() => setActiveTab('team')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'team' 
                  ? 'bg-red-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Personas de Contacto ({company.contactPersons?.length || 1})
            </button>
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition shrink-0 ${
                activeTab === 'opportunities' 
                  ? 'bg-red-600 text-white shadow' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Oportunidades ({companyOpps.length})
            </button>
          </div>
        </div>

        {/* Tab Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm flex-1">
          {activeTab === 'info' && (
            <div className="space-y-6">
              {/* Description */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Acerca de la Compañía
                </h4>
                <p className="text-slate-200 leading-relaxed">
                  {company.description}
                </p>
              </div>

              {/* What they offer & What they seek */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-[#070e20] border border-[#1b3164] space-y-2">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                    <Sparkles className="w-4 h-4" />
                    <span>¿QUÉ OFRECE AL CLUB?</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {company.offers?.map((offer, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-emerald-400 font-bold">•</span>
                        <span>{offer}</span>
                      </li>
                    )) || <li>Ventajas exclusivas para socios.</li>}
                  </ul>
                </div>

                <div className="p-4 rounded-2xl bg-[#070e20] border border-[#1b3164] space-y-2">
                  <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
                    <Briefcase className="w-4 h-4" />
                    <span>¿QUÉ BUSCA / NECESIDADES?</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {company.seeking?.map((seek, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-sky-400 font-bold">•</span>
                        <span>{seek}</span>
                      </li>
                    )) || <li>Nuevas oportunidades comerciales.</li>}
                  </ul>
                </div>
              </div>

              {/* Company Details Metadata */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-[#070e20]/60 border border-[#1b3164] text-xs">
                <div>
                  <span className="text-slate-500 block">Empleados</span>
                  <span className="font-bold text-white">{company.employeesCount || 25}+ personas</span>
                </div>
                <div>
                  <span className="text-slate-500 block">CIF / ID Fiscal</span>
                  <span className="font-bold text-white">{company.cif || 'Confidencial'}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Eventos Asistidos</span>
                  <span className="font-bold text-red-400">{company.eventsAttendedCount} asistencias</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Sitio Web</span>
                  <a href={company.website} target="_blank" rel="noreferrer" className="font-bold text-sky-400 hover:underline truncate block">
                    Visitar Web
                  </a>
                </div>
              </div>

              {/* Tags */}
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Especialidades & Tags
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {company.tags.map((tag, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-[#12234e] text-slate-300 border border-[#1b3164]">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'services' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Catálogo de Servicios y Soluciones
              </h4>
              <div className="space-y-2.5">
                {company.services.map((svc, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#070e20] border border-[#1b3164] flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-red-600/20 text-red-400 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <span className="text-slate-200 text-sm font-medium">{svc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'team' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Personas de Contacto & Representantes
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {company.contactPersons?.map((cp, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-[#070e20] border border-[#1b3164] flex items-start gap-3.5">
                    <img src={cp.avatar} alt={cp.name} className="w-12 h-12 rounded-xl object-cover ring-1 ring-[#1b3164] shrink-0" />
                    <div className="min-w-0 flex-1 space-y-1">
                      <h5 className="font-bold text-white text-sm truncate">{cp.name}</h5>
                      <p className="text-xs text-red-400 truncate">{cp.role}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                        <Mail className="w-3 h-3 text-slate-500 shrink-0" />
                        <span className="truncate">{cp.email}</span>
                      </p>
                      {cp.phone && (
                        <p className="text-xs text-slate-400 flex items-center gap-1.5 truncate">
                          <Phone className="w-3 h-3 text-slate-500 shrink-0" />
                          <span>{cp.phone}</span>
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'opportunities' && (
            <div className="space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Oportunidades Comerciales Publicadas ({companyOpps.length})
              </h4>
              {companyOpps.length === 0 ? (
                <p className="text-xs text-slate-400 py-6 text-center">Esta empresa no tiene oportunidades abiertas actualmente.</p>
              ) : (
                companyOpps.map(opp => (
                  <div key={opp.id} className="p-4 rounded-xl bg-[#070e20] border border-[#1b3164] space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-600/20 text-red-300">
                        {opp.type}
                      </span>
                      <span className="text-xs text-slate-400">{opp.createdAt}</span>
                    </div>
                    <h5 className="font-bold text-white text-sm">{opp.title}</h5>
                    <p className="text-xs text-slate-300">{opp.description}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
