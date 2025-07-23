require('dotenv').config();
const mongoose = require('mongoose');
const axios = require('axios');
const Trend = require('./models/Trend');

const IG_BUSINESS_ID = process.env.IG_BUSINESS_ID;
const ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;

async function start() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('✅ Connected to MongoDB');

    await fetchAndStoreTrends('yoga');
  } catch (err) {
    console.error('❌ Startup error:', err);
  }
}

async function fetchAndStoreTrends(hashtag) {
  try {
    const searchRes = await axios.get('https://graph.facebook.com/v19.0/ig_hashtag_search', {
      params: {
        user_id: IG_BUSINESS_ID,
        q: hashtag,
        access_token: ACCESS_TOKEN
      }
    });

    const hashtagId = searchRes.data.data[0]?.id;
    if (!hashtagId) {
      console.log('❌ Hashtag not found');
      return;
    }
    console.log('🔍 Found hashtag ID:', hashtagId);

    const mediaRes = await axios.get(`https://graph.facebook.com/v19.0/${hashtagId}/recent_media`, {
      params: {
        user_id: IG_BUSINESS_ID,
        fields: 'id,caption,media_url',
        access_token: ACCESS_TOKEN
      }
    });

    console.log('📝 Number of posts fetched:', mediaRes.data.data.length);

    await Trend.create({
      hashtag,
      hashtagId,
      posts: mediaRes.data.data
    });

    console.log('✅ Trends saved successfully!');
  } catch (err) {
    console.error('❌ Error:', err.response?.data || err.message);
  }
}

// Start
start();
