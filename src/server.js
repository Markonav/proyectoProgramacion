// src/server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const userRoutes = require('./routes/userRoutes');     // /api/users/*
const libroRoutes = require('./routes/libroRoutes');   // /api/libros/* (si ya existe)

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({ limit: '1mb' }));
app.use(express.static(path.join(__dirname, 'presentacion')));

// Rutas API
app.use('/api/users', userRoutes);
app.use('/api/libros', libroRoutes); // si no tienes libros, quita esta línea

// 404 y manejo de errores
app.use((req, res) => res.status(404).json({ message: 'Recurso no encontrado' }));
app.use((err, req, res, next) => {
  console.error('[ERROR]', err);
  res.status(500).json({ message: 'Error interno' });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

