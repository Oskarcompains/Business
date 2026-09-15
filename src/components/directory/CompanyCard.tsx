import React from 'react';
import { 
  Building2, 
  MapPin, 
  Globe, 
  Linkedin, 
  MessageSquare, 
  UserPlus, 
  Calendar, 
  CheckCircle2, 
  Sparkles,
  Award
} from 'lucide-react';
import { Company, CompanyTier } from '../../types';

interface CompanyCardProps {
  company: Company;
  onViewDetails: (company: Company) => void;
  onContact: (company: Company) => void;
  onConnect: (company: Company) => void;
  isConnected?: boolean;
}

export const CompanyCard: React.FC<CompanyCardProps> = ({
  company,
  onViewDetails,
  onContact,
  onConnect,
  isConnected = false
}) => {
  const getTierBadge = (tier: CompanyTier) => {
    switch (tier) {
      case 'PATROCINADOR_GOLD':
        return {
          bg: 'bg-red-600/30 text-red-200 border-red-500/50',
          label: 'Patrocinador Gold',
          icon: <Award className="w-3 h-3 text-red-400" />
        };
      case 'PATROCINADOR_SILVER':
        return {
          bg: 'bg-slate-300/20 text-slate-200 border-slate-400/40',
          label: 'Patrocinador Silver',
          icon: <Award className="w-3 h-3 text-slate-300" />
        };
      case 'SOCIO_FUNDADOR':
        return {
          bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          label: 'Socio Fundador',
          icon: <Sparkles className="w-3 h-3 text-indigo-400" />
        };
      case 'SOCIO_PREMIUM':
        return {
          bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          label: 'Socio Premium',
          icon: <Sparkles className="w-3 h-3 text-sky-400" />
        };
      case 'SOCIO_ESTANDAR':
      default:
        return {
          bg: 'bg-slate-800 text-slate-300 border-slate-700',
          label: 'Socio Miembro',
          icon: null
        };
    }
  };

  const tierBadge = getTierBadge(company.tier);
  const primaryContact = company.contactPersons?.find(c => c.isPrimary) || company.contactPersons?.[0];

  return (
    <div 
      id={`company-card-${company.id}`}
      className="rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] hover:border-red-500/40 transition flex flex-col justify-between overflow-hidden shadow-lg group"
    >
      <div>
        {/* Cover image or colored header */}
        <div className="relative h-24 bg-gradient-to-r from-[#070e20] via-[#12234e] to-[#070e20] overflow-hidden">
          {company.coverImage && (
            <img 
              src={company.coverImage} 
              alt={company.name} 
              className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition duration-500" 
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a1329] to-transparent" />
          
          <div className="absolute top-2.5 right-2.5">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border backdrop-blur-md ${tierBadge.bg}`}>
              {tierBadge.icon}
              {tierBadge.label}
            </span>
          </div>
        </div>

        {/* Header content with avatar */}
        <div className="px-5 pt-0 pb-3 -mt-9 relative z-10">
          <div className="flex items-end justify-between mb-3">
            <img 
              src={company.logo} 
              alt={company.name} 
              className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#0a1329] bg-[#070e20] shadow-xl"
            />
            {company.website && (
              <a 
                href={company.website} 
                target="_blank" 
                rel="noreferrer"
                className="p-1.5 rounded-xl bg-[#0e1c3d] hover:bg-[#162a5c] text-slate-300 hover:text-white transition"
                title="Visitar sitio web"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <h3 
                onClick={() => onViewDetails(company)}
                className="text-base font-bold text-white hover:text-red-400 cursor-pointer transition line-clamp-1"
              >
                {company.name}
              </h3>
            </div>
            <p className="text-xs font-semibold text-red-400 truncate">
              {company.sector}
            </p>
            <p className="text-xs text-slate-400 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 shrink-0 text-slate-500" />
              <span className="truncate">{company.location}</span>
            </p>
          </div>

          <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed mt-2.5">
            {company.description}
          </p>

          {/* Qué ofrece & Qué busca preview */}
          <div className="mt-3 space-y-1.5 pt-2 border-t border-[#182a52] text-[11px]">
            {company.offers?.[0] && (
              <div className="flex items-start gap-1 text-slate-300">
                <span className="text-red-400 font-bold shrink-0">Ofrece:</span>
                <span className="line-clamp-1 text-slate-300">{company.offers[0]}</span>
              </div>
            )}
            {company.seeking?.[0] && (
              <div className="flex items-start gap-1 text-slate-300">
                <span className="text-blue-400 font-bold shrink-0">Busca:</span>
                <span className="line-clamp-1 text-slate-300">{company.seeking[0]}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mt-3">
            {company.tags.slice(0, 3).map((tag, idx) => (
              <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-[#070e20] text-slate-400 border border-[#1d346b]">
                #{tag}
              </span>
            ))}
            {company.tags.length > 3 && (
              <span className="text-[10px] text-slate-500 self-center">
                +{company.tags.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-5 py-3 bg-[#070e20]/90 border-t border-[#182a52] space-y-2.5">
        {/* Contact person snapshot */}
        {primaryContact && (
          <div className="flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2 min-w-0">
              <img src={primaryContact.avatar} alt={primaryContact.name} className="w-5 h-5 rounded-full object-cover shrink-0" />
              <span className="truncate">{primaryContact.name} ({primaryContact.role})</span>
            </div>
            <span className="text-[10px] text-slate-500 shrink-0 flex items-center gap-1">
              <Calendar className="w-3 h-3" /> {company.eventsAttendedCount} eventos
            </span>
          </div>
        )}

        <div className="flex items-center justify-between gap-2 pt-1">
          <button
            onClick={() => onViewDetails(company)}
            className="text-xs font-semibold text-slate-300 hover:text-white py-1.5"
          >
            Ficha Completa
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onContact(company)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0e1c3d] hover:bg-[#162a5c] text-slate-200 text-xs font-semibold transition"
              title="Iniciar chat privado"
            >
              <MessageSquare className="w-3.5 h-3.5 text-red-400" />
              <span>Contactar</span>
            </button>

            <button
              onClick={() => onConnect(company)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                isConnected
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white shadow-md'
              }`}
            >
              {isConnected ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Conectado</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Conectar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
