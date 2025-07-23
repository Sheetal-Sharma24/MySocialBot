const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

router.get('/', (req, res) => res.render('login'));

module.exports = router;
