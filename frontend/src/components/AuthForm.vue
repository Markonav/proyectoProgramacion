<template>
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
</template>

<script>
export default {
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
          // Si es login y hay token, guardar en localStorage y redirigir a catálogo
          if (ruta.includes('login') && data.token) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('user', JSON.stringify(data.user))
            this.message = data.message || "Inicio de sesión exitoso"
            this.ok = true
            setTimeout(() => {
              this.$router.push('/catalogo')
            }, 800)
            return
          }

          // Si es registro: no iniciar sesión automáticamente. Mostrar mensaje y mantener en la página de login
          if (ruta.includes('register')) {
            this.message = data.message || "Registro exitoso. Por favor, inicia sesión."
            this.ok = true
            // Asegurarse de no guardar token aunque el backend lo enviara
            if (data.token) {
              localStorage.removeItem('token')
              localStorage.removeItem('user')
            }
            // Redirigir explícitamente a la ruta de login (opcional, ya estamos en la vista)
            setTimeout(() => {
              this.$router.push('/login')
            }, 800)
            return
          }

          this.message = data.message || "Operación exitosa"
          this.ok = true
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

<style src="@/assets/styles/auth.css"></style>
