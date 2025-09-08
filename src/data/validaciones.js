function validarLibro(libro) {
  if (typeof libro.titulo !== 'string' || libro.titulo.trim() === '') return false;
  if (libro.titulo.length < 2) return false; 
  if (typeof libro.autor !== 'string' || libro.autor.trim() === '') return false;
  if (typeof libro.PrecioRenta !== 'number'  || libro.PrecioRenta < 0) return false;
  return true;
}

function generarID(libros) {
  if (libros.length === 0) return 1; 
  const maxId = Math.max(...libros.map(libro => libro.id));
  return maxId + 1;
}

module.exports = { validarLibro, generarID };