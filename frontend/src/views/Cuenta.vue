<template>
  <Header />
  <div class="perfil cuenta-layout">
    <div class="perfil__grid">
      <SideBarPerfil />
      <router-view />
    </div>
  </div>
  <Footer />
</template>

<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import SideBarPerfil from '@/components/SideBarPerfil.vue';
export default {
  name: 'Cuenta',
  components: { Header, Footer, SideBarPerfil }
}
</script>

<style src="@/assets/styles/cuentaConfiguracion.css"></style>
<style>
.cuenta-layout {
  min-height: calc(100vh - 120px); /* Ajusta 120px según el alto de tu header+footer */
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
}
</style>
