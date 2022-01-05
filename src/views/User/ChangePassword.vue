<template>
  <b-container fluid>
    <h2 class="mb-0">Cambiar contraseña</h2>
    <p>Ingrese una nueva contraseña para que sea actualizada.</p>
    <div class='notificacion' v-if="estado">
        <i class='float-right fas fa-times cerrar' v-on:click="estado=false"></i>
        <p>¡Se ha cambiado la contraseña correctamente!</p>
    </div>
    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
        <ValidationProvider name="Password" rules="confirmed:repeat_password|required" v-slot="{ errors }">
          <b-form-group class="col-md-12" label="Nueva contraseña" label-for="pass" >
          <b-form-input required v-model="newPassword" type="password" placeholder="Contraseña" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
          </b-form-group>
        </ValidationProvider>
        <ValidationProvider vid="repeat_password" name="Repetir contraseña" rules="confirmed:repeat_password|required" v-slot="{ errors }">
          <b-form-group class="col-md-12" label="Repetir contraseña" label-for="rpass">
          <b-form-input  v-model="newPassword2" type="password" placeholder="Repeat Password" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
          </b-form-group>
        </ValidationProvider>
        <div class="d-inline-block w-100">
          <button type="submit" class="btn btn-primary float-right">{{ texto }}</button>
          <b-button @click="cancelar" class="float-right iq-bg-danger mr-3" variant="none" size="lg" >Cancelar</b-button>
        </div>
      </form>
    </ValidationObserver>
  </b-container>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'

export default {
  name: 'ChangePassword',
  mounted () {
    this.verificarToken()
  },
  data: () => ({
    uri: window.location.href.split('change-password/'),
    token: '',
    email: '',
    texto: 'Guardar',
    estado: false,
    newPassword: '',
    newPassword2: ''
  }),
  methods: {
    verificarToken () {
      if (this.uri.length === 2) {
        this.token = this.uri[1]
      }
      axios.post('/verificarToken', { 'token': this.token }).then(res => {
        if (res.data.status_code === 200) {
          this.email = res.data.email
        } else {
          Vue.swal(res.data.message)
        }
      })
    },
    setCookie (cName, value) {
      document.cookie = cName + '=' + value + ';expires=Fri, 31 Dec 9999 23:59:59 GMT'
    },
    onSubmit () {
      this.texto = 'Guardando...'
      if (this.newPassword !== '' && this.newPassword2 !== '' && (this.newPassword === this.newPassword2)) {
        axios.post('/cambiarPassword/' + this.email, { 'newPassword': this.newPassword }).then(res => {
          if (res.data.status_code === 200) {
            this.newPassword = ''
            this.newPassword2 = ''
            this.estado = true
            this.texto = 'Guardar'
            Vue.swal(res.data.message)
            this.setCookie('pass-jur', '')
            setTimeout(() => {
              this.$router.push({ path: `/auth/sign-in1` })
            }, 3000)
          } else {
            Vue.swal(res.data.message)
          }
        })
      }
    },
    cancelar () {
      this.$router.push({ path: `/auth/sign-in1` })
    }
  }
}
</script>
