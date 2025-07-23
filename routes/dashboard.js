const express = require('express');
const router = express.Router();
const { ensureAuthenticated } = require('../utils/auth');
const Post = require('../models/Post');
const Log = require('../models/Log');

router.get('/', ensureAuthenticated, async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const postedCount = await Log.countDocuments({ status: "success" });
    const failedCount = await Log.countDocuments({ status: "failed" });
    const logs = await Log.find().sort({ timestamp: -1 }).limit(50);

    res.render('dashboard', {
      user: req.user,
      totalPosts,
      postedCount,
      failedCount,
      logs
    });
  } catch (err) {
    console.error(err);
    res.render('dashboard', {
      user: req.user,
      totalPosts: 0,
      postedCount: 0,
      failedCount: 0,
      logs: []
    });
  }
});

module.exports = router;
