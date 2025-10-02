<template>
  <div class="page">
    <Header />
    <main>
      <!-- Banner principal -->
      <section class="banner">
        <div class="banner-info">
          <h1>Novedades del Mes</h1>
          <p>Descubre los últimos lanzamientos y empieza a leer hoy mismo.</p>
          <button class="btn">Ver más</button>
        </div>
      </section>

      <!-- Carrusel En Tendencia -->
      <section class="carousel">
        <h2>En Tendencia</h2>
        <div class="carousel-track">
          <BookCard
            v-for="n in 7"
            :key="'tendencia-'+n"
            :book="{
              title: 'Libro ' + n,
              author: 'Autor',
              price: 1990,
              image: null,
              categoria: 'Tendencia'
            }"
            modo="carrusel"
          />
        </div>
      </section>

      <!-- Carrusel Más Leídos -->
      <section class="carousel">
        <h2>Más Leídos</h2>
        <div class="carousel-track">
          <BookCard
            v-for="n in 9"
            :key="'masleidos-'+n"
            :book="{
              title: 'Libro ' + n,
              author: 'Autor',
              price: 1990,
              image: null,
              categoria: 'Más Leídos'
            }"
            modo="carrusel"
          />
        </div>
      </section>

      <!-- Carrusel Novedades -->
      <section class="carousel">
        <h2>Novedades</h2>
        <div class="carousel-track">
          <BookCard
            v-for="n in 11"
            :key="'novedad-'+n"
            :book="{
              title: 'Libro ' + n,
              author: 'Autor',
              price: 1990,
              image: null,
              categoria: 'Novedad'
            }"
            modo="carrusel"
          />
        </div>
      </section>

      <!-- Carrusel por Categorías -->
      <section class="carousel">
        <h2>Categorías populares</h2>
        <div class="category-buttons">
          <button class="cat-btn" v-for="cat in categorias" :key="cat">{{cat}}</button>
        </div>
        <div class="carousel-track">
          <BookCard
            v-for="n in 8"
            :key="'cat-'+n"
            :book="{
              title: 'Libro ' + n,
              author: 'Autor',
              price: 1990,
              image: null,
              categoria: 'Categoría'
            }"
            modo="carrusel"
          />
        </div>
      </section>
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import Footer from '@/components/Footer.vue';
import BookCard from '@/components/BookCard.vue';

export default {
  name: 'Menu',
  components: { Header, Footer, BookCard },
  data() {
    return {
      categorias: [
        'Fantasía', 'Romance', 'Aventura', 'Ciencia Ficción',
        'Misterio', 'Horror', 'Accion', 'Suspenso', 'Científico'
      ]
    }
  }
}
</script>

<style src="@/assets/styles/menu.css"></style>
