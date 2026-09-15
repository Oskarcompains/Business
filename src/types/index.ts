export type UserRole = 
  | 'SUPERADMIN' 
  | 'ADMIN' 
  | 'EMPRESA' 
  | 'REPRESENTANTE' 
  | 'PATROCINADOR' 
  | 'INVITADO';

export type CompanyTier = 
  | 'PATROCINADOR_GOLD' 
  | 'PATROCINADOR_SILVER' 
  | 'SOCIO_FUNDADOR' 
  | 'SOCIO_PREMIUM' 
  | 'SOCIO_ESTANDAR' 
  | 'INVITADO';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  position: string;
  companyId: string;
  companyName: string;
  bio?: string;
  phone?: string;
  linkedin?: string;
  joinedAt: string;
  isOnline?: boolean;
}

export interface Company {
  id: string;
  name: string;
  legalName?: string;
  cif?: string;
  logo: string;
  coverImage?: string;
  sector: string;
  tier: CompanyTier;
  description: string;
  website: string;
  location: string;
  address?: string;
  employeesCount: number;
  contactPersons: {
    name: string;
    role: string;
    email: string;
    phone?: string;
    avatar: string;
    isPrimary?: boolean;
  }[];
  services: string[];
  offers: string[];
  seeking: string[];
  tags: string[];
  joinedAt: string;
  eventsAttendedCount: number;
  linkedinUrl?: string;
  twitterUrl?: string;
  instagramUrl?: string;
  featured?: boolean;
  sponsorStats?: {
    impressions: number;
    clicks: number;
    leads: number;
  };
}

export type EventType = 
  | 'Networking' 
  | 'Desayuno empresarial' 
  | 'Afterwork' 
  | 'Conferencia' 
  | 'Formación' 
  | 'Visita empresarial' 
  | 'Evento deportivo' 
  | 'Presentación' 
  | 'Evento VIP';

export type EventStatus = 
  | 'PRÓXIMAMENTE' 
  | 'INSCRIPCIONES ABIERTAS' 
  | 'COMPLETO' 
  | 'FINALIZADO' 
  | 'CANCELADO';

export type AttendanceStatus = 
  | 'Inscrito' 
  | 'Confirmado' 
  | 'Asistente' 
  | 'No presentado' 
  | 'Cancelado';

export type RegistrationStatus = AttendanceStatus;

export interface Speaker {
  id: string;
  name: string;
  title: string;
  company: string;
  avatar: string;
  bio: string;
}

export interface AgendaItem {
  time: string;
  title: string;
  description?: string;
  speaker?: string;
}

export interface EventRegistration {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userEmail: string;
  userCompany: string;
  userRole: UserRole;
  registeredAt: string;
  status: AttendanceStatus;
  ticketCode: string;
  hasCompanion: boolean;
  companionName?: string;
  checkedInAt?: string;
}

export interface ClubEvent {
  id: string;
  title: string;
  description: string;
  type: EventType;
  status: EventStatus;
  date: string;
  time: string;
  endTime?: string;
  location: string;
  address: string;
  coordinates?: { lat: number; lng: number };
  capacity: number;
  bannerImage: string;
  organizer: string;
  partnerCompanies: string[];
  sponsorCompanyIds: string[];
  targetAudience: string;
  program: AgendaItem[];
  speakers: Speaker[];
  attachments: { name: string; url: string; size: string }[];
  photos?: string[];
  allowCompanions: boolean;
  vipOnly?: boolean;
}

export type PostCategory = 
  | 'GENERAL' 
  | 'NETWORKING' 
  | 'BUSCO' 
  | 'OFREZCO' 
  | 'OPORTUNIDADES' 
  | 'EVENTOS' 
  | 'EMPLEO' 
  | 'PROMOCIONES' 
  | 'COLABORACIONES'
  | 'COMUNICADO_OFICIAL'
  | 'HITO_EMPRESARIAL'
  | 'ENCUESTA'
  | 'PREGUNTA'
  | 'BIENVENIDA'
  | 'NOTICIA';

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voterUserIds: string[];
}

export interface PostComment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userCompany: string;
  content: string;
  createdAt: string;
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorPosition: string;
  authorCompany: string;
  companyId: string;
  content: string;
  category: PostCategory;
  createdAt: string;
  likes: string[]; // user IDs
  comments: PostComment[];
  bookmarks: string[]; // user IDs
  image?: string;
  linkUrl?: string;
  linkTitle?: string;
  document?: { name: string; size: string };
  poll?: {
    question: string;
    options: PollOption[];
  };
  isSponsored?: boolean;
}

export type OpportunityType = 'BUSCO' | 'OFREZCO' | 'COLABORACIÓN' | 'COLABORACION';

export interface Opportunity {
  id: string;
  title: string;
  description: string;
  type: OpportunityType;
  sector: string;
  companyId: string;
  companyName: string;
  companyLogo: string;
  authorId: string;
  authorName: string;
  createdAt: string;
  deadline?: string;
  budgetEstimate?: string;
  tags: string[];
  isResolved: boolean;
  savedByUserIds: string[];
  applicationsCount: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderCompany?: string;
  content: string;
  timestamp: string;
  readBy: string[];
}

export interface ChatChannel {
  id: string;
  type: 'direct' | 'company' | 'group' | 'event';
  name: string;
  avatar?: string;
  participantIds: string[];
  companyId?: string;
  eventId?: string;
  lastMessage?: {
    content: string;
    timestamp: string;
    senderName: string;
  };
  unreadCount?: number;
}

export interface ClubPerk {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  discount: string;
  description: string;
  code?: string;
  expiry: string;
  category: string;
}

export interface ClubNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'event' | 'opportunity' | 'connection' | 'chat' | 'announcement';
  linkTo?: string;
}

export interface MembershipApplication {
  id: string;
  companyName: string;
  cif?: string;
  sector: string;
  contactName: string;
  contactRole: string;
  email: string;
  phone: string;
  website?: string;
  motivation: string;
  tierRequested: CompanyTier;
  submittedAt: string;
  status: 'PENDIENTE' | 'APROBADA' | 'RECHAZADA';
}
