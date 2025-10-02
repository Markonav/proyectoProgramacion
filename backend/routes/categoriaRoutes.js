const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');

// GET /api/categorias
router.get('/', categoriaController.getCategorias);

module.exports = router;