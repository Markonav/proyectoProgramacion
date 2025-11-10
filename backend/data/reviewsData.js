const db = require('./db');

// tabla reviews: id, libro_id, user, email, rating, comment, date
const stmtCreate = db.prepare(`
  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    libro_id INTEGER NOT NULL,
    user TEXT,
    email TEXT,
    rating INTEGER CHECK(rating >= 0 AND rating <= 5) DEFAULT 0,
    comment TEXT,
    date TEXT,
    FOREIGN KEY(libro_id) REFERENCES libros(id) ON DELETE CASCADE
  );
`);

try { stmtCreate.run(); } catch (e) {  }

// crear índice único para evitar dobles reseñas por usuario (email) en un mismo libro
try { db.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_libro_email ON reviews(libro_id, email)').run(); } catch (e) { /* ignore */ }

// When fetching reviews, prefer the user's nickname from usuarios table if present
const stmtGetByLibro = db.prepare(`SELECT r.id, r.libro_id, COALESCE(u.nickname, r.user) AS user, r.email, r.rating, r.comment, r.date
  FROM reviews r
  LEFT JOIN usuarios u ON u.email = r.email
  WHERE r.libro_id = ?
  ORDER BY r.id DESC`);
const stmtFindByLibroAndEmail = db.prepare('SELECT id FROM reviews WHERE libro_id = ? AND email = ? LIMIT 1');
const stmtInsert = db.prepare('INSERT INTO reviews (libro_id, user, email, rating, comment, date) VALUES (?, ?, ?, ?, ?, ?)');

function obtenerResenasPorLibro(libroId) {
  // devuelve las reseñas (usa stmtGetByLibro que ya realiza LEFT JOIN para nickname)
  return stmtGetByLibro.all(libroId || 0) || [];
}

function existeResena(libroId, correo) {
  if (!correo) return false;
  const row = stmtFindByLibroAndEmail.get(libroId, correo);
  return !!row;
}

function insertarResena(resena) {
  const info = stmtInsert.run(
    resena.libro_id,
    resena.user || null,
    resena.email || null,
    Number(resena.rating) || 0,
    resena.comment || '',
    resena.date || new Date().toISOString()
  );
  // devolver la fila recién insertada (con nickname preferido si existe)
  const row = db.prepare('SELECT r.id, r.libro_id, COALESCE(u.nickname, r.user) AS user, r.email, r.rating, r.comment, r.date FROM reviews r LEFT JOIN usuarios u ON u.email = r.email WHERE r.id = ?').get(info.lastInsertRowid);
  return row || null;
}

module.exports = { obtenerResenasPorLibro, insertarResena, existeResena };
