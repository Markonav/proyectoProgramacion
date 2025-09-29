const fs = require('fs');
const path = require('path');

const libroPath = path.join(__dirname, 'libro.json');
const userPath = path.join(__dirname, 'users.json');

//LIBROS
function leerLibros() {
  try {
    if (!fs.existsSync(libroPath)) return [];
    return JSON.parse(fs.readFileSync(libroPath, 'utf8'));
  } catch {
    return [];
  }
}

function escribirLibros(data) {
  fs.writeFileSync(libroPath, JSON.stringify(data, null, 2));
}

//USUARIOS
function leerUsuarios() {
  try {
    if (!fs.existsSync(userPath)) return [];
    return JSON.parse(fs.readFileSync(userPath, 'utf8'));
  } catch {
    return [];
  }
}

function escribirUsuarios(data) {
  fs.writeFileSync(userPath, JSON.stringify(data, null, 2));
}

module.exports = {
  leerLibros,
  escribirLibros,
  leerUsuarios,
  escribirUsuarios
};

