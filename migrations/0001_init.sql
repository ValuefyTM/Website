-- VALUEFY — initial schema, shared by the website, the future CRM and the client portal.
-- Step 1 only writes leads from the website assistant; the CRM will add valuation cases,
-- stages, documents storage and messages in later migrations.

CREATE TABLE clients (
  id            TEXT PRIMARY KEY,                -- uuid
  customer_type TEXT,                            -- 'Persoană fizică' | 'Companie'
  name          TEXT NOT NULL,
  email         TEXT,                            -- stored lower-case
  phone         TEXT,                            -- as entered
  phone_digits  TEXT,                            -- digits only, for matching
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_clients_email ON clients(email);
CREATE INDEX idx_clients_phone ON clients(phone_digits);

CREATE TABLE properties (
  id            TEXT PRIMARY KEY,                -- uuid
  client_id     TEXT NOT NULL REFERENCES clients(id),
  property_type TEXT,
  city          TEXT,
  address       TEXT,
  surface_area  REAL,
  land_area     REAL,
  rooms         INTEGER,
  notes         TEXT,
  created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_properties_client ON properties(client_id);

-- A valuation request (lead). id is the public request number shown to the visitor (VF-…).
CREATE TABLE leads (
  id                   TEXT PRIMARY KEY,
  created_at           TEXT NOT NULL,
  source               TEXT NOT NULL,          -- 'WEBSITE_AI'
  status               TEXT NOT NULL DEFAULT 'NEW',
  priority             TEXT NOT NULL,          -- 'NORMAL' | 'PRIORITY' | 'URGENT' (internal)
  client_id            TEXT NOT NULL REFERENCES clients(id),
  property_id          TEXT NOT NULL REFERENCES properties(id),
  valuation_purpose    TEXT,
  deadline             TEXT,                   -- 'Standard' | 'Urgent' | YYYY-MM-DD
  documents_status     TEXT,
  conversation_summary TEXT,
  email_sent           INTEGER NOT NULL DEFAULT 0,
  payload              TEXT NOT NULL           -- full CRM record as JSON
);
CREATE INDEX idx_leads_created ON leads(created_at);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_client ON leads(client_id);

-- Files the visitor attached (metadata only for now; the files themselves travel by email).
CREATE TABLE lead_files (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  lead_id      TEXT NOT NULL REFERENCES leads(id),
  filename     TEXT NOT NULL,
  size_bytes   INTEGER,
  content_type TEXT,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_lead_files_lead ON lead_files(lead_id);
