const { registrarUsuario, loginUsuario, actualizarUsuario } = require('../services/userService');
const jwt = require('jsonwebtoken');
const { cambiarContrasena } = require('../services/userService');

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
    const { email, nombre, apellido, nickname } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email requerido' });
    }
    const user = await actualizarUsuario({ email, nombre, apellido, nickname });
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

module.exports = { postRegister, postLogin, putUpdateUser, putChangePassword };

