<template>
<section class="perfil__content">
  <h1 class="perfil__title">{{ perfil.nickname }}</h1>
  <!-- Foto de perfil -->
  <div class="perfil__panel card">
    <h2 class="panel__title">Foto de Perfil</h2>
    <div class="avatar-row">
      <div class="avatar">
        <span v-if="!avatarUrl" class="avatar__icon">👤</span>
        <img v-if="avatarUrl" :src="avatarUrl" alt="Avatar" />
      </div>
      <div class="avatar__actions">
        <label class="btn btn-secondary">
          Subir Foto
          <input type="file" accept="image/*" hidden @change="cargarAvatar" />
        </label>
        <button 
          v-if="avatarUrl" 
          class="btn btn-danger" 
          @click="quitarAvatar"
        >
          Quitar
        </button>
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

<script>
export default {
  name: "EditarPerfil",
  data() {
    return {
      // Estado del perfil
      perfil: {
        nombre: "",
        apellido: "",
        nickname: ""
      },
      avatarUrl: null,
      hasSavedProfile: false,
      avatarFile: null
    };
  },
  computed: {
    buttonLabel() {
      return this.hasSavedProfile ? 'Editar Perfil' : 'Confirmar';
    }
  },
  methods: {
    cargarAvatar(e) {
      const file = e.target.files[0]
      if (file) {
        this.avatarFile = file
        this.avatarUrl = URL.createObjectURL(file)
      }
    },
    async quitarAvatar() {
      // Limpiar avatar localmente primero
      this.avatarUrl = null;
      this.avatarFile = null;
      
      // Actualizar localStorage inmediatamente
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (user && user.email) {
        const updatedUser = { ...user };
        delete updatedUser.avatarUrl;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        // Sincronizar con servidor
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
            window.dispatchEvent(new CustomEvent('app:toast', { 
              detail: { 
                message: 'Avatar eliminado correctamente', 
                type: 'success', 
                duration: 2000 
              } 
            }));
          } else {
            window.dispatchEvent(new CustomEvent('app:toast', { 
              detail: { 
                message: 'Avatar eliminado localmente (error de sincronización)', 
                type: 'info', 
                duration: 3000 
              } 
            }));
          }
        } catch (error) {
          window.dispatchEvent(new CustomEvent('app:toast', { 
            detail: { 
              message: 'Avatar eliminado localmente (sin conexión)', 
              type: 'info', 
              duration: 3000 
            } 
          }));
        }
      }
    },
    async guardarPerfil() {
      // Validaciones cliente antes de enviar (coincidir con reglas esperadas en backend)
      const nombreVal = String(this.perfil.nombre || '').trim();
      const apellidoVal = String(this.perfil.apellido || '').trim();
      const nickVal = String(this.perfil.nickname || '').trim();
      const nameRe = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]{2,40}$/u;
      if (!nameRe.test(nombreVal)) {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Nombre inválido. Usa letras y espacios (mín. 2 caracteres).', type: 'error', duration: 3500 } }));
        return;
      }
      if (!nameRe.test(apellidoVal)) {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Apellido inválido. Usa letras y espacios (mín. 2 caracteres).', type: 'error', duration: 3500 } }));
        return;
      }
      const nickRe = /^[A-Za-z0-9_]{3,8}$/;
      if (!nickRe.test(nickVal)) {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Nickname inválido. Solo letras, números y _ (3-8 caracteres).', type: 'error', duration: 3500 } }));
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
        nombre: this.perfil.nombre,
        apellido: this.perfil.apellido,
        nickname: this.perfil.nickname
      };
      try {
        const token = localStorage.getItem('token');
        let res;
        if (this.avatarFile) {
          const form = new FormData();
          form.append('avatar', this.avatarFile);
          form.append('email', user.email);
          form.append('nombre', this.perfil.nombre);
          form.append('apellido', this.perfil.apellido);
          form.append('nickname', this.perfil.nickname);
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
          if (merged.avatarUrl) this.avatarUrl = merged.avatarUrl;
          this.hasSavedProfile = true
        } else {
          window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: data.message || 'Error al actualizar perfil', type: 'error', duration: 3500 } }));
        }
      } catch (e) {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Error de conexión con el servidor', type: 'error', duration: 3500 } }));
      }
    }
  },
  mounted() {
    try {
      const stored = JSON.parse(localStorage.getItem('user')) || {}
      if (stored.nombre) this.perfil.nombre = stored.nombre
      if (stored.apellido) this.perfil.apellido = stored.apellido
      if (stored.nickname) this.perfil.nickname = stored.nickname
      if (stored.avatarUrl) this.avatarUrl = stored.avatarUrl
      this.hasSavedProfile = Boolean(stored.nombre || stored.apellido || stored.nickname)
    } catch (e) {
      // ignore
    }
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