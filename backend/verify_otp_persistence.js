const axios = require('axios');

async function testOtpPersistence() {
  const phone = '9876543210';
  console.log(`--- Testing OTP Persistence for ${phone} ---`);

  try {
    // 1. Send OTP
    console.log('1. Sending OTP...');
    const sendRes = await axios.post('http://localhost:5000/api/otp/send', {
      phone_or_email: phone
    });
    console.log('Response:', sendRes.data);

    // 2. We need to manually check the DB for the code since we didn't return it in the API
    // (In a real test, one might look at the console log of the server or check the DB directly)
    // For this script, I'll use a direct DB check.
    const { Pool } = require('pg');
    const pool = new Pool({
      user: 'postgres',
      host: 'localhost',
      database: 'postgres',
      password: 'postgres123',
      port: 5432,
    });
    
    const dbRes = await pool.query('SELECT otp_code FROM otp_verifications WHERE phone_or_email = $1 ORDER BY created_at DESC LIMIT 1', [phone]);
    const code = dbRes.rows[0].otp_code;
    console.log(`Found code in DB: ${code}`);

    // 3. Verify OTP
    console.log('2. Verifying OTP...');
    const verifyRes = await axios.post('http://localhost:5000/api/otp/verify', {
      phone_or_email: phone,
      otp_code: code
    });
    console.log('Response:', verifyRes.data);

    if (verifyRes.data.verified) {
      console.log('✅ OTP Verification Successful!');
      
      // 4. Verify DB status
      const statusRes = await pool.query('SELECT is_verified, updated_at FROM otp_verifications WHERE phone_or_email = $1 ORDER BY created_at DESC LIMIT 1', [phone]);
      console.log('DB Status:', statusRes.rows[0]);
    } else {
      console.error('❌ OTP Verification Failed!');
    }

    await pool.end();
  } catch (err) {
    console.error('Test error:', err.response ? err.response.data : err.message);
  }
}

testOtpPersistence();
