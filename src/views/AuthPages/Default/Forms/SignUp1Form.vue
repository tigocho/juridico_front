<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
      <div class="d-flex col-12 p-0">
        <ValidationProvider vid="name" name="Name" rules="required" v-slot="{ errors }">
          <div class="form-group col-12 pl-0 pr-4">
            <!-- <label for="nameFirst" class="pl-1">Primer nombre*</label> -->
            <input type="text" v-model="user.primerNombre" :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
                  id="nameFirst" aria-describedby="emailHelp" placeholder="Primer nombre*">
            <div class="invalid-feedback">
              <span>{{ errors[0] }}</span>
            </div>
          </div>
        </ValidationProvider>
        <div class="col-6 pr-0 pl-2">
          <input type="text" v-model="user.segundoNombre" :class="'form-control mb-0'" id="nameSecond" aria-describedby="emailHelp" placeholder="Segundo nombre">
        </div>
      </div>
      <div class="d-flex">
        <ValidationProvider vid="name" name="Last Name" rules="required" v-slot="{ errors }">
          <div class="form-group col-12 pl-0 pr-4">
            <input type="text" v-model="user.primerApellido" :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
                  id="LastNameFirst" aria-describedby="emailHelp" placeholder="Primer apellido*">
            <div class="invalid-feedback">
              <span>{{ errors[0] }}</span>
            </div>
          </div>
        </ValidationProvider>
        <div class="col-6 pr-0 pl-2">
          <input type="text" v-model="user.segundoApellido" :class="'form-control mb-0'" id="LastNameSecond" aria-describedby="emailHelp" placeholder="Segundo apellido">
        </div>
      </div>
      <ValidationProvider vid="email" name="Email" rules="required|email" v-slot="{ errors }">
        <div class="form-group col-12 p-0">
          <input type="email" v-model="user.email" :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
                 id="email" aria-describedby="emailHelp" placeholder="Correo electrónico*">
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider vid="identificacion" name="identificacion" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <input type="number" v-model="user.numeroIdentificacion" :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
                id="identificacion" placeholder="Número de identificación*">
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <div>
        <b-input-group class="mb-3">
          <b-form-input
            id="example-input"
            v-model="user.nacimiento"
            type="text"
            placeholder="Fecha de nacimiento: AAAA-MM-DD"
            autocomplete="off"
          ></b-form-input>
          <b-input-group-append>
            <b-form-datepicker
              v-model="user.nacimiento"
              button-only
              right
              locale="en-US"
              aria-controls="example-input"
              @context="onContext"
            ></b-form-datepicker>
          </b-input-group-append>
        </b-input-group>
      </div>
      <div class="d-flex justify-content-center">
        <!-- <div class="custom-control custom-checkbox d-inline-block mt-2 pt-1">
          <input type="checkbox" class="custom-control-input" :id="formType">
          <label class="custom-control-label" :for="formType">I accept <a href="#">Terms and Conditions</a></label>
        </div> -->
        <button type="submit" class="btn btn-primary mt-3">Crear cuenta</button>
      </div>
      <div class="sign-info d-flex justify-content-center">
        <span class="dark-color d-inline-block line-height-2">
          ¿Ya tienes una cuenta?
          <router-link to="sign-in1" class="iq-waves-effect" >
              Iniciar sesión
          </router-link>
        </span>
      </div>
    </form>
  </ValidationObserver>
</template>

<script>
import auth from '../../../../services/auth'
import firebase from 'firebase'
import { mapGetters } from 'vuex'

export default {
  name: 'SignUp1Form',
  props: ['formType'],
  computed: {
    ...mapGetters({
      users: 'Setting/usersState'
    })
  },
  data: () => ({
    user: {
      email: '',
      password: '',
      numeroIdentificacion: null,
      primerNombre: '',
      segundoNombre: '',
      primerApellido: '',
      segundoApellido: '',
      color: '#000000',
      activo: 0,
      genero: null,
      nacimiento: null,
      celular: null,
      clinica: null
    },
    generoOptions: [
      { text: 'Mujer', value: 1 },
      { text: 'Hombre', value: 2 }
    ]
  }),
  methods: {
    onContext (ctx) {
      // The date formatted in the locale, or the `label-no-date-selected` string
      this.formatted = ctx.selectedFormatted
      // The following will be an empty string until a valid date is entered
      this.selected = ctx.selectedYMD
    },
    onSubmit () {
      console.log(this.user)
    },
    jwtRegister () {
      this.$store.dispatch('Setting/addUserAction', this.user)
      this.$router.replace('/auth/sign-in1')
    },
    passportRegister () {
      auth.register(this.user).then(response => {
        if (response.status) {
          this.$router.push('/auth/sign-in1')
        } else if (response.data.errors.length > 0) {
          this.$refs.form.setErrors(response.data.errors)
        }
      }).finally(() => { this.loading = false })
    },
    firebaseRegister () {
      firebase.auth().createUserWithEmailAndPassword(this.user.email, this.user.password).then((user) => {
        this.$router.replace('/auth/sign-in1')
        // eslint-disable-next-line handle-callback-err
      }).catch((err) => {
      })
    }
  }
}
</script>
