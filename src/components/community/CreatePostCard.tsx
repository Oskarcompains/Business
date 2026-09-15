import React, { useState } from 'react';
import { 
  Send, 
  Image as ImageIcon, 
  BarChart3, 
  Sparkles, 
  Pin, 
  Building2, 
  Smile, 
  X,
  Award
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PostCategory } from '../../types';

export const CreatePostCard: React.FC = () => {
  const { currentUser, addPost } = useApp();

  const [content, setContent] = useState('');
  const [category, setCategory] = useState<PostCategory>('NOTICIA');
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);
  const [showPollInput, setShowPollInput] = useState(false);
  const [pollQuestion, setPollQuestion] = useState('');
  const [pollOptions, setPollOptions] = useState(['', '']);
  const [isPinned, setIsPinned] = useState(false);

  const isAdmin = currentUser.role === 'SUPERADMIN' || currentUser.role === 'ADMIN';

  const handleAddPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const handleUpdatePollOption = (index: number, val: string) => {
    const next = [...pollOptions];
    next[index] = val;
    setPollOptions(next);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !pollQuestion.trim()) return;

    let pollData = undefined;
    if (showPollInput && pollQuestion.trim()) {
      const validOptions = pollOptions.filter(o => o.trim().length > 0);
      if (validOptions.length >= 2) {
        pollData = {
          question: pollQuestion.trim(),
          options: validOptions.map((opt, i) => ({
            id: `opt-${i + 1}`,
            text: opt.trim(),
            votes: 0
          })),
          totalVotes: 0,
          userVotedOptionId: undefined
        };
      }
    }

    addPost({
      content: content.trim(),
      category,
      imageUrl: imageUrl.trim() || undefined,
      poll: pollData,
      isPinned: isAdmin ? isPinned : false
    });

    // Reset
    setContent('');
    setImageUrl('');
    setShowImageInput(false);
    setShowPollInput(false);
    setPollQuestion('');
    setPollOptions(['', '']);
    setIsPinned(false);
  };

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-[#0a1329]/90 border border-[#1b3164] shadow-md space-y-3">
      <div className="flex items-start gap-3">
        <img 
          src={currentUser.avatar} 
          alt={currentUser.name} 
          className="w-10 h-10 rounded-xl object-cover ring-1 ring-red-500/40 shrink-0" 
        />
        <div className="flex-1 space-y-2">
          <textarea
            rows={2}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={`¿Qué novedades o sinergias deseas compartir con el club, ${currentUser.name.split(' ')[0]}?`}
            className="w-full px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white placeholder:text-slate-500 text-xs sm:text-sm outline-none focus:border-red-500 resize-none transition"
          />

          {/* Optional Image Input */}
          {showImageInput && (
            <div className="flex items-center gap-2 p-2 rounded-xl bg-[#070e20] border border-[#1d346b] animate-in fade-in">
              <ImageIcon className="w-4 h-4 text-red-400 shrink-0" />
              <input 
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="URL de la imagen (https://...)"
                className="flex-1 bg-transparent text-xs text-white outline-none"
              />
              <button onClick={() => setShowImageInput(false)} className="text-slate-400 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Optional Poll Builder */}
          {showPollInput && (
            <div className="p-3 rounded-xl bg-[#070e20] border border-[#1d346b] space-y-2.5 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-red-400">
                <span className="flex items-center gap-1.5">
                  <BarChart3 className="w-3.5 h-3.5" /> Crear Encuesta Empresarial
                </span>
                <button onClick={() => setShowPollInput(false)} className="text-slate-400 hover:text-white">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <input 
                type="text"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
                placeholder="Pregunta de la encuesta (ej. ¿Qué temática priorizáis para el próximo afterwork?)"
                className="w-full px-3 py-1.5 rounded-lg bg-[#0a1329] border border-[#1b3164] text-white text-xs outline-none focus:border-red-500"
              />

              <div className="space-y-1.5">
                {pollOptions.map((opt, i) => (
                  <input 
                    key={i}
                    type="text"
                    value={opt}
                    onChange={(e) => handleUpdatePollOption(i, e.target.value)}
                    placeholder={`Opción ${i + 1}`}
                    className="w-full px-3 py-1 rounded-lg bg-[#0a1329] border border-[#1b3164] text-white text-xs outline-none"
                  />
                ))}
              </div>

              {pollOptions.length < 4 && (
                <button
                  type="button"
                  onClick={handleAddPollOption}
                  className="text-[11px] font-semibold text-red-400 hover:underline"
                >
                  + Añadir otra opción
                </button>
              )}
            </div>
          )}

          {/* Category Select & Admin Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as PostCategory)}
                className="px-2.5 py-1 rounded-lg bg-[#070e20] border border-[#1d346b] text-slate-300 text-[11px] outline-none"
              >
                <option value="NOTICIA">Noticia General</option>
                <option value="HITO_EMPRESARIAL">🏆 Hito / Premio / Ronda</option>
                <option value="PREGUNTA">Debate / Pregunta</option>
                <option value="ENCUESTA">Encuesta</option>
                <option value="BIENVENIDA">Bienvenida</option>
                {isAdmin && <option value="COMUNICADO_OFICIAL">📢 Comunicado Oficial</option>}
              </select>

              <button
                type="button"
                onClick={() => setShowImageInput(!showImageInput)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-[#12234e] transition"
                title="Añadir Imagen"
              >
                <ImageIcon className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => setShowPollInput(!showPollInput)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-[#12234e] transition"
                title="Crear Encuesta"
              >
                <BarChart3 className="w-4 h-4" />
              </button>

              {isAdmin && (
                <label className="flex items-center gap-1 text-[11px] text-slate-400 cursor-pointer ml-1">
                  <input 
                    type="checkbox" 
                    checked={isPinned} 
                    onChange={(e) => setIsPinned(e.target.checked)} 
                    className="accent-red-600 w-3.5 h-3.5"
                  />
                  <span>Fijar arriba</span>
                </label>
              )}
            </div>

            <button
              onClick={handleSubmit}
              disabled={!content.trim() && !pollQuestion.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs shadow transition"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Publicar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
