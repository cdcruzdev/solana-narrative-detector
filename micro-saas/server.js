const express = require('express');
const { nanoid } = require('nanoid');
const fs = require('fs');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const DATA_FILE = path.join(__dirname, 'urls.json');

// Load URLs from file
function loadUrls() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    }
  } catch (e) {
    console.error('Error loading URLs:', e);
  }
  return {};
}

// Save URLs to file
function saveUrls(urls) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(urls, null, 2));
}

let urls = loadUrls();

// Create short URL
app.post('/api/shorten', (req, res) => {
  const { url, customCode } = req.body;
  
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }
  
  // Validate URL
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL' });
  }
  
  const code = customCode || nanoid(8);
  
  if (urls[code]) {
    return res.status(409).json({ error: 'Custom code already exists' });
  }
  
  urls[code] = {
    url,
    created: new Date().toISOString(),
    clicks: 0
  };
  
  saveUrls(urls);
  
  res.json({
    code,
    shortUrl: `/s/${code}`,
    originalUrl: url
  });
});

// Redirect short URL
app.get('/s/:code', (req, res) => {
  const { code } = req.params;
  
  if (!urls[code]) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  
  urls[code].clicks++;
  saveUrls(urls);
  
  res.redirect(urls[code].url);
});

// Get URL stats
app.get('/api/stats/:code', (req, res) => {
  const { code } = req.params;
  
  if (!urls[code]) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  
  res.json(urls[code]);
});

// List all URLs
app.get('/api/urls', (req, res) => {
  res.json(urls);
});

// Delete URL
app.delete('/api/urls/:code', (req, res) => {
  const { code } = req.params;
  
  if (!urls[code]) {
    return res.status(404).json({ error: 'Short URL not found' });
  }
  
  delete urls[code];
  saveUrls(urls);
  
  res.json({ success: true });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`URL Shortener running on port ${PORT}`);
});
