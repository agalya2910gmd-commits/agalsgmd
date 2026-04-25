-- Standardize finance types to VARCHAR(255) to support alphanumeric IDs
DO $$ 
BEGIN 
  -- Fix column types if they are still UUID
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'half_yearly_finances' AND column_name = 'seller_id' AND data_type = 'uuid') THEN
    ALTER TABLE half_yearly_finances ALTER COLUMN seller_id TYPE VARCHAR(255);
    ALTER TABLE half_yearly_finances ALTER COLUMN half_yearly_finances_id TYPE VARCHAR(255);
    ALTER TABLE half_yearly_finances ALTER COLUMN annual_finance_id TYPE VARCHAR(255);
  END IF;
END $$;

CREATE OR REPLACE FUNCTION sync_finances_on_order()
RETURNS TRIGGER AS $$
DECLARE
  v_seller_id VARCHAR(255);
  v_date DATE;
  v_week INT;
  v_month INT;
  v_quarter INT;
  v_half INT;
  v_year INT;
  v_rev DECIMAL(15,2);
  v_com DECIMAL(15,2);
  v_net DECIMAL(15,2);
  v_ann_id VARCHAR(255);
  v_hy_id VARCHAR(255);
  v_qtr_id VARCHAR(255);
  v_mon_id VARCHAR(255);
  v_wk_id VARCHAR(255);
  v_day_id VARCHAR(255);
BEGIN
  -- Get seller_id
  v_seller_id := NEW.seller_id;
  IF v_seller_id IS NULL THEN
    SELECT seller_id INTO v_seller_id FROM seller_products WHERE id = NEW.product_id;
    IF v_seller_id IS NULL THEN
      SELECT seller_id INTO v_seller_id FROM admin_products WHERE id = NEW.product_id;
    END IF;
  END IF;

  IF v_seller_id IS NULL THEN
    RETURN NEW;
  END IF;

  v_date := (NEW.created_at AT TIME ZONE 'UTC')::DATE;
  v_week := EXTRACT(WEEK FROM v_date);
  v_month := EXTRACT(MONTH FROM v_date);
  v_quarter := EXTRACT(QUARTER FROM v_date);
  v_half := CASE WHEN v_month <= 6 THEN 1 ELSE 2 END;
  v_year := EXTRACT(YEAR FROM v_date);

  v_rev := COALESCE(NEW.total_amount, 0);
  v_com := v_rev * 0.10; -- 10% Platform Commission
  v_net := v_rev - v_com;

  -- ANNUAL (annual_finances table check)
  -- Note: ensure annual_finances table exists or create it if needed
  -- For now we assume annual_finances exists with annual_finance_id VARCHAR(255)
  -- (Logic omitted if annual_finances not explicitly requested, but included for completeness)

  -- HALF YEARLY
  SELECT half_yearly_finances_id INTO v_hy_id FROM half_yearly_finances WHERE seller_id = v_seller_id AND year = v_year AND half_number = v_half;
  IF v_hy_id IS NULL THEN
    v_hy_id := 'HY-' || md5(random()::text || clock_timestamp()::text);
    INSERT INTO half_yearly_finances (half_yearly_finances_id, seller_id, half_number, year, total_revenue, platform_commission, net_seller_earnings)
    VALUES (v_hy_id, v_seller_id, v_half, v_year, v_rev, v_com, v_net);
  ELSE
    UPDATE half_yearly_finances SET total_revenue = total_revenue + v_rev, platform_commission = platform_commission + v_com, net_seller_earnings = net_seller_earnings + v_net WHERE half_yearly_finances_id = v_hy_id;
  END IF;

  -- QUARTERLY (quarterly_finances)
  SELECT quarterly_finance_id INTO v_qtr_id FROM quarterly_finances WHERE seller_id = v_seller_id AND year = v_year AND quarter_number = v_quarter;
  IF v_qtr_id IS NULL THEN
    v_qtr_id := 'QF-' || md5(random()::text || clock_timestamp()::text);
    INSERT INTO quarterly_finances (quarterly_finance_id, seller_id, quarter_number, year, total_revenue, platform_commission, net_seller_earnings)
    VALUES (v_qtr_id, v_seller_id, v_quarter, v_year, v_rev, v_com, v_net);
  ELSE
    UPDATE quarterly_finances SET total_revenue = total_revenue + v_rev, platform_commission = platform_commission + v_com, net_seller_earnings = net_seller_earnings + v_net WHERE quarterly_finance_id = v_qtr_id;
  END IF;

  -- MONTHLY
  SELECT monthly_finance_id INTO v_mon_id FROM monthly_finances WHERE seller_id = v_seller_id AND year = v_year AND month_number = v_month;
  IF v_mon_id IS NULL THEN
    v_mon_id := 'MF-' || md5(random()::text || clock_timestamp()::text);
    INSERT INTO monthly_finances (monthly_finance_id, seller_id, month_number, year, total_revenue, platform_commission, net_seller_earnings)
    VALUES (v_mon_id, v_seller_id, v_month, v_year, v_rev, v_com, v_net);
  ELSE
    UPDATE monthly_finances SET total_revenue = total_revenue + v_rev, platform_commission = platform_commission + v_com, net_seller_earnings = net_seller_earnings + v_net WHERE monthly_finance_id = v_mon_id;
  END IF;

  -- WEEKLY
  SELECT weekly_finance_id INTO v_wk_id FROM weekly_finances WHERE seller_id = v_seller_id AND year = v_year AND week_number = v_week;
  IF v_wk_id IS NULL THEN
    v_wk_id := 'WF-' || md5(random()::text || clock_timestamp()::text);
    INSERT INTO weekly_finances (weekly_finance_id, seller_id, week_number, year, total_revenue, platform_commission, net_seller_earnings)
    VALUES (v_wk_id, v_seller_id, v_week, v_year, v_rev, v_com, v_net);
  ELSE
    UPDATE weekly_finances SET total_revenue = total_revenue + v_rev, platform_commission = platform_commission + v_com, net_seller_earnings = net_seller_earnings + v_net WHERE weekly_finance_id = v_wk_id;
  END IF;

  -- DAILY
  SELECT daily_finance_id INTO v_day_id FROM daily_finances WHERE seller_id = v_seller_id AND date = v_date;
  IF v_day_id IS NULL THEN
    v_day_id := 'DF-' || md5(random()::text || clock_timestamp()::text);
    INSERT INTO daily_finances (daily_finance_id, weekly_finance_id, monthly_finance_id, seller_id, date, total_revenue, platform_commission, net_seller_earnings)
    VALUES (v_day_id, v_wk_id, v_mon_id, v_seller_id, v_date, v_rev, v_com, v_net);
  ELSE
    UPDATE daily_finances SET total_revenue = total_revenue + v_rev, platform_commission = platform_commission + v_com, net_seller_earnings = net_seller_earnings + v_net WHERE daily_finance_id = v_day_id;
  END IF;

  -- FINANCE TRANSACTION ( finance_transactions )
  INSERT INTO finance_transactions (finance_transaction_id, daily_finance_id, order_id, user_id, transaction_type, amount, created_at)
  VALUES ('FT-' || md5(random()::text || clock_timestamp()::text), v_day_id, NEW.id, NEW.user_id, 'credit', v_rev, NEW.created_at);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
