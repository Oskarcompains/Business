import React, { useState, useMemo } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  Sparkles, 
  PlusCircle, 
  MapPin, 
  SlidersHorizontal,
  X,
  Award,
  FileSpreadsheet
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CompanyCard } from './CompanyCard';
import { CompanyDetailModal } from './CompanyDetailModal';
import { EditCompanyModal } from './EditCompanyModal';
import { GoogleSheetsSyncModal } from '../sheets/GoogleSheetsSyncModal';
import { Company } from '../../types';

export const DirectoryView: React.FC = () => {
  const { 
    companies, 
    currentUser, 
    selectedCompanyId, 
    setSelectedCompanyId, 
    startCompanyChat, 
    addCompany, 
    updateCompany 
  } = useApp();

  const isAdmin = currentUser.role === 'SUPERADMIN' || currentUser.role === 'ADMIN';

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSector, setSelectedSector] = useState('ALL');
  const [selectedTier, setSelectedTier] = useState('ALL');
  const [selectedLocation, setSelectedLocation] = useState('ALL');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Modals state
  const [modalCompany, setModalCompany] = useState<Company | null>(() => {
    return companies.find(c => c.id === selectedCompanyId) || null;
  });
  const [editingCompany, setEditingCompany] = useState<Company | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSheetsModalOpen, setIsSheetsModalOpen] = useState(false);

  // Connected state simulation
  const [connectedCompanyIds, setConnectedCompanyIds] = useState<string[]>(['comp-2']);

  // Extract unique sectors & locations
  const sectors = useMemo(() => {
    return Array.from(new Set(companies.map(c => c.sector)));
  }, [companies]);

  const locations = useMemo(() => {
    return Array.from(new Set(companies.map(c => c.location.split(',')[0].trim())));
  }, [companies]);

  // Filtering Logic
  const filteredCompanies = useMemo(() => {
    return companies.filter(company => {
      // Search term
      const term = searchTerm.toLowerCase();
      const matchesSearch = 
        !term ||
        company.name.toLowerCase().includes(term) ||
        company.sector.toLowerCase().includes(term) ||
        company.description.toLowerCase().includes(term) ||
        company.tags.some(t => t.toLowerCase().includes(term)) ||
        company.services.some(s => s.toLowerCase().includes(term));

      // Sector filter
      const matchesSector = selectedSector === 'ALL' || company.sector === selectedSector;

      // Tier filter
      const matchesTier = selectedTier === 'ALL' || (
        selectedTier === 'PATROCINADORES' 
          ? company.tier.includes('PATROCINADOR') 
          : company.tier === selectedTier
      );

      // Location filter
      const matchesLocation = selectedLocation === 'ALL' || company.location.includes(selectedLocation);

      return matchesSearch && matchesSector && matchesTier && matchesLocation;
    });
  }, [companies, searchTerm, selectedSector, selectedTier, selectedLocation]);

  const handleConnect = (company: Company) => {
    if (connectedCompanyIds.includes(company.id)) {
      setConnectedCompanyIds(prev => prev.filter(id => id !== company.id));
    } else {
      setConnectedCompanyIds(prev => [...prev, company.id]);
    }
  };

  const handleSaveCompany = (data: any) => {
    if (editingCompany) {
      updateCompany(editingCompany.id, data);
      setEditingCompany(null);
    } else {
      addCompany(data);
      setIsCreateModalOpen(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header & Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Directorio de Empresas del Club
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Explora el ecosistema de {companies.length} organizaciones, encuentra proveedores verificados y genera sinergias B2B.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {isAdmin && (
            <>
              <button
                id="btn-sync-sheets-companies"
                onClick={() => setIsSheetsModalOpen(true)}
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 hover:text-emerald-200 border border-emerald-500/40 text-xs sm:text-sm font-bold shadow-md transition cursor-pointer"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                <span>Google Sheets</span>
              </button>

              <button
                id="btn-add-company"
                onClick={() => setIsCreateModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold text-xs sm:text-sm shadow-md transition shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Añadir Empresa</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Search and Filters Bar */}
      <div className="p-4 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          
          {/* Main search input */}
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por nombre, servicios, sector o palabras clave..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-slate-100 text-xs sm:text-sm placeholder:text-slate-500 focus:border-red-500 outline-none transition"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-slate-200 text-xs outline-none focus:border-red-500 shrink-0"
            >
              <option value="ALL">Todos los Sectores</option>
              {sectors.map((s, idx) => (
                <option key={idx} value={s}>{s}</option>
              ))}
            </select>

            <select
              value={selectedTier}
              onChange={(e) => setSelectedTier(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-slate-200 text-xs outline-none focus:border-red-500 shrink-0"
            >
              <option value="ALL">Todas las Categorías</option>
              <option value="PATROCINADORES">⭐ Patrocinadores Oficiales</option>
              <option value="SOCIO_FUNDADOR">Socio Fundador</option>
              <option value="SOCIO_PREMIUM">Socio Premium</option>
              <option value="SOCIO_ESTANDAR">Socio Estándar</option>
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] text-slate-200 text-xs outline-none focus:border-red-500 shrink-0"
            >
              <option value="ALL">Todas las Ciudades</option>
              {locations.map((loc, idx) => (
                <option key={idx} value={loc}>{loc}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Counter and Active Filter chips */}
        <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
          <span>Mostrando {filteredCompanies.length} de {companies.length} empresas registradas</span>
          {(searchTerm || selectedSector !== 'ALL' || selectedTier !== 'ALL' || selectedLocation !== 'ALL') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSector('ALL');
                setSelectedTier('ALL');
                setSelectedLocation('ALL');
              }}
              className="text-red-400 hover:underline font-semibold"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </div>

      {/* Companies Grid */}
      {filteredCompanies.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
          <Building2 className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-base font-bold text-white">No se encontraron empresas</h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Prueba a modificar los filtros o el término de búsqueda para ver más resultados del club.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSector('ALL');
              setSelectedTier('ALL');
              setSelectedLocation('ALL');
            }}
            className="px-4 py-2 rounded-xl bg-slate-800 text-slate-200 text-xs font-semibold hover:bg-slate-700"
          >
            Restablecer búsqueda
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCompanies.map(company => (
            <CompanyCard 
              key={company.id}
              company={company}
              onViewDetails={(comp) => setModalCompany(comp)}
              onContact={(comp) => startCompanyChat(comp)}
              onConnect={handleConnect}
              isConnected={connectedCompanyIds.includes(company.id)}
            />
          ))}
        </div>
      )}

      {/* Company Dossier Modal */}
      {modalCompany && (
        <CompanyDetailModal 
          company={modalCompany}
          onClose={() => setModalCompany(null)}
          onEdit={(comp) => {
            setModalCompany(null);
            setEditingCompany(comp);
          }}
        />
      )}

      {/* Create / Edit Modal */}
      {(isCreateModalOpen || editingCompany) && (
        <EditCompanyModal 
          company={editingCompany}
          isOpen={isCreateModalOpen || !!editingCompany}
          onClose={() => {
            setIsCreateModalOpen(false);
            setEditingCompany(null);
          }}
          onSave={handleSaveCompany}
        />
      )}

      {/* Google Sheets Sync Modal */}
      {isSheetsModalOpen && (
        <GoogleSheetsSyncModal 
          mode="companies"
          onClose={() => setIsSheetsModalOpen(false)}
        />
      )}

    </div>
  );
};
