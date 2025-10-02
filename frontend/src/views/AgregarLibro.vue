<template>
  <div class="page">
    <Header />
    <main class="libros-section">
      <h2>Lista de Libros</h2>
      <div v-if="loading" class="state">Cargando libros…</div>
      <div v-else-if="error" class="state error">No se pudo cargar la lista. Intenta nuevamente.</div>
      <div v-else-if="libros.length === 0" class="state empty">No hay libros aún. Presiona “Agregar Libro”.</div>
      <div v-else class="tabla-container">
        <table style="width:100%;">
          <thead>
            <tr>
              <th>ID</th>
              <th>Título</th>
              <th>Autor</th>
              <th>Categoría</th>
              <th>Precio Renta</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="libro in libros" :key="libro.id">
              <td>{{ libro.id }}</td>
              <td>{{ libro.titulo }}</td>
              <td>{{ libro.autor }}</td>
              <td>{{ libro.categoria }}</td>
              <td>{{ libro.PrecioRenta }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Botón para mostrar el formulario -->
      <div class="btns" style="margin-top:20px; text-align:center;">
        <button class="btn" @click="mostrarForm = !mostrarForm">{{ mostrarForm ? 'Cerrar' : 'Agregar Libro' }}</button>
      </div>

      <!-- Formulario para agregar libro -->
      <div v-if="mostrarForm" class="form-box" style="width:100%; max-width:520px; margin:20px auto 0 auto;">
        <h2>Agregar un Libro</h2>
        <form @submit.prevent="agregarLibro">
          <div class="form-group">
            <label for="titulo">Título</label>
            <input v-model="nuevoLibro.titulo" type="text" id="titulo" placeholder="Título" required />
          </div>
          <div class="form-group">
            <label for="autor">Autor</label>
            <input v-model="nuevoLibro.autor" type="text" id="autor" placeholder="Autor" required />
          </div>    
          <div class="form-group">
            <label for="categoria">Categoría</label>
            <select v-model="nuevoLibro.categoria" id="categoria" required>
              <option value="" disabled>Selecciona una categoría</option>
              <option v-for="cat in categorias" :key="cat" :value="cat">{{ cat }}</option>
            </select>
          </div>
          <div class="form-group">
            <label for="precio">Precio Renta</label>
            <input v-model.number="nuevoLibro.PrecioRenta" type="number" id="precio" placeholder="Precio Renta" required />
          </div>
          <div class="btns">
            <button type="submit" class="btn">Guardar Libro</button>
          </div>
        </form>
        <div v-if="mensaje" :class="['message', mensajeTipo]">{{ mensaje }}</div>
      </div>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';

export default {
  name: 'AgregarLibro',
  components: { Header, Footer },
  data() {
    return {
      libros: [],
      loading: true,
      error: false,
      mostrarForm: false,
      categorias: [],
      nuevoLibro: {
        titulo: '',
        autor: '',
        categoria: '',
        PrecioRenta: ''
      },
      mensaje: '',
      mensajeTipo: ''
    }
  },
  methods: {
    async fetchLibros() {
      this.loading = true;
      this.error = false;
      try {
        const res = await fetch('http://localhost:3000/api/libros');
        if (!res.ok) throw new Error('Error al cargar libros');
        this.libros = await res.json();
      } catch (e) {
        this.error = true;
      } finally {
        this.loading = false;
      }
    },
    async fetchCategorias() {
      try {
        const res = await fetch('http://localhost:3000/api/categorias');
        if (!res.ok) throw new Error('Error al cargar categorías');
        this.categorias = await res.json();
      } catch (e) {
        this.categorias = [];
      }
    },
    async agregarLibro() {
      this.mensaje = '';
      this.mensajeTipo = '';
      try {
        const res = await fetch('http://localhost:3000/api/libros', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.nuevoLibro)
        });
        if (!res.ok) throw new Error('No se pudo agregar el libro');
        this.mensaje = 'Libro agregado correctamente';
        this.mensajeTipo = 'success';
        this.nuevoLibro = { titulo: '', autor: '', categoria: '', PrecioRenta: '' };
        this.fetchLibros();
      } catch (e) {
        this.mensaje = 'Error al agregar libro';
        this.mensajeTipo = 'error';
      }
    }
  },
  mounted() {
    this.fetchLibros();
    this.fetchCategorias();
  }
}
</script>

<style src="@/assets/styles/agregarLibro.css"></style>
