<template>
  <div class="page">
    <Header @search="onSearch" />

    <main class="catalog">
      <section class="titlebar">
        <h1>Todos los Libros</h1>
        <div class="titlebar__rule"></div>
      </section>

      <LoadingSpinner v-if="loading">Cargando libros...</LoadingSpinner>

      <section v-else-if="libros.length === 0" class="sin_libros">
        <img src="@/assets/recursos/imgs/sin_libros.png" alt="No hay libros" />
      </section>

      <section v-else class="grid">
        <BookCard
          v-for="book in filteredBooks"
          :key="book.id"
          :book="book"
          @add-to-cart="addToCart"
          @toggle-favorite="toggleFavorite"
        />
      </section>
    </main>

    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue";
import Footer from "@/components/Footer.vue";
import BookCard from "@/components/BookCard.vue";
import LoadingSpinner from '@/components/LoadingSpinner.vue';

export default {
  name: "Catalogo",
  components: { Header, Footer, BookCard, LoadingSpinner },
  data() {
    return {
      libros: [],       // lista de libros (traída del backend o mock)
      searchTerm: "",
      loading: false     // estado de carga
    };
  },
  computed: {
    filteredBooks() {
      const term = this.searchTerm.trim().toLowerCase();
      if (!term) return this.libros;
      return this.libros.filter(b =>
        (b.title || "").toLowerCase().includes(term) ||
        (b.author || "").toLowerCase().includes(term) ||
        (b.id || "").toString() === term 
      );
    }
  },
  methods: {
    async fetchBooks() {
      // Intenta pedir al backend; si falla, usa datos de ejemplo
      this.loading = true;
      try {
        const res = await fetch("http://localhost:3000/api/libros"); 
        if (!res.ok) throw new Error("No hay respuesta");
        const data = await res.json();
        // Aseguramos estructura mínima
        this.libros = data.map((b, idx) => ({
          id: b.id ?? idx,
          title: b.titulo ?? "Sin título",
          author: b.autor ?? "Autor desconocido",
          categoria: b.categoria ?? "Sin categoría",
          price: b.PrecioRenta ?? 1990,
          image: b.image ?? null,
          favorite: !!b.favorite
        }));
      } catch (err) {
        this.libros = []; // Si hay error, deja la lista vacía
      } finally {
        this.loading = false;
      }
    },
    toggleFavorite(book) {
      book.favorite = !book.favorite;
      // opcional: persistir en localStorage o llamar a backend
      const favs = JSON.parse(localStorage.getItem("favs") || "{}");
      favs[book.id] = book.favorite;
      localStorage.setItem("favs", JSON.stringify(favs));
    },
    onSearch(term) {
      this.searchTerm = term;
    }
  },
  mounted() {
    this.fetchBooks();
    // cargar favoritos guardados en localStorage (si aplica)
    const favs = JSON.parse(localStorage.getItem("favs") || "{}");
    // si ya llegaron libros desde backend, aplicar en fetchBooks; si no, cuando se carguen, puedes reconciliar
    // aquí dejamos simple: cuando fetchBooks asigna books, favorite ya fue seteado según data o default false
  }
};
</script>

<style src="@/assets/styles/catalogo.css"></style>
