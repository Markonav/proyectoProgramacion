<template>
  <header class="top-bar">
    <div class="logo">
      <RouterLink to="/menu">  <img src="@/assets/recursos/logos/logo.png" alt="Logo" /> </RouterLink>
    </div>
    <nav class="menu">
      <RouterLink to="/tendencias">En Tendencia</RouterLink>
      <RouterLink to="/másLeídos">Más Leídos</RouterLink>
      <RouterLink to="/catalogo">Todos los Libros</RouterLink>
      <RouterLink to="/categorias">Categorías</RouterLink>
    </nav>
    <div class="user-tools">
      <div class="search-container">
        <input type="text" v-model="busqueda" class="search-input" /> 
        <button @click.prevent="buscar" class="search-btn"> 
          <img src="@/assets/recursos/imgs/lupa.png" alt="Buscar"/>
        </button>
      </div>
      <button @click.prevent="abrirCarrito" class="cart-link">
        <img src="@/assets/recursos/imgs/carrito_icon.webp" alt="Carrito" class="icon" />
        <span>Carrito</span>
      </button>
      <button @click.prevent="irAEditarPerfil" class="user-link">
        <img src="@/assets/recursos/imgs/user_icon.webp" alt="Usuario" class="icon" />
        <span>{{ nombreUsuario }}</span>
      </button>
    </div>
    <!-- No mostrar el sidebar en páginas de autenticación -->
    <CartSidebar v-if="!isAuthRoute" :visible="showCart" @close="showCart = false" />
  </header>
</template>

<script>
import CartSidebar from './CartSidebar.vue';

export default {
  name: "Header",
  components: { CartSidebar },
  data() {
    return {
      showCart: false,
      authPaths: ['/login'],
      busqueda: ''
    };
  },
  computed: {
    isAuthRoute() {
      return this.authPaths.includes(this.$route?.path || '');
    },
    nombreUsuario() {
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
      return nombreUsuario;
    }
  },
  methods: {
    buscar() {
      if (this.busqueda.trim() !== '') {
        this.$router.push({
          name: 'Search',
          query: { search: this.busqueda.trim() }
        });
      }
    },
    abrirCarrito() {
      if (this.isAuthRoute) return; // no abrir en la página de login
      this.showCart = true;
    },
    irAEditarPerfil() {
      const user = JSON.parse(localStorage.getItem('user'));
      if (!user || !user.email) {
        this.$router.push('/login');
      } else {
        this.$router.push('/cuenta/editar');
      }
    }
  }
}
</script>
