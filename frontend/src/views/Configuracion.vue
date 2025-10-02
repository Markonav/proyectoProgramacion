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
                <button type="button" class="btn btn-danger" @click="eliminarCuenta">Eliminar Cuenta</button>
            </div>
        </div>
    </div>
</section>
</template>

<script setup>
import { ref } from 'vue'

const privacidad = ref({
    publico: true,
    mostrarLeidos: true,
    mostrarFavoritos: true
})

const notificaciones = ref({
    email: true,
    novedadesAutores: true,
    ofertas: false
})

const seguridad = ref({
    actual: '',
    nueva: '',
    confirmar: ''
})

function cambiarPassword() {
    // Aquí iría la lógica para cambiar la contraseña
    alert('Contraseña cambiada (demo)');
}

function eliminarCuenta() {
    // Aquí iría la lógica para eliminar la cuenta
    alert('Cuenta eliminada (demo)');
}
</script>

<style src="@/assets/styles/cuentaConfiguracion.css"></style>