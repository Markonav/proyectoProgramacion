const express = require("express");
const router = express.Router();
const { addLibro, getLibros, deleteLibro, updateLibro } = require("../controllers/libroController");
const multer = require('multer');
const path = require('path');

// Configuracion multer
const imagesDir = path.join(__dirname, '../data/images');
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

router.post("/", upload.single('cover'), addLibro);
router.get("/", getLibros);
router.put("/:id", upload.single('cover'), updateLibro);
router.delete("/:id", deleteLibro);

module.exports = router;

