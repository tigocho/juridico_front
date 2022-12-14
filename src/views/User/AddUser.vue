<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <ValidationObserver ref="form" v-slot="{ handleSubmit }">
        <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col lg="12">
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
                          <span>Nombre inválido</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Segundo Nombre:" label-for="usr_name_second">
                      <b-form-input v-model="user.usr_name_second" type="text" placeholder="Segundo Nombre" ></b-form-input>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Primer Apellido:" label-for="usr_lastname_first">
                      <ValidationProvider name="Primer Apellido" rules="required" v-slot="{ errors }">
                        <b-form-input v-model="user.usr_lastname_first" type="text" placeholder="Primer Apellido" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Primer Apellido inválido</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Segundo Apellido:" label-for="usr_lastname_second">
                      <b-form-input v-model="user.usr_lastname_second" type="text" placeholder="Segundo Apellido" ></b-form-input>
                    </b-form-group>
                  </b-row>
                  <hr>
                <b-row>
                  <b-form-group class="col-md-6" label="Tipo de identificación:" label-for="selectypeid">
                    <b-form-select plain v-model="user.usr_identification_type" :options="ids" id="selectypeid">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>Seleccione un tipo de id</b-form-select-option>
                      </template>
                    </b-form-select>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Identificación:" label-for="mobno">
                    <ValidationProvider name="Identificación" rules="required|numeric" v-slot="{ errors }">
                      <b-form-input v-model="user.usr_identification" type="number" placeholder="Identificación" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>Número de identificación inválido</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Fecha de Nacimiento" label-for="usr_birthday">
                    <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" ></b-form-input>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Correo Electronico:" label-for="usr_email">
                    <ValidationProvider name="Correo Electronico" rules="required|email" v-slot="{ errors }">
                      <b-form-input v-model="user.usr_email" type="text" placeholder="Correo Electronico" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>Correo electrónico inválido</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-4" label="Perfil de Usuario:" label-for="usr_role_id">
                    <ValidationProvider name="Perfil de Usuario" rules="required" v-slot="{ errors }">
                      <b-form-select plain v-model="user.usr_role_id" :options="roles" id="usr_role_id" :class="(errors.length > 0 ? ' is-invalid' : '')">
                        <template v-slot:first>
                          <b-form-select-option :value="null" disabled>Seleccione un perfil</b-form-select-option>
                        </template>
                      </b-form-select>
                      <div class="invalid-feedback">
                        <span>Debe de seleccionar una opción</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group label="Clínicas para el usuario" label-for="clinicas" class="col-md-4">
                    <v-select
                      multiple
                      v-model="user.clinicas"
                      :options="clinicaOptions"
                      :reduce="label => label.code"
                      label="label"
                      id="clinica_id"
                      >
                      <span slot="no-options">No hay clínicas.</span>
                    </v-select>
                  </b-form-group>
                  <b-form-group class="col-md-4" label="Color para el usuario" label-for="usr_color">
                    <ValidationProvider name="Color para el usuario" rules="required" v-slot="{ errors }">
                      <b-form-input v-model="user.usr_color" type="color" placeholder="Color" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Genero del usuario" label-for="usr_gender">
                    <ValidationProvider name="Genero del usuario" rules="required" v-slot="{ errors }">
                      <template v-for="(item,index) in state">
                        <b-form-radio inline v-model="user.usr_gender" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled" :class="(errors.length > 0 ? ' is-invalid' : '')">{{ item.label }}</b-form-radio>
                      </template>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Teléfono/Celular" label-for="usr_cell_phone">
                    <ValidationProvider name="Teléfono/Celular" rules="required" v-slot="{ errors }">
                      <b-form-input v-model="user.usr_cell_phone" type="number" placeholder="ej: 3019972139" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>Número inválido</span>
                        </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Nueva contraseña" label-for="pass">
                    <ValidationProvider name="Password" rules="confirmed:repeat_password" v-slot="{ errors }">
                      <b-form-input autocomplete="new-password" v-model="user.usr_password" type="password" placeholder="Contraseña" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Repetir contraseña" label-for="rpass">
                    <ValidationProvider vid="repeat_password" name="Repetir contraseña" rules="required" v-slot="{ errors }">
                      <b-form-input v-model="user.newPassword2" type="password" placeholder="Repeat Password" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                </b-row>
                <div class="form-group row mt-3">
                  <div class="col-6 d-flex">
                    <label class="col-auto" for="user.usr_is_active">Usuario activo:</label>
                    <div class="col-auto custom-control custom-switch" style="min-height:33px;">
                      <input type="checkbox" class="custom-control-input" id="user.usr_is_active" v-model="user.usr_is_active" :value="user.usr_is_active" >
                      <label class="custom-control-label" for="user.usr_is_active"></label>
                    </div>
                  </div>
                  <div class="col-6">
                    <b-button variant="primary" type="submit" class="d-flex float-right" :class="estadoBoton">{{ textoBoton }}</b-button>
                  </div>
                </div>
              </div>
              </template>
            </iq-card>
          </b-col>
        </b-row>
        </form>
        </ValidationObserver>
      </b-col>
    </b-row>
  </b-container>

</template>
<script>
import auth from '@/logic/auth'
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'

export default {
  name: 'AddUser',
  mounted () {
    xray.index()
    this.fetchClinicaOptions()
    this.fetchPerfilesPlataformaOptions()
  },
  data () {
    return {
      estadoBoton: '',
      textoBoton: 'Crear Usuario',
      errors: [],
      user: {
        usr_name_first: '',
        usr_lastname_first: '',
        usr_name_second: '',
        usr_lastname_second: '',
        usr_identification_type: 1,
        usr_identification: '',
        usr_username: '',
        clinicas: '',
        usr_email: '',
        profile_image: require('../../assets/images/user/11.png'),
        city: '',
        usr_role_id: '',
        usr_accept_terms: 1,
        usr_gender: '',
        usr_cell_phone: '',
        usr_is_active: 1,
        usr_color: '#000000',
        usr_password: '',
        newPassword2: ''
      },
      clinicaOptions: [],
      state: [
        {
          name: 'genero',
          label: 'Masculino',
          value: 2,
          disabled: false
        },
        {
          name: 'genero',
          label: 'Femenino',
          value: 1,
          disabled: false
        }
      ],
      roles: {},
      ids: [
        { text: 'CC.', value: 1 },
        { text: 'TI.', value: 2 },
        { text: 'RC.', value: 3 },
        { text: 'NIT.', value: 4 }
      ],
      users: []
    }
  },
  computed: {
    userLogged () {
      return JSON.parse(auth.getUserLogged())
    },
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
    fetchPerfilesPlataformaOptions () {
      axios.get('/profiles/perfiles-plataforma').then(response => {
        this.roles = response.data.profiles
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.fetchPerfilesPlataformaOptions()
            this.intentos++
          }
        })
    },
    fetchClinicaOptions () {
      if (this.userLogged.usr_id != null && this.userLogged.usr_id !== '') {
        axios.get('/clinicas/obtener-clinicas/' + this.userLogged.usr_id).then(response => {
          this.clinicaOptions = response.data.clinicas
          this.clinicaOptions.push({ code: 0, label: 'Todas' })
          if (this.clinicaOptions[0] !== undefined) {
            this.intentos = 0
            this.errores = {}
            if (this.clinicaOptions.length === 1) {
              this.clinicaId = this.clinicaOptions[0].code
            }
          }
        })
          .catch((err) => {
            this.errores = err
            if (this.intentos < 2) {
              this.fetchClinicaOptions()
              this.intentos++
            }
          })
      } else {
        Vue.swal('Usuario no logueado o inactivo')
      }
    },
    onSubmit () {
      if (this.user.clinicas != null && this.user.clinicas.length > 0) {
        this.estadoBoton = 'disabled'
        this.addUser()
      } else {
        Vue.swal('Por favor seleccione al menos una clínica para el usuario.')
      }
    },
    addUser () {
      this.textoBoton = 'Creando usuario...'
      axios.post('/register', this.user).then(res => {
        if (res.data.status_code === 200) {
          Vue.swal(res.data.message)
          this.$router.push({ name: 'usuarios.listar' })
        } else {
          Vue.swal(res.data.message)
          this.estadoBoton = ''
          this.textoBoton = 'Guardar'
        }
      })
    }
  }
}
</script>
