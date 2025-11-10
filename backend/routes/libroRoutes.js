const express = require("express");
const router = express.Router();
const { verificarToken } = require("../middleware/authMiddleware");
const { addLibro, getLibros, getLibroById, deleteLibro, updateLibro } = require("../controllers/libroController");
const { getReviews, postReview } = require("../controllers/libroController");
const multer = require('multer');
const path = require('path');

// Configuracion multer
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
		const ext = path.extname(file.originalname);
		const name = Date.now() + '-' + Math.round(Math.random() * 1E9) + ext;
		cb(null, name);
	}
});
const upload = multer({ storage });

router.post("/", verificarToken, upload.single('cover'), addLibro);
router.get("/", getLibros);
router.get("/:id", getLibroById);
router.get("/:id/reviews", getReviews);
router.post("/:id/reviews", verificarToken, postReview);
router.put("/:id", verificarToken, upload.single('cover'), updateLibro);
router.delete("/:id", verificarToken, deleteLibro);

module.exports = router;

