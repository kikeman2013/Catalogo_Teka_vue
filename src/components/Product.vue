<template>
  <v-layout wrap column>
    <v-layout>
     <img src="https://cdn.shopify.com/s/files/1/0264/0314/3759/collections/preview-Teka_1024x.png?v=1573582331" height="200" width="1200">
   </v-layout>
    <v-flex xs4 class="margin-30">
      <div class="btn btn-outline-dark">
        <img :src="producto.pic" class="img-responsive" height="500" width="650">
      </div>
      <v-card wrap row>
        <v-card-title primary-title>
          <div class="text-50">
            {{ producto.name}}
          </div>
        </v-card-title>
        <div class="text-40">
          <span class="grey-text">Tipo: {{ producto.type}}</span>
          <v-card-text class="text-40"> Codigo: {{ producto.code }} </v-card-text>
          <v-card-text class="text-40">Precio: $ {{ producto.price }} </v-card-text>
          <v-card-text class="text-40"> Descripcion:</v-card-text>
          <div>
            <v-card-text class="text-20"> {{ producto.description }} </v-card-text>
          </div>
        </div>
        <h6 class="card-title" ><v-btn @click="rate" class="btn btn-warning" v-if="current_user" >Reseñar este Producto</v-btn></h6>
        <v-card-text>Recomendacion:</v-card-text>
        <div class="margin-20">
          <v-icon v-bind:class="star1" large>grade</v-icon>
          <v-icon v-bind:class="star2" large>grade</v-icon>
          <v-icon v-bind:class="star3" large>grade</v-icon>
          <v-icon v-bind:class="star4" large>grade</v-icon>
          <v-icon v-bind:class="star5" large>grade</v-icon>
        </div>
        <div class="margin-10">
          <v-btn @click="delet" class="btn btn-danger" v-if="valid_user">Borrar</v-btn>
          <v-btn v-bind:to="`/productos/add/${producto._id}`" v-if="valid_user" class="btn btn-success ">Actualizar</v-btn>
          <v-btn @click="atras" class="btn btn-outline-info" >Atras</v-btn>
        </div>
      </v-card>
    </v-flex>
  </v-layout>
</template>
<script>
import axios from 'axios'
import StarRating from 'vue-star-rating'
import Vue from 'vue'

const wrapper = document.createElement('div')
// estado compartido
const state = {
  note: 0
}
// crear componentes de contenido
const RatingComponent = Vue.extend({
  data () {
    return { rating: 0 }
  },
  watch: {
    rating (newVal) { state.note = newVal }
  },
  template: `
    <div class="rating">
      ¿Cómo fue su experiencia al Comprar este producto?
      <star-rating v-model="rating" :show-rating="false"></star-rating>
    </div> `,
  components: { 'star-rating': StarRating }
})

const component = new RatingComponent().$mount(wrapper)

export default {
  name: 'producto',
  data () {
    return {
      producto: [],
      current_user: null,
      valid_user: false,
      nota: 0,
      star1: '',
      star2: '',
      star3: '',
      star4: '',
      star5: ''
    }
  },
  mounted () {
    this.fetchproductos()
    this.fetchUser()
    this.validRate()
  },
  methods: {
    async rate () {
      this.$swal({
        content: component.$el,
        buttons: {
          confirm: {
            values: 0
          }
        }
      }).then(() => {
        const productoId = this.$route.params.id
        return axios({
          method: 'post',
          data: {
            user_id: this.current_user._id,
            rate: state.note
          },
          url: `/productos/rate/${productoId}`,
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(() => {
            this.$swal(`Gracias por su Reseña! ${state.note} `, ':D', 'success')
            this.validRate()
          })
          .catch((error) => {
            const message = error.response.data.message
            this.$swal('Error', `${message}`, 'error')
          })
      })
    },
    async fetchproductos () {
      return axios({
        method: 'get',
        url: `/api/productos/${this.$route.params.id}`
      })
        .then((response) => {
          this.producto = response.data
        })
        .catch(() => {

        })
    },
    async delet () {
      return axios({
        method: 'get',
        url: `/productos/del/${this.$route.params.id}`
      })
        .then((response) => {
          this.$router.push({name: 'Home'})
        })
    },
    async atras () {
      this.$router.push({name: 'Home'})
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
    validUser () {
      if (this.current_user.type === 2) {
        this.valid_user = true
      } else {
        this.valid_user = false
      }
    },
    stars () {
      switch (this.nota) {
        case 1:
          this.star1 = 'golden-text'
          this.star2 = this.star3 = this.star4 = this.star5 = 'black-text'
          break
        case 2:
          this.star1 = this.star2 = 'golden-text'
          this.star3 = this.star4 = this.star5 = 'black-text'
          break
        case 3:
          this.star1 = this.star2 = this.star3 = 'golden-text'
          this.star4 = this.star5 = 'black-text'
          break
        case 4:
          this.star1 = this.star2 = this.star3 = this.star4 = 'golden-text'
          this.star5 = 'black-text'
          break
        case 5:
          this.star1 = this.star2 = this.star3 = this.star4 = this.star5 = 'golden-text'
          break
        default:
          this.star1 = this.star2 = this.star3 = this.star4 = this.star5 = 'black-text'
          break
      }
    },
    validRate () {
      return axios({
        method: 'get',
        url: `/Productos/rate/get/${this.$route.params.id}`
      })
        .then((response) => {
          this.nota = response.data
          this.stars()
        })
    }
  }
}
</script>
