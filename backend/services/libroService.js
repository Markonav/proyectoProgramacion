const { listarLibros, insertarLibro, borrarLibro, actualizarLibro } = require('../data/librosData');

function agregarLibro(libro) {
  // validar campos mínimos aquí (titulo, autor, categoria, PrecioRenta)
  if (!libro.titulo || !libro.autor) {
    const e = new Error('Campos requeridos');
    e.code = 'INVALID';
    throw e;
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
