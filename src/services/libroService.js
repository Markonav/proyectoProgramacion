const { leerLibros, escribirLibros } = require('../data/data');

function agregarLibro(libro) {
  const libros = leerLibros();

  if (libros.find(l => Number(l.id) === Number(libro.id))) {
    throw new Error('El ID ya está registrado');
  }

  if (libros.find(l => l.titulo.trim().toLowerCase() === libro.titulo.trim().toLowerCase())) {
    throw new Error('El título ya está registrado');
  }

  libros.push(libro);
  escribirLibros(libros);
  return libro;
}

function listarLibros() {
  return leerLibros();
}

module.exports = { agregarLibro, listarLibros };
