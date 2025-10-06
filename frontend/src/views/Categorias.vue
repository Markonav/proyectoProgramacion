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
                loading: false
            };
        },methods: {
            async fetchBooks() {
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
                    // Si hay error, deja la lista vacía
                    this.libros = [];
                } finally {
                    this.loading = false;
                }
            },
            async fetchCategorias() {
                this.loading = true;
                try {
                    const res = await fetch('http://localhost:3000/api/categorias');
                    if (!res.ok) throw new Error('Error al cargar categorías');
                    this.categorias = await res.json();
                    // Selecciona la primera categoría automáticamente si hay categorías y no hay una seleccionada
                    if (this.categorias.length > 0 && !this.categoriaSeleccionada) {
                        this.categoriaSeleccionada = this.categorias[0];
                    }
                } catch (e) {
                    this.categorias = [];
                } finally {
                    this.loading = false;
                }
            },
            seleccionarCategoria(cat) {
                this.categoriaSeleccionada = cat;
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
            this.fetchCategorias();
            this.fetchBooks();
        }
    }
</script>

<style scoped src="@/assets/styles/categorias.css"></style>