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

<script>
export default {
  name: "SideBarCuenta",
  methods: {
    cerrarSesion() {
      // Borrar token y datos de usuario
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Limpiar carrito al cerrar sesión
      localStorage.removeItem('cart')
      // Notificar a la app con un toast en lugar de alert
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Sesión cerrada', type: 'info', duration: 1800 } }));
      // Notificar a vistas que dependan de cart/favs
      window.dispatchEvent(new CustomEvent('favs:changed'))
      this.$router.push("/login")
    }
  }
}
</script>

<style src="@/assets/styles/sideBarPerfil.css"></style>