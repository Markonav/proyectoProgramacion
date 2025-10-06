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
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="libro in libros" :key="libro.id">
              <td>{{ libro.id }}</td>
              <td>{{ libro.titulo }}</td>
              <td>{{ libro.autor }}</td>
              <td>{{ libro.categoria }}</td>
              <td>{{ libro.PrecioRenta }}</td>
              <td>
                <button class="btn-small" @click="editar(libro)">Editar</button>
              </td>
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
    <h2>{{ modoEdicion ? 'Editar Libro' : 'Agregar un Libro' }}</h2>
  <form @submit.prevent="agregarLibro" enctype="multipart/form-data">
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
          <div class="form-group">
            <label for="sinopsis">Sinopsis (opcional)</label>
            <textarea v-model="nuevoLibro.sinopsis" id="sinopsis" placeholder="Sinopsis">
            </textarea>
          </div>
          <div class="form-group">
            <label for="cover">Portada (opcional)</label>
            <input ref="coverInput" @change="onFileChange" type="file" id="cover" accept="image/*" />
          </div>
          <div class="btns">
            <button type="submit" class="btn">{{ modoEdicion ? 'Actualizar' : 'Guardar Libro' }}</button>
            <button type="button" class="btn" v-if="modoEdicion" @click="cancelarEdicion">Cancelar</button>
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
        sinopsis: '',
        PrecioRenta: ''
      },
      coverFile: null,
      modoEdicion: false,
      editingId: null,
      mensaje: '',
      mensajeTipo: ''
    }
  },
  methods: {
    onFileChange(e) {
      const file = e.target.files && e.target.files[0];
      this.coverFile = file || null;
    },
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
        let res;
        // Si estamos en modo edición, usar PUT a /api/libros/:id
        if (this.modoEdicion && this.editingId) {
          if (this.coverFile) {
            const form = new FormData();
            form.append('cover', this.coverFile);
            // añadir campos que vinieron en el formulario
            form.append('titulo', this.nuevoLibro.titulo);
            form.append('autor', this.nuevoLibro.autor);
            form.append('categoria', this.nuevoLibro.categoria);
            form.append('sinopsis', this.nuevoLibro.sinopsis);
            form.append('PrecioRenta', this.nuevoLibro.PrecioRenta);

            res = await fetch(`http://localhost:3000/api/libros/${this.editingId}`, {
              method: 'PUT',
              body: form
            });
          } else {
            res = await fetch(`http://localhost:3000/api/libros/${this.editingId}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(this.nuevoLibro)
            });
          }
          if (!res.ok) throw new Error('No se pudo actualizar el libro');
          this.mensaje = 'Libro actualizado correctamente';
          this.mensajeTipo = 'success';
          // reset modo edición
          this.modoEdicion = false;
          this.editingId = null;
        } else {
          // crear nuevo libro
          if (this.coverFile) {
            const form = new FormData();
            form.append('cover', this.coverFile);
            form.append('titulo', this.nuevoLibro.titulo);
            form.append('autor', this.nuevoLibro.autor);
            form.append('categoria', this.nuevoLibro.categoria);
            form.append('sinopsis', this.nuevoLibro.sinopsis);
            form.append('PrecioRenta', this.nuevoLibro.PrecioRenta);

            res = await fetch('http://localhost:3000/api/libros', {
              method: 'POST',
              body: form
            });
          } else {
            res = await fetch('http://localhost:3000/api/libros', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(this.nuevoLibro)
            });
          }
          if (!res.ok) throw new Error('No se pudo agregar el libro');
          this.mensaje = 'Libro agregado correctamente';
          this.mensajeTipo = 'success';
        }

        this.nuevoLibro = { titulo: '', autor: '', categoria: '', sinopsis: '', PrecioRenta: '' };
        this.coverFile = null;
        // limpiar input file
        if (this.$refs.coverInput) this.$refs.coverInput.value = null;
        this.fetchLibros();
      } catch (e) {
        this.mensaje = 'Error al agregar libro';
        this.mensajeTipo = 'error';
      }
    }

    ,
    editar(libro) {
      // abrir form y rellenar
      this.mostrarForm = true;
      this.modoEdicion = true;
      this.editingId = libro.id;
      this.nuevoLibro = {
        titulo: libro.titulo || '',
        autor: libro.autor || '',
        categoria: libro.categoria || '',
        sinopsis: libro.sinopsis || '',
        PrecioRenta: libro.PrecioRenta || ''
      };
      this.coverFile = null; // dejar que el usuario suba uno nuevo si desea
      if (this.$refs.coverInput) this.$refs.coverInput.value = null;
    },

    cancelarEdicion() {
      this.mostrarForm = false;
      this.modoEdicion = false;
      this.editingId = null;
      this.nuevoLibro = { titulo: '', autor: '', categoria: '', sinopsis: '', PrecioRenta: '' };
      this.coverFile = null;
      if (this.$refs.coverInput) this.$refs.coverInput.value = null;
    }
  },
  mounted() {
    this.fetchLibros();
    this.fetchCategorias();
  }
}
</script>

<style src="@/assets/styles/agregarLibro.css"></style>
