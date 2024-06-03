const express = require('express');
const { searchMovie, discoverMovie } = require('../controllers/SearchMovieController');
const router = express.Router();

router.get('/search', searchMovie)
router.get('/discover', discoverMovie)

module.exports = router;