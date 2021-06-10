<template>
  <b-container fluid>
    <form>
      <template>
        <b-form-group class="col-md-6" label="Nueva contraseña" label-for="pass">
          <ValidationProvider name="Password" rules="confirmed:repeat_password" v-slot="{ errors }">
            <b-form-input v-model="newPassword" type="password" placeholder="Contraseña" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
            <div class="invalid-feedback">
              <span>{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
        </b-form-group>
        <b-form-group class="col-md-6" label="Repetir contraseña" label-for="rpass">
          <ValidationProvider vid="repeat_password" name="Repetir contraseña" rules="required" v-slot="{ errors }">
            <b-form-input v-model="newPassword2" type="password" placeholder="Repeat Password" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
            <div class="invalid-feedback">
              <span>{{ errors[0] }}</span>
            </div>
          </ValidationProvider>
        </b-form-group>
        <b-form-group class="col-md-6" label-for="buttons">
          <b-button @click="cambiarPassword" variant="primary" class="mr-2">Guardar</b-button>
          <b-button @click="volverListadoUsuarios" variant="none" class="iq-bg-danger">Cancelar</b-button>
        </b-form-group>
      </template>
    </form>
  </b-container>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'

export default {
  name: 'RecoverPassword1',
  mounted () {
    this.verificarToken()
  },
  data: () => ({
    token: this.$route.params.token,
    email: '',
    texto: 'Restablecer Contraseña',
    estado: ''
  }),
  methods: {
    verificarToken () {
      axios.post('/verificarToken', { 'token': this.token }).then(res => {
        if (res.data.status_code === 200) {
          this.email = res.data.email
        } else {
          Vue.swal(res.data.message)
        }
      })
    },
    onSubmit () {
      axios.post('/recuperarPassword', { 'email': this.email }).then(res => {
        if (res.data.status_code === 200) {
          Vue.swal(res.data.message)
        } else {
          Vue.swal(res.data.message)
        }
      })
    },
    cancelar () {
      this.$router.push({ path: `/auth/sign-in1` })
    }
  }
}
</script>
