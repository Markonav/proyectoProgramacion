const express = require('express');
const { addLibro, getLibros } = require('../controllers/libroController');

const router = express.Router();

router.post('/', addLibro);
router.get('/', getLibros);

module.exports = router;
