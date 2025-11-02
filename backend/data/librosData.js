const db = require('./db');

// Preparadas
const stmtList = db.prepare('SELECT id, titulo, autor, categoria, PrecioRenta, cover, sinopsis, tendencia, masLeido FROM libros ORDER BY id');
const stmtGet = db.prepare('SELECT * FROM libros WHERE id = ?');
const stmtInsert = db.prepare(`INSERT INTO libros (titulo, autor, categoria, PrecioRenta, cover, sinopsis) VALUES (?, ?, ?, ?, ?, ?)`);
const stmtUpdate = db.prepare(`UPDATE libros SET titulo=?, autor=?, categoria=?, PrecioRenta=?, cover=?, sinopsis=? WHERE id=?`);
const stmtDelete = db.prepare('DELETE FROM libros WHERE id = ?');
const stmtFindByTitulo = db.prepare('SELECT id FROM libros WHERE LOWER(trim(titulo)) = LOWER(trim(?))');

function listarLibros() {
  return stmtList.all();
}

function obtenerLibro(id) {
  return stmtGet.get(id) || null;
}

function insertarLibro(libro) {
  const existe = buscarLibroPorTitulo(libro.titulo);
  if (existe) {
    const e = new Error('El título ya está registrado');
    e.code = 'DUP_TITLE';
    throw e;  
  }
  const info = stmtInsert.run(
    libro.titulo,
    libro.autor,
    libro.categoria,
    libro.PrecioRenta || 0,
    libro.cover || null,
    libro.sinopsis || ''
  );
  return obtenerLibro(info.lastInsertRowid);
}

function actualizarLibro(id, cambios) {
  const current = obtenerLibro(id);
  if (!current) return null;
  const titulo = cambios.titulo ?? current.titulo;
  const autor = cambios.autor ?? current.autor;
  const categoria = cambios.categoria ?? current.categoria;
  const precio = cambios.PrecioRenta ?? current.PrecioRenta;
  const cover = cambios.cover ?? current.cover;
  const sinopsis = cambios.sinopsis ?? current.sinopsis;

  stmtUpdate.run(titulo, autor, categoria, precio, cover, sinopsis, id);
  return obtenerLibro(id);
}

function borrarLibro(id) {
  const info = stmtDelete.run(id);
  return info.changes > 0;
}

function buscarLibroPorTitulo(titulo) {
  return stmtFindByTitulo.get(titulo) || null;
}

module.exports = { listarLibros, obtenerLibro, insertarLibro, actualizarLibro, borrarLibro, buscarLibroPorTitulo };