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
  ClubNotification
} from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'usr-admin',
    name: 'Administrador',
    email: 'admin@clubempresarial.es',
    role: 'SUPERADMIN',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
    position: 'Administrador General',
    companyId: 'comp-club',
    companyName: 'Club de Empresas Rojillo',
    bio: 'Administrador principal del Club de Empresas (acceso directo admin/admin). Control total de socios, eventos, acreditaciones y auditoría.',
    phone: '+34 600 000 000',
    linkedin: 'https://linkedin.com',
    joinedAt: '2023-01-01',
    isOnline: true
  },
  {
    id: 'usr-1',
    name: 'Sofía Navarro',
    email: 'sofia.navarro@clubempresarial.es',
    role: 'SUPERADMIN',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    position: 'Presidenta Ejecutiva',
    companyId: 'comp-club',
    companyName: 'Club Empresarial ClubNexus',
    bio: 'Liderando el ecosistema empresarial, alianzas institucionales e inversión estratégica en España y LATAM.',
    phone: '+34 600 112 233',
    linkedin: 'https://linkedin.com/in/sofianavarro',
    joinedAt: '2023-01-15',
    isOnline: true
  },
  {
    id: 'usr-2',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@clubempresarial.es',
    role: 'ADMIN',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
    position: 'Director de Operaciones y Comunidad',
    companyId: 'comp-club',
    companyName: 'Club Empresarial ClubNexus',
    bio: 'Gestión de miembros, coordinación de eventos ejecutivos y dinamización del ecosistema B2B.',
    phone: '+34 611 223 344',
    linkedin: 'https://linkedin.com/in/carlosmendoza',
    joinedAt: '2023-03-01',
    isOnline: true
  },
  {
    id: 'usr-3',
    name: 'Elena Vance',
    email: 'elena@nexusfintech.com',
    role: 'EMPRESA',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
    position: 'CEO & Co-founder',
    companyId: 'comp-1',
    companyName: 'Nexus Fintech & Payments',
    bio: 'Pioneros en infraestructura de pagos transfronterizos y API banking para medianas y grandes corporaciones.',
    phone: '+34 622 334 455',
    linkedin: 'https://linkedin.com/in/elenavance',
    joinedAt: '2023-06-10',
    isOnline: true
  },
  {
    id: 'usr-4',
    name: 'Javier Ruiz Salmerón',
    email: 'j.ruiz@atlascapital.es',
    role: 'PATROCINADOR',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
    position: 'Managing Partner',
    companyId: 'comp-2',
    companyName: 'Atlas Capital Group',
    bio: 'Banca de inversión boutique, M&A corporativo y estructuración de deuda para crecimiento internacional.',
    phone: '+34 633 445 566',
    linkedin: 'https://linkedin.com/in/javierruiz',
    joinedAt: '2023-04-20',
    isOnline: true
  },
  {
    id: 'usr-5',
    name: 'Lucía Gómez',
    email: 'lucia.gomez@nexusfintech.com',
    role: 'REPRESENTANTE',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
    position: 'Head of Strategic Partnerships',
    companyId: 'comp-1',
    companyName: 'Nexus Fintech & Payments',
    bio: 'Conectando productos fintech con redes de distribución bancaria y canales B2B.',
    phone: '+34 644 556 677',
    linkedin: 'https://linkedin.com/in/luciagomez',
    joinedAt: '2023-09-12',
    isOnline: false
  },
  {
    id: 'usr-6',
    name: 'Daniel Ortega',
    email: 'daniel.ortega@biomedlabs.es',
    role: 'INVITADO',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
    position: 'Director de Innovación',
    companyId: 'comp-guest',
    companyName: 'BioMed Labs Health',
    bio: 'Buscando alianzas comerciales y proveedores de digitalización para el sector sociosanitario.',
    phone: '+34 655 667 788',
    linkedin: 'https://linkedin.com/in/danielortega',
    joinedAt: '2024-02-01',
    isOnline: true
  }
];

export const INITIAL_COMPANIES: Company[] = [
  {
    id: 'comp-2',
    name: 'Atlas Capital Group',
    legalName: 'Atlas Capital Advisors S.L.',
    cif: 'B-88741290',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=180',
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    sector: 'Banca & Servicios Financieros',
    tier: 'PATROCINADOR_GOLD',
    description: 'Banca de inversión y asesoramiento en fusiones y adquisiciones (M&A), rondas de financiación y estructuración de deuda patrimonial para empresas en fase de aceleración y consolidación.',
    website: 'https://atlascapital.es',
    location: 'Madrid, Paseo de la Castellana 95',
    address: 'Paseo de la Castellana 95, Planta 18, 28046 Madrid',
    employeesCount: 45,
    contactPersons: [
      {
        name: 'Javier Ruiz Salmerón',
        role: 'Managing Partner',
        email: 'j.ruiz@atlascapital.es',
        phone: '+34 91 555 8899',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
        isPrimary: true
      },
      {
        name: 'Patricia Morales',
        role: 'Directora de M&A',
        email: 'p.morales@atlascapital.es',
        avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=256'
      }
    ],
    services: [
      'Asesoramiento en M&A y venta de compañías',
      'Rondas de capital privado (Private Equity / Venture)',
      'Financiación estructurada y bonos corporativos',
      'Valoración técnica de empresas'
    ],
    offers: [
      'Diagnóstico de valoración preliminar gratuito para socios del Club',
      'Acceso prioritario a club deal investors'
    ],
    seeking: [
      'Empresas en facturación superior a 3M€ buscando venta o socio inversor',
      'Startups tecnológicas en rentabilidad'
    ],
    tags: ['Finanzas', 'M&A', 'Inversión', 'Venture Capital', 'Estrategia'],
    joinedAt: '2023-04-20',
    eventsAttendedCount: 14,
    linkedinUrl: 'https://linkedin.com/company/atlas-capital-group',
    featured: true,
    sponsorStats: {
      impressions: 12450,
      clicks: 840,
      leads: 38
    }
  },
  {
    id: 'comp-1',
    name: 'Nexus Fintech & Payments',
    legalName: 'Nexus Digital Technologies S.A.',
    cif: 'A-78901234',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=180',
    coverImage: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?auto=format&fit=crop&q=80&w=1200',
    sector: 'Tecnología & Software',
    tier: 'SOCIO_FUNDADOR',
    description: 'Plataforma líder en pasarelas de pago unificadas, conciliación bancaria automatizada con IA y emisión de tarjetas corporativas virtuales.',
    website: 'https://nexusfintech.com',
    location: 'Barcelona, 22@ Innovation District',
    address: 'Carrer de Pallars 108, 08018 Barcelona',
    employeesCount: 90,
    contactPersons: [
      {
        name: 'Elena Vance',
        role: 'CEO & Co-founder',
        email: 'elena@nexusfintech.com',
        phone: '+34 93 400 1200',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
        isPrimary: true
      },
      {
        name: 'Lucía Gómez',
        role: 'Head of Strategic Partnerships',
        email: 'lucia.gomez@nexusfintech.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256'
      }
    ],
    services: [
      'Pasarela de cobro multidivisa (SEPA, Swift, Cards)',
      'Automatización de cobros recurrentes B2B',
      'API de conciliación fiscal con ERPs',
      'Tarjetas de crédito corporativas con control de gasto'
    ],
    offers: [
      'Tarifa preferencial 0.8% sin comisiones fijas los primeros 6 meses',
      'Integración API guiada y soporte técnico 24/7'
    ],
    seeking: [
      'Empresas de e-commerce y SaaS B2B con facturación internacional',
      'Despachos legales y consultoras para acuerdos de canal'
    ],
    tags: ['Fintech', 'SaaS', 'Pagos', 'B2B', 'Innovación'],
    joinedAt: '2023-06-10',
    eventsAttendedCount: 18,
    linkedinUrl: 'https://linkedin.com/company/nexus-fintech',
    featured: true
  },
  {
    id: 'comp-3',
    name: 'Vórtex Cloud & Artificial Intelligence',
    legalName: 'Vortex Applied Cognitive Systems S.L.',
    cif: 'B-67123901',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=180',
    coverImage: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=1200',
    sector: 'Inteligencia Artificial & Cloud',
    tier: 'PATROCINADOR_SILVER',
    description: 'Especialistas en arquitecturas cloud en Google Cloud y Azure, modernización de datos y desarrollo de modelos de lenguaje e IA generativa para optimización operativa.',
    website: 'https://vortex-cloud.io',
    location: 'Madrid / Remoto',
    address: 'Calle Orense 34, 28020 Madrid',
    employeesCount: 65,
    contactPersons: [
      {
        name: 'Marcos Benítez',
        role: 'CTO & Socio Director',
        email: 'marcos@vortex-cloud.io',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
        isPrimary: true
      }
    ],
    services: [
      'Auditoría y migración de infraestructura a la nube',
      'Agentes IA conversacionales y automatización RPA',
      'Business Intelligence y data warehouses en BigQuery',
      'Ciberseguridad y cumplimiento ISO 27001'
    ],
    offers: [
      'Auditoría de costes de infraestructura cloud sin compromiso',
      '20% de descuento en el primer PoC de Inteligencia Artificial'
    ],
    seeking: [
      'Compañías medianas que quieran reducir sus facturas de servidores',
      'Empresas industriales para proyectos de analítica predictiva'
    ],
    tags: ['Cloud', 'IA Generativa', 'Google Cloud', 'Ciberseguridad', 'Big Data'],
    joinedAt: '2023-08-15',
    eventsAttendedCount: 11,
    linkedinUrl: 'https://linkedin.com/company/vortex-ai',
    featured: true,
    sponsorStats: {
      impressions: 8900,
      clicks: 520,
      leads: 21
    }
  },
  {
    id: 'comp-4',
    name: 'Iberia Legal & Tax Partners',
    legalName: 'Iberia Asesores Legales y Tributarios S.L.P.',
    cif: 'B-83492810',
    logo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=180',
    coverImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200',
    sector: 'Legal & Asesoría Fiscal',
    tier: 'SOCIO_PREMIUM',
    description: 'Despacho de abogados multidisciplinar enfocado en asesoramiento mercantil, fiscalidad internacional, compliance y pactos de socios.',
    website: 'https://iberialegal.es',
    location: 'Valencia & Madrid',
    address: 'Calle Colón 22, 46004 Valencia',
    employeesCount: 30,
    contactPersons: [
      {
        name: 'Clara Domínguez',
        role: 'Socia de Derecho Mercantil',
        email: 'clara.dominguez@iberialegal.es',
        avatar: 'https://images.unsplash.com/photo-1573496799652-408c2ac9fe98?auto=format&fit=crop&q=80&w=256',
        isPrimary: true
      }
    ],
    services: [
      'Redacción y negociación de pactos de socios',
      'Planificación fiscal y deducciones I+D+i',
      'Protección de datos y RGPD para plataformas web',
      'Litigación mercantil y arbitraje corporativo'
    ],
    offers: [
      '1ª Sesión de consultoría estratégica fiscal de 1 hora gratuita',
      'Tarifa plana preferencial para miembros del club'
    ],
    seeking: [
      'Startups en proceso de captación de capital',
      'Grupos empresariales con operaciones en el extranjero'
    ],
    tags: ['Legal', 'Fiscal', 'Mercantil', 'Compliance', 'Pactos de Socios'],
    joinedAt: '2023-05-18',
    eventsAttendedCount: 16,
    linkedinUrl: 'https://linkedin.com/company/iberia-legal',
    featured: false
  },
  {
    id: 'comp-5',
    name: 'Sabor & Eventos Gourmet',
    legalName: 'Alta Hostelería y Eventos S.L.',
    cif: 'B-74910283',
    logo: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=180',
    coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1200',
    sector: 'Catering & Eventos Corporativos',
    tier: 'SOCIO_ESTANDAR',
    description: 'Servicio exclusivo de catering para convenciones, cenas de gala, desayunos de trabajo y coffee breaks ejecutivos con productos de proximidad.',
    website: 'https://saborgourmetevents.es',
    location: 'Madrid & Toledo',
    address: 'Avenida de América 14, 28028 Madrid',
    employeesCount: 28,
    contactPersons: [
      {
        name: 'Mateo Cárdenas',
        role: 'Director de Catering y Eventos',
        email: 'mateo@saborgourmetevents.es',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=256',
        isPrimary: true
      }
    ],
    services: [
      'Coffee breaks y desayunos de networking saludable',
      'Cocktails ejecutivos y cenas de gala',
      'Showcooking en vivo para presentaciones de producto',
      'Gestión de fincas y espacios singulares'
    ],
    offers: [
      'Degustación de menú previa gratuita para eventos de más de 80 asistentes',
      '15% de descuento en el primer evento contratado por socios'
    ],
    seeking: [
      'Empresas que organicen eventos de más de 50 personas',
      'Agencias de marketing y congresos'
    ],
    tags: ['Catering', 'Gastronomía', 'Eventos', 'Coffee Break', 'Networking'],
    joinedAt: '2023-11-04',
    eventsAttendedCount: 22,
    linkedinUrl: 'https://linkedin.com/company/sabor-eventos',
    featured: false
  },
  {
    id: 'comp-6',
    name: 'Prisma Creativa 360',
    legalName: 'Prisma Media Lab Studios S.L.',
    cif: 'B-92384712',
    logo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=180',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&q=80&w=1200',
    sector: 'Audiovisual & Branding',
    tier: 'SOCIO_ESTANDAR',
    description: 'Estudio de producción audiovisual, spots publicitarios, cobertura integral de congresos corporativos y diseño de identidad de marca.',
    website: 'https://prismacreativa.es',
    location: 'Madrid, Barrio de Salamanca',
    address: 'Calle Serrano 62, 28001 Madrid',
    employeesCount: 16,
    contactPersons: [
      {
        name: 'Sara Villanueva',
        role: 'Directora Creativa',
        email: 'sara@prismacreativa.es',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256',
        isPrimary: true
      }
    ],
    services: [
      'Grabación y streaming en directo multicámara para eventos',
      'Vídeos corporativos y testimoniales de clientes B2B',
      'Branding, naming y rediseño de manuales de marca',
      'Fotografía ejecutiva para LinkedIn y web'
    ],
    offers: [
      'Reportaje fotográfico profesional de cortesía al contratar streaming de evento',
      'Pack de 5 vídeos en formato vertical (Reels/TikTok) con 25% dto.'
    ],
    seeking: [
      'Marcas que organicen congresos anuales o presentaciones',
      'Empresas en proceso de rebranding'
    ],
    tags: ['Audiovisual', 'Streaming', 'Vídeo', 'Branding', 'Fotografía'],
    joinedAt: '2024-01-10',
    eventsAttendedCount: 9,
    linkedinUrl: 'https://linkedin.com/company/prisma-creativa',
    featured: false
  },
  {
    id: 'comp-7',
    name: 'SmartSpace Corporate Hub',
    legalName: 'SmartSpace Coworking & Offices S.L.',
    cif: 'B-81928374',
    logo: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=180',
    coverImage: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1200',
    sector: 'Inmobiliario & Espacios de Trabajo',
    tier: 'SOCIO_PREMIUM',
    description: 'Red de espacios de trabajo flexibles, despachos corporativos y auditorios para eventos empresariales con tecnología de vanguardia.',
    website: 'https://smartspacehub.com',
    location: 'Madrid (4 sedes) & Barcelona (2 sedes)',
    address: 'Paseo de la Habana 26, 28036 Madrid',
    employeesCount: 35,
    contactPersons: [
      {
        name: 'Guillermo Serrano',
        role: 'Director de Expansión Corporativa',
        email: 'guillermo@smartspacehub.com',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=256',
        isPrimary: true
      }
    ],
    services: [
      'Alquiler de auditorios y salas de formación con streaming',
      'Puestos de coworking flex y despachos privados',
      'Salas de reuniones con videoconferencia 4K',
      'Domiciliación social y fiscal para empresas'
    ],
    offers: [
      '2 horas mensuales de sala de juntas gratuita para socios del Club',
      '20% de descuento en el alquiler del Auditorio Principal para eventos corporativos'
    ],
    seeking: [
      'Compañías que busquen sedes representativas sin permanencias',
      'Organizadores de cursos y formaciones'
    ],
    tags: ['Oficinas', 'Coworking', 'Auditorio', 'Salas de Reuniones', 'Eventos'],
    joinedAt: '2023-02-15',
    eventsAttendedCount: 25,
    linkedinUrl: 'https://linkedin.com/company/smartspace-hub',
    featured: true
  }
];

export const INITIAL_EVENTS: ClubEvent[] = [
  {
    id: 'evt-1',
    title: 'Gran Encuentro Anual de Networking Empresarial & Cóctel VIP',
    description: 'El evento insignia del Club Nexus que reúne a más de 120 directores generales, fundadores e inversores. Una jornada intensiva de mesas de networking rotativo, presentaciones de tendencias económicas para el próximo ejercicio y cóctel de clausura en terraza panorámica.',
    type: 'Networking',
    status: 'INSCRIPCIONES ABIERTAS',
    date: '2026-10-15',
    time: '18:30',
    endTime: '22:00',
    location: 'Terraza SkyClub & Auditorio SmartSpace, Madrid',
    address: 'Paseo de la Habana 26, 28036 Madrid',
    coordinates: { lat: 40.4531, lng: -3.6883 },
    capacity: 120,
    bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Club Empresarial ClubNexus',
    partnerCompanies: ['SmartSpace Corporate Hub', 'Prisma Creativa 360'],
    sponsorCompanyIds: ['comp-2', 'comp-3'],
    targetAudience: 'CEOs, Directores Generales, Inversores y Socios de empresas asociadas',
    allowCompanions: true,
    vipOnly: false,
    program: [
      { time: '18:30 - 19:00', title: 'Recepción, acreditación con QR y copa de bienvenida', speaker: 'Comité Organizador' },
      { time: '19:00 - 19:20', title: 'Apertura institucional: El nuevo mapa de oportunidades empresariales', speaker: 'Sofía Navarro (Presidenta ClubNexus)' },
      { time: '19:20 - 20:00', title: 'Panel Clave: Estrategias de liquidez, IA e internacionalización', speaker: 'Javier Ruiz (Atlas Capital) & Elena Vance (Nexus Fintech)' },
      { time: '20:00 - 21:00', title: 'Dinámica de Networking estructurado (10 rounds de 5 min por mesa temática)', speaker: 'Carlos Mendoza (Director Operaciones)' },
      { time: '21:00 - 22:00', title: 'Cóctel Gourmet, música en vivo y networking distendido', speaker: 'Catering por Sabor Gourmet' }
    ],
    speakers: [
      {
        id: 'spk-1',
        name: 'Sofía Navarro',
        title: 'Presidenta Ejecutiva',
        company: 'ClubNexus',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
        bio: 'Experta en gobierno corporativo y articulación de clústeres de negocio.'
      },
      {
        id: 'spk-2',
        name: 'Javier Ruiz',
        title: 'Managing Partner',
        company: 'Atlas Capital Group',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
        bio: 'Más de 20 años asesorando operaciones corporativas y rondas internacionales.'
      },
      {
        id: 'spk-3',
        name: 'Elena Vance',
        title: 'CEO & Co-founder',
        company: 'Nexus Fintech',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
        bio: 'Referente nacional en innovación financiera e infraestructura de cobros digitales.'
      }
    ],
    attachments: [
      { name: 'Dosier_Encuentro_Nexus_2026.pdf', url: '#', size: '2.4 MB' },
      { name: 'Guia_Networking_Efectivo.pdf', url: '#', size: '1.1 MB' }
    ],
    photos: [
      'https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&q=80&w=800',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80&w=800'
    ]
  },
  {
    id: 'evt-2',
    title: 'Desayuno de Trabajo: Casos Reales de IA Generativa en el Negocio B2B',
    description: 'Encuentro en formato reducido (máximo 25 directivos) enfocado en cómo las empresas de nuestro club están ahorrando horas de trabajo manual implementando agentes de IA en departamentos de ventas, operaciones y atención legal.',
    type: 'Desayuno empresarial',
    status: 'INSCRIPCIONES ABIERTAS',
    date: '2026-09-28',
    time: '09:00',
    endTime: '11:00',
    location: 'Sede Central Vórtex AI, Madrid',
    address: 'Calle Orense 34, Planta 6, 28020 Madrid',
    coordinates: { lat: 40.4495, lng: -3.6934 },
    capacity: 25,
    bannerImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Vórtex Cloud & AI',
    partnerCompanies: ['Nexus Fintech & Payments'],
    sponsorCompanyIds: ['comp-3'],
    targetAudience: 'Directores de Operaciones, CIOs, Directores Financieros y Directores Generales',
    allowCompanions: false,
    vipOnly: false,
    program: [
      { time: '09:00 - 09:20', title: 'Café de especialidad y desayuno saludable', speaker: 'Catering Sabor Gourmet' },
      { time: '09:20 - 10:00', title: 'Demostración en directo: De datos dispersos a dashboards predictivos', speaker: 'Marcos Benítez (CTO Vórtex)' },
      { time: '10:00 - 10:45', title: 'Mesa de debate y resolución de casos de los asistentes', speaker: 'Todos los asistentes' },
      { time: '10:45 - 11:00', title: 'Conclusiones y agenda de contactos bilaterales', speaker: 'Carlos Mendoza' }
    ],
    speakers: [
      {
        id: 'spk-4',
        name: 'Marcos Benítez',
        title: 'CTO & Co-founder',
        company: 'Vórtex Cloud & AI',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=256',
        bio: 'Pionero en despliegues cloud nativos y modelos de lenguaje corporativos.'
      }
    ],
    attachments: [
      { name: 'Plantilla_Calculo_ROI_IA.xlsx', url: '#', size: '420 KB' }
    ]
  },
  {
    id: 'evt-3',
    title: 'Afterwork de Otoño: Cervezas Artesanales & Pitch de Oportunidades',
    description: 'Ambiente informal y distendido para romper el hielo después de la jornada laboral. Cada socio tendrá 90 segundos opcionales de micrófono abierto para presentar una necesidad comercial concreta o una oferta exclusiva.',
    type: 'Afterwork',
    status: 'INSCRIPCIONES ABIERTAS',
    date: '2026-10-02',
    time: '19:00',
    endTime: '21:30',
    location: 'El Invernadero del Hub, Barcelona',
    address: 'Carrer de Pallars 108, 08018 Barcelona',
    coordinates: { lat: 41.3984, lng: 2.1952 },
    capacity: 60,
    bannerImage: 'https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Comisión de Juventud y Nuevos Socios',
    partnerCompanies: ['Nexus Fintech & Payments', 'Sabor & Eventos Gourmet'],
    sponsorCompanyIds: ['comp-1'],
    targetAudience: 'Representantes, directores de marketing, ventas y fundadores',
    allowCompanions: true,
    vipOnly: false,
    program: [
      { time: '19:00 - 19:30', title: 'Llegada y cata de bienvenida', speaker: 'Sommelier invitado' },
      { time: '19:30 - 20:15', title: 'Sesión Micro-Pitch 90s: ¿Qué buscas? ¿Qué ofreces?', speaker: 'Lucía Gómez (Nexus)' },
      { time: '20:15 - 21:30', title: 'Tapeo de autor y conexiones directas', speaker: 'Networking libre' }
    ],
    speakers: [
      {
        id: 'spk-5',
        name: 'Lucía Gómez',
        title: 'Head of Partnerships',
        company: 'Nexus Fintech',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        bio: 'Especialista en alianzas comerciales y networking acelerado.'
      }
    ],
    attachments: []
  },
  {
    id: 'evt-4',
    title: 'Torneo Benéfico de Pádel & Conexión Corporativa',
    description: 'Jornada deportiva y de convivencia empresarial en duplas inter-empresas. Modalidad express de parejas rotativas para favorecer que juegues con personas de diferentes sectores.',
    type: 'Evento deportivo',
    status: 'PRÓXIMAMENTE',
    date: '2026-10-24',
    time: '10:00',
    endTime: '15:00',
    location: 'Club Raqueta & Sport La Moraleja, Madrid',
    address: 'Camino Ancho 12, 28109 Alcobendas, Madrid',
    capacity: 48,
    bannerImage: 'https://images.unsplash.com/photo-1554068865-24cecd4e34b8?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Comisión de Deporte & Bienestar Nexus',
    partnerCompanies: ['Atlas Capital Group'],
    sponsorCompanyIds: ['comp-2'],
    targetAudience: 'Aficionados al pádel de todos los niveles del Club y acompañantes',
    allowCompanions: true,
    vipOnly: false,
    program: [
      { time: '10:00 - 10:30', title: 'Entrega de Welcome Pack (pala, camiseta técnica, termo)', speaker: 'Organización' },
      { time: '10:30 - 13:30', title: 'Fase de grupos y cuadro eliminatorio', speaker: 'Juez Árbitro' },
      { time: '13:30 - 15:00', title: 'Barbacoa gourmet, entrega de trofeos y networking', speaker: 'Catering Sabor Gourmet' }
    ],
    speakers: [],
    attachments: []
  },
  {
    id: 'evt-5',
    title: 'Cena Exclusiva de Consejo & Directores: Escenario Macroeconómico 2027',
    description: 'Cena a puerta cerrada exclusiva para presidentes de consejo, directores generales y patrocinadores Gold. Debate confidencial bajo reglas Chatham House.',
    type: 'Evento VIP',
    status: 'COMPLETO',
    date: '2026-11-12',
    time: '20:30',
    endTime: '23:30',
    location: 'Club Privado Puerta de Hierro, Madrid',
    address: 'Calle Miraflores 4, 28035 Madrid',
    capacity: 20,
    bannerImage: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&q=80&w=1200',
    organizer: 'Junta Directiva ClubNexus',
    partnerCompanies: [],
    sponsorCompanyIds: ['comp-2'],
    targetAudience: 'Solo Presidentes, CEOs y Patrocinadores Gold',
    allowCompanions: false,
    vipOnly: true,
    program: [
      { time: '20:30 - 21:00', title: 'Recepción de honor con champán', speaker: 'Sofía Navarro' },
      { time: '21:00 - 22:30', title: 'Cena maridada de 4 tiempos', speaker: 'Chef Ejecutivo' },
      { time: '22:30 - 23:30', title: 'Coloquio confidencial: Presupuestos y estrategias de crecimiento', speaker: 'Moderado por Javier Ruiz' }
    ],
    speakers: [
      {
        id: 'spk-6',
        name: 'Javier Ruiz',
        title: 'Managing Partner',
        company: 'Atlas Capital Group',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
        bio: 'Analista de mercados financieros y reestructuración.'
      }
    ],
    attachments: []
  }
];

export const INITIAL_REGISTRATIONS: EventRegistration[] = [
  {
    id: 'reg-1',
    eventId: 'evt-1',
    userId: 'usr-3',
    userName: 'Elena Vance',
    userEmail: 'elena@nexusfintech.com',
    userCompany: 'Nexus Fintech & Payments',
    userRole: 'EMPRESA',
    registeredAt: '2026-09-01T10:15:00Z',
    status: 'Confirmado',
    ticketCode: 'NEXUS-EVT1-USR3-8821',
    hasCompanion: true,
    companionName: 'Marcos Alonso (Director Comercial)'
  },
  {
    id: 'reg-2',
    eventId: 'evt-1',
    userId: 'usr-4',
    userName: 'Javier Ruiz Salmerón',
    userEmail: 'j.ruiz@atlascapital.es',
    userCompany: 'Atlas Capital Group',
    userRole: 'PATROCINADOR',
    registeredAt: '2026-09-02T14:30:00Z',
    status: 'Confirmado',
    ticketCode: 'NEXUS-EVT1-USR4-1940',
    hasCompanion: false
  },
  {
    id: 'reg-3',
    eventId: 'evt-1',
    userId: 'usr-5',
    userName: 'Lucía Gómez',
    userEmail: 'lucia.gomez@nexusfintech.com',
    userCompany: 'Nexus Fintech & Payments',
    userRole: 'REPRESENTANTE',
    registeredAt: '2026-09-03T11:00:00Z',
    status: 'Inscrito',
    ticketCode: 'NEXUS-EVT1-USR5-7312',
    hasCompanion: false
  },
  {
    id: 'reg-4',
    eventId: 'evt-1',
    userId: 'usr-6',
    userName: 'Daniel Ortega',
    userEmail: 'daniel.ortega@biomedlabs.es',
    userCompany: 'BioMed Labs Health',
    userRole: 'INVITADO',
    registeredAt: '2026-09-05T09:20:00Z',
    status: 'Inscrito',
    ticketCode: 'NEXUS-EVT1-USR6-4402',
    hasCompanion: false
  },
  {
    id: 'reg-5',
    eventId: 'evt-2',
    userId: 'usr-3',
    userName: 'Elena Vance',
    userEmail: 'elena@nexusfintech.com',
    userCompany: 'Nexus Fintech & Payments',
    userRole: 'EMPRESA',
    registeredAt: '2026-09-08T16:45:00Z',
    status: 'Confirmado',
    ticketCode: 'NEXUS-EVT2-USR3-9023',
    hasCompanion: false
  }
];

export const INITIAL_POSTS: Post[] = [
  {
    id: 'post-1',
    authorId: 'usr-4',
    authorName: 'Javier Ruiz Salmerón',
    authorAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
    authorPosition: 'Managing Partner',
    authorCompany: 'Atlas Capital Group',
    companyId: 'comp-2',
    content: '🚀 Gran satisfacción al anunciar el cierre con éxito de la ronda Serie A de 4.2M€ para una compañía del sector HealthTech acompañada por nuestro equipo.\n\nEn el próximo encuentro del 15 de Octubre compartiremos los criterios que más están valorando los fondos internacionales en empresas españolas este trimestre. ¡Nos vemos en el SkyClub!',
    category: 'NETWORKING',
    createdAt: 'Hace 2 horas',
    likes: ['usr-1', 'usr-3', 'usr-5'],
    bookmarks: ['usr-3'],
    comments: [
      {
        id: 'comm-1',
        userId: 'usr-3',
        userName: 'Elena Vance',
        userAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
        userCompany: 'Nexus Fintech',
        content: '¡Enhorabuena Javier y a todo el equipo de Atlas! Gran noticia para el ecosistema. Coincido plenamente en el foco de rentabilidad antes que crecimiento desmedido.',
        createdAt: 'Hace 1 hora'
      }
    ],
    image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&q=80&w=1000',
    isSponsored: true
  },
  {
    id: 'post-2',
    authorId: 'usr-3',
    authorName: 'Elena Vance',
    authorAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
    authorPosition: 'CEO & Co-founder',
    authorCompany: 'Nexus Fintech & Payments',
    companyId: 'comp-1',
    content: '🗳️ Pregunta rápida para directores y responsables de finanzas del club:\n\n¿Cuál es vuestro principal reto al gestionar los pagos y cobros de clientes en el extranjero durante este 2026?',
    category: 'GENERAL',
    createdAt: 'Hace 5 horas',
    likes: ['usr-2', 'usr-4', 'usr-6'],
    bookmarks: [],
    poll: {
      question: '¿Mayor reto en cobros y pagos internacionales?',
      options: [
        { id: 'opt-1', text: 'Comisiones elevadas e intermediación bancaria', votes: 14, voterUserIds: ['usr-4'] },
        { id: 'opt-2', text: 'Tiempos de liquidación lentos (días en tránsito)', votes: 8, voterUserIds: ['usr-6'] },
        { id: 'opt-3', text: 'Conciliación contable y facturación multidivisa', votes: 19, voterUserIds: ['usr-2'] },
        { id: 'opt-4', text: 'Riesgo de tipo de cambio y coberturas', votes: 6, voterUserIds: [] }
      ]
    },
    comments: [
      {
        id: 'comm-2',
        userId: 'usr-6',
        userName: 'Daniel Ortega',
        userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=256',
        userCompany: 'BioMed Labs Health',
        content: 'Para nosotros en exportación farmacéutica, sin duda la conciliación automática entre 4 monedas diferentes.',
        createdAt: 'Hace 3 horas'
      }
    ]
  },
  {
    id: 'post-3',
    authorId: 'usr-1',
    authorName: 'Sofía Navarro',
    authorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
    authorPosition: 'Presidenta Ejecutiva',
    authorCompany: 'Club Empresarial ClubNexus',
    companyId: 'comp-club',
    content: '📢 Damos una calurosa bienvenida a las 3 nuevas empresas socias que se han incorporado al Club esta semana: Vórtex Cloud & AI, Prisma Creativa 360 y Sabor Gourmet.\n\nPodéis consultar sus fichas completas, servicios y necesidades en el Directorio B2B para comenzar a agendar reuniones bilaterales.',
    category: 'EVENTOS',
    createdAt: 'Ayer',
    likes: ['usr-2', 'usr-3', 'usr-4', 'usr-5'],
    bookmarks: [],
    comments: [],
    linkUrl: '#directorio',
    linkTitle: 'Explorar Nuevas Empresas en el Directorio B2B'
  }
];

export const INITIAL_OPPORTUNITIES: Opportunity[] = [
  {
    id: 'opp-1',
    title: 'Buscamos empresa de catering de alta gama para cóctel de 250 directivos',
    description: 'Para nuestra convención anual el 20 de noviembre en Madrid. Requerimos propuesta gastronómica finger-food, barra libre premium y personal de servicio cualificado.',
    type: 'BUSCO',
    sector: 'Catering & Eventos Corporativos',
    companyId: 'comp-1',
    companyName: 'Nexus Fintech & Payments',
    companyLogo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=180',
    authorId: 'usr-3',
    authorName: 'Elena Vance',
    createdAt: 'Hace 1 día',
    deadline: '2026-10-10',
    budgetEstimate: '12.000€ - 18.000€',
    tags: ['Catering', 'Eventos', 'Madrid', 'Presupuesto'],
    isResolved: false,
    savedByUserIds: ['usr-5'],
    applicationsCount: 4
  },
  {
    id: 'opp-2',
    title: 'Ofrecemos 25% de descuento en auditoría de ciberseguridad y cloud',
    description: 'Exclusivo para socios del Club: revisión exhaustiva de perímetros, vulnerabilidades en aplicaciones web y análisis de cumplimiento normativo ISO 27001 con informe ejecutivo.',
    type: 'OFREZCO',
    sector: 'Inteligencia Artificial & Cloud',
    companyId: 'comp-3',
    companyName: 'Vórtex Cloud & Artificial Intelligence',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=180',
    authorId: 'usr-2',
    authorName: 'Marcos Benítez',
    createdAt: 'Hace 3 días',
    deadline: '2026-11-30',
    budgetEstimate: 'Tarifa especial socios',
    tags: ['Ciberseguridad', 'Auditoría', 'Cloud', 'Descuento'],
    isResolved: false,
    savedByUserIds: ['usr-4'],
    applicationsCount: 7
  },
  {
    id: 'opp-3',
    title: 'Buscamos socio legal para desarrollar conjuntamente guía de fiscalidad de startups',
    description: 'Queremos lanzar un whitepaper sectorial conjunto Atlas Capital + Despacho Legal del club para distribuir a más de 3.000 directores financieros en España.',
    type: 'COLABORACIÓN',
    sector: 'Legal & Asesoría Fiscal',
    companyId: 'comp-2',
    companyName: 'Atlas Capital Group',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=180',
    authorId: 'usr-4',
    authorName: 'Javier Ruiz Salmerón',
    createdAt: 'Hace 5 días',
    deadline: '2026-10-01',
    budgetEstimate: 'Co-branding / Colaboración',
    tags: ['Legal', 'Co-Branding', 'Whitepaper', 'Estrategia'],
    isResolved: false,
    savedByUserIds: ['usr-3'],
    applicationsCount: 3
  },
  {
    id: 'opp-4',
    title: 'Ofrecemos 2 jornadas de rodaje audiovisual corporativo con 30% dto.',
    description: 'Disponibilidad de equipo técnico completo multicámara 4K para vídeos promocionales o grabación de eventos corporativos antes de final de año.',
    type: 'OFREZCO',
    sector: 'Audiovisual & Branding',
    companyId: 'comp-6',
    companyName: 'Prisma Creativa 360',
    companyLogo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&q=80&w=180',
    authorId: 'usr-2',
    authorName: 'Sara Villanueva',
    createdAt: 'Hace 1 semana',
    deadline: '2026-12-15',
    budgetEstimate: 'A consultar',
    tags: ['Vídeo', 'Streaming', 'Branding', 'Oferta'],
    isResolved: false,
    savedByUserIds: [],
    applicationsCount: 2
  }
];

export const INITIAL_CHANNELS: ChatChannel[] = [
  {
    id: 'chan-gen',
    type: 'group',
    name: '💬 General Club & Avisos',
    avatar: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=180',
    participantIds: ['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-5', 'usr-6'],
    lastMessage: {
      content: 'Recordatorio: quedan pocas plazas para el desayuno de trabajo de este jueves.',
      timestamp: '11:42',
      senderName: 'Carlos Mendoza'
    },
    unreadCount: 1
  },
  {
    id: 'chan-evt1',
    type: 'event',
    name: '🎪 Asistentes Encuentro Anual 15 Oct',
    avatar: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=180',
    eventId: 'evt-1',
    participantIds: ['usr-1', 'usr-2', 'usr-3', 'usr-4', 'usr-5', 'usr-6'],
    lastMessage: {
      content: '¿Alguien tiene interés en hablar sobre rondas Serie B antes de que empiece el panel?',
      timestamp: 'Ayer',
      senderName: 'Javier Ruiz'
    },
    unreadCount: 0
  },
  {
    id: 'chan-direct-1',
    type: 'direct',
    name: 'Elena Vance (Nexus Fintech)',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
    participantIds: ['usr-1', 'usr-3'],
    lastMessage: {
      content: 'Hola Sofía, te confirmo que patrocinaremos el Coffee Break del evento de otoño.',
      timestamp: '10:15',
      senderName: 'Elena Vance'
    },
    unreadCount: 0
  },
  {
    id: 'chan-direct-2',
    type: 'company',
    name: 'Atlas Capital Group ↔ Nexus Fintech',
    avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=180',
    companyId: 'comp-2',
    participantIds: ['usr-3', 'usr-4'],
    lastMessage: {
      content: 'Elena, he revisado vuestra API de pagos. Creemos que encaja con 2 de nuestras participadas.',
      timestamp: '09:30',
      senderName: 'Javier Ruiz Salmerón'
    },
    unreadCount: 2
  }
];

export const INITIAL_MESSAGES: Record<string, ChatMessage[]> = {
  'chan-gen': [
    {
      id: 'msg-1',
      senderId: 'usr-1',
      senderName: 'Sofía Navarro',
      senderAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256',
      senderCompany: 'ClubNexus',
      content: '¡Bienvenidos a todos a la nueva plataforma digital y PWA de nuestro Club de Empresas! Aquí podréis gestionar vuestra presencia, contactar directamente con cualquier miembro y obtener vuestras acreditaciones QR para los eventos.',
      timestamp: '09:00',
      readBy: ['usr-2', 'usr-3', 'usr-4']
    },
    {
      id: 'msg-2',
      senderId: 'usr-4',
      senderName: 'Javier Ruiz Salmerón',
      senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
      senderCompany: 'Atlas Capital Group',
      content: 'Excelente iniciativa, la interfaz móvil es rapidísima y muy profesional. ¡Enhorabuena al equipo!',
      timestamp: '09:18',
      readBy: ['usr-1', 'usr-2']
    },
    {
      id: 'msg-3',
      senderId: 'usr-2',
      senderName: 'Carlos Mendoza',
      senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
      senderCompany: 'ClubNexus',
      content: 'Recordatorio: quedan pocas plazas para el desayuno de trabajo de este jueves.',
      timestamp: '11:42',
      readBy: ['usr-1']
    }
  ],
  'chan-evt1': [
    {
      id: 'msg-e1',
      senderId: 'usr-2',
      senderName: 'Carlos Mendoza',
      senderAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=256',
      senderCompany: 'ClubNexus',
      content: 'Canal oficial para los asistentes al Encuentro Anual del 15 de Octubre. Podéis aprovechar este espacio para adelantar intereses de conexión.',
      timestamp: '08:30',
      readBy: ['usr-3', 'usr-4']
    },
    {
      id: 'msg-e2',
      senderId: 'usr-4',
      senderName: 'Javier Ruiz',
      senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
      senderCompany: 'Atlas Capital',
      content: '¿Alguien tiene interés en hablar sobre rondas Serie B antes de que empiece el panel?',
      timestamp: 'Ayer',
      readBy: ['usr-3']
    }
  ],
  'chan-direct-1': [
    {
      id: 'msg-d1',
      senderId: 'usr-3',
      senderName: 'Elena Vance',
      senderAvatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256',
      senderCompany: 'Nexus Fintech',
      content: 'Hola Sofía, te confirmo que patrocinaremos el Coffee Break del evento de otoño.',
      timestamp: '10:15',
      readBy: ['usr-1']
    }
  ],
  'chan-direct-2': [
    {
      id: 'msg-c1',
      senderId: 'usr-4',
      senderName: 'Javier Ruiz Salmerón',
      senderAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=256',
      senderCompany: 'Atlas Capital Group',
      content: 'Elena, he revisado vuestra API de pagos. Creemos que encaja con 2 de nuestras participadas.',
      timestamp: '09:30',
      readBy: []
    }
  ]
};

export const INITIAL_PERKS: ClubPerk[] = [
  {
    id: 'perk-1',
    title: 'Salas de Reuniones Ejecutivas Gratuitas',
    companyName: 'SmartSpace Corporate Hub',
    companyLogo: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=180',
    discount: '2h / mes Gratis',
    description: 'Reserva salas equipadas con pantalla interactiva y videoconferencia 4K en cualquiera de sus sedes de Madrid o Barcelona.',
    code: 'NEXUS-ROOM-26',
    expiry: '31 Dic 2026',
    category: 'Espacios'
  },
  {
    id: 'perk-2',
    title: 'Auditoría y Planificación Fiscal Mercantil',
    companyName: 'Iberia Legal & Tax Partners',
    companyLogo: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&q=80&w=180',
    discount: '1ª Consulta Gratuita + 20% Dto.',
    description: 'Diagnóstico sobre deducciones por I+D+i y pactos parasociales para socios del club.',
    code: 'IBERIA-CLUB-VIP',
    expiry: 'Indefinido',
    category: 'Legal'
  },
  {
    id: 'perk-3',
    title: 'Descuento en Catering y Coffee Breaks para Eventos',
    companyName: 'Sabor & Eventos Gourmet',
    companyLogo: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&q=80&w=180',
    discount: '15% de Descuento',
    description: 'Válido para desayunos de trabajo, cócteles corporativos y presentaciones de producto.',
    code: 'GOURMET-NEXUS-15',
    expiry: '15 Nov 2026',
    category: 'Catering'
  },
  {
    id: 'perk-4',
    title: 'Crédito Cloud & Diagnóstico de Costes',
    companyName: 'Vórtex Cloud & AI',
    companyLogo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=180',
    discount: 'Diagnóstico 100% Bonificado',
    description: 'Auditoría de gasto en servidores AWS y Google Cloud con propuesta de optimización de costes garantizada.',
    code: 'VORTEX-SAVINGS-26',
    expiry: '31 Dic 2026',
    category: 'Tecnología'
  }
];

export const INITIAL_NOTIFICATIONS: ClubNotification[] = [
  {
    id: 'notif-1',
    userId: 'usr-3',
    title: 'Nueva oportunidad publicada',
    message: 'Atlas Capital busca socio legal para guía fiscal de startups.',
    time: 'Hace 35 min',
    read: false,
    type: 'opportunity',
    linkTo: 'opportunities'
  },
  {
    id: 'notif-2',
    userId: 'usr-3',
    title: 'Inscripción confirmada',
    message: 'Tu pase QR para el Gran Encuentro de Networking está listo.',
    time: 'Ayer',
    read: false,
    type: 'event',
    linkTo: 'events'
  },
  {
    id: 'notif-3',
    userId: 'usr-3',
    title: 'Nuevo mensaje en el chat general',
    message: 'Carlos Mendoza ha publicado un aviso sobre plazas del desayuno.',
    time: 'Hace 2 horas',
    read: true,
    type: 'chat',
    linkTo: 'chat'
  }
];
