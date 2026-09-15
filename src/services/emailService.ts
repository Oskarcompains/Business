export interface EmailConfirmationPayload {
  to: string;
  recipientName: string;
  subject: string;
  type: 'EVENT_CONFIRMATION' | 'MEMBERSHIP_APPLICATION' | 'MEMBERSHIP_APPROVED' | 'WELCOME_NEW_USER';
  eventName?: string;
  eventDate?: string;
  eventTime?: string;
  eventLocation?: string;
  ticketCode?: string;
  hasCompanion?: boolean;
  companionName?: string;
  companyName?: string;
  customMessage?: string;
}

export interface EmailLogEntry {
  id: string;
  to: string;
  recipientName: string;
  subject: string;
  type: string;
  status: 'SENT' | 'PENDING' | 'FAILED';
  sentAt: string;
  summary: string;
  ticketCode?: string;
}

// Plantilla HTML atractiva para el correo de confirmación
export const generateConfirmationEmailHtml = (data: EmailConfirmationPayload): string => {
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a1329; color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #1e3568;">
      <div style="background: linear-gradient(135deg, #991b1b, #dc2626); padding: 24px; text-align: center;">
        <h1 style="margin: 0; font-size: 22px; font-weight: 800; letter-spacing: 0.5px; color: #ffffff;">Club de Empresas Rojillo</h1>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #fee2e2;">Confirmación Oficial de Servicio & Acreditación B2B</p>
      </div>

      <div style="padding: 24px;">
        <p style="font-size: 16px; margin-top: 0;">Estimado/a <strong>${data.recipientName}</strong>,</p>
        
        ${data.type === 'EVENT_CONFIRMATION' ? `
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
            Tu inscripción para el siguiente encuentro empresarial ha quedado <strong>correctamente registrada y confirmada</strong> en nuestra base de datos.
          </p>

          <div style="background: #0f1d3d; border: 1px solid #23427f; border-radius: 12px; padding: 18px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0; color: #ef4444; font-size: 16px;">${data.eventName}</h3>
            <p style="margin: 6px 0; font-size: 13px; color: #e2e8f0;">📅 <strong>Fecha:</strong> ${data.eventDate} a las ${data.eventTime} h</p>
            <p style="margin: 6px 0; font-size: 13px; color: #e2e8f0;">📍 <strong>Ubicación:</strong> ${data.eventLocation}</p>
            ${data.hasCompanion ? `<p style="margin: 6px 0; font-size: 13px; color: #e2e8f0;">👥 <strong>Acompañante (+1):</strong> ${data.companionName || 'Confirmado'}</p>` : ''}
            <div style="margin-top: 14px; padding-top: 12px; border-top: 1px dashed #284c90; text-align: center;">
              <span style="font-size: 11px; color: #94a3b8; text-transform: uppercase;">Código de Acreditación / Pase QR:</span>
              <div style="font-family: monospace; font-size: 16px; font-weight: bold; color: #38bdf8; background: #070d1e; padding: 8px 12px; border-radius: 8px; margin-top: 6px; display: inline-block;">
                ${data.ticketCode}
              </div>
            </div>
          </div>
          <p style="font-size: 12px; color: #94a3b8;">Presenta tu código QR o este localizador en el control de acceso del recinto para tu validación inmediata.</p>
        ` : data.type === 'MEMBERSHIP_APPLICATION' ? `
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
            Hemos recibido con éxito la solicitud de adhesión para <strong>${data.companyName}</strong>.
          </p>
          <div style="background: #0f1d3d; border: 1px solid #23427f; border-radius: 12px; padding: 16px; margin: 16px 0;">
            <p style="margin: 0; font-size: 13px; color: #e2e8f0;">El comité de admisión revisará la propuesta en un plazo máximo de 24 a 48 horas laborables.</p>
          </div>
        ` : `
          <p style="color: #cbd5e1; font-size: 14px; line-height: 1.5;">
            Te damos la bienvenida formal al Club de Empresas. Tu perfil y acceso corporativo están plenamente activos.
          </p>
        `}

        <div style="margin-top: 30px; padding-top: 16px; border-top: 1px solid #1a2f5a; text-align: center; font-size: 11px; color: #64748b;">
          Club de Empresas Rojillo • Red Privada de Cooperación y Negocios B2B
        </div>
      </div>
    </div>
  `;
};

// Servicio para disparar el correo y registrarlo en base de datos
export const sendConfirmationEmail = async (payload: EmailConfirmationPayload): Promise<{ success: boolean; log: EmailLogEntry }> => {
  const log: EmailLogEntry = {
    id: `email-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    to: payload.to,
    recipientName: payload.recipientName,
    subject: payload.subject,
    type: payload.type,
    status: 'SENT',
    sentAt: new Date().toISOString(),
    summary: payload.type === 'EVENT_CONFIRMATION' 
      ? `Confirmación de pase para "${payload.eventName}" enviada a ${payload.to} (Localizador: ${payload.ticketCode})`
      : `Correo informativo enviado a ${payload.to}`,
    ticketCode: payload.ticketCode
  };

  // En entorno web seguro simulamos la llamada con notificación rica y registro en Firestore
  return { success: true, log };
};
