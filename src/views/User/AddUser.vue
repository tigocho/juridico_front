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
                          <span>Nombre invalido</span>
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
                          <span>Primer Apellido invalido</span>
                        </div>
                      </ValidationProvider>
                    </b-form-group>
                    <b-form-group class="col-md-6" label="Segundo Apellido:" label-for="usr_lastname_second">
                      <b-form-input v-model="user.usr_lastname_second" type="text" placeholder="Segundo Apellido" ></b-form-input>
                    </b-form-group>
                  </b-row>
                  <hr>
                  <b-row>
                  <b-form-group class="col-md-6" label="Fecha de Nacimiento" label-for="usr_birthday">
                    <ValidationProvider name="Fecha de nacimiento" rules="required" v-slot="{ errors }">
                      <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>Fecha de nacimiento invalida</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Correo Electronico:" label-for="usr_email">
                    <ValidationProvider name="Correo Electronico" rules="required|email" v-slot="{ errors }">
                      <b-form-input v-model="user.usr_email" type="text" placeholder="Correo Electronico" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>Correo electrónico invalido</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Perfil de Usuario:" label-for="usr_role_id">
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
                  <b-form-group class="col-md-6" label="Color para el usuario" label-for="usr_color">
                    <ValidationProvider name="Color para el usuario" rules="required" v-slot="{ errors }">
                      <b-form-input v-model="user.usr_color" type="color" placeholder="Color" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Tipo de identificación:" label-for="selectypeid">
                    <b-form-select plain v-model="user.usr_identification_type" :options="ids" id="selectypeid">
                      <template v-slot:first>
                        <b-form-select-option :value="null" disabled>Seleccione un tipo de id</b-form-select-option>
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
                  <b-form-group class="col-md-6" label="Genero del usuario" label-for="pro_gender">
                    <ValidationProvider name="Genero del usuario" rules="required" v-slot="{ errors }">
                      <template v-for="(item,index) in state">
                        <b-form-radio inline v-model="user.pro_gender" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled" :class="(errors.length > 0 ? ' is-invalid' : '')">{{ item.label }}</b-form-radio>
                      </template>
                      <div class="invalid-feedback">
                        <span>{{ errors[0] }}</span>
                      </div>
                    </ValidationProvider>
                  </b-form-group>
                  <b-form-group class="col-md-6" label="Teléfono/Celular" label-for="pro_cell_phone">
                    <ValidationProvider name="Teléfono/Celular" rules="required" v-slot="{ errors }">
                      <b-form-input v-model="user.pro_cell_phone" type="number" placeholder="ej: 3019972139" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                        <div class="invalid-feedback">
                          <span>{{ errors[0] }}</span>
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
                <div class="form-group row align-items-center">
                  <label class="col-auto" for="user.usr_is_active">Usuario activo:</label>
                  <div class="col-auto custom-control custom-switch" style="min-height:33px;">
                    <input type="checkbox" class="custom-control-input" id="user.usr_is_active" v-model="user.usr_is_active" :value="user.usr_is_active" >
                    <label class="custom-control-label" for="user.usr_is_active"></label>
                  </div>
                </div>
                <b-button variant="primary" type="submit" :class="estadoBoton">{{ textoBoton }}</b-button>
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
import { xray } from '../../config/pluginInit'
import Vue from 'vue'
import axios from 'axios'

export default {
  name: 'AddUser',
  mounted () {
    xray.index()
  },
  data () {
    return {
      estadoBoton: '',
      textoBoton: 'Agregar Usuario',
      user: {
        usr_name_first: '',
        usr_lastname_first: '',
        usr_name_second: '',
        usr_lastname_second: '',
        usr_identification_type: 1,
        usr_identification: '',
        usr_birthday: '',
        usr_username: '',
        usr_email: '',
        profile_image: require('../../assets/images/user/11.png'),
        city: '',
        usr_role_id: '',
        usr_accept_terms: 1,
        pro_gender: '',
        pro_cell_phone: '',
        usr_is_active: 1,
        usr_color: '',
        usr_password: '',
        newPassword2: ''
      },
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
      roles: [
        { text: 'Administrador', value: 1 },
        { text: 'Abogado', value: 2 }
      ],
      ids: [
        { text: 'CC.', value: 1 },
        { text: 'TI.', value: 2 },
        { text: 'RC.', value: 3 }
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
      this.estadoBoton = 'disabled'
      this.addUser()
    },
    addUser () {
      this.textoBoton = 'Creando usuario...'
      axios.post('/register', this.user).then(res => {
        if (res.data.status_code === 200) {
          Vue.swal('Usuario agregado correctamente')
          this.$router.push({ name: 'doctor.list' })
        } else {
          Vue.swal('Datos no validos')
        }
      })
    }
  }
}
</script>
