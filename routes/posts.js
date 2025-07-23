const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const { ensureAuthenticated } = require('../utils/auth');

// List posts
router.get('/posts', ensureAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find().sort({ scheduledAt: -1 });
    res.render('posts/list', { posts, messages: req.flash() });
  } catch (err) {
    req.flash('error', 'Failed to load posts');
    res.redirect('/dashboard');
  }
});

// New post form
router.get('/posts/new', ensureAuthenticated, (req, res) => {
  res.render('posts/new', { messages: req.flash() });
});

// Create new post
router.post('/posts/new', ensureAuthenticated, async (req, res) => {
  try {
    const { text, imageUrl, scheduledAt } = req.body;
    await Post.create({ text, imageUrl, scheduledAt, platform, posted: false });
    req.flash('success', 'Post scheduled successfully!');
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to schedule post');
    res.redirect('/posts/new');
  }
});

// Edit post form
router.get('/posts/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    res.render('posts/edit', { post, messages: req.flash() });
  } catch (err) {
    req.flash('error', 'Failed to load post for editing');
    res.redirect('/posts');
  }
});

// Update post
router.post('/posts/edit/:id', ensureAuthenticated, async (req, res) => {
  try {
    const { text, imageUrl, scheduledAt } = req.body;
    await Post.updateOne({ _id: req.params.id }, { text, imageUrl, scheduledAt });
    req.flash('success', 'Post updated successfully!');
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to update post');
    res.redirect(`/posts/edit/${req.params.id}`);
  }
});

// Delete post
router.post('/posts/delete/:id', ensureAuthenticated, async (req, res) => {
  try {
    await Post.deleteOne({ _id: req.params.id });
    req.flash('success', 'Post deleted successfully!');
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    req.flash('error', 'Failed to delete post');
    res.redirect('/posts');
  }
});

module.exports = router;
