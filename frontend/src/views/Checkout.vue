<template>
  <div class="page">
    <Header />

    <div class="checkout-progress card">
      <div class="steps">
        <div :class="['step', { active: pasoActual === 1, done: pasoActual > 1 }]">
          <div class="circle">1</div>
          <div class="label">Carro de compras</div>
        </div>
        <div :class="['connector', { active: pasoActual > 1 }]" />
        <div :class="['step', { active: pasoActual === 2 }]">
          <div class="circle">2</div>
          <div class="label">Compra</div>
        </div>
      </div>
    </div>

    <main>
      <section class="checkout page-grid">
        <h1 class="checkout-title">Carro de Compras</h1>

        <div v-if="carrito.length === 0" class="empty card">
          <p>No hay artículos en el carrito.</p>
          <button class="btn" @click="volver">Volver al catálogo</button>
        </div>

        <div v-else class="grid-cols">
          <!-- Lista de productos (izquierda) -->
          <div class="products card">
            <ul class="products-list">
              <li v-for="(b, i) in carrito" :key="b.id || i" class="product-row">
                <img class="prod-thumb" :src="b.image || portadaPredeterminada" alt="cover" />
                <div class="prod-info">
                  <div class="prod-title">{{ b.title }}</div>
                  <div class="prod-author">{{ b.author }}</div>
                </div>
                <div class="prod-controls">
                  <div class="prod-price">{{ formatearPrecio(b.price || b.PrecioRenta || 0) }}</div>
                  <div class="prod-qty">Cantidad: 1</div>
                  <button class="remove-btn-red" @click="quitarDelCarrito(i)">Quitar</button>
                </div>
              </li>
            </ul>
          </div>

          <!-- Resumen (derecha) -->
          <aside class="summary card">
            <h2 class="summary-title">Resumen del pedido</h2>
            <div class="summary-body">
              <div class="line"><span>Subtotal</span><span>{{ formatearPrecio(total) }}</span></div>
              <div class="line total"><span>Total</span><span class="total-amount">{{ formatearPrecio(total) }}</span></div>
              <button class="confirm-btn" :disabled="procesando" @click="confirmarCompra">Confirmar compra</button>
            </div>
          </aside>
        </div>
      </section>

      
    </main>
      <!-- Recomendaciones debajo del carrito -->
      <section class="recommendations card">
        <h3 class="reco-title">Te recomendamos agregar</h3>
        <div class="reco-list">
          <div v-for="(r, idx) in recomendaciones" :key="r.id || idx" class="reco-card">
              <img class="reco-thumb" :src="r.image || portadaPredeterminada" alt="cover" />
            <div class="reco-info">
              <div class="reco-name">{{ r.title }}</div>
              <div class="reco-author">{{ r.author }}</div>
              <div class="reco-bottom">
                  <div class="reco-price">{{ formatearPrecio(r.price || r.PrecioRenta || 0) }}</div>
                  <button class="reco-btn" @click="agregarRecomendacionAlCarrito(r)">Agregar</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Métodos de pago (informativos) -->
      <section class="payment-methods card">
        <h3 class="payment-title">Métodos de pago</h3>
        <div class="payment-list">
          <div class="payment-option">
            <img class="payment-thumb" :src="portadaPredeterminada" alt="PayPal" />
            <div class="payment-info">
              <div class="payment-name">PayPal</div>
              <div class="payment-desc">Paga con tu cuenta de PayPal</div>
            </div>
          </div>
        </div>
      </section>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'
import '@/assets/styles/checkout.css'

const router = useRouter()
const carrito = ref([])
const procesando = ref(false)
const portadaPredeterminada = 'http://localhost:3000/uploads/default.svg'
const recomendaciones = ref([])
const pasoActual = ref(1)

function cargarCarrito() {
  const c = localStorage.getItem('cart')
  carrito.value = c ? JSON.parse(c) : []
}

async function cargarRecomendaciones() {
  try {
    const res = await fetch('http://localhost:3000/api/libros')
    if (!res.ok) throw new Error('no response')
    const data = await res.json()
    const backendBase = 'http://localhost:3000'
    const books = data.map((b, idx) => ({
      id: b.id ?? idx,
      title: b.titulo ?? 'Sin título',
      author: b.autor ?? 'Autor desconocido',
      price: b.PrecioRenta ?? 1990,
      image: b.cover ? (String(b.cover).startsWith('http') ? b.cover : `${backendBase}${b.cover}`) : null
    }))
    // escoger hasta 5 recomendaciones que no estén ya en el carrito
    const inCartIds = new Set((carrito.value || []).map(i => i.id))
    const filtered = books.filter(b => !inCartIds.has(b.id))
    recomendaciones.value = filtered.slice(0, 5)
    // si hay menos de 5, completar con los primeros
    if (recomendaciones.value.length < 5) {
      const needed = 5 - recomendaciones.value.length
      const extra = books.slice(0, needed).filter(b => !recomendaciones.value.some(r => r.id === b.id))
      recomendaciones.value = recomendaciones.value.concat(extra)
    }
  } catch (e) {
    // fallback: usar items del localStorage 'books' si existen
    const books = JSON.parse(localStorage.getItem('books') || '[]')
    recomendaciones.value = books.slice(0,5)
  }
}

function guardarCarrito() {
  localStorage.setItem('cart', JSON.stringify(carrito.value))
}

const total = computed(() => carrito.value.reduce((s,b)=> s + (Number(b.price ?? b.PrecioRenta ?? 0) || 0) * (b.qty || 1), 0))

function formatearPrecio(v){ return `$${Number(v).toLocaleString('es-CL')}` }

function volver(){ router.push('/catalogo') }


function confirmarCompra(){
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user || !user.email) { router.push('/login'); return }
  // Avanzar visualmente y navegar al paso 2 (página de pago)
  pasoActual.value = 2
  router.push('/checkout/payment')
}

onMounted(cargarCarrito)
onMounted(() => {
  cargarRecomendaciones()
})

function agregarRecomendacionAlCarrito(book) {
  const exists = carrito.value.some(i => i.id === book.id)
  if (exists) {
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'El libro ya está en el carrito', type: 'info', duration: 2200 } }))
    return
  }
  carrito.value.push({ ...book, qty: 1 })
  guardarCarrito()
  window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Libro agregado al carrito', type: 'success', duration: 2000 } }))
}

function quitarDelCarrito(index) {
  const item = carrito.value[index]
  if (!item) return
  carrito.value.splice(index, 1)
  guardarCarrito()
  window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Eliminado del carrito', type: 'success', duration: 1800 } }))
}
</script>


