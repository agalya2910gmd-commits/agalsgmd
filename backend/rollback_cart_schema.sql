-- ==================================================
-- ROLLBACK SCHEMA UPDATE
-- ==================================================

-- Drop the new table
DROP TABLE IF EXISTS cart_items CASCADE;

-- Remove new columns from cart
ALTER TABLE cart DROP COLUMN IF EXISTS customer_id;
ALTER TABLE cart DROP COLUMN IF EXISTS cart_id;
ALTER TABLE cart DROP COLUMN IF EXISTS updated_at;
ALTER TABLE cart DROP COLUMN IF EXISTS is_active;
