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
    <CartSidebar :visible="showCart" @close="showCart = false" />
  </header>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import CartSidebar from './CartSidebar.vue';

export default {
  name: "Header",
  components: { CartSidebar },
  setup() {
    const router = useRouter();
    const showCart = ref(false);
    function abrirCarrito() {
      showCart.value = true;
    }
    function irAEditarPerfil() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) {
        router.push('/login');
      } else {
        router.push('/cuenta/editar');
      }
    }
    // Obtener usuario de localStorage: preferir `nombre` si existe, sino usar prefijo del email
    let nombreUsuario = 'Mi Cuenta';
    try {
      const user = JSON.parse(localStorage.getItem('user')) || {};
      const nombre = (user.nombre || '').toString().trim();
      if (nombre) {
        nombreUsuario = nombre;
      } else if (user.email) {
        nombreUsuario = user.email.split('@')[0];
      }
    } catch {}
    return { irAEditarPerfil, nombreUsuario, showCart, abrirCarrito };
  }
}
</script>
