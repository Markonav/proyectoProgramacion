<template>
  <header class="top-bar">
    <div class="logo">
      <RouterLink to="/menu">  <img src="" alt="Logo" /> </RouterLink>
    </div>
    <nav class="menu">
      <a href="#">En Tendencia</a>
      <a href="#">Más Leídos</a>
      <RouterLink to="/catalogo">Todos los Libros</RouterLink>
      <a href="#">Categorías</a>
    </nav>
    <div class="user-tools">
      <input type="text" placeholder="Buscar" />
      <a href="#" @click.prevent="abrirCarrito">Carrito</a>
      <a href="#" @click.prevent="irAEditarPerfil">{{ nombreUsuario }}</a>
    </div>
    <!-- No mostrar el sidebar en páginas de autenticación -->
    <CartSidebar v-if="!isAuthRoute" :visible="showCart" @close="showCart = false" />
  </header>
</template>

<script>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import CartSidebar from './CartSidebar.vue';

export default {
  name: "Header",
  components: { CartSidebar },
  setup() {
    const router = useRouter();
    const showCart = ref(false);
  // solo bloquear en la ruta de login
  const authPaths = ['/login'];
    function abrirCarrito() {
      if (isAuthRoute.value) return; // no abrir en la página de login
      showCart.value = true;
    }
    // computed para que la plantilla reaccione si cambia la ruta
    const isAuthRoute = computed(() => authPaths.includes(router.currentRoute.value?.path || ''));
    function irAEditarPerfil() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) {
        router.push('/login');
      } else {
        router.push('/cuenta/editar');
      }
    }
    // Obtener usuario de localStorage: preferir `nickname`, luego `nombre`, luego prefijo del email
    let nombreUsuario = 'Mi Cuenta';
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const nick = (user.nickname || '').toString().trim();
      const nombre = (user.nombre || '').toString().trim();
      if (nick) {
        nombreUsuario = nick;
      } else if (nombre) {
        nombreUsuario = nombre;
      } else if (user.email) {
        nombreUsuario = user.email.split('@')[0];
      }
    } catch {}
    return { irAEditarPerfil, nombreUsuario, showCart, abrirCarrito, isAuthRoute };
  }
}
</script>
