const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB (trimmer)'))
  .catch(err => console.error('MongoDB connection error:', err));

// API Routes
const authRoutes = require('./routes/auth');
const urlRoutes = require('./routes/url');
const clickRoutes = require('./routes/click');
app.use('/api/auth', authRoutes);
app.use('/api/urls', urlRoutes);
app.use('/api/clicks', clickRoutes);

// Redirection Route
const Url = require('./models/Url');
const Click = require('./models/Click');
const { UAParser } = require('ua-parser-js');
const axios = require('axios');

app.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Skip if it's an API route or known static assets
    if (id.startsWith('api') || 
        id.endsWith('.js') || 
        id.endsWith('.css') || 
        id.endsWith('.png') || 
        id.endsWith('.jpg') || 
        id.endsWith('.ico')) return next();

    // Match logic exactly like the metadata route
    const url = await Url.findOne({
      $or: [
        { short_url: id },
        { custom_url: id },
        { custom_url: `/${id}` },
        { custom_url: id.replace(/\s+/g, '-') }, // Match 'my-app' if 'my app' clicked
        { custom_url: id.replace(/-/g, ' ') }  // Match 'my app' if 'my-app' clicked
      ]
    });

    if (url) {
      // Record click asynchronously (don't block the redirect)
      (async () => {
        try {
          const ua = req.headers['user-agent'];
          const parser = new UAParser(ua);
          const result = parser.getResult();
          
          const device = result.device.type || 'desktop';
          const browser = result.browser.name || 'unknown';
          const os = result.os.name || 'unknown';
          
          let city = 'Unknown';
          try {
            const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
            if (ip && ip !== '::1' && ip !== '127.0.0.1') {
              const geoRes = await axios.get(`https://ipapi.co/${ip.split(',')[0]}/json`);
              city = geoRes.data.city || 'Unknown';
            }
          } catch (e) {}

          await new Click({
            url_id: url._id,
            city,
            device,
            browser,
            os
          }).save();
        } catch (err) {
          console.error('Error tracking click:', err);
        }
      })();

      return res.redirect(url.original_url);
    }
    
    next();
  } catch (error) {
    next();
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('URL Shortener API is running...');
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
