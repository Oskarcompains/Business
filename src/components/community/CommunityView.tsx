import React, { useState, useMemo } from 'react';
import { 
  Users2, 
  MessageSquare, 
  Sparkles, 
  Award, 
  Pin, 
  TrendingUp, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { CreatePostCard } from './CreatePostCard';
import { PostCard } from './PostCard';
import { PostCategory } from '../../types';

export const CommunityView: React.FC = () => {
  const { posts, events, companies, setActiveView, setSelectedEventId } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<'ALL' | PostCategory>('ALL');

  // Sorted: Pinned first, then by ID or creation date
  const sortedPosts = useMemo(() => {
    return [...posts].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return 0;
    });
  }, [posts]);

  const filteredPosts = useMemo(() => {
    if (categoryFilter === 'ALL') return sortedPosts;
    return sortedPosts.filter(p => p.category === categoryFilter);
  }, [sortedPosts, categoryFilter]);

  const nextEvent = events.find(e => e.status !== 'FINALIZADO');
  const goldSponsor = companies.find(c => c.tier === 'PATROCINADOR_GOLD') || companies[0];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users2 className="w-5 h-5 text-red-500" />
            <h1 className="text-2xl font-black text-white tracking-tight">
              Comunidad & Muro Empresarial
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            Comparte iniciativas, participa en debates del club, vota en encuestas y celebra los hitos de nuestros socios.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Main Feed (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Create Post */}
          <CreatePostCard />

          {/* Filter Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-[#0a1329] border border-[#1b3164] rounded-xl overflow-x-auto text-xs">
            <button
              onClick={() => setCategoryFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                categoryFilter === 'ALL' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Todo el Muro
            </button>
            <button
              onClick={() => setCategoryFilter('COMUNICADO_OFICIAL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                categoryFilter === 'COMUNICADO_OFICIAL' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📢 Comunicados
            </button>
            <button
              onClick={() => setCategoryFilter('HITO_EMPRESARIAL')}
              className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                categoryFilter === 'HITO_EMPRESARIAL' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🏆 Hitos de Socios
            </button>
            <button
              onClick={() => setCategoryFilter('ENCUESTA')}
              className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                categoryFilter === 'ENCUESTA' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              📊 Encuestas
            </button>
            <button
              onClick={() => setCategoryFilter('PREGUNTA')}
              className={`px-3 py-1.5 rounded-lg font-bold transition shrink-0 ${
                categoryFilter === 'PREGUNTA' 
                  ? 'bg-red-600 text-white shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              💡 Debates
            </button>
          </div>

          {/* Posts Feed */}
          <div className="space-y-4">
            {filteredPosts.map(post => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>

        </div>

        {/* Right Sidebar Widgets (1 col) */}
        <div className="space-y-4">
          
          {/* Next event widget */}
          {nextEvent && (
            <div className="p-4 rounded-2xl bg-[#0a1329] border border-[#1b3164] space-y-3 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5 font-bold text-red-400">
                  <Calendar className="w-4 h-4" /> Próxima Convocatoria
                </span>
                <span className="text-[10px] bg-[#070e20] px-2 py-0.5 rounded text-slate-300 border border-[#182a52]">{nextEvent.type}</span>
              </div>
              <h4 className="text-sm font-bold text-white line-clamp-2">{nextEvent.title}</h4>
              <p className="text-xs text-slate-400">{nextEvent.date} • {nextEvent.time} h</p>
              <button
                onClick={() => {
                  setSelectedEventId(nextEvent.id);
                  setActiveView('events');
                }}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#0c1630] hover:bg-[#13234b] text-red-300 text-xs font-semibold border border-[#1f376d] transition"
              >
                <span>Ver Programa & Acreditación</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Trending Club Topics */}
          <div className="p-4 rounded-2xl bg-[#0a1329] border border-[#1b3164] space-y-3 shadow-md">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-red-400" />
              Temas Candentes del Club
            </h4>
            <div className="space-y-2 text-xs">
              <div className="p-2 rounded-xl bg-[#070e20] border border-[#182a52] flex items-center justify-between">
                <span className="font-semibold text-slate-200">#InteligenciaArtificial</span>
                <span className="text-slate-400 text-[11px]">18 debates</span>
              </div>
              <div className="p-2 rounded-xl bg-[#070e20] border border-[#182a52] flex items-center justify-between">
                <span className="font-semibold text-slate-200">#RondasInversion</span>
                <span className="text-slate-400 text-[11px]">12 hitos</span>
              </div>
              <div className="p-2 rounded-xl bg-[#070e20] border border-[#182a52] flex items-center justify-between">
                <span className="font-semibold text-slate-200">#Convenios2025</span>
                <span className="text-slate-400 text-[11px]">9 ventajas</span>
              </div>
              <div className="p-2 rounded-xl bg-[#070e20] border border-[#182a52] flex items-center justify-between">
                <span className="font-semibold text-slate-200">#TorneoGolf</span>
                <span className="text-slate-400 text-[11px]">6 eventos</span>
              </div>
            </div>
          </div>

          {/* Rules / Verification note */}
          <div className="p-4 rounded-2xl bg-[#070e20] border border-[#182a52] text-xs text-slate-400 space-y-2">
            <span className="font-bold text-slate-300 block">Comunidad Corporativa Verificada</span>
            <p className="text-[11px] leading-relaxed">
              El club fomenta la transparencia comercial y las sinergias de alto valor. Las publicaciones son visibles para todos los socios acreditados.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
