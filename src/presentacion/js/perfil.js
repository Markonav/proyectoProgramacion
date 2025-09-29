
const form = document.getElementById('perfilForm');
const nombre   = document.getElementById('nombre');
const apellido = document.getElementById('apellido');
const nickname = document.getElementById('nickname');

const errNombre   = document.getElementById('err-nombre');
const errApellido = document.getElementById('err-apellido');
const errNick     = document.getElementById('err-nickname');

// Solo letras (con acentos/ñ/ü) y espacios entre palabras
const NOMBRE_RE = /^[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+(?:\s+[A-Za-zÁÉÍÓÚÜáéíóúüÑñ]+)*$/;

function setErr(input, errEl, msg){
  input.setCustomValidity(msg);
  input.setAttribute('aria-invalid','true');
  if (errEl) errEl.textContent = msg;
  return false;
}
function clearErr(input, errEl){
  input.setCustomValidity('');
  input.setAttribute('aria-invalid','false');
  if (errEl) errEl.textContent = '';
  return true;
}

function validarNombreLike(input, errEl){
  const v = input.value.trim();
  input.value = v; 
  if (v.length === 0) return setErr(input, errEl, 'Este campo es obligatorio');
  if (v.length > 25)  return setErr(input, errEl, 'Máximo 25 caracteres');
  if (!NOMBRE_RE.test(v)) return setErr(input, errEl, 'Usa solo letras');
  return clearErr(input, errEl);
}

function validarNickname(input, errEl){
  const v = input.value.trim();
  input.value = v;
  if (v.length === 0) return setErr(input, errEl, 'Este campo es obligatorio');
  if (v.length > 25)  return setErr(input, errEl, 'Máximo 25 caracteres');
  return clearErr(input, errEl);
}

[['input','blur']].flat().forEach(evt => {
  nombre?.addEventListener(evt,   () => validarNombreLike(nombre, errNombre));
  apellido?.addEventListener(evt, () => validarNombreLike(apellido, errApellido));
  nickname?.addEventListener(evt, () => validarNickname(nickname, errNick));
});


form?.addEventListener('submit', (e)=>{
  const ok =
    validarNombreLike(nombre, errNombre) &&
    validarNombreLike(apellido, errApellido) &&
    validarNickname(nickname, errNick);

  if (!ok) e.preventDefault();
});

