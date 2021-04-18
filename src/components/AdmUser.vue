<template>
 <v-layout wrap column v-if="valid_user">
   <v-layout>
      <v-select label="Usuarios" v-model="userName" :items="userNames"></v-select>
      <v-btn  @click="setdatos" class="btn btn-warning" >Buscar</v-btn>
   </v-layout>
   <v-layout v-if="mostrar">
     <v-form>
    <v-text-field
      label="Nombre"
      v-model="name"
    ></v-text-field>
    <v-text-field
      label="Correo Electronico"
      v-model="email"
    ></v-text-field>
    <v-text-field
      label="Tipo"
      v-model="type"
    ></v-text-field>
    <v-btn  @click="actualizar" class="btn btn-success" >Actualizar</v-btn>
    <v-btn  @click="delet" class="btn btn-danger" >Elimiar</v-btn>
    </v-form>
   </v-layout>
 </v-layout>
</template>
<script>
import axios from 'axios'

export default {
  name: 'users',
  data () {
    return {
      userName: '',
      name: '',
      email: '',
      type: '',
      userNames: [],
      users: [],
      user: [],
      current_user: null,
      valid_user: false,
      mostrar: false
    }
  },
  mounted () {
    this.obtener()
    this.fetchUser()
  },
  methods: {
    async obtener () {
      return axios({
        method: 'get',
        url: `/users`,
        headers: {
          'Content-Type': 'aplication/json'
        }
      })
        .then((response) => {
          for (var i = 0; i < response.data.users.length; i++) {
            this.userNames.push(response.data.users[i].name)
            this.users.push(response.data.users[i])
          }
        })
        .catch(() => {
          console.log('error')
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
    validUser () {
      if (this.current_user.type === 2) {
        this.valid_user = true
      } else {
        this.valid_user = false
      }
    },
    async setdatos () {
      this.mostrar = true
      for (var i = 0; i < this.users.length; i++) {
        if (this.users[i].name === this.userName) {
          this.name = this.users[i].name
          this.email = this.users[i].email
          this.type = this.users[i].type
          this.user = this.users[i]
        }
      }
    },
    async actualizar () {
      return axios({
        method: 'post',
        data: {
          id: this.user._id,
          name: this.name,
          email: this.email,
          type: this.type
        },
        url: `/users/update`,
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          this.mostrar = false
          this.$router.push({name: 'Home'})
          this.$refs.form.reset()
        })
    },
    async delet () {
      return axios({
        method: 'get',
        url: `/api/users/del/${this.user._id}`
      })
        .then((response) => {
          this.$router.push({name: 'Home'})
        })
    }
  }
}
</script>
