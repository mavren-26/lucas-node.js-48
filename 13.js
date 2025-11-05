// readWriteJSON.js
const fs = require('fs');
const path = require('path');

// Path to the JSON file
const filePath = path.join(__dirname, 'data.json');

// Step 1: Read the JSON file
fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Step 2: Parse JSON
  let jsonData = [];
  try {
    jsonData = JSON.parse(data);
  } catch (parseError) {
    console.error('Invalid JSON format, resetting file.');
  }

  // Step 3: Add new data
  const newEntry = {
    id: jsonData.length + 1,
    name: 'Maverim'
  };

  jsonData.push(newEntry);

  // Step 4: Write back to the file (pretty formatted)
  fs.writeFile(filePath, JSON.stringify(jsonData, null, 2), (writeErr) => {
    if (writeErr) {
      console.error('Error writing file:', writeErr);
      return;
    }

    console.log('✅ New data added successfully!');
  });
});
