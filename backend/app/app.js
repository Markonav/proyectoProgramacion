
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const userRoutes = require('../routes/userRoutes');     
const libroRoutes = require('../routes/libroRoutes');
const categoriaRoutes = require('../routes/categoriaRoutes');

const app = express();


// Configuración
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Archivos estáticos - MEJOR ORGANIZADOS
app.use(express.static(path.join(__dirname, '../presentacion')));

// Rutas API
app.use('/api/users', userRoutes);
app.use('/api/libros', libroRoutes);
app.use('/api/categorias', categoriaRoutes);

// Servir página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/pages/menu.html'));
});

// Rutas para páginas específicas
app.get('/:page', (req, res) => {
  const page = req.params.page;
  const validPages = [
    'catalogo', 'categorias', 'cuenta', 'favoritos', 
    'perfil', 'agregarnuevo', 'login'
  ];
  
  if (validPages.includes(page)) {
    res.sendFile(path.join(__dirname, `../views/pages/${page}.html`));
  } else {
    res.status(404).json({ message: 'Página no encontrada' });
  }
});

// Manejo de errores
app.use((req, res) => {
  res.status(404).json({ message: 'Recurso no encontrado' });
});

app.use((err, req, res, next) => {
  console.error('🔴 [ERROR]', err);
  res.status(500).json({ message: 'Error interno del servidor' });
});

module.exports = app;