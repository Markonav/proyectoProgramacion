<template>
  <aside class="perfil__sidebar card">
    <nav class="perfil__nav">
      <RouterLink to="/cuenta/editar" active-class="active">Editar Perfil</RouterLink>
      <RouterLink to="/cuenta/configuracion" active-class="active">Configuración</RouterLink>
      <RouterLink to="/cuenta/favoritos" active-class="active">Favoritos</RouterLink>
    </nav>

    <div class="sidebar-action">
      <RouterLink to="/agregarLibro" class="btn">Administrar Libros</RouterLink>
    </div>
    <div class="sidebar-action">
      <button class="btn" @click="cerrarSesion">Cerrar Sesión</button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from "vue-router"

const router = useRouter()

function cerrarSesion() {
  // Borrar token y datos de usuario
  localStorage.removeItem('token')
  localStorage.removeItem('user')
  alert("Sesión cerrada 🚪")
  router.push("/login")
}
</script>

<style src="@/assets/styles/sideBarPerfil.css"></style>