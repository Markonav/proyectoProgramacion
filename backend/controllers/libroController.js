
const { agregarLibro, listarLibros, eliminarLibro, editarLibro } = require('../services/libroService');
const { leerCategorias } = require('../data/categoriasData');

function addLibro(req, res) {
  try {
    const { titulo, autor, categoria, sinopsis, PrecioRenta } = req.body;

    if (!titulo || !autor || !categoria || PrecioRenta === undefined) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    if (PrecioRenta < 0 || isNaN(Number(PrecioRenta))) {
      return res.status(400).json({ message: 'PrecioRenta debe ser un n\u00famero no negativo' });
    }

    // si viene archivo multer lo coloca en req.file
    let coverPath = null;
    if (req.file && req.file.filename) {
      // ruta relativa a servir por /uploads
      coverPath = `/uploads/${req.file.filename}`;
    } else {
      // usar imagen por defecto
      coverPath = `/uploads/default.svg`;
    }

    // No asignamos 'id' aquí: la base de datos (AUTOINCREMENT) generará la PK
    const nuevoLibro = {
      titulo: String(titulo).trim(),
      autor: String(autor).trim(),
      categoria: categoria,
      PrecioRenta: Number(PrecioRenta),
      sinopsis: String(sinopsis).trim(),
      cover: coverPath
    };

    try {
      const creado = agregarLibro(nuevoLibro);
      return res.status(201).json({ message: 'Libro agregado', libro: creado });
    } catch (err) {
      // errores esperados desde la capa de servicio
      if (err && err.code === 'DUP_TITLE') {
        return res.status(409).json({ message: err.message || 'Título duplicado' });
      }
      if (err && err.code === 'INVALID') {
        return res.status(400).json({ message: err.message || 'Datos inválidos' });
      }
      console.error('[addLibro] error:', err && err.stack ? err.stack : err);
      return res.status(500).json({ message: 'Error al agregar libro' });
    }

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

function getLibroById(req, res) {
  try {
    const id = req.params.id;
    const libro = listarLibros().find(l => String(l.id) === String(id));
    if (!libro) return res.status(404).json({ message: 'Libro no encontrado' });
    return res.json(libro);
  } catch {
    return res.status(500).json({ message: 'Error al obtener libro' });
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

function updateLibro(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    // recabar cambios permitidos
    // En el formulario de edición esperamos los mismos campos que para agregar
    const { titulo, autor, categoria, sinopsis, PrecioRenta } = req.body;

    // validar campos requeridos
    if (!titulo || !autor || !categoria || PrecioRenta === undefined) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }

    // validar PrecioRenta numérico y no negativo
    const precioNumerico = Number(PrecioRenta);
    if (isNaN(precioNumerico) || precioNumerico < 0) {
      return res.status(400).json({ message: 'PrecioRenta debe ser un número no negativo' });
    }

    // validar título único (excluyendo el mismo libro)
    const existentes = listarLibros();
    const tituloTrim = String(titulo).trim().toLowerCase();
    if (existentes.some(l => (l.id !== id) && (String(l.titulo || '').trim().toLowerCase() === tituloTrim))) {
      return res.status(400).json({ message: 'El título ya está registrado' });
    }

    const cambios = {
      titulo: String(titulo).trim(),
      autor: String(autor).trim(),
      categoria: categoria,
      PrecioRenta: precioNumerico
    };

    // Solo agregar sinopsis si viene en el body (puede ser vacía)
    if (typeof sinopsis !== 'undefined') {
      cambios.sinopsis = String(sinopsis);
    }

    // si viene archivo, actualizar cover
    if (req.file && req.file.filename) {
      cambios.cover = `/uploads/${req.file.filename}`;
    }

    const actualizado = editarLibro(id, cambios);
    if (!actualizado) return res.status(404).json({ message: 'Libro no encontrado' });
    return res.json({ message: 'Libro actualizado', libro: actualizado });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error al actualizar libro' });
  }
}

module.exports = { addLibro, getLibros, getLibroById, deleteLibro, updateLibro };

