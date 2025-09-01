const fs = require('fs');
const path = require('path');

const dataFilePath = path.join(__dirname, 'libro.json');

function leerDatos() {
  const raw = fs.readFileSync(dataFilePath, 'utf8');
  return JSON.parse(raw);
}

function escribirDatos(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}
function testPersistencia() {
  console.log("Datos actuales:");
  console.log(leerDatos());

  const libros = leerDatos();
  libros.push({ id: "X", titulo: "Nuevo libro", autor: "Autor", 
    PrecioRenta: "Precio" });
  escribirDatos(libros);

  console.log("Después de añadir un libro:");
  console.log(leerDatos());
}

testPersistencia();
