<template>
<section class="perfil__content">
  <h1 class="perfil__title">Perfil</h1>
  <!-- Foto de perfil -->
  <div class="perfil__panel card">
    <h2 class="panel__title">Foto de Perfil</h2>
    <div class="avatar-row">
      <div class="avatar">
        <span v-if="!avatarUrl" class="avatar__icon">👤</span>
        <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" />
      </div>
      <div class="avatar__actions">
        <label class="btn-secondary">
          Subir Foto
          <input type="file" accept="image/*" hidden @change="cargarAvatar" />
        </label>
        <button class="link-danger" @click="quitarAvatar">Quitar</button>
      </div>
    </div>
  </div>  
  <!-- Datos del usuario -->
  <div class="perfil__panel card">
    <h2 class="panel__title">Datos del Usuario</h2>
    <form class="perfil__form" @submit.prevent="guardarPerfil">
      <div class="row-2">
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="perfil.nombre" type="text" required />
        </div>
        <div class="form-group">
          <label>Apellido</label>
          <input v-model="perfil.apellido" type="text" required />
        </div>
      </div>
      <div class="form-group">
        <label>Nickname</label>
        <input v-model="perfil.nickname" type="text" required />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn">{{ buttonLabel }}</button>
      </div>
    </form>
  </div>
</section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue"

// Estado del perfil
const perfil = ref({
  nombre: "",
  apellido: "",
  nickname: ""
})

const avatarUrl = ref(null)
const hasSavedProfile = ref(false)
const avatarFile = ref(null)

onMounted(() => {
  try {
    const stored = JSON.parse(localStorage.getItem('user')) || {}
    if (stored.nombre) perfil.value.nombre = stored.nombre
    if (stored.apellido) perfil.value.apellido = stored.apellido
    if (stored.nickname) perfil.value.nickname = stored.nickname
    if (stored.avatarUrl) avatarUrl.value = stored.avatarUrl
    hasSavedProfile.value = Boolean(stored.nombre || stored.apellido || stored.nickname)
  } catch (e) {
    // ignore
  }
})

const buttonLabel = computed(() => hasSavedProfile.value ? 'Editar Perfil' : 'Confirmar')

// Métodos
function cargarAvatar(e) {
  const file = e.target.files[0]
  if (file) {
    avatarFile.value = file
    avatarUrl.value = URL.createObjectURL(file)
  }
}

function quitarAvatar() {
  avatarUrl.value = null
  avatarFile.value = null
  // If user is logged in, request server to remove stored avatar
  const user = JSON.parse(localStorage.getItem('user') || 'null');
  if (!user || !user.email) return;
  (async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': 'Bearer ' + token } : {})
        },
        body: JSON.stringify({ email: user.email, removeAvatar: true })
      });
      if (res.ok) {
        const updated = await res.json().catch(() => ({}));
        const newUser = { ...user };
        delete newUser.avatarUrl;
        localStorage.setItem('user', JSON.stringify(newUser));
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Avatar eliminado', type: 'success', duration: 2000 } }));
      }
    } catch (e) {
      // ignore
    }
  })();
}

async function guardarPerfil() {
  // Validaciones cliente antes de enviar (coincidir con reglas esperadas en backend)
  const nombreVal = String(perfil.value.nombre || '').trim();
  const apellidoVal = String(perfil.value.apellido || '').trim();
  const nickVal = String(perfil.value.nickname || '').trim();
  const nameRe = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,40}$/u;
  if (!nameRe.test(nombreVal)) {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Nombre inválido. Usa letras y espacios (mín. 2 caracteres).', type: 'error', duration: 3500 } }));
    return;
  }
  if (!nameRe.test(apellidoVal)) {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Apellido inválido. Usa letras y espacios (mín. 2 caracteres).', type: 'error', duration: 3500 } }));
    return;
  }
  const nickRe = /^[A-Za-z0-9_]{3,20}$/;
  if (!nickRe.test(nickVal)) {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Nickname inválido. Solo letras, números y _ (3-20 caracteres).', type: 'error', duration: 3500 } }));
    return;
  }
  // Obtener usuario logueado
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.email) {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'No hay sesión activa.', type: 'info', duration: 3000 } }));
    return;
  }
  // Preparar datos
  const datos = {
    email: user.email,
    nombre: perfil.value.nombre,
    apellido: perfil.value.apellido,
    nickname: perfil.value.nickname
  };
  try {
    const token = localStorage.getItem('token');
    let res;
    if (avatarFile.value) {
      const form = new FormData();
      form.append('avatar', avatarFile.value);
      form.append('email', user.email);
      form.append('nombre', perfil.value.nombre);
      form.append('apellido', perfil.value.apellido);
      form.append('nickname', perfil.value.nickname);
      res = await fetch('http://localhost:3000/api/users/update', {
        method: 'PUT',
        headers: {
          ...(token ? { 'Authorization': 'Bearer ' + token } : {})
        },
        body: form
      });
    } else {
      res = await fetch('http://localhost:3000/api/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': 'Bearer ' + token } : {})
        },
        body: JSON.stringify(datos)
      });
    }
    const data = await res.json();
    if (res.ok) {
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Perfil actualizado correctamente', type: 'success', duration: 3000 } }));
      // Actualizar user en localStorage
      // server returns updated user; merge into localStorage if present
      const returned = data || {};
      const backendBase = 'http://localhost:3000';
      const merged = { ...user, ...datos, ...(returned || {}) };
      // if server returns a relative avatarUrl like '/uploads/xxx', prefix backend host
      if (merged.avatarUrl && !String(merged.avatarUrl).startsWith('http')) {
        merged.avatarUrl = `${backendBase}${merged.avatarUrl}`;
      }
      localStorage.setItem('user', JSON.stringify(merged));
      if (merged.avatarUrl) avatarUrl.value = merged.avatarUrl;
      hasSavedProfile.value = true
    } else {
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: data.message || 'Error al actualizar perfil', type: 'error', duration: 3500 } }));
    }
  } catch (e) {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Error de conexión con el servidor', type: 'error', duration: 3500 } }));
  }
}
</script>


<style src="@/assets/styles/cuentaeditarPerfil.css"></style>
<style scoped>
  .grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-top: 24px;
  }
</style>