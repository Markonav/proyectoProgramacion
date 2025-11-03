<template>
  <div class="page">
    <Header />

    <div class="checkout-progress card">
        <div class="steps">
        <div class="step done">
          <div class="circle">1</div>
          <div class="label">Carro de compras</div>
        </div>
        <div class="connector active"></div>
        <div class="step active">
          <div class="circle">2</div>
          <div class="label">Compra</div>
        </div>
      </div>
    </div>

    <main class="page-grid">

      <div class="order-summary card">
        <div class="order-line"><span class="muted">Artículos</span><span class="value">{{ numeroArticulos }}</span></div>
        <div class="order-line"><span class="muted">Subtotal</span><span class="value">{{ formatearPrecio(subtotal) }}</span></div>
        <div class="order-line total"><span>Total</span><span class="value total-amount">{{ formatearPrecio(total) }}</span></div>
      </div>

      <section class="payment-page card">
        <h1 class="payment-title">Selecciona un método de pago</h1>

        <div class="payment-options">
          <label class="pay-option">
            <input type="radio" value="paypal" v-model="seleccionado" />
            <img :src="portadaPredeterminada" alt="PayPal" />
            <div>
              <div class="pay-name">PayPal</div>
              <div class="pay-desc">Paga con tu cuenta de PayPal</div>
            </div>
          </label>

          <label class="pay-option">
            <input type="radio" value="card" v-model="seleccionado" />
            <div class="card-icon">💳</div>
            <div>
              <div class="pay-name">Tarjeta</div>
              <div class="pay-desc">Paga con tarjeta de crédito o débito</div>
            </div>
          </label>

          <label class="pay-option">
            <input type="radio" value="transfer" v-model="seleccionado" />
            <div class="card-icon">🏦</div>
            <div>
              <div class="pay-name">Transferencia</div>
              <div class="pay-desc">Pago por transferencia bancaria</div>
            </div>
          </label>
        </div>

        <div class="payment-actions">
          <button class="btn secondary" @click="volver">Volver</button>
          <button class="btn primary" :disabled="procesando" @click="finalizarCompra">Pagar</button>
        </div>
      </section>
    </main>

    <Footer />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { useRouter } from 'vue-router'
import '@/assets/styles/payment.css'

const router = useRouter()
const portadaPredeterminada = 'http://localhost:3000/uploads/default.svg'
const seleccionado = ref('paypal')
const procesando = ref(false)

const carrito = ref([])
function cargarCarrito(){
  const c = localStorage.getItem('cart')
  carrito.value = c ? JSON.parse(c) : []
}
onMounted(cargarCarrito)

const numeroArticulos = computed(() => (carrito.value || []).reduce((s,i) => s + (i.qty || 1), 0))
const subtotal = computed(() => (carrito.value || []).reduce((s,b) => s + (Number(b.price ?? b.PrecioRenta ?? 0) || 0) * (b.qty || 1), 0))
const total = computed(() => subtotal.value)

function formatearPrecio(v){ return `$${Number(v).toLocaleString('es-CL')}` }

function volver(){ router.push('/checkout') }

async function finalizarCompra(){
  const user = JSON.parse(localStorage.getItem('user'))
  if (!user || !user.email) { router.push('/login'); return }
  procesando.value = true
  try{
    await new Promise(r => setTimeout(r, 700))
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: `Pago realizado con ${seleccionado.value} (simulado)`, type: 'success', duration: 3000 } }))
    localStorage.setItem('cart','[]')
    router.push('/cuenta')
  }catch(e){
    window.dispatchEvent(new CustomEvent('app:toast', { detail: { message: 'Error en el pago', type: 'error', duration: 3000 } }))
  }finally{
    procesando.value = false
  }
}
</script>

