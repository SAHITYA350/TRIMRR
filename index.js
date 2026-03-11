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
