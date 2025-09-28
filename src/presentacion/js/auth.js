const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const formMessage = document.getElementById('formMessage');

function showMessage(msg, ok = true) {
  formMessage.textContent = msg;
  formMessage.style.color = ok ? 'green' : 'red';
}

function enviarDatos(ruta) {
  const email = emailEl.value.trim();
  const password = passEl.value.trim();

  if (!email || !password) {
    showMessage("Debes completar todos los campos", false);
    return;
  }

  fetch(ruta, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })
  .then(res => res.json().then(data => ({ ok: res.ok, data })))
  .then(result => {
    if (result.ok) {
      showMessage(result.data.message || "Operación exitosa", true);
      // 👉 Redirigir a catalogo.html después de 1 segundo
      setTimeout(() => {
        window.location.href = "catalogo.html";
      }, 1000);
    } else {
      showMessage(result.data.message || "Error en la operación", false);
    }
  })
  .catch(() => showMessage("Error de conexión con el servidor", false));
}


document.getElementById('registerBtn')
  .addEventListener('click', () => enviarDatos('/api/users/register'));
document.getElementById('loginBtn')
  .addEventListener('click', () => enviarDatos('/api/users/login'));

