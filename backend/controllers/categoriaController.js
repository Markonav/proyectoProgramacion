const categoriaService = require('../services/categoriaService');

// GET /api/categorias
exports.getCategorias = async (req, res) => {
  try {
    const categorias = await categoriaService.obtenerCategorias();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron obtener las categorías' });
  }
};
