const { leerCategorias } = require('../data/categoriasData');

async function obtenerCategorias() {
  return leerCategorias();
}

module.exports = { obtenerCategorias };
