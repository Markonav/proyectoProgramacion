const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { loginUsuario } = require('../services/userService');

const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';
const JWT_ALGORITHM = 'HS256';

function iniciarToken(user) {
  return jwt.sign({ email: user.email, public_id: user.public_id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
    algorithm: JWT_ALGORITHM
  });
}

function verificarToken(token) {
  return jwt.verify(token, JWT_SECRET, { algorithms: [JWT_ALGORITHM] });
}

async function login(req, res) {
  const user = await loginUsuario(req.body);
  const token = iniciarToken(user);
  return res.json({ message: 'Login exitoso', token, user });
}

module.exports = { login, verificarToken, iniciarToken };
