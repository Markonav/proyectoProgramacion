
<template>
  <section :class="['perfil__content', { 'perfil--empty': favoritos.length === 0 }]">
    <div v-if="favoritos.length === 0" class="favoritos-empty">
      <div class="empty-heart">♥</div>
      <div class="empty-msg">¡Aún no tienes favoritos!<br><span>Cuando agregues libros aquí, aparecerán tus lecturas preferidas.</span></div>
    </div>
    <div v-else class="perfil__panel card">
      <h2 class="panel__title">Favoritos</h2>
      <div class="grid">
        <BookCard
          v-for="book in favoritos"
          :key="book.id"
          :book="book"
          :favorito="true"
          @toggle-favorite="quitarDeFavoritos"
        />
      </div>
    </div>
  </section>
</template>

<script>
import BookCard from '@/components/BookCard.vue';

export default {
  name: 'Favoritos',
  components: { BookCard },
  data() {
    return {
      favoritos: []
    }
  },
  methods: {
    cargarFavoritos() {
      // Puedes adaptar esto si tus favoritos vienen del backend
      const favs = JSON.parse(localStorage.getItem('favs') || '{}');
      // Aquí deberías tener una lista de libros completa, pero para demo, solo ids y mock
      // Si tienes todos los libros en localStorage o backend, filtra por favs true
      const books = JSON.parse(localStorage.getItem('books') || '[]');
      this.favoritos = books.filter(b => favs[b.id]);
    },
    quitarDeFavoritos(book) {
      // Quitar de favoritos
      const favs = JSON.parse(localStorage.getItem('favs') || '{}');
      favs[book.id] = false;
      localStorage.setItem('favs', JSON.stringify(favs));
      this.cargarFavoritos();
    }
  },
  mounted() {
    this.cargarFavoritos();
  }
}
</script>

<style scoped>
/* Favoritos grid */
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-top: 24px;
}
/* Estado vacío de favoritos */
.favoritos-empty {
  padding: 60px 0 0 0;
  text-align: center;
  color: #888;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 18px;
}
.empty-heart {
  font-size: 64px;
  color: #e53935;
  opacity: 0.18;
  margin-bottom: 8px;
  user-select: none;
}
.empty-msg {
  font-size: 1.2rem;
  font-weight: 600;
  color: #b16a6a;
}
.empty-msg span {
  display: block;
  font-size: 1rem;
  font-weight: 400;
  color: #888;
  margin-top: 6px;
}
</style>

