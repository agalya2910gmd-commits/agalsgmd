const http = require('http');

http.get('http://localhost:5000/api/admin-all-users', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Total users:', json.length);
      console.log('First user sample:', json[0]);
    } catch (e) {
      console.error('Failed to parse JSON:', e.message);
    }
  });
}).on('error', (err) => {
  console.error('Error:', err.message);
});
