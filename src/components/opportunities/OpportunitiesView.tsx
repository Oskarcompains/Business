import React, { useState, useMemo } from 'react';
import { 
  Briefcase, 
  PlusCircle, 
  Search, 
  Filter, 
  Building2, 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Tag,
  ArrowRight,
  Check,
  Trash2
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Opportunity, OpportunityType } from '../../types';
import { CreateOpportunityModal } from './CreateOpportunityModal';

export const OpportunitiesView: React.FC = () => {
  const { 
    opportunities, 
    currentUser, 
    addOpportunity, 
    resolveOpportunity, 
    deleteOpportunity,
    startCompanyChat,
    startDirectChatWithUser,
    companies,
    users,
    setActiveView
  } = useApp();

  const [typeFilter, setTypeFilter] = useState<'ALL' | OpportunityType | 'MINE'>('ALL');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [showResolved, setShowResolved] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Filtered Opportunities
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      // Resolved filter
      if (!showResolved && opp.isResolved) return false;

      // Type filter
      if (typeFilter === 'MINE' && opp.authorId !== currentUser.id) return false;
      if (typeFilter !== 'ALL' && typeFilter !== 'MINE' && opp.type !== typeFilter) return false;

      // Sector filter
      if (selectedSector !== 'ALL' && opp.sector !== selectedSector) return false;

      // Search
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchTitle = opp.title.toLowerCase().includes(term);
        const matchDesc = opp.description.toLowerCase().includes(term);
        const matchComp = opp.companyName.toLowerCase().includes(term);
        const matchTags = opp.tags.some(t => t.toLowerCase().includes(term));
        if (!matchTitle && !matchDesc && !matchComp && !matchTags) return false;
      }

      return true;
    });
  }, [opportunities, typeFilter, selectedSector, searchTerm, showResolved, currentUser.id]);

  const handleInterest = (opp: Opportunity) => {
    const author = users.find(u => u.id === opp.authorId);
    if (author) {
      startDirectChatWithUser(author);
    } else {
      const comp = companies.find(c => c.id === opp.companyId);
      if (comp) startCompanyChat(comp);
    }
  };

  const getBadge = (type: OpportunityType) => {
    switch (type) {
      case 'BUSCO':
        return {
          bg: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
          label: 'BUSCO PROVEEDOR / SOCIO'
        };
      case 'OFREZCO':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          label: 'OFREZCO VENTAJA B2B'
        };
      case 'COLABORACION':
      default:
        return {
          bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          label: 'COLABORACIÓN / JOINT VENTURE'
        };
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Briefcase className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Tablón de Oportunidades Comerciales B2B
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Mercado privado entre socios del club para contratar servicios, licitar proyectos y formalizar alianzas.
          </p>
        </div>

        <button
          id="btn-publish-opportunity"
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-xs sm:text-sm shadow-md transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Publicar Oportunidad</span>
        </button>
      </div>

      {/* Filter and Tabs Controls */}
      <div className="p-4 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Main Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#070e20] rounded-xl border border-[#1d346b] w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setTypeFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                typeFilter === 'ALL' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todas ({opportunities.length})
            </button>
            <button
              onClick={() => setTypeFilter('BUSCO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                typeFilter === 'BUSCO' 
                  ? 'bg-rose-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Busco
            </button>
            <button
              onClick={() => setTypeFilter('OFREZCO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                typeFilter === 'OFREZCO' 
                  ? 'bg-emerald-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Ofrezco
            </button>
            <button
              onClick={() => setTypeFilter('COLABORACION')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                typeFilter === 'COLABORACION' 
                  ? 'bg-blue-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Colaboración
            </button>
            <button
              onClick={() => setTypeFilter('MINE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition shrink-0 ${
                typeFilter === 'MINE' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Mis Publicaciones
            </button>
          </div>

          {/* Search and Resolved Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-60">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar oportunidad..."
                className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
              />
            </div>

            <label className="flex items-center gap-1.5 text-xs text-slate-400 cursor-pointer shrink-0 select-none">
              <input 
                type="checkbox"
                checked={showResolved}
                onChange={(e) => setShowResolved(e.target.checked)}
                className="rounded accent-red-600 w-3.5 h-3.5"
              />
              <span>Ver resueltas</span>
            </label>
          </div>

        </div>
      </div>

      {/* Opportunities List */}
      {filteredOpportunities.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0a1329] border border-[#1b3164] space-y-3">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No se encontraron oportunidades</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Sé el primero en publicar una necesidad de contratación o propuesta de colaboración.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredOpportunities.map(opp => {
            const badge = getBadge(opp.type);
            const isAuthor = opp.authorId === currentUser.id;
            const canManage = isAuthor || currentUser.role === 'SUPERADMIN' || currentUser.role === 'ADMIN';

            return (
              <div 
                key={opp.id}
                className={`p-5 rounded-2xl bg-[#0a1329]/90 border transition space-y-3 shadow-md flex flex-col justify-between ${
                  opp.isResolved 
                    ? 'opacity-60 border-[#182a52] bg-[#070e20]' 
                    : 'border-[#1b3164] hover:border-red-500/40'
                }`}
              >
                <div className="space-y-3">
                  {/* Top Bar: Type Badge & Date */}
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${badge.bg}`}>
                      {badge.label}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {opp.createdAt}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div>
                    <h3 className="text-base font-bold text-white leading-snug">
                      {opp.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed mt-2 line-clamp-3">
                      {opp.description}
                    </p>
                  </div>

                  {/* Tags & Sector */}
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#070e20] text-red-300 border border-[#1d346b]">
                      {opp.sector}
                    </span>
                    {opp.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-[#070e20] text-slate-400 border border-[#1d346b]">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer: Author & Action Button */}
                <div className="pt-3 border-t border-[#182a52] flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white truncate">{opp.authorName}</p>
                    <p className="text-[11px] text-red-400 truncate">{opp.companyName}</p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {canManage && (
                      <>
                        {!opp.isResolved ? (
                          <button
                            onClick={() => resolveOpportunity(opp.id)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#0c1630] hover:bg-[#13234b] text-slate-300 text-xs font-semibold transition"
                            title="Marcar como resuelta / acuerdo cerrado"
                          >
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          </button>
                        ) : (
                          <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-1 rounded">
                            Resuelta ✓
                          </span>
                        )}
                        <button
                          onClick={() => deleteOpportunity(opp.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 transition"
                          title="Eliminar oportunidad"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}

                    {!isAuthor && !opp.isResolved && (
                      <button
                        onClick={() => handleInterest(opp)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-xs shadow transition"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Me Interesa / Contactar</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Modal */}
      {isCreateModalOpen && (
        <CreateOpportunityModal 
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onCreate={(data) => addOpportunity(data)}
        />
      )}

    </div>
  );
};
