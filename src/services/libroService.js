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

<<<<<<< HEAD
function listarLibrosPorCategoria(categoria) {
  const libros = leerLibros();
  return libros.filter(l => l.categoria && l.categoria.toLowerCase() === categoria.toLowerCase());
}

function listarCategorias() {
  const libros = leerLibros();
  const categorias = [...new Set(libros.map(l => l.categoria))];
  return categorias;
}

module.exports = { agregarLibro, listarLibros, listarLibrosPorCategoria, listarCategorias };
=======
module.exports = { agregarLibro, listarLibros };
>>>>>>> 65413102a9dba7ace4391a77a7051330bbe1d542
