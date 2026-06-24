const fs = require('fs');
const http = require('http');

const csvContent = "name,phone\nTestUser1,+919175635165\nTestUser2,+917219053645\n";
const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';

let body = '';
body += `--${boundary}\r\n`;
body += 'Content-Disposition: form-data; name="file"; filename="test.csv"\r\n';
body += 'Content-Type: text/csv\r\n\r\n';
body += csvContent;
body += `\r\n--${boundary}--\r\n`;

const options = {
  hostname: '127.0.0.1',
  port: 4000,
  path: '/contacts/upload',
  method: 'POST',
  headers: {
    'Content-Type': `multipart/form-data; boundary=${boundary}`,
    'Content-Length': Buffer.byteLength(body)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
});

req.on('error', (e) => {
  console.error(`problem with request: ${e.message}`);
});

// write data to request body
req.write(body);
req.end();
