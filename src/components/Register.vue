<template>
  <v-form v-model="valid" ref="from" lazy-validation>
    <img src="https://cdn.shopify.com/s/files/1/0264/0314/3759/collections/preview-Teka_1024x.png?v=1573582331" height="200" width="1200">
    <v-text-field
    label = "Nombre"
    v-model="name"
    required
    ></v-text-field>
    <v-text-field
    label="Correo Electronico"
    v-model="email"
    :rules="emailRules"
    required
    ></v-text-field>
    <v-text-field
    label = "Contraseña"
    v-model ="password" required></v-text-field>
    <v-text-field
    name="input-7-1"
    label="Confirmación de contraseña"
    v-model="confirm_password"
    ></v-text-field>
    <v-btn @click="submit" :disabled="!valid" class="btn btn-success">Registrarse</v-btn>
    <v-btn @click ="clear" class="btn btn-warning">Limpiar</v-btn>
  </v-form>
</template>
<script>
import axios from 'axios'
export default {
  data: () => ({
    valid: true,
    name: '',
    email: '',
    password: '',
    confirm_password: '',
    type: 1,
    car: [],
    emailRules: [
      v => !!v || 'E-mail requerido',
      v => /\S+@\S+\.\S+/.test(v) || 'El E-mail debe ser valido'
    ]
  }),
  methods: {
    async submit () {
      if (this.$refs.from.validate()) {
        return axios({
          method: 'post',
          data: {
            name: this.name,
            email: this.email,
            password: this.password,
            type: this.type,
            car: this.car
          },
          url: '/users/register',
          headers: {
            'Content-Type': 'application/json'
          }
        })
          .then(() => {
            this.$swal(
              'Muy bien',
              'Ha sido satisfactoriamente registrado',
              'success'
            )
            this.$router.push({name: 'Login'})
          })
          .catch((error) => {
            const message = error.response.data.message
            this.$swal('Error', `${message}`, 'error')
          })
      }
      return true
    },
    clear () {
      this.$refs.from.reset()
    }
  }
}
</script>
