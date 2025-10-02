const fs = require('fs');
const path = require('path');

const dataDir = __dirname;
const usersPath = path.join(dataDir, 'users.json');

// Asegura archivo inicial
function ensureUsersFile() {
  if (!fs.existsSync(usersPath)) {
    fs.writeFileSync(usersPath, '[]\n', 'utf8');
  }
}

function leerUsuarios() {
  try {
    ensureUsersFile();
    const raw = fs.readFileSync(usersPath, 'utf8') || '[]';
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  } catch (e) {
    console.error('[usersStore] Error leyendo users.json:', e);
    return [];
  }
}

function escribirUsuarios(arr) {
  try {
    fs.writeFileSync(usersPath, JSON.stringify(arr ?? [], null, 2) + '\n', 'utf8');
  } catch (e) {
    console.error('[usersStore] Error escribiendo users.json:', e);
    throw new Error('Persistencia de usuarios falló');
  }
}

module.exports = { leerUsuarios, escribirUsuarios };
