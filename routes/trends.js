const express = require('express');
const router = express.Router();
const Trend = require('../models/Trend');

router.get('/trends', async (req, res) => {
  try {
    const trends = await Trend.find().sort({ fetchedAt: -1 }).limit(10);  // latest 10 trends
    res.render('trends', { trends });
  } catch (err) {
    console.error('Error fetching trends:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;
