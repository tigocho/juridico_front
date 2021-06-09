<template>
  <div>
    <h1 class="mb-0">Restablecer Contraseña</h1>
    <p>Ingrese su dirección de correo electrónico y le enviaremos un correo electrónico con instrucciones para restablecer su contraseña.</p>
    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
        <ValidationProvider vid="email" name="Correo electrónico" rules="required" v-slot="{ errors }">
          <div class="form-group">
            <div class="form-group">
              <label for="name">Correo electrónico</label>
              <input type="email" v-model="email" :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
                    id="name" aria-describedby="emailHelp" placeholder="Correo electrónico registrado">
              <div class="invalid-feedback">
                <span>{{ errors[0] }}</span>
              </div>
            </div>
          </div>
        </ValidationProvider>
        <div class="d-inline-block w-100">
          <!--<a @click="recuperarPassword" class="btn btn-primary float-right">{{ texto }}</a>
          <b-button @click="cancelar" class="float-right iq-bg-danger" variant="none" size="lg" >Cancelar</b-button>-->
          <button type="submit" class="btn btn-primary float-right">{{ texto }}</button>
        </div>
      </form>
    </ValidationObserver>
  </div>
</template>
<script>
import axios from 'axios'
import Vue from 'vue'

export default {
  name: 'RecoverPassword1',
  data: () => ({
    email: '',
    texto: 'Restablecer Contraseña',
    estado: ''
  }),
  methods: {
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
