const { registrarUsuario, loginUsuario } = require('../services/userService');

function register(req, res) {
  try {
    const { email, password } = req.body;
    const user = registrarUsuario(email, password);
    res.json({ message: 'Usuario registrado correctamente', data: user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
}

function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = loginUsuario(email, password);
    res.json({ message: `Bienvenido, ${user.email}` });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
}

module.exports = { register, login };
