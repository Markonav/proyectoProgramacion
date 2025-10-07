<template>
  <div class="loading-section">
    <div class="loader">
      <slot>Cargando...</slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoadingSpinner"
};
</script>

<style>
.loading-section {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 200px;
}
.loader {
  font-size: 1.2rem;
  color: var(--c-primary, #A8D8EA);
  font-weight: bold;
}
</style>
