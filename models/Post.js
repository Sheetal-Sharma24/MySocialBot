const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  text: { type: String, required: true },
  imageUrl: { type: String, required: true },
  platform: {
  type: String,
  enum: ['instagram', 'facebook', 'both'],
  default: 'instagram'
  },
  scheduledAt: { type: Date, required: true },
  posted: { type: Boolean, default: false }
});

module.exports = mongoose.model('Post', PostSchema);
