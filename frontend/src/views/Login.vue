<template>
  <div class="page">
    <Header />
    <AuthForm />
    <Footer />
  </div>
</template>

<script>
import Header from "@/components/Header.vue"
import Footer from "@/components/Footer.vue"
import AuthForm from "@/components/AuthForm.vue"

export default {
  name: "Login",
  components: { Header, Footer, AuthForm }
}
</script>
