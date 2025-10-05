<template>
  <div class="page">
    <Header @search="onSearch" />

    <main class="catalog">
      <section class="titlebar">
        <h1>Todos los Libros</h1>
        <div class="titlebar__rule"></div>
      </section>

      <section class="grid">
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

export default {
  name: "Catalogo",
  components: { Header, Footer, BookCard },
  data() {
    return {
      books: [],       // lista de libros (traída del backend o mock)
      searchTerm: ""   // lo que venga del Header
    };
  },
  computed: {
    filteredBooks() {
      const term = this.searchTerm.trim().toLowerCase();
      if (!term) return this.books;
      return this.books.filter(b =>
        (b.title || "").toLowerCase().includes(term) ||
        (b.author || "").toLowerCase().includes(term)
      );
    }
  },
  methods: {
    async fetchBooks() {
      // Intenta pedir al backend; si falla, usa datos de ejemplo
      try {
        const res = await fetch("http://localhost:3000/api/libros"); 
        if (!res.ok) throw new Error("No hay respuesta");
        const data = await res.json();
        // Aseguramos estructura mínima
        const backendBase = 'http://localhost:3000';
        // una vez traídos los libros, aplicar favoritos guardados en localStorage (o los traídos desde servidor)
        const favs = JSON.parse(localStorage.getItem('favs') || '{}');
        this.books = data.map((b, idx) => ({
          id: b.id ?? idx,
          title: b.titulo ?? "Sin título",
          author: b.autor ?? "Autor desconocido",
          price: b.PrecioRenta ?? 1990,
          // el backend guarda la ruta en `cover` (ej: /uploads/xxx.png)
          // convertimos rutas relativas como '/uploads/xxx' a URL absoluta apuntando al backend
          image: b.cover ? (String(b.cover).startsWith('http') ? b.cover : `${backendBase}${b.cover}`) : null,
          favorite: !!favs[(b.id ?? idx)]
        }));
      } catch (err) {
        // fallback: mock con varios ítems
        this.books = Array.from({ length: 12 }).map((_, i) => ({
          id: i + 1,
          title: `Nombre del Libro ${i + 1}`,
          author: "Autor",
          price: 1990,
          image: null,
          favorite: false
        }));
      }
    },
    addToCart(book) {
      // aquí puedes integrar tu lógica de carrito (localStorage, state, o llamar al backend)
      console.log("Agregar al carrito:", book);
      // Ejemplo simple: guardar en localStorage
      const cart = JSON.parse(localStorage.getItem("cart") || "[]");
      // si ya existe un item con el mismo id, no agregar
      const exists = cart.some(item => item.id === book.id);
      if (exists) {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'El libro ya está en el carrito', type: 'info', duration: 2200 } }));
        return;
      }
      cart.push({ ...book, qty: 1 });
      localStorage.setItem("cart", JSON.stringify(cart));
      // Mostrar notificación visual en esquina inferior derecha
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Libro agregado al carrito', type: 'success', duration: 2500 } }));
    },
    async toggleFavorite(book) {
      // Solo usuarios logueados pueden marcar favoritos
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      if (!user || !user.email) {
        window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Inicia sesión para usar favoritos', type: 'info', duration: 2800 } }));
        this.$router.push('/login');
        return;
      }
      book.favorite = !book.favorite;
      // Persistir en localStorage (client-side)
      const favs = JSON.parse(localStorage.getItem("favs") || "{}");
      favs[book.id] = book.favorite;
      localStorage.setItem("favs", JSON.stringify(favs));
      // Notificar a otras vistas que los favoritos cambiaron
      window.dispatchEvent(new CustomEvent('favs:changed', { detail: { id: book.id, favorite: book.favorite } }));
      const msg = book.favorite ? 'Agregado a favoritos' : 'Eliminado de favoritos';
      window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: msg, type: 'success', duration: 2000 } }));

      // Si el usuario está logueado, persistir en backend
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
          // opcional: podríamos verificar res.ok y mostrar error si no se pudo persistir
        } catch (err) {
          window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'No se pudo sincronizar favoritos con el servidor', type: 'error', duration: 3000 } }));
        }
      }
    },
    onSearch(term) {
      this.searchTerm = term;
    }
  },
  mounted() {
    // Si hay un usuario logueado, primero sincronizamos favoritos desde el backend
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
      // actualizar flags en memoria
      const favs = JSON.parse(localStorage.getItem('favs') || '{}');
      this.books = this.books.map(b => ({ ...b, favorite: !!favs[b.id] }));
    });
  }
};
</script>

<style src="@/assets/styles/catalogo.css" scoped></style>
