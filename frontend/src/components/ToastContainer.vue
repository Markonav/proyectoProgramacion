<template>
  <div class="toast-wrap" aria-live="polite">
    <transition-group name="toast" tag="div">
      <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type">
        <div class="toast-message">{{ t.message }}</div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const toasts = ref([])
let idCounter = 1
function showToast(message, type = 'info', duration = 3000) {
  const id = idCounter++
  toasts.value.push({ id, message, type })
  setTimeout(() => {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }, duration)
}

onMounted(() => {
  window.addEventListener('app:toast', (e) => {
    const detail = e.detail || {}
    showToast(detail.message || '', detail.type || 'info', detail.duration || 3000)
  })
})
</script>

<style scoped>
.toast-wrap {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 2000;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.toast-enter-from { transform: translateY(20px); opacity: 0 }
.toast-enter-to { transform: translateY(0); opacity: 1 }
.toast-enter-active { transition: all 280ms cubic-bezier(.2,.9,.2,1) }
.toast-leave-from { transform: translateY(0); opacity: 1 }
.toast-leave-active { transition: all 240ms cubic-bezier(.2,.9,.2,1) }
.toast-leave-to { transform: translateY(20px); opacity: 0 }
.toast { min-width: 220px; max-width: 340px; padding: 12px 14px; border-radius: 8px; color: white; box-shadow: 0 6px 18px rgba(0,0,0,0.12); }
.toast.info { background: #333 }
.toast.success { background: #27ae60 }
.toast.error { background: #e74c3c }
.toast-message { font-weight: 700 }
</style>
