<template>
  <v-app id="inpire">
    <v-navigation-drawer fixed v-model="drawer" app color="red">
      <v-list dense>
        <v-list-item v-if="current_user">
          <v-list-item-action>
          <v-icon x-large>face</v-icon>
          </v-list-item-action>
          <v-list-item-content>{{ current_user.name }}</v-list-item-content>
        </v-list-item>
        <router-link v-bind:to="{name: 'Home'}" class="side_bar_link">
          <v-list-item>
            <v-list-item-action>
            <v-icon x-large>home</v-icon>
            </v-list-item-action>
            <v-list-item-content>Inicio</v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link v-bind:to="{name: 'Contact'}" class="side_bar_link">
          <v-list-item>
            <v-list-item-action>
              <v-icon x-large>contact_mail</v-icon>
            </v-list-item-action>
            <v-list-item-content>Mi Contacto</v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link v-if="valid_user" v-bind:to="{name: 'AdmUser'}" class="side_bar_link">
          <v-list-item>
            <v-list-item-action>
            <v-icon x-large>adb</v-icon>
            </v-list-item-action>
            <v-list-item-content> Adm. Usuarios</v-list-item-content>
        </router-link>
        <router-link v-if="valid_user" v-bind:to="{name: 'Addproduct'}" class="side_bar_link">
          <v-list-item>
            <v-list-item-action>
            <v-icon x-large>queue</v-icon>
            </v-list-item-action>
            <v-list-item-content>Nuevo Producto</v-list-item-content>
          </v-list-item>
        </router-link>
        <router-link v-if="current_user" v-bind:to="{name: 'Car'}" class="side_bar_link">
          <v-list-item>
            <v-list-item-action>
            <v-icon x-large>shopping_cart</v-icon>
            </v-list-item-action>
            <v-list-item-content>Carrito</v-list-item-content>
          </v-list-item>
        </router-link>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color = "red" dark fixed app>
    <v-app-bar-nav-icon @click.stop="drawer = !drawer">
      <v-icon x-large>list</v-icon>
    </v-app-bar-nav-icon>
    <v-toolbar-title>TEKA</v-toolbar-title>
    <h5 v-if="valid_user" >---Administrador</h5>
    <v-spacer></v-spacer>
    <v-toolbar-items class="hidden-sm-and-down">
      <v-btn id="home-btn"   @click="goHome" class="btn btn-dark">Inicio</v-btn>
      <v-btn id="contac-btn" @click="goContac" class="btn btn-dark">Mi Contacto</v-btn>
      <v-btn v-bind:to="{ name: 'Register' }" v-if="!current_user" id ="register_btn" >Registrarse</v-btn>
      <v-btn v-bind:to="{ name: 'Login' }" v-if="!current_user" id="login-btn">Iniciar Sesion</v-btn>
      <v-btn id="car-btn" v-bind:to="{ name: 'Car' }" v-if="current_user" >Carrito</v-btn>
      <v-btn id="logout-btn" v-if="current_user" @click="logout" class="btn btn-dark">Cerrar Sesion</v-btn>
    </v-toolbar-items>
    </v-app-bar>
    <v-main>
    <v-container fluid>
      <div id="app">
        <router-view/>
      </div>
    </v-container>
    </v-main>
    <v-footer color="black" app>
     <span class="white-text">&copy; 2020 - 2021 </span>
    </v-footer>
  </v-app>
</template>

<script>
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import './assets/stylesheets/main.css'
import bus from './bus'
import axios from 'axios'

export default {
  data: () => ({
    drawer: false,
    current_user: null,
    valid_user: false
  }),
  props: {
    source: String
  },
  mounted () {
    this.fetchUser()
    this.listenToEvents()
  },
  methods: {
    listenToEvents () {
      bus.$on('refreshUser', () => {
        this.fetchUser()
      })
    },
    async fetchUser () {
      return axios({
        method: 'get',
        url: '/api/current_user'
      })
        .then((response) => {
          this.current_user = response.data.current_user
          if (this.current_user !== null) {
            this.validUser()
          }
        })
        .catch(() => {
        })
    },
    logout () {
      return axios({
        method: 'get',
        url: '/api/logout'
      })
        .then(() => {
          bus.$emit('refreshUser')
          this.$router.push({ name: 'Home' })
          window.location.reload()
        })
        .catch(() => {
        })
    },
    validUser () {
      if (this.current_user.type === 2) {
        this.valid_user = true
      } else {
        this.valid_user = false
      }
    },
    goHome () {
      this.$router.push({ name: 'Home' })
    },
    goContac () {
      this.$router.push({ name: 'Contact' })
    }

  }
}
</script>
