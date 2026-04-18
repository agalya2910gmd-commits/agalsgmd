-- Run this SQL directly in pgAdmin Query Tool or DBeaver
-- to create the reviews table

CREATE TABLE IF NOT EXISTS reviews (
  review_id     SERIAL PRIMARY KEY,
  product_id    INTEGER NOT NULL,
  customer_id   INTEGER,
  order_id      INTEGER,
  rating        INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title         VARCHAR(255),
  body          TEXT,
  reviewer_name VARCHAR(255),
  is_approved   BOOLEAN DEFAULT TRUE,
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
