<template> 
    <div class="page">
        <Header />
            <main class="catalog">
                <section class="titlebar">
                    <h1>Más Leídos</h1>
                    <div class="titlebar__rule"></div>
                </section>

                <LoadingSpinner v-if="loading">Cargando libros...</LoadingSpinner>
                <section v-else-if="libros.length === 0" class="sin_libros">
                    <img src="@/assets/recursos/imgs/sin_libros.png" alt="No hay libros" />
                </section>

                <section v-else class="grid">
                    <BookCard
                        v-for="book in libros"
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
        name: "MásLeídos",
        components: { Header, Footer, BookCard },
        data() {
            return {
                libros: [],       // lista de libros (traída del backend o mock)
                loading: false     // estado de carga
            };
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
                    this.libros = data.map((b, idx) => ({
                        id: b.id ?? idx,
                        title: b.titulo ?? "Sin título",
                        author: b.autor ?? "Autor desconocido",
                        categoria: b.categoria ?? "Sin categoría",
                        price: b.PrecioRenta ?? 0,
                        image: b.cover ? (String(b.cover).startsWith('http') ? b.cover : `${backendBase}${b.cover}`) : null,
                        favorite: !!b.favorite
                        }));
                } catch (err) {
                    this.libros = []; // Si hay error, deja la lista vacía
                } finally {
                    this.loading = false;
                }
            },
            goToBookDetail(book) {
                this.$router.push({ name: 'LibroDetalle', params: { id: book.id } });
            }
        },
        mounted() {
            this.fetchBooks();
        }
    };
</script>

<style src="@/assets/styles/catalogo.css"></style>