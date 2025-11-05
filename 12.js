// cacheAPI_Node.js
const http = require('http');
const https = require('https');

const PORT = 5000;

let cache = {
  data: null,
  timestamp: null
};

// Function to fetch data from the fake API
function fetchData(callback) {
  https.get('https://jsonplaceholder.typicode.com/posts', res => {
    let data = '';

    res.on('data', chunk => {
      data += chunk;
    });

    res.on('end', () => {
      callback(JSON.parse(data));
    });
  }).on('error', err => {
    console.error('Error fetching data:', err.message);
  });
}

const server = http.createServer((req, res) => {
  if (req.method === 'GET' && req.url === '/data') {
    const now = Date.now();

    if (cache.data && now - cache.timestamp < 60000) {
      // Serve cached data
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ fromCache: true, data: cache.data }));
      return;
    }

    // Fetch new data and update cache
    fetchData(data => {
      cache = { data, timestamp: now };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ fromCache: false, data }));
    });
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
});

server.listen(PORT, () => {
  console.log(`Caching server running at http://localhost:${PORT}`);
});
