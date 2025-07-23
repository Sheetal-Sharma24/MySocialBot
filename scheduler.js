require('dotenv').config();
const mongoose = require('mongoose');
const cron = require('node-cron');
const axios = require('axios');
const Post = require('./models/Post');
const Log = require('./models/Log');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ DB connected'))
  .catch(err => console.error('❌ DB connection error:', err));

const IG_BUSINESS_ID = process.env.IG_BUSINESS_ID;
const FB_PAGE_ACCESS_TOKEN = process.env.FB_PAGE_ACCESS_TOKEN;
const FB_PAGE_ID = process.env.FB_PAGE_ID;  // ✅ add this in .env

cron.schedule('* * * * *', async () => {
  console.log('⏰ Scheduler running...');
  try {
    const posts = await Post.find({ posted: false, scheduledAt: { $lte: new Date() } });
    console.log('📦 Found posts:', posts.length);

    for (let post of posts) {
      try {
        console.log('📦 Posting:', post.text);

        // ✅ Instagram posting
        if (post.platform === 'instagram' || post.platform === 'both') {
          const createRes = await axios.post(`https://graph.facebook.com/v19.0/${IG_BUSINESS_ID}/media`, {
            image_url: post.imageUrl,
            caption: post.text,
            access_token: FB_PAGE_ACCESS_TOKEN
          });
          const creationId = createRes.data.id;

          await axios.post(`https://graph.facebook.com/v19.0/${IG_BUSINESS_ID}/media_publish`, {
            creation_id: creationId,
            access_token: FB_PAGE_ACCESS_TOKEN
          });

          console.log('✅ Posted to Instagram');
        }

        // ✅ Facebook Page posting
        if (post.platform === 'facebook' || post.platform === 'both') {
          await axios.post(`https://graph.facebook.com/${FB_PAGE_ID}/photos`, {
            url: post.imageUrl,
            caption: post.text,
            access_token: FB_PAGE_ACCESS_TOKEN
          });
          console.log('✅ Posted to Facebook');
        }

        // Mark as posted & log
        await Post.updateOne({ _id: post._id }, { posted: true });
        await Log.create({
          postId: post._id,
          status: "success",
          timestamp: new Date()
        });

      } catch (error) {
        console.error("❌ Error in scheduled post:", error.response?.data || error.message);

        // Log failure
        await Log.create({
          postId: post._id,
          status: "failed",
          error: JSON.stringify(error.response?.data || error.message),
          timestamp: new Date()
        });
      }
    }

    if (posts.length === 0) {
      console.log(' No scheduled posts ready');
    }
  } catch (err) {
    console.error(' Scheduler error:', err);
  }
});
