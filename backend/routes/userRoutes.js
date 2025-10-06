
const express = require('express');
const { postRegister, postLogin, putUpdateUser, putChangePassword } = require('../controllers/userController');

const router = express.Router();

router.post('/register', postRegister);

router.post('/login', postLogin);
// Cambiar contraseña
router.put('/password', putChangePassword);
// Ruta para actualizar datos de usuario
router.put('/update', putUpdateUser);

module.exports = router;

