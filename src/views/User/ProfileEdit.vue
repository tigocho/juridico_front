<template>
  <b-container fluid>
    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
      <form novalidate @submit.prevent="handleSubmit(onSubmit)">
        <b-row>
          <b-col lg="12">
            <iq-card body-class="p-0">
              <template v-slot:body>
                <div class="iq-edit-list">
                  <tab-nav :pills="true" class="iq-edit-profile d-flex">
                    <tab-nav-items class="col-md-6 p-0" :active="true" href="#personal-information" title="Información personal" />
                    <tab-nav-items class="col-md-6 p-0" :active="false" href="#chang-pwd" title="Cambiar contraseña" />
                    <!--<tab-nav-items class="col-md-3 p-0" :active="false" href="#emailandsms" title="Email and SMS" />
                    <tab-nav-items class="col-md-3 p-0" :active="false" href="#manage-contact" title="Manage Contact" />-->
                  </tab-nav>
                </div>
              </template>
            </iq-card>
          </b-col>
          <b-col lg="12">
            <div class="iq-edit-list-data">
              <tab-content id="pills-tabContent-2">
                <tab-content-item :active="true" id="personal-information" >
                  <iq-card>
                    <template class="col-12" v-slot:headerTitle>
                      <h4 class="card-title">Información Personal</h4>
                    </template>
                    <template v-slot:body>
                        <!--<b-form-group class="row align-items-center">
                          <b-col md="12">
                            <div class="profile-img-edit">
                              <b-img :src="user.profile_image" class="profile-pic height-150 width-150" alt="profile-pic"/>
                              <input type="hidden" v-model="user.profile_image">
                              <div class="p-image">
                                <div class="position-relative">
                                  <i class="ri-pencil-line upload-button"></i>
                                  <b-form-file class="h-100 position-absolute" accept="image/*" style="opacity: 0;" @change="previewImage"></b-form-file>
                                </div>
                              </div>
                            </div>
                          </b-col>
                        </b-form-group>-->
                        <b-row align-v="center">
                          <b-form-group class="col-md-6" label="Primer nombre" label-for="usr_name_first">
                            <ValidationProvider name="Primer nombre" rules="required" v-slot="{ errors }">
                              <b-form-input v-model="user.usr_name_first" type="text" placeholder="Primer nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                              <div class="invalid-feedback">
                                <span>{{ errors[0] }}</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Segundo Nombre" label-for="usr_name_second">
                            <b-form-input v-model="user.usr_name_second" type="text" placeholder="Segundo Nombre"></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Primer apellido" label-for="usr_lastname_first">
                            <ValidationProvider name="Primer apellido" rules="required" v-slot="{ errors }">
                              <b-form-input v-model="user.usr_lastname_first" type="text" placeholder="Primer apellido" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                              <div class="invalid-feedback">
                                <span>{{ errors[0] }}</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Segundo apellido" label-for="usr_lastname_second">
                            <b-form-input v-model="user.usr_lastname_second" type="text" placeholder="Segundo apellido"></b-form-input>
                          </b-form-group>
                          <!--<b-form-group class="col-sm-6" label="Genero:" label-class="d-block">
                            <b-form-radio inline v-model="user.gender" value="male">Male</b-form-radio>
                            <b-form-radio inline v-model="user.gender" value="female">Female</b-form-radio>
                          </b-form-group>-->
                          <b-form-group class="col-sm-6" label="Fecha de nacimiento" label-for="usr_day_of_birth">
                            <b-form-input type="date" v-model="user.usr_day_of_birth" id="usr_day_of_birth"></b-form-input>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Correo electrónico" label-for="usr_email">
                            <ValidationProvider name="Correo electrónico" rules="required" v-slot="{ errors }">
                              <b-form-input v-model="user.usr_email" type="text" placeholder="Correo electrónico" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                              <div class="invalid-feedback">
                                <span>{{ errors[0] }}</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                          <b-form-group class="col-md-4" label="Perfil del Usuario" label-for="usr_role_id">
                            <ValidationProvider name="Perfil de Usuario" rules="required" v-slot="{ errors }">
                              <b-form-select plain v-model="user.usr_role_id" :options="roles" id="selectuserrole" :class="(errors.length > 0 ? ' is-invalid' : '')">
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
                              v-model="user_clinicas"
                              :options="clinicaOptions"
                              :reduce="label => label.code"
                              label="label"
                              id="clinica_id"
                              :class="(errors.length > 0 ? ' is-invalid' : '') + 'ml-1' "
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
                          <b-form-group class="col-md-6" label="Tipo de identificación" label-for="usr_identification_type">
                            <ValidationProvider name="Perfil de Usuario" rules="required" v-slot="{ errors }">
                              <b-form-select plain v-model="user.usr_identification_type" :options="ids" id="usr_identification_type" :class="(errors.length > 0 ? ' is-invalid' : '')">
                                <template v-slot:first>
                                  <b-form-select-option :value="null" disabled>Seleccione una opción</b-form-select-option>
                                </template>
                              </b-form-select>
                              <div class="invalid-feedback">
                                <span>Debe de seleccionar una opción</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Número de Identificación" label-for="usr_identification">
                            <ValidationProvider name="Número de Identificación" rules="required|numeric" v-slot="{ errors }">
                              <b-form-input v-model="user.usr_identification" type="number" placeholder="Número de Identificación" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                              <div class="invalid-feedback">
                                <span>{{ errors[0] }}</span>
                              </div>
                            </ValidationProvider>
                          </b-form-group>
                          <b-form-group class="col-md-6" label="Género del usuario" label-for="usr_gender">
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
                                  <span>{{ errors[0] }}</span>
                                </div>
                            </ValidationProvider>
                          </b-form-group>
                        </b-row>
                        <div class="form-group row mt-3">
                          <div class="col-6 d-flex">
                            <label class="col-auto" for="user.usr_is_active">Usuario activo:</label>
                            <div class="col-auto custom-control custom-switch" style="min-height:33px;">
                              <input type="checkbox" class="custom-control-input" id="user.usr_is_active" v-model="user.usr_is_active" :value="user.usr_is_active">
                              <label class="custom-control-label" for="user.usr_is_active"></label>
                            </div>
                          </div>
                          <div class="col-6">
                            <b-button @click="guardarInformacionPersonal" variant="primary" class="ml-2 d-flex float-right" :class="estadoBoton">{{textoGuardar}}</b-button>
                            <b-button @click="volverListadoUsuarios" variant="none" class="iq-bg-danger d-flex float-right">Cancelar</b-button>
                          </div>
                        </div>
                    </template>
                  </iq-card>
                </tab-content-item>
                <tab-content-item :active="false" id="chang-pwd">
                  <iq-card>
                    <template v-slot:headerTitle>
                      <h4 class="card-title">Cambiar Contraseña</h4>
                    </template>
                    <template v-slot:body>
                      <div class="row">
                        <b-form-group class="col-md-6" label="Nueva contraseña" label-for="pass">
                          <ValidationProvider name="Password" rules="confirmed:repeat_password" v-slot="{ errors }">
                            <b-form-input v-model="newPassword" type="password" placeholder="Contraseña" autocomplete="new-password" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
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
                      </div>
                      <b-form-group class="col-12 p-3" label-for="buttons">
                        <b-button @click="cambiarPassword" variant="primary" class="ml-2 d-flex float-right" :class="estadoBoton">{{textoGuardar}}</b-button>
                        <b-button @click="volverListadoUsuarios" variant="none" class="iq-bg-danger d-flex float-right">Cancelar</b-button>
                      </b-form-group>
                    </template>
                  </iq-card>
                </tab-content-item>
              </tab-content>
            </div>
          </b-col>
        </b-row>
      </form>
    </ValidationObserver>
  </b-container>
</template>
<script>
import auth from '@/logic/auth'
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'

export default {
  name: 'ProfileEdit',
  // created: function () {
  //   this.getUser()
  // },
  mounted () {
    xray.index()
    this.fetchClinicaOptions()
    this.getUserClinicas()
    setTimeout(() => {
      this.getUser()
      this.fetchPerfilesPlataformaOptions()
    }, 1000)
  },
  data () {
    return {
      user_id: this.$route.params.user_id,
      textoGuardar: 'Guardar',
      estadoBoton: '',
      errors: [],
      user: {
        usr_identification_type: '',
        usr_identification: '',
        usr_name_first: '',
        usr_lastname_first: '',
        usr_name_second: '',
        usr_lastname_second: '',
        usr_day_of_birth: '',
        usr_cell_phone: '',
        usr_color: '#000000',
        usr_email: '',
        clinicas: '',
        usr_is_active: true,
        usr_password: '',
        usr_role_id: '',
        profile_image: require('../../assets/images/user/11.png'),
        city: '',
        pincode: '',
        role: '',
        usr_gender: '',
        dob: '',
        url: ''
      },
      user_clinicas: null,
      clinicaOptions: [],
      clinicasUsuario: [],
      ids: [
        { text: 'CC.', value: 1 },
        { text: 'TI.', value: 2 },
        { text: 'RC.', value: 3 },
        { text: 'NIT', value: 4 }
      ],
      newPassword: '',
      newPassword2: '',
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
      roles: {}
    }
  },
  computed: {
    userLogged () {
      if (auth.getUserLogged() !== undefined) {
        return JSON.parse(auth.getUserLogged())
      } else {
        return null
      }
    },
    fullName: function () {
      return this.user.usr_name_first + ' ' + this.user.usr_lastname_first
    }
  },
  methods: {
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
    getUser () {
      axios.get('/users/edit/' + this.user_id).then(res => {
        if (res.data.status_code === 200) {
          this.user = res.data.user
          // this.clinicaOptions.length - 1 === this.clinicasUsuario.length ? this.user.clinicas = [0] : this.user.clinicas = this.clinicasUsuario
        } else {
          Vue.swal(res.data.message)
        }
      })
    },
    getUserClinicas () {
      axios.get('/clinicas/' + this.user_id).then(res => {
        if (res.data.success === 200) {
          for (let i = 0; i < res.data.clinicas.length; i++) {
            this.clinicasUsuario.push(res.data.clinicas[i].code)
          }
          this.clinicaOptions.length - 1 === this.clinicasUsuario.length ? this.user_clinicas = [0] : this.user_clinicas = this.clinicasUsuario
        } else {
          Vue.swal(res.data.message)
        }
      })
        .catch((err) => {
          this.errores = err
          if (this.intentos < 2) {
            this.getUserClinicas()
            this.intentos++
          }
        })
    },
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
      if (this.user_clinicas != null && this.user_clinicas.length > 0) {
        this.guardarInformacionPersonal()
      } else {
        Vue.swal('Por favor seleccione al menos una clínica para el usuario.')
      }
    },
    guardarInformacionPersonal: function () {
      this.estadoBoton = 'disabled'
      this.textoGuardar = 'Guardando...'
      if (this.user_clinicas.includes(0)) { this.user.clinicas = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] } else { this.user.clinicas = this.user_clinicas }
      axios.post('/users/update/' + this.user_id, this.user).then(res => {
        this.estadoBoton = ''
        if (res.data.status_code === 200) {
          this.textoGuardar = 'Guardar'
          Vue.swal(res.data.message)
          this.getUser()
        } else {
          this.textoGuardar = 'Guardar'
          Vue.swal(res.data.message)
        }
      })
        .catch((err) => {
          this.estadoBoton = ''
          this.textoGuardar = 'Guardar'
          this.errores = err
          if (this.intentos < 2) {
            this.guardarInformacionPersonal()
            this.intentos++
          } else {
            Vue.swal('error', 'Ups, ocurrió un error tratando de actualizar el usuario.', 'error')
          }
        })
    },
    cambiarPassword: function () {
      axios.post('/users/update/' + this.user_id, { 'newPassword': this.newPassword }).then(res => {
        if (res.data.status_code === 200) {
          this.newPassword = ''
          this.newPassword2 = ''
          Vue.swal(res.data.message)
          this.getUser()
        } else {
          Vue.swal(res.data.message)
        }
      })
    },
    volverListadoUsuarios: function () {
      this.$router.push({ path: `/usuarios/listar-usuarios` })
    }
  }
}
</script>
