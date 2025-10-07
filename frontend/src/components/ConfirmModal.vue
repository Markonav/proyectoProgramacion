<template>
  <transition name="fade">
    <div v-if="visible" class="cm-overlay" @click.self="onCancel">
      <div class="cm-dialog" role="dialog" aria-modal="true" :aria-label="title">
        <header class="cm-header">
          <h3 class="cm-title">{{ title }}</h3>
        </header>
        <section class="cm-body">
          <p v-html="message"></p>
          <div v-if="showInput" class="cm-input-group">
            <input 
              v-model="inputValue"
              :type="inputType" 
              :placeholder="inputPlaceholder"
              class="cm-input"
              @keyup.enter="onConfirm"
              ref="inputRef"
            />
          </div>
        </section>
        <footer class="cm-actions">
          <button class="cm-btn cm-cancel" @click="onCancel">Cancelar</button>
          <button class="cm-btn cm-confirm" @click="onConfirm">Eliminar</button>
        </footer>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    visible: { type: Boolean, default: false },
    title: { type: String, default: 'Confirmar' },
    message: { type: String, default: '¿Estás seguro?' },
    showInput: { type: Boolean, default: false },
    inputType: { type: String, default: 'text' },
    inputPlaceholder: { type: String, default: '' }
  },
  emits: ['confirm', 'cancel'],
  data() {
    return {
      inputValue: ''
    }
  },
  watch: {
    visible(newVal) {
      if (newVal && this.showInput) {
        this.$nextTick(() => {
          this.$refs.inputRef?.focus();
        });
      }
      if (!newVal) {
        this.inputValue = '';
      }
    }
  },
  methods: {
    onConfirm() { 
      if (this.showInput) {
        this.$emit('confirm', this.inputValue);
      } else {
        this.$emit('confirm');
      }
    },
    onCancel() { 
      this.inputValue = '';
      this.$emit('cancel');
    }
  }
}
</script>

<style scoped>
.cm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
  padding: 16px;
}
.cm-dialog {
  width: 100%;
  max-width: 460px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.25);
  overflow: hidden;
}
.cm-header { padding: 16px 20px; border-bottom: 1px solid #f0f0f0 }
.cm-title { margin: 0; font-size: 1.05rem; color: #222 }
.cm-body { padding: 18px 20px; color: #444; font-size: 0.98rem }
.cm-actions { display:flex; gap:10px; justify-content:flex-end; padding: 12px 20px; border-top: 1px solid #f0f0f0 }
.cm-input-group { margin-top: 16px }
.cm-input { 
  width: 100%; 
  padding: 10px 12px; 
  border: 1px solid #ddd; 
  border-radius: 6px; 
  font-size: 14px;
  transition: border-color 0.2s;
}
.cm-input:focus { 
  outline: none; 
  border-color: var(--c-primary, #007bff);
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
}
.cm-btn { min-width: 96px; padding: 8px 12px; border-radius:6px; border:none; cursor:pointer; font-weight:600 }
.cm-cancel { background: #f0f0f0; color: #333 }
.cm-confirm { background: #e53935; color: #fff }
.fade-enter-active, .fade-leave-active { transition: opacity .18s }
.fade-enter-from, .fade-leave-to { opacity: 0 }
.fade-enter-to, .fade-leave-from { opacity: 1 }
</style>
