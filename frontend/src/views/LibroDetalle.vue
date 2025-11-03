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
      <!-- Sección de opiniones -->
      <section class="reviews" v-if="libro">
        <div class="write-review">
          <h2>Deja tu opinión</h2>
          <div class="rating-input">
            <label>Tu calificación:</label>
            <div class="stars">
              <span v-for="n in 5" :key="n" class="star" :class="{selected: newReview.rating >= n}" @click="setRating(n)">★</span>
            </div>
          </div>
          <textarea v-model="newReview.comment" placeholder="Escribe tu opinión sobre el libro..." rows="6"></textarea>
          <div class="review-actions">
            <button class="btn" @click="submitReview" :disabled="submitting">Enviar opinión</button>
            <small class="muted">Tu opinión ayudará a otros lectores.</small>
          </div>
        </div>

        <aside class="ratings-summary">
          <h3>Resumen de calificaciones</h3>
          <div class="avg">
            <div class="avg-number">{{ averageRating.toFixed(1) }}</div>
            <div class="avg-stars">{{ averageRatingDisplay }}</div>
            <div class="avg-count">{{ reviews.length }} reseña(s)</div>
          </div>

          <div class="bars">
            <div v-for="star in [5,4,3,2,1]" :key="star" class="bar-row">
              <div class="bar-label">{{ star }}★</div>
              <div class="bar-track">
                <div class="bar-fill" :style="{ width: starPercentage(star) + '%' }"></div>
              </div>
              <div class="bar-count">{{ countFor(star) }}</div>
            </div>
          </div>
        </aside>
      </section>
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
  loading: true,
  reviews: [],
  // start with no stars selected
  newReview: { rating: 0, comment: '' },
  submitting: false
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
        // reviews handling
        loadReviews() {
          const id = this.$route.params.id;
          try {
            const raw = localStorage.getItem(`reviews_${id}`) || '[]';
            this.reviews = JSON.parse(raw);
          } catch (e) {
            this.reviews = [];
          }
        },
        saveReviews() {
          const id = this.$route.params.id;
          localStorage.setItem(`reviews_${id}`, JSON.stringify(this.reviews));
        },
        setRating(n) { this.newReview.rating = n },
        countFor(star) {
          return this.reviews.filter(r => Number(r.rating) === star).length;
        },
        starPercentage(star) {
          if (!this.reviews.length) return 0;
          return Math.round((this.countFor(star) / this.reviews.length) * 100);
        },
        async submitReview() {
          const user = JSON.parse(localStorage.getItem('user') || 'null');
          if (!user || !user.email) { this.$router.push('/login'); return }
          if (!this.newReview.comment.trim()) {
            window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Escribe un comentario antes de enviar', type: 'info', duration: 2000 } }));
            return;
          }
          this.submitting = true;
          try {
            const id = this.$route.params.id;
            const entry = {
              user: user.name || user.email || 'Anónimo',
              email: user.email || '',
              rating: this.newReview.rating,
              comment: this.newReview.comment.trim(),
              date: new Date().toISOString()
            };
            this.reviews.unshift(entry);
            this.saveReviews();
            this.newReview.comment = '';
            // reset to no stars selected
            this.newReview.rating = 0;
            window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Gracias por tu opinión', type: 'success', duration: 2200 } }));
          } catch (e) {
            window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'No se pudo guardar la opinión', type: 'error', duration: 2200 } }));
          } finally {
            this.submitting = false;
          }
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
    }
    },
    mounted() {
        this.fetchLibro();
        this.loadReviews();
    },
    computed: {
      averageRating() {
        if (!this.reviews.length) return 0;
        return this.reviews.reduce((s,r) => s + Number(r.rating || 0), 0) / this.reviews.length;
      },
      averageRatingDisplay() {
        const n = Math.round(this.averageRating);
        return '★'.repeat(n) + '☆'.repeat(5-n);
      }
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

.reviews {
  max-width: 900px;
  width: 100%;
  margin-top: 24px;
  display: grid;
  grid-template-columns: 60% 40%;
  gap: 18px;
}
.write-review {
  background: #fff;
  padding: 18px;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.06);
}
.write-review h2 { margin-top: 0 }
.rating-input { display:flex; align-items:center; gap:12px; margin: 8px 0 12px 0 }
.stars { font-size: 24px; color: #ddd; cursor: pointer }
.stars .star.selected { color: #ffb400 }

.stars .star {
  display: inline-block;
  transition: transform 180ms cubic-bezier(.2,.8,.2,1), color 180ms ease, text-shadow 180ms ease, filter 180ms ease;
  will-change: transform, color, text-shadow;
}
.stars .star:hover {
  transform: translateY(-4px) scale(1.25);
  color: #ffd066;
  text-shadow: 0 6px 18px rgba(255,180,50,0.28);
  filter: drop-shadow(0 6px 14px rgba(255,160,20,0.16));
}
.stars .star:active {
  transform: translateY(-2px) scale(1.15);
}
.stars .star.selected:hover {
  transform: translateY(-5px) scale(1.28);
  color: #ffb400;
}
.write-review textarea { width:100%; resize:vertical; padding:10px; border-radius:6px; border:1px solid #e8e8e8 }
.review-actions { display:flex; align-items:center; gap:12px; margin-top:10px }
.muted { color:#777 }

.ratings-summary { background:#fff; padding:18px; border-radius:10px; box-shadow: 0 4px 12px rgba(0,0,0,0.04) }
.ratings-summary .avg { text-align:center; margin-bottom:12px }
.avg-number { font-size:36px; font-weight:800 }
.avg-stars { color:#ffb400; font-size:20px }
.avg-count { color:#666 }
.bars { display:flex; flex-direction:column; gap:8px }
.bar-row { display:flex; align-items:center; gap:8px }
.bar-label { width:32px; text-align:right; color:#444 }
.bar-track { flex:1; height:10px; background:#eee; border-radius:6px; overflow:hidden }
.bar-fill { height:100%; background:linear-gradient(90deg,#ffb400,#ff7a18); border-radius:6px }
.bar-count { width:36px; text-align:left; color:#444 }

@media (max-width: 880px) {
  .reviews { grid-template-columns: 1fr; }
}
</style>