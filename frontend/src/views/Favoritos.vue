
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
    async cargarFavoritos() {
      // Traer todos los libros del backend y filtrar por favorites guardados en localStorage
      try {
        const res = await fetch('http://localhost:3000/api/libros');
        if (!res.ok) throw new Error('No response');
        const data = await res.json();
        const backendBase = 'http://localhost:3000';
        const books = data.map((b, idx) => ({
          id: b.id ?? idx,
          title: b.titulo ?? 'Sin título',
          author: b.autor ?? 'Autor desconocido',
          price: b.PrecioRenta ?? 1990,
          image: b.cover ? (String(b.cover).startsWith('http') ? b.cover : `${backendBase}${b.cover}`) : null,
          categoria: b.categoria || ''
        }));
        const favs = JSON.parse(localStorage.getItem('favs') || '{}');
        this.favoritos = books.filter(b => favs[b.id]);
      } catch (e) {
        // fallback: intentar cargar desde localStorage
        const favs = JSON.parse(localStorage.getItem('favs') || '{}');
        const books = JSON.parse(localStorage.getItem('books') || '[]');
        this.favoritos = books.filter(b => favs[b.id]);
      }
    },
    async quitarDeFavoritos(book) {
      // Solo usuarios logueados pueden quitar favoritos
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user || !user.email) {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Inicia sesión para gestionar favoritos', type: 'info', duration: 2800 } }));
        this.$router.push('/login');
        return;
      }
      // Quitar de favoritos
      const favs = JSON.parse(localStorage.getItem('favs') || '{}');
      favs[book.id] = false;
      localStorage.setItem('favs', JSON.stringify(favs));
      // Persistir en backend
      try {
        const token = user.token || null;
        await fetch('http://localhost:3000/api/users/favs', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          },
          body: JSON.stringify({ email: user.email, favs })
        });
      } catch (e) {
        // ignorar, ya actualizamos localmente
      }
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Eliminado de favoritos', type: 'success', duration: 2000 } }));
      this.cargarFavoritos();
    }
  },
  mounted() {
    // Si hay un usuario logueado, intentar sincronizar favs desde servidor
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    const loadServerFavs = async () => {
      if (!user || !user.email) return;
      try {
        const token = user.token || null;
        const res = await fetch(`http://localhost:3000/api/users/favs?email=${encodeURIComponent(user.email)}`, {
          headers: {
            ...(token ? { 'Authorization': `Bearer ${token}` } : {})
          }
        });
        if (!res.ok) return;
        const json = await res.json();
        const serverFavs = json.favs || {};
        localStorage.setItem('favs', JSON.stringify(serverFavs));
      } catch (e) {
        // ignore
      }
    };

    loadServerFavs().then(() => this.cargarFavoritos());
    // Escuchar cambios de favoritos desde otras vistas
    window.addEventListener('favs:changed', this.cargarFavoritos);
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

