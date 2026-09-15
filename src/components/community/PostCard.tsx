import React, { useState } from 'react';
import { 
  Heart, 
  MessageSquare, 
  Share2, 
  Pin, 
  Building2, 
  Award, 
  Sparkles, 
  Send, 
  Trash2,
  CheckCircle2,
  BarChart2
} from 'lucide-react';
import { Post, PostCategory } from '../../types';
import { useApp } from '../../context/AppContext';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { 
    currentUser, 
    toggleLikePost, 
    addCommentToPost, 
    votePostPoll, 
    deletePost,
    startDirectChatWithUser,
    users
  } = useApp();

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [copied, setCopied] = useState(false);

  const hasLiked = post.likedBy.includes(currentUser.id);
  const canDelete = currentUser.role === 'SUPERADMIN' || currentUser.role === 'ADMIN' || currentUser.id === post.authorId;

  const getCategoryBadge = (cat: PostCategory) => {
    switch (cat) {
      case 'COMUNICADO_OFICIAL':
        return {
          bg: 'bg-red-500/20 text-red-300 border-red-500/40',
          label: '📢 Comunicado Oficial del Club'
        };
      case 'HITO_EMPRESARIAL':
        return {
          bg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
          label: '🏆 Logro & Reconocimiento'
        };
      case 'ENCUESTA':
        return {
          bg: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
          label: '📊 Encuesta Activa'
        };
      case 'PREGUNTA':
        return {
          bg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
          label: '💡 Debate / Pregunta'
        };
      case 'BIENVENIDA':
        return {
          bg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
          label: '👋 Nueva Incorporación'
        };
      default:
        return null;
    }
  };

  const badge = getCategoryBadge(post.category);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addCommentToPost(post.id, newComment.trim());
    setNewComment('');
  };

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const authorUser = users.find(u => u.id === post.authorId);

  return (
    <div 
      id={`post-card-${post.id}`}
      className={`rounded-2xl bg-[#0a1329]/90 border transition space-y-3.5 p-4 sm:p-5 shadow-md ${
        post.isPinned 
          ? 'border-red-500/40 bg-gradient-to-b from-red-600/10 via-[#0a1329] to-[#0a1329]' 
          : 'border-[#1b3164]'
      }`}
    >
      {/* Pinned header badge */}
      {post.isPinned && (
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-red-400 pb-1 border-b border-[#182a52]">
          <Pin className="w-3.5 h-3.5 text-red-400 rotate-45" />
          <span>Publicación destacada por la Dirección del Club</span>
        </div>
      )}

      {/* Author Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <img 
            src={post.authorAvatar} 
            alt={post.authorName} 
            className="w-10 h-10 rounded-xl object-cover ring-1 ring-red-500/30 shrink-0" 
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h4 className="text-sm font-bold text-white truncate">{post.authorName}</h4>
              <span className="text-[10px] text-slate-500">• {post.createdAt}</span>
            </div>
            <p className="text-xs text-red-400 font-semibold truncate">
              {post.authorPosition}
            </p>
            <p className="text-[11px] text-slate-400 truncate">
              {post.authorCompany}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {badge && (
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${badge.bg}`}>
              {badge.label}
            </span>
          )}

          {canDelete && (
            <button
              onClick={() => deletePost(post.id)}
              className="p-1 rounded-lg text-slate-500 hover:text-rose-400 transition"
              title="Eliminar publicación"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre-line">
        {post.content}
      </p>

      {/* Optional Attached Image */}
      {post.imageUrl && (
        <div className="rounded-xl overflow-hidden border border-[#1b3164] max-h-96">
          <img 
            src={post.imageUrl} 
            alt="Imagen de publicación" 
            className="w-full h-full object-cover" 
          />
        </div>
      )}

      {/* Interactive Poll Component */}
      {post.poll && (
        <div className="p-4 rounded-xl bg-[#070e20]/90 border border-[#1d346b] space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-red-400" />
              {post.poll.question}
            </span>
            <span className="text-slate-400 text-[11px]">
              {post.poll.totalVotes} votos registrados
            </span>
          </div>

          <div className="space-y-2">
            {post.poll.options.map((option) => {
              const total = post.poll?.totalVotes || 0;
              const pct = total > 0 ? Math.round((option.votes / total) * 100) : 0;
              const isSelected = post.poll?.userVotedOptionId === option.id;

              return (
                <div 
                  key={option.id}
                  onClick={() => votePostPoll(post.id, option.id)}
                  className={`relative overflow-hidden p-2.5 rounded-lg border text-xs cursor-pointer transition select-none ${
                    isSelected 
                      ? 'border-red-500 bg-red-600/15 text-white font-bold' 
                      : 'border-[#1b3164] hover:border-red-500/40 bg-[#0a1329]/60 text-slate-300'
                  }`}
                >
                  <div 
                    className="absolute inset-y-0 left-0 bg-red-600/25 transition-all duration-300"
                    style={{ width: `${pct}%` }} 
                  />
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-red-400" />}
                      {option.text}
                    </span>
                    <span className="font-mono text-[11px] font-semibold text-red-400">{pct}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Post Actions Bar */}
      <div className="pt-2 border-t border-[#182a52] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-4">
          <button
            onClick={() => toggleLikePost(post.id)}
            className={`flex items-center gap-1.5 transition ${
              hasLiked ? 'text-red-400 font-bold' : 'hover:text-white'
            }`}
          >
            <Heart className={`w-4 h-4 ${hasLiked ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{post.likes} Recomendar</span>
          </button>

          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-1.5 hover:text-white transition"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{post.comments.length} Comentarios</span>
          </button>
        </div>

        <div className="relative">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 hover:text-white transition"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copied ? '¡Enlace copiado!' : 'Compartir'}</span>
          </button>
        </div>
      </div>

      {/* Comments Thread Section */}
      {showComments && (
        <div className="pt-3 border-t border-[#182a52] space-y-3 animate-in fade-in">
          {/* New Comment Input */}
          <form onSubmit={handleCommentSubmit} className="flex gap-2">
            <input 
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escribe una respuesta o felicitación..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#070e20] border border-[#1d346b] text-white text-xs outline-none focus:border-red-500"
            />
            <button
              type="submit"
              disabled={!newComment.trim()}
              className="px-3 py-2 rounded-xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 disabled:opacity-40 text-white font-bold text-xs shadow transition"
            >
              <Send className="w-3.5 h-3.5" />
            </button>
          </form>

          {/* Comments List */}
          <div className="space-y-2.5 max-h-60 overflow-y-auto">
            {post.comments.length === 0 ? (
              <p className="text-[11px] text-slate-500 py-2">Sé el primero en comentar esta publicación.</p>
            ) : (
              post.comments.map((comm) => (
                <div key={comm.id} className="p-2.5 rounded-xl bg-[#070e20]/80 border border-[#182a52] text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img src={comm.authorAvatar} alt={comm.authorName} className="w-5 h-5 rounded-md object-cover" />
                      <span className="font-bold text-white">{comm.authorName}</span>
                      <span className="text-[10px] text-slate-400">• {comm.authorCompany}</span>
                    </div>
                    <span className="text-[10px] text-slate-400">{comm.createdAt}</span>
                  </div>
                  <p className="text-slate-300 pl-7">{comm.content}</p>
                </div>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
};
