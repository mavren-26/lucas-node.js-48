// fileUploadNode.js
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 4000;
const uploadDir = path.join(__dirname, 'uploads');

// Create uploads directory if it doesn’t exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/') {
    // Serve a simple HTML form for uploading
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <form action="/upload" method="post" enctype="multipart/form-data">
        <input type="file" name="file" accept="image/*" />
        <button type="submit">Upload</button>
      </form>
    `);
  } 
  
  else if (req.method === 'POST' && req.url === '/upload') {
    const boundary = req.headers['content-type'].split('boundary=')[1];
    let rawData = '';

    req.on('data', chunk => {
      rawData += chunk;
    });

    req.on('end', () => {
      // Extract the file content
      const parts = rawData.split('--' + boundary);
      const filePart = parts.find(p => p.includes('filename="'));
      if (!filePart) {
        res.writeHead(400);
        return res.end('No file uploaded');
      }

      // Extract file name
      const match = filePart.match(/filename="(.+?)"/);
      const filename = match ? match[1] : 'upload.bin';

      // Extract binary data
      const fileStart = filePart.indexOf('\r\n\r\n') + 4;
      const fileEnd = filePart.lastIndexOf('\r\n');
      const fileData = filePart.slice(fileStart, fileEnd);

      // Save file
      const filePath = path.join(uploadDir, filename);
      fs.writeFileSync(filePath, fileData, 'binary');

      res.writeHead(200, { 'Content-Type': 'text/plain' });
      res.end(`File uploaded successfully as ${filename}`);
    });
  } 
  
  else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`File Upload Server running at http://localhost:${PORT}`);
});
