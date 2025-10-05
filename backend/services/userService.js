
let bcrypt;
try { bcrypt = require('bcrypt'); }
catch { bcrypt = require('bcryptjs'); } 

const { leerUsuarios, escribirUsuarios } = require('../data/usersStore');

const SALT_ROUNDS = 10;

const normEmail = (e = '') => String(e).trim().toLowerCase();
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const validPass = (p) => {
  const s = String(p ?? '');
  return s.length >= 6 && /[A-Za-z]/.test(s) && /\d/.test(s);
};

// Validaciones para nombre/apellido/nickname
const validName = (n) => /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,40}$/.test(String(n || ''));
const validNick = (n) => /^[A-Za-z0-9_]{3,20}$/.test(String(n || ''));

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

// Obtener favoritos de un usuario
async function obtenerFavoritos(email) {
  if (!email) { const err = new Error('Email requerido'); err.status = 400; throw err; }
  const usuarios = leerUsuarios();
  const e = normEmail(email);
  const user = usuarios.find(u => normEmail(u.email) === e);
  if (!user) { const err = new Error('Usuario no encontrado'); err.status = 404; throw err; }
  return user.favs || {};
}

// Actualizar favoritos de un usuario (favs: object)
async function actualizarFavoritos(email, favs) {
  if (!email) { const err = new Error('Email requerido'); err.status = 400; throw err; }
  const usuarios = leerUsuarios();
  const e = normEmail(email);
  const idx = usuarios.findIndex(u => normEmail(u.email) === e);
  if (idx === -1) { const err = new Error('Usuario no encontrado'); err.status = 404; throw err; }
  usuarios[idx].favs = Object.assign({}, usuarios[idx].favs || {}, favs);
  escribirUsuarios(usuarios);
  return usuarios[idx].favs || {};
}

// Actualizar datos de usuario (nombre, apellido, nickname)
async function actualizarUsuario({ email, nombre, apellido, nickname }) {
  if (!email) {
    const err = new Error('Email requerido');
    err.status = 400;
    throw err;
  }
  const usuarios = leerUsuarios();
  const e = normEmail(email);
  const idx = usuarios.findIndex(u => normEmail(u.email) === e);
  if (idx === -1) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  // Validar y actualizar campos si se proveen
  if (typeof nombre === 'string') {
    if (!validName(nombre)) {
      const err = new Error('Nombre inválido. Usa letras y espacios (2-40 chars).'); err.status = 400; throw err;
    }
    usuarios[idx].nombre = nombre;
  }
  if (typeof apellido === 'string') {
    if (!validName(apellido)) {
      const err = new Error('Apellido inválido. Usa letras y espacios (2-40 chars).'); err.status = 400; throw err;
    }
    usuarios[idx].apellido = apellido;
  }
  if (typeof nickname === 'string') {
    if (!validNick(nickname)) {
      const err = new Error('Nickname inválido. Solo letras, números y _ (3-20 caracteres).'); err.status = 400; throw err;
    }
    usuarios[idx].nickname = nickname;
  }
  // avatarUrl: si viene string lo setea; si viene removeAvatar=true lo borra
  if (typeof arguments[0].avatarUrl === 'string') {
    usuarios[idx].avatarUrl = arguments[0].avatarUrl;
  }
  if (arguments[0].removeAvatar === 'true' || arguments[0].removeAvatar === true) {
    delete usuarios[idx].avatarUrl;
  }
  escribirUsuarios(usuarios);
  const { passwordHash, password, ...safe } = usuarios[idx];
  return safe;
}

// Cambiar contraseña: verifica contraseña actual y actualiza por la nueva
async function cambiarContrasena({ email, currentPassword, newPassword }) {
  if (!email) {
    const err = new Error('Email requerido'); err.status = 400; throw err;
  }
  if (!currentPassword) {
    const err = new Error('Contraseña actual requerida'); err.status = 400; throw err;
  }
  validarCredenciales(email, newPassword);

  const usuarios = leerUsuarios();
  const e = normEmail(email);
  const idx = usuarios.findIndex(u => normEmail(u.email) === e);
  if (idx === -1) {
    const err = new Error('Usuario no encontrado'); err.status = 404; throw err;
  }

  const user = usuarios[idx];
  const ok = await bcrypt.compare(String(currentPassword), user.passwordHash || '');
  if (!ok) {
    const err = new Error('Contraseña actual incorrecta'); err.status = 401; throw err;
  }

  const newHash = await bcrypt.hash(String(newPassword), SALT_ROUNDS);
  usuarios[idx].passwordHash = newHash;
  escribirUsuarios(usuarios);

  const { passwordHash, password, ...safe } = usuarios[idx];
  return safe;
}

module.exports = { registrarUsuario, loginUsuario, actualizarUsuario, cambiarContrasena, obtenerFavoritos, actualizarFavoritos };

