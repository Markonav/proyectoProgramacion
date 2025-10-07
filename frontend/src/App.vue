<script setup>
import ToastContainer from '@/components/ToastContainer.vue'
</script>

<template>
  <router-view />
  <ToastContainer />
</template>

<script>
export default { name: 'App' }
</script>

<style scoped></style>
