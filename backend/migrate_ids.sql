-- 1. Drop constraints
ALTER TABLE IF EXISTS payments DROP CONSTRAINT IF EXISTS payments_customer_id_fkey;
ALTER TABLE IF EXISTS address DROP CONSTRAINT IF EXISTS address_customer_id_fkey;
ALTER TABLE IF EXISTS orders_table DROP CONSTRAINT IF EXISTS orders_table_customer_id_fkey;

-- 2. Alter column types (VARCHAR 50)
ALTER TABLE customers ALTER COLUMN id TYPE VARCHAR(50);
ALTER TABLE address ALTER COLUMN customer_id TYPE VARCHAR(50);
ALTER TABLE orders_table ALTER COLUMN customer_id TYPE VARCHAR(50);
ALTER TABLE payments ALTER COLUMN customer_id TYPE VARCHAR(50);
ALTER TABLE cart ALTER COLUMN user_id TYPE VARCHAR(50);
ALTER TABLE cart ALTER COLUMN customer_id TYPE VARCHAR(50);
ALTER TABLE wishlist ALTER COLUMN user_id TYPE VARCHAR(50);
ALTER TABLE orders ALTER COLUMN user_id TYPE VARCHAR(50);
ALTER TABLE reviews ALTER COLUMN customer_id TYPE VARCHAR(50);
ALTER TABLE contact ALTER COLUMN user_id TYPE VARCHAR(50);

-- 3. Update existing numeric values to Cxxx format
UPDATE customers SET id = 'C' || LPAD(id::text, 3, '0') WHERE id !~ '^C';
UPDATE address SET customer_id = 'C' || LPAD(customer_id::text, 3, '0') WHERE customer_id IS NOT NULL AND customer_id !~ '^C';
UPDATE orders_table SET customer_id = 'C' || LPAD(customer_id::text, 3, '0') WHERE customer_id IS NOT NULL AND customer_id !~ '^C';
UPDATE payments SET customer_id = 'C' || LPAD(customer_id::text, 3, '0') WHERE customer_id IS NOT NULL AND customer_id !~ '^C';
UPDATE cart SET user_id = 'C' || LPAD(user_id::text, 3, '0') WHERE user_id IS NOT NULL AND user_id !~ '^C';
UPDATE cart SET customer_id = 'C' || LPAD(customer_id::text, 3, '0') WHERE customer_id IS NOT NULL AND customer_id !~ '^C';
UPDATE wishlist SET user_id = 'C' || LPAD(user_id::text, 3, '0') WHERE user_id IS NOT NULL AND user_id !~ '^C';
UPDATE orders SET user_id = 'C' || LPAD(user_id::text, 3, '0') WHERE user_id IS NOT NULL AND user_id !~ '^C';
UPDATE reviews SET customer_id = 'C' || LPAD(customer_id::text, 3, '0') WHERE customer_id IS NOT NULL AND customer_id !~ '^C';
UPDATE contact SET user_id = 'C' || LPAD(user_id::text, 3, '0') WHERE user_id IS NOT NULL AND user_id !~ '^C';

-- 4. Restore constraints
ALTER TABLE payments ADD CONSTRAINT payments_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE address ADD CONSTRAINT address_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
ALTER TABLE orders_table ADD CONSTRAINT orders_table_customer_id_fkey FOREIGN KEY (customer_id) REFERENCES customers(id);
