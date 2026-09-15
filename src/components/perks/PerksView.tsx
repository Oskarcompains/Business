import React, { useState } from 'react';
import { 
  Sparkles, 
  Gift, 
  Tag, 
  Building2, 
  MessageSquare, 
  Check, 
  Copy, 
  ExternalLink,
  PlusCircle,
  Search
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ClubPerk } from '../../types';

export const PerksView: React.FC = () => {
  const { perks, companies, startCompanyChat, currentUser } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const categories = Array.from(new Set(perks.map(p => p.category)));

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const filteredPerks = perks.filter(perk => {
    const matchesSearch = 
      !searchTerm ||
      perk.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perk.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      perk.companyName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCat = selectedCategory === 'ALL' || perk.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Gift className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Ventajas & Convenios Exclusivos
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Beneficios, tarifas corporativas preferentes y acuerdos suscritos entre socios y patrocinadores del club.
          </p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] space-y-3 shadow-md">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar beneficio o empresa promotora..."
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                selectedCategory === 'ALL' 
                  ? 'bg-red-600 text-white shadow' 
                  : 'bg-[#070e20] text-slate-400 hover:text-white border border-[#1d346b]'
              }`}
            >
              Todos los convenios
            </button>
            {categories.map((cat, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition ${
                  selectedCategory === cat 
                    ? 'bg-red-600 text-white shadow' 
                    : 'bg-[#070e20] text-slate-400 hover:text-white border border-[#1d346b]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Perks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredPerks.map(perk => {
          const comp = companies.find(c => c.id === perk.companyId);

          return (
            <div 
              key={perk.id}
              className="p-5 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] hover:border-red-500/50 transition flex flex-col justify-between shadow-md group space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <img src={perk.companyLogo} alt={perk.companyName} className="w-10 h-10 rounded-xl object-cover ring-1 ring-red-500/30" />
                    <div>
                      <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider block">
                        {perk.category}
                      </span>
                      <h4 className="text-xs font-bold text-white truncate max-w-[170px]">{perk.companyName}</h4>
                    </div>
                  </div>
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40">
                    {perk.discount}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-red-400 transition leading-snug">
                    {perk.title}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-3">
                    {perk.description}
                  </p>
                </div>

                {perk.code && (
                  <div className="p-2.5 rounded-xl bg-[#070e20] border border-[#1d346b] flex items-center justify-between text-xs">
                    <div className="min-w-0">
                      <span className="text-[10px] text-slate-400 block">Código Exclusivo Socio:</span>
                      <span className="font-mono font-bold text-red-300 tracking-wider text-xs">
                        {perk.code}
                      </span>
                    </div>
                    <button
                      onClick={() => handleCopyCode(perk.code!)}
                      className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#12234e] hover:bg-[#1a3372] text-slate-200 text-[11px] font-semibold transition"
                    >
                      {copiedCode === perk.code ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-red-400" />
                          <span>Copiar</span>
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>

              <div className="pt-3 border-t border-[#182a52] flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-400">
                  Válido para miembros del club
                </span>
                {comp && (
                  <button
                    onClick={() => startCompanyChat(comp)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#12234e] hover:bg-[#1a3372] text-slate-200 text-xs font-semibold transition"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-red-400" />
                    <span>Consultar</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
