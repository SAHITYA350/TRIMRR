const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Url = require('../models/Url');
const authMiddleware = require('../middleware/auth');

// Create URL
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, original_url, short_url, custom_url, qr_code } = req.body;
    const url = new Url({
      title,
      original_url,
      short_url,
      custom_url,
      qr_code,
      user_id: req.userId
    });
    await url.save();
    res.status(201).json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get User URLs
router.get('/', authMiddleware, async (req, res) => {
  try {
    const urls = await Url.find({ user_id: req.userId });
    res.json(urls);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Single URL
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id.replace(/^\/+|\/+$/g, '');

    // Check if it's a valid ObjectId format (24 hex characters)
    const isValidObjectId = mongoose.Types.ObjectId.isValid(id) &&
      /^[0-9a-fA-F]{24}$/.test(id);

    const url = await Url.findOne({
      $or: [
        { _id: isValidObjectId ? id : null },
        { short_url: id },
        { custom_url: id },
        { custom_url: `/${id}` } // Fallback for links saved with a slash
      ]
    });
    if (!url) return res.status(404).json({ message: 'URL not found' });
    res.json(url);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete URL
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    await Url.findOneAndDelete({ _id: req.params.id, user_id: req.userId });
    res.json({ message: 'URL deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
