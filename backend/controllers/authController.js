const jwt = require('jsonwebtoken');
const { loginUsuario } = require('../services/userService');

// Use env JWT secret when available
const SECRET_KEY = process.env.JWT_SECRET || 'mi_clave_super_secreta';

// 🔑 LOGIN
async function login(req, res) {
  try {
    // loginUsuario validará credenciales (bcrypt) y devolverá el usuario safe
    const user = await loginUsuario(req.body);

    // Crear el token incluyendo public_id para uso frontend
    const token = jwt.sign(
      { email: user.email, public_id: user.public_id },
      SECRET_KEY,
      { expiresIn: '2h  ' }
    );

    return res.json({ message: 'Login exitoso', token, user });
  } catch (err) {
    console.error('[authController.login] error:', err.message || err);
    const status = err.status || 401;
    return res.status(status).json({ message: err.message || 'Credenciales inválidas' });
  }
}

module.exports = { login };
