<template>
  <div class="page">
    <Header />
      <main>
        <div class="content">
    <div class="form-box">
      <h2>INICIAR SESIÓN</h2>
      <form>
        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input v-model="email" type="text" placeholder="Correo" />
        </div>
        <div class="form-group">
          <label for="password">Contraseña</label>
          <input v-model="password" type="password" placeholder="Contraseña" />
        </div>
        <div class="btns">
          <button type="button" class="btn" @click="register">Registrar</button>
          <button type="button" class="btn" @click="login">Ingresar</button>
        </div>
      </form>
      <div class="message">{{ message }}</div>
    </div>

    <div class="image-box">
      <img src="" alt="Portada" class="imagen" />
    </div>
  </div>
      </main>
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"

export default {
  name: "Login",
  components: { Header, Footer},
  data() {
    return {
      email: "",
      password: "",
      message: "",
      ok: true
    }
  },
  methods: {
    async enviarDatos(ruta) {
      if (!this.email || !this.password) {
        this.message = "Debes completar todos los campos"
        this.ok = false
        return
      }

      try {
        const res = await fetch(ruta, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password })
        })
        const data = await res.json()

        if (res.ok) {
          this.message = data.message || "Operación exitosa"
          this.ok = true

          setTimeout(() => {
            this.$router.push("/catalogo") // Vue Router en vez de window.location
          }, 1000)
        } else {
          this.message = data.message || "Error en la operación"
          this.ok = false
        }
      } catch (error) {
        this.message = "Error de conexión con el servidor"
        this.ok = false
      }
    },
    login() {
      this.enviarDatos("http://localhost:3000/api/users/login");
    },
    register() {
      this.enviarDatos("http://localhost:3000/api/users/register");
    }
  }
}
</script>

<style src="@/assets/styles/login.css"></style>
