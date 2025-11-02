<template>
    <div class="page">
        <Header />
        <main class="categorias">
            <section class="titlebar">
                <h1>Categorías</h1>
                <div class="titlebar__rule"></div>
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
                <div class="titlebar__rule"></div>
            </section>
            
            <LoadingSpinner v-if="loading">Cargando libros...</LoadingSpinner>

            <section v-else-if="filteredBooksForCategory.length === 0" class="sin_libros_categorias">
                <img src="@/assets/recursos/imgs/sin_libros.png" alt="No hay libros" />
            </section>

            <section v-else class="grid">
                <BookCard
                    v-for="book in filteredBooksForCategory"
                    :key="book.id"
                    :book="book"
                    @add-to-cart="addToCart"
                    @toggle-favorite="toggleFavorite"
                    @view-details="goToBookDetail"
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
        name: "Categorias",
        components: { Header, Footer, BookCard, LoadingSpinner },
        data() {
            return {
                categorias: [],
                libros: [],     
                categoriaSeleccionada: null,
                loading: true
            };
        },
        methods: {
            async fetchBooks() {
                this.loading = true;
                try {
                    const res = await fetch("http://localhost:3000/api/libros"); 
                    if (!res.ok) throw new Error("No hay respuesta");
                    const data = await res.json();
                    // Aseguramos estructura mínima
                    const backendBase = 'http://localhost:3000';
                    const favs = JSON.parse(localStorage.getItem('favs') || '{}');
                    this.libros = data.map((b, idx) => ({
                        id: b.id ?? idx,
                        title: b.titulo ?? "Sin título",
                        author: b.autor ?? "Autor desconocido",
                        categoria: b.categoria ?? "Sin categoría",  
                        price: b.PrecioRenta ?? 0,
                        image: b.cover ? (String(b.cover).startsWith('http') ? b.cover : `${backendBase}${b.cover}`) : null,
                        favorite: !!favs[(b.id ?? idx)]
                    }));
                } catch (err) {
                    // Si hay error, deja la lista vacía
                    this.libros = [];
                } finally {
                    this.loading = false;
                }
            },
            async fetchCategorias() {
                try {
                    const res = await fetch('http://localhost:3000/api/categorias');
                    if (!res.ok) throw new Error('Error al cargar categorías');
                    const json = await res.json();

                    let raw = [];
                    if (Array.isArray(json)) raw = json;
                    else if (Array.isArray(json.categorias)) raw = json.categorias;
                    else if (Array.isArray(json.data)) raw = json.data;
                    else raw = [];

                    // Si los items vienen como objetos, extraemos una representación 'nombre'
                    if (raw.length > 0 && typeof raw[0] === 'object') {
                        this.categorias = raw.map(c => c.nombre ?? c.name ?? c.slug ?? String(c));
                    } else {
                        // Será array de strings o vacío
                        this.categorias = raw.map(String);
                    }

                    // Selecciona la primera categoría automáticamente si hay categorías y no hay una seleccionada
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
                this.$router.push({ name: 'Login' });
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
            }
        }, computed: {
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

<style scoped src="@/assets/styles/categorias.css"></style>