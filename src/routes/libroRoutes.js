const express = require('express');
const { addLibro, getLibros, deleteLibro } = require('../controllers/libroController'); 

const router = express.Router();

router.post('/', addLibro);
router.get('/', getLibros);
router.delete('/:id', deleteLibro); 

module.exports = router;

