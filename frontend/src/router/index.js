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


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/menu' },
    { path: '/menu', component: Menu },
    { path: '/catalogo', component: Catalogo },
    { path: '/categorias', component: Categorias },
    { path: '/login', component: Login },
    { path: '/agregarLibro', component: AgregarLibro },
    {
      path: '/cuenta',
      component: Cuenta,
      children: [
        { path: '', redirect: 'editar' },
        { path: 'editar', component: EditarPerfil },
        { path: 'configuracion', component: Configuracion },
        { path: 'favoritos', component: Favoritos }
      ]
    }
  ]
})

export default router
