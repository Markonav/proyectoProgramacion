<template>
  <div class="page">
    <Header />
    <main>
      <!-- Banner principal -->
      <section class="banner">
        <div class="banner-overlay"></div>
        <div class="banner-info">
          <h1>Novedades del Mes</h1>
          <p>Descubre los últimos lanzamientos y empieza a leer hoy mismo.</p>
          <button class="btn" @click="verCatalogo">Ver más</button>
        </div>
      </section>

      <LoadingSpinner v-if="loading">Cargando libros...</LoadingSpinner>
      <template v-else>
        <!-- Carrusel En Tendencia -->
        <section class="carousel">
          <h2>En Tendencia</h2>
          <div v-if="librosTendencia.length === 0" class="sin_libros_menu">
            <img src="@/assets/recursos/imgs/sin_libros_2.png" alt="No hay libros" /> 
          </div>
          <div v-else class="carousel-track">
            <BookCard
              v-for="book in librosTendencia"
              :key="book.id"
              :book="book"
              @add-to-cart="addToCart"
              @toggle-favorite="toggleFavorite"
              @view-details="goToBookDetail"
              modo="carrusel"
            />
          </div>
        </section>

        <!-- Carrusel Más Leídos -->
        <section class="carousel">
          <h2>Más Leídos</h2>
          <div v-if="librosMasLeidos.length === 0" class="sin_libros_menu">
            <img src="@/assets/recursos/imgs/sin_libros_2.png" alt="No hay libros" /> 
          </div>
          <div v-else class="carousel-track">
            <BookCard
              v-for="book in librosMasLeidos"
              :key="book.id"
              :book="book"
              @add-to-cart="addToCart"
              @toggle-favorite="toggleFavorite"
              @view-details="goToBookDetail"
              modo="carrusel"
            />
          </div>
        </section>

        <!-- Carrusel Novedades -->
        <section class="carousel">
          <h2>Novedades</h2>
          <div v-if="librosNovedad.length === 0" class="sin_libros_menu">
            <img src="@/assets/recursos/imgs/sin_libros_2.png" alt="No hay libros" /> 
          </div>
          <div v-else class="carousel-track">
            <BookCard
              v-for="book in librosNovedad"
              :key="book.id"
              :book="book"
              @add-to-cart="addToCart"
              @toggle-favorite="toggleFavorite"
              @view-details="goToBookDetail"
              modo="carrusel"
            />
          </div>
        </section>

        <!-- Carrusel por Categorías -->
        <section class="carousel">
          <h2>Categorías populares</h2>
          <div class="category-buttons">
            <button 
              class="cat-btn" 
              v-for="cat in categorias" 
              :key="cat"
              :class="{ 'active': categoriaSeleccionada === cat }"
              @click="seleccionarCategoria(cat)"
            >
              {{ cat }}
            </button>
          </div>

          <div v-if="filteredBooksForCategory.length === 0" class="sin_libros_menu">
            <img src="@/assets/recursos/imgs/sin_libros_2.png" alt="No hay libros" /> 
          </div>

          <div v-else class="carousel-track">
            <BookCard
              v-for="book in filteredBooksForCategory"
              :key="book.id"
              :book="book"
              @add-to-cart="addToCart"
              @toggle-favorite="toggleFavorite"
              @view-details="goToBookDetail"
              modo="carrusel"
            />
          </div>
        </section>
      </template>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import BookCard from '@/components/BookCard.vue';
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: 'Menu',
  components: { Header, Footer, BookCard, LoadingSpinner },
  data() {
    return {
      libros: [],
      categorias: [],
      categoriaSeleccionada: null,
      loading: true
    }
  },
  methods: {
    async fetchBooks() {
      this.loading = true;
      try {
        const res = await fetch("http://localhost:3000/api/libros"); 
        if (!res.ok) throw new Error("No hay respuesta");
        const data = await res.json();
        const backendBase = 'http://localhost:3000';
        const favs = JSON.parse(localStorage.getItem('favs') || '{}');
        this.libros = data.map((b, idx) => ({
          id: b.id ?? idx,
          title: b.titulo ?? "Sin título",
          author: b.autor ?? "Autor desconocido",
          categoria: b.categoria ?? "Sin categoría",
          price: b.PrecioRenta ?? 0,
          image: b.cover ? (String(b.cover).startsWith('http') ? b.cover : `${backendBase}${b.cover}`) : null,
          favorite: !!favs[(b.id ?? idx)],
          tendencia: !!b.tendencia,
          masLeido: !!b.masLeido,
          novedad: !!b.novedad
        }));
      } catch (err) {
        this.libros = [];
      } finally {
        this.loading = false;
      }
    },
    async fetchCategorias() {
      try {
        const res = await fetch('http://localhost:3000/api/categorias');
        if (!res.ok) throw new Error('Error al cargar categorías');
        this.categorias = await res.json();
        if (this.categorias.length > 0 && !this.categoriaSeleccionada) {
            this.categoriaSeleccionada = this.categorias[0];
        }
      } catch (e) {
        this.categorias = [];
      }
    },
    seleccionarCategoria(cat) {
      this.categoriaSeleccionada = cat;
    },
    addToCart(book) {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      const exists = cart.some(item => item.id === book.id);
      if (exists) {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'El libro ya está en el carrito', type: 'info', duration: 2200 } }));
        return;
      }
      cart.push({ ...book, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Libro agregado al carrito', type: 'success', duration: 2500 } }));
    },
    async toggleFavorite(book) {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user || !user.email) {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Inicia sesión para usar favoritos', type: 'info', duration: 2800 } }));
        this.$router.push('/login');
        return;
      }
      book.favorite = !book.favorite;
      const favs = JSON.parse(localStorage.getItem("favs") || "{}");
      favs[book.id] = book.favorite;
      localStorage.setItem("favs", JSON.stringify(favs));
      window.dispatchEvent(new CustomEvent('favs:changed', { detail: { id: book.id, favorite: book.favorite } }));
      const msg = book.favorite ? 'Agregado a favoritos' : 'Eliminado de favoritos';
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: msg, type: 'success', duration: 2000 } }));
      if (user && user.email) {
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
        } catch (err) {
          window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'No se pudo sincronizar favoritos con el servidor', type: 'error', duration: 3000 } }));
        }
      }
    },
    goToBookDetail(book) {
      this.$router.push({ name: 'LibroDetalle', params: { id: book.id } });
    },
    verCatalogo() {
      this.$router.push({ name: 'Catalogo' });
    }
  },
  computed: {
    librosTendencia() {
      return this.libros.filter(b => b.tendencia);
    },
    librosMasLeidos() {
      return this.libros.filter(b => b.masLeido);
    },
    librosNovedad() {
      return this.libros.filter(b => b.novedad);
    },
    filteredBooksForCategory() {
      if (!this.categoriaSeleccionada) return this.libros;
      return this.libros.filter(b => b.categoria === this.categoriaSeleccionada);
    }
  },
  mounted() {
    // Sincronizar favoritos desde backend si hay usuario logueado
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
        // ignore - keep local favs
      }
    };
    loadServerFavs().then(() => this.fetchBooks());
    // escuchar cambios de favoritos para recargar UI si vienen de otra vista
    window.addEventListener('favs:changed', () => {
      const favs = JSON.parse(localStorage.getItem('favs') || '{}');
      this.libros = this.libros.map(b => ({ ...b, favorite: !!favs[b.id] }));
    });
    this.fetchCategorias();
  }
}
</script>

<style scoped src="@/assets/styles/menu.css"></style>
