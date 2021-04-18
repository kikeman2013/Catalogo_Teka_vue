<template>
  <v-form v-model="valid" ref="form" lazy-validation>
    <v-text-field
      label="Nombre"
      v-model="name"
      :rules="nameRules"
      required
    ></v-text-field>
    <v-text-field
      name="input-7-1"
      label="Descripcion"
      v-model="description"
      multi-line
    ></v-text-field>
    <v-text-field
      label="Codigo"
      v-model="code"
      :rules="codeRules"
    ></v-text-field>
    <v-text-field
      label="Precio"
      v-model="price"
      required
      :rules="priceRules"
    ></v-text-field>
    <v-text-field
      label="Foto"
      v-model="pic"
      required
      :rules="picRules"
    ></v-text-field>
    <v-select
      label="Tipo"
      v-model="type"
      required
      :rules="typeRules"
      :items="types"
    ></v-select>
    <v-btn @click="submit" v-if="Actu2" class="btn btn-info">Guardar</v-btn>
    <v-btn @click="Actualizar" v-if="Actu" class="btn btn-success">Actualizar</v-btn>
    <v-btn @click="clear" v-if="Actu2" class="btn btn-warning">Limpiar</v-btn>
    <v-btn @click="Cancelar" v-if="Actu" class="btn btn-danger">cancelar</v-btn>
  </v-form>
</template>
<script>
import axios from 'axios'

export default {
  data: () => ({
    Actu: false,
    Actu2: false,
    valid: true,
    name: '',
    description: '',
    code: '',
    price: '',
    type: '',
    pic: '',
    nameRules: [
      v => !!v || 'Nombre del Producto es Requerido'
    ],
    priceRules: [
      v => !!v || 'El precio del Producto es requerido'
    ],
    codeRules: [
      v => !!v || 'El Codigo es necesario'
    ],
    typeRules: [
      v => !!v || 'Se requiere Tipo de Producto'
    ],
    picRules: [
      v => !!v || 'Se requiere La foto del Producto'
    ],
    select: null,
    types: [
      'Fregadero',
      'Llave',
      'Refrigerador',
      'Estufa',
      'Parilla',
      'Campana',
      'Horno',
      'Lavavajillas'
    ]
  }),
  beforeMount () {
    return axios({
      method: 'get',
      url: `/api/productos/${this.$route.params.id}`
    }).then((response) => {
      if (response.data !== '') {
        this.Actu = true
        this.Actu2 = false
        this.setdatos()
      } else {
        this.Actu = false
        this.Actu2 = true
      }
    })
  },
  methods: {
    submit () {
      if (this.$refs.form.validate()) {
        return axios({
          method: 'post',
          data: {
            name: this.name,
            description: this.description,
            code: this.code,
            price: this.price,
            type: this.type,
            pic: this.pic
          },
          url: '/productos/add',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(() => {
            this.$swal(
              'Grandioso!',
              'Producto Agregada satisfactoriamente!',
              'success'
            )
            this.$router.push({name: 'Home'})
            this.$refs.form.reset()
          })
          .catch(() => {
            this.$swal(
              'Ha ocurrido un problema!',
              'No se pudo agregar el Producto',
              'error'
            )
          })
      }
      return true
    },
    clear () {
      this.$refs.form.reset()
    },
    Cancelar () {
      this.$router.push({name: 'producto'})
      this.$refs.form.reset()
    },
    async setdatos () {
      return axios({
        method: 'get',
        url: `/api/productos/${this.$route.params.id}`
      })
        .then((response) => {
          for (var i = 0; i < this.types.length; i++) {
            if (this.types[i] === response.data.type) {
              this.type = this.types[i]
            }
          }
          this.name = response.data.name
          this.description = response.data.description
          this.code = response.data.code
          this.price = response.data.price
          this.pic = response.data.pic
        })
    },
    async Actualizar () {
      return axios({
        method: 'post',
        data: {
          id: `${this.$route.params.id}`,
          name: this.name,
          description: this.description,
          code: this.code,
          price: this.price,
          type: this.type,
          pic: this.pic
        },
        url: `/productos/update`,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.$router.push({name: 'Home'})
          this.$refs.form.reset()
        })
    }
  }
}
</script>
