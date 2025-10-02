
const express = require('express');
const { postRegister, postLogin } = require('../controllers/userController');

const router = express.Router();

router.post('/register', postRegister);
router.post('/login', postLogin);

module.exports = router;

