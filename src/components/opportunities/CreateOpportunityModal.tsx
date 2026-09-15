import React, { useState } from 'react';
import { X, Briefcase, Plus, Save } from 'lucide-react';
import { OpportunityType } from '../../types';

interface CreateOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: any) => void;
}

export const CreateOpportunityModal: React.FC<CreateOpportunityModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<OpportunityType>('BUSCO');
  const [sector, setSector] = useState('Tecnología & Software');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onCreate({
      title: title.trim(),
      type,
      sector,
      description: description.trim(),
      tags: tagsInput.split(',').map(s => s.trim()).filter(Boolean)
    });

    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl rounded-2xl bg-[#0a1329] border border-[#1b3164] shadow-2xl p-6 text-slate-100 my-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#182a52] mb-4">
          <div className="flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-white">
              Publicar Oportunidad Comercial B2B
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Título de la Oportunidad *</label>
            <input 
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Buscamos partner tecnológico para implantación CRM en sector industrial"
              className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Tipo de Oportunidad</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as OpportunityType)}
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none"
              >
                <option value="BUSCO">BUSCO (Necesito proveedor, socio, servicio)</option>
                <option value="OFREZCO">OFREZCO (Servicio o propuesta para el club)</option>
                <option value="COLABORACION">COLABORACIÓN (Joint-venture, sinergia)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Sector Relevante</label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none"
              >
                <option value="Tecnología & Software">Tecnología & Software</option>
                <option value="Banca & Servicios Financieros">Banca & Servicios Financieros</option>
                <option value="Legal & Asesoría Fiscal">Legal & Asesoría Fiscal</option>
                <option value="Catering & Eventos Corporativos">Catering & Eventos Corporativos</option>
                <option value="Audiovisual & Branding">Audiovisual & Branding</option>
                <option value="Inmobiliario & Espacios">Inmobiliario & Espacios</option>
                <option value="Consultoría Estratégica">Consultoría Estratégica</option>
                <option value="Todos los sectores">Todos los sectores</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Descripción Detallada *</label>
            <textarea 
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Explica qué requerimientos tenéis, plazos estimados, volumen del proyecto y el perfil de empresa con la que deseáis conectar..."
              className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Palabras clave / Tags (separar por comas)</label>
            <input 
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="CRM, ERP, Integración, Cloud"
              className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none"
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
              className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white font-bold shadow transition"
            >
              <Save className="w-4 h-4" />
              <span>Publicar en el Tablón</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
