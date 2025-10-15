const db = require('./db');
const { v4: uuidv4 } = require('uuid');

// Helper seguro para parsear JSON almacenado en columnas TEXT
function safeJsonParse(s, fallback = {}) {
  if (s == null) return fallback;
  if (typeof s === 'object') return s;
  try { return JSON.parse(s); } catch (err) { return fallback; }
}

function leerUsuarios() {
  try {
    const rows = db.prepare('SELECT id, public_id, email, createdAt, favoritos, nombre, apellido, nickname, avatar FROM usuarios ORDER BY id').all();
    return rows.map(r => {
      const favs = r.favoritos ? (typeof r.favoritos === 'string' ? safeJsonParse(r.favoritos, {}) : r.favoritos) : {};
      // map DB column `avatar` to API property `avatarUrl` for frontend compatibility
      const avatarUrl = r.avatar || null;
      return { ...r, favs, avatarUrl };
    });
  } catch (err) {
    console.error('[leerUsuarios] error leyendo DB:', err.message || err);
    return [];
  }
}


function createUser({ email, passwordHash, nombre, apellido, nickname, avatar }) {
  const public_id = uuidv4();
  const createdAt = new Date().toISOString();
  const sql = `INSERT INTO usuarios (public_id, email, passwordHash, createdAt, nombre, apellido, nickname, favoritos, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  try {
    const stmt = db.prepare(sql);
    const info = stmt.run(public_id, email, passwordHash || null, createdAt, nombre || null, apellido || null, nickname || null, JSON.stringify({}), avatar || null);
  const user = db.prepare('SELECT * FROM usuarios WHERE id = ?').get(info.lastInsertRowid);
  user.favs = safeJsonParse(user.favoritos, {});
  user.avatarUrl = user.avatar || null;
  return user;
  } catch (err) {
    // detectar constraint unique (email)
    if (err && /UNIQUE/i.test(String(err.message || ''))) {
      const e = new Error('El correo ya está registrado');
      e.code = 'DUPLICATE_EMAIL';
      throw e;
    }
    throw err;
  }
}

function findByEmail(email) {
  const row = db.prepare('SELECT * FROM usuarios WHERE LOWER(email) = LOWER(?)').get(email);
  if (!row) return null;
  row.favs = row.favoritos ? safeJsonParse(row.favoritos, {}) : {};
  row.avatarUrl = row.avatar || null;
  return row;
}

function updateByEmail(email, updates) {
  const allowed = new Set(['nombre', 'apellido', 'nickname', 'avatar', 'passwordHash', 'favoritos']);
  const keys = Object.keys(updates || {}).filter(k => allowed.has(k) || k === 'favs' || k === 'avatarUrl' || k === 'removeAvatar');
  if (keys.length === 0) return findByEmail(email);

  const clauses = [];
  const values = [];
  keys.forEach(k => {
    if (k === 'favs') {
      clauses.push('favoritos = ?');
      values.push(JSON.stringify(updates[k] || {}));
    } else if (k === 'favoritos') {
      clauses.push('favoritos = ?');
      values.push(typeof updates[k] === 'string' ? updates[k] : JSON.stringify(updates[k] || {}));
    } else if (k === 'avatarUrl') {
      clauses.push('avatar = ?');
      values.push(updates[k]);
    } else if (k === 'removeAvatar') {
      // explicit request to remove avatar
      clauses.push('avatar = NULL');
    } else {
      clauses.push(`${k} = ?`);
      values.push(updates[k]);
    }
  });

  const sql = `UPDATE usuarios SET ${clauses.join(', ')} WHERE LOWER(email) = LOWER(?)`;
  db.prepare(sql).run(...values, email);
  return findByEmail(email);
}

function deleteByEmail(email) {
  const stmt = db.prepare('DELETE FROM usuarios WHERE LOWER(email) = LOWER(?)');
  const info = stmt.run(email);
  return info.changes > 0;
}

module.exports = { leerUsuarios, createUser, findByEmail, updateByEmail, deleteByEmail };