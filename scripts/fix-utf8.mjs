import fs from 'fs';

const path = './content/fr/site.json';
const raw = fs.readFileSync(path);          // read as raw bytes

// Decode with replacement character for invalid bytes
const fixed = raw.toString('latin1')        // preserve all bytes
  .replace(/[\x80-\x9F]/g, '')             // strip Windows-1252 control chars
  .replace(/[^\x00-\x7F\u00C0-\uFFFF]/g, ''); // strip other non-UTF8

// Validate it parses
JSON.parse(fixed);

fs.writeFileSync(path, fixed, 'utf8');
console.log('Fixed and saved:', path);