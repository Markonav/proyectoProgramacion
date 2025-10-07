<template>
<section class="perfil__content">
    <!-- Configuración de privacidad -->
    <div class="perfil__panel card">
        <h2 class="panel__title">Privacidad</h2>
        <div class="config-section">
            <h3>Visibilidad del perfil</h3>
            <div class="toggle-label">
                <span>Perfil público</span>
                <label class="toggle-switch">
                    <input type="checkbox" v-model="privacidad.publico">
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="toggle-label">
                <span>Mostrar libros leídos</span>
                <label class="toggle-switch">
                    <input type="checkbox" v-model="privacidad.mostrarLeidos">
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="toggle-label">
                <span>Mostrar favoritos</span>
                <label class="toggle-switch">
                    <input type="checkbox" v-model="privacidad.mostrarFavoritos">
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
    </div>

    <!-- Configuración de notificaciones -->
    <div class="perfil__panel card">
        <h2 class="panel__title">Notificaciones</h2>
        <div class="config-section">
            <h3>Preferencias de notificación</h3>
            <div class="toggle-label">
                <span>Notificaciones por email</span>
                <label class="toggle-switch">
                    <input type="checkbox" v-model="notificaciones.email">
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="toggle-label">
                <span>Novedades de autores seguidos</span>
                <label class="toggle-switch">
                    <input type="checkbox" v-model="notificaciones.novedadesAutores">
                    <span class="toggle-slider"></span>
                </label>
            </div>
            <div class="toggle-label">
                <span>Ofertas y promociones</span>
                <label class="toggle-switch">
                    <input type="checkbox" v-model="notificaciones.ofertas">
                    <span class="toggle-slider"></span>
                </label>
            </div>
        </div>
    </div>

    <!-- Configuración de seguridad -->
    <div class="perfil__panel card">
        <h2 class="panel__title">Seguridad</h2>
        <div class="config-section">
            <h3>Cambiar contraseña</h3>
            <form class="perfil__form" @submit.prevent="cambiarPassword">
                <div class="form-group">
                    <label>Contraseña actual</label>
                    <input v-model="seguridad.actual" type="password" placeholder="Ingresa tu contraseña actual" required />
                </div>
                <div class="form-group">
                    <label>Nueva contraseña</label>
                    <input v-model="seguridad.nueva" type="password" placeholder="Ingresa tu nueva contraseña" required />
                </div>
                <div class="form-group">
                    <label>Confirmar nueva contraseña</label>
                    <input v-model="seguridad.confirmar" type="password" placeholder="Confirma tu nueva contraseña" required />
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn">Cambiar Contraseña</button>
                </div>
            </form>
        </div>
    </div>

    <!-- Configuración de eliminación de cuenta -->
    <div class="perfil__panel card">
        <h2 class="danger-title">Eliminar Cuenta</h2>
        <div class="config-section">
            <p>Una vez que elimines tu cuenta, no podrás recuperarla. Todos tus datos, favoritos y configuraciones se perderán permanentemente.</p>
            <div class="form-actions">
                <button type="button" class="btn btn-danger" @click="mostrarConfirmacion">Eliminar Cuenta</button>
            </div>
        </div>
    </div>
</section>

<!-- Modal de confirmación para eliminar cuenta -->
<ConfirmModal
    :visible="showConfirmModal"
    title="Eliminar Cuenta"
    message="¿Estás seguro de que deseas eliminar tu cuenta?<br><br><strong>Esta acción NO se puede deshacer.</strong><br>Se perderán todos tus datos, favoritos y configuraciones."
    @confirm="confirmarEliminacion"
    @cancel="cancelarEliminacion"
/>

<!-- Modal para ingresar contraseña -->
<ConfirmModal
    :visible="showPasswordModal"
    title="Confirmar Identidad"
    message="Para confirmar la eliminación de tu cuenta, ingresa tu contraseña:"
    :showInput="true"
    inputType="password"
    inputPlaceholder="Tu contraseña"
    @confirm="eliminarCuentaFinal"
    @cancel="cancelarPassword"
/>
</template>

<script>
import ConfirmModal from '@/components/ConfirmModal.vue'

export default {
  name: "Configuracion",
  components: { ConfirmModal },
  data() {
    return {
      privacidad: {
        publico: true,
        mostrarLeidos: true,
        mostrarFavoritos: true
      },
      // Estados para los modales
      showConfirmModal: false,
      showPasswordModal: false,
      passwordInput: '',
      notificaciones: {
        email: true,
        novedadesAutores: true,
        ofertas: false
      },
      seguridad: {
        actual: '',
        nueva: '',
        confirmar: ''
      }
    };
  },
  methods: {
    validarNueva(n) {
      const s = String(n ?? '');
      return s.length >= 6 && /[A-Za-z]/.test(s) && /\d/.test(s);
    },
    async cambiarPassword() {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      if (!user.email) return alert('No hay sesión activa.');

      if (!this.seguridad.actual || !this.seguridad.nueva || !this.seguridad.confirmar) {
        return alert('Completa todos los campos');
      }
      if (this.seguridad.nueva !== this.seguridad.confirmar) {
        return alert('La nueva contraseña y la confirmación no coinciden');
      }
      if (!this.validarNueva(this.seguridad.nueva)) {
        return alert('La nueva contraseña debe tener al menos 6 caracteres, incluir letras y números');
      }

      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/users/password', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
          body: JSON.stringify({ email: user.email, currentPassword: this.seguridad.actual, newPassword: this.seguridad.nueva })
        });
        const data = await res.json();
        if (res.ok) {
          alert(data.message || 'Contraseña cambiada correctamente');
          // Limpiar campos
          this.seguridad.actual = '';
          this.seguridad.nueva = '';
          this.seguridad.confirmar = '';
        } else {
          alert(data.message || 'Error cambiando la contraseña');
        }
      } catch (e) {
        alert('Error de conexión con el servidor');
      }
    },
    mostrarConfirmacion() {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      if (!user.email) {
        alert('No hay sesión activa.');
        return;
      }
      this.showConfirmModal = true;
    },
    confirmarEliminacion() {
      this.showConfirmModal = false;
      this.showPasswordModal = true;
    },
    cancelarEliminacion() {
      this.showConfirmModal = false;
    },
    cancelarPassword() {
      this.showPasswordModal = false;
      this.passwordInput = '';
    },
    async eliminarCuentaFinal(password) {
      this.showPasswordModal = false;
      
      if (!password || password.trim() === '') {
        alert('Debes ingresar tu contraseña para continuar.');
        return;
      }

      const user = JSON.parse(localStorage.getItem('user')) || {};

      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:3000/api/users/delete', {
          method: 'DELETE',
          headers: { 
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': 'Bearer ' + token } : {})
          },
          body: JSON.stringify({ 
            email: user.email, 
            password: password 
          })
        });

        const data = await res.json();
        
        if (res.ok) {
          alert('Cuenta eliminada correctamente.\n\nSentimos verte partir. ¡Gracias por usar nuestra plataforma!');
          
          // Limpiar todo el localStorage
          localStorage.removeItem('user');
          localStorage.removeItem('token');
          localStorage.removeItem('favs');
          localStorage.removeItem('cart');
          
          // Redirigir al login
          window.location.href = '/login';
        } else {
          alert(data.message || 'Error al eliminar la cuenta. Verifica tu contraseña.');
        }
      } catch (error) {
        alert('Error de conexión con el servidor. Intenta nuevamente.');
        console.error('Error eliminando cuenta:', error);
      }
    }
  }
}
</script>

<style src="@/assets/styles/cuentaConfiguracion.css"></style>