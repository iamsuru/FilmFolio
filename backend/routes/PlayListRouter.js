const express = require('express');
const { createPlayList, updatePlayList, getPlayList } = require('../controllers/PlayListController');
const router = express.Router();

router.get('/playlist', getPlayList)
router.post('/playlist', createPlayList)
router.put('/playlist', updatePlayList)

module.exports = router;