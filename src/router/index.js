import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Contact from '@/components/Contact'
import Addproduct from '@/components/Addproduct'
import product from '@/components/product'
import Register from '@/components/Register'
import Login from '@/components/Login'
import AdmUser from '@/components/AdmUser'
import Car from '@/components/Car'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/contact',
      name: 'Contact',
      component: Contact
    },
    {
      path: '/productos/add',
      name: 'Addproduct',
      component: Addproduct
    },
    {
      path: '/productos/add/:id',
      name: 'Addproduct',
      component: Addproduct
    },
    {
      path: '/productos/:id',
      name: 'product',
      component: product
    },
    {
      path: '/users/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/users/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/users/adm',
      name: 'AdmUser',
      component: AdmUser
    },
    {
      path: '/Car',
      name: 'Car',
      component: Car
    }
  ]
})
