const db = require('./db');

function leerCategorias() {
  try {
    const rows = db.prepare('SELECT nombre FROM categorias ORDER BY id').all();
    // rows -> [ { nombre: 'Ficción' }, { nombre: 'Historia' }, ... ]
    // Devolver exactamente lo que espera tu código: un array de strings
    return rows.map(r => String(r.nombre).trim());
  } catch (err) {
    // En caso de error devolvemos el fallback (vacío) como antes
    console.error('[leerCategorias] error leyendo DB:', err.message || err);
    return [];
  }
}

module.exports = { leerCategorias };