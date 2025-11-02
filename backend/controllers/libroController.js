const { agregarLibro, listarLibros, eliminarLibro, editarLibro } = require('../services/libroService');
const { leerCategorias } = require('../data/categoriasData');

function addLibro(req, res) {
  try {
    const { titulo, autor, categoria, sinopsis, PrecioRenta } = req.body;
    const user = req.user;
    
    if( !user ) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    if (!titulo) {
      return res.status(400).json({ message: 'El título es requerido' });
    }
    if (!autor) {
      return res.status(400).json({ message: 'El autor es requerido' });
    }
    if (!categoria) {
      return res.status(400).json({ message: 'La categoría es requerida' });
    }
    if (PrecioRenta === undefined) {
      return res.status(400).json({ message: 'El PrecioRenta es requerido' });
    }
    if (PrecioRenta < 0 ||  isNaN(Number(PrecioRenta)) || PrecioRenta === "") {
      return res.status(400).json({ message: 'El PrecioRenta debe ser un número no negativo' });
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
      sinopsis: sinopsis?.trim() || '',
      cover: coverPath
    };

    const creado = agregarLibro(nuevoLibro);
    return res.status(201).json({ message: 'Libro agregado', libro: creado });
  } catch (err) {
      console.error('[addLibro] error:', err);
      if (err.code === 'DUP_TITLE') {
        return res.status(409).json({ message: 'El título ya está registrado' });
      }
      if (err.code === 'INVALID') {
        return res.status(400).json({ message: err.message || 'Datos inválidos' });
      }
      return res.status(500).json({ message: 'Error interno al agregar libro' });
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
    // verificar que el usuario tenga sesión
    const usuarioSesion = req.user;
    if( !usuarioSesion ) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    // verificar ID válido
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
    // verificar que el usuario tenga sesión
    const usuarioSesion = req.user;
    if( !usuarioSesion ) {
      return res.status(401).json({ message: 'No autorizado' });
    }
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ message: 'ID inválido' });
    }

    // recabar cambios permitidos
    // En el formulario de edición esperamos los mismos campos que para agregar
    const { titulo, autor, categoria, sinopsis, PrecioRenta } = req.body;

    if (!titulo) {
      return res.status(400).json({ message: 'El título es requerido' });
    }
    if (!autor) {
      return res.status(400).json({ message: 'El autor es requerido' });
    }
    if (!categoria) {
      return res.status(400).json({ message: 'La categoría es requerida' });
    }
    if (PrecioRenta === undefined) {
      return res.status(400).json({ message: 'El PrecioRenta es requerido' });
    }
    if (PrecioRenta < 0 ||  isNaN(Number(PrecioRenta)) || PrecioRenta === "") {
      return res.status(400).json({ message: 'El PrecioRenta debe ser un número no negativo' });
    }

    const cambios = {
      titulo: String(titulo).trim(),
      autor: String(autor).trim(),
      categoria: categoria,
      PrecioRenta: PrecioRenta
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
    if (err.code === 'DUP_TITLE') {
        return res.status(409).json({ message: 'El título ya está registrado' });
      }
    return res.status(500).json({ message: 'Error al actualizar libro' });
  }
}

module.exports = { addLibro, getLibros, getLibroById, deleteLibro, updateLibro };

