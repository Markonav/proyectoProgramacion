const { agregarLibro, listarLibros, eliminarLibro } = require('../services/libroService');

function addLibro(req, res) {
  try {
    const { id, titulo, autor, PrecioRenta } = req.body;

    if (!id || !titulo || !autor || !PrecioRenta) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    const nuevoLibro = {
      id: Number(id),
      titulo: titulo.trim(),
      autor: autor.trim(),
      PrecioRenta: Number(PrecioRenta)
    };

    const libro = agregarLibro(nuevoLibro);
    res.json({ message: 'Libro agregado correctamente', data: libro });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

function getLibros(req, res) {
  try {
    const libros = listarLibros();
    res.json(libros);
  } catch (err) {
    res.status(500).json({ message: 'Error al leer libros' });
  }
}

function deleteLibro(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }
    const ok = eliminarLibro(id);
    if (!ok) return res.status(404).json({ message: 'Libro no encontrado' });
    return res.status(204).send();
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al eliminar libro' });
  }
}

module.exports = { addLibro, getLibros, deleteLibro };

