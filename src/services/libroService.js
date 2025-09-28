// src/services/libroService.js
const { leerLibros, escribirLibros } = require('../data/data');

function agregarLibro(libro) {
  const libros = leerLibros();

  // Evita IDs duplicados
  if (libros.find(l => Number(l.id) === Number(libro.id))) {
    throw new Error('El ID ya está registrado');
  }

  // Evita títulos duplicados (normalizados)
  if (libros.find(
    l => (l.titulo || '').trim().toLowerCase() === (libro.titulo || '').trim().toLowerCase()
  )) {
    throw new Error('El título ya está registrado');
  }

  libros.push(libro);
  escribirLibros(libros);
  return libro;
}

function listarLibros() {
  return leerLibros();
}

function eliminarLibro(id) {
  const libros = leerLibros();
  const idx = libros.findIndex(l => Number(l.id) === Number(id));
  if (idx === -1) return false;     // no existe
  libros.splice(idx, 1);            // elimina
  escribirLibros(libros);
  return true;                      // eliminado OK
}

function listarLibrosPorCategoria(categoria) {
  const libros = leerLibros();
  return libros.filter(
    l => l.categoria && l.categoria.toLowerCase() === String(categoria).toLowerCase()
  );
}

function listarCategorias() {
  const libros = leerLibros();
  const categorias = [...new Set(libros.map(l => l.categoria))];
  return categorias;
}

module.exports = {
  agregarLibro,
  listarLibros,
  eliminarLibro,                // ← ¡exportado!
  listarLibrosPorCategoria,
  listarCategorias
};


