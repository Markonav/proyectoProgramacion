import { createRouter, createWebHistory } from 'vue-router'

import Menu from '@/views/Menu.vue'
import Catalogo from '@/views/Catalogo.vue'
import Login from '@/views/Login.vue'
import Cuenta from '@/views/Cuenta.vue'
import EditarPerfil from '@/views/EditarPerfil.vue'
import Configuracion from '@/views/Configuracion.vue'
import Favoritos from '@/views/Favoritos.vue'
import AgregarLibro from '@/views/AgregarLibro.vue'
import Categorias from '@/views/Categorias.vue'
import Tendencia from '@/views/Tendencia.vue'
import MásLeídos from '@/views/MásLeídos.vue'
import LibroDetalle from '@/views/LibroDetalle.vue'
import Search from '@/views/Search.vue'
import Checkout from '@/views/Checkout.vue'
import Payment from '@/views/Payment.vue'


// Función para verificar si el usuario tiene sesión activa
function isAuthenticated() {
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  return !!(user && token);
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/menu' },
    { path: '/menu', component: Menu },
    { path: '/catalogo', name: 'Catalogo', component: Catalogo },
    { path: '/tendencias', component: Tendencia },
    { path: '/categorias', component: Categorias },
    { path: '/libro/:id', name: 'LibroDetalle', component: LibroDetalle },
    { path: '/search', name: 'Search', component: Search },
    { path: '/login', component: Login },
    { path: '/checkout', component: Checkout },
    { path: '/checkout/payment', component: Payment },
    { 
      path: '/agregarLibro', 
      component: AgregarLibro,
      meta: { requiresAuth: true }
    },
    { path: '/másLeídos', component: MásLeídos },
    {
      path: '/cuenta',
      component: Cuenta,
      meta: { requiresAuth: true },
      children: [
        { path: '', redirect: 'editar' },
        { path: 'editar', component: EditarPerfil },
        { path: 'configuracion', component: Configuracion },
        { path: 'favoritos', component: Favoritos }
      ]
    }
  ]
})

// Navigation guard global - verifica autenticación antes de cada ruta
router.beforeEach((to, from, next) => {
  // Si la ruta requiere autenticación
  if (to.meta.requiresAuth) {
    if (isAuthenticated()) {
      next(); // Usuario autenticado, permitir acceso
    } else {
      // Usuario no autenticado, redirigir al login
      next('/login');
    }
  } else {
    next(); // Ruta no requiere autenticación, permitir acceso
  }
});

export default router
