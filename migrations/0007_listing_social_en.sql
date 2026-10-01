-- English version of the listing share image (link preview on /en pages).
ALTER TABLE listing_social ADD COLUMN data_en BLOB;
ALTER TABLE listing_social ADD COLUMN content_type_en TEXT;
ALTER TABLE listing_social ADD COLUMN updated_at_en TEXT;
