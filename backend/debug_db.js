const { Pool } = require('pg');
const pool = new Pool({ user: 'postgres', host: 'localhost', database: 'postgres', password: 'postgres123', port: 5432 });

async function check() {
    try {
        console.log("--- Checking triggers on orders ---");
        const triggersO = await pool.query(`
            SELECT tgname as trigger_name, pg_get_triggerdef(pg_trigger.oid) as definition
            FROM pg_trigger
            JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
            WHERE pg_class.relname = 'orders'
            AND NOT tgisinternal
        `);
        console.log("Triggers on orders:", JSON.stringify(triggersO.rows, null, 2));

        console.log("--- Checking triggers on finance_transactions ---");
        const triggersF = await pool.query(`
            SELECT tgname as trigger_name, pg_get_triggerdef(pg_trigger.oid) as definition
            FROM pg_trigger
            JOIN pg_class ON pg_trigger.tgrelid = pg_class.oid
            WHERE pg_class.relname = 'finance_transactions'
            AND NOT tgisinternal
        `);
        console.log("Triggers on finance_transactions:", JSON.stringify(triggersF.rows, null, 2));


        console.log("--- Checking for any routine that mentions finance_transactions ---");
        const routines = await pool.query(`
            SELECT routine_name, routine_definition 
            FROM information_schema.routines 
            WHERE routine_definition ILIKE '%finance_transactions%'
        `);
        for (const r of routines.rows) {
            console.log(`--- Routine: ${r.routine_name} ---`);
            if (r.routine_definition.includes('user_id')) {
                console.log("!!! Contains user_id !!!");
            }
            // console.log(r.routine_definition); // Skipping full definition for now
        }

        console.log("--- Checking all tables for 'user_id' column ---");
        const tables = await pool.query(`
            SELECT table_name 
            FROM information_schema.columns 
            WHERE column_name = 'user_id' 
            AND table_schema = 'public'
        `);
        console.log("Tables with user_id:", tables.rows.map(r => r.table_name));

    } catch (err) {
        console.error(err);
    } finally {
        await pool.end();
    }
}

check();
