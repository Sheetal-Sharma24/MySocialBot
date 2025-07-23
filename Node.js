const axios = require('axios');

async function fetchHashtagTrends(hashtag) {
  try {
    // Search hashtag ID
    const searchRes = await axios.get(`https://graph.facebook.com/v19.0/ig_hashtag_search`, {
      params: {
        user_id: process.env.IG_BUSINESS_ID,
        q: hashtag,
        access_token: process.env.FB_PAGE_ACCESS_TOKEN
      }
    });
    const hashtagId = searchRes.data.data[0].id;
    console.log('✅ Hashtag ID:', hashtagId);

    // Fetch recent posts
    const postsRes = await axios.get(`https://graph.facebook.com/v19.0/${hashtagId}/recent_media`, {
      params: {
        user_id: process.env.IG_BUSINESS_ID,
        fields: 'id,caption,media_type,media_url,permalink',
        access_token: process.env.FB_PAGE_ACCESS_TOKEN
      }
    });

    console.log('📊 Recent posts:', postsRes.data.data);
    return postsRes.data.data;

  } catch (error) {
    console.error('❌ Error fetching trends:', error.response?.data || error.message);
  }
}

// Example call:
fetchHashtagTrends('yoga');
