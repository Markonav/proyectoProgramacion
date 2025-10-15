const { leerCategorias } = require('../data/categoriasData');

exports.obtenerCategorias = async () => {
  return leerCategorias();
};
