const express = require('express');
const { getSharedPlaylist, myPlayList } = require('../controllers/SharedController')
const router = express.Router();

router.get('/search-playlist', getSharedPlaylist)
router.get('/my-playlist', myPlayList)

module.exports = router;