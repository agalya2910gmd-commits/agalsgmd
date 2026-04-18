-- ==================================================
-- SAMPLE INSERT DATA
-- ==================================================

-- 1. Insert a sample address for customer_id = 2
INSERT INTO addresses (customer_id, full_name, address_line_1, address_line_2, city, state, pincode, address_type)
VALUES (2, 'John Doe', 'Beach Villa', 'Coastal Road', 'Chennai', 'Tamil Nadu', '600001', 'Home')
RETURNING address_id;

-- 2. Insert a sample order for customer_id = 2 linking to the new address
INSERT INTO orders_table (customer_id, address_id, status, total_amount, discount_amount, final_amount, coupon_code)
VALUES (2, 1, 'pending', 1000.00, 100.00, 900.00, 'WELCOME10')
RETURNING order_id;
