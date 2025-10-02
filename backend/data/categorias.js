const fs = require('fs');
const path = require('path');

function leerCategorias() {
  const categoriasPath = path.join(__dirname, 'categorias.json');
  try {
    const data = fs.readFileSync(categoriasPath, 'utf8');
    return JSON.parse(data).categorias;
  } catch (err) {
    return [];
  }
}

module.exports = { leerCategorias };
