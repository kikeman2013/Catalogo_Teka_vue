<template>
 <v-layout wrap column >
   <v-layout>
     <img src="https://cdn.shopify.com/s/files/1/0264/0314/3759/collections/preview-Teka_1024x.png?v=1573582331" height="200" width="1200">
   </v-layout>
   <v-layout class="margin-30">
      <v-select
      label="Tipo de Producto"
      v-model="type"
      :items="types"
      ></v-select>
      <v-btn  @click="Filtrar" class="btn btn-warning" >Filtrar</v-btn>
   </v-layout>
   <v-layout v-if="current_user" class="margin-5">
     <v-btn  @click="Comprar" class="btn btn-outline-success" v-if="valid_car" >Terminar Carrito</v-btn>
   </v-layout>
  <v-layout wrap row class="margin-30">
    <v-flex xs4 v-for="producto in productos" :key="producto._id" class="margin-2">
      <v-card class="margin-5">
        <v-card-title primary-title>
        <div class="background-red">
            <div class="headline" >
              <v-card-text class="text-40">{{ producto.name }}</v-card-text>
            </div>
          </div>
        </v-card-title>
          <div class="btn btn-outline-danger" v-bind:to="`/productos/${producto._id}`" >
            <v-btn v-bind:to="`/productos/${producto._id}`" height="200" width="250">
              <img :src="producto.pic" class="img-responsive" height="200" width="250">
            </v-btn>
          </div>
        <div >
          <span class="text-25">Tipo: {{ producto.type }}</span>
          <v-card-text class="text-25">Precio: $ {{ producto.price }} </v-card-text>
        </div>
        <div class="margin-5">
          <v-btn  v-bind:to="`/productos/${producto._id}`" class="btn btn-outline-danger">Mostrar Mas</v-btn>
        </div>
        <div class="margin-5" v-if="current_user">
          <v-btn  @click="Carrito(`${producto._id}`)" class="btn btn-success"  >Añadir al Carrito</v-btn>
        </div>
        <div class="white-text"  v-if="valid_user">
          <v-btn  @click="delet(`${producto._id}`)" class="btn btn-danger">eliminar</v-btn>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
 </v-layout>
</template>
<script>
import axios from 'axios'

export default {
  name: 'productos',
  data () {
    return {
      productos: [],
      car: [],
      current_user: null,
      valid_user: false,
      valid_car: false,
      type: null,
      types: [
        'Todos',
        'Fregadero',
        'Llave',
        'Refrigerador',
        'Estufa',
        'Parilla',
        'Campana',
        'Horno',
        'Lavavajillas'
      ]
    }
  },
  mounted () {
    this.fetchproductos()
    this.fetchUser()
  },
  methods: {
    async fetchproductos () {
      const token = window.localStorage.getItem('auth')
      return axios({
        method: 'get',
        url: '/productos',
        headers: {
          Authorization: `JWT ${token}`,
          'Content-Type': 'aplication/json'
        }
      })
        .then((response) => {
          this.productos = response.data.productos
        })
        .catch(() => {
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
    async delet (id) {
      return axios({
        method: 'get',
        url: `/productos/del/${id}`
      })
        .then((response) => {
          window.location.reload()
          console.log(id)
        })
    },
    validUser () {
      if (this.current_user.type === 2) {
        this.valid_user = true
      } else {
        this.valid_user = false
      }
    },
    async Carrito (id) {
      this.car.push(id)
      this.valid_car = true
    },
    async Comprar () {
      return axios({
        method: 'post',
        data: {
          id: this.current_user._id,
          car: this.car
        },
        url: `/users/add`
      })
        .then((response) => {
          this.$swal('Muy bien!', 'Productos Añadido Al carrito', 'success')
        })
        .catch(() => {
          console.log('error')
        })
    },
    async Filtrar () {
      return axios({
        method: 'get',
        url: `/productos/filtrado/${this.type}`,
        headers: {
          'Content-Type': 'aplication/json'
        }
      })
        .then((response) => {
          if (response.data.filtrado !== null) {
            this.productos = response.data.filtrado
          } else {
            this.fetchproductos()
          }
        })
        .catch(() => {
        })
    }
  }
}
</script>
