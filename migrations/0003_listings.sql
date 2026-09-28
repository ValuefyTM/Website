-- Real estate listings (properties VALUEFY sells for clients), their photos and visitor inquiries.

CREATE TABLE listings (
  id           TEXT PRIMARY KEY,               -- uuid
  slug         TEXT NOT NULL UNIQUE,           -- URL: /imobiliare/<slug>
  title        TEXT NOT NULL,
  type         TEXT NOT NULL,                  -- Apartament | Casă | Teren | Spațiu comercial | Hală / industrial
  city         TEXT NOT NULL,
  zone         TEXT NOT NULL DEFAULT '',
  price        INTEGER NOT NULL,               -- EUR
  surface      REAL,                           -- usable m²
  land         REAL,                           -- land m²
  rooms        INTEGER,
  baths        INTEGER,
  floor        TEXT,
  year         INTEGER,
  status       TEXT,                           -- Nou | Rezervat | Preț redus | NULL
  features     TEXT NOT NULL DEFAULT '[]',     -- JSON array of strings
  description  TEXT NOT NULL DEFAULT '',       -- paragraphs separated by blank lines
  report_date  TEXT,                           -- YYYY-MM when a valuation report is available
  published    INTEGER NOT NULL DEFAULT 0,     -- 1 = visible on the site
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
  updated_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_listings_published ON listings(published, created_at);

-- Photos are resized in the browser (max 1600 px JPEG) before upload, so each stays well under D1's 2 MB value limit.
CREATE TABLE listing_photos (
  id           TEXT PRIMARY KEY,               -- uuid, used in /api/photos/<id>
  listing_id   TEXT NOT NULL REFERENCES listings(id) ON DELETE CASCADE,
  position     INTEGER NOT NULL DEFAULT 0,
  content_type TEXT NOT NULL,
  size_bytes   INTEGER NOT NULL,
  data         BLOB NOT NULL,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_listing_photos_listing ON listing_photos(listing_id, position);

-- Viewing requests and valuation-report requests from the listing pages.
CREATE TABLE listing_inquiries (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id   TEXT REFERENCES listings(id) ON DELETE SET NULL,
  listing_title TEXT NOT NULL,
  kind         TEXT NOT NULL,                  -- viewing | report
  name         TEXT NOT NULL,
  email        TEXT,
  phone        TEXT,
  reason       TEXT,
  message      TEXT,
  status       TEXT NOT NULL DEFAULT 'NEW',    -- NEW | SENT | DONE
  email_sent   INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX idx_listing_inquiries_created ON listing_inquiries(created_at);
