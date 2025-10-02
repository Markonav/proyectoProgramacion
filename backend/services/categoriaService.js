const { leerCategorias } = require('../data/categorias');

exports.obtenerCategorias = async () => {
  return leerCategorias();
};
