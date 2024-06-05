const express = require('express')
const router = express.Router();
const { createUser, authUser, isTokenExpired, resetPassword, } = require('../controllers/UserController');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage() })

router.post('/auth', authUser);
router.post('/register', upload.single('file'), createUser);
router.post('/isTokenExpired', isTokenExpired)
router.put('/reset-password', resetPassword)

module.exports = router;