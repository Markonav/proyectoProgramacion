<template>
  <header class="top-bar">
    <div class="logo">
    <RouterLink to="/menu">  <img src="" alt="Logo" /> </RouterLink>
    </div>
    <nav class="menu">
      <RouterLink to="/tendencias">En Tendencia</RouterLink>
      <RouterLink to="/másLeídos">Más Leídos</RouterLink>
      <RouterLink to="/catalogo">Todos los Libros</RouterLink>
      <RouterLink to="/categorias">Categorías</RouterLink>
    </nav>
    <div class="user-tools">
      <input type="text" placeholder="Buscar" />
      <a href="#">Carrito</a>
      <a href="#" @click.prevent="irAEditarPerfil">Mi Cuenta</a>
    </div>
  </header>
</template>

<script>
import { useRouter } from 'vue-router';

export default {
  name: "Header",
  setup() {
    const router = useRouter();
    function irAEditarPerfil() {
      router.push('/cuenta/editar');
    }
    return { irAEditarPerfil };
  }
}
</script>
