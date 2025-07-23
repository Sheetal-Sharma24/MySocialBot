const mongoose = require('mongoose');

const TrendSchema = new mongoose.Schema({
  hashtag: String,
  hashtagId: String,
  posts: [ 
    {
      id: String,
      caption: String,
      media_url: String
    }
  ],
  fetchedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Trend', TrendSchema);
