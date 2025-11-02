const express = require('express');
const path = require('path');
const multer = require('multer');
const { verificarToken } = require("../middleware/authMiddleware");
const { postRegister, postLogin, putUpdateUser, putChangePassword, getUserFavs, putUserFavs, deleteUser } = require('../controllers/userController');

const router = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR;
let imagesDir;
if (UPLOAD_DIR) {
  imagesDir = path.isAbsolute(UPLOAD_DIR) ? UPLOAD_DIR : path.resolve(process.cwd(), UPLOAD_DIR);
} else {
  imagesDir = path.join(__dirname, '../data/images');
}
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
router.put('/password', verificarToken, putChangePassword);
// Ruta para actualizar datos de usuario - acepta un archivo 'avatar' opcional
router.put('/update', verificarToken, upload.single('avatar'), putUpdateUser);
// Favoritos: obtener y actualizar
router.get('/favs', verificarToken, getUserFavs);
router.put('/favs', verificarToken, putUserFavs);
// Eliminar cuenta de usuario
router.delete('/delete', verificarToken, deleteUser);

module.exports = router;

