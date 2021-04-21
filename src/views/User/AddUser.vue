<template>
  <b-container fluid>
    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col lg="3">
          </b-col>
          <b-col lg="9">
            <iq-card>
              <template v-slot:headerTitle>
                <h4 class="card-title">Creación de Usuario</h4>
              </template>
              <template v-slot:body>
                <div class="new-user-info">
                  <b-row>
                    <b-form-group class="col-md-6" label="Primer Nombre:" label-for="usr_name_first">
                      <ValidationProvider name="Primer Nombre" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="user.usr_name_first" type="text" placeholder="Primer Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Primer Apelldio:" label-for="usr_lastname_first">
                      <ValidationProvider name="Primer Apelldio" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="user.usr_lastname_first" type="text" placeholder="Primer Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6"
                                  label="Ciudad:"
                                  label-for="city"
                    >
                      <b-form-input  v-model="user.city" type="text" name="city" id="city" placeholder="Ciudad"></b-form-input>
                    </b-form-group>
                  </b-row>
                  <hr>
                  <b-row>
                  <b-form-group class="col-md-6" label="Nombre de Usuario:" label-for="uname">
                    <ValidationProvider name="Nombre de Usuario" rules="required" v-slot="{ errors }">
                      <b-form-input v-model="user.usr_username" type="text" placeholder="Nombre de Usuario" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Correo Electronico:" label-for="uname">
                    <ValidationProvider name="Correo Electronico" rules="required|email" v-slot="{ errors }">
                      <b-form-input v-model="user.usr_email" type="text" placeholder="Correo Electronico" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Rol de Usuario:" label-for="selectuserrole">
                    <b-form-select plain v-model="user.usr_role_id" :options="roles" id="selectuserrole">
                      <template v-slot:first>
                        <b-form-select-option :value="null">Seleccione</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Identificación:" label-for="mobno">
                    <ValidationProvider name="Identificación" rules="required" v-slot="{ errors }">
                      <b-form-input v-model="user.usr_identification" type="text" placeholder="Identificación" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                </b-row>
                <div class="checkbox">
                  <label><input class="mr-2" type="checkbox">Aceptar terms & conditions.</label>
                </div>
                <b-button variant="primary" type="submit">Agregar Usuario</b-button>
              </div>
              </template>
            </iq-card>
          </b-col>
        </b-row>
      </form>
    </ValidationObserver>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:8000/api'

export default {
  name: 'AddUser',
  mounted () {
    xray.index()
  },
  data () {
    return {
      user: {
        usr_name_first: '',
        usr_lastname_first: '',
        usr_identification_type: 1,
        usr_identification: '',
        usr_username: '',
        usr_password: '123456',
        usr_email: '',
        profile_image: require('../../assets/images/user/11.png'),
        city: '',
        usr_role_id: '',
        usr_accept_terms: 1
      },
      roles: [
        { text: 'Web Designer', value: 'Web Designer' },
        { text: 'Web Developer', value: 'Web Developer' },
        { text: 'Tester', value: 'Tester' },
        { text: 'Php Developer', value: 'Php Developer' },
        { text: 'Ios Developer', value: 'Ios Developer' }
      ],
      countries: [
        { value: 'Canada', text: 'Canada' },
        { value: 'Niada', text: 'Niada' },
        { value: 'USA', text: 'USA' },
        { value: 'India', text: 'India' },
        { value: 'Africa', text: 'Africa' }
      ],
      users: []
    }
  },
  computed: {
    fullName: function () {
      return this.user.usr_name_first + ' ' + this.user.usr_lastname_first
    }
  },
  methods: {
    previewImage: function (event) {
      const input = event.target

      if (input.files && input.files[0]) {
        const reader = new FileReader()

        reader.onload = (e) => {
          this.user.profile_image = e.target.result
        }

        reader.readAsDataURL(input.files[0])
      }
    },
    onSubmit () {
      this.addUser()
    },
    addUser () {
      console.log('weee', this.user.usr_email)
      axios.post('/register', this.user).then(res => {
        console.log(res.data.credentials)
        if (res.data.status_code === 200) {
          this.$router.push({ name: 'doctor.list' })
        } else {
          alert('Datos no validos')
        }
      })
    }
  }
}
</script>
