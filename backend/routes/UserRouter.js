const express = require('express')
const router = express.Router();
const { createUser, authUser, isTokenExpired } = require('../controllers/UserController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() })

router.post('/auth', authUser);
router.post('/register', upload.single('file'), createUser);
router.post('/isTokenExpired', isTokenExpired)

module.exports = router;