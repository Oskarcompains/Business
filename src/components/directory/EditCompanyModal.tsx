import React, { useState } from 'react';
import { X, Building2, Save, Plus } from 'lucide-react';
import { Company, CompanyTier } from '../../types';

interface EditCompanyModalProps {
  company?: Company | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (companyData: any) => void;
}

export const EditCompanyModal: React.FC<EditCompanyModalProps> = ({
  company,
  isOpen,
  onClose,
  onSave
}) => {
  const isEditing = !!company;

  const [name, setName] = useState(company?.name || '');
  const [sector, setSector] = useState(company?.sector || 'Tecnología & Software');
  const [tier, setTier] = useState<CompanyTier>(company?.tier || 'SOCIO_ESTANDAR');
  const [location, setLocation] = useState(company?.location || 'Madrid');
  const [website, setWebsite] = useState(company?.website || 'https://');
  const [description, setDescription] = useState(company?.description || '');
  const [offersInput, setOffersInput] = useState(company?.offers?.join(', ') || '');
  const [seekingInput, setSeekingInput] = useState(company?.seeking?.join(', ') || '');
  const [servicesInput, setServicesInput] = useState(company?.services?.join('\n') || '');
  const [tagsInput, setTagsInput] = useState(company?.tags?.join(', ') || '');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const data = {
      name: name.trim(),
      sector,
      tier,
      location: location.trim(),
      website: website.trim(),
      description: description.trim(),
      offers: offersInput.split(',').map(s => s.trim()).filter(Boolean),
      seeking: seekingInput.split(',').map(s => s.trim()).filter(Boolean),
      services: servicesInput.split('\n').map(s => s.trim()).filter(Boolean),
      tags: tagsInput.split(',').map(s => s.trim()).filter(Boolean),
      logo: company?.logo || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=180',
      coverImage: company?.coverImage || 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
      employeesCount: company?.employeesCount || 20,
      contactPersons: company?.contactPersons || [
        {
          name: 'Contacto Corporativo',
          role: 'Director General',
          email: 'contacto@empresa.com',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
          isPrimary: true
        }
      ]
    };

    onSave(data);
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl bg-[#0a1329] border border-[#1b3164] shadow-2xl p-6 text-slate-100 my-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#182a52] mb-4">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-white">
              {isEditing ? `Editar Ficha: ${company.name}` : 'Añadir Nueva Empresa al Club'}
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Nombre Comercial *</label>
              <input 
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ej. Atlas Capital Group"
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#182a52] text-white focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sector *</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#182a52] text-white focus:border-red-500 outline-none"
              >
                <option value="Tecnología & Software">Tecnología & Software</option>
                <option value="Banca & Servicios Financieros">Banca & Servicios Financieros</option>
                <option value="Inteligencia Artificial & Cloud">Inteligencia Artificial & Cloud</option>
                <option value="Legal & Asesoría Fiscal">Legal & Asesoría Fiscal</option>
                <option value="Catering & Eventos Corporativos">Catering & Eventos Corporativos</option>
                <option value="Audiovisual & Branding">Audiovisual & Branding</option>
                <option value="Inmobiliario & Espacios de Trabajo">Inmobiliario & Espacios de Trabajo</option>
                <option value="Consultoría Estratégica">Consultoría Estratégica</option>
                <option value="Salud & Biotecnología">Salud & Biotecnología</option>
                <option value="Industria & Logística">Industria & Logística</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Categoría / Plan</label>
              <select
                value={tier}
                onChange={(e) => setTier(e.target.value as CompanyTier)}
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#182a52] text-white focus:border-red-500 outline-none"
              >
                <option value="PATROCINADOR_GOLD">Patrocinador Gold</option>
                <option value="PATROCINADOR_SILVER">Patrocinador Silver</option>
                <option value="SOCIO_FUNDADOR">Socio Fundador</option>
                <option value="SOCIO_PREMIUM">Socio Premium</option>
                <option value="SOCIO_ESTANDAR">Socio Estándar</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Localización</label>
              <input 
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Ej. Madrid, Paseo de la Castellana"
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#182a52] text-white focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sitio Web</label>
              <input 
                type="url"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#182a52] text-white focus:border-red-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Descripción Corporativa *</label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica qué hace la empresa, trayectoria y propuesta de valor..."
              className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#182a52] text-white focus:border-red-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">¿Qué ofrece al club? (separar por comas)</label>
              <input 
                type="text"
                value={offersInput}
                onChange={(e) => setOffersInput(e.target.value)}
                placeholder="Ej. 15% dto., Auditoría inicial gratuita"
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#182a52] text-white focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">¿Qué busca en el club? (separar por comas)</label>
              <input 
                type="text"
                value={seekingInput}
                onChange={(e) => setSeekingInput(e.target.value)}
                placeholder="Ej. Clientes corporativos, Socios inversores"
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#182a52] text-white focus:border-red-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Servicios (uno por línea)</label>
            <textarea
              rows={3}
              value={servicesInput}
              onChange={(e) => setServicesInput(e.target.value)}
              placeholder="Servicio 1&#10;Servicio 2&#10;Servicio 3"
              className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#182a52] text-white focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Etiquetas / Tags (separar por comas)</label>
            <input 
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="Finanzas, M&A, IA, Legal, Inversión"
              className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#182a52] text-white focus:border-red-500 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#182a52]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#12234e] hover:bg-[#1a3372] text-slate-300 font-medium transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold shadow-lg shadow-red-950/40 transition"
            >
              <Save className="w-4 h-4" />
              <span>{isEditing ? 'Guardar Cambios' : 'Crear Empresa'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
