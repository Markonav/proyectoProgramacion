// src/controllers/userController.js
const { registrarUsuario, loginUsuario } = require('../services/userService');

async function postRegister(req, res) {
  try {
    const user = await registrarUsuario(req.body); // {email, password}
    res.status(201).json(user);
  } catch (e) {
    console.error('[postRegister]', e);
    res.status(e.status || 400).json({ message: e.message || 'Error registrando usuario' });
  }
}

async function postLogin(req, res) {
  try {
    const user = await loginUsuario(req.body); // {email, password}
    res.json(user);
  } catch (e) {
    console.error('[postLogin]', e);
    res.status(e.status || 401).json({ message: e.message || 'Login inválido' });
  }
}

module.exports = { postRegister, postLogin };

