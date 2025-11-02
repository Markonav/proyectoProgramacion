const express = require('express');
const router = express.Router();
const { getCategorias } = require('../controllers/categoriaController');

// GET /api/categorias
router.get('/', getCategorias);

module.exports = router;