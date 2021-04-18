<template>
  <v-form v-model="valid" ref="form" lazy-validation>
    <img src="https://cdn.shopify.com/s/files/1/0264/0314/3759/collections/preview-Teka_1024x.png?v=1573582331" height="200" width="1200">
    <v-text-field
      label="Corre Electronico"
      v-model="email"
      :rules="emailRules"
      required
    ></v-text-field>
    <v-text-field
      label="Contraseña"
      v-model="password"
      required
    ></v-text-field>
    <v-btn  @click="submit" :disabled="!valid" class="btn btn-success">Iniciar</v-btn>
    <v-btn @click="clear" class="btn btn-warnings">Limpiar</v-btn>
  </v-form>
</template>
<script>
import axios from 'axios'
import bus from './../bus'

export default {
  data: () => ({
    valid: true,
    email: '',
    password: '',
    emailRules: [
      v => !!v || 'Email requerido',
      v => /\S+@\S+\.\S+/.test(v) || 'El email debe ser valido'
    ]
  }),
  methods: {
    async submit () {
      return axios({
        method: 'post',
        data: {
          email: this.email,
          password: this.password
        },
        url: '/users/login',
        headers: {
          'Content-Type': 'application/json'
        }
      })
        .then((response) => {
          window.localStorage.setItem('auth', response.data.token)
          this.$swal('Muy bien!', 'Esta listo para iniciar', 'success')
          bus.$emit('refreshUser')
          this.$router.push({name: 'Home'})
        })
        .catch((error) => {
          const message = error.response.data.message
          this.$swal('Error!', `${message}`, 'error')
          this.$router.push({name: 'Login'})
        })
    },
    clear () {
      this.$refs.form.reset()
    }
  }
}
</script>
