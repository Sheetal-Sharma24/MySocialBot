// trendScheduler.js
require('dotenv').config();
require('./config/db');
const cron = require('node-cron');
const fetchAndStoreTrends = require('./trendFetcher'); // जो function तूने बनाया था

// Daily सुबह 9 बजे run
cron.schedule('0 9 * * *', async () => {
  console.log(' Trend fetcher running...');
  try {
    await fetchAndStoreTrends('yoga'); // या trending hashtags dynamic भी कर सकता
    console.log('Trends fetched & stored');
  } catch (err) {
    console.error('Error fetching trends:', err.response?.data || err.message);
  }
});
