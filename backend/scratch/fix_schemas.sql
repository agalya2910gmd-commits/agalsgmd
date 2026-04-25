-- FORCE STANDARDIZATION OF TYPES
DO $$ 
BEGIN 
  -- Fix bank_account
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'bank_account' AND column_name = 'owner_id' AND data_type = 'uuid') THEN
    ALTER TABLE bank_account ALTER COLUMN owner_id TYPE VARCHAR(255);
    ALTER TABLE bank_account ALTER COLUMN bank_account_id TYPE VARCHAR(255);
    ALTER TABLE bank_account ALTER COLUMN verified_by_admin_id TYPE VARCHAR(255);
  END IF;
  
  -- Fix coupon_usage
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'coupon_usage' AND column_name = 'customer_id' AND data_type = 'uuid') THEN
    ALTER TABLE coupon_usage ALTER COLUMN customer_id TYPE VARCHAR(255);
    ALTER TABLE coupon_usage ALTER COLUMN usage_id TYPE VARCHAR(255);
    -- Handle coupon_id and order_id (using NULL if they were UUIDs before, as we can't cast UUID to INT easily if they are random)
    ALTER TABLE coupon_usage ALTER COLUMN coupon_id TYPE INTEGER USING (NULL);
    ALTER TABLE coupon_usage ALTER COLUMN order_id TYPE INTEGER USING (NULL);
  END IF;
  
  -- Fix finance_transactions
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'finance_transactions' AND column_name = 'daily_finance_id' AND data_type = 'uuid') THEN
    ALTER TABLE finance_transactions ALTER COLUMN daily_finance_id TYPE VARCHAR(255);
    ALTER TABLE finance_transactions ALTER COLUMN finance_transaction_id TYPE VARCHAR(255);
    ALTER TABLE finance_transactions ALTER COLUMN user_id TYPE VARCHAR(255);
  END IF;
  
  -- Fix auth_sessions
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'auth_sessions' AND column_name = 'user_ref_id' AND data_type = 'uuid') THEN
    ALTER TABLE auth_sessions ALTER COLUMN user_ref_id TYPE VARCHAR(255);
    ALTER TABLE auth_sessions ALTER COLUMN session_id TYPE VARCHAR(255);
  END IF;

  -- Fix half_yearly_finances
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'half_yearly_finances' AND column_name = 'seller_id' AND data_type = 'uuid') THEN
    ALTER TABLE half_yearly_finances ALTER COLUMN seller_id TYPE VARCHAR(255);
    ALTER TABLE half_yearly_finances ALTER COLUMN half_yearly_finances_id TYPE VARCHAR(255);
  END IF;
END $$;
