const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const userRoutes = require('./routes/userRoutes');
const libroRoutes = require('./routes/libroRoutes');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Archivos estáticos (HTML en presentacion/)
app.use(express.static(path.join(__dirname, 'presentacion')));

// Rutas
app.use('/api/users', userRoutes);
app.use('/api/libros', libroRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
