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
    avatarUrl.value = URL.createObjectURL(file)
  }
}

function quitarAvatar() {
  avatarUrl.value = null
}

async function guardarPerfil() {
  // Obtener usuario logueado
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.email) {
    alert('No hay sesión activa.');
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
    const res = await fetch('http://localhost:3000/api/users/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': 'Bearer ' + token } : {})
      },
      body: JSON.stringify(datos)
    });
    const data = await res.json();
    if (res.ok) {
      alert('Perfil actualizado correctamente');
      // Actualizar user en localStorage
      localStorage.setItem('user', JSON.stringify({ ...user, ...datos }));
      hasSavedProfile.value = true
    } else {
      alert(data.message || 'Error al actualizar perfil');
    }
  } catch (e) {
    alert('Error de conexión con el servidor');
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