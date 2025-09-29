const { agregarLibro, listarLibros, eliminarLibro } = require('../services/libroService');

function addLibro(req, res) {
  try {
    const { titulo, autor, PrecioRenta } = req.body;

    if (!titulo || !autor || PrecioRenta === undefined) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
    let nuevoId = Date.now();
    const existentes = listarLibros();
    while (existentes.some(l => Number(l.id) === nuevoId)) {
      nuevoId++; 
    }

    const nuevoLibro = {
      id: nuevoId,
      titulo: String(titulo).trim(),
      autor:  String(autor).trim(),
      PrecioRenta: Number(PrecioRenta)
    };

    const creado = agregarLibro(nuevoLibro);
    return res.status(201).json({ message: 'Libro agregado', libro: creado });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al agregar libro' });
  }
}

function getLibros(req, res) {
  try {
    const data = listarLibros();
    return res.json(data);
  } catch {
    return res.status(500).json({ message: 'Error al obtener libros' });
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

