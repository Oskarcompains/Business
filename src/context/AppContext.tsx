import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { 
  User, 
  Company, 
  ClubEvent, 
  EventRegistration, 
  Post, 
  Opportunity, 
  ChatChannel, 
  ChatMessage, 
  ClubPerk,
  ClubNotification,
  MembershipApplication,
  AttendanceStatus,
  UserRole
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_COMPANIES, 
  INITIAL_EVENTS, 
  INITIAL_REGISTRATIONS, 
  INITIAL_POSTS, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_CHANNELS, 
  INITIAL_MESSAGES, 
  INITIAL_PERKS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';

export type ActiveView = 
  | 'companies'
  | 'events'
  | 'users'
  | 'checkin'
  | 'directory'
  | 'dashboard'
  | 'community'
  | 'opportunities'
  | 'chat'
  | 'perks'
  | 'admin';

interface AppContextType {
  // Auth State
  isAuthenticated: boolean;
  login: (email: string, password?: string) => { success: boolean; error?: string };
  loginAsUser: (userId: string) => void;
  logout: () => void;
  membershipApplications: MembershipApplication[];
  submitMembershipApplication: (app: Omit<MembershipApplication, 'id' | 'submittedAt' | 'status'>) => void;
  approveMembershipApplication: (id: string) => void;

  // State
  currentUser: User;
  users: User[];
  companies: Company[];
  events: ClubEvent[];
  registrations: EventRegistration[];
  posts: Post[];
  opportunities: Opportunity[];
  channels: ChatChannel[];
  messages: Record<string, ChatMessage[]>;
  perks: ClubPerk[];
  notifications: ClubNotification[];
  activeView: ActiveView;
  selectedEventId: string | null;
  selectedCompanyId: string | null;
  selectedOpportunityId: string | null;
  activeChatChannelId: string | null;
  unreadNotificationsCount: number;
  unreadMessagesCount: number;

  // Actions - Navigation & Modals
  setActiveView: (view: ActiveView) => void;
  setSelectedEventId: (id: string | null) => void;
  setSelectedCompanyId: (id: string | null) => void;
  setSelectedOpportunityId: (id: string | null) => void;
  setActiveChatChannelId: (id: string | null) => void;
  startDirectChatWithUser: (targetUser: User) => void;
  startCompanyChat: (targetCompany: Company) => void;

  // Actions - User & Auth
  setCurrentUser: (user: User) => void;
  switchUserById: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  updateUser: (userId: string, updates: Partial<User>) => void;
  addUser: (newUser: Omit<User, 'id' | 'joinedAt'>) => void;
  deleteUser: (userId: string) => void;

  // Actions - Companies
  addCompany: (newCompany: Omit<Company, 'id' | 'joinedAt' | 'eventsAttendedCount'>) => void;
  updateCompany: (id: string, updates: Partial<Company>) => void;
  deleteCompany: (id: string) => void;

  // Actions - Events
  addEvent: (newEvent: Omit<ClubEvent, 'id'>) => void;
  updateEvent: (id: string, updates: Partial<ClubEvent>) => void;
  deleteEvent: (id: string) => void;
  registerForEvent: (eventId: string, hasCompanion?: boolean, companionName?: string) => boolean;
  cancelEventRegistration: (eventId: string) => void;
  updateAttendanceStatus: (registrationId: string, status: AttendanceStatus) => void;
  checkInByTicketCode: (ticketCode: string) => { success: boolean; registration?: EventRegistration; message: string };

  // Actions - Community Feed
  addPost: (content: string, category: Post['category'], image?: string, linkUrl?: string, linkTitle?: string, poll?: { question: string; options: string[] }) => void;
  toggleLikePost: (postId: string) => void;
  toggleBookmarkPost: (postId: string) => void;
  addPostComment: (postId: string, commentText: string) => void;
  voteInPoll: (postId: string, optionId: string) => void;

  // Actions - Opportunities
  addOpportunity: (opportunity: Omit<Opportunity, 'id' | 'createdAt' | 'isResolved' | 'savedByUserIds' | 'applicationsCount'>) => void;
  toggleSaveOpportunity: (opportunityId: string) => void;
  markOpportunityResolved: (opportunityId: string) => void;

  // Actions - Chat
  sendMessage: (channelId: string, content: string) => void;
  markChannelAsRead: (channelId: string) => void;

  // Actions - Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;

  // Reset demo
  resetToInitialDemo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  AUTH_STATUS: 'nexus_club_auth_v1',
  APPLICATIONS: 'nexus_club_applications_v1',
  USERS: 'nexus_club_users_v1',
  CURRENT_USER_ID: 'nexus_club_curr_user_id_v1',
  COMPANIES: 'nexus_club_companies_v1',
  EVENTS: 'nexus_club_events_v1',
  REGISTRATIONS: 'nexus_club_registrations_v1',
  POSTS: 'nexus_club_posts_v1',
  OPPORTUNITIES: 'nexus_club_opportunities_v1',
  CHANNELS: 'nexus_club_channels_v1',
  MESSAGES: 'nexus_club_messages_v1',
  NOTIFICATIONS: 'nexus_club_notifications_v1',
};

const INITIAL_APPLICATIONS: MembershipApplication[] = [
  {
    id: 'app-1',
    companyName: 'Navarra Solar Energy S.L.',
    cif: 'B-31998822',
    sector: 'Energías Renovables & Clima',
    contactName: 'Mikel Goñi Arana',
    contactRole: 'Director General',
    email: 'mikel.goni@navarrasolar.com',
    phone: '+34 688 221 100',
    website: 'https://navarrasolar.example.es',
    motivation: 'Queremos sumarnos a la red de empresas del club para desarrollar proyectos de eficiencia energética y autoconsumo industrial con otras empresas socias.',
    tierRequested: 'SOCIO_PREMIUM',
    submittedAt: '2026-03-12',
    status: 'PENDIENTE'
  }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Authentication state - defaults to false so the private login screen is experienced first!
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.AUTH_STATUS);
    return saved === 'true';
  });

  // Load from local storage or fallback to initial
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      try {
        const parsed: User[] = JSON.parse(saved);
        const hasAdmin = parsed.some(u => u.id === 'usr-admin' || u.email.toLowerCase() === 'admin@clubempresarial.es');
        if (!hasAdmin) {
          return [INITIAL_USERS[0], ...parsed];
        }
        return parsed;
      } catch {
        return INITIAL_USERS;
      }
    }
    return INITIAL_USERS;
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
    return saved || 'usr-3'; // Elena Vance (Empresa)
  });

  const currentUser = useMemo(() => {
    return users.find(u => u.id === currentUserId) || users[0] || INITIAL_USERS[0];
  }, [users, currentUserId]);

  const [membershipApplications, setMembershipApplications] = useState<MembershipApplication[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.APPLICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_APPLICATIONS;
  });

  const [companies, setCompanies] = useState<Company[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPANIES);
    return saved ? JSON.parse(saved) : INITIAL_COMPANIES;
  });

  const [events, setEvents] = useState<ClubEvent[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.EVENTS);
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [registrations, setRegistrations] = useState<EventRegistration[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.REGISTRATIONS);
    return saved ? JSON.parse(saved) : INITIAL_REGISTRATIONS;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
    return saved ? JSON.parse(saved) : INITIAL_POSTS;
  });

  const [opportunities, setOpportunities] = useState<Opportunity[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.OPPORTUNITIES);
    return saved ? JSON.parse(saved) : INITIAL_OPPORTUNITIES;
  });

  const [channels, setChannels] = useState<ChatChannel[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHANNELS);
    return saved ? JSON.parse(saved) : INITIAL_CHANNELS;
  });

  const [messages, setMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [notifications, setNotifications] = useState<ClubNotification[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const perks = INITIAL_PERKS;

  // Navigation & Selected items state
  const [activeView, setActiveView] = useState<ActiveView>('companies');
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [selectedOpportunityId, setSelectedOpportunityId] = useState<string | null>(null);
  const [activeChatChannelId, setActiveChatChannelId] = useState<string | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTH_STATUS, isAuthenticated ? 'true' : 'false');
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPLICATIONS, JSON.stringify(membershipApplications));
  }, [membershipApplications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANIES, JSON.stringify(companies));
  }, [companies]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REGISTRATIONS, JSON.stringify(registrations));
  }, [registrations]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.OPPORTUNITIES, JSON.stringify(opportunities));
  }, [opportunities]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHANNELS, JSON.stringify(channels));
  }, [channels]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Derived unread counts
  const unreadNotificationsCount = useMemo(() => {
    return notifications.filter(n => !n.read).length;
  }, [notifications]);

  const unreadMessagesCount = useMemo(() => {
    return channels.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [channels]);

  // Auth Actions
  const login = (emailOrUsername: string, _password?: string): { success: boolean; error?: string } => {
    const trimmed = emailOrUsername.trim().toLowerCase();

    // Check direct username "admin" or admin email
    if (trimmed === 'admin' || trimmed === 'admin@clubempresarial.es' || trimmed === 'admin@admin.com') {
      const adminUser = users.find(u => u.id === 'usr-admin' || u.email.toLowerCase() === 'admin@clubempresarial.es') || INITIAL_USERS[0];
      setCurrentUserId(adminUser.id);
      setIsAuthenticated(true);
      return { success: true };
    }

    const user = users.find(u => u.email.toLowerCase() === trimmed);
    if (user) {
      setCurrentUserId(user.id);
      setIsAuthenticated(true);
      return { success: true };
    }
    return {
      success: false,
      error: 'Usuario o contraseña incorrectos. Por favor, verifica tus datos de acceso.'
    };
  };

  const loginAsUser = (userId: string) => {
    const user = users.find(u => u.id === userId);
    if (user) {
      setCurrentUserId(user.id);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(STORAGE_KEYS.AUTH_STATUS);
  };

  const submitMembershipApplication = (app: Omit<MembershipApplication, 'id' | 'submittedAt' | 'status'>) => {
    const newApp: MembershipApplication = {
      ...app,
      id: `app-${Date.now()}`,
      submittedAt: new Date().toISOString().split('T')[0],
      status: 'PENDIENTE'
    };
    setMembershipApplications(prev => [newApp, ...prev]);

    // Send notification to superadmins
    const newNotif: ClubNotification = {
      id: `notif-${Date.now()}`,
      userId: 'usr-admin',
      title: 'Nueva solicitud de adhesión',
      message: `${newApp.companyName} ha solicitado unirse como ${newApp.tierRequested}. Contacto: ${newApp.contactName}.`,
      time: 'Hace un momento',
      read: false,
      type: 'announcement',
      linkTo: 'users'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const approveMembershipApplication = (appId: string) => {
    const app = membershipApplications.find(a => a.id === appId);
    if (!app) return;

    setMembershipApplications(prev => prev.map(a => a.id === appId ? { ...a, status: 'APROBADA' } : a));

    // Create company & user
    const newCompId = `comp-${Date.now()}`;
    const newComp: Company = {
      id: newCompId,
      name: app.companyName,
      sector: app.sector,
      tier: app.tierRequested,
      description: app.motivation,
      website: app.website || 'https://empresa.es',
      location: 'Pamplona / Navarra',
      logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=256',
      employeesCount: 20,
      contactPersons: [{
        name: app.contactName,
        role: app.contactRole,
        email: app.email,
        phone: app.phone,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        isPrimary: true
      }],
      services: ['Servicios Empresariales', app.sector],
      offers: ['Condiciones exclusivas para socios'],
      seeking: ['Networking y alianzas estratégicas'],
      tags: [app.sector, 'Nuevo Socio', 'Navarra'],
      joinedAt: new Date().toISOString().split('T')[0],
      eventsAttendedCount: 0
    };
    setCompanies(prev => [newComp, ...prev]);
  };

  // User Actions
  const setCurrentUser = (user: User) => {
    setCurrentUserId(user.id);
  };

  const switchUserById = (userId: string) => {
    setCurrentUserId(userId);
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
  };

  const updateUser = (userId: string, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updates } : u));
  };

  const addUser = (newUser: Omit<User, 'id' | 'joinedAt'>) => {
    const user: User = {
      ...newUser,
      id: `usr-${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0]
    };
    setUsers(prev => [...prev, user]);
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  // Company Actions
  const addCompany = (newCompany: Omit<Company, 'id' | 'joinedAt' | 'eventsAttendedCount'>) => {
    const comp: Company = {
      ...newCompany,
      id: `comp-${Date.now()}`,
      joinedAt: new Date().toISOString().split('T')[0],
      eventsAttendedCount: 0
    };
    setCompanies(prev => [comp, ...prev]);
  };

  const updateCompany = (id: string, updates: Partial<Company>) => {
    setCompanies(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteCompany = (id: string) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
  };

  // Event Actions
  const addEvent = (newEvent: Omit<ClubEvent, 'id'>) => {
    const evt: ClubEvent = {
      ...newEvent,
      id: `evt-${Date.now()}`
    };
    setEvents(prev => [evt, ...prev]);

    // Also auto-create a dedicated event chat channel!
    const eventChannel: ChatChannel = {
      id: `chan-evt-${evt.id}`,
      type: 'event',
      name: `🎪 ${evt.title.substring(0, 35)}...`,
      avatar: evt.bannerImage,
      eventId: evt.id,
      participantIds: [currentUser.id],
      lastMessage: {
        content: `Canal oficial del evento ${evt.title}.`,
        timestamp: 'Ahora',
        senderName: 'Sistema'
      },
      unreadCount: 0
    };
    setChannels(prev => [eventChannel, ...prev]);
    setMessages(prev => ({
      ...prev,
      [eventChannel.id]: [{
        id: `msg-sys-${Date.now()}`,
        senderId: 'sys',
        senderName: 'ClubNexus Oficial',
        senderAvatar: '/icon.svg',
        content: `Bienvenido al canal oficial para asistentes a ${evt.title}. Conéctate con otros participantes antes del evento.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        readBy: []
      }]
    }));
  };

  const updateEvent = (id: string, updates: Partial<ClubEvent>) => {
    setEvents(prev => prev.map(e => e.id === id ? { ...e, ...updates } : e));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setRegistrations(prev => prev.filter(r => r.eventId !== id));
  };

  const registerForEvent = (eventId: string, hasCompanion: boolean = false, companionName?: string): boolean => {
    // Check if already registered
    const existing = registrations.find(r => r.eventId === eventId && r.userId === currentUser.id);
    if (existing) return false;

    const event = events.find(e => e.id === eventId);
    if (!event) return false;

    // Generate unique verifiable ticket code
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketCode = `NEXUS-${eventId.toUpperCase()}-${currentUser.id.toUpperCase()}-${randomSuffix}`;

    const newReg: EventRegistration = {
      id: `reg-${Date.now()}`,
      eventId,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userCompany: currentUser.companyName,
      userRole: currentUser.role,
      registeredAt: new Date().toISOString(),
      status: 'Confirmado',
      ticketCode,
      hasCompanion,
      companionName
    };

    setRegistrations(prev => [newReg, ...prev]);

    // Add notification
    const notif: ClubNotification = {
      id: `notif-${Date.now()}`,
      userId: currentUser.id,
      title: 'Inscripción Confirmada',
      message: `Has quedado inscrito a "${event.title}". Tu pase QR ya está disponible en tu panel.`,
      time: 'Ahora',
      read: false,
      type: 'event',
      linkTo: 'events'
    };
    setNotifications(prev => [notif, ...prev]);

    return true;
  };

  const cancelEventRegistration = (eventId: string) => {
    setRegistrations(prev => prev.filter(r => !(r.eventId === eventId && r.userId === currentUser.id)));
  };

  const updateAttendanceStatus = (registrationId: string, status: AttendanceStatus) => {
    setRegistrations(prev => prev.map(r => {
      if (r.id === registrationId) {
        return {
          ...r,
          status,
          checkedInAt: status === 'Asistente' ? (r.checkedInAt || new Date().toISOString()) : r.checkedInAt
        };
      }
      return r;
    }));
  };

  const checkInByTicketCode = (ticketCode: string): { success: boolean; registration?: EventRegistration; message: string } => {
    const cleanCode = ticketCode.trim();
    const reg = registrations.find(r => r.ticketCode.toUpperCase() === cleanCode.toUpperCase());
    
    if (!reg) {
      return { success: false, message: 'Código QR no encontrado en la base de datos de inscripciones.' };
    }

    if (reg.status === 'Asistente') {
      return { 
        success: true, 
        registration: reg, 
        message: `Aviso: ${reg.userName} (${reg.userCompany}) ya había realizado el check-in previamente.` 
      };
    }

    if (reg.status === 'Cancelado') {
      return { success: false, registration: reg, message: 'Esta inscripción fue cancelada previamente.' };
    }

    // Mark as checked in!
    updateAttendanceStatus(reg.id, 'Asistente');
    return {
      success: true,
      registration: { ...reg, status: 'Asistente', checkedInAt: new Date().toISOString() },
      message: `¡Check-in verificado con éxito! Bienvenido ${reg.userName} (${reg.userCompany}).`
    };
  };

  // Community Feed Actions
  const addPost = (
    content: string, 
    category: Post['category'], 
    image?: string, 
    linkUrl?: string, 
    linkTitle?: string, 
    pollData?: { question: string; options: string[] }
  ) => {
    let poll = undefined;
    if (pollData && pollData.question && pollData.options.length > 1) {
      poll = {
        question: pollData.question,
        options: pollData.options.map((opt, i) => ({
          id: `opt-${Date.now()}-${i}`,
          text: opt,
          votes: 0,
          voterUserIds: []
        }))
      };
    }

    const newPost: Post = {
      id: `post-${Date.now()}`,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorAvatar: currentUser.avatar,
      authorPosition: currentUser.position,
      authorCompany: currentUser.companyName,
      companyId: currentUser.companyId,
      content,
      category,
      createdAt: 'Ahora mismo',
      likes: [],
      comments: [],
      bookmarks: [],
      image,
      linkUrl,
      linkTitle,
      poll,
      isSponsored: currentUser.role === 'PATROCINADOR'
    };

    setPosts(prev => [newPost, ...prev]);
  };

  const toggleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const hasLiked = p.likes.includes(currentUser.id);
      return {
        ...p,
        likes: hasLiked ? p.likes.filter(id => id !== currentUser.id) : [...p.likes, currentUser.id]
      };
    }));
  };

  const toggleBookmarkPost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      const hasBookmarked = p.bookmarks.includes(currentUser.id);
      return {
        ...p,
        bookmarks: hasBookmarked ? p.bookmarks.filter(id => id !== currentUser.id) : [...p.bookmarks, currentUser.id]
      };
    }));
  };

  const addPostComment = (postId: string, commentText: string) => {
    if (!commentText.trim()) return;
    const comment = {
      id: `comm-${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userCompany: currentUser.companyName,
      content: commentText.trim(),
      createdAt: 'Ahora'
    };
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p;
      return { ...p, comments: [...p.comments, comment] };
    }));
  };

  const voteInPoll = (postId: string, optionId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id !== postId || !p.poll) return p;
      // Check if user already voted in this poll
      const userAlreadyVoted = p.poll.options.some(opt => opt.voterUserIds.includes(currentUser.id));
      if (userAlreadyVoted) return p;

      return {
        ...p,
        poll: {
          ...p.poll,
          options: p.poll.options.map(opt => {
            if (opt.id === optionId) {
              return {
                ...opt,
                votes: opt.votes + 1,
                voterUserIds: [...opt.voterUserIds, currentUser.id]
              };
            }
            return opt;
          })
        }
      };
    }));
  };

  // Opportunities Actions
  const addOpportunity = (opp: Omit<Opportunity, 'id' | 'createdAt' | 'isResolved' | 'savedByUserIds' | 'applicationsCount'>) => {
    const newOpp: Opportunity = {
      ...opp,
      id: `opp-${Date.now()}`,
      createdAt: 'Hoy',
      isResolved: false,
      savedByUserIds: [],
      applicationsCount: 0
    };
    setOpportunities(prev => [newOpp, ...prev]);
  };

  const toggleSaveOpportunity = (opportunityId: string) => {
    setOpportunities(prev => prev.map(opp => {
      if (opp.id !== opportunityId) return opp;
      const isSaved = opp.savedByUserIds.includes(currentUser.id);
      return {
        ...opp,
        savedByUserIds: isSaved 
          ? opp.savedByUserIds.filter(id => id !== currentUser.id)
          : [...opp.savedByUserIds, currentUser.id]
      };
    }));
  };

  const markOpportunityResolved = (opportunityId: string) => {
    setOpportunities(prev => prev.map(opp => {
      if (opp.id === opportunityId) {
        return { ...opp, isResolved: !opp.isResolved };
      }
      return opp;
    }));
  };

  // Chat Actions
  const sendMessage = (channelId: string, content: string) => {
    if (!content.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      senderCompany: currentUser.companyName,
      content: content.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      readBy: [currentUser.id]
    };

    setMessages(prev => ({
      ...prev,
      [channelId]: [...(prev[channelId] || []), newMsg]
    }));

    // Update last message in channel
    setChannels(prev => prev.map(ch => {
      if (ch.id === channelId) {
        return {
          ...ch,
          lastMessage: {
            content: newMsg.content,
            timestamp: newMsg.timestamp,
            senderName: newMsg.senderName
          }
        };
      }
      return ch;
    }));
  };

  const markChannelAsRead = (channelId: string) => {
    setChannels(prev => prev.map(ch => ch.id === channelId ? { ...ch, unreadCount: 0 } : ch));
  };

  const startDirectChatWithUser = (targetUser: User) => {
    // Find existing or create direct channel
    const existing = channels.find(c => 
      c.type === 'direct' && 
      c.participantIds.includes(currentUser.id) && 
      c.participantIds.includes(targetUser.id)
    );

    if (existing) {
      setActiveChatChannelId(existing.id);
      setActiveView('chat');
      return;
    }

    const newChan: ChatChannel = {
      id: `chan-direct-${Date.now()}`,
      type: 'direct',
      name: `${targetUser.name} (${targetUser.companyName})`,
      avatar: targetUser.avatar,
      participantIds: [currentUser.id, targetUser.id],
      unreadCount: 0
    };

    setChannels(prev => [newChan, ...prev]);
    setActiveChatChannelId(newChan.id);
    setActiveView('chat');
  };

  const startCompanyChat = (targetCompany: Company) => {
    const existing = channels.find(c => 
      c.type === 'company' && c.companyId === targetCompany.id
    );

    if (existing) {
      setActiveChatChannelId(existing.id);
      setActiveView('chat');
      return;
    }

    const newChan: ChatChannel = {
      id: `chan-comp-${Date.now()}`,
      type: 'company',
      name: `${targetCompany.name} (B2B)`,
      avatar: targetCompany.logo,
      companyId: targetCompany.id,
      participantIds: [currentUser.id],
      unreadCount: 0
    };

    setChannels(prev => [newChan, ...prev]);
    setActiveChatChannelId(newChan.id);
    setActiveView('chat');
  };

  // Notification actions
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const resetToInitialDemo = () => {
    localStorage.clear();
    setUsers(INITIAL_USERS);
    setCurrentUserId('usr-3');
    setCompanies(INITIAL_COMPANIES);
    setEvents(INITIAL_EVENTS);
    setRegistrations(INITIAL_REGISTRATIONS);
    setPosts(INITIAL_POSTS);
    setOpportunities(INITIAL_OPPORTUNITIES);
    setChannels(INITIAL_CHANNELS);
    setMessages(INITIAL_MESSAGES);
    setNotifications(INITIAL_NOTIFICATIONS);
    setActiveView('dashboard');
  };

  return (
    <AppContext.Provider
      value={{
        // Auth
        isAuthenticated,
        login,
        loginAsUser,
        logout,
        membershipApplications,
        submitMembershipApplication,
        approveMembershipApplication,

        currentUser,
        users,
        companies,
        events,
        registrations,
        posts,
        opportunities,
        channels,
        messages,
        perks,
        notifications,
        activeView,
        selectedEventId,
        selectedCompanyId,
        selectedOpportunityId,
        activeChatChannelId,
        unreadNotificationsCount,
        unreadMessagesCount,

        setActiveView,
        setSelectedEventId,
        setSelectedCompanyId,
        setSelectedOpportunityId,
        setActiveChatChannelId,
        startDirectChatWithUser,
        startCompanyChat,

        setCurrentUser,
        switchUserById,
        updateUserRole,
        updateUser,
        addUser,
        deleteUser,

        addCompany,
        updateCompany,
        deleteCompany,

        addEvent,
        updateEvent,
        deleteEvent,
        registerForEvent,
        cancelEventRegistration,
        updateAttendanceStatus,
        checkInByTicketCode,

        addPost,
        toggleLikePost,
        toggleBookmarkPost,
        addPostComment,
        voteInPoll,

        addOpportunity,
        toggleSaveOpportunity,
        markOpportunityResolved,

        sendMessage,
        markChannelAsRead,

        markNotificationAsRead,
        markAllNotificationsAsRead,

        resetToInitialDemo
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
