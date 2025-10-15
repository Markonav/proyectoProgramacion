<template>
    <div class="page">
        <Header />
        <main class="catalog">
            <section class="titlebar">
                <h1>Resultados de búsqueda</h1>
                <div class="titlebar__rule"></div>
            </section>
            
            <LoadingSpinner v-if="loading">Cargando libros...</LoadingSpinner>

            <section v-else-if="filteredBooksForSearch.length === 0" class="sin_libros">
                <img src="@/assets/recursos/imgs/sin_libros.png" alt="No hay libros" />
            </section>

            <section v-else class="grid">
                <BookCard
                    v-for="book in filteredBooksForSearch"
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

    export default{
        name: "Search",
        components: { Header, Footer, BookCard, LoadingSpinner },
        data() {
            return {
                libros: [],       // lista de libros (traída del backend o mock)
                searchTerm: "",
                loading: true     // estado de carga
            };
        },
        computed: {
            filteredBooksForSearch() {
                const term = this.searchTerm.trim().toLowerCase();
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
                    const backendBase = 'http://localhost:3000';
                    const favs = JSON.parse(localStorage.getItem('favs') || '{}');
                    this.libros = data.map((b, idx) => ({
                        id: b.id ?? idx,
                        title: b.titulo ?? "Sin título",
                        author: b.autor ?? "Desconocido",
                        categoria: b.categoria ?? "Sin categoría",
                        price: b.PrecioRenta ?? 0,
                        image: b.cover ? (String(b.cover).startsWith('http') ? b.cover : `${backendBase}${b.cover}`) : null,
                        favorite: !!favs[(b.id ?? idx)]
                    }));
                } catch (err) {
                    this.libros = []; 
                } finally {
                    this.loading = false;
                }
            },
            addToCart(book) {
                console.log("Agregar al carrito:", book);
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
        },
        mounted() {
            // Leer el término de búsqueda de la URL
            this.searchTerm = this.$route.query.search || '';
            
            // Sincronizar favoritos desde backend si el usuario está logueado
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
            
            // Escuchar cambios de favoritos para actualizar UI
            window.addEventListener('favs:changed', () => {
                const favs = JSON.parse(localStorage.getItem('favs') || '{}');
                this.libros = this.libros.map(b => ({ ...b, favorite: !!favs[b.id] }));
            });
        },
        watch: {
            '$route'(to, from) {
                // Actualizar búsqueda si cambia el parámetro en la URL
                if (to.query.search !== from.query.search) {
                    this.searchTerm = to.query.search || '';
                }
            }
        }
    }
</script>

<style src="@/assets/styles/catalogo.css"></style>