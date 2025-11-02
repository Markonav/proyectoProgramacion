const categoriaService = require('../services/categoriaService');

async function getCategorias(req, res) {
  try {
    const categorias = await categoriaService.obtenerCategorias();
    if (!categorias) {
      return res.status(404).json({ error: 'Categorías no encontradas' });
    }
    if (categorias.length === 0) {
      return res.status(204).json({ message: 'No hay categorías' });
    }
    res.status(200).json({ message: 'Categorías obtenidas', categorias });
  } catch (err) {
    res.status(500).json({ error: 'No se pudieron obtener las categorías' });
  }
}

module.exports = { getCategorias };
