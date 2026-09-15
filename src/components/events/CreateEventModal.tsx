import React, { useState } from 'react';
import { X, Calendar, Plus, Save, Image, MapPin, Users } from 'lucide-react';
import { EventType, EventStatus } from '../../types';

interface CreateEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (eventData: any) => void;
}

export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  isOpen,
  onClose,
  onCreate
}) => {
  const [title, setTitle] = useState('');
  const [type, setType] = useState<EventType>('Encuentro de Networking');
  const [status, setStatus] = useState<EventStatus>('INSCRIPCIONES ABIERTAS');
  const [date, setDate] = useState('2025-10-25');
  const [time, setTime] = useState('09:30');
  const [location, setLocation] = useState('Hotel Wellington & Club de Negocios, Madrid');
  const [capacity, setCapacity] = useState(60);
  const [description, setDescription] = useState('');
  const [organizer, setOrganizer] = useState('Comité de Dirección ClubNexus');
  const [targetAudience, setTargetAudience] = useState('Socios, Directores Generales y CEOs');
  const [sponsorsInput, setSponsorsInput] = useState('Banco Santander Empresas, Telefónica Tech');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onCreate({
      title: title.trim(),
      type,
      status,
      date,
      time,
      location: location.trim(),
      capacity: Number(capacity) || 50,
      description: description.trim(),
      organizer: organizer.trim(),
      targetAudience: targetAudience.trim(),
      sponsors: sponsorsInput.split(',').map(s => s.trim()).filter(Boolean),
      bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200',
      agenda: [
        { time: time, title: 'Recepción y acreditación QR' },
        { time: '10:00', title: 'Sesión de apertura y Elevator Pitches' },
        { time: '11:00', title: 'Café networking y reuniones 1-to-1' }
      ]
    });
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto animate-in fade-in"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-2xl rounded-2xl bg-[#0a1329] border border-[#1b3164] shadow-2xl p-6 text-slate-100 my-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-[#182a52] mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold text-white">
              Publicar Nuevo Evento en el Club
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Título del Encuentro *</label>
            <input 
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Desayuno Exclusivo de Socios: Tendencias M&A 2025"
              className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Formato / Tipo de Evento</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as EventType)}
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none"
              >
                <option value="Encuentro de Networking">Encuentro de Networking</option>
                <option value="Desayuno Empresarial">Desayuno Empresarial</option>
                <option value="Afterwork & Cóctel">Afterwork & Cóctel</option>
                <option value="Conferencia Magistral">Conferencia Magistral</option>
                <option value="Jornada de Formación">Jornada de Formación</option>
                <option value="Visita Corporativa">Visita Corporativa</option>
                <option value="Torneo Deportivo & Golf">Torneo Deportivo & Golf</option>
                <option value="Cena de Gala & Premios">Cena de Gala & Premios</option>
                <option value="Mesa Redonda VIP">Mesa Redonda VIP</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Estado de Convocatoria</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as EventStatus)}
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none"
              >
                <option value="INSCRIPCIONES ABIERTAS">Inscripciones Abiertas</option>
                <option value="PRÓXIMAMENTE">Próximamente (Save the Date)</option>
                <option value="COMPLETO">Completo (Lista de Espera)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Fecha</label>
              <input 
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Hora Inicio</label>
              <input 
                type="time"
                required
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Aforo Máximo</label>
              <input 
                type="number"
                min="5"
                max="500"
                value={capacity}
                onChange={(e) => setCapacity(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Ubicación / Sede</label>
            <input 
              type="text"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Ej. Club Financiero Génova, Madrid"
              className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Descripción y Objetivos</label>
            <textarea 
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe los temas a tratar, dinámicas de networking y dinámicas de presentación..."
              className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-semibold mb-1">Organizador</label>
              <input 
                type="text"
                value={organizer}
                onChange={(e) => setOrganizer(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-semibold mb-1">Patrocinadores / Colaboradores</label>
              <input 
                type="text"
                value={sponsorsInput}
                onChange={(e) => setSponsorsInput(e.target.value)}
                placeholder="Empresa A, Empresa B"
                className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white focus:border-red-500 outline-none"
              />
            </div>
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
              <span>Publicar Convocatoria</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
