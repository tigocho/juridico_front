<template>
  <form-wizard>
    <tab-content title="PRIMERA PARTE" :selected="true">
        <b-container fluid>
            <b-row>
                <b-col md="12">
                    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
                        <b-row>
                            <b-col lg="12">
                                <iq-card>
                                <template v-slot:headerTitle>
                                    <h4 class="card-title">Agregar Proceso Juridico/Solicitud de Servicio</h4>
                                </template>
                                <template v-slot:body>
                                    <div class="new-user-info">
                                    <b-row>
                                        <b-form-group class="col-md-6" label="Fecha de Ingreso" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="Clinica/IPS:" label-for="selectuserrole">
                                            <b-form-select plain v-model="user.usr_role_id" :options="roles" id="selectuserrole">
                                                <template v-slot:first>
                                                <b-form-select-option :value="null">Seleccione un rol</b-form-select-option>
                                                </template>
                                            </b-form-select>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="Año del Siniestro" label-for="exampleInputNumber1">
                                            <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="Año de Notificación" label-for="exampleInputNumber1">
                                            <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="FECHA DE NOTIFICACION PREJUDICIAL" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="FECHA DE LA AUDIENCIA DE CONCILIACIÓN PREJUDICIAL" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="FECHA AVISO DEL  SINIESTRO" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="DESCRIPCIÓN  DEL SINIESTRO" label-for="usr_name_first">
                                        <ValidationProvider name="Primer Nombre" rules="required" v-slot="{ errors }">
                                            <b-form-input v-model="user.usr_name_first" type="text" placeholder="Primer Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                            <div class="invalid-feedback">
                                            <span>{{ errors[0] }}</span>
                                            </div>
                                        </ValidationProvider>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="FECHA DE RECIBIDO DE NOTIFICACION IPS" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="COLABORADOR DE IPS QUE RECIBE NOTIFICACION:" label-for="usr_lastname_first">
                                        <ValidationProvider name="Primer Apelldio" rules="required" v-slot="{ errors }">
                                            <b-form-input v-model="user.usr_lastname_first" type="text" placeholder="Primer Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                            <div class="invalid-feedback">
                                            <span>{{ errors[0] }}</span>
                                            </div>
                                        </ValidationProvider>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="CIUDAD:" label-for="selectuserrole">
                                            <b-form-select plain v-model="user.usr_role_id" :options="city" id="selectuserrole">
                                                <template v-slot:first>
                                                    <b-form-select-option :value="null">Seleccione un rol</b-form-select-option>
                                                </template>
                                            </b-form-select>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="NOMBRE DEL PACIENTE:" label-for="usr_name_first">
                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                            <b-form-input v-model="user.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                            <div class="invalid-feedback">
                                            <span>{{ errors[0] }}</span>
                                            </div>
                                        </ValidationProvider>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="GENERO DEL PACIENTE:" label-for="usr_lastname_first">
                                            <template v-for="(item,index) in state">
                                            <b-form-radio inline v-model="stateActive[item[Object.keys(item)[0]]]" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled">{{ item.label }}</b-form-radio>
                                            </template>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="EDAD DEL PACIENTE" label-for="exampleInputNumber1">
                                            <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                        </b-form-group>
                                    </b-row>
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
    </tab-content>
    <tab-content title="SEGUNDA PARTE">
        <b-container fluid>
            <b-row>
                <b-col md="12">
                    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
                        <b-row>
                            <b-col lg="12">
                                <iq-card>
                                <template v-slot:headerTitle>
                                    <h4 class="card-title">Agregar Proceso Juridico/Solicitud de Servicio</h4>
                                </template>
                                <template v-slot:body>
                                    <div class="new-user-info">
                                    <b-row>
                                        <b-form-group class="col-md-6" label="Fecha de Ingreso" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="Clinica/IPS:" label-for="selectuserrole">
                                            <b-form-select plain v-model="user.usr_role_id" :options="roles" id="selectuserrole">
                                                <template v-slot:first>
                                                <b-form-select-option :value="null">Seleccione un rol</b-form-select-option>
                                                </template>
                                            </b-form-select>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="Año del Siniestro" label-for="exampleInputNumber1">
                                            <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="Año de Notificación" label-for="exampleInputNumber1">
                                            <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="FECHA DE NOTIFICACION PREJUDICIAL" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="FECHA DE LA AUDIENCIA DE CONCILIACIÓN PREJUDICIAL" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="FECHA AVISO DEL  SINIESTRO" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="DESCRIPCIÓN  DEL SINIESTRO" label-for="usr_name_first">
                                        <ValidationProvider name="Primer Nombre" rules="required" v-slot="{ errors }">
                                            <b-form-input v-model="user.usr_name_first" type="text" placeholder="Primer Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                            <div class="invalid-feedback">
                                            <span>{{ errors[0] }}</span>
                                            </div>
                                        </ValidationProvider>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="FECHA DE RECIBIDO DE NOTIFICACION IPS" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="COLABORADOR DE IPS QUE RECIBE NOTIFICACION:" label-for="usr_lastname_first">
                                        <ValidationProvider name="Primer Apelldio" rules="required" v-slot="{ errors }">
                                            <b-form-input v-model="user.usr_lastname_first" type="text" placeholder="Primer Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                            <div class="invalid-feedback">
                                            <span>{{ errors[0] }}</span>
                                            </div>
                                        </ValidationProvider>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="CIUDAD:" label-for="selectuserrole">
                                            <b-form-select plain v-model="user.usr_role_id" :options="city" id="selectuserrole">
                                                <template v-slot:first>
                                                    <b-form-select-option :value="null">Seleccione un rol</b-form-select-option>
                                                </template>
                                            </b-form-select>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="NOMBRE DEL PACIENTE:" label-for="usr_name_first">
                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                            <b-form-input v-model="user.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                            <div class="invalid-feedback">
                                            <span>{{ errors[0] }}</span>
                                            </div>
                                        </ValidationProvider>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="GENERO DEL PACIENTE:" label-for="usr_lastname_first">
                                            <template v-for="(item,index) in state">
                                            <b-form-radio inline v-model="stateActive[item[Object.keys(item)[0]]]" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled">{{ item.label }}</b-form-radio>
                                            </template>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="EDAD DEL PACIENTE" label-for="exampleInputNumber1">
                                            <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                        </b-form-group>
                                    </b-row>
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
    </tab-content>
    <tab-content title="TERCERA PARTE">
        <b-container fluid>
            <b-row>
                <b-col md="12">
                    <ValidationObserver ref="form" v-slot="{ handleSubmit }">
                    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
                        <b-row>
                            <b-col lg="12">
                                <iq-card>
                                <template v-slot:headerTitle>
                                    <h4 class="card-title">Agregar Proceso Juridico/Solicitud de Servicio</h4>
                                </template>
                                <template v-slot:body>
                                    <div class="new-user-info">
                                    <b-row>
                                        <b-form-group class="col-md-6" label="Fecha de Ingreso" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="Clinica/IPS:" label-for="selectuserrole">
                                            <b-form-select plain v-model="user.usr_role_id" :options="roles" id="selectuserrole">
                                                <template v-slot:first>
                                                <b-form-select-option :value="null">Seleccione un rol</b-form-select-option>
                                                </template>
                                            </b-form-select>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="Año del Siniestro" label-for="exampleInputNumber1">
                                            <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="Año de Notificación" label-for="exampleInputNumber1">
                                            <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="FECHA DE NOTIFICACION PREJUDICIAL" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="FECHA DE LA AUDIENCIA DE CONCILIACIÓN PREJUDICIAL" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="FECHA AVISO DEL  SINIESTRO" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="DESCRIPCIÓN  DEL SINIESTRO" label-for="usr_name_first">
                                        <ValidationProvider name="Primer Nombre" rules="required" v-slot="{ errors }">
                                            <b-form-input v-model="user.usr_name_first" type="text" placeholder="Primer Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                            <div class="invalid-feedback">
                                            <span>{{ errors[0] }}</span>
                                            </div>
                                        </ValidationProvider>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="FECHA DE RECIBIDO DE NOTIFICACION IPS" label-for="usr_birthday">
                                            <b-form-input id="exampleInputdate" v-model="user.usr_birthday" type="date" value="2019-12-18"></b-form-input>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="COLABORADOR DE IPS QUE RECIBE NOTIFICACION:" label-for="usr_lastname_first">
                                        <ValidationProvider name="Primer Apelldio" rules="required" v-slot="{ errors }">
                                            <b-form-input v-model="user.usr_lastname_first" type="text" placeholder="Primer Apelldio" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                            <div class="invalid-feedback">
                                            <span>{{ errors[0] }}</span>
                                            </div>
                                        </ValidationProvider>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="CIUDAD:" label-for="selectuserrole">
                                            <b-form-select plain v-model="user.usr_role_id" :options="city" id="selectuserrole">
                                                <template v-slot:first>
                                                    <b-form-select-option :value="null">Seleccione un rol</b-form-select-option>
                                                </template>
                                            </b-form-select>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="NOMBRE DEL PACIENTE:" label-for="usr_name_first">
                                        <ValidationProvider name="Segundo Nombre" rules="required" v-slot="{ errors }">
                                            <b-form-input v-model="user.usr_name_last" type="text" placeholder="Segundo Nombre" :class="(errors.length > 0 ? ' is-invalid' : '')"></b-form-input>
                                            <div class="invalid-feedback">
                                            <span>{{ errors[0] }}</span>
                                            </div>
                                        </ValidationProvider>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="GENERO DEL PACIENTE:" label-for="usr_lastname_first">
                                            <template v-for="(item,index) in state">
                                            <b-form-radio inline v-model="stateActive[item[Object.keys(item)[0]]]" :name="item.name" :key="index" :value="item.value" :disabled="item.disabled">{{ item.label }}</b-form-radio>
                                            </template>
                                        </b-form-group>
                                        <b-form-group class="col-md-6" label="EDAD DEL PACIENTE" label-for="exampleInputNumber1">
                                            <b-form-input id="exampleInputNumber1" type="number" value="2356"></b-form-input>
                                        </b-form-group>
                                    </b-row>
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
    </tab-content>
  </form-wizard>
</template>
<script>
import { xray } from '../../config/pluginInit'
import axios from 'axios'
import { FormWizard, TabContent } from 'vue-step-wizard'
import 'vue-step-wizard/dist/vue-step-wizard.css'
axios.defaults.baseURL = 'http://localhost:8000/api'

export default {
  name: 'AddUser',
  components: {
    FormWizard, TabContent
  },
  mounted () {
    xray.index()
  },
  data () {
    return {
      user: {
        usr_name_first: '',
        usr_lastname_first: '',
        usr_name_last: '',
        usr_lastname_last: '',
        usr_identification_type: 1,
        usr_identification: '',
        usr_birthday: '',
        usr_username: '',
        usr_password: '123456',
        usr_email: '',
        profile_image: require('../../assets/images/user/11.png'),
        city: '',
        usr_role_id: '',
        usr_accept_terms: 1
      },
      roles: [
        { text: 'Administrador', value: 1 },
        { text: 'Abogado', value: 2 }
      ],
      ids: [
        { text: 'CC.', value: 1 },
        { text: 'TI.', value: 2 },
        { text: 'RC.', value: 3 }
      ],
      countries: [
        { value: 'Canada', text: 'Canada' },
        { value: 'Niada', text: 'Niada' },
        { value: 'USA', text: 'USA' },
        { value: 'India', text: 'India' },
        { value: 'Africa', text: 'Africa' }
      ],
      stateActive: {
        Femenio: 'active',
        disable: 'active',
        number: 'two',
        colorDisabled: 'five',
        color: 'danger'
      },
      state: [
        {
          name: 'Masculino',
          label: 'Masculino',
          value: 'inactive',
          disabled: false
        },
        {
          name: 'Femenio',
          label: 'Femenino',
          value: 'active',
          disabled: false
        }
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

        reader.onload = e => {
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
