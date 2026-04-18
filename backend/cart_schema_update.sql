-- ==================================================
-- 1) UPDATE EXISTING cart TABLE SAFELY
-- ==================================================

-- Add customer_id (copying from user_id if it exists)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart' AND column_name='customer_id') THEN
        ALTER TABLE cart ADD COLUMN customer_id INTEGER;
    END IF;
END $$;
UPDATE cart SET customer_id = user_id WHERE customer_id IS NULL;

-- Add cart_id (copying from id)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart' AND column_name='cart_id') THEN
        ALTER TABLE cart ADD COLUMN cart_id INTEGER;
    END IF;
END $$;
UPDATE cart SET cart_id = id WHERE cart_id IS NULL;

-- Add created_at if missing (already exists in original schema, but ensuring)
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart' AND column_name='created_at') THEN
        ALTER TABLE cart ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Add updated_at
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart' AND column_name='updated_at') THEN
        ALTER TABLE cart ADD COLUMN updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
    END IF;
END $$;

-- Add is_active
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='cart' AND column_name='is_active') THEN
        ALTER TABLE cart ADD COLUMN is_active BOOLEAN DEFAULT TRUE;
    END IF;
END $$;


-- ==================================================
-- 2) CREATE NEW cart_items TABLE
-- ==================================================

CREATE TABLE IF NOT EXISTS cart_items (
    cart_item_id SERIAL PRIMARY KEY,
    cart_id INTEGER REFERENCES cart(id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES seller_products(id) ON DELETE SET NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(10,2),
    is_deleted BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- ==================================================
-- 3) SAFE DATA COPY
-- ==================================================

-- Copy data from cart to cart_items where not already present and product exists
INSERT INTO cart_items (cart_id, product_id, quantity, unit_price, created_at)
SELECT id, product_id, quantity, price, created_at FROM cart c
WHERE EXISTS (SELECT 1 FROM seller_products p WHERE p.id = c.product_id)
ON CONFLICT DO NOTHING;
