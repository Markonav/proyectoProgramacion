const { listarLibros, insertarLibro, borrarLibro, actualizarLibro, buscarLibroPorTitulo } = require('../data/librosData');

function agregarLibro(libro) {
  // validar campos mínimos aquí (titulo, autor, categoria, PrecioRenta)
  if (!libro.titulo) {
    const err = new Error('El título es requerido'); err.code = 'INVALID'; throw err;
  }
  if (!libro.autor) {
    const err = new Error('El autor es requerido'); err.code = 'INVALID'; throw err;
  }
  if (!libro.categoria) {
    const err = new Error('La categoría es requerida'); err.code = 'INVALID'; throw err;
  }
  if (libro.PrecioRenta === undefined || isNaN(Number(libro.PrecioRenta))) {
    const err = new Error('El PrecioRenta es requerido'); err.code = 'INVALID'; throw err;
  }
  if(libro.PrecioRenta < 0 || isNaN(Number(libro.PrecioRenta))) {
    const err = new Error('El PrecioRenta debe ser un número no negativo'); err.code = 'INVALID'; throw err;
  }

  const existe = buscarLibroPorTitulo(libro.titulo);
  if (existe) {
    const error = new Error('Ya existe un libro con ese título'); error.code = 'DUP_TITLE'; throw error;
  }

  // insertar en DB (insertarLibro lanza error si título duplicado)
  return insertarLibro(libro);
}

function listar() {
  return listarLibros();
}

function eliminarLibroPorId(id) {
  return borrarLibro(id);
}

function listarLibrosPorCategoria(categoria) {
  const all = listarLibros();
  return all.filter(l => l.categoria && l.categoria.toLowerCase() === String(categoria).toLowerCase());
}

function listarCategorias() {
  const all = listarLibros();
  return [...new Set(all.map(l => l.categoria))];
}

function editarLibro(id, cambios) {
  const existe = buscarLibroPorTitulo(cambios.titulo);
  if (existe) {
    const error = new Error('Ya existe un libro con ese título'); error.code = 'DUP_TITLE'; throw error;
  }
  return actualizarLibro(id, cambios);
}

module.exports = {
  agregarLibro,
  listarLibros: listar,
  eliminarLibro: eliminarLibroPorId,
  listarLibrosPorCategoria,
  listarCategorias,
  editarLibro
};
