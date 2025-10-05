<template>
  <article :class="['libro-card', { 'libro-card--carrusel': modo === 'carrusel' } ]">
    <div :class="['libro-img', { 'libro-img--carrusel': modo === 'carrusel' } ]">
      <img
        :src="book.image || '/default-cover.png'"
        alt="Portada"
        :style="modo === 'carrusel' ? 'width:100%;height:200px;object-fit:cover;' : 'width:100%;height:100%;object-fit:cover;'"
      />
    </div>

    <div :class="['libro-info', { 'libro-info--carrusel': modo === 'carrusel' } ]">
      <div class="libro-titulo">{{ book.title }}</div>   
      <div class="libro-categoria">{{ book.categoria }}</div>
      <div class="libro-autor">{{ book.author }}</div>
      <div class="libro-precio">{{ formattedPrice }}</div>

      <div class="libro-acciones">
        <button class="btn-small" @click="$emit('add-to-cart', book)">Agregar</button>
        <button
          class="icon-btn"
          :class="{ active: favorito || book.favorite }"
          @click="$emit('toggle-favorite', book)"
          :aria-pressed="favorito || book.favorite"
          :title="favorito ? 'Quitar de favoritos' : (book.favorite ? 'Quitar de favoritos' : 'Agregar a favoritos')"
        >
          ♥
        </button>
      </div>
    </div>
  </article>
</template>

<script>
export default {
  name: "BookCard",
  props: {
    book: { type: Object, required: true },
    favorito: { type: Boolean, default: false },
    modo: { type: String, default: '' } // 'carrusel' para modo carrusel
  },
  computed: {
    formattedPrice() {
      return `$${Number(this.book.price).toLocaleString('es-CL')}`
    }
  }
}
</script>

<style src="@/assets/styles/bookCard.css"></style>
<style scoped>
.libro-card--carrusel {
  min-width: 160px !important;
  max-width: 180px;
  box-shadow: 0 4px 10px rgba(0,0,0,.1);
  border-radius: 8px;
  scroll-snap-align: start;
  flex-shrink: 0;
  padding: 0 0 8px 0;
  margin: 0;
}
.libro-img--carrusel {
  height: 200px !important;
  background: var(--c-secondary);
  border-radius: 8px 8px 0 0;
}
.libro-info--carrusel {
  padding: 8px 8px 0 8px !important;
  text-align: center;
}
.libro-card--carrusel .libro-titulo {
  font-size: 1rem;
  font-weight: bold;
  margin-bottom: 4px;
}
.libro-card--carrusel .libro-categoria,
.libro-card--carrusel .libro-autor,
.libro-card--carrusel .libro-precio {
  font-size: 0.95rem;
  color: #888;
  margin-bottom: 2px;
}
</style>
