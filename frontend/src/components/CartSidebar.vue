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
        <div>
          <strong>{{ book.title }}</strong><br />
          <span>{{ book.author }}</span>
        </div>
        <button class="remove-btn" @click="removeFromCart(idx)">Quitar</button>
      </li>
    </ul>
    <div class="cart-actions">
      <button class="buy-btn" :disabled="cart.length === 0" @click="comprar">Proceder a compra</button>
    </div>
    <button class="close-btn" @click="$emit('close')">Cerrar</button>
    </div>
  </transition>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  visible: Boolean
})
const emit = defineEmits(['close'])
const router = useRouter()

const cart = ref([])

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
function comprar() {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.email) {
    emit('close');
    router.push('/login');
    return;
  }
  alert('¡Compra realizada! (simulado)')
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  border-bottom: 1px solid #eee;
  padding-bottom: 8px;
}
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
