<template>
  <!-- overlay que cierra el sidebar al hacer click fuera -->
  <transition name="fade">
    <div v-if="visible" class="cart-overlay" @click="$emit('close')"></div>
  </transition>

  <transition name="slide-cart">
    <div v-if="visible" class="cart-sidebar">
    <h3>Mi Carrito</h3>
    <div v-if="cart.length === 0" class="cart-empty">No hay libros en el carrito.</div>
    <ul v-else class="cart-list">
      <li v-for="(book, idx) in cart" :key="book.id || idx" class="cart-item">
        <div class="cart-thumb">
          <img :src="book.image ? book.image : 'http://localhost:3000/uploads/default.svg'" alt="Portada" />
        </div>
        <div class="cart-info">
          <div class="cart-title">{{ book.title }}</div>
          <div class="cart-author">{{ book.author }}</div>
        </div>
        <div class="cart-meta">
          <div class="cart-price">{{ formatPrice(book.price || book.PrecioRenta || 0) }}</div>
          <button class="remove-btn" @click="removeFromCart(idx)">Quitar</button>
        </div>
      </li>
    </ul>
    <div class="cart-actions">
      <div class="cart-summary">
        <div>{{ cart.length }} artículo(s)</div>
        <div class="cart-total">Total: {{ formatPrice(total) }}</div>
      </div>
      <button class="buy-btn" :disabled="cart.length === 0" @click="comprar">Proceder a compra</button>
    </div>
    <button class="close-btn" @click="$emit('close')">Cerrar</button>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['close'])
const router = useRouter()

const cart = ref([])

const total = computed(() => {
  return cart.value.reduce((sum, b) => {
    const p = Number(b.price ?? b.PrecioRenta ?? 0) || 0;
    return sum + p * (b.qty || 1);
  }, 0);
})

function loadCart() {
  const c = localStorage.getItem('cart')
  cart.value = c ? JSON.parse(c) : []
}
function saveCart() {
  localStorage.setItem('cart', JSON.stringify(cart.value))
}
function removeFromCart(idx) {
  cart.value.splice(idx, 1)
  saveCart()
}
function formatPrice(v){
  return `$${Number(v).toLocaleString('es-CL')}`
}
function comprar() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.email) {
    emit('close');
    router.push('/login');
    return;
  }
  window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: '¡Compra realizada! (simulado)', type: 'success', duration: 3000 } }));
  cart.value = []
  saveCart()
  emit('close')
}

onMounted(loadCart)
watch(() => props.visible, v => { if (v) loadCart() })
</script>

<style scoped>
.cart-sidebar {
  position: fixed;
  top: 0;
  right: 0;
  width: 20vw;
  min-width: 220px;
  max-width: 350px;
  height: 100vh;
  background: #fff;
  box-shadow: -2px 0 8px rgba(0,0,0,0.15);
  z-index: 1000;
  padding: 24px 16px 16px 16px;
  display: flex;
  flex-direction: column;
  /* Animación inicial */
  transform: translateX(0);
}

.slide-cart-enter-from, .slide-cart-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
.slide-cart-enter-active, .slide-cart-leave-active {
  transition: transform 0.35s cubic-bezier(.4,1.3,.5,1), opacity 0.25s;
}
.slide-cart-enter-to, .slide-cart-leave-from {
  transform: translateX(0);
  opacity: 1;
}
.cart-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.35);
  z-index: 900;
}
.fade-enter-from, .fade-leave-to { opacity: 0 }
.fade-enter-active, .fade-leave-active { transition: opacity .2s }
.fade-enter-to, .fade-leave-from { opacity: 1 }
.cart-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px 0;
  flex: 1;
  overflow-y: auto;
}
.cart-item {
  display: grid;
  grid-template-columns: 56px 1fr auto;
  gap: 12px;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}
.cart-thumb img{ width:56px; height:72px; object-fit:cover; border-radius:4px }
.cart-info { font-size: 14px }
.cart-title { font-weight:700; color:var(--c-primary); }
.cart-author { color:#777; font-size:13px }
.cart-meta { text-align:right }
.cart-price { font-weight:800; margin-bottom:6px; color: var(--c-dark, #222); }
.cart-summary { display:flex; justify-content:space-between; align-items:center; margin: 8px 0 12px 0 }
.cart-total { font-weight:900; color:var(--c-primary) }
.remove-btn {
  background: #e74c3c;
  color: #fff;
  border: none;
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
}
.buy-btn {
  width: 100%;
  background: #27ae60;
  color: #fff;
  border: none;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 8px;
  cursor: pointer;
}
.close-btn {
  background: #888;
  color: #fff;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  align-self: flex-end;
}
.cart-empty {
  color: #888;
  margin: 24px 0;
  text-align: center;
}
</style>
