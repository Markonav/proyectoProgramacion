// src/services/userService.js
let bcrypt;
try { bcrypt = require('bcrypt'); }
catch { bcrypt = require('bcryptjs'); }  // fallback en Windows/Node sin toolchain

const { leerUsuarios, escribirUsuarios } = require('../data/usersStore');

const SALT_ROUNDS = 10;

const normEmail = (e = '') => String(e).trim().toLowerCase();
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const validPass = (p) => {
  const s = String(p ?? '');
  return s.length >= 6 && /[A-Za-z]/.test(s) && /\d/.test(s);
};

function validarCredenciales(email, password) {
  if (!validEmail(email)) {
    const err = new Error('Correo inválido');
    err.status = 400;
    throw err;
  }
  if (!validPass(password)) {
    const err = new Error('La contraseña debe tener 6+ caracteres con letras y números');
    err.status = 400;
    throw err;
  }
}

async function registrarUsuario({ email, password }) {
  const usuarios = leerUsuarios();
  const e = normEmail(email);
  validarCredenciales(e, password);

  if (usuarios.some(u => normEmail(u.email) === e)) {
    const err = new Error('El correo ya está registrado');
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(String(password), SALT_ROUNDS);
  const nuevo = { email: e, passwordHash, createdAt: new Date().toISOString() };

  usuarios.push(nuevo);
  escribirUsuarios(usuarios);

  // Nunca expongas el hash
  const { passwordHash: _discard, ...safe } = nuevo;
  return safe;
}

async function loginUsuario({ email, password }) {
  const usuarios = leerUsuarios();
  const e = normEmail(email);
  const pass = String(password ?? '');

  const user = usuarios.find(u => normEmail(u.email) === e);
  if (!user) {
    const err = new Error('Correo o contraseña incorrectos');
    err.status = 401;
    throw err;
  }

  // Migración automática si existiera un campo legacy "password" sin hash
  if (!user.passwordHash && user.password && !String(user.password).startsWith('$2')) {
    user.passwordHash = await bcrypt.hash(String(user.password), SALT_ROUNDS);
    delete user.password;
    escribirUsuarios(usuarios);
  }

  const ok = await bcrypt.compare(pass, user.passwordHash || '');
  if (!ok) {
    const err = new Error('Correo o contraseña incorrectos');
    err.status = 401;
    throw err;
  }

  const { passwordHash: _ph, password: _p, ...safe } = user;
  return safe;
}

module.exports = { registrarUsuario, loginUsuario };
