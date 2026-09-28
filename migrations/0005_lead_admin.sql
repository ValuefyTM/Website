-- Admin follow-up on assistant requests: internal notes and last change.
ALTER TABLE leads ADD COLUMN admin_notes TEXT;
ALTER TABLE leads ADD COLUMN updated_at TEXT;
