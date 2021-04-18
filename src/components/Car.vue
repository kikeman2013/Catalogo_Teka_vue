<template>
  <v-layout wrap column v-if="current_user" >
    <v-layout>
     <img src="https://cdn.shopify.com/s/files/1/0264/0314/3759/collections/preview-Teka_1024x.png?v=1573582331" height="200" width="1200">
   </v-layout>
    <v-layout wrap row>
      <v-flex xs4 v-for="producto in productos" :key="producto._id" class="margin-2">
        <v-card class="margin-5">
          <v-card-title primary-title>
          <div class="btn btn-dark">
              <div class="headline" >
                <h6>{{ producto.name }}</h6>
              </div>
          </div>
          </v-card-title>
          <span>{{ producto.type }}</span>
          <v-card-text >Codigo: {{ producto.code }}</v-card-text>
          <v-card-text >Precio: $ {{ producto.price }} </v-card-text>
          <img :src="producto.pic" class="img-responsive" height="200" width="250">
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout class="margin-30">
      <h1>Total a pagar = $ {{this.total}}</h1>
      <div class="margin-10">
        <v-btn  @click="comprar" class="btn btn-success"  >Comprar</v-btn>
      </div>
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
      aux: [],
      car: [],
      current_user: null,
      total: 0
    }
  },
  mounted () {
    this.fetchUser()
  },
  methods: {
    fetchproductos () {
      return axios({
        method: 'get',
        url: '/productos',
        headers: {
          'Content-Type': 'aplication/json'
        }
      })
        .then((response) => {
          this.aux = response.data.productos
          this.fetchcar()
        })
        .catch(() => {
        })
    },
    fetchcar () {
      var usercar = this.current_user.car
      for (var i = 0; i < usercar.length; i++) {
        for (var j = 0; j < this.aux.length; j++) {
          if (usercar[i] === this.aux[j]._id) {
            this.productos.push(this.aux[j])
            this.total += parseInt(this.aux[j].price.replace(',', ''))
          }
        }
      }
    },
    async fetchUser () {
      return axios({
        method: 'get',
        url: '/api/current_user'
      })
        .then((response) => {
          this.current_user = response.data.current_user
          if (this.current_user !== null || this.current_user !== undefined) {
            this.fetchproductos()
          } else {
            this.$router.push({name: 'Home'})
          }
        })
        .catch(() => {

        })
    },
    async comprar () {
      return axios({
        method: 'post',
        data: {
          id: this.current_user._id
        },
        url: `/users/comprar`
      })
        .then((response) => {
          console.log(response)
          this.$swal('Muy bien!', 'Haz Comprado todos los productos Se enviaran a tu casa en 3 Dias', 'success')
          this.$router.push({name: 'Home'})
        })
    }
  }
}
</script>
