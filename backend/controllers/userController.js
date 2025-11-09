const { registrarUsuario, loginUsuario, actualizarUsuario, cambiarContrasena, eliminarUsuario, obtenerFavoritos } = require('../services/userService');
const { iniciarToken } = require('../controllers/authController');
const jwt = require('jsonwebtoken');

async function postRegister(req, res) {
  try {
    const user = await registrarUsuario(req.body); 
    res.status(201).json({ message: 'Usuario registrado con éxito', data: { id: user.public_id, email: user.email }, timestamp: user.createdAt });
  } catch (e) {
    console.error('[postRegister]', e);
    res.status(e.status || 400).json({ message: e.message || 'Error registrando usuario' });
  }
}


async function postLogin(req, res) {
  try {
    const user = await loginUsuario(req.body);
    // Generar token JWT con el email y fecha de creación
    const token = iniciarToken(user);
    res.status(200).json({ message: 'Login exitoso', token, user: { id: user.public_id, email: user.email, nombre: user.nombre, apellido: user.apellido, nickname: user.nickname, avatarUrl: user.avatarUrl } });
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
    // verificar que el usuario en sesión es el mismo que el que se quiere actualizar
    const { email, nombre, apellido, nickname, removeAvatar } = req.body;
    const usuarioSesion = req.user;
    const cuentaACambiar = req.body;

    if (!usuarioSesion){
      const err = new Error('No autorizado'); err.status = 401; throw err;
    }
    if (!email) {
      return res.status(400).json({ message: 'Email requerido' });
    }
    if (usuarioSesion.email !== cuentaACambiar.email) {
      const err = new Error('No autorizado para cambiar datos'); err.status = 403; throw err;
    }
    // si multer guardó un archivo, construir la ruta relativa a /uploads
    let avatarUrl = undefined;
    if (req.file && req.file.filename) {
      avatarUrl = `/uploads/${req.file.filename}`;
    }
    const user = await actualizarUsuario({ email, nombre, apellido, nickname, avatarUrl, removeAvatar });
    res.status(200).json({ message: 'Usuario actualizado', user: { id: user.public_id, email: user.email, nombre: user.nombre, apellido: user.apellido, nickname: user.nickname, avatarUrl: user.avatarUrl } });
  } catch (e) {
    console.error('[putUpdateUser]', e);
    res.status(e.status || 400).json({ message: e.message || 'Error actualizando usuario' });
  }
}

async function putChangePassword(req, res) {
  try {
    // verificar que el usuario en sesión es el mismo que el que se quiere actualizar
    const usuarioSesion = req.user;
    const cuentaACambiar = req.body;
    if (!usuarioSesion){
      const err = new Error('No autorizado'); err.status = 401; throw err;
    }
    if (usuarioSesion.email !== cuentaACambiar.email){
      const err = new Error('No autorizado para cambiar esta contraseña'); err.status = 403; throw err;
    }
    const { email, currentPassword, newPassword } = req.body;
    if (!email) {
      const err = new Error('Email requerido'); err.status = 400; throw err;
    }
    if (!currentPassword || !newPassword) {
      const err = new Error('Contraseña actual y nueva son requeridas'); err.status = 400; throw err;
    }
    const user = await cambiarContrasena({ email, currentPassword, newPassword });
    res.status(200).json({ message: 'Contraseña actualizada', user: { id: user.public_id, email: user.email } });
  } catch (e) {
    console.error('[putChangePassword]', e);
    res.status(e.status || 400).json({ message: e.message || 'Error cambiando contraseña' });
  }
}

// Obtener favoritos del usuario
async function getUserFavs(req, res) {
  try {
    // verificar que el usuario tenga sesión
    const usuarioSesion = req.user;
    if (!usuarioSesion){
      const err = new Error('No autorizado'); err.status = 401; throw err;
    }
    const email = req.body.email;
    if (!email) return res.status(400).json({ message: 'Email requerido' });
    const favs = await obtenerFavoritos(email);
    res.status(200).json({ message: 'Favoritos obtenidos', user: { id: user.public_id, email: user.email, favs } });
  } catch (e) {
    console.error('[getUserFavs]', e);
    res.status(e.status || 400).json({ message: e.message || 'Error obteniendo favoritos' });
  }
}

// Actualizar favoritos del usuario (body: { email, favs: { id: true } })
async function putUserFavs(req, res) {
  try {
    // verificar que el usuario tenga sesión
    const usuarioSesion = req.user;
    if (!usuarioSesion){
      const err = new Error('No autorizado'); err.status = 401; throw err;
    }
    const { email, favs } = req.body;
    if (!email) return res.status(400).json({ message: 'Email requerido' });
    const updated = await actualizarFavoritos(email, favs || {});
    res.status(200).json({ message: 'Favoritos actualizados', user: { id: user.public_id, email: user.email, favs: updated } });
  } catch (e) {
    console.error('[putUserFavs]', e);
    res.status(e.status || 400).json({ message: e.message || 'Error actualizando favoritos' });
  }
}

// Eliminar cuenta de usuario
async function deleteUser(req, res) {
  try {
    const { email, password } = req.body;
    const cuentaAEliminar = req.body;
    const usuarioSesion = req.user;
    if (!usuarioSesion){
      const err = new Error('No autorizado'); err.status = 401; throw err;
    }
    if (usuarioSesion.email !== cuentaAEliminar.email){
      const err = new Error('No autorizado para eliminar esta cuenta'); err.status = 403; throw err;
    }
    const result = await eliminarUsuario({ email, password });
    res.status(200).json({message: 'Cuenta eliminada', result});
  } catch (e) {
    console.error('[deleteUser]', e);
    res.status(e.status || 400).json({ message: e.message || 'Error eliminando usuario' });
  }
}

module.exports = { postRegister, postLogin, putUpdateUser, putChangePassword, getUserFavs, putUserFavs, deleteUser };

