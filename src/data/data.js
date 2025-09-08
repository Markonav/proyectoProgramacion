const fs = require('fs');
const path = require('path');
const { validarLibro, generarID } = require('./validaciones');

const dataFilePath = path.join(__dirname, 'libro.json');

function leerDatos() {
  const raw = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(raw);
}

function escribirDatos(data) {
  try {
    for (const libro of data) {
      if (!validarLibro(libro)) {
        throw new Error(`Libro inválido: ${JSON.stringify(libro)}`);
      }
    }

    fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    console.log("Datos guardados correctamente.");

  } catch (error) {
    console.error("Error al guardar datos:", error.message);
  }
}
function testPersistencia() {
  console.log("Datos actuales:");
  console.log(leerDatos());

  const libros = leerDatos();
  libros.push({ id: generarID(libros), titulo: "Nuevo libro", autor: "Autor", 
    PrecioRenta: 327});
  escribirDatos(libros);

  console.log("Después de añadir un libro:");
  console.log(leerDatos());
}

testPersistencia();
