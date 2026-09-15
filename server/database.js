import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';

const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data');
fs.mkdirSync(dataDir, { recursive: true });

export const db = new Database(path.join(dataDir, 'business-club.sqlite'));
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  password_hash TEXT NOT NULL,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK(role IN ('SUPERADMIN','ADMIN','MIEMBRO')) DEFAULT 'MIEMBRO',
  status TEXT NOT NULL CHECK(status IN ('PENDIENTE','APROBADO','RECHAZADO','SUSPENDIDO')) DEFAULT 'PENDIENTE',
  membership_tier TEXT CHECK(membership_tier IN ('ORO','PLATA','BRONCE')),
  company_id INTEGER,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS companies (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  cif TEXT UNIQUE,
  sector TEXT,
  website TEXT,
  membership_tier TEXT CHECK(membership_tier IN ('ORO','PLATA','BRONCE')),
  status TEXT NOT NULL CHECK(status IN ('PENDIENTE','APROBADO','RECHAZADO','SUSPENDIDO')) DEFAULT 'PENDIENTE',
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS membership_applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  company_name TEXT NOT NULL,
  cif TEXT,
  sector TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_role TEXT,
  email TEXT NOT NULL COLLATE NOCASE,
  phone TEXT NOT NULL,
  website TEXT,
  motivation TEXT NOT NULL,
  requested_tier TEXT NOT NULL CHECK(requested_tier IN ('ORO','PLATA','BRONCE')),
  assigned_tier TEXT CHECK(assigned_tier IN ('ORO','PLATA','BRONCE')),
  status TEXT NOT NULL CHECK(status IN ('PENDIENTE','APROBADO','RECHAZADO','SUSPENDIDO')) DEFAULT 'PENDIENTE',
  reviewed_by INTEGER,
  submitted_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TEXT,
  FOREIGN KEY(reviewed_by) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  actor_user_id INTEGER,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  metadata TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(actor_user_id) REFERENCES users(id)
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON membership_applications(status);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);
`);
