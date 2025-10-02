const express = require("express");
const router = express.Router();
const { addLibro, getLibros, deleteLibro } = require("../controllers/libroController");


router.post("/", addLibro);
router.get("/", getLibros);
router.delete("/:id", deleteLibro);

module.exports = router;

