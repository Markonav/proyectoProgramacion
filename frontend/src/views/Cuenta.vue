<template>
  <Header />
  <div class="page">
    <div class="perfil cuenta-layout">
      <div class="perfil__grid">
        <SideBarPerfil />
        <router-view />
      </div>
    </div>
  </div>
  <Footer />
</template>

<script>
import Footer from '@/components/Footer.vue';
import Header from '@/components/Header.vue';
import SideBarPerfil from '@/components/SideBarCuenta.vue';
export default {
  name: 'Cuenta',
  components: { Header, Footer, SideBarPerfil }
}
</script>

<style src="@/assets/styles/cuentaConfiguracion.css"></style>

