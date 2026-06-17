const express = require('express');
const router = express.Router();
const { verify } = require('../middleware/authMiddleware');
const { signup, login, logout, verifySession } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.get('/verify', verify, verifySession);

module.exports = router;
