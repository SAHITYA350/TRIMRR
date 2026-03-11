const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const Click = require('../models/Click');
const Url = require('../models/Url');
const authMiddleware = require('../middleware/auth');

// Store Click
router.post('/', async (req, res) => {
  try {
    const { url_id, city, device, browser, os } = req.body;
    const click = new Click({
      url_id, city, device, browser, os
    });
    await click.save();
    res.status(201).json(click);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Clicks (all for user or specific URLs)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { urlIds } = req.query;
    if (urlIds) {
      const ids = urlIds.split(',');
      const clicks = await Click.find({ url_id: { $in: ids } });
      return res.json(clicks);
    }
    
    // Fallback: This could be optimized to find clicks for all User's URLs
    const userUrls = await Url.find({ user_id: req.userId }).select('_id');
    const userUrlIds = userUrls.map(u => u._id);
    const clicks = await Click.find({ url_id: { $in: userUrlIds } });
    res.json(clicks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Clicks for a specific URL
router.get('/:urlId', authMiddleware, async (req, res) => {
  try {
    const { urlId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(urlId)) {
      return res.status(400).json({ message: 'Invalid URL ID' });
    }

    const url = await Url.findOne({ _id: urlId, user_id: req.userId });
    if (!url) return res.status(403).json({ message: 'Unauthorized' });

    const clicks = await Click.find({ url_id: urlId });
    res.json(clicks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
