-- Share image (1200×630) per listing, generated in the admin browser from the cover photo.
-- Used as the link preview on WhatsApp, Facebook, LinkedIn etc.
CREATE TABLE IF NOT EXISTS listing_social (
  listing_id   TEXT PRIMARY KEY,
  content_type TEXT NOT NULL,
  data         BLOB NOT NULL,
  updated_at   TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
