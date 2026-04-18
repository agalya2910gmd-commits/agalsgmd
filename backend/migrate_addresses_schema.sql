-- Migrate address to addresses and update columns
DO $$ 
BEGIN
    -- 1. Rename table if it exists as singular 'address'
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'address') THEN
        ALTER TABLE address RENAME TO addresses;
    END IF;

    -- 2. Rename columns safely if they exist
    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'addresses' AND column_name = 'name') THEN
        ALTER TABLE addresses RENAME COLUMN name TO full_name;
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'addresses' AND column_name = 'house_name') THEN
        ALTER TABLE addresses RENAME COLUMN house_name TO address_line_1;
    END IF;

    IF EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'addresses' AND column_name = 'street') THEN
        ALTER TABLE addresses RENAME COLUMN street TO address_line_2;
    END IF;

    -- 3. Add missing columns
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'addresses' AND column_name = 'phone') THEN
        ALTER TABLE addresses ADD COLUMN phone VARCHAR(20);
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'addresses' AND column_name = 'is_default') THEN
        ALTER TABLE addresses ADD COLUMN is_default BOOLEAN DEFAULT FALSE;
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'addresses' AND column_name = 'deleted_at') THEN
        ALTER TABLE addresses ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
    END IF;

    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'addresses' AND column_name = 'updated_at') THEN
        ALTER TABLE addresses ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;
    END IF;

END $$;

-- 4. Create trigger to update updated_at automatically
CREATE OR REPLACE FUNCTION update_addresses_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = CURRENT_TIMESTAMP;
   RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS trg_update_addresses_timestamp ON addresses;
CREATE TRIGGER trg_update_addresses_timestamp
BEFORE UPDATE ON addresses
FOR EACH ROW
EXECUTE FUNCTION update_addresses_timestamp();
