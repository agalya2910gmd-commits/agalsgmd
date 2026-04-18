const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "postgres123",
  port: 5432,
});

async function run() {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    console.log("Creating PostgreSQL function for automated finance syncing...");
    
    // Enable uuid-ossp just in case
    await client.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";');

    await client.query(`
      CREATE OR REPLACE FUNCTION sync_finances_on_order()
      RETURNS TRIGGER AS $$
      DECLARE
        v_seller_id VARCHAR(255);
        v_date DATE;
        v_week INT;
        v_month INT;
        v_quarter INT;
        v_year INT;
        v_rev DECIMAL(10,2);
        v_com DECIMAL(10,2);
        v_net DECIMAL(10,2);
        v_ann_id VARCHAR(255);
        v_qtr_id VARCHAR(255);
        v_mon_id VARCHAR(255);
        v_wk_id VARCHAR(255);
        v_day_id VARCHAR(255);
      BEGIN
        SELECT seller_id INTO v_seller_id FROM seller_products WHERE id = NEW.product_id;
        IF v_seller_id IS NULL THEN
          RETURN NEW;
        END IF;

        v_date := (NEW.created_at AT TIME ZONE 'UTC')::DATE;
        v_week := EXTRACT(WEEK FROM v_date);
        v_month := EXTRACT(MONTH FROM v_date);
        v_quarter := EXTRACT(QUARTER FROM v_date);
        v_year := EXTRACT(YEAR FROM v_date);

        -- Cast amount appropriately 
        v_rev := CAST(NEW.total_amount AS DECIMAL(10,2));
        v_com := v_rev * 0.10; -- Assuming standard 10% platform commission
        v_net := v_rev - v_com;

        -- ANNUAL
        SELECT annual_finance_id INTO v_ann_id FROM annual_finances WHERE seller_id = v_seller_id AND year = v_year;
        IF v_ann_id IS NULL THEN
          v_ann_id := 'AF-' || uuid_generate_v4()::varchar;
          INSERT INTO annual_finances (annual_finance_id, seller_id, year, total_revenue, platform_commission, net_seller_earnings)
          VALUES (v_ann_id, v_seller_id, v_year, v_rev, v_com, v_net);
        ELSE
          UPDATE annual_finances SET total_revenue = total_revenue + v_rev, platform_commission = platform_commission + v_com, net_seller_earnings = net_seller_earnings + v_net WHERE annual_finance_id = v_ann_id;
        END IF;

        -- QUARTERLY
        SELECT quarterly_finance_id INTO v_qtr_id FROM quarterly_finances WHERE seller_id = v_seller_id AND year = v_year AND quarter_number = v_quarter;
        IF v_qtr_id IS NULL THEN
          v_qtr_id := 'QF-' || uuid_generate_v4()::varchar;
          INSERT INTO quarterly_finances (quarterly_finance_id, seller_id, quarter_number, year, total_revenue, platform_commission, net_seller_earnings)
          VALUES (v_qtr_id, v_seller_id, v_quarter, v_year, v_rev, v_com, v_net);
        ELSE
          UPDATE quarterly_finances SET total_revenue = total_revenue + v_rev, platform_commission = platform_commission + v_com, net_seller_earnings = net_seller_earnings + v_net WHERE quarterly_finance_id = v_qtr_id;
        END IF;

        -- MONTHLY
        SELECT monthly_finance_id INTO v_mon_id FROM monthly_finances WHERE seller_id = v_seller_id AND year = v_year AND month_number = v_month;
        IF v_mon_id IS NULL THEN
          v_mon_id := 'MF-' || uuid_generate_v4()::varchar;
          INSERT INTO monthly_finances (monthly_finance_id, quarterly_finance_id, seller_id, month_number, year, total_revenue, platform_commission, net_seller_earnings)
          VALUES (v_mon_id, v_qtr_id, v_seller_id, v_month, v_year, v_rev, v_com, v_net);
        ELSE
          UPDATE monthly_finances SET total_revenue = total_revenue + v_rev, platform_commission = platform_commission + v_com, net_seller_earnings = net_seller_earnings + v_net WHERE monthly_finance_id = v_mon_id;
        END IF;

        -- WEEKLY
        SELECT weekly_finance_id INTO v_wk_id FROM weekly_finances WHERE seller_id = v_seller_id AND year = v_year AND week_number = v_week;
        IF v_wk_id IS NULL THEN
          v_wk_id := 'WF-' || uuid_generate_v4()::varchar;
          INSERT INTO weekly_finances (weekly_finance_id, seller_id, week_number, year, total_revenue, platform_commission, net_seller_earnings)
          VALUES (v_wk_id, v_seller_id, v_week, v_year, v_rev, v_com, v_net);
        ELSE
          UPDATE weekly_finances SET total_revenue = total_revenue + v_rev, platform_commission = platform_commission + v_com, net_seller_earnings = net_seller_earnings + v_net WHERE weekly_finance_id = v_wk_id;
        END IF;

        -- DAILY
        SELECT daily_finance_id INTO v_day_id FROM daily_finances WHERE seller_id = v_seller_id AND date = v_date;
        IF v_day_id IS NULL THEN
          v_day_id := 'DF-' || uuid_generate_v4()::varchar;
          INSERT INTO daily_finances (daily_finance_id, weekly_finance_id, monthly_finance_id, seller_id, date, total_revenue, platform_commission, net_seller_earnings)
          VALUES (v_day_id, v_wk_id, v_mon_id, v_seller_id, v_date, v_rev, v_com, v_net);
        ELSE
          UPDATE daily_finances SET total_revenue = total_revenue + v_rev, platform_commission = platform_commission + v_com, net_seller_earnings = net_seller_earnings + v_net WHERE daily_finance_id = v_day_id;
        END IF;

        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    console.log("Attaching POST-INSERT trigger to orders table...");
    await client.query(`
      DROP TRIGGER IF EXISTS trigger_sync_finances_on_order ON orders;
      CREATE TRIGGER trigger_sync_finances_on_order
      AFTER INSERT ON orders
      FOR EACH ROW
      EXECUTE FUNCTION sync_finances_on_order();
    `);

    console.log("Truncating existing finance tables to re-seed cleanly...");
    await client.query("TRUNCATE daily_finances, weekly_finances, monthly_finances, quarterly_finances, annual_finances RESTART IDENTITY CASCADE");

    console.log("Aggregating historical order data into finances via JS logic...");
    
    // Simulate insertions locally so we don't spam the trigger recursively 
    // Actually, since the trigger fires "ON INSERT ON orders", if we just iterate and compute, it's safer.
    // However, an easy trick to retroactively trigger it: 
    // CREATE a temporary replica, insert into the real table. But orders already exists. 
    // We can just execute the logic manually for the old orders!
    
    const ordersRes = await client.query("SELECT * FROM orders");
    
    for (const order of ordersRes.rows) {
      // Direct call to the function by simulating a pseudo trigger action via parameterized anonymous block OR simpler: we can just manually run the query logic using pg context.
      // Easiest and most bulletproof is directly executing building blocks:
      const v_date = new Date(order.created_at);
      const v_year = v_date.getUTCFullYear();
      const v_month = v_date.getUTCMonth() + 1;
      const v_quarter = Math.ceil(v_month / 3);
      
      const targetTime = v_date.getTime();
      const firstDayOfYear = new Date(Date.UTC(v_date.getUTCFullYear(), 0, 1)).getTime();
      const pastDaysOfYear = (targetTime - firstDayOfYear) / 86400000;
      const v_week = Math.ceil((pastDaysOfYear + new Date(Date.UTC(v_date.getUTCFullYear(), 0, 1)).getUTCDay() + 1) / 7);
      
      // Get seller
      const sellerRes = await client.query("SELECT seller_id FROM seller_products WHERE id = $1", [order.product_id]);
      if (sellerRes.rows.length === 0 || !sellerRes.rows[0].seller_id) continue;
      const v_seller_id = sellerRes.rows[0].seller_id;
      
      const v_rev = parseFloat(order.total_amount) || 0;
      const v_com = v_rev * 0.10;
      const v_net = v_rev - v_com;

      // Same logic as PL/PGSQL
      // Ann
      let ann = await client.query("SELECT annual_finance_id FROM annual_finances WHERE seller_id=$1 AND year=$2", [v_seller_id, v_year]);
      let annId = ann.rows.length ? ann.rows[0].annual_finance_id : `AF-${Math.random().toString(36).substr(2, 9)}`;
      if (!ann.rows.length) await client.query("INSERT INTO annual_finances (annual_finance_id, seller_id, year, total_revenue, platform_commission, net_seller_earnings) VALUES ($1,$2,$3,$4,$5,$6)", [annId, v_seller_id, v_year, v_rev, v_com, v_net]);
      else await client.query("UPDATE annual_finances SET total_revenue=total_revenue+$1, platform_commission=platform_commission+$2, net_seller_earnings=net_seller_earnings+$3 WHERE annual_finance_id=$4", [v_rev, v_com, v_net, annId]);

      // Qtr
      let qtr = await client.query("SELECT quarterly_finance_id FROM quarterly_finances WHERE seller_id=$1 AND year=$2 AND quarter_number=$3", [v_seller_id, v_year, v_quarter]);
      let qtrId = qtr.rows.length ? qtr.rows[0].quarterly_finance_id : `QF-${Math.random().toString(36).substr(2, 9)}`;
      if (!qtr.rows.length) await client.query("INSERT INTO quarterly_finances (quarterly_finance_id, seller_id, quarter_number, year, total_revenue, platform_commission, net_seller_earnings) VALUES ($1,$2,$3,$4,$5,$6,$7)", [qtrId, v_seller_id, v_quarter, v_year, v_rev, v_com, v_net]);
      else await client.query("UPDATE quarterly_finances SET total_revenue=total_revenue+$1, platform_commission=platform_commission+$2, net_seller_earnings=net_seller_earnings+$3 WHERE quarterly_finance_id=$4", [v_rev, v_com, v_net, qtrId]);

      // Mon
      let mon = await client.query("SELECT monthly_finance_id FROM monthly_finances WHERE seller_id=$1 AND year=$2 AND month_number=$3", [v_seller_id, v_year, v_month]);
      let monId = mon.rows.length ? mon.rows[0].monthly_finance_id : `MF-${Math.random().toString(36).substr(2, 9)}`;
      if (!mon.rows.length) await client.query("INSERT INTO monthly_finances (monthly_finance_id, quarterly_finance_id, seller_id, month_number, year, total_revenue, platform_commission, net_seller_earnings) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [monId, qtrId, v_seller_id, v_month, v_year, v_rev, v_com, v_net]);
      else await client.query("UPDATE monthly_finances SET total_revenue=total_revenue+$1, platform_commission=platform_commission+$2, net_seller_earnings=net_seller_earnings+$3 WHERE monthly_finance_id=$4", [v_rev, v_com, v_net, monId]);

      // Wk
      let wk = await client.query("SELECT weekly_finance_id FROM weekly_finances WHERE seller_id=$1 AND year=$2 AND week_number=$3", [v_seller_id, v_year, v_week]);
      let wkId = wk.rows.length ? wk.rows[0].weekly_finance_id : `WF-${Math.random().toString(36).substr(2, 9)}`;
      if (!wk.rows.length) await client.query("INSERT INTO weekly_finances (weekly_finance_id, seller_id, week_number, year, total_revenue, platform_commission, net_seller_earnings) VALUES ($1,$2,$3,$4,$5,$6,$7)", [wkId, v_seller_id, v_week, v_year, v_rev, v_com, v_net]);
      else await client.query("UPDATE weekly_finances SET total_revenue=total_revenue+$1, platform_commission=platform_commission+$2, net_seller_earnings=net_seller_earnings+$3 WHERE weekly_finance_id=$4", [v_rev, v_com, v_net, wkId]);

      // Day
      const dateStr = v_date.toISOString().split('T')[0];
      let day = await client.query("SELECT daily_finance_id FROM daily_finances WHERE seller_id=$1 AND date=$2", [v_seller_id, dateStr]);
      let dayId = day.rows.length ? day.rows[0].daily_finance_id : `DF-${Math.random().toString(36).substr(2, 9)}`;
      if (!day.rows.length) await client.query("INSERT INTO daily_finances (daily_finance_id, weekly_finance_id, monthly_finance_id, seller_id, date, total_revenue, platform_commission, net_seller_earnings) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)", [dayId, wkId, monId, v_seller_id, dateStr, v_rev, v_com, v_net]);
      else await client.query("UPDATE daily_finances SET total_revenue=total_revenue+$1, platform_commission=platform_commission+$2, net_seller_earnings=net_seller_earnings+$3 WHERE daily_finance_id=$4", [v_rev, v_com, v_net, dayId]);
    }

    await client.query("COMMIT");
    console.log("Data migration and Future Automations (Triggers) setup complete!");
  } catch (err) {
    await client.query("ROLLBACK");
    console.error(err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
