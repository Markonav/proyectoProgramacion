const { registrarUsuario, loginUsuario, actualizarUsuario } = require('../services/userService');
const { obtenerFavoritos, actualizarFavoritos } = require('../services/userService');
const jwt = require('jsonwebtoken');
const { cambiarContrasena, eliminarUsuario } = require('../services/userService');

async function postRegister(req, res) {
  try {
    const user = await registrarUsuario(req.body); 
    res.status(201).json(user);
  } catch (e) {
    console.error('[postRegister]', e);
    res.status(e.status || 400).json({ message: e.message || 'Error registrando usuario' });
  }
}


// Clave secreta para JWT (en producción usar variable de entorno)
const JWT_SECRET = process.env.JWT_SECRET || 'supersecreto';

async function postLogin(req, res) {
  try {
    const user = await loginUsuario(req.body);
    // Generar token JWT con el email y fecha de creación
    const token = jwt.sign(
      { email: user.email, createdAt: user.createdAt },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ user, token });
  } catch (e) {
    console.error('[postLogin]', e);
    res.status(e.status || 401).json({ message: e.message || 'Login inválido' });
  }
}


// Actualizar datos de usuario (nombre, apellido, nickname)
async function putUpdateUser(req, res) {
  try {
    // puede llegar un archivo multipart (avatar) o JSON
    console.log('[putUpdateUser] incoming req.file:', req.file);
    console.log('[putUpdateUser] incoming req.body keys:', Object.keys(req.body));
    const { email, nombre, apellido, nickname, removeAvatar } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email requerido' });
    }
    // si multer guardó un archivo, construir la ruta relativa a /uploads
    let avatarUrl = undefined;
    if (req.file && req.file.filename) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }
    const user = await actualizarUsuario({ email, nombre, apellido, nickname, avatarUrl, removeAvatar });
    res.json(user);
  } catch (e) {
    console.error('[putUpdateUser]', e);
    res.status(e.status || 400).json({ message: e.message || 'Error actualizando usuario' });
  }
}

async function putChangePassword(req, res) {
  try {
    const { email, currentPassword, newPassword } = req.body;
    const user = await cambiarContrasena({ email, currentPassword, newPassword });
    res.json({ message: 'Contraseña actualizada', user });
  } catch (e) {
    console.error('[putChangePassword]', e);
    res.status(e.status || 400).json({ message: e.message || 'Error cambiando contraseña' });
  }
}

// Obtener favoritos del usuario
async function getUserFavs(req, res) {
  try {
    const email = req.query.email;
    if (!email) return res.status(400).json({ message: 'Email requerido' });
    const favs = await obtenerFavoritos(email);
    res.json({ favs });
  } catch (e) {
    console.error('[getUserFavs]', e);
    res.status(e.status || 400).json({ message: e.message || 'Error obteniendo favoritos' });
  }
}

// Actualizar favoritos del usuario (body: { email, favs: { id: true } })
async function putUserFavs(req, res) {
  try {
    const { email, favs } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requerido' });
    const updated = await actualizarFavoritos(email, favs || {});
    res.json({ favs: updated });
  } catch (e) {
    console.error('[putUserFavs]', e);
    res.status(e.status || 400).json({ message: e.message || 'Error actualizando favoritos' });
  }
}

// Eliminar cuenta de usuario
async function deleteUser(req, res) {
  try {
    const { email, password } = req.body;
    const result = await eliminarUsuario({ email, password });
    res.json(result);
  } catch (e) {
    console.error('[deleteUser]', e);
    res.status(e.status || 400).json({ message: e.message || 'Error eliminando usuario' });
  }
}

module.exports = { postRegister, postLogin, putUpdateUser, putChangePassword, getUserFavs, putUserFavs, deleteUser };

