// rateLimiterNode.js
const http = require('http');

const PORT = 3000;
const requests = {}; // Store request timestamps for each IP

const server = http.createServer((req, res) => {
  const ip = req.socket.remoteAddress;
  const now = Date.now();

  if (!requests[ip]) {
    requests[ip] = [];
  }

  // Keep only requests made in the last 1 minute
  requests[ip] = requests[ip].filter(timestamp => now - timestamp < 60000);

  // Check if limit exceeded
  if (requests[ip].length >= 5) {
    res.writeHead(429, { 'Content-Type': 'text/plain' });
    res.end('Too Many Requests - Try again later');
    return;
  }

  // Record this request
  requests[ip].push(now);

  // Normal response
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Request successful');
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
