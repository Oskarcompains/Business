import React, { useState, useEffect, useRef } from 'react';
import { 
  MessageSquare, 
  Send, 
  Hash, 
  User as UserIcon, 
  ArrowLeft, 
  Search, 
  Check, 
  CheckCheck,
  Building2,
  Users
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const ChatView: React.FC = () => {
  const { 
    currentUser, 
    channels, 
    activeChannelId, 
    setActiveChannelId, 
    getChannelMessages, 
    sendMessage 
  } = useApp();

  const [messageText, setMessageText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileConversationOpen, setMobileConversationOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeChannel = channels.find(c => c.id === activeChannelId) || channels[0];
  const currentMessages = activeChannel ? getChannelMessages(activeChannel.id) : [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages.length, activeChannelId]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !activeChannel) return;
    sendMessage(activeChannel.id, messageText.trim());
    setMessageText('');
  };

  const filteredChannels = channels.filter(ch => {
    return !searchTerm || ch.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="h-[calc(100vh-140px)] sm:h-[calc(100vh-130px)] flex rounded-3xl bg-[#0a1329] border border-[#1b3164] overflow-hidden shadow-xl animate-in fade-in duration-200">
      
      {/* Left Sidebar: Channels & Conversations List */}
      <div className={`w-full md:w-80 lg:w-88 border-r border-[#1b3164] bg-[#070e20] flex flex-col shrink-0 ${
        mobileConversationOpen ? 'hidden md:flex' : 'flex'
      }`}>
        
        {/* Header & Search */}
        <div className="p-4 border-b border-[#1b3164] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-red-500" />
              <h2 className="text-base font-bold text-white">Mensajes & Canales</h2>
            </div>
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-[#12234e] text-red-300 border border-[#1b3164]">
              {channels.length} activos
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar canal o conversación..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#0a1329] border border-[#1d346b] text-xs text-white placeholder:text-slate-500 outline-none focus:border-red-500"
            />
          </div>
        </div>

        {/* Channel Categories & List */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          
          {/* Group: Canales Públicos */}
          <p className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Canales del Club
          </p>
          {filteredChannels.filter(c => c.type === 'PUBLIC').map(channel => {
            const isActive = channel.id === activeChannel?.id;
            return (
              <button
                key={channel.id}
                onClick={() => {
                  setActiveChannelId(channel.id);
                  setMobileConversationOpen(true);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition ${
                  isActive 
                    ? 'bg-red-600/20 border border-red-500/40 text-white font-semibold' 
                    : 'hover:bg-[#101e3f] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                    isActive ? 'bg-red-600 text-white' : 'bg-[#12234e] text-slate-400'
                  }`}>
                    <Hash className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{channel.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{channel.description || 'Canal general'}</p>
                  </div>
                </div>
                {channel.unreadCount && channel.unreadCount > 0 ? (
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                    {channel.unreadCount}
                  </span>
                ) : null}
              </button>
            );
          })}

          {/* Group: Mensajes Directos B2B */}
          <p className="px-3 pt-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Conversaciones Directas (1 a 1)
          </p>
          {filteredChannels.filter(c => c.type === 'DIRECT').map(channel => {
            const isActive = channel.id === activeChannel?.id;
            return (
              <button
                key={channel.id}
                onClick={() => {
                  setActiveChannelId(channel.id);
                  setMobileConversationOpen(true);
                }}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition ${
                  isActive 
                    ? 'bg-red-600/20 border border-red-500/40 text-white font-semibold' 
                    : 'hover:bg-[#101e3f] text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {channel.avatar ? (
                    <img src={channel.avatar} alt={channel.name} className="w-8 h-8 rounded-lg object-cover ring-1 ring-[#1b3164] shrink-0" />
                  ) : (
                    <div className="w-8 h-8 rounded-lg bg-[#12234e] text-slate-400 flex items-center justify-center shrink-0">
                      <UserIcon className="w-4 h-4" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate">{channel.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{channel.lastMessage || 'Conversación privada'}</p>
                  </div>
                </div>
                {channel.unreadCount && channel.unreadCount > 0 ? (
                  <span className="w-4 h-4 rounded-full bg-red-600 text-white text-[10px] font-black flex items-center justify-center shrink-0">
                    {channel.unreadCount}
                  </span>
                ) : null}
              </button>
            );
          })}

        </div>

      </div>

      {/* Right Area: Active Chat Conversation */}
      <div className={`flex-1 flex-col bg-[#0a1329] ${
        mobileConversationOpen ? 'flex' : 'hidden md:flex'
      }`}>
        
        {/* Conversation Top Bar */}
        {activeChannel ? (
          <div className="p-3.5 px-4 sm:px-6 border-b border-[#1b3164] flex items-center justify-between bg-[#0a1329]/95 backdrop-blur-sm">
            <div className="flex items-center gap-3 min-w-0">
              {/* Mobile back button */}
              <button
                onClick={() => setMobileConversationOpen(false)}
                className="md:hidden p-1.5 rounded-xl bg-[#12234e] text-slate-300 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>

              {activeChannel.avatar ? (
                <img src={activeChannel.avatar} alt={activeChannel.name} className="w-9 h-9 rounded-xl object-cover ring-1 ring-red-500/40 shrink-0" />
              ) : (
                <div className="w-9 h-9 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center font-bold shrink-0">
                  <Hash className="w-5 h-5" />
                </div>
              )}

              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white truncate">{activeChannel.name}</h3>
                <p className="text-[11px] text-slate-400 truncate">
                  {activeChannel.type === 'PUBLIC' 
                    ? 'Canal oficial abierto a todos los socios' 
                    : 'Chat privado y confidencial B2B'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400 shrink-0">
              <span className="hidden sm:inline-flex items-center gap-1 text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Conectado
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 border-b border-[#1b3164] text-xs text-slate-400">
            Selecciona un canal para comenzar
          </div>
        )}

        {/* Message Stream */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-[#080f22]">
          {currentMessages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400 space-y-2">
              <MessageSquare className="w-10 h-10 text-slate-700" />
              <p className="text-sm font-semibold text-slate-300">No hay mensajes previos en este canal</p>
              <p className="text-xs max-w-xs">Escribe un saludo o inicia una conversación de negocios para conectar.</p>
            </div>
          ) : (
            currentMessages.map(msg => {
              const isMe = msg.authorId === currentUser.id;
              return (
                <div 
                  key={msg.id} 
                  className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isMe ? 'ml-auto flex-row-reverse' : ''}`}
                >
                  <img 
                    src={msg.authorAvatar} 
                    alt={msg.authorName} 
                    className="w-8 h-8 rounded-xl object-cover ring-1 ring-[#1b3164] shrink-0 mt-0.5" 
                  />
                  <div className={`space-y-1 ${isMe ? 'items-end text-right' : ''}`}>
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-bold text-white">{msg.authorName}</span>
                      <span>({msg.authorCompany})</span>
                      <span>• {msg.createdAt}</span>
                    </div>

                    <div className={`p-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isMe 
                        ? 'bg-gradient-to-r from-red-700 to-red-600 text-white font-medium rounded-tr-none shadow-md' 
                        : 'bg-[#101e3f] text-slate-100 rounded-tl-none border border-[#1b3164] shadow'
                    }`}>
                      {msg.content}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input Box */}
        <div className="p-3 sm:p-4 border-t border-[#1b3164] bg-[#070e20]">
          <form onSubmit={handleSend} className="flex items-center gap-2">
            <input 
              type="text"
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              placeholder={activeChannel ? `Mensaje para ${activeChannel.name}...` : 'Escribe tu mensaje...'}
              className="flex-1 px-4 py-2.5 rounded-2xl bg-[#0a1329] border border-[#1d346b] text-white placeholder:text-slate-500 text-xs sm:text-sm outline-none focus:border-red-500 transition"
            />
            <button
              type="submit"
              disabled={!messageText.trim()}
              className="p-2.5 sm:px-5 sm:py-2.5 rounded-2xl bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs sm:text-sm shadow-md transition flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
