-- English versions of a listing's texts, shown on the English site (/en/properties). NULL = not translated yet (falls back to Romanian).
ALTER TABLE listings ADD COLUMN title_en TEXT;
ALTER TABLE listings ADD COLUMN description_en TEXT;   -- paragraphs separated by blank lines, like `description`
ALTER TABLE listings ADD COLUMN features_en TEXT;      -- JSON array of strings, like `features`
