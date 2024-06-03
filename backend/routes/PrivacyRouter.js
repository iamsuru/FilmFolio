const express = require('express');
const { getPrivacy, updatePrivacy } = require('../controllers/PrivacyController');
const router = express.Router();

router.get('/privacy', getPrivacy)
router.post('/privacy', updatePrivacy)

module.exports = router;