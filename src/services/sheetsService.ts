import { Company, ClubEvent, CompanyTier, EventType, EventStatus } from '../types';
import { getGoogleAccessToken } from '../lib/firebase';

export interface GoogleSheetMeta {
  id: string;
  name: string;
  tabs: string[];
}

export interface SheetImportResult<T> {
  success: boolean;
  data: T[];
  message: string;
  errors?: string[];
}

/**
 * Extracts a Spreadsheet ID from either a full URL or direct ID.
 */
export const extractSpreadsheetId = (input: string): string => {
  if (!input) return '';
  const trimmed = input.trim();
  const match = trimmed.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  if (match && match[1]) {
    return match[1];
  }
  return trimmed;
};

/**
 * Fetch spreadsheet metadata (title and sheet tab names)
 */
export const getSpreadsheetMetadata = async (
  spreadsheetId: string,
  explicitToken?: string
): Promise<GoogleSheetMeta> => {
  const token = explicitToken || getGoogleAccessToken();
  if (!token) {
    throw new Error('Inicia sesión con Google para acceder a tus hojas de cálculo.');
  }

  const cleanId = extractSpreadsheetId(spreadsheetId);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${cleanId}?fields=properties.title,sheets.properties.title`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const errorMsg = errorData.error?.message || `Error ${response.status} al consultar Google Sheets`;
    throw new Error(errorMsg);
  }

  const data = await response.json();
  const title = data.properties?.title || 'Hoja de Cálculo';
  const tabs = (data.sheets || []).map((s: any) => s.properties?.title || 'Hoja 1');

  return {
    id: cleanId,
    name: title,
    tabs
  };
};

/**
 * Read values from a given sheet and range
 */
export const fetchSheetValues = async (
  spreadsheetId: string,
  range: string,
  explicitToken?: string
): Promise<string[][]> => {
  const token = explicitToken || getGoogleAccessToken();
  if (!token) {
    throw new Error('Se requiere autenticación de Google con permisos de Google Sheets.');
  }

  const cleanId = extractSpreadsheetId(spreadsheetId);
  const encodedRange = encodeURIComponent(range);
  const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodedRange}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error?.message || `Error ${response.status} al leer el rango ${range}`);
  }

  const data = await response.json();
  return data.values || [];
};

/**
 * Parse companies from 2D array of Google Sheets rows
 * Expected columns:
 * Nombre | Sector | Categoría/Tier | Ubicación | Web | Empleados | Descripción | Servicios | Contacto Nombre | Contacto Email
 */
export const parseCompaniesFromSheet = (rows: string[][]): SheetImportResult<Company> => {
  if (!rows || rows.length < 2) {
    return {
      success: false,
      data: [],
      message: 'La hoja de cálculo no contiene suficientes filas (se necesita cabecera y al menos 1 fila de datos).'
    };
  }

  const headers = rows[0].map(h => (h || '').trim().toLowerCase());
  const nameIdx = headers.findIndex(h => h.includes('nombre') || h.includes('empresa') || h.includes('company'));
  const sectorIdx = headers.findIndex(h => h.includes('sector') || h.includes('actividad') || h.includes('industria'));
  const tierIdx = headers.findIndex(h => h.includes('tier') || h.includes('categoría') || h.includes('categoria') || h.includes('tipo'));
  const locationIdx = headers.findIndex(h => h.includes('ubicación') || h.includes('ubicacion') || h.includes('ciudad') || h.includes('sede'));
  const webIdx = headers.findIndex(h => h.includes('web') || h.includes('sitio') || h.includes('url'));
  const descIdx = headers.findIndex(h => h.includes('descrip') || h.includes('resumen') || h.includes('presentación'));
  const employeesIdx = headers.findIndex(h => h.includes('empleado') || h.includes('trabajador') || h.includes('plantilla'));
  const contactNameIdx = headers.findIndex(h => h.includes('contacto') || h.includes('representante') || h.includes('responsable'));
  const contactEmailIdx = headers.findIndex(h => h.includes('email') || h.includes('correo'));

  const parsedCompanies: Company[] = [];
  const errors: string[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || !row[nameIdx >= 0 ? nameIdx : 0]?.trim()) {
      continue; // empty row
    }

    const name = (nameIdx >= 0 ? row[nameIdx] : row[0])?.trim() || `Empresa ${i}`;
    const sector = (sectorIdx >= 0 ? row[sectorIdx] : row[1])?.trim() || 'Servicios Profesionales';
    
    // Normalize Tier
    const rawTier = (tierIdx >= 0 ? row[tierIdx] : row[2])?.trim().toUpperCase() || 'SOCIO_ESTANDAR';
    let tier: CompanyTier = 'SOCIO_ESTANDAR';
    if (rawTier.includes('GOLD') || rawTier.includes('ORO')) tier = 'PATROCINADOR_GOLD';
    else if (rawTier.includes('SILVER') || rawTier.includes('PLATA')) tier = 'PATROCINADOR_SILVER';
    else if (rawTier.includes('FUNDADOR')) tier = 'SOCIO_FUNDADOR';
    else if (rawTier.includes('PREMIUM')) tier = 'SOCIO_PREMIUM';
    else if (rawTier.includes('INVITADO')) tier = 'INVITADO';

    const location = (locationIdx >= 0 ? row[locationIdx] : 'Navarra / Pamplona')?.trim() || 'Pamplona / Navarra';
    const website = (webIdx >= 0 ? row[webIdx] : '')?.trim() || 'https://empresa.es';
    const description = (descIdx >= 0 ? row[descIdx] : '')?.trim() || `${name} es una firma de referencia en el sector ${sector}.`;
    const employeesCount = parseInt((employeesIdx >= 0 ? row[employeesIdx] : '25') || '25', 10) || 25;

    const contactName = (contactNameIdx >= 0 ? row[contactNameIdx] : 'Dirección General')?.trim() || 'Dirección General';
    const contactEmail = (contactEmailIdx >= 0 ? row[contactEmailIdx] : `contacto@${name.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`)?.trim();

    const comp: Company = {
      id: `comp-sheet-${Date.now()}-${i}`,
      name,
      legalName: `${name} S.L.`,
      sector,
      tier,
      description,
      website,
      location,
      employeesCount,
      logo: `https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&q=80&w=256`,
      contactPersons: [{
        name: contactName,
        role: 'Representante Empresarial',
        email: contactEmail,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256',
        isPrimary: true
      }],
      services: [sector, 'Alianzas B2B', 'Innovación'],
      offers: ['Condiciones exclusivas para miembros de Ibarbaso Business Club'],
      seeking: ['Networking estratégico', 'Clientes corporativos y proveedores'],
      tags: [sector, 'Ibarbaso Club', 'Navarra'],
      joinedAt: new Date().toISOString().split('T')[0],
      eventsAttendedCount: 0,
      featured: tier === 'PATROCINADOR_GOLD' || tier === 'PATROCINADOR_SILVER'
    };

    parsedCompanies.push(comp);
  }

  return {
    success: parsedCompanies.length > 0,
    data: parsedCompanies,
    message: `Se han procesado ${parsedCompanies.length} empresas desde Google Sheets correctamente.`,
    errors
  };
};

/**
 * Parse events from 2D array of Google Sheets rows
 * Expected columns:
 * Título | Formato/Tipo | Fecha | Hora | Ubicación | Aforo | Descripción
 */
export const parseEventsFromSheet = (rows: string[][]): SheetImportResult<ClubEvent> => {
  if (!rows || rows.length < 2) {
    return {
      success: false,
      data: [],
      message: 'La hoja de cálculo no contiene suficientes filas para eventos.'
    };
  }

  const headers = rows[0].map(h => (h || '').trim().toLowerCase());
  const titleIdx = headers.findIndex(h => h.includes('título') || h.includes('titulo') || h.includes('evento') || h.includes('nombre'));
  const typeIdx = headers.findIndex(h => h.includes('tipo') || h.includes('formato') || h.includes('categoría') || h.includes('categoria'));
  const dateIdx = headers.findIndex(h => h.includes('fecha') || h.includes('date') || h.includes('día'));
  const timeIdx = headers.findIndex(h => h.includes('hora') || h.includes('horario') || h.includes('time'));
  const locIdx = headers.findIndex(h => h.includes('lugar') || h.includes('ubicación') || h.includes('ubicacion') || h.includes('sede') || h.includes('sala'));
  const capIdx = headers.findIndex(h => h.includes('aforo') || h.includes('capacidad') || h.includes('plazas'));
  const descIdx = headers.findIndex(h => h.includes('descrip') || h.includes('detalle') || h.includes('resumen'));

  const parsedEvents: ClubEvent[] = [];

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || row.length === 0 || !row[titleIdx >= 0 ? titleIdx : 0]?.trim()) {
      continue;
    }

    const title = (titleIdx >= 0 ? row[titleIdx] : row[0])?.trim() || `Encuentro Empresarial ${i}`;
    const rawType = (typeIdx >= 0 ? row[typeIdx] : row[1])?.trim() || 'Networking';
    
    let type: EventType = 'Networking';
    if (rawType.toLowerCase().includes('desayuno')) type = 'Desayuno empresarial';
    else if (rawType.toLowerCase().includes('afterwork')) type = 'Afterwork';
    else if (rawType.toLowerCase().includes('conferencia')) type = 'Conferencia';
    else if (rawType.toLowerCase().includes('formación') || rawType.toLowerCase().includes('formacion')) type = 'Formación';
    else if (rawType.toLowerCase().includes('visita')) type = 'Visita empresarial';
    else if (rawType.toLowerCase().includes('vip')) type = 'Evento VIP';

    const date = (dateIdx >= 0 ? row[dateIdx] : '2026-10-15')?.trim() || '2026-10-15';
    const time = (timeIdx >= 0 ? row[timeIdx] : '18:30')?.trim() || '18:30';
    const location = (locIdx >= 0 ? row[locIdx] : 'Palco Presidencial Soto-Ibarbaso')?.trim() || 'Palco Presidencial Soto-Ibarbaso';
    const capacity = parseInt((capIdx >= 0 ? row[capIdx] : '50') || '50', 10) || 50;
    const description = (descIdx >= 0 ? row[descIdx] : '')?.trim() || `Encuentro exclusivo para socios y directivos de Ibarbaso Business Club.`;

    const evt: ClubEvent = {
      id: `evt-sheet-${Date.now()}-${i}`,
      title,
      description,
      type,
      status: 'INSCRIPCIONES ABIERTAS',
      date,
      time,
      location,
      address: location,
      capacity,
      bannerImage: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80&w=1000',
      organizer: 'Ibarbaso Business Club',
      partnerCompanies: ['Ibarbaso Business Club'],
      sponsorCompanyIds: [],
      targetAudience: 'Directores Generales, CEOs y Socios Corporativos',
      program: [
        { time, title: 'Recepción y Acreditación con Pase QR' },
        { time: '19:15', title: 'Sesión Central de Negocios y Networking Dinámico' },
        { time: '20:30', title: 'Cóctel & Degustación Ejecutiva' }
      ],
      speakers: [],
      attachments: [],
      allowCompanions: true
    };

    parsedEvents.push(evt);
  }

  return {
    success: parsedEvents.length > 0,
    data: parsedEvents,
    message: `Se han procesado ${parsedEvents.length} eventos desde Google Sheets correctamente.`
  };
};

/**
 * Append a newly registered company or event row to the spreadsheet
 */
export const appendCompanyToSheet = async (
  spreadsheetId: string,
  sheetName: string,
  company: Company,
  explicitToken?: string
): Promise<boolean> => {
  const token = explicitToken || getGoogleAccessToken();
  if (!token) return false;

  const cleanId = extractSpreadsheetId(spreadsheetId);
  const range = `${sheetName}!A:J`;

  const values = [[
    company.name,
    company.sector,
    company.tier,
    company.location,
    company.website,
    company.employeesCount.toString(),
    company.description,
    company.services.join(', '),
    company.contactPersons[0]?.name || '',
    company.contactPersons[0]?.email || ''
  ]];

  const response = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${cleanId}/values/${encodeURIComponent(range)}:append?valueInputOption=USER_ENTERED`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ values })
    }
  );

  return response.ok;
};
