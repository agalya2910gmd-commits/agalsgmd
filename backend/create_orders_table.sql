-- ==================================================
-- PREREQUISITE: CREATE addresses TABLE (Renamed from address)
-- ==================================================
CREATE TABLE IF NOT EXISTS addresses (
    address_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    full_name VARCHAR(255),
    phone VARCHAR(20),
    address_line_1 VARCHAR(255),
    address_line_2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(100),
    pincode VARCHAR(20),
    landmark VARCHAR(255),
    address_type VARCHAR(50), -- e.g., 'Home', 'Office'
    is_default BOOLEAN DEFAULT FALSE,
    deleted_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_addresses_customer_id ON addresses(customer_id);

-- ==================================================
-- CREATE NEW orders_table TABLE
-- ==================================================
CREATE TABLE IF NOT EXISTS orders_table (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER REFERENCES customers(id),
    address_id INTEGER REFERENCES addresses(address_id),
    status VARCHAR(50) DEFAULT 'pending',
    total_amount DECIMAL(12, 2) NOT NULL,
    discount_amount DECIMAL(12, 2) DEFAULT 0,
    final_amount DECIMAL(12, 2) NOT NULL,
    coupon_code VARCHAR(100),
    ordered_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_orders_table_customer_id ON orders_table(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_table_address_id ON orders_table(address_id);
