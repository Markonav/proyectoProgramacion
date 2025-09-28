const { leerUsuarios, escribirUsuarios } = require('../data/data');

function registrarUsuario(email, password) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !password) throw new Error('Correo y contraseña son requeridos');
  if (!emailRegex.test(email)) throw new Error('El correo no es válido');
  if (password.length < 6 || !/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    throw new Error('La contraseña debe tener al menos 6 caracteres e incluir letras y números');
  }

  const users = leerUsuarios();
  if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
    throw new Error('El correo ya está registrado');
  }

  users.push({ email: email.trim(), password: password.trim() });
  escribirUsuarios(users);

  return { email };
}

function loginUsuario(email, password) {
  if (!email || !password) throw new Error('Correo y contraseña son requeridos');

  const users = leerUsuarios();
  const user = users.find(
    u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password.trim()
  );

  if (!user) throw new Error('Correo o contraseña incorrectos');
  return user;
}

module.exports = { registrarUsuario, loginUsuario };
