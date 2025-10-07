
const express = require('express');
const path = require('path');
const multer = require('multer');
const { postRegister, postLogin, putUpdateUser, putChangePassword, getUserFavs, putUserFavs, deleteUser } = require('../controllers/userController');

const router = express.Router();

// Multer config for user avatars (store in backend/data/images)
const imagesDir = path.join(__dirname, '../data/images');
const storage = multer.diskStorage({
	destination: function (req, file, cb) {
		cb(null, imagesDir);
	},
	filename: function (req, file, cb) {
		const ext = path.extname(file.originalname || '');
		const name = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
		cb(null, name);
	}
});
const upload = multer({ storage });

router.post('/register', postRegister);

router.post('/login', postLogin);
// Cambiar contraseña
router.put('/password', putChangePassword);
// Ruta para actualizar datos de usuario - acepta un archivo 'avatar' opcional
router.put('/update', upload.single('avatar'), putUpdateUser);
// Favoritos: obtener y actualizar
router.get('/favs', getUserFavs);
router.put('/favs', putUserFavs);
// Eliminar cuenta de usuario
router.delete('/delete', deleteUser);

module.exports = router;

