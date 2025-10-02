
const { leerLibros, escribirLibros } = require('../data/data');

function agregarLibro(libro) {
  const libros = leerLibros();

  // Evita IDs duplicados
  if (libros.find(l => Number(l.id) === Number(libro.id))) {
    throw new Error('El ID ya está registrado');
  }

  // Evita títulos duplicados
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
  if (idx === -1) return false;     
  libros.splice(idx, 1);           
  escribirLibros(libros);
  return true;                      
}

module.exports = {
  agregarLibro,
  listarLibros,
  eliminarLibro,               
};


