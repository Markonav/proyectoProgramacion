<template>
  <div class="page">
    <Header />
    <main class="detalle-libro">
      <LoadingSpinner v-if="loading">Cargando libro...</LoadingSpinner>
      <div v-else-if="!libro" class="sin_libro">
        <p>No se encontró el libro.</p>
      </div>
      <div v-else class="detalle-content">
        <div class="detalle-img">
          <img :src="libro.image || '/default-cover.png'" alt="Portada" />
        </div>
        <div class="detalle-info">
          <h1>{{ libro.title }}</h1>
          <h3>{{ libro.author }}</h3>
          <p class="detalle-categoria">Categoría: {{ libro.categoria }}</p>
          <p class="detalle-precio">Precio: ${{ Number(libro.price).toLocaleString('es-CL') }}</p>
          <p class="detalle-sinopsis"><strong>Sinopsis:</strong> {{ libro.sinopsis || 'Sin sinopsis disponible.' }}</p>
          <button class="btn" @click="addToCart(libro)">Agregar al carrito</button>
        </div>
      </div>
      <!-- Aquí podrías agregar un componente de reseñas -->
    </main>
    <Footer />
  </div>
</template>

<script>
    import Header from '@/components/Header.vue';
    import Footer from '@/components/Footer.vue';
    import LoadingSpinner from '@/components/LoadingSpinner.vue';

    export default {
    name: 'LibroDetalle',
    components: { Header, Footer, LoadingSpinner },
    data() {
        return {
        libro: null,
        loading: false
        };
    },
    methods: {
        async fetchLibro() {
        this.loading = true;
        try {
            const id = this.$route.params.id;
            const res = await fetch(`http://localhost:3000/api/libros/${id}`);
            if (!res.ok) throw new Error("No hay respuesta");
            const data = await res.json();
            const backendBase = 'http://localhost:3000';
            this.libro = {
            id: data.id,
            title: data.titulo,
            author: data.autor,
            categoria: data.categoria,
            price: data.PrecioRenta,
            image: data.cover ? (String(data.cover).startsWith('http') ? data.cover : `http://localhost:3000${data.cover}`) : null,
            sinopsis: data.sinopsis 
            };
        } catch (e) {
            this.libro = null;
        } finally {
            this.loading = false;
        }
        },
        addToCart(libro) {
        // lógica de agregar al carrito
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        cart.push({ ...libro, qty: 1 });
        localStorage.setItem('cart', JSON.stringify(cart));
        alert('Libro agregado al carrito');
        }
    },
    mounted() {
        this.fetchLibro();
    }
    };
</script>

<style scoped>
    .detalle-libro {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 32px 0;
    }
    .detalle-content {
    display: flex;
    gap: 40px;
    align-items: flex-start;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.08);
    padding: 32px;
    max-width: 900px;
    width: 100%;
    }
    .detalle-img img {
    width: 220px;
    height: 320px;
    object-fit: cover;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    .detalle-info {
    flex: 1;
    }
    .detalle-info h1 {
    margin-bottom: 8px;
    }
    .detalle-categoria, .detalle-precio {
    color: #888;
    margin-bottom: 8px;
    }
    .detalle-sinopsis {
    margin: 18px 0 24px 0;
    }
    .btn {
    background: var(--c-primary, #A8D8EA);
    color: #fff;
    border: none;
    border-radius: 6px;
    padding: 10px 24px;
    font-size: 1rem;
    cursor: pointer;
    font-weight: bold;
    transition: background 0.2s;
    }
    .btn:hover {
    background: var(--c-dark, #0D2933);
    }
</style>