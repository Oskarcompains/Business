import express from 'express';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { db } from './server/database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = process.env.PORT || 3000;
const distPath = path.join(__dirname, 'dist');
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET || JWT_SECRET.length < 32) {
  console.error('JWT_SECRET must be configured with at least 32 characters.');
  process.exit(1);
}

app.disable('x-powered-by');
app.use(helmet({ contentSecurityPolicy: false }));
app.use(express.json({ limit: '100kb' }));

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: 'draft-7', legacyHeaders: false });
const applicationLimiter = rateLimit({ windowMs: 60 * 60 * 1000, limit: 5, standardHeaders: 'draft-7', legacyHeaders: false });

function publicUser(user) {
  return { id: user.id, email: user.email, displayName: user.display_name, role: user.role, status: user.status, membershipTier: user.membership_tier, companyId: user.company_id };
}

function authenticate(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'No autorizado' });
  try {
    req.auth = jwt.verify(token, JWT_SECRET, { algorithms: ['HS256'] });
    next();
  } catch {
    return res.status(401).json({ error: 'Sesión no válida' });
  }
}

function adminOnly(req, res, next) {
  if (!['SUPERADMIN', 'ADMIN'].includes(req.auth?.role)) return res.status(403).json({ error: 'Permisos insuficientes' });
  next();
}

function audit(actorId, action, entityType, entityId, metadata = null) {
  db.prepare('INSERT INTO audit_log (actor_user_id, action, entity_type, entity_id, metadata) VALUES (?, ?, ?, ?, ?)')
    .run(actorId || null, action, entityType, String(entityId ?? ''), metadata ? JSON.stringify(metadata) : null);
}

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'ibarbaso-business-club' }));

app.post('/api/auth/login', authLimiter, async (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  if (!email || !password) return res.status(400).json({ error: 'Email y contraseña son obligatorios' });

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  const valid = user ? await bcrypt.compare(password, user.password_hash) : false;
  if (!valid) return res.status(401).json({ error: 'Credenciales incorrectas' });
  if (user.status !== 'APROBADO') return res.status(403).json({ error: user.status === 'SUSPENDIDO' ? 'Cuenta suspendida' : 'Cuenta pendiente de aprobación' });

  const token = jwt.sign({ sub: String(user.id), role: user.role }, JWT_SECRET, { algorithm: 'HS256', expiresIn: '8h', issuer: 'ibarbaso-business-club' });
  audit(user.id, 'LOGIN', 'user', user.id);
  res.json({ token, user: publicUser(user) });
});

app.get('/api/auth/me', authenticate, (req, res) => {
  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(Number(req.auth.sub));
  if (!user || user.status !== 'APROBADO') return res.status(401).json({ error: 'Cuenta no disponible' });
  res.json({ user: publicUser(user) });
});

app.post('/api/membership-applications', applicationLimiter, (req, res) => {
  const body = req.body || {};
  const required = ['companyName', 'sector', 'contactName', 'email', 'phone', 'motivation', 'requestedTier'];
  if (required.some(k => !String(body[k] || '').trim())) return res.status(400).json({ error: 'Faltan campos obligatorios' });
  if (!['ORO', 'PLATA', 'BRONCE'].includes(body.requestedTier)) return res.status(400).json({ error: 'Membresía no válida' });
  const email = String(body.email).trim().toLowerCase();
  if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Email no válido' });

  const result = db.prepare(`INSERT INTO membership_applications
    (company_name,cif,sector,contact_name,contact_role,email,phone,website,motivation,requested_tier,status)
    VALUES (?,?,?,?,?,?,?,?,?,?,'PENDIENTE')`).run(
      String(body.companyName).trim(), String(body.cif || '').trim() || null, String(body.sector).trim(),
      String(body.contactName).trim(), String(body.contactRole || '').trim() || null, email,
      String(body.phone).trim(), String(body.website || '').trim() || null, String(body.motivation).trim(), body.requestedTier
    );
  audit(null, 'APPLICATION_CREATED', 'membership_application', result.lastInsertRowid);
  res.status(201).json({ id: Number(result.lastInsertRowid), status: 'PENDIENTE' });
});

app.get('/api/admin/applications', authenticate, adminOnly, (req, res) => {
  res.json({ applications: db.prepare('SELECT * FROM membership_applications ORDER BY submitted_at DESC').all() });
});

app.patch('/api/admin/applications/:id', authenticate, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  const status = String(req.body?.status || '');
  const assignedTier = req.body?.assignedTier || null;
  if (!['APROBADO', 'RECHAZADO', 'SUSPENDIDO'].includes(status)) return res.status(400).json({ error: 'Estado no válido' });
  if (assignedTier && !['ORO', 'PLATA', 'BRONCE'].includes(assignedTier)) return res.status(400).json({ error: 'Membresía no válida' });
  const existing = db.prepare('SELECT * FROM membership_applications WHERE id = ?').get(id);
  if (!existing) return res.status(404).json({ error: 'Solicitud no encontrada' });

  const tx = db.transaction(() => {
    db.prepare('UPDATE membership_applications SET status=?, assigned_tier=?, reviewed_by=?, reviewed_at=CURRENT_TIMESTAMP WHERE id=?')
      .run(status, assignedTier, Number(req.auth.sub), id);
    if (status === 'APROBADO') {
      const tier = assignedTier || existing.requested_tier;
      const company = db.prepare('INSERT INTO companies (name,cif,sector,website,membership_tier,status) VALUES (?,?,?,?,?,?)')
        .run(existing.company_name, existing.cif, existing.sector, existing.website, tier, 'APROBADO');
      audit(Number(req.auth.sub), 'COMPANY_CREATED', 'company', company.lastInsertRowid, { applicationId: id, tier });
    }
    audit(Number(req.auth.sub), `APPLICATION_${status}`, 'membership_application', id, { assignedTier });
  });
  try { tx(); } catch (error) { return res.status(409).json({ error: 'No se pudo procesar la solicitud', detail: error.code === 'SQLITE_CONSTRAINT_UNIQUE' ? 'El CIF ya existe' : undefined }); }
  res.json({ ok: true });
});

app.get('/api/admin/companies', authenticate, adminOnly, (_req, res) => {
  res.json({ companies: db.prepare('SELECT * FROM companies ORDER BY created_at DESC').all() });
});

app.get('/api/admin/users', authenticate, adminOnly, (_req, res) => {
  const users = db.prepare('SELECT id,email,display_name,role,status,membership_tier,company_id,created_at,updated_at FROM users ORDER BY created_at DESC').all();
  res.json({ users });
});

app.patch('/api/admin/users/:id', authenticate, adminOnly, (req, res) => {
  const id = Number(req.params.id);
  const target = db.prepare('SELECT * FROM users WHERE id=?').get(id);
  if (!target) return res.status(404).json({ error: 'Usuario no encontrado' });
  if (target.role === 'SUPERADMIN' && req.auth.role !== 'SUPERADMIN') return res.status(403).json({ error: 'Solo SUPERADMIN puede modificar este usuario' });
  const status = req.body?.status ?? target.status;
  const role = req.body?.role ?? target.role;
  const tier = req.body?.membershipTier ?? target.membership_tier;
  if (!['PENDIENTE','APROBADO','RECHAZADO','SUSPENDIDO'].includes(status) || !['SUPERADMIN','ADMIN','MIEMBRO'].includes(role) || (tier && !['ORO','PLATA','BRONCE'].includes(tier))) return res.status(400).json({ error: 'Datos no válidos' });
  if (role === 'SUPERADMIN' && req.auth.role !== 'SUPERADMIN') return res.status(403).json({ error: 'Solo SUPERADMIN puede asignar ese rol' });
  db.prepare('UPDATE users SET status=?, role=?, membership_tier=?, updated_at=CURRENT_TIMESTAMP WHERE id=?').run(status, role, tier, id);
  audit(Number(req.auth.sub), 'USER_UPDATED', 'user', id, { status, role, tier });
  res.json({ ok: true });
});

// One-time secure bootstrap. No default password is ever stored in source control.
app.post('/api/setup/superadmin', authLimiter, async (req, res) => {
  const existing = db.prepare("SELECT id FROM users WHERE role='SUPERADMIN' LIMIT 1").get();
  if (existing) return res.status(404).end();
  const setupToken = String(req.headers['x-setup-token'] || '');
  const expected = String(process.env.SETUP_TOKEN || '');
  if (!expected || setupToken.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(setupToken), Buffer.from(expected))) return res.status(404).end();
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const displayName = String(req.body?.displayName || 'Kroko').trim();
  if (!/^\S+@\S+\.\S+$/.test(email) || password.length < 12) return res.status(400).json({ error: 'Email válido y contraseña de al menos 12 caracteres requeridos' });
  const hash = await bcrypt.hash(password, 12);
  try {
    const result = db.prepare("INSERT INTO users (email,password_hash,display_name,role,status) VALUES (?,?,?,'SUPERADMIN','APROBADO')").run(email, hash, displayName);
    audit(Number(result.lastInsertRowid), 'SUPERADMIN_BOOTSTRAPPED', 'user', result.lastInsertRowid);
    res.status(201).json({ ok: true });
  } catch { res.status(409).json({ error: 'No se pudo crear el administrador' }); }
});

app.use('/api', (_req, res) => res.status(404).json({ error: 'Ruta no encontrada' }));
app.use(express.static(distPath));
app.get('*', (_req, res) => res.sendFile(path.join(distPath, 'index.html')));

app.listen(PORT, '0.0.0.0', () => console.log(`Ibarbaso Business Club running on port ${PORT}`));
