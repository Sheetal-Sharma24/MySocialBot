const mongoose = require('mongoose');

const logSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
  status: String,           // 'success' / 'failed'
  error: String,            // error message if failed
  timestamp: Date
});

module.exports = mongoose.model('Log', logSchema);
